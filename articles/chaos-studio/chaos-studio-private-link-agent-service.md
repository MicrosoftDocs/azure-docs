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


1. **Enable Feature for Private Endpoints**:
   - Enable `Microsoft.Network/AllowPrivateEndpoints` feature on the subscription.

2. **CSS Engineer Steps**:
   - Create an incident in Azure Chaos Studio/Dri Squall queue with customer subscription details.

3. **Approve Feature Flag**:
   - Follow instructions in ARM AFEC - Public for feature enrollment.

### Create Target Resource

1. **Create VM Target Resource**:
   - Follow instructions in [Targets and capabilities in Azure Chaos Studio Preview](https://learn.microsoft.com/en-us/azure/chaos-studio/chaos-studio-targets-capabilities-preview).

2. **Install VM Extension**:
   - If using Azure CLI, install the Chaos Studio VM Extension.

### Set Up Private Endpoint

1. **Create and Attach Private Endpoint**:
   - Create a Private Endpoint using the private access resource and attach it to the VM virtual network.

2. **Map Target to CPAS Resource**:
   - Invoke the PUT Target API to map the private access resource with the target.

### Final Steps

1. **Update Agent VM Extension Settings**:
   - Update host entry to map the communication endpoint to the private IP generated during the private endpoint creation.

2. **Restart Azure Chaos Agent Service**:
   - For Windows VMs or Linux VMs, restart the Azure Chaos Agent service.

3. **Verification**:
   - After restart, ensure that the Chaos agent can communicate with the Agent Communication data plane service and that agent registration is successful.

## Additional Notes

- If outbound access to Microsoft Certificate Revocation List verification endpoints is blocked, update AgentSettings to disable CRL Verification check.

For detailed steps and examples, refer to the original [User Experience Private Endpoints for Chaos Agents](#) document.

---

Please replace placeholders like `<subscriptionID>`, `<resourceGroup>`, and `<cpasName>` with actual values when executing these instructions.
