---
title: Troubleshoot Azure Communication Services direct routing outbound calls issues
description: Learn how to troubleshoot Azure Communication Services direct routing potential issues that affect outbound calls.
ms.date: 06/22/2023
author: boris-bazilevskiy
ms.author: bobazile
manager: rcole
audience: ITPro
ms.topic: troubleshooting
ms.service: azure-communication-services
---

# Issues that affect outbound direct routing calls

You might experience various issues when you use direct routing to make outbound calls from an app built on Azure Communication Services Software Development Kit (SDK) to a Session Border Controller (SBC). These issues include:

- An incorrect or anonymous caller ID is displayed to the call recipient.
- A connection to the SBC isn't established.
- Some users are unable to make calls.
- No users in a tenant are able to make calls.

This article discusses potential causes of these issues, and provides resolutions that you can try.

## Incorrect caller ID displayed to the recipient

When you use direct routing, the caller ID information that is delivered to the call recipient is listed in the `From` and `P-Asserted-Identity` headers in the Session Initiation Protocol (SIP) options message.

The `From` header contains any of the following items:

- The phone number that's used as an `alternateCallerId` property of a `startCall` method in [Client Calling SDK](../../../quickstarts/telephony/pstn-call.md).
  If an `alternateCallerId` wasn't provided, it's replaced with "anonymous".
- The phone number string that's passed when creating a `PhoneNumberIdentifier` object in [Call Automation SDK](../../../how-tos/call-automation/actions-for-call-control.md#make-an-outbound-call)
- The phone number of the original caller if an Call Automation SDK [redirects the call](../../../how-tos/call-automation/actions-for-call-control.md#redirect-a-call).
- The phone number selected as a Caller ID in Omnichannel Agent client application.

The `P-Asserted-Identity` header contains the phone number of the user who is billed for the call. The `Privacy:id` indicates that the information in the header has to be hidden from the call recipient.

### Cause

If the information in the `From` and `P-Asserted-Identity` headers doesn't match, and if the Public Switched Telephone Network (PSTN) prioritizes the `P-Asserted-Identity` header information over the `From` header information, then incorrect information is displayed.

### Resolution

To make sure that the correct caller ID is displayed to the call recipient, configure the SBC to either remove the `P-Asserted-Identity` header from the SIP INVITE message or modify its contents.

## Connection to the SBC not established

Sometimes, calls reach the SBC but no connection is established. In this situation, when the SBC receives a SIP OPTIONS message from Microsoft, it returns a failure message that includes error codes in the range of 400 to 699.

Any of the following causes might prevent a connection to the SBC.

### Cause 1

The SIP failure message is coming from another telephony device that is on the same network as the SBC.

### Resolution 1

Troubleshoot the other device to fix the error. If you need assistance, contact the device vendor.

### Cause 2

Your PSTN provider is experiencing some issue and is sending the SIP failure message. This is most likely the case if the failure error code is SIP 403 or SIP 404.

### Resolution 2

Contact your PSTN provider for support to fix the issue.

### Cause 3

The issue isn't coming from another device on the network or by your PSTN provider. However, the cause is otherwise unknown.

### Resolution 3

Contact the SBC vendor support to fix the issue.

## Some users are unable to make calls

If the connection between the Microsoft and the SBC is working correctly, but some users or applications can't make calls, the issue might be an incorrect scope of an Azure Communication Services access token

### Cause 1

Azure Communication Services access token was created with a chat scope.

### Resolution 1

Make sure that all the Azure Communication Services access tokens that are used for making calls are generated [with a `voip` scope](../../identity-model.md#access-tokens).

### Cause 2

None of the patterns in the Voice Routes match the dialed number.

### Resolution 2

Make sure that the following conditions are true:

- There's a pattern in the Voice Route that matches the dialed number.
- The SBC that's specified for the Voice Route is **Online**. If it's **Inactive**, either set it up to become **Online** or select a different SBC that is **Online**

### Cause 3

The SBC isn't responding to SIP OPTIONS messages because some device on the network, such as a firewall, is blocking the messages.

### Resolution 3

Make sure that the SIP Signaling IPs and FQDNs are allowed on all network devices that connect the SBC to the internet. The IP addresses that must be allowed are listed at [SIP Signaling: FQDNs](../direct-routing-infrastructure.md#sip-signaling-fqdns).

## Related articles

- [Troubleshoot direct routing connectivity](./troubleshoot-tls-certificate-sip-options.md)
- [Plan for Azure direct routing](../direct-routing-infrastructure.md)
- [Pair the Session Border Controller and configure voice routing](../direct-routing-provisioning.md)
- [Outbound call to a phone number](../../../quickstarts/telephony/pstn-call.md)