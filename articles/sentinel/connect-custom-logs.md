---
title: Collect data in custom log formats to Azure Sentinel | Microsoft Docs
description: Collect data from custom data sources and ingest it into Azure Sentinel using the Log Analytics agent. 
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/17/2020
ms.author: yelevin

---
# Collect data in custom log formats to Azure Sentinel with the Log Analytics agent

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Many applications log data to text files instead of standard logging services like Windows Event log or Syslog. You can use the Log Analytics agent to collect data in text files of nonstandard formats from both Windows and Linux computers. Once collected, you can either parse the data into individual fields in your queries or extract the data during collection to individual fields. 

Learn all about [custom logs in the Azure Monitor documentation](../azure-monitor/agents/data-sources-custom-logs.md).

Similar to Syslog, there are two steps to configuring custom log collection:

- Install the Log Analytics agent on the Linux or Windows machine that will be generating the logs.

- Configure your application's logging settings.

- Configure the Log Analytics agent from within Azure Sentinel.

## Install the Log Analytics agent

# [From the Data connectors gallery](#tab/DCG)

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. From the connectors gallery, select your device type and then select **Open connector page**.

1. Install and onboard the agent on the device that generates the logs. Choose Linux or Windows as appropriate.

    **For an Azure Linux VM:**

    1. Under **Choose where to install the Linux agent**, expand **Install agent on Azure Linux virtual machine**.
    
    1. Select the **Download & install agent for Azure Linux Virtual machines >** link. 
    
    1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.
    
    **For any other Linux machine:**

    1. Under **Choose where to install the Linux agent**, expand **Install agent on a non-Azure Linux Machine**

    1. Select the **Download & install agent for non-Azure Linux machines >** link. 

    1. In the **Agents management** blade, click the **Linux servers** tab, then copy the command for **Download and onboard agent for Linux** and run it on your Linux machine.

        If you want to keep a local copy of the Linux agent installation file, select the **Download Linux Agent** link above the "Download and onboard agent" command.

    **For an Azure Windows VM:**

    1. Under **Choose where to install the Windows agent**, expand **Install agent on Azure Windows virtual machine**.
    
    1. Select the **Download & install agent for Azure Windows Virtual machines >** link. 
    
    1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.
    
    **For any other Windows machine:**

    1. Under **Choose where to install the Windows agent**, expand **Install agent on a non-Azure Windows Machine**

    1. Select the **Download & install agent for non-Azure Windows machines >** link. 

    1. In the **Agents management** blade, on the **Windows servers** tab, select the **Download Windows Agent** link for either 32-bit or 64-bit systems, as appropriate.

# [Other data sources](#tab/CUS)

1. From the Azure Sentinel navigation menu, select **Settings** and then the **Workspace settings** tab.

1. Install and onboard the agent on the device that generates the logs. Choose Linux or Windows as appropriate.

    - To install the agent on an Azure VM (Windows or Linux):
        1. From the Log Analytics workspace navigation menu, select **Virtual machines**.
        1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.

    - To install the agent on any other kind of Windows or Linux machine:
        1. From the Log Analytics workspace navigation menu, select **Agents management**.
        1. Select the **Windows servers** or **Linux servers** tab as appropriate.
    
    **For an Azure Linux VM:**
      
    1. Expand **Install agent on Azure Linux virtual machine**.
    
    1. Select the **Download & install agent for Azure Linux Virtual machines >** link. 
    
    1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.
    
---

## Configure the logs to be collected

Many device types have their own data connectors appearing in the **Data connectors** gallery. Some of these connectors require special additional instructions to properly set up log collection in Azure Sentinel. These instructions can include the implementation of a parser based on a Kusto function. 

All connectors listed in the gallery will display any specific instructions on their respective connector pages in the portal, as well as in their sections of the [partner data connectors reference](partner-data-connectors-reference.md) page.


## Configure the Log Analytics agent

1. From the connector page, select the **Open your workspace custom logs configuration** link.
    Or, from the Log Analytics workspace navigation menu, select **Custom logs**.

1. In the **Custom tables** tab, select **Add custom log**.

1. In the **Sample** tab, upload a sample of a log file from your device (e.g. access.log or error.log). Then, click **Next**.

1. In the **Record delimiter** tab, select a record delimiter, either **New line** or **Timestamp** (see the instructions on that tab), and click **Next**.

1. In the **Collection paths** tab, select a path type of Windows or Linux, and enter the path to your device's logs based on your configuration. Then, click **Next**.

1. Give your custom log a name and optionally a description and click **Next**.  
    Don't end your name with "_CL", as it will be appended automatically.


## Find your data

1. To query the custom log data in **Logs**, type the name you gave your custom log (ending in "_CL") in the query window.

## Next steps
In this document, you learned how to collect data from custom log types to ingest into Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.

{"mode":"full","isActive":false}