---
title: Configure agent authentication for the Container Insights agent
description: This article describes how to configure authentication for the containerized agent used by Container insights.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 10/18/2023
ms.reviewer: aul
---

# Legacy authentication for Container Insights 

Container Insights defaults to managed identity authentication, which has a monitoring agent that uses the [cluster's managed identity](../../aks/use-managed-identity.md) to send data to Azure Monitor. It replaced the legacy certificate-based local authentication and removed the requirement of adding a Monitoring Metrics Publisher role to the cluster.

This article describes how to migrate to managed identity authentication if you enabled Container insights using legacy authentication method and also how to enable legacy authentication if you have that requirement.

## Migrate to managed identity authentication

If you enabled Container insights before managed identity authentication was available, you can use the following methods to migrate your clusters.

## [Azure portal](#tab/portal-azure-monitor)

You can migrate to Managed Identity authentication from the *Monitor settings* panel for your AKS cluster. From the **Monitoring** section, click on the **Insights** tab. In the Insights tab, click on the *Monitor Settings* option and check the box for *Use managed identity*

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

1. Retrieve the Log Analytics workspace configured for Container insights extension.

    ```cli
    az k8s-extension show --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters -n azuremonitor-containers 
    ```

2. Enable Container insights extension with managed identity authentication option using the workspace returned in the first step. 

    ```cli
    az k8s-extension create --name azuremonitor-containers --cluster-name \<cluster-name\> --resource-group \<resource-group\> --cluster-type connectedClusters --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true logAnalyticsWorkspaceResourceID=\<workspace-resource-id\> 
    ```

---


## Timeline  
Any new clusters being created or being onboarded now default to Managed Identity authentication. However, existing clusters with legacy solution-based authentication are still supported.  

## Next steps
If you experience issues when you upgrade the agent, review the [troubleshooting guide](container-insights-troubleshoot.md) for support.
