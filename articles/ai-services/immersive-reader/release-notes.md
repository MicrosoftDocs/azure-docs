---
title: "Immersive Reader SDK Release Notes"
titleSuffix: Azure AI services
description: Learn more about what's new in the Immersive Reader JavaScript SDK.
#services: cognitive-services
author: rwallerms
manager: guillasi

ms.service: azure-ai-immersive-reader
ms.custom: devx-track-js
ms.topic: release-notes
ms.date: 11/15/2021
ms.author: rwaller
---

# Immersive Reader JavaScript SDK Release Notes

## Version 1.4.0

This release contains new feature, security vulnerability fixes, and updates to code samples.

#### New Features

* Subdomain regex validation updated to allow private links

#### Improvements

* Update code samples to use v1.4.0

## Version 1.3.0

This release contains new features, security vulnerability fixes, and updates to code samples.

#### New Features

* Added the capability for the Immersive Reader iframe to request microphone permissions for Reading Coach

#### Improvements

* Update code samples to use v1.3.0
* Update code samples to demonstrate the usage of latest options from v1.2.0

## Version 1.2.0

This release contains new features, security vulnerability fixes, bug fixes, updates to code samples, and configuration options.

#### New Features

* Add option to set the theme to light or dark
* Add option to set the parent node where the iframe/webview container is placed
* Add option to disable the Grammar experience
* Add option to disable the Translation experience
* Add option to disable Language Detection

#### Improvements

* Add title and aria modal attributes to the iframe
* Set isLoading to false when exiting
* Update code samples to use v1.2.0
* Adds React code sample
* Adds Ember code sample
* Adds Azure function code sample
* Adds C# code sample demonstrating how to call the Azure Function for authentication
* Adds Android Kotlin code sample demonstrating how to call the Azure Function for authentication
* Updates the Swift code sample to be Objective C compliant
* Updates Advanced C# code sample to demonstrate the usage of new options: parent node, disableGrammar, disableTranslation, and disableLanguageDetection

#### Fixes

* Fixes multiple security vulnerabilities by upgrading TypeScript packages
* Fixes bug where renderButton rendered a duplicate icon and label in the button

## Version 1.1.0

This release contains new features, security vulnerability fixes, bug fixes, updates to code samples, and configuration options.

#### New Features

* Enable saving and loading user preferences across different browsers and devices
* Enable configuring default display options
* Add option to set the translation language, enable word translation, and enable document translation when launching Immersive Reader
* Add support for configuring Read Aloud via options
* Add ability to disable first run experience
* Add ImmersiveReaderView for UWP

#### Improvements

* Update the Android code sample HTML to work with the latest SDK
* Update launch response to return the number of characters processed
* Update code samples to use v1.1.0
* Do not allow launchAsync to be called when already loading
* Check for invalid content by ignoring messages where the data is not a string
* Wrap call to window in an if clause to check browser support of Promise

#### Fixes

* Fix dependabot by removing yarn.lock from gitignore
* Fix security vulnerability by upgrading pug to v3.0.0 in quickstart-nodejs code sample
* Fix multiple security vulnerabilities by upgrading Jest and TypeScript packages
* Fix a security vulnerability by upgrading Microsoft.IdentityModel.Clients.ActiveDirectory to v5.2.0

<br>

## Version 1.0.0

This release contains breaking changes, new features, code sample improvements, and bug fixes.

#### Breaking Changes

* Require Azure AD token and subdomain, and deprecates tokens used in previous versions.
* Set CookiePolicy to disabled. Retention of user preferences is disabled by default. The Reader launches with default settings every time, unless the CookiePolicy is set to enabled.

#### New Features

* Add support to enable or disable cookies
* Add Android Kotlin quick start code sample
* Add Android Java quick start code sample
* Add Node quick start code sample

#### Improvements

* Update Node.js advanced README.md
* Change Python code sample from advanced to quick start
* Move iOS Swift code sample into js/samples
* Update code samples to use v1.0.0

#### Fixes

* Fix for Node.js advanced code sample
* Add missing files for advanced-csharp-multiple-resources
* Remove en-us from hyperlinks

<br>

## Version 0.0.3

This release contains new features, improvements to code samples, security vulnerability fixes, and bug fixes.

#### New Features

* Add iOS Swift code sample
* Add C# advanced code sample demonstrating use of multiple resources 
* Add support to disable the full screen toggle feature
* Add support to hide the Immersive Reader application exit button
* Add a callback function that may be used by the host application upon exiting the Immersive Reader
* Update code samples to use Azure Active Directory Authentication

#### Improvements

* Update C# advanced code sample to include Word document
* Update code samples to use v0.0.3

#### Fixes

* Upgrade lodash to version 4.17.14 to fix security vulnerability
* Update C# MSAL library to fix security vulnerability
* Upgrade mixin-deep to version 1.3.2 to fix security vulnerability
* Upgrade jest, webpack and webpack-cli which were using vulnerable versions of set-value and mixin-deep to fix security vulnerability

<br>

## Version 0.0.2

This release contains new features, improvements to code samples, security vulnerability fixes, and bug fixes.

#### New Features

* Add Python advanced code sample
* Add Java quick start code sample
* Add simple code sample

#### Improvements

* Rename resourceName to cogSvcsSubdomain
* Move secrets out of code and use environment variables
* Update code samples to use v0.0.2

#### Fixes

* Fix Immersive Reader button accessibility bugs
* Fix broken scrolling
* Upgrade handlebars package to version 4.1.2 to fix security vulnerability
* Fixes bugs in SDK unit tests
* Fixes JavaScript Internet Explorer 11 compatibility bugs
* Updates SDK urls

<br>

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
