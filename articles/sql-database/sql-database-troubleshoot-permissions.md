<properties 
	pageTitle="" 
	description="" 
	services="sql-database" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/03/2015" 
	ms.author="jeffreyg"/>
 
##Steps to grant and remove database access
1.	To change the administrative password for a logical server, click SQL Servers, select the server from the list, and then click Reset Password.
2.	See How to: Configure firewall settings on SQL Database to make sure only authorized IP addresses are allowed to access the server and database.
3.	Create contained database users in the user database using the CREATE USER statement. See Contained Database Users - Making Your Database Portable.
4.	To authenticate contained database users by using your Azure Active Directory, see Connecting to SQL Database By Using Azure Active Directory Authentication.
5.	Create additional logins for high-privileged users in the virtual master database using the CREATE LOGIN statement. See the Managing Logins section of Managing databases and logins in Azure SQL Database.

Additional resources 
Azure SQL Database security guidelines and limitations
Managing Azure SQL Database using SQL Server Management Studio

