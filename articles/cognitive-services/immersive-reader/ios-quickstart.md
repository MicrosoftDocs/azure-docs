---
title: "Quickstart: Create an iOS app that launches the Immersive Reader (Swift)"
titlesuffix: Azure Cognitive Services
description: In this quickstart, you will build an iOS app from scratch and add the Immersive Reader functionality.
services: cognitive-services
author: MeganRoach

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: quickstart
ms.date: 08/01/2019
ms.author: t-meroa
#Customer intent: As a developer, I want to quickly integrate the Immersive Reader into my iOS application so that I can see the Immersive Reader in action and understand the value it provides.
---

# Quickstart: Create an iOS app that launches the Immersive Reader (Swift)

The [Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension.

In this quickstart, you will build an iOS app from scratch and integrate the Immersive Reader by using the Immersive Reader SDK. A full working sample of this quickstart is available [here](https://github.com/microsoft/immersive-reader-sdk/tree/master/iOS/samples/quickstart-swift).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
* An Immersive Reader resource configured for Azure Active Directory (Azure AD) authentication. Follow [these instructions](./azure-active-directory-authentication.md) to get set up. You will need some of the values created here when configuring the sample project properties. Save the output of your session into a text file for future reference.

## Create an Xcode project

Create a new project in Xcode.

![New Project](./media/ios/xcode-create-project.png)

Choose **Single View App**.

![New Single View App](./media/ios/xcode-single-view-app.png)

## Get the SDK CocoaPod
The easiest way to use the Immersive Reader SDK is via CocoaPods. To install via Cocoapods:
1. [Install Cocoapods](http://guides.cocoapods.org/using/getting-started.html) - Follow the getting started guide to install Cocoapods.
2. Create a Podfile by running `pod init` in your Xcode project's root directory.
3.  Add the CocoaPod to your Podfile by adding `pod 'immersive-reader-sdk', :path => 'https://github.com/microsoft/immersive-reader-sdk/tree/master/iOS/immersive-reader-sdk'`. Your Pofile should look like the following, with your target's name replacing quickstart-swift:
 ```ruby
  platform :ios, '9.0'

  target 'quickstart-swift' do
  use_frameworks!
  # Pods for quickstart-swift
  pod 'immersive-reader-sdk', :path => 'https://github.com/microsoft/immersive-reader-sdk/tree/master/iOS/immersive-reader-sdk'
  end
```
4. In the terminal, in the directory of your Xcode project, run the command `pod install` to install the Immersive Reader SDK pod.
5. Add `import immersive_reader_sdk` to all files that need to reference the SDK.
6. Ensure to open the project by opening the `.xcworkspace` file and not the `.xcodeproj` file.

## Acquire an Azure AD authentication token

You need some values from the Azure AD authentication configuration prerequisite step above for this part. Refer back to the text file you saved of that session.

````text
TenantId     => Azure subscription TenantId
ClientId     => Azure AD ApplicationId
ClientSecret => Azure AD Application Service Principal password
Subdomain    => Immersive Reader resource subdomain (resource 'Name' if the resource was created in the Azure portal, or 'CustomSubDomain' option if the resource was created with Azure CLI Powershell. Check the Azure portal for the subdomain on the Endpoint in the resource Overview page, for example, 'https://[SUBDOMAIN].cognitiveservices.azure.com/')
````

In the main project folder, which contains the ViewController.swift file, create a Swift class file called Constants.swift. Replace the class with the following code, adding in your values where applicable. Keep this file as a local file that only exists on your machine and be sure not to commit this file into source control, as it contains secrets that should not be made public. It is recommended that you do not keep secrets in your app. Instead, we recommend using a backend service to obtain the token, where the secrets can be kept outside of the app and off of the device. The backend API endpoint should be secured behind some form of authentication (for example, [OAuth](https://oauth.net/2/)) to prevent unauthorized users from obtaining tokens to use against your Immersive Reader service and billing; that work is beyond the scope of this quickstart.

[!code-swift[Constants](~/ImmersiveReaderSdk/iOS/samples/quickstart-swift/quickstart-swift/Constants.swift)]

## Set up the app to run without a storyboard

Open AppDelegate.swift and replace the file with the following code.

[!code-swift[AppDelegate](~/ImmersiveReaderSdk/iOS/samples/quickstart-swift/quickstart-swift/AppDelegate.swift)]

## Create the Launch View Controller and add sample content

Rename ViewController.swift to LaunchViewController.swift and replace the file with the following code.

[!code-swift[LaunchViewController](~/ImmersiveReaderSdk/iOS/samples/quickstart-swift/quickstart-swift/LaunchViewController.swift)]

## Build and run the app

Set the archive scheme in Xcode by selecting a simulator or device target.
![Archive scheme](./media/ios/xcode-archive-scheme.png)<br/>
![Select Target](./media/ios/xcode-select-target.png)

In Xcode, press Ctrl + R or click on the play button to run the project and the app should launch on the specified simulator or device.

In your app, you should see:

![Sample app](./media/ios/sample-app-ipad.png)

When you click on the "Immersive Reader" button, you'll see the Immersive Reader launched with the content on app.

![Immersive Reader](./media/ios/immersive-reader-ipad.png)

## Next steps

* Explore the [Immersive Reader iOS SDK](https://github.com/microsoft/immersive-reader-sdk/tree/master/iOS) and the [Immersive Reader iOS SDK Reference](./ios-reference.md)
