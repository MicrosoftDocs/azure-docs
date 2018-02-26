---
title: Import a Power BI Desktop file into Azure Analysis Services | Microsoft Docs
description: Describes how to import a Power BI Desktop file (pbix) by using Azure portal.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: kfile
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 02/26/2018
ms.author: owend

---

# Import a Power BI Desktop file

You can create a new model in Azure AS by importing a Power BI Desktop file (pbix) file. Model metadata, cached data, and datasource connections are imported. Reports and visualizations are not imported. Once in your server, model changes can be made by updating and reimporting the pbix, by using the web designer (preview) feature in the portal, or by using SQL Server Management Studio (SSMS). Imported models cannot be opened or exported to Visual Studio.

> [!NOTE]
> If your pbix model connects to on-premises data sources, an [on-premises gateway](analysis-services-gateway.md) must be configured for your server.

## To import from pbix

1. In your server's **Overview** > **Web designer**, click **Open**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-overview-wd.png)

2. In **Web designer** > **Models**, click **+ Add**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-models.png)

3. In **New model**, type a model name, and then select Power BI Desktop file.

    ![New model dialog in Azure portal](./media/analysis-services-import-pbix/aas-import-pbix-new-model.png)

4. In **Import**, locate and select your file.

     ![Connect dialog in Azure portal](./media/analysis-services-import-pbix/aas-import-pbix-select-file.png)

## See also

[Create a model in Azure portal](analysis-services-create-model-portal.md)   
[Connect to Azure Analysis Services](analysis-services-connect.md)  
