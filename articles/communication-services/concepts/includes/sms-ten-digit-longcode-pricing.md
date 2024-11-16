---
title: 10DLC SMS Pricing include file
description: include file
services: azure-communication-services
author: prakulka
manager: darmour

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/12/2024 
ms.topic: include
ms.custom: include file
ms.author: prakulka
---
## SMS Pricing for Azure Communication Services

This page provides an overview of the pricing for 10DLC SMS services available through Azure Communication Services (ACS). Pricing is split into different types of services: brand registration, campaign registration, phone number leasing, and message usage.

### 1. **Registration Fees**
The following fees apply to the registration of brands and campaigns.

| Category           | Fee Type               | Fee Subtype                    | Frequency   | Description                          | Fee    |
|--------------------|------------------------|--------------------------------|-------------|--------------------------------------|--------|
| **Brand**          | Registration           | Per Brand                      | One off     | Fee for brand registration           | $4     |
| **Campaign**       | Standard               | Per campaign                   | Monthly     | Standard campaign registration fee   | $10    |


### 2. **Vetting Fees**
Vetting fees are applicable to brand and campaign registration.

| Category           | Fee Type               | Fee Subtype                   | Frequency   | Description                          | Fee    |
|--------------------|------------------------|--------------------------------|-------------|--------------------------------------|--------|
| **Brand**          | Standard               | Per brand                      | One off     | Standard vetting for brand registration | $40   |

### 3. **Phone Number Leasing**
Monthly leasing fees for phone numbers.

| Category           | Fee Type               | Frequency   | Description                            | Fee    |
|--------------------|------------------------|-------------|----------------------------------------|--------|
| **Phone Number**   | Leasing                | Monthly     | Monthly fee for leasing a phone number | $1     |


### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment* charge based on the destination of the message. 10DLC phone numbers can send messages to phone numbers located within the United States.


The following prices are exclusive of the required communications taxes and fees:

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0075 | $0.0075|
  

### 5. **Carrier Surcharges**
Additional carrier charges apply for outbound and inbound messages, depending on the carrier.

| Carrier            | Frequency      | Fee    |
|--------------------|---------------------------------------|--------|
| AT&T (Outbound)    | per message segment                   | $0.0020|
| T-Mobile (incl. Sprint) (Outbound) | per message segment   | $0.0030|
| Verizon (Outbound) | per message segment                   | $0.0030|
| US Cellular (Outbound) | per message segment               |  $0.0050|
| TextNow (Outbound) | per message segment                   |  $0.0020|
| Bluegrass (Outbound)| per message segment                  |  $0     |
| C-Spire (Outbound) | per message segment                   |  $0     |
| Commnet (Outbound) | per message segment                   |  $0     |

*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.
