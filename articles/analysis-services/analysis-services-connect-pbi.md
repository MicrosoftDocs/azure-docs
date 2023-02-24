---
title: Learn how to connect to Azure Analysis Services with Power BI | Microsoft Docs
description: Learn how to connect to an Azure Analysis Services server by using Power BI. Once connected, users can explore model data.
author: minewiskan
ms.service: analysis-services
ms.topic: conceptual
ms.date: 01/24/2023
ms.author: owend
ms.reviewer: minewiskan

---
# Connect with Power BI

After you've created a server in Azure and deployed a tabular model to it, users in your organization are ready to connect and begin exploring data. 

> [!NOTE]
> If publishing a Power BI Desktop model to the Power BI service, on the Azure Analysis Services server, ensure the Case-Sensitive collation server property is not selected (default). The Case-Sensitive server property can be set by using SQL Server Management Studio.
> 
> 
  
## Connect in Power BI Desktop

1. In Power BI Desktop, click **Get Data** > **Azure** > **Azure Analysis Services database**.

2. In **Server**, enter the server name. Be sure to include the full URL; for example, asazure://westcentralus.asazure.windows.net/advworks.

3. In **Database**, if you know the name of the tabular model database or perspective you want to connect to, paste it here. Otherwise, you can leave this field blank and select a database or perspective later.

4. Select a connection option and then press **Connect**. 

    Both **Connect live** and **Import** options are supported. However, we recommended you use live connections because Import mode does have some limitations; most notably, server performance might be impacted during import.
    
    If you have a Power BI model in [Mixed storage mode](/power-bi/transform-model/desktop-composite-models), the **Connect live** option is replaced by the **[DirectQuery](/power-bi/connect-data/desktop-directquery-datasets-azure-analysis-services)** option. Live connections are also automatically upgraded to DirectQuery if the model is switched from Import to Mixed storage mode.

5. When prompted to enter your credentials, select **Microsoft account**, and then click **Sign in**. 

    :::image type="content" source="media/analysis-services-connect-pbi/aas-sign-in.png" alt-text="Screenshot showing Sign in to Azure Analysis Services.":::

   > [!NOTE]
   > Windows and Basic authentication are not supported. 

6. In **Navigator**, expand the server, then select the model or perspective you want to connect to, and then click **Connect**. Click a model or perspective to show all objects for that view.

    The model opens in Power BI Desktop with a blank report in Report view. The Fields list displays all non-hidden model objects. Connection status is displayed in the lower-right corner.

## Connect in Power BI (service)

1. Create a Power BI Desktop file that has a live connection to your model on your server.
2. In [Power BI](https://powerbi.microsoft.com), click **Get Data** > **Files**, and then locate and select your .pbix file.

## Request Memory Limit

To safeguard the performance of the system, a memory limit is enforced for all queries issued by Power BI reports against Azure Analysis Services, regardless of the [Query Memory Limit](/analysis-services/server-properties/memory-properties?view=azure-analysis-services-current&preserve-view=true) configured on the Azure Analysis Services server. Users should consider simplifying the query or its calculations if the query is too memory intensive.

|Query type| Request Memory limit |
|-----------------------------------------------------------|----------------------|
| Live connect from Power BI                            | 10 GB  |
| DirectQuery from Power BI report in Shared workspace  | 1 GB   |
| DirectQuery from Power BI report in Premium workspace | 10 GB  |
| Power BI Q&A | 100 MB |

## See also
[Connect to Azure Analysis Services](analysis-services-connect.md)   
[Client libraries](/analysis-services/client-libraries?view=azure-analysis-services-current&preserve-view=true)
