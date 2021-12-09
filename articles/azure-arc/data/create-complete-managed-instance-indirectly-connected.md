---
title: Quickstart - Deploy Azure Arc-enable data services - indirectly connected mode - Azure CLI
description: Demonstrates how to deploy Azure Arc-enabled data services in indirectly connected mode from beginning, including a Kubernetes cluster. Uses Azure CLI. Finishes with an instance of Azure SQL Managed Instance.
author: MikeRayMSFT
ms.author: mikeray
services: azure-arc
ms.service: azure-arc-data
ms.topic: quickstart 
ms.date: 12/06/2021
ms.custom: template-quickstart 
---

# Quickstart: Deploy Azure Arc-enable data services - indirectly connected mode - Azure CLI

This article demonstrates how to deploy Azure Arc-enabled data services in indirectly connected mode from with the Azure CLI.

To deploy in directly connected mode, see [Quickstart: Deploy Azure Arc-enable data services - directly connected mode - Azure portal](create-complete-managed-instance-directly-connected.md).

When you complete the steps in this article, you will have:

1. A Kubernetes cluster on Azure Kubernetes Services (AKS) 
1. A data controller in indirectly connected mode
1. An instance of Azure Arc-enabled SQL Managed Instance
1. A connection to the instance with Azure Data Studio

Use these objects to experience Azure Arc-enabled data services. 

Azure Arc allows you to run Azure data services on-premises, at the edge, and in public clouds via Kubernetes. Deploy SQL Managed Instance and PostgreSQL Hyperscale data services (preview) with Azure Arc. The benefits of using Azure Arc include staying current with constant service patches, elastic scale, self-service provisioning, unified management, and support for disconnected mode.  

## Install client tools

First, install the [client tools](install-client-tools.md) needed on your machine. To complete the steps in this article, you will use the following tools:
* Azure Data Studio
* The Azure Arc extension for Azure Data Studio
* Kubernetes CLI
* Azure CLI 
* arcdata extension for Azure CLI.

In addition, because this deployment is on Azure Kubernetes Service, you need the following additional extensions:

* connectedk8s
* k8sconfiguration
* k8s-configuration
* k8s-extension



## Set metrics and logs service credentials

Azure Arc-enabled data services provides:
-	Log services and dashboards with Kibana
-	Metrics services and dashboards with Grafana

These services require a credential for each service. The credential is a username and a password. For this step, set an environment variable with the values for each credential. 

The environment variables include passwords for log and metric services. The passwords must be at least eight characters long and contain characters from three of the following four categories: Latin uppercase letters, Latin lowercase letters, numbers, and non-alphanumeric characters.

Run the following command to set the credential. 

#### [Linux](#tab/linux)

```console
export AZDATA_LOGSUI_USERNAME=<username for logs>
export AZDATA_LOGSUI_PASSWORD=<password for logs>
export AZDATA_METRICSUI_USERNAME=<username for metrics>
export AZDATA_METRICSUI_PASSWORD=<password for metrics>
```

#### [Windows / PowerShell](#tab/powershell)

```powershell
$ENV:AZDATA_LOGSUI_USERNAME="<username for logs>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for logs>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for metrics>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for metrics>"
```

---

## Create and connect to your Kubernetes cluster

After you install the client tools, and configure the environment variables, you need access to a Kubernetes cluster. The steps in this section deploy an cluster on Azure Kubernetes Service (AKS).


Follow the steps below to deploy the cluster from the Azure CLI.  

1. Create the resource group

   Create a resource group for the cluster. For location, specify a supported region. For Azure Arc-enabled data services, supported regions are listed in the [Overview](overview.md#supported-regions).

   ```azurecli
   az group create --name <resource_group_name> --location <location>
   ```

   To learn more about resource groups, see [What is Azure Resource Manager](../../azure-resource-manager/management/overview.md).

1. Create Kubernetes cluster

   Create the cluster in the resource group that you created previously.

   The following example creates a 3 node cluster, with monitoring enabled, and generates public and private key files if missing.

   ```azurecli
   az aks create --resource-group <resource_group_name> --name <cluster_name> --node-count 3 --enable-addons monitoring --generate-ssh-keys --node-vm-size Standard_D8s_v3
   ```

   For command details, see [az aks create](/cli/azure/aks?view=azure-cli-latest&preserve-view=true#az_aks_create).

   For a complete demonstration, including an application on a single-node Kubernetes cluster, go to [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](../../aks/kubernetes-walkthrough.md).

1. Get credentials

   You will need to get credential to connect to your cluster.

   Run the following command to get the credentials:

   ```azurecli
   az aks get-credentials --resource-group <resource_group_name> --name <cluster_name>
   ```

1. Verify cluster

   To confirm the cluster is running and that you have the current connection context, run

   ```console
   kubectl get nodes
   ```

   The command returns a list of nodes. For example:

   ```output
   NAME                                STATUS   ROLES   AGE     VERSION
   aks-nodepool1-34164736-vmss000000   Ready    agent   4h28m   v1.20.9
   aks-nodepool1-34164736-vmss000001   Ready    agent   4h28m   v1.20.9
   aks-nodepool1-34164736-vmss000002   Ready    agent   4h28m   v1.20.9
   ```

## Create the data controller

Now that our cluster is up and running, we are ready to create the data controller in indirectly connected mode.

The CLI command to create the data controller is: 

```azurecli
az arcdata dc create --profile-name azure-arc-aks-premium-storage --k8s-namespace <namespace> --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --use-k8s
```

## Create Azure Arc-enabled SQL Managed Instance

Now, we can create the Azure MI for indirectly connected mode with the following command: 

```azurecli
az sql mi-arc create -n <instanceName> --k8s-namespace <namespace> --use-k8s 
```

## Connect to managed instance on Azure Data Studio

To connect with Azure Data Studio, see [Connect to Azure Arc-enabled SQL Managed Instance](connect-managed-instance.md). 

## Next steps

[Upload usage data, metrics, and logs to Azure](upload-metrics-and-logs-to-azure-monitor.md)