// ==UserScript==
// @name         GeoCheck result extractor
// @namespace    https://github.com/ChristianGK-GC/geocheck-result-extractor
// @version      1.0.0
// @description  Extract verification results from GeoCheck.org like coordinates, image URL, information and child waypoints
// @copyright    2026, ChristianGK (https://github.com/ChristianGK-GC)
// @author       ChristianGK
// @license      GNU General Public License v3.0
// @icon         https://geocheck.org/favicon.ico
// @homepageURL  https://github.com/ChristianGK-GC/geocheck-result-extractor
// @supportURL   https://github.com/ChristianGK-GC/geocheck-result-extractor/issues
// @updateURL    https://github.com/ChristianGK-GC/geocheck-result-extractor/raw/main/GeoCheck-result-extractor.user.js
// @downloadURL  https://github.com/ChristianGK-GC/geocheck-result-extractor/raw/main/GeoCheck-result-extractor.user.js
// @match        https://geotjek.dk/chkcorrect.php*
// @match        https://geocheck.org/chkcorrect.php*
// @match        https://geocheck.app/chkcorrect.php*
// @match        https://geocheck.xyz/chkcorrect.php*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_VERSION = '1.0.0';
    const STORAGE_KEY = 'geocheck-extractor-version';

    // Check if this is first run or version update
    function checkFirstRun() {
        const lastVersion = localStorage.getItem(STORAGE_KEY);
        
        if (lastVersion !== SCRIPT_VERSION) {
            showChangelog();
            localStorage.setItem(STORAGE_KEY, SCRIPT_VERSION);
        }
    }

    // Show changelog modal
    function showChangelog() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 20000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;

        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                Changelog - Version ${SCRIPT_VERSION}
            </h2>
            
            <h3 style="margin: 20px 0 10px 0; color: #333;">Added</h3>
            <ul style="line-height: 1.8; color: #555; margin: 0 0 15px 0;">
                <li>Initial public release</li>
                <li>Coordinate extraction from GeoCheck verification pages</li>
                <li>Image URL detection and display with clickable link</li>
                <li>Cache description/information extraction with HTML support</li>
                <li>Child waypoints listing with numbered entries</li>
                <li>Collapsible info box with fixed overlay in top-right corner</li>
                <li>One-click clipboard copy functionality</li>
                <li>HTML to plain text conversion for clipboard</li>
                <li>Fallback clipboard support for browsers without GM_setClipboard</li>
            </ul>

            <h3 style="margin: 20px 0 10px 0; color: #333;">Features</h3>
            <ul style="line-height: 1.8; color: #555; margin: 0 0 15px 0;">
                <li>Toggle expand/collapse by clicking header</li>
                <li>Clean text formatting for clipboard copy</li>
                <li>Line breaks preserved in information text</li>
                <li>No data sent to external servers (privacy-focused)</li>
            </ul>

            <h3 style="margin: 20px 0 10px 0; color: #333;">Technical</h3>
            <ul style="line-height: 1.8; color: #555; margin: 0 0 20px 0;">
                <li>Uses GM_setClipboard with navigator.clipboard fallback</li>
                <li>Targets https://geocheck.org/chkcorrect.php*</li>
                <li>GPL v3.0 licensed</li>
            </ul>

            <button id="changelogCloseBtn" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                width: 100%;
                margin-top: 10px;
                font-size: 14px;
            ">Close</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        document.getElementById('changelogCloseBtn').addEventListener('click', () => {
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Run first-run check
    checkFirstRun();

    // Extract coordinates
    const coordElement = document.querySelector('.cachedata');
    let coordinates = null;
    if (coordElement) {
        const coordText = coordElement.textContent.trim();
        if (coordText.match(/N.*E/)) {
            coordinates = coordText;
        } else {
            // Alternative selector
            const coordDivs = document.querySelectorAll('.cachedata');
            for (let div of coordDivs) {
                if (div.textContent.match(/N.*E/)) {
                    coordinates = div.textContent.trim();
                    break;
                }
            }
        }
    }

    // Extract image URL
    const imageElement = document.querySelector('img[src*="/md5pics/"]');
    const imageUrl = imageElement ? imageElement.src : null;

    // Extract description
    const formTable = document.querySelector('form[name="geoform"] table.geo');
    let information = null;
    let informationDisplay = null;
    if (formTable) {
        const rows = formTable.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        const td = lastRow.querySelector('td[colspan="2"]');
        if (td) {
            informationDisplay = td.innerHTML;

            const clone = td.cloneNode(true);
            clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
            clone.querySelectorAll('img').forEach(img => {
                const url = img.src || img.getAttribute('src');
                if (url) {
                    img.replaceWith(' ' + url + ' ');
                } else {
                    img.remove();
                }
            });
            information = clone.textContent.trim();
        }
    }

    // Extract child waypoints
    const childWaypoints = [];
    const allTables = document.querySelectorAll('table.geo');

    allTables.forEach(table => {
        const th = table.querySelector('th');
        if (th && th.textContent.includes('Child waypoints')) {
            const waypointCells = table.querySelectorAll('td.childwp');
            waypointCells.forEach(cell => {
                // Extract text, remove image and trim
                const clone = cell.cloneNode(true);
                const img = clone.querySelector('img');
                if (img) img.remove();
                const text = clone.textContent.trim().replace(/\s+/g, ' ');
                if (text) {
                    childWaypoints.push(text);
                }
            });
        }
    });

    // Info box
    const infoBox = document.createElement('div');
    infoBox.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #fff;
        border: 2px solid #4CAF50;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;

    const contentDiv = document.createElement('div');
    contentDiv.id = 'infoBoxContent';
    contentDiv.innerHTML = `
        ${coordinates ? `
        <div style="margin-bottom: 5px;">
            <strong>Coordinates:</strong><br>
            <span>${coordinates}</span>
        </div>
        ` : ''}
        ${imageUrl ? `
        <div style="margin-bottom: 5px;">
            <strong>Image URL:</strong><br>
            <a href="${imageUrl}" target="_blank" style="color: #2196F3; word-break: break-all; font-size: 12px;">
                ${imageUrl.split('/').pop()}
            </a>
        </div>
        ` : ''}
        ${informationDisplay ? `
        <div style="margin-bottom: 5px;">
            <strong>Information:</strong><br>
            <span style="color: #555;">${informationDisplay}</span>
        </div>
        ` : ''}
        ${childWaypoints.length > 0 ? `
        <div style="margin-bottom: 5px;">
            <strong>Child Waypoints:</strong><br>
            <div>
                ${childWaypoints.map((wp, idx) => `<div style="margin-bottom: 5px; padding: 5px;">${idx + 1}. ${wp}</div>`).join('')}
            </div>
        </div>
        ` : ''}
        <button id="copyAllBtn" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-weight: bold;
        ">Copy All to Clipboard</button>
    `;

    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 5px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" id="infoBoxHeader">
            <span>GeoCheck Extractor</span>
            <span id="toggleIcon" style="font-size: 20px; margin-left: 20px;">−</span>
        </h3>
    `;
    infoBox.appendChild(headerDiv.firstElementChild);
    infoBox.appendChild(contentDiv);
    document.body.appendChild(infoBox);

    let isCollapsed = false;

    // Toggle function for header
    document.getElementById('infoBoxHeader').addEventListener('click', function () {
        const content = document.getElementById('infoBoxContent');
        const icon = document.getElementById('toggleIcon');

        if (isCollapsed) {
            content.style.display = 'block';
            icon.textContent = '−';
            isCollapsed = false;
        } else {
            content.style.display = 'none';
            icon.textContent = '+';
            isCollapsed = true;
        }
    });

    // Copy button
    document.getElementById('copyAllBtn').addEventListener('click', function () {
        const lines = [
            'GeoCheck:',
            coordinates && 'Coordinates: ' + coordinates,
            imageUrl && 'Image URL: ' + imageUrl,
            information && 'Information:\n' + information
        ].filter(Boolean);

        if (childWaypoints.length > 0) {
            lines.push('Child Waypoints:');
            childWaypoints.forEach((wp, idx) => lines.push(`${idx + 1}. ${wp}`));
        }

        const textToCopy = lines.join('\r\n');

        // Fallback for browsers without GM_setClipboard
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(textToCopy, 'text');
        } else {
            navigator.clipboard.writeText(textToCopy).catch(err => {
                // Fallback with textarea for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            });
        }

        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy All to Clipboard';
        }, 2000);
    });

})();
