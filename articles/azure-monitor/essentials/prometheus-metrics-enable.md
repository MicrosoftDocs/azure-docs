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

# Collect Prometheus metrics from AKS cluster (preview)
This article describes how to configure your Azure Kubernetes Service (AKS) cluster to send data to Azure Monitor managed service for Prometheus. When you configure your AKS cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) is installed with a metrics extension. You just need to specify the Azure Monitor workspace that the data should be sent to.

> [!NOTE]
> The process described here doesn't enable [Container insights](../containers/container-insights-overview.md) on the cluster even though the Azure Monitor agent installed in this process is the same one used by Container insights. See [Enable Container insights](../containers/container-insights-onboard.md) for different methods to enable Container insights on your cluster. See [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md) for details on adding Prometheus collection to a cluster that already has Container insights enabled.

## Prerequisites

- You must either have an [Azure Monitor workspace](azure-monitor-workspace-overview.md) or [create a new one](azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace).
- The cluster must use [managed identity authentication](../../aks/use-managed-identity.md).
- The following resource providers must be registered in the subscription of the AKS cluster and the Azure Monitor Workspace.
  - Microsoft.ContainerService
  - Microsoft.Insights
  - Microsoft.AlertsManagement

## Enable Prometheus metric collection
Use any of the following methods to install the Azure Monitor agent on your AKS cluster and send Prometheus metrics to your Azure Monitor workspace.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster.
2. Select **Managed Prometheus** to display a list of AKS clusters.
3. Click **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" lightbox="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot of Azure Monitor workspace with Prometheus configuration.":::


### [CLI](#tab/cli)

#### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The aks-preview extension needs to be installed using the command `az extension add --name aks-preview`. For more information on how to install a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
- Aks-preview version 0.5.122 or higher is required for this feature. You can check the aks-preview version using the `az version` command.

#### Install metrics addon

Use `az aks update` with the `-enable-azuremonitormetrics` option to install the metrics addon. Following are multiple options depending on the Azure Monitor workspace and Grafana workspace you want to use.


**Create a new default Azure Monitor workspace.**<br>
If no Azure Monitor Workspace is specified, then a default Azure Monitor Workspace will be created in the `DefaultRG-<cluster_region>` following the format `DefaultAzureMonitorWorkspace-<mapped_region>`.
This Azure Monitor Workspace is in the region specific in [Region mappings](#region-mappings).

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
```

**Use an existing Azure Monitor workspace.**<br>
If the Azure Monitor workspace is linked to one or more Grafana workspaces, then the data is available in Grafana.

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <workspace-name-resource-id>
```

**Use an existing Azure Monitor workspace and link with an existing Grafana workspace.**<br>
This creates a link between the Azure Monitor workspace and the Grafana workspace.

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>
```

The output for each command looks similar to the following:

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
Following are optional parameters that you can use with the previous commands.

- `--ksm-metric-annotations-allow-list` is a comma-separated list of Kubernetes annotations keys that will be used in the resource's labels metric. By default the metric contains only name and namespace labels. To include more annotations provide a list of resource names in their plural form and Kubernetes annotation keys, you would like to allow for them. A single `*` can be provided per resource instead to allow any annotations, but that has severe performance implications.
- `--ksm-metric-labels-allow-list` is a comma-separated list of more Kubernetes label keys that will be used in the resource's labels metric. By default the metric contains only name and namespace labels. To include more labels provide a list of resource names in their plural form and Kubernetes label keys, you would like to allow for them. A single `*` can be provided per resource instead to allow any labels, but that has severe performance implications.

**Use annotations and labels.**

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --ksm-metric-labels-allow-list "namespaces=[k8s-label-1,k8s-label-n]" --ksm-metric-annotations-allow-list "pods=[k8s-annotation-1,k8s-annotation-n]"
```

The output is similar to the following:

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

## [Resource Manager](#tab/resource-manager)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- If the Azure Managed Grafana instance is in a subscription other than the Azure Monitor Workspaces subscription, then please register the Azure Monitor Workspace subscription with the `Microsoft.Dashboard` resource provider following this [documentation](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana workspace.
- Users with 'User Access Administrator' role in the subscription of the AKS cluster can be able to enable 'Monitoring Data Reader' role directly by deploying the template.


### Retrieve required values for Grafana resource
From the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that already has been linked to an Azure Monitor workspace, then you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, then the instance hasn't been linked with any Azure Monitor workspace.

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

### Download and edit template and parameter file

1. Download the template at [https://aka.ms/azureprometheus-enable-arm-template](https://aka.ms/azureprometheus-enable-arm-template) and save it as **existingClusterOnboarding.json**.
2. Download the parameter file at [https://aka.ms/azureprometheus-enable-arm-template-parameterss](https://aka.ms/azureprometheus-enable-arm-template-parameters) and save it as **existingClusterParam.json**.
3. Edit the values in the parameter file.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys that will be used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys that will be used in the resource's labels metric. |
    | `grafanaResourceId` | Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaLocation`   | Location for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaSku`        | SKU for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. Use the **sku.name**. |


4. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. This is similar to the following:

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

In this json, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON, and they're added here to the ARM template. If you have no existing Grafana integrations, then don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor Workspace resource ID provided in the parameters file.

## [Bicep](#tab/bicep)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana workspace.
- Users with 'User Access Administrator' role in the subscription of the AKS cluster can be able to enable 'Monitoring Data Reader' role directly by deploying the template.

### Minor Limitation while deploying through bicep
Currently in bicep, there is no way to explicitly "scope" the Monitoring Data Reader role assignment on a string parameter "resource id" for Azure Monitor Workspace (like in ARM template). Bicep expects a value of type "resource | tenant" and currently there is no rest api [spec](https://github.com/Azure/azure-rest-api-specs) for Azure Monitor Workspace. So, as a workaround, the default scoping for Monitoring Data Reader role is on the resource group and thus the role is applied on the same Azure monitor workspace (by inheritance) which is the expected behavior. Thus, after deploying this bicep template, the Grafana resource will get read permissions in all the Azure Monitor Workspaces under the subscription.


### Retrieve required values for Grafana resource

From the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that already has been linked to an Azure Monitor workspace, then you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, then the instance hasn't been linked with any Azure Monitor workspace.

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

### Download and edit templates and parameter file

1. Download the main bicep template from [here](https://aka.ms/azureprometheus-enable-bicep-template) and save it as **FullAzureMonitorMetricsProfile.bicep**.
2. Download the parameter file from [here](https://aka.ms/azureprometheus-enable-bicep-template-parameters) and save it as **FullAzureMonitorMetricsProfileParameters.json** in the same directory as the main bicep template.
3. Download the [nested_azuremonitormetrics_dcra_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_dcra_clusterResourceId) and [nested_azuremonitormetrics_profile_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_profile_clusterResourceId) files in the same directory as the main bicep template.
4. Edit the values in the parameter file.
5. The main bicep template creates all the required resources and uses two modules for creating the dcra and monitormetrics profile resources from the other two bicep files.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys that will be used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys that will be used in the resource's labels metric. |
    | `grafanaResourceId` | Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaLocation`   | Location for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaSku`        | SKU for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. Use the **sku.name**. |


6. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. This is similar to the following:

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

In this json, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON, and they're added here to the ARM template. If you have no existing Grafana integrations, then don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor Workspace resource ID provided in the parameters file.

## [Azure Policy](#tab/azurepolicy)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.

### Download Azure policy rules and parameters and deploy

1. Download the main Azure policy rules template from [here](https://aka.ms/AddonPolicyMetricsProfile) and save it as **AddonPolicyMetricsProfile.rules.json**.
2. Download the parameter file from [here](https://aka.ms/AddonPolicyMetricsProfile.parameters) and save it as **AddonPolicyMetricsProfile.parameters.json** in the same directory as the rules template.
3. Create the policy definition using a command like : `az policy definition create --name "(Preview) Prometheus Metrics addon" --display-name "(Preview) Prometheus Metrics addon" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules .\AddonPolicyMetricsProfile.rules.json --params .\AddonPolicyMetricsProfile.parameters.json`
4. After creating the policy definition, go to Azure portal -> Policy -> Definitions and select the Policy definition you created.
5. Click on 'Assign' and then go to the 'Parameters' tab and fill in the details. Then click 'Review + Create'.
6. Now that the policy is assigned to the subscription, whenever you create a new cluster, which does not have Prometheus enabled, the policy will run and deploy the resources. If you want to apply the policy to existing AKS cluster, create a 'Remediation task' for that AKS cluster resource after going to the 'Policy Assignment'.
7. Now you should see metrics flowing in the existing linked Grafana resource, which is linked with the corresponding Azure Monitor Workspace.

In case you create a new Managed Grafana resource from Azure portal, please link it with the corresponding Azure Monitor Workspace from the 'Linked Grafana Workspaces' tab of the relevant Azure Monitor Workspace page. Please assign the role 'Monitoring Data Reader' to the Grafana MSI on the Azure Monitor Workspace resource so that it can read data for displaying the charts, using the instructions below.

1. From the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

2. Copy the value of the `principalId` field for the `SystemAssigned` identity.

```json
"identity": {
        "principalId": "00000000-0000-0000-0000-000000000000",
        "tenantId": "00000000-0000-0000-0000-000000000000",
        "type": "SystemAssigned"
    },
```
3. From the **Access control (IAM)** page for the Azure Managed Grafana instance in the Azure portal, select **Add** and then **Add role assignment**.
4. Select `Monitoring Data Reader`.
5. Select **Managed identity** and then **Select members**.
6. Select the **system-assigned managed identity** with the `principalId` from the Grafana resource.
7. Click **Select** and then **Review+assign**.

### Deploy template

Deploy the template with the parameter file using any valid method for deploying Resource Manager templates. See [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates) for examples of different methods.

### Limitations

- Ensure that you update the `kube-state metrics` Annotations and Labels list with proper formatting. There's a limitation in the Resource Manager template deployments that require exact values in the `kube-state` metrics pods. If the kuberenetes pod has any issues with malformed parameters and isn't running, then the feature won't work as expected.
- A data collection rule and data collection endpoint is created with the name `MSProm-\<short-cluster-region\>-\<cluster-name\>`. These names can't currently be modified.
- You must get the existing Azure Monitor workspace integrations for a Grafana workspace and update the Resource Manager template with it, otherwise it will overwrite and remove the existing integrations from the grafana workspace.
---

## Enable windows metrics collection

- For accessing windows metrics you must manually install the windows exporter on AKS nodes. Please enable the following collectors : `[defaults],container,memory,process,cpu_info`. You can deploy the following [YAML](https://github.com/prometheus-community/windows_exporter/blob/master/kubernetes/windows-exporter-daemonset.yaml) file using `kubectl apply -f windows-exporter-daemonset.yaml`
- Please refer to the [customize configuration section](./prometheus-metrics-scrape-configuration.md#metrics-addon-settings-configmap) and enable the `windowsexporter` boolean to true.


## Verify Deployment

Run the following command to verify that the daemon set was deployed properly on the linux nodepools:

```
kubectl get ds ama-metrics-node --namespace=kube-system
```

The output should resemble the following:

```
User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
ama-metrics-node   1         1         1       1            1           <none>          10h
```

Run the following command to verify that the daemon set was deployed properly on the windows nodepools:

```
kubectl get ds ama-metrics-win-node --namespace=kube-system
```

The output should resemble the following:

```
User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
NAME                   DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
ama-metrics-win-node   3         3         3       3            3           <none>          10h
```

Run the following command to which verify that the replica set was deployed properly:

```
kubectl get rs --namespace=kube-system
```

The output should resemble the following:

```
User@aksuser:~$kubectl get rs --namespace=kube-system
NAME                            DESIRED   CURRENT   READY   AGE
ama-metrics-5c974985b8          1         1         1       11h
ama-metrics-ksm-5fcf8dffcd      1         1         1       11h
```


## Limitations

- CPU and Memory requests and limits can't be changed for Container insights metrics addon. If changed, they'll be reconciled and replaced by original values in a few seconds.
- Metrics addon doesn't work on AKS clusters configured with HTTP proxy.


## Uninstall metrics addon
Currently, Azure CLI is the only option to remove the metrics addon and stop sending Prometheus metrics to Azure Monitor managed service for Prometheus.

If you don't already have it, install the aks-preview extension with the following command.

The `aks-preview` extension needs to be installed using the following command. For more information on how to install a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

> [!NOTE]
> Please upgrade your az cli version to the latest version and ensure that the aks-preview version you're using is greater than '0.5.106'. You can find out the version using the `az version` command.

```azurecli
az extension add --name aks-preview
```
Use the following command to remove the agent from the cluster nodes and delete the recording rules created for the data being collected from the cluster along with the Data Collection Rule Associations (DCRA) that link the DCE or DCR with your cluster. This doesn't remove the DCE, DCR, or the data already collected and stored in your Azure Monitor workspace.

```azurecli
az aks update --disable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
```

## Region mappings
When you allow a default Azure Monitor workspace to be created when you install the metrics addon, it's created in the region listed in the following table.

| AKS Cluster region | Azure Monitor workspace region |
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


- [See the default configuration for Prometheus metrics](./prometheus-metrics-scrape-default.md).
- [Customize Prometheus metric scraping for the cluster](./prometheus-metrics-scrape-configuration.md).
- [Use Azure Monitor managed service for Prometheus (preview) as data source for Grafana](./prometheus-grafana.md)
- [Configure self-hosted Grafana to use Azure Monitor managed service for Prometheus (preview)](./prometheus-self-managed-grafana-azure-active-directory.md)

