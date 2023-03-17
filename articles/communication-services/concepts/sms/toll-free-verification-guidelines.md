---
title: Toll-Free Verification Filling Guidelines
titleSuffix: An Azure Communication Services concept document
description: Learn about how to apply for toll-free verification
author: prakulka
manager: sundraman
services: azure-communication-services

ms.author: prakulka
ms.date: 03/15/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
---

# Toll-Free Verification Filling Guidelines

In this document, we will review the guidelines on filling out an application to verify your toll-free number. The toll-free verification application consists of 5 sections:  

- Application Type  
- Company Details  
- Program Details  
- Volume  
- Templates  

## Application Type  
### Country or Region  
This is the location your toll-free number is acquired for. Currently, toll-free numbers are available in the US, PR and CA. Toll-free numbers are domestic within North America region and your newly acquired toll-free number can only send messages to US,PR, and CA (regardless of where it is acquired for).

### Associated phone number(s)  

This drop down displays all the toll-free numbers you have in the Azure Communication Services resource. You are required to select the toll-free numbers that you would like to get verified. If you do not have a toll-free number, please navigate to the phone numbers blade to acquire a toll-free number first.  

### Are you using more than one sending phone number? 

If you are using multiple sending numbers for the same use case, please justify how you will be using the multiple numbers. If you need multiple numbers for multiple environments (development, QA, production), state that here. Carriers require the justification because they are sensitive to the prohibited practice of snowshoeing or spreading the same or similar traffic over multiple sending toll-free numbers, as the primary purpose for snowshoeing is generally an attempt to evade carrier spam filters. 

## Company Details  
You need to provide information about your company and point of contact. Status updates for your short code application will be sent to the point of contact email address.

## Program Content
Message Senders are required to provide detailed information on the content of their SMS campaign and to ensure that the customer consents to receive text messages, and understands the nature of the program.

### Program Description
You need to describe the program for which the toll-free number will be used to send SMS. Include who will be receiving the messages and frequency of the messages.

### Opt-in 

The general rule of thumb for opt-in are:  
- Making sure the opt-in flow is thoroughly detailed.  
- Consumer consent should be collected by the direct (first) party sending the messages. If you are a 3rd party helping the direct party sending messages  
- Ensure there is explicitly stated consent disclaimer language at the time of collection. (ie. when the phone number is collected there should be a disclosure about opting-in to messaging). 
- If your message has Marketing/Promotional content, then it must be optional for customers to opt-in  

 Here are some tips on how to show the proof of your opt-in workflow:

### Opt-in URL

|Type of Opt-In| Tips|
|--------------|-----|
|Website       | Screenshots of the web form where the end customer adds a phone number and agrees to receive SMS messages. This screenshot should explicitly state the consent disclaimer language at the time of collection|
|Keyword or QR Code Opt-in| Image or screenshot of where the customer will discover the keyword/ QR Code in order to opt-in to these messages|
|Verbal/IVR opt-in|Provide a screenshot record of opt-in via verbal in the your database/ CRM to show how the opt-in data is stored. (IE, a check box on their CRM saying that the customer opted in and the date) OR an audio recording of the IVR flow.|
|Point of Sale | Most POS opt-ins are done on a screen/tablet. You could provide screenshots for those. If they are verbal POS opt-ins, please note they cannot send promotional messaging as promotional messaging requires express written consent. For verbal POS opt-ins of informational traffic, a CRM screenshot would be fine.|
|2FA/OTP| Please provide a screenshot of the process to receive the initial text.|
|Paper form | Upload the form and make sure it includes XXXX. |

 ## Volume 

### Expected total messages sent
In this field, you are required to provide an estimate of total messages sent per month.

## Templates
Message senders are required to disclose all the types/categories of messages with samples that will be sent over the toll-free number.

#### Examples
- Contoso Promo Alerts: 3 msgs/week. Msg&Data Rates May Apply. Reply HELP for help. Reply STOP to opt-out.
- Contoso: Your reservation has been confirmed for 30th February 2022. Txt R to reschedule. Txt HELP or STOP. Msg&Data rates may apply.

 ## Next steps

> [!div class="nextstepaction"]
> [Acquire a toll-free number](../../quickstarts/telephony/get-phone-number.md)

> [!div class="nextstepaction"]
> [Apply for a short code](../../quickstarts/sms/apply-for-short-code.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS FAQ](../sms/sms-faq.md)
- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
