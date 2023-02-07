---
title: Quickstart - Deploy Azure Arc-enabled data services
description: Quickstart - deploy Azure Arc-enabled data services in indirectly connected mode. Includes a Kubernetes cluster. Uses Azure CLI.
author: MikeRayMSFT
ms.author: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: quickstart 
ms.date: 09/20/2022
ms.custom: template-quickstart , devx-track-azurecli
---

# Quickstart: Deploy Azure Arc-enabled data services - indirectly connected mode - Azure CLI

In this quickstart, you will deploy Azure Arc-enabled data services in indirectly connected mode from with the Azure CLI.

When you complete the steps in this article, you will have:

- A Kubernetes cluster on Azure Kubernetes Services (AKS).
- A data controller in indirectly connected mode.
- An instance of Azure Arc-enabled SQL Managed Instance.
- A connection to the instance with Azure Data Studio.

Use these objects to experience Azure Arc-enabled data services. 

Azure Arc allows you to run Azure data services on-premises, at the edge, and in public clouds via Kubernetes. Deploy SQL Managed Instance and PostgreSQL server data services (preview) with Azure Arc. The benefits of using Azure Arc include staying current with constant service patches, elastic scale, self-service provisioning, unified management, and support for disconnected mode.  

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To complete the task in this article, install the required [client tools](install-client-tools.md). Specifically, you will use the following tools:

* Azure Data Studio
* The Azure Arc extension for Azure Data Studio
* Kubernetes CLI
* Azure CLI 
* `arcdata` extension for Azure CLI

## Set metrics and logs service credentials

Azure Arc-enabled data services provides:
-	Log services and dashboards with Kibana
-	Metrics services and dashboards with Grafana

These services require a credential for each service. The credential is a username and a password. For this step, set an environment variable with the values for each credential. 

The environment variables include passwords for log and metric services. The passwords must be at least eight characters long and contain characters from three of the following four categories: Latin uppercase letters, Latin lowercase letters, numbers, and non-alphanumeric characters.

Run the following command to set the credential. 

### [Linux](#tab/linux)

```console
export AZDATA_LOGSUI_USERNAME=<username for logs>
export AZDATA_LOGSUI_PASSWORD=<password for logs>
export AZDATA_METRICSUI_USERNAME=<username for metrics>
export AZDATA_METRICSUI_PASSWORD=<password for metrics>
```

### [Windows / PowerShell](#tab/powershell)

```powershell
$ENV:AZDATA_LOGSUI_USERNAME="<username for logs>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for logs>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for metrics>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for metrics>"
```

---

## Create and connect to your Kubernetes cluster

After you install the client tools, and configure the environment variables, you need access to a Kubernetes cluster. The steps in this section deploy a cluster on Azure Kubernetes Service (AKS).


Follow the steps below to deploy the cluster from the Azure CLI.  

1. Create the resource group

   Create a resource group for the cluster. For location, specify a supported region. For Azure Arc-enabled data services, supported regions are listed in the [Overview](overview.md#supported-regions).

   ```azurecli
   az group create --name <resource_group_name> --location <location>
   ```

   To learn more about resource groups, see [What is Azure Resource Manager](../../azure-resource-manager/management/overview.md).

1. Create Kubernetes cluster

   Create the cluster in the resource group that you created previously.

   Select a node size that meets your requirements. See [Sizing guidance](sizing-guidance.md).

   The following example creates a three node cluster, with monitoring enabled, and generates public and private key files if missing.

   ```azurecli
   az aks create --resource-group <resource_group_name> --name <cluster_name> --node-count 3 --enable-addons monitoring --generate-ssh-keys --node-vm-size <node size>
   ```

   For command details, see [az aks create](/cli/azure/aks#az-aks-create).

   For a complete demonstration, including an application on a single-node Kubernetes cluster, go to [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](../../aks/learn/quick-kubernetes-deploy-cli.md).

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
az arcdata dc create --profile-name azure-arc-aks-premium-storage --k8s-namespace <namespace> --name <data controller name> --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --use-k8s
```

### Monitor deployment

You can also monitor the creation of the data controller with the following command: 

```console
kubectl get datacontroller --namespace <namespace>
```

The command returns the state of the data controller. For example, the following results indicate that the deployment is in progress:

```output
NAME          STATE
<namespace>   DeployingMonitoring
```

Once the state of the data controller is ‘READY’, then this step is completed. For example:

```output
NAME          STATE
<namespace>   Ready
```

## Create an instance of Azure Arc-enabled SQL Managed Instance

Now, we can create the Azure MI for indirectly connected mode with the following command: 

```azurecli
az sql mi-arc create -n <instanceName> --k8s-namespace <namespace> --use-k8s 
```

To know when the instance has been created, run:

```console
kubectl get sqlmi -n <namespace>[
```

Once the state of the managed instance namespace is ‘READY’, then this step is completed. For example:

```output
NAME          STATE
<namespace>   Ready
```

## Connect to managed instance on Azure Data Studio

To connect with Azure Data Studio, see [Connect to Azure Arc-enabled SQL Managed Instance](connect-managed-instance.md). 

## Upload usage and metrics to Azure portal

If you wish, you can [Upload usage data, metrics, and logs to Azure](upload-metrics-and-logs-to-azure-monitor.md).

## Clean up resources

After you are done with the resources you created in this article.

Follow the steps in [Delete data controller in indirectly connected mode](uninstall-azure-arc-data-controller.md#delete-data-controller-in-indirectly-connected-mode).

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy Azure Arc-enabled data services - directly connected mode - Azure portal](create-complete-managed-instance-directly-connected.md).
