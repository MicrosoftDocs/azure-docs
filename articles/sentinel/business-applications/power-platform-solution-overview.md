---
title: Microsoft Sentinel solution for Microsoft Power Platform overview
description: Learn about the Microsoft Sentinel Solution for Power Platform.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 11/07/2023
---

# Microsoft Sentinel solution for Microsoft Power Platform overview

The Microsoft Sentinel solution for Power Platform allows you to monitor and detect suspicious or malicious activities in your Power Platform environment. The solution collects activity logs from different Power Platform components and inventory data. It analyzes those activity logs to detect threats and suspicious activities like the following activities:

- Power Apps execution from unauthorized geographies
- Suspicious data destruction by Power Apps
- Mass deletion of Power Apps
- Phishing attacks made possible through Power Apps
- Power Automate flows activity by departing employees
- Microsoft Power Platform connectors added to the environment
- Update or removal of Microsoft Power Platform data loss prevention policies

> [!IMPORTANT]
> - The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.
> - Provide feedback for this solution by completing this survey: [https://aka.ms/SentinelPowerPlatformSolutionSurvey](https://aka.ms/SentinelPowerPlatformSolutionSurvey).

## Why you should install the solution

 The Microsoft Sentinel solution for Microsoft Power Platform helps organizations to:

- Collect Microsoft Power Platform and Power Apps activity logs, audits, and events into the Microsoft Sentinel workspace.
- Detect execution of suspicious, malicious, or illegitimate activities within Microsoft Power Platform and Power Apps.
- Investigate threats detected in Microsoft Power Platform and Power Apps and contextualize them with other user activities across the organization.
- Respond to Microsoft Power Platform-related and Power Apps-related threats and incidents in a simple and canned manner manually, automatically, or through a predefined workflow.

## What the solution includes

The Microsoft Sentinel solution for Power Platform includes several data connectors and analytic rules.

### Data connectors

The Microsoft Sentinel solution for Power Platform ingests and cross-correlates activity logs and inventory data from multiple sources. So, the solution requires that you enable the following data connectors that are available as part of the solution.

|Connector name  |Data collected  |Log Analytics tables |
|---------|---------|---------|
|Power Platform Inventory (using Azure Functions)   |  Power Apps and Power Automate inventory data <br><br> For more information, see [Set up Microsoft Power Platform self-service analytics to export Power Platform inventory and usage data](/power-platform/admin/self-service-analytics).      |   PowerApps_CL,<br>PowerPlatrformEnvironments_CL,<br>PowerAutomateFlows_CL,<br>PowerAppsConnections_CL      |
|Microsoft Power Apps (Preview)   |    Power Apps activity logs  <br><br> For more information, see [Power Apps activity logging](/power-platform/admin/logging-powerapps).    |  PowerAppsActivity       |
|Microsoft Power Automate (Preview)     |  Power Automate activity logs  <br><br>For more information, see [View Power Automate audit logs](/power-platform/admin/logging-power-automate).     |   PowerAutomateActivity      |
|Microsoft Power Platform Connectors (Preview)    |   Power Platform connector activity logs  <br><br>For more information, see [View the Power Platform connector activity logs](/power-platform/admin/connector-events-power-platform).      |     PowerPlatformConnectorActivity    |
|Microsoft Power Platform DLP (Preview)     |     Data loss prevention activity logs  <br><br>For more information, see [Data loss prevention activity logging](/power-platform/admin/dlp-activity-logging).   |    PowerPlatformDlpActivity     |
|Microsoft Dataverse (Preview) |    Dataverse and model-driven apps activity logging <br><br>For more information, see [Microsoft Dataverse and model-driven apps activity logging](/power-platform/admin/enable-use-comprehensive-auditing).    |   DataverseActivity      |

### Analytic rules

The solution includes analytics rules to detect threats and suspicious activity in your Power Platform environment. These activities include Power Apps being run from unauthorized geographies, suspicious data destruction by Power Apps, mass deletion of Power Apps, and more. For more information, see [Microsoft Sentinel solution for Microsoft Power Platform: security content reference](power-platform-solution-security-content.md).

## Next steps

[Deploy the Microsoft Sentinel solution for Microsoft Power Platform](deploy-power-platform-solution.md)
