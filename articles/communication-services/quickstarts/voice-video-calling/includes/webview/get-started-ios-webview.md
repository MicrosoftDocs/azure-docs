---
ms.author: enricohuang
title: Azure Communication Calling Web SDK in iOS WebView environment
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to integrate Azure Communication Calling WebJS SDK in an iOS WKWebView environment
author: sloanster
services: azure-communication-services
ms.date: 01/13/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
---

iOS WKWebView allows you to embed web content seamlessly into your app UI.
If you want to develop an Azure Communication Services calling application on iOS, besides using the Azure Communication Calling iOS SDK, you can also use Azure Communication Calling Web SDK with iOS WKWebView. In this quickstart, you'll learn how to run webapps developed with the Azure Communication Calling Web SDK in an iOS WKWebView environment.

## Prerequisites
[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [XCode](https://developer.apple.com/xcode/), for creating your iOS application.
- A web application using the Azure Communication Calling Web SDK. [Get started with the web calling sample](../../../../samples/web-calling-sample.md).

This quickstart guide assumes that you're familiar with iOS application development. We'll mention the necessary configuration and tips when developing iOS WKWebView application for Azure Communication Services Calling SDK.

## Add keys in Info.plist

To make a video call, make sure you have the following keys added to the Info.plist:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>NSMicrophoneUsageDescription</key>
	<string>Camera access is required to make a video call</string>
	<key>NSCameraUsageDescription</key>
	<string>Microphone access is required to make an audio call</string>
</dict>
</plist>
```

## Handle permission prompt
On iOS Safari, users can see permission prompt more frequent than on other platforms. It is because Safari doesn't keep permissions for a long time unless there's a stream acquired.

WKWebView provides a way to handle browser permission prompt by using [WKUIDelegate.webView](https://developer.apple.com/documentation/webkit/wkuidelegate/3763087-webview). This API is only available on iOS 15.0+.

Here's an example. In this example, the browser permission is granted in `decisionHandler`, so users won't see browser permission prompt after they grant the app permissions.

```swift
import WebKit
import SwiftUI

struct WebView: UIViewRepresentable {
    private(set) var url: URL
    private var webView: WKWebView

    init(url: String) {
        self.url = URL(string: url)!

        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        prefs.preferredContentMode = .recommended

        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences = prefs
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        let webView = WKWebView(frame: CGRect(), configuration: configuration)
        self.webView = webView
    }

    class Coordinator: NSObject, WKUIDelegate {
        let parent: WebView
        init(_ parent: WebView) {
            self.parent = parent
        }
        func webView(_ webView: WKWebView, requestMediaCapturePermissionFor origin: WKSecurityOrigin, initiatedByFrame frame: WKFrameInfo, type: WKMediaCaptureType, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
            decisionHandler(WKPermissionDecision.grant)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        uiView.uiDelegate = context.coordinator
        uiView.load(URLRequest(url: self.url))
    }
}
```


## WebView configuration
Azure Communication Calling Web SDK requires JavaScript enabled.

`allowsInlineMediaPlayback` is also required to be `true`.

```swift
let prefs = WKWebpagePreferences()
prefs.allowsContentJavaScript = true
prefs.preferredContentMode = .recommended

let configuration = WKWebViewConfiguration()
configuration.defaultWebpagePreferences = prefs
configuration.allowsInlineMediaPlayback = true
let webView = WKWebView(frame: CGRect(), configuration: configuration)
```

## Known issues

### Microphone is muted when app goes to background
When a user locks the screen or WkWebView app goes to background, the microphone input will be muted until the app comes back to foreground.
This is iOS WkWebView system behavior, and the microphone isn't muted by Azure Communication Services Calling Web SDK.

### Connection drops soon after the app goes to background
This is also iOS app behavior. When we switch to other audio/video app, the connection will drop around 30 seconds later.
This isn't a problem if the app only stays in background for a short time. When the app comes back to foreground, the call will recover.
If the app stays in background for a longer period, the server will think the user is away and remove the user from the participants list.
In this case, when the user switches the WkWebView app back to foreground, the call will disconnect and won't recover.
