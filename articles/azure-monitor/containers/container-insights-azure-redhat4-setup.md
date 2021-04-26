---
title: Configure Azure Red Hat OpenShift v4.x with Container insights | Microsoft Docs
description: This article describes how to configure monitoring for a Kubernetes cluster with Azure Monitor that's hosted on Azure Red Hat OpenShift version 4 or later.
ms.topic: conceptual
ms.date: 03/05/2021
---

# Configure Azure Red Hat OpenShift v4.x with Container insights

Container insights provides a rich monitoring experience for Azure Kubernetes Service (AKS) and AKS engine clusters. This article describes how to achieve a similar monitoring experience by enabling monitoring for Kubernetes clusters that are hosted on [Azure Red Hat OpenShift](../../openshift/intro-openshift.md) version 4.x.

>[!NOTE]
>Support for Azure Red Hat OpenShift is a feature in public preview at this time.
>

You can enable Container insights for one or more existing deployments of Azure Red Hat OpenShift v4.x by using the supported methods described in this article.

For an existing cluster, run this [Bash script in the Azure CLI](/cli/azure/openshift#az_openshift_create&preserve-view=true).

## Supported and unsupported features

Container insights supports monitoring Azure Red Hat OpenShift v4.x as described in [Container insights overview](container-insights-overview.md), except for the following features:

- Live Data (preview)
- [Collecting metrics](container-insights-update-metrics.md) from cluster nodes and pods and storing them in the Azure Monitor metrics database

## Prerequisites

- The Azure CLI version 2.0.72 or later  

- The [Helm 3](https://helm.sh/docs/intro/install/) CLI tool

- Latest version of [OpenShift CLI](https://docs.openshift.com/container-platform/4.7/cli_reference/openshift_cli/getting-started-cli.html)

- [Bash version 4](https://www.gnu.org/software/bash/)

- The [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) command-line tool

- A [Log Analytics workspace](../logs/design-logs-deployment.md).

    Container insights supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../logs/resource-manager-workspace.md), through [PowerShell](../logs/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../logs/quick-create-workspace.md).

- To enable and access the features in Container insights, you need to have, at minimum, an Azure *Contributor* role in the Azure subscription and a [*Log Analytics Contributor*](../logs/manage-access.md#manage-access-using-azure-permissions) role in the Log Analytics workspace, configured with Container insights.

- To view the monitoring data, you need to have [*Log Analytics reader*](../logs/manage-access.md#manage-access-using-azure-permissions) role in the Log Analytics workspace, configured with Container insights.

## Enable monitoring for an existing cluster

To enable monitoring for an Azure Red Hat OpenShift version 4 or later cluster that's deployed in Azure by using the provided Bash script, do the following:

1. Sign in to Azure by running the following command:

    ```azurecli
    az login
    ```

1. Download and save to a local folder the script that configures your cluster with the monitoring add-in by running the following command:

    `curl -o enable-monitoring.sh -L https://aka.ms/enable-monitoring-bash-script`

1. Connect to ARO v4 cluster using the instructions in [Tutorial: Connect to an Azure Red Hat OpenShift 4 cluster](../../openshift/tutorial-connect-cluster.md).


### Integrate with an existing workspace

In this section, you enable monitoring of your cluster using the Bash script you downloaded earlier. To integrate with an existing Log Analytics workspace, start by identifying the full resource ID of your Log Analytics workspace that's required for the `logAnalyticsWorkspaceResourceId` parameter, and then run the command to enable the monitoring add-in against the specified workspace.

If you don't have a workspace to specify, you can skip to the [Integrate with the default workspace](#integrate-with-the-default-workspace) section and let the script create a new workspace for you.

1. List all the subscriptions that you have access to by running the following command:

    ```azurecli
    az account list --all -o table
    ```

    The output will look like the following:

    ```azurecli
    Name                                  CloudName    SubscriptionId                        State    IsDefault
    ------------------------------------  -----------  ------------------------------------  -------  -----------
    Microsoft Azure                       AzureCloud   0fb60ef2-03cc-4290-b595-e71108e8f4ce  Enabled  True
    ```

1. Copy the value for **SubscriptionId**.

1. Switch to the subscription that hosts the Log Analytics workspace by running the following command:

    ```azurecli
    az account set -s <subscriptionId of the workspace>
    ```

1. Display the list of workspaces in your subscriptions in the default JSON format by running the following command:

    ```
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

1. In the output, find the workspace name, and then copy the full resource ID of that Log Analytics workspace under the field **ID**.

1. To enable monitoring, run the following command. Replace the values for the `azureAroV4ClusterResourceId` and `logAnalyticsWorkspaceResourceId` parameters.

    ```bash
    export azureAroV4ClusterResourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.RedHatOpenShift/OpenShiftClusters/<clusterName>"
    export logAnalyticsWorkspaceResourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>" 
    ```

    Here is the command you must run once you have populated the 3 variables with Export commands:

    `bash enable-monitoring.sh --resource-id $azureAroV4ClusterResourceId --workspace-id $logAnalyticsWorkspaceResourceId`

After you've enabled monitoring, it might take about 15 minutes before you can view the health metrics for the cluster.

### Integrate with the default workspace

In this section, you enable monitoring for your Azure Red Hat OpenShift v4.x cluster by using the Bash script that you downloaded.

In this example, you're not required to pre-create or specify an existing workspace. This command simplifies the process for you by creating a default workspace in the default resource group of the cluster subscription, if one doesn't already exist in the region.

The default workspace that's created is in the format of *DefaultWorkspace-\<GUID>-\<Region>*.  

Replace the value for the `azureAroV4ClusterResourceId` parameter.

```bash
export azureAroV4ClusterResourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.RedHatOpenShift/OpenShiftClusters/<clusterName>"
```

For example:

`bash enable-monitoring.sh --resource-id $azureAroV4ClusterResourceId 

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

### Enable monitoring from the Azure portal

The multi-cluster view in Container insights highlights your Azure Red Hat OpenShift clusters that don't have monitoring enabled under the **Unmonitored clusters** tab. The **Enable** option next to your cluster doesn't initiate onboarding of monitoring from the portal. You're redirected to this article to enable monitoring manually by following the steps that were outlined earlier in this article.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the left pane or from the home page, select **Azure Monitor**.

1. In the **Insights** section, select **Containers**.

1. On the **Monitor - containers** page, select **Unmonitored clusters**.

1. In the list of non-monitored clusters, select the cluster, and then select **Enable**.

    You can identify the results in the list by looking for the **ARO** value in the **Cluster Type** column. After you select **Enable**, you're redirected to this article.

## Next steps

- Now that you've enabled monitoring to collect health and resource utilization of your RedHat OpenShift version 4.x cluster and the workloads that are running on them, learn [how to use](container-insights-analyze.md) Container insights.

- By default, the containerized agent collects the *stdout* and *stderr* container logs of all the containers that are running in all the namespaces except kube-system. To configure a container log collection that's specific to a particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure the data collection settings you want for your *ConfigMap* configuration file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md).

- To learn how to stop monitoring your cluster by using Container insights, see [How to stop monitoring your Azure Red Hat OpenShift cluster](./container-insights-optout-openshift-v3.md).
