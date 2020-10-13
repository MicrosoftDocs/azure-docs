---
title: "Immersive Reader SDK Release Notes"
titleSuffix: Azure Cognitive Services
description: Learn more about what's new in the Immersive Reader JavaScript SDK.
services: cognitive-services
author: dylankil
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 10/12/2020
ms.author: dylankil
---

# Immersive Reader JavaScript SDK Release Notes

## Version 1.1.0

This release contains package upgrades, security vulnerability fixes, bug fixes, updates to code samples and configuration options.

* Fix dependabot by removing yarn.lock from gitignore
* Enable saving and loading preferences
* Enable configuring default display options
* Update the Android code sample HTML to work with the latest SDK
* Fix security vulnerability by upgrading pug to v3.0.0 in quickstart-nodejs code sample
* Do not allow launchAsync to be called when already loading
* Fix multiple security vulnerabilities by upgrading Jest and TypeScript packages
* Add option to set the translation language, enable word translation, and enable document translation when launching Immersive Reader
* Add support for configuring Read Aloud via options
* Add support to persist user preferences across different browsers and devices
* Check for invalid content by ignoring messages where the data is not a string
* Wrap call to window in an if clause to check browser support of Promise
* Update launch response to return the number of characters processed
* Add ability to disable first run experience
* Add ImmersiveReaderView for UWP
* Fix a security vulnerability by upgrading Microsoft.IdentityModel.Clients.ActiveDirectory to v5.2.0
* Update code samples to use v1.1.0

## Version 1.0.0

This release contains fixes for various samples and configuration options updates.

* Change Python code sample from advanced to quick start
* Add Android Kotlin quick start code sample
* Add Android Java quick start code sample
* Add Node.js quick start code sample
* Move iOS Swift code sample into js/samples
* Add support to enable or disable cookies
* Add missing files for advanced-csharp-multiple-resources
* Update Node.js advanced README.md
* Remove en-us from hyperlinks
* Fix for Node.js advanced code sample
* Add custom subdomain validation
* Update code samples to use v1.0.0

## Version 0.0.3

This release contains package upgrades, security vulnerability fixes, bug fixes, updates to code samples and configuration options.

* Add iOS Swift code sample
* Add C# advanced code sample demonstrating use of multiple resources
* Add support for custom domains
* Add support to disable the full screen toggle feature
* Add support to hide the Immersive Reader application exit button
* Add a callback function that may be used by the host application upon exiting the Immersive Reader
* Upgrade lodash to version 4.17.14
* Update code samples to use Azure Active Directory Authentication
* Update C# advanced code sample to include Word document
* Update C# MSAL library to fix security vulnerability
* Upgrade mixin-deep to version 1.3.2
* Upgrade jest, webpack and webpack-cli which were using vulnerable versions of set-value and mixin-deep
* Update code samples to use v0.0.3

## Version 0.0.2

This release contains package upgrades, security vulnerability fixes, bug fixes, updates to code samples.

* Rename resourceName to cogSvcsSubdomain
* Move secrets out of code and use environment variables
* Fix Immersive Reader button accessibility bugs
* Fix broken scrolling
* Upgrade handlebars package to version 4.1.2
* Add Python advanced code sample
* Add Java quick start code sample
* Add simple code sample
* Fixes bugs in SDK unit tests
* Fixes JavaScript Internet Explorer 11 compatibility bugs
* Updates SDK urls
* Update code samples to use v0.0.2

## Version 0.0.1

The initial release of the Immersive Reader JavaScript SDK.

* Add Immersive Reader JavaScript SDK
* Add support to specify the UI language
* Add a timeout to determine when the launchAsync function should fail with a timeout error
* Add support to specify the z-index of the Immersive Reader iframe
* Add support to use a webview tag instead of an iframe, for compatibility with Chrome Apps
* Add SDK unit tests
* Add Node.js advanced code sample
* Add C# advanced code sample
* Add C# quick start code sample
* Add package configuration, Yarn and other build files
* Add git configuration files
* Add README.md files to code samples and SDK
* Add MIT License
* Add Contributor instructions
* Add static icon button SVG assets

## Next steps

Get started with Immersive Reader:

* Read the [Immersive Reader client library Reference](./reference.md)
* Explore the [Immersive Reader client library on GitHub](https://github.com/microsoft/immersive-reader-sdk)