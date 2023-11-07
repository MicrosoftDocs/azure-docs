---
title: Enable Azure Monitor managed service for Prometheus
description: Enable Azure Monitor managed service for Prometheus and configure data collection from your Azure Kubernetes Service (AKS) cluster.
author: EdB-MSFT
ms.author: edbaynash
ms.custom: references_regions
ms.topic: conceptual
ms.date: 07/30/2023
ms.reviewer: aul
---

# Collect Prometheus metrics from an AKS cluster
This article describes how to configure your Azure Kubernetes Service (AKS) cluster to send data to Azure Monitor managed service for Prometheus. When you perform this configuration, a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) is installed with a metrics extension. This sends data to the Azure Monitor workspace that you specify.

> [!NOTE]
> The process described here doesn't enable [Container insights](../containers/container-insights-overview.md) on the cluster. However, both processes use the Azure Monitor agent. For different methods to enable Container insights on your cluster, see [Enable Container insights](../containers/container-insights-onboard.md)..

The Azure Monitor metrics agent's architecture utilizes a ReplicaSet and a DaemonSet. The ReplicaSet pod scrapes cluster-wide targets such as `kube-state-metrics` and custom application targets that are specified. The DaemonSet pods scrape targets solely on the node that the respective pod is deployed on, such as `node-exporter`. This is so that the agent can scale as the number of nodes and pods on a cluster increases.

## Prerequisites

- You must either have an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md) or [create a new one](../essentials/azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace).
- The cluster must use [managed identity authentication](../../aks/use-managed-identity.md).
- The following resource providers must be registered in the subscription of the AKS cluster and the Azure Monitor workspace:
  - Microsoft.ContainerService
  - Microsoft.Insights
  - Microsoft.AlertsManagement

> [!NOTE]
> `Contributor` permission is enough for enabling the addon to send data to the Azure Monitor workspace. You will need `Owner` level permission in case you're trying to link your Azure Monitor Workspace to view metrics in Azure Managed Grafana. This is required because the user executing the onboarding step, needs to be able to give the Azure Managed Grafana System Identity `Monitoring Reader` role on the Azure Monitor Workspace to query the metrics. 




## Enable Prometheus metric collection
Use any of the following methods to install the Azure Monitor agent on your AKS cluster and send Prometheus metrics to your Azure Monitor workspace.

### [Azure portal](#tab/azure-portal)

There are multiple options to enable Prometheus metrics on your cluster from the Azure portal.

#### New cluster
When you create a new AKS cluster in the Azure portal, you can enable Prometheus, Container insights, and Grafana from the **Integrations** tab.

:::image type="content" source="media/prometheus-metrics-enable/aks-integrations.png" lightbox="media/prometheus-metrics-enable/aks-integrations.png" alt-text="Screenshot of integrations tab for new AKS cluster.":::

#### From the Azure Monitor workspace
This option enables Prometheus metrics on a cluster without enabling Container insights.

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your workspace.
1. Select **Monitored clusters** in the **Managed Prometheus** section to display a list of AKS clusters.
1. Select **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" lightbox="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot that shows an Azure Monitor workspace with a Prometheus configuration.":::

#### From an existing cluster monitored with Container insights
This option adds Prometheus metrics to a cluster already enabled for Container insights.

1. Open the **Kubernetes services** menu in the Azure portal and select your AKS cluster.
2. Click **Insights**.
3. Click **Monitor settings**.

    :::image type="content" source="media/prometheus-metrics-enable/aks-cluster-monitor-settings.png" lightbox="media/prometheus-metrics-enable/aks-cluster-monitor-settings.png" alt-text="Screenshot of button for monitor settings for an AKS cluster.":::

4. Click the checkbox for **Enable Prometheus metrics** and select your Azure Monitor workspace.
5. To send the collected metrics to Grafana, select a Grafana workspace. See [Create an Azure Managed Grafana instance](../../managed-grafana/quickstart-managed-grafana-portal.md) for details on creating a Grafana workspace.

    :::image type="content" source="media/prometheus-metrics-enable/aks-cluster-monitor-settings-details.png" lightbox="media/prometheus-metrics-enable/aks-cluster-monitor-settings-details.png" alt-text="Screenshot of monitor settings for an AKS cluster.":::

6. Click **Configure** to complete the configuration.

See [Collect Prometheus metrics from AKS cluster (preview)](../essentials/prometheus-metrics-enable.md) for details on [verifying your deployment](../essentials/prometheus-metrics-enable.md#verify-deployment) and [limitations](../essentials/prometheus-metrics-enable.md#limitations-during-enablementdeployment)

#### From an existing cluster
This option enables Prometheus, Grafana, and Container insights on a cluster.

1. Open the clusters menu in the Azure portal and  select **Insights**.
3. Select **Configure monitoring**.
4. Container insights is already enabled. Select the checkboxes for **Enable Prometheus metrics** and **Enable Grafana**. If you have existing Azure Monitor workspace and Garafana workspace, then they're selected for you. Click **Advanced settings** to select alternate workspaces or create new ones.

    :::image type="content" source="media/prometheus-metrics-enable/configure-container-insights.png" lightbox="media/prometheus-metrics-enable/configure-container-insights.png" alt-text="Screenshot that shows that show the dialog box to configure Container insights with Prometheus and Grafana.":::

5. Click **Configure** to save the configuration.


### [CLI](#tab/cli)

#### Prerequisites

- The aks-preview extension must be uninstalled by using the command `az extension remove --name aks-preview`. For more information on how to uninstall a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
- Az CLI version of 2.49.0 or higher is required for this feature. Check the aks-preview version by using the `az version` command.

#### Install the metrics add-on

Use `az aks create` or `az aks update` with the `-enable-azure-monitor-metrics` option to install the metrics add-on. Depending on the Azure Monitor workspace and Grafana workspace you want to use, choose one of the following options:

- **Create a new default Azure Monitor workspace.**<br>
If no Azure Monitor workspace is specified, a default Azure Monitor workspace is created in a resource group with the name `DefaultRG-<cluster_region>` and is named `DefaultAzureMonitorWorkspace-<mapped_region>`.


    ```azurecli
    az aks create/update --enable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group>
    ```

- **Use an existing Azure Monitor workspace.**<br>
If the existing Azure Monitor workspace is already linked to one or more Grafana workspaces, data is available in that Grafana workspace.

    ```azurecli
    az aks create/update --enable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <workspace-name-resource-id>
    ```

- **Use an existing Azure Monitor workspace and link with an existing Grafana workspace.**<br>
This option creates a link between the Azure Monitor workspace and the Grafana workspace.

    ```azurecli
    az aks create/update --enable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>
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

- `--ksm-metric-annotations-allow-list` is a comma-separated list of Kubernetes annotations keys used in the resource's kube_resource_annotations metric(For ex- kube_pod_annotations is the annotations metric for the pods resource). By default, the kube_resource_annotations(ex - kube_pod_annotations) metric contains only name and namespace labels. To include more annotations, provide a list of resource names in their plural form and Kubernetes annotation keys that you want to allow for them (Example: 'pods=[kubernetes.io/team,...],namespaces=[kubernetes.io/team],...)'. A single `*` can be provided per resource instead to allow any annotations, but it has severe performance implications.
- `--ksm-metric-labels-allow-list` is a comma-separated list of more Kubernetes label keys that is used in the resource's kube_resource_labels metric kube_resource_labels metric(For ex- kube_pod_labels is the labels metric for the pods resource). By default the kube_resource_labels(ex - kube_pod_labels) metric contains only name and namespace labels. To include more labels, provide a list of resource names in their plural form and Kubernetes label keys that you want to allow for them (Example: 'pods=[app],namespaces=[k8s-label-1,k8s-label-n,...],...)'. A single asterisk (`*`) can be provided per resource instead to allow any labels, but it has severe performance implications.
- `--enable-windows-recording-rules` lets you enable the recording rule groups required for proper functioning of the Windows dashboards.

**Use annotations and labels.**

```azurecli
az aks create/update --enable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group> --ksm-metric-labels-allow-list "namespaces=[k8s-label-1,k8s-label-n]" --ksm-metric-annotations-allow-list "pods=[k8s-annotation-1,k8s-annotation-n]"
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

- If the Azure Managed Grafana instance is in a subscription other than the Azure Monitor workspace subscription, register the Azure Monitor workspace subscription with the `Microsoft.Dashboard` resource provider by following [this documentation](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- The Azure Monitor workspace and Azure Managed Grafana instance must already be created.
- The template must be deployed in the same resource group as the Azure Managed Grafana instance.
- Users with the `User Access Administrator` role in the subscription of the AKS cluster can enable the `Monitoring Reader` role directly by deploying the template.

### Retrieve required values for Grafana resource

On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, the list of already existing Grafana integrations is needed. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, then the instance hasn't been linked with any Azure Monitor workspace.

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
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys to be used in the resource's annotations metric. |
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
    ```

In this JSON, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON. They're added here to the Azure Resource Manager template (ARM template). If you have no existing Grafana integrations, don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor workspace resource ID provided in the parameters file.

## [Bicep](#tab/bicep)

### Prerequisites

- The Azure Monitor workspace and Azure Managed Grafana instance must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana instance.
- Users with the `User Access Administrator` role in the subscription of the AKS cluster can enable the `Monitoring Reader` role directly by deploying the template.

### Limitation with Bicep deployment
Currently in Bicep, there's no way to explicitly scope the `Monitoring Reader` role assignment on a string parameter "resource ID" for an Azure Monitor workspace (like in an ARM template). Bicep expects a value of type `resource | tenant`. There also is no REST API [spec](https://github.com/Azure/azure-rest-api-specs) for an Azure Monitor workspace.

Therefore, the default scoping for the `Monitoring Reader` role is on the resource group. The role is applied on the same Azure Monitor workspace (by inheritance), which is the expected behavior. After you deploy this Bicep template, the Grafana instance is given `Monitoring Reader` permissions for all the Azure Monitor workspaces in that resource group.

### Retrieve required values for a Grafana resource

On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, the list of already existing Grafana integrations is needed. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, then the instance hasn't been linked with any Azure Monitor workspace.

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

1. Download the [main Bicep template](https://aka.ms/azureprometheus-enable-bicep-template). Save it as **FullAzureMonitorMetricsProfile.bicep**.
2. Download the [parameter file](https://aka.ms/azureprometheus-enable-bicep-template-parameters) and save it as **FullAzureMonitorMetricsProfileParameters.json** in the same directory as the main Bicep template.
3. Download the [nested_azuremonitormetrics_dcra_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_dcra_clusterResourceId) and [nested_azuremonitormetrics_profile_clusterResourceId.bicep](https://aka.ms/nested_azuremonitormetrics_profile_clusterResourceId) files into the same directory as the main Bicep template.
4. Edit the values in the parameter file.
5. The main Bicep template creates all the required resources. It uses two modules for creating the Data Collection Rule Associations (DCRA) and Azure Monitor metrics profile resources from the other two Bicep files.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of more Kubernetes label keys used in the resource's annotations metric. |
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
    ```

In this JSON, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON. They're added here to the ARM template. If you have no existing Grafana integrations, don't include these entries for `full_resource_id_1` and `full_resource_id_2`.

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor workspace resource ID provided in the parameters file.

## [Terraform](#tab/terraform)

### Prerequisites

- If the Azure Managed Grafana instance is in a subscription other than the Azure Monitor Workspaces subscription, register the Azure Monitor Workspace subscription with the `Microsoft.Dashboard` resource provider by following [this documentation](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana workspace.
- Users with the User Access Administrator role in the subscription of the AKS cluster can enable the Monitoring Reader role directly by deploying the template.

### Retrieve required values for a Grafana resource

On the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

If you're using an existing Azure Managed Grafana instance that's already linked to an Azure Monitor workspace, you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, the instance hasn't been linked with any Azure Monitor workspace. Update the azure_monitor_workspace_integrations block(shown here) in main.tf with the list of grafana integrations.

```.tf
  azure_monitor_workspace_integrations {
    resource_id  = var.monitor_workspace_id[var.monitor_workspace_id1, var.monitor_workspace_id2]
  }
```

### Download and edit the templates

If you're deploying a new AKS cluster using Terraform with managed Prometheus addon enabled, follow these steps:

1. Download all files under [AddonTerraformTemplate](https://aka.ms/AAkm357).
2. Edit the variables in variables.tf file with the correct parameter values.
3. Run `terraform init -upgrade` to initialize the Terraform deployment.
4. Run `terraform plan -out main.tfplan` to initialize the Terraform deployment.
5. Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.


Note: Pass the variables for `annotations_allowed` and `labels_allowed` keys in main.tf only when those values exist. These are optional blocks.

> [!NOTE]
> Edit the main.tf file appropriately before running the terraform template. Add in any existing azure_monitor_workspace_integrations values to the grafana resource before running the template. Else, older values gets deleted and replaced with what is there in the template during deployment. Users with 'User Access Administrator' role in the subscription  of the AKS cluster can enable 'Monitoring Reader' role directly by deploying the template. Edit the grafanaSku parameter if you're using a nonstandard SKU and finally run this template in the Grafana Resource's resource group.

## [Azure Policy](#tab/azurepolicy)

### Prerequisites

- The Azure Monitor workspace and Azure Managed Grafana instance must already be created.

### Download Azure Policy rules and parameters and deploy

1. Download the main [Azure Policy rules template](https://aka.ms/AddonPolicyMetricsProfile). Save it as **AddonPolicyMetricsProfile.rules.json**.
1. Download the [parameter file](https://aka.ms/AddonPolicyMetricsProfile.parameters). Save it as **AddonPolicyMetricsProfile.parameters.json** in the same directory as the rules template.
1. Create the policy definition using the following command:

      `az policy definition create --name "(Preview) Prometheus Metrics addon" --display-name "(Preview) Prometheus Metrics addon" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules AddonPolicyMetricsProfile.rules.json --params AddonPolicyMetricsProfile.parameters.json`

1. After you create the policy definition, in the Azure portal, select **Policy** > **Definitions**. Select the policy definition you created.
1. Select **Assign**, go to the **Parameters** tab, and fill in the details. Select **Review + Create**.
1. After the policy is assigned to the subscription, whenever you create a new cluster without Prometheus enabled, the policy will run and deploy to enable Prometheus monitoring. If you want to apply the policy to an existing AKS cluster, create a **Remediation task** for that AKS cluster resource after you go to the **Policy Assignment**.
1. Now you should see metrics flowing in the existing Azure Managed Grafana instance, which is linked with the corresponding Azure Monitor workspace.

Afterwards, if you create a new Managed Grafana instance, you can link it with the corresponding Azure Monitor workspace from the **Linked Grafana Workspaces** tab of the relevant **Azure Monitor Workspace** page. The `Monitoring Reader` role must be assigned to the managed identity of the Managed Grafana instance with the scope as the Azure Monitor workspace, so that Grafana has access to query the metrics. Use the following instructions to do so:

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
1. Select `Monitoring Reader`.
1. Select **Managed identity** > **Select members**.
1. Select the **system-assigned managed identity** with the `principalId` from the Grafana resource.
1. Choose **Select** > **Review+assign**.

### Deploy the template

Deploy the template with the parameter file by using any valid method for deploying ARM templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

### Limitations during enablement/deployment

- Ensure that you update the `kube-state metrics` annotations and labels list with proper formatting. There's a limitation in the ARM template deployments that require exact values in the `kube-state` metrics pods. If the Kubernetes pod has any issues with malformed parameters and isn't running, the feature might not run as expected.
- A data collection rule and data collection endpoint are created with the name `MSProm-\<short-cluster-region\>-\<cluster-name\>`. Currently, these names can't be modified.
- You must get the existing Azure Monitor workspace integrations for a Grafana instance and update the ARM template with it. Otherwise, the ARM deployment gets over-written, which removes existing integrations.
---

## Enable Windows metrics collection

> [!NOTE]
> There is no CPU/Memory limit in windows-exporter-daemonset.yaml so it may over-provision the Windows nodes  
> For more details see [Resource reservation](https://kubernetes.io/docs/concepts/configuration/windows-resource-management/#resource-reservation)
>   
> As you deploy workloads, set resource memory and CPU limits on containers. This also subtracts from NodeAllocatable and helps the cluster-wide scheduler in determining which pods to place on which nodes.
> Scheduling pods without limits may over-provision the Windows nodes and in extreme cases can cause the nodes to become unhealthy.


As of version 6.4.0-main-02-22-2023-3ee44b9e of the Managed Prometheus addon container (prometheus_collector), Windows metric collection has been enabled for the AKS clusters. Onboarding to the Azure Monitor Metrics add-on enables the Windows DaemonSet pods to start running on your node pools. Both Windows Server 2019 and Windows Server 2022 are supported. Follow these steps to enable the pods to collect metrics from your Windows node pools.

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
1. Enable the recording rules that are required for the out-of-the-box dashboards:

   * If onboarding using the CLI, include the option `--enable-windows-recording-rules`.
   * If onboarding using an ARM template, Bicep, or Azure Policy, set `enableWindowsRecordingRules` to `true` in the parameters file.
   * If the cluster is already onboarded, use [this ARM template](https://github.com/Azure/prometheus-collector/blob/kaveesh/windows_recording_rules/AddonArmTemplate/WindowsRecordingRuleGroupTemplate/WindowsRecordingRules.json) and [this parameter file](https://github.com/Azure/prometheus-collector/blob/kaveesh/windows_recording_rules/AddonArmTemplate/WindowsRecordingRuleGroupTemplate/WindowsRecordingRulesParameters.json) to create the rule groups.

## Verify deployment

1. Run the following command to verify that the DaemonSet was deployed properly on the Linux node pools:

    ```
    kubectl get ds ama-metrics-node --namespace=kube-system
    ```

    The number of pods should be equal to the number of Linux nodes on the cluster. The output should resemble the following example:

    ```
    User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
    NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
    ama-metrics-node   1         1         1       1            1           <none>          10h
    ```

1. Run the following command to verify that the DaemonSet was deployed properly on the Windows node pools:

    ```
    kubectl get ds ama-metrics-win-node --namespace=kube-system
    ```

    The number of pods should be equal to the number of Windows nodes on the cluster. The output should resemble the following example:

    ```
    User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
    NAME                   DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
    ama-metrics-win-node   3         3         3       3            3           <none>          10h
    ```

1. Run the following command to verify that the two ReplicaSets were deployed properly:

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
## Artifacts/Resources provisioned/created as a result of metrics addon enablement for an AKS cluster

When you enable metrics addon, the following resources are provisioned:

| Resource Name | Resource Type | Resource Group | Region/Location | Description |
    |:---|:---|:---|:---|:---|
    | `MSPROM-<aksclusterregion>-<clustername>` | **Data Collection Rule** | Same Resource group as AKS cluster resource | Same region as Azure Monitor Workspace | This data collection rule is for prometheus metrics collection by metrics addon, which has the chosen Azure monitor workspace as destination, and also it is associated to the AKS cluster resource |
    | `MSPROM-<aksclusterregion>-<clustername>` | **Data Collection endpoint** | Same Resource group as AKS cluster resource | Same region as Azure Monitor Workspace | This data collection endpoint is used by the above data collection rule for ingesting Prometheus metrics from the metrics addon|
    
When you create a new Azure Monitor workspace, the following additional resources are created as part of it

| Resource Name | Resource Type | Resource Group | Region/Location | Description |
    |:---|:---|:---|:---|:---|
    | `<azuremonitor-workspace-name>` | **System Data Collection Rule** | MA_\<azuremonitor-workspace-name>_\<azuremonitor-workspace-region>_managed | Same region as Azure Monitor Workspace | This is **system** data collection rule that customers can use when they use OSS Prometheus server to Remote Write to Azure Monitor Workspace |
    | `<azuremonitor-workspace-name>` | **System Data Collection endpoint** | MA_\<azuremonitor-workspace-name>_\<azuremonitor-workspace-region>_managed | Same region as Azure Monitor Workspace | This is **system** data collection endpoint that customers can use when they use OSS Prometheus server to Remote Write to Azure Monitor Workspace |
    

## HTTP Proxy

Azure Monitor metrics addon supports HTTP Proxy and uses the same settings as the HTTP Proxy settings for the AKS cluster configured with [these instructions](../../../articles/aks/http-proxy.md).

## Network firewall requirements

**Azure public cloud**

The following table lists the firewall configuration required for Azure monitor Prometheus metrics ingestion for Azure Public cloud. All network traffic from the agent is outbound to Azure Monitor.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.com` | Access control service/ Azure Monitor control plane service | 443 |
| `*.ingest.monitor.azure.com` | Azure monitor managed service for Prometheus - metrics ingestion endpoint (DCE) | 443 |
| `*.handler.control.monitor.azure.com` | For querying data collection rules  | 443 |

**Azure US Government cloud**

The following table lists the firewall configuration required for Azure monitor Prometheus metrics ingestion for Azure US Government cloud. All network traffic from the agent is outbound to Azure Monitor.

|Agent resource| Purpose | Port |
|--------------|------|---|
| `global.handler.control.monitor.azure.us` | Access control service/ Azure Monitor control plane service | 443 |
| `*.ingest.monitor.azure.us` | Azure monitor managed service for Prometheus - metrics ingestion endpoint (DCE) | 443 |
| `*.handler.control.monitor.azure.us` | For querying data collection rules  | 443 |

## Uninstall the metrics add-on

To uninstall the metrics add-on, see [Disable Prometheus metrics collection on an AKS cluster.](./prometheus-metrics-disable.md) 

## Supported regions

The list of regions Azure Monitor Metrics and Azure Monitor Workspace is supported in can be found [here](https://aka.ms/ama-metrics-supported-regions) under the Managed Prometheus tag.

## Frequently asked questions

This section provides answers to common questions.

### Does enabling managed service for Prometheus on my Azure Kubernetes Service cluster also enable Container insights?

You have options for how you can collect your Prometheus metrics. If you use the Azure portal and enable Prometheus metrics collection and install the Azure Kubernetes Service (AKS) add-on from the Azure Monitor workspace UX, it won't enable Container insights and collection of log data. When you go to the Insights page on your AKS cluster, you're prompted to enable Container insights to collect log data.<br>
          
If you use the Azure portal and enable Prometheus metrics collection and install the AKS add-on from the Insights page of your AKS cluster, it enables log collection into a Log Analytics workspace. and Prometheus metrics collection into an Azure Monitor workspace. 

## Next steps

- [See the default configuration for Prometheus metrics](./prometheus-metrics-scrape-default.md)
- [Customize Prometheus metric scraping for the cluster](./prometheus-metrics-scrape-configuration.md)
- [Use Azure Monitor managed service for Prometheus as the data source for Grafana](../essentials/prometheus-grafana.md)
- [Configure self-hosted Grafana to use Azure Monitor managed service for Prometheus](../essentials/prometheus-self-managed-grafana-azure-active-directory.md)
