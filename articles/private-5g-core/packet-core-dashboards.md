---
title: Packet core dashboards
titleSuffix: Azure Private 5G Core
description: Information on the packet core dashboards, which can be used to monitor key statistics in an Azure Private 5G Core deployment. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 01/19/2022
ms.custom: template-concept
---

# Packet core dashboards

The *packet core dashboards* provide a flexible way to monitor key statistics relating to your deployment in real time. They also allow you to view information on firing alerts, allowing you to quickly react to emerging issues.

The packet core dashboards are powered by *Grafana*, an open-source, metric analytics and visualization suite. For more information, see the [Grafana documentation](https://grafana.com/docs/grafana/v6.1/).

## Access the packet core dashboards

> [!TIP]
> When signing in, if you see a warning in your browser that the connection isn't secure, you might be using a self-signed certificate to attest access to your local monitoring tools. We recommend following [Modify the local access configuration in a site](modify-local-access-configuration.md) to configure a custom HTTPS certificate signed by a globally known and trusted certificate authority.

<a name='azure-active-directory'></a>

### Microsoft Entra ID

To sign in to the packet core dashboards if you enabled Microsoft Entra authentication:

1. In your browser, enter https://*\<local monitoring domain\>*/grafana, where *\<local monitoring domain\>* is the domain name for your local monitoring tools that you set up in [Configure domain system name (DNS) for local monitoring IP](enable-azure-active-directory.md#configure-domain-system-name-dns-for-local-monitoring-ip).
1. Follow the prompts to sign in with your account credentials.

### Local username and password

To sign in to the packet core dashboards if you enabled local username and password authentication:

1. In your browser, enter https://*\<local monitoring IP\>*/grafana, where *\<local monitoring IP\>* is the IP address for accessing the local monitoring tools that you set up in [Management network](complete-private-mobile-network-prerequisites.md#management-network).

    :::image type="content" source="media\packet-core-dashboards\grafana-sign-in.png" alt-text="Screenshot of the Grafana sign in page, with fields for the username and password.":::

1. Sign in using your credentials. 

    If you're accessing the packet core dashboards for the first time after installing or upgrading the packet core instance, you should fill in the fields with the default username and password. Afterwards, follow the prompts to set up a new password that you will use from the next time you sign in.

      - **Email or username**: *admin*
      - **Password**: *admin*

Once you're signed in to the packet core dashboards, you can hover over your user icon in the left pane to access the options to sign out or change your password.

## Use the packet core dashboards

We'll go through the common concepts and operations you'll need to understand before you can use the packet core dashboards. If you need more information on using Grafana, see the [Grafana documentation](https://grafana.com/docs/grafana/v6.1/).

### Dashboards

You can access the following packet core dashboards:

> [!TIP]
> Some packet core dashboards display different panels depending on whether the packet core instance supports 5G, 4G, or combined 4G and 5G user equipment (UEs).

- The **Overview dashboard** displays important *key performance indicators* (KPIs), including the number of connected devices, throughput, and any alerts firing in the system.

    :::image type="content" source="media/packet-core-dashboards/packet-core-overview-dashboard.png" alt-text="Screenshot of the packet core Overview dashboard." lightbox="media/packet-core-dashboards/packet-core-overview-dashboard.png":::

    If you have configured 4G and 5G on a single packet core, the **Overview dashboard** displays 4G and 5G KPIs individually and combined.

    Each panel on the overview dashboard links to another dashboard with detailed statistics about the KPI shown. You can access the link by hovering your cursor over the upper-left corner of the panel. You can then select the link in the pop-up.
    
    :::image type="content" source="media/packet-core-dashboards/packet-core-dashboard-panel-link.png" alt-text="Screenshot of the packet core dashboard. The link to the device and session statistics dashboard is shown.":::

- The **Alerts dashboard** provides descriptions and information on the severity and effect of each currently firing alert. The **Alarm Severity** selector in the upper-left hand corner of the Alerts dashboard allows you to filter out alerts of certain severity levels.

    :::image type="content" source="media/packet-core-dashboards/packet-core-alerts-dashboard.png" alt-text="Screenshot of the packet core Alerts dashboard. Panels related to currently active alerts are shown." lightbox="media/packet-core-dashboards/packet-core-alerts-dashboard.png":::

- The **Device and Session Statistics dashboard** provides information about the device and session procedures being processed by the packet core instance.

    :::image type="content" source="media/packet-core-dashboards/packet-core-device-session-stats-dashboard.png" alt-text="Screenshot of the Device and Session Statistics dashboard. It shows panels for device authentication, device registration, device context, and P D U session procedures." lightbox="media/packet-core-dashboards/packet-core-device-session-stats-dashboard.png":::

- The **Uplink and Downlink Statistics dashboard** provides detailed statistics on the user plane traffic being handled by the packet core instance. 

    :::image type="content" source="media/packet-core-dashboards/packet-core-uplink-downlink-stats-dashboard.png" alt-text="Screenshot of the Uplink and Downlink Statistics dashboard. Panels related to throughput, packet rates, and packet size are shown." lightbox="media/packet-core-dashboards/packet-core-uplink-downlink-stats-dashboard.png":::

- The **Debug** dashboards show detailed breakdowns of the request and response statistics for the packet core instance's interfaces.

    - The **System Statistics dashboard** contains low-level detail about pod restarts and 5G interface operations.
    
    :::image type="content" source="media/packet-core-dashboards/packet-core-system-stats-dashboard.png" alt-text="Screenshot of the System Statistics dashboard. Panels related to pod details and individual network function statistics are shown." lightbox="media/packet-core-dashboards/packet-core-system-stats-dashboard.png":::

    - The **HTTP stats dashboard** for each network function shows statistics for the HTTP requests and responses shown by that network function. You can use the **Serving Endpoint**, **Client Operation**, and **Server Operation** filters to control which operations are shown.
    
    :::image type="content" source="media/packet-core-dashboards/packet-core-http-stats-dashboard.png" alt-text="Screenshot of the H T T P stats dashboard. Panels related to H T T P statistics for the Session Management Function are shown." lightbox="media/packet-core-dashboards/packet-core-http-stats-dashboard.png":::

    - The **4G Interfaces dashboard** displays request and response statistics recorded by each of the packet core instance's 4G interfaces. Note that this dashboard is only available for packet core instances supporting 4G devices.

    :::image type="content" source="media/packet-core-dashboards/packet-core-4g-interfaces-dashboard.png" alt-text="Screenshot of the 4G Interfaces dashboard. Panels related to activity on the packet core instance's 4G interfaces are shown." lightbox="media/packet-core-dashboards/packet-core-4g-interfaces-dashboard.png":::  

#### Filter by data network

Some packet core dashboards can be filtered to show statistics for specific data networks on certain panels.

Where supported, at the top left of the dashboard, a **Data Network** dropdown displays all the data networks for the deployment. Selecting one or more checkboxes next to the data network names applies a filter to the panels that support it. By default all data networks are displayed.

:::image type="content" source="media/packet-core-dashboards/packet-core-data-network-filter.png" alt-text="Screenshot of a dashboard showing a Data Networks dropdown." lightbox="media/packet-core-dashboards/packet-core-data-network-filter.png":::

## Panels and rows

Each dashboard contains **panels** and **rows**.

Each statistic is displayed in a **panel**. The packet core dashboards use the types of panel described in [Types of panel](#types-of-panel).

Panels are organized into **rows**. Each dashboard has a minimum of one row. You can show and hide individual rows by selecting the header of the row.

### Types of panel

The packet core dashboards use the following types of panel. For all panels, you can select the **i** icon in the upper-left corner to display more information about the statistic(s) covered by the panel.

- **Graph** panels are used to display multiple statistics and/or recent changes in a statistic. When you move the mouse over a graph panel, hover help shows the value of the statistic at that moment in time.

    :::image type="content" source="media/packet-core-dashboards/packet-core-graph-panel.png" alt-text="Screenshot of a graph panel in the packet core dashboards. The panel displays information on total throughput statistics.":::

- **Single stat** panels (called "Singlestat" panels in the Grafana documentation) display a single statistic. The statistic might be presented as a simple count or as a gauge. These panels indicate whether a single statistic has exceeded a threshold by their color.

    - The value displayed on a gauge single stat panel is shown in green at normal operational levels, amber when approaching a threshold, and red when the threshold has been breached. 
    - The entirety of a count single stat panel will turn red if a threshold is breached.

    :::image type="content" source="media/packet-core-dashboards/packet-core-single-stat-panels.png" alt-text="Screenshot of two single stat panels in the packet core dashboards. The first panel is a simple count of throughput. The second panel is a gauge displaying C P U utilization.":::

    - **Table** panels display statistics or alerts in a table.

    :::image type="content" source="media/packet-core-dashboards/packet-core-table-panel.png" alt-text="Screenshot of a table panel in the packet core dashboards. The table displays information on currently active alerts.":::

## Switch between dashboards

You can access the lists of available dashboards and switch between them using the drop-down **dashboard links** on the upper right of each dashboard. Dashboards are grouped by the level of information that they provide.

:::image type="content" source="media/packet-core-dashboards/packet-core-dashboard-list.png" alt-text="Screenshot showing the dashboard links available on each packet core dashboard.":::

You can also switch between dashboards by selecting the **dashboard picker**. It's located in the upper-left of the screen and displays the name of the dashboard that you currently have open.

:::image type="content" source="media/packet-core-dashboards/packet-core-dashboard-picker.png" alt-text="Screenshot showing the dashboard picker used to switch between packet core dashboards.":::

You can choose to use the search bar to find a dashboard by name or select from the list of recently viewed dashboards.

:::image type="content" source="media/packet-core-dashboards/packet-core-dashboard-picker-drop-down.png" alt-text="Screenshot showing the drop-down menu of the dashboard picker. A search bar is displayed, along with a list of available dashboards.":::

## Adjust the time range

The **Time picker** in the top right-hand corner of each packet core dashboard allows you to adjust the time range for which the dashboard will display statistics. You can use the time picker to retrieve diagnostics for historical problems. You can choose a relative time range (such as the last 15 minutes), or an absolute time range (such as statistics for a particular month). You can also use the **Refresh dashboard** icon to configure how regularly the statistics displayed on the dashboard will be updated. For detailed information on using the time range controls, see [Time range controls](https://grafana.com/docs/grafana/v6.1/reference/timerange/) in the Grafana documentation.

:::image type="content" source="media/packet-core-dashboards/packet-core-dashboard-time-picker.png" alt-text="Screenshot showing the time picker for the packet core dashboards. There are options for setting a custom time range or choosing one of several commonly used quick ranges.":::

## Next steps

- [Learn more about the distributed tracing web GUI](distributed-tracing.md)
