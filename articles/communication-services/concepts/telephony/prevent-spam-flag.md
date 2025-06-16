---
title: Prevent phone numbers from being flagged as spam
titleSuffix: An Azure Communication Services article
description: This article describes how to prevent business phone numbers from being flagged as spam.
author: henikaraa
manager: ankura
services: azure-communication-services
ms.author: henikaraa
ms.date: 04/07/2025
ms.topic: conceptual
ms.service: azure-communication-services
---

# Prevent phone numbers from being flagged as spam

When phone numbers are flagged as spam, it can limit the ability of businesses to communicate with their customers. This issue arises when carriers detect patterns that resemble spam behavior, such as high volumes of calls or messages. This problem can also result from end-users reporting the number as spam. The consequences include:

- **Blocked Calls:** Outbound calls may be blocked, preventing important communications.
- **Reputation Damage:** Being flagged as a spammer can harm the business reputation and customer trust.
- **Operational Disruptions:** Communication disruptions can lead to operational inefficiencies and lost opportunities.

## Requirements and best practices for voice communications

-  **Monitor Call Patterns:** Regularly monitor call patterns to identify any unusual activity that may trigger spam filters. Avoid making a high volume of calls in a short period.
-  **Use Caller ID:** Ensure that the customer’s caller ID is correctly set up and displays accurate information. This practice helps recipients recognize the caller and reduces the likelihood of being reported as spam. You can apply the Azure Communication process for Caller Name Delivery (CNAM) set up in [Define your caller identity](../telephony/how-to-manage-your-calling-identity.md).
-  **Obtain Consent:** Always obtain consent from recipients before making calls. This goal can be achieved through opt-in mechanisms where customers explicitly agree to receive calls from the customer’s business.
-  **Provide Opt-Out Options:** Offer recipients an easy way to opt-out of receiving calls. This action can be done through automated systems or customer service representatives.
-  **Maintain a Clean Contact List:** Remove inactive or incorrect numbers by regular update of customer’s contact list. This practice reduces the chances of calling numbers that may report customer’s calls as spam. Customers can use the Azure Communication Services Number Lookup API to help customers with this process. For more information, see [Look up operator information for a phone number](../../quickstarts/telephony/number-lookup.md).

## Prohibited uses of communications services

The following activities are prohibited:
-  Using Communications Services in any manner that may expose Microsoft or any of its personnel to criminal or civil liability;
-  Reselling Calling Plan and Audio Conferencing subscription minutes;
-  Placing calls to or from Microsoft issued telephone numbers (whether singly, sequentially, or automatically) to generate income for yourself or others as a result of placing the call, other than for Customer’s business communications;
-  Placing calls in unusual calling patterns inconsistent with normal, individual subscription use. For example, placing regular calls of short durations or calls to multiple numbers in a short period of time.
-  Using Communications Services in violation of any applicable laws or regulations of any jurisdiction, including, but not limited to: (a) privacy or data protection laws or regulations; (b) laws requiring consent of participants to receive calls or text messages; (c) laws governing the recording or monitoring of telephone calls; (d) laws and regulations that prohibit unsolicited, unwanted or harassing communications; or (e) anti-spam laws such as the U.S. CAN SPAM Act of 2003 and the Do-Not-Call Implementation Act.

For the full list of applicable Azure Communication Services Terms, see [Service Specific Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#clause-2520-h3-1) and [Communications Services Tax Rates and Terms](https://www.microsoft.com/licensing/docs/view/Communications-Services-Tax-Rates-and-Terms?msockid=29591b22ce2367e3338a0afdcfe86647).

## Register in the Free Caller Registry (FCR)

The [Free Caller Registry](https://www.freecallerregistry.com/fcr/) (FCR) serves as a system for organizations that conduct outbound calls to secure approval for their phone numbers, ensuring they are not incorrectly tagged as "Spam Likely" or "Scam" by mobile service providers.
The registry is important for entities dependent on outbound calls for their business activities. It helps to prevent their calls from being intercepted or wrongly marked as spam by carriers or external services. We recommend that customers initiate the process of phone number registration to mitigate this risk.

To request registration for an Azure Communication Services number, customers need to work through the following steps:
1. Visit [Free Caller Registry](https://www.freecallerregistry.com/fcr/) and click on "*Register here*"
2. Complete the form with all the details about numbers that customers own and use for public switched telephone network (PSTN) Outbound calls. Include company details, expected volume, and justification for the request.
3. Once the customer has verified his work email, he can submit his request.

Consider the following points when submitting the registration request:
- It takes several days to get a response for updating all US-based carriers, confirming or denying the request. You can also contact one of the three providers supporting the platform:
  - First Orion: FCRsupport@firstorion.com
  - Hiya: freecallerregistry@hiya.com
  - TNS: communications@tnsi.com
- In certain cases, the platform vendors may ask customers to set up an account as part of the application process.
- Number registration fixes most of the “spam like” flags but it’s not a guarantee against any future flagging. This issue can happen if customers do not comply with US regulations.

## Related articles

- [Define your caller identity](../telephony/how-to-manage-your-calling-identity.md)
- [Look up operator information for a phone number](../../quickstarts/telephony/number-lookup.md)
- [Service Specific Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#clause-2520-h3-1)
- [Communications Services Tax Rates and Terms](https://www.microsoft.com/licensing/docs/view/Communications-Services-Tax-Rates-and-Terms?msockid=29591b22ce2367e3338a0afdcfe86647)