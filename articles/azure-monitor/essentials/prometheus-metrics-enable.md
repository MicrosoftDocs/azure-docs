---
title: Enable Azure Monitor managed service for Prometheus (preview)
description: Enable Azure Monitor managed service for Prometheus (preview) and configure data collection from your Azure Kubernetes Service (AKS) cluster.
author: EdB-MSFT
ms.author: edbaynash
ms.custom: references_regions
ms.topic: conceptual
ms.date: 01/24/2022
ms.reviewer: aul
---

# Collect Prometheus metrics from an AKS cluster (preview)
This article describes how to configure your Azure Kubernetes Service (AKS) cluster to send data to Azure Monitor managed service for Prometheus. When you configure your AKS cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) is installed with a metrics extension. Then you specify the Azure Monitor workspace where the data should be sent.

> [!NOTE]
> The process described here doesn't enable [Container insights](../containers/container-insights-overview.md) on the cluster even though the Azure Monitor agent installed in this process is the same one used by Container insights.
>
>For different methods to enable Container insights on your cluster, see [Enable Container insights](../containers/container-insights-onboard.md). For details on adding Prometheus collection to a cluster that already has Container insights enabled, see [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md).

## Prerequisites

- You must either have an [Azure Monitor workspace](azure-monitor-workspace-overview.md) or [create a new one](azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace).
- The cluster must use [managed identity authentication](../../aks/use-managed-identity.md).
- The following resource providers must be registered in the subscription of the AKS cluster and the Azure Monitor workspace:
  - Microsoft.ContainerService
  - Microsoft.Insights
  - Microsoft.AlertsManagement

## Enable Prometheus metric collection
Use any of the following methods to install the Azure Monitor agent on your AKS cluster and send Prometheus metrics to your Azure Monitor workspace.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster.
1. Select **Managed Prometheus** to display a list of AKS clusters.
1. Select **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" lightbox="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot that shows an Azure Monitor workspace with a Prometheus configuration.":::

### [CLI](#tab/cli)

#### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in the Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The aks-preview extension must be installed by using the command `az extension add --name aks-preview`. For more information on how to install a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
- The aks-preview version 0.5.122 or higher is required for this feature. Check the aks-preview version by using the `az version` command.

#### Install the metrics add-on

Use `az aks update` with the `-enable-azuremonitormetrics` option to install the metrics add-on. Depending on the Azure Monitor workspace and Grafana workspace you want to use, choose one of the following options:

- **Create a new default Azure Monitor workspace.**<br>
If no Azure Monitor workspace is specified, a default Azure Monitor workspace is created in the `DefaultRG-<cluster_region>` following the format `DefaultAzureMonitorWorkspace-<mapped_region>`.
This Azure Monitor workspace is in the region specified in [Region mappings](#region-mappings).
    
    ```azurecli
    az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
    ```

- **Use an existing Azure Monitor workspace.**<br>
If the Azure Monitor workspace is linked to one or more Grafana workspaces, the data is available in Grafana.

    ```azurecli
    az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <workspace-name-resource-id>
    ```

- **Use an existing Azure Monitor workspace and link with an existing Grafana workspace.**<br>
This option creates a link between the Azure Monitor workspace and the Grafana workspace.
    
    ```azurecli
    az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>
    ```

The output for each command looks similar to the following example:

```json
"azureMonitorProfile": {
    "metrics": {
        "enabled": true,
        "kubeStateMetrics": {
            "metricAnnotationsAllowList": "",
            "metricLabelsAllowlist": ""
        }
    }
}
```

#### Optional parameters
You can use the following optional parameters with the previous commands:

- `--ksm-metric-annotations-allow-list` is a comma-separated list of Kubernetes annotations keys used in the resource's labels metric. By default, the metric contains only name and namespace labels. To include more annotations, provide a list of resource names in their plural form and Kubernetes annotation keys that you want to allow for them. A single `*` can be provided per resource instead to allow any annotations, but it has severe performance implications.
- `--ksm-metric-labels-allow-list` is a comma-separated list of more Kubernetes label keys that is used in the resource's labels metric. By default the metric contains only name and namespace labels. To include more labels, provide a list of resource names in their plural form and Kubernetes label keys that you want to allow for them. A single asterisk (`*`) can be provided per resource instead to allow any labels, but it has severe performance implications.
- `--enable-windows-recording-rules` lets you enable the recording rule groups required for proper functioning of the Windows dashboards.

**Use annotations and labels.**

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --ksm-metric-labels-allow-list "namespaces=[k8s-label-1,k8s-label-n]" --ksm-metric-annotations-allow-list "pods=[k8s-annotation-1,k8s-annotation-n]"
```

The output is similar to the following example:

```json
    "azureMonitorProfile": {
        "metrics": {
          "enabled": true,
          "kubeStateMetrics": {
            "metricAnnotationsAllowList": "pods=[k8s-annotation-1,k8s-annotation-n]",
            "metricLabelsAllowlist": "namespaces=[k8s-label-1,k8s-label-n]"
          }
        }
      }
```

## [Azure Resource Manager](#tab/resource-manager)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in the Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- If the Azure Managed Grafana instance is in a subscription other than the Azure Monitor Workspaces subscription, register the Azure Monitor Workspace subscription with the `Microsoft.Dashboard` resource provider by following [this documentation](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template must be deployed in the same resource group as the Azure Managed Grafana workspace.
- Users with the User Access Administrator role in the subscription of the AKS cluster can enable the Monitoring Data Reader role directly by deploying the template.

### Retrieve required values for Grafana resource
On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, the instance hasn't been linked with any Azure Monitor workspace.

```json
"properties": {
    "grafanaIntegrations": {
        "azureMonitorWorkspaceIntegrations": [
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_1"
            },
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_2"
            }
        ]
    }
}
```

### Download and edit the template and the parameter file

1. Download the template at [https://aka.ms/azureprometheus-enable-arm-template](https://aka.ms/azureprometheus-enable-arm-template) and save it as **existingClusterOnboarding.json**.
1. Download the parameter file at [https://aka.ms/azureprometheus-enable-arm-template-parameterss](https://aka.ms/azureprometheus-enable-arm-template-parameters) and save it as **existingClusterParam.json**.
1. Edit the values in the parameter file.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys to be used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys to be used in the resource's labels metric. |
    | `grafanaResourceId` | Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaLocation`   | Location for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaSku`        | SKU for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. Use the **sku.name**. |

1. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. The following example is similar:

    ```json
    {
        "type": "Microsoft.Dashboard/grafana",
        "apiVersion": "2022-08-01",
        "name": "[split(parameters('grafanaResourceId'),'/')[8]]",
        "sku": {
            "name": "[parameters('grafanaSku')]"
        },
        "location": "[parameters('grafanaLocation')]",
        "properties": {
            "grafanaIntegrations": {
            "azureMonitorWorkspaceIntegrations": [
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_1"
                },
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_2"
                },
                {
                    "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId')]"
                }
            ]
            }
        }
    ````

In this JSON, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON. They're added here to the Azure Resource Manager template (ARM template). If you have no existing Grafana integrations, don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor workspace resource ID provided in the parameters file.

## [Bicep](#tab/bicep)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana workspace.
- Users with the User Access Administrator role in the subscription of the AKS cluster can enable the Monitoring Data Reader role directly by deploying the template.

### Minor limitation with Bicep deployment
Currently in Bicep, there's no way to explicitly "scope" the Monitoring Data Reader role assignment on a string parameter "resource ID" for an Azure Monitor workspace (like in an ARM template). Bicep expects a value of type `resource | tenant`. Currently, there's no REST API [spec](https://github.com/Azure/azure-rest-api-specs) for an Azure Monitor workspace.

As a workaround, the default scoping for the Monitoring Data Reader role is on the resource group. The role is applied on the same Azure Monitor workspace (by inheritance), which is the expected behavior. After you deploy this Bicep template, the Grafana resource gets read permissions in all the Azure Monitor workspaces under the subscription.

### Retrieve required values for a Grafana resource

On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, the instance hasn't been linked with any Azure Monitor workspace.

```json
"properties": {
    "grafanaIntegrations": {
        "azureMonitorWorkspaceIntegrations": [
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_1"
            },
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_2"
            }
        ]
    }
}
```

### Download and edit templates and the parameter file

1. Download the main Bicep template from [this GitHub file](https://aka.ms/azureprometheus-enable-bicep-template). Save it as **FullAzureMonitorMetricsProfile.bicep**.
1. Download the parameter file from [this GitHub file](https://aka.ms/azureprometheus-enable-bicep-template-parameters) and save it as **FullAzureMonitorMetricsProfileParameters.json** in the same directory as the main Bicep template.
1. Download the [nested_azuremonitormetrics_dcra_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_dcra_clusterResourceId) and [nested_azuremonitormetrics_profile_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_profile_clusterResourceId) files in the same directory as the main Bicep template.
1. Edit the values in the parameter file.
1. The main Bicep template creates all the required resources. It uses two modules for creating the Data Collection Rule Associations (DCRA) and Azure Monitor metrics profile resources from the other two Bicep files.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys used in the resource's labels metric. |
    | `grafanaResourceId` | Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaLocation`   | Location for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaSku`        | SKU for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. Use the **sku.name**. |

1. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. The following example is similar:

    ```json
    {
        "type": "Microsoft.Dashboard/grafana",
        "apiVersion": "2022-08-01",
        "name": "[split(parameters('grafanaResourceId'),'/')[8]]",
        "sku": {
            "name": "[parameters('grafanaSku')]"
        },
        "location": "[parameters('grafanaLocation')]",
        "properties": {
            "grafanaIntegrations": {
            "azureMonitorWorkspaceIntegrations": [
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_1"
                },
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_2"
                },
                {
                    "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId')]"
                }
            ]
            }
        }
    ````

In this JSON, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON. They're added here to the ARM template. If you have no existing Grafana integrations, don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor workspace resource ID provided in the parameters file.

## [Azure Policy](#tab/azurepolicy)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in the Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.

### Download Azure Policy rules and parameters and deploy

1. Download the main Azure Policy rules template from [this GitHub file](https://aka.ms/AddonPolicyMetricsProfile). Save it as **AddonPolicyMetricsProfile.rules.json**.
1. Download the parameter file from [this GitHub file](https://aka.ms/AddonPolicyMetricsProfile.parameters). Save it as **AddonPolicyMetricsProfile.parameters.json** in the same directory as the rules template.
1. Create the policy definition by using a command like: <br> `az policy definition create --name "(Preview) Prometheus Metrics addon" --display-name "(Preview) Prometheus Metrics addon" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules .\AddonPolicyMetricsProfile.rules.json --params .\AddonPolicyMetricsProfile.parameters.json`
1. After you create the policy definition, in the Azure portal, select **Policy** > **Definitions**. Select the policy definition you created.
1. Select **Assign**, go to the **Parameters** tab, and fill in the details. Select **Review + Create**.
1. Now that the policy is assigned to the subscription, whenever you create a new cluster, which doesn't have Prometheus enabled, the policy runs and deploys the resources. If you want to apply the policy to an existing AKS cluster, create a **Remediation task** for that AKS cluster resource after you go to the **Policy Assignment**.
1. Now you should see metrics flowing in the existing linked Grafana resource, which is linked with the corresponding Azure Monitor workspace.

In case you create a new Managed Grafana resource from the Azure portal, link it with the corresponding Azure Monitor workspace from the **Linked Grafana Workspaces** tab of the relevant **Azure Monitor Workspace** page. Assign the Monitoring Data Reader role to the Grafana MSI on the Azure Monitor workspace resource so that it can read data for displaying the charts. Use the following instructions.

1. On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

1. Copy the value of the `principalId` field for the `SystemAssigned` identity.

    ```json
    "identity": {
            "principalId": "00000000-0000-0000-0000-000000000000",
            "tenantId": "00000000-0000-0000-0000-000000000000",
            "type": "SystemAssigned"
        },
    ```
1. On the **Access control (IAM)** page for the Azure Managed Grafana instance in the Azure portal, select **Add** > **Add role assignment**.
1. Select `Monitoring Data Reader`.
1. Select **Managed identity** > **Select members**.
1. Select the **system-assigned managed identity** with the `principalId` from the Grafana resource.
1. Choose **Select** > **Review+assign**.

### Deploy the template

Deploy the template with the parameter file by using any valid method for deploying ARM templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

### Limitations

- Ensure that you update the `kube-state metrics` Annotations and Labels list with proper formatting. There's a limitation in the ARM template deployments that require exact values in the `kube-state` metrics pods. If the Kubernetes pod has any issues with malformed parameters and isn't running, the feature won't work as expected.
- A data collection rule and data collection endpoint are created with the name `MSProm-\<short-cluster-region\>-\<cluster-name\>`. Currently, these names can't be modified.
- You must get the existing Azure Monitor workspace integrations for a Grafana workspace and update the ARM template with it. Otherwise, it overwrites and removes the existing integrations from the Grafana workspace.
---

## Enable Windows metrics collection

As of version 6.4.0-main-02-22-2023-3ee44b9e, Windows metric collection has been enabled for the AKS clusters. Onboarding to the Azure Monitor Metrics add-on enables the Windows DaemonSet pods to start running on your node pools. Both Windows Server 2019 and Windows Server 2022 are supported. Follow these steps to enable the pods to collect metrics from your Windows node pools.

1. Manually install windows-exporter on AKS nodes to access Windows metrics.
   Enable the following collectors:

   * `[defaults]`
   * `container`
   * `memory`
   * `process`
   * `cpu_info`

   Deploy the [windows-exporter-daemonset YAML](https://github.com/prometheus-community/windows_exporter/blob/master/kubernetes/windows-exporter-daemonset.yaml) file:

   ```
       kubectl apply -f windows-exporter-daemonset.yaml
   ```

1. Apply the [ama-metrics-settings-configmap](https://github.com/Azure/prometheus-collector/blob/main/otelcollector/configmaps/ama-metrics-settings-configmap.yaml) to your cluster. Set the `windowsexporter` and `windowskubeproxy` Booleans to `true`. For more information, see [Metrics add-on settings configmap](./prometheus-metrics-scrape-configuration.md#metrics-add-on-settings-configmap).
1. Enable the recording rules required for the default dashboards:

   * For the CLI, include the option `--enable-windows-recording-rules`.
   * For an ARM template, Bicep, or Azure Policy, set `enableWindowsRecordingRules` to `true` in the parameters file.

   If the cluster is already onboarded to Azure Monitor metrics, to enable Windows recording rule groups, use this [ARM template](https://github.com/Azure/prometheus-collector/blob/kaveesh/windows_recording_rules/AddonArmTemplate/WindowsRecordingRuleGroupTemplate/WindowsRecordingRules.json) and [parameters](https://github.com/Azure/prometheus-collector/blob/kaveesh/windows_recording_rules/AddonArmTemplate/WindowsRecordingRuleGroupTemplate/WindowsRecordingRulesParameters.json) file to create the rule groups.

## Verify deployment

1. Run the following command to verify that the DaemonSet was deployed properly on the Linux node pools:

    ```
    kubectl get ds ama-metrics-node --namespace=kube-system
    ```

    The number of pods should be equal to the number of nodes on the cluster. The output should resemble the following example:
    
    ```
    User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
    NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
    ama-metrics-node   1         1         1       1            1           <none>          10h
    ```

1. Run the following command to verify that the DaemonSet was deployed properly on the Windows node pools:

    ```
    kubectl get ds ama-metrics-win-node --namespace=kube-system
    ```
    
    The output should resemble the following example:
    
    ```
    User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
    NAME                   DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
    ama-metrics-win-node   3         3         3       3            3           <none>          10h
    ```

1. Run the following command to verify that the ReplicaSets were deployed properly:

    ```
    kubectl get rs --namespace=kube-system
    ```
    
    The output should resemble the following example:
    
    ```
    User@aksuser:~$kubectl get rs --namespace=kube-system
    NAME                            DESIRED   CURRENT   READY   AGE
    ama-metrics-5c974985b8          1         1         1       11h
    ama-metrics-ksm-5fcf8dffcd      1         1         1       11h
    ```

## Feature support

- ARM64 and Mariner nodes are supported.
- HTTP Proxy is supported and uses the same settings as the HTTP Proxy settings for the AKS cluster configured with [these instructions](../../../articles/aks/http-proxy.md).

## Limitations

- CPU and Memory requests and limits can't be changed for the Container insights metrics add-on. If changed, they're reconciled and replaced by original values in a few seconds.

- Azure Monitor Private Link isn't currently supported.
- Only public clouds are currently supported.

## Uninstall the metrics add-on
Currently, the Azure CLI is the only option to remove the metrics add-on and stop sending Prometheus metrics to Azure Monitor managed service for Prometheus.

1. Install the `aks-preview` extension by using the following command:

    ```
    az extension add --name aks-preview
    ```
    
    For more information on installing a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
    
    > [!NOTE]
    > Upgrade your az cli version to the latest version and ensure that the aks-preview version you're using is at least '0.5.132'. Find your current version by using the `az version`.
    
    ```azurecli
    az extension add --name aks-preview
    ```

1. Use the following command to remove the agent from the cluster nodes and delete the recording rules created for the data being collected from the cluster, along with the DCRA that links the data collection endpoint or data collection rule with your cluster. This action doesn't remove the data collection endpoint, data collection rule, or the data already collected and stored in your Azure Monitor workspace.

    ```azurecli
    az aks update --disable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
    ```

## Region mappings
When you allow a default Azure Monitor workspace to be created when you install the metrics add-on, it's created in the region listed in the following table.

| AKS cluster region | Azure Monitor workspace region |
|-----------------------|------------------------------------|
|australiacentral |eastus|
|australiacentral2 |eastus|
|australiaeast |eastus|
|australiasoutheast |eastus|
|brazilsouth |eastus|
|canadacentral |eastus|
|canadaeast |eastus|
|centralus |centralus|
|centralindia |centralindia|
|eastasia |westeurope|
|eastus |eastus|
|eastus2 |eastus2|
|francecentral |westeurope|
|francesouth |westeurope|
|japaneast |eastus|
|japanwest |eastus|
|koreacentral |westeurope|
|koreasouth |westeurope|
|northcentralus |eastus|
|northeurope |westeurope|
|southafricanorth |westeurope|
|southafricawest |westeurope|
|southcentralus |eastus|
|southeastasia |westeurope|
|southindia |centralindia|
|uksouth |westeurope|
|ukwest |westeurope|
|westcentralus |eastus|
|westeurope |westeurope|
|westindia |centralindia|
|westus |westus|
|westus2 |westus2|
|westus3 |westus|
|norwayeast |westeurope|
|norwaywest |westeurope|
|switzerlandnorth |westeurope|
|switzerlandwest |westeurope|
|uaenorth |westeurope|
|germanywestcentral |westeurope|
|germanynorth |westeurope|
|uaecentral |westeurope|
|eastus2euap |eastus2euap|
|centraluseuap |westeurope|
|brazilsoutheast |eastus|
|jioindiacentral |centralindia|
|swedencentral |westeurope|
|swedensouth |westeurope|
|qatarcentral |westeurope|

## Next steps

- [See the default configuration for Prometheus metrics](./prometheus-metrics-scrape-default.md)
- [Customize Prometheus metric scraping for the cluster](./prometheus-metrics-scrape-configuration.md)
- [Use Azure Monitor managed service for Prometheus (preview) as the data source for Grafana](./prometheus-grafana.md)
- [Configure self-hosted Grafana to use Azure Monitor managed service for Prometheus (preview)](./prometheus-self-managed-grafana-azure-active-directory.md)
