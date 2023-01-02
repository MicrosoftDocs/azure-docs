---
title: Set up Azure Stream Analytics tools for Visual Studio
description: This article describes installation requirements and how to set up the Azure Stream Analytics tools for Visual Studio.
author: su-jie
ms.author: sujie

ms.service: stream-analytics
ms.topic: how-to
ms.date: 05/22/2018
---
# Install Azure Stream Analytics tools for Visual Studio

Visual Studio 2019 and Visual Studio 2017 support Azure Data Lake and Stream Analytics Tools. This article describes how to install and uninstall the tools.

For more information on using the tools, see [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md).

> [!NOTE] 
> We strongly recommend using [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward.

## Install

Visual Studio Enterprise (Ultimate/Premium), Professional, and Community editions support the tools. Express edition and Visual Studio for Mac don't support them.

We recommend Visual Studio 2019.

### Install for Visual Studio 2019 and 2017<a name="recommended-visual-studio-2019-and-2017"></a>

Azure Data Lake and Stream Analytics Tools are part of the **Azure development** and **Data storage and processing** workloads. Enable either one of these two workloads during installation. If Visual Studio is already installed, select **Tools** > **Get Tools and Features** to add workloads.

Download [Visual Studio 2019 (Preview 2 or above) or Visual Studio 2017 (15.3 or above)](https://www.visualstudio.com/) and follow instructions to install.

Select the **Data storage and processing** workload as shown:

![Data storage and processing workload is selected](./media/stream-analytics-tools-for-visual-studio-install/stream-analytics-tools-for-vs-2019-install-01.png)

Select the **Azure development** workload as shown:

![Azure development workload is selected](./media/stream-analytics-tools-for-visual-studio-install/stream-analytics-tools-for-vs-2019-install-02.png)

After you add the workload, update the tools. This procedure refers to Visual Studio 2019:

1. Select **Extensions** > **Manage Extensions**.

1. In **Manage Extensions**, select **Updates** and choose **Azure Data Lake and Stream Analytics Tools**.

1. Select **Update** to install the latest extension.

![Visual Studio extensions and updates](./media/stream-analytics-tools-for-visual-studio-install/stream-analytics-tools-vs2019-extensions-updates.png)

### Install for Visual Studio 2015 and 2013<a name="visual-studio-2015-2013"></a>

Visual Studio Enterprise (Ultimate/Premium), Professional, and Community editions support the tools. Express edition doesn't support them.

* Install Visual Studio 2015 or Visual Studio 2013 Update 4.
* Install the Microsoft Azure SDK for .NET version 2.7.1 or above by using the [Web platform installer](https://www.microsoft.com/web/downloads/platform.aspx).
* Install [Microsoft Azure Data Lake and Stream Analytics Tools for Visual Studio](https://www.microsoft.com/en-us/download/details.aspx?id=49504).

## Update<a name="visual-studio-2019-and-2017"></a><a name="visual-studio-2015-and-2013"></a>

For Visual Studio 2019 and Visual Studio 2017, a new version reminder shows up as a Visual Studio notification.

For Visual Studio 2015 and Visual Studio 2013, the tools check for new versions automatically. Follow the instructions to install the latest version.

## Uninstall

You can uninstall Azure Data Lake and Stream Analytics Tools. For Visual Studio 2019 or Visual Studio 2017, select **Tools** > **Get Tools and Features**. In **Modifying**, unselect **Azure Data Lake and Stream Analytics Tools**. It appears under either the **Data storage and processing** workload or the **Azure development** workload.

To uninstall from Visual Studio 2015 or Visual Studio 2013, go to **Control Panel** > **Programs and Features**. Uninstall **Microsoft Azure Data Lake and Stream Analytics Tools for Visual Studio**.
