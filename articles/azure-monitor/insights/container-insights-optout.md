---
title: How to Stop Monitoring Your Azure Kubernetes Service cluster | Microsoft Docs
description: This article describes how you can discontinue monitoring of your Azure AKS cluster with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 

ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/13/2018
ms.author: magoedte
---

# How to stop monitoring your Azure Kubernetes Service (AKS) with Azure Monitor for containers

After you enable monitoring of your AKS cluster, you can stop monitoring the cluster if you decide you no longer want to monitor it. This article shows how to accomplish this using the Azure CLI or with the provided Azure Resource Manager templates.  


## Azure CLI
Use the [az aks disable-addons](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest#az-aks-disable-addons) command to disable Azure Monitor for containers. The command removes the agent from the cluster nodes, it does not remove the solution or the data already collected and stored in your Azure Monitor resource.  

```azurecli
az aks disable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

To re-enable monitoring for your cluster, see [Enable monitoring using Azure CLI](container-insights-enable-new-cluster.md#enable-using-azure-cli).

## Azure Resource Manager template
Provided are two Azure Resource Manager template to support removing the solution resources consistently and repeatedly in your resource group. One is a JSON template specifying the configuration to stop monitoring and the other contains parameter values that you configure to specify the AKS cluster resource ID and resource group that the cluster is deployed in. 

If you're unfamiliar with the concept of deploying resources by using a template, see:
* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)
* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

>[!NOTE]
>The template needs to be deployed in the same resource group as the cluster. If you omit any other properties or add-ons when using this template, it can result in their removal from the cluster. For example, *enableRBAC*.  
>

If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.27 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). 

### Create template

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
       }
    },
    "resources": [
      {
        "name": "[split(parameters('aksResourceId'),'/')[8]]",
        "type": "Microsoft.ContainerService/managedClusters",
        "location": "[parameters('aksResourceLocation')]",
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

2. Save this file as **OptOutTemplate.json** to a local folder.
3. Paste the following JSON syntax into your file:

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
        }
      }
    }
    ```

4. Edit the values for **aksResourceId** and **aksResourceLocation** by using the values of the AKS cluster, which you can find on the **Properties** page for the selected cluster.

    ![Container properties page](media/container-insights-optout/container-properties-page.png)

    While you are on the **Properties** page, also copy the **Workspace Resource ID**. This value is required if you decide you want to delete the Log Analytics workspace later. Deleting the Log Analytics workspace is not performed as part of this process. 

5. Save this file as **OptOutParam.json** to a local folder.
6. You are ready to deploy this template. 

### Remove the solution using Azure CLI
Execute the following command with Azure CLI on Linux to remove the solution and clean up the configuration on your AKS cluster.

```azurecli
az login   
az account set --subscription "Subscription Name" 
az group deployment create --resource-group <ResourceGroupName> --template-file ./OptOutTemplate.json --parameters @./OptOutParam.json  
```

The configuration change can take a few minutes to complete. When it's completed, a message similar to the following that includes the result is returned:

```azurecli
ProvisioningState       : Succeeded
```

### Remove the solution using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

Execute the following PowerShell commands in the folder containing the template to remove the solution and clean up the configuration from your AKS cluster.    

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <yourSubscriptionName>
New-AzResourceGroupDeployment -Name opt-out -ResourceGroupName <ResourceGroupName> -TemplateFile .\OptOutTemplate.json -TemplateParameterFile .\OptOutParam.json
```

The configuration change can take a few minutes to complete. When it's completed, a message similar to the following that includes the result is returned:

```powershell
ProvisioningState       : Succeeded
```

If the workspace was created only to support monitoring the cluster and it's no longer needed, you have to manually delete it. If you are not familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace with the Azure portal](../../log-analytics/log-analytics-manage-del-workspace.md). Don't forget about the **Workspace Resource ID** we copied earlier in step 4, you're going to need that. 

