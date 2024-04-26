---
title: "Immersive Reader JavaScript SDK release notes"
titleSuffix: Azure AI services
description: Learn about what's new in the Immersive Reader JavaScript SDK.
#services: cognitive-services
author: rwallerms
manager: guillasi

ms.service: azure-ai-immersive-reader
ms.custom: devx-track-js
ms.topic: release-notes
ms.date: 02/07/2024
ms.author: rwaller
---

# Release notes for Immersive Reader JavaScript SDK

## Version 1.4.0

This release contains new features, security vulnerability fixes, and updates to code samples.

#### New features

* Subdomain regex validation updated to allow private links

#### Improvements

* Updated code samples to use v1.4.0

## Version 1.3.0

This release contains new features, security vulnerability fixes, and updates to code samples.

#### New features

* Added the capability for the Immersive Reader iframe to request microphone permissions for Reading Coach

#### Improvements

* Updated code samples to use v1.3.0
* Updated code samples to demonstrate the usage of latest options from v1.2.0

## Version 1.2.0

This release contains new features, security vulnerability fixes, bug fixes, updates to code samples, and configuration options.

#### New features

* Added option to set the theme to light or dark
* Added option to set the parent node where the iframe/webview container is placed
* Added option to disable the Grammar experience
* Added option to disable the Translation experience
* Added option to disable Language Detection

#### Improvements

* Added title and aria modal attributes to the iframe
* Set isLoading to false when exiting
* Updated code samples to use v1.2.0
* Added React code sample
* Added Ember code sample
* Added Azure function code sample
* Added C# code sample demonstrating how to call the Azure Function for authentication
* Added Android Kotlin code sample demonstrating how to call the Azure Function for authentication
* Updated the Swift code sample to be Objective C compliant
* Updated Advanced C# code sample to demonstrate the usage of new options: parent node, disableGrammar, disableTranslation, and disableLanguageDetection

#### Fixes

* Fixed multiple security vulnerabilities by upgrading TypeScript packages
* Fixed bug where renderButton rendered a duplicate icon and label in the button

## Version 1.1.0

This release contains new features, security vulnerability fixes, bug fixes, updates to code samples, and configuration options.

#### New features

* Enabled saving and loading user preferences across different browsers and devices
* Enabled configuring default display options
* Added option to set the translation language, enable word translation, and enable document translation when launching Immersive Reader
* Added support for configuring Read Aloud via options
* Added ability to disable first run experience
* Added ImmersiveReaderView for UWP

#### Improvements

* Updated the Android code sample HTML to work with the latest SDK
* Updated launch response to return the number of characters processed
* Updated code samples to use v1.1.0
* Doesn't allow launchAsync to be called when already loading
* Checked for invalid content by ignoring messages where the data isn't a string
* Wrapped call to window in an if clause to check browser support of Promise

#### Fixes

* Fixed dependabot by removing yarn.lock from gitignore
* Fixed security vulnerability by upgrading pug to v3.0.0 in quickstart-nodejs code sample
* Fixed multiple security vulnerabilities by upgrading Jest and TypeScript packages
* Fixed a security vulnerability by upgrading Microsoft.IdentityModel.Clients.ActiveDirectory to v5.2.0

<br>

## Version 1.0.0

This release contains breaking changes, new features, code sample improvements, and bug fixes.

#### Breaking changes

* Require Azure AD token and subdomain, and deprecates tokens used in previous versions.
* Set CookiePolicy to disabled. Retention of user preferences is disabled by default. The Reader launches with default settings every time, unless the CookiePolicy is set to enabled.

#### New features

* Added support to enable or disable cookies
* Added Android Kotlin quick start code sample
* Added Android Java quick start code sample
* Added Node quick start code sample

#### Improvements

* Updated Node.js advanced README.md
* Changed Python code sample from advanced to quick start
* Moved iOS Swift code sample into js/samples
* Updated code samples to use v1.0.0

#### Fixes

* Fixed for Node.js advanced code sample
* Added missing files for advanced-csharp-multiple-resources
* Removed en-us from hyperlinks

<br>

## Version 0.0.3

This release contains new features, improvements to code samples, security vulnerability fixes, and bug fixes.

#### New features

* Added iOS Swift code sample
* Added C# advanced code sample demonstrating use of multiple resources
* Added support to disable the full screen toggle feature
* Added support to hide the Immersive Reader application exit button
* Added a callback function that may be used by the host application upon exiting the Immersive Reader
* Updated code samples to use Azure Active Directory Authentication

#### Improvements

* Updated C# advanced code sample to include Word document
* Updated code samples to use v0.0.3

#### Fixes

* Upgraded lodash to version 4.17.14 to fix security vulnerability
* Updated C# MSAL library to fix security vulnerability
* Upgraded mixin-deep to version 1.3.2 to fix security vulnerability
* Upgraded jest, webpack and webpack-cli which were using vulnerable versions of set-value and mixin-deep to fix security vulnerability

<br>

## Version 0.0.2

This release contains new features, improvements to code samples, security vulnerability fixes, and bug fixes.

#### New features

* Added Python advanced code sample
* Added Java quick start code sample
* Added simple code sample

#### Improvements

* Renamed resourceName to cogSvcsSubdomain
* Moved secrets out of code and use environment variables
* Updated code samples to use v0.0.2

#### Fixes

* Fixed Immersive Reader button accessibility bugs
* Fixed broken scrolling
* Upgraded handlebars package to version 4.1.2 to fix security vulnerability
* Fixed bugs in SDK unit tests
* Fixed JavaScript Internet Explorer 11 compatibility bugs
* Updated SDK urls

<br>

## Version 0.0.1

The initial release of the Immersive Reader JavaScript SDK.

* Added Immersive Reader JavaScript SDK
* Added support to specify the UI language
* Added a timeout to determine when the launchAsync function should fail with a timeout error
* Added support to specify the z-index of the Immersive Reader iframe
* Added support to use a webview tag instead of an iframe, for compatibility with Chrome Apps
* Added SDK unit tests
* Added Node.js advanced code sample
* Added C# advanced code sample
* Added C# quick start code sample
* Added package configuration, Yarn and other build files
* Added git configuration files
* Added README.md files to code samples and SDK
* Added MIT License
* Added Contributor instructions
* Added static icon button SVG assets

## Related content

* [Immersive Reader client library reference](./reference.md)
* [Immersive Reader client library on GitHub](https://github.com/microsoft/immersive-reader-sdk)
