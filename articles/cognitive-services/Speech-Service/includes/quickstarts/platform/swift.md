---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/10/2022
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Swift. 

> [!TIP]
> For details about using the Objective-C Speech SDK with Swift, see <a href="https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift" target="_blank">Importing Objective-C into Swift</a>.

### System requirements

Before you do anything, see the [platform requirements and instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#platform-requirements).

## Install the Speech SDK

# [Mac](#tab/mac)

The Speech SDK for Swift is available natively as a CocoaPod package for Mac x64 and ARM-based silicons. 

System requirements for Mac:

- A macOS version 10.14 or later

The macOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) </a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/macosbinary" target="_blank">download the binary CocoaPod </a>. Extract the pod in the same directory for its intended use, create a *Podfile*, and list the `pod` as a `target`.

```
platform :osx, 10.14
use_frameworks!

target 'MyApp' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.15.0'
end
```

Alternatively, .NET developers can build native macOS applications by using the Xamarin.Mac application framework. For more information, see <a href="/xamarin/mac/" target="_blank">Xamarin.Mac</a>.


# [iOS](#tab/ios)

The Speech SDK for Swift is available natively as a CocoaPod package.

System requirements for iOS:

- A macOS version 10.3 or later
- Target iOS 9.3 or later

The iOS CocoaPod package is available for download and use with the <a href="https://apps.apple.com/us/app/xcode/id497799835" target="_blank">Xcode 9.4.1 (or later) </a> integrated development environment (IDE). First, <a href="https://aka.ms/csspeech/iosbinary" target="_blank">download the binary CocoaPod</a>. Extract the pod in the same directory for its intended use, create a *Podfile*, and list the `pod` as a `target`.

```
platform :ios, '9.3'
use_frameworks!

target 'AppName' do
  pod 'MicrosoftCognitiveServicesSpeech', '~> 1.10.0'
end
```

Alternatively, .NET developers can build native iOS applications by using the Xamarin.iOS application framework For more information, see <a href="/xamarin/ios/" target="_blank">Xamarin.iOS</a>.


---

