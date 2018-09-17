---
title: Create highly available MySQL databases in Azure Stack | Microsoft Docs
description: Learn how to create a SQL Server resource provider host computer and highly available MySQL databases with Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/18/2018
ms.author: jeffgilb
ms.reviewer: quying
---

# Tutorial: create highly available MySQL databases

As an Azure Stack tenant user, you can configure server VMs to host MySQL Server databases. After a MySQL cluster is successfully created, and managed by Azure Stack, users who have subscribed to MySQL services can easily create highly available MySQL databases.

This tutorial shows how to use an Azure Stack quickstart template to create a [SQL Server AlwaysOn availability group](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server?view=sql-server-2017), add it as an Azure Stack MySQL Hosting Server, and then create a highly available MySQL database.














What you will learn:

> [!div class="checklist"]
> * Create a MySQL Server AlwaysOn availability group from a template
> * Create an Azure Stack SQL Hosting Server
> * Create a highly available SQL database

In this tutorial, a two VM SQL Server AlwaysOn availablity group will be created and configured using available Azure Stack marketplace items. 



## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a SQL Server AlwaysOn availability group from a template
> * Create an Azure Stack SQL Hosting Server
> * Create a highly available SQL database

Advance to the next tutorial to learn how to:
> [!div class="nextstepaction"]
> [Create highly available MySQL databases](azure-stack-tutorial-mysql.md)