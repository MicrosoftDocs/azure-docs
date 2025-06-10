---
title: Answer Teams Phone calls from Call Automation
titleSuffix: An Azure Communication Services article
description: This article describes how to receive and answer incoming Teams Phone Extensibility calls on Azure Communication Services.
author: sofiar
manager: miguelher
services: azure-communication-services
ms.author: sofiar
ms.date: 05/19/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
---

# Answer Teams Phone calls from Call Automation

Use Azure Communication Services Call Automation to receive and answer calls for a Teams resource account.

[!INCLUDE [public-preview-notice.md](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Communication Services resource, see [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).

- A configured Event Grid endpoint. [Incoming call concepts - An Azure Communication Services concept document](../../concepts/call-automation/incoming-call-notification.md#receiving-an-incoming-call-notification-from-event-grid)

- A Microsoft Teams resource account with an associated phone number. [Create a new Teams Resource account](/powershell/module/teams/new-csonlineapplicationinstance)

- Create and host an Azure Dev Tunnel. [Instructions here](/azure/developer/dev-tunnels/get-started).

## Associate your Teams resource account with your Communication Services resource

Execute the following command. Make sure you have your Azure Communication Services resource identifier ready. To find it, see [Get an immutable resource identifier](/azure/communication-services/concepts/troubleshooting-info#get-an-immutable-resource-id).

```powershell
Set-CsOnlineApplicationInstance -Identity <appIdentity> -AcsResourceId <acsResourceId>
```

For more details, follow this guide: [Associate your Azure Communication Services resource with the Teams Resource account](/powershell/module/teams/set-csonlineapplicationinstance#-acsresourceid)

## Configure your Communication Services resource to accept calls for the Teams resource account

Send a request to the Microsoft Teams Extension access assignments API to allow receiving calls for the Teams resource account. For more details on how to authenticate the web request, follow this guide: [Authentication](/rest/api/communication/authentication)

The following example shows a request for a Teams Tenant with identifier `87d349ed-44d7-43e1-9a83-5f2406dee5bd` and a Teams resource account oid with identifier `e5b7f628-ea94-4fdc-b3d9-1af1fe231111`.

```http
PUT {endpoint}/access/teamsExtension/tenants/87d349ed-44d7-43e1-9a83-5f2406dee5bd/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview

{
    "principalType" : "teamsResourceAccount",
}
```

The `{principalType}` needs to be `teamsResourceAccount`.

### Response

The following example shows the response.

```http
HTTP/1.1 201 Created
Content-type: application/json

{
    "objectId": "e5b7f628-ea94-4fdc-b3d9-1af1fe231111",
    "tenantId": "87d349ed-44d7-43e1-9a83-5f2406dee5bd",
    "principalType" : "teamsResourceAccount",
}
```

## Stop accepting calls for the Teams resource account

Send a request to the Microsoft Teams Extension access assignments API to delete the entry for your Teams resource account.

```http
DELETE {endpoint}/access/teamsExtension/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview
```

### Response

```http
HTTP/1.1 204 NoContent
Content-type: application/json

{}
```

To verify that the Teams resource account is no longer linked with the Communication Services resource, you can send a GET request to the Microsoft Teams Extension access assignments API. Verify that its response status code is 404. 

```http
GET {endpoint}/access/teamsExtension/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview
```

## Receive and answer incoming calls

### Setup and host your Azure DevTunnel

DevTunnels create a persistent endpoint URL which allows anonymous access. We use this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```powershell
devtunnel create --allow-anonymous

devtunnel port create -p 8080

devtunnel host
```

### Handle Incoming Call event and answer the call

```csharp
app.MapPost("/api/incomingCall", async (
    [FromBody] EventGridEvent[] eventGridEvents,
    ILogger<Program> logger) =>
{
    if (eventGridEvent.TryGetSystemEventData(out object systemEvent))
    {
        switch (systemEvent)
        {
            case SubscriptionValidationEventData subscriptionValidated:
               var responseData = new SubscriptionValidationResponse
                {
                    ValidationResponse = subscriptionValidationEventData.ValidationCode
                };
                return Results.Ok(responseData);

            case AcsIncomingCallEventData incomingCall:
                var callbackUri = new Uri(new Uri(devTunnelUri), $"/api/callbacks");
                var options = new AnswerCallOptions(incomingCallContext, callbackUri);

                AnswerCallResult answerCallResult = await callAutomationClient.AnswerCallAsync(options);
                logger.LogInformation($"Answered call for connection id: {answerCallResult.CallConnection.CallConnectionId}");

                //Use EventProcessor to process CallConnected event

                var answerResult =  await answerCallResult.WaitForEventProcessorAsync();
                if (answerResult.IsSuccess)
                {
                   logger.LogInformation($"Call connected event received for connection id: {answerResult.SuccessResult.CallConnectionId}");
                   var callConnectionMedia = answerCallResult.CallConnection.GetCallMedia();
                }
                return Results.Ok();

            default:
                logger.LogInformation($"Received unexpected event of type {eventGridEvent.EventType}");
                return Results.BadRequest();
        }
    }
    return Results.Ok();
});
```
### Sample Incoming Call event with Teams resource account identifier and custom context (VoIP and SIP)

```json
{
  "to": {
    "kind": "unknown",
    "rawId": "28:orgid:cc123456-5678-5678-1234-ccc123456789"
  },
  "from": {
    "kind": "phoneNumber",
    "rawId": "4:+12065551212",
    "phoneNumber": {
      "value": "+12065551212"
    }
  },
  "serverCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkudGVhbXMubWljcm9zb2Z0LmNvbS9hcGkvdjIvZXAvY29udi11c3dlLTAyLXNkZi1ha3MuY29udi5za3lwZS5jb20vY29udi9fVERMUjZVS3BrT05aTlRMOHlIVnBnP2k9MTAtNjAtMTMtMjE2JmU9NjM4NTMwMzUzMjk2MjI3NjY1",
  "callerDisplayName": "+12065551212",
  "customContext":
  {
    "voipHeaders":
    {
        "X-myCustomVoipHeaderName": "myValue"
    },
  },
  "incomingCallContext": "<CALL_CONTEXT VALUE>",
  "correlationId": "2e0fa6fe-bf3e-4351-9beb-568add4f5315"
}
```

## Next steps
  
> [!div class="nextstepaction"]
> [REST API for Teams Phone extensibility](./teams-phone-extensiblity-rest-api.md)

## Related articles

- [Teams Phone extensibility overview](../../concepts/interop/tpe/teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quick start](./teams-phone-extensibility-quickstart.md)
