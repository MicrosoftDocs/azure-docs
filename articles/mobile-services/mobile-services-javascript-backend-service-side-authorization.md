<properties
	pageTitle="Service-side authorization of users in a JavaScript backend mobile service | Microsoft Azure"
	description="Learn how to authorize users in JavaScript backend of Azure Mobile Services"
	services="mobile-services"
	documentationCenter=""
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.topic="article"
	ms.devlang="javascript"
	ms.date="07/21/2016"
	ms.author="krisragh"/>

# Service-side authorization of users in Mobile Services
> [AZURE.SELECTOR]
- [.NET backend](mobile-services-dotnet-backend-service-side-authorization.md)
- [Javascript backend](mobile-services-javascript-backend-service-side-authorization.md)

&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]
> For the equivalent Mobile Apps version of this topic, see [this sample code](https://github.com/Azure/azure-mobile-apps-node/blob/master/samples/personal-table/tables/TodoItem.js#L38). 

This topic shows you how to use server-side scripts to authorize users. In this tutorial, you register scripts with Azure Mobile Services, filter queries based on user IDs, and give users access to only their own data. Filtering a user's query results by the user ID is the most basic form of authorization. Depending on your specific scenario, you might also want to create Users or Roles tables to track more detailed user authorization information, such as which endpoints a given user is permitted to access.

This tutorial is based on the Mobile Services Quick Start and builds on the [Add Authentication to Existing Mobile Services App] tutorial. Please complete [Add Authentication to Existing Mobile Services App] first.

## <a name="register-scripts"></a>Register scripts

1. Log on to the [Azure classic portal], click **Mobile Services**, and then click on your mobile service. Click the **Data** tab, then click the **TodoItem** table.

2. Click **Script**, select the **Insert** operation, replace the existing script with the following function, and then click **Save**.

        function insert(item, user, request) {
          item.userId = user.userId;
          request.execute();
        }

	This script adds the user ID of the authenticated user to the item before insertion.

    >[AZURE.NOTE] Make sure that [dynamic schema](https://msdn.microsoft.com/library/azure/jj193175.aspx) is enabled. Otherwise, the *userId* column is not added automatically. This setting is enabled by default for a new mobile service.

3. Similarly, replace the existing **Read** operation with the following function. This script filters returned TodoItem objects so that a user receives only the items that they insert themselves.

        function read(query, user, request) {
           query.where({ userId: user.userId });
           request.execute();
        }

## <a name="test-app"></a>Test the app

1. Notice that when you now run your client-side app, although there are items already in the _TodoItem_ table from previous tutorials, no items are returned. This happens because previous items were inserted without the user ID column and now have null values. Verify newly added items have an associated userId value in the _TodoItem_ table.

2. If you have additional login accounts, verify that users can only see their own data by closing and deleting the app and running it again. When the login credentials dialog is displayed, enter a different login and verify that items entered under the previous login are not displayed.

<!-- Anchors. -->
[Register server scripts]: #register-scripts
[Next Steps]:#next-steps

<!-- Images. -->

<!-- URLs. -->

[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/p/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Add Authentication to Existing Mobile Services App]: /develop/mobile/tutorials/get-started-with-users-ios

[Azure classic portal]: https://manage.windowsazure.com/
