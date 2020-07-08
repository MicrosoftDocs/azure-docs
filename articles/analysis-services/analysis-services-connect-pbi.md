---
title: Connect to Azure Analysis Services with Power BI | Microsoft Docs
description: Learn how to connect to an Azure Analysis Services server by using Power BI. Once connected, users can explore model data.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: owend
ms.reviewer: minewiskan

---
# Connect with Power BI

Once you've created a server in Azure, and deployed a tabular model to it, users in your organization are ready to connect and begin exploring data. 

> [!TIP]
> Be sure to use the latest version of [Power BI Desktop](https://powerbi.microsoft.com/desktop/).
> 
> 
  
## Connect in Power BI Desktop

1. In Power BI Desktop, click **Get Data** > **Azure** > **Azure Analysis Services database**.

2. In **Server**, enter the server name. Be sure to include the full URL; for example, asazure://westcentralus.asazure.windows.net/advworks.

3. In **Database**, if you know the name of the tabular model database or perspective you want to connect to, paste it here. Otherwise, you can leave this field blank and select a database or perspective later.

4. Select a connection option and then press **Connect**. 

    Both **Connect live** and **Import** options are supported. However, we recommended you use live connections because Import mode does have some limitations; most notably, server performance might be impacted during import. Also, if the model is to be refreshed in the Power BI service, the **Allow access from Power BI** setting applies only when choosing **Connect live**.

5. If prompted, enter your login credentials. 

6. In **Navigator**, expand the server, then select the model or perspective you want to connect to, and then click **Connect**. Click a model or perspective to show all objects for that view.

    The model opens in Power BI Desktop with a blank report in Report view. The Fields list displays all non-hidden model objects. Connection status is displayed in the lower-right corner.

## Connect in Power BI (service)

1. Create a Power BI Desktop file that has a live connection to your model on your server.
2. In [Power BI](https://powerbi.microsoft.com), click **Get Data** > **Files**, and then locate and select your .pbix file.

## See also
[Connect to Azure Analysis Services](analysis-services-connect.md)   
[Client libraries](https://docs.microsoft.com/analysis-services/client-libraries?view=azure-analysis-services-current)

