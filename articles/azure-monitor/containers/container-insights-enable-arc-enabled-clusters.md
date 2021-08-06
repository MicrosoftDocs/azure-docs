---
title: "Monitor Azure Arc–enabled Kubernetes clusters"
ms.date: 04/05/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Collect metrics and logs of Azure Arc–enabled Kubernetes clusters using Azure Monitor"
---

# Azure Monitor Container Insights for Azure Arc–enabled Kubernetes clusters

[Azure Monitor Container Insights](container-insights-overview.md) provides rich monitoring experience for Azure Arc–enabled Kubernetes clusters.

[!INCLUDE [preview features note](../../azure-arc/kubernetes/includes/preview/preview-callout.md)]

## Supported configurations

- Azure Monitor Container Insights supports monitoring Azure Arc–enabled Kubernetes (preview) as described in the [Overview](container-insights-overview.md) article, except the live data (preview) feature. Also, users aren't required to have [Owner](../../role-based-access-control/built-in-roles.md#owner) permissions to [enable metrics](container-insights-update-metrics.md)
- `Docker`, `Moby`, and CRI compatible container runtimes such `CRI-O` and `containerd`.
- Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

## Prerequisites

- You've met the pre-requisites listed under the [generic cluster extensions documentation](../../azure-arc/kubernetes/extensions.md#prerequisites).
- A Log Analytics workspace: Azure Monitor Container Insights supports a Log Analytics workspace in the regions listed under Azure [products by region page](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). You can create your own workspace through [Azure Resource Manager](../logs/resource-manager-workspace.md), [PowerShell](../logs/powershell-sample-create-workspace.md), or [Azure portal](../logs/quick-create-workspace.md).
- You need to have [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the Azure Arc–enabled Kubernetes resource. If the Log Analytics workspace is in a different subscription, then [Log Analytics Contributor](../logs/manage-access.md#manage-access-using-azure-permissions) role assignment is needed on the Log Analytics workspace.
- To view the monitoring data, you need to have [Log Analytics Reader](../logs/manage-access.md#manage-access-using-azure-permissions) role assignment on the Log Analytics workspace.
- The following endpoints need to be enabled for outbound access in addition to the ones mentioned under [connecting a Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md#meet-network-requirements).

    | Endpoint | Port |
    |----------|------|
    | `*.ods.opinsights.azure.com` | 443 |
    | `*.oms.opinsights.azure.com` | 443 |
    | `dc.services.visualstudio.com` | 443 |
    | `*.monitoring.azure.com` | 443 |
    | `login.microsoftonline.com` | 443 |

    If your Azure Arc–enabled Kubernetes resource is in Azure US Government environment, following endpoints need to be enabled for outbound access:

    | Endpoint | Port |
    |----------|------|
    | `*.ods.opinsights.azure.us` | 443 |
    | `*.oms.opinsights.azure.us` | 443 |
    | `dc.services.visualstudio.com` | 443 |
    

- If you had previously deployed Azure Monitor Container Insights on this cluster using script without cluster extensions, follow the instructions listed [here](container-insights-optout-hybrid.md) to delete this Helm chart. You can then continue to creating a cluster extension instance for Azure Monitor Container Insights.

    >[!NOTE]
    > The script-based version of deploying Azure Monitor Container Insights (preview) is being replaced by the [cluster extension](../../azure-arc/kubernetes/extensions.md) form of deployment. Azure Monitor deployed previously via script is only supported till June 2021 and it is thus advised to migrate to the cluster extension form of deployment at the earliest.

### Identify workspace resource ID

Run the following commands to locate the full Azure Resource Manager identifier of the Log Analytics workspace. 

1. List all the subscriptions that you have access to using the following command:

    ```azurecli
    az account list --all -o table
    ```

2. Switch to the subscription hosting the Log Analytics workspace using the following command:

    ```azurecli
    az account set -s <subscriptionId of the workspace>
    ```

3. The following example displays the list of workspaces in your subscriptions in the default JSON format.

    ```
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

    In the output, find the workspace name of interest. The `id` field of that represents the Azure Resource Manager identifier of that Log Analytics workspace.

    >[!TIP]
    > This `id` can also be found in the *Overview* blade of the Log Analytics workspace through the Azure portal.

## Create extension instance using Azure CLI

### Option 1 - With default values

This option uses the following defaults:

- Creates or uses existing default log analytics workspace corresponding to the region of the cluster
- Auto-upgrade is enabled for the Azure Monitor cluster extension

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers
```

### Option 2 - With existing Azure Log Analytics workspace

You can use an existing Azure Log Analytics workspace in any subscription on which you have *Contributor* or a more permissive role assignment.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings logAnalyticsWorkspaceResourceID=<armResourceIdOfExistingWorkspace>
```

### Option 3 - With advanced configuration

If you want to tweak the default resource requests and limits, you can use the advanced configurations settings:

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings  omsagent.resources.daemonset.limits.cpu=150m omsagent.resources.daemonset.limits.memory=600Mi omsagent.resources.deployment.limits.cpu=1 omsagent.resources.deployment.limits.memory=750Mi
```

Checkout the [resource requests and limits section of Helm chart](https://github.com/helm/charts/blob/master/incubator/azuremonitor-containers/values.yaml) for the available configuration settings.

### Option 4 - On Azure Stack Edge

If the Azure Arc–enabled Kubernetes cluster is on Azure Stack Edge, then a custom mount path `/home/data/docker` needs to be used.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings omsagent.logsettings.custommountpath=/home/data/docker
```

>[!NOTE]
> If you are explicitly specifying the version of the extension to be installed in the create command, then ensure that the version specified is >= 2.8.2.

## Create extension instance using Azure portal

>[!IMPORTANT]
>  If you are deploying Azure Monitor on a Kubernetes cluster running on top of Azure Stack Edge, then the Azure CLI option needs to be followed instead of the Azure portal option as a custom mount path needs to be set for these clusters.    

### Onboarding from the Azure Arc–enabled Kubernetes resource blade

1. In the Azure portal, select the Azure Arc–enabled Kubernetes cluster that you wish to monitor.

2. Select the 'Insights (preview)' item under the 'Monitoring' section of the resource blade.

3. On the onboarding page, select the 'Configure Azure Monitor' button

4. You can now choose the [Log Analytics workspace](../logs/quick-create-workspace.md) to send your metrics and logs data to.

5. Select the 'Configure' button to deploy the Azure Monitor Container Insights cluster extension.

### Onboarding from Azure Monitor blade

1. In the Azure portal, navigate to the 'Monitor' blade, and select the 'Containers' option under the 'Insights' menu.

2. Select the 'Unmonitored clusters' tab to view the Azure Arc–enabled Kubernetes clusters that you can enable monitoring for.

3. Click on the 'Enable' link next to the cluster that you want to enable monitoring for.

4. Choose the Log Analytics workspace and select the 'Configure' button to continue.

## Create extension instance using Azure Resource Manager

1. Download Azure Resource Manager template and parameter:

    ```console
    curl -L https://aka.ms/arc-k8s-azmon-extension-arm-template -o arc-k8s-azmon-extension-arm-template.json
    curl -L https://aka.ms/arc-k8s-azmon-extension-arm-template-params -o  arc-k8s-azmon-extension-arm-template-params.json
    ```

2. Update parameter values in arc-k8s-azmon-extension-arm-template-params.json file.For Azure public cloud, `opinsights.azure.com` needs to be used as the value of workspaceDomain.

3. Deploy the template to create Azure Monitor Container Insights extension 

    ```azurecli
    az login
    az account set --subscription "Subscription Name"
    az deployment group create --resource-group <resource-group> --template-file ./arc-k8s-azmon-extension-arm-template.json --parameters @./arc-k8s-azmon-extension-arm-template-params.json
    ```

## Delete extension instance

The following command only deletes the extension instance, but doesn't delete the Log Analytics workspace. The data within the Log Analytics resource is left intact.

```bash
az k8s-extension delete --name azuremonitor-containers --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <resource-group>
```

## Disconnected cluster
If your cluster is disconnected from Azure for > 48 hours, then Azure Resource Graph won't have information about your cluster. As a result the Insights blade may display incorrect information about your cluster state.

## Next steps

- With monitoring enabled to collect health and resource utilization of your Azure Arc–enabled Kubernetes cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.

- By default, the containerized agent collects the stdout/ stderr container logs of all the containers running in all the namespaces except kube-system. To configure container log collection specific to particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure desired data collection settings to your ConfigMap configurations file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md)
