---
title: Frequently asked questions about trial phone numbers in Azure Communication Services
description: A conceptual overview plus FAQ for trial phone numbers and verified phone numbers.
author: jadacampbell
ms.author: jadacampbell
ms.service: azure-communication-services
ms.topic: conceptual
ms.date: 07/19/2023
ms.custom: template-concept
---

# Frequently asked questions about trial phone numbers in Azure Communication Services

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

This article answers commonly asked questions about Trial Phone Numbers and Verified Phone Numbers. 



## Trial Phone Numbers
### How many trial phone numbers can I request? 
Customers are limited to one trial phone number.
 
### Is my subscription eligible for a trial phone number? 
Currently trial phone numbers are only available for US subscriptions. For more information on subscriptions in other regions available for purchase, see our subscription eligibility documentation.  

### Can I use the trial phone number for SMS messaging? 
No, currently the trial phone number for Azure Communication Services only supports PSTN Calling capabilities. SMS messaging capabilities for trial phone numbers will be available soon. Keep an eye on the Azure Communication Services documentation for updates on when SMS functionality will be added to the trial phone numbers. 

### Can I choose a specific phone number or area code for the trial number? 
Currently, customers who can activate a trial phone number will be provided a US toll-free number. If you require a specific phone number or area code, then you must [purchase a phone number](../../quickstarts/telephony/get-phone-number.md). 

### How long can I use the trial phone number? 
The trial phone number is available for 30 days. After the trial period ends, the phone number will no longer be accessible. It's recommended to upgrade to a production subscription if you require a longer-term phone number. 


### How can I make and receive calls using the trial phone number? 
You can use Azure Communication Services APIs or SDKs to make and receive calls using the trial phone number. Microsoft provides comprehensive documentation and code samples to help you integrate the PSTN Calling capabilities into your applications. 

### What are the calling limitations on my trial phone number? 
Trial phone numbers have 60 minutes of inbound and 60 minutes of outbound PSTN calling. The max duration of a phone call is 5 minutes. The trial phone number may not be used to dial emergency services such as 911, 311, 988 or any emergency numbers.

## Verified Phone Numbers

### Why do I need to verify the recipient phone number for a trial phone number?
Verifying the recipient phone number is a security measure that ensures the trial phone number can only make calls to the verified number. This helps protect against misuse and unauthorized usage of trial phone numbers.

### How is the recipient phone number verified?
The verification process involves sending a one-time passcode via SMS to the recipient phone number. The recipient needs to enter this code in the Azure portal to complete the verification. 

### From where can I verify phone numbers?
Currently, only phone numbers that originate from the United States (i.e., have a +1 preffix) can be verified for use with trial phone numbers. 

### Can I verify multiple recipient phone numbers for the same trial phone number?
Currently the trial phone number can be verified for up to three recipient phone numbers. If you need to make calls to more numbers, then you'll need to [purchase a phone number](../../quickstarts/telephony/get-phone-number.md)

### What happens if I enter the verification code incorrectly?
If the verification code is entered incorrectly, the verification process fails. You can request a new verification code and try again.

### Does the recipient phone number need to be in a specific format for verification?
Yes, the recipient phone number should be entered in the correct international format, including the country code. Ensure that the phone number is accurate and free of any typos or formatting errors.

### How long does the verification process take?
The verification code is typically sent within a few seconds after initiating the verification process. The overall process should be completed quickly, depending on the recipient's ability to receive the SMS and enter the code in the Azure portal. 


## Next steps

> [!div class="nextstepaction"]
> [Get a trial phone number](../../quickstarts/telephony/get-trial-phone-number.md)

