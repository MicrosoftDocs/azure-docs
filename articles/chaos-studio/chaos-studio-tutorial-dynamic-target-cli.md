---
title: Create a chaos experiment that uses dynamic targeting to select hosts
description: Create an experiment that uses a service-direct fault with the Azure CLI
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli, ignite-2022
ms.devlang: azurecli
---

# Create a chaos experiment that uses dynamic targeting to select hosts

You can use dynamic targeting in a chaos experiment to choose the targets to run an experiment against. In this guide, you will show you how to dynamically target a VMSS to shut down. Running this experiment can help you test failover to a VMSS instance in a different region in the case of an outage.

These same steps can be used to set up and run an experiment for any fault that supports dynamic targeting. At this time, only VMSS shutdown supports dynamic targeting. 

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

>[!important]
>Need to fill out
>- An Azure VMSS instance
>- 

<!--
- An Azure Cosmos DB account. If you do not have an Azure Cosmos DB account, you can [follow these steps to create one](../cosmos-db/sql/create-cosmosdb-resources-portal.md).
- At least one read and one write region setup for your Azure Cosmos DB account.
-->
## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Azure Cloud Shell. Some commands may not work as described if running the CLI locally or in a PowerShell terminal.

## Enable Chaos Studio on your VMSS instance

Chaos Studio cannot inject faults against a resource unless that resource has been onboarded to Chaos Studio first. You onboard a resource to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. VMSS only has one target type (Microsoft-VirtualMachineScaleSet) and one capability (shutdown), but other resources may have up to two target types - one for service-direct faults and one for agent-based faults - and many capabilities.

1. Create a target by replacing `$RESOURCE_ID` with the resource ID of the resource you are onboarding and `$TARGET_TYPE` with the [target type you are onboarding](chaos-studio-fault-providers.md):

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/$TARGET_TYPE?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if onboarding a VMSS as a Microsoft-VirtualMachineScaleSet target:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

2. Create the capabilities on the target by replacing `$RESOURCE_ID` with the resource ID of the resource you are onboarding, `$TARGET_TYPE` with the [target type you are onboarding](chaos-studio-fault-providers.md) and `$CAPABILITY` with the [name of the fault capability you are enabling](chaos-studio-fault-library.md).
    
    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/$TARGET_TYPE/capabilities/$CAPABILITY?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if enabling the Virtual Machine shut down capability:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine/capabilities/shutdown-1.0?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

You have now successfully onboarded your Azure Cosmos DB account to Chaos Studio.

## Create an experiment

With your VMSS now onboarded, you can create your experiment. A chaos experiment defines the actions you want to take against target resources, organized into steps, which run sequentially, and branches, which run in parallel.

1. Formulate your experiment JSON starting with the [VMSS shutdown 2.0](chaos-studio-fault-library.md#version-20) JSON sample below. Modify the JSON to correspond to the experiment you want to run using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md).

    - Use the `filter` element to configure the list of Azure availability zones to filter targets by. If you don't provide a `filter`, the fault will shut down all instances in the VMSS.
    - The experiment will target all VMSS instances in the specified zones.

    ```json
     {
        "location": "westus2",
        "identity": {
            "type": "SystemAssigned"
        },
        "properties": {
            "selectors": [
                {
                    "type": "List",
                    "id": "Selector1",
                    "targets": [
                        {
                            "id": "/subscriptions/581d4e64-0ad7-495b-bff4-347a5944a2e1/resourceGroups/rg-demo/providers/Microsoft.Compute/virtualMachineScaleSets/vmss-demo/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachineScaleSet",
                            "type": "ChaosTarget"
                        }
                    ],
                    "filter": {
                        "type": "Simple",
                        "parameters": {
                            "zones": [
                                "1"
                            ]
                        }
                    }
                }
            ],
            "steps": [
                {
                    "name": "Step1",
                    "branches": [
                        {
                            "name": "Branch1",
                            "actions": [
                                {
                                    "name": "urn:csci:microsoft:virtualMachineScaleSet:shutdown/2.0",
                                    "type": "continuous",
                                    "selectorId": "Selector1",
                                    "duration": "PT2M",
                                    "parameters": [
                                        {
                                            "key": "abruptShutdown",
                                            "value": "false"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    ```
    
2. Create the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you have saved and uploaded your experiment JSON and update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2021-09-15-preview --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note of the `principalId` for this identity in the response for the next step.

## Give experiment permission to your VMSS

When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

Give the experiment access to your resource(s) using the command below, replacing `$EXPERIMENT_PRINCIPAL_ID` with the principalId from the previous step and `$RESOURCE_ID` with the resource ID of the target resource. Change the role to the appropriate [built-in role for that resource type](chaos-studio-fault-providers.md). Run this command for each resource targeted in your experiment. 

```azurecli-interactive
az role assignment create --role "Cosmos DB Operator" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
```

## Run your experiment

You are now ready to run your experiment. To see the impact, we **describe something that shows impact**.

>[!note}
>>The section above needs filling out

1. Start the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2021-09-15-preview
    ```

2. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you have run a dynamically targeted VMSS shutdown experiment, you are ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)

