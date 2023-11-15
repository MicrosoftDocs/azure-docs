---
title: Troubleshoot Azure Monitor's Change Analysis
description: Learn how to troubleshoot problems in Azure Monitor's Change Analysis.
ms.topic: conceptual
ms.author: hannahhunter
author: hhunter-ms
ms.contributor: cawa
ms.date: 09/21/2022 
ms.subservice: change-analysis
ms.reviewer: cawa
---

# Troubleshoot Azure Monitor's Change Analysis

## Trouble registering Microsoft.ChangeAnalysis resource provider from Change history tab.

If you're viewing Change history after its first integration with Azure Monitor's Change Analysis, you'll see it automatically registering the **Microsoft.ChangeAnalysis** resource provider. The resource may fail and incur the following error messages: 

### You don't have enough permissions to register Microsoft.ChangeAnalysis resource provider.  
You're receiving this error message because your role in the current subscription isn't associated with the **Microsoft.Support/register/action** scope. For example, you aren't the owner of your subscription and instead received shared access permissions through a coworker (like view access to a resource group). 

To resolve the issue, contact the owner of your subscription to register the **Microsoft.ChangeAnalysis** resource provider. 
1. In the Azure portal, search for **Subscriptions**.
1. Select your subscription.
1. Navigate to **Resource providers** under **Settings** in the side menu.
1. Search for **Microsoft.ChangeAnalysis** and register via the UI, Azure PowerShell, or Azure CLI.

    Example for registering the resource provider through PowerShell:
    ```PowerShell
    # Register resource provider
    Register-AzResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis"
    ```

### Failed to register Microsoft.ChangeAnalysis resource provider.
This error message is likely a temporary internet connectivity issue, since:
* The UI sent the resource provider registration request.
* You've resolved your [permissions issue](#you-dont-have-enough-permissions-to-register-microsoftchangeanalysis-resource-provider).

Try refreshing the page and checking your internet connection. If the error persists, [submit an Azure support ticket](https://azure.microsoft.com/support/).

### This is taking longer than expected.
You'll receive this error message when the registration takes longer than 2 minutes. While unusual, it doesn't mean something went wrong. 

1. Prepare for downtime.
1. Restart your web app to see your registration changes. 

Changes should show up within a few hours of app restart. If your changes still don't show after 6 hours, [submit an Azure support ticket](https://azure.microsoft.com/support/). 

## Azure Lighthouse subscription is not supported.

### Failed to query Microsoft.ChangeAnalysis resource provider.
Often, this message includes: `Azure Lighthouse subscription is not supported, the changes are only available in the subscription's home tenant`. 

Azure Lighthouse allows for cross-tenant resource administration. However, cross-tenant support needs to be built for each resource provider. Currently, Change Analysis has not built this support. If you're signed into one tenant, you can't query for resource or subscription changes whose home is in another tenant.

If this is a blocking issue for you, [submit an Azure support ticket](https://azure.microsoft.com/support/) to describe how you're trying to use Change Analysis.

## An error occurred while getting changes. Please refresh this page or come back later to view changes.

When changes can't be loaded, Azure Monitor's Change Analysis service presents this general error message. A few known causes are:

- Internet connectivity error from the client device.
- Change Analysis service being temporarily unavailable.

Refreshing the page after a few minutes usually fixes this issue. If the error persists, [submit an Azure support ticket](https://azure.microsoft.com/support/).

## Only partial data loaded.

This error message may occur in the Azure portal when loading change data via the Change Analysis home page. Typically, the Change Analysis service calculates and returns all change data. However, in a network failure or a temporary outage of service, you may receive an error message indicating only partial data was loaded.

To load all change data, try waiting a few minutes and refreshing the page. If you are still only receiving partial data, [submit an Azure support ticket](https://azure.microsoft.com/support/).


## You don't have enough permissions to view some changes. Contact your Azure subscription administrator.

This general unauthorized error message occurs when the current user doesn't have sufficient permissions to view the change. At minimum, 
* To view infrastructure changes returned by Azure Resource Graph and Azure Resource Manager, reader access is required. 
* For web app in-guest file changes and configuration changes, contributor role is required. 

## Cannot see in-guest changes for newly enabled Web App.

You may not immediately see web app in-guest file changes and configuration changes. 

1. Prepare for brief downtime.
1. Restart your web app.

You should be able to view changes within 30 minutes. If not, [submit an Azure support ticket](https://azure.microsoft.com/support/).

## Diagnose and solve problems tool for virtual machines

To troubleshoot virtual machine issues using the troubleshooting tool in the Azure portal:
1. Navigate to your virtual machine.
1. Select **Diagnose and solve problems** from the side menu.
1. Browse and select the troubleshooting tool that fits your issue.

:::image type="content" source="./media/change-analysis/vm-dnsp-troubleshootingtools.png" lightbox="./media/change-analysis/vm-dnsp-troubleshootingtools.png" alt-text="Screenshot of the Diagnose and Solve Problems tool for a Virtual Machine with Troubleshooting tools selected.":::
<!-- convertborder later -->
:::image type="content" source="./media/change-analysis/analyze-recent-changes.png" lightbox="./media/change-analysis/analyze-recent-changes.png" alt-text="Screenshot of the tile for the Analyze recent changes troubleshooting tool for a Virtual Machine." border="false":::

## Can't filter to your resource to view changes

When filtering down to a particular resource in the Change Analysis standalone page, you may encounter a known limitation that only returns 1,000 resource results. To filter through and pinpoint changes for one of your 1,000+ resources:

1. In the Azure portal, select **All resources**.
1. Select the actual resource you want to view.
1. In that resource's left side menu, select **Diagnose and solve problems**.
1. In the Change Analysis card, select **View change details**.

   :::image type="content" source="./media/change-analysis/change-details-card.png" lightbox="./media/change-analysis/change-details-card.png" alt-text="Screenshot of viewing change details from the Change Analysis card in Diagnose and solve problems tool.":::

From here, you'll be able to view all of the changes for that one resource.

## Next steps

Learn more about [Azure Resource Graph](../../governance/resource-graph/overview.md), which helps power Change Analysis.
