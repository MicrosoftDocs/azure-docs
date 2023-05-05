---
title: Create an experiment that uses an agent-based fault with Azure Chaos Studio with the Azure CLI
description: Create an experiment that uses an agent-based fault and configure the chaos agent with the Azure CLI
author: prasha-microsoft 
ms.topic: how-to
ms.date: 11/10/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Create a chaos experiment that uses an agent-based fault on a virtual machine or virtual machine scale set with the Azure CLI

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this guide, you will cause a high CPU event on a Linux virtual machine using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against an application becoming resource-starved.

These same steps can be used to set up and run an experiment for any agent-based fault. An **agent-based** fault requires setup and installation of the chaos agent, unlike a service-direct fault, which runs directly against an Azure resource without any need for instrumentation.


## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- A virtual machine. If you do not have a virtual machine, you can [follow these steps to create one](../virtual-machines/linux/quick-create-portal.md).
- A network setup that permits you to [SSH into your virtual machine](../virtual-machines/ssh-keys-portal.md)
- A user-assigned managed identity. If you do not have a user-assigned managed identity, you can [follow these steps to create one](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md)

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Azure Cloud Shell. Some commands may not work as described if running the CLI locally or in a PowerShell terminal.

## Assign managed identity to the virtual machine

Before setting up Chaos Studio on the virtual machine, you need to assign a user-assigned managed identity to each virtual machine and/or virtual machine scale set where you plan to install the agent by using the `az vm identity assign` or `az vmss identity assign` command. Replace `$VM_RESOURCE_ID`/`$VMSS_RESOURCE_ID` with the resource ID of the VM you are adding as a chaos target and `$MANAGED_IDENTITY_RESOURCE_ID` with the resource ID of the user-assigned managed identity.

**Virtual Machine**

```azurecli-interactive
az vm identity assign --ids $VM_RESOURCE_ID --identities $MANAGED_IDENTITY_RESOURCE_ID
```

**Virtual Machine Scale Set**

```azurecli-interactive
az vmss identity assign --ids $VMSS_RESOURCE_ID --identities $MANAGED_IDENTITY_RESOURCE_ID
```

## Enable Chaos Studio on your virtual machine

Chaos Studio cannot inject faults against a virtual machine unless that virtual machine has been onboarded to Chaos Studio first. You onboard a virtual machine to Chaos Studio by creating a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource, then installing the chaos agent. Virtual machines have two target types - one that enables service-direct faults (where no agent is required), and one that enabled agent-based faults (which requires the installation of an agent). The chaos agent is an application installed on your virtual machine as a [virtual machine extension](../virtual-machines/extensions/overview.md) that allows you to inject faults in the guest operating system.

### Install stress-ng (Linux only)

The Chaos Studio agent for Linux requires stress-ng, an open-source application that can cause various stress events on a virtual machine. You can install stress-ng by [connecting to your Linux virtual machine](../virtual-machines/ssh-keys-portal.md) and running the appropriate installation command for your package manager, for example:

```bash
sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng
```

Or:

```bash
sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && sudo yum -y install stress-ng
```

### Enable chaos target and capabilities

Next, set up a Microsoft-Agent target on each virtual machine or virtual machine scale set that specifies the user-assigned managed identity that the agent will use to connect to Chaos Studio. In this example, we use one managed identity for all VMs. A target must be created via REST API. In this example, we use the `az rest` CLI command to execute the REST API calls.

1. Modify the following JSON by replacing `$USER_IDENTITY_CLIENT_ID` with the clientID of your managed identity, which you can find in the Azure portal overview of the user-assigned managed identity you created, and `$USER_IDENTITY_TENANT_ID` with your Azure tenant ID, which you can find in the Azure portal under **Azure Active Directory** under  **Tenant information**. Save the JSON as a file in the same location where you are running the Azure CLI (in Cloud Shell you can drag-and-drop the JSON file to upload it).

    ```json
    {
      "properties": {
        "identities": [
          {
            "clientId": "$USER_IDENTITY_CLIENT_ID",
            "tenantId": "$USER_IDENTITY_TENANT_ID",
            "type": "AzureManagedIdentity"
          }
        ]
      }
    }
    ```

