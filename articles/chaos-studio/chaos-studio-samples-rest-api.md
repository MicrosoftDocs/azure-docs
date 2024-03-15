---
title: Use REST APIs to interact with Chaos Studio
description: Create, view, and manage Azure Chaos Studio experiments, targets, and capabilities with REST APIs.
services: chaos-studio
author: prasha-microsoft
ms.topic: article
ms.date: 11/01/2021
ms.author: abbyweisberg
ms.reviewer: prashabora
ms.service: chaos-studio
ms.custom: devx-track-azurecli
---

# Use REST APIs to interact with Chaos Studio

If you're integrating Azure Chaos Studio into your CI/CD pipelines, or you simply prefer to use direct API calls to interact with your Azure resources, you can use Chaos Studio's REST API. For the full API reference, visit the [Azure Chaos Studio REST API reference](/rest/api/chaosstudio/). This page provides samples for using the REST API effectively, and is not intended as a comprehensive reference.

This article assumes you're using [Azure CLI](/cli/azure/install-azure-cli) to execute these commands, but you can adapt them to other standard REST clients.


You can use the Chaos Studio REST APIs to:
* Create, modify, and delete experiments
* View, start, and stop experiment executions
* View and manage targets
* Register and unregister your subscription with the Chaos Studio resource provider
* View available resource provider operations.

Use the `az cli` utility to perform these actions from the command line.

> [!TIP]
> To get more verbose output with Azure CLI, append `--verbose` to the end of each command. This variable returns more metadata when commands execute, including `x-ms-correlation-request-id`, which aids in debugging.

These examples have been reviewed with the generally available Chaos Studio API version `2023-11-01`.

## Resource provider commands

This section lists the Chaos Studio provider commands, which help you understand the resource provider's status and available operations.

### List details about the Microsoft.Chaos resource provider

This shows information such as available API versions for the Chaos resource provider and region availability. The most recent `api-version` required for this may differ from the `api-version` for Chaos resource provider operations.

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos?api-version={apiVersion}" 
```

### List all the operations of the Microsoft.Chaos resource provider

```azurecli
az rest --method get --url "https://management.azure.com/providers/Microsoft.Chaos/operations?api-version={apiVersion}" 
```

## Targets and capabilities

These operations help you see what [targets and capabilities](chaos-studio-targets-capabilities.md) are available, and add them to a target.

### List all target types available in a region

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/locations/{locationName}/targetTypes?api-version={apiVersion}" 
```

### List all capabilities available for a target type

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/locations/{locationName}/targetTypes/{targetType}/capabilityTypes?api-version={apiVersion}" 
```

### Enable a resource as a target

To use a resource in an experiment, you need to enable it as a target.

```azurecli
az rest --method put --url "https://management.azure.com/{resourceId}/providers/Microsoft.Chaos/targets/{targetType}?api-version={apiVersion}" --body "{'properties':{}}" 
```

### Enable capabilities for a target

Once a resource has been enabled as a target, you need to specify what capabilities (corresponding to faults) are allowed. 

```azurecli
az rest --method put --url "https://management.azure.com/{resourceId}/providers/Microsoft.Chaos/targets/{targetType}/capabilities/{capabilityName}?api-version={apiVersion}" --body "{'properties':{}}" 
```

### See what capabilities are enabled for a target

Once a target and capabilities have been enabled, you can view the enabled capabilities. This is useful for constructing your chaos experiment, since it includes the parameter schema for each fault.

```azurecli
az rest --method get --url "https://management.azure.com/{resourceId}/providers/Microsoft.Chaos/targets/{targetType}/capabilities?api-version={apiVersion}"
```

## Experiments

These operations help you view, run, and manage experiments.

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
az rest --method delete --url "https://management.azure.com/{experimentId}?api-version={apiVersion}" 
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
az rest --method post --url "https://management.azure.com/{experimentId}/executions/{executionDetailsId}/getExecutionDetails?api-version={apiVersion}" 
```

