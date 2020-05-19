---
title: Configure Azure Arc enabled Kubernetes cluster with Azure Monitor for containers | Microsoft Docs
description: This article describes how to configure monitoring with Azure Monitor for containers on Azure Arc enabled Kubernetes cluster.
ms.topic: conceptual
ms.date: 05/19/2020
---

# Configure Azure Arc enabled Kubernetes cluster with Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters. This article describes how to enable monitoring of your Kubernetes clusters hosted outside of Azure that are enabled with Azure Arc, to achieve a similar monitoring experience.

Azure Monitor for containers can be enabled for one or more existing deployments of Kubernetes using either a PowerShell or Bash script.

## Supported and unsupported features

Azure Monitor for containers supports monitoring Kubernetes as described in the [Overview](container-insights-overview.md) article, except for the following features:

- Live Data (preview)
- [Collect metrics](container-insights-update-metrics.md) from cluster nodes and pods and storing them in the Azure Monitor metrics database

* Versions of Kubernetes and support policy are the same as versions of [AKS supported](../../aks/supported-kubernetes-versions.md).

* Linux OS release for master and worker nodes supported are: Ubuntu (18.04 LTS and 16.04 LTS).

## Prerequisites

Before you start, make sure that you have the following:

* A Log Analytics workspace.

    Azure Monitor for containers supports a Log Analytics workspace in the regions listed in Azure [Products by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). To create your own workspace, it can be created through [Azure Resource Manager](../platform/template-workspace-configuration.md), through [PowerShell](../scripts/powershell-sample-create-workspace.md?toc=%2fpowershell%2fmodule%2ftoc.json), or in the [Azure portal](../learn/quick-create-workspace.md).

    >[!NOTE]
    >Enable monitoring of multiple clusters with the same cluster name to same Log Analytics workspace is not supported. Cluster names must be unique.
    >

* You are a member of the **Log Analytics contributor role** to enable container monitoring. For more information about how to control access to a Log Analytics workspace, see [Manage access to workspace and log data](../platform/manage-access.md)

* [HELM client](https://helm.sh/docs/using_helm/) to onboard the Azure Monitor for containers chart for the specified Kubernetes cluster.

* The following proxy and firewall configuration information is required for the containerized version of the Log Analytics agent for Linux to communicate with Azure Monitor:

    |Agent Resource|Ports |
    |------|---------|
    |*.ods.opinsights.azure.com |Port 443 |
    |*.oms.opinsights.azure.com |Port 443 |
    |*.dc.services.visualstudio.com |Port 443 |

* The containerized agent requires Kubelet's `cAdvisor secure port: 10250` or `unsecure port :10255` to be opened on all nodes in the cluster to collect performance metrics. We recommend you configure `secure port: 10250` on the Kubelet's cAdvisor if it's not configured already.

* The containerized agent requires the following environmental variables to be specified on the container in order to communicate with the Kubernetes API service within the cluster to collect inventory data - `KUBERNETES_SERVICE_HOST` and `KUBERNETES_PORT_443_TCP_PORT`.

    >[!IMPORTANT]
    >The minimum agent version supported for monitoring hybrid Kubernetes clusters is ciprod10182019 or later.

* [PowerShell Core](https://docs.microsoft.com/powershell/scripting/install/installing-powershell?view=powershell-6) is required if you enable monitoring using the PowerShell scripted method.

* [Bash version 4](https://www.gnu.org/software/bash/) is required if you enable monitoring using the Bash scripted method.

## Enable monitoring using PowerShell

1. Sign into Azure

    ```azurecli
    az login
    ```

2. Download and save the script to a local folder that configures your cluster with the monitoring add-on using the following commands:

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/haiku/onboarding_azuremonitor_for_containers.ps1`

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



## Next steps

- With monitoring enabled to collect health and resource utilization of your RedHat OpenShift cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Azure Monitor for containers.

- By default, the containerized agent collects the stdout/ stderr container logs of all the containers running in all the namespaces except kube-system. To configure container log collection specific to particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure desired data collection settings to your ConfigMap configurations file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md)

- To learn how to stop monitoring your cluster with Azure Monitor for containers, see [How to Stop Monitoring Your Azure Red Hat OpenShift cluster](container-insights-optout-openshift.md).
