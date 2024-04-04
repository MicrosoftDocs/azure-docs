---
title: Emails opt out management using suppression list within Azure Communication Service Email
titleSuffix: An Azure Communication Services concept document
description: Learn about Managing Opt-outs to enhance Email Delivery in your B2C Communications.
author: bashan-git
manager: darmour
services: azure-communication-services
ms.author: bashan
ms.date: 04/01/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include-document.md)]

This article provides the Email delivery best practices and how to use the Azure Communication Services Email suppression list feature that allows customers to manage opt-out capabilities for email communications. It also provides information on the features that are important for emails opt out management that helps you improve email complaint management, promote better email practices, and increase your email delivery success, boosting the likelihood of getting to recipients' inboxes efficiently.

## Opt out or unsubscribe management: Ensuring transparent sender reputation
It's important to know how interested your customers are in your email communication and to respect their opt-out or unsubscribe requests when they decide not to get emails from you. This helps you keep a good sender reputation. Whether you have a manual or automated process in place for handling unsubscribes, it's important to provide an "unsubscribe" link in the email payload you send. When recipients decide not to receive further emails, they can click on the 'unsubscribe' link and remove their email address from your mailing list.

The functionality of the links and instructions in the email is vital; they must be working correctly and promptly notify the application mailing list to remove the contact from the appropriate list or lists. A proper unsubscribe mechanism should be explicit and transparent from the subscriber's perspective, ensuring they know precisely which messages they're unsubscribing from. Ideally, they should be offered a preferences center that gives them the option to unsubscribe in cases where they're subscribed to multiple lists within your organization. This process prevents accidental unsubscribes and allows users to manage their opt-in and opt-out preferences effectively through the unsubscribe management process.

## Managing emails opt out preferences with suppression list in Azure Communication Service Email
Azure Communication Service Email offers a powerful platform with a centralized managed unsubscribe list with opt out preferences saved to our data store. This feature helps the developers to meet guidelines of email providers, requiring one-click list-unsubscribe implementation in the emails sent from our platform. To proactively identify and avoid significant delivery problems, suppression list features, including but not limited to:

* Offers domain-level, customer managed lists that provide opt-out capabilities.
* Provides Azure resources that allow for Create, Read, Update, and Delete (CRUD) operations via Azure portal, Management SDKs, or REST APIs.
* Apply filters in the sending pipeline, all recipients are filtered against the addresses in the domain suppression lists and email delivery isn't attempted for the recipient addresses.
* Gives the ability to manage a suppression list for each sender email address, which is used to filter/suppress email recipient addresses when sending emails.
* Caches suppression list data to reduce expensive database lookups, and this caching is domain-specific based on the frequency of use.
* Adds Email addresses programmatically for an easy opt-out process for unsubscribing.

### Benefits of opt out or unsubscribe management
Using a suppression list in Azure Communication Services offers several benefits:
* Compliance and Legal Considerations: This feature is crucial for adhering to legal responsibilities defined in local government legislation like the CAN-SPAM Act in the United States. It ensures that customers can easily manage opt-outs and maintain compliance with these regulations. 
*	Better Sender Reputation: When emails aren't sent to users who have chosen to opt out, it helps protect the sender’s reputation and lowers the chance of being blocked by email providers.
* Improved User Experience: It respects the preferences of users who don't wish to receive communications, leading to a better user experience and potentially higher engagement rates with recipients who choose to receive emails.
*	Operational Efficiency: Suppression lists can be managed programmatically, allowing for efficient handling of large numbers of opt-out requests without manual intervention.
*	Cost-Effectiveness: By not sending emails to recipients who opted out, it reduces the volume of sent emails, which can lower operational costs associated with email delivery.
*	Data-Driven Decisions: The suppression list feature provides insights into the number of opt-outs, which can be valuable data for making informed decisions about email campaign strategies.

These benefits contribute to a more efficient, compliant, and user-friendly email communication system when using Azure Communication Services. To enable email logs and monitor your email delivery, follow the steps outlined in [Azure Communication Services email logs Communication Service in Azure Communication Service](../../concepts/analytics/logs/email-logs.md).

## Next steps

* [Get started with creating and managing Domain level Suppression List in Email Azure Communication Services](../../quickstarts/email/manage-suppression-list-management-sdks.md)
  
The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
