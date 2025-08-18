---
title: 10DLC SMS Pricing
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
> [!IMPORTANT]
>
> - For billing locations in the United States and Puerto Rico, **Azure Prepayment (formerly Monetary Commitment)** and **Azure prepaid credits** can't be used to purchase 10DLC-related products. In addition, **spend on these products is not eligible for Microsoft Azure Consumption Commitment (MACC) drawdown**.
>
> - For billing locations outside the US and Puerto Rico, **MACC eligibility depends on subscription configuration**. To check if your subscription qualifies, see [Phone number management for United States](../../concepts/numbers/phone-number-management-for-united-states.md)


## 10 Digit Long Code (10DLC) pricing

This article describes the pricing for 10DLC (10-Digit Long Code) SMS services available through Azure Communication Services. 10DLC is primarily supported in the United States. Availability depends on your subscription billing location and eligibility. For more information about supported countries/regions, see [Phone number management for United States](../../concepts/numbers/phone-number-management-for-united-states.md).

The 10DLC SMS service requires:
- Registering a **brand**
- Registering one or more **campaigns**
- Provisioning a **10DLC phone number**

Pay-as-you-go pricing applies to these services: brand registration, campaign registration, phone number leasing, and message usage.

---

### Registration fees

Registration fees apply to brands and campaigns as part of the 10DLC compliance process in the United States.

| Service Name           | Charge Type     | Campaign Type       | Billing Frequency | Description                                                                 | Price |
|------------------------|------------------|----------------------|-------------------|-----------------------------------------------------------------------------|--------|
| Brand Registration     | Registration     | —                    | One-time          | Fee for registering a brand                                                 | $4     |
| Brand Vetting          | Vetting          | Standard             | One-time          | Standard brand vetting (required in most cases)                             | $40    |
| Brand Vetting          | Vetting          | Enhanced             | One-time          | Enhanced vetting for increased trust scores *(Coming soon)*                 | –      |
| Campaign Registration  | Registration     | Emergency            | Monthly           | Campaigns related to emergency services                                     | $5     |
| Campaign Registration  | Registration     | Low Volume           | Monthly           | Campaigns with limited message volume                                       | $1.50  |
| Campaign Registration  | Registration     | Franchises           | Monthly           | Franchise-related campaign registration                                     | $30    |
| Campaign Registration  | Registration     | Charity              | Monthly           | Nonprofit or charitable campaign registration *(Not linked to nonprofit brands)* | $3     |
| Campaign Registration  | Registration     | Sole Proprietor      | Monthly           | Campaigns registered under Sole Proprietor brand type                       | $2     |

> [!NOTE]
> The Campaign Registry (TCR) and participating carriers set trust scores and vetting requirements.
> - Brand vetting is typically required to achieve higher trust scores and better message throughput.
> - Vetting is generally required for brands not listed in the Russell 3000 index.


---

### Phone number leasing fee

Monthly leasing fees for phone numbers.

| Number Type       | Charge Type | Billing Frequency | Description                                      | Price |
|-------------------|-------------|-------------------|--------------------------------------------------|--------|
| Local (Geographic) | Leasing     | Monthly           | Monthly fee for leasing a 10DLC phone number     | $1     |

---

### Usage fee

SMS offers pay-as-you-go pricing. The price is a per-message segment charge based on the destination of the message.

| Country/Region  | Send Message | Receive Message |
|-----------------|--------------|-----------------|
| United States   | $0.0075      | $0.0075         |

> [!TIP]
> A message segment is typically 160 characters or less. For details, see [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit).

---

### Carrier surcharges

A carrier surcharge applies to messages exchanged using 10DLC numbers. This surcharge is a **per-message segment fee** determined by the mobile carrier of the recipient (outbound) or sender (inbound).

| Carrier                        | Direction            | Fee per Segment |
|-------------------------------|-----------------------|------------------|
| AT&T                          | Outbound              | $0.0020          |
| T-Mobile (incl. Sprint)       | Outbound + Inbound    | $0.0030          |
| Verizon                       | Outbound + Inbound    | $0.0030          |
| US Cellular                   | Outbound              | $0.0050          |
| TextNow                       | Outbound              | $0.0020          |
| Bluegrass                     | Outbound              | $0.0000          |
| C-Spire                       | Outbound              | $0.0000          |
| Commnet                       | Outbound              | $0.0000          |

For more information, see [Carrier fees](../sms/sms-faq.md#carrier-fees) in the SMS FAQ.


