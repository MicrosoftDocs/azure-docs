---
title: "Immersive Reader iOS SDK reference"
titlesuffix: Azure Cognitive Services
description: Reference for the Immersive Reader iOS SDK
services: cognitive-services
author: MeganRoach

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 08/01/2019
ms.author: t-meroa
---

# Immersive Reader SDK reference

The Immersive Reader iOS SDK is a Swift CocoaPod that allows you to integrate the Immersive Reader into your iOS application.

## Functions

The SDK exposes a single function, `launchImmersiveReader(navController, token, subdomain, content, options, onSuccess, onFailure)`.

### launchImmersiveReader

Launches the Immersive Reader by launching a View Controller in your iOS Application.

```swift
public func launchImmersiveReader(navController: UINavigationController, token: String, subdomain: String, content: Content, options: Options?, onSuccess: @escaping () -> Void, onFailure: @escaping (_ error: Error) -> Void)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `navController` | UINavigationController | The Navigation Controller for the iOS application the function is being called from. |
| `token` | String | The Azure AD authentication token. See the [Azure AD authentication how-to](./azure-active-directory-authentication.md). |
| `subdomain` | String | The custom subdomain of your Immersive Reader resource in Azure. See the [Azure AD authentication how-to](./azure-active-directory-authentication.md). |
| `content` | [Content](#content) | An object containing the content to be shown in the Immersive Reader. |
| `options` | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |
| `onSuccess` | () -> Void | A closure that is invoked when the Immersive Reader successfully launches. |
| `onFailure` | (_ error: [Error](#error)) -> Void | A closure that is invoked when the Immersive Reader fails to load. This closure returns an [`Error`](#error) object that represents an error code and error message associated with the failure. For more information, see the [error codes](#error-codes). |

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```swift
struct Content: Encodable {
    var title: String
    var chunks: [Chunk]
}
```

#### Supported MIME types

| MIME Type | Description |
| --------- | ----------- |
| text/plain | Plain text. |
| application/mathml+xml | Mathematical Markup Language (MathML). [Learn more](https://developer.mozilla.org/en-US/docs/Web/MathML).

### Options

Contains properties that configure certain behaviors of the Immersive Reader.

```swift
struct Options {
    var uiLang: String?
    var timeout: TimeInterval?
}
```

### Error

Contains information about the error.

```swift
struct Error {
    var code: String
    var message: String
}
```

#### Error codes

| Code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid, see `message` for details. |
| Timeout | The Immersive Reader failed to load within the specified timeout. |
| TokenExpired | The supplied token is expired. |
| Throttled | The call rate limit has been exceeded. |
| InternalError | An internal error occurred inside the Immersive Reader View Controller. See `message` for details.|

## OS version support

The Immersive Reader iOS SDK is supported for iOS 9.0 or higher, on iPad and iPhone.

## Next steps

* Explore the [Immersive Reader iOS SDK on GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/iOS)
* [Quickstart: Create an iOS app that launches the Immersive Reader (Swift)](./ios-quickstart.md)