---
title: Set up your own infrastructure for Standard logic app workflows
description: Set up the requirements for your own managed infrastructure to deploy and host Standard logic app workflows using the hybrid deployment model.
services: azure-logic-apps
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 11/04/2024
# Customer intent: As a developer, I need to set up the requirements to host and run Standard logic app workflows on infrastructure that my organization owns, which can include on-premises systems, private clouds, and public clouds.
---

# Set up your own infrastructure for Standard logic apps using hybrid deployment (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview, incurs charges for usage, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Sometimes you have to set up and manage your own infrastructure to meet specific needs for regulatory compliance, data privacy, or network restrictions. Azure Logic Apps offers a *hybrid deployment model* so that you can deploy and host Standard logic app workflows in on-premises, private cloud, or public cloud scenarios. This model gives you the capabilities to host integration solutions in partially connected environments when you need to use local processing, data storage, and network access. With the hybrid option, you have the freedom and flexibility to choose the best environment for your workflows.

## How hybrid deployment works

Standard logic app workflows with the hybrid deployment option are powered by an Azure Logic Apps runtime that is hosted in an Azure Container Apps extension. In your workflow, any [built-in operations](../connectors/built-in.md) run locally with the runtime so that you get higher throughput for access to local data sources. If you need access to non-local data resources, for example, cloud-based services such as Microsoft Office 365, Microsoft Teams, Salesforce, GitHub, LinkedIn, or ServiceNow, you can choose operations from [1,000+ connectors hosted in Azure](/connectors/connector-reference/connector-reference-logicapps-connectors) to include in your workflows. For more information, see [Managed (shared) connectors](../connectors/managed.md). Although you need to have internet connectivity to manage your logic app in the Azure portal, the semi-connected nature of this platform lets you absorb any temporary internet connectivity issues.

For example, if you have an on-premises scenario, the following architectural overview shows where Standard logic app workflows are hosted and run in the hybrid model. The partially connected environment includes the following resources for hosting and working with your Standard logic apps, which deploy as Azure Container Apps resources:

- Azure Arc-enabled Azure Kubernetes Service (AKS) clusters
- A SQL database to locally store workflow run history, inputs, and outputs for processing
- A Server Message Block (SMB) file share to locally store artifacts used by your workflows

:::image type="content" source="media/set-up-standard-workflows-hybrid-deployment-requirements/architecture-overview.png" alt-text="Diagram with architectural overview for where Standard logic apps are hosted in a partially connected environment." border="false":::

For hosting, you can also set up and use [Azure Arc-enabled Kubernetes clusters on Azure Stack *hyperconverged* infrastructure (HCI)](/azure-stack/hci/overview) or [Azure Arc-enabled Kubernetes clusters on Windows Server](/azure/aks/hybrid/kubernetes-walkthrough-powershell).

For more information, see the following documentation:

- [What is Azure Kubernetes Service?](/azure/aks/what-is-aks)
- [Core concepts for Azure Kubernetes Service (AKS)](/azure/aks/concepts-clusters-workloads)
- [Custom locations for Azure Arc-enabled Kubernetes clusters](/azure/azure-arc/platform/conceptual-custom-locations)
- [What is Azure Container Apps?](../container-apps/overview.md)
- [Azure Container Apps on Azure Arc](../container-apps/azure-arc-overview.md)

This how-to guide shows how to set up the necessary on-premises resources in your infrastructure so that you can create, deploy, and host a Standard logic app workflow using the hybrid deployment model.

## How billing works

With the hybrid option, you're responsible for the following items:

- Your Azure Arc-enabled Kubernetes infrastructure
- Your SQL Server license
- A billing charge of $0.18 USD per vCPU/hour to support Standard logic app workloads

