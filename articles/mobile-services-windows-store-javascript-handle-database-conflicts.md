<properties 
	pageTitle="Handle database write conflicts with optimistic concurrency (Windows Store) | Mobile Dev Center" 
	writer="wesmc" 
	description="Learn how to handle database write conflicts on both the server and in your Windows Store application." 
	documentationCenter="windows" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="javascript" 
	ms.topic="article" 
	ms.date="09/23/2014" 
	ms.author="wesmc"/>

# Handling database write conflicts

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/develop/mobile/tutorials/handle-database-write-conflicts-dotnet/" title="Windows Store C#">Windows Store C#</a>
<a href="/en-us/documentation/articles/mobile-services-windows-store-javascript-handle-database-conflicts/" title="Windows Store JavaScript" class="current">Windows Store JavaScript</a>
<a href="/en-us/develop/mobile/tutorials/handle-database-write-conflicts-wp8/" title="Windows Phone">Windows Phone</a></div>	

This tutorial is intended to help you better understand how to handle conflicts that occur when two or more clients write to the same database record in a Windows Store app. Two or more clients may write changes to the same item, at the same time, in some scenarios. Without any conflict detection, the last write would overwrite any previous updates even if this was not the desired result. Azure Mobile Services provides support for detecting and resolving these conflicts. This topic walks you through the steps that allow you to handle database write conflicts on both the server and in your application.

In this tutorial you will add functionality to the quickstart app to handle contentions that occur when updating the TodoItem database. This tutorial walks you through these basic steps:

1. [Update the application to allow updates]
2. [Enable Conflict Detection in your application]
3. [Test database write conflicts in the application]
4. [Automatically handling conflict resolution in server scripts]


This tutorial requires the following

+ Microsoft Visual Studio 2013 Express for Windows or later.
+ This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] downloading the JavaScript language version of the starter project. 
+ [Azure Account]
+ Windows Azure Mobile Services NuGet Package 1.1.5 or later. To get the latest version, follow these steps below:
	1. In Visual Studio, open the project and right-click the project in Solution Explorer then click **Manage Nuget Packages**. 


	2. Expand **Online** and click **Microsoft and .NET**. In the search text box enter **WindowsAzure.MobileServices.WinJS**. Click **Install** on the **Windows Azure Mobile Services for WinJS** NuGet Package.

		![][20]


 

<h2><a name="uiupdate"></a>Update the application to allow updates</h2>

In this section you will update the user interface to allow updating the text of each item. The binding template will contain a checkbox and text class control for each item in the database table. You will be able to update the text field of the TodoItem. The application will handle the `keydown` event so that the item is updated by pressing the **Enter** key.


1. In Visual Studio, open the JavaScript language version of the TodoList project you downloaded in the [Get started with Mobile Services] tutorial.
2. In the Visual Studio Solution Explorer, open default.html and replace the `TemplateItem` div tag definition with the div tag shown below and save the change. This adds a textbox control to allow you to edit the text of a TodoItem.

        <div id="TemplateItem" data-win-control="WinJS.Binding.Template">
          <div style="display: -ms-grid; -ms-grid-columns: auto 1fr">
            <input class="itemCheckbox" type="checkbox" data-win-bind="checked: complete; dataContext: this" />
              <div style="-ms-grid-column: 2; -ms-grid-row-align: center; margin-left: 5px">
                <input id="modifytextbox" class="text win-interactive" data-win-bind="value: text; dataContext: this" />
              </div>
          </div>
        </div>


3. In Solution Explorer for Visual Studio, expand the **js** folder. Open the default.js file and replace the `updateTodoItem` function with the following definition which will not remove updated items from the user interface.

        var updateTodoItem = function (todoItem) {
          // This code takes a freshly completed TodoItem and updates the database. 
          todoTable.update(todoItem);
          };


4. In the default.js file, add the following event handler for the `keydown` event so that the item is updated by pressing the **Enter** key.

        listItems.onkeydown = function (eventArgs) {
          if (eventArgs.key == "Enter") {
            var todoItem = eventArgs.target.dataContext.backingData;
            todoItem.text = eventArgs.target.value;
            updateTodoItem(todoItem);
            }
          };

The application now writes the text changes to each item back to the database when the **Enter** key is pressed.

<h2><a name="enableOC"></a>Enable Conflict Detection in your application</h2>

Azure Mobile Services supports optimistic concurrency control by tracking changes to each item using the `__version` system property column that is added to each table. In this section, we will enable the application to detect these write conflicts through the `__version` system property. Once this system property is enabled on the todoTable, the application will be notified by a `MobileServicePreconditionFailedException` during an update attempt if the record has changed since the last query. The app will then be able to make a choice of whether to commit its change to the database or leave the last change to the database intact. For more information on the System Properties for Mobile Services, see [System Properties].

