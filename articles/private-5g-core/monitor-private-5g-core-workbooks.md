---
title: Monitor Azure Private 5G Core with Azure Monitor Workbooks
description: Information on using Azure Monitor Workbooks to monitor activity and analyze statistics in your private mobile network. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 08/09/2023
ms.custom: template-concept
---

# Monitor Azure Private 5G Core with Azure Monitor Workbooks

Azure Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure and combine them into unified interactive experiences.

Azure Workbooks allow you to view status information, metrics, and alerts for all of your [Azure private multi-access compute (MEC)](/azure/private-multi-access-edge-compute-mec/overview) resources in one place. Workbooks are supported for the **Mobile Network Site** resource, providing a monitoring solution for all resources in a site.

Within your **Mobile Network Site** resource in the Azure portal, you can view workbook templates that report essential information about the resources connected to your site. Templates are curated reports designed for flexible reuse by multiple users and teams. When you open a template, a transient workbook is created and populated with the content specified in the template. You can modify a template to create your own workbooks, but the original template will remain in the gallery for others to use.

## The workbook gallery

:::image type="content" source="media/monitor-private-5g-core-workbooks/workbooks-tab.png" alt-text="Screenshot of the Azure portal showing the Workbooks tab.":::

The gallery lists your saved workbooks and templates. To access the gallery:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the **Mobile Network Site** resource for the site you want to monitor.
1. Select **Workbooks** from the left-hand navigation.

Your AP5GC deployment includes a **PMEC Site Overview** template along with the default **Activity Logs Insights** template. You can also select the **Empty** quick start template to create your own workbook.

- **PMEC Site Overview** – view information about resources connected to your Mobile Network Site like subscribers, packet cores and Azure Stack Edge devices.  
- **Activity Logs Insights** – view information about management changes on resources within your Mobile Network Site.
- **Empty** – start with an empty workbook and choose the information you want to display.

## Using the PMEC Site Overview template

This template uses data from Azure Monitor platform metrics and alerts, Azure Resource Graph, and Azure Resource Health. It has four tabs providing real-time status information on resources connected to the Mobile Network Site.

### Overview tab

The Overview tab provides a comprehensive view of the Mobile Network Site. With this centralized dashboard, you can view the status of connected resources such as packet cores, Kubernetes clusters and data networks. You can also view graphs of key performance indicators, such as registered subscribers and user plane throughput, and a list of alerts.

### Subscriber Provisioning Information tab

The Subscriber Provisioning Information tab provides information on SIMs connected to the Mobile Network Site, filtered by SIM group. Select a SIM group to view the number of connected SIMs, their provisioning status, and associated SIM policy details.

### Packet Core Control Plane Procedures tab

The Packet Core Control Plane Procedures tab provides monitoring graphs for key procedures on the packet core such as registrations and session establishments.

### Azure Stack Edge Status tab

The Azure Stack Edge Status tab shows the status, resource usage and alerts for Azure Stack Edge (ASE) devices connected to the Mobile Network Site.

## Using the Activity Log Insights template

The Activity Logs Insights template provides a set of dashboards that monitor the changes to resources under your Mobile Network Site. The dashboards also present data about which users or services performed activities in the subscription and the activity status. See [Activity log insights](/azure/azure-monitor/essentials/activity-log-insights) for more information.

## Next steps

- [Azure Workbooks overview](/azure/azure-monitor/visualize/workbooks-overview)
- [Get started with Azure Workbooks](/azure/azure-monitor/visualize/workbooks-getting-started)
- [Create a workbook with a template](/azure/azure-monitor/visualize/workbooks-templates)