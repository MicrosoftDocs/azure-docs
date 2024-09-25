---
title: Create Standard workflows for hybrid environments
description: Create an example Standard workflow that runs in customer-managed, hybrid, on-premises, and multiple cloud environments.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/30/2024
# Customer intent: As a developer, I want to create a Standard workflow that can run in a hybrid, customer-managed environment and that can include on-premises systems, private clouds, and public clouds.
---

# Create Standard workflows for hybrid environments or your own infrastructure (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For scenarios where you need to control and manage your own infrastructure, Azure Logic Apps supports creating Standard workflows that can run in hybrid environments, which can include on-premises systems, private clouds, and public clouds. This hybrid solution is useful when you have partially connected scenarios that require local processing, storage, and network access.

> [!IMPORTANT]
>
> Standard workflows for hybrid environments are created within a [Container App resource](/azure/container-apps/overview) 
> that has **Hybrid Logic App** type and is listed under **Container Apps**. 

## Limitations

The following capabilities currently aren't available in the preview release:

- SAP access through the SAP built-in connector
- XSLT 1.0 for custom code
- Custom code support with .NET Framework
- Managed identity authentication
- File System connector
- Connection creation with managed connectors in the Azure portal

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code and [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  > [!TIP]
  > 
  > If you have a new Visual Studio Code installation, confirm that you can locally run a 
  > basic Standard workflow before you try to deploy in a hybrid environment. This test 
  > run helps isolate any errors that might exist in your Standard workflow project.

## Set up an Azure Kubernetes Service (AKS) cluster

To use [AKS](/azure/aks/what-is-aks) for deployment, you can create an AKS cluster or an [on-premises AKS *hyperconverged infrastructure* (HCI) cluster](/azure-stack/hci/overview). Your AKS cluster requires inbound and outbound connectivity with the [SQL Server that you use as the storage provider](#storage-provider).

### Create an AKS cluster

To create an AKS cluster as your deployment environment, you have the following options:

- [Follow the steps for the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal).

- Run the following commands using Azure Cloud Shell in the Azure portal or using [Azure CLI installed on your local computer](/cli/azure/install-azure-cli):

  > [!NOTE]
  >
  > Change the **max-count** and **min-count** node values based on your load requirements.

  ```azurecli
  az login
  az account set --subscription {Azure-subscription-ID}
  az provider register --namespace Microsoft.KubernetesConfiguration --wait
  az extension add --name k8s-extension --upgrade --yes
  az group create --name {resource-group-name} --location '{Azure-region}'
  az aks create --resource-group {resource-group-name} --name {cluster-name} --enable-aad --generate-ssh-keys --enable-cluster-autoscaler --max-count 6 --min-count 1 
  ```

- Run the following PowerShell commands as an administrator after you [download the provided unsigned PowerShell script]() to create an AKS cluster and an optional Log Analytics workspace for monitoring the logs from the Azure Logic Apps runtime:

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy Unrestricted
  C:\EnvironmentSetup.ps1 -SUBSCRIPTION <Azure-subscription-ID> -GROUP_NAME <Azure-resource-group-name> -LOCATION '<Azure-region>' -KUBE_CLUSTER_NAME <AKS-cluster-name> -LOGANALYTICS_WORKSPACE_NAME <Log-Analytics-workspace-name>
  ```

  | Parameter | Required | Value | Description |
  |-----------|----------|-------|-------------|
  | **SUBSCRIPTION** | Yes | <*Azure-subscription-ID*> | The GUID for your Azure subscription. |
  | **GROUP_NAME** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your container app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-Workflows-RG**. |
  | **LOCATION** | Yes | <*Azure-region*> | The Azure datacenter region for your container app. <br><br>This example uses **North Central US**. |
  | **LOGANALYTICS_WORKSPACE_NAME** | No | <*Log-Analytics-workspace-name*> | The name for the Log Analytics workspace resource to create for monitoring logs. |

  For more information, see the following documentation:

  - [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy)
  - [Tutoral: Enable Azure Container Apps on Azure Arc-enabled Kubernetes](/azure/container-apps/azure-arc-enable-cluster).

### Create an on-premises AKS HCI cluster

To create an on-premises AKS HCI cluster as your deployment environment, see the following documentation:

- [Review deployment prerequisites for Azure Stack HCI](/azure/azure-stack/hci/deploy/deployment-prerequisites)
- [Create Kubernetes clusters using Azure CLI](/azure/aks/hybrid/aks-create-clusters-cli)
- [Quickstart: Create a local Kubernetes cluster on AKS enabled by Azure Arc using Windows Admin Center](/azure/aks/hybrid/create-kubernetes-cluster)
- [Set up an Azure Kubernetes Service host on Azure Stack HCI and Windows Server and deploy a workload cluster using PowerShell](/azure/aks/hybrid/kubernetes-walkthrough-powershell)

For more information about AKS on-premises options, see [Overview of AKS on Windows Server and Azure Stack HCI, version 22H2](/azure/aks/hybrid/overview).

<a name="create-storage-provider"></a>

## Create SQL Server storage provider

Hybrid workflows use SQL Server as the storage provider for Azure Logic Apps runtime storage.

1. Set up any of the following SQL Server editions:

   - SQL Server on premises
   - [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
   - [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)
   - [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview)

   For more informmation, see [Set up SQL storage for Standard logic app workflows](/azure/logic-apps/set-up-sql-db-storage-single-tenant-standard-workflows).

1. Get the connection string for the SQL Server database that you chose to use.

<a name="set-up-smb-file-share"></a>

## Set up SMB file share for artifacts storage

To store artifacts such as maps, schemas, and assemblies for your container app resource, you need to have a file share that uses the [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview). This file share requires inbound and outbound connectivity with your AKS cluster. If you have enabled Azure virtual network restrictions, make sure that your file share exists in the same virtual network as your AKS cluster or in a peered virtual network.

To set up your file share, you must have administrator access. To create and deploy from Visual Studio Code, make sure that the local computer with Visual Studio Code can access the file share. 

### Set up SMB file share on Windows

Make sure that your SMB file share exists in the same virtual network as the AKS cluster where you mount your file share.

1. In Windows, go to the folder that you want to share, open the shortcut menu, select **Properties**.

1. On the **Sharing** tab, select **Share**.

1. In the box that opens, select a person who you want to have access to the file share.

1. Select **Share**, and copy the link for the network path.

   If your local computer isn't connected to a domain, replace the computer name in the network path with the IP address.

1. Save the IP address for later use as the host name.

### Set up SMB file share on Azure Files in Azure portal

Alternatively, for testing purposes, you can use [Azure Files as an SMB file share](/azure/storage/files/files-smb-protocol). Make sure that your SMB file share exists in the same virtual network as the AKS cluster where you mount your file share.

1. In the [Azure portal](https://portal.azure.com), [create an Azure storage account](/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal#create-a-storage-account).

1. From the storage account menu, under **Data storage**, select **File shares**.

1. From the **File shares** page toolbar, select **+ File share**, and provide the required information for your SMB file share.

1. After deployment completes, select **Go to resource**.

1. On the file share menu, select **Overview**, if not selected.

1. On the **Overview** page toolbar, select **Connect**. On the **Connect** pane, select **Show script**.

1. Copy the file share's host name, for example, **mystorage.file.core.windows.net**, file share path, username without **`localhost\`**, and password. Save these values somewhere safe for later use.

1. On the **Overview** page toolbar, select **+ Add directory**, and provide a name to use for the directory. Save this name for later use.

You need these saved values to provide your SMB file share information when you deploy your container app resource.

For more information, see [Create an SMB Azure file share](/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal).

## Confirm SMB file share connection

To test the connection between your AKS cluster and your SMB file share and check that your file share is correctly set up, follow these steps:

- If your SMB file share isn't on the same AKS cluster, confirm that the ping operation works from your AKS cluster to the virtual machine that has your SMB file share. To check that the ping operation works, follow these steps:

  1. In your AKS cluster, create a test [pod](/azure/aks/core-aks-concepts#pods) that runs any Linux image, such as BusyBox or Ubuntu.

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

## Create hybrid logic app in Azure portal

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page toolbar, select **Add**.

1. On the **Create Logic App** page, under **Standard**, select **Hybrid**.

1. On the **Create Logic App (Hybrid)** page, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your hybrid app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **Hybrid-Workflows-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Your hybrid logic app name, which must be unique across regions and can contain only lowercase letters, numbers, or hyphens (**-**). <br><br>This example uses **fabrikam-workflows-hybrid**. |
   | **Region** | Yes | <*Azure-region*> | The Azure datacenter region to use. <br><br>This example uses **North Central US**. |
   | **Container App Connected Environment** | Yes | <*connected-environment-name*> | The AKS cluster that you created as the deployment environment for your hybrid logic app. |
   | **Configure storage settings** | Yes | Enabled or disabled | Continues to the **Storage** tab on the **Create Logic App (Hybrid)** page. |

1. On the **Storage** page, provide the following information about the storage provider and SMB file share that you previously set up for your hybrid logic app:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **SQL connection string** | Yes | <*sql-server-connection-string*> | The SQL Server connection string that you previously saved. For more information, see [Create SQL Server storage provider](#create-storage-provider). |
   | **Host name** | Yes | <*file-share-host-name*> | The host name for your SMB file share. |
   | **File share path** | Yes | <*file-share-path*> | The file share path for your SMB file share. |
   | **User name** | Yes | <*file-share-user-name*> | The user name for your SMB file share. |
   | **Password** | Yes | <*file-share-password*> | The password for your SMB file share. |

1. When you finish, select **Review + create**. Confirm the provided information, and select **Create**.

   Azure creates and deploys your hybrid logic app as a container app with **Hybrid Logic App** type. Your hybrid logic app appears under **Container Apps** in the Azure portal. You can create, edit, and manage workflows as usual from the Azure portal.

1. To review the app settings, on the container app menu, under **Settings**, select **Containers**, and then select the **Environment variables** tab.

   For more information about app settings and host settings, see [Edit app settings and host settings](edit-app-settings-host-settings.md).

## Create hybrid logic app in Visual Studio Code

Before you create and deploy with Visual Studio Code, complete the following requirements:

- Confirm that your SMB file share server is accessible.
- Confirm that port 445 is open on the computer where you run Visual Studio Code.
- Run Visual Studio Code as administrator.

1. In Visual Studio Code, on the Activity Bar, select the Azure icon.

1. In the **Workspace** section toolbar, select the Azure Logic Apps icon, and then select **Deploy to logic app**.

1. Select your Azure subscription.

1. Browse to the folder where you want to save your hybrid logic app project. Create a folder for your project, select that folder, and then select **Select**.

1. From the list that appears, select **Create new Logic App (Standard) in Azure**. Provide a globally unique name in lowercase letters for your hybrid logic app.

   This example uses **my-hybrid-logic-app**.

1. From the region list that appears, select the same Azure region where you have your connected environment.

1. From the hosting plan list, select **Hybrid**.

1. From the resource group list, select **Create new resource group**. Provide a name for your resource group.

   This example uses **Hybrid-RG**.

1. From the connected environment list, select your environment.

1. Provide your previously saved values for the host IP address, SMB file share path, username, and password for your artifacts storage.

1. Provide the connection string for the SQL database that you set up for runtime storage.

You can monitor the deployment status under Azure Activity logs.  

## Known issues and troubleshooting

### AKS clusters

In rare scenarios, you might notice a high memory footprint in your cluster. To prevent this issue, either scale out or add autoscale for node pools.

### Managed connectors

You must create connections for managed connectors through Visual Studio Code, not the Azure portal, for hybrid logic app workflows. In Visual Studio Code, connections are valid for seven days and requires reauthentication after that time.

### Function-based triggers

Some function-based triggers, such as Azure Blob, Cosmos DB, and Event Hubs require a connection to your Azure storage account. If you use any function-based triggers, in your project's **local.settings.json** file or hybrid logic app's environment variables in the Azure portal, add the following app setting and provide your storage account connection string:

```json
"Values": {
    "name": "AzureWebJobsStorage",
    "value": "{storage-account-connection-string}"
}
```

### Function host isn't running

After you deploy your hybrid logic app, confirm that your app is running correctly.

1. In the Azure portal, go to the container app resource for your hybrid logic app.

1. On the container app menu, select **Overview**.

1. On the **Overview** page, next to the **Application Url** field, select your container app's URL.

   If your app is running correctly, a browser window opens and shows the following message:

   :::image type="content" source="media/create-single-tenant-hybrid-workflows/running-hybrid-logic-app.png" alt-text="Screenshot shows browser and hybrid logic app running as a website.":::

   Otherwise, if your app has any failures, check that your AKS pods are running correctly. From Windows PowerShell, run the following commands:

   ```powershell
   az aks get-credentials {resource-group-name} --name {aks-cluster-name} --admin
   kubectl get ns
   kubectl get pods -n logicapps-aca-ns
   kubectl describe pod {logic-app-pod-name} -n logicapps-aca-ns 
   ```

   For more information, see the following documentation:

   - [az aks get-credentials](/cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials)
   - [Command line tool (kubetctl)](https://kubernetes.io/docs/reference/kubectl/)

### AKS cluster doesn't have enough nodes

If you ran the previous command and get a warning similar to the following example, your cluster doesn't have enough nodes for processing:

**`Warning: FailedScheduling  4m52s (x29 over 46m)  default-scheduler  0/2 nodes are available: 2 Too many pods. preemption: 0/2 nodes are available: 2 No preemption victims found for incoming pod.`**

To increase the number of nodes, and set up autoscale, follow these steps:

1. In the Azure portal, go to your Kubernetes service instance.

1. On the instance menu, under **Settings**, select **Node pools**.

1. On the **Node tools** page toolbar, select **+ Add node pool**.

For more information, see the following documentation:

- [Create node pools for a cluster in Azure Kubernetes Service (AKS)](/azure/aks/create-node-pools)
- [Manage node pools for a cluster in Azure Kubernetes Service (AKS)](/azure/aks/manage-node-pools)
- [Cluster autoscaling in Azure Kubernetes Service (AKS) overview](/azure/aks/cluster-autoscaler-overview)
- [Use the cluster autoscaler in Azure Kubernetes Service (AKS)](/azure/aks/cluster-autoscaler?tabs=azure-cli)

### SMB Container Storage Interface (CSI) driver not installed

After you ran the earlier **`kubectl describe pod`** command, if the following warning appears, confirm whether the CSI driver for your SMB file share is installed correctly:

**`Warning FailedScheduling 5m16s (x2 over 5m27s)  default-scheduler 0/14 nodes are available: pod has unbound immediate PersistentVolumeClaims. preemption: 0/14 nodes are available: 14 Preemption is not helpful for scheduling.`**

**`Normal NotTriggerScaleUp 9m49s (x31 over 14m) cluster-autoscaler pod didn't trigger scale-up: 3 pod has unbound immediate PersistentVolumeClaims`**

To confirm, from Windows PowerShell, run the following commands:

```powershell
kubectl get csidrivers
```

If the results list that appears doesn't include **smb.csi.k8s.io**, from a Windows command prompt, and run the following command:

**`helm repo add csi-driver-smb`**<br>
**`help repo update`**
**`helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.15.0`**

To check the CSI SMB Driver pods status, from the Windows command prompt, run the following command:

**`kubectl --namespace=kube-system get pods --selector="app.kubernetes.io/name=csi-driver-smb" --watch`**

For more information, see [Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)](/azure/aks/csi-storage-drivers).

## Related content
