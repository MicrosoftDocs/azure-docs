---
title: Email client library overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Email client library.
author: bashan
manager: shanhen
services: azure-communication-services

ms.author: bashan
ms.date: 02/15/2022
ms.topic: overview
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).
# Email client library overview


Azure Communication Services Email client libraries can be used to add transactional Email Support to your applications.


## Client libraries

| Assembly               | Protocols             |Open vs. Closed Source| Namespaces                          | Capabilities                                                      |
| ---------------------- | --------------------- | ---|-------------------------- | --------------------------------------------------------------------------- |
| Azure Resource Manager | REST | Open            | Azure.ResourceManager.Communication | Provision and manage Email Communication Services resources             |
| Email                    | REST | Open              | Azure.Communication.Email             | Send and get status on Email messages |



### Azure Email Communication Resource

Azure Resource Manager for Email Communication Services are meant for Email Domain Administration, and Email client libraries are focused on service integrations for application to send an email.

| Area           | JavaScript | .NET | Python | Java SE | iOS | Android | Other                          |
| -------------- | ---------- | ---- | ------ | ---- | -------------- | -------------- | ------------------------------ |
| Azure Resource Manager | -         | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Communication)    |   -   |  -  | -              | -  | [Go via GitHub](https://github.com/Azure/azure-sdk-for-go/releases/tag/v46.3.0) |




## Email client library capabilities

The following list presents the set of features which are currently available in the Communication Services Email client libraries.


The following list presents the set of features which are currently available in our client libraries.

| Feature | Capability                                                                            | JS  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| Sendmail | Send  Email messages </br> *Attachments are supported*                               | ✔️   | ❌    | ✔️    | ❌      |
| Get Status       | Receive Delivery Reports for messages sent                                            | ✔️   | ❌    | ✔️    | ❌      |


## API Thorottling and Timeouts

The following timeouts apply to the Communication Services Email client libraries:

| Action           | Timeout in seconds |
| -------------- | ---------- |


## Next steps


> [Get started with Creating Email Communication Resource](../../quickstarts/Email/create-email-communication-resource.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)
