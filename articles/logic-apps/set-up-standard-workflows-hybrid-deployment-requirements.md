---
title: Set up your own infrastructure for Standard workflows
description: Set up the requirements for your own managed infrastructure to deploy and host Standard logic app workflows using the hybrid deployment model.
services: azure-logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/14/2024
# Customer intent: As a developer, I need to set up the requirements to host and run Standard logic app workflows on infrastructure that my organization owns, which can include on-premises systems, private clouds, and public clouds.
---

# Set up your own infrastructure for Standard logic apps using hybrid deployment (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps supports scenarios where you need to use your own managed infrastructure to deploy and host Standard logic app workflows by offering a hybrid deployment model. This model provides the capabilities for hosting integration solutions in partially connected environments that require local processing, storage, and network access. Standard logic app workflows are powered by the Azure Logic Apps runtime that is hosted on premises as an Azure Container Apps extension.

The following architectural overview shows where Standard logic app workflows are hosted and run in the hybrid model. The partially connected environment includes the following resources for hosting and working with your Standard logic apps, which deploy as Azure Container Apps resources:

- Either Azure Arc-enabled Kubernetes clusters or Azure Arc-enabled Kubernetes clusters on Azure Stack *hyperconverged infrastructure* (HCI)
- A SQL database to locally store workflow run history, inputs, and outputs for processing
- A Server Message Block (SMB) file share to locally store artifacts used by your workflows

:::image type="content" source="media/set-up-standard-workflows-hybrid-deployment-requirements/architecture-overview.png" alt-text="Diagram with architectural overview for where Standard logic apps are hosted in a partially connected environment." border="false":::

For more information, see the following documentation:

- [What is Azure Kubernetes Service?](/azure/aks/what-is-aks)
- [Azure Arc-enabled Azure Kubernetes Service (AKS) clusters](/azure/azure-arc/kubernetes/overview)
- [Azure Arc-enabled Kubernetes clusters on Azure Stack hyperconverged infrastructure (HCI)](/azure-stack/hci/overview)
- [What is Azure Container Apps?](../container-apps/overview.md)
- [Azure Container Apps on Azure Arc](../container-apps/azure-arc-overview.md)
- [Custom locations on Azure Arc-enabled AKS](/azure/azure-arc/platform/conceptual-custom-locations)

This how-to guide shows how to set up the necessary on-premises resources in your infrastructure so that you can create, deploy, and host a Standard logic app workflow using the hybrid deployment model.

## Create an Azure Arc-enabled Kubernetes cluster

To deploy and host your Standard logic app as on-premises resource, create an [Azure Arc-enabled Kubernetes cluster](/azure/azure-arc/kubernetes/overview) or an [Azure Arc-enabled Kubernetes cluster on Azure Stack HCI infrastructure](/azure-stack/hci/overview).

