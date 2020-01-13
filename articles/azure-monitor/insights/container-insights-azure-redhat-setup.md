---
title: Configure Azure Red Hat OpenShift clusters with Azure Monitor for containers | Microsoft Docs
description: This article describes how to configure monitoring of a Kubernetes cluster with Azure Monitor hosted on Azure Red Hat OpenShift.
ms.topic: conceptual
ms.date: 01/13/2020
---

# Configure Azure Red Hat OpenShift clusters with Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters. This article describes how to enable monitoring of Kubernetes clusters hosted on [Azure Red Hat OpenShift](../../openshift/intro-openshift.md) to achieve a similar monitoring experience.

>[!NOTE]
>Support for Azure Red Hat OpenShift is a feature in public preview at this time.
>

Azure Monitor for containers can be enabled for new, or one or more existing deployments of Azure Red Hat OpenShift using the following supported methods:

- For an existing cluster from the Azure portal or using Azure Resource Manager template
- For a new cluster using Azure Resource Manager template 

## Supported and unsupported features

Azure Monitor for containers supports monitoring Azure Red Hat OpenShift as described in the [Overview](container-insights-overview.md) article, except for the following features:

- Live Data (preview)
- [Collect metrics](container-insights-update-metrics.md) from cluster nodes and pods and storing them in the Azure Monitor metrics database

## Prerequisites

