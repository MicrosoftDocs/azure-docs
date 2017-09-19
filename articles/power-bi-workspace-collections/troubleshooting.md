---
title: Microsoft Power BI Workspace Collection troubleshooting
description: This article provides answers for how  to troubleshoot **Power BI Workspace Collections**. 
services: power-bi-embedded
documentationcenter: ''
author: guyinacube
manager: erikre
editor: ''
tags: ''

ROBOTS: NOINDEX
ms.service: power-bi-embedded
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: powerbi
ms.date: 09/19/2017
ms.author: asaxton

---
# Microsoft Power BI Workspace Collection troubleshooting

This article provides answers for how  to troubleshoot **Power BI Workspace Collections**.

> [!IMPORTANT]
> Power BI Workspace Collections is deprecated and will be available until June 2018 or when your contract indicates. You are encouraged to plan your migration to Power BI Embedded to avoid interruption in your application. For information on how to migrate your data to Power BI Embedded, see [How to migrate Power BI Workspace Collections content to Power BI Embedded](https://powerbi.microsoft.com/documentation/powerbi-developer-migrate-from-powerbi-embedded/).

<a name="connection-string"/>

## Setting SQL Server connection strings
To set a SQL Server connecting string, you need to follow a specific format. Below is an example connection string for SQL Server.

```
"Persist Security Info=False;Integrated Security=true;Initial Catalog=Northwind;server=(local)"
```

To learn more about SQL Server connection strings, see the following articles:

* [SQL Server Connection Strings](https://msdn.microsoft.com/library/jj653752.aspx)
* [SqlConnection.ConnectionString](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnection.connectionstring.aspx)

<a name="credentials"/>

## Setting credentials
In the case where you have credentials for a development or staging environment, such as user name and password, you might need to update credentials that match a production solution.

## See Also

* [Get started with sample](get-started-sample.md)
* [What is Power BI Embedded](what-are-power-bi-workspace-collections.md)