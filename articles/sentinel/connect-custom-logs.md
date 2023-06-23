---
title: Collect data in custom log formats to Microsoft Sentinel | Microsoft Docs
description: Collect data from custom data sources and ingest it into Microsoft Sentinel using the Log Analytics agent.
author: yelevin
ms.topic: how-to
ms.date: 06/05/2023
ms.author: yelevin
---

# Collect data in custom log formats to Microsoft Sentinel with the Log Analytics agent

Many applications log data to text files instead of standard logging services like Windows Event log or Syslog. You can use the Log Analytics agent to collect data in text files of nonstandard formats from both Windows and Linux computers. Once collected, you can either parse the data into individual fields in your queries or extract the data during collection to individual fields.

This article describes how to connect your data sources to Microsoft Sentinel using custom log formats. For more information about supported data connectors that use this method, see [Data connectors reference](data-connectors-reference.md).

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).

Learn all about [custom logs in the Azure Monitor documentation](../azure-monitor/agents/data-sources-custom-logs.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Install the Log Analytics agent

Install the Log Analytics agent on the Linux or Windows machine that will be generating the logs.

Some vendors recommend installing the Log Analytics agent on a separate log server instead of directly on the device. Consult your product's section on the [Data connectors reference](data-connectors-reference.md) page, or your product's own documentation.

Select the appropriate tab below, depending on whether your connector is part of solution listed in the content hub of  Microsoft Sentinel or not.

# [From a specific data connector page](#tab/DCG)


Before you begin, install the solution for the product from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md). Once the data connector for the product is available, continue with the following steps.

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Search for and select the appropriate product data connector.
1. Select **Open connector page**.

1. Install and onboard the agent on the device that generates the logs. Choose Linux or Windows as appropriate.

    | Machine type | Instructions |
    | --------- | --------- |
    | **For an Azure Linux VM** | <ol><li>Under **Choose where to install the Linux agent**, expand **Install agent on Azure Linux virtual machine**.<br><br><li>Select the **Download & install agent for Azure Linux Virtual machines >** link.<br><br><li>In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**. Repeat this step for each VM you wish to connect. |
    | **For any other Linux machine** | <ol><li>Under **Choose where to install the Linux agent**, expand **Install agent on a non-Azure Linux Machine**.<br><br><li>Select the **Download & install agent for non-Azure Linux machines >** link.<br><br><li>In the **Agents management** blade, select the **Linux servers** tab, then copy the command for **Download and onboard agent for Linux** and run it on your Linux machine.<br><br> If you want to keep a local copy of the Linux agent installation file, select the **Download Linux Agent** link above the "Download and onboard agent" command.|
    | **For an Azure Windows VM** | <ol><li>Under **Choose where to install the Windows agent**, expand **Install agent on Azure Windows virtual machine**.<br><br><li>Select the **Download & install agent for Azure Windows Virtual machines >** link.<br><br><li>In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**. Repeat this step for each VM you wish to connect. |
    | **For any other Windows machine** | <ol><li>Under **Choose where to install the Windows agent**, expand **Install agent on a non-Azure Windows Machine**<br><br><li>Select the **Download & install agent for non-Azure Windows machines >** link.<br><br><li>In the **Agents management** blade, on the **Windows servers** tab, select the **Download Windows Agent** link for either 32-bit or 64-bit systems, as appropriate. |

# [Other data sources](#tab/CUS)

1. From the Microsoft Sentinel navigation menu, select **Settings** and then the **Workspace settings** tab.

1. Install and onboard the agent on the device that generates the logs. Choose Linux or Windows as appropriate.

    | Machine type | Instructions |
    | --------- | --------- |
    | **Azure VM (Windows or Linux)** | <ol><li>From the Log Analytics workspace navigation menu, select **Virtual machines**.<br><br><li>In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**.<br>Repeat this step for each VM you wish to connect. |
    | **Any other Windows or Linux machine** | <ol><li>From the Log Analytics workspace navigation menu, select **Agents management**.<br><br><li>Select the **Windows servers** or **Linux servers** tab as appropriate.<br><br><li>For Windows, select the **Download Windows Agent** link for either 32-bit or 64-bit systems, as appropriate. For Linux, copy the command for **Download and onboard agent for Linux** and run it from your command line, or select the **Download Linux Agent** link to download a local copy of the installation file. |

---

## Configure the logs to be collected

Many device types have their own data connectors appearing in the **Data connectors** page in Microsoft Sentinel. Some of these connectors require special additional instructions to properly set up log collection in Microsoft Sentinel. These instructions can include the implementation of a parser based on a Kusto function. 

All connectors listed in Microsoft Sentinel will display any specific instructions on their respective connector pages in the portal, as well as in their sections of the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

If your product doesn't have a solution with a data connector listed in the **Content Hub**, consult your vendor's documentation for instructions on configuring logging for your device.

## Configure the Log Analytics agent

1. From the connector page, select the **Open your workspace custom logs configuration** link.

    Or, from the Log Analytics workspace navigation menu, select **Custom logs**.

1. In the **Custom tables** tab, select **Add custom log**.

1. In the **Sample** tab, upload a sample of a log file from your device (e.g. access.log or error.log). Then, select **Next**.

1. In the **Record delimiter** tab, select a record delimiter, either **New line** or **Timestamp** (see the instructions on that tab), and select **Next**.

1. In the **Collection paths** tab, select a path type of Windows or Linux, and enter the path to your device's logs based on your configuration. Then, select **Next**.

1. Give your custom log a name and optionally a description and select **Next**.  
    Don't end your name with "_CL", as it will be appended automatically.


## Find your data

To query the custom log data in **Logs**, type the name you gave your custom log (ending in "_CL") in the query window.

## Next steps

In this document, you learned how to collect data from custom log types to ingest into Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
