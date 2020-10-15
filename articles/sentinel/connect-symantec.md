---
title: Connect Symantec ICDx data to Azure Sentinel| Microsoft Docs
description: Learn how to use the Symantec ICDx connector to easily connect all your Symantec security solution logs with Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: d068223f-395e-46d6-bb94-7ca1afd3503c
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect your Symantec ICDx appliance 



Symantec ICDx connector allows you to easily connect all your Symantec security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. Integration between Symantec ICDx and Azure Sentinel makes use of REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Symantec ICDx 

Symantec ICDx can integrate and export logs directly to Azure Sentinel.

1. Open the ICDx Management Console to add Microsoft Azure Sentinel (Log Analytics) forwarders.
2. On the ICDx navigation bar, click **Configuration**. 
3. At the top of the **Configuration** screen, click **Forwarders**.
4. Under **Forwarders**, next to Microsoft Azure Sentinel (Log Analytics), click **Add**. 
4. In the **Microsoft Azure Sentinel (Log Analytics)** window, click **Show Advanced**. 
5. At the top of the expanded to Microsoft Azure Sentinel (Log Analytics) window, do the following:
    -	**Name**: Type a name for the forwarder that has no more than 30 characters. Choose a unique, meaningful name. This name appears in the list of forwarders on the **Configuration** screen and in the dashboards on the **Dashboard** screen. For example: Microsoft Azure Log Analytics East. This field is required.
    -	**Description**: Type a description for the forwarder. This description also appears in the list of forwarders on the **Configuration** screen. Include details such as the event type being forwarded and the group that needs to inspect the data.
    -	**Startup Type**: Select the method of startup for the forwarder configuration. Your options are manual and automatic.<br>The default is Automatic. 
6. Under **Events**, do the following: 
    - **Source**: Select one or more archives from which to forward events. You can select active collector archives (including the Common Archive), orphaned collector archives (that is, archives for the collectors that you have deleted), ICDx receiver archives, or the System Archive. <br>The default is Common Archive.
      > [!NOTE]
      > ICDx receiver archives are listed separately, by name. 
 
    - **Filter**: Add a filter that specifies the subset of events to forward. Do one of the following:
        - To select a filter condition, click a Type, Attribute, Operator, and Value. 
        - In the Filter field, review your filter condition. You can edit it directly in the field or delete it as necessary.
        - Click AND or OR to add to your filter condition.
        - You can also click Saved Queries to apply a saved query.
    - **Included Attributes**: Type the comma-delimited list of attributes to include in the forwarded data. The included attributes take precedence over excluded attributes.
    - **Excluded Attributes**: Type the comma-delimited list of attributes to exclude from the forwarded data.
    - **Batch Size**: Select the number of events to send per batch. Your options are 10, 50, 100, 500 and 1000.<br>The default is 100. 
    - **Rate Limit**: Select the rate at which events are forwarded, expressed as events per second. Your options are Unlimited, 500, 1000, 5000, 10000. <br> The default is 5000. 
7. Under **Azure Destination**, do the following: 
    - **Workspace ID**: Paste the Workspace ID from below. This field is required.
    - **Primary Key**: Paste the Primary Key  from below. This field is required.
    - **Custom Log Name**: Type the custom log name in the Microsoft Azure portal Log Analytics workspace to which you are going to forward events. The default is SymantecICDx. This field is required.
8. Click *Save* to finish the forwarder configuration. 
9. To start the forwarder, under **Options**, click **More** and then **Start**.
10. To use the relevant schema in Log Analytics for the Symantec ICDx events, search for **SymantecICDx_CL**.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Symantec ICDx to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