In this billing model, you pay only for what you need and scale resources for dynamic workloads without having to buy for peak usage. For workflows that use Azure-hosted connector operations, such as Microsoft Teams or Microsoft Office 365, [existing Standard (single-tenant) pricing](https://azure.microsoft.com/pricing/details/logic-apps/#pricing) applies to these operation executions.

## Limitations

- Hybrid deployment is currently available and supported only for the following Azure Arc-enabled Kubernetes clusters:

  - Azure Arc-enabled Kubernetes clusters
  - Azure Arc-enabled Kubernetes clusters on Azure Stack HCI
  - Azure Arc-enabled Kubernetes clusters on Windows Server

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Basic understanding about [core AKS concepts](/azure/aks/concepts-clusters-workloads)

- [Technical requirements for working with Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli#before-you-begin)

- [Technical requirements for Azure Container Apps on Azure Arc-enabled Kubernetes](/azure/container-apps/azure-arc-overview#prerequisites), including access to a public or private container registry, such as the [Azure Container Registry](/azure/container-registry/).

## Create a Kubernetes cluster

Before you can deploy your Standard logic app as on-premises resource to an Azure Arc-enabled Kubernetes cluster in an Azure Container Apps connected environment, you first need a [Kubernetes cluster](/azure/aks/core-aks-concepts#cluster-components). You'll later connect this cluster to Azure Arc so that you have an [Azure Arc-enabled Kubernetes cluster](/azure/azure-arc/kubernetes/overview).

Your Kubernetes cluster requires inbound and outbound connectivity with the [SQL database that you later create as the storage provider](#create-storage-provider) and with the [Server Message Block file share that you later create for artifacts storage](#set-up-smb-file-share). These resources must exist within the same network.

> [!NOTE]
>
> You can also create a [Kubernetes cluster on Azure Stack HCI infrastructure](/azure-stack/hci/overview) 
> or [Kubernetes cluster on Windows Server](/azure/aks/hybrid/overview) and apply the steps in this guide 
> to connect your cluster to Azure Arc and set up your connected environment. For more information about 
> Azure Stack HCI and AKS on Windows Server, see the following resources:
>
> - [About Azure Stack HCI](/azure-stack/hci/deploy/deployment-introduction)
> - [Deployment prerequisites for Azure Stack HCI](/azure-stack/hci/deploy/deployment-prerequisites)
> - [Create Kubernetes clusters on Azure Stack HCI using Azure CLI](/azure/aks/hybrid/aks-create-clusters-cli)
> - [Set up an Azure Kubernetes Service host on Azure Stack HCI and Windows Server and deploy a workload cluster using PowerShell](/azure/aks/hybrid/kubernetes-walkthrough-powershell)

1. Set the following environment variables for the Kubernetes cluster that you want to create:

   ```azurecli
   SUBSCRIPTION="<Azure-subscription-ID>"
   AKS_CLUSTER_GROUP_NAME="<aks-cluster-resource-group-name>"
   AKS_NAME="<aks-cluster-name>"
   LOCATION="eastus"
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **SUBSCRIPTION** | Yes | <*Azure-subscription-ID*> | The ID for your Azure subscription |
   | **AKS_CLUSTER_GROUP_NAME** | Yes | <*aks-cluster-resource-group-name*> | The name for the Azure resource group to use with your Kubernetes cluster. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-RG**. |
   | **AKS_NAME** | Yes | <*aks-cluster-name*> | The name for your Kubernetes cluster. |
   | **LOCATION** | Yes | <*Azure-region*> | An Azure region that [supports Azure container apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-overview.md#public-preview-limitations). <br><br>This example uses **eastus**. |

1. Run the following commands either by using the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/overview) or locally using [Azure CLI installed on your computer](/cli/azure/install-azure-cli):

   > [!NOTE]
   >
   > Make sure to change the **max-count** and **min-count** node values based on your load requirements.

   ```azurecli
   az login
   az account set --subscription $SUBSCRIPTION
   az provider register --namespace Microsoft.KubernetesConfiguration --wait
   az extension add --name k8s-extension --upgrade --yes
   az group create
      --name $AKS_CLUSTER_GROUP_NAME
      --location $LOCATION
   az aks create \
      --resource-group $AKS_CLUSTER_GROUP_NAME \
      --name $AKS_NAME \
      --enable-aad \
      --generate-ssh-keys \
      --enable-cluster-autoscaler \
      --max-count 6 \
      --min-count 1
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **`max count`** | No | <*max-nodes-value*> | The maximum number of nodes to use for the autoscaler when you include the **`enable-cluster-autoscaler`** option. This value ranges from **1** to **1000**. |
   | **`min count`** | No | <*min-nodes-value*> | The minimum number of nodes to use for the autoscaler when you include the **`enable-cluster-autoscaler`** option. This value ranges from **1** to **1000**. |

   For more information, see the following resources:

   - [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli)
   - [**az account set**](/cli/azure/account#az-account-set)
   - [**az group create**](/cli/azure/group#az-group-create)
   - [**az aks create**](/cli/azure/aks#az-aks-create)

## Connect Kubernetes cluster to Azure Arc

To create your Azure Arc-enabled Kubernetes cluster, connect your Kubernetes cluster to Azure Arc.

> [!NOTE]
>
> You can find the steps in this section and onwards through to creating your connected 
> environment in a script named **EnvironmentSetup.ps1**, which you can find in the 
> [GitHub repo named **Azure/logicapps**](https://github.com/Azure/logicapps/tree/master/scripts/hybrid). 
> You can modify and use this script to meet your requirements and scenarios. 
>
> The script is unsigned, so before you run the script, run the following Azure 
> PowerShell command as an administrator to set the execution policy:
>
> `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`
>
> For more information, see [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy).

1. Install the following Azure CLI extensions:

   ```azurecli
   az extension add --name connectedk8s --upgrade --yes 
   az extension add --name k8s-extension --upgrade --yes 
   az extension add --name customlocation --upgrade --yes 
   az extension add --name containerapp --upgrade --yes 
   ```

   For more information, see the following resources:

   - [Install Azure CLI extensions](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#setup)
   - [az extension add](/cli/azure/extension#az-extension-add)

1. Register the following required namespaces:

   ```azurecli
   az provider register --namespace Microsoft.ExtendedLocation --wait
   az provider register --namespace Microsoft.KubernetesConfiguration --wait
   az provider register --namespace Microsoft.App --wait
   az provider register --namespace Microsoft.OperationalInsights --wait
   ```

   For more information, see the following resources:

   - [Register the required namespaces](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#setup)
   - [az provider register](/cli/azure/provider#az-provider-register)

1. Install the Kubernetes command line interface (CLI) named **kubectl**:

   ```azurecli
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   
   choco install kubernetes-cli -y
   ```

   For more information, see the following resources:

   - [Command line tool (kubectl)](https://kubernetes.io/docs/reference/kubectl/kubectl/)
   - [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy)
   - [choco install kubernetes-cli](https://docs.chocolatey.org/en-us/choco/commands/install/)

1. Install the Kubernetes package manager named **Helm**:

   ```azurecli
   choco install kubernetes-helm
   ```

   For more information, see the following resources:

   - [Helm](https://helm.sh/)
   - [choco install kubernetes-helm](https://community.chocolatey.org/packages/kubernetes-helm)

1. Install the SMB driver using the following Helm commands:

   1. Add the specified chart repository, get the latest information for available charts, and install the specified chart archive.

      ```azurecli
      helm repo add csi-driver-smb https://raw.githubusercontent.com/kubernetes-csi/csi-driver-smb/master/charts 
      helm repo update
      helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.15.0 
      ```

      For more information, see the following resources:

      - [helm repo add](https://helm.sh/docs/helm/helm_repo_add/)
      - [helm repo update](https://helm.sh/docs/helm/helm_repo_update/)
      - [helm install](https://helm.sh/docs/helm/helm_install/)

   1. Confirm that the SMB driver is installed by running the following **kubectl** command, which should list **smb.csi.k8s.io**:

      ```azurecli
      kubectl get csidriver
      ```

      For more information, see [kubectl get](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/).

## Connect your Kubernetes cluster to Azure Arc

1. Test your connection to your cluster by getting the [**kubeconfig** file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/):

   ```azurecli
   az aks get-credentials \
      --resource-group $AKS_CLUSTER_GROUP_NAME \
      --name $AKS_NAME \
      --admin
   kubectl get ns 
   ```

   By default, the **kubeconfig** file is saved to the path, **~/.kube/config**. This command applies to our example Kubernetes cluster and differs for other kinds of Kubernetes clusters.

   For more information, see the following resources:

   - [Create connected cluster](../container-apps/azure-arc-enable-cluster.md?tabs=azure-cli#create-a-connected-cluster)
   - [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials)
   - [kubectl get](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/)

1. Based on your Kubernetes cluster deployment, set the following environment variable to provide a name to use for the Azure resource group that contains your Azure Arc-enabled cluster and resources:

   ```azurecli
   GROUP_NAME="<Azure-Arc-cluster-resource-group-name>"
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **GROUP_NAME** | Yes | <*Azure-Arc-cluster-resource-group-name*> | The name for the Azure resource group to use with your Azure Arc-enabled cluster and other resources, such as your Azure Container Apps extension, custom location, and Azure Container Apps connected environment. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-Arc-RG**. |

1. Create the Azure resource group for your Azure Arc-enabled cluster and resources:

   ```azurecli
   az group create \
      --name $GROUP_NAME \
      --location $LOCATION
   ```

   For more information, see the following resources:

   - [Create connected cluster](../container-apps/azure-arc-enable-cluster.md?tabs=azure-cli#create-a-connected-cluster)
   - [az group create](/cli/azure/group#az-group-create)

1. Set the following environment variable to provide a name for your Azure Arc-enabled Kubernetes cluster:

   ```azurecli
   CONNECTED_CLUSTER_NAME="$GROUP_NAME-cluster"
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **CONNECTED_CLUSTER_NAME** | Yes | <*Azure-Arc-cluster-resource-group-name*>-**cluster** | The name to use for your Azure Arc-enabled cluster. This name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <br><br>This example uses **Hybrid-Arc-RG-cluster**. |

1. Connect your previously created Kubernetes cluster to Azure Arc:

   ```azurecli
   az connectedk8s connect \
      --resource-group $GROUP_NAME \
      --name $CONNECTED_CLUSTER_NAME
   ```

   For more information, see the following resources:

   - [Create connected cluster](../container-apps/azure-arc-enable-cluster.md?tabs=azure-cli#create-a-connected-cluster)
   - [az connectedk8s connect](/cli/azure/connectedk8s?#az-connectedk8s-connect)

1. Validate the connection between Azure Arc and your Kubernetes cluster:

   ```azurecli
   az connectedk8s show \
      --resource-group $GROUP_NAME \
      --name $CONNECTED_CLUSTER_NAME
   ```

   If the output shows that the **provisioningState** property value isn't set to **Succeeded**, run the command again after one minute.

   For more information, see the following resources:

   - [Create connected cluster](../container-apps/azure-arc-enable-cluster.md?tabs=azure-cli#create-a-connected-cluster)
   - [az connectedk8s show](/cli/azure/connectedk8s?#az-connectedk8s-show)

## Create an Azure Log Analytics workspace

You can create an optional, but recommended, Azure Log Analytics workspace, which provides access to logs for apps that run in your Azure Arc-enabled Kubernetes cluster.

1. Set the following environment variable to provide a name your Log Analytics workspace:

   ```azurecli
   WORKSPACE_NAME="$GROUP_NAME-workspace"
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **WORKSPACE_NAME** | Yes | <*Azure-Arc-cluster-resource-group-name*>**-workspace** | The name to use for your Log Analytics workspace. This name must be unique within your resource group. <br><br>This example uses **Hybrid-Arc-RG-workspace**. |

1. Create the Log Analytics workspace:

   ```azurecli
   az monitor log-analytics workspace create \
      --resource-group $GROUP_NAME \
      --workspace-name $WORKSPACE_NAME
   ```

   For more information, see the following resources:

   - [Create a Log Analytics workspace](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-a-log-analytics-workspace)
   - [az monitor log-analytics](/cli/azure/monitor/log-analytics)

1. Get the base64-encoded ID and shared key for your Log Analytics workspace. You need these values for a later step.

   ```azurecli
   LOG_ANALYTICS_WORKSPACE_ID=$(az monitor log-analytics workspace show \
      --resource-group $GROUP_NAME \
      --workspace-name $WORKSPACE_NAME \
      --query customerId \
      --output tsv)

   LOG_ANALYTICS_WORKSPACE_ID_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_WORKSPACE_ID))

   LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys \
      --resource-group $GROUP_NAME \
      --workspace-name $WORKSPACE_NAME \
      --query primarySharedKey \
      --output tsv)

   LOG_ANALYTICS_KEY_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_KEY))
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **LOG_ANALYTICS_WORKSPACE_ID** | Yes | The ID for your Log Analytics workspace. |
   | **LOG_ANALYTICS_WORKSPACE_ID_ENC** | Yes | The base64-encoded ID for your Log Analytics workspace. |
   | **LOG_ANALYTICS_KEY** | Yes | The shared key for your Log Analytics workspace. |
   | **LOG_ANALYTICS_ENC** | Yes | The base64-encoded shared key for your Log Analytics workspace. |

   For more information, see the following resources:

   - [Create a Log Analytics workspace](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-a-log-analytics-workspace)
   - [az monitor log-analytics](/cli/azure/monitor/log-analytics)

## Create and install the Azure Container Apps extension

Now, create and install the Azure Container Apps extension with your Azure Arc-enabled Kubernetes cluster as an on-premises resource.

> [!IMPORTANT]
>
> If you want to deploy to AKS on Azure Stack HCI, before you create and install the Azure Container Apps extension, 
> make sure that you [set up **HAProxy** or a custom load balancer](/azure/aks/hybrid/configure-load-balancer).

1. Set the following environment variables to the following values:
   
   ```azurecli
   EXTENSION_NAME="logicapps-aca-extension"
   NAMESPACE="logicapps-aca-ns"
   CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>"
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **EXTENSION_NAME** | Yes | **logicapps-aca-extension** | The name for the Azure Container Apps extension. |
   | **NAMESPACE** | Yes | **logicapps-aca-ns** | The cluster namespace where you want to provision resources. |
   | **CONNECTED_ENVIRONMENT_NAME** | Yes | <*connected-environment-name*> | A unique name to use for the Azure Container Apps connected environment. This name becomes part of the domain name for the Standard logic app that you create, deploy, and host in the Azure Container Apps connected environment. |

1. Create and install the extension with Log Analytics enabled for your Azure Arc-enabled Kubernetes cluster. You can't later add Log Analytics to the extension.

   ```azurecli
   az k8s-extension create \
      --resource-group $GROUP_NAME \
      --name $EXTENSION_NAME \
      --cluster-type connectedClusters \
      --cluster-name $CONNECTED_CLUSTER_NAME \
      --extension-type 'Microsoft.App.Environment' \
      --release-train stable \
      --auto-upgrade-minor-version true \
      --scope cluster \
      --release-namespace $NAMESPACE \
      --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" \
      --configuration-settings "appsNamespace=${NAMESPACE}" \
      --configuration-settings "keda.enabled=true" \
      --configuration-settings "keda.logicAppsScaler.enabled=true" \
      --configuration-settings "keda.logicAppsScaler.replicaCount=1" \
      --configuration-settings "containerAppController.api.functionsServerEnabled=true" \
      --configuration-settings "envoy.externalServiceAzureILB=false" \
      --configuration-settings "functionsProxyApiConfig.enabled=true" \
      --configuration-settings "clusterName=${CONNECTED_ENVIRONMENT_NAME}" \
      --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${GROUP_NAME}" \
      --configuration-settings "logProcessor.appLogs.destination=log-analytics" \
      --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" \
      --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
   ```

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Microsoft.CustomLocation.ServiceAccount** | Yes | The service account created for the custom location. <br><br>**Recommendation**: Set the value to **default**. |
   | **appsNamespace** | Yes | The namespace to use for creating app definitions and revisions. This value must match the release namespace for the Azure Container Apps extension. |
   | **clusterName** | Yes | The name for the Azure Container Apps extension Kubernetes environment to create for the extension. |
   | **keda.enabled** | Yes | Enable [Kubernetes Event-driven Autoscaling (KEDA)](https://keda.sh/). This value is required and must be set to **true**. |
   | **keda.logicAppsScaler.enabled** | Yes | Enable the Azure Logic Apps scaler in KEDA. This value is required and must be set to **true**. |
   | **keda.logicAppsScaler.replicaCount** | Yes | The initial number of logic app scalers to start. The default value set to **1**. This value scales up or scales down to **0**, if no logic apps exist in the environment. |
   | **containerAppController.api.functionsServerEnabled** | Yes | Enable the service responsible for converting logic app workflow triggers to KEDA-scaled objects. This value is required and must be set to **true**. |
   | **envoy.externalServiceAzureILB** | Yes | Determines whether the envoy acts as an internal load balancer or a public load balancer. <br><br>- **true**: The envoy acts as an internal load balancer. The Azure Logic Apps runtime is accessible only within private network. <br><br>- **false**: The envoy acts as a public load balancer. The Azure Logic Apps runtime is accessible over the public network. |
   | **functionsProxyApiConfig.enabled** | Yes | Enable the proxy service that facilitates API access to the Azure Logic Apps runtime from the Azure portal. This value is required and must be set to **true**. |
   | **envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group** | Yes, but only when the underlying cluster is Azure Kubernetes Service. | The name for the resource group where the Kubernetes cluster exists. |
   | **logProcessor.appLogs.destination** | No | The destination to use for application logs. The value is either **log-analytics** or **none**, which disables logging. |
   | **logProcessor.appLogs.logAnalyticsConfig.customerId** | Yes, but only when **logProcessor.appLogs.destination** is set to **log-analytics**. | The base64-encoded ID for your Log Analytics workspace. Make sure to configure this parameter as a protected setting. |
   | **logProcessor.appLogs.logAnalyticsConfig.sharedKey** | Yes, but only when **logProcessor.appLogs.destination** is set to **log-analytics**. | The base64-encoded shared key for your Log Analytics workspace. Make sure to configure this parameter as a protected setting. |

   For more information, see the following resources:

   - [Install the Azure Container Apps extension](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#install-the-container-apps-extension)
   - [az k8s-extension create](/cli/azure/k8s-extension?#az-k8s-extension-create)

1. Save the **ID** value for the Azure Container Apps extension to use later:

   ```azurecli
   EXTENSION_ID=$(az k8s-extension show \
      --cluster-type connectedClusters \
      --cluster-name $CONNECTED_CLUSTER_NAME \
      --resource-group $GROUP_NAME \
      --name $EXTENSION_NAME \
      --query id \
      --output tsv)
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **EXTENSION_ID** | Yes | <*extension-ID*> | The ID for the Azure Container Apps extension. |

   For more information, see the following resources:

   - [Install the Azure Container Apps extension](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#install-the-container-apps-extension)
   - [az k8s-extension show](/cli/azure/k8s-extension?#az-k8s-extension-show)

1. Before you continue, wait for the extension to fully install. To have your terminal session wait until the installation completes, run the following command:

   ```azurecli
   az resource wait \
      --ids $EXTENSION_ID \
      --custom "properties.provisioningState!='Pending'" \
      --api-version "2020-07-01-preview" 
   ```

   For more information, see the following resources:

   - [Install the Azure Container Apps extension](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#install-the-container-apps-extension)
   - [az resource wait](/cli/azure/resource?#az-resource-wait)

## Create your custom location

1. Set the following environment variables to the specified values:

   ```azurecli
   CUSTOM_LOCATION_NAME="my-custom-location"

   CONNECTED_CLUSTER_ID=$(az connectedk8s show \
      --resource-group $GROUP_NAME \
      --name $CONNECTED_CLUSTER_NAME \
      --query id \
      --output tsv)
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **CUSTOM_LOCATION_NAME** | Yes | **my-custom-location** | The name to use for your custom location. |
   | **CONNECTED_CLUSTER_ID** | Yes | <*Azure-Arc-cluster-ID*> | The ID for the Azure Arc-enabled Kubernetes cluster. |

   For more information, see the following resources:

   - [Create a custom location](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-a-custom-location)
   - [az k8s-extension show](/cli/azure/k8s-extension?#az-k8s-extension-show)

1. Create the custom location:

   ```azurecli
   az customlocation create \
      --resource-group $GROUP_NAME \
      --name $CUSTOM_LOCATION_NAME \
      --host-resource-id $CONNECTED_CLUSTER_ID \
      --namespace $NAMESPACE \
      --cluster-extension-ids $EXTENSION_ID \
      --location $LOCATION
   ```

   > [!NOTE]
   >
   > If you experience issues creating a custom location on your cluster, you might have to 
   > [enable the custom location feature on your cluster](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster). 
   > This step is required if you signed in to Azure CLI using a service principal, or if 
   > you signed in as a Microsoft Entra user with restricted permissions on the cluster resource.

   For more information, see the following resources:

   - [Create a custom location](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-a-custom-location)
   - [az customlocation create](/cli/azure/customlocation#az-customlocation-create)

1. Validate that the custom location is successfully created:

   ```azurecli
   az customlocation show \
      --resource-group $GROUP_NAME \
      --name $CUSTOM_LOCATION_NAME
   ```

   If the output shows that the **provisioningState** property value isn't set to **Succeeded**, run the command again after one minute.

1. Save the custom location ID for use in a later step:

   ```azurecli
   CUSTOM_LOCATION_ID=$(az customlocation show \
      --resource-group $GROUP_NAME \
      --name $CUSTOM_LOCATION_NAME \
      --query id \
      --output tsv)
   ```

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **CUSTOM_LOCATION_ID** | Yes | <*my-custom-location-ID*> | The ID for your custom location. |

   For more information, see the following resources:

   - [Create a custom location](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-a-custom-location)
   - [az customlocation show](/cli/azure/customlocation#az-customlocation-show)

## Create the Azure Container Apps connected environment

Now, create your Azure Container Apps connected environment for your Standard logic app to use.

```azurecli
az containerapp connected-env create \
   --resource-group $GROUP_NAME \
   --name $CONNECTED_ENVIRONMENT_NAME \
   --custom-location $CUSTOM_LOCATION_ID \
   --location $LOCATION
```

For more information, see the following resources:

- [Create a custom location](/azure/container-apps/azure-arc-enable-cluster?tabs=azure-cli#create-the-azure-container-apps-connected-environment)
- [az containerapp connected-env create](/cli/azure/containerapp#az-containerapp-create)

<a name="create-storage-provider"></a>

## Create SQL Server storage provider

Standard logic app workflows in the hybrid deployment model use a SQL database as the storage provider for the data used by workflows and the Azure Logic Apps runtime, for example, workflow run history, inputs, outputs, and so on. 

Your SQL database requires inbound and outbound connectivity with your Kubernetes cluster, so these resources must exist in the same network.

1. Set up any of the following SQL Server editions:

   - SQL Server on premises
   - [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
   - [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)
   - [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview)

   For more information, see [Set up SQL database storage for Standard logic app workflows](/azure/logic-apps/set-up-sql-db-storage-single-tenant-standard-workflows).

1. Confirm that your SQL database is in the same network as your Arc-enabled Kubernetes cluster and SMB file share.

1. Find and save the connection string for the SQL database that you created.

<a name="set-up-smb-file-share"></a>

## Set up SMB file share for artifacts storage

To store artifacts such as maps, schemas, and assemblies for your logic app (container app) resource, you need to have a file share that uses the [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview).

- You need administrator access to set up your SMB file share.

- Your SMB file share must exist in the same network as your Kubernetes cluster and SQL database.

- Your SMB file share requires inbound and outbound connectivity with your Kubernetes cluster. If you enabled Azure virtual network restrictions, make sure that your file share exists in the same virtual network as your Kubernetes cluster or in a peered virtual network.

- Don't use the same exact file share path for multiple logic apps.

- You can use separate SMB file shares for each logic app, or you can use different folders in the same SMB file share as long as those folders aren't nested. For example, don't have a logic app use the root path, and then have another logic app use a subfolder.

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

You need these saved values to provide your SMB file share information when you deploy your logic app resource.

For more information, see [Create an SMB Azure file share](/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal).

## Confirm SMB file share connection

To test the connection between your Arc-enabled Kubernetes cluster and your SMB file share, and to check that your file share is correctly set up, follow these steps:

- If your SMB file share isn't on the same cluster, confirm that the ping operation works from your Arc-enabled Kubernetes cluster to the virtual machine that has your SMB file share. To check that the ping operation works, follow these steps:

  1. In your Arc-enabled Kubernetes cluster, create a test [pod](/azure/aks/core-aks-concepts#pods) that runs any Linux image, such as BusyBox or Ubuntu.

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

[Create Standard logic app workflows for hybrid deployment on your own infrastructure](create-standard-workflows-hybrid-deployment.md)
