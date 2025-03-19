---
title: Troubleshoot PSTN call failures - Azure Communication Services
description: Learn how to troubleshoot PSTN call failures by logging and viewing call codes.
services: azure-communication-services
ms.date: 11/24/2023
author: slpavkov
ms.service: azure-communication-services
ms.author: slpavkov
manager: aakanmu
audience: ITPro
ms.topic: troubleshooting
---
# Troubleshoot Azure Communication Services PSTN call failures

When you're troubleshooting Azure Communication Services PSTN call failures, we recommend that you [enable logging](../analytics/enable-logging.md). Then you can use `ResultCategories`, `ParticipantEndReason`, and `ParticipantEndSubCode` values to determine why an individual call ended and whether the system detected any failures.

## Use ResultCategories to troubleshoot failures

The `ResultCategories` array is a property of the [Call Summary Log Schema](../analytics/logs/call-summary-log-schema.md). It contains a list of general reasons that describe how the call ended:

- `Success`
- `Failure`
- `UnexpectedClientError`
- `UnexpectedServerError`

This information can help you determine why a call ended without generating a detailed error log.

## Use ParticipantEndReason and ParticipantEndSubCode to troubleshoot failures

If the level of detail in `ResultCategories` isn't sufficient when you're troubleshooting PSTN calls, you can use `ParticipantEndReason` and `ParticipantEndSubCode` to understand the reasons why a call ended in greater detail. `ParticipantEndReason` and `ParticipantEndSubCode` are also properties of the [Call Summary Log Schema](../analytics/logs/call-summary-log-schema.md).

### ParticipantEndReason

`ParticipantEndReason` is a three-digit code that shows the general call status. This code explains why the call ended and groups failures by category. For example, `ParticipantEndReason 404` means that caller or callee wasn't found. `ParticipantEndReason 500` means that a service error occurred.

This code is based on Session Initiation Protocol (SIP) response codes. For more information, see Wikipedia's [list of SIP response codes](https://en.wikipedia.org/wiki/List_of_SIP_response_codes).

### ParticipantEndSubCode

`ParticipantEndSubCode` is a more specific response code that's usually six digits long. It explains in greater detail why there was a problem with the call.
  
A key factor in troubleshooting Azure Communication Services PSTN calls is determining whether the final SIP response code for the call came from a Microsoft process or the user's/operator's session border controller (SBC). An easy way to determine where the code originated is to look at the `ParticipantEndSubCode` response.

If the `ParticipantEndSubCode` value starts with 560 or 540, it indicates that the user's/operator's SBC generated the response code. This is useful for troubleshooting Direct Routing calls, as the subcode can help determine whether the error is from your SBC or the Microsoft service. A subcode starting with 560 represents an outbound call, while a subcode starting with 540 represents an inbound call. In either case, check the SBC logs.

For example, if the `ParticipantEndSubCode` value is `560403`, it means that it was an outbound call, the SBC generated the final response code, and the SIP response code from the SBC was 403. Start troubleshooting the calls by checking your SBC logs.

For `ParticipantEndSubCode` responses that don't start with 560 or 540, the Microsoft service generated the final response code.

## Related content

- For general troubleshooting information, see [Troubleshooting in Azure Communication Services](../troubleshooting-info.md).
- For detailed information about common error codes and suggested actions, see [Troubleshooting call end response codes for Calling SDK, Call Automation SDK, and PSTN calls](../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md).
