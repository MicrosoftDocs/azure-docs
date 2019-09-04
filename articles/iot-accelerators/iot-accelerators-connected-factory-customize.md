---
title: Customize the Connected Factory solution - Azure | Microsoft Docs
description: A description of how to customize the behavior of the Connected Factory solution accelerator.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.devlang: csharp
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: dobett
---

# Customize how the Connected Factory solution displays data from your OPC UA servers

The Connected Factory solution aggregates and displays data from the OPC UA servers connected to the solution. You can browse and send commands to the OPC UA servers in your solution. For more information about OPC UA, see the [Connected Factory FAQ](iot-accelerators-faq-cf.md).

Examples of aggregated data in the solution include the Overall Equipment Efficiency (OEE) and Key Performance Indicators (KPIs) that you can view in the dashboard at the factory, line, and station levels. The following screenshot shows the OEE and KPI values for the **Assembly** station, on **Production line 1**, in the **Munich** factory:

![Example of OEE and KPI values in the solution][img-oee-kpi]

The solution enables you to view detailed information from specific data items from the OPC UA servers, called *stations*. The following screenshot shows plots of the number of manufactured items from a specific station:

![Plots of number of manufactured items][img-manufactured-items]

If you click one of the graphs, you can explore the data further using Time Series Insights (TSI):

![Explore data using Time Series Insights][img-tsi]

This article describes:

- How the data is made available to the various views in the solution.
- How you can customize the way the solution displays the data.

## Data sources

The Connected Factory solution displays data from the OPC UA servers connected to the solution. The default installation includes several OPC UA servers running a factory simulation. You can add your own OPC UA servers that [connect through a gateway][lnk-connect-cf] to your solution.

You can browse the data items that a connected OPC UA server can send to your solution in the dashboard:

1. Choose **Browser** to navigate to the **Select an OPC UA server** view:

    ![Navigate to the Select an OPC UA server view][img-select-server]

1. Select a server and click **Connect**. Click **Proceed** when the security warning appears.

    > [!NOTE]
    > This warning only appears once for each server and establishes a trust relationship between the solution dashboard and the server.

1. You can now browse the data items that the server can send to the solution. Items that are being sent to the solution have a check mark:

    ![Published items][img-published]

1. If you are an *Administrator* in the solution, you can choose to publish a data item to make it available in the Connected Factory solution. As an Administrator, you can also change the value of data items and call methods in the OPC UA server.

## Map the data

The Connected Factory solution maps and aggregates the published data items from the OPC UA server to the various views in the solution. The Connected Factory solution deploys to your Azure account when you provision the solution. A JSON file in the Visual Studio Connected Factory solution stores this mapping information. You can view and modify this JSON configuration file in the Connected Factory Visual Studio solution. You can redeploy the solution after you make a change.

You can use the configuration file to:

- Edit the existing simulated factories, production lines, and stations.
- Map data from real OPC UA servers that you connect to the solution.

For more information about mapping and aggregating the data to meet your specific requirements, see [How to configure the Connected Factory solution accelerator
](iot-accelerators-connected-factory-configure.md).

## Deploy the changes

When you have finished making changes to the **ContosoTopologyDescription.json** file, you must redeploy the Connected Factory solution to your Azure account.

The **azure-iot-connected-factory** repository includes a **build.ps1** PowerShell script you can use to rebuild and deploy the solution.

## Next Steps

Learn more about the Connected Factory solution accelerator by reading the following articles:

* [Permissions on the azureiotsolutions.com site][lnk-permissions]
* [Connected Factory FAQ](iot-accelerators-faq-cf.md)
* [FAQ][lnk-faq]


[img-oee-kpi]: ./media/iot-accelerators-connected-factory-customize/oeenadkpi.png
[img-manufactured-items]: ./media/iot-accelerators-connected-factory-customize/manufactured.png
[img-tsi]: ./media/iot-accelerators-connected-factory-customize/tsi.png
[img-select-server]: ./media/iot-accelerators-connected-factory-customize/selectserver.png
[img-published]: ./media/iot-accelerators-connected-factory-customize/published.png


[lnk-permissions]: iot-accelerators-permissions.md
[lnk-faq]: iot-accelerators-faq.md