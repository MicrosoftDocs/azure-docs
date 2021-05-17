---
title: Compatibility issues with third-party applications and Azure Synapse Analytics 
description: Describes known issues that third-party applications may find with Azure Synapse
services: synapse-analytics 
author: periclesrocha
ms.service: synapse-analytics 
ms.topic: troubleshooting
ms.subservice: sql
ms.date: 11/18/2020 
ms.author: procha 
ms.reviewer: jrasnick
---

# Compatibility issues with third-party applications and Azure Synapse Analytics

Applications built for SQL Server will seamlessly work with Azure Synapse dedicated SQL pools. In some cases, however, features and language elements that are commonly used in SQL Server may not be available in Azure Synapse, or they may behave differently.

This article lists known issues you may come across when using third-party applications with Azure Synapse Analytics. 

## Tableau error: “An attempt to complete a transaction has failed. No corresponding transaction found”

Starting from Azure Synapse dedicated SQL pool version 10.0.11038.0, some Tableau queries making stored procedure calls may fail with the following error message: "**[Microsoft][ODBC Driver 17 for SQL Server][SQL Server]111214; An attempt to complete a transaction has failed. No corresponding transaction found.**"

### Cause

This is an issue in Azure Synapse dedicated SQL pool caused by the introduction of new system stored procedures that are called automatically by the ODBC and JDBC drivers. One of those system stored procedures can cause open transactions to be aborted if they fail execution. This issue can happen depending on the client application logic.

### Solution
Customers seeing this particular issue when using Tableau connected to Azure Synapse dedicated SQL pools should set FMTONLY to YES in the SQL connection. For Tableau Desktop and Tableau Server, you should use a Tableau Data source Customization (TDC) file to ensure Tableau passes this parameter to the driver.  

> [!NOTE] 
> Microsoft does not provide support for third-party tools. While we have tested that this solution works with Tableau Desktop 2020.3.2, you should use this workaround on your own capacity.
>

* [To learn how to make global customizations with a TDC file on Tableau Desktop, refer to Tableau Desktop documentation.](https://help.tableau.com/current/pro/desktop/en-us/odbc_customize.htm)
* [To learn how to make global customizations with a TDC file on Tableau Server, refer to Using a .TDC File with Tableau Server.](https://kb.tableau.com/articles/howto/using-a-tdc-file-with-tableau-server)

The example below shows a Tableau TDC file that passes the FMTONLY=YES parameter to the SQL connection string:

```json
<connection-customization class='azure_sql_dw' enabled='true' version='18.1'>
	<vendor name='azure_sql_dw' />
	<driver name='azure_sql_dw' />
	<customizations>		
        <customization name='odbc-connect-string-extras' value='UseFMTONLY=yes' />
	</customizations>
</connection-customization>
```
For more details about using TDC files, contact Tableau support. 

## See also

* [T-SQL language elements for dedicated SQL pool in Azure Synapse Analytics.](./sql-data-warehouse-reference-tsql-language-elements.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json)
* [T-SQL statements supported for dedicated SQL pool in Azure Synapse Analytics.](./sql-data-warehouse-reference-tsql-statements.md)