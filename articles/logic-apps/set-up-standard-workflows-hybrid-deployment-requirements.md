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

Your Azure Arc-enabled Kubernetes cluster requires inbound and outbound connectivity with the [SQL database that you use as the storage provider](#create-storage-provider) and with the [Server Message Block file share that you use for artifacts storage](#set-up-smb-file-share). These resources must exist within the same network.

To create and connect an AKS cluster to Azure Arc, follow the steps for one of the following options:

#### [Portal](#tab/azure-portal)

1. [Follow these steps to create an AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-portal).

1. [Follow these steps to connect the cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster).

#### [Azure CLI](#tab/azure-cli)

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

#### [Azure PowerShell](#tab/azure-powershell)

This section covers the Azure PowerShell steps in [Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes](/azure/container-apps/azure-arc-enable-cluster), but uses values specific to Azure Logic Apps to create the Azure Arc-enabled Kubernetes cluster and an optional Log Analytics workspace to monitor the logs from the Azure Logic Apps runtime.

| Parameter | Required | Value | Description |
|-----------|----------|-------|-------------|
| **SUBSCRIPTION** | Yes | <*Azure-subscription-ID*> | The ID for your Azure subscription. |
| **GROUP_NAME** | Yes | <*Azure-resource-group-name*> | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) where you create your container app and related resources. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-RG**. |
| **LOCATION** | Yes | **'**<*Azure-region*>**'** | An Azure region that is [supported for Azure container apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-overview.md#public-preview-limitations). <br><br>This example uses **East US**. |
| **KUBE_CLUSTER_NAME** | Yes | <*cluster-name*> | The name for your cluster. This example uses ** |
| **LOGANALYTICS_WORKSPACE_NAME** | No | <*Log-Analytics-workspace-name*> | The name for the Log Analytics workspace resource to create for monitoring logs. |

1. Set the execution policy by running the following Azure PowerShell command as an administrator:

   ```azurepowershell-interactive
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

   For more information, see [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy).

1. Install the following Azure CLI extensions:

   ```azurepowershell-interactive
   az extension add --name connectedk8s --upgrade --yes 
   az extension add --name k8s-extension --upgrade --yes 
   az extension add --name customlocation --upgrade --yes 
   az extension add --name containerapp --upgrade --yes 
   ```

   For more information, see [az extension add](/cli/azure/extension#az-extension-add).

1. Register the following required namespaces:

   ```azurepowershell-interactive
   az provider register --namespace Microsoft.ExtendedLocation --wait
   az provider register --namespace Microsoft.KubernetesConfiguration --wait
   az provider register --namespace Microsoft.App --wait
   az provider register --namespace Microsoft.OperationalInsights --wait
   ```

   For more information, see [az provider register](/cli/azure/provider#az-provider-register).

1. Based on your Kubernetes cluster deployment, set the following environment variables:

   ```azurepowershell-interactive
   $GROUP_NAME="<my-Azure-Arc-cluster-group-name>"
   $AKS_CLUSTER_GROUP_NAME="<my-aks-cluster-resource-group-name>"
   $AKS_NAME="<my-aks-cluster-name>"
   $LOCATION="eastus"
   ```

1. Install the Kubernetes command line interface (CLI) named **kubectl**:

   ```azurepowershell-interactive
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   
   choco install kubernetes-cli -y
   ```

   For more information, see the following resources:

   - [Command line tool (kubectl)](https://kubernetes.io/docs/reference/kubectl/kubectl/)
   - [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy)
   - [choco install kubernetes-cli](https://docs.chocolatey.org/en-us/choco/commands/install/).

1. Install the package manager for Kubernetes named **Helm**:

   ```azurepowershell-interactive
   choco install kubernetes-helm
   ```

   For more information, see the following resources:

   - [Helm](https://helm.sh/)
   - [choco install kubernetes-helm](https://community.chocolatey.org/packages/kubernetes-helm)

1. Install the SMB driver using the following Helm commands:

   1. Add the specified chart repository, get the latest information for available charts, and install the specified chart archive:

      ```azurepowershell-interactive
      helm repo add csi-driver-smb https://raw.githubusercontent.com/kubernetes-csi/csi-driver-smb/master/charts 
      helm repo update
      helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.15.0 
      ```

      For more information, see the following resources:

      - [helm repo add](https://helm.sh/docs/helm/helm_repo_add/)
      - [helm repo update](https://helm.sh/docs/helm/helm_repo_update/)
      - [helm install](https://helm.sh/docs/helm/helm_install/)

   1. Confirm that the SMB driver is installed by running the following **kubectl** command, which should list **smb.csi.k8s.io**:

      ```azurepowershell-interactive
      kubectl get csidrivers
      ```

      For more information, see [kubectl get](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/).

1. Create a cluster in Azure Kubernetes Service and then connect the cluster to Azure Arc by following these steps:

   1. Get the [**kubeconfig** file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/), and test your connection to the cluster.

      ```azurecli-interactive
      az aks get-credentials --resource-group $AKS_CLUSTER_GROUP_NAME --name $AKS_NAME --admin
      kubectl get ns 
      ```

      By default, the **kubeconfig** file is saved to the path, **~/.kube/config**. This command applies to our example AKS Kubernetes cluster and differs for other kinds of Kubernetes clusters.

      For more information, see [Create connected cluster](../container-apps/azure-arc-enable-cluster.md?tabs=azure-powershell##create-a-connected-cluster).

   1. Create an Azure resource group to contain your Azure Arc resources:

      ```azurepowershell-interactive
      az group create --name $GROUP_NAME --location $LOCATION
      ```

   1. Connect your Kubernetes cluster to Azure Arc:

      ```azurepowershell-interactive
      $CLUSTER_NAME="${GROUP_NAME}-cluster" # The name for the connected cluster resource
      az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
      ```

   1. Validate the connection between your cluster and Azure Arc:

      ```azurecli-interactive
      az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME
      ```

      The **provisioningState** property value should be **Succeeded**. If not, run the command again after one minute.

1. Create an optional Log Analytics workspace, which provides access to logs for container apps that run in the Azure Arc-enabled Kubernetes cluster.

   Although optional, creating the workspace is recommended. For more information, see [Create a Log Analytics workspace](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-powershell#create-a-log-analytics-workspace).

   1. Create the workspace:

      ```azurepowershell-interactive
      $WORKSPACE_NAME="$GROUP_NAME-workspace" # The name for the Log Analytics workspace
      az monitor log-analytics workspace create --resource-group $GROUP_NAME --workspace-name $WORKSPACE_NAME
      ```

   1. Get the workspace's encoded ID and shared key, which you need for the next step:

      ```azurepowershell-interactive
      $LOG_ANALYTICS_WORKSPACE_ID=$(az monitor log-analytics workspace show --resource-group $GROUP_NAME --workspace-name $WORKSPACE_NAME --query customerId --output tsv)
      $LOG_ANALYTICS_WORKSPACE_ID_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_WORKSPACE_ID)) # Workspace ID is necessary for the next step
      $LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys --resource-group $GROUP_NAME --workspace-name $WORKSPACE_NAME --query primarySharedKey --output tsv)
      $LOG_ANALYTICS_KEY_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_KEY)) # Shared key is necessary for the next step
      ```

1. Install the Azure Container Apps extension:

   > [!IMPORTANT]
   >
   > If you want to deploy to AKS on Azure Stack HCI, before you install the Container Apps extension, 
   > make sure that you [set up **HAProxy** or a custom load balancer](/azure/aks/hybrid/configure-load-balancer).

   1. Set the following environment variables to the following values:
   
      - The name for the Azure Container Apps extension
      - The cluster namespace where you want to provision resources
      - A unique name for the Azure Container Apps connected environment. This name is included with the domain name for the Standard logic app that you create in the Azure Container Apps connected environment.

      ```azurepowershell-interactive
      $EXTENSION_NAME="logicapps-aca-extension"
      $NAMESPACE="logicapps-aca-ns"
      $CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>"
      ```

   1. Install the Azure Container Apps extension with Log Analytics enabled in your Azure Arc-connected cluster. You can't later add Log Analytics to the extension.

      ```azurepowershell-interactive
      az k8s-extension create `
          --resource-group $GROUP_NAME `
          --name $EXTENSION_NAME `
          --cluster-type connectedClusters `
          --cluster-name $CLUSTER_NAME `
          --extension-type 'Microsoft.App.Environment' `
          --release-train stable `
          --auto-upgrade-minor-version true `
          --scope cluster `
          --release-namespace $NAMESPACE `
          --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" `
          --configuration-settings "appsNamespace=${NAMESPACE}" `
          --configuration-settings "keda.enabled=true" `
          --configuration-settings "keda.logicAppsScaler.enabled=true" `
          --configuration-settings "keda.logicAppsScaler.replicaCount=1" `
          --configuration-settings "containerAppController.api.functionsServerEnabled=true" `
          --configuration-settings "envoy.externalServiceAzureILB=false" `
          --configuration-settings "functionsProxyApiConfig.enabled=true" `
          --configuration-settings "clusterName=${CONNECTED_ENVIRONMENT_NAME}" `
          --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${GROUP_NAME}" `
          --configuration-settings "logProcessor.appLogs.destination=log-analytics" `
          --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" `
          --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
      ```

      | Parameter | Required | Description |
      |-----------|----------|-------------|
      | **Microsoft.CustomLocation.ServiceAccount** | Yes | The service account created for the custom location. <br><br>**Recommendation**: Set the value to **default**. |
      | **appsNamespace** | Yes | The namespace to use for creating app definitions and revisions. This value must match the release namespace for the Container Apps extension. |
      | **clusterName** | Yes | The name for the Container Apps extension Kubernetes environment to create against the extension. |
      | **keda.enabled** | Yes | Enable [Kubernetes Event-driven Autoscaling (KEDA)](https://keda.sh/). This value is required and must be set to **true**. |
      | **keda.logicAppsScaler.enabled** | Yes | Enable the Azure Logic Apps scaler in KEDA. This value is required and must be set to **true**. |
      | **keda.logicAppsScaler.replicaCount** | Yes | The initial number of logic app scalers to start. The default value set to **1**. This value scales up or scales down to **0**, if no logic apps exist in the environment. |
      | **containerAppController.api.functionsServerEnabled** | Yes | Enable the service responsible for converting logic app workflow triggers to KEDA-scaled objects. This value is required and must be set to **true**. |
      | **functionsProxyApiConfig.enabled** | Yes | Enable the proxy service that facilitates API access to the Azure Logic Apps runtime from the Azure portal. This value is required and must be set to **true**. |
      | **envoy.externalServiceAzureILB** | Yes | Determines whether the envoy acts as an internal load balancer or a public load balancer. <br><br>- **true**: The envoy acts as an internal load balancer. The Azure Logic Apps runtime is accessible only within private network. <br><br>- **false**: The envoy acts as a public load balancer. The Azure Logic Apps runtime is accessible over the public network. |
      | **logProcessor.appLogs.destination** | No | The destination to use for application logs. The value is either **log-analytics** or **none**, which disables logging. |
      | **logProcessor.appLogs.logAnalyticsConfig.customerId** | Yes, but only when **logProcessor.appLogs.destination** is set to **log-analytics**. | The base64-encoded ID for the Log Analytics workspace. Make sure to configure this parameter as a protected setting. |
      | **logProcessor.appLogs.logAnalyticsConfig.sharedKey** | Yes, but only when **logProcessor.appLogs.destination** is set to **log-analytics**. | The base64-encoded shared key for the Log Analytics workspace. Make sure to configure this parameter as a protected setting. |
      | **envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group** | Yes, but only when the underlying cluster is Azure Kubernetes Service. | The name for the resource group where the AKS cluster exists. |

   For more information, see [Install the Container Apps extension](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-powershell#create-a-log-analytics-workspace).

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