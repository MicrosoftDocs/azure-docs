---
title: Tools for migrating to Azure Monitor Agent from legacy agents 
description: This article describes various migration tools and helpers available for migrating from existing legacy agents to the new Azure Monitor agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
ms.date: 12/12/2023 
ms.custom:
# Customer intent: As an Azure account administrator, I want to use the available Azure Monitor tools to migrate from Log Analytics Agent to Azure Monitor Agent and track the status of the migration in my account.
---

# Tools for migrating from Log Analytics Agent to Azure Monitor Agent 

[Azure Monitor Agent (AMA)](./agents-overview.md) replaces the Log Analytics agent (also known as MMA and OMS) for Windows and Linux machines, in Azure and non-Azure environments, including on-premises and third-party clouds. The [benefits of migrating to Azure Monitor Agent](../agents/azure-monitor-agent-migration.md) include enhanced security, cost-effectiveness, performance, manageability and reliability. This article explains how to use the AMA Migration Helper and DCR Config Generator tools to help automate and track the migration from Log Analytics Agent to Azure Monitor Agent.

:::image type="content" source="media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png" lightbox="media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png" alt-text="Flow diagram that shows the steps involved in agent migration and how the migration tools help in generating DCRs and tracking the entire migration process.":::  

> [!IMPORTANT]
> Do not remove legacy agents being used by other [Azure solutions or services](./azure-monitor-agent-migration.md#migrate-additional-services-and-features). Use the migration helper to discover which solutions and services you use today.

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

## Using AMA Migration Helper 

AMA Migration Helper is a workbook-based Azure Monitor solution that helps you **discover what to migrate** and **track progress** as you move from Log Analytics Agent to Azure Monitor Agent. Use this single pane of glass view to expedite and track the status of your agent migration journey. 
The helper now supports multiple subscriptions, and includes **automatic migration recommendations** based on your usage.

You can access the workbook **[here](https://portal.azure.com/#view/AppInsightsExtension/UsageNotebookBlade/ComponentId/Azure%20Monitor/ConfigurationId/community-Workbooks%2FAzure%20Monitor%20-%20Agents%2FAgent%20Migration%20Tracker/Type/workbook/WorkbookTemplateName/AMA%20Migration%20Helper)**, or find it on the Azure portal under **Monitor** > **Workbooks** > **Public Templates** > **Azure Monitor essentials** > **AMA Migration Helper**.

:::image type="content" source="media/azure-monitor-migration-tools/ama-migration-helper.png" lightbox="media/azure-monitor-migration-tools/ama-migration-helper.png" alt-text="Screenshot of the Azure Monitor Agent Migration Helper workbook. The screenshot highlights the Subscription and Workspace dropdowns and shows the Azure Virtual Machines tab, on which you can track which agent is deployed on each virtual machine.":::

**Automatic Migration Recommendations**
<!-- convertborder later -->
:::image type="content" source="media/azure-monitor-migration-tools/ama-migration-helper-recommendations.png" lightbox="media/azure-monitor-migration-tools/ama-migration-helper-recommendations.png" alt-text="Screenshot of the Azure Monitor Agent Migration Helper workbook. The screenshot highlights the automatic migration recommendations based on sample usage across machines within selected scope." border="false":::

## Installing and using DCR Config Generator 
Azure Monitor Agent relies only on [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) for configuration, whereas Log Analytics Agent inherits its configuration from Log Analytics workspaces. 

Use the DCR Config Generator tool to parse Log Analytics Agent configuration from your workspaces and generate/deploy corresponding data collection rules automatically. You can then associate the rules to machines running the new agent using built-in association policies. 

> [!NOTE]
> DCR Config Generator does not currently support additional configuration for [Azure solutions or services](./azure-monitor-agent-migration.md#migrate-additional-services-and-features) dependent on Log Analytics Agent.

### Prerequisites\Setup
1. `Powershell version 7.1.3` or higher is recommended (minimum version 5.1)
2. Uses `Az Powershell module` to pull workspace agent configuration information [Az PowerShell module](/powershell/azure/install-azps-windows?tabs=powershell&pivots=windows-psgallery)
3. User will need Read/Write access to the specified workspace resource
4. Connect-AzAccount and Select-AzSubscription will be used to set the context for the script to run so proper Azure credentials will be needed

### To install DCR Config Generator:

1. [Download the PowerShell script](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools/DCR%20Config%20Generator).
1. Run the script using the sample parameters below:

	```powershell
	.\WorkspaceConfigToDCRMigrationTool.ps1 -SubscriptionId $subId -ResourceGroupName $rgName -WorkspaceName $workspaceName -DCRName $dcrName -OutputFolder $outputFolderPath
	```
	---

	| Name                    | Required  | Description                                                                   |
	|:----------------------- |:---------|:-----------------------------------------------------------------------------|
	| `SubscriptionId`        | YES       | This is the subscription ID of the workspace                                  |
	| `ResourceGroupName`     | YES       | This is the resource Group of the workspace                                   |
	| `WorkspaceName`         | YES       | This is the name of the workspace (Azure resource IDs are case insensitive)   |
	| `DCRName`               | YES       | The base name that will be used for each one the outputs DCRs                 |
	| `OutputFolder`          | NO        | The output folder path. If not provided, the working directory path is used   |

3. Outputs:

	For each supported `DCR type`, the script produces a DCR ARM template (ready to be deployed) and a DCR payload (for users that don't need the ARM template). This is the list of currently supported DCR types:
 	 - **Windows** contains `WindowsPerfCounters` and `WindowsEventLogs` data sources only
	  - **Linux** contains `LinuxPerfCounters` and `Syslog` data sources only
	  - **Custom Logs** contains `logFiles` data sources only:
  		- Each custom log gets its own DCR ARM template
	  - **IIS Logs** contains `iisLogs` data sources only
	  - **Extensions** contains `extensions` data sources only along with any associated perfCounters data sources
	    - `VMInsights` 
 	   - If you would like to add support for a new extension type, please reach out to us.


4. **Deploy the generated ARM templates:**

	Portal
   
	- In the portal's search box, type in *template* and then select **Deploy a custom template**.
    
        :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot of the Deploy custom template screen.":::
    
	- Select **Build your own template in the editor**.
    
        :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="../logs/media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot of the template editor.":::
    
	- Paste the generated template into the editor and select **Save**. 
	- On the **Custom deployment** screen, specify a **Subscription**, **Resource group**, and **Region**.    
	- Select **Review + create** > **Create**.

   	PowerShell
   
	```powershell-interactive
   	New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
   	```

	> [!NOTE]
	> You can include up to 100 'counterSpecifiers' in a data collection rule. 'samplingFrequencyInSeconds' must be between 1 and 300, inclusive.

1. Associate machines to your data collection rules:

    1. From the **Monitor** menu, select **Data Collection Rules**.
    1. From the **Data Collection Rules** screen, select your data collection rule.
    1. Select **View resources** > **Add**.
    1. Select your machines > **Apply**.  
    