2. Create the target by replacing `$RESOURCE_ID` with the resource ID of the target virtual machine or virtual machine scale set. Replace `target.json` with the name of the JSON file you created in the previous step.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview --body @target.json --query properties.agentProfileId -o tsv
    ```

3. Copy down the GUID for the **agentProfileId** returned by this command for use in a later step.

4. Create the capabilities by replacing `$RESOURCE_ID` with the resource ID of the target virtual machine or virtual machine scale set and `$CAPABILITY` with the [name of the fault capability you are enabling](chaos-studio-fault-library.md).
    
    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent/capabilities/$CAPABILITY?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if enabling the CPU Pressure capability:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-Agent/capabilities/CPUPressure-1.0?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

### Install the Chaos Studio virtual machine extension

The chaos agent is an application that runs in your virtual machine or virtual machine scale set instances to execute agent-based faults. During installation, you configure the agent with the managed identity the agent should use to authenticate to Chaos Studio, the profile ID of the Microsoft-Agent target that you created, and optionally an Application Insights instrumentation key that enables the agent to send diagnostic events to Azure Application Insights.

1. Before beginning, make sure you have the following details:
    * **agentProfileId** - the property returned when creating the target. If you don't have this property, you can run `az rest --method get --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview` and copy the `agentProfileId` property.
    * **ClientId** - the client ID of the user-assigned managed identity used in the target. If you don't have this property, you can run `az rest --method get --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview` and copy the `clientId` property
    * (optionally) **AppInsightsKey** - the instrumentation key for your Application Insights component, which you can find in the Application Insights page in the portal under **Essentials**.

2. Install the Chaos Studio VM extension. Replace `$VM_RESOURCE_ID` with the resource ID of your VM or replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$VMSS_NAME` with those properties for your virtual machine scale set. Replace `$AGENT_PROFILE_ID` with the agentProfileId, `$USER_IDENTITY_CLIENT_ID` with the clientID of your managed identity, and `$APP_INSIGHTS_KEY` with your Application Insights instrumentation key. If you are not using Application Insights, remove that key/value pair.

    #### Install the agent on a virtual machine

    **Windows**

    ```azurecli-interactive
    az vm extension set --ids $VM_RESOURCE_ID --name ChaosWindowsAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    **Linux**

    ```azurecli-interactive
    az vm extension set --ids $VM_RESOURCE_ID --name ChaosLinuxAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    #### Install the agent on a virtual machine scale set

    **Windows**

    ```azurecli-interactive
    az vmss extension set --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --vmss-name $VMSS_NAME --name ChaosWindowsAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    **Linux**

    ```azurecli-interactive
    az vmss extension set --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --vmss-name $VMSS_NAME --name ChaosLinuxAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```
3. If setting up a virtual machine scale set, verify that the instances have been upgraded to the latest model. If needed, upgrade all instances in the model.

    ```azurecli-interactive
    az vmss update-instances -g $RESOURCE_GROUP -n $VMSS_NAME --instance-ids *
    ```

## Create an experiment

With your virtual machine now onboarded, you can create your experiment. A chaos experiment defines the actions you want to take against target resources, organized into steps, which run sequentially, and branches, which run in parallel.

1. Formulate your experiment JSON starting with the JSON sample below. Modify the JSON to correspond to the experiment you want to run using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md)

    ```json
    {
      "identity": {
        "type": "SystemAssigned"
      },
      "location": "centralus",
      "properties": {
        "selectors": [
          {
            "id": "Selector1",
            "targets": [
              {
                "id": "/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myWindowsVM/providers/Microsoft.Chaos/targets/Microsoft-Agent",
                "type": "ChaosTarget"
              },
              {
                "id": "/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myLinuxVM/providers/Microsoft.Chaos/targets/Microsoft-Agent",
                "type": "ChaosTarget"
              }
            ],
            "type": "List"
          }
        ],
        "steps": [
          {
            "branches": [
              {
                "actions": [
                  {
                    "duration": "PT10M",
                    "name": "urn:csci:microsoft:agent:cpuPressure/1.0",
                    "parameters": [
                      {
                        "key": "pressureLevel",
                        "value": "95"
                      }
                    ],
                    "selectorId": "Selector1",
                    "type": "continuous"
                  }
                ],
                "name": "Branch 1"
              }
            ],
            "name": "Step 1"
          }
        ]
      }
    }
    ```

    If running against a virtual machine scale set, modify the fault parameters to include the instance number(s) to target:

    ```json
    "parameters": [
      {
        "key": "pressureLevel",
        "value": "95"
      },
      {
        "key": "virtualMachineScaleSetInstances",
        "value": "[0,1,2]"
      }
    ]
    ```

    You can identify scale set instance numbers in the Azure portal by navigating to your virtual machine scale set and clicking on **Instances**. The instance name will end in the instance number.
    
2. Create the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you have saved and uploaded your experiment JSON and update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2021-09-15-preview --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note of the `principalId` for this identity in the response for the next step.

## Give experiment permission to your virtual machine
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully. The Reader role is required for agent-based faults. Other roles that do not have */Read permission, such as Virtual Machine Contributor, will not grant appropriate permission for agent-based faults.

Give the experiment access to your virtual machine or virtual machine scale set using the command below, replacing `$EXPERIMENT_PRINCIPAL_ID` with the principalId from the previous step and `$RESOURCE_ID` with the resource ID of the target virtual machine or virtual machine scale set (the resource ID of the VM, not the resource ID of the chaos agent used in the experiment definition). Run this command for each virtual machine or virtual machine scale set targeted in your experiment.

```azurecli-interactive
az role assignment create --role "Reader" --assignee-principal-type "ServicePrincipal" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID 
```


## Run your experiment
You are now ready to run your experiment. To see the impact, we recommend opening [an Azure Monitor metrics chart](../azure-monitor/essentials/tutorial-metrics.md) with your virtual machine's CPU pressure in a separate browser tab.

1. Start the experiment using the Azure CLI, replacing `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2021-09-15-preview
    ```

2. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you have run an agent-based experiment, you are ready to:
- [Create an experiment that uses service-direct faults](chaos-studio-tutorial-service-direct-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
