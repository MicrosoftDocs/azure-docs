---
title: Microsoft Sentinel solution for Microsoft Power Platform overview
description: Learn about the Microsoft Sentinel Solution for Power Platform.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 07/12/2023
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
> The Microsoft Sentinel solution for Power Platform is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## What the solution includes

The Microsoft Sentinel solution for Power Platform includes six data connectors and several analytic rules.

### Data connectors

The Microsoft Sentinel solution for Power Platform ingests and cross-correlates activity logs and inventory data from multiple sources. So, the solution requires that you enable the following data connectors that are available as part of the solution.

|Connector name  |Data collected  |Log Analytics tables |
|---------|---------|---------|
|Power Platform Inventory (using Azure Functions)   |  Power Apps and Power Automate inventory data       |   PowerApps_CL, PowerPlatrformEnvironments_CL      |
|Microsoft Power Apps (Preview)   |    Power Apps activity logs     |  PowerAppsActivity       |
|Microsoft Power Automate (Preview)     |  Power Automate activity logs       |   PowerAutomateActivity      |
|Microsoft Power Platform Connectors (Preview)    |   Power Platform connector activity logs      |     PowerPlatformConnectorActivity    |
|Microsoft Power Platform DLP (Preview)     |     Data loss prevention activity logs   |    PowerPlatformDlpActivity     |
|Dynamics 365   |    Dataverse and model-driven apps activity logging     |   Dynamics365Activity      |

### Analytic rules

The solution includes analytics rules to detect suspicious activity in your Power Platform environment, like multiple apps deleted, data destruction after publishing a new app, and more. For more information, see [Microsoft Sentinel solution for Microsoft Power Platform: security content reference](power-platform-security-solution-content.md).

## Next steps

[Deploy the Microsoft Sentinel solution for Microsoft Power Platform](deploy-power-platform-solution.md)