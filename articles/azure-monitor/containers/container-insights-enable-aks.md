---
title: Enable Container insights for Azure Kubernetes Service (AKS) cluster
description: Learn how to enable Container insights on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 01/09/2023
ms.custom: ignite-2022, devx-track-azurecli
ms.reviewer: aul
---

# Enable Container insights for Azure Kubernetes Service (AKS) cluster

This article describes how to enable Container insights to monitor a managed Kubernetes cluster hosted on an [Azure Kubernetes Service (AKS)](../../aks/index.yml) cluster.

## Prerequisites

- See [Prerequisites](./container-insights-onboard.md) for Container insights.
- If you're connecting an existing AKS cluster to a Log Analytics workspace in another subscription, the *Microsoft.ContainerService* resource provider must be registered in the subscription with the Log Analytics workspace. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## New AKS cluster

### [Azure portal](#tab/azure-portal)

There are multiple options to enable Prometheus metrics on your cluster from the Azure portal.


#### New cluster
When you create a new AKS cluster in the Azure portal, you can enable Prometheus, Container insights, and Grafana from the **Integrations** tab. In the Azure Monitor section, select either **Default configuration** or **Custom configuration** if you want to specifies which workspaces to use.

:::image type="content" source="media/prometheus-metrics-enable/aks-integrations.png" lightbox="media/prometheus-metrics-enable/aks-integrations.png" alt-text="Screenshot of integrations tab for new AKS cluster.":::

#### Existing cluster

> [!NOTE]
> When you enable Container Insights on legacy auth clusters, a managed identity is automatically created. This identity will not be available in case the cluster migrates to MSI Auth or if the Container Insights is disabled and hence this managed identity should not be used for anything else.

This options enables Prometheus, Grafana, and Container insights on a cluster.

1. Open the cluster's menu in the Azure portal and  select **Insights**.
   1. If Container insights isn't enabled for the cluster, then you're presented with a screen identifying which of the features have been enabled. Click **Configure monitoring**.

    :::image type="content" source="media/aks-onboard/configure-monitoring-screen.png" lightbox="media/aks-onboard/configure-monitoring-screen.png" alt-text="Screenshot that shows the configuration screen for a cluster.":::

   2. If Container insights has already been enabled on the cluster, select the **Monitoring Settings** button to modify the configuration.

    :::image type="content" source="media/aks-onboard/monitor-settings-button.png" lightbox="media/aks-onboard/monitor-settings-button.png" alt-text="Screenshot that shows the monitoring settings button for a cluster.":::

2. **Container insights** will be enabled. If you want to enabled Managed Prometheus without Container insights, then enable it from the Azure Monitor workspace. **Select** the checkboxes for **Enable Prometheus metrics** and **Enable Grafana**. If you have existing Azure Monitor workspace and Garafana workspace, then they're selected for you. Click **Advanced settings** to select alternate workspaces or create new ones.

    :::image type="content" source="media/prometheus-metrics-enable/configure-container-insights.png" lightbox="media/prometheus-metrics-enable/configure-container-insights.png" alt-text="Screenshot that shows that show the dialog box to configure Container insights with Prometheus and Grafana.":::

3. See [Enable cost optimization settings in Container insights](./container-insights-cost-config.md) for details on the **Cost presets** setting.
4. Click **Configure** to save the configuration.

### From Container insights

1. Open the **Monitor** menu in the Azure portal and  select **Insights**. 
2. The **Monitored clusters** tab lists clusters that have Container insights enabled. If Prometheus isn't enabled on a cluster, then click **Configure** and follow the guidance in [Existing cluster](#existing-cluster).
3. The **Unmonitored clusters** tab lists clusters that don't have Container insights enabled. Click **Enable** next to a cluster and follow the guidance in [Existing cluster](#existing-cluster).

#### From the Azure Monitor workspace (Prometheus only)
This option enables Prometheus metrics on a cluster without enabling Container insights.

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your workspace.
1. Select **Monitored clusters** in the **Managed Prometheus** section to display a list of AKS clusters.
1. Select **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" lightbox="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot that shows an Azure Monitor workspace with a Prometheus configuration.":::


## [CLI](#tab/azure-cli)


### Enable Container insights

Use the following command to enable Container insights on your cluster. If you don't include the `workspace-resource-id` parameter, a default Log Analytics workspace for the resource group will be used. If a default workspace doesn't already exist in the cluster's region, one will be created with a name in the format *DefaultWorkspace-\<GUID>-\<Region>*.

```azurecli
az aks enable-addons -a monitoring -n <cluster-name> -g <cluster-resource-group-name> --workspace-resource-id <workspace-resource-id>
```

**Example**

```azurecli
az aks enable-addons -a monitoring -n <cluster-name> -g <cluster-resource-group-name> --workspace-resource-id "/subscriptions/my-subscription/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace"
```


## [Resource Manager template](#tab/arm)

>[!NOTE]
>The template must be deployed in the same resource group as the cluster.

Download the template and parameter file.
- [Template](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file)
- [Parameter file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file)

Edit the values in the parameter file:

   - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
   - `resourceTagValues`: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be *MSCI-\<clusterName\>-\<clusterRegion\>* and this resource created in an AKS clusters resource group. If this is the first time onboarding, you can set the arbitrary tag values.

Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).



## [Terraform](#tab/terraform)

1. Add the **oms_agent** add-on profile to the existing [azurerm_kubernetes_cluster resource](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/kubernetes_cluster) depending on the version of the [Terraform AzureRM provider version](/azure/developer/terraform/provider-version-history-azurerm).

   * If the Terraform AzureRM provider version is 3.0 or higher, add the following:

    ```
    oms_agent {
       log_analytics_workspace_id = "${azurerm_log_analytics_workspace.test.id}"
      }
    ```

   * If the Terraform AzureRM provider is less than version 3.0, add the following:

    ```
    addon_profile {
     oms_agent {
        enabled                    = true
        log_analytics_workspace_id = "${azurerm_log_analytics_workspace.test.id}"
       }
    }
    ```

2. Add the [azurerm_log_analytics_solution](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_solution) by following the steps in the Terraform documentation.

3. Enable collection of custom metrics by following the guidance at [Enable custom metrics](container-insights-custom-metrics.md).

---

## Verify agent and solution deployment
You can verify that the agent is deployed properly using the [kubectl command line tool](../../aks/learn/quick-kubernetes-deploy-cli.md#connect-to-the-cluster).

```
kubectl get ds ama-logs --namespace=kube-system
```

The output should resemble the following example, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get ds ama-logs --namespace=kube-system
NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
ama-logs   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
```

If there are Windows Server nodes on the cluster, run the following command to verify that the agent is deployed successfully:

```
kubectl get ds ama-logs-windows --namespace=kube-system
```

The output should resemble the following example, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get ds ama-logs-windows --namespace=kube-system
NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                   AGE
ama-logs-windows           2         2         2         2            2           beta.kubernetes.io/os=windows   1d
```

To verify deployment of the solution, run the following command:

```
kubectl get deployment ama-logs-rs -n=kube-system
```

The output should resemble the following example, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get deployment ama-logs-rs -n=kube-system
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
ama-logs-rs   1         1         1            1            3h
```

## View configuration with CLI

Use the `aks show` command to find out whether the solution is enabled or not, what the Log Analytics workspace resource ID is, and summary information about the cluster.

```azurecli
az aks show -g <resourceGroupofAKSCluster> -n <nameofAksCluster>
```

After a few minutes, the command completes and returns JSON-formatted information about the solution. The results of the command should show the monitoring add-on profile and resemble the following example output:

```output
"addonProfiles": {
    "omsagent": {
      "config": {
        "logAnalyticsWorkspaceResourceID": "/subscriptions/<WorkspaceSubscription>/resourceGroups/<DefaultWorkspaceRG>/providers/Microsoft.OperationalInsights/workspaces/<defaultWorkspaceName>"
      },
      "enabled": true
    }
  }
```

## Private link
Use the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace using [Azure Private Link](../logs/private-link-security.md).

1. Follow the steps in [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md#enable-network-isolation-for-azure-monitor-agent) to create a data collection endpoint and add it to your Azure Monitor private link service.

1. Create an association between the cluster and the data collection endpoint by using the following API call. For information on this call, see [Data collection rule associations - Create](/rest/api/monitor/data-collection-rule-associations/create). The DCR association name must be **configurationAccessEndpoint**, and `resourceUri` is the resource ID of the AKS cluster.

    ```rest
    PUT https://management.azure.com/{cluster-resource-id}/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01
    {
    "properties": {
        "dataCollectionEndpointId": "{data-collection-endpoint-resource-id}"
        }
    }
    ```

    For example:

    ```rest
    PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/my-aks-cluster/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01

    {
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionEndpoints/myDataCollectionEndpoint"
        }
    }
    ```




## Limitations

- When you enable managed identity authentication, a data collection rule is created with the name *MSCI-\<cluster-region\>-<\cluster-name\>*. Currently, this name can't be modified.

- You must be on a machine on the same private network to access live logs from a private cluster.

## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.


You can enable monitoring for an AKS cluster when it's created by using any of the following methods:

- **Azure CLI**: Follow the steps in [Create AKS cluster](../../aks/learn/quick-kubernetes-deploy-cli.md).
- **Azure Policy**: Follow the steps in [Enable AKS monitoring add-on by using Azure Policy](container-insights-enable-aks-policy.md).
- **Terraform**: If you're [deploying a new AKS cluster by using Terraform](/azure/developer/terraform/create-k8s-cluster-with-tf-and-aks), specify the arguments required in the profile [to create a Log Analytics workspace](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_workspace) if you don't choose to specify an existing one. To add Container insights to the workspace, see [azurerm_log_analytics_solution](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_solution). Complete the profile by including **oms_agent** profile.
