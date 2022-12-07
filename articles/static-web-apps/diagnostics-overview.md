---
title: Diagnose and solve tool for Static Web Apps
description: Learn to troubleshoot issues with your static web app with the Diagnose and Solve tool in the Azure portal.
ms.date: 12/06/2022
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.author: cshoe
---

# Azure Static Web Apps diagnostics overview

If your static web app encounters issues, the Static Web Apps' diagnose and solve features can guide you through steps to troubleshoot problems.

Diagnostics for your static web app are accessible directly from the Azure portal, with no configuration required.

Although these diagnostics are most helpful for issues that have occurred in the last 24 hours, all the diagnostic data remains available for analysis.

## Categories

You have access to diagnostic data in these categories:

| Category | Description | Examples |
|--|--|--|
| Availability and performance | Health and performance data | Service down, platform health |
| Configuration and Management | Application configuration data | Configuration, management, authentication |
| Content Deployment | Content deployment data | Deployments |

## View diagnostics

1. From the [Azure portal](https://portal.azure.com), go to your static web app.

1. Select **Diagnose and solve problems**.

From the diagnostics window you can filter diagnostic categories, or select one from the list.

## Reports

Selecting an issue reveals a series of visualization for the diagnostic data.

:::image type="content" source="media/diagnotics-overview/azure-static-web-apps-diagnostics-chart.png" alt-text="Screenshot of Azure Static Web Apps diagnostics chart.":::

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting deployment and runtime errors](troubleshooting.md)