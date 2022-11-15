---
title: Create an experiment that uses a service-direct fault using Azure Chaos Studio with the Azure CLI
description: Create an experiment that uses a service-direct fault with the Azure CLI
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 11/10/2021
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli, ignite-2022
ms.devlang: azurecli
---

# Create a chaos experiment that uses a service-direct fault with the Azure CLI

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this guide, you will cause a multi-read, single-write Azure Cosmos DB failover using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against data loss when a failover event occurs.

These same steps can be used to set up and run an experiment for any service-direct fault. A **service-direct** fault runs directly against an Azure resource without any need for instrumentation, unlike agent-based faults, which require installation of the chaos agent.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- An Azure Cosmos DB account. If you do not have an Azure Cosmos DB account, you can [follow these steps to create one](../cosmos-db/sql/create-cosmosdb-resources-portal.md).
- At least one read and one write region setup for your Azure Cosmos DB account.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Azure Cloud Shell. Some commands may not work as described if running the CLI locally or in a PowerShell terminal.

## Enable Chaos Studio on your Azure Cosmos DB account

Chaos Studio cannot inject faults against a resource unless that resource has been onboarded to Chaos Studio first. You onboard a resource to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Azure Cosmos DB accounts only have one target type (service-direct) and one capability (failover), but other resources may have up to two target types - one for service-direct faults and one for agent-based faults - and many capabilities.

1. Create a target by replacing `$RESOURCE_ID` with the resource ID of the resource you are onboarding and `$TARGET_TYPE` with the [target type you are onboarding](chaos-studio-fault-providers.md):

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/$TARGET_TYPE?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if onboarding a virtual machine as a service-direct target:

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
With your Azure Cosmos DB account now onboarded, you can create your experiment. A chaos experiment defines the actions you want to take against target resources, organized into steps, which run sequentially, and branches, which run in parallel.

1. Formulate your experiment JSON starting with the JSON sample below. Modify the JSON to correspond to the experiment you want to run using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md)

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
    
2. Create the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you have saved and uploaded your experiment JSON and update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2021-09-15-preview --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note of the `principalId` for this identity in the response for the next step.

## Give experiment permission to your Azure Cosmos DB account
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

Give the experiment access to your resource(s) using the command below, replacing `$EXPERIMENT_PRINCIPAL_ID` with the principalId from the previous step and `$RESOURCE_ID` with the resource ID of the target resource (in this case, the Azure Cosmos DB instance resource ID). Change the role to the appropriate [built-in role for that resource type](chaos-studio-fault-providers.md). Run this command for each resource targeted in your experiment. 

```azurecli-interactive
az role assignment create --role "Cosmos DB Operator" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
```

## Run your experiment
You are now ready to run your experiment. To see the impact, we recommend opening your Azure Cosmos DB account overview and going to **Replicate data globally** in a separate browser tab. Refreshing periodically during the experiment will show the region swap.

1. Start the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2021-09-15-preview
    ```

2. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you have run an Azure Cosmos DB service-direct experiment, you are ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
