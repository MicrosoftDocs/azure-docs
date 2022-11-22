---
title: Test Notification Troubleshooting Guide
description: Detailed description of error codes and actions to take when troubleshooting the test action gropu feature.
ms.topic: conceptual
ms.date: 11/15/2022
ms.reviewer: jagummersall

---

# Action Group Test Notificaiton Troubleshooting Error Codes

> [!NOTE]
> This document provides troubleshooting steps that correspond with error messages you may recieve when utilizing the test action group feature.

## Troubleshooting error codes for actions

The error message in this section will apply to the followign **actions**:</br>
     - Automation runbook</br>
     - Azure Function</br>
     - Logic App</br>
     - Webhook</br>
     - Secure Webhook</br>
     - ITSM</br>

> [!NOTE]
> Several erros could be due to a misunderstanding of your schema. Click here to learn more information about [Common alert schema](./alerts-common-schema.md) and [Non-common alert schema](./alerts-non-common-schema-definitions.md).

| Error Codes | Troubleshooting Steps |
| ------------| --------------------- |
| HTTP 400: The *action* returned a 'bad request' error. | 1. Check the alert payload received on your endpoint, and make sure the endpoint can process the request successfully.
| HTTP 400: The *action* could not be triggered because this alert type doesn't support the common alert schema. | 1. Check if the alert type supports common alert schema.</br>2. Change the “Enable the common alert schema” in the action group action to “No” and retry.
| HTTP 400: The *action* could not be triggered because the payload is empty or invalid. | 1. Check if the payload is valid, and if it is included as part of the request.
| HTTP 400: The *action* could not be triggered because AAD auth is enabled but no auth context provided in the request. | 1. Check your Secure Webhook action settings.</br>2. Check your AAD configuration. For more details, see Action Groups. |
| HTTP 400: ServiceNow returned error: No such host is known | 1. Check your ServiceNow host url to make sure it is valid and retry. For more details, see: [Connect ServiceNow with IT Service Management Connector](./itsmc-connections-servicenow.md) | 
| HTTP 401: The *action* returned an 'Unauthorized' error.</br>HTTP 401: The request was rejected by the *action* endpoint. Make sure you have the required authorization. | 1. Check if the credential in the request is present, and valid.</br>2. Check if your endpoint correctly validates the credentials from the request. |
| HTTP 403: The *action* returned a 'Forbidden' response.</br>HTTP 403: Could not trigger the *action*. Make sure you have the required authorization.</br>HTTP 403: The *action* returned a 'Forbidden' response. Make sure you have the proper permissions to access it.</br>HTTP 403: The *action* is 'Forbidden'.</br>HTTP 403: Could not access the ITSM system. Make sure you have the required authorization. | 1. Check if the credential in the request is present, and valid.</br>2. Check if your endpoint correctly validates the credentials.</br>3. If it is Secure Webhook, make sure the AAD authentication is set up correctly. For more details, see: [Action Groups](./action_groups.md) |
| HTTP 403: The access token needs to be refreshed | 1. Please refresh the access token and retry. For more details, see: [Connect ServiceNow with IT Service Management Connector](./itsmc-connections-servicenow.md) |
| HTTP 404: The *action* was not found.</br>HTTP 404: The*action* target workflow was not found.</br>HTTP 404: The *action* target was not found.</br>HTTP 404: The *action* endpoint could not be found.</br>HTTP 404: The *action* was deleted. | 1. Check if the endpoints included in the requests are valid, up and running and accepting the requests.</br>2. For ITSM, check if the ITSM connector is still active.|
| HTTP 408: The call to the *action* timed out.</br>HTTP 408: The call to the Azure App service endpoint timed out. | 1.Check the client network connection, and retry.</br>2. Check if your endpoint is up and running and can process the request successfully.</br>3. Clear the browser cache, and retry. |
| HTTP 409: The *action* returned a 'conflict' error. | 1. Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully. |
| HTTP 429: The *action* could not be triggered because it is handling too many requests right now. | 1. Check if your endpoint can handle the requests.</br>2. Wait a few minutes and retry. |
| HTTP 500: The *action* encountered an internal server error.</br>HTTP 500: Could not reach the Azure *action* server.</br>HTTP 500: The *action* returned an 'internal server' error.</br>HTTP 500: The ServiceNow endpoint returned an 'Unexpected' response. | 1.Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully. |
| HTTP 502: The *action* returned a bad gateway error. | 1. Check if your endpoint, and its downstream service(s) are up and running and are accepting requests. |
| HTTP 503: The *action* host is not running.</br>HTTP 503: The service providing the *action* endpoint is temporarily unavailable.</br>HTTP 503: The ServiceNow returned Service Unavailable. | 1. Check if your endpoint is up and running and is accepting requests. |
| The *action* could not be triggered because the *action* has not succeeded after XXX retries. Calls to the *action* will be blocked for up to XXX minutes. Please try again in XXX minutes. | Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully.

## Troubleshooting error codes for notifications

The error message in this section will apply to the following **notifications**:</br>
     - Email</br>
     - SMS</br>
     - Voice</br>


| Error Codes | Troubleshooting Steps |
| ------------| --------------------- |
| The email could not be sent because the recipient address was not found.</br>The email could not be sent because the email domain is invalid, or the MX resource record does not exist on the Domain Name Server (DNS). | 1. Verify the email address(es) is/are valid and try again. |
| The email was sent but the delivery status could not be verified.</br>The email could not be sent because of a permanent error. | 1. Wait a few minutes and retry. If the issue persists, please file a support ticket. |
| Invalid destination number.</br>Invalid source address.</br>Invalid phone number.| 1. Verify that the phone number is valid and retry.
| The message could not be sent because it was blocked by the recipient's provider. | 1. Verify if you can receive SMS from other sources.</br>2. Check with your service provider. |
| The message could not be sent because the delivery timed out.</br>The message could not be delivered to the recipient. | 1. Wait a few minutes and retry. If the issue still persists, please file a support ticket. | 
| The message was sent successfully, but there was no confirmation of delivery from the recipient's device. | 1. Make sure your device is on, and service is available.</br>2. Wait for a few minutes and retry. |
| The call could not go through because the recipient's line was busy. | 1. Make sure your device is on, and service is available, and not busy.</br>2. Wait for a few minutes and retry. |
| The call went through, but the recipient did not select any response. The call might have been picked up by a voice mail service. | 1.Make sure your device is on, the line is not busy, your service is not interrupted, and call does not go into voice mail. |
| HTTP 500: There was a problem connecting the call. Please contact Azure support for assistance. | 1. Wait a few minutes and retry. If the issue still persists, please file a support ticket. |

> [!NOTE]
> If any of your issues persits, please fill out a support ticket here: [Help + support - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview)
