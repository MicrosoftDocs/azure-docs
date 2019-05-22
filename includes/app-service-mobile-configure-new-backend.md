---
title: "include file"
description: "include file"
services: app-service\mobile
author: conceptdev
ms.service: app-service-mobile
ms.topic: "include"
ms.date: 05/06/2019
ms.author: crdun
ms.custom: "include file"
---
1. Download the client SDK quickstarts for the following platforms:
    
    [iOS (Objective-C)](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/iOS)
    [iOS (Swift)](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/iOS-Swift)
    [Android (Java)](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/android)
    [Xamarin.iOS](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/xamarin.iOS)
    [Xamarin.Android](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/xamarin.android)
    [Xamarin.Forms](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/xamarin.forms)
    [Cordova](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/cordova)
    [Windows (C#)](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/client/windows-uwp-cs)
        
2. Azure Mobile Apps support .NET and Node backend SDK. Depending on your app type, download the [.NET](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/backend/dotnet) or [Node](https://github.com/Azure/azure-mobile-apps-quickstarts/tree/master/backend/node) project for open source repository.

3. You will have to add a database connection or connect to an existing connection. First, determine whether you’ll create a data store or use an existing one.

4. **Create a new data store** : If you’re going to create a data store, use the following quickstart:

    [Quickstart: Getting started with single databases in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-single-database-quickstart-guide)

5. **Existing data source** : Follow the instructions below if you want to use an existing database connection
    1. SQL Database Connection String format - 
    `Data Source=tcp:{your_SQLServer},{port};Initial Catalog={your_catalogue};User ID={your_username};Password={your_password}`
      
       **{your_SQLServer}** Name of the server, this can be found in the overview page for your database and is usually in the form of “server_name.database.windows.net”.
        **{port}** usually 1433.
        **{your_catalogue}** Name of the database.
        **{your_username}** User name to access your database.
        **{your_password}** Password to access your database.
        
        [Learn more about SQL Connection String format](https://docs.microsoft.com/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings)

    2. Add the connection string to your **mobile app**
        In App Service, you can manage connection strings for your application by using the **Configuration** option in the menu.

        To add a connection string:

        1. Click on the **Application settings** tab.

        2. Click on **[+] New connection string**.

        3. You will need to provide **Name**, **Value** and **Type** for your connection string.

        4. Type **Name** as `MS_TableConnectionString`

        5. Value should be the connecting string you formed in the step before.

        6. If you are adding a connection string to a SQL Azure database choose **SQLAzure** under **type**.        
