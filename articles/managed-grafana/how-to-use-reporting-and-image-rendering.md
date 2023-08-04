---
title: How to use reporting and image rendering in Azure Managed Grafana
description: Learn how to create reports in Azure Managed Grafana and understand performance and limitations of image rendering
ms.service: managed-grafana
ms.topic: how-to
author: mcleanbyron
ms.author: mcleans
ms.date: 5/6/2023
--- 

# Use reporting and image rendering (preview)

In this guide, you learn how to create reports from your dashboards in Azure Managed Grafana. You can configure to have these reports emailed to intended recipients on a regular schedule or on-demand.

Generating reports in the PDF format requires Grafana's image rendering capability, which captures dashboard panels as PNG images. Azure Managed Grafana installs the image renderer for your instance automatically.

> [!IMPORTANT]
> Reporting and image rendering are currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Image rendering performance

Image rendering is a CPU-intensive operation. An Azure Managed Grafana instance needs about 10 seconds to render one panel, assuming data query is completed in less than 1 second. The Grafana software allows a maximum of 200 seconds to generate an entire report. Dashboards should contain no more than 20 panels each if they're used in PDF reports. You may have to reduce the panel number further if you plan to include other artifacts (for example, CSV) in the reports.

> [!NOTE]
> You'll see a "Image Rendering Timeout" error if a rendering request has exceeded the 200 second limit.

For screen-capturing in alerts, the Grafana software only allows 30 seconds to snapshot panel images before timing out. At most three screenshots can be taken within this time frame. If there's a sudden surge in alert volume, some alerts may not have screenshots even if screen-capturing has been enabled.

> [!NOTE]
> Overloading the Grafana image renderer may cause it to become unstable. You can reduce the number of alerts that must include screenshots by only setting the Dashboard UID and Panel ID annotations in those alert rules.

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).
- An SMTP server. If you don't have one yet, you may want to consider using [Twilio SendGrid's email API for Azure](https://azuremarketplace.microsoft.com/marketplace/apps/sendgrid.tsg-saas-offer).
- Email set up for your Azure Managed Grafana instance. [Configure SMTP settings](how-to-smtp-settings.md).

## Set up reporting

To create a new report, follow these steps.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
2. In the Grafana portal, go to **Reporting > Reports** and select **+ Create a new report**.
3. Complete the remaining [steps](https://grafana.com/docs/grafana/latest/dashboards/create-reports/) in the Grafana UI.

## Export dashboard to PDF

> [!NOTE]
> The Grafana UI may change periodically. This article shows the Grafana interface and user flow at a given point. Your experience may slightly differ from the examples at the time of reading this document. If this is the case, refer to the [Grafana Labs documentation](https://grafana.com/docs/grafana/latest/dashboards/create-reports/#export-dashboard-as-pdf).

To create a new report, follow these steps.

1. In the Azure portal, open your Azure Managed Grafana workspace and select the **Endpoint** URL.
2. In the Grafana portal, go to the dashboard you want to export.
3. Click the **Share dashboard** icon.
4. Choose a layout option in the PDF tab.
5. Select **Save as PDF** to export.

## Use image in alerts

Grafana allows screen-capturing a panel that triggers an alert. Recipients can see the panel image directly in the notification message. Azure Managed Grafana is currently configured to upload these screenshots to the local storage on your instance. Only the list of contact points in the **Upload from disk** column of the [Supported contact points](https://grafana.com/docs/grafana/latest/alerting/manage-notifications/images-in-notifications/#supported-contact-points) table can receive the images. In addition, there's a 30-second time limit for taking a screenshot. If a screenshot can't be completed in time, it isn't included with the corresponding alert. Screenshots are taken only for those alerts that have Dashboard UID and Panel ID annotations in the rule. You can use these annotations to disable screen-capturing selectively.

## Next steps

In this how-to guide, you learned how to use reporting and image rendering. To learn how to create and configure Grafana dashboards, see [Create dashboards](how-to-create-dashboard.md).
