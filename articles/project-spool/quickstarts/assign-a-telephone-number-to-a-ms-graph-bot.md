---
title: Assign a telephone number to a bot built using ACS Audio/Video SDK
description: TODO
author: stkozak    
manager: rampras
services: azure-project-spool

ms.author: stkozak
ms.date: 06/23/2020
ms.topic: overview
ms.service: azure-project-spool

---
# Quickstart: Assign a telephone number to a bot built using ACS Audio/Video SDK
Azure Communication Services lets you aquire and assign a telephone (PSTN) number to your bot built using the ACS Audio/Video SDK. This allows you to leverage [IVR capabilities of MS Graph](https://docs.microsoft.com/en-us/graph/api/resources/calls-api-ivr-overview?view=graph-rest-1.0) to build your own IVR scenarios over public switched telephone network (PSTN).

## Prerequisites

This article assumes you've already built your bot using the [ACS Audio/Video SDK](https://docs.microsoft.com/en-us/graph/api/resources/communications-api-overview?view=graph-rest-1.0) and that you have deployed the bot service to some public domain (ex. www.contoso.com/bot/api/). As an example how to build such bot, please refer to a [sample IVR bot](https://github.com/microsoftgraph/microsoft-graph-comms-samples/tree/master/Samples/V1.0Samples/StatelessSamples/SimpleIvrBot).

To be able to assign a telephone number to your bot, you also **need to assign your bot an Azure Active Directory Application identity** by [registering it as an application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app).

This quickstart also requires:
- **Deployed Azure Communication Service resource.** Please follow a quickstart to [create an Azure Communication Resource](./create-a-communication-resource).
- **An ACS configured telephone number.** Check out the quick start for telephone number management for more information on how to aquire a telephone number. NOTE: For private preview, please contact Nikolay Muravlyannikov (nmurav@microsoft.com) to aquire telephone numbers for your resource.

## Assign a telephone number to your bot programmatically

To assign an aquired telephone number to your bot programmatically, you need to execute a code snippet using either C# or JavaScript SDK.

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
			
            // Callback endpoint of your bot service deployment
            string botWebhookUrl = "www.contoso.com/bot/api/callback";
			
            // Telephone number aquired through ACS which will be assigned to the bot
            string aquiredNumber = "1-555-111-1111"; 
			
            var managementClient = new ManagementClient(connectionString);
            managementClient.AssignNumberToBot(aquiredNumber, azureAadBotIdentity, botWebhookUrl);          
        }
    }
}
```

After executing this step, you will be able to place a call to the number (in case of the abolve example "1-555-111-1111") and the call will be routed to your bot endpoint.

## Assign a telephone number to your bot via Azure Portal UI (Available soon)

Go to the Azure portal, select your Azure Communicate Service resource you created. In the list of aquired telephone numbers, select the one you want to use for your bot. Fill in the form with the callback endpoint of your bot service, Azure AAD App ID and click "Assign number" button.

Now all calls to the selected number will be routed to your bot.
