---
title: Assign a telephone number to a MS Graph bot
description: TODO
author: stkozak    
manager: rampras
services: azure-project-spool

ms.author: stkozak
ms.date: 06/19/2020
ms.topic: overview
ms.service: azure-project-spool

---
# Quickstart: Assign a telephone number to a MS Graph bot
Azure Communication Services lets you aquire and assign a telephone (PSTN) number to your MS Graph bot. This allows you to leverage [IVR capabilities of MS Graph](https://docs.microsoft.com/en-us/graph/api/resources/calls-api-ivr-overview?view=graph-rest-1.0) to build your own IVR scenarios over public switched telephone network (PSTN).

## Prerequisites

This article assumes you've already built your MS Graph bot using the [communications API of MS Graph](https://docs.microsoft.com/en-us/graph/api/resources/communications-api-overview?view=graph-rest-1.0) and that you have deployed the bot service to some public domain (ex. www.contoso.com/bot/api). As an example how to build such bot, please refer to a [sample IVR bot](https://github.com/microsoftgraph/microsoft-graph-comms-samples/tree/master/Samples/V1.0Samples/StatelessSamples/SimpleIvrBot).

To be able to assign a telephone number to your bot, you also **need to assign your bot an Azure Active Directory Application identity** by [registering it as an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app).

This quick start also requires:
- **Deployed Azure Communication Service resource.** Please follow a quickstart to [create an Azure Communication Resource](./create-a-communication-resource).
- **An ACS configured telephone number.** Check out the quick start for telephone number management for more information on how to aquire a telephone number. 

## Assign a telephone number to your bot

To assign an aquired telephone number to your bot, you need to execute a code snippet using either C# or JavaScript SDK.

```csharp
using System;
using Azure.Communication;

namespace TelephoneNumberAssignment
{
    class Program
    {
        static void Main(string[] args)
        {
            // Connection string to your Azure Communication Service resource
            string connectionString = "<connectionString>";
			
            // Azure AAD App ID (GUID) assigned to your bot
            string azureAadBotIdentity = "<Azure AAD App ID (GUID)>";
			
            // API Endpoint of your MS Graph bot service deployment
            string botWebhookUrl = "www.contoso.com/bot/api";
			
            // Telephone number aquired through ACS which will be assigned to the bot
            string aquiredNumber = "1-555-111-1111"; 
			
            var managementClient = new ManagementClient(connectionString);
            managementClient.AssignNumberToBot(aquiredNumber, azureAadBotIdentity, botWebhookUrl);          
        }
    }
}
```

After executing this step, you will be able to place a call to the number (in case of the abolve example "1-555-111-1111") and the call will be routed to your bot endpoint.
