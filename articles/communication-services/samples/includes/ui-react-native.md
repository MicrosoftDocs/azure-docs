---
title: include file
description: include file
services: azure-communication-services
author: jorgegarc
manager: anujbh
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/15/2022
ms.topic: include
ms.custom: include file
ms.author: jorgegarc
---

## Azure Communication UI Mobile Library for React Native

This project demonstrates the integration of Azure Communication UI library into a React Native utilizes the native Azure Communication UI library and Azure Communication Services to build a calling experience that features both voice and video calling.

### Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-react-native).

### Features

Refer to the native [UI Library overview](../../concepts/ui-library/ui-library-overview.md)

### Prerequisites

- Visual Studio [Setup Instructions](/xamarin/get-started/installation/?pivots=macos)
- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- iOS [Requirements](https://github.com/Azure/communication-ui-library-ios#requirements)
- Android [Requirements](https://github.com/Azure/communication-ui-library-android#prerequisites)
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running the [Authentication Endpoint](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.
- Node, Watchman, and React Native CLI: please refer to [React Native environment setup guide](https://reactnative.dev/docs/environment-setup).
- Yarn: refer to [installation guide](https://classic.yarnpkg.com/lang/en/docs/install)

### Run sample app

Navigate to `AzureCommunicationUIDemoApp/`:

1. Run `yarn install`

#### For iOS

Install iOS app dependencies:

1. In Terminal, navigate to `AzureCommunicationUIDemoApp/ios/`:
2. Run `pod install --repo-update`

#### For Android

Build android app dependencies:

1. In Terminal, navigate to `AzureCommunicationUIDemoApp/android/`:
2. Run `./gradlew build`

#### Execute

Navigate back to `AzureCommunicationUIDemoApp/`

1. Run `yarn react-native start`
2. Open another Terminal, navigate to `AzureCommunicationUIDemoApp/` folder, and run `yarn react-native run-ios` or `yarn react-native run-android`

Alternatively, you can also run the iOS app by launching Xcode from the `.xcworkspace` file, and run the app with scheme `AzureCommunicationUIDemoApp` on your simulator or iOS device.

To run Android app, you can also launch Android Studio and run on Android emulator or Android device after syncing up gradle. There are two ways to sync gradle either with a command in the android folder `./gradlew build` or via Android Studio.

### Highlights and feedback

Visit the [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-react-native#key-sample-highlights) to learn more and discover more capabilities and share your valuable feedback.