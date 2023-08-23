---
title: Create an experiment using a service-direct fault with Azure CLI
description: Create an experiment that uses a service-direct fault with the Azure CLI.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli, ignite-2022
ms.devlang: azurecli
---

# Create a chaos experiment that uses a service-direct fault with the Azure CLI

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this article, you cause a multi-read, single-write Azure Cosmos DB failover by using a chaos experiment and Azure Chaos Studio Preview. Running this experiment can help you defend against data loss when a failover event occurs.

You can use these same steps to set up and run an experiment for any service-direct fault. A *service-direct* fault runs directly against an Azure resource without any need for instrumentation, unlike agent-based faults, which require installation of the chaos agent.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- An Azure Cosmos DB account. If you don't have an Azure Cosmos DB account, you can [create one](../cosmos-db/sql/create-cosmosdb-resources-portal.md).
- At least one read and one write region setup for your Azure Cosmos DB account.

## Open Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open Cloud Shell, select **Try it** in the upper-right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [Bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into Cloud Shell, and select **Enter** to run it.

If you want to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Cloud Shell. Some commands might not work as described if you're running the CLI locally or in a PowerShell terminal.

## Enable Chaos Studio on your Azure Cosmos DB account

Chaos Studio can't inject faults against a resource unless that resource was added to Chaos Studio first. You add a resource to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Azure Cosmos DB accounts have only one target type (service-direct) and one capability (failover). Other resources might have up to two target types. One target type is for service-direct faults. Another target type is for agent-based faults. Other resources might have  many other capabilities.

1. Create a target by replacing `$RESOURCE_ID` with the resource ID of the resource you're adding. Replace `$TARGET_TYPE` with the [target type you're adding](chaos-studio-fault-providers.md):

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/$TARGET_TYPE?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if you're adding a virtual machine as a service-direct target:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

1. Create the capabilities on the target by replacing `$RESOURCE_ID` with the resource ID of the resource you're adding. Replace `$TARGET_TYPE` with the [target type you're adding](chaos-studio-fault-providers.md). Replace `$CAPABILITY` with the [name of the fault capability you're enabling](chaos-studio-fault-library.md).
    
    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/$TARGET_TYPE/capabilities/$CAPABILITY?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if you're enabling the virtual machine shutdown capability:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-VirtualMachine/capabilities/shutdown-1.0?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

You've now successfully added your Azure Cosmos DB account to Chaos Studio.

## Create an experiment
Now you can create your experiment. A chaos experiment defines the actions you want to take against target resources. The actions are organized and run in sequential steps. The chaos experiment also defines the actions you want to take against branches, which run in parallel.

1. Formulate your experiment JSON starting with the following JSON sample. Modify the JSON to correspond to the experiment you want to run by using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md).

    ```json
    {
      "location": "eastus",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "steps": [
          {
            "name": "Step1",
            "branches": [
              {
                "name": "Branch1",
                "actions": [
                  {
                    "type": "continuous",
                    "selectorId": "Selector1",
                    "duration": "PT10M",
                    "parameters": [
                      {
                        "key": "readRegion",
                        "value": "East US 2"
                      }
                    ],
                    "name": "urn:csci:microsoft:cosmosDB:failover/1.0"
                  }
                ]
              }
            ]
          }
        ],
        "selectors": [
          {
            "id": "Selector1",
            "type": "List",
            "targets": [
              {
                "type": "ChaosTarget",
                "id": "/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/chaosstudiodemo/providers/Microsoft.DocumentDB/databaseAccounts/myDB/providers/Microsoft.Chaos/targets/Microsoft-CosmosDB"
              }
            ]
          }
        ]
      }
    }
    ```
    
1. Create the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure that you've saved and uploaded your experiment JSON. Update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2021-09-15-preview --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note the principal ID for this identity in the response for the next step.

## Give the experiment permission to your Azure Cosmos DB account
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

Give the experiment access to your resources by using the following command. Replace `$EXPERIMENT_PRINCIPAL_ID` with the principal ID from the previous step. Replace `$RESOURCE_ID` with the resource ID of the target resource. In this case, it's the Azure Cosmos DB instance resource ID. Change the role to the appropriate [built-in role for that resource type](chaos-studio-fault-providers.md). Run this command for each resource targeted in your experiment.

```azurecli-interactive
az role assignment create --role "Cosmos DB Operator" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
```

## Run your experiment
You're now ready to run your experiment. To see the effect, we recommend that you open your Azure Cosmos DB account overview and go to **Replicate data globally** in a separate browser tab. Refresh periodically during the experiment to show the region swap.

1. Start the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2021-09-15-preview
    ```

1. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you've run an Azure Cosmos DB service-direct experiment, you're ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