1. In the default.js file, under the declaration of the `todoTable` variable, add the code to include the **__version** system property enabling support for write conflict detection.

        var todoTable = client.getTable('TodoItem');
        todoTable.systemProperties |= WindowsAzure.MobileServiceTable.SystemProperties.Version;


2. By adding the `Version` system property to the table's system properties, the application will be notified with a `MobileServicePreconditionFailedException` exception during an update if the record has changed since the last query. This exception will be caught in JavaScript with an error function. The error includes the latest version of the item from the server which is used to resolve conflicts. In default.js, update the `updateTodoItem` function to catch the error and call a `resolveDatabaseConflict` function.

        var updateTodoItem = function (todoItem) {
          // This code takes a freshly completed TodoItem and updates the database. 
          // If the server version of the record has been updated, we get the updated
          // record from the Precondition Failed error in order to resolve the conflict.
          var serverItem = null;
          todoTable.update(todoItem).then(null, function (error) {
            if (error.message == "Precondition Failed") {
              serverItem = error.serverInstance;
            }
            else {
              var msgDialog =
                new Windows.UI.Popups.MessageDialog(error.request.responseText,"Update Failed");
                msgDialog.showAsync();
            }
          }).done(function () {
            if (serverItem != null)
              resolveDatabaseConflict(todoItem, serverItem);
          });
        };


3. In default.js, add the definition for the `resolveDatabaseConflict()` function that is referenced in `updateTodoItem` function. Notice that in order to resolve the conflict, you set the local item's version to the updated version from the server before updating the item in the database. Otherwise, you will continually encounter a conflict.


        var resolveDatabaseConflict = function (localItem, serverItem) {
          var content = "This record has been changed as follows on the server already..\n\n" +
              "id : " + serverItem.id + "\n" +
              "text : " + serverItem.text + "\n" +
              "complete : " + serverItem.complete + "\n\n" +
              "Do you want to overwrite the server instance with your data?";
          var msgDialog = new Windows.UI.Popups.MessageDialog(content, "Resolve Database Conflict");
          msgDialog.commands.append(new Windows.UI.Popups.UICommand("Yes"));
          msgDialog.commands.append(new Windows.UI.Popups.UICommand("No"));
          msgDialog.showAsync().done(function (command) {
              if (command.label == "Yes") {
                  localItem.__version = serverItem.__version;
                  updateTodoItem(localItem);
              }
          });
        }


<h2><a name="test-app"></a>Test database write conflicts in the application</h2>

In this section you will build a Windows Store app package to install the app on a second machine or virtual machine. Then you will run the app on both machines generating a write conflict to test the code. Both instances of the app will attempt to update the same item's `text` property requiring the user to resolve the conflict.


1. Create a Windows Store app package to install on second machine or virtual machine. To do this, click **Project**->**Store**->**Create App Packages** in Visual Studio.

	![][0]

2. On the Create Your Packages screen, click **No** as this package will not be uploaded to the Windows Store. Then click **Next**.

	![][1]

3. On the Select and Configure Packages screen, accept the defaults and click **Create**.

	![][10]

4. On the Package Creation Completed screen, click the **Output location** link to open the package location.

   	![][11]

5. Copy the package folder, "todolist_1.0.0.0_AnyCPU_Debug_Test", to the second machine. On that machine, open the package folder and right click on the **Add-AppDevPackage.ps1** PowerShell script and click **Run with PowerShell** as shown below. Follow the prompts to install the app.

	![][12]
  
6. Run instance 1 of the app in Visual Studio by clicking **Debug**->**Start Debugging**. On the Start screen of the second machine, click the down arrow to see "Apps by name". Then click the **todolist** app to run instance 2 of the app. 

	App Instance 1	
	![][2]

	App Instance 2	
	![][2]


7. In instance 1 of the app, update the text of the last item to **Test Write 1**, then press the **Enter** key to update the database. The screenshot below shows an example.
	
	App Instance 1	
	![][3]

	App Instance 2	
	![][2]

8. At this point the last item in instance 2 of the app has an old version of the item. In that instance of the app, enter **Test Write 2** for the `text` property of the last item and press **Enter** to update the database with an old `_version` property.

	App Instance 1	
	![][4]

	App Instance 2	
	![][5]

9. Since the `__version` value used with the update attempt didn't match the server `__version` value, the Mobile Services SDK throws a `MobileServicePreconditionFailedException` as an error in the `updateTodoItem` function allowing the app to resolve this conflict. To resolve the conflict, you can click **Yes** to commit the values from instance 2. Alternatively, click **No** to discard the values in instance 2, leaving the values from instance 1 of the app committed. 

	App Instance 1	
	![][4]

	App Instance 2	
	![][6]



<h2><a name="scriptsexample"></a>Automatically handling conflict resolution in server scripts</h2>

