# Plan your Telephony and SMS solution

This document describes the telephony numbers and plans in Azure Communication Services and guides you to select the appropriate offer. Regardless of whether you are new to the telephony world or a seasoned professional, the information will help you make the right decision for your solution.
We will walk you through the decision flows on selecting a carrier, phone number types, plans (or capabilities), and review the phone number acquisition portal.

## About phone numbers in Azure Communications Services

Azure Communication Services allows you to use phone numbers to receive telephony calls and send or receive SMS messages. You also can use phone numbers in your caller ID on outbound calls.  Microsoft offers a variety of options depending on the country and your needs.
If you want just to try Azure Communications Services or build a new project with no requirements to bring the existing phone number, the simplest way would be to get a new phone number from Microsoft in a matter of minutes.


> [!NOTE]
> Microsoft does not provide voice telephony services in each country. We keep expanding the countries rapidly. If your country is not served by Microsoft directly, you can interconnect the telephony via the SIP interface on your own or with our partners' help. The SIP interface does not allow interconnection with your own carrier for sending and receiving the SMS

If your customer has an existing phone number and they want to keep using in your solution (for example, 1 800 – COMPANY), you have several choices.
If Microsoft provides voice calling services in your country, you can port the phone number from the existing partner to Microsoft.
If you do not want to port the number (keep it with the existing partner) or Microsoft does not yet provide the voice calling services in your country, you can interconnect your partner via the Azure Communication Services SIP Interface (available soon)
The following diagram helps you to navigate through the available options, based on your scenario

![alt text for image](../media/phone-decision-tree.png)
