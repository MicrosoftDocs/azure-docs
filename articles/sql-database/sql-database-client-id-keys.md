<properties
   pageTitle="Register your app to talk with Azure SQL Database | Microsoft Azure"
   description="Enable your app to communicate with SQL Database and get the needed client values for connecting your app to SQL Database."
   services="sql-database"
   documentationCenter=""
   authors="stevestein"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="03/05/2016"
   ms.author="sstein"/>

# Register your app to talk with Azure SQL Database


## Register a native client application and get the client id

To authenticate your client application based on the current user you must first register your application in the AAD domain associated with the subscription under which the Azure resources have been created. If your Azure subscription was created with a Microsoft account rather than a work or school account you will already have a default AAD domain. Currently, registering applications need to be done in the [Classic Portal](https://manage.windowsazure.com/). 

To create a new application and register it do the following:

1. Login to the [Classic Portal](https://manage.windowsazure.com/).
1. Locate **Active Directory** in the menu and open it.

    ![AAD][1]

2. Select the directory to authenticate your application and click it's **Name**.

    ![Directories][4]

3. On the directory page, click **APPLICATIONS**.

    ![Applications][5]

4. Click **ADD** to create a new application.

    ![Add application][6]

5. Select **Add an application my organization is developing**.

5. Provide a **NAME** for the app, and select **NATIVE CLIENT APPLICATION**.

    ![Add application][7]

6. Provide a **REDIRECT URI**. It doesn't need to be an actual endpoint, just a valid URI.

    ![Add application][8]

7. Finish creating the app, click **CONFIGURE**, and copy the **CLIENT ID** (this is the value you will need in your code!!).

    ![get client id][9]


1. On the bottom of the page click on **Add application**.
1. Select **Microsoft Apps**.
1. Select **Azure Service Management API**, and then complete the wizard.
2. With the API selected you now need to grant the permissions required to access this API by selecting **Access Azure Service Management...**.

    ![permissions][2]

2. Click **SAVE**.



## Register a web app (or web api) and get the client id and key

To create a new application and register it in the correct active directory do the following:

1. Login to the [Classic Portal](https://manage.windowsazure.com/).
1. Locate **Active Directory** in the menu and open it.

    ![AAD][1]

2. Select the directory to authenticate your application and click it's **Name**.

    ![Directories][4]

3. On the directory page, click **APPLICATIONS**.

    ![Applications][5]

4. Click **ADD** to create a new application.

    ![Add application][6]

5. Select **Add an application my organization is developing**.

5. Provide a **NAME** for the app, and select **WEB APPLICATION AND/OR WEB API**.

    ![Add application][10]

6. Provide a **SIGN-ON URL**, and an **APP ID URI**. It doesn't need to be an actual endpoint, just a valid URI.

    ![Add application][11]

7. Finish creating the app, then click **CONFIGURE**.

    ![configure][12]

8. Scroll to the **keys** section and select **1 year** in the **Select duration** list. The key value will be displayed after you save so we'll come back and copy the key later.

    ![set key duration][13]



1. Scroll towards the bottom of the page and click **Add application**.
1. Select **Microsoft Apps**.
1. Locate and select **Azure Service Management API**, and then complete the wizard.
2. Click **Delegated permissions** and select **Access Azure Service Management...**.

    ![permissions][2]

2. Click **SAVE** at the bottom of the page.
3. After the save completes locate and save the CLIENT ID and key:

    ![web app secrets][14]



## Get your domain name

The domain name is sometimes required for your auth code. An easy way to identify the proper domain name is to:

1. Go to the [Azure Portal](https://portal.azure.com).
2. Hover over your name in the upper right corner and note the Domain that appears in the pop-up window.

    ![Identify domain name][3]



For specific code examples related to Azure AD authentication see the [SQL Server Security Blog](http://blogs.msdn.com/b/sqlsecurity/) on MSDN.

## See also

[Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md)

[Contained Database Users](https://msdn.microsoft.com/library/ff929071.aspx)

[CREATE USER (Transact-SQL)](http://msdn.microsoft.com/library/ms173463.aspx)


<!--Image references-->
[1]: ./media/sql-database-client-id-keys/aad.png
[2]: ./media/sql-database-client-id-keys/permissions.png
[3]: ./media/sql-database-client-id-keys/getdomain.png
[4]: ./media/sql-database-client-id-keys/aad2.png
[5]: ./media/sql-database-client-id-keys/aad-applications.png
[6]: ./media/sql-database-client-id-keys/add.png
[7]: ./media/sql-database-client-id-keys/add-application.png
[8]: ./media/sql-database-client-id-keys/add-application2.png
[9]: ./media/sql-database-client-id-keys/clientid.png
[10]: ./media/sql-database-client-id-keys/add-application-web.png
[11]: ./media/sql-database-client-id-keys/add-application-app-properties.png
[12]: ./media/sql-database-client-id-keys/configure.png
[13]: ./media/sql-database-client-id-keys/key-duration.png
[14]: ./media/sql-database-client-id-keys/web-secrets.png