---
title: Test Notification Troubleshooting Guide
description: Detailed description of error codes and actions to take when troubleshooting the test action gropu feature.
ms.topic: conceptual
ms.date: 11/15/2022
ms.reviewer: jagummersall

---

# Action Group Test Notificaiton Error Message Guide

> [!NOTE]
> This table provides troubleshooting steps that correspond with error messages you may recieve when utilizing the test action group feature.


<table>
  <tr>
    <th>Action Type</th>
    <th>Error Code/Error Message</th>
    <th>Troubleshooting Ideas</th>
  </tr>
  <tr>
    <td rowspan="14">
      <ul>
        <li>Automation Runbook</li>
        <li>Azure Function</li>
        <li>Logic App</li>
        <li>Webhook</li>
        <li>Secure Webhook</li>
        <li>ITSM</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>HTTP 400: The Automation Runbook returned a bad request error.</li>
        <li>HTTP 400: The Azure Function returned a bad request error.</li>
        <li>HTTP 400: The Azure Logic App returned a bad request error.</li>
        <li>HTTP 400: The Secure Webhook returned a 'bad request' error.</li>
        <li>HTTP 400: The webhook returned a bad request error.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check the alert payload received on your endpoint, and make sure the endpoint can process the request successfully.</li>
        <li>To learn more about alert schema definition, go to: 
          <ul>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions">Common alert schema definitions</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-non-common-schema-definitions">Non-common alert schema definitions for Test Action Group</a></li>
          </ul>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 400: The Automation Runbook could not be triggered because this alert type doesn't support the common alert schema.</li>
        <li>HTTP 400: The Azure Function could not be triggered because this alert type doesn't support the common alert schema.</li>
        <li>HTTP 400: The Azure Logic App could not be triggered because this alert type doesn't support the common alert schema.</li>
        <li>HTTP 400: The Secure Webhook could not be triggered because this alert type doesn't support the common alert schema.</li>
        <li>HTTP 400: The webhook could not be triggered because this alert type doesn't support the common alert schema.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if the alert type supports common alert schema </li>
        <li>Change the “Enable the common alert schema” in the action group action to “No” and retry. </li>
        <li>To learn more about alert schema definition, go to: 
          <ul>

            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions">Common alert schema definitions</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-non-common-schema-definitions">Non-common alert schema definitions for Test Action Group</a></li>
          </ul>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 400: The Secure Webhook could not be triggered because the payload is empty or invalid.</li>
        <li>HTTP 400: The Webhook could not be triggered because the payload is empty or invalid.</li>
        <li>HTTP 400: Payload is not provided.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if the payload is valid, and if it is included as part of the request.</li>
        <li>To learn more about alert schema definition, go to: 
          <ul>

            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions">Common alert schema definitions</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-non-common-schema-definitions">Non-common alert schema definitions for Test Action Group</a></li>
          </ul>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 400: The Secure Webhook could not be triggered because AAD auth is enabled but no auth context provided in the request.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check your Secure Webhook action settings.</li>
        <li>Check your AAD configuration. For more details, see <a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups">Action Groups</a>.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 401: The Automation Runbook returned an 'Unauthorized' error.</li>
        <li>HTTP 401: The Azure Function returned an 'Unauthorized' error.</li>
        <li>HTTP 401: The request was rejected by the Secure Webhook endpoint. Make sure you have the required authorization.</li>
        <li>HTTP 401: The request was rejected by the webhook endpoint. Make sure you have the required authorization.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if the credential in the request is present, and valid.</li>
        <li>Check if your endpoint correctly validates the credentials from the request.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 403: The Automation Runbook returned a 'Forbidden' response.</li>
        <li>HTTP 403: The Azure Function returned a 'Forbidden' error.</li>
        <li>HTTP 403: Could not trigger the Azure Logic App. Make sure you have the required authorization.</li>
        <li>HTTP 403: The webhook returned a 'Forbidden' response. Make sure you have the proper permissions to access it.</li>
        <li>HTTP 403: The Itsm connector is 'Forbidden'.</li>
        <li>HTTP 403: Could not access the ITSM system. Make sure you have the required authorization.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if the credential in the request is present, and valid.</li>
        <li>Check if your endpoint correctly validates the credentials.</li>
        <li>If it is Secure Webhook, make sure the AAD authentication is set up correctly. For more details, see: <a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups">Action Groups</a>.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 404: The Automation Runbook was not found.</li>
        <li>HTTP 404: The Azure Function was not found.</li>
        <li>HTTP 404: The Azure Logic App was not found.</li>
        <li>HTTP 404: The Azure Logic App's target workflow was not found.</li>
        <li>HTTP 404: The Secure Webhook's target was not found.</li>
        <li>HTTP 404: The webhook's endpoint could not be found.</li>
        <li>HTTP 404: The webhook's target was not found.</li>
        <li>HTTP 404: The ITSM connector was deleted.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if the endpoints included in the requests are valid, up and running and accepting the requests.</li>
        <li>For ITSM, check if the ITSM connector is still active.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 408: The call to the Automation Runbook timed out.</li>
        <li>HTTP 408: The call to the Azure Function timed out.</li>
        <li>HTTP 408: The call to the Azure Logic App timed out.</li>
        <li>HTTP 408: The call to the Secure Webhook timed out.</li>
        <li>HTTP 408: The call to the Azure App service endpoint timed out.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check the client network connection, and retry.</li>
        <li>Check if your endpoint is up and running and can process the request successfully.</li>
        <li>Clear the browser cache, and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 409: The Automation Runbook returned a 'conflict' error.</li>
        <li>HTTP 409: The Azure Function returned a 'conflict' error.</li>
        <li>HTTP 409: The Secure Webhook returned a 'conflict' error.</li>
        <li>HTTP 409: The webhook returned a 'conflict' error.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 429: The Azure Function could not be triggered because it is handling too many requests right now.</li>
        <li>HTTP 429: The Secure Webhook could not be triggered because it is handling too many requests right now.</li>
        <li>HTTP 429: The webhook could not be triggered because it is handling too many requests right now.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if your endpoint can handle the requests.</li>
        <li>Wait a few minutes and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 500: The Automation Runbook encountered an internal server error.</li>
        <li>HTTP 500: The Azure Function encountered an internal server error.</li>
        <li>HTTP 500: Could not reach the Azure Logic App server.</li>
        <li>HTTP 500: The Secure Webhook returned an 'internal server' error.</li>
        <li>HTTP 500: The webhook encountered an internal server error.</li>
        <li>HTTP 500: The ServiceNow endpoint returned an 'Unexpected' response.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully.</li>
        <li>To learn more about alert schema definition, go to: 
          <ul>

            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions">Common alert schema definitions</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-non-common-schema-definitions">Non-common alert schema definitions for Test Action Group</a></li>
          </ul>
        </li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 502: The Automation Runbook returned a bad gateway error.</li>
        <li>HTTP 502: The Azure Function returned a bad gateway error.</li>
        <li>HTTP 502: The Azure Logic App encountered a bad gateway error.</li>
        <li>HTTP 502: The Secure Webhook returned a 'bad gateway' error.</li>
        <li>HTTP 502: The webhook returned a 'bad gateway' error.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if your endpoint, and its downstream service(s) are up and running and are accepting requests.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>HTTP 503: The Automation Runbook host is not running.</li>
        <li>HTTP 503: The Azure Function host is not running.</li>
        <li>HTTP 503: The service providing the Secure Webhook endpoint is temporarily unavailable.</li>
        <li>HTTP 503: The service providing the Webhook endpoint is temporarily unavailable.</li>
        <li>HTTP 503: The ServiceNow returned Service Unavailable.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check if your endpoint is up and running and is accepting requests.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>      
      <ul>
        <li>The Automation Runbook/Azure Function/LogicApp/Webhook/SecureWebhook could not be triggered because the runbook has not succeeded after XXX retries. Calls to the runbook will be blocked for up to XXX minutes. Please try again in XXX minutes.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check the alert payload received on your endpoint, and make sure the endpoint and its downstream service(s) can process the request successfully.</li>
        <li>To learn more about alert schema definition, go to: 
          <ul>

            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions">Common alert schema definitions</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-non-common-schema-definitions">Non-common alert schema definitions for Test Action Group</a></li>
          </ul>
        </li>
        <li>Wait XXX minutes and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td rowspan="2">
      <ul>
        <li>Email</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>The email could not be sent because the recipient address was not found.</li>
        <li>The email could not be sent because the email domain is invalid, or the MX resource record does not exist on the Domain Name Server (DNS).</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Verify the email address(es) is/are valid and try again.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The email was sent but the delivery status could not be verified.</li>
        <li>The email could not be sent because of a permanent error.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Wait a few minutes and retry. If the issue persists, please file a support ticket.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td rowspan="4">
      <ul>
        <li>SMS</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Invalid destination number.</li>
        <li>Invalid source address.</li>
        <li>Invalid phone number.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Verify that the phone number is valid and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The message could not be sent because it was blocked by the recipient's provider.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Verify if you can receive SMS from other sources.</li>
        <li>Check with your service provider.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The message could not be sent because the delivery timed out.</li>
        <li>The message could not be delivered to the recipient.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Wait a few minutes and retry. If the issue still persists, please file a support ticket.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The message was sent successfully, but there was no confirmation of delivery from the recipient's device.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Make sure your device is on, and service is available.</li>
        <li>Wait for a few minutes and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td rowspan="3">
      <ul>
        <li>Voice</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>The call could not go through because the recipient's line was busy.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Make sure your device is on, and service is available, and not busy.</li>
        <li>Wait for a few minutes and retry.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The call went through, but the recipient did not select any response. The call might have been picked up by a voice mail service.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Make sure your device is on, the line is not busy, your service is not interrupted, and call does not go into voice mail.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>HTTP 500: There was a problem connecting the call. Please contact Azure support for assistance.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Wait a few minutes and retry. If the issue still persists, please file a support ticket.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td rowspan="2">
      <ul>
        <li>ITSM</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>HTTP 400: ServiceNow returned error: No such host is known.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Check your ServiceNow host url to make sure it is valid and retry. For more details, see: <a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/itsmc-connections-servicenow">Connect ServiceNow with IT Service Management Connector</a>.</li>
      </ol>
    </td>
  </tr>
  <tr>
    <td>
      <ul>
        <li>HTTP 403: The access token needs to be refreshed.</li>
      </ul>
    </td>
    <td>
      <ol>
        <li>Please refresh the access token and retry. For more details, see: <a href="https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/itsmc-connections-servicenow">Connect ServiceNow with IT Service Management Connector</a>.</li>
      </ol>
    </td>
  </tr>
</table>

> [!NOTE]
> If any of your issues persits, please fill out a support ticket.
