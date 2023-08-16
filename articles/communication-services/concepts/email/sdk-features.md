---
title: Email client library overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Email client library.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email client library overview for Azure Communication Services

Azure Communication Services Email client libraries can be used to add transactional Email support to your applications.

## Client libraries
| Assembly               | Protocols             |Open vs. Closed Source| Namespaces                          | Capabilities                                                      |
| ---------------------- | --------------------- | ---|-------------------------- | --------------------------------------------------------------------------- |
| Azure Resource Manager | REST | Open            | Azure.ResourceManager.Communication | Provision and manage Email Communication Services resources             |
| Email                    | REST | Open              | Azure.Communication.Email             | Send and get status on Email messages |

### Azure Email Communication Resource
Azure Resource Manager for Email Communication Services are meant for Email Domain Administration.

| Area           | JavaScript | .NET | Python | Java SE | iOS | Android | Other                          |
| -------------- | ---------- | ---- | ------ | ---- | -------------- | -------------- | ------------------------------ |
| Azure Resource Manager | -         | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Communication)    |   -   |  -  | -              | -  | [Go via GitHub](https://github.com/Azure/azure-sdk-for-go/releases/tag/v46.3.0) |

## Email client library capabilities
The following list presents the set of features that are currently available in the Communication Services Email client libraries.

| Feature | Capability                                                                            | JS  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| Sendmail | Send  Email messages </br> *Attachments are supported*                               | ✔️   | ✔️    | ✔️    | ✔️      |
| Get Status       | Receive Delivery Reports for messages sent                                            | ✔️   | ✔️    | ✔️    | ✔️      |


## API Throttling and Timeouts

Your Azure account has a set of limitation on the number of email messages that you can send. For all the developers email sending is limited to 30 mails per minute, 100 mails in an hour. This sandbox setup is to help developers to start building the application and gradually you can request to increase the sending volume as soon as the application is ready to go live. Submit a support request to increase your sending limit.

## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
- How to send emails with Azure Communication Service using Email client library? [How to send an Email?](../../quickstarts/email/send-email.md)
