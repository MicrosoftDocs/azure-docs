<properties pageTitle="Service-side authorization (Windows Phone) | Mobile Dev Center" description="Learn how to authorize users in the JavaScript backend of Azure Mobile Services." services="" documentationCenter="windows" authors="ggailey777" manager="dwrede" editor=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-phone" ms.devlang="dotnet" ms.topic="article" ms.date="09/29/2014" ms.author="glenga"/>

# Service-side authorization of Mobile Services users

[WACOM.INCLUDE [mobile-services-selector-service-auth-users](../includes/mobile-services-selector-service-auth-users.md)]	


<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">

<p>This topic shows you how to use server scripts to authorize authenticated users for accessing data in Azure Mobile Services from a Windows Phone 8 app. In this tutorial you register scripts with Mobile Services to filter queries based on the userId of an authenticated user, ensuring that each user can see only their own data.</p>
<p>This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial <a href="/en-us/develop/mobile/tutorials/get-started-with-users-wp8">Get started with authentication</a>. Before you start this tutorial, you must first complete <a href="/en-us/develop/mobile/tutorials/get-started-with-users-wp8">Get started with authentication</a>.</p>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://go.microsoft.com/fwlink/?LinkId=298630" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/mobile-wp8-scripts-for-authentication-180x120.png') !important;" href="http://go.microsoft.com/fwlink/?LinkId=298630" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">15:00</span></div>
</div> 

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

    > [AZURE.NOTE] Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the **userId** column to the **TodoItem** table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Phone Store.


5. Repeat steps 3 and 4 to replace the existing **Read** operation with the following function:

        function read(query, user, request) {
           query.where({ userId: user.userId });    
           request.execute();
        }

   	This script filters the returned TodoItem objects so that each user only receives the items that they inserted.

## Test the app

1. In Visual Studio 2012 Express for Windows Phone, open the project that you modified when you completed the tutorial [Get started with authentication].

2. Press the F5 key to run the app, then log-on with your chosen identity provider. 

   	Notice that this time, although there are items already in the TodoItem table from previous tutorials, no items are returned. This happens because previous items were inserted without the userId column and now have null values.

3. In the app, enter text in the textbox and then click **Save**.

   	![][3]

   	This inserts both the text and the userId in the TodoItem table in the mobile service. Because the new item has the correct userId value, it is returned by the mobile service.

5. Back in the **todoitem** table in the [Management Portal][Azure Management Portal], click **Browse** and verify that each newly added item now has an associated userId value.

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
[0]: ./media/mobile-services-windows-phone-authorize-users-in-scripts/mobile-services-selection.png
[1]: ./media/mobile-services-windows-phone-authorize-users-in-scripts/mobile-portal-data-tables.png
[2]: ./media/mobile-services-windows-phone-authorize-users-in-scripts/mobile-insert-script-users.png
[3]: ./media/mobile-services-windows-phone-authorize-users-in-scripts/mobile-quickstart-startup-wp8.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-wp8
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-wp8
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8

[Azure Management Portal]: https://manage.windowsazure.com/
