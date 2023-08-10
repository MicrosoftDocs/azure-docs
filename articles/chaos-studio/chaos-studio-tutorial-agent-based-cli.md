---
title: Create an experiment using an agent-based fault with Azure CLI
description: Create an experiment that uses an agent-based fault and configure the chaos agent with the Azure CLI.
author: prasha-microsoft 
ms.topic: how-to
ms.date: 11/10/2021
ms.author: prashabora
ms.service: chaos-studio
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Create a chaos experiment that uses an agent-based fault with the Azure CLI

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this article, you cause a high CPU event on a Linux virtual machine (VM) by using a chaos experiment and Azure Chaos Studio Preview. Run this experiment to help you defend against an application from becoming resource starved.

You can use these same steps to set up and run an experiment for any agent-based fault. An *agent-based* fault requires setup and installation of the chaos agent. A service-direct fault runs directly against an Azure resource without any need for instrumentation.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- A virtual machine. If you don't have a VM, you can [create one](../virtual-machines/linux/quick-create-portal.md).
- A network setup that permits you to [SSH into your VM](../virtual-machines/ssh-keys-portal.md).
- A user-assigned managed identity. If you don't have a user-assigned managed identity, you can [create one](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

## Open Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open Cloud Shell, select **Try it** in the upper-right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [Bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Cloud Shell. Some commands might not work as described if you run the CLI locally or in a PowerShell terminal.

## Assign managed identity to the virtual machine

Before you set up Chaos Studio on the VM, assign a user-assigned managed identity to each VM or virtual machine scale set where you plan to install the agent. Use the `az vm identity assign` or `az vmss identity assign` command. Replace `$VM_RESOURCE_ID`/`$VMSS_RESOURCE_ID` with the resource ID of the VM you're adding as a chaos target. Replace `$MANAGED_IDENTITY_RESOURCE_ID` with the resource ID of the user-assigned managed identity.

Virtual machine

```azurecli-interactive
az vm identity assign --ids $VM_RESOURCE_ID --identities $MANAGED_IDENTITY_RESOURCE_ID
```

Virtual machine scale set

```azurecli-interactive
az vmss identity assign --ids $VMSS_RESOURCE_ID --identities $MANAGED_IDENTITY_RESOURCE_ID
```

## Enable Chaos Studio on your virtual machine

Chaos Studio can't inject faults against a VM unless that VM was added to Chaos Studio first. To add a VM to Chaos Studio, create a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Then you install the chaos agent.

Virtual machines have two target types. One target type enables service-direct faults (where no agent is required). The other target type enables agent-based faults (which requires the installation of an agent). The chaos agent is an application installed on your VM as a [VM extension](../virtual-machines/extensions/overview.md). You use it to inject faults in the guest operating system.

### Install stress-ng (Linux only)

The Chaos Studio agent for Linux requires stress-ng. This open-source application can cause various stress events on a VM. To install stress-ng, [connect to your Linux VM](../virtual-machines/ssh-keys-portal.md). Then run the appropriate installation command for your package manager. For example:

```bash
sudo apt-get update && sudo apt-get -y install unzip && sudo apt-get -y install stress-ng
```

Or:

```bash
sudo dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && sudo yum -y install stress-ng
```

### Enable the chaos target and capabilities

Next, set up a Microsoft-Agent target on each VM or virtual machine scale set that specifies the user-assigned managed identity that the agent uses to connect to Chaos Studio. In this example, we use one managed identity for all VMs. A target must be created via REST API. In this example, we use the `az rest` CLI command to execute the REST API calls.

1. Modify the following JSON by replacing `$USER_IDENTITY_CLIENT_ID` with the client ID of your managed identity. You can find the client ID in the Azure portal overview of the user-assigned managed identity you created. Replace `$USER_IDENTITY_TENANT_ID` with your Azure tenant ID. You can find it in the Azure portal under **Azure Active Directory** under **Tenant information**. Save the JSON as a file in the same location where you're running the Azure CLI. In Cloud Shell, you can drag and drop the JSON file to upload it.

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

1. Create the target by replacing `$RESOURCE_ID` with the resource ID of the target VM or virtual machine scale set. Replace `target.json` with the name of the JSON file you created in the previous step.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview --body @target.json --query properties.agentProfileId -o tsv
    ```

1. Copy down the GUID for the **agentProfileId** returned by this command for use in a later step.

1. Create the capabilities by replacing `$RESOURCE_ID` with the resource ID of the target VM or virtual machine scale set. Replace `$CAPABILITY` with the [name of the fault capability you're enabling](chaos-studio-fault-library.md).
    
    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent/capabilities/$CAPABILITY?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

    For example, if you're enabling the CPU Pressure capability:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.Compute/virtualMachines/myVM/providers/Microsoft.Chaos/targets/Microsoft-Agent/capabilities/CPUPressure-1.0?api-version=2021-09-15-preview" --body "{\"properties\":{}}"
    ```

