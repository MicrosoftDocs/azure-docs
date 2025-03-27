---
title: SMS number types concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services SMS number types.
author: prakulka
manager: darmour
services: azure-communication-services

ms.author: prakulka
ms.date: 10/30/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---

# Choosing the Right Phone Number for Your Business Messaging Needs

In today’s communication landscape, businesses use different types of phone numbers to connect with their customers. Azure Communication Services (ACS) supports several types of numbers across various regions, each suited to specific use cases. This document will help you understand the types of numbers ACS offers, where they’re available, and how to select the most appropriate type for your business needs.

---

## Number Types with SMS Capabilities Supported by ACS

Azure Communication Services provides the following phone number types:

- **Toll-Free Numbers** 
- **10DLC (10 Digit Long Code)** 
- **Short Codes**
- **Alphanumeric Sender IDs**

---

### Toll-Free Numbers

- **Availability**: United States, Puerto Rico, Canada
- **Status**: Generally available
- **Description**: Toll-free numbers allow customers to contact a business without incurring charges.
- **Format**: 1-800-XXX-XXXX or 1-888-XXX-XXXX.
- **Use Cases**:
  - Customer Support: Encourages customers to reach out without worrying about charges.
   - Notifications and Alerts: Ideal for sending notifications, alerts, and confirmations in NOAM.
- **Regulations**:
  - Toll-free numbers used for messaging require [toll-free verification](../.././quickstarts/sms/apply-for-toll-free-verification.md).
  - Opt-Out Management: Businesses must support opt-out keywords (e.g., STOP, UNSUBSCRIBE) and manage customer requests to stop receiving messages.
- **Purchase eligibility**: Check subscription and location eligibility [here](../numbers/sub-eligibility-number-capability.md).

### 10DLC (10-Digit Long Code)

- **Availability**: United States
- **Status**: Public Preview
- **Description**: 10DLC refers to 10-digit local numbers regulated for business A2P (Application-to-Person) messaging.
- **Format**: XXX-XXX-XXXX.
- **Use Cases**:
   - Local Business Communication: Builds a local presence within the US.
   - Marketing & Promotions: Compliant promotional messaging.
   - Appointment Reminders: Transactional messages, order confirmations, etc.
- **Regulations**:
  - Requires 10DLC campaign registration in the US for compliance.
  - Opt-Out Management: Businesses must handle opt-out requests (e.g., STOP) to comply with US regulations.
- **Purchase eligibility**: Check subscription and location eligibility [here](../numbers/sub-eligibility-number-capability.md).

### Short Codes

- **Availability**: United States, United Kingdom, and Canada
- **Status**: Generally available
- **Description**: Short codes are 5-6 digit numbers ideal for high-volume messaging.
- **Format**: Short codes are 5-6 digit long. *Example: 12345 or 678910*
- **Use Cases**:
   - High-Volume Campaigns: Product launches, flash sales, and voting campaigns.
   - Two-Factor Authentication (2FA): Secure and quick response times.
   - Customer Engagement: Polling, contests, and interactive campaigns.
- **Regulations**:
  - Requires carrier approval; usage is subject to carrier and industry guidelines.
  - Opt-Out Management: Businesses must provide clear opt-out instructions (e.g., "Reply STOP to unsubscribe").
- **Purchase eligibility**: Check subscription and location eligibility [here](../numbers/sub-eligibility-number-capability.md).


### Alphanumeric Sender IDs
- **Availability**: Austria, Denmark, Estonia, France, Germany, Ireland, Latvia, Lithuania, Netherlands, Poland,
             Portugal, Spain, Sweden, Switzerland, Australia, Czech Republic, Finland, Italy, Norway,
              Slovakia, Slovenia, United Kingdom.
- **Status**: Generally available
 **Description**: Allows sending SMS messages using a custom name (business or brand name) as the sender.
- **Format** - Alphanumeric Sender IDs can contain up to 11 characters (letters and/or numbers). *Example: CONTOSO, CONTOSOAlert*
- **Use Cases**:
   - Brand Recognition: Enhances brand visibility directly in the message sender field.
   - Notifications: Order updates, delivery notifications, and account-related messages.
   - Marketing: Commonly used for branding in EMEA/APAC.
- **Regulations**
  - Some countries require registration for using alphanumeric sender IDs.
  - Opt-Out Management: While Alphanumeric IDs are typically one-way, businesses should still provide opt-out instructions in the message content.
  - France: Alphanumeric IDs are permitted only for transactional messaging, not marketing.
  - Australia: Alphanumeric Sender IDs are permitted, but opt-out instructions should be provided.
- **Limitations**: Does not support receiving responses; subject to local regulations.
- **Purchase eligibility**: Check subscription and location eligibility [here](../numbers/sub-eligibility-number-capability.md).

## Choosing the right number type for your business

| **Factor**                   | **Toll-Free Number**                | **10DLC** (10-Digit Long Code)      | **Short Code**                     | **Alphanumeric Sender ID**                   |
|------------------------------|-------------------------------------|-------------------------------------|------------------------------------|----------------------------------------------|
| **Geographic Target**        | United States, Canada              | United States                       | United States, United Kingdom, Canada | Austria, Denmark, Estonia, France, Germany, Ireland, Latvia, Lithuania, Netherlands, Poland, Portugal, Spain, Sweden, Switzerland, Australia, Czech Republic, Finland, Italy, Norway, Slovakia, Slovenia, United Kingdom |
| **Message Volume**           | Low to moderate                    | Moderate                            | High                               | Moderate (for one-way notifications)        |
| **Two-Way Communication**    | Supported                          | Supported                           | Supported                      | Not Supported (one-way only)                |
| **Brand Visibility**         | Low                                | Moderate (localized presence)       | High                               | High (direct brand recognition)             |
| **Use Case Examples**        | Customer support, notifications    | Local business communications, marketing & promotions | High-volume campaigns, 2FA       | Brand visibility, one-way notifications     |
| **Compliance Requirements**  | SMS verification, opt-out support  | Campaign registration, opt-out support | Carrier approval, opt-in proof    | Varies by country (e.g., France restricts marketing messages) |
| **Format**                   | 1-800-XXX-XXXX                     | XXX-XXX-XXXX                        | 5-6 digits                          | Up to 11 characters (letters/numbers)       |
| **Example**                  | 1-800-555-1234                     | 212-555-6789                        | 12345                               | MYBRAND123                                  |

To send messages across multiple countries, customers must request different numbers based on the number types supported in each destination.

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending SMS](../../quickstarts/sms/send.md)

See the following articles for more information:

- [Number lookup overview](../../concepts/numbers/number-lookup-concept.md)
- Check SMS FAQ for questions regarding [SMS](../sms/sms-faq.md)
- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md)
- Get a [short code](../../quickstarts/sms/apply-for-short-code.md)
- Learn about [Phone number types in Azure Communication Services](../telephony/plan-solution.md)
- Apply for [Toll-free verification](./sms-faq.md#toll-free-verification)
