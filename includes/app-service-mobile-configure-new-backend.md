---
title: "include file"
description: "include file"
services: app-service\mobile
author: conceptdev
ms.service: app-service-mobile
ms.topic: "include"
ms.date: 05/25/2018
ms.author: crdun
ms.custom: "include file"
---
1. Click the **App Services** button, select your Mobile Apps back end, select **Quickstart**, and then select your client platform (iOS, Android, Xamarin, Cordova).

    ![Azure portal with Mobile Apps Quickstart highlighted][quickstart]

1. If a database connection is not configured, create one by doing the following:

    ![Azure portal with Mobile Apps Connect to database][connect]

    a. Create a new SQL database and server. You may need to leave the connection string name field to the default value of MS_TableConnectionString in order to complete step 3 below.

    ![Azure portal with Mobile Apps create new database and server][server]

    b. Wait until the data connection is successfully created.

    ![Azure portal notification of successful creation of data connection][notification]

    c. Data connection must be successful.

    ![Azure portal notification, "You already have a data connection"][already-connection]

1. Under **2. Create a table API**, select Node.js for **Backend language**.

1. Accept the acknowledgment, and then select **Create TodoItem table**.
    This action creates a new to-do item table in your database.

    >[!IMPORTANT]
    > Switching an existing back end to Node.js overwrites all contents. To create a .NET back end instead, see [Work with the .NET back-end server SDK for Mobile Apps][instructions].

<!-- Images. -->
[quickstart]: ./media/app-service-mobile-configure-new-backend/quickstart.png
[connect]: ./media/app-service-mobile-configure-new-backend/connect-to-bd.png
[notification]: ./media/app-service-mobile-configure-new-backend/notification-data-connection-create.png
[server]: ./media/app-service-mobile-configure-new-backend/create-new-server.png
[already-connection]: ./media/app-service-mobile-configure-new-backend/already-connection.png

<!-- URLs -->
[instructions]: ../articles/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#create-app
