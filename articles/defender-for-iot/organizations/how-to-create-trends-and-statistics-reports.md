---
title: Generate trends and statistics reports
description: Gain insight into network activity, statistics, and trends by using Defender for IoT Trends and Statistics widgets.
ms.date: 2/21/2021
ms.topic: how-to
---

# Sensor trends and statistics reports

You can create widget graphs and pie charts to gain insight into network trends and statistics. Widgets can be grouped under user-defined dashboards.

> [!NOTE]
> Administrator and security analysts can create Trends and Statistics reports.

The dashboard consists of widgets that graphically describe the following types of information:

- Traffic by port
- Top traffic by port
- Channel bandwidth
- Total bandwidth
- Active TCP connection
- Top Bandwidth by VLAN
- Devices:
  - New devices
  - Busy devices
  - Devices by vendor
  - Devices by OS
  - Number of devices per VLAN
  - Disconnected devices
- Connectivity drops by hours
- Alerts for incidents by type
- Database table access
- Protocol dissection widgets
- DELTAV
  - DeltaV roc operations distribution
  - DeltaV roc events by name
  - DeltaV events by time
- AMS
  - AMS traffic by server port
  - AMS traffic by command
- Ethernet and IP address:
  - Ethernet and IP address traffic by CIP service
  - Ethernet and IP address traffic by CIP class
  - Ethernet and IP address traffic by command
- OPC:
  - OPC top management operations
  - OPC top I/O operations
- Siemens S7:
  - S7 traffic by control function
  - S7 traffic by subfunction
- VLAN
  - Number of devices per VLAN
  - Top bandwidth by VLAN
- 60870-5-104
  - IEC-60870 Traffic by ASDU
- BACNET
  - BACnet Services
- DNP3
  -	DNP3 traffic by function
- SRTP:
  - SRTP traffic by service code
  - SRTP errors by day
- SuiteLink:
  - SuiteLink top queried tags
  - SuiteLink numeric tag behavior
- IEC-60870 traffic by ASDU
- DNP3 traffic by function
- MMS traffic by service
- Modbus traffic by function
- OPC-UA traffic by service

> [!NOTE]
>  The time in the widgets is set according to the sensor time.

## Create reports

To see dashboards and widgets:

Select **Trends & Statistics** on the side menu.

:::image type="content" source="media/how-to-generate-reports/investigation-screenshot.png" alt-text="Screenshot of an investigation.":::

By default, results are displayed for detections over the last seven days. You can use filter tools change this range. For example, a free text search.

## Create a Dashboard

Create a new dashboard by selecting the **Dashboard** drop-down menu. You can create and add as many widgets to a dashboard.

You can create customized dashboards using the following options:

- Add a widget to the dashboard

- Delete a widget from the dashboard

- Modify a widget’s filter

- Resize a widget

- Change the location of a widget

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/pin-a-dashboard.png" alt-text="Change the location of a widget.":::

To create a customized dashboard:

1. Select **Trends and Statistics** from the left panel.

1. Select the **Select Dashboard** drop down menu, and select the **Create Dashboard** button.

1. Enter a meaningful name for the new dashboard, and select **Create**.

1. Select **Add Widget** at the top left of the page.

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/widget-store.png" alt-text="Select the widget from the widget store.":::

1. **Security**, and **Operational** widgets are available at the top right of the window. Choose from various categories, and protocols. A brief description with a miniature graphic appears with each widget. Use the scroll bar to see all available widgets.

1. Select a widget using the **Click to Add** button. The widget is immediately displayed on the dashboard.

To delete a dashboard:

1. Select the name of the dashboard from the drop-down menu.

1. Select the **Delete** icon, and then select **OK**.

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/garbage-icon.png" alt-text="Select the delete icon to delete the dashboard.":::

To edit a dashboard name:

1. Select the name of the dashboard from the drop-down menu.

1. Select the **Edit** icon.
  
  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/edit-name.png" alt-text="Select the edit icon to edit the name of your dashboard.":::

1. Enter a new name for the dashboard, and select **Save**.
 
To set the default dashboard:

1. Select the name of the dashboard from the drop-down menu.

1. Select the **Star** icon to select the dashboard to be set as the default dashboard.

   :::image type="content" source="media/how-to-create-trends-and-statistics-reports/default-dashboard.png" alt-text="Select the star icon to choose your default dashboard."::: 

To modify filtering data in a widget:

1. Select the **Filter** icon.

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/filter-widget.png" alt-text="Select the filter icon to set parameters for your widget.":::

1. Edit the required parameters.

1. Select **OK**.

To delete a widget:

