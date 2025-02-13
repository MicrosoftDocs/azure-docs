---
title: Define your caller identity

titleSuffix: An Azure Communication Services concept document
description: Learn about Communication Services CNAM registration process.
author: henikaraa
manager: ankura
services: azure-communication-services
ms.author: henikaraa
ms.date: 02/13/2025
ms.topic: conceptual
ms.service: azure-communication-services
---

# Define your caller identity


One common challenge faced by businesses is the difficulty of getting
their calls answered or even noticed by customers. In many cases, calls
from unknown or unfamiliar numbers are ignored or blocked by recipients.


This leads to missed opportunities for sales, customer service, and other

important interactions. This can be especially challenging for
businesses that rely heavily on phone-based communication, such as call
centers or sales teams.

To address these challenges, Azure

Communications Services is offering customers the ability to define
their caller's name when they place a PSTN call. Depending on their
needs, customers can choose between two options: Caller Name Delivery
(CNAM) registration or dynamic display name. In order to avoid
customer's calling numbers being flagged as "Spam", it's recommended
that customer register his PSTN outbound numbers within central
registries and to follow some best practices.

## What is CNAM

### Overview

In the US, Caller Name Delivery (CNAM) provides the caller's name or
company name in Caller ID, though it may show as \"restricted\" or \"not
available\" due to blocking or technical issues. The terminating carrier
retrieves this information through a database lookup DB (up to 8
providers in the US) using the caller\'s phone number. In Canada, the
caller's name can be added by either the client\'s equipment (e.g., PBX)
or the originating carrier, as long as it complies with anti-spoofing
and fraud regulations.

![CNAM Flow](./media/cnam-call-flow.png)


### How to register

In order to request a CNAM registration for an ACS number, customers will simply need to send an email to <acstns@microsoft.com>, using \"ACS Number Request -- CNAM Registration\" as part of customer's subject line and providing the below details:

-   Customer and Azure details

-   List of number and the corresponding caller name to register for
    each number (customer must own these numbers under the Azure
    Resources provided and he can register [only US local
    numbers]{.underline})

Please note that CNAM are limited to 15 characters (including spaces)
and the following special characters are supported:

-   **.** Period

-   , Comma

-   & Ampersand

-   -- Dash

-   \_ Underscore

-   ' Single quotation (i.e. Tom's Burgers)

Once the request is approved by the carrier, it takes **48 hours to be
published.**

### Things to consider

1.  The reliability of CNAM delivery with the call varies depending on
    the country/region and carriers that handle the call\--either as an
    intermediary or a terminating carrier.

2.  Inconsistencies in CNAM can be caused when the intermediate or
    terminating carriers delay refreshing the CNAM information in
    authoritative databases\--as in the United States. In
    countries/regions where there are no authoritative databases for
    CNAM, individual carrier practices can also cause problems with CNAM
    information arriving intact with the call.

3.  ACS currently doesn\'t support CNAM registration for
    countries/regions other than the United States.

4.  This registration is available only for US local numbers (not
    supported on toll free).

5.  This service only applies for OUTBOUND calls and for the numbers
    that customer owns.

6.  CNAM DBs are not always up to date and not all the same and there is
    a potential for misspellings.

7.  There are multiple CNAM databases across the country and terminating
    carriers may subscribe to one or multiple databases.

## Display Name

### Overview

Display Name allows customers to pass a caller name in the code
when making a call, which gives them more flexibility and control over
the branding of each call. This option is available with both ACS SDKs:
Call Automation and Calling SDK. This is also supported by both Direct
Offer and Direct Routing.

### How to set the display name

To define the display name when placing an outbound call,

customers can use the property
*[CallInvite.SourceDisplayName](https://learn.microsoft.com/en-us/dotnet/api/azure.communication.callautomation.callinvite.sourcedisplayname?view=azure-dotnet).*

Customers can set the display name appearing on target callee.


The following example places a PSTN outbound call using Call

Automation:

```javascript
async function createOutboundCall() {
	const callInvite: CallInvite = {
		targetParticipant: callee,
		sourceCallIdNumber: {
			phoneNumber: process.env.ACS_RESOURCE_PHONE_NUMBER || "",
		},
	};
	callInvite.SourceDisplayName = "Contoso Bank";
	const options: CreateCallOptions = { callIntelligenceOptions: { cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT } };
	console.log("Placing outbound call...");
	acsClient.createCall(callInvite, process.env.CALLBACK_URI + "/api/callbacks", options);
}
```

Where:

-   **CALLBACK_URI**: Once customer has their

    [DevTunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started?tabs=windows)
    host initialized, update this field with that URI.

-   **ACS_RESOURCE_PHONE_NUMBER**: update this field with the Azure
    Communication Services phone number customer has acquired. This
    phone number should use
    the [E164](https://en.wikipedia.org/wiki/E.164) phone number format.

-   **COGNITIVE_SERVICES_ENDPOINT**: update field with customer's Azure
    AI services endpoint.

### Things to consider

The reliability of display name delivery with the call varies depending
on the country/region and carriers that handle the call\--either as an
intermediary or a terminating carrier. In the US, the delivery of
display names is unreliable, and, in many cases, the downstream carriers
will strip the caller ID. In Canada, it's more reliable and in some
states considered standard practice, the recommendation for CA/US is to
use both CNAM and the API to set the Caller ID, and in the RoW the
experience varies based on the country.

