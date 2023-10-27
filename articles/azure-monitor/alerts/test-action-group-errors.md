---
title: Test Notification Troubleshooting Guide
description: Detailed description of error codes and actions to take when troubleshooting the test action group feature.
ms.topic: conceptual
ms.date: 11/15/2022
ms.reviewer: jagummersall

---

# Test notification troubleshooting guide.

This article describes troubleshooting steps for error messages you may get when using the test action group feature.

## Troubleshooting error codes for actions

The error messages in this section are related to these **actions**:

 - Automation runbook
 - Azure Function
 - Logic App
 - Webhook
 - Secure Webhook
 - ITSM

> [!NOTE]
> Several errors could be due to a misunderstanding of your schema. Click here to learn more information about [Common alert schema](./alerts-common-schema.md) and [Non-common alert schema](./alerts-non-common-schema-definitions.md).

| Error Codes | Troubleshooting Steps |
| ------------| --------------------- |
|HTTP 400: The \<action\> returned a 'bad request' error. |Check the alert payload received on your endpoint, and make sure the endpoint can process the request successfully.
|HTTP 400: The \<action\> couldn't be triggered because this alert type doesn't support the common alert schema. |1. Check if the alert type supports common alert schema.</br>2. Change the “Enable the common alert schema” in the action group action to “No” and retry.
|HTTP 400: The \<action\> could not be triggered because the payload is empty or invalid. | Check if the payload is valid, and if it's included as part of the request.
|HTTP 400: The \<action\> could not be triggered because Microsoft Entra auth is enabled but no auth context provided in the request. | 1. Check your Secure Webhook action settings.</br>2. Check your Microsoft Entra configuration. For more information, see [action groups](action-groups.md). |
|HTTP 400: ServiceNow returned error: No such host is known | Check your ServiceNow host url to make sure it's valid and retry. For more information, see [Connect ServiceNow with IT Service Management Connector](./itsmc-connections-servicenow.md) | 
|</br>HTTP 401: The \<action\> returned an "Unauthorized" error.</br>HTTP 401: The request was rejected by the \<action\> endpoint. Make sure you have the required authorization. | 1. Check if the credential in the request is present and valid.</br>2. Check if your endpoint correctly validates the credentials from the request. |
|</br>HTTP 403: The \<action\> returned a "Forbidden" response.</br>HTTP 403: Couldn't trigger the \<action\>. Make sure you have the required authorization.</br>HTTP 403: The \<action\> returned a 'Forbidden' response. Make sure you have the proper permissions to access it.</br>HTTP 403: The \<action\> is "Forbidden".</br>HTTP 403: Could not access the ITSM system. Make sure you have the required authorization. | 1. Check if the credential in the request is present, and valid.</br>2. Check if your endpoint correctly validates the credentials.</br>3. If it's Secure Webhook, make sure the Microsoft Entra authentication is set up correctly. For more information, see [action groups](action-groups.md).|
| HTTP 403: The access token needs to be refreshed.| Refresh the access token and retry. For more information, see [Connect ServiceNow with IT Service Management Connector](./itsmc-connections-servicenow.md) |
|HTTP 404: The \<action\> was not found.</br>HTTP 404: The \<action\> target workflow was not found.</br>HTTP 404: The \<action\> target was not found.</br>HTTP 404: The \<action\> endpoint could not be found.</br>HTTP 404: The \<action\> was deleted. | 1. Check if the endpoints included in the requests are valid, up and running and accepting the requests.</br>2. For ITSM, check if the ITSM connector is still active.|
|HTTP 408: The call to the \<action\> timed out.</br>HTTP 408: The call to the Azure App service endpoint timed out. | 1.Check the client network connection, and retry.</br>2. Check if your endpoint is up and running and can process the request successfully.</br>3. Clear the browser cache, and retry. |
|HTTP 409: The \<action\> returned a 'conflict' error. |Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully. |
|HTTP 429: The \<action\> could not be triggered because it is handling too many requests right now. |Check if your endpoint can handle the requests.</br>2. Wait a few minutes and retry. |
|HTTP 500: The \<action\> encountered an internal server error.</br>HTTP 500: Could not reach the Azure \<action\> server.</br>HTTP 500: The \<action\> returned an 'internal server' error.</br>HTTP 500: The ServiceNow endpoint returned an 'Unexpected' response.</li></ul> |Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully. |
|HTTP 502: The \<action\> returned a bad gateway error. |Check if your endpoint, and its downstream service(s) are up and running and are accepting requests. |
|HTTP 503: The \<action\> host is not running.</br>HTTP 503: The service providing the \<action\> endpoint is temporarily unavailable.</br>HTTP 503: The ServiceNow returned Service Unavailable|Check if your endpoint is up and running and is accepting requests. |
| The \<action\> could not be triggered because the \<action\> has not succeeded after XXX retries. Calls to the \<action\> will be blocked for up to XXX minutes. Try again in XXX minutes. |Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully.|

## Troubleshooting error codes for notifications

The error messages in this section are related to these **notifications**:

 - Email
 - SMS
 - Voice


| Error Codes | Troubleshooting Steps |
| ------------| --------------------- |
| The email could not be sent because the recipient address was not found.</br>The email could not be sent because the email domain is invalid, or the MX resource record does not exist on the Domain Name Server (DNS). |Verify the email address(es) is/are valid and try again. |
|</br>The email was sent but the delivery status could not be verified.</br>The email could not be sent because of a permanent error. |Wait a few minutes and retry. If the issue persists, file a support ticket. |
|</br>Invalid destination number.</br>Invalid source address.</br>Invalid phone number. | Verify that the phone number is valid and retry.
| The message could not be sent because it was blocked by the recipient's provider. | 1. Verify if you can receive SMS from other sources.</br>2. Check with your service provider. |
|</br>The message could not be sent because the delivery timed out.</br> The message could not be delivered to the recipient. |Wait a few minutes and retry. If the issue still persists, file a support ticket. | 
|The message was sent successfully, but there was no confirmation of delivery from the recipient's device. | 1. Make sure your device is on, and service is available.</br>2. Wait for a few minutes and retry. |
|The call could not go through because the recipient's line was busy. | 1. Make sure your device is on, and service is available, and not busy.</br>2. Wait for a few minutes and retry. |
| The call went through, but the recipient did not select any response. The call might have been picked up by a voice mail service. |Make sure your device is on, the line is not busy, your service is not interrupted, and call does not go into voice mail. |
| HTTP 500: There was a problem connecting the call. Please contact Azure support for assistance. | Wait a few minutes and retry. If the issue still persists, file a support ticket. |

> [!NOTE]
> If your issue persists after you try to troubleshoot, please fill out a support ticket here: [Help + support - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## See Also
- [Action Groups](action-groups.md).
- [Common alert schema](./alerts-common-schema.md)
- [Non-common alert schema](./alerts-non-common-schema-definitions.md)
- [Connect ServiceNow with IT Service Management Connector](./itsmc-connections-servicenow.md)
