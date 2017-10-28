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
ms.date: 06/01/2017
ms.author: owend

---
# Connect with Excel

Once you've created a server in Azure, and deployed a tabular model to it, you're ready to connect and begin exploring data.


## Connect in Excel

Connecting to a server in Excel is supported by using Get Data in Excel 2016. Connecting by using the Import Table Wizard in Power Pivot is not supported. 

**To connect in Excel 2016**

1. In Excel 2016, on the **Data** ribbon, click **Get External Data** > **From Other Sources** > **From Analysis Services**.

2. In the Data Connection Wizard, in **Server name**, enter the server name including protocol and URI. Then, in **Logon credentials**, select **Use the following User Name and Password**, and then type the organizational user name, for example nancy@adventureworks.com, and password.

    ![Connect from Excel logon](./media/analysis-services-connect-excel/aas-connect-excel-logon.png)

3. In **Select Database and Table**, select the database and model or perspective, and then click **Finish**.
   
    ![Connect from Excel select model](./media/analysis-services-connect-excel/aas-connect-excel-select.png)


## See also
[Client libraries](analysis-services-data-providers.md)   
[Manage your server](analysis-services-manage.md)     


