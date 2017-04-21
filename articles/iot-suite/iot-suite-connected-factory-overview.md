---
title: Get started with preconfigured solutions | Microsoft Docs
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 6ab38d1a-b564-469e-8a87-e597aa51d0f7
ms.service: iot-suite
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/15/2017
ms.author: dobett

---
# Tutorial: Get started with the connected factory preconfigured solution
## Introduction
Azure IoT Suite [preconfigured solutions][lnk-preconfigured-solutions] combine multiple Azure IoT services to deliver end-to-end solutions that implement common IoT business scenarios. The *connected factory* preconfigured solution connects to and monitors your industrial devices. You can use the solution to analyze the stream of data from your devices and to drive operational productivity and profitability.

This tutorial shows you how to provision the connected factory preconfigured solution. It also walks you through the basic features of the preconfigured solution. You can access many of these features from the solution *dashboard* that deploys as part of the preconfigured solution:

![connected factory preconfigured solution dashboard][img-cf-home]

To complete this tutorial, you need an active Azure subscription.

> [!NOTE]
> If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk_free_trial].
> 
> 

## Provision the solution

1. Log on to azureiotsuite.com using your Azure account credentials, and click + to create a solution.
2. Click **Select** on the **Connected factory** tile.
3. Enter a **Solution name** for your remote monitoring preconfigured solution.
4. Select the **Region** and **Subscription** you want to use to provision the solution.
5. Click **Create Solution** to begin the provisioning process. This process typically takes several minutes to run.

### Wait for the provisioning process to complete

1. Click the tile for your solution with **Provisioning** status.
2. Notice the **Provisioning states** as Azure services are deployed in your Azure subscription.
3. Once provisioning completes, the status changes to **Ready**.
4. Click the tile to see the details of your solution in the right-hand pane.

> [!NOTE]
> If you encounter issues deploying the preconfigured solution, review [Permissions on the azureiotsuite.com site][lnk-permissions] and the [FAQ][lnk-faq]. If the issues persist, create a service ticket on the [portal][lnk-portal].

Are there details you'd expect to see that aren't listed for your solution? Give us feature suggestions on [User Voice](https://feedback.azure.com/forums/321918-azure-iot).

## Scenario overview

When you deploy the connected factory preconfigured solution, it is prepopulated with resources that enable you to step through a common industrial scenario. In this scenario, several factories connected to the solution are reporting overall equipment efficiency (OEE) and key performance indicators (KPIs). The following sections show you how to:

* Monitor factory, production lines, station OEE, and KPI values
* Analyze the telemetry data generated from these devices using Azure Time Series Insights
* Fix issues by taking actions on alerts generated

A key feature of this scenario is that you can perform all these actions remotely from the solution dashboard. You do not need physical access to the devices.

## View the solution dashboard

The solution dashboard enables you to manage the deployed solution. It is a hierachirical representation of a global factory configuration. For example, you can view OEE and KPIs, publish new nodes for telemetry and action alerts.

1. When the provisioning is complete and the tile for your preconfigured solution indicates **Ready**, choose **Launch** to open your connected factory solution portal in a new tab.

    ![Launch the preconfigured solution][img-launch-solution]

1. By default, the solution portal shows the *dashboard*. You can navigate to other areas of the solution portal using the menu on the left-hand side of the page.

    ![Connected factory preconfigured solution dashboard][cf-img-menu]

The dashboard displays the following information:

* A **Factory list** panel that shows the status, location and current production configuration in the solution. When you first run the solution, there are [still being finalized] simulated devices. The production line simulation is composed of three real OPC UA servers per assembly line with simulated tasks being performed and sharing data. The production line is controlled by a simple Manufacturing Execution System (MES) via OPC UA. The simulated devices are OPC UA servers running in virtual machines each running in their own Docker Container.
* A **map** that displays the location of each device connected to the solution. The solution uses the Bing Maps API to plot information on the map. The locations on the map can be clicked and display details of the production lines at that location. See the [FAQ][lnk-faq] to learn how to make the map dynamic. 
* An **Alerts** panel that displays alerts generated by the devices when a telemetry value has exceeded a specific threshold.
* An **Overall Equipment Efficiency** panel that shows the OEE value for the devices. This value is aggregated from the station view to the global factory level. The OEE figure and its constituent elements can be further analyzed.
* **Key Performance Indicators** panel that displays the number of units produced and energy used by the devices. These values are aggregated from a station view to the global factory level.

## View factories

The *Factories* panel shows you the geographical location of all the factories in the solution, their status, and current production configuration. From the locations list, you can navigate to the other levels in the solution hierarchy. The location names in the list are hyperlinks that when clicked display details of the production lines at that location. It is then possible to drill into the production line details and down to the station level view. You can also filter the list of devices in the factory list.

![Connected factory preconfigured solution factories][cf-img-factories] 

1. The **Factory panel** shows the factory list for this solution.

2. The device list initially shows six simulated factories created by the provisioning process. You can add additional simulated and physical devices to the solution.

3. To view the details of the factory, click the location of the factory in the factory list.

4. To view the details of the production line, click the production line name in the factory list.
   
5. To view the configuration of the stations on the production line, click the station name in the factory list.

6. To view details on specific nodes in the station, click on the name. This launches the context panel with Azure Time Series Insights visualizations. Click these graphs to do further analysis in the Azure Time Series Insights explorer environment.

## View map

The *Factories* map shows you the geographical location and status of all the factories in the solution. The locations displayed on the map can be clicked to drill into the location details.

![Connected factory preconfigured solution map][cf-img-map] 

## View alerts

The alert history panel at the global level shows you the alerts that are being generated from all your devices due to them reporting higher than expected telemetry values. This panel displays alerts at each level of the hierarchy from the station level view to the global view. The alerts contain a description of the alert, date, time, location, and number of occurrences. You can gain deeper insights in to the data that resulted in the alert being created using the Azure Time Series Insights data, which is visualized in the alerts where applicable. You can take actions directly on the alerts such as:

- Close the alert.
- Acknowledge the alert.
- Show sensor data.
- Call a method on the device to reset it.

    ![Connected factory preconfigured solution alerts][cf-img-alerts]

> [!NOTE]
> These alerts are generated by rules that are included in the preconfigured solution. These rules generate alerts when the OEE figure, its constituent elements, and the key performance indicator values exceed the thresholds.  

1. The **Alerts panel** shows the alerts generated in this solution.

2. To view the details of an alert, click on the alert in the alerts panel.

![Connected factory preconfigured solution alerts panel][cf-img-alerts-panel]

3. To further analyze the alert data, click on the graph in the alert panel to open the Azure Time Series Insights explorer environment.

4. To address the alert, several actions are available in the alert panel. Choose the appropriate option for you and click the execute action command button.

## View overall equipment efficiency
OEE identifies the percentage of manufacturing time that is productive. This is a standard industry measure and is calculated by multiplying the availability rate, performance rate, and quality rate: OEE = availability x performance x quality.

![Connected factory preconfigured solution oee][cf-img-oee]

1. To view OEE for any level in the hierarchy, navigate to the specific view you require, the OEE for that view is displayed in the panel along with each of the elements that make up the OEE percentage.  

2. To further analyze the OEE for any level in the hierarchy data click on either the OEE percentage, availability percentage, performance percentage, or quality percentage. A context panel appears with Azure Time Series Insights powered visualizations enabling you view data from the last hour, last 24 hours and last 7 days.

![Connected factory preconfigured solution tsi visualization][cf-img-tsi-visualization]

3. To further analyze the alert data click on the graph in the alert panel, this opens the the Azure Time Series Insights explorer environment.

![Connected factory preconfigured solution tsi explorer][cf-img-tsi-explorer]

## View Key Performance Indicators
The solution provides two key performance indicators, *units per hour* and *energy used in kWh*. 

![Connected factory preconfigured solution kpi][cf-img-kpi]

1. To view units per hour or energy used for any level in the hierarchy, navigate to the specific view you require, the units per hour and energy used are displayed in the panel. 

2.  To further analyze units per hour or energy used for any level in the hierarchy data, click either the units produced or energy used gauge in the **Key Performance Indicators** panel. A context panel appears with Azure Time Series Insights powered visualizations enabling you to view data from the last hour, the last 24 hours, and last 7 days.

## Scenario review

In this scenario, you monitored your factories OEE and KPIs values, in the dashboard. You then used Azure Time Series Insights to provide more information to help drill further into the telemetry data for OEE and KPIs to help with detecting anomalies. You also used the alert panel to view issues with your factories and you used the actions available to you to resolve the alert.

## Other features

The following sections describe some additional features of the connected factory preconfigured solution that are not described as part of the previous scenario.

## Apply filters ##

1. Click the **chevron** to display a list of available filters in either the factory locations panel or the alerts panel.

2. The filters panel is displayed for you. 

3. Choose the filter that you require, it is also possible to type free text into the filter fields if you require.

The filter is then applied for you. The filter state is also shown in the dashboard via a funnel which is displayed in the factories and alerts tables.

5. To clear a filter, click on the funnel and click filter in the filter context panel. The text **All** is displayed in the factories and alerts tables.

## Browse an OPC Server

When you deploy the preconfigured solution, you automatically provision simulated  OPC servers that you can browse via the solution browser. These servers are *simulated OPC UA servers*. Simulated servers make it easy for you to experiment with the preconfigured solution without the need to deploy real, physical servers. If you do want to connect a real OPC UA server to the solution, see the [Connect your OPC UA device to the connected factory preconfigured solution][lnk-connect-cf] tutorial.

1. Click on the **factory icon** in the dashboard navigation bar.

![Connected factory preconfigured solution server browser][cf-img-server-browser]

2. Choose one of the servers in from the preconfigured list. These are the list of servers that are deployed for you in the preconfigured solution. 

![Connected factory preconfigured solution server selection][cf-img-server-choice]

3. Click **Connect**, a security dialog is displayed. For the simulation it is okay to click **Proceed**

4. Click on any of the nodes in the server tree to expand it. Nodes that are publishing telemetry will have a tick mark beside them.

![Connected factory preconfigured solution server tree][cf-img-server-tree]

5. Right-clicking on a item will depending on your permissions allow you read or publish that particular node. Click read option and a context panel is displayed showing the value of the specific node.

## Publish a node

When you browse a *simulated OPC UA server* you can also choose to publish new nodes. The telemetry from these nodes can then be analyzed in the solution. Again as these are *simulated OPC UA servers* this makes it easy for you to experiment with the preconfigured solution without the need to deploy real, physical devices.

1. Browse to a node in the OPC UA server browser tree that you wish to publish.

2. Right click on the node.

3. Choose Publish.

![Connected factory preconfigured solution publish node][cf-img-publish-node]

4. A context panel appears which tells you that the publish has succeeded. The published node will appear in the station level view for the location, production line you choose to browse.

![Connected factory preconfigured solution publish success][cf-img-publish-success]

## Command and Control

The connected factory allows you command and control your industry devices directly from the cloud. A typical usage of this would be in response to an alert generated by the device you could then take an action directly on the device from the cloud. The commands available to you use are in the StationCommands node in the OPC UA servers in the preconfigured solution. In this scenario you are opening a pressure release valve on the assembly station of a production line in Munich. 

1. Browse to the StationCommands node in the OPC UA server browser tree.

2. Choose the command that you wish use.

3. Right click on the node.

4. Choose Call.

![Connected factory preconfigured solution call command][cf-img-call-command]

5. A context panel appears informing you which method you are about to call and any parameter details is applicable.

6. Choose Call.

![Connected factory preconfigured solution call context][cf-img-call-context]

7. The context panel is updated to inform you that the method call has succeeded. You can verify this by then reading the value of the pressure node which will have updated as a result of the call.

![Connected factory preconfigured solution call success][cf-img-call-success]


## Behind the scenes

When you deploy a preconfigured solution, the deployment process creates multiple resources in the Azure subscription you selected. You can view these resources in the Azure [portal][lnk-portal]. The deployment process creates a **resource group** with a name based on the name you choose for your preconfigured solution:

![Preconfigured solution in the Azure portal][img-cf-portal]

You can view the settings of each resource by selecting it in the list of resources in the resource group.

You can also view the source code for the preconfigured solution. The connected factory preconfigured solution source code is in the [azure-iot-connected-factory][lnk-cfgithub] GitHub repository:

When you are done, you can delete the preconfigured solution from your Azure subscription on the [azureiotsuite.com][lnk-azureiotsuite] site. This site enables you to easily delete all the resources that were provisioned when you created the preconfigured solution.

> [!NOTE]
> To ensure that you delete everything related to the preconfigured solution, delete it on the [azureiotsuite.com][lnk-azureiotsuite] site and do not delete the resource group in the portal.

## Next Steps

Now that you’ve deployed a working preconfigured solution, you can continue getting started with IoT Suite by reading the following articles:

* [Connected factory preconfigured solution walkthrough][lnk-rm-walkthrough]
* [Connect your device to the Connected factory preconfigured solution][lnk-connect-cf]
* [Permissions on the azureiotsuite.com site][lnk-permissions]

[img-cf-home]:media/iot-suite-connected-factory-overview/CF-dashboard.png
[img-launch-solution]: media/iot-suite-connected-factory-overview/launch-CF.png
[cf-img-menu]: media/iot-suite-connected-factory-overview/CF-dashboard-menu.png
[cf-img-factories]:media/iot-suite-connected-factory-overview/CF-dashboard-factory.png
[cf-img-map]:media/iot-suite-connected-factory-overview/CF-dashboard-map.png 
[cf-img-alerts]:media/iot-suite-connected-factory-overview/CF-dashboard-alerts.png
[cf-img-oee]:media/iot-suite-connected-factory-overview/CF-dashboard-oee.png
[cf-img-kpi]:media/iot-suite-connected-factory-overview/CF-dashboard-kpi.png
[cf-img-tsi-visualization]:media/iot-suite-connected-factory-overview/CF-dashboard-TSI.png
[cf-img-tsi-explorer]:media/iot-suite-connected-factory-overview/TSI-explorer.png
[cf-img-server-browser]: media/iot-suite-connected-factory-overview/CF-dashboard-browser.png
[cf-img-server-choice]: media/iot-suite-connected-factory-overview/CF-select-server.png
[cf-img-server-tree]:media/iot-suite-connected-factory-overview/CF-server-tree.png
[cf-img-publish-node]:media/iot-suite-connected-factory-overview/CF-publish-node1.png
[cf-img-publish-success]:media/iot-suite-connected-factory-overview/CF-publish-success.png
[cf-img-call-command]:media/iot-suite-connected-factory-overview/CF-Command-and-control-call.png
[cf-img-call-context]:media/iot-suite-connected-factory-overview/CF-Command-and-control-call-button.png
[cf-img-call-success]:media/iot-suite-connected-factory-overview/CF-Command-and-control-succeed.png
[img-cf-portal]:media/iot-suite-connected-factory-overview/CF-resource-group.png

[lnk_free_trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-preconfigured-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-azureiotsuite]: https://www.azureiotsuite.com
[lnk-logic-apps]: https://azure.microsoft.com/documentation/services/app-service/logic/
[lnk-portal]: http://portal.azure.com/
[lnk-cfgithub]: https://github.com/Azure/azure-iot-connected-factory
[lnk-logicapptutorial]: iot-suite-logic-apps-tutorial.md
[lnk-rm-walkthrough]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-connect-cf]: iot-suite-connected-factory-gateway-deployment.md
[lnk-permissions]: iot-suite-permissions.md
[lnk-c2d-guidance]: ../iot-hub/iot-hub-devguide-c2d-guidance.md
[lnk-faq]: iot-suite-faq.md