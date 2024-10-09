---
title: Create Standard logic apps for hybrid deployment
description: Create and deploy an example Standard logic app workflow on your own managed infrastructure, which can include on-premises, private cloud, and public cloud environments.
services: azure-logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/14/2024
# Customer intent: As a developer, I want to create a Standard logic app workflow that can run on customer-managed infrastructure, which can include on-premises systems, private clouds, and public clouds.
---

# Create Standard logic app workflows for hybrid deployment on your own infrastructure (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview, incurs charges for usage, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For scenarios where you need to use, control, and manage your own infrastructure, you can create Standard logic app workflows using the hybrid deployment model in Azure Logic Apps. This model provides capabilities for you to build and host integration solutions for partially connected environments that require local processing, storage, and network access. Your infrastructure can include on-premises systems, private clouds, and public clouds. With the hybrid model, your Standard logic app workflow is powered by the Azure Logic Apps runtime that is hosted on premises as an Azure Container Apps extension. 

For an architectural overview that shows where Standard logic app workflows are hosted and run in a partially connected environment, see [Set up infrastructure requirements for hybrid deployment for Standard logic apps](set-up-standard-workflows-hybrid-deployment-requirements.md).

This how-to guide shows how to create and deploy a Standard logic app workflow using the hybrid deployment model after you set up the necessary on-premises resources for hosting your app.

## Limitations

- Hybrid deployment is currently available and supported only for [Azure Arc-enabled Azure Kubernetes Service (AKS) clusters](/azure/azure-arc/kubernetes/overview) and [Azure Arc-enabled Kubernetes clusters on Azure Stack hyperconverged infrastructure (HCI)](/azure-stack/hci/overview).

