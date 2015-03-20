<properties
	pageTitle="Service-side Authorization of Users in Mobile Services with JavaScript Backend | Mobile Dev Center"
	description="Learn how to authorize users in JavaScript backend of Azure Mobile Services"
	services="mobile-services"
	authors="krisragh"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.topic="article"
	ms.date="2/18/2015"
	ms.author="krisragh"/>

# Service-side Authorization of Users in Mobile Services

> [AZURE.SELECTOR-LIST (Platform | Backend)]
- [(Any | .NET)](mobile-services-dotnet-backend-service-side-authorization.md)
- [(Any | Javascript)](mobile-services-javascript-backend-service-side-authorization.md)

This topic shows you how to use server-side scripts to authorize users. In this tutorial, you register scripts with Azure Mobile Services, filter queries based on user IDs, and give users access to only their own data.

This tutorial is based on the Mobile Services Quick Start and builds on the [Add Authentication to Existing Mobile Services App] tutorial. Please complete [Add Authentication to Existing Mobile Services App] first.

## <a name="register-scripts"></a>Register scripts

1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click on your mobile service. Click the **Data** tab, then click the **TodoItem** table.

2. Click **Script**, then select the **Insert** operation.

   	![][2]

3. Replace the existing script with the following function, and then click **Save**. This script adds the user ID of the authenticated user to the item before insertion.

        function insert(item, user, request) {
          item.userId = user.userId;
          request.execute();
        }


    > [AZURE.NOTE] [Dynamic schema must be enabled](https://msdn.microsoft.com/library/azure/jj193175.aspx) for this to work. This setting is enabled by default for new mobile services.

5. Similarly, replace the existing **Read** operation with the following function. This script filters returned TodoItem objects so that a user receives only the items that they insert themselves.

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
[0]: ./media/mobile-services-ios-authorize-users-in-scripts/mobile-services-selection.png
[1]: ./media/mobile-services-ios-authorize-users-in-scripts/mobile-portal-data-tables.png
[2]: ./media/mobile-services-ios-authorize-users-in-scripts/mobile-insert-script-users.png
[3]: ./media/mobile-services-ios-authorize-users-in-scripts/mobile-quickstart-startup-ios.png

<!-- URLs. -->

[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/p/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started/#create-new-service
[Add Mobile Services to Existing App]: /develop/mobile/tutorials/get-started-with-data-ios
[Add Authentication to Existing Mobile Services App]: /develop/mobile/tutorials/get-started-with-users-ios
[Add Push Notifications to Existing App]: /develop/mobile/tutorials/get-started-with-push-ios

[Azure Management Portal]: https://manage.windowsazure.com/
