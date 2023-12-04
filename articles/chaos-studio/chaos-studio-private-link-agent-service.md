---
title: Set up Private Link for a Chaos Studio agent-based experiment [Preview]
description: Understand the steps to set up a a chaos experiment using private link for agent-based experiments
services: chaos-studio
author: nikhilkaul-msft
ms.topic: how-to
ms.date: 12/4/23
ms.author: nikhilkaul
ms.service: chaos-studio
ms.custom: ignite-fall-2023
---
# How-to: Configure Private Link for Agent-Based experiments
In this guide, we'll show you the steps needed to configure Private Link for a Chaos Studio **Agent-based** Experiment. The current user experience is based on the private endpoints support enabled as part of public preview of the private endpoints feature. This experience will evolve with time as the feature is enhanced through public preview and GA lifecycle events. 

---
## Prerequisites

1. An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
2. First define your agent-based experiment by following the steps found [here](articles/chaos-studio/chaos-studio-tutorial-agent-based-portal.md).

> [!NOTE]
> If the target resource was created using the portal, then the chaos agent VM extension will be austomatically installed on the host VM. If the target is enabled using the CLI, then follow the Chaos Studio documentation to install the VM extension first on the virtual machine. Until you complete the private endpoint setup, the VM extension will be reporting an unhealthy state. This is expected.

<br/>

3. Ensure that the `Microsoft.Resources/EUAPParticipation` feature flag is enabled for your subscription. If you have used Chaos Studio in your subscription before, this may have already been done via the Portal when you created your first experiment. 

<br/>

The feature flag can be enabled using Azure CLI. Here is an example of how to do this:

```AzCLI
az feature register --namespace Microsoft.Resources --name "EUAPParticipation" --subscription <subscription id>
```

## Limitations

- You will need to use our **2023-10-27-preview REST API** to create and use private link for agent-based experiments ONLY. There is **no** support for private link for agent-based experiments in our GA-stable REST API until H1 2024. 

- The entire end-to-end for this flow requires some use of the CLI. While you can define your experiment using the existing flows via the Azure Portal, enabling the private endpoints will require using the CLI. 

# Steps

## Step 1: Make sure you have allowlisted Microsoft.Network/AllowPrivateEndpoints in your subscription

The first step you will need to take is to ensure that your desired subscription allows the Networking Resource Provider to operate. 

Ensure that the `Microsoft.Network/AllowPrivateEndpoints` feature flag is enabled for your subscription. If you have used Chaos Studio in your subscription before, this may have already been done via the Portal when you created your first experiment. 

<br/>

The feature flag can be enabled using Azure CLI. Here is an example of how to do this:

```AzCLI
az feature register --namespace Microsoft.Network --name "AllowPrivateEndpoints" --subscription <subscription id>
```

> [!NOTE]
> If you are going to be using private endpoints using manual requests across multiple subscriptions, you will need to ensure you register the Microsoft.Network Resource Provider (RP) in your respective tenants/subscriptions. See [Register RP](articles/azure-resource-manager/management/resource-providers-and-types.md) for more info about this.
> This step is not needed if you are using the same subscription across both the Chaos and Networking Resource Providers.
 
## Step 2: Create a Chaos Studio Private Access (CSPA) resource. 

To use Private endpoints for agent-based chaos experiments, you will need to create a new resource type called **Chaos Studio Private Accesses**. This will be the resource against which the private endpoints will be created.

> [!NOTE]
> Currently this resource can **only be created from the CLI**. See the example code below for how to do this:

 ```AzCLI
az rest --verbose --skip-authorization-header --header "Authorization=Bearer $accessToken" --uri-parameters api-version=2023-10-27-preview --method PUT --uri "https://centraluseuap.management.azure.com/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Chaos/privateAccesses/<CSPAResourceName>?api-version=2023-10-27-preview" --body ' 

{ 

    "location": "<resourceLocation>", 

    "properties": { 

        "id": "<CSPAResourceName>", 

        "name": "<CSPAResourceName>", 

        "location": "<resourceLocation>", 

        "type": "Microsoft.Chaos/privateAccesses", 

        "resourceId": "subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Chaos/privateAccesses/<CSPAResourceName>" 

    } 

}
 ```

| Name |Required | Type | Description
|-|-|-|-|
|subscriptionID|True|String|GUID that represents an Azure subscription ID|
|resourceGroupName|True|String|String that represents an Azure resource group|
|CSPAResourceName|True|String|String that represents the name you want to give your Chaos Studio Private Access Resource|
|resourceLocation|True|String|Location you want the resource to be hosted (must be a support region by Chaos Studio)|


## Step 3: Create your Virtual Network, Subnet, and Private Endpoint

[Set up your desired Virtual Network, Subnet, and Endpoint](articles/private-link/create-private-endpoint-portal.md) for the experiment if you haven't already.

Make sure you attach it to the same VM's VNET. Screenshots provide examples of doing this. It is important to note that you need to set the "Resource Type" to "Microsoft.Chaos/privateAccesses" as seen in the screenshot. 

[![Screenshot of resource tab of private endpoint creation](images/resourcePrivateEndpoint.png)](images/resourcePrivateEndpoint.png#lightbox)

[![Screenshot of VNET tab of private endpoint creation](images/resourceVNETCSPA.png)](images/resourceVNETCSPA.png#lightbox)


## Step 4: Map the agent host VM to the CSPA resource



