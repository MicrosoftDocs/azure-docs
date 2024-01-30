---
title: Targets and capabilities in Azure Chaos Studio
description: Understand how to control resource onboarding in Azure Chaos Studio by using targets and capabilities.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: conceptual
ms.date: 11/01/2021
ms.custom: template-concept, ignite-fall-2021, ignite-2022
---

# Targets and capabilities in Azure Chaos Studio

Before you can inject a fault against an Azure resource, the resource must first have corresponding targets and capabilities enabled. Targets and capabilities control which resources are enabled for fault injection and which faults can run against those resources.

By using targets and capabilities [along with other security measures](chaos-studio-permissions-security.md), you can avoid accidental or malicious fault injection with Azure Chaos Studio. For example, with targets and capabilities, you can allow the CPU pressure fault to run against your production virtual machines while preventing the kill process fault from running against them.

## Targets

A chaos *target* enables Chaos Studio to interact with a resource for a particular target type. A *target type* represents the method of injecting faults against a resource. Resource types that only support service-direct faults have one target type. An example is the `Microsoft-CosmosDB` type for Azure Cosmos DB.

Resource types that support service-direct and agent-based faults have two target types. One target type is for service-direct faults (for example, `Microsoft-VirtualMachine`). The other target type is for agent-based faults (always `Microsoft-Agent`).

A target is an extension resource created as a child of the resource that's being onboarded to Chaos Studio. Examples are a virtual machine or a network security group. A target defines the target type that's enabled on the resource. For example, if you're onboarding an Azure Cosmos DB instance with this resource ID:

```
/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/resourceGroups/chaosstudiodemo/providers/Microsoft.DocumentDB/databaseAccounts/myDB
```

The Azure Cosmos DB resource has a child resource formatted like this example:

```
/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/resourceGroups/chaosstudiodemo/providers/Microsoft.DocumentDB/databaseAccounts/myDB/providers/Microsoft.Chaos/targets/Microsoft-CosmosDB
```

Only resources with a target created off of them are targetable for fault injection with Chaos Studio.

## Capabilities

A *capability* enables Chaos Studio to run a particular fault against a resource, such as shutting down a virtual machine. Capabilities are unique per target type. They represent the fault that they enable, for example, `CPUPressure-1.0`. To understand all available faults and their corresponding capability names and target types, see the [Chaos Studio fault library](chaos-studio-fault-library.md).

A capability is an extension resource created as a child of a target. For example, if you're enabling the shutdown fault on a virtual machine with a service-direct target ID:

```
/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine
```

The target resource has a child resource formatted like this example:

```
/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine/capabilities/shutdown-1.0
```

An experiment can only inject faults on onboarded targets with the corresponding capabilities enabled.

## List capability names and parameters
For reference, a list of capability names, fault URNs, and parameters is available [in our fault library](chaos-studio-fault-library.md). You can use the HTTP response to create a capability or do a GET on an existing capability to get this information on demand. For example, to do a GET on a VM shutdown capability:

```azurecli
az rest --method get --url "https://management.azure.com/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine/capabilities/shutdown-1.0?api-version=2023-11-01"
```

Returns the following JSON:

```JSON
{
  "id": "/subscriptions/fd9ccc83-faf6-4121-9aff-2a2d685ca2a2/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine/capabilities/shutdown-1.0",
  "name": "shutdown-1.0",
  "properties": {
    "description": null,
    "name": "shutdown-1.0",
    "parametersSchema": "https://schema-tc.eastus.chaos-prod.azure.com/targetTypes/Microsoft-VirtualMachine/capabilityTypes/Shutdown-1.0/parametersSchema.json",
    "publisher": "Microsoft",
    "targetType": "VirtualMachine",
    "type": "shutdown",
    "urn": "urn:csci:microsoft:virtualMachine:shutdown/1.0",
    "version": "1.0"
  },
  "resourceGroup": "myRG",
  "systemData": {
    "createdAt": "2021-09-15T23:00:00.826575+00:00",
    "lastModifiedAt": "2021-09-15T23:00:00.826575+00:00"
  },
  "type": "Microsoft.Chaos/targets/capabilities"
}
```

The `properties.urn` property is used to define the fault you want to run in a chaos experiment. To understand the schema for this fault's parameters, you can GET the schema referenced by `properties.parametersSchema`:

```azurecli
az rest --method get --url "https://schema-tc.eastus.chaos-prod.azure.com/targetTypes/Microsoft-VirtualMachine/capabilityTypes/Shutdown-1.0/parametersSchema.json"
```

Returns the following JSON:
```JSON
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "properties": {
    "abruptShutdown": {
      "type": "boolean"
    },
    "restartWhenComplete": {
      "type": "boolean"
    }
  },
  "type": "object"
}
```

## Next steps
Now that you understand what targets and capabilities are, you're ready to:
- [Learn about faults and actions](chaos-studio-faults-actions.md)
- [Learn about target selection and scoping](chaos-studio-target-selection.md)
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
