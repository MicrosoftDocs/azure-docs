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
ms.date: 05/04/2017
ms.author: dobett

---
# Customize how the connected factory solution displays data from your OPC UA servers

## Introduction

The connected factory solution aggregates and displays data from the OPC UA servers connected to the solution. You can browse and send commands to the OPC UA servers in your solution. For more information about OPC UA, see the [FAQ][lnk-faq].

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

The connected factory solution displays data from the OPC UA servers connected to the solution. The default installation includes several OPC UA servers running a factory simulation. You can add your own OPC UA servers that [connect through a gateway][lnk-connect-cf] to your solution.

You can browse the data items that a connected OPC UA server can send to your solution in the dashboard:

1. Navigate to the **Select an OPC UA server** view:

    ![Navigate to the Select an OPC UA server view][img-select-server]

1. Select a server and click **Connect**. Click **Proceed** when the security warning appears.

    > [!NOTE]
    > This warning only appears once for each server and establishes a trust relationship between the solution dashboard and the server.

1. You can now browse the data items that the server can send to the solution. Items that are being sent to the solution have a green check mark:

    ![Published items][img-published]

1. If you are an *Administrator* in the solution, you can choose to publish a data item to make it available in the connected factory solution. As an Administrator, you can also change the value of data items and call methods in the OPC UA server.

## Map the data

The connected factory solution maps and aggregates the published data items from the OPC UA server to the various views in the solution. The connected factory solution deploys to your Azure account when you provision the solution. A JSON file in the Visual Studio connected factory solution stores this mapping information. You can view and modify this JSON configuration file in the connected factory Visual Studio solution and redeploy it.

You can use the configuration file to:

- Edit the existing simulated factories, production lines, and stations.
- Map data from real OPC UA servers that you connect to the solution.

To clone a copy of the connected factory Visual Studio solution, use the following git command:

`git clone https://github.com/Azure/azure-iot-connected-factory.git`

The file **ContosoTopologyDescription.json** defines the mapping from the OPC UA server data items to the views in the connected factory solution dashboard. You can find this configuration file in the **Contoso\Topology** folder in the **WebApp** project in the Visual Studio solution.

The content of the JSON file is organized as a hierarchy of factory, production line, and station nodes. This hierarchy defines the navigation hierarchy in the connected factory dashboard. Values at each node of the hierarchy determine the information displayed in the dashboard. For example, the JSON file contains the following values for the Munich factory:

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

The name, description, and location appear on this view in the dashboard:

![Munich data in the dashboard][img-munich]

Each factory, production line, and station has an image property. You can find these JPEG files in the **Content\img** folder in the **WebApp** project. These image files display in the connected factory dashboard.

Each station includes several detailed properties that define the mapping from the OPC UA data items. These properties are described in the following sections:

### OpcUri

The **OpcUri** value is the OPC UA Application URI that uniquely identifies the OPC UA server. For example, the **OpcUri** value for the assembly station on production line 1 in Munich looks like this: **urn:scada2194:ua:munich:productionline0:assemblystation**.

You can view the URIs of the connected OPC UA servers in the solution dashboard:

![View OPC UA server URIs][img-server-uris]

### Simulation

The information in the **Simulation** node is specific to the OPC UA simulation that runs in the OPC UA servers that are provisioned by default. It is not used for a real OPC UA server.

### Kpi1 and Kpi2

These nodes describe how data from the station contributes to the two KPI values in the dashboard. In a default deployment, these KPI values are units per hour and kWh per hour. The solution calculates KPI vales at the level of a station and aggregates them at the production line and factory levels.

Each KPI has a minimum, maximum, and target value. Each KPI value can also define alert actions for the connected factory solution to perform. The following snippet shows the KPI definitions for the assembly station on production line 1 in Munich:

```json
"Kpi1": {
  "Minimum": 150,
  "Target": 300,
  "Maximum": 600
},
"Kpi2": {
  "Minimum": 50,
  "Target": 100,
  "Maximum": 200,
  "MinimumAlertActions": [
    {
      "Type": "None"
    }
  ]
}
```

The following screenshot shows the KPI data in the dashboard.

![KPI information in the dashboard][lnk-kpi]

### OpcNodes

The **OpcNodes** nodes identify the published data items from the OPC UA server and specify how to process that data.

The **NodeId** value identifies the specific OPC UA NodeID from the OPC UA server. The first node in the assembly station for production line 1 in Munich has a value **ns=2;i=385**. A **NodeId** value specifies the data item to read from the OPC UA server, and the **SymbolicName** provides a user-friendly name to use in the dashboard for that data.

Other values associated with each node are summarized in the following table:

| Value | Description |
| ----- | ----------- |
| Relevance  | The KPI and OEE values this data contributes to. |
| OpCode     | How the data is aggregated. |
| Units      | The units to use in the dashboard.  |
| Visible    | Whether to display this value in the dashboard. Some values are used in calculations but not displayed.  |
| Maximum    | The maximum value that triggers an alert in the dashboard. |
| MaximumAlertActions | An action to take in response to an alert. For example, send a command to a station. |
| ConstValue | A constant value used in a calculation. |

## Deploy the changes

When you have finished making changes to the **ContosoTopologyDescription.json** file, you must redeploy the connected factory solution to your Azure account.

The **azure-iot-connected-factory** repository includes a **build.ps1** PowerShell script you can use to rebuild and deploy the solution.

## Next Steps

Learn more about the connected factory preconfigured solution by reading the following articles:

* [Connected factory preconfigured solution walkthrough][lnk-rm-walkthrough]
* [Deploy a gateway for connected factory][lnk-connect-cf]
* [Permissions on the azureiotsuite.com site][lnk-permissions]
* [FAQ][lnk-faq]


[img-oee-kpi]: ./media/iot-suite-connected-factory-customize/oeenadkpi.png
[img-manufactured-items]: ./media/iot-suite-connected-factory-customize/manufactured.png
[img-tsi]: ./media/iot-suite-connected-factory-customize/tsi.png
[img-select-server]: ./media/iot-suite-connected-factory-customize/selectserver.png
[img-published]: ./media/iot-suite-connected-factory-customize/published.png
[img-munich]: ./media/iot-suite-connected-factory-customize/munich.png
[img-server-uris]: ./media/iot-suite-connected-factory-customize/serveruris.png
[lnk-kpi]: ./media/iot-suite-connected-factory-customize/kpidisplay.png

[lnk-rm-walkthrough]: iot-suite-connected-factory-sample-walkthrough.md
[lnk-connect-cf]: iot-suite-connected-factory-gateway-deployment.md
[lnk-permissions]: iot-suite-permissions.md
[lnk-faq]: iot-suite-faq.md