Your AKS cluster requires inbound and outbound connectivity with the [SQL database that you use as the storage provider](#create-storage-provider) and the [Server Message Block file share that you use for artifacts storage]
Your SQL database requires inbound and outbound connectivity with your AKS cluster, so these resources must exist in the same network.

### Create a Kubernetes cluster and connect to Azure Arc

Choose one of the following options to create and set up your Arc-enabled Kubernetes cluster for the deployment environment:

##### [Portal](#tab/azure-portal)

1. [Follow these steps to create an AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-portal).

1. [Follow these steps to connect the cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster).

##### [Azure CLI](#tab/azure-cli)

Run the following commands either by using Azure Cloud Shell in the Azure portal or by using [Azure CLI installed on your local computer](/cli/azure/install-azure-cli):

> [!NOTE]
>
> Make sure to change the **max-count** and **min-count** node values based on your load requirements.

```azurecli
az login
az account set --subscription <Azure-subscription-ID>
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az extension add --name k8s-extension --upgrade --yes
az group create --name <Azure-resource-group-name> --location '<Azure-region>'
az aks create --resource-group <Azure-resource-group-name> --name <AKS-cluster-name> --enable-aad --generate-ssh-keys --enable-cluster-autoscaler --max-count 6 --min-count 1 
```

| Command | Parameter | Required | Value | Description |
|---------|-----------|----------|-------|-------------|
| **`az account set`** | **`subscription`** | Yes | <*Azure-subscription-ID*> | The GUID for your Azure subscription. <br><br>For more information, see [**az account set**](/cli/azure/account#az-account-set). |
| **`az group create`** | **`name`** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your container app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-RG**. <br><br>For more information, see [**az group create**](/cli/azure/group#az-group-create). |
| **`az group create`** | **`location`** | Yes | <*Azure-region*> | An Azure region that is [supported for Azure container apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-overview.md#public-preview-limitations). <br><br>This example uses **East US**. <br><br>For more information, see [**az group create**](/cli/azure/group#az-group-create). |
| **`az aks create`** | **`name`** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your container app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-RG**. <br><br>For more information, see [**az aks create**](/cli/azure/aks#az-aks-create). |
| **`az aks create`** | **`max count`** | No | <*max-nodes-value*> | The maximum number of nodes to use for the autoscaler when you include the **`enable-cluster-autoscaler`** option. This value ranges from **1** to **1000**. <br><br>For more information, see [**az aks create**](/cli/azure/aks#az-aks-create). |
| **`az aks create`** | **`min count`** | No | <*min-nodes-value*> | The minimum number of nodes to use for the autoscaler when you include the **`enable-cluster-autoscaler`** option. This value ranges from **1** to **1000**. <br><br>For more information, see [**az aks create**](/cli/azure/aks#az-aks-create). |

##### [Azure PowerShell](#tab/azure-powershell)

1. Run the following PowerShell command as an administrator:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

   For more information, see [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy).

1. [Follow the steps in "Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes"](/azure/container-apps/azure-arc-enable-cluster) using PowerShell, but use the following commands and parameter values specific to Azure Logic Apps to create the Azure Arc-enabled Kubernetes cluster and an optional Log Analytics workspace to monitor the logs from the Azure Logic Apps runtime.

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **SUBSCRIPTION** | Yes | <*Azure-subscription-ID*> | The ID for your Azure subscription. |
   | **GROUP_NAME** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your container app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-RG**. |
   | **LOCATION** | Yes | **'**<*Azure-region*>**'** | An Azure region that is [supported for Azure container apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-overview.md#public-preview-limitations). <br><br>This example uses **East US**. |
   | **KUBE_CLUSTER_NAME** | Yes | <*cluster-name*> | The name for your cluster. |
   | **LOGANALYTICS_WORKSPACE_NAME** | No | <*Log-Analytics-workspace-name*> | The name for the Log Analytics workspace resource to create for monitoring logs. |

---

### Create an AKS cluster on Azure Stack HCI

To create and set up an AKS cluster on Azure Stack HCI instead as the deployment environment, see the following documentation:

- [Review deployment prerequisites for Azure Stack HCI](/azure-stack/hci/deploy/deployment-prerequisites)
- [Create Kubernetes clusters using Azure CLI](/azure/aks/hybrid/aks-create-clusters-cli)
- [Quickstart: Create a local Kubernetes cluster on AKS enabled by Azure Arc using Windows Admin Center](/azure/aks/hybrid/create-kubernetes-cluster)
- [Set up an Azure Kubernetes Service host on Azure Stack HCI and Windows Server and deploy a workload cluster using PowerShell](/azure/aks/hybrid/kubernetes-walkthrough-powershell)

For more information about AKS on Azure Stack HCI options, see [Overview of AKS on Windows Server and Azure Stack HCI, version 22H2](/azure/aks/hybrid/overview).

<a name="create-storage-provider"></a>

## Create SQL Server storage provider

Standard logic app workflows in the hybrid deployment model use a SQL database as the storage provider for the data used by workflows and the Azure Logic Apps runtime, for example, workflow run history, inputs, outputs, and so on. 

Your SQL database requires inbound and outbound connectivity with your AKS cluster, so these resources must exist in the same network.

1. Set up any of the following SQL Server editions:

   - SQL Server on premises
   - [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
   - [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)
   - [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview)

   For more information, see [Set up SQL database storage for Standard logic app workflows](/azure/logic-apps/set-up-sql-db-storage-single-tenant-standard-workflows).

1. Confirm that your SQL database is in the same network as your cluster and SMB file share.

1. Find and save the connection string for the SQL database that you created.

<a name="set-up-smb-file-share"></a>

## Set up SMB file share for artifacts storage

To store artifacts such as maps, schemas, and assemblies for your container app resource, you need to have a file share that uses the [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview).

- You need administrator access to set up your SMB file share.

- Your SMB file share must exist in the same network as your AKS cluster and SQL database.

- Your SMB file share requires inbound and outbound connectivity with your AKS cluster. If you enabled Azure virtual network restrictions, make sure that your file share exists in the same virtual network as your AKS cluster or in a peered virtual network.

- To deploy your logic app using Visual Studio Code, make sure that the local computer with Visual Studio Code can access the file share.

### Set up your SMB file share on Windows

Make sure that your SMB file share exists in the same virtual network as the cluster where you mount your file share.

1. In Windows, go to the folder that you want to share, open the shortcut menu, select **Properties**.

1. On the **Sharing** tab, select **Share**.

1. In the box that opens, select a person who you want to have access to the file share.

1. Select **Share**, and copy the link for the network path.

   If your local computer isn't connected to a domain, replace the computer name in the network path with the IP address.

1. Save the IP address to use later as the host name.

### Set up Azure Files as your SMB file share

Alternatively, for testing purposes, you can use [Azure Files as an SMB file share](/azure/storage/files/files-smb-protocol). Make sure that your SMB file share exists in the same virtual network as the cluster where you mount your file share.

1. In the [Azure portal](https://portal.azure.com), [create an Azure storage account](/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal#create-a-storage-account).

1. From the storage account menu, under **Data storage**, select **File shares**.

1. From the **File shares** page toolbar, select **+ File share**, and provide the required information for your SMB file share.

1. After deployment completes, select **Go to resource**.

1. On the file share menu, select **Overview**, if not selected.

1. On the **Overview** page toolbar, select **Connect**. On the **Connect** pane, select **Show script**.

1. Copy the following values and save them somewhere safe for later use:

   - File share's host name, for example, **mystorage.file.core.windows.net**
   - File share path
   - Username without **`localhost\`**
   - Password

1. On the **Overview** page toolbar, select **+ Add directory**, and provide a name to use for the directory. Save this name to use later.

You need these saved values to provide your SMB file share information when you deploy your container app resource.

For more information, see [Create an SMB Azure file share](/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal).

## Confirm SMB file share connection

To test the connection between your Arc-enabled Kubernetes cluster and your SMB file share, and to check that your file share is correctly set up, follow these steps:

- If your SMB file share isn't on the same cluster, confirm that the ping operation works from your cluster to the virtual machine that has your SMB file share. To check that the ping operation works, follow these steps:

  1. In your cluster, create a test [pod](/azure/aks/core-aks-concepts#pods) that runs any Linux image, such as BusyBox or Ubuntu.

  1. Go to the container in your pod, and install the **iputils-ping** package by running the following Linux commands:

     ```
     apt-get update
     apt-get install iputils-ping
     ```

- To confirm that your SMB file share is correctly set up, follow these steps:

  1. In your test pod with the same Linux image, create a folder that has the path named **mnt/smb**.

  1. Go to the root or home directory that contains the **mnt** folder.

  1. Run the following command:

     **`- mount -t cifs //{ip-address-smb-computer}/{file-share-name}/mnt/smb -o username={user-name}, password={password}`**

- To confirm that artifacts correctly upload, connect to the SMB file share path, and check whether artifact files exist in the correct folder that you specify during deployment.

## Next steps

[Create Standard logic app workflows for hybrid deployment on your own infrastructure]