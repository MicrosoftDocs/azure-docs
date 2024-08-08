---
title: Manage email opt-out capabilities in Azure Communication Services
titleSuffix: An Azure Communication Services concept article
description: Learn about managing opt-outs to enhance email delivery in your business-to-consumer communications.
author: bashan-git
manager: darmour
services: azure-communication-services
ms.author: bashan
ms.date: 04/01/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Manage email opt-out capabilities in Azure Communication Services

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include-document.md)]

> [!IMPORTANT]
> The functionality described in this article is only available in the latest Azure.ResourceManager.Communication SDK [beta versions](https://www.nuget.org/packages/Azure.ResourceManager.Communication/#versions-body-tab).
  
This article provides best practices for email delivery and describes how to use the Azure Communication Services email suppression list. This feature enables customers to manage opt-out capabilities for email communications.

This article also provides information about the features that are important for email opt-out management. Use these features to improve email compliance management, promote better email practices, increase your email delivery success, and boost the likelihood of reaching recipient inboxes.

## Opt-out or unsubscribe management for sender reputation and transparency

It's important to know how interested your customers are in your email communication. It's also important to respect your customers' opt-out or unsubscribe requests when they decide not to get emails from you. This approach helps you keep a good sender reputation.

Whether you have a manual or automated process in place for handling unsubscribe requests, it's important to provide an **Unsubscribe** link in the email payload that you send. When recipients decide not to receive further emails, they can select the **Unsubscribe** link to remove their email address from your mailing list.

The function of the link and instructions in the email is vital. They must be working correctly and promptly notify the application mailing list to remove the contact from the appropriate list or lists.

A proper unsubscribe mechanism is explicit and transparent from the email recipient's perspective. Recipients should know precisely which messages they're unsubscribing from.

Ideally, you should offer a preferences center that gives recipients the option to unsubscribe from multiple lists in your organization. A preferences center prevents accidental unsubscribe actions. It enables users to manage their opt-in and opt-out preferences effectively through the unsubscribe management process.

## Managing email opt-out preferences by using the suppression list

Azure Communication Services offers a centralized, managed unsubscribe list and opt-out preferences saved to a data store. This feature helps developers meet the guidelines of email providers that require a one-click unsubscribe implementation in the emails sent from Azure Communication Services.

To proactively identify and avoid significant delivery problems, suppression list features include:

* Domain-level, customer-managed lists that provide opt-out capabilities.
* Azure resources that allow for create, read, update, and delete (CRUD) operations via the Azure portal, management SDKs, or REST APIs.
* The use of filters in the sending pipeline. All recipients are filtered against the addresses in the domain suppression lists, and email delivery isn't attempted for the recipient addresses.
* The ability to manage a suppression list for each sender email address, which is used to filter or suppress email recipient addresses in sent emails.
* Caching of suppression list data to reduce expensive database lookups. This caching is domain specific and is based on the frequency of use.
* The ability to programmatically add email addresses for an easy opt-out or unsubscribe process.

## Benefits of opt-out or unsubscribe management

Using a suppression list in Azure Communication Services offers several benefits:

* **Compliance and legal considerations**: Use opt-out links to meet legal responsibilities defined in local government legislation like the CAN-SPAM Act in the United States. The suppression list helps ensure that customers can easily manage opt-outs and maintain compliance with these regulations.
* **Better sender reputation**: When emails aren't sent to users who opted out, it helps protect the sender's reputation and lowers the chance of being blocked by email providers.
* **Improved user experience**: A suppression list respects the preferences of users who don't want to receive communications. Collecting and storing email preferences lead to a better user experience and potentially higher engagement rates with recipients who choose to receive emails.
* **Operational efficiency**: Suppression lists can be managed programmatically. You can efficiently handle large numbers of opt-out requests without manual intervention.
* **Cost-effectiveness**: Not sending emails to recipients who opted out reduces the volume of sent emails. The reduced volume can lower operational costs associated with email delivery.
* **Data-driven decisions**: The suppression list feature provides insights into the number of opt-outs. Use this valuable data to make informed decisions about email campaign strategies.

These benefits contribute to a more efficient, compliant, and user-friendly email communication system that uses Azure Communication Services. To enable email logs and monitor your email delivery, follow the steps in [Azure Communication Services email logs](../../concepts/analytics/logs/email-logs.md).

## Next steps

The following topics might be interesting to you:

* Familiarize yourself with the [email client library](../email/sdk-features.md).
* Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
* Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
