---
title: Create a chaos experiment that uses dynamic targeting to select hosts
description: Create an experiment that uses dynamic targeting with the Azure CLI.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 12/12/2022
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli, ignite-2022
ms.devlang: azurecli
---

# Create a chaos experiment that uses dynamic targeting to select hosts

You can use dynamic targeting in a chaos experiment to choose a set of targets to run an experiment against. In this article, we show you how to dynamically target virtual machine scale sets to shut down based on availability zone. Running this experiment can help you test failover to an Azure Virtual Machine Scale Sets instance in a different region if there's an outage.

You can use these same steps to set up and run an experiment for any fault that supports dynamic targeting. Currently, only virtual machine scale set shutdown supports dynamic targeting.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- An Azure Virtual Machine Scale Sets instance.

## Open Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open Cloud Shell, select **Try it** in the upper-right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [Bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into Cloud Shell, and select **Enter** to run it.

If you want to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Cloud Shell. Some commands might not work as described if you're running the CLI locally or in a PowerShell terminal.

## Enable Chaos Studio on your Virtual Machine Scale Sets instance

Azure Chaos Studio can't inject faults against a resource unless that resource was added to Chaos Studio first. To add a resource to Chaos Studio, create a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource.

Virtual Machine Scale Sets has only one target type (`Microsoft-VirtualMachineScaleSet`) and one capability (`shutdown`). Other resources might have up to two target types. One target type is for service-direct faults. Another target type is for agent-based faults. Other resources also might have many other capabilities.

1. Create a [target for your virtual machine scale set](chaos-studio-fault-providers.md) resource. Replace `$RESOURCE_ID` with the resource ID of the virtual machine scale set you're adding:

    ```azurecli-interactive  
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachineScaleSet?api-version=2023-11-01" --body "{\"properties\":{}}"
    ```

1. Create the capabilities on the virtual machine scale set target. Replace `$RESOURCE_ID` with the resource ID of the resource you're adding. Specify the `VirtualMachineScaleSet` target and the `Shutdown-2.0` capability.

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachineScaleSet/capabilities/Shutdown-2.0?api-version=2023-11-01" --body "{\"properties\":{}}"
    ```

You've now successfully added your virtual machine scale set to Chaos Studio.

## Create an experiment

Now you can create your experiment. A chaos experiment defines the actions you want to take against target resources. The actions are organized and run in sequential steps. The chaos experiment also defines the actions you want to take against branches, which run in parallel.

1. Formulate your experiment JSON starting with the following [Virtual Machine Scale Sets Shutdown 2.0](chaos-studio-fault-library.md#version-20) JSON sample. Modify the JSON to correspond to the experiment you want to run by using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md). At this time, dynamic targeting is only available with the Virtual Machine Scale Sets Shutdown 2.0 fault and can only filter on availability zones.

    - Use the `filter` element to configure the list of Azure availability zones to filter targets by. If you don't provide a `filter`, the fault shuts down all instances in the virtual machine scale set.
    - The experiment targets all Virtual Machine Scale Sets instances in the specified zones.

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
    
1. Create the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure that you saved and uploaded your experiment JSON. Update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2023-11-01 --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note the principal ID for this identity in the response for the next step.

## Give experiment permission to your virtual machine scale sets

When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

Give the experiment access to your resources by using the following command. Replace `$EXPERIMENT_PRINCIPAL_ID` with the principal ID from the previous step. Replace `$RESOURCE_ID` with the resource ID of the target resource. Change the role to the appropriate [built-in role for that resource type](chaos-studio-fault-providers.md). Run this command for each resource targeted in your experiment.

```azurecli-interactive
az role assignment create --role "Virtual Machine Contributor" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
```

## Run your experiment

You're now ready to run your experiment. To see the effect, check the portal to see if your virtual machine scale sets targets are shut down. If they're shut down, check to see that the services running on your virtual machine scale sets are still running as expected.

1. Start the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2023-11-01
    ```

1. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you've run a dynamically targeted virtual machine scale set shutdown experiment, you're ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)