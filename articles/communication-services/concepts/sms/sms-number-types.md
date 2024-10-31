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

## Number Types Supported by ACS

Azure Communication Services provides the following phone number types:

- **Toll-Free Numbers** 
- **10DLC (10 Digit Long Code)** 
- **Short Codes**
- **Alphanumeric Sender IDs**

---

### Toll-Free Numbers

- **Availability**: United States, Puerto Rico, Canada
- **Description**: Toll-free numbers allow customers to contact a business without incurring charges.
- **Format**: 1-800-XXX-XXXX or 1-888-XXX-XXXX.
- **Use Cases**:
  - Customer Support: Encourages customers to reach out without worrying about charges.
   - Notifications and Alerts: Ideal for sending notifications, alerts, and confirmations in NOAM.
- **Regulations**:
  - Toll-free numbers used for messaging require [toll-free verification](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/apply-for-toll-free-verification).
  - Opt-Out Management: Businesses must support opt-out keywords (e.g., STOP, UNSUBSCRIBE) and manage customer requests to stop receiving messages.
- **Purchase eligibility**: Check subscription and location eligibility [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/numbers/sub-eligibility-number-capability).

### 10DLC (10-Digit Long Code)

- **Availability**: United States
- **Description**: 10DLC refers to 10-digit local numbers regulated for business A2P (Application-to-Person) messaging.
- **Format**: XXX-XXX-XXXX.
- **Use Cases**:
   - Local Business Communication: Builds a local presence within the US.
   - Marketing & Promotions: Compliant promotional messaging.
   - Appointment Reminders: Transactional messages, order confirmations, etc.
- **Regulations**:
  - Requires 10DLC campaign registration in the US for compliance.
  - Opt-Out Management: Businesses must handle opt-out requests (e.g., STOP) to comply with US regulations.
- **Purchase eligibility**: Check subscription and location eligibility [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/numbers/sub-eligibility-number-capability).

### Short Codes

- **Availability**: United States, United Kingdom, and Canada
- **Description**: Short codes are 5-6 digit numbers ideal for high-volume messaging.
- **Format**: Short codes are 5-6 digit long. *Example: 12345 or 678910*
- **Use Cases**:
   - High-Volume Campaigns: Product launches, flash sales, and voting campaigns.
   - Two-Factor Authentication (2FA): Secure and quick response times.
   - Customer Engagement: Polling, contests, and interactive campaigns.
- **Regulations**:
  - Requires carrier approval; usage is subject to carrier and industry guidelines.
  - Opt-Out Management: Businesses must provide clear opt-out instructions (e.g., "Reply STOP to unsubscribe").
- **Purchase eligibility**: Check subscription and location eligibility [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/numbers/sub-eligibility-number-capability).


### Alphanumeric Sender IDs
- **Availability**: Austria, Denmark, Estonia, France, Germany, Ireland, Latvia, Lithuania, Netherlands, Poland,
             Portugal, Spain, Sweden, Switzerland, Australia, Czech Republic, Finland, Italy, Norway,
              Slovakia, Slovenia, United Kingdom.
- **Description**: Allows sending SMS messages using a custom name (business or brand name) as the sender.
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
- **Purchase eligibility**: Check subscription and location eligibility [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/numbers/sub-eligibility-number-capability).

## Choosing the right number type for your business

# Geographic Target:
- North America: Use Toll-Free for broad reach.
- United States: Use 10DLC for local customer connections.
- Multiple Countries: Combination of multiple number types based on availability.
- EMEA/APAC: Alphanumeric Sender IDs for brand visibility.

# Message Volume:
- High-volume: Use Short Codes.
- Moderate/Transactional: Use 10DLC or Toll-Free.

# Two-Way Communication:
- Required: Use 10DLC or Toll-Free.
- Not Required: Use Alphanumeric Sender IDs.

# Brand Visibility:
- Important: Use Alphanumeric Sender IDs.

## Next steps

> [!div class="nextstepaction"]
> [Get started with sending sms](../../quickstarts/sms/send.md)

See the following articles for more information:

- [Number lookup overview](../../concepts/numbers/number-lookup-concept.md)
- Check SMS FAQ for questions regarding [SMS](../sms/sms-faq.md)
- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
- Get an SMS capable [phone number](../../quickstarts/telephony/get-phone-number.md)
- Get a [short code](../../quickstarts/sms/apply-for-short-code.md)
- Learn about [Phone number types in Azure Communication Services](../telephony/plan-solution.md)
- Apply for [Toll-free verification](./sms-faq.md#toll-free-verification)
