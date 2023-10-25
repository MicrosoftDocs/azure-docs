---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/objectivec.md)]

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for Objective-C.

> [!TIP]
> For more information about using the Speech SDK for Swift, see [Importing Objective-C into Swift](https://developer.apple.com/documentation/swift/imported_c_and_objective-c_apis/importing_objective-c_into_swift).

## Install the Speech SDK for Objective-C

# [Mac](#tab/mac)

The Speech SDK for Objective-C is available natively as a CocoaPod package for Mac x64 and ARM-based silicons.

System requirements for Mac:

- A macOS version 10.14 or later

The macOS CocoaPod package is available for download and use with the [Xcode 9.4.1](https://apps.apple.com/us/app/xcode/id497799835) or later integrated development environment (IDE).

1. Go to the Xcode directory where your *.xcodeproj* project file is located.
1. Run `pod init` to create a pod file named *Podfile*.
1. Replace the contents of *Podfile* with the following content. Update the `target` name from `AppName` to the name of your app. Update the platform or pod version as needed.

   ```objc
   platform :osx, 10.14
   use_frameworks!
    
   target 'AppName' do
     pod 'MicrosoftCognitiveServicesSpeech-macOS', '~> 1.32.1'
   end
   ```

1. Run `pod install` to install the Speech SDK.

Alternatively, you can download the [binary CocoaPod](https://aka.ms/csspeech/macosbinary) and extract its contents. In your Xcode project, add a reference to the extracted *MicrosoftCognitiveServicesSpeech.xcframework* folder and its contents.

> [!NOTE]
> .NET developers can build native macOS applications by using the Xamarin.Mac application framework. For more information, see [Xamarin.Mac](/xamarin/mac/).

# [iOS](#tab/ios)

The Speech SDK for Objective-C is available natively as a CocoaPod package.

System requirements for iOS:

- A macOS version 10.14 or later
- Target iOS 9.3 or later

The macOS CocoaPod package is available for download and use with the [Xcode 9.4.1](https://apps.apple.com/us/app/xcode/id497799835) or later integrated development environment (IDE).

1. Go to the Xcode directory where your *.xcodeproj* project file is located.
1. Run `pod init` to create a pod file named *Podfile*.
1. Replace the contents of *Podfile* with the following content. Update the `target` name from `AppName` to the name of your app. Update the platform or pod version as needed.

    ```objc
    platform :ios, '9.3'
    use_frameworks!
    
    target 'AppName' do
      pod 'MicrosoftCognitiveServicesSpeech-iOS', '~> 1.32.1'
    end
    ```

1. Run `pod install` to install the Speech SDK.

Alternatively, you can download the [binary CocoaPod](https://aka.ms/csspeech/iosbinary) and extract its contents. In your Xcode project, add a reference to the extracted *MicrosoftCognitiveServicesSpeech.xcframework* folder and its contents.

> [!NOTE]
> .NET developers can build native iOS applications by using the Xamarin.iOS application framework For more information, see [Xamarin.iOS](/xamarin/ios/).

---
