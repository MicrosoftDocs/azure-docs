<properties urlDisplayName="Authorize Users in Scripts (Xamarin.iOS)" pageTitle="Authorize users in scripts (Xamarin.iOS) - Azure Mobile Services" metaKeywords="Azure authorizing user, Xamarin.iOS scripts authorization, authorize mobile services" description="Learn how to authorize users with scripts in your Azure Mobile Services app for Xamarin.iOS." metaCanonical="" disqusComments="1" umbracoNaviHide="1" title="Use scripts to authorize users in Mobile Services" documentationCenter="Mobile" authors="donnam" manager="dwrede" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-xamarin-ios" ms.devlang="dotnet" ms.topic="article" ms.date="11/11/2014" ms.author="donnam" />

# Use scripts to authorize users in Mobile Services

[WACOM.INCLUDE [mobile-services-selector-service-auth-users](../includes/mobile-services-selector-service-auth-users.md)]	

This topic shows you how to use server scripts to authorize authenticated users for accessing data in Azure Mobile Services from a Xamarin.iOS app.  In this tutorial you register scripts with Mobile Services to filter queries based on the userId of an authenticated user, ensuring that each user can see only their own data.

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with authentication]. Before you start this tutorial, you must first complete [Get started with authentication].  

## <a name="register-scripts"></a>Register scripts
Because the quickstart app reads and inserts data, you need to register scripts for these operations against the TodoItem table.

1. Log on to the [Azure Management Portal], click **Mobile Services**, and then click your app. 

   	![][0]

2. Click the **Data** tab, then click the **TodoItem** table.

   	![][1]

3. Click **Script**, then select the **Insert** operation.

   	![][2]

4. Replace the existing script with the following function, and then click **Save**.

        function insert(item, user, request) {
          item.userId = user.userId;    
          request.execute();
        }

    This script adds a userId value to the item, which is the user ID of the authenticated user, before it is inserted into the TodoItem table. 

    > [AZURE.NOTE] Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the **userId** column to the **TodoItem** table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Store.


5. Repeat steps 3 and 4 to replace the existing **Read** operation with the following function:

        function read(query, user, request) {
           query.where({ userId: user.userId });    
           request.execute();
        }

   	This script filters the returned TodoItem objects so that each user only receives the items that they inserted.

## Test the app

1. In Xamarin Studio or Visual Studio, open the project that you modified when you completed the tutorial [Get started with authentication].

2. Press the **Run** button to build the project, start the app in the iPhone emulator, then log-on with your chosen identity provider. 

   	Notice that this time, although there are items already in the TodoItem table from previous tutorials, no items are returned. This happens because previous items were inserted without the userId column and now have null values.

3. In the app, enter text in **Insert a TodoItem** and then click **Save**.

   	![][3]

   	This inserts both the text and the userId in the TodoItem table in the mobile service. Because the new item has the correct userId value, it is returned by the mobile service and displayed in the second column.

5. Back in the **todoitem** table in the [Management Portal][Azure Management Portal], click **Browse** and verify that each newly added item how has an associated userId value.

6. (Optional) If you have additional login accounts, you can verify that users can only see their own data by closing the app and then running it again. When the login credentials dialog is displayed, enter a different login, and then verify that the items entered under the previous account are not displayed.

## Next steps

This concludes the tutorials that demonstrate the basics of working with authentication. Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Register server scripts]: #register-scripts
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/partner-xamarin-mobile-services-ios-authorize-users-in-scripts/mobile-services-selection.png
[1]: ./media/partner-xamarin-mobile-services-ios-authorize-users-in-scripts/mobile-portal-data-tables.png
[2]: ./media/partner-xamarin-mobile-services-ios-authorize-users-in-scripts/mobile-insert-script-users.png
[3]: ./media/partner-xamarin-mobile-services-ios-authorize-users-in-scripts/mobile-quickstart-startup-ios.png

<!-- URLs. -->

[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/p/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios

[Azure Management Portal]: https://manage.windowsazure.com/
