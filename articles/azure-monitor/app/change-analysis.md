---
title: Azure Monitor application change analysis - Discover changes that may impact live site issues/outages with Azure Monitor application change analysis  | Microsoft Docs
description: Troubleshoot application live site issues on Azure App Services with Azure Monitor application change analysis
services: application-insights
author: cawams
manager: carmonm
ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: cawa
---

# Azure Monitor application change analysis (public preview)

When a live site issue/outage occurs, determining root cause quickly is critical. Standard monitoring solutions may help you rapidly identify that there is a problem, and often even which component is failing. But this won't always lead to an immediate explanation for why the failure is occurring. Your site worked five minutes ago, now it's broken. What changed in the last five minutes? This is the question that the new feature Azure Monitor application change analysis is designed to answer. By building on the power of the [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview) application change analysis provides insight into your Azure App Service application changes to increase observability and reduce MTTR (Mean Time To Repair).

> [!IMPORTANT]
> Azure Monitor application change analysis is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How do I use application change analysis?

Azure Monitor application change analysis is currently built into the self-service **Diagnose and solve problems** experience, which can be accessed from the **Overview** section of your Azure App Service application:

![Screenshot of Azure App Service overview page with red boxes around overview button and diagnose and solve problems button](./media/change-analysis/change-analysis.png)

### Enable change analysis

1. Select **Availability and Performance**

    ![screenshot of availability and performance troubleshooting options](./media/change-analysis/availability-and-performance.png)

2. Click the **Application Crashes** tile.

   ![Screenshot with application crashes tile](./media/change-analysis/application-crashes-tile.png)

3. To enable **Change Analysis** select **Enable now**.

   ![screenshot of availability and performance troubleshooting options](./media/change-analysis/application-crashes.png)

4. To take advantage of the full change analysis functionality set **Change Analysis**, **Scan for code changes**, and **Always on** to **On** and select **Save**.

    ![Screenshot of the Azure App Service enable change analysis user interface](./media/change-analysis/change-analysis-on.png)

    If **Change Analysis** is enabled, you will be able to detect resource level changes. If **Scan for code changes** is enabled, you will also see deployment files and site configuration changes. Enabling **Always on** will optimize the change scanning performance, but may incur additional costs from a billing perspective.

5.  Once everything  is enabled, selecting **Diagnose and solve problems** > **Availability and Performance** > **Application Crashes** will allow you to access the change analysis experience. The graph will summerize the type of changes that happened over time along with details on those changes:

     ![Screenshot of change diff view](./media/change-analysis/change-view.png)
        
     > [!NOTE]
     > After enabling change analysis you may receive a message stating "Unable to fetch Change Analysis information. Please try again later." This is expected, you may need to wait up to 4 hours for the initial collection of application change data to occur.

## Troubleshooting

### Unable to fetch Change Analysis information.

This is a temporary issue with the current preview onboarding experience. The workaround consists of setting a hidden tag on your web app and then refreshing the page:

   ![Screenshot of change hidden tag](./media/change-analysis/hidden-tag.png)

To set the hidden tag using PowerShell:

1. Open the Azure Cloud Shell:

    ![Screenshot of change Azure Cloud Shell](./media/change-analysis/cloud-shell.png)

2. Change the shell type to PowerShell:

   ![Screenshot of change Azure Cloud Shell](./media/change-analysis/choose-powershell.png)

3. Run the following command:

```powershell
$webapp=Get-AzWebApp -Name <name_of_your_webapp>
$tags = $webapp.Tags
$tags[“hidden-related:diagnostics/changeAnalysisScanEnabled”]=$true
Set-AzResource -ResourceId <your_webapp_resourceid> -Tag $tag
```

> [!NOTE]
> Once the hidden tag is added, you may still need to initially wait up to 4 hours to be able to first view changes. This is due to the 4 hour freqeuncy that the change analysis service uses to scan your web app while limiting the performance impact of the scan.

## Next steps

- Improve your monitoring of Azure App Services [by enabling the Application Insights features](azure-web-apps.md) of Azure Monitor.
- Enhance your understanding of the [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview) which helps power Azure Monitor application change analysis. 
