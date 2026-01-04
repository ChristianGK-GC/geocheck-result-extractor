# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-01-04

### Added

- Initial public release
- Coordinate extraction from GeoCheck verification pages
- Image URL detection and display with clickable link
- Cache description/information extraction with HTML support
- Child waypoints listing with numbered entries
- Collapsible info box with fixed overlay in top-right corner
- One-click clipboard copy functionality
- HTML to plain text conversion for clipboard
- Fallback clipboard support for browsers without GM_setClipboard

### Features

- Toggle expand/collapse by clicking header
- Clean text formatting for clipboard copy
- Line breaks preserved in information text
- No data sent to external servers (privacy-focused)

### Technical

- Uses `GM_setClipboard` with navigator.clipboard fallback
- Targets `https://geocheck.org/chkcorrect.php*`
- GPL v3.0 licensed
