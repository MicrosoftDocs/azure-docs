---
title: Use the REST APIs to manage Azure Chaos Studio experiments
description: Run and manage a chaos experiment with Azure Chaos Studio using REST APIs.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021
---

# Use the Chaos Studio REST APIs to run and manage chaos experiments

> [!WARNING]
> Injecting faults can impact your application or service. Be careful not to disrupt customers.  

The Chaos Studio API provides support for starting experiments programmatically. You can also use the armclient and the Azure CLI to execute these commands from the console. Examples below are for the Azure CLI.

> [!Warning]
> These APIs are still under development and subject to change.

## REST APIs

The Squall REST APIs can be used to start and stop experiments, query target status, query experiment status, and query and delete subscription configurations. The `AZ CLI` utility can be used to perform these actions from the command line.

> [!TIP]
> To get more verbose output with the AZ CLI, append **--verbose** to the end of each command. This will return more metadata when commands execute, including **x-ms-correlation-request-id** which aids in debugging.

### Chaos Provider Commands

#### Enumerate details about the Microsoft.Chaos Resource Provider

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List all the operations of the Chaos Studio Resource Provider

```azurecli
az rest --method get --url "https://management.azure.com/providers/Microsoft.Chaos/operations?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List Chaos Provider Configurations

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/microsoft.chaos/chaosProviderConfigurations/?api-version={apiVersion}" --resource "https://management.azure.com" --verbose 
```

#### Create Chaos Provider Configuration

```azurecli
az rest --method put --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/microsoft.chaos/chaosProviderConfigurations/{chaosProviderType}?api-version={apiVersion}" --body @{providerSettings.json} --resource "https://management.azure.com"
```

### Chaos Target and Agent Commands

#### List All the Targets or Agents Under a Subscription

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/chaosTargets/?api-version={apiVersion}" --url-parameter "chaosProviderType={chaosProviderType}" --resource "https://management.azure.com"
```

### Chaos Experiment Commands

#### List all experiments in a resource group

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Chaos/chaosExperiments?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Get an experiment configuration details by name

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Create or update an experiment

```azurecli
az rest --method put --url "https://management.azure.com/{experimentId}?api-version={apiVersion}" --body @{experimentName.json} --resource "https://management.azure.com"
```

#### Delete an experiment

```azurecli
az rest --method delete --url "https://management.azure.com/{experimentId}?api-version={apiVersion}" --resource "https://management.azure.com" --verbose
```

#### Start an experiment

```azurecli
az rest --method post --url "https://management.azure.com/{experimentId}/start?api-version={apiVersion}"
```

#### Get statuses (History) of an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/statuses?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Get status of an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/status?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Cancel (Stop) an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/cancel?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List the details of the last two experiment executions

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/executiondetails?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List the details of a specific experiment execution

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/executiondetails/{executionDetailsId}?api-version={apiVersion}" --resource "https://management.azure.com"
```

## Parameter Definitions

| Parameter Name | Definition | Lookup |
| --- | --- | --- |
| {apiVersion} | Version of the API to be used when executing the command provided | Can be found in the [API documentation](/rest/api/chaosstudio/) |
| {experimentId} | Azure Resource Id for the experiment | Can be found in the [Chaos Studio Experiment Portal Blade](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) |
| {chaosProviderType} | Type or Name of Chaos Studio Provider | Available providers can be found in the [List of current Provider Config Types](chaos-studio-fault-providers.md) |
| {experimentName.json} | JSON containing the configuration of the chaos experiment | Generated by the user |
| {subscriptionId} | Subscription Id where the target resource is located | Can be found in the [Subscriptions Portal Blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) |
| {resourceGroupName} | Name of the resource group where the target resource is located | Can be fond in the [Resource Groups Portal Blade](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) |
| {executionDetailsId} | Execution Id of an experiment execution | Can be found in the [Chaos Studio Experiment Portal Blade](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) |
