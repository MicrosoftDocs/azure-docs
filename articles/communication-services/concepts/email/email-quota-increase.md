---
title: Quota increase for Azure Email Communication Service
titleSuffix: An Azure Communication Services concept document
description: Learn about requesting an increase to the default limit.
author: raviverm
manager: daysha-carter
services: azure-communication-services
ms.author: raviverm
ms.date: 04/09/2024
ms.topic: conceptual
ms.service: azure-communication-services
---
# Quota increase for email domains

If you're using Azure Email Communication Service, you can raise your default email sending limit. To request an increase in your email sending limit, follow the steps outlined in this article.

## 1. Understand domain reputation

Email domain sender reputation is a measure of how trustworthy and legitimate recipients and email service providers perceive your emails. A good sender reputation means that your emails are less likely to be marked as spam or rejected by the email servers. A bad sender reputation means that your emails are more likely to be filtered out or blocked by email servers. The following factors can affect your domain reputation: 

* The volume and frequency of your email campaigns.
* The deliverability and bounce rate of your emails. A high bounce rate can damage your sender reputation and indicate that your email list is outdated or poorly maintained.
* The feedback and complaints from your recipients. A high complaint rate can severely harm your sender reputation.

## 2. Use a custom domain instead of an Azure Managed Domain

Azure Email Communication service lets you try out the email sending feature using a domain that Azure manages. For your production workloads and higher sending limits, you should use your own domain to send emails.  

You can set up your own domain by creating a custom domain resource under an Azure Email Communication Service resource. Azure Managed Domains are intended for testing purposes only. There are limits imposed on the number and frequency of emails you can send using the Azure Managed Domain. If you want to raise your email sending limit, you must configure a custom domain using Azure Email Communication Service.  

For more information, see [Service limits for Azure Communication Services](../../concepts/service-limits.md#email).

## 3. Configure a mail exchange record for your custom domain 

A mail exchange (MX) record specifies the email server responsible for receiving email messages on behalf of a domain name. The MX record is a resource record in the Domain Name System (DNS). Essentially, an MX record signifies that the domain can receive emails.  

Although Azure Communication Service only supports outbound emails, we recommend setting up an MX record to improve the reputation of your sender domain. An email from a custom domain that lacks an MX record might be labeled as spam by the recipient email service provider. This could damage your domain reputation. 

## 4. Build your sender reputation  

Once you complete the previous steps, you can start building your sender reputation by sending legitimate production workload emails. To improve your chances of receiving a rate limit increase, try to minimize email failures and spam rate before requesting for a limit increase.

## 5. Request an email quota increase  

To request an email quota increase, compile the following information:

```
Customer Information 
Company name: 
Company website: 
Please provide a brief description of your business: 

Email Service Information 
Subscription ID: 
Azure Communication Services Resource Name: 
Is your custom domain already set up and currently used for sending messages:  
Indicate the domain from which you are currently sending emails:  

Usage Information
1. What type of emails do you send? (such as Transactional, Marketing, Promotional) 
2. Please specify the expected volume of emails you plan to send:  
	- What is the maximum rate of messages per minute that you require? 
	- What is the maximum rate of messages per hour that you require? 
	- What is the maximum rate of messages per day that you require? 

Additional Information 
What is the source of the email addresses that you use for sending your messages?
Note: The source of the email addresses that you send your messages to plays a crucial role in the 
effectiveness and compliance of your email marketing campaigns. Providing details about the source 
of your email addresses helps us understand how you acquire and maintain your subscriber list.

How do you currently manage and remove email addresses that have unsubscribed or resulted in 
bounce backs from your mailing list?
Please explain if you have an automated process in place that handles unsubscribes when recipients 
click on the 'unsubscribe' link in your emails. Additionally, if you receive bounce/undeliverable 
notifications, can you include how you handle those and whether you have any mechanism to 
automatically remove email addresses that result in consistent bounces.
```

You can copy this text to a file and add the requested information.

Then submit the information in an incident report at [Create a support ticket](https://azure.microsoft.com/support/create-ticket/), requesting to raise your email sending limit.

Email quota increase requests aren't automatically approved. The reviewing team considers your overall sender reputation when determining approval status. Sender reputation includes factors such as your email delivery failure rates, your domain reputation, and reports of spam and abuse. 

## Next steps

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Quickstart: Create and manage Email Communication Service resource in Azure Communication Services](../../quickstarts/email/create-email-communication-resource.md)

* [Quickstart: How to connect a verified email domain with Azure Communication Services resource](../../quickstarts/email/connect-email-communication-resource.md)

## Related articles

- [Email client library](../email/sdk-features.md)
- [Add custom verified domains](../../quickstarts/email/add-custom-verified-domains.md)
- [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
- [Troubleshooting Domain Configuration issues](./email-domain-configuration-troubleshooting.md)
