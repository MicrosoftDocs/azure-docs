<properties
	pageTitle="Create connection for SQL Connector"
	description="IT Doc: steps to do before you can sign up for PowerApps Enterprise"
	services="power-apps"
	documentationCenter="" 
	authors="LinhTran"
	manager="gautamt"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/02/2015"
   ms.author="litran"/>

## Create connection for SQL Connector

1. In the Azure portal, open PowerApps, and select **Manage APIs**. A list of the configured APIs is displayed:  
![][1]  
2. Select the API you want and select **Connections**. In Connections, select **Add connection**:   
![][2]  
3. Enter a name for the connection and enter the connection string. Entering the connection string requires you to know some specific properties about the service you're connecting to. For example, if you're connecting to on-premises SQL Server, then you need to know the username, password, and other properties required to successfully make the connection. 
4. Select **Add** to save your changes.

[1]: ./media/powerapps-create-connection-sql-connector/apilist.png
[2]: ./media/powerapps-create-connection-sql-connector/addconnection.png