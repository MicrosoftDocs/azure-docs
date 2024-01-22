---
title: Short Code Program Brief Filling Guidelines
titleSuffix: An Azure Communication Services concept document
description: Learn about how to apply for short codes
author: prakulka
manager: shahen
services: azure-communication-services

ms.author: prakulka
ms.date: 2/15/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
---
# Short Code Program Brief Filling Guidelines
[!INCLUDE [Short code eligibility notice](../../includes/public-preview-include-short-code-eligibility.md)]

Azure Communication Services allows you to apply for a short code for SMS programs. In this document, we'll review the guidelines on how to fill out a program brief for short code registration. A program brief application consists of 4 sections:
- Program details
- Contact details
- Volume
- Templates

## Program details
### Program Name
All Short Code programs are required to disclose program names, product description, or both, in messages, on the call-to-action, and in the terms and conditions. The program name is generally the sponsor of the Short Code program, often the brand name or company name associated with the Short Code. 

As a best practice, the program name is composed of two pieces 
- Name of the sponsor (company or brand name)
  Example: Contoso
- Product description
  Example: Promo alerts, SMS banking, Appointment reminders

**Examples of program name:**
-	Contoso Promo Alerts
-	Contoso SMS Banking
-	Contoso Appt. Reminders

### Type of Short Code
Communication Services offers two types of short codes: random and vanity.

#### Random short code
A random short code is a 5–6-digit phone number that is randomly selected and assigned by the U.S. Common Short Codes Association (CSCA).
#### Vanity short code
A vanity short code is a 5–6-digit phone number that is chosen by you for your program. You can look up the list of available short codes in the [US Short Codes directory](https://usshortcodedirectory.com/).
Additionally, you may pick a number that the customer can spell out on their phone dial pad as an alphanumeric equivalent – for example, Contoso can use OFFERS (633377). 

When you select a vanity short code, you are required to input a prioritized list of vanity short codes that you’d like to use for your program. The alternatives in the list will be used if the first short code in your list isn't available to lease. 
Example: 234567, 234578, 234589.

> [!Note]
> Short codes in the US cannot start with 1.

### Directionality 
This field captures the directionality of the SMS program – 1-way or 2-way SMS. In United States, 2-way SMS is mandated to honor opt-out requests from customers.

### Recurrence
Programs are classified as Transactional programs or Subscription programs: 
- **Transactional** programs deliver a one-time message in response to customers’ opt-in requests. Examples include one-time passcodes, informational alerts, and delivery notifications. 
- **Subscription** programs send messages to customers on an ongoing basis. Examples include content/information alert subscriptions (news, weather, horoscopes, etc.), marketing, and loyalty promotions.

### Estimated ramp up time
This field captures the time duration in days until full production volume is reached.

### Political Campaign
Short Code programs that solicit political donations are subject to [additional best practices](https://www.ctia.org/the-wireless-industry/industry-commitments/guidelines-for-federal-political-campaign-contributions-via-wireless-carriers-bill). 

### Privacy Policy and Terms and Conditions URL
Message Senders are required to maintain a privacy policy and terms and conditions that are specific to all short code programs and make it accessible to customers from the initial call-to-action. 

In this field, you can provide a URL of the privacy policy and terms and conditions where customers can access it. If you don’t have the short code program specific privacy policy or terms of service URL yet, you can provide the URL of screenshots of what the short code program policies will look like (a design mockup of the website that will go live once the campaign is launched).

Your terms of service must include terms specific to the short code program brief and must contain ALL of the following:
- Program Name and Description
- Message Frequency, it can be either listed as Message Frequency Varies or the accurate frequency, it also needs to match with what is listed in the call-to-action
- The disclaimer: "Message and data rates may apply" written verbatim
- Customer care information, for example: "For help call [phone number] or send an email to [email]"
- Opt-Out message: "Text STOP to cancel"
- A link to the Privacy Policy or the whole Privacy policy

##### Example:
**Terms of Service** 

:::image type="content" source= "../media/short-code-terms.png" alt-text="Screenshot showing the terms of service mock up.":::

Your terms of service must contain ALL of the following:
- Program Name and Description
- Message Frequency, it can be either listed as Message Frequency Varies or the accurate frequency, it also needs to match with what is listed in the CTA (Call-To-Action)
- The disclaimer: "Message and data rates may apply" written verbatim
- Customer care information, for example: "For help call [phone number] or send an email to [email]"
- Opt-Out message: "Text STOP to cancel"
- A link to the Privacy Policy or the whole Privacy policy. 

> [!Note]
> If you don’t have a URL of the website, mockups, or design, please send an email with the screenshots to phone@microsoft.com with "[CompanyName - ProgramName] Short Code Request".

### Program Sign-up type and URL 
This field captures the call-to-action, an instruction for the customers to take action for ensuring that the customer consents to receive text messages, and understands the nature of the program. Call-to-action can be over SMS, Interactive Voice Response (IVR), website, or point of sale. Carriers require that all short code program brief applications are submitted with mock ups for the call-to-action.

In these fields, you must provide a URL of the website where customers will discover the program, URL for screenshots of the website, URL of mockup of the website, or URL with the design. If the program sign-up type is SMS, then you must provide the keywords the customer will send to the short code for opting in. 

> [!Note]
> If you don’t have a URL of the website, mockups, or design, please send the screenshots to phone@microsoft.com with Subject "[CompanyName - ProgramName] Short Code Request".

#### Guidelines for designing the call-to-action:
1. The call-to-action needs to be clear as to what program the customer is joining or agreeing to.
   - Call-to-action must be clear and accurate; consent must not be obtained through deceptive means
   - Enrolling a user in multiple programs based on a single opt-in is prohibited, even when all programs operate on the same short code. Please refer to the [CTIA monitoring handbook](https://www.wmcglobal.com/hubfs/CTIA%20Short%20Code%20Monitoring%20Handbook%20-%20v1.8.pdf) for best practices.
2. The call-to-action needs to include the abbreviated terms and conditions, which include:
   -	Program Name – as described above
   -	Message frequency (recurring message/subscriptions)
   -	Message and Data rates may apply
   -	Link to comprehensive Terms and Conditions (to a static website, or complete text)
   -	Link to privacy policy (or complete text)

> [!Note]
> Additional information might be required for sweepstakes or other special programs. Please check the [CTIA monitoring handbook](https://www.wmcglobal.com/hubfs/CTIA%20Short%20Code%20Monitoring%20Handbook%20-%20v1.8.pdf).

##### Examples:
**SMS**

Contoso.com: Announcing our Holiday Sale. Reply YES to save 5% on your next Contoso purchase. Msg&Data Rates May Apply. Txt HELP or terms&conditions. Txt STOP to opt-out.

**Web opt-in**

:::image type="content" source= "../media/short-code-web-optin.png" alt-text="Screenshot showing the web opt-in mock up.":::

**Point of sale (hardcopy leaflet) with SMS keyword call-to-action**

:::image type="content" source= "../media/print-opt-in-mock.png" alt-text="Screenshot showing print opt-in mock up.":::

**IVR**

*Example 1:*
 
**Agent** - To sign up for our last-minute travel deals, Press 1.  Message and data rates may apply. Visit margiestravel.com for privacy and terms and conditions.

*Example 2:*

**Contoso bot** - Would you like to receive appointment reminders through text message to the phone number you've saved in your account? Messages and data rates may apply. If you want to opt in, say YES, say NO to skip.  
**End-User** - YES
## Contact Details

### Point of contact email address
You need to provide information about your company and point of contact. Status updates for your short code application will be sent to the point of contact email address.

### Customer care
Customer care contact information must be clear and readily available to help customers understand program details as well as their status with the program. Customer care information should result in customers receiving help.

In these fields, you're required to provide the customer care email address and a customer care phone number where customers can reach out to receive help.

## Volume 
### Messages sent per user
In this field, you're required to provide an approximate number of messages that will be sent out per customer monthly.

### Replies per user 
In this field, you're required to provide an approximate number of replies you expect to get per customer.

### Expected total messages sent
In this field, you're required to provide an estimate of total messages sent per month.

### Traffic spikes
In this field, you're required to provide information on traffic spikes and their expected timing.
Example: Traffic spikes are expected for delivery notifications program around holidays like Christmas.

## Templates

Azure communication service offers an opt-out management service for short codes that allows customers to configure responses to mandatory keywords STOP/START/HELP. Prior to provisioning your short code, you'll be asked for your preference to manage opt-outs. If you opt-in, the opt-out management service will automatically use your responses in the program brief for Opt-in/ Opt-out/ Help keywords in response to STOP/START/HELP keyword. 

### Opt-in confirmation message
CTIA requires that the customer must actively opt into short code programs by sending a keyword from their mobile device to the short code, providing consent on website, IVR, etc.

In this field, you're required to provide a sample of the confirmation message that is sent to the customer upon receiving their consent. 

**Example:** Contoso Promo Alerts: 3 msgs/week. Msg&Data Rates May Apply. Reply HELP for help. Reply STOP to opt out.

### Help message response
Message senders are required to respond to messages containing the HELP keyword with the program name and further information about how to contact the message sender.

In this field, you're required to provide a sample of the response message that is sent to the customer upon receiving the HELP keyword. 

**Example:** Contoso Appointment reminders: Get help at support@contoso.com or 1-800 123 4567.Msg&Data Rates May Apply. Txt HELP for help. Txt STOP to opt out.

### Opt-out message
Message senders are required to have mechanisms to opt customers out of the program and respond to messages containing the STOP keyword with the program name and confirmation that no additional messages will be sent. 

In this field, you're required to provide a sample of the response message that is sent to the customer upon receiving the STOP keyword. 

**Example:** Contoso Appointment reminders: You’re opted out and will receive no further messages.

Please see our [guide on opt-outs](./sms-faq.md#opt-out-handling) to learn about how Azure Communication Services handles opt-outs.

### Example messages
Message senders are required to disclose all the types/categories of messages with samples that will be sent over the short code.

In this field, you're required to provide a sample message for each content type you intend on using the short code for. 

#### Example flow:
- **Contoso**: Contoso: Your reservation has been confirmed for 30th February 2022. Txt R to reschedule. Txt HELP or STOP. Msg&Data rates may apply.
  - **User**: R
- **Contoso**: Reply with date (MMDDYY) when you would like to reschedule.
  - **User**: 030322
- **Contoso**: Reply with time (HHMM) when you would like to reschedule on 030322.
  - **User**: 1200
- **Contoso**: Your reservation has been confirmed for 3rd March 2022 at 12:00 pm. Txt R to reschedule. Txt HELP or STOP. Msg&Data rates may apply.

## Next steps

> [!div class="nextstepaction"]
> [Apply for a short code](../../quickstarts/sms/apply-for-short-code.md)

The following documents may be interesting to you:

- Familiarize yourself with the [SMS SDK](../sms/sdk-features.md)
