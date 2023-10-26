---
title: Enable Change Analysis | Microsoft Docs
description: Use Change Analysis in Azure Monitor to track and troubleshoot issues on your live site.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.date: 08/23/2022 
ms.subservice: change-analysis
ms.custom:
---

# Enable Change Analysis

The Change Analysis service:
- Computes and aggregates change data from the data sources mentioned earlier. 
- Provides a set of analytics for users to:
    - Easily navigate through all resource changes.
    - Identify relevant changes in the troubleshooting or monitoring context.

Register the `Microsoft.ChangeAnalysis` resource provider with an Azure Resource Manager subscription to make the resource properties and configuration change data available. The `Microsoft.ChangeAnalysis` resource provider is automatically registered as you either: 
- Enter any UI entry point, like the Web App **Diagnose and Solve Problems** tool, or 
- Bring up the Change Analysis standalone tab.

In this guide, you'll learn the two ways to enable Change Analysis for Azure Functions and web app in-guest changes:
- For one or a few Azure Functions or web apps, enable Change Analysis via the UI.
- For a large number of web apps (for example, 50+ web apps), enable Change Analysis using the provided PowerShell script.

> [!NOTE]
> Slot-level enablement for Azure Functions or web app is not supported at the moment.

## Enable Azure Functions and web app in-guest change collection via the Change Analysis portal

For web app in-guest changes, separate enablement is required for scanning code files within a web app. For more information, see [Change Analysis in the Diagnose and solve problems tool](change-analysis-visualizations.md#diagnose-and-solve-problems-tool) section.

> [!NOTE]
> You may not immediately see web app in-guest file changes and configuration changes. Prepare for downtime and restart your web app to view changes within 30 minutes. If you still can't see changes, refer to [the troubleshooting guide](./change-analysis-troubleshoot.md#cannot-see-in-guest-changes-for-newly-enabled-web-app).

1. Navigate to Azure Monitor's Change Analysis UI in the portal. 

1. Enable web app in-guest change tracking by either:

   - Selecting **Enable Now** in the banner, or

     :::image type="content" source="./media/change-analysis/enable-changeanalysis.png" alt-text="Screenshot of the Application Changes options from the banner.":::   

   - Selecting **Configure** from the top menu.
   
     :::image type="content" source="./media/change-analysis/configure-button.png" alt-text="Screenshot of the Application Changes options from the top menu."::: 

1. Toggle on **Change Analysis** status and select **Save**.

   :::image type="content" source="./media/change-analysis/change-analysis-on.png" alt-text="Screenshot of the Enable Change Analysis user interface.":::   
  
    - The tool displays all web apps under an App Service plan, which you can toggle on and off individually. 

      :::image type="content" source="./media/change-analysis/change-analysis-on-2.png" alt-text="Screenshot of the Enable Change Analysis user interface expanded.":::   

## Enable Change Analysis at scale using PowerShell

If your subscription includes several web apps, run the following script to enable *all web apps* in your subscription.

### Pre-requisites

PowerShell Az Module. Follow instructions at [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell)

### Run the following script:

```PowerShell
# Log in to your Azure subscription
Connect-AzAccount

# Get subscription Id
$SubscriptionId = Read-Host -Prompt 'Input your subscription Id'

# Make Feature Flag visible to the subscription
Set-AzContext -SubscriptionId $SubscriptionId

# Register resource provider
Register-AzResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis"

# Enable each web app
$webapp_list = Get-AzWebApp | Where-Object {$_.kind -eq 'app'}
foreach ($webapp in $webapp_list)
{
    $tags = $webapp.Tags
    $tags["hidden-related:diagnostics/changeAnalysisScanEnabled"]=$true
    Set-AzResource -ResourceId $webapp.Id -Tag $tags -Force
}
```

## Frequently asked questions

This section provides answers to common questions.

### How can I enable Change Analysis for a web application?

Enable Change Analysis for web application in guest changes by using the [Diagnose and solve problems tool](./change-analysis-visualizations.md#diagnose-and-solve-problems-tool).

## Next steps

- Learn about [visualizations in Change Analysis](change-analysis-visualizations.md)
- Learn how to [troubleshoot problems in Change Analysis](change-analysis-troubleshoot.md)
- Enable Application Insights for [Azure web apps](../../azure-monitor/app/azure-web-apps.md).
- Enable Application Insights for [Azure VM and Azure virtual machine scale set IIS-hosted apps](../../azure-monitor/app/azure-vm-vmss-apps.md).
