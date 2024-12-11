---
title: 10DLC application guidelines
titleSuffix: An Azure Communication Services concept document
description: Learn about how to fill the 10DLC application form
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

# 10DLC Registration Guidelines

To send Application-to-Person (A2P) SMS messages using 10-digit long codes (10DLC), businesses must complete **Brand Registration** and **Campaign Registration**. This ensures compliance with carrier and CTIA guidelines while enabling high-quality message delivery.

This document will guide you through filling in the required fields for **Brand Registration** and **Campaign Registration**.

[!INCLUDE [Notice](../../includes/public-preview-include.md)]

## Brand Registration

A brand represents your business entity and establishes your credibility with carriers. The information provided must match your official business details. Incorrect details will result in rejections for brand submission. Brand registrations are handled through The Campaign Registry (TCR), which is the centralized registry used by carriers to manage 10DLC (10-Digit Long Code) numbers for A2P messaging. TCR verifies and stores the details about your business and the campaigns you run, allowing carriers to assess and approve your messaging for compliance and delivery.

### Approval time
Brand registration typically takes 1-3 business days with TCR (The Campaign Registry) for processing and approval. However, it may take longer if additional information is required or if there are discrepancies in the details provided.

### Fields in Brand Registration

| Field Name         | Description                                                                             | Example                  |
|--------------------|-----------------------------------------------------------------------------------------|--------------------------|
| **Brand Name**     | Official name of your organization.                                                    | Contoso Inc.            |
| **EIN / Tax ID**   | Employer Identification Number or Tax ID (required for non-Sole Proprietor entities).   | 12-3456789              |
| **Business Type**  | Select the appropriate business type (Sole Proprietor, LLC, Corporation, etc.).         | Corporation             |
| **Website**        | Website URL associated with your business (used for verification).                      | [https://www.contoso.com](https://www.contoso.com) |
| **Vertical**       | Industry in which your business operates.                                               | E-commerce              |
| **Email Address**  | Contact email for registration-related updates.                                         | contact@contoso.com     |

### Tips for Successful Registration
- Ensure the **EIN/Tax ID** matches official IRS records.
- Provide an active website URL that demonstrates your business operations.
- Use the same **Business Name** across all registrations to avoid delays.

## Campaign Registration

Campaign registration allows you to specify the purpose of your messaging (e.g., marketing, customer service, or two-factor authentication) and how you will be using 10DLC numbers. This step ensures that your use case complies with regulations and that carriers can properly route and filter messages based on the campaign type.

Campaign details must accurately reflect the content and intent of your messages. Providing false or misleading information could lead to rejections or delays in the approval of your campaign.

### Approval Time
Campaign registration with TCR typically takes 3-5 business days for approval. However, the timeline may vary depending on the accuracy of the information submitted and the complexity of your use case. Additional documentation or clarification may be required, which could extend the approval time.

### Fields in Campaign Registration


| Field Name               | Description                                                               | Example                                                  |
|--------------------------|---------------------------------------------------------------------------|----------------------------------------------------------|
| **Campaign Name**        | Name identifying your campaign.                                          | Contoso Marketing Campaign                              |
| **Campaign Description** | A detailed description of the campaign’s purpose.                        | Send promotional offers and updates to customers who opt in to Contoso's SMS notifications. |
| **Use Case**             | The primary purpose of the campaign (e.g., marketing, customer care).    | Marketing                                               |
| **Message Samples**      | Provide examples of the messages your campaign will send.                | - “Hello! Thank you for subscribing to Contoso updates. Reply STOP to opt out.” |
| **Subscriber Opt-in**     | Confirms that recipients have explicitly consented to receive messages.  | “Thank you for subscribing to Contoso Alerts. Reply HELP for help, STOP to unsubscribe.” |
| **Subscriber Opt-out**    | Allows recipients to stop receiving messages at any time.                | “You have unsubscribed from Contoso Alerts. Reply START to re-subscribe.” |
| **Subscriber Help**       | Provides instructions or assistance to users.                            | “For assistance, visit [www.contoso.com](https://www.contoso.com) or call 1-800-CONTOSO.” |
| **Embedded Links**        | Indicates if messages include URLs.                                      | Yes                                                      |
| **Embedded Phone Numbers**| Indicates if messages include phone numbers.                             | Yes                                                      |
| **Age-gated Content**     | Indicates if messages are age-restricted.                                | No                                                       |

### FAQ
1. When is brand vetting required?

Brand vetting for 10DLC messaging is typically required for companies outside the Russell 3000 list as these companies are considered as pre-vetted. Smaller businesses, companies without EIN, unverified brands may require brand vetting.

2. What happens when a brand is rejected during the 10DLC registration process?

When a brand is rejected, Microsoft Service Desk will reach out to the customer with guidance on how to proceed. The customer will either need to:
  - Update the Brand Registration: If the rejection was due to incorrect information provided (e.g., mismatched business details), the customer will be asked to update the brand registration with the correct details.

  - Submit Vetting: If the rejection was due to missing or incomplete vetting (e.g., for companies outside the Russell 3000 list or special use cases), the customer will be instructed to submit the necessary vetting documentation.
3. How are registration fees charged?

All fees for registration, including vetting fees, are charged at the time of submission and are non-refundable regardless of approval status.


## Next steps

> [!div class="nextstepaction"]
> [Apply for a 10DLC](../../quickstarts/sms/apply-for-ten-digit-long-code.md)

## Related articles

- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
- Review SMS frequently asked questions [SMS FAQ](../sms/sms-faq.md)
