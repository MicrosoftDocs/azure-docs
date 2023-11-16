---
title: Enable Container insights for Azure Kubernetes Service (AKS) cluster
description: Learn how to enable Container insights on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 11/14/2023
ms.custom: ignite-2022, devx-track-azurecli
ms.reviewer: aul
---

# Enable Container insights for Azure Kubernetes Service (AKS) cluster

This article describes how to set up Container insights to monitor a managed Kubernetes cluster hosted on an [Azure Kubernetes Service (AKS)](../../aks/index.yml) cluster.

## Prerequisites

If you're connecting an existing AKS cluster to a Log Analytics workspace in another subscription, the *Microsoft.ContainerService* resource provider must be registered in the subscription with the Log Analytics workspace. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

> [!NOTE]
> When you enable Container Insights on legacy auth clusters, a managed identity is automatically created. This identity will not be available in case the cluster migrates to MSI Auth or if the Container Insights is disabled and hence this managed identity should not be used for anything else.

## New AKS cluster

You can enable monitoring for an AKS cluster when it's created by using any of the following methods:

- **Azure CLI**: Follow the steps in [Create AKS cluster](../../aks/learn/quick-kubernetes-deploy-cli.md).
- **Azure Policy**: Follow the steps in [Enable AKS monitoring add-on by using Azure Policy](container-insights-enable-aks-policy.md).
- **Terraform**: If you're [deploying a new AKS cluster by using Terraform](/azure/developer/terraform/create-k8s-cluster-with-tf-and-aks), specify the arguments required in the profile [to create a Log Analytics workspace](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_workspace) if you don't choose to specify an existing one. To add Container insights to the workspace, see [azurerm_log_analytics_solution](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_solution). Complete the profile by including **oms_agent** profile.

## Existing AKS cluster

Use any of the following methods to enable monitoring for an existing AKS cluster.

## [CLI](#tab/azure-cli)

> [!NOTE]
> Managed identity authentication will be default in CLI version 2.49.0 or higher. If you need to use legacy/non-managed identity authentication, use CLI version < 2.49.0. For CLI version 2.54.0 or higher the logging schema will be configured to [ContainerLogV2](./container-insights-logging-v2.md) via the ConfigMap

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

The output will resemble the following example:

```output
provisioningState       : Succeeded
```

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

## [Azure portal](#tab/portal-azure-monitor)

> [!NOTE]
> You can initiate this same process from the **Insights** option in the AKS menu for your cluster in the Azure portal.

To enable monitoring of your AKS cluster in the Azure portal from Azure Monitor:

1. In the Azure portal, select **Monitor**.
1. Select **Containers** from the list.
1. On the **Monitor - containers** page, select **Unmonitored clusters**.
1. From the list of unmonitored clusters, find the cluster in the list and select **Enable**.
1. On the **Configure Container insights** page, select **Configure**.

   :::image type="content" source="media/container-insights-enable-aks/container-insights-configure.png" lightbox="media/container-insights-enable-aks/container-insights-configure.png" alt-text="Screenshot that shows the configuration screen for an AKS cluster.":::

