---
title: Monitor an Azure Kubernetes Service (AKS) cluster deployed
description: Learn how to enable monitoring of an Azure Kubernetes Service (AKS) cluster with Container insights already deployed in your subscription.
ms.topic: conceptual
ms.date: 09/28/2022
ms.custom: devx-track-terraform, devx-track-azurepowershell, devx-track-azurecli, ignite-2022
ms.reviewer: aul
---

# Enable Container insights for Azure Kubernetes Service (AKS) cluster
This article describes how to set up Container insights to monitor managed Kubernetes cluster hosted on an [Azure Kubernetes Service](../../aks/index.yml) cluster.

## Prerequisites

If you're connecting an existing AKS cluster to a Log Analytics workspace in another subscription, the Microsoft.ContainerService resource provider must be registered in the subscription with the Log Analytics workspace. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## New AKS cluster
You can enable monitoring for an AKS cluster as when it's created using any of the following methods:

- Azure CLI. Follow the steps in [Create AKS cluster](../../aks/learn/quick-kubernetes-deploy-cli.md). 
- Azure Policy. Follow the steps in [Enable AKS monitoring addon using Azure Policy](container-insights-enable-aks-policy.md).
- Terraform. If you are [deploying a new AKS cluster using Terraform](/azure/developer/terraform/create-k8s-cluster-with-tf-and-aks), you specify the arguments required in the profile [to create a Log Analytics workspace](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_workspace) if you do not choose to specify an existing one. To add Container insights to the workspace, see [azurerm_log_analytics_solution](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_solution) and complete the profile by including the [**addon_profile**](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster) and specify **oms_agent**. 

## Existing AKS cluster
Use any of the following methods to enable monitoring for an existing AKS cluster.

## [CLI](#tab/azure-cli)

> [!NOTE]
> Azure CLI version 2.39.0 or higher required for managed identity authentication.

### Use a default Log Analytics workspace

Use the following command to enable monitoring of your AKS cluster using a default Log Analytics workspace for the resource group. If a default workspace doesn't already exist in the cluster's region, then one will be created with a name in the format *DefaultWorkspace-\<GUID>-\<Region>*.

```azurecli
az aks enable-addons -a monitoring -n <cluster-name> -g <cluster-resource-group-name>
```

The output will resemble the following:

```output
provisioningState       : Succeeded
```

### Specify a Log Analytics workspace

Use the following command to enable monitoring of your AKS cluster on a specific Log Analytics workspace. The resource ID of the workspace will be in the form `"/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>"`.

```azurecli
az aks enable-addons -a monitoring -n <cluster-name> -g <cluster-resource-group-name> --workspace-resource-id <workspace-resource-id>
```

The output will resemble the following:

```output
provisioningState       : Succeeded
```

## [Terraform](#tab/terraform)
Use the following steps to enable monitoring using Terraform:

1. Add the **oms_agent** add-on profile to the existing [azurerm_kubernetes_cluster resource](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/kubernetes_cluster)

   ```
   addon_profile {
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = "${azurerm_log_analytics_workspace.test.id}"
     }
   }
   ```

2. Add the [azurerm_log_analytics_solution](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/log_analytics_solution) following the steps in the Terraform documentation.
3. Enable collection of custom metrics using the guidance at [Enable custom metrics](container-insights-custom-metrics.md)

## [Azure portal](#tab/portal-azure-monitor)

> [!NOTE]
> You can initiate this same process from the **Insights** option in the AKS menu for your cluster in the Azure portal.

To enable monitoring of your AKS cluster in the Azure portal from Azure Monitor, do the following:

1. In the Azure portal, select **Monitor**.
2. Select **Containers** from the list.
3. On the **Monitor - containers** page, select **Unmonitored clusters**.
4. From the list of unmonitored clusters, find the cluster in the list and click **Enable**.
5. On the **Configure Container insights** page, click **Configure** 

  :::image type="content" source="media/container-insights-enable-aks/container-insights-configure.png" lightbox="media/container-insights-enable-aks/container-insights-configure.png" alt-text="Screenshot of configuration screen for AKS cluster.":::

