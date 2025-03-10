---
title: Ten digit long code (10DLC) registration guidelines
titleSuffix: An Azure Communication Services concept document
description: This article describes how to prepare for 10 digit long code (10DLC) brand registration and campaign registration.
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

# Ten digit long code (10DLC) registration guidelines

To send Application-to-Person (A2P) SMS messages using 10 digit long codes (10DLC), businesses must complete **brand registration** and **campaign registration**. This ensures compliance with carrier and CTIA guidelines while enabling high-quality message delivery.

This article describes how to complete the required fields for **brand registration** and **campaign registration**.

[!INCLUDE [Notice](../../includes/public-preview-include.md)]

## Schedule constraints

You need to complete brand registration and receive approval first. Then you can continue with campaign registration.

1. Brand registration may take 2 to 3 business days to receive approval.
2. Campaign registration may take 3 to 5 business days to receive approval.

## Brand registration

A brand represents your business entity and establishes your credibility with carriers. The information provided must match your official business details. Incorrect details can result in rejected brand submissions. Brand registrations are handled through The Campaign Registry (TCR), which is the centralized registry used by carriers to manage 10DLC numbers for A2P messaging. TCR verifies and stores the details about your business and the campaigns you run, allowing carriers to assess and approve your messaging for compliance and delivery.

### Approval time

Brand registration typically takes 2 to 3 business days with TCR (The Campaign Registry) for processing and approval. However, it may take longer if additional information is required or if there are discrepancies in the details provided.

### Fields in brand registration

| Field Name | Description | Example |
| --- | --- | --- |
| **Brand Name**     | Official name of your organization. | Contoso Inc. |
| **EIN / Tax ID**   | Employer Identification Number or Tax ID (required for non-Sole Proprietor entities). | 12-3456789 |
| **Business Type**  | Select the appropriate business type (Sole Proprietor, LLC, Corporation, and so on). | Corporation |
| **Website**        | Website URL associated with your business (used for verification). | https://www.contoso.com |
| **Vertical**       | Industry in which your business operates. | E-commerce |
| **Email Address**  | Contact email for registration-related updates. | contact@contoso.com |

### Tips for successful registration

- Ensure the **EIN/Tax ID** matches official IRS records.
- Provide an active website URL that demonstrates your business operations.
- Use the same **Business Name** across all registrations to avoid delays.

## Campaign registration

Campaign registration enables you to specify the purpose of your messaging (such as marketing, customer service, or two-factor authentication) and how you plan to use 10DLC numbers. This step ensures that your use case complies with regulations and that carriers can properly route and filter messages based on the campaign type.

Campaign details must accurately reflect the content and intent of your messages. Providing false or misleading information could lead to rejections or delays in the approval of your campaign.

### Approval time

Campaign registration with TCR typically takes 3 to 5 business days for approval. However, the timeline may vary depending on the accuracy of the information submitted and the complexity of your use case. You may need to provide more documentation or clarification, which could extend the approval time.

### Fields in campaign registration


| Field Name | Description | Example |
| --- | --- | --- |
| **Campaign Name**        | Name identifying your campaign. | Contoso Marketing Campaign |
| **Campaign Description** | A detailed description of the campaign’s purpose.  | Send promotional offers and updates to customers who opt in to Contoso's SMS notifications. |
| **Use Case**             | The primary purpose of the campaign (such as marketing or customer care). | Marketing |
| **Message Samples**      | Provide examples of the messages your campaign will send. | “Hello! Thank you for subscribing to Contoso updates. Reply STOP to opt out.” |
| **Subscriber Opt-in**     | Confirms that recipients have explicitly consented to receive messages. | “Thank you for subscribing to Contoso Alerts. Reply HELP for help, STOP to unsubscribe.” |
| **Subscriber Opt-out**    | Allows recipients to stop receiving messages at any time. | “You have unsubscribed from Contoso Alerts. Reply START to resubscribe.” |
| **Subscriber Help**       | Provides instructions or assistance to users. | “For assistance, visit [www.contoso.com](https://www.contoso.com) or call 1-800-CONTOSO.” |
| **Embedded Links**        | Indicates if messages include URLs. | Yes |
| **Embedded Phone Numbers**| Indicates if messages include phone numbers. | Yes |
| **Age-gated Content**     | Indicates if messages are age-restricted. | No |

### FAQ

1. When is brand vetting required?

Brand vetting for 10DLC messaging is typically required for companies outside the Russell 3000 list as these companies are considered as pre-vetted. Smaller businesses, companies without EIN, unverified brands may require brand vetting.

2. What happens when a brand is rejected during the 10DLC registration process?

   When a brand is rejected, Microsoft Service Desk contacts the customer with guidance on how to proceed. The customer either needs to:
   - Update the brand registration: If the rejection was due to incorrect information provided (such as mismatched business details), the customer needs to update the brand registration with the correct details.
   
   - Submit Vetting: If the rejection was due to missing or incomplete vetting (such as for companies outside the Russell 3000 list or special use cases), the customer needs to submit the necessary vetting documentation.
   
3. How are registration fees charged?

   All fees for registration, including vetting fees, are charged at the time of submission and are non-refundable regardless of approval status.

## Next steps

> [!div class="nextstepaction"]
> [Apply for a 10DLC](../../quickstarts/sms/apply-for-ten-digit-long-code.md)

## Related articles

- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md).
- Review SMS frequently asked questions [SMS FAQ](../sms/sms-faq.md).
