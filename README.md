# GeoCheck Result Extractor

![Userscript](https://img.shields.io/badge/Userscript-JavaScript-yellow) ![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green) ![License](https://img.shields.io/badge/License-GPL%20v3-blue)

Extract verification results from GeoCheck.org - coordinates, images, descriptions & child waypoints with clipboard copy

## Features

- **Coordinate Extraction**: Automatically extracts geocache coordinates
- **Image URL Detection**: Finds and displays the verification image URL
- **Information Display**: Shows the complete cache description/information (with HTML support)
- **Child Waypoints**: Lists all child waypoints if present
- **Collapsible Info Box**: Fixed overlay with toggle functionality
- **One-Click Copy**: Copy all extracted data to clipboard in formatted text
- **Smart Clipboard**: Converts HTML to plain text for easy pasting

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/)
2. Click here to install: [GeoCheck-result-extractor.user.js](https://github.com/ChristianGK-GC/geocheck-result-extractor/raw/main/GeoCheck-result-extractor.user.js)
3. Confirm the installation in Tampermonkey

## Usage

1. Visit a GeoCheck verification page: `https://geocheck.org/chkcorrect.php?...`
2. The info box appears in the top-right corner automatically
3. Review the extracted information:
   - Coordinates (e.g., N 52° 31.234 E 013° 24.567)
   - Verification image URL (clickable)
   - Cache description/information (with images converted to URLs)
   - Child waypoints (if any)
4. Click **Copy All to Clipboard** to copy everything in a clean format
5. Click the **header** to collapse/expand the info box

## Extracted Data Format

When copied to clipboard, the data is formatted as:

```text
GeoCheck:
Coordinates: N 52° 31.234 E 013° 24.567
Image URL: https://geocheck.org/md5pics/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg
Information: [Cache description with image URLs]
Child Waypoints:
1. [Waypoint 1 details]
2. [Waypoint 2 details]
```

## Compatibility

- **Browser Support**: Chrome, Firefox, Edge, Opera
- **Userscript Managers**: Tampermonkey, Violentmonkey, Greasemonkey
- **Target Site**: `https://geocheck.org/chkcorrect.php*`
- **Permissions**: `GM_setClipboard` (with fallback to standard clipboard API)

## License

GNU General Public License v3.0 - See [LICENSE](LICENSE) for details

## Support

Found a bug or have a suggestion? Please [open an issue](https://github.com/ChristianGK-GC/geocheck-result-extractor/issues)

---

**Note**: This userscript is not affiliated with GeoCheck.org or Geocaching.com
