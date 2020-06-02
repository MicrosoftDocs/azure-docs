---
title: About Voice
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

> [!WARNING]
> This is an **in-progress draft**.

<br>
<br>

## About Voice

You can use Azure Communication Services to make and receive calls, analyze call metadata, record calls, and even build call trees. Your calls can be made to other internet-connected devices and to plain-old telephones. You can use JS, Android or iOS Client SDKs to build applications that allow your users to speak to one another in private conversations or in group discussions. Azure Communication Services also supports calls to and from Bots. 

In order to start a call, you need:

1.	An Azure Communication Services resource. This quickstart (todo) shows you how to provision one.
2.	An Azure Communication Services User Token. This quickstart (todo) shows you how to fetch one.
3.	The Azure Communication Services client-side SDK. This can be downloaded here (todo).
4.	(Optional) If you want to add calling to and from plain-old telephone numbers, you want to enable telephony capabilities within your Azure Communication Services resource. This quickstart shows you how to do that (todo).

### Call types in Azure Communication Services

There are multiple types of calls you can make in Azure Communication Services. The type of calls that you make determine your signaling schema, media traffic flows, and pricing model. Let's dig into the call types.


#### Voice Over IP (VoIP) 

When a user of your application calls another user of your application over an internet or data connection, the call is made over Voice Over IP (VoIP). In this case, both signaling and media flow over the internet.


#### Plain-Old Telephones (PSTN)

Any time your users interact with a traditional telephone number, calls are facilitated by PSTN (Public Switched Telephone Network) voice calling. To make and receive PSTN calls, you need to add telephony capabilities to your Azure Communication Services resource. In this case, signaling and media use a combination of IP-based and PSTN-based technologies to connect your users.


#### One-to-one call

A one-to-one call on Azure Communication Services happens when one of your users connects to another user using one of our client SDKs. The call can be either VoIP or PSTN.

#### Group call 

A group call on Azure Communication Services happens when three or more participants connect to one another. Any combination of VoIP and PSTN-connected users can be present on a group call. A one-to-one call can be converted into a group call by adding more participants to the call. One of those participants can be a bot.


### Next steps

If you're new to Azure Communication Services, we recommend familiarizing yourself with general call flows (todo). You may also want to review our documentation on Ports, IP Addresses and FQDNs (todo) to understand which ports, IP addresses and FQDNs need to be white listed on your firewall.

If you'd like to dive in, our Get Started With Voice quickstart (todo) will show you the code you need to start building a voice-enabled application. 

> [!WARNING]
> Your firewall might prevent you from connecting to Azure Communication Services. If you face this issue, please refer to our Ports, IP addresses, and FQDNs (todo) documentation.



### Related Docs: 

#### Conceptuals: 

- Phone Numbers 
- SIP, VOIP, and PSTN 
- Phone Trees 
- Call Detail Records 
- Call Analytics 
- Spam / Robocall Protection (PSTN) 

 
#### Quickstarts: 

- Get Started With Voice 

 

#### Tutorials: 

- How to make and receive phone calls 
- How to record phone calls 
- How to create a conference call 
- How to capture input from a phone's keypad 
- How to analyze call metadata 

#### Samples: 

TODO 



