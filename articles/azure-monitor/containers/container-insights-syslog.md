---
title: Syslog collection with Container Insights
description: This article describes how to collect Syslog from AKS nodes using Container insights.
ms.topic: conceptual
ms.date: 01/31/2023
ms.reviewer: damendo
---

# Syslog collection with Container Insights (preview)

Container Insights offers the ability to collect Syslog events from Linux nodes in your [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) clusters. This includes the ability to collect logs from control plane componemts like kubelet. Customers can also use Syslog for monitoring security and health events, typically by ingesting syslog into a SIEM system like [Microsoft Sentinel](https://azure.microsoft.com/products/microsoft-sentinel/#overview).  

> [!IMPORTANT]
> Syslog collection with Container Insights is a preview feature. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. Previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Prerequisites 

- You need to have managed identity authentication enabled on your cluster. To enable, see [migrate your AKS cluster to managed identity authentication](container-insights-enable-existing-clusters.md?tabs=azure-cli#migrate-to-managed-identity-authentication). Note: Enabling Managed Identity will create a new Data Collection Rule (DCR) named `MSCI-<WorkspaceRegion>-<ClusterName>` 
- Minimum versions of Azure components
  - **Azure CLI**: Minimum version required for Azure CLI is [2.45.0 (link to release notes)](/cli/azure/release-notes-azure-cli#february-07-2023). See [How to update the Azure CLI](/cli/azure/update-azure-cli) for upgrade instructions. 
  - **Azure CLI AKS-Preview Extension**: Minimum version required for AKS-Preview Azure CLI extension is [ 0.5.125 (link to release notes)](https://github.com/Azure/azure-cli-extensions/blob/main/src/aks-preview/HISTORY.rst#05125). See [How to update extensions](/cli/azure/azure-cli-extensions-overview#how-to-update-extensions) for upgrade guidance. 
  - **Linux image version**: Minimum version for AKS node linux image is 2022.11.01. See [Upgrade Azure Kubernetes Service (AKS) node images](https://learn.microsoft.com/azure/aks/node-image-upgrade) for upgrade help. 

## How to enable Syslog

### From the Azure portal

Navigate to your cluster. Open the _Insights_ tab for your cluster. Open the _Monitor Settings_ panel. Click on Edit collection settings, then check the box for _Enable Syslog collection_

:::image type="content" source="media/container-insights-syslog/syslog-enable.gif" lightbox="media/container-insights-syslog/syslog-enable.gif" alt-text="Screen recording of syslog being enabled from the Azure portal through the Monitor Settings panel in Container Insights." border="true":::

### Using Azure CLI commands

Use the following command in Azure CLI to enable syslog collection when you create a new AKS cluster.

```azurecli
az aks create -g syslog-rg -n new-cluster --enable-managed-identity --node-count 1 --enable-addons monitoring --enable-msi-auth-for-monitoring --enable-syslog --generate-ssh-key
```
  
Use the following command in Azure CLI to enable syslog collection on an existing AKS cluster.

```azurecli
az aks enable-addons -a monitoring --enable-msi-auth-for-monitoring --enable-syslog -g syslog-rg -n existing-cluster
```

### Using ARM templates

You can also use ARM templates for enabling syslog collection

1. Download the template in the [GitHub content file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file) and save it as **existingClusterOnboarding.json**.

1. Download the parameter file in the [GitHub content file](https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file) and save it as **existingClusterParam.json**.

1. Edit the values in the parameter file:

   - `aksResourceId`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `aksResourceLocation`: Use the values on the **AKS Overview** page for the AKS cluster.
   - `workspaceResourceId`: Use the resource ID of your Log Analytics workspace.
   - `resourceTagValues`: Match the existing tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be *MSCI-\<clusterName\>-\<clusterRegion\>* and this resource created in an AKS clusters resource group. If this is the first time onboarding, you can set the arbitrary tag values.
   - `enableSyslog`: Set to true
   - `syslogLevels`: Array of syslog levels to collect. Default collects all levels.
   - `syslogFacilities`: Array of syslog facilities to collect. Default collects all facilities

> [!NOTE]
> Syslog level and facilities customization is currently only available via ARM templates.

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

## How to access Syslog data

### Access using built-in workbooks

To get a quick snapshot of your syslog data, customers can use our built-in Syslog workbook. There are two ways to access the built-in workbook.

Option 1 - The Reports tab in Container Insights. 
Navigate to your cluster. Open the _Insights_ tab for your cluster. Open the _Reports_ tab and look for the _Syslog_ workbook. 

:::image type="content" source="media/container-insights-syslog/syslog-workbook-cluster.gif" lightbox="media/container-insights-syslog/syslog-workbook-cluster.gif" alt-text="Video of Syslog workbook being accessed from Container Insights Reports tab." border="true":::

Option 2 - The Workbooks tab in AKS
Navigate to your cluster. Open the _Workbooks_ tab for your cluster and look for the _Syslog_ workbook. 

:::image type="content" source="media/container-insights-syslog/syslog-workbook-container-insights-reports-tab.gif" lightbox="media/container-insights-syslog/syslog-workbook-container-insights-reports-tab.gif" alt-text="Video of Syslog workbook being accessed from cluster workbooks tab." border="true":::

### Access using log queries

Syslog data is stored in the [Syslog](/azure/azure-monitor/reference/tables/syslog) table in your Log Analytics workspace. You can create your own [log queries](../logs/log-query-overview.md) in [Log Analytics](../logs/log-analytics-overview.md) to analyze this data or use any of the [prebuilt queries](../logs/log-query-overview.md).

:::image type="content" source="media/container-insights-syslog/azmon-3.png" lightbox="media/container-insights-syslog/azmon-3.png" alt-text="Screenshot of Syslog query loaded in the query editor in the Azure Monitor Portal UI." border="false":::    

You can open Log Analytics from the **Logs** menu in the **Monitor** menu to access Syslog data for all clusters or from the AKs cluster's menu to access Syslog data for only that cluster.
 
:::image type="content" source="media/container-insights-syslog/aks-4.png" lightbox="media/container-insights-syslog/aks-4.png" alt-text="Screenshot of Query editor with Syslog query." border="false":::
  
#### Sample queries
  
The following table provides different examples of log queries that retrieve Syslog records.

| Query | Description |
|:--- |:--- |
| `Syslog` |All Syslogs |
| `Syslog | where SeverityLevel == "error"` | All Syslog records with severity of error |
| `Syslog | summarize AggregatedValue = count() by Computer` | Count of Syslog records by computer |
| `Syslog | summarize AggregatedValue = count() by Facility` | Count of Syslog records by facility |  
| `Syslog | where ProcessName == "kubelet"` | All Syslog records from the kubelet process |
| `Syslog | where ProcessName == "kubelet" and  SeverityLevel == "error"` | Syslog records from kubelet process with errors |

## Editing your Syslog collection settings

To modify the configuration for your Syslog collection, you modify the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that was created when you enabled it. 

Select **Data Collection Rules** from the **Monitor** menu in the Azure portal. 

:::image type="content" source="media/container-insights-syslog/dcr-1.png" lightbox="media/container-insights-syslog/dcr-1.png" alt-text="Screenshot of Data Collection Rules tab in the Azure Monitor portal UI." border="false":::

Select your DCR and then **View data sources**. Select the **Linux Syslog** data source to view the Syslog collection details.
>[!NOTE]
> A DCR is created automatically when you enable syslog. The DCR follows the naming convention `MSCI-<WorkspaceRegion>-<ClusterName>`.

:::image type="content" source="media/container-insights-syslog/dcr-3.png" lightbox="media/container-insights-syslog/dcr-3.png" alt-text="Screenshot of Data Sources tab for Syslog data collection rule." border="false":::

Select the minimum log level for each facility that you want to collect.

:::image type="content" source="media/container-insights-syslog/dcr-4.png" lightbox="media/container-insights-syslog/dcr-4.png" alt-text="Screenshot of Configuration panel for Syslog data collection rule." border="false":::


## Known limitations
- **Container restart data loss**. Agent Container restarts can lead to syslog data loss during public preview. 

## Next steps

Once setup customers can start sending Syslog data to the tools of their choice
- Send Syslog to Microsoft Sentinel: https://learn.microsoft.com/azure/sentinel/connect-syslog  
- Export data from Log Analytics: https://learn.microsoft.com/azure/azure-monitor/logs/logs-data-export?tabs=portal 

Read more  
- [Syslog record properties](/azure/azure-monitor/reference/tables/syslog)

Share your feedback for the preview here: https://forms.office.com/r/BBvCjjDLTS 
