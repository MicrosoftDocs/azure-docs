---
title: Connect to Azure Analysis Services with Excel | Microsoft Docs
description: Learn how to connect to an Azure Analysis Services server by using Excel.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 04/12/2017
ms.author: owend

---
# Connect with Excel

Once you've created a server in Azure, and deployed a tabular model to it, users in your organization are ready to connect and begin exploring data. 

## Data providers (aka client libraries)

Client applications like Excel use updated AMO, ADOMD.NET, and OLEDB data providers to connect to and interface with Analysis Services. With some older versions of Excel, you may need to install the latest data providers to connect to Azure Analysis Services. To learn more, see [Data providers](analysis-services-data-providers.md). 

Some organizations deploy Office 365 updates on the Deferred Channel; meaning version updates are delayed up to four months from the current version. For Excel 2016 version 1609.7369.2115 and earlier, or Excel 2013, you can create an .odc file and manually update the MSOLAP.7 provider to connect to a server. To learn more, see [Create an .odc file](analysis-services-odc.md).


## Connect in Excel

Connecting to Azure Analysis Services server in Excel is supported by using Get Data in Excel 2016 or Power Query in earlier versions. Connecting by using the Import Table Wizard in Power Pivot is not supported. 

**To connect in Excel 2016**

1. In Excel 2016, on the **Data** ribbon, click **Get External Data** > **From Other Sources** > **From Analysis Services**.

2. In the Data Connection Wizard, in **Server name**, paste the server name from the clipboard. Then, in **Logon credentials**, select **Use the following User Name and Password**, and then type the organizational user name, for example nancy@adventureworks.com, and password.

    ![Connect from Excel logon](./media/analysis-services-connect-excel/aas-connect-excel-logon.png)

3. In **Select Database and Table**, select the database and model or perspective, and then click **Finish**.
   
    ![Connect from Excel select model](./media/analysis-services-connect-excel/aas-connect-excel-select.png)


## See also
[Data providers](analysis-services-data-providers.md)
[Manage your server](analysis-services-manage.md)   