6. On the **Configure Container insights**, fill in the following information:

  | Option | Description |
  |:---|:---|
  | Log Analytics workspace | Select a [Log Analytics workspace](../logs/log-analytics-workspace-overview.md) from the drop-down list or click **Create new** to create a default Log Analytics workspace. The Log Analytics workspace must be in the same subscription as the AKS container. |
  | Enable Prometheus metrics | Select this option to collect Prometheus metrics for the cluster in [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md). |
  | Azure Monitor workspace | If you select **Enable Prometheus metrics**, then you must select an [Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md).  The Azure Monitor workspace must be in the same subscription as the AKS container and the Log Analytics workspace. |
  | Grafana workspace | To use the collected Prometheus metrics with dashboards in [Azure Managed Grafana](../../managed-grafana/overview.md), select a Grafana workspace. The Grafana workspace will be [linked](../essentials/azure-monitor-workspace-overview.md#link-a-grafana-workspace) to the Azure Monitor workspace if it isn't already. |

7. Select **Use managed identity** if you want to use [managed identity authentication with the Azure Monitor agent](container-insights-onboard.md#authentication). 

After you've enabled monitoring, it might take about 15 minutes before you can view health metrics for the cluster.

## [Resource Manager template](#tab/arm)

>[!NOTE]
>The template needs to be deployed in the same resource group as the cluster.


### Create or download templates
You will either download template and parameter files or create your own depending on what authentication mode you're using.

**To enable [managed identity authentication (preview)](container-insights-onboard.md#authentication)**

1. Download the template at [https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file) and save it as **existingClusterOnboarding.json**.

2. Download the parameter file at [https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file) and save it as **existingClusterParam.json**.

3. Edit the values in the parameter file.

  - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
  - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
  - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
  - `resourceTagValues`:  Match the existing tag values specified for the existing Container insights extension DCR of the cluster and the name of the data collection rule, which will be MSCI-\<clusterName\>-\<clusterRegion\> and this resource created in AKS clusters Resource Group. If this is first-time onboarding, you can set the arbitrary tag values.


**To enable [managed identity authentication (preview)](container-insights-onboard.md#authentication)**

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

2. Save the following JSON as **existingClusterParam.json**.

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

2. Download the parameter file at [https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file) and save as **existingClusterParam.json**.

3. Edit the values in the parameter file.

  - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
  - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
  - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
  - `resourceTagValues`: Use the existing tag values specified for the AKS cluster.

### Deploy template

Deploy the template with the parameter file using any valid method for deploying Resource Manager templates. See [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates) for examples of different methods.



#### To deploy with Azure PowerShell:

```powershell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile .\existingClusterOnboarding.json -TemplateParameterFile .\existingClusterParam.json
```

The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

```output
provisioningState       : Succeeded
```

#### To deploy with Azure CLI, run the following commands:

```azurecli
az login
az account set --subscription "Subscription Name"
az deployment group create --resource-group <ResourceGroupName> --template-file ./existingClusterOnboarding.json --parameters @./existingClusterParam.json
```

The configuration change can take a few minutes to complete. When it's completed, a message is displayed that's similar to the following and includes the result:

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

The output should resemble the following, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get ds ama-logs --namespace=kube-system
NAME       DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                 AGE
ama-logs   2         2         2         2            2           beta.kubernetes.io/os=linux   1d
```

If there are Windows Server nodes on the cluster then you can run the following command to verify that the agent is deployed successfully.

```
kubectl get ds ama-logs-windows --namespace=kube-system
```

The output should resemble the following, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get ds ama-logs-windows --namespace=kube-system
NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR                   AGE
ama-logs-windows           2         2         2         2            2           beta.kubernetes.io/os=windows   1d
```

To verify deployment of the solution, run the following command:

```
kubectl get deployment ama-logs-rs -n=kube-system
```

The output should resemble the following, which indicates that it was deployed properly:

```output
User@aksuser:~$ kubectl get deployment ama-logs-rs -n=kube-system
NAME       DESIRED   CURRENT   UP-TO-DATE   AVAILABLE    AGE
ama-logs-rs   1         1         1            1            3h
```

## View configuration with CLI

Use the `aks show` command to get details such as is the solution enabled or not, what is the Log Analytics workspace resourceID, and summary details about the cluster.

```azurecli
az aks show -g <resourceGroupofAKSCluster> -n <nameofAksCluster>
```

After a few minutes, the command completes and returns JSON-formatted information about solution.  The results of the command should show the monitoring add-on profile and resembles the following example output:

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

### Existing clusters with service principal 
AKS Clusters with service principal must first disable monitoring and then upgrade to managed identity. Only Azure public cloud, Azure China cloud, and Azure Government cloud are currently supported for this migration.

1.	Get the configured Log Analytics workspace resource ID:

```cli
az aks show -g <resource-group-name> -n <cluster-name> | grep -i "logAnalyticsWorkspaceResourceID"
```

2.	Disable monitoring with the following command:

  ```cli
  az aks disable-addons -a monitoring -g <resource-group-name> -n <cluster-name> 
  ```

3.	Upgrade cluster to system managed identity with the following command:

  ```cli
  az aks update -g <resource-group-name> -n <cluster-name> --enable-managed-identity
  ```

4.	Enable Monitoring addon with managed identity authentication option using Log Analytics workspace resource ID obtained in the first step:

  ```cli
  az aks enable-addons -a monitoring --enable-msi-auth-for-monitoring -g <resource-group-name> -n <cluster-name> --workspace-resource-id <workspace-resource-id>
  ```

### Existing clusters with system or user assigned identity
AKS Clusters with system assigned identity must first disable monitoring and then upgrade to managed identity. Only Azure public cloud, Azure China cloud, and Azure Government cloud are currently supported for clusters with system identity. For clusters with user assigned identity, only Azure Public cloud is supported.

1.	Get the configured Log Analytics workspace resource ID: 

  ```cli
  az aks show -g <resource-group-name> -n <cluster-name> | grep -i "logAnalyticsWorkspaceResourceID"
  ```

2.	Disable monitoring with the following command:

  ```cli
  az aks disable-addons -a monitoring -g <resource-group-name> -n <cluster-name>
  ```

3.	Enable Monitoring addon with managed identity authentication option using Log Analytics workspace resource ID obtained in the first step:

  ```cli
  az aks enable-addons -a monitoring --enable-msi-auth-for-monitoring -g <resource-group-name> -n <cluster-name> --workspace-resource-id <workspace-resource-id>
  ```

## Private link
To enable network isolation by connecting your cluster to the Log Analytics workspace using [private link](../logs/private-link-security.md), your cluster must be using managed identity authentication with the Azure Monitor agent. 

1. Follow the steps in [Enable network isolation for the Azure Monitor agent](../agents/azure-monitor-agent-data-collection-endpoint.md) to create a data collection endpoint and add it to your AMPLS.
2. Create an association between the cluster and the data collection endpoint using the following API call. See [Data Collection Rule Associations - Create](/rest/api/monitor/data-collection-rule-associations/create) for details on this call. The DCR association name must be **configurationAccessEndpoint**, `resourceUri` is the resource ID of the AKS cluster.

    ```rest
    PUT https://management.azure.com/{cluster-resource-id}/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01
    {
    "properties": {
        "dataCollectionEndpointId": "{data-collection-endpoint-resource-id}"
        }
    }
    ```

    Following is an example of this API call.

    ```rest
    PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerService/managedClusters/my-aks-cluster/providers/Microsoft.Insights/dataCollectionRuleAssociations/configurationAccessEndpoint?api-version=2021-04-01

    {
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Insights/dataCollectionEndpoints/myDataCollectionEndpoint"
        }
    }
    ```

3. Enable monitoring with managed identity authentication option using the steps in [Migrate to managed identity authentication](#migrate-to-managed-identity-authentication).

## Limitations

- Enabling managed identity authentication (preview) is not currently supported using Terraform or Azure Policy.
- When you enable managed identity authentication (preview), a data collection rule is created with the name *MSCI-\<cluster-name\>-\<cluster-region\>*. This name cannot currently be modified.

## Next steps

* If you experience issues while attempting to onboard the solution, review the [troubleshooting guide](container-insights-troubleshoot.md)

* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
