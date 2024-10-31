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

- **Toll-Free Numbers** (United States, Canada, Puerto Rico)
- **10DLC** (United States)
- **Short Codes** (United States, Canada, United Kingdom)
- **Alphanumeric Sender IDs** (various countries in EMEA and APAC)

---

### Toll-Free Numbers


- Availability: United States and Canada
- Description: Toll-free numbers allow customers to contact a business without incurring charges.
- Use Cases:
  - Customer Support: Encourages customers to reach out without worrying about charges.
   - Notifications and Alerts: Ideal for sending notifications, alerts, and confirmations in NOAM.
- Regulations: Toll-free numbers used for messaging require verification.

### 10DLC (10-Digit Long Code)

- Availability: United States
- Description: 10DLC refers to 10-digit local numbers regulated for business A2P (Application-to-Person) messaging.
- Use Cases:
   - Local Business Communication: Builds a local presence within the US.
   - Marketing & Promotions: Compliant promotional messaging.
   - Appointment Reminders: Transactional messages, order confirmations, etc.
- Regulations: Requires 10DLC campaign registration in the US for compliance.

### Short Codes

- Availability: United States, United Kingdom, and Canada
- Description: Short codes are 5-6 digit numbers ideal for high-volume messaging.
- Use Cases:
   - High-Volume Campaigns: Product launches, flash sales, and voting campaigns.
   - Two-Factor Authentication (2FA): Secure and quick response times.
   - Customer Engagement: Polling, contests, and interactive campaigns.
- Regulations: Requires carrier approval; usage is subject to carrier and industry guidelines.