### Cancel (stop) an experiment

```azurecli
az rest --method post --url "https://management.azure.com/{experimentId}/cancel?api-version={apiVersion}" 
```

## Other helpful commands and tips

While these commands don't use the Chaos Studio API specifically, they can be helpful for using Chaos Studio effectively.

### View Chaos Studio resources with Azure Resource Graph

You can use the Azure Resource Graph [REST API](../governance/resource-graph/first-query-rest-api.md) to query resources associated with Chaos Studio, like targets and capabilities.

```azurecli
 az rest --method post --url "https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01" --body "{'query':'chaosresources'}"
```

Alternatively, you can use Azure Resource Graph's `az cli` [extension](../governance/resource-graph/first-query-azurecli.md).

```azurecli-interactive
az graph query -q "chaosresources | summarize count() by type"
```

For example, if you want a summary of all the Chaos Studio targets active in your subscription by resource group, you can use:

```azurecli-interactive
az graph query -q "chaosresources | where type == 'microsoft.chaos/targets' | summarize count() by resourceGroup"
```

### Filtering and querying

Like other Azure CLI commands, you can use the `--query` and `--filter` parameters with the Azure CLI `rest` commands. For example, to see a table of available capability types for a specific target type, use the following command:

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Chaos/locations/{locationName}/targetTypes/{targetType}/capabilityTypes?api-version=2023-11-01" --output table --query 'value[].{name:name, faultType:properties.runtimeProperties.kind, urn:properties.urn}'
```

## Parameter definitions

This section describes the parameters used throughout this document and how you can fill them in.

| Parameter name | Definition | Lookup | Example |
| --- | --- | --- | --- |
| {apiVersion} | Version of the API to use when you execute the command provided | Can be found in the [API documentation](/rest/api/chaosstudio/) | `2023-11-01` |
| {experimentId} | Azure Resource ID for the experiment | Can be found on the [Chaos Studio Experiment page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) or with a [GET call](#list-all-the-experiments-in-a-resource-group) to the `/experiments` endpoint | `/subscriptions/6b052e15-03d3-4f17-b2e1-be7f07588291/resourceGroups/my-resource-group/providers/Microsoft.Chaos/experiments/my-chaos-experiment` |
| {experimentName.json} | JSON that contains the configuration of the chaos experiment | Generated by the user | `experiment.json` (See [a CLI tutorial](chaos-studio-tutorial-service-direct-cli.md) for a full example file) |
| {subscriptionId} | Subscription ID where the target resource is located | Find in the [Azure portal Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) or by running `az account list --output table` | `6b052e15-03d3-4f17-b2e1-be7f07588291` |
| {resourceGroupName} | Name of the resource group where the target resource is located | Find in the [Resource Groups page](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) or by running `az group list --output table` | `my-resource-group` |
| {executionDetailsId} | Execution ID of an experiment execution | Find in the [Chaos Studio Experiment page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.chaos%2Fchaosexperiments) or with a [GET call](#get-all-executions-of-an-experiment) to the `/executions` endpoint | `C69E7FCD-1548-47E5-9DDA-92A5DD60E610` |
| {targetType} | Type of target for the corresponding resource | Find in the [Fault providers list](chaos-studio-fault-providers.md) or a [GET call](#list-all-target-types-available-in-a-region) to the `/locations/{locationName}/targetTypes` endpoint | `Microsoft-VirtualMachine` |
| {capabilityName} | Name of an individual capability resource, extending a target resource | Find in the [fault reference documentation](chaos-studio-fault-library.md) or with a [GET call](#list-all-capabilities-available-for-a-target-type) to the `capabilityTypes` endpoint | `Shutdown-1.0` | 
| {locationName} | Azure region for a resource or regional endpoint | Find all possible regions for your account with `az account list-locations --output table` | `eastus` |
