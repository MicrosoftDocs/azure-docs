---
title: Installation instructions for Azure Stream Analytics tools for Visual Studio | Microsoft Docs
description: Installation instructions for Azure Stream Analytics tools for Visual Studio
keywords: visual studio
documentationcenter: ''
services: stream-analytics
author: su-jie
manager: 
editor: 

ms.assetid: a473ea0a-3eaa-4e5b-aaa1-fec7e9069f20
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 9/19/2017
ms.author: sujie

---
# Installation instructions for Stream Analytics tools for Visual Studio
Azure Stream Analytics tools now support Visual Studio 2017, 2015, and 2013. In this document, we introduce how to install and uninstall the tools.

Learn how to use [Stream Analytics tools for Visual Studio](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-tools-for-visual-studio).

## Install
### Visual Studio 2017
* Download [Visual Studio 2017 (15.3 or above)](https://www.visualstudio.com/). Enterprise (Ultimate/Premium), Professional, and Community editions are supported. Express edition is not supported. 
* Stream Analytics tools are part of the **Azure development** and **Data storage and processing** workloads in Visual Studio 2017. Enable either one of these two workloads as part of your Visual Studio installation.

Enable the **Data storage and processing** workload as shown:

![Data storage and processing workload](./media/stream-analytics-tools-for-vs/stream-analytics-tools-for-vs-2017-install-01.png)

Enable the **Azure development** workload as shown:

![Azure development workload](./media/stream-analytics-tools-for-vs/stream-analytics-tools-for-vs-2017-install-02.png)


### Visual Studio 2013, 2015
* Install Visual Studio 2015 or Visual Studio 2013 Update 4. Enterprise (Ultimate/Premium), Professional, and Community editions are supported. Express edition is not supported. 
* Install the Microsoft Azure SDK for .NET version 2.7.1 or above by using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
* Install [Azure Stream Analytics tools for Visual Studio](http://aka.ms/asatoolsvs).



## Update

### Visual Studio 2017
The new version reminder shows up in the Visual Studio notification. 

### Visual Studio 2013, 2015
The installed Stream Analytics tools for Visual Studio check for new versions automatically. Follow the instructions in the pop-up window to install the latest version. 


## Uninstall

### Visual Studio 2017
Double-click the Visual Studio installer, and select **Modify**. Clear the **Azure Data Lake and Stream Analytics Tools** check box from either the **Data storage and processing** workload or the **Azure development** workload.

### Visual Studio 2013, 2015
Go to Control Panel, and uninstall **Microsoft Azure Data Lake and Stream Analytics tools for Visual Studio**.





