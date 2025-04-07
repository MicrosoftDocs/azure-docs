# Prevent Phone Numbers from Being Flagged as Spam

When phone numbers are flagged as spam, it can severely impact the ability of businesses to communicate with their customers. This issue arises when carriers detect patterns that resemble spam behavior, such as high volumes of calls or messages, or when recipients report the number as spam. The consequences include:
- **Blocked Calls:** Outbound calls may be blocked, preventing important communications.
- **Reputation Damage:** Being flagged as a spammer can harm the business’ reputation and customer trust.
- **Operational Disruptions:** Communication disruptions can lead to operational inefficiencies and lost opportunities.

## Requirements and Best Practices for Voice Communications
1. **Monitor Call Patterns:** Regularly monitor call patterns to identify any unusual activity that may trigger spam filters. Avoid making a high volume of calls in a short period.
2. **Use Caller ID:** Ensure that the customer’s caller ID is correctly set up and displays accurate information. This helps recipients recognize the caller and reduces the likelihood of being reported as spam (You can leverage the Azure Communication process for CNAM setup detailed [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/how-to-manage-your-calling-identity)).
3. **Obtain Consent:** Always obtain consent from recipients before making calls. This can be done through opt-in mechanisms where customers explicitly agree to receive calls from the customer’s business.
4. **Provide Opt-Out Options:** Offer recipients an easy way to opt-out of receiving calls. This can be done through automated systems or customer service representatives.
5. **Maintain a Clean Contact List:** Regularly update and clean customer’s contact list to remove inactive or incorrect numbers. This reduces the chances of calling numbers that may report customer’s calls as spam. Customers can leverage the Azure Communication Services Number Lookup API to help customers with this (more details [here](https://learn.microsoft.com/en-us/azure/communication-services/concepts/numbers/number-lookup-concept)).

## Prohibited uses of Communications Services
The following activities are prohibited:
1.	Using Communications Services in any manner that may expose Microsoft or any of its personnel to criminal or civil liability;
2.	Re-selling Calling Plan and Audio Conferencing subscription minutes;
3.	Placing calls to or from Microsoft issued telephone numbers (whether singly, sequentially, or automatically) to generate income for yourself or others as a result of placing the call, other than for Customer’s business communications; and
4.	Placing calls in unusual calling patterns inconsistent with normal, individual subscription use, for example, placing regular calls of short durations or calls to multiple numbers in a short period of time.
5.	Using Communications Services in violation of any applicable laws or regulations of any jurisdiction, including, but not limited to, (a) privacy or data protection laws or regulations; (b) laws requiring consent of participants to receive calls or text messages; (c) laws governing the recording or monitoring of telephone calls; (d) laws and regulations that prohibit unsolicited, unwanted or harassing communications; or (e) anti-spam laws such as the U.S. CAN SPAM Act of 2003 and the Do-Not-Call Implementation Act.

For the full list of applicable Azure Communication Services Terms, you can refer to [Service Specific Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS#clause-2520-h3-1) as well as [Communications Services Tax Rates and Terms](https://www.microsoft.com/licensing/docs/view/Communications-Services-Tax-Rates-and-Terms?msockid=29591b22ce2367e3338a0afdcfe86647)

## Register in FCR
The [Free Caller Registry](https://www.freecallerregistry.com/fcr/) (FCR) serves as a system for organizations that conduct outbound calls to secure approval for their phone numbers, ensuring they are not incorrectly tagged as “Spam Likely” or “Scam” by mobile service providers. This initiative is backed by leading US vendors (TNS, FirstOrion and Hiya) who develop mechanisms to label incoming calls with a “Spam Likely” indicator. The registry holds significant importance for entities dependent on outbound calls for their business activities, as it helps to prevent their calls from being intercepted or wrongly marked as spam by carriers or external services. We recommend that customers initiate the process of phone number registration to mitigate this risk.

In order to request registration for an Azure Communication Services number, customers will need to work through the following steps:
1. Visit Free Caller Registry and click on “*Register here*”
2. Complete the form with all the details about numbers that customers own and will be using for PSTN Outbound calls, company’s details as well as expected volume and justification for the request.
3. Once a customer’s work email has been verified, he can submit his request.

Please consider the following when submitting the registration request:
- It will take several days to get a response for updating all US-based carriers, to confirm or deny the request. Sometimes the best is also to contact the three providers who are supporting the platform:
  - First Orion : FCRsupport@firstorion.com
  - Hiya : freecallerregistry@hiya.com
  - TNS : communications@tnsi.com
- In certain cases, customers may be asked by the platform vendors to set up an account as part of the application process.
- Number registration will fix most of the “spam like” flags but it’s not a guarantee against any future flagging, in case customers do not comply with US regulations.
