---
title: Use the REST APIs to manage Azure Chaos Studio Preview experiments
description: Run and manage a chaos experiment with Azure Chaos Studio Preview by using REST APIs.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Use the Chaos Studio REST APIs to run and manage chaos experiments

> [!WARNING]
> Injecting faults can affect your application or service. Be careful not to disrupt customers.

The Azure Chaos Studio Preview API provides support for starting experiments programmatically. You can also use the Azure Resource Manager client and the Azure CLI to execute these commands from the console. The examples in this article are for the Azure CLI.

> [!Warning]
> These APIs are still under development and subject to change.

## REST APIs

You can use the Chaos Studio REST APIs to:
* Start, stop, and manage experiments.
* View and manage targets.
* Query experiment status.
* Query and delete subscription configurations.

Use the `AZ CLI` utility to perform these actions from the command line.

> [!TIP]
> To get more verbose output with the AZ CLI, append `--verbose` to the end of each command. This variable returns more metadata when commands execute, including `x-ms-correlation-request-id`, which aids in debugging.

### Chaos Studio provider commands

This section lists the Chaos Studio provider commands.

#### List details about the Microsoft.Chaos resource provider

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List all the operations of the Microsoft.Chaos resource provider

```azurecli
az rest --method get --url "https://management.azure.com/providers/Microsoft.Chaos/operations?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### List Chaos provider configurations

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/microsoft.chaos/chaosProviderConfigurations/?api-version={apiVersion}" --resource "https://management.azure.com" --verbose 
```

#### Create Chaos provider configuration

```azurecli
az rest --method put --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/microsoft.chaos/chaosProviderConfigurations/{chaosProviderType}?api-version={apiVersion}" --body @{providerSettings.json} --resource "https://management.azure.com"
```

### Chaos Studio target and agent commands

This section lists the Chaos Studio target and agent commands.

#### List all the targets or agents under a subscription

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/chaosTargets/?api-version={apiVersion}" --url-parameter "chaosProviderType={chaosProviderType}" --resource "https://management.azure.com"
```

### Chaos Studio experiment commands

This section lists the Chaos Studio experiment commands.

#### List all the experiments in a resource group

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Chaos/chaosExperiments?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Get an experiment's configuration details by name

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

#### Get past statuses of an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/statuses?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Get the status of an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/status?api-version={apiVersion}" --resource "https://management.azure.com"
```

#### Cancel (stop) an experiment

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

## Parameter definitions

| Parameter name | Definition | Lookup |
| --- | --- | --- |
| {apiVersion} | Version of the API to use when you execute the command provided | Can be found in the [API documentation](/rest/api/chaosstudio/) |
| {experimentId} | Azure Resource ID for the experiment | Can be found on the [Chaos Studio Experiment page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) |
| {chaosProviderType} | Type or Name of Chaos Studio provider | Available providers can be found in the [List of current Provider Config Types](chaos-studio-fault-providers.md) |
| {experimentName.json} | JSON that contains the configuration of the chaos experiment | Generated by the user |
| {subscriptionId} | Subscription ID where the target resource is located | Can be found on the [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) |
| {resourceGroupName} | Name of the resource group where the target resource is located | Can be found on the [Resource groups page](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) |
| {executionDetailsId} | Execution ID of an experiment execution | Can be found on the [Chaos Studio Experiment page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) |
