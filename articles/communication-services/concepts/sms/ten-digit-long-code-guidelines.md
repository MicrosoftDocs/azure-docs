---
title: Ten-Digit Long Code (10DLC) Registration Guidelines
titleSuffix: An Azure Communication Services article
description: This article describes how to prepare for 10-digit long code (10DLC) brand registration and campaign registration.
author: prakulka
manager: darmour
services: azure-communication-services

ms.author: prakulka
ms.date: 11/27/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# 10DLC registration guidelines

To send application-to-person (A2P) SMS messages by using 10-digit long code (10DLC), businesses must complete *brand registration* and *campaign registration*. Registering ensures compliance with carrier and CTIA (formerly called Cellular Telecommunications Industry Association) guidelines while enabling high-quality message delivery.

This article describes how to complete the required fields for brand registration and campaign registration. You need to complete brand registration and receive approval first. Then you can continue with campaign registration.

## Brand registration

A brand represents your business entity and establishes your credibility with carriers. The information that you provide must match your official business details. Incorrect details can result in rejected brand submissions.

The Campaign Registry (TCR) handles brand registrations. TCR is the centralized registry that carriers use to manage 10DLC numbers for A2P messaging. TCR verifies and stores the details about your business and the campaigns that you run, so that carriers can assess and approve your messaging for compliance and delivery.

### Supported brand types

- **Standard**: For most businesses and organizations that have an employer identification number (EIN). Supports multiple campaigns and higher throughput.
- **Sole Proprietor**: For individuals or small businesses that don't have an EIN. Limited to one campaign and low message volume. Requires alternative identity verification, like a mobile phone bill.

### Approval time

Approval for brand registration with TCR typically takes two to three business days. However, it might take longer if more information is required or if there are discrepancies in the details that you provide.

### Fields in brand registration

| Field name | Description | Example |
| --- | --- | --- |
| **Brand Name**     | Official name of your organization | **Contoso Inc.** |
| **EIN/Tax ID**   | Employer identification number or Tax ID (required for non-Sole Proprietor entities) | **12-3456789** |
| **Business Type**  | Type of brand, such as sole proprietor, LLC, or corporation | **Corporation** |
| **Website**        | Website URL associated with your business (used for verification) | `https://www.contoso.com` |
| **Vertical**       | Industry in which your business operates | **E-commerce** |
| **Email Address**  | Contact email for registration-related updates | `contact@contoso.com` |

For complete step-by-step guidance, see [Apply for 10DLC brand registration and campaign registration](../../quickstarts/sms/apply-for-ten-digit-long-code.md).

### Tips for successful registration

- Ensure that the **EIN/Tax ID** value matches official IRS records.
- For the **Website** value, provide an active website URL that demonstrates your business operations.
- Use the same **Brand Name** value across all registrations to avoid delays.

## Campaign registration

Campaign registration enables you to specify the purpose of your messaging (such as marketing, customer service, or two-factor authentication) and how you plan to use 10DLC numbers. This step ensures that your use case complies with regulations so that carriers can properly route and filter messages based on the campaign type.

Campaign details must accurately reflect the content and intent of your messages. Providing false or misleading information could lead to rejections or delays in the approval of your campaign.

### Supported campaign types

Currently, Azure Communication Services supports these campaign types:

- **Standard**: The most common campaign type for general A2P messaging, such as two-factor authentication, alerts, marketing, or customer care.
- **Low Volume**: For limited or test messaging with low daily traffic. Ideal for small businesses or developers.
- **UCaaS (Low Volume)**: A subtype of **Low Volume** for approved unified communications as a service (UCaaS) applications. UCaaS applications use it when each phone number is tied to a human (for example, employee texting).
- **Enhanced**: A higher-throughput campaign type for larger brands or automated communications. Might require vetting.
- **Emergency**: For public safety alerts from government agencies, schools, or utilities. Strictly regulated.
- **Franchise**: For businesses with multiple locations or agents/franchisees that send similar but localized content. Requires disclosure of all subentities.
- **Charity**: For 501(c)(3) nonprofit organizations that send service-related or fundraising messages. Requires proof of tax-exempt status.

Azure Communication Services currently doesn't support the **Political** campaign type.

### Approval time

Approval for campaign registration with TCR typically takes three to five business days. However, the timeline can vary depending on the accuracy of the submitted information and the complexity of your use case. You might need to provide more documentation or clarification, which could extend the approval time.

### Fields in campaign registration

| Field name               | Description                                                       | Example                                                                                  |
|--------------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| **Campaign Name**        | Name that identifies your campaign                                   | **Contoso Marketing Campaign**                                                             |
| **Campaign Description** | Detailed description of the campaign's purpose                 | **Send promotional offers and updates to customers who opt in to Contoso's SMS notifications.** |
| **Use Case**             | Primary purpose of the campaign (such as marketing or customer care) | **Marketing**                                                                         |
| **Message Samples**      | Examples of the messages that your campaign plans to send     | **Hello! Thank you for subscribing to Contoso updates. Reply STOP to opt out.**           |
| **Subscriber Opt-in**    | Confirms that recipients explicitly consent to receive messages  | **Thank you for subscribing to Contoso Alerts. Reply HELP for help, STOP to unsubscribe.** |
| **Subscriber Opt-out**   | Allows recipients to stop receiving messages at any time         | **You have unsubscribed from Contoso Alerts. Reply START to resubscribe.**                |
| **Subscriber Help**      | Provides instructions or assistance to users                     | **For assistance, visit `https://www.contoso.com` or call 1-800-CONTOSO.**                  |
| **Embedded Links**       | Indicates if messages include URLs                               | **Yes**                                                                                    |
| **Embedded Phone Numbers**| Indicates if messages include phone numbers                     | **Yes**                                                                                    |
| **Age-gated Content**    | Indicates if messages are age-restricted                         | **No**                                                                                     |

For complete step-by-step guidance, see [Apply for 10DLC brand registration and campaign registration](../../quickstarts/sms/apply-for-ten-digit-long-code.md).

## FAQ

### When is brand vetting required?

Brand vetting for 10DLC messaging is typically required for companies outside the Russell 3000 list, because these companies are considered prevetted. Smaller businesses, companies without an EIN, or unverified brands might require brand vetting.

### What happens when a brand is rejected during the 10DLC registration process?

When a brand is rejected, Microsoft Service Desk contacts the customer with guidance on how to proceed. The customer needs to either:

- **Update the brand registration**: If the rejection was due to incorrect information provided (such as mismatched business details), the customer needs to update the brand registration with the correct details.

- **Submit vetting**: If the rejection was due to missing or incomplete vetting (such as for companies outside the Russell 3000 list or special use cases), the customer needs to submit the necessary vetting documentation.

### How are registration fees charged?

All fees for registration, including vetting fees, are charged at the time of submission and are nonrefundable regardless of approval status.

## Next step

> [!div class="nextstepaction"]
> [Apply for 10DLC brand registration and campaign registration](../../quickstarts/sms/apply-for-ten-digit-long-code.md)

## Related content

- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md).
- Review [SMS frequently asked questions](../sms/sms-faq.md).
