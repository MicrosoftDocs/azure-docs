---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 11/03/2021
ms.topic: overview
---

# Prerequisites to deploy the data controller in direct connectivity mode

This article describes how to prepare to deploy a data controller for Azure Arc-enabled data services in direct connect mode. Before you deploy an Azure Arc data controller understand the concepts described in [Plan to deploy Azure Arc-enabled data services](plan-azure-arc-data-services.md).

At a high level, the prerequisites for creating Azure Arc data controller in **direct** connectivity mode include:

1. Have access to your Kubernetes cluster. If you do not have a Kubernetes cluster, you can create a test/demonstration cluster on Azure Kubernetes Service (AKS). 
1. Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes.

Follow the instructions at [Quickstart: Deploy Azure Arc-enabled data services - directly connected mode - Azure portal](create-complete-managed-instance-directly-connected.md) 

## Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes

To connect your Kubernetes cluster to Azure, use Azure CLI `az` with the following extensions or Helm.

### Install tools

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Install or upgrade to the latest version of [Azure CLI](/cli/azure/install-azure-cli)

### Add extensions for Azure CLI

Install the latest versions of the following az extensions:
- `k8s-extension`
- `connectedk8s`
- `k8s-configuration`
- `customlocation`

Run the following commands to install the az CLI extensions:

```azurecli
az extension add --name k8s-extension
az extension add --name connectedk8s
az extension add --name k8s-configuration
az extension add --name customlocation
```

If you've previously installed the `k8s-extension`, `connectedk8s`, `k8s-configuration`, `customlocation` extensions, update to the latest version using the following command:

```azurecli
az extension update --name k8s-extension
az extension update --name connectedk8s
az extension update --name k8s-configuration
az extension update --name customlocation
```

### Connect your cluster to Azure

Connect Kubernetes cluster to Azure using Azure Arc-enabled Kubernetes

   To connect your Kubernetes cluster to Azure, use Azure CLI `az` or PowerShell.

   Run the following command:

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   az connectedk8s connect --name <cluster_name> --resource-group <resource_group_name>
   ```

   ```output
   <pre>
   Helm release deployment succeeded

       {
         "aadProfile": {
           "clientAppId": "",
           "serverAppId": "",
           "tenantId": ""
         },
         "agentPublicKeyCertificate": "xxxxxxxxxxxxxxxxxxx",
         "agentVersion": null,
         "connectivityStatus": "Connecting",
         "distribution": "gke",
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1",
         "identity": {
           "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
           "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
           "type": "SystemAssigned"
         },
         "infrastructure": "gcp",
         "kubernetesVersion": null,
         "lastConnectivityTime": null,
         "location": "eastus",
         "managedIdentityCertificateExpirationTime": null,
         "name": "AzureArcTest1",
         "offering": null,
         "provisioningState": "Succeeded",
         "resourceGroup": "AzureArcTest",
         "tags": {},
         "totalCoreCount": null,
         "totalNodeCount": null,
         "type": "Microsoft.Kubernetes/connectedClusters"
       }
   </pre>
   ```

   > [!TIP]
   > The above command without the location parameter specified creates the Azure Arc-enabled Kubernetes resource in the same location as the resource group. To create the Azure Arc-enabled Kubernetes resource in a different location, specify either `--location <region>` or `-l <region>` when running the `az connectedk8s connect` command.

   > [!NOTE]
   > If you are logged into Azure CLI using a service principal, an [additional parameter](../kubernetes/troubleshooting.md#enable-custom-locations-using-service-principal) needs to be set for enabling the custom location feature on the cluster.

   # [Azure PowerShell](#tab/azure-powershell)

   ```azurepowershell
   New-AzConnectedKubernetes -ClusterName AzureArcTest1 -ResourceGroupName AzureArcTest -Location eastus
   ```

   ```output
   <pre>
   Location Name          Type
   -------- ----          ----
   eastus   AzureArcTest1 microsoft.kubernetes/connectedclusters
   </pre>
   ```

   ---


A more thorough walk-through of this task is available at [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md).

### Verify `azure-arc` namespace pods are created

   Before you proceed to the next step, make sure that all of the `azure-arc-` namespace pods are created. Run the following command.

   ```console
   kubectl get pods -n azure-arc
   ```

   :::image type="content" source="media/deploy-data-controller-direct-mode-prerequisites/verify-azure-arc-pods.png" alt-text="All containers return a status of running.":::

   When all containers return a status of running, you can connect the cluster to Azure. 

## Optionally, keep the Log Analytics workspace ID and Shared access key ready

When you deploy Azure Arc-enabled data controller, you can enable automatic upload of metrics and logs during setup. Metrics upload uses the system assigned managed identity. However, uploading logs requires a Workspace ID and the access key for the workspace. 

You can also enable or disable automatic upload of metrics and logs after you deploy the data controller. 

For instructions, see [Create a log analytics workspace](upload-logs.md#create-a-log-analytics-workspace).

## Create Azure Arc data services

After you have completed these prerequisites, you can [Deploy Azure Arc data controller | Direct connect mode](create-data-controller-direct-azure-portal.md).
