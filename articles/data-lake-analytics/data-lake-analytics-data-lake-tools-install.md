---
title: Install Azure Data Lake Tools for Visual Studio
description: This article describes how to install Azure Data Lake Tools for Visual Studio. 
services: data-lake-analytics
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr

ms.reviewer: jasonwhowell
ms.assetid: ad8a6992-02c7-47d4-a108-62fc5a0777a3
ms.topic: conceptual
ms.date: 05/03/2018
---
# Install Data Lake Tools for Visual Studio

Learn how to use Visual Studio to create Azure Data Lake Analytics accounts, define jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service. For more
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

## Prerequisites

* **Visual Studio**: All editions except Express are supported.
    * Visual Studio 2017
    * Visual Studio 2015
    * Visual Studio 2013
* **Microsoft Azure SDK for .NET** version 2.7.1 or later.  Install it by using the [Web platform installer](https://www.microsoft.com/web/downloads/platform.aspx).
* A **Data Lake Analytics** account. To create an account, see [Get Started with Azure Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md).

## Install Azure Data Lake Tools for Visual Studio 2017

Azure Data Lake Tools for Visual Studio is supported in Visual Studio 2017 15.3 or above. The tool is part of the **Data storage and processing** and **Azure Development** workloads in Visual Studio Installer. Enable either one of these two workloads as part of your Visual Studio installation.  

Enable the **Data storage and processing** workload as shown:
    ![Enable Data storage and processing workload](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-tools-for-vs-2017-install-01.png)

Enable the **Azure development** workload as shown:
    ![Enable Azure development workload](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-tools-for-vs-2017-install-02.png)

## Install Azure Data Lake Tools for Visual Studio 2013 and 2015

Download and install Azure Data Lake Tools for Visual Studio [from the Download Center](https://aka.ms/adltoolsvs). After installation, note that:
* The **Server Explorer** > **Azure** node contains a **Data Lake Analytics** node. 
* The **Tools** menu has a **Data Lake** item.


## Next Steps
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To use the vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md)
