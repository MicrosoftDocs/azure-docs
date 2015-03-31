<properties
	pageTitle="Add Mobile Services to Existing App in iOS"
	description="Learn how to get started using Mobile Services to leverage data in your iOS app."
	services="mobile-services"
	documentationCenter="ios"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="03/03/2015"
	ms.author="krisragh"/>

# Add Mobile Services to Existing App

[AZURE.INCLUDE [mobile-services-selector-get-started-data](../includes/mobile-services-selector-get-started-data.md)]

In this tutorial, you download an existing app that stores data in-memory and change it to work with an Azure mobile service.

Completing the [Quick Start] is a pre-requisite before starting this tutorial. You will re-use the mobile service you create in the Quick Start.


##<a name="download-app"></a>Download GetStartedWithData Project

This tutorial is built on the [GetStartedWithData iOS app]. The app is identical to [Quick Start], except that added items are stored in memory.

Download the [GetStartedWithData iOS app]. In Xcode, open the project and examine **TodoService.m**. There are eight **// TODO** comments that specify the steps to make this app work.

##<a name="update-app"></a>Update App to Use Mobile Service for Data Access

[AZURE.INCLUDE [mobile-services-ios-enable-mobile-service-access](../includes/mobile-services-ios-enable-mobile-service-access.md)]

##<a name="test-app"></a>Test App

1. In Xcode, click **Run** to start the app. Add items to the todo list by typing in text and clicking **+**.

2. Verify that the changes were persisted to the database in Azure. Examine the database using the Azure Management Portal or Visual Studio's SQL Server Object Explorer.

3. To examine the database using the portal, in the Dashboard page for your mobile service, click the database name, click 'Manage' to manage the database, and login. Execute the following query, but use your mobile service's name instead of `todolist`.

```
        SELECT * FROM [todolist].[todoitems]
```

<!-- Anchors. -->
[Download the iOS app project]: #download-app
[Create the mobile service]: #create-service
[Add a data table for storage]: #add-table
[Update the app to use Mobile Services]: #update-app
[Test the app against Mobile Services]: #test-app
[Next Steps]:#next-steps
[Download the service locally]: #download-the-service-locally
[Test the mobile service]: #test-the-service
[Publish the mobile service to Azure]: #publish-mobile-service


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-ios-get-started-data/mobile-quickstart-startup-ios.png
[8]: ./media/mobile-services-dotnet-backend-ios-get-started-data/mobile-dashboard-tab.png
[9]: ./media/mobile-services-dotnet-backend-ios-get-started-data/mobile-todoitem-data-browse.png
[17]: ./media/mobile-services-dotnet-backend-ios-get-started-data/manage-sql-azure-database.png
[18]: ./media/mobile-services-dotnet-backend-ios-get-started-data/sql-azure-query.png


<!-- URLs. -->

[Validate and modify data with scripts]: /develop/mobile/tutorials/validate-modify-and-augment-data-dotnet
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Get started with data]: /develop/mobile/tutorials/get-started-with-data-ios
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-ios
[Get started with push notifications]: /develop/mobile/tutorials/get-started-with-push-ios
[JavaScript backend version]: /develop/mobile/tutorials/get-started-with-data-ios


[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[GitHub]:  http://go.microsoft.com/fwlink/p/?LinkId=268622
[GitHub repo]: http://go.microsoft.com/fwlink/p/?LinkId=268784

[Quick Start]: mobile-services-dotnet-backend-ios-get-started.md
[GetStartedWithData iOS app]: http://go.microsoft.com/fwlink/p/?LinkId=268622
