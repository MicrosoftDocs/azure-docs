---
title: Monitor Azure Arc-enabled Kubernetes clusters
ms.date: 05/24/2022
ms.topic: article
description: Collect metrics and logs of Azure Arc-enabled Kubernetes clusters using Azure Monitor.
ms.reviewer: aul
---

# Azure Monitor Container Insights for Azure Arc-enabled Kubernetes clusters

[Azure Monitor Container Insights](container-insights-overview.md) provides rich monitoring experience for Azure Arc-enabled Kubernetes clusters.


## Supported configurations

- Azure Monitor Container Insights supports monitoring Azure Arc-enabled Kubernetes as described in the [Overview](container-insights-overview.md) article, except the live data feature. Also, users aren't required to have [Owner](../../role-based-access-control/built-in-roles.md#owner) permissions to [enable metrics](container-insights-update-metrics.md)
- `Docker`, `Moby`, and CRI compatible container runtimes such `CRI-O` and `containerd`.
- Outbound proxy without authentication and outbound proxy with basic authentication are supported. Outbound proxy that expects trusted certificates is currently not supported.

>[!NOTE]
>If you are migrating from Container Insights on Azure Red Hat OpenShift v4.x, please also ensure that you have [disabled monitoring](./container-insights-optout-openshift-v4.md) before proceeding with configuring Container Insights on Azure Arc enabled Kubernetes to prevent any installation issues.
>


## Prerequisites

- Pre-requisites listed under the [generic cluster extensions documentation](../../azure-arc/kubernetes/extensions.md#prerequisites).
- Log Analytics workspace. Azure Monitor Container Insights supports a Log Analytics workspace in the regions listed under Azure [products by region page](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). You can create your own workspace using [Azure Resource Manager](../logs/resource-manager-workspace.md), [PowerShell](../logs/powershell-workspace-configuration.md), or [Azure portal](../logs/quick-create-workspace.md).
- [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the Azure Arc-enabled Kubernetes resource. If the Log Analytics workspace is in a different subscription, then [Log Analytics Contributor](../logs/manage-access.md#azure-rbac) role assignment is needed on the resource group containing the Log Analytics Workspace
- To view the monitoring data, you need to have [Log Analytics Reader](../logs/manage-access.md#azure-rbac) role assignment on the Log Analytics workspace.
- The following endpoints need to be enabled for outbound access in addition to the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/network-requirements.md).

    **Azure public cloud**

    | Endpoint | Port |
    |----------|------|
    | `*.ods.opinsights.azure.com` | 443 |
    | `*.oms.opinsights.azure.com` | 443 |
    | `dc.services.visualstudio.com` | 443 |
    | `*.monitoring.azure.com` | 443 |
    | `login.microsoftonline.com` | 443 |

    The following table lists the additional firewall configuration required for managed identity authentication.

    |Agent resource| Purpose | Port |
    |--------------|------|---|
    | `global.handler.control.monitor.azure.com` | Access control service | 443 |
    | `<cluster-region-name>.handler.control.monitor.azure.com` | Fetch data collection rules for specific AKS cluster | 443 |

    **Azure Government cloud**

    If your Azure Arc-enabled Kubernetes resource is in Azure US Government environment, following endpoints need to be enabled for outbound access:

    | Endpoint | Port |
    |----------|------|
    | `*.ods.opinsights.azure.us` | 443 |
    | `*.oms.opinsights.azure.us` | 443 |
    | `dc.services.visualstudio.com` | 443 |

    The following table lists the additional firewall configuration required for managed identity authentication.

    |Agent resource| Purpose | Port |
    |--------------|------|---|
    | `global.handler.control.monitor.azure.cn` | Access control service | 443 |
    | `<cluster-region-name>.handler.control.monitor.azure.cn` | Fetch data collection rules for specific AKS cluster | 443 |


- If you are using an Arc enabled cluster on AKS, and previously installed [monitoring for AKS](./container-insights-enable-existing-clusters.md), please ensure that you have [disabled monitoring](./container-insights-optout.md) before proceeding to avoid issues during the extension install

- If you had previously deployed Azure Monitor Container Insights on this cluster using script without cluster extensions, follow the instructions listed [here](container-insights-optout-hybrid.md) to delete this Helm chart. You can then continue to creating a cluster extension instance for Azure Monitor Container Insights.


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

    ```azurecli
    az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json
    ```

    In the output, find the workspace name of interest. The `id` field of that represents the Azure Resource Manager identifier of that Log Analytics workspace.

    >[!TIP]
    > This `id` can also be found in the *Overview* pane of the Log Analytics workspace through the Azure portal.

## Create extension instance 

## [CLI](#tab/create-cli)

### Option 1 - With default values

This option uses the following defaults:

- Creates or uses existing default log analytics workspace corresponding to the region of the cluster
- Auto-upgrade is enabled for the Azure Monitor cluster extension

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers
```

To use [managed identity authentication (preview)](container-insights-onboard.md#authentication), add the `configuration-settings` parameter as in the following:

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true
```


### Option 2 - With existing Azure Log Analytics workspace

You can use an existing Azure Log Analytics workspace in any subscription on which you have *Contributor* or a more permissive role assignment.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings logAnalyticsWorkspaceResourceID=<armResourceIdOfExistingWorkspace>
```

### Option 3 - With advanced configuration

If you want to tweak the default resource requests and limits, you can use the advanced configurations settings:

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings  amalogs.resources.daemonset.limits.cpu=150m amalogs.resources.daemonset.limits.memory=600Mi amalogs.resources.deployment.limits.cpu=1 amalogs.resources.deployment.limits.memory=750Mi
```

Checkout the [resource requests and limits section of Helm chart](https://github.com/microsoft/Docker-Provider/blob/ci_prod/charts/azuremonitor-containers/values.yaml) for the available configuration settings.

### Option 4 - On Azure Stack Edge

If the Azure Arc-enabled Kubernetes cluster is on Azure Stack Edge, then a custom mount path `/home/data/docker` needs to be used.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.logsettings.custommountpath=/home/data/docker
```

### Option 5 - With Azure Monitor Private Link Scope (AMPLS) + Proxy 

If the cluster is configured with a forward proxy, then proxy settings are automatically applied to the extension. In the case of a cluster with AMPLS + proxy, proxy config should be ignored. Onboard the extension with the configuration setting `amalogs.ignoreExtensionProxySettings=true`.

```azurecli
az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.ignoreExtensionProxySettings=true
```

>[!NOTE]
> If you are explicitly specifying the version of the extension to be installed in the create command, then ensure that the version specified is >= 2.8.2.

## [Azure portal](#tab/create-portal)

>[!IMPORTANT]
>  If you are deploying Azure Monitor on a Kubernetes cluster running on top of Azure Stack Edge, then the Azure CLI option needs to be followed instead of the Azure portal option as a custom mount path needs to be set for these clusters.    

### Onboarding from the Azure Arc-enabled Kubernetes resource pane

1. In the Azure portal, select the Azure Arc-enabled Kubernetes cluster that you wish to monitor.

2. From the resource pane on the left, select the 'Insights' item under the 'Monitoring' section.

3. On the onboarding page, select the 'Configure Azure Monitor' button

4. You can now choose the [Log Analytics workspace](../logs/quick-create-workspace.md) to send your metrics and logs data to.

5. To use managed identity authentication, select the *Use managed identity (preview)* checkbox.

6. Select the 'Configure' button to deploy the Azure Monitor Container Insights cluster extension.

### Onboarding from Azure Monitor pane

1. In the Azure portal, navigate to the 'Monitor' pane, and select the 'Containers' option under the 'Insights' menu.

2. Select the 'Unmonitored clusters' tab to view the Azure Arc-enabled Kubernetes clusters that you can enable monitoring for.

3. Click on the 'Enable' link next to the cluster that you want to enable monitoring for.

4. Choose the Log Analytics workspace. 

5. To use managed identity authentication, select the *Use managed identity (preview)* checkbox.

6. Select the 'Configure' button to continue.

## [Resource Manager](#tab/create-arm)

1. Download Azure Resource Manager template and parameter:

    ```console
    curl -L https://aka.ms/arc-k8s-azmon-extension-arm-template -o arc-k8s-azmon-extension-arm-template.json
    curl -L https://aka.ms/arc-k8s-azmon-extension-arm-template-params -o  arc-k8s-azmon-extension-arm-template-params.json
    ```

2. Update parameter values in arc-k8s-azmon-extension-arm-template-params.json file. For Azure public cloud, `opinsights.azure.com` needs to be used as the value of workspaceDomain and for AzureUSGovernment, `opinsights.azure.us` needs to be used as the value of workspaceDomain.

3. Deploy the template to create Azure Monitor Container Insights extension 

    ```azurecli
    az login
    az account set --subscription "Subscription Name"
    az deployment group create --resource-group <resource-group> --template-file ./arc-k8s-azmon-extension-arm-template.json --parameters @./arc-k8s-azmon-extension-arm-template-params.json
    ```

---

## Verify extension installation status
Once you have successfully created the Azure Monitor extension for your Azure Arc-enabled Kubernetes cluster, you can additionally check the status of installation using the Azure portal or CLI. Successful installations should show the status as 'Installed'. If your status is showing 'Failed' or remains in the 'Pending' state for long periods of time, proceed to the Troubleshooting section below.

### [Azure portal](#tab/verify-portal)
1. In the Azure portal, select the Azure Arc-enabled Kubernetes cluster with the extension installing
2. From the resource pane on the left, select the 'Extensions' item under the 'Settings' section.
3. You should see an extension with the name 'azuremonitor-containers' listed, with the listed status in the 'Install status' column
### [CLI](#tab/verify-cli)
Run the following command to show the latest status of the `Microsoft.AzureMonitor.Containers` extension
```azurecli
az k8s-extension show --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type connectedClusters -n azuremonitor-containers
```

---

## Migrate to managed identity authentication (preview)
Use the flowing guidance to migrate an existing extension instance to managed identity authentication (preview).

## [CLI](#tab/migrate-cli)
First retrieve the Log Analytics workspace configured for Container insights extension.

```cli
az k8s-extension show --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters -n azuremonitor-containers 
```

Enable Container insights extension with managed identity authentication option using the workspace returned in the first step. 

```cli
az k8s-extension create --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true logAnalyticsWorkspaceResourceID=\<workspace-resource-id\> 
```

## [Resource Manager](#tab/migrate-arm)


1. Download the template at [https://aka.ms/arc-k8s-azmon-extension-msi-arm-template](https://aka.ms/arc-k8s-azmon-extension-msi-arm-template) and save it as **arc-k8s-azmon-extension-msi-arm-template.json**.

2. Download the parameter file at [https://aka.ms/arc-k8s-azmon-extension-msi-arm-template-params](https://aka.ms/arc-k8s-azmon-extension-msi-arm-template) and save it as **arc-k8s-azmon-extension-msi-arm-template-params.json**.
 
3. Edit the values in the parameter file.

  - For **workspaceDomain**, use *opinsights.azure.com* for Azure public cloud and *opinsights.azure.us* for Azure Government cloud.
  - Specify the tags in the **resourceTagValues** parameter if you want to use any Azure tags on the Azure resources that will be created as part of the Container insights extension.

4. Deploy the template to create Container Insights extension. 

```cli
az login 
az account set --subscription "Subscription Name" 
az deployment group create --resource-group <resource-group> --template-file ./arc-k8s-azmon-extension-msi-arm-template.json --parameters @./arc-k8s-azmon-extension-msi-arm-template-params.json 
```

---

## Delete extension instance

The following command only deletes the extension instance, but doesn't delete the Log Analytics workspace. The data within the Log Analytics resource is left intact.

```azurecli
az k8s-extension delete --name azuremonitor-containers --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <resource-group>
```

## Disconnected cluster
If your cluster is disconnected from Azure for > 48 hours, then Azure Resource Graph won't have information about your cluster. As a result the Insights pane may display incorrect information about your cluster state.

## Troubleshooting
For issues with enabling monitoring, we have provided a [troubleshooting script](https://aka.ms/azmon-ci-troubleshooting) to help diagnose any problems.

## Next steps

- With monitoring enabled to collect health and resource utilization of your Azure Arc-enabled Kubernetes cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.

- By default, the containerized agent collects the stdout/ stderr container logs of all the containers running in all the namespaces except kube-system. To configure container log collection specific to particular namespace or namespaces, review [Container Insights agent configuration](container-insights-agent-config.md) to configure desired data collection settings to your ConfigMap configurations file.

- To scrape and analyze Prometheus metrics from your cluster, review [Configure Prometheus metrics scraping](container-insights-prometheus-integration.md)
