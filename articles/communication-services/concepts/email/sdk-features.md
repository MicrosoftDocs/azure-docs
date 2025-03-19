---
title: Email client library overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept article
description: Learn about the Azure Communication Services email client libraries.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---
# Email client library overview for Azure Communication Services

You can use email client libraries in Azure Communication Services to add transactional email support to your applications.

## Client libraries

| Assembly               | Protocol             |Open vs. closed source| Namespace                          | Capability                                                      |
| ---------------------- | --------------------- | ---|-------------------------- | --------------------------------------------------------------------------- |
| Azure Resource Manager | REST | Open            | `Azure.ResourceManager.Communication` | Provision and manage email communication resources.             |
| Email                    | REST | Open              | `Azure.Communication.Email`             | Send and get status on email messages. |

### Azure email communication resources

Azure Resource Manager for email communication resources is meant for email domain administration.

| Area           | JavaScript | .NET | Python | Java SE | iOS | Android | Other                          |
| -------------- | ---------- | ---- | ------ | ---- | -------------- | -------------- | ------------------------------ |
| Azure Resource Manager | -         | [NuGet](https://www.nuget.org/packages/Azure.ResourceManager.Communication)    |   -   |  -  | -              | -  | [Go via GitHub](https://github.com/Azure/azure-sdk-for-go/releases/tag/v46.3.0) |

## Capabilities of email client libraries

| Feature | Capability                                                                            | JavaScript  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------- | --- | ---- | ---- | ------ |
| SendMail | Send email messages.</br> *Attachments are supported.*                               | ✔️   | ✔️    | ✔️    | ✔️      |
| Get Status       | Receive delivery reports for sent messages.                                            | ✔️   | ✔️    | ✔️    | ✔️      |

## API throttling and timeouts

The Azure Communication Services email service is designed to support high throughput. The initial rate limits are intended to help customers onboard smoothly and avoid some of the issues that can occur when switching to a new email service.

To learn more about these limits and instructions for requesting an increase, see [Service limits for Azure Communication Services > Email](../../concepts/service-limits.md#email).

## Next steps

* [Create and manage an email communication resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md).
* [Connect a verified email domain in Azure Communication Services](../../quickstarts/email/connect-email-communication-resource.md).

## Related articles:

* Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
* Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
* Learn how to send emails with [Azure Communication Services by using an email client library](../../quickstarts/email/send-email.md).
