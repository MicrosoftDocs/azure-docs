---
title: Diagnose and solve tool for Static Web Apps
description: Learn to troubleshoot issues with your static web app with the diagnose and solve tool in the Azure portal.
ms.date: 12/08/2022
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.author: cshoe
---

# Azure Static Web Apps diagnostics overview

If you encounter issues with your Azure Static Web Apps instance,  the diagnose and solve feature can guide you through steps to troubleshoot problems.

Diagnostics for your static web app are accessible directly from the Azure portal, with no configuration required.

Although these diagnostics are most helpful for issues that have occurred in the last 24 hours, all the diagnostic data remains available for analysis.

## Categories

You have access to diagnostic data in these categories:

| Category | Description | Examples |
|--|--|--|
| Availability and performance | Health and performance data | Service uptime, site hits, platform health |
| Configuration and Management | Application configuration data | Configuration of Static Web Apps features, custom authentication information |
| Content Deployment | Content deployment data | Deployments |

## View diagnostics

1. From the [Azure portal](https://portal.azure.com), go to your static web app.

1. Select **Diagnose and solve problems**.

From the diagnostics window you can filter diagnostic categories, or select one from the list.

## Reports

Selecting a detector reveals a series of visualization for the diagnostic data. The following screenshot is an example of the availability and performance report.

:::image type="content" source="media/diagnotics-overview/azure-static-web-apps-diagnostics-chart.png" alt-text="Screenshot of Azure Static Web Apps diagnostics chart.":::

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting deployment and runtime errors](troubleshooting.md)
