---
title: include file
description: C# mute participant
services: azure-communication-services
author: Kunaal Punjabi
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/19/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites

- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Save the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.

## Mute participant during a call 

``` csharp
var target = new CommunicationUserIdentifier(ACS_USER_ID); 
var callConnection = callAutomationClient.GetCallConnection(CALL_CONNECTION_ID); 
await callConnection.MuteParticipantsAsync(target, "OperationContext").ConfigureAwait(false);
```

## Participant muted event

``` json
{
  "id": "9dff6ffa-a496-4279-979d-f6455cb88b22",
  "source": "calling/callConnections/401f3500-08a0-4e9e-b844-61a65c845a0b",
  "type": "Microsoft.Communication.ParticipantsUpdated",
  "data": {
    "participants": [
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": true
      },
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": false
      },
      {
        "identifier": {
          "rawId": "<ACS_USER_ID>",
          "kind": "communicationUser",
          "communicationUser": {
            "id": "<ACS_USER_ID>"
          }
        },
        "isMuted": false
      }
    ],
    "sequenceNumber": 4,
    "callConnectionId": "401f3500-08a0-4e9e-b844-61a65c845a0b",
    "serverCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkuc2t5cGUuY29tL2FwaS92Mi9jcC9jb252LXVzZWEyLTAxLmNvbnYuc2t5cGUuY29tL2NvbnYvRkhjV1lURXFZMENUY0VKUlJ3VHc1UT9pPTQmZT02MzgxNDkzMTEwNDk0NTM2ODQ=",
    "correlationId": "e47198fb-1798-4f3e-b245-4fd06569ad5c"
  },
  "time": "2023-03-21T17:22:35.4300007+00:00",
  "specversion": "1.0",
  "datacontenttype": "application/json",
  "subject": "calling/callConnections/401f3500-08a0-4e9e-b844-61a65c845a0b"
}
```

