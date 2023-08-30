---
title: "How to self-diagnose and solve problems in Azure Spring Apps"
description: Learn how to self-diagnose and solve problems in Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 6/1/2023
ms.custom: devx-track-java, event-tier1-build-2022
---

# Self-diagnose and solve problems in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use Azure Spring Apps diagnostics.

Azure Spring Apps diagnostics is an interactive experience to troubleshoot your app without configuration. Azure Spring Apps diagnostics identifies problems and guides you to information that helps troubleshoot and resolve issues.

## Prerequisites

To complete this exercise, you need:

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A deployed Azure Spring Apps service instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).
* At least one application already created in your service instance.

## Navigate to the diagnostics page

1. Sign in to the Azure portal.
2. Go to your Azure Spring Apps **Overview** page.
3. Select **Diagnose and solve problems** in the navigation pane.

   :::image type="content" source="media/how-to-self-diagnose-solve/diagnose-solve-dialog.png" alt-text="Screenshot of the Azure portal showing the Diagnose and Solve problems page." lightbox="media/how-to-self-diagnose-solve/diagnose-solve-dialog.png":::

## Search logged issues

To find an issue, you can either search by typing a keyword or select the solution group to explore all in that category.

:::image type="content" source="media/how-to-self-diagnose-solve/search-detectors.png" alt-text="Screenshot of the Azure portal showing the Diagnose and Solve problems page with text entered in the search bar." lightbox="media/how-to-self-diagnose-solve/search-detectors.png":::

Selection of **Config Server Health Check**, **Config Server Health Status**, or **Config Server Update History** displays various results.

> [!NOTE]
> Spring Cloud Config Server is not applicable to the Azure Spring Apps Enterprise plan.

:::image type="content" source="media/how-to-self-diagnose-solve/detectors-options.png" alt-text="Screenshot of the Azure portal showing the Availability and Performance page." lightbox="media/how-to-self-diagnose-solve/detectors-options.png":::

Find your target detector and select it to execute. A summary of diagnostics is shown after you execute the detector. Select **View details** to check diagnostic details.

:::image type="content" source="media/how-to-self-diagnose-solve/summary-diagnostics.png" alt-text="Screenshot of the Azure portal showing the Availability and Performance page with View details highlighted for a detector." lightbox="media/how-to-self-diagnose-solve/summary-diagnostics.png":::

You can change the diagnostic time range with the controller for **CPU Usage**. There can be a 15-minute delay for metrics and logs.

:::image type="content" source="media/how-to-self-diagnose-solve/diagnostics-details.png" alt-text="Screenshot of the Azure portal showing the Availability and Performance page with the CPU Usage time range selector highlighted." lightbox="media/how-to-self-diagnose-solve/diagnostics-details.png":::

Some results contain related documentation.

:::image type="content" source="media/how-to-self-diagnose-solve/related-details.png" alt-text="Screenshot of the Azure portal showing the Availability and Performance page with related diagnostic information." lightbox="media/how-to-self-diagnose-solve/related-details.png":::

## Next steps

* [Monitor Spring app resources using alerts and action groups](./tutorial-alerts-action-groups.md)
* [Security controls for Azure Spring Apps Service](./concept-security-controls.md)
