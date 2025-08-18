---
title: Toll-free verification guidelines
titleSuffix: An Azure Communication Services article
description: This article describes how to fill out the toll-free verification form.
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 03/15/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: references_regions
---
# Toll-free verification guidelines

This article provides guidelines about filling out an application to verify your toll-free number. For detailed process and timelines toll-free verification process, check the [toll-free verification FAQ](./sms-faq.md#toll-free-verification). The toll-free verification application consists of five sections:  

- Application Type  
- Company Details  
- Program Details  
- Volume  
- Templates  

## Application type

### Country or region 

 Primary location your toll-free number is used to send messages to. Toll-free numbers are domestic within North America region. Your newly acquired toll-free number can only send messages to US, PR, and CA. This is true regardless of the location you acquired the number to serve.

### Associated phone numbers 

This drop down menu displays all the toll-free numbers you have in the Azure Communication Services resource. You're required to select the toll-free numbers that you would like to get verified. If you don't have a toll-free number, navigate to the phone numbers blade to acquire a toll-free number first.  

### Are you using more than one sending phone number?

If you're using multiple sending numbers for the same use case, justify how you're using the multiple numbers. If you need multiple numbers for multiple environments (development, QA, production), state that here.

## Company details

You need to provide information about your company and point of contact. Status updates for your short code application are sent to the point of contact email address.

> [!IMPORTANT]
> Toll-free verification is meant for the end business actually sending the message traffic and not for resellers. ISVs are required to surface this verification form to the businesses or fill out the all information including company information, program details, and opt-in information on behalf of the customer. 

## Program content

Message senders must provide detailed information on the content of their SMS campaign and to ensure that the customer consents to receive text messages, and understands the nature of the program.

### Program description

You need to describe the program for which the toll-free number is used to send SMS. Include who is receiving the messages and frequency of the messages.

### Opt-in 

This is the most crucial step in the verification application and providing the correct information ensures faster approval times. If proof of opt-in isn't provided in **Opt-in URL** field, URL is inaccessible, or if opt-in process is unclear, the application is rejected.

The general rule of thumb for opt-in are:  
- Making sure the opt-in flow is thoroughly detailed.  
- Consumer consent must be collected by the direct (first) party sending the messages. If you're a third party helping the direct party sending messages, the opt-in flow must disclose the (third party) name.
- Ensure explicitly stated consent disclaimer language appears at the time of collection. (that is, when the phone number is collected there must be a disclosure about opting-in to messaging). 
- If your message has Marketing/Promotional content, then it must be optional for customers to opt in.

 Here are some tips on how to show the proof of your opt-in workflow:

### Opt-in URL

|Type of Opt-In| Tips|
|--------------|-----|
|Website       | Screenshots of the web form where the end customer adds a phone number and agrees to receive SMS messages. This screenshot must explicitly state the consent disclaimer language at the time of collection. |
|Keyword or QR Code Opt-in| Image or screenshot of where the customer discovers the keyword/ QR Code in order to opt in to these messages. |
|Verbal/IVR opt-in|Provide a screenshot record of opt-in via verbal in your database/ CRM to show how the opt-in data is stored. (that is, a check box on their CRM saying that the customer opted in and the date) OR an audio recording of the IVR flow.|
|Point of Sale | For POS opt-ins on a screen/tablet, provide screenshot of the form. For verbal POS opt-ins of informational traffic, provide a screenshot of the database or a record of the entry. |
|2FA/OTP| Provide a screenshot of the process to receive the initial text. |
|Paper form | Upload the form and make sure it includes frequency, campaign information, and consent process to get consent from consumer. |

 ## Volume 

### Expected total messages sent

In this field, you need to provide an estimate of total messages sent per month.

## Templates

Message senders are required to disclose all the types/categories of messages with samples that are sent over the toll-free number.

#### Examples

- Contoso Promo Alerts: three msgs/week. Msg & Data Rates May Apply. Reply HELP for help. Reply STOP to opt out.
- Contoso: Your reservation is confirmed for 30th February 2022. Txt R to reschedule. Txt HELP or STOP. Msg&Data rates may apply.

 ## Next steps

> [!div class="nextstepaction"]
> [Acquire a toll-free number](../../quickstarts/telephony/get-phone-number.md)

> [!div class="nextstepaction"]
> [Apply for a short code](../../quickstarts/sms/apply-for-short-code.md)

## Related articles

- See the [SMS FAQ](./sms-faq.md#toll-free-verification).
- See the [SMS SDK overview](../sms/sdk-features.md).
- For global messaging, see [Messaging Connect](../sms/messaging-connect.md).
