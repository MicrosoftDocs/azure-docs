---
title: SDKs and REST APIs for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn more about Azure Communication Services client libraries and REST APIs.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
---
# SDKs and REST APIs

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]


Azure Communication Services capabilities are conceptually organized into six areas. Most areas have fully open-sourced client libraries programmed against published REST APIs that you can leverage directly over the Internet. The Calling client library uses proprietary network interfaces and is currently closed-source. Samples and additional technical details for SDKs are published in the [Azure Communication Services GitHub repo](https://github.com/Azure/communication).

## REST APIs
Communication Services APIs are documented alongside other Azure REST APIs in [docs.microsoft.com](/rest/api/azure/). This documentation will tell you how to structure your HTTP messages and offers guidance for using Postman. This documentation is also offered in Swagger format on [GitHub](https://github.com/Azure/azure-rest-api-specs).

## SDKs

| Assembly | Namespaces| Protocols | Capabilities |
|------------------------|-------------------------------------|---------------------------------|--------------------------------------------------------------------------------------------|
| Azure Resource Manager | Azure.ResourceManager.Communication | REST| Provision and manage Communication Services resources|
| Common | Azure.Communication.Common| REST| Provides base types for other client libraries |
| Identity | Azure.Communication.Identity| REST| Manage users, access tokens|
| Phone numbers| Azure.Communication.PhoneNumbers| REST| Managing phone numbers |
| Chat | Azure.Communication.Chat| REST with proprietary signaling | Add real-time text based chat to your applications |
| SMS| Azure.Communication.SMS | REST| Send and receive SMS messages|
| Calling| Azure.Communication.Calling | Proprietary transport | Leverage voice, video, screen-sharing, and other real-time data communication capabilities |

The Azure Resource Manager, Identity, and SMS client libraries are focused on service integration, and in many cases security issues arise if you integrate these functions into end-user applications. The Common and Chat client libraries are suitable for service and client applications. The Calling client library is designed for client applications. A client library focused on service scenarios is in development.

SDKs are typically updated and released every month, with release notes collated in [GitHub](https://github.com/azure/communication).

### Languages and publishing locations

Publishing locations for individual client library packages are detailed below.

| Area           | JavaScript | .NET | Python | Java SE | iOS | Android | Other                          |
| -------------- | ---------- | ---- | ------ | ---- | -------------- | -------------- | ------------------------------ |
| Azure Resource Manager | -         | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Communication)    |   [PyPi](https://pypi.org/project/azure-mgmt-communication/)    |  -  | -              | -  | [Go via GitHub](https://github.com/Azure/azure-sdk-for-go/releases/tag/v46.3.0) |
| Common         | [npm](https://www.npmjs.com/package/@azure/communication-common)         | [NuGet](https://www.nuget.org/packages/Azure.Communication.Common/)    | N/A      | [Maven](https://search.maven.org/search?q=a:azure-communication-common)   | [GitHub](https://github.com/Azure/azure-sdk-for-ios/releases)            | [Maven](https://search.maven.org/artifact/com.azure.android/azure-communication-common)             | -                              |
| Identity | [npm](https://www.npmjs.com/package/@azure/communication-identity)         | [NuGet](https://www.nuget.org/packages/Azure.Communication.Identity)    | [PyPi](https://pypi.org/project/azure-communication-identity/)      | [Maven](https://search.maven.org/search?q=a:azure-communication-identity)   | -              | -              | -                            |
| Phone Numbers | [npm](https://www.npmjs.com/package/@azure/communication-phone-numbers)         | [NuGet](https://www.nuget.org/packages/Azure.Communication.PhoneNumbers)    | [PyPi](https://pypi.org/project/azure-communication-phonenumbers/)      | [Maven](https://search.maven.org/search?q=a:azure-communication-phonenumbers)   | -              | -              | -                            |
| Chat           | [npm](https://www.npmjs.com/package/@azure/communication-chat)        | [NuGet](https://www.nuget.org/packages/Azure.Communication.Chat)     | [PyPi](https://pypi.org/project/azure-communication-chat/)     | [Maven](https://search.maven.org/search?q=a:azure-communication-chat)   | [GitHub](https://github.com/Azure/azure-sdk-for-ios/releases)  | [Maven](https://search.maven.org/search?q=a:azure-communication-chat)   | -                              |
| SMS            | [npm](https://www.npmjs.com/package/@azure/communication-sms)         | [NuGet](https://www.nuget.org/packages/Azure.Communication.Sms)    | [PyPi](https://pypi.org/project/azure-communication-sms/)       | [Maven](https://search.maven.org/artifact/com.azure/azure-communication-sms)   | -              | -              | -                              |
| Calling        | [npm](https://www.npmjs.com/package/@azure/communication-calling)         | -      | -      | -     | [GitHub](https://github.com/Azure/Communication/releases)     | [Maven](https://search.maven.org/artifact/com.azure.android/azure-communication-calling/)            | -                              |
| Reference Documentation     | [docs](https://azure.github.io/azure-sdk-for-js/communication.html)         | [docs](https://azure.github.io/azure-sdk-for-net/communication.html)      | -      | [docs](http://azure.github.io/azure-sdk-for-java/communication.html)     | [docs](/objectivec/communication-services/calling/)      | [docs](/java/api/com.azure.communication.calling)            | -                              |


## SDK platform support details

### iOS and Android 

- Communication Services iOS client libraries target iOS version 13+, and Xcode 11+.
- Android Java client libraries target Android API level 21+ and Android Studio 4.0+

### .NET 

With the exception of Calling, Communication Services packages target .NET Standard 2.0 which supports the platforms listed below.

Support via .NET Framework 4.6.1
- Windows 10, 8.1, 8 and 7
- Windows Server 2012 R2, 2012 and 2008 R2 SP1

Support via .NET Core 2.0:
- Windows 10 (1607+), 7 SP1+, 8.1
- Windows Server 2008 R2 SP1+
- Max OS X 10.12+
- Linux multiple versions/distributions
- UWP 10.0.16299 (RS3) September 2017
- Unity 2018.1
- Mono 5.4
- Xamarin iOS 10.14
- Xamarin Mac 3.8


## API stability expectations

> [!IMPORTANT]
> This section provides guidance on REST APIs and client libraries marked **stable**. APIs marked pre-release, preview, or beta may be changed or deprecated **without notice**.

In the future we may retire versions of the Communication Services client libraries, and we may introduce breaking changes to our REST APIs and released client libraries. Azure Communication Services will *generally* follow two supportability policies for retiring service versions:

- You'll be notified at least three years before being required to change code due to a Communication Services interface change. All documented REST APIs and client library APIs generally enjoy at least three years warning before interfaces are decommissioned.
- You'll be notified at least one year before having to update client library assemblies to the latest minor version. These required updates shouldn't require any code changes because they're in the same major version. This is especially true for the Calling and Chat libraries which have real-time components that frequently require security and performance updates. We highly encourage you to keep your Communication Services client libraries updated.

### API and client library decommissioning examples

**You've integrated the v24 version of the SMS REST API into your application. Azure Communication releases v25.**

You'll get 3 years warning before these APIs stop working and are forced to update to v25. This update might require a code change.

**You've integrated the v2.02 version of the Calling client library into your application. Azure Communication releases v2.05.**

You may be required to update to the v2.05 version of the Calling client library within 12 months of the release of v2.05. This should be a simple replacement of the artifact without requiring a code change because v2.05 is in the v2 major version and has no breaking changes.

## Next steps

For more information, see the following client library overviews:

- [Calling client library Overview](../concepts/voice-video-calling/calling-sdk-features.md)
- [Chat client library Overview](../concepts/chat/sdk-features.md)
- [SMS client library Overview](../concepts/telephony-sms/sdk-features.md)

To get started with Azure Communication Services:

- [Create Azure Communication Resources](../quickstarts/create-communication-resource.md)
- Generate [User Access Tokens](../quickstarts/access-tokens.md)
