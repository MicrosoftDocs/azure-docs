---
title: Troubleshooting call end response codes for Call Automation SDK
description: Include file
services: azure-communication-services
author: slpavkov
manager: aakanmu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 7/22/2024
ms.topic: include
ms.custom: Include file
ms.author: slpavkov
---
## Understanding calling codes and subcodes 
### When are error codes received?
Error codes for Call Automation can come either as synchronous responses to API calls or asynchronous responses via the provided callback URI. In the synchronous situation, if an API call is made and it'sn't accepted, ACS will provide an error code describing why the API call was rejected. In asynchronous scenarios if an API call is made and is accepted but something still goes wrong, both a callback event and an error code are received. An example of a common callback event for call failures would be the `callDisconnected` event that is surfaced whenever a call is disconnected. Once the `callDisconnected` event is received, there won't be any more callback events for that given call. For a list of call signaling callback events see ([this page](../../../../../concepts/call-automation/call-automation.md#call-automation-webhook-events)), and for a list of callback events for media actions see ([this page](../../../../../how-tos/call-automation/control-mid-call-media-actions.md)). 

### Error Code Syntax 
Error codes, subcodes, and corresponding result categories help developers identify and diagnose errors. Error code details include: 

**Code** - are 3 digit integers representing client or server response status. The code categories: 
- Successful responses (200-299) 
- Client error (400-499) 
- Server error (500-599) 
- Global error (600-699) 

**Subcode** - Are defined as an integer, where each number indicates a unique reason, specific to a group of scenarios or specific scenario outcome. 

**Message** - Describes the outcome and provides hints how to mitigate the problem if an outcome is a failure. 

In addition to the code and subcode, more detailed troubleshooting information can be found in the call logs. To learn more about how to enable and access calling logs, see [this page](../../../../../concepts/analytics/enable-logging.md) for detailed guidance. 

## Call Automation SDK error codes

The following table contains the most common codes and subcodes. If your error isn't in this table, refer to the generic codes and subcodes to get more information about your specific scenario.

### Call Automation error codes

| Callback Event                   | Code | Subcode | Description                                                                                             | Mitigation |
|----------------------------------|------|---------|---------------------------------------------------------------------------------------------------------|------------|
| CreateCallFailed / AnswerFailed | 404  | 8522    | A generic error code that indicates that the resource isn't found. Resources can include calls and participants. | Double check call status: the call may have already ended, or the participant has left the call. |
| CreateCallFailed / AnswerFailed | 400  | 8523    | A generic error code that indicates that something in the request body is invalid. | Check to make sure all of the parameters are valid. Refer to the error message to determine which parameter is throwing the error. |
| AnswerFailed                    | 400  | 8501    | Action Not Supported Call Not Established | The action associated with the error message was activated while the call was not active. Ensure that new call actions aren't initiated after the call has been disconnected. This error could also result from actions invoked while the call is active if they're close to the call disconnected time. |
| AnswerFailed                    | 400  | 8500    | Invalid Media Mode | Check the status of your media operations to see if any of them are already active, or if target participant is already in a media operation. If there's an active media operation, wait for the operation to finish and then retry. |
| CallDisconnected                | 400  | 8559    | Action Not Supported Only One Single Dialout App Allowed | Duplicate start recording request, recording already initiated or in progress. Double check recording status to ensure it's inactive before submitting a new start recording call. |
| AnswerFailed                    | 400  | 8528    | Action not supported call terminated | The action associated with the error message was activated while the call was terminated. Ensure that new call actions aren't initiated after the call is terminated. This error could also result from actions invoked while the call is active if they're close to the call termination time. |
| CreateCallFailed / ConnectFailed | 409 | 8519    | Conflict | Check to make sure multiple actions aren't being performed on the same resource in parallel. Refer to error message to identify which two actions are in conflict. |
| CreateCallFailed               | 403  | 7507    | Call Source Identity Invalid | Application identity from authorization token didn't match application identity in call source. Check to make sure you're using the connection string from the ACS resource the incoming call webhook was configured in (the phone number has to be owned by the same ACS resource answering the call). |
| CreateCallFailed               | 403  | 7504    | Insufficient Application Permissions | Generic code for insufficient permissions, check error message for context on what resource is lacking permissions. |
| AnswerFailed                    | 400  | 8585    | Action Not Valid In Current Call State | Call isn't established or is disconnected: wait for the call to be established before retrying the media action. |
| CreateCallFailed               | 405  | 8520    | Functionality not supported at this time | Expected Error: Workflow not currently supported. Check our release blog to see if there's an updated SDK that has enabled these functionalities. See the Call Automation known limitations page for a list of not supported workflows. |
| CreateCallFailed               | 412  | 8583    | Precondition Failed | Reference [this page](../../../../../how-tos/call-automation/control-mid-call-media-actions.md#media-action-compatibility-table) listing incompatible media actions to ensure you aren't running or queueing incompatible actions. |
| CreateCallFailed               | 400  | 8567    | ACS Resource Service Principal Not Enabled | The Azure Cognitive Service Resource isn't configured properly. See this [page](../../../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md) for a guide on setting up your Azure Cognitive Service Resource. |
| CreateCallFailed               | 405  | 8522    | Missing configuration | Check error message for more context on which configuration needs to be established. This configuration needs to happen when invoking the AnswerCall API. |
| CallDisconnected               | 200  | 0       | Call ended successfully by the local participant. | No action needed; call ended as expected. |
| CallDisconnected               | 200  | 4521    | Participant abruptly disconnected (e.g., closed app, tab, or browser without hanging up). | Recommend graceful hang-up logic in client. Use client logs to verify if app was force-closed. |
| CallDisconnected               | 200  | 5000    | Participant removed by another participant. | Check call control logic for removal operations. Confirm if the removal was intentional. |
| CallDisconnected               | 200  | 5010    | Call ended because only one participant remained. | This is expected behavior. Rejoin with multiple participants if call was meant to continue. |
| CallDisconnected               | 200  | 5013    | Call ended because no one else joined the group call. | Check timing of participant joins. |
| CallDisconnected               | 200  | 7000    | Call ended by Azure Communication Services Call Automation or a server-side bot. | Confirm if bot logic triggered end of call. Review bot implementation and call flow. |
| CallDisconnected               | 200  | 7015    | Call ended by service after successful transfer. | No action needed; call was terminated as part of expected transfer behavior. |
| CallDisconnected               | 487  | 0       | Call ended successfully as caller canceled the call. | No action needed. Ensure cancellation is intentional. |
| CallDisconnected               | 487  | 10003   | Call was accepted by another endpoint (e.g. different bot answered the call). Ensure bots only answer calls directed to them.| Application logic should check for endpoint priority or re-route logic. |
| CallDisconnected               | 487  | 10024   | Call was declined by all callee endpoints. | No action needed. |
| CallDisconnected               | 500  | 10045   | Azure Communication Services infrastructure error. | Capture logs and contact support if issue persists. |
| CallDisconnected               | 503  | 560503  | Unexpected server error. | Internal server error, collect logs and open support ticket |
| CreateCallFailed               | 401  | 10009   | Unauthenticated identity. | Ensure Azure Communication Services token is valid, scoped, and not expired. |
| CreateCallFailed               | 403  | 510403  | Call marked as spam and blocked. | Review outbound calling pattern. Ensure it complies with anti-spam policies. |
| CreateCallFailed               | 403  | 560403  | Call was forbidden, canceled, or rejected. | Validate permissions and target user status. |
| CreateCallFailed               | 404  | 4500    | Call ID does not exist or call has already ended. | Double check call ID and call lifecycle. Ensure you’re not referencing an expired call. |
| CreateCallFailed               | 480  | 10078   | Remote participant not registered or reachable. | Confirm callee’s client app is running and registered. Retry later if needed. |
| CreateCallFailed               | 480  | 560480  | No answer from callee. | Confirm user availability. |
| CreateCallFailed               | 487  | 540487  | Call canceled by the originator. | No action needed. Verify the source application canceled the call as intended. |
| ConnectFailed                  | 408  | 10057   | Timeout during meeting join or call acceptance. | Validate participant's presence and client readiness. |
| ConnectFailed                  | 429  | 10110   | Maximum call duration exceeded. | Review call duration policies. Consider scheduling reconnection if needed. |
| ConnectFailed                  | 480  | 10076   | Target user registered but offline. | Target must be online. Confirm app status or fallback to voicemail or async message. |
| ConnectFailed                  | 484  | 560484  | Invalid or incomplete callee address. | Validate callee identifier (e.g., phone number, ACS ID). Correct and retry. |
| AnswerFailed                   | 401  | 71005   | Token validation error while answering the call. | Ensure AnswerCall request has a valid, non-expired token. |
| AnswerFailed                   | 404  | 404     | Unable to answer. | Collect logs and open support ticket |
| AnswerFailed                   | 408  | 4506    | Timeout – callee didn’t respond in time. | Validate application availability and push notifications. |
| AnswerFailed                   | 495  | 4507    | Invalid Azure Communication Services token. | Check token generation and scope. Regenerate token if needed. |
| AnswerFailed                   | 430  | 10315   | Failed to deliver signaling message to client. | Ensure client app is reachable and can receive signaling messages. |
| AnswerFailed                   | 430  | 10317   | Client did not acknowledge signaling request. | Check client app responsiveness. Restart app or device if needed. |
| AnswerFailed                   | 480  | 10077   | Target registered but not online at the time of the call. | Ensure callee has active session and is not in background/sleep state. |
| AnswerFailed                   | 487  | 10004   | Timeout – user did not accept or reject in time. | Consider adding fallback path or extended ringing duration. |
| AnswerFailed                   | 487  | 4501    | Declined or failed to generate media offer (e.g., endpoint mismatch). | Verify media capabilities and ensure compatibility across participants. |
| AnswerFailed                   | 490  | 4502    | Network issue – browser failed to complete the request. | Validate client connectivity and allowlist ACS domains in network settings. |
| AnswerFailed                   | 496  | 7       | Lost network connection; retries failed. | Log and monitor recurring disconnects for further analysis. |


### Generic error codes
#### 2xx codes
A 2xx code represents a successful response. The subcode for successful responses will be 0.

#### 4xx codes 
A 4xx Code represents a client error.

| Status Code | Description |
| --- | --- |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 405 | Method not allowed |
| 406 | Not acceptable |
| 408 | Timed out |
| 409 | Conflict |
| 412 | Precondition failed |
| 413 | Request entity too large |
| 426 | Upgrade required |
| 429 | Too many requests |
| 481 | Transaction doesn't exist |
| 487 | Canceled |

#### 5xx codes
A 5xx code represents a server error.

| Status Code | Description |
| --- | --- |
| 500 | Internal server error |
| 501 | Not implemented |
| 502 | Bad gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

#### 6xx codes
A 6xx code represents a global error.

| Status Code | Description |
| --- | --- |
| 603 | Declined |

### Generic subcodes 
| Subcode | Description |
| --- | --- |
| 0 | Success |
| 7000 | Graceful |
| 7500 | Unsupported AAD Identity |
| 7501 | Invalid Token |
| 7502 | Access Not Enabled |
| 7504 | Insufficient Application Permissions |
| 7505 | Enterprise Tenant Mismatch |
| 7506 | Untrusted Certificate |
| 7507 | Call Source Identity Invalid |
| 7508 | Unsupported ACS Identity |
| 7509 | Hmac Validation Error |
| 7510 | Managed Identity Validation Error |
| 7600 | Resource Access Not Enabled |
| 7601 | Invalid ACS Source Identity |
| 7602 | Invalid ACS Target Identity |
| 7603 | Invalid ACS Identity |
| 7604 | Unauthorized Teams Interop Scenario |
| 7605 | Unauthorized Teams Recording Interop Scenario |
| 7606 | Unauthorized ACS Resource For Cognitive Actions |
| 8500 | Invalid Media Mode |
| 8501 | Call Not Established |
| 8502 | My Participant ID Not Available |
| 8503 | Call Media State Audio Inactive |
| 8504 | Media Streams Unavailable |
| 8505 | Multiple Participants With Replacement |
| 8506 | Non Compliance Recording Call |
| 8508 | Operation Canceled |
| 8509 | Max Silence Timeout Reached |
| 8510 | Initial Silence Timeout Reached |
| 8511 | Play Prompt Failed |
| 8512 | Play Beep Failed |
| 8513 | Media Receive Timeout |
| 8514 | Stop Tone Detected |
| 8515 | Max Record Duration Reached |
| 8516 | Call Throttled |
| 8517 | Call Tenant ID Mismatch |
| 8518 | Call Exception |
| 8519 | Conflict |
| 8520 | Not Implemented |
| 8521 | Too Many Hops |
| 8522 | Not Found |
| 8523 | Invalid Argument |
| 8524 | Invalid Participants Count For Compliance Recording |
| 8525 | Non Recorded Party |
| 8526 | Invalid Join Token |
| 8527 | Invalid Join URL |
| 8528 | Call Terminated |
| 8529 | Call Throttled Monthly Limit Reached |
| 8530 | Call Throttled Active Calls Limit Reached |
| 8531 | Max Digits Received |
| 8532 | Inter Digit Timeout Reached |
| 8533 | Dtmf Option Matched |
| 8534 | Incorrect Tone Entered |
| 8535 | Invalid File Format |
| 8536 | File Download Failed |
| 8537 | Keep Alive Timeout Reached |
| 8538 | Callee Declined |
| 8539 | Callee Busy |
| 8540 | Callee Busy Everywhere |
| 8541 | Callee Unavailable |
| 8542 | Call Canceled |
| 8543 | Call Doesn't Exist |
| 8544 | Callee Unreachable |
| 8545 | Speech Option Matched |
| 8546 | Callee Sent Invalid Request |
| 8547 | Speech Option Not Matched |
| 8548 | Call isn't Group Call |
| 8549 | Retarget Conversation Creation Failed |
| 8550 | Retarget Media Negotiation Failed |
| 8551 | Retarget Not Supported |
| 8552 | Can't Remove Organizer |
| 8553 | Duplicate Recording |
| 8554 | Participant Out Of Meeting Audio Mix |
| 8555 | Retarget Already In Progress |
| 8556 | Action Not Supported For CR Call |
| 8557 | Wrong Format Type |
| 8558 | Participant Not Present |
| 8559 | Duplicate Single Dialout |
| 8560 | Join Conversation Blocked Due To Locked Meeting |
| 8561 | Invalid Join Meeting ID |
| 8562 | Recording Mode Not Supported |
| 8563 | Speech Not Recognized |
| 8564 | Speech Service Connection Error |
| 8565 | Cognitive Services Error |
| 8566 | Unmute Operation Not Allowed |
| 8567 | ACS Resource Service Principal Not Enabled |
| 8568 | Managed Identity For Cognitive Service Request Failed |
| 8571 | Recording Operation Conflict |
| 8569 | Speech Recognized |
| 8570 | Cognitive Services Speech Recognition Error |
| 8572 | Play Service Shutdown |
| 8573 | Pause Resume Method Not Allowed |
| 8578 | Transcription Failed |
| 8579 | Transcription Canceled |
| 8580 | Transcription Service Shutdown |
| 8581 | Invalid Stream URL |
| 8582 | Play Source Text Or Ssml Empty |
| 8583 | Precondition Failed |
| 8585 | Action Not Valid In Current Call State |
| 8586 | Incoming Call Not Acknowledged By Bot |
| 8587 | Incoming Call Not Answered Within Time |
| 8588 | Record Completed And Media Receive Timeout |
| 8589 | Record Throttled |
| 8594 | Update Meeting State Failed |
| 8603 | Media Streaming Failed |
| 8604 | Media Streaming Canceled |
| 8605 | Transcription Custom Speech Model Not Supported |
| 8606 | Communication Identifier Creation Failed |
| 8607 | Transfer Operation Conflict |
| 8608 | Recording Participant Client Error |
| 8609 | Invalid Join Response From Bot |
| 8610 | No Response From Bot On Notification |
| 8613 | Call Throttled Live Captions Limit Reached |
| 9001 | Unknown Error From Underlying Service |
| 9002 | Timeout Error From Underlying Service |
| 9003 | Operation Canceled Error |
| 9998 | Fatal Error |
| 9999 | Unknown |

## SIP and Q.850 Diagnostic Codes in Callback Events

Call Automation callback events now support **low-level diagnostic data** via `SipDetails` and `Q850Details` fields, added to the existing `ResultInformation` object.  
These diagnostics surface protocol-level insights from the **telecom signaling layer**, helping troubleshoot issues such as call drops, unreachable destinations, or unexpected rejections in PSTN and SIP/VoIP scenarios.

---

### Availability

> [!NOTE]
> The presence of `SipDetails` and `Q850Details` is **entirely dependent** on whether the involved SBC or telecom carrier provides this information.  
>
> If the Session Border Control (SBC)/carrier returns relevant diagnostics after a corresponding call automation signaling request, the resulting event will include `SipDiagnosticInfo` within `ResultInformation`.

---

### Affected Events

The following events may include `SipDiagnosticInfo` in their `ResultInformation`:

- `RemoveParticipantsFailed`
- `AddParticipantsFailed`
- `CreateCallFailed`
- `AnswerFailed`
- `CallDisconnected`
- `TransferFailed`
- `CanAddParticipantFailed`

In practice, **any callback event containing `ResultInformation`** can carry these diagnostics when provided by the SBC/carrier.

---

### Structure

Each diagnostic is represented as an object:

| Property  | Type    | Description                                   |
|-----------|---------|-----------------------------------------------|
| `Code`    | Integer | SIP or Q.850 code (e.g., `486`, `16`)         |
| `Message` | String  | Human-readable reason (e.g., "Busy Here")     |

These fields are optional and appear only when supplied by the SBC/carrier.

---

### Example

```json
{
  "ResultInformation": {
    "Code": 500,
    "SubCode": 560503,
    "Message": "Unexpected server error",
    "SipDetails": {
      "Code": 486,
      "Message": "Busy Here"
    },
    "Q850Details": {
      "Code": 17,
      "Message": "User busy"
    }
  }
}
```