- Hybrid deployment is available and supported only in the [same regions as Azure Container Apps on Azure Arc-enabled AKS](../container-apps/azure-arc-overview.md#public-preview-limitations).

- The following capabilities currently aren't available in this preview release:

  - SAP access through the SAP built-in connector
  - XSLT 1.0 for custom code
  - Custom code support with .NET Framework
  - Managed identity authentication
  - File System connector

- You must create connections for managed connectors in your workflow through Visual Studio Code, not the Azure portal. To set up authentication for managed connectors, [follow these steps to set up connection authentication](azure-arc-enabled-logic-apps-create-deploy-workflows.md#set-up-connection-authentication).

- Some function-based triggers, such as Azure Blob, Cosmos DB, and Event Hubs require a connection to the Azure storage account assocated with your Standard logic app. If you use any function-based triggers, in your Standard logic app's environment variables in the Azure portal or in your logic app project's **local.settings.json** file in Visual Studio Code, add the following app setting and provide your storage account connection string:

  ```json
  "Values": {
    "name": "AzureWebJobsStorage",
    "value": "{storage-account-connection-string}"
  }
  ```

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The following on-premises resources, which must all exist within the same network for the required connectivity:

  - An Azure Kubernetes Service cluster that's connected to Azure Arc
  - A SQL database to locally store workflow run history, inputs, and outputs for processing
  - A Server Message Block (SMB) file share to locally store artifacts used by your workflows

  To meet these requirements, [set up these on-premises resources to support hybrid deployment for Standard logic apps](set-up-standard-workflows-hybrid-deployment-requirements.md).

- For Visual Studio Code, you need the Azure Logic Apps (Standard) extension for Visual Studio Code, and [set up the related prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  > [!TIP]
  > 
  > If you have a new Visual Studio Code installation, confirm that you can locally run a 
  > basic Standard workflow before you try deploying to your own infrastructure. This test 
  > run helps isolate any errors that might exist in your Standard workflow project.

## Create your Standard logic app in the Azure portal

After you meet the prerequisites, create your Standard logic app for hybrid deployent by following these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page toolbar, select **Add**.

1. On the **Create Logic App** page, under **Standard**, select **Hybrid**.

1. On the **Create Logic App (Hybrid)** page, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your hybrid app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **Hybrid-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Your logic app name, which must be unique across regions and can contain only lowercase letters, numbers, or hyphens (**-**). <br><br>This example uses **my-hybrid-logic-app**. |
   | **Region** | Yes | <*Azure-region*> | An Azure region that is [supported for Azure container apps on Azure Arc-enabled AKS](../container-apps/azure-arc-overview.md#public-preview-limitations). <br><br>This example uses **East US**. |
   | **Container App Connected Environment** | Yes | <*connected-environment-name*> | The Arc-enabled Kubernetes cluster that you created as the deployment environment for your logic app. For more information, see [Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-enable-cluster.md). |
   | **Configure storage settings** | Yes | Enabled or disabled | Continues to the **Storage** tab on the **Create Logic App (Hybrid)** page. |

   The following example shows the logic app creation page in the Azure portal with sample values:

   :::image type="content" source="media/create-standard-workflows-hybrid-deployment/create-logic-app-hybrid-portal.png" alt-text="Screenshot shows Azure portal and logic app creation page.":::

1. On the **Storage** page, provide the following information about the storage provider and SMB file share that you previously set up:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **SQL connection string** | Yes | <*sql-server-connection-string*> | The SQL Server connection string that you previously saved. For more information, see [Create SQL Server storage provider](set-up-standard-workflows-hybrid-deployment-requirements.md#create-storage-provider). |
   | **Host name** | Yes | <*file-share-host-name*> | The host name for your SMB file share. |
   | **File share path** | Yes | <*file-share-path*> | The file share path for your SMB file share. |
   | **User name** | Yes | <*file-share-user-name*> | The user name for your SMB file share. |
   | **Password** | Yes | <*file-share-password*> | The password for your SMB file share. |

1. When you finish, select **Review + create**. Confirm the provided information, and select **Create**.

   Azure currently creates and deploys your logic app as a [Container App resource](/azure/container-apps/overview). In this preview release, your logic app appears in the Azure portal under **Container Apps** and not **Logic apps**. You can create, edit, and manage workflows as usual from the Azure portal. Your Container Apps connected environment in the Azure portal lists the logic app as having **Hybrid Logic App** type.

1. To review the app settings, on the container app menu, under **Settings**, select **Containers**, and then select the **Environment variables** tab.

   For more information about app settings and host settings, see [Edit app settings and host settings](edit-app-settings-host-settings.md).

## Create your Standard logic app in Visual Studio Code

After you meet the prerequisites, but before you create your Standard logic app for hybrid deployent in Visual Studio Code, confirm the f

1. Confirm that the following conditions are met:

   - Your SMB file share server is accessible.
   - Port 445 is open on the computer where you run Visual Studio Code.

1. Run Visual Studio Code as administrator.

1. In Visual Studio Code, on the Activity Bar, select the Azure icon.

1. In the **Workspace** section, from the toolbar, select the Azure Logic Apps icon, and then select **Create new project**.

1. Browse to the location where you want to create the folder for your Standard logic app project. Create your project folder, select the folder, and then choose **Select**.

1. From the workflow type list, select **Stateful Workflow** or **Stateless Workflow**. Provide a name for your workflow.

   This example selects **Stateful Workflow** and uses **my-stateful-workflow** as the name.

1. From the list that appears, select **Open in current window**.

   Visual Studio Code creates and opens your logic app project to show the **workflow.json** file.

1. From the list that appears, select **Use connectors from Azure**.

1. From the subscription list, select your Azure subscription.

1. From the resource group list, select **Create new resource group**. Provide a name for your resource group.

   This example uses **Hybrid-RG**.

1. From the location list, select an Azure region that is [supported for Azure container apps on Azure Arc-enabled AKS](../container-apps/azure-arc-overview.md#public-preview-limitations).

   This example uses **East US**.

1. In the **Explorer** window, open the shortcut menu for the **workflow.json** file, and select **Open Designer**.

1. Build your workflow as usual by adding a trigger and actions. For more information, see [Build a workflow with a trigger and actions](create-workflow-with-trigger-or-action.md).

## Deploy your logic app from Visual Studio Code

After you finish building your workflow, you can deploy your logic app to your partially connected environment.

1. In the **Explorer** window, open the shortcut menu for the workflow node, which is **my-stateful-workflow** in this example, and select **Deploy to logic app**.

1. From the subscription list, select your Azure subscription.

1. From the available logic apps list, select **Create new Logic App (Standard) in Azure**. Provide a globally unique logic app name that uses only lowercase alphanumeric characters or hyphens.

   This example uses **my-hybrid-logic-app**.

1. From the location list that appears, select the same Azure region where you have your connected environment.

   This example uses **East US**.

1. From the hosting plan list, select **Hybrid**.

1. From the resource group list, select **Create new resource group**. Provide a name for your resource group.

   This example uses **Hybrid-RG**.

1. From the connected environment list, select your environment.

1. Provide your previously saved values for the host name, SMB file share path, username, and password for your artifacts storage.

1. Provide the connection string for the SQL database that you set up for runtime storage.

   Visual Studio Code starts the deployment process for your logic app, which is created and deployed as a [Container App resource](/azure/container-apps/overview).

1. To monitor deployment status and Azure activity logs, from the **View** menu, select **Output**. In the window that opens, select **Azure**.

In this release, your Standard logic app appears in the Azure portal under **Container Apps** and not **Logic apps**. You can create, edit, and manage workflows as usual from the Azure portal.

## Known issues and troubleshooting

### Azure portal

- Standard logic apps for hybrid deployment currently appear in the Azure portal in the **Container Apps** resource list and not the **Logic apps** resource list.

- To reflect changes in the designer after you save your workflow, you might have to occasionally refresh the designer.

### Arc-enabled Kubernetes clusters

In rare scenarios, you might notice a high memory footprint in your cluster. To prevent this issue, either scale out or add autoscale for node pools.

### Function host isn't running

After you deploy your Standard logic app, confirm that your app is running correctly.

1. In the Azure portal, go to the container app resource for your logic app.

1. On the container app menu, select **Overview**.

1. On the **Overview** page, next to the **Application Url** field, select your container app's URL.

   If your app is running correctly, a browser window opens and shows the following message:

   :::image type="content" source="media/create-standard-workflows-hybrid-deployment/running-logic-app-hybrid-deployment.png" alt-text="Screenshot shows browser and logic app running as a website.":::

   Otherwise, if your app has any failures, check that your AKS pods are running correctly. From Windows PowerShell, run the following commands:

   ```powershell
   az aks get-credentials {resource-group-name} --name {aks-cluster-name} --admin
   kubectl get ns
   kubectl get pods -n logicapps-aca-ns
   kubectl describe pod {logic-app-pod-name} -n logicapps-aca-ns 
   ```

   For more information, see the following documentation:

   - [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials)
   - [Command line tool (kubetctl)](https://kubernetes.io/docs/reference/kubectl/)

### Cluster doesn't have enough nodes

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

- [Set up requirements for Standard logic app deployment on your own infrastructure](set-up-standard-workflows-hybrid-deployment-requirements.md)