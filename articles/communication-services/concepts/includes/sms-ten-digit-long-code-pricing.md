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
> [!IMPORTANT]
>- For billing locations in the US and Puerto Rico – Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits are not eligible for purchasing the products. Additionally, customer spend on the products is not eligible for Microsoft Azure Consumption Commitment drawdown.
>
>
>- For billing locations outside the US and Puerto Rico Azure Prepayment (previously called Monetary Commitment) funds and Azure prepaid credits are not eligible for purchasing the products.
## 10 Digit Long Code (10DLC) Pricing

This page provides an overview of the pricing for 10DLC (10-Digit Long Code) SMS services available through Azure Communication Services (ACS). 10DLC is primarily supported in the United States. Availability depends on the subscription billing location and eligibility. Check the [ACS eligibility documentation](../../concepts/numbers/phone-number-management-for-united-states.md) for more details on supported countries. The 10DLC SMS service requires registering a brand, registering a campaign, and provisioning a 10DLC number through the Azure portal. Pay-as-you-go pricing applies to these different services: brand registration, campaign registration, phone number leasing, and message usage. 

### **Registration Fees**
Registration fees are required for brands and campaigns to comply with U.S. 10DLC regulations. 

- **Brand**: A brand represents your business or organization. It's a unique identity used to register campaigns with mobile carriers.
- **Campaign**: A campaign is a use case associated with a brand, such as promotional messages, customer notifications, or emergency alerts. Campaign registration ensures compliance with messaging regulations and helps carriers distinguish legitimate traffic from spam.

>[!Note]
> Trust scores and vetting requirements are determined by TCR and participating carriers. Brand vetting is **required as per The Campaign Registry (TCR)** in the following cases:  
> To achieve higher trust scores for better message throughput and delivery rates.    
> Brand vetting for 10DLC (10-Digit Long Code) messaging is typically required for companies outside the Russell 3000 list.

The following fees apply to the registration of brands and campaigns.

| Category           | Fee Type               | Fee Subtype                    | Frequency   | Description                          | Fee    |
|--------------------|------------------------|--------------------------------|-------------|--------------------------------------|--------|
| **Brand**          | Registration           | Per Brand                      | One-time     | Fee for brand registration           | $4     |
| **Brand**          | Vetting                | Per Brand                      | One-time    | Standard vetting for brand registration. Not required for all brands. | $40     |
| **Campaign**       | Standard               | Per campaign                   | Monthly     | Standard campaign registration fee   | $10    |


### **Phone Number Leasing Fee**
Monthly leasing fees for phone numbers.

| Category           | Fee Type               | Frequency   | Description                            | Fee    |
|--------------------|------------------------|-------------|----------------------------------------|--------|
| **Local (Geographic)**   | Leasing                | Monthly     | Monthly fee for leasing a phone number | $1     |


### Usage Fee
SMS offers pay-as-you-go pricing. The price is a per-message segment* charge based on the destination of the message. 10DLC phone numbers can send messages to phone numbers located within the United States.

|Country/Region| Send Message | Receive Message|
|-----------|---------|--------------|
|United States| $0.0075 | $0.0075|
  

### **Carrier Surcharges**
A carrier surcharge applies to messages exchanged using 10DLC numbers. This surcharge is a per-message segment fee that may vary over time. For outbound messages, the surcharge is determined by the carrier of the recipient's number. For inbound messages, it is determined by the carrier of the sender's number.

| Carrier            | Frequency      | Fee    |
|--------------------|---------------------------------------|--------|
| AT&T (Outbound)    | per message segment                   | $0.0020|
| T-Mobile (incl. Sprint) (Outbound and Inbound) | per message segment   | $0.0030|
| Verizon (Outbound and Inbound) | per message segment                   | $0.0030|
| US Cellular (Outbound) | per message segment               |  $0.0050|
| TextNow (Outbound) | per message segment                   |  $0.0020|
| Bluegrass (Outbound)| per message segment                  |  $0     |
| C-Spire (Outbound) | per message segment                   |  $0     |
| Commnet (Outbound) | per message segment                   |  $0     |

*See our guide on [SMS character limits](../sms/sms-faq.md#what-is-the-sms-character-limit) to learn more about message segments.
