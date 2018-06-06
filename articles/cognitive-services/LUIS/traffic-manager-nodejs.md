---
title: Use Microsoft Azure Traffic Manager to increase endpoint quota in Language Understanding (LUIS) in Node.js- Azure | Microsoft Docs
description: Use Microsoft Azure Traffic Manager  to spread endpoint quota across several subscriptions in Language Understanding (LUIS) to increase endpoint quota in Node.js
author: v-geberr
manager: kaiqb
services: cognitive-services
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/06/2018
ms.author: v-geberr
#Customer intent: As an advanced user, I want to understand how use multiple LUIS subscription keys to increase the number of endpoint requests my application receives.
---

# Use Microsoft Azure Traffic Manager to manage endpoint quota across keys
Language Understanding (LUIS) offers the ability to increase the endpoint request quota beyond a single key's quota. This is done by creating more keys for LUIS and adding them to the LUIS application on the **Publish** page in the **Resources and Keys** section. 

The client-application has to manage the traffic across the keys. LUIS does not do that for you. 

This article explains how to manage the traffic across keys using Node.js and [Traffic Manager][traffic-manager-marketing].

## Increase total endpoint quota with more subscription keys

1. In the Azure portal, create two **Language Understanding** keys, one in the West US and one in the East US. In real-world usage create as many keys as needed in the pricing tier to solve your endpoint request expectations. 

2. In the [LUIS][LUIS] website, on the **Publish** page, add keys to the app. The example URL in the endpoint column uses a GET request with the subscription key as a query parameter. Copy all these URLs. They will be used as part of the Traffic Manager configuration later in this article.

https://**westus**.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscriptionKey>&q=
https://**eastus**.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscriptionKey>&q=

## Manage traffic across keys with Traffic Manager
Traffic Manager creates a new DNS access point for your endpoints. It does not act as a gateway or proxy but strictly at the DNS level. This example won't change any DNS records. It uses a DNS library to communicate with Traffic Manager to get the correct endpoint for that specific request. _Each_ request intended for LUIS first requires a Traffic Manager request to determine which LUIS endpoint to use. 

Traffic Manager polls the endpoints periodically to make sure the endpoint is still available. The Traffic Manager URL polled needs to be accessible with a GET request and return a 200. The endpoint URL on the **Publish** page does this. Since each subscription key has a different route and query string parameters, each subscription key needs a different polling path. Each time Traffic Manager polls, it does cost a quota request. The query string parameter **q** of the LUIS endpoint is the utterance sent to LUIS. This parameter will be used to add Traffic Manager polling to the LUIS endpoint log as a debugging technique while getting Traffic Manager configured.

Because each LUIS endpoint needs its own path, it will need its own Traffic Manager profile. In order to manage across profiles, create a nested Traffic Manager architecture. One parent profile will point to the children profiles and manage traffic across them.

## Configure Traffic Manager with nested Profiles with PowerShell
In the [Azure][azure-portal] portal, open the PowerShell window. The icon for the PowerShell window is the **>_** in the top navigation bar. By using PowerShell from the portal, you are sure to get the latest version and you are authenticated. PowerShell in the portal requires a [Azure Storage] account. 

### Create Azure resource for the Traffic Manager profiles
Before creating the Traffic Manager profiles, create a resource group to contain all the profiles. In the following example, the name of the resource group is `luis-traffic-manager` and the region is `West US`. The region of the resource group stores metadata about the group. It won't slow down your resources if they are in another region. 

```PowerShell
> $resourcegroup = New-AzureRmResourceGroup -Name luis-traffic-manager -Location "West US"
```

### Create the East US Traffic Manager profile with PowerShell
To create the East US Traffic Manager profile, there are several steps: create profile, add endpoint, and set endpoint. A Traffic Manager profile can have many endpoint but each endpoint has the same validation path. Because the LUIS endpoint URLs for the east and west subscriptions are different due to region and subscription key, so each LUIS endpoint is also a single endpoint in the profile. 

```PowerShell
New-AzureRmTrafficManagerProfile -Name luis-profile-eastus -ResourceGroupName luis-traffic-manager -TrafficRoutingMethod Performance -RelativeDnsName luis-dns-eastus -Ttl 30 -MonitorProtocol HTTPS -MonitorPort 80 -MonitorPath "/luis/v2.0/apps/cc6502f8-cb50-42fb-9192-e064bad2ec4c?subscription-key=f17b82eecf024cfcbe8fdb5a54e4017c&verbose=true&timezoneOffset=0&q=traffic-manager"
```

Change the variables marked with `<>` to your own values or the values in the following table:

|Configuration parameter|Variable name or Value|Purpose|
|--|--|--|
|-Name|luis-profile-eastus|Traffic Manager name in Azure portal|
|-ResourceGroupName|luis-traffic-manager|Created in previous section|
|-TrafficRoutingMethod|Performance|For more information, see [Traffic Manager routing methods][routing-methods]. If using performance, the URL request to the Traffic Manager must come from the region of the user. If going through a chatbot or other application, it is the chatbot's responsibility to mimic the region in the call to the Traffic Manager. |
|-RelativeDnsName|luis-dns-eastus|This is the subdomain for the service: luis-dns-eastus.trafficmanager.net|

### Create Traffic Manager profile for each endpoint

### Create Traffic Manager parent profile 

### Validate Traffic Manager polling works

### Validate DNS response from Traffic Manager works

## Create middle layer to use Traffic Manager

## Test middle layer

## Clean up

## Next steps

[traffic-manager-marketing]: https://azure.microsoft.com/services/traffic-manager/
[traffic-manager-docs]: https://docs.microsoft.com/azure/traffic-manager/
[LUIS]:luis-reference-regions.md#luis-website
[azure-portal]:https://portal.azure.com/
[azure-storage]:https://azure.microsoft.com/services/storage/
[routing-methods]:https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-routing-methods