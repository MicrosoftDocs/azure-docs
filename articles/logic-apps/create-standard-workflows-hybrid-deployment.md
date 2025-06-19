---
title: Create Standard logic app workflows for hybrid deployment
description: Create and deploy an example Standard logic app workflow on your own managed infrastructure, which can include on-premises, private cloud, and public cloud environments.
services: azure-logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/09/2025
# Customer intent: As a developer, I want to create a Standard logic app workflow that can run on customer-managed infrastructure, which can include on-premises systems, private clouds, and public clouds.
ms.custom:
  - build-2025
---

# Create Standard logic app workflows for hybrid deployment on your own infrastructure

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

For scenarios where you need to use, control, and manage your own infrastructure, you can create Standard logic app workflows using the hybrid deployment model in Azure Logic Apps. This model provides capabilities for you to build and host integration solutions for partially connected environments that require local processing, storage, and network access. Your infrastructure can include on-premises systems, private clouds, and public clouds. With the hybrid model, your Standard logic app workflow is powered by the Azure Logic Apps runtime, which is hosted on premises as part of an Azure Container Apps extension.

For an architectural overview that shows where Standard logic app workflows are hosted and run in a partially connected environment, see [Set up infrastructure requirements for hybrid deployment for Standard logic apps](set-up-standard-workflows-hybrid-deployment-requirements.md).

This how-to guide shows how to create and deploy a Standard logic app workflow using the hybrid deployment model after you set up the necessary on-premises resources for hosting your app.

## Limitations

The following section describes the limitations for the hybrid deployment option:

| Limitation | Description |
|------------|-------------|
| Supported Azure regions | Hybrid deployment is currently available and supported only in the following Azure regions: <br><br>- Central US <br>- East Asia <br>- East US <br>- North Central US <br>- Southeast Asia <br>- Sweden Central <br>- UK South <br>- West Europe <br>- West US <br> |
| Data logging with a disconnected runtime | In partially connected mode, the Azure Logic Apps runtime can stay disconnected up to 24 hours and still retain data logs. However, any logging data past this duration might be lost. |
| Unsupported capabilities available in single-tenant Azure Logic Apps (Standard) and related Azure services | - Deployment slots <br><br>- Azure Business process tracking <br><br>- Resource health under **Support + troubleshooting** in Azure portal <br><br>- Managed identity authentication for connector operations. Azure Arc-enabled Kubernetes clusters currently don't support managed identity authentication for managed API connections. Instead, you must create your own app registration using Microsoft Entra ID. For more information, [follow these steps later in this guide](#authenticate-managed-api-connections). |
| Function-based triggers | Some function-based triggers, such as Azure Blob, Cosmos DB, and Event Hubs require a connection to the Azure storage account associated with your Standard logic app. If you use any function-based triggers, in your Standard logic app's environment variables in the Azure portal or in your logic app project's **local.settings.json** file in Visual Studio Code, add the app setting named **AzureWebJobsStorage** and provide your storage account connection string:<br><br>`"Values": {` <br>    `"name": "AzureWebJobsStorage",` <br>    `"value": "{storage-account-connection-string}"` <br>`}` |

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The following on-premises resources, which must all exist within the same network for the required connectivity:

  - An Azure Kubernetes Service cluster that is connected to Azure Arc
  - An SQL database to locally store workflow run history, inputs, and outputs for processing
  - A Server Message Block (SMB) file share to locally store artifacts used by your workflows

  To meet these requirements, [set up these on-premises resources to support hybrid deployment for Standard logic apps](set-up-standard-workflows-hybrid-deployment-requirements.md).

- To work in Visual Studio Code, you need the Azure Logic Apps (Standard) extension for Visual Studio Code with the [related prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  > [!TIP]
  >
  > If you have a new Visual Studio Code installation, confirm that you can locally run a 
  > basic Standard workflow before you try deploying to your own infrastructure. This test 
  > run helps isolate any errors that might exist in your Standard workflow project.

## Create your Standard logic app

### [Portal](#tab/azure-portal)

Create your Standard logic app for hybrid deployment by following these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter **logic apps**, and select **Logic apps**.

1. On the **Logic apps** page toolbar, select **Add**.

1. On the **Create Logic App** page, under **Standard**, select **Hybrid**.

1. On the **Create Logic App (Hybrid)** page, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Your Azure subscription name. <br><br>This example uses **Pay-As-You-Go**. |
   | **Resource Group** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your hybrid app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example creates a resource group named **Hybrid-RG**. |
   | **Logic App name** | Yes | <*logic-app-name*> | Your logic app name, which must be unique across regions and can contain only lowercase letters, numbers, or hyphens (**-**). <br><br>This example uses **my-logic-app-hybrid**. |
   | **Region** | Yes | <*Azure-region*> | An Azure region that is [supported for Azure Container Apps on Azure Arc-enabled AKS](../container-apps/azure-arc-overview.md#limitations). <br><br>This example uses **East US**. |
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

1. After Azure completes deployment, select **Go to resource**.

   The Azure portal opens your logic app resource, for example:

   :::image type="content" source="media/create-standard-workflows-hybrid-deployment/logic-app-hybrid-portal.png" alt-text="Screenshot shows Azure portal with Standard logic app for hybrid deployment created as a container app.":::

1. On the logic app resource menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** to add an empty stateful or stateless workflow.

1. After the designer opens, build your workflow by adding a trigger and actions.

   For more information, see [Build a workflow with a trigger and actions](create-workflow-with-trigger-or-action.md).

### [Visual Studio Code](#tab/visual-studio-code)

If you want to deploy with SMB file share, confirm that the following conditions are met before you create your Standard logic app for hybrid deployment in Visual Studio Code:

- Your SMB file share server is accessible.
- Port 445 is open on the computer where you run Visual Studio Code.

#### Create your logic app

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

1. From the location list, select an Azure region that is [supported for Azure Container Apps on Azure Arc-enabled AKS](../container-apps/azure-arc-overview.md#limitations).

   This example uses **East US**.

1. In the **Explorer** window, open the shortcut menu for the **workflow.json** file, and select **Open Designer**.

1. Build your workflow as usual by adding a trigger and actions. For more information, see [Build a workflow with a trigger and actions](create-workflow-with-trigger-or-action.md).

#### Deploy your logic app

After you finish building your workflow, you can deploy your logic app to your on-premises Azure Container Apps connected environment.

##### Zip deployment

Zip deployment provides the following benefits over the SMB file share option.

- Visual Studio Code doesn't need a connection to the SMB file share.
- Subsequent deployments don't require credentials for the SMB file share.
- Zip deployment provides a more stable and reliable option over SMB deployment, which is prone to 409 conflicts.

To use zip deployment, follow these steps:

1. [Create an app registration using Microsoft Entra ID](#create-an-app-registration-with-microsoft-entra-id). At the appropriate steps, provide a client ID, object ID, and client secret.

1. To use zip deployment with an existing Standard logic app resource in the Azure portal, you must manually add the app registration as an app setting in your Standard logic app resource.

   For more information, see [Add app registration values to your Standard logic app](/azure/logic-apps/create-standard-workflows-hybrid-deployment#add-app-registration-values-to-your-standard-logic-app&tabs=azure-portal).

If you have concerns about creating an app registration, you can still use SMB file share deployment option.

1. In Visual Studio Code, on the **Activity Bar**, select **Manage** (gear icon) > **Settings**.

1. Under **Workspace**, select **Extensions** > **Azure Logic Apps (Standard)** > **Use SMBDeployment For Hybrid** > **Enable to use SMB deployment for hybrid logic apps**.

1. Follow the next section for SMB file share deployment.

##### SMB file share deployment

1. In the Visual Studio Code **Explorer** window, open the shortcut menu for the workflow node, which is **my-stateful-workflow** in this example, and select **Deploy to logic app**.

1. From the subscription list, select your Azure subscription.

1. From the available logic apps list, select **Create new Logic App (Standard) in Azure**. Provide a globally unique logic app name that uses only lowercase alphanumeric characters or hyphens.

   This example uses **my-logic-app-hybrid**.

1. From the location list that appears, select the same Azure region where you have your connected environment.

   This example uses **East US**.

1. From the hosting plan list, select **Hybrid**.

1. From the resource group list, select **Create new resource group**. Provide a name for your resource group.

   This example uses **Hybrid-RG**.

1. From the connected environment list, select your environment.

1. Provide your previously saved values for the host name, SMB file share path, username, and password for your artifacts storage.

1. Provide the connection string for the SQL database that you set up for runtime storage.

   Visual Studio Code starts the deployment process for your Standard logic app.

1. To monitor deployment status and Azure activity logs, from the **View** menu, select **Output**. In the window that opens, select **Azure**.

   After deployment completes, you can go to the Azure portal to view your deployed Standard logic app and workflow.

---

### Versioning for hybrid deployments

A Standard logic app with the hybrid hosting option automatically creates a new *revision*, which is a [versioning concept from Azure Container Apps](../container-apps/revisions.md), whenever you save changes to a child workflow. This revision might take a little time to activate, which means that after you save any changes, you might want to wait several 
moments before you test your workflow.

If your changes still haven't appeared in the workflow, you can check whether the revision exists:

1. In the [Azure portal](https://portal.azure.com), open your resource. On the resource menu, under **Revisions**, select **Revisions and replicas**.

1. On the **Revisions and replicas** page, on the **Active revisions** tab, check whether a new revision appears on the list.

For more information, see the following resources:

- [Update and deploy changes in Azure Container Apps](../container-apps/revisions.md)

- [Manage revisions in Azure Container Apps](../container-apps/revisions-manage.md) 

## Set up enhanced telemetry or OpenTelemetry for performance monitoring

You can set up enhanced telemetry collection in Application Insights for your Standard logic app and then view the collected data after your workflow finishes a run. This capability gives you a simpler experience to get insights about your workflows and more control over filtering events at the data source, which helps you reduce storage costs. These improvements focus on real-time performance metrics that provide insights into your system's health and behavior.

For partially connected and on-premises scenarios, you can set up your Standard logic app to emit telemetry based on the [OpenTelemetry-supported](https://opentelemetry.io/) app settings that you define for the specific environment. By default, this telemetry data is sent to Application Insights. For more information, see [Enable enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](enable-enhanced-telemetry-standard-workflows.md).

<a name="change-vcpu-memory"></a>

## Change vCPU and memory allocation in the Azure portal

You can edit the vCPU and memory settings for your Standard logic app resource. These changes affect the [billing charge](set-up-standard-workflows-hybrid-deployment-requirements.md#billing) for your Standard logic app workloads.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Settings**, select **Containers**.

1. On the **Containers** page toolbar, select **Edit and deploy**, which opens the **Edit a container** pane.

1. On the **Properties** tab, under **Container resource allocation**, change the following values to fit your scenario:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **CPU cores** | - Default: 1 <br>- Minimum: 0.25 <br>- Maximum: 2 | Determines the vCPU cores to assign to your container instance. You can increase this value by 0.25 cores up to the maximum value. The total number across all container instances for this logic app is limited to 2 cores. |
   | **Memory** | - Default: 2 <br>- Minimum: 0.1 <br>- Maximum: 4 | Determines the memory capacity in gibibytes (GiB) to assign to your container instance. You can increase this value by 0.1 GiB up to the maximum value. The total capacity across all container instances for this logic app is limited to 4 GiB. |

1. When you finish, select **Save**.

<a name="change-scaling"></a>

## Change replica scaling in Azure portal

You can control the automatic scaling for the range of replicas that deploy in response to a trigger event. A *replica* is a new instance of a logic app resource revision or version. To change the minimum and maximum values for this range, you can modify the scale rules to determine the event types that trigger scaling. For more information, see [Set scaling rules in Azure Container Apps](../container-apps/scale-app.md).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource menu, under **Settings**, select **Scale**.

1. On the **Scale** page, under **Scale rule setting**, change the following values to fit your scenario:

   | Property | Value | Description |
   |----------|-------|-------------|
   | **Min replicas** | - Default: 1 <br>- Minimum: 0 <br>- Maximum: 1000 | Determines the minimum number of replicas allowed for the revision at any given time. This value overrides scale rules and must be less than the maximum number of replicas. |
   | **Max replicas** | - Default: 30 <br>- Minimum: 0 <br>- Maximum: 1000 | Determines the maximum number of replicas allowed for the revision at any given time. This value overrides scale rules. |

1. When you finish, select **Save**.

<a name="inbound-traffic"></a>

## Control inbound traffic to your logic app in Azure portal

You can expose your logic app to the public web, your virtual network, and other logic apps in your environment by enabling ingress. Azure enforces ingress settings through a set of rules that control the routing of external and internal traffic to your logic app. When you enable ingress, you don't need to create an Azure Load Balancer, public IP address, or any other Azure resources to enable incoming HTTP requests or TCP traffic. For more information, see [Ingress in Container Apps](../container-apps/ingress-overview.md).

> [!NOTE]
>
> When you enable ingress, all of the traffic will be directed to your latest revision by default. Go to Revision management page to change traffic settings.

1. On the resource menu, under **Settings**, select **Ingress**.

1. On the **Ingress** page, next to **Ingress**, select the **Enabled** box.

1. Based on your scenario, configure the remaining options.

   For more information, see the following documentation:

   - [Configure ingress for your app in Azure Container Apps](../container-apps/ingress-how-to.md?pivots=azure-portal)
   - [Set up IP ingress restrictions in Azure Container Apps](../container-apps/ip-restrictions.md?pivots=azure-portal)

<a name="authenticate-managed-api-connections"></a>

## Set up authentication for managed API connections

To authenticate managed API connections in Standard logic app workflows hosted on Azure Arc-enabled Kubernetes clusters, you must create your own app registration using Microsoft Entra ID. You can then add this app registration's values as environment variables in your Standard logic app resource to authenticate your API connections instead.

### Create an app registration with Microsoft Entra ID

#### Azure portal

1. In the [Azure portal](https://portal.azure.com), follow [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app) to create an app registration.

1. After creation completes, find your new app registration in the portal.

1. On the resource menu, select **Overview**, and save the following values, which you need later for connection authentication:

   - Client ID
   - Tenant ID
   - Client secret

1. For the object ID, follow these steps:

   1. On the **Overview** page, select **Managed application in local directory** link for your app registration as shown:

      :::image type="content" source="media/create-standard-workflows-hybrid-deployment/managed-application-link.png" alt-text="Screenshot shows app registration with selected link for managed application in local directory.":::

   1. On the page that opens, copy and save the **Object ID** value:

      :::image type="content" source="media/create-standard-workflows-hybrid-deployment/app-registration-object-id.png" alt-text="Screenshot shows app registration with selected object ID.":::

1. Now, [add the saved values as environment variables](#add-app-registration-values-environment-variables) to your Standard logic app resource.

#### Azure CLI

1. To create the app registration, use the [**az ad sp create** command](/cli/azure/ad/sp#az-ad-sp-create).

1. To review all the properties, use the [**az ad sp show** command](/cli/azure/ad/sp#az-ad-sp-show).

1. In the output from both commands, find and save the following values, which you need later for connection authentication:

   - Client ID
   - Object ID
   - Tenant ID
   - Client secret

1. Now, [add the saved values as environment variables](#add-app-registration-values-environment-variables) to your Standard logic app resource.

<a name="add-app-registration-values-environment-variables"></a>

### Add app registration values to your Standard logic app

1. In the [Azure portal](https://portal.azure.com), go to your Standard logic app resource.

1. On the resource menu, under **Settings**, select **Containers**, and then select the **Environment variables** tab.

   For more information about app settings and host settings, see [Edit app settings and host settings](edit-app-settings-host-settings.md).

1. On the toolbar, select **Edit and deploy**.

1. On the **Edit a container** pane, select **Environment variables**, and then select **Add**.

1. From the following table, add each environment variable with the specified value:

   | Environment variable | Value |
   |----------------------|-------|
   | **WORKFLOWAPP_AAD_CLIENTID** | <*my-client-ID*> |
   | **WORKFLOWAPP_AAD_OBJECTID** | <*my-object-ID*> |
   | **WORKFLOWAPP_AAD_TENANTID** | <*my-tenant-ID*> |
   | **WORKFLOWAPP_AAD_CLIENTSECRET** | <*my-client-secret*> |

1. When you finish, select **Save**.

<a name="store-client-id-secret-for-reference"></a>

### Store and reference client ID and client secret

You can store the client ID and client secret values in your logic app resource as secrets and then reference those values on the **Environment variables** tab instead.

1. In the Azure portal, go to your logic app resource.

1. On the resource menu, under **Settings**, select **Secrets**.

1. On the toolbar, select **Add**.

1. On the **Add secret** pane, provide the following information for each secret, and then select **Add**:

   | Key | Value |
   |-----|-------|
   | **WORKFLOWAPP_AAD_CLIENTID** | <*my-client-ID*> |
   | **WORKFLOWAPP_AAD_CLIENTSECRET** | <*my-client-secret*> |

## Known issues and troubleshooting

The following section describes currently known issues and guidance for troubleshooting common problems.

### General environment setup or portal deployment problems

To help you diagnose and debug problems with your environment configuration or portal deployment failures, you can try running the **troubleshoot.ps1** PowerShell script provided for the hybrid deployment option.

1. Go to the [Azure Logic Apps GitHub repository: **scripts/hybrid** folder](https://github.com/Azure/logicapps/blob/master/scripts/hybrid).

1. Copy the **troubleshoot.ps1** file to a folder in the same on-premises location as your logic app deployment.

1. Run the script using PowerShell.

### Arc-enabled Kubernetes clusters

In rare scenarios, you might notice a high memory footprint in your cluster. To prevent this issue, either scale out or add autoscale for node pools.

### Function host isn't running

After you deploy your Standard logic app, confirm that your app is running correctly.

1. In the Azure portal, open your logic app resource.

1. On the resource menu, select **Overview**.

1. On the **Overview** page, next to the **Application Url** field, select the resource URL.

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

   - [**az aks get-credentials**](/cli/azure/aks#az-aks-get-credentials)
   - [Command line tool (kubectl)](https://kubernetes.io/docs/reference/kubectl/)

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
**`helm repo update`**
**`helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.15.0`**

To check the CSI SMB Driver pods status, from the Windows command prompt, run the following command:

**`kubectl --namespace=kube-system get pods --selector="app.kubernetes.io/name=csi-driver-smb" --watch`**

For more information, see [Container Storage Interface (CSI) drivers on Azure Kubernetes Service (AKS)](/azure/aks/csi-storage-drivers).

## Related content

- [Set up requirements for Standard logic app deployment on your own infrastructure](set-up-standard-workflows-hybrid-deployment-requirements.md)
- [Enable enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](enable-enhanced-telemetry-standard-workflows.md)