---
title: Azure Data Catalog procedures 
description: A quickstart on how to create an Azure Data Catalog.
services: data-catalog
author: markingmyname
ms.author: maghan
manager: kfile
ms.service: data-catalog
ms.topic: concept
ms.date: 01/18/2018
---

With Azure Data Catalog, you can perform the following procedures.

| Procedure | Description |
|:--- |:--- |
| **Provision data catalog** |In this procedure, you provision or set up Azure Data Catalog. You do this step only if the catalog has not been set up before. You can have only one data catalog per organization (Microsoft Azure Active Directory domain) even though there are multiple subscriptions associated with your Azure account. |
| **Register data assets** |In this procedure, you register data assets from the AdventureWorks2014 sample database with the data catalog. Registration is the process of extracting key structural metadata such as names, types, and locations from the data source and copying that metadata to the catalog. The data source and data assets remain where they are, but the metadata is used by the catalog to make them more easily discoverable and understandable. |
| **Discover data assets** |In this procedure, you use the Azure Data Catalog portal to discover data assets that were registered in the previous step. After a data source has been registered with Azure Data Catalog, its metadata is indexed by the service so that users can easily search for the data they need. |
| **Annotate data assets** |In this procedure, you provide annotations (information such as descriptions, tags, documentation, or experts) for the data assets. This information supplements the metadata extracted from the data source, and to make the data source more understandable to more people. |
| **Connect to data assets** |In this procedure, you open data assets in integrated client tools (such as Excel and SQL Server Data Tools) and a non-integrated tool (SQL Server Management Studio). |
| **Manage data assets** |In this procedure, you set up security for your data assets. Data Catalog does not give users access to the data itself. The owner of the data source controls data access. <br/><br/> With Data Catalog, you can discover data sources and view the **metadata** related to the sources registered in the catalog. There may be situations, however, where data sources should be visible only to specific users or to members of specific groups. For these scenarios, you can use Data Catalog to take ownership of registered data assets within the catalog and control the visibility of the assets you own. |
| **Remove data assets** |In this procedure, you learn how to remove data assets from the data catalog. |