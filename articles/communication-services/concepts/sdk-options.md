---
title: SDKs and REST APIs for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn more about Azure Communication Services SDKs and REST APIs.
author: sloanster
manager: chpalm
services: azure-communication-services

ms.author: micahvivion
ms.date: 06/04/2024
ms.topic: conceptual
ms.service: azure-communication-services
---
# SDKs and REST APIs

Azure Communication Services capabilities are conceptually organized into discrete areas based on their functional area. Most areas have fully open-source SDKs programmed against published REST APIs that you can use directly over the Internet. The Calling SDK uses proprietary network interfaces and is closed-source.

In the following tables we summarize these areas and availability of REST APIs and SDK libraries. We note whether APIs and SDKs are intended for end-user clients or trusted service environments. You shouldn't directly access APIs such as SMS using end-user devices in low trust environments.

You can accelerate development of Calling and Chat applications using the [Azure Communication Services UI library](./ui-library/ui-library-overview.md). The customizable UI library provides open-source UI components for Web and mobile apps, and a Microsoft Teams theme.

## Creating a practice to use the latest SDK

Browsers and operating systems are constantly evolving to support the latest enhancements and to fix existing bugs. Using the most recent Azure Communication Services SDK can help you achieve the best overall end user experience for your application when used with updated browsers and operating system updates. The most update Azure Communication Services SDK offers many benefits, such as better performance, security, compatibility, quality, and usability. Updating allows you to access the newest features and updates that are regularly added to the browser and operating system. Azure Communication Services SDKs are updated frequently (approximately every six weeks to once a quarter). We recommend creating a process to ensure that you're always updating to the most recent SDKs.

## SDKs

| Assembly | Protocols| Environment | Capabilities|
|--------|----------|---------|----------------------------------|
| Azure Resource Manager | [REST](/rest/api/communication/resourcemanager/communication-services) | Service | Provision and manage Communication Services resources. |
| Common | N/A | Client & Service | Provides base types for other SDKs. |
| Identity | [REST](/rest/api/communication/identity/communication-identity) | Service | Manage users and access tokens. |
| Phone numbers | [REST](/rest/api/communication/phonenumbers/phone-numbers) | Service | Acquire and manage phone numbers. |
| SMS | [REST](/rest/api/communication/sms/sms) | Service | Send and receive SMS messages. |
| Email | [REST](/rest/api/communication/email/email) | Service | Send and get status on Email messages. |
| Chat | [REST](/rest/api/communication/chat/operation-groups) with proprietary signaling | Client & Service | Add real-time text chat to your applications. |
| Calling | Proprietary transport | Client | Voice, video, screen-sharing, and other real-time communication. |
| Call Automation | [REST](/rest/api/communication/callautomation/operation-groups) | Service | Build customized calling workflows for PSTN and VoIP calls. |
| Job Router | [REST](/rest/api/communication/jobrouter/operation-groups) | Service | Optimize the management of customer interactions across various applications. |
| Rooms | [REST](/rest/api/communication/rooms/operation-groups)| Service | Create and manage structured communication rooms. |
| UI Library | N/A | Client | Production-ready UI components for chat and calling apps. |
| Advanced Messaging | [REST](/rest/api/communication/advancedmessaging/operation-groups) | Service | Send and receive WhatsApp Business messages. |

### Languages and publishing locations

Publishing locations for individual SDK packages:

| Area | JavaScript | .NET | Python | Java SE | iOS | Android | Other|
| -------------- | ---------- | ---- | ------ | ---- | -------------- | -------------- | ------------------------------ |
| Azure Resource Manager | [npm](https://www.npmjs.com/package/@azure/arm-communication) | [NuGet](https://www.NuGet.org/packages/Azure.ResourceManager.Communication)| [PyPi](https://pypi.org/project/azure-mgmt-communication/)| [Maven](https://search.maven.org/search?q=azure-resourcemanager-communication)| -| -| [Go via GitHub](https://github.com/Azure/azure-sdk-for-go/releases/tag/v46.3.0) |
| Common | [npm](https://www.npmjs.com/package/@azure/communication-common) | [NuGet](https://www.NuGet.org/packages/Azure.Communication.Common/)| N/A| [Maven](https://search.maven.org/search?q=a:azure-communication-common) | [GitHub](https://github.com/Azure/azure-sdk-for-ios/releases)| [Maven](https://search.maven.org/artifact/com.azure.android/azure-communication-common) | -|
| Identity | [npm](https://www.npmjs.com/package/@azure/communication-identity) | [NuGet](https://www.NuGet.org/packages/Azure.Communication.Identity)| [PyPi](https://pypi.org/project/azure-communication-identity/)| [Maven](https://search.maven.org/search?q=a:azure-communication-identity) | -| -| -|
| Phone Numbers | [npm](https://www.npmjs.com/package/@azure/communication-phone-numbers) | [NuGet](https://www.NuGet.org/packages/Azure.Communication.PhoneNumbers)| [PyPi](https://pypi.org/project/azure-communication-phonenumbers/)| [Maven](https://search.maven.org/search?q=a:azure-communication-phonenumbers) | -| -| -|
| Chat | [npm](https://www.npmjs.com/package/@azure/communication-chat)| [NuGet](https://www.NuGet.org/packages/Azure.Communication.Chat) | [PyPi](https://pypi.org/project/azure-communication-chat/) | [Maven](https://search.maven.org/search?q=a:azure-communication-chat) | [GitHub](https://github.com/Azure/azure-sdk-for-ios/releases)| [Maven](https://search.maven.org/search?q=a:azure-communication-chat) | -|
| SMS | [npm](https://www.npmjs.com/package/@azure/communication-sms) | [NuGet](https://www.NuGet.org/packages/Azure.Communication.Sms)| [PyPi](https://pypi.org/project/azure-communication-sms/) | [Maven](https://search.maven.org/artifact/com.azure/azure-communication-sms) | -| -| -|
| Email | [npm](https://www.npmjs.com/package/@azure/communication-email) | [NuGet](https://www.NuGet.org/packages/Azure.Communication.Email)| [PyPi](https://pypi.org/project/azure-communication-email/) | [Maven](https://search.maven.org/artifact/com.azure/azure-communication-email) | -| -| -|
| Calling | [npm](https://www.npmjs.com/package/@azure/communication-calling) | [NuGet](https://github.com/Azure/Communication/blob/master/releasenotes/acs-calling-windowsclient-sdk-release-notes.md) | -| - | [CocoaPods](https://github.com/Azure/Communication/releases) | [Maven](https://github.com/Azure/Communication/blob/master/releasenotes/acs-calling-android-sdk-release-notes.md)| -|
| Call Automation |[npm](https://www.npmjs.com/package/@azure/communication-call-automation)|[NuGet](https://www.NuGet.org/packages/Azure.Communication.CallAutomation/)|[PyPi](https://pypi.org/project/azure-communication-callautomation/)|[Maven](https://search.maven.org/artifact/com.azure/azure-communication-callautomation)
| Job Router |[npm](https://www.npmjs.com/package/@azure-rest/communication-job-router)|[NuGet](https://www.NuGet.org/packages/Azure.Communication.JobRouter/)|[PyPi](https://pypi.org/project/azure-communication-jobrouter/)|[Maven](https://search.maven.org/artifact/com.azure/azure-communication-jobrouter)
| Rooms          | [npm](https://www.npmjs.com/package/@azure/communication-rooms)     | [NuGet](https://www.nuget.org/packages/Azure.Communication.Rooms)     | [PyPi](https://pypi.org/project/azure-communication-rooms/)    | [Maven](https://search.maven.org/search?q=a:azure-communication-rooms) | - | - | - |
| UI Library | [npm](https://www.npmjs.com/package/@azure/communication-react) | - | - | - | [GitHub](https://github.com/Azure/communication-ui-library-ios) | [GitHub](https://github.com/Azure/communication-ui-library-android) | [GitHub](https://github.com/Azure/communication-ui-library), [Storybook](https://azure.github.io/communication-ui-library/?path=/docs/overview--docs) |
| Advanced Messaging | [npm](https://www.npmjs.com/package/@azure-rest/communication-messages) | [NuGet](https://www.nuget.org/packages/Azure.Communication.Messages) | [PyPi](https://pypi.org/project/azure-communication-messages/) | [Maven](https://central.sonatype.com/artifact/com.azure/azure-communication-messages) | - | - | - |
| Reference Documentation | [docs](/javascript/api/overview/azure/communication) | [docs](/dotnet/api/overview/azure/communication)| [docs](/python/api/overview/azure/communication) | [docs](/java/api/overview/azure/communication) | [docs](/objectivec/communication-services/calling/)| [docs](/java/api/com.azure.android.communication.calling)| - |

### SDK platform support details

#### Android Calling SDK support

- Support for Android API Level 21 or Higher
- Support for Java 7 or higher
- Support for Android Studio 2.0

##### Android platform support

The Android ecosystem is extensive, encompassing various versions and specialized platforms designed for diverse types of devices. The next table lists the Android platforms currently supported:

| Devices | Description | Support |
| --- | --- | --- |
| Phones and tablets | Standard devices running [Android Commercial](https://developer.android.com/get-started). | Fully support with [the video resolution](./voice-video-calling/calling-sdk-features.md#supported-video-resolutions). |

> [!NOTE]
> We **only support video calls on phones and tablets**. For use cases involving video on nonstandard devices or platforms (such as smart glasses or custom devices), we suggest [contacting us](https://github.com/Azure/communication) early in your development process to help determine the most suitable integration approach.

If you found issues during your implementation, see [the troubleshooting guide](./troubleshooting-info.md#access-support-files-in-the-calling-sdk).

#### iOS Calling SDK support

- Support for iOS 10.0+ at build time, and iOS 12.0+ at run time
- Xcode 12.0+
- Support for **iPadOS** 13.0+

#### .NET

Calling supports the following platforms:

- UWP with .NET Native or C++/WinRT
  - Windows 10/11 10.0.17763 - 10.0.22621.0
  - Windows Server 2019/2022 10.0.17763 - 10.0.22621.0
- WinUI3 with .NET 6
  - Windows 10/11 10.0.17763.0 - net6.0-windows10.0.22621.0
  - Windows Server 2019/2022 10.0.17763.0 - net6.0-windows10.0.22621.0
  
All other Communication Services packages target .NET Standard 2.0, which supports the following platforms:

- Support via .NET Framework 4.6.1
  - Windows 10, 8.1, 8 and 7
  - Windows Server 2012 R2, 2012 and 2008 R2 SP1
- Support via .NET Core 2.0:
  - Windows 10 (1607+), 7 SP1+, 8.1
  - Windows Server 2008 R2 SP1+
  - Max OS X 10.12+
  - Linux multiple versions/distributions
  - UWP 10.0.16299 (RS3) September 2017
  - Unity 2018.1
  - Mono 5.4
  - Xamarin iOS 10.14
  - Xamarin Mac 3.8

#### SDK package size

| SDK                   |      Compressed size (MB)     |    Uncompressed size (MB)     |
|-----------------------| ------------------------------|-------------------------------|
|iOS SDK                |  Arm64 - 17.1 MB              | Arm64 - 61.1 MB               |
|Android SDK            |  x86 – 13.3 MB                | x86 – 33.75 MB                |
|                       |  x86_64 – 13.3 MB             | x86_64 – 35.75 MB             |
|                       |  Arm64-v8a – 13.1 MB          | Arm64-v8a – 37.02 MB          |
|                       |  armeabi-v7a – 11.4 MB        | armeabi-v7a – 23.97 MB        |

If you want to improve your app, see [the Best Practices article](./best-practices.md). It provides recommendations and a checklist to review before releasing your app.

## REST APIs

Communication Services APIs are documented with other [Azure REST APIs](/rest/api/azure/). This documentation describes how to structure your HTTP messages and offers guidance for using [Postman](../tutorials/postman-tutorial.md). REST interface documentation is also published in OpenAPI format on [GitHub](https://github.com/Azure/azure-rest-api-specs). You can find throttling limits for individual APIs in [service limits](./service-limits.md).

## API stability expectations

> [!IMPORTANT]
> This section provides guidance on REST APIs and SDKs marked **stable**. APIs marked prerelease, preview, or beta may be changed or deprecated **without notice**.

In the future we may retire versions of the Communication Services SDKs, and we may introduce breaking changes to our REST APIs and released SDKs. Azure Communication Services *generally* follows two supportability policies for retiring service versions:

- You're notified at least three years before being required to change code due to a Communication Services interface change. All documented REST APIs and SDK APIs generally enjoy at least three years warning before interfaces are decommissioned.
- You're notified at least one year before having to update SDK assemblies to the latest minor version. These required updates shouldn't require any code changes because they're in the same major version. Using the latest SDK is especially important for the Calling and Chat libraries that real-time components that often require security and performance updates. We strongly encourage you to keep all your Communication Services SDKs updated.

### API and SDK decommissioning examples

**You've integrated the v24 version of the SMS REST API into your application. Azure Communication releases v25.**

You get three years warning before these APIs stop working and are forced to update to v25. This update might require a code change.

**You've integrated the v2.02 version of the Calling SDK into your application. Azure Communication releases v2.05.**

You may be required to update to the v2.05 version of the Calling SDK within 12 months of the release of v2.05. The update should be a replacement of the artifact without requiring a code change because v2.05 is in the v2 major version and has no breaking changes.

## Next steps

For more information, see the following SDK overviews:

- [Calling SDK Overview](../concepts/voice-video-calling/calling-sdk-features.md)
- [Call Automation SDK Overview](../concepts/call-automation/call-automation.md)
- [Job Router SDK Overview](../concepts/router/concepts.md)
- [Chat SDK Overview](../concepts/chat/sdk-features.md)
- [SMS SDK Overview](../concepts/sms/sdk-features.md)
- [Email SDK Overview](../concepts/email/sdk-features.md)
- [Advanced Messaging SDK Overview](../concepts/advanced-messaging/whatsapp/whatsapp-overview.md)

To get started with Azure Communication Services:

- [Create an Azure Communication Services resource](../quickstarts/create-communication-resource.md)
- Generate [User Access Tokens](../quickstarts/identity/access-tokens.md)
