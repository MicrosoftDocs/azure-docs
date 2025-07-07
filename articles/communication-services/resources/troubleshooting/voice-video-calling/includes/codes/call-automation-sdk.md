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

### Most common Call Automation error codes
| Code | Subcode | Description | Mitigation |
| --- | --- | --- | --- |
| 404 | 8522 | A generic error code that indicates that the resource isn't found. Resources can include calls and participants. | Double check call status: the call may have already ended, or the participant has left the call. |
| 400 | 8523 | A generic error code that indicates that something in the request body is invalid. | Check to make sure all of the parameters are valid. Refer to the error message to determine which parameter is throwing the error. |
| 400 | 8501 | Action Not Supported Call Not Established | The action associated with the error message was activated while the call was not active. Ensure that new call actions aren't initiated after the call has been disconnected. This error could also result from actions invoked while the call is active if they're close to the call disconnected time. |
| 400 | 8500 | Invalid Media Mode | Check the status of your media operations to see if any of them are already active, or if target participant is already in a media operation. If there's an active media operation, wait for the operation to finish and then retry. |
| 400 | 8559 | Action Not Supported Only One Single Dialout App Allowed | Duplicate start recording request, recording already initiated or in progress. Double check recording status to ensure it's inactive before submitting a new start recording call. |
| 400 | 8528 | Action not supported call terminated | The action associated with the error message was activated while the call was terminated. Ensure that new call actions aren't initiated after the call is terminated. This error could also result from actions invoked while the call is active if they're close to the call termination time. |
| 409 | 8519 | Conflict | Check to make sure multiple actions aren't being performed on the same resource in parallel. Refer to error message to identify which two actions are in conflict. |
| 403 | 7507 | Call Source Identity Invalid | Application identity from authorization token didn't match application identity in call source. Check to make sure you're using the connection string from the ACS resource the incoming call webhook was configured in (the phone number has to be owned by the same ACS resource answering the call). |
| 403 | 7504 | Insufficient Application Permissions | Generic code for insufficient permissions, check error message for context on what resource is lacking permissions. |
| 400 | 8585 | Action Not Valid In Current Call State | Call isn't established or is disconnected: wait for the call to be established before retrying the media action. |
| 405 | 8520 | Functionality not supported at this time | Expected Error: Workflow not currently supported. Check our release blog to see if there's an updated SDK that has enabled these functionalities. See the Call Automation known limitations page for a list of not supported workflows. |
| 412 | 8583 | Precondition Failed | Reference [this page](../../../../../how-tos/call-automation/control-mid-call-media-actions.md#media-action-compatibility-table) listing incompatible media actions to ensure you aren't running or queueing incompatible actions. |
| 400 | 8567 | ACS Resource Service Principal Not Enabled | The Azure Cognitive Service Resource isn't configured properly. See this [page](../../../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md) for a guide on setting up your Azure Cognitive Service Resource. |
| 405 | 8522 | Missing configuration | Check error message for more context on which configuration needs to be established. This configuration needs to happen when invoking the AnswerCall API. | 

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


