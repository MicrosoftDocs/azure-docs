---
title: Configure Azure Red Hat OpenShift v4.x with Azure Monitor for containers | Microsoft Docs
description: This article describes how to configure monitoring of a Kubernetes cluster with Azure Monitor hosted on Azure Red Hat OpenShift version 4 and higher.
ms.topic: conceptual
ms.date: 04/22/2020
---

# Configure Azure Red Hat OpenShift v4.x with Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters. This article describes how to enable monitoring of Kubernetes clusters hosted on [Azure Red Hat OpenShift](../../openshift/intro-openshift.md) version 4.x to achieve a similar monitoring experience.

>[!NOTE]
>Support for Azure Red Hat OpenShift is a feature in public preview at this time.
>

Azure Monitor for containers can be enabled for one or more existing deployments of Azure Red Hat OpenShift v4.x using the following supported methods:

- For an existing cluster using the provided bash script and running in the [Azure CLI](https://docs.microsoft.com/cli/azure/openshift?view=azure-cli-latest#az-openshift-create).

## Supported and unsupported features

Azure Monitor for containers supports monitoring Azure Red Hat OpenShift v4.x as described in the [Overview](container-insights-overview.md) article, except for the following features:

- Live Data (preview)
- [Collect metrics](container-insights-update-metrics.md) from cluster nodes and pods and storing them in the Azure Monitor metrics database

## Prerequisites

- Azure CLI version 2.0.72 or greater

- [Helm 3](https://helm.sh/docs/intro/install/) CLI tool

- [Bash version 4](https://www.gnu.org/software/bash/)

- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) command-line tool

- To enable and access the features in Azure Monitor for containers, at a minimum you need to be a member of the Azure *Contributor* role in the Azure subscription, and a member of the [*Log Analytics Contributor*](../platform/manage-access.md#manage-access-using-azure-permissions) role of the Log Analytics workspace configured with Azure Monitor for containers.

- To view the monitoring data, you are a member of the [*Log Analytics reader*](../platform/manage-access.md#manage-access-using-azure-permissions) role permission with the Log Analytics workspace configured with Azure Monitor for containers.

## Enable for an existing cluster

Perform the following steps to enable monitoring of an Azure Red Hat OpenShift version 4 and higher cluster deployed in Azure using the provided bash script.

1. Sign into Azure

    ```azurecli
    az login
    ```

2. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aroV4/onboarding_azuremonitor_for_containers.sh.`

3. To identify the **kube-context** of your cluster, after successful `oc login` on to your cluster, run the command `kubectl config current-context` and copy the value.

### Integrate with an existing workspace

The following step enables monitoring of your cluster using the bash script you downloaded earlier. To integrate with an existing Log Analytics workspace, perform the following steps to first identify the full resource ID of your Log Analytics workspace required for the `workspaceResourceId` parameter, and then run the command to enable the monitoring add-on against the specified workspace. If you don't have a workspace to specify, you can skip to step 5 and let the script create a new workspace for you.

1. List all the subscriptions that you have access to using the following command:

    ```azurecli
    az account list --all -o table
    ```

    The output will resemble the following:

    ```azurecli
    Name                                  CloudName    SubscriptionId                        State    IsDefault
    ------------------------------------  -----------  ------------------------------------  -------  -----------
    Microsoft Azure                       AzureCloud   68627f8c-91fO-4905-z48q-b032a81f8vy0  Enabled  True
    ```

    Copy the value for **SubscriptionId**.

2. Switch to the subscription hosting the Log Analytics workspace using the following command:

    ```azurecli
    az account set -s <subscriptionId of the workspace>
    ```

3. The following example displays the list of workspaces in your subscriptions in the default JSON format.

    ```
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

    In the output, find the workspace name, and then copy the full resource ID of that Log Analytics workspace under the field **ID**.

4. Run the following command to enable monitoring, replacing the value for the `workspaceResourceId` parameter: 

    `bash onboarding_azuremonitor_for_containers.sh <kube-context> <azureAroV4ResourceId> <LogAnayticsWorkspaceResourceId>`

    Example:

    `bash onboarding_azuremonitor_for_containers.sh MyK8sTestCluster /subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/test-aro-v4-rg/providers/Microsoft.RedHatOpenShift/OpenShiftClusters/test-aro-v4  /subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourcegroups/test-la-workspace-rg/providers/microsoft.operationalinsights/workspaces/test-la-workspace`

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

### Integrate with default workspace

The following step enables monitoring of your Azure Red Hat OpenShift v4.x cluster using the bash script you downloaded. In this example, you are not required to per-create or specify an existing workspace. This command simplifies the process for you by creating a default workspace in the default resource group of the cluster subscription if one does not already exist in the region. The default workspace created resembles the format of *DefaultWorkspace-\<GUID>-\<Region>*.  

    `bash onboarding_azuremonitor_for_containers.sh <kube-context> <azureAroV4ResourceId>`

    For example:

    `bash onboarding_azuremonitor_for_containers.sh MyK8sTestCluster /subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/test-aro-v4-rg/providers/Microsoft.RedHatOpenShift/OpenShiftClusters/test-aro-v4`

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

### From the Azure portal

The multi-cluster view in Azure Monitor for containers highlights your Azure Red Hat OpenShift clusters that don't have monitoring enabled under the **Non-monitored clusters** tab. The **Enable** option next to your cluster does not initiate onboarding of monitoring from the portal. You are redirected to this article to manually enable monitoring following the steps earlier in this article.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Azure portal menu or from the Home page, select **Azure Monitor**. Under the **Insights** section, select **Containers**.

3. On the **Monitor - containers** page, select **Non-monitored clusters**.

4. From the list of non-monitored clusters, find the cluster in the list and click **Enable**. You can identify the results in the list by looking for the value **ARO** under the column **CLUSTER TYPE**. After you click **Enable**, you are redirected to this article.

## Next steps

- With monitoring enabled to collect health and resource utilization of your RedHat OpenShift version 4.x cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.

- By default, the containerized agent collects the stdout/ stderr container logs of all the containers running in all the namespaces except kube-system. To configure container log collection specific to particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure desired data collection settings to your ConfigMap configurations file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md)

- To learn how to stop monitoring your cluster with Azure Monitor for containers, see [How to Stop Monitoring Your Azure Red Hat OpenShift cluster](container-insights-optout-openshift.md).