### Install the Chaos Studio virtual machine extension

The chaos agent is an application that runs in your VM or virtual machine scale set instances to execute agent-based faults. During installation, you configure:

- The agent with the managed identity that the agent should use to authenticate to Chaos Studio.
- The profile ID of the Microsoft-Agent target that you created.
- Optionally, an Application Insights instrumentation key that enables the agent to send diagnostic events to Application Insights.

1. Before you begin, make sure you have the following details:
    * **agentProfileId**: The property returned when you create the target. If you don't have this property, you can run `az rest --method get --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview` and copy the `agentProfileId` property.
    * **ClientId**: The client ID of the user-assigned managed identity used in the target. If you don't have this property, you can run `az rest --method get --uri https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-Agent?api-version=2021-09-15-preview` and copy the `clientId` property.
    * **(Optionally) AppInsightsKey**: The instrumentation key for your Application Insights component, which you can find on the Application Insights page in the portal under **Essentials**.

1. Install the Chaos Studio VM extension. Replace `$VM_RESOURCE_ID` with the resource ID of your VM or replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$VMSS_NAME` with those properties for your virtual machine scale set. Replace `$AGENT_PROFILE_ID` with the agent Profile ID. Replace `$USER_IDENTITY_CLIENT_ID` with the client ID of your managed identity. Replace `$APP_INSIGHTS_KEY` with your Application Insights instrumentation key. If you aren't using Application Insights, remove that key/value pair.

    #### Install the agent on a virtual machine

    Windows

    ```azurecli-interactive
    az vm extension set --ids $VM_RESOURCE_ID --name ChaosWindowsAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    Linux

    ```azurecli-interactive
    az vm extension set --ids $VM_RESOURCE_ID --name ChaosLinuxAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    #### Install the agent on a virtual machine scale set

    Windows

    ```azurecli-interactive
    az vmss extension set --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --vmss-name $VMSS_NAME --name ChaosWindowsAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```

    Linux

    ```azurecli-interactive
    az vmss extension set --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --vmss-name $VMSS_NAME --name ChaosLinuxAgent --publisher Microsoft.Azure.Chaos --version 1.0 --settings '{"profile": "$AGENT_PROFILE_ID", "auth.msi.clientid":"$USER_IDENTITY_CLIENT_ID", "appinsightskey":"$APP_INSIGHTS_KEY"}'
    ```
1. If you're setting up a virtual machine scale set, verify that the instances were upgraded to the latest model. If needed, upgrade all instances in the model.

    ```azurecli-interactive
    az vmss update-instances -g $RESOURCE_GROUP -n $VMSS_NAME --instance-ids *
    ```

## Create an experiment

After you've successfully deployed your VM, now you can create your experiment. A chaos experiment defines the actions you want to take against target resources. The actions are organized and run in sequential steps. The chaos experiment also defines the actions you want to take against branches, which run in parallel.

1. Formulate your experiment JSON starting with the following JSON sample. Modify the JSON to correspond to the experiment you want to run by using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update) and the [fault library](chaos-studio-fault-library.md).

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

    If you're running against a virtual machine scale set, modify the fault parameters to include the instance numbers to target:

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

    You can identify scale set instance numbers in the Azure portal by going to your virtual machine scale set and selecting **Instances**. The instance name ends in the instance number.
    
1. Create the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you've saved and uploaded your experiment JSON. Update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2021-09-15-preview --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note the principal ID for this identity in the response for the next step.

## Give the experiment permission to your virtual machine
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully. The Reader role is required for agent-based faults. Other roles that don't have */Read permission, such as Virtual Machine Contributor, won't grant appropriate permission for agent-based faults.

Give the experiment access to your VM or virtual machine scale set by using the following command. Replace `$EXPERIMENT_PRINCIPAL_ID` with the principal ID from the previous step. Replace `$RESOURCE_ID` with the resource ID of the target VM or virtual machine scale set. Be sure to use the resource ID of the VM, not the resource ID of the chaos agent used in the experiment definition. Run this command for each VM or virtual machine scale set targeted in your experiment.

```azurecli-interactive
az role assignment create --role "Reader" --assignee-principal-type "ServicePrincipal" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID 
```

## Run your experiment
You're now ready to run your experiment. To see the effect, we recommend that you open [an Azure Monitor metrics chart](../azure-monitor/essentials/tutorial-metrics.md) with your VM's CPU pressure in a separate browser tab.

1. Start the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2021-09-15-preview
    ```

1. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you've run an agent-based experiment, you're ready to:
- [Create an experiment that uses service-direct faults](chaos-studio-tutorial-service-direct-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
