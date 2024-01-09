---
title: Use the REST APIs to manage Azure Chaos Studio experiments
description: Run and manage a chaos experiment with Azure Chaos Studio by using REST APIs.
services: chaos-studio
author: prasha-microsoft 
ms.topic: article
ms.date: 11/01/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Use the Chaos Studio REST APIs to run and manage chaos experiments

If you're integrating Azure Chaos Studio into your CI/CD pipelines, or you simply prefer to use direct API calls to interact with your Azure resources, you can use Chaos Studio's REST API. For the full API reference, visit the [Azure Chaos Studio REST API reference](https://learn.microsoft.com/rest/api/chaosstudio/). This page provides samples for using the REST API effectively.

This article assumes you're using Azure CLI to execute these commands, but you can adapt them to other standard REST clients.


You can use the Chaos Studio REST APIs to:
* Create, modify, and delete experiments
* View, start, and stop experiment executions
* View and manage targets
* Register and unregister your subscription with the Chaos Studio resource provider
* View available resource provider operations.

Use the `az cli` utility to perform these actions from the command line.

> [!TIP]
> To get more verbose output with Azure CLI, append `--verbose` to the end of each command. This variable returns more metadata when commands execute, including `x-ms-correlation-request-id`, which aids in debugging.

These examples have been reviewed with the generally available API version `2023-11-01`.

## Resource provider commands

This section lists the Chaos Studio provider commands.

### List details about the Microsoft.Chaos resource provider

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos?api-version={apiVersion}" 
```

### List all the operations of the Microsoft.Chaos resource provider

```azurecli
az rest --method get --url "https://management.azure.com/providers/Microsoft.Chaos/operations?api-version={apiVersion}" 
```

## Targets and capabilities

### List all target types available in a region

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/locations/targetTypes?api-version={apiVersion}" 
```

### List all capabilities available for a target

### Enable capabilities on a target

## Experiments

These commands relate to Chaos Studio experiments.

### List all the experiments in a resource group

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Chaos/experiments?api-version={apiVersion}"
```

### Get an experiment's configuration details by name

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}?api-version={apiVersion}"
```

### Create or update an experiment

```azurecli
az rest --method put --url "https://management.azure.com/{experimentId}?api-version={apiVersion}" --body @{experimentName.json} 
```

### Delete an experiment

```azurecli
az rest --method delete --url "https://management.azure.com/{experimentId}?api-version={apiVersion}"  --verbose
```

### Start an experiment

```azurecli
az rest --method post --url "https://management.azure.com/{experimentId}/start?api-version={apiVersion}"
```

### Get all executions of an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/executions?api-version={apiVersion}" 
```

### List the details of a specific experiment execution

If an experiment has failed, this can be used to find error messages and specific targets, branches, steps, or actions that failed.

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/executions/{executionDetailsId}?api-version={apiVersion}" 
```

### Cancel (stop) an experiment

```azurecli
az rest --method get --url "https://management.azure.com/{experimentId}/cancel?api-version={apiVersion}" 
```

## Other helpful commands

While these commands don't use the Chaos Studio API specifically, they can be helpful for using Chaos Studio effectively.

### View Chaos Studio resources with Azure Resource Graph

You can use the Azure Resource Graph [REST API](../governance/resource-graph/first-query-rest-api.md) to query resources used by Chaos Studio.

```azurecli
az rest --method post --url https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01 --body "{\"subscriptions\":[\"{subscriptionId}\"],\"query\":\"chaosresources \"}"
```

Alternatively, you can use Azure Resource Graph's `az cli` [extension](../governance/resource-graph/first-query-azurecli.md).

```azurecli-interactive
az graph query -q "chaosresources | summarize count() by type"
```

For example, if you want a summary of all the Chaos Studio targets active in your subscription by resource group, you can use:

```azurecli-interactive
az graph query -q "chaosresources | where type == 'microsoft.chaos/targets' | summarize count() by resourceGroup"
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
