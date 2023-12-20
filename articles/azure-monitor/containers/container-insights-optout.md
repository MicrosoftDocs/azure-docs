---
title: Disable Container insights on your Azure Kubernetes Service (AKS) cluster
description: This article describes how you can discontinue monitoring of your Azure AKS cluster with Container insights.
ms.topic: conceptual
ms.date: 08/21/2023
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
ms.reviewer: aul
---

# Disable Container insights on your Azure Kubernetes Service (AKS) cluster

After you enable monitoring of your Azure Kubernetes Service (AKS) cluster, you can stop monitoring the cluster if you decide you no longer want to monitor it. This article shows you how to do this task by using the Azure CLI or the provided Azure Resource Manager templates (ARM templates).

## Azure CLI

Use the [az aks disable-addons](/cli/azure/aks#az-aks-disable-addons) command to disable Container insights. The command removes the agent from the cluster nodes. It doesn't remove the solution or the data already collected and stored in your Azure Monitor resource.

```azurecli
az aks disable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

To reenable monitoring for your cluster, see [Enable monitoring by using the Azure CLI](container-insights-enable-new-cluster.md#enable-using-azure-cli).

## Azure Resource Manager template

Two ARM templates are provided to support removing the solution resources consistently and repeatedly in your resource group. One is a JSON template that specifies the configuration to stop monitoring. The other template contains parameter values that you configure to specify the AKS cluster resource ID and resource group in which the cluster is deployed.

If you're unfamiliar with the concept of deploying resources by using a template, see:

* [Deploy resources with ARM templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md)
* [Deploy resources with ARM templates and the Azure CLI](../../azure-resource-manager/templates/deploy-cli.md)

>[!NOTE]
>The template must be deployed in the same resource group of the cluster. If you omit any other properties or add-ons when you use this template, they might be removed from the cluster. Examples are `enableRBAC` for Kubernetes RBAC policies implemented in your cluster, or `aksResourceTagValues`, if tags are specified for the AKS cluster.
>

If you choose to use the Azure CLI, you must install and use the CLI locally. You must be running the Azure CLI version 2.0.27 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

### Create a template

1. Copy and paste the following JSON syntax into your file:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "aksResourceId": {
           "type": "string",
           "metadata": {
             "description": "AKS Cluster Resource ID"
           }
       },
      "aksResourceLocation": {
        "type": "string",
        "metadata": {
           "description": "Location of the AKS resource e.g. \"East US\""
         }
       },
    "aksResourceTagValues": {
      "type": "object",
      "metadata": {
        "description": "Existing all tags on AKS Cluster Resource"
        }
      }
     },
    "resources": [
      {
        "name": "[split(parameters('aksResourceId'),'/')[8]]",
        "type": "Microsoft.ContainerService/managedClusters",
        "location": "[parameters('aksResourceLocation')]",
        "tags": "[parameters('aksResourceTagValues')]",
        "apiVersion": "2018-03-31",
        "properties": {
          "mode": "Incremental",
          "id": "[parameters('aksResourceId')]",
          "addonProfiles": {
            "omsagent": {
              "enabled": false,
              "config": null
            }
           }
         }
       }
      ]
    }
    ```

1. Save this file as **OptOutTemplate.json** to a local folder.

1. Paste the following JSON syntax into your file:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "aksResourceId": {
          "value": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroup>/providers/Microsoft.ContainerService/managedClusters/<ResourceName>"
        },
        "aksResourceLocation": {
          "value": "<aksClusterRegion>"
        },
        "aksResourceTagValues": {
          "value": {
            "<existing-tag-name1>": "<existing-tag-value1>",
            "<existing-tag-name2>": "<existing-tag-value2>",
            "<existing-tag-nameN>": "<existing-tag-valueN>"
          }
        }
      }
    }
    ```

1. Edit the values for **aksResourceId** and **aksResourceLocation** by using the values of the AKS cluster, which you can find on the **Properties** page for the selected cluster.
    <!-- convertborder later -->
    :::image type="content" source="media/container-insights-optout/container-properties-page.png" lightbox="media/container-insights-optout/container-properties-page.png" alt-text="Screenshot that shows the Container properties page." border="false":::

    While you're on the **Properties** page, also copy the **Workspace Resource ID**. This value is required if you decide you want to delete the Log Analytics workspace later. Deleting the Log Analytics workspace isn't performed as part of this process.

    Edit the values for **aksResourceTagValues** to match the existing tag values specified for the AKS cluster.

1. Save this file as **OptOutParam.json** to a local folder.

Now you're ready to deploy this template.

### Remove the solution by using the Azure CLI

To remove the solution and clean up the configuration on your AKS cluster, run the following command with the Azure CLI on Linux:

```azurecli
az login   
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ResourceGroupName> --template-file ./OptOutTemplate.json --parameters ./OptOutParam.json  
```

The configuration change can take a few minutes to finish. The result is returned in a message similar to the following example:

```output
ProvisioningState       : Succeeded
```

### Remove the solution by using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To remove the solution and clean up the configuration from your AKS cluster, run the following PowerShell commands in the folder that contains the template:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <yourSubscriptionName>
New-AzResourceGroupDeployment -Name opt-out -ResourceGroupName <ResourceGroupName> -TemplateFile .\OptOutTemplate.json -TemplateParameterFile .\OptOutParam.json
```

The configuration change can take a few minutes to finish. The result is returned in a message similar to the following example:

```output
ProvisioningState       : Succeeded
```

## Next steps

If the workspace was created only to support monitoring the cluster and it's no longer needed, you must delete it manually. If you aren't familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace with the Azure portal](../logs/delete-workspace.md). Don't forget about the **Workspace Resource ID** copied earlier in step 4. You'll need that information.