1. On the **Configure Container insights** page, fill in the following information:

      | Option | Description |
      |:---|:---|
      | Log Analytics workspace | Select a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) from the dropdown list or select **Create new** to create a default Log Analytics workspace. The Log Analytics workspace must be in the same subscription as the AKS container. |
      | Enable Prometheus metrics | Select this option to collect Prometheus metrics for the cluster in [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). |
      | Azure Monitor workspace | If you select **Enable Prometheus metrics**, you must select an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md). The Azure Monitor workspace must be in the same subscription as the AKS container and the Log Analytics workspace. |
      | Grafana workspace | To use the collected Prometheus metrics with dashboards in [Azure-managed Grafana](../../managed-grafana/overview.md), select a Grafana workspace. The Grafana workspace will be [linked](../essentials/prometheus-metrics-enable.md#enable-prometheus-metric-collection) to the Azure Monitor workspace if it isn't already. |
    
1. Select **Use managed identity** if you want to use [managed identity authentication with Azure Monitor Agent](container-insights-onboard.md#authentication).

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

## [Resource Manager template](#tab/arm)

>[!NOTE]
>The template must be deployed in the same resource group as the cluster.

### Create or download templates

You'll either download template and parameter files or create your own depending on the authentication mode you're using.

To enable [managed identity authentication](container-insights-onboard.md#authentication):

1. Download the template in the [GitHub content file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file) and save it as **existingClusterOnboarding.json**.

1. Download the parameter file in the [GitHub content file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file) and save it as **existingClusterParam.json**.

1. Edit the values in the parameter file:

   - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
   - `resourceTagValues`: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be *MSCI-\<clusterRegion\>-\<clusterName\>* and this resource created in an AKS clusters resource group. If this is the first time onboarding, you can set the arbitrary tag values.

To enable [managed identity authentication](container-insights-onboard.md#authentication):

1. Save the following JSON as **existingClusterOnboarding.json**.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "aksResourceId": {
          "type": "string",
          "metadata": {
            "description": "AKS Cluster Resource ID"
          }
        },
        "aksResourceLocation": {
          "type": "string",
          "metadata": {
            "description": "Location of the AKS resource e.g. \"East US\""
          }
        },
        "aksResourceTagValues": {
          "type": "object",
          "metadata": {
            "description": "Existing all tags on AKS Cluster Resource"
          }
        },
        "workspaceResourceId": {
          "type": "string",
          "metadata": {
            "description": "Azure Monitor Log Analytics Resource ID"
          }
        }
      },
      "resources": [
        {
          "name": "[split(parameters('aksResourceId'),'/')[8]]",
          "type": "Microsoft.ContainerService/managedClusters",
          "location": "[parameters('aksResourceLocation')]",
          "tags": "[parameters('aksResourceTagValues')]",
          "apiVersion": "2018-03-31",
          "properties": {
            "mode": "Incremental",
            "id": "[parameters('aksResourceId')]",
            "addonProfiles": {
              "omsagent": {
                "enabled": true,
                "config": {
                  "logAnalyticsWorkspaceResourceID": "[parameters('workspaceResourceId')]"
                }
              }
            }
          }
        }
      ]
    }
    ```

1. Save the following JSON as **existingClusterParam.json**.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "aksResourceId": {
          "value": "/subscriptions/<SubscriptionId>/resourcegroups/<ResourceGroup>/providers/Microsoft.ContainerService/managedClusters/<ResourceName>"
        },
        "aksResourceLocation": {
          "value": "<aksClusterLocation>"
        },
        "workspaceResourceId": {
          "value": "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>"
        },
        "aksResourceTagValues": {
          "value": {
            "<existing-tag-name1>": "<existing-tag-value1>",
            "<existing-tag-name2>": "<existing-tag-value2>",
            "<existing-tag-nameN>": "<existing-tag-valueN>"
          }
        }
      }
    }
    ```

1. Download the parameter file in the [GitHub content file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file) and save as **existingClusterParam.json**.

1. Edit the values in the parameter file:

   - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
   - `resourceTagValues`: Use the existing tag values specified for the AKS cluster.

### Deploy the template

Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

#### Deploy with Azure PowerShell

```powershell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile .\existingClusterOnboarding.json -TemplateParameterFile .\existingClusterParam.json
```

The configuration change can take a few minutes to complete. When it's finished, a message similar to the following example includes this result:

```output
provisioningState       : Succeeded
```

#### Deploy with Azure CLI

```azurecli
az login
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ResourceGroupName> --template-file ./existingClusterOnboarding.json --parameters @./existingClusterParam.json
```

The configuration change can take a few minutes to complete. When it's finished, a message similar to the following example includes this result:

```output
provisioningState       : Succeeded
```

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

---

## Verify agent and solution deployment

Run the following command to verify that the agent is deployed successfully.

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

## Migrate to managed identity authentication

This section explains two methods for migrating to managed identity authentication.

### Existing clusters with a service principal

AKS clusters with a service principal must first disable monitoring and then upgrade to managed identity. Only Azure public cloud, Microsoft Azure operated by 21Vianet cloud, and Azure Government cloud are currently supported for this migration.

> [!NOTE]
> Minimum Azure CLI version 2.49.0 or higher.

1. Get the configured Log Analytics workspace resource ID:

    ```cli
    az aks show -g <resource-group-name> -n <cluster-name> | grep -i "logAnalyticsWorkspaceResourceID"
    ```

1. Disable monitoring with the following command:

      ```cli
      az aks disable-addons -a monitoring -g <resource-group-name> -n <cluster-name> 
      ```

1. Upgrade cluster to system managed identity with the following command:

      ```cli
      az aks update -g <resource-group-name> -n <cluster-name> --enable-managed-identity
      ```

1. Enable the monitoring add-on with the managed identity authentication option by using the Log Analytics workspace resource ID obtained in step 1:

      ```cli
      az aks enable-addons -a monitoring -g <resource-group-name> -n <cluster-name> --workspace-resource-id <workspace-resource-id>
      ```

### Existing clusters with system or user-assigned identity

AKS clusters with system-assigned identity must first disable monitoring and then upgrade to managed identity. Only Azure public cloud, Azure operated by 21Vianet cloud, and Azure Government cloud are currently supported for clusters with system identity. For clusters with user-assigned identity, only Azure public cloud is supported.

> [!NOTE]
> Minimum Azure CLI version 2.49.0 or higher.

1. Get the configured Log Analytics workspace resource ID:

      ```cli
      az aks show -g <resource-group-name> -n <cluster-name> | grep -i "logAnalyticsWorkspaceResourceID"
      ```

1. Disable monitoring with the following command:

      ```cli
      az aks disable-addons -a monitoring -g <resource-group-name> -n <cluster-name>
      ```

1. Enable the monitoring add-on with the managed identity authentication option by using the Log Analytics workspace resource ID obtained in step 1:

      ```cli
      az aks enable-addons -a monitoring -g <resource-group-name> -n <cluster-name> --workspace-resource-id <workspace-resource-id>
      ```

## Private link
Use one of the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace by using [Azure Private Link](../logs/private-link-security.md).

### Managed identity authentication
Use the following procedure if your cluster is using managed identity authentication with Azure Monitor Agent.

1. Follow the steps in [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md) to create a data collection endpoint and add it to your Azure Monitor private link service.

1. Create an association between the cluster and the data collection endpoint by using the following API call. For information on this call, see [Data collection rule associations - Create](/rest/api/monitor/data-collection-rule-associations/create). The DCR association name must be **configurationAccessEndpoint**, and `resourceUri` is the resource ID of the AKS cluster.

    ```rest
    PUT https://management.azure.com/{cluster-resource-id}/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01
    {
    "properties": {
        "dataCollectionEndpointId": "{data-collection-endpoint-resource-id}"
        }
    }
    ```

    The following snippet is an example of this API call:

    ```rest
    PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/my-aks-cluster/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01

    {
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionEndpoints/myDataCollectionEndpoint"
        }
    }
    ```

1. Enable monitoring with the managed identity authentication option by using the steps in [Migrate to managed identity authentication](#migrate-to-managed-identity-authentication).

### Without managed identity authentication
Use the following procedure if you're not using managed identity authentication. This requires a [private AKS cluster](../../aks/private-clusters.md).

1. Create a private AKS cluster following the guidance in [Create a private Azure Kubernetes Service cluster](../../aks/private-clusters.md).

2. Disable public Ingestion on your Log Analytics workspace. 

    Use the following command to disable public ingestion on an existing workspace.

    ```cli
    az monitor log-analytics workspace update --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

    Use the following command to create a new workspace with public ingestion disabled.

    ```cli
    az monitor log-analytics workspace create --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

3. Configure private link by following the instructions at [Configure your private link](../logs/private-link-configure.md). Set ingestion access to public and then set to private after the private endpoint is created but before monitoring is enabled. The private link resource region must be same as AKS cluster region. 

4. Enable monitoring for the AKS cluster.

    ```cli
    az aks enable-addons -a monitoring --resource-group <AKSClusterResourceGorup> --name <AKSClusterName> --workspace-resource-id <workspace-resource-id>
    ```


## Limitations

- When you enable managed identity authentication, a data collection rule is created with the name *MSCI-\<cluster-region\>-<\cluster-name\>*. Currently, this name can't be modified.

- You must be on a machine on the same private network to access live logs from a private cluster.

## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.