You can detect and resolve write conflicts in server scripts. This is a good idea when you can use scripted logic instead of user interaction to resolve the conflict. In this section, you will add a server side script to the TodoItem table for the application. The logic this script will use to resolve conflicts is as follows:

+  If the TodoItem's ` complete` field is set to true, then it is considered completed and `text` can no longer be changed.
+  If the TodoItem's ` complete` field is still false, then attempts to update `text` will be comitted.

The following steps walk you through adding the server update script and testing it.

1. Log into the [Azure Management Portal], click **Mobile Services**, and then click your app. 

   	![][7]

2. Click the **Data** tab, then click the **TodoItem** table.

   	![][8]

3. Click **Script**, then select the **Update** operation.

   	![][9]

4. Replace the existing script with the following function, and then click **Save**.

		function update(item, user, request) { 
			request.execute({ 
				conflict: function (serverRecord) {
					// Only committing changes if the item is not completed.
					if (serverRecord.complete === false) {
						//write the updated item to the table
						request.execute();
					}
					else
					{
						request.respond(statusCodes.FORBIDDEN, 'The item is already completed.');
					}
				}
			}); 
		}   
5. Run the **todolist** app on both machines. Change the TodoItem `text` for the last item in instance 2 and press **Enter** so the app updates the database.

	App Instance 1	
	![][4]

	App Instance 2	
	![][5]

6. In instance 1 of the app, enter a different value for the last text property then press **Enter**. The app attempts to update the database with an incorrect `__version` property.

	App Instance 1	
	![][13]

	App Instance 2	
	![][14]

7. Notice that no exception was encountered in the app since the server script resolved the conflict allowing the update since the item is not marked complete. To see that the update was truly successful, click **Refresh** in instance 2 to re-query the database.

	App Instance 1	
	![][15]

	App Instance 2	
	![][15]

8. In instance 1, click the check box to complete the last Todo item.

	App Instance 1	
	![][16]

	App Instance 2	
	![][15]

9. In instance 2, try to update the last TodoItem's text and press **Enter** this causes a conflict because it has been updated setting the complete field to true. In response to the conflict, the script resolved it by refusing the update because the item was already completed. The script provided a message in the response.  

	App Instance 1	
	![][17]

	App Instance 2	
	![][18]

## <a name="next-steps"> </a>Next steps

This tutorial demonstrated how to enable a Windows Store app to handle write conflicts when working with data in Mobile Services. Next, consider completing one of the following tutorials in our data series:

* [Validate and modify data with scripts]
  <br/>Learn more about using server scripts in Mobile Services to validate and change data sent from your app.

* [Refine queries with paging]
  <br/>Learn how to use paging in queries to control the amount of data handled in a single request.

Once you have completed the data series, you can also try one of the following Windows Store tutorials:

* [Get started with authentication] 
  <br/>Learn how to authenticate users of your app.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app with Mobile Services.
 
<!-- Anchors. -->
[Update the application to allow updates]: #uiupdate
[Enable Conflict Detection in your application]: #enableOC
[Test database write conflicts in the application]: #test-app
[Automatically handling conflict resolution in server scripts]: #scriptsexample
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-create-app-package1.png
[1]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-create-app-package2.png
[2]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app1.png 
[3]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app1-write1.png
[4]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app1-write2.png
[5]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app2-write2.png
[6]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app2-write2-conflict.png
[7]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/mobile-services-selection.png
[8]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/mobile-portal-data-tables.png
[9]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/mobile-insert-script-users.png
[10]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-create-app-package3.png
[11]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-create-app-package4.png
[12]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-install-app-package.png
[13]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app1-write3.png
[14]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-app2-write3.png
[15]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-write3.png
[16]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-checkbox.png
[17]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-2-items.png
[18]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/Mobile-oc-store-already-complete.png
[19]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/mobile-manage-nuget-packages-VS.png
[20]: ./media/mobile-services-windows-store-javascript-handle-database-conflicts/mobile-manage-nuget-packages-dialog.png

<!-- URLs. -->
[Optimistic Concurrency Control]: http://go.microsoft.com/fwlink/?LinkId=330935
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Azure Account]: http://www.windowsazure.com/en-us/pricing/free-trial/
[Validate and modify data with scripts]: /en-us/documentation/articles/mobile-services-windows-store-javascript-validate-modify-data-server-scripts/
[Refine queries with paging]: /en-us/documentation/articles/mobile-services-windows-store-javascript-add-paging-data/
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started
[Get started with authentication]: /en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-users/
[Get started with push notifications]: /en-us/documentation/articles/mobile-services-windows-store-javascript-get-started-push/

[Azure Management Portal]: https://manage.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Phone 8 SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268374
[Mobile Services SDK]: http://go.microsoft.com/fwlink/p/?LinkID=268375
[Developer Code Samples site]:  http://go.microsoft.com/fwlink/p/?LinkId=271146
[System Properties]: http://go.microsoft.com/fwlink/?LinkId=331143