- To enable and access the features in Azure Monitor for containers, at a minimum you need to be a member of the Azure *Contributor* role in the Azure subscription, and a member of the [*Log Analytics Contributor*](../platform/manage-access.md#manage-access-using-azure-permissions) role of the Log Analytics workspace configured with Azure Monitor for containers.

- To view the monitoring data, you are a member of the [*Log Analytics reader*](../platform/manage-access.md#manage-access-using-azure-permissions) role permission with the Log Analytics workspace configured with Azure Monitor for containers.

## Enable for a new cluster using an Azure Resource Manager template

Perform the following steps to deploy an Azure Red Hat OpenShift cluster with monitoring enabled. Before proceeding, review the tutorial [Create an Azure Red Hat OpenShift cluster](../../openshift/tutorial-create-cluster.md#prerequisites) to understand the dependencies that you need to configure so your environment is set up correctly.

This method includes two JSON templates. One template specifies the configuration to deploy the cluster with monitoring enabled, and the other contains parameter values that you configure to specify the following:

- The Azure Red Hat OpenShift cluster resource ID. 

- The resource group the cluster is deployed in.

- [Azure Active Directory tenant ID](../../openshift/howto-create-tenant.md#create-a-new-azure-ad-tenant) noted after performing the steps to create one or one already created.

- [Azure Active Directory client application ID](../../openshift/howto-aad-app-configuration.md#create-an-azure-ad-app-registration) noted after performing the steps to create one or one already created.

- [Azure Active Directory Client secret](../../openshift/howto-aad-app-configuration.md#create-a-client-secret) noted after performing the steps to create one or one already created.

- [Azure AD security group](../../openshift/howto-aad-app-configuration.md#create-an-azure-ad-security-group) noted after performing the steps to create one or one already created.

- Resource ID of an existing Log Analytics workspace.

- The number of master nodes to create in the cluster.

- The number of compute nodes in the agent pool profile.

- The number of infrastructure nodes in the agent pool profile. 

If you are unfamiliar with the concept of deploying resources by using a template, see:

- [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)

- [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.65 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). 

The Log Analytics workspace has to be created before you enable monitoring using Azure PowerShell or CLI. To create the workspace, you can set it up through [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../../azure-monitor/learn/quick-create-workspace.md).

1. Download and save to a local folder, the Azure Resource Manager template and parameter file, to create a cluster with the monitoring add-on using the following commands:

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_new_cluster/newClusterWithMonitoring.json`

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_new_cluster/newClusterWithMonitoringParam.json` 

2. Sign in to Azure 

    ```azurecli
    az login    
    ```
    
    If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.
 
3. Create a resource group for your cluster if you don't already have one. For a list of Azure regions that supports OpenShift on Azure, see [Supported Regions](../../openshift/supported-resources.md#azure-regions). 

    ```azurecli
    az group create -g <clusterResourceGroup> -l <location> 
    ```

4. Edit the JSON parameter file **newClusterWithMonitoringParam.json** and update the following values:

    - *location*
    - *clusterName*
    - *aadTenantId*
    - *aadClientId*
    - *aadClientSecret* 
    - *aadCustomerAdminGroupId* 
    - *workspaceResourceId*
    - *masterNodeCount*
    - *computeNodeCount*
    - *infraNodeCount*

5. The following step deploys the cluster with monitoring enabled by using the Azure CLI. 

    ```azurecli
    az group deployment create --resource-group <ClusterResourceGroupName> --template-file ./newClusterWithMonitoring.json --parameters @./newClusterWithMonitoringParam.json 
    ```
 
    The output resembles the following:

    ```azurecli
    provisioningState       : Succeeded
    ```

## Enable for an existing cluster

Perform the following steps to enable monitoring of an Azure Red Hat OpenShift cluster deployed in Azure. You can accomplish this from the Azure portal or using the provided templates.

### From the Azure portal
 
1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Azure portal menu or from the Home page, select **Azure Monitor**. Under the **Insights** section, select **Containers**. 

3. On the **Monitor - containers** page, select **Non-monitored clusters**.

4. From the list of non-monitored clusters, find the cluster in the list and click **Enable**. You can identify the results in the list by looking for the value **ARO** under the column **CLUSTER TYPE**.

5. On the **Onboarding to Azure Monitor for containers** page, if you have an existing Log Analytics workspace in the same subscription as the cluster, select it from the drop-down list.  
    The list preselects the default workspace and location that the cluster is deployed to in the subscription. 

    ![Enable monitoring for non-monitored clusters](./media/container-insights-onboard/kubernetes-onboard-brownfield-01.png)

    >[!NOTE]
    >If you want to create a new Log Analytics workspace for storing the monitoring data from the cluster, follow the instructions in [Create a Log Analytics workspace](../../azure-monitor/learn/quick-create-workspace.md). Be sure to create the workspace in the same subscription that the RedHat OpenShift cluster is deployed to. 
 
After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster. 

### Enable using an Azure Resource Manager template

This method includes two JSON templates. One template specifies the configuration to enable monitoring, and the other contains parameter values that you configure to specify the following:

- The Azure RedHat OpenShift cluster resource ID. 

- The resource group the cluster is deployed in.

- A Log Analytics workspace.

If you are unfamiliar with the concept of deploying resources by using a template, see:

- [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)

- [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

If you choose to use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.65 or later. To identify your version, run `az --version`. If you need to install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli). 

The Log Analytics workspace has to be created before you enable monitoring using Azure PowerShell or CLI. To create the workspace, you can set it up through [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../../azure-monitor/learn/quick-create-workspace.md).

1. Download the template and parameter file to update your cluster with the monitoring add-on using the following commands:

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_existing_cluster/existingClusterOnboarding.json`

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_existing_cluster/existingClusterParam.json` 

2. Sign in to Azure 

    ```azurecli
    az login    
    ```

    If you have access to multiple subscriptions, run `az account set -s {subscription ID}` replacing `{subscription ID}` with the subscription you want to use.

3. Specify the subscription of the Azure RedHat OpenShift cluster.

    ```azurecli
    az account set --subscription "Subscription Name"  
    ```

4. Run the following command to identify the cluster location and resource ID:

    ```azurecli
    az openshift show -g <clusterResourceGroup> -n <clusterName> 
    ```

5. Edit the JSON parameter file **existingClusterParam.json** and update the values *araResourceId* and *araResoruceLocation*. The value for **workspaceResourceId** is the full resource ID of your Log Analytics workspace, which includes the workspace name. 

6. To deploy with Azure CLI, run the following commands: 

    ```azurecli
    az group deployment create --resource-group <ClusterResourceGroupName> --template-file ./ExistingClusterOnboarding.json --parameters @./existingClusterParam.json 
    ```

    The output resembles the following:

    ```azurecli
    provisioningState       : Succeeded
    ```

## Next steps

- With monitoring enabled to collect health and resource utilization of your RedHat OpenShift cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.

- To learn how to stop monitoring your cluster with Azure Monitor for containers, see [How to Stop Monitoring Your Azure Red Hat OpenShift cluster](container-insights-optout-openshift.md).
