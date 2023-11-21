---
title: Enable Container insights for Azure Kubernetes Service (AKS) cluster
description: Learn how to enable Container insights on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 11/14/2023
ms.custom: ignite-2022
ms.reviewer: aul
---

# Enable Container insights for Azure Kubernetes Service (AKS) cluster

This article describes how to enable Container insights on a managed Kubernetes cluster hosted on an [Azure Kubernetes Service (AKS)](../../aks/index.yml) cluster.

## Prerequisites

- See [Prerequisites](./container-insights-onboard.md) for Container insights.
-  You can attach an AKS cluster to a Log Analytics workspace in a different Azure subscription in the same Microsoft Entra tenant, but you must use the Azure CLI or an Azure Resource Manager template. You can't currently perform this configuration with the Azure portal.
- If you're connecting an existing AKS cluster to a Log Analytics workspace in another subscription, the *Microsoft.ContainerService* resource provider must be registered in the subscription with the Log Analytics workspace. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).


## Enable monitoring

### [Azure portal](#tab/azure-portal)

There are multiple options to enable Prometheus metrics on your cluster from the Azure portal.


### New cluster
When you create a new AKS cluster in the Azure portal, you can enable Prometheus, Container insights, and Grafana from the **Integrations** tab. In the Azure Monitor section, select either **Default configuration** or **Custom configuration** if you want to specify which workspaces to use. You can perform additional configuration once the cluster is created.

:::image type="content" source="media/prometheus-metrics-enable/aks-integrations.png" lightbox="media/prometheus-metrics-enable/aks-integrations.png" alt-text="Screenshot of integrations tab for new AKS cluster.":::

### From existing cluster

This option enables Container insights on a cluster and gives you the option of also enabling [Managed Prometheus and Managed Grafana](./prometheus-metrics-enable.md) for the cluster.

> [!NOTE]
> If you want to enabled Managed Prometheus without Container insights, then [enable it from the Azure Monitor workspace](./prometheus-metrics-enable.md).

1. Open the cluster's menu in the Azure portal and  select **Insights**.
   1. If Container insights isn't enabled for the cluster, then you're presented with a screen identifying which of the features have been enabled. Click **Configure monitoring**.

    :::image type="content" source="media/aks-onboard/configure-monitoring-screen.png" lightbox="media/aks-onboard/configure-monitoring-screen.png" alt-text="Screenshot that shows the configuration screen for a cluster.":::

   2. If Container insights has already been enabled on the cluster, select the **Monitoring Settings** button to modify the configuration.

    :::image type="content" source="media/aks-onboard/monitor-settings-button.png" lightbox="media/aks-onboard/monitor-settings-button.png" alt-text="Screenshot that shows the monitoring settings button for a cluster.":::

2. The **Container insights** will be enabled. **Select** the checkboxes for **Enable Prometheus metrics** and **Enable Grafana** if you also want to enable them for the cluster. If you have existing Azure Monitor workspace and Grafana workspace, then they're selected for you. 

    :::image type="content" source="media/prometheus-metrics-enable/configure-container-insights.png" lightbox="media/prometheus-metrics-enable/configure-container-insights.png" alt-text="Screenshot that shows the dialog box to configure Container insights with Prometheus and Grafana.":::

3. Click **Advanced settings** to select alternate workspaces or create new ones. The **Cost presets** setting allows you to modify the default collection details to reduce your monitoring costs. See [Enable cost optimization settings in Container insights](./container-insights-cost-config.md) for details.

    :::image type="content" source="media/aks-onboard/advanced-settings.png" lightbox="media/aks-onboard/advanced-settings.png" alt-text="Screenshot that shows the advanced settings dialog box.":::

4. Click **Configure** to save the configuration.

### From Container insights
From the Container insights menu, you can view all of your clusters, quickly identify which aren't monitored, and launch the same configuration experience as described in [From existing cluster](#from-existing-cluster).

1. Open the **Monitor** menu in the Azure portal and  select **Insights**. 
3. The **Unmonitored clusters** tab lists clusters that don't have Container insights enabled. Click **Enable** next to a cluster and follow the guidance in [Existing cluster](#existing-cluster).


