---
title: Customize Azure IoT Suite connected factory | Microsoft Docs
description: A description of how to customize the behavior of the connected factory preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 
ms.service: iot-suite
ms.devlang: c#
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/03/2017
ms.author: dobett

---
# Customize how the connected factory solution displays data from your OPC UA servers

## Introduction

The connected factory solution aggregates and displays data from the OPC UA servers connected to the solution. In some cases, you can control devices connected to your OPC UA servers by sending messages from the solution through the OPC UA servers.

Examples of the data aggregated by the solution include the Overall Equipment Efficiency (OEE) and Key Performance Indicators (KPIs) that you can see in the dashboard at the factory, line, and station levels. The following screenshot shows the OEE and KPI values for the **Assembly** station, on **Production line 1**, in the **Munich** factory:

![Example of OEE and KPI values in the solution][img-oee-kpi]

The solution enables you to view detailed information from specific data items from the OPC UA server. The following screenshot shows plots of the number of manufactured items from a specific station:

![Plots of number of manufactured items][img-manufactured-items]

You can explore the data further using Time Series Insights (TSI) if you click on one of the graphs:

![Explore data using Time Series Insights][img-tsi]

This article describes:

- How the data is made available to the various views in the solution.
- How you can customize the way the solution displays the data.

## Data sources

The data displayed in the connected factory solution comes from OPC UA servers connected to the solution. The default installation includes several OPC UA simulators. You can add real OPC UA servers  that [connect through a gateway][lnk-connect-cf] to your solution.

You can browse the data items that a connected OPC UA server can send to your solution in the dashboard:

1. Navigate to the **Select an OPC UA server** view:

    ![Navigate to the Select an OPC UA server view][img-select-server]

1. Select a server an click **Connect**. Click **Proceed** when the security warning appears.

1. You can now browse the data items that the server can send to the solution. Items that are being sent to the solution have a green check mark:

    ![Published items][img-published]

1. If you have the necessary permissions, you can choose to publish a data item to make it available in the connected factory solution.

## Map the data

The connected factory solution maps and aggregates the published data items from the OPC UA server to the various views in the solution. The mapping is stored in a JSON file that is part of the solution deployed to your Azure account. You can view and modify this JSON file in the connected factory Visual Studio solution.

To clone a copy of the connected factory Visual Studio solution, use the following git command:

`git clone https://github.com/Azure/azure-iot-connected-factory.git`

The mapping from the OPC UA server data items to the connected factory solution views is defined in the file ContosoTopologyDescription.json. This configuration file is located in the Contoso\Topology folder in the WebApp project.

The content of the JSON file is organized into a hierarchy of factories, production lines, and stations. This hierarchy defines the navigation hierarchy in the connected factory dashboard. Values at each node of the hierarchy determine the information displayed in the dashboard. For example, the JSON file contains the following values for the Munich factory:

```json
"Guid": "73B534AE-7C7E-4877-B826-F1C0EA339F65",
"Name": "Munich",
"Description": "Braking system",
"Location": {
    "City": "Munich",
    "Country": "Germany",
    "Latitude": 48.13641,
    "Longitude": 11.57754
},
"Image": "munich.jpg"
```

The name, description and location (if you have enabled dynamic mapping) appear on this view in the dashboard:

![Munich data in the dashboard][img-munich]

## Next Steps

Learn more about the connected factory preconfigured solution by reading the following articles:

* [Connected factory preconfigured solution walkthrough][lnk-rm-walkthrough]
* [Connect your device to the Connected factory preconfigured solution][lnk-connect-cf]
* [Permissions on the azureiotsuite.com site][lnk-permissions]
* [FAQ][lnk-faq]


[img-oee-kpi]: ./media/iot-suite-connected-factory-customize/oeenadkpi.png
[img-manufactured-items]: ./media/iot-suite-connected-factory-customize/manufactured.png
[img-tsi]: ./media/iot-suite-connected-factory-customize/tsi.png
[img-select-server]: ./media/iot-suite-connected-factory-customize/selectserver.png
[img-published]: ./media/iot-suite-connected-factory-customize/published.png
[img-munich]: ./media/iot-suite-connected-factory-customize/munich.png

[lnk-rm-walkthrough]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-connect-cf]: iot-suite-connected-factory-gateway-deployment.md
[lnk-permissions]: iot-suite-permissions.md
[lnk-faq]: iot-suite-faq.md