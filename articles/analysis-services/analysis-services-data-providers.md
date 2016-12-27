---
title: Data providers required for client connections to Azure Analysis Services | Microsoft Docs
description: Describes data providers required for clients to connect Azure Analysis Services
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
ms.date: 12/27/2016
ms.author: owend

---

# Data providers for connecting to Azure Analysis Services

Data providers, also known as client libraries, are necessary for client applications to connect to Analysis Services servers. 

Analysis Services utilize three data providers. ADOMD.NET and Analysis Services Management Objects (AMO), are managed data providers. The Analysis Services OLE DB provider (MSOLAP DLL) is a native data provider. Typically, all three providers are installed at the same time. Azure Analysis Services requires the latest versions of the data providers. 

Microsoft client applications such as Power BI Desktop and Excel install all three data providers. However, depending on the version of Excel, or whether or not newer versions of Excel and Power BI Desktop are updated monthly, the data providers installed may not be updated to the latest versions required by Azure Analysis Service. The same applies to custom applications or other interfaces such as AsCmd, TOM, ADOMD.NET. These applications require manually installing the providers. The data providers for manual installation are included in SQL Server feature packs as distributable packages; however, These are tied to the SQL Server version and may not be the latest.  

Data providers for client connections are different from data providers required to connect from an Azure Analysis Services server to a data source. To learn more about datasource connections, see [Datasource connections](analysis-services-datasource.md).
 
## Download the latest data providers  

[MSOLAP (amd64)](https://go.microsoft.com/fwlink/?linkid=829576)</br>
[MSOLAP (x86)](https://go.microsoft.com/fwlink/?linkid=829575)</br>
[AMO](https://go.microsoft.com/fwlink/?linkid=829578)</br>
[ADOMD](https://go.microsoft.com/fwlink/?linkid=829577)</br>

## Next steps
With the latest data providers are installed, your client application is ready to connect to a server. To learn more about connecting, see [Get data from Azure Analysis Services](analysis-services-connect.md).
