<properties
	pageTitle="Troubleshoot Azure SQL database permissions and access"
	description="Quick steps to troubleshoot common permissions, access, user, and login issues"
	services="sql-database"
	documentationCenter=""
	authors="v-shysun"
	manager="msmets"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/28/2016"
	ms.author="v-shysun"/>

#Troubleshoot common Azure SQL database permissions and access issues
Use this topic for quick steps to grant and remove access to an Azure SQL database. For more comprehensive information, see:

- [Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md)
- [Securing your SQL database](sql-database-security.md)
- [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)

##To change the administrative password for a logical server
- In the [Azure Portal](https://portal.azure.com) click **SQL Servers**, select the server from the list, and then click **Reset Password**.
##To help make sure only authorized IP addresses are allowed to access the server
- See [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md).

##To create contained database users in the user database
- Use the [CREATE USER](https://msdn.microsoft.com/library/ms173463.aspx) statement and see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).

## To authenticate contained database users by using your Azure Active Directory
- See [Connecting to SQL Database By Using Azure Active Directory Authentication](sql-database-aad-authentication.md).

## To create additional logins for high-privileged users in the virtual master database
-Use the [CREATE LOGIN](https://msdn.microsoft.com/library/ms189751.aspx) statement, and see the Managing Logins section of [Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md) for more detail.
