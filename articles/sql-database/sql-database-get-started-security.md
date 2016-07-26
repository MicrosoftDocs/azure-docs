<properties
	pageTitle="SQL Database tutorial: Getting Started with Security"
	description="Learn how to create user accounts to access and to manage a database."
	keywords=""
	services="sql-database"
	documentationCenter=""
	authors="carlrabeler"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="07/19/2016"
	ms.author="carlrab"/>

# SQL Database tutorial: Create SQL database user accounts to access and manage a database using the Azure portal


> [AZURE.SELECTOR]
- [Get started tutorial](sql-database-get-started-security.md)
- [Grant access](sql-database-manage-logins.md)

In this tutorial, you'll learn how to use the Aure portal to:

- Login to SQL Database using a server-level principal login
- Create a SQL Database user account
- Grant a SQL Database user account dbo permissions within a user database
- Connect to a SQL database with a user account that is not a server-level principal 

[AZURE.INCLUDE [Login](../../includes/azure-getting-started-portal-login.md)]


[AZURE.INCLUDE [Create SQL Database logical server](../../includes/sql-database-sql-server-management-studio-connect-server-principal.md)]


[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-create-new-database-user.md)]


[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-grant-database-user-dbo-permissions.md)]


[AZURE.INCLUDE [Create SQL Database database](../../includes/sql-database-sql-server-management-studio-connect-user.md)]


## Next steps
Now that you've completed this SQL Database tutorial and created a user account and granted the user account dbo permissions, you are ready to learn more about 
[SQL Database security](sql-database-manage-logins.md).


