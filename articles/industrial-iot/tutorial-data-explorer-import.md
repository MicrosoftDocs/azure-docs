---
title: Using Industrial IoT to pull data into Azure Data Explorer
description: In this tutorial, you learn how to move IIoT data into ADX and create a dashboard to view it.
author: eross-msft
ms.author: lizross
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 6/16/2021
---

# Tutorial: Using Industrial IoT to pull data into Azure Data Explorer

The Azure Industrial IoT (IIoT) Platform combines edge modules and cloud microservices with Azure platform-as-a-service (PaaS) services to provide capabilities for industrial asset discovery and asset data acquisition. In an industrial setting, the de-facto standard for this task is OPC UA. This tutorial illustrates how to configure Azure for use with OPC UA, using a simple use case as an example, namely cloud-based condition monitoring.

In this tutorial, you will learn how to:
- Get an Azure account and deploy an IoT Hub.
- Deploy IoT Edge
- Install and configure OPC Publisher
- Set up a time series database.
- Create a dashboard.
- Create a graph of incoming data.

## Requirements

Before you start this tutorial, you will need an Azure account. If you do not have one, you can get one for free by [clicking here](https://azure.microsoft.com/free/).

## Deploy an S1 IoT Hub

The first thing you need to do with your Azure subscription is go to [the portal](../azure-portal/azure-portal-quickstart-center.md) and [deploy an S1 IoT Hub](../iot-hub/iot-hub-create-through-portal.md). Your free Azure account gives you 400,000 4K messages per day. Since you can fit about 15 OPC UA PubSub data tags into a single 4K message, you will have 6 million data tags per day, enough for this use case. Once the IoT Hub is deployed, copy the *iothubowner* primary connection string (under shared access policies, iothubowner). You need it for the IoT Edge installation.

## Deploy IoT Edge

Deploy IoT Edge using the [IoT Edge Installer](https://lnkd.in/ga6Ew4X) on a Windows 10 PC or VM. This PC/VM needs to have Internet connectivity and also be able to access the machines or industrial connectivity adapter software (dataFEED, Zenon, Kepware, etc.) you want to use. You can nest (i.e. "daisy-chain") IoT Edge devices, should your facility use several network layers from your OT network (where your machines are located) to your Internet connection. You can also run IoT Edge natively on Linux using the installer [on GitHub](https://github.com/Azure/Industrial-IoT-Gateway-Installer/blob/master/Releases/Linux.zip).

When you run the IoT Edge installer, select the **Use Docker Desktop** checkbox, keep the **Configure IoT Edge for Azure Industrial Cloud Platform (PaaS)** radio button selected and paste the *iothubowner* connection string into the text box provided. The installer automatically pre-populates the name of the PC you are running on as the Edge instance name, but you can change it if you need to. Hit **Install**. If Docker Desktop is not detected, the installer will download it automatically. Install it and make sure you configure it with Windows Subsystem for Linux V2 (WSL2) for best performance. Once installation of Docker Desktop completes, restart the IoT Edge Installer, configure it again and hit install a second time. Then go to the **IoT Edge** tab in your **IoT Hub** page in the Azure portal and wait until your newly installed IoT Edge device shows up (you may have to hit refresh a few times).

## Install and configure OPC Publisher

Next, install and configure OPC Publisher, which is used to standardize and normalize all telemetry data using OPC UA PubSub on the Edge. We will use the OPC UA JSON encoding as it can be ingested directly into cloud databases without first requiring a separate cloud service to translate the binary format back into something the cloud database can understand. Using this industry-standard format reduces the management overhead and cost in the cloud. This is an important point: Lots of people will tell you that they have found a more efficient telemetry encoding but they invariably underestimate the cost and management aspect of translating telemetry into a cloud database-ready format at scale in the cloud. 

Now go to the **Getting Started** page for OPC Publisher and follow the instructions. For **Container Create Options**, specify the following.

```
{
    "Hostname": "OPCPublisher",
    "Cmd": [
        "PkiRootPath=/appdata/pki", 
        "--lf=/appdata/publisher.log", 
        "--pf=/appdata/publishednodes.json",
        "--aa",
        "--di=60",
        "--me=Json",
        "--mm=PubSub"
    ],
    "HostConfig": {
        "Binds": [
            "/c/IoTEdgeMapping:/appdata"
        ]
    }
}
```

Next, configure the OPC UA data nodes from your machines (or connectivity adapter software) that generate cloud time-series telemetry messages from. To do so, copy the template ***publishednodes.json*** file from here to ***C:\IoTEdgeMapping*** and fill it in with the OPC UA server **EndpointURL** and OPC UA node IDs of the data you want to send to the cloud. If you don't know what to send, the data node with ID ns=0;i=2258 is the current time of the server, which changes every second. OPC UA only publishes data changes if the data has changed. However, OPC Publisher also supports reading and sending data at specific intervals, even if it has not changed.

Once you are done editing the file, restart OPC Publisher using the command line command "**iotedge restart OPCPublisher**" and OPC Publisher will try to connect to all OPC UA servers you have specified and publish all nodes listed. Experience has shown that you should first use an OPC UA client like UA Expert from the PC running IoT Edge to make sure you can connect to the OPC UA servers and also try the OPC UA server's IP address in the EndpointURL instead of the hostname, in case your DNS doesn't work. Now go back to your **IoT Hub** page in the Azure portal and double check that you can see **Device to Cloud** messages being received in the **Overview** tab.

## Set up the time series database

Now set up the time series database in the cloud that will receive the OPC UA telemetry. It's best to use Azure Data Explorer for this because it uses several database layers for optimal performance, comes with rich analytics and dashboard capabilities, and even supports predictions and anomaly detection. Deploy an instance from the Azure portal, select the dev/test workload SKU, and don't forget to enable streaming ingestion under configurations.

OPC UA uniquely identifies a telemetry data tag by the OPC UA server's **DatasetWriterID** and the **ExpandedNodeID** (which contains both the namespace and the node ID). Furthermore, the timestamp when the data is read by the OPC UA server before making it available to a connected client is called the *SourceTimeStamp*. So to create a time series of OPC UA telemetry, we want to provide the **DatasetWriterID**, the **ExpandedNodeID**, the data value read, and the **SourceTimeStamp** in a database table. This is what you will create now, using Azure Data Explorer. Note that the data value type (float, int, etc.) can also be included in OPC UA PubSub messages; this is called *reversible encoding* in the OPC UA spec.

First, create a database with the default 10-year data retention period, which should be enough for this use case. Then,.configure streaming ingestion directly from your IoT Hub by hitting **Create Data Connection** and selecting **IoT Hub**, Give the connection a name and pick your IoT Hub from the dropdown. Select *iothubowner* under **Shared Access Policy** and *$Default* for the **Consumer Group**. Leave the **Table name** blank for now, but select *MULTILINE JSON* under **Data format** and enter *opcua_mapping* for the **Mapping name**. Select **Create**.

## Create the database tables

Create the required tables in the new database. First create a staging table with a single column to receive the raw OPC UA PubSub JSON telemetry messages. Azure Data Explorer uses the built-in Kusto Query language (KQL), which is documented here. Select the **Query** tab and enter the following.

```
.create table opcua_raw(payload: dynamic)

```

Create a mapping to the *opcua_mapping* telemetry ingestion using the IoT Hub you setup previously using the following command.

```
.create table opcua_raw ingestion json mapping "opcua_mapping" @'[{"column":"payload","path":"$","datatype":"dynamic"}]'

```

Update the telemetry ingestion with the table name of the table you just created by selecting the **Data ingestion** tab, selecting the name of your data ingestion, select **Edit**, enter *opcua_raw* in the **Table name** and hit **Update**. Then go back to the **Query** tab and wait a few minutes for the first telemetry messages to enter the table. You can check this by querying for 10 rows in the table.

```
opcua_raw
| take 10
```

OPC UA PubSub supports batching of telemetry into a single message through the use of datasets, which are identified by the **DataSetWriterID**. These datasets need to be "unbatched" into separate rows in your database. You do this through the use of the *mv-expand* operator, expanding the JSON ingested into a new intermediate table you need to create first.

```
.create table opcua_intermediate(DataSetWriterID: string, payload: dynamic)
```

Now create the following function to do the expansion.

```
.create-or-alter function OPCUARawExpand() {
    opcua_raw
    |mv-expand records = payload.Messages
    |project 
        DataSetWriterID = tostring(records["DataSetWriterId"]),
        Payload = todynamic(records["Payload"])
}
```

Then update the intermediate table by applying the new function.

```
.alter table opcua_intermediate policy update @'[{"Source": "opcua_raw", "Query": "OPCUARawExpand()", "IsEnabled": "True"}]'
```

Check that the new table is getting populated correctly.

```
opcua_intermediate
| take 10
```

 Create the final OPC UA telemetry table and populate it by further expanding out each entry in the OPC UA dataset.

```
.create table opcua_telemetry (DataSetWriterID: string, ExpandedNodeID: string, Value: dynamic, SourceTimestamp: datetime)
```

Create the function shown below.

```
.create-or-alter function OPCUADatasetExpand() {
    opcua_intermediate
    | mv-apply payload on (
        extend key = tostring(bag_keys(payload)[0])
        | extend p = payload[key]
        | project ExpandedNodeId = key, Value = todynamic(p.Value), SourceTimestamp = todatetime(p.SourceTimestamp)
    )
}
```

Update the third and final table by applying the new function.

```
.alter table opcua_telemetry policy update @'[{"Source": "opcua_intermediate", "Query": "OPCUADatasetExpand()", "IsEnabled": "True"}]'
```

To take a look at the OPC UA telemetry table, use the following command.

```
opcua_telemetry
| take 10
```

## Create line graph of the data

Now, let's create a line graph of the data by casting it all to floating-point numbers. If the cast fails, then the data is ignored. Use the hosted Azure Data Explorer dashboard for this. Click on **Open in Web UI** and in the new window, click on **Dashboards**, select **Create new Dashboard**, and choose **Add tile**. Then select **Data source** and enter the name of our Azure Data Explorer instance in the form `https://<YourInstanceName>.<Your RegionName>.kusto.windows.net`. Select your database and hit **apply**. Then enter the following query.

```
opcua_telemetry
| project SourceTimestamp, yaxis = todouble(Value), DataSetWriterID,  ExpandedNodeID
```

Hit the **Visual** tab and select *yaxis* for the **Y Columns**, the *SourceTimeStamp* for the **X Columns** and the *DataSetWriterID* for the S**eries columns**.

Now you have a nice telemetry dashboard for your condition monitoring use case data in the cloud.