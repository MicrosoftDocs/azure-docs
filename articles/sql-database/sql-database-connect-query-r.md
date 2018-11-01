---
title: Quickstart for using R script in Azure SQL Database | Microsoft Docs
description: This topic shows you how to use R script in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: r
ms.topic: quickstart
author: dphansen
ms.author: davidph
ms.reviewer:
manager: cgronlun
ms.date: 10/31/2018
---

# Quickstart: Use R script in Azure SQL database

This article explains how you can run R scripts in Azure SQL database. It walks you through the basics of moving data between SQL Server and Python: requirements, data structures, inputs, and outputs. It also explains how to wrap well-formed Python code in a stored procedure [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) to build, train, and use machine learning models in SQL Server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

This quickstart uses as its starting point the resources created in one of these quickstarts:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

You also need to be able to connect to the Azure SQL database using for example [SQL Server Management Studio] or 

- First prerequisite
- Second prerequisite
- Third prerequisite
<!---If you feel like your quickstart has a lot of prerequisites, the
quickstart may be the wrong content type - a tutorial or how-to guide
may be the better option.
If you need them, make Prerequisites your first H2 in a quickstart.
If there’s something a customer needs to take care of before they start (for
example, creating a VM) it’s OK to link to that content before they begin.
--->

## Sign in to <service/product/tool name>

Sign in to the [<service> portal](url).
<!---If you need to sign in to the portal to do the quickstart, this H2 and
link are required.--->

## Procedure 1

<!---Required:
Quickstarts are prescriptive and guide the customer through an end-to-end
procedure. Make sure to use specific naming for setting up accounts and
configuring technology.
Don't link off to other content - include whatever the customer needs to
complete the scenario in the article. For example, if the customer needs
to set permissions, include the permissions they need to set, and the specific
settings in the quickstart procedure. Don't send the customer to another
article to read about it.
In a break from tradition, do not link to reference topics in the procedural
part of the quickstart when using cmdlets or code. Provide customers what they
need to know in the quickstart to successfully complete the quickstart.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or numbering.
--->

Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step one of the procedure
1. Step two of the procedure
1. Step three of the procedure
   ![Browser](media/contribute-how-to-mvc-quickstart/browser.png)
   <!---Use screenshots but be judicious to maintain a reasonable length. Make
    sure screenshots align to the
    [current standards](contribute-mvc-screen-shots.md).
   If users access your product/service via a web browser the first screenshot
   should always include the full browser window in Chrome or Safari. This is
   to show users that the portal is browser-based - OS and browser agnostic.--->
1. Step four of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step one of the procedure
1. Step two of the procedure
1. Step three of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality where
possible.
For the CLI or PowerShell based procedures, don't use bullets or numbering.--->

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```
or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```

## Clean up resources

If you're not going to continue to use this application, delete <resources>
with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the quickstart procedure, a Clean
up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical
quickstart in a series, or, if there are no other quickstarts, to some other
cool thing the customer can do. A single link in the blue box format should
direct the customer to the next article - and you can shorten the title in the
boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->