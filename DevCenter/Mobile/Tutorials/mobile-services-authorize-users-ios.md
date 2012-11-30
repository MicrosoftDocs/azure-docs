<properties linkid="develop-mobile-tutorials-authorize-users-in-scripts-ios" urlDisplayName="Authorize Users in Scripts (iOS)" pageTitle="Authorize users in scripts (iOS) - Windows Azure Mobile Services" metaKeywords="Windows Azure authorizing user, iOS scripts authorization, authorize mobile services" metaDescription="Learn how to authorize users with scripts in your Windows Azure Mobile Services app for iOS." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />



<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14810" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

<!--<div class="dev-center-os-selector">
  <a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet/" title="Windows Store version">Windows Store app</a>
  <a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-ios/" title="iOS version" class="current">iOS app</a>
</div>-->

# Use scripts to authorize users in Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-dotnet" title="Windows Store C#">Windows Store C#</a>
	<a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
	<a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-wp8" title="Windows Phone 8">Windows Phone 8</a> 
	<a href="/en-us/develop/mobile/tutorials/authorize-users-in-scripts-ios" title="iOS" class="current">iOS</a> 
</div>	


_The iOS client library for Mobile Services is currently under development on [GitHub]. We welcome feedback on and contributions to this library._

This topic shows you how to use server scripts to authorize authenticated users for accessing data in Windows Azure Mobile Services from an iOS app.  In this tutorial you register scripts with Mobile Services to filter queries based on the userId of an authenticated user, ensuring that each user can see only their own data.

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with authentication]. Before you start this tutorial, you must first complete [Get started with authentication].  

## <a name="register-scripts"></a>Register scripts
Because the quickstart app reads and inserts data, you need to register scripts for these operations against the TodoItem table.

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app. 

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

    <div class="dev-callout"><b>Note</b>
	<p>Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the <strong>userId</strong> column to the <strong>TodoItem</strong> table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Store.</p>
    </div>


5. Repeat steps 3 and 4 to replace the existing **Read** operation with the following function:

        function read(query, user, request) {
           query.where({ userId: user.userId });    
           request.execute();
        }

   This script filters the returned TodoItem objects so that each user only receives the items that they inserted.

## Test the app

1. In Xcode, open the project that you modified when you completed the tutorial [Get started with authentication].

2. Press the **Run** button to build the project, start the app in the iPhone emulator, then log-on with your chosen identity provider. 

   Notice that this time, although there are items already in the TodoItem table from preview tutorials, no items are returned. This happens because previous items were inserted without the userId column and now have null values.

3. In the app, enter text in **Insert a TodoItem** and then click **Save**.

   ![][3]

   This inserts both the text and the userId in the TodoItem table in the mobile service. Because the new item has the correct userId value, it is returned by the mobile service and displayed in the second column.

5. Back in the **todoitem** table in the [Management Portal][Windows Azure Management Portal], click **Browse** and verify that each newly added item how has an associated userId value.

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
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-users.png
[3]: ../Media/mobile-quickstart-startup-ios.png

<!-- URLs. -->
[GitHub]: http://go.microsoft.com/fwlink/p/?LinkId=268784
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/p/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ./mobile-services-get-started-with-data-ios.md
[Get started with authentication]: ./mobile-services-get-started-with-users-ios.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/