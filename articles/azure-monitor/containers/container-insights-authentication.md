---
title: Configure agent authentication for the Container Insights agent
description: This article describes how to configure authentication for the containerized agent used by Container insights.
ms.topic: conceptual
ms.date: 07/31/2023
ms.reviewer: aul
---

# Legacy authentication for Container Insights 

Container Insights defaults to managed identity authentication, which has a monitoring agent that uses the [cluster's managed identity](../../aks/use-managed-identity.md) to send data to Azure Monitor. It replaced the legacy certificate-based local authentication and removed the requirement of adding a Monitoring Metrics Publisher role to the cluster.

This article describes how to migrate to managed identity authentication if you enabled Container insights using legacy authentication method and also how to enable legacy authentication if you have that requirement.

## Migrate to managed identity authentication

If you enabled Container insights before managed identity authentication was available, you can use the following methods to migrate your clusters.

## [Azure portal](#tab/portal-azure-monitor)

You can migrate to Managed Identity authentication from the *Monitor settings* panel for your AKS cluster. From the **Monitoring** section, there click on the **Insights** tab. In the Insights tab, click on the *Monitor Settings* option and check the box for *Use managed identity*

:::image type="content" source="./media/container-insights-authentication/monitor-settings.png" alt-text="Screenshot that shows the settings panel." lightbox="media/container-insights-authentication/monitor-settings.png":::

If you don't see the *Use managed identity* option, you are using an SPN cluster. In that case, you must use command line tools to migrate. See other tabs for migration instructions and templates.

## [Azure CLI](#tab/cli)

### AKS
AKS clusters must first disable monitoring and then upgrade to managed identity. Only Azure public cloud, Microsoft Azure operated by 21Vianet cloud, and Azure Government cloud are currently supported for this migration. For clusters with user-assigned identity, only Azure public cloud is supported.

> [!NOTE]
> Minimum Azure CLI version 2.49.0 or higher.

1. Get the configured Log Analytics workspace resource ID:

    ```cli
    az aks show -g <resource-group-name> -n <cluster-name> | grep -i "logAnalyticsWorkspaceResourceID"
    ```

2. Disable monitoring with the following command:

      ```cli
      az aks disable-addons -a monitoring -g <resource-group-name> -n <cluster-name> 
      ```

3. If the cluster is using a service principal, upgrade it to system managed identity with the following command:

      ```cli
      az aks update -g <resource-group-name> -n <cluster-name> --enable-managed-identity
      ```

4. Enable the monitoring add-on with the managed identity authentication option by using the Log Analytics workspace resource ID obtained in step 1:

      ```cli
      az aks enable-addons -a monitoring -g <resource-group-name> -n <cluster-name> --workspace-resource-id <workspace-resource-id>
      ```


### Arc-enabled Kubernetes

>[!NOTE]
> Managed identity authentication is not supported for Arc-enabled Kubernetes clusters with **ARO**.

First retrieve the Log Analytics workspace configured for Container insights extension.

```cli
az k8s-extension show --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters -n azuremonitor-containers 
```

Enable Container insights extension with managed identity authentication option using the workspace returned in the first step. 

```cli
az k8s-extension create --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true logAnalyticsWorkspaceResourceID=\<workspace-resource-id\> 
```

## [Resource Manager template](#tab/arm)

See instructions for migrating 

**Arc-enabled clusters**



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


### Private link Without managed identity authentication
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
1.	Ingestion Transformations are not supported: See [Data collection transformation](../essentials/data-collection-transformations.md) to read more.    
2.	Dependency on DCR/DCRA for region availability - For new AKS region, there might be chances that DCR is still not supported in the new region. In that case, onboarding Container Insights with MSI will fail. One workaround is to onboard to Container Insights through CLI with the old way (with the use of Container Insights solution)

## Timeline  
Any new clusters being created or being onboarded now default to Managed Identity authentication. However, existing clusters with legacy solution-based authentication are still supported.  

## Next steps
If you experience issues when you upgrade the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.