- Select the :::image type="icon" source="media/how-to-create-trends-and-statistics-reports/x-icon.png" border="false"::: icon.

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/delete-widget.png" alt-text="Select the X to delete the widget.":::

## Creating widgets 

The Widget Store allows you to select widgets by category and protocol. You can display the **Security**, or **Operational** widgets available by selecting them.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/widget-store.png" alt-text="Select your widget from the Widget Store.":::

Each widget contains specific information about system traffic, network statistics, protocol statistics, device, and alert information. A message is displayed when there is no data for a widget.

You can remove a section from the pie, in a pie chart, to see the relative significance of the remaining slices more clearly. Select the slice’s name in the legend at the bottom of the screen to do this.

The following sections present examples of use cases for a few of the widgets.

### Busy devices widget

This widget lists the top five busiest devices. In **Edit** mode, you can filter by known Protocols.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/busy-device.png" alt-text="A view of the busy device widget.":::

### Total bandwidth widget

This widget tracks the bandwidth in Mbps (megabits per second). The bandwidth is indicated on the y-axis, with the date appearing on the x-axis. **Edit** mode allows you to filter results according to Client, Server, Server Port, or Subnet. A tooltip appears when you hover the cursor over the graph.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/total-bandwidth.png" alt-text="A view of the total bandwidth widget.":::

### Channels bandwidth widget

This widget displays the top five traffic channels. You can filter by Address, and set the number of Presented Results. Select the down arrow to show more channels.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/channels-bandwidth.png" alt-text="A view of the channels bandwidth widget.":::

### Traffic by port widget

This widget displays the traffic by port, which is indicated by a pie chart with each port designated by a different color. The amount of traffic in each port is proportional to the size of its part of the pie.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/traffic-by-port.png" alt-text="A view of the traffic by port widget.":::

### New devices widget

This widget displays the new devices bar chart, which indicates how many new devices were discovered on a particular date.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/new-devices.png" alt-text="A view of the new devices widget.":::

### Protocol dissection widgets

This widget displays a pie chart that provides you with a look at the traffic per protocol, dissected by function codes, and services. The size of each slice of the pie is proportional to the amount of traffic relative to the other slices.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/protocol-dissection.png" alt-text="A view of the protocol dissection widget.":::

### Active TCP connections widget

This widget displays a chart that shows the number of active TCP connections in the system.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/active-tcp.png" alt-text="A view of the Active TCP connections widget.":::

### Incident by type widget

This widget displays a pie chart that shows the number of incidents by type. This is the number of alerts generated by each engine over a predefined time period.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/incident-by-type.png" alt-text="A view of the incident by type widget.":::

## Devices by vendor widget

This widget displays a pie chart that shows the number of devices by vendor. The number of devices for a specific vendor is proportional to the size of that device’s vendor part of the disk relative to other device vendors.

## Number of devices per VLAN widget

This widget displays a pie chart that shows the number of discovered devices per VLAN. The size of each slice of the pie is proportional to the number of discovered devices relative to the other slices.

Each VLAN appears with the VLAN tag assigned by the sensor or name that you have manually added.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/number-of-devices.png" alt-text="A view of the number of devices widget.":::

### Top bandwidth by VLAN widget

This widget displays the bandwidth consumption by VLAN. By default, the widget shows five VLANs with the highest bandwidth usage.

You can filter the data by the period presented in the widget. Select the down arrow to show more results.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/top-bandwidth.png" alt-text="A view of the top bandwidth by VLAN widget.":::

## System report

To download the system report: 

1. Select **Trends & Statistics** on the side menu.

1. Select **System Report** at the top-right corner. The report will download automatically.

  :::image type="content" source="media/how-to-create-trends-and-statistics-reports/system-report.png" alt-text="Select the system report button to download a copy of the system report.":::

The System Report is a PDF file containing all the data in the system:

  - Devices

  - Alerts

  - Network Policy Information

## Devices in a system report 

The System Report shows a list of all devices, and their information. For example, Type, Name, and Protocols used. The System Report also shows a list of devices per vendor.

## Alerts in system report 

The System Report shows a list of all alerts with their information such as Date, and Severity.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/alerts-report.png" alt-text="A view of the alerts on the system reports.":::

## Network information in system report 

The System Report shows in detail, your network baseline. For example, DNP3 function code, and open ports per connection.

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/dnp3.png" alt-text="A view of the DNP3 function from the system report.":::

:::image type="content" source="media/how-to-create-trends-and-statistics-reports/open-port.png" alt-text="A view of the open port per connection report.":::

## See also

[Risk assessment reporting](how-to-create-risk-assessment-reports.md)
[Sensor data mining queries](how-to-create-data-mining-queries.md)
[Attack vector reporting](how-to-create-attack-vector-reports.md)