## [CLI](#tab/azure-cli)

> [!NOTE]
> Managed identity authentication will be default in CLI version 2.49.0 or higher. If you need to use legacy/non-managed identity authentication, use CLI version < 2.49.0. For CLI version 2.54.0 or higher the logging schema will be configured to [ContainerLogV2](container-insights-logging-v2.md) via the ConfigMap

### Use a default Log Analytics workspace

Use the following command to enable monitoring of your AKS cluster by using a default Log Analytics workspace for the resource group. If a default workspace doesn't already exist in the cluster's region, one will be created with a name in the format *DefaultWorkspace-\<GUID>-\<Region>*.

```azurecli
az aks enable-addons -a monitoring -n <cluster-name> -g <cluster-resource-group-name>
```

The output will resemble the following example:

```output
provisioningState       : Succeeded
```

### Specify a Log Analytics workspace

Use the following command to enable monitoring of your AKS cluster on a specific Log Analytics workspace. The resource ID of the workspace will be in the form `"/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>"`.

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

1. Download the template and parameter file.
   - Template file: [https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file)
   - Parameter file: [https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file)

2. Edit the following values in the parameter file:

    | Parameter | Description |
    |:---|:---|
    | `aksResourceId` | Use the values on the **AKS Overview** page for the AKS cluster. |
    | `aksResourceLocation` | Use the values on the **AKS Overview** page for the AKS cluster. |
    | `workspaceResourceId` | Use the resource ID of your Log Analytics workspace. |
    | `resourceTagValues` | Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be *MSCI-\<clusterName\>-\<clusterRegion\>* and this resource created in an AKS clusters resource group. If this is the first time onboarding, you can set the arbitrary tag values. |

3. Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

## [Bicep](#tab/bicep)

### Existing cluster

1.	Download Bicep templates and parameter files depending on whether you want to enable Syslog collection.

    **Syslog**
    - Template file: [Template without Syslog](https://aka.ms/enable-monitoring-msi-bicep-template)
    - Parameter file: [Parameter without Syslog](https://aka.ms/enable-monitoring-msi-bicep-parameters)

    **No Syslog**
    - Template file: [Template with Syslog](https://aka.ms/enable-monitoring-msi-syslog-bicep-template)
    - Parameter file: [Parameter with Syslog](https://aka.ms/enable-monitoring-msi-syslog-bicep-parameters)

2.	Edit the following values in the parameter file:
 
    | Parameter | Description |
    |:---|:---|
    | `aksResourceId` | Use the values on the AKS Overview page for the AKS cluster. |
    | `aksResourceLocation` | Use the values on the AKS Overview page for the AKS cluster. |
    | `workspaceResourceId` | Use the resource ID of your Log Analytics workspace. |
    | `workspaceRegion` | Use the location of your Log Analytics workspace. |
    | `resourceTagValues` | Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values. |
    | `enabledContainerLogV2` | Set this parameter value to be true to use the default recommended ContainerLogV2 schema
    | Cost optimization parameters | Refer to [Data collection parameters](container-insights-cost-config.md#data-collection-parameters) |

3. Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).


### New cluster
Replace and use the managed cluster resources in [Deploy an Azure Kubernetes Service (AKS) cluster using Bicep](../../aks/learn/quick-kubernetes-deploy-bicep.md).



## [Terraform](#tab/terraform)

### New AKS cluster

1.	Download Terraform template file depending on whether you want to enable Syslog collection.

    **Syslog**
    - [https://aka.ms/enable-monitoring-msi-syslog-terraform](https://aka.ms/enable-monitoring-msi-syslog-terraform)

    **No Syslog** 
    - [https://aka.ms/enable-monitoring-msi-terraform](https://aka.ms/enable-monitoring-msi-terraform)

2.	Adjust the `azurerm_kubernetes_cluster` resource in *main.tf* based on what cluster settings you're going to have.
3.	Update parameters in *variables.tf* to replace values in "<>"

    | Parameter | Description |
    |:---|:---|
    | `aks_resource_group_name` | Use the values on the AKS Overview page for the resource group. |
    | `resource_group_location` | Use the values on the AKS Overview page for the resource group. |
    | `cluster_name` | Define the cluster name that you would like to create. |
    | `workspace_resource_id` | Use the resource ID of your Log Analytics workspace. |
    | `workspace_region` | Use the location of your Log Analytics workspace. |
    | `resource_tag_values` | Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will match `MSCI-<clusterName>-<clusterRegion>` and this resource is created in the same resource group as the AKS clusters. For first time onboarding, you can set the arbitrary tag values. |
    | `enabledContainerLogV2` | Set this parameter value to be true to use the default recommended ContainerLogV2. |
    | Cost optimization parameters | Refer to [Data collection parameters](container-insights-cost-config.md#data-collection-parameters) |


4.	Run `terraform init -upgrade` to initialize the Terraform deployment.
5.	Run `terraform plan -out main.tfplan` to initialize the Terraform deployment.
6.	Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.


### Existing AKS cluster
1.	Import the existing cluster resource first with the command: ` terraform import azurerm_kubernetes_cluster.k8s <aksResourceId>`
2.	Add the oms_agent add-on profile to the existing azurerm_kubernetes_cluster resource.
    ```
    oms_agent {
        log_analytics_workspace_id = var.workspace_resource_id
        msi_auth_for_monitoring_enabled = true
      }
    ```
3.	Copy the DCR and DCRA resources from the Terraform templates
4.	Run `terraform plan -out main.tfplan` and make sure the change is adding the oms_agent property. Note: If the `azurerm_kubernetes_cluster` resource defined is different during terraform plan, the existing cluster will get destroyed and recreated.
5.	Run `terraform apply main.tfplan` to apply the execution plan to your cloud infrastructure.

> [!TIP]
> - Edit the `main.tf` file appropriately before running the terraform template
> - Data will start flowing after 10 minutes since the cluster needs to be ready first
> - WorkspaceID needs to match the format `/subscriptions/12345678-1234-9876-4563-123456789012/resourceGroups/example-resource-group/providers/Microsoft.OperationalInsights/workspaces/workspaceValue`
> - If resource group already exists, run `terraform import azurerm_resource_group.rg /subscriptions/<Subscription_ID>/resourceGroups/<Resource_Group_Name>` before terraform plan

### [Azure Policy](#tab/policy)

1. Download Azure Policy template and parameter files depending on whether you want to enable Syslog collection.

   - Template file: [https://aka.ms/enable-monitoring-msi-azure-policy-template](https://aka.ms/enable-monitoring-msi-azure-policy-template)
   - Parameter file: [https://aka.ms/enable-monitoring-msi-azure-policy-parameters](https://aka.ms/enable-monitoring-msi-azure-policy-parameters)

2. Create the policy definition using the following command: 

    ```
    az policy definition create --name "AKS-Monitoring-Addon-MSI" --display-name "AKS-Monitoring-Addon-MSI" --mode Indexed --metadata version=1.0.0 category=Kubernetes --rules azure-policy.rules.json --params azure-policy.parameters.json
    ```

3. Create the policy assignment using the following CLI command or any [other available method](../../governance/policy/assign-policy-portal.md).

    ```
    az policy assignment create --name aks-monitoring-addon --policy "AKS-Monitoring-Addon-MSI" --assign-identity --identity-scope /subscriptions/<subscriptionId> --role Contributor --scope /subscriptions/<subscriptionId> --location <location> --role Contributor --scope /subscriptions/<subscriptionId> -p "{ \"workspaceResourceId\": { \"value\":  \"/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.operationalinsights/workspaces/<workspaceName>\" } }"
    ```

> [!TIP]
> - Make sure when performing remediation task, the policy assignment has access to workspace you specified.
> - Download all files under *AddonPolicyTemplate* folder before running the policy template.

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

The command will return JSON-formatted information about the solution. The `addonProfiles` section should include information on the `omsagent` as in the following example:

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



## Limitations

- Dependency on DCR/DCRA for region availability. For new AKS region, there might be chances that DCR is still not supported in the new region. In that case, onboarding Container Insights with MSI will fail. One workaround is to onboard to Container Insights through CLI with the old way (with the use of Container Insights solution)
- You must be on a machine on the same private network to access live logs from a private cluster.

## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
