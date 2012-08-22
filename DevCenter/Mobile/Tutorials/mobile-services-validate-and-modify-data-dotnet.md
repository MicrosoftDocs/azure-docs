<properties linkid="mobile-services-validate-and-modify-data-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Validate and modify data in Windows Azure Mobile Services" metakeywords="access and change data, Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Validate and modify data sent to the Windows Azure Mobile Services using server scripts." umbraconavihide="0" disquscomments="1"></properties>

# Validate and modify data in Mobile Services using server scripts
Language: **C# and XAML**  

This topic shows you how to leverage server scripts in Windows Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update your Windows Store app to take advantage of these new behaviors.

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. [Add a timestamp on insert]
4. [Update the client to display the timestamp]

This tutorial builds on the steps and the sample app from the previous tutorial [Get started with data]. Before you begin this tutorial, you must first complete [Get started with data].  

### <a name="string-length-validation"></a>Add string length validation

It is always a good practice to validate the length of data that is submitted by users. First, you register a script that validates the length of string data sent to the mobile service and rejects strings that are too long, in this case longer than 10 characters.

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app. 

   ![][0]

2. Click the **Data** tab, then click the **TodoItem** table.

   ![][1]

3. Click **Script**, then select the **Insert** operation.

   ![][2]

4. Replace the existing script with the following function, and then click **Save**.

        function insert(item, user, request) {
            if (item.Text.length > 10) {
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
            } else {
                request.execute();
            }
        }

    This script checks the length of the **TodoItem.Text** property and sends an error response when the length exceeds 10 characters. Otherwise, the **execute** method is called to complete the insert.

### <a name="update-client-validation"></a>Update the client to support validation

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

1. In Visual Studio 2012 Express for Windows 8, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the **F5** key to run the app, then type text longer than 10 characters in **Insert a TodoItem** and click **Save**.

   Notice that the app raises an unhandled **MobileServiceInvalidOperationException** as a result of the 400 response (Bad Request) returned by the mobile service.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>You can remove a registered script on the <b>Script</b> tab by clicking <b>Clear</b> and then <b>Save</b>.</p></div>	

6. 	Open the file MainPage.xaml.cs, then add the following **using** statement:

        using Windows.UI.Popups;

7. Replace the existing **InsertTodoItem** method with the following:

        private async void InsertTodoItem(TodoItem todoItem)
        {
            // This code inserts a new TodoItem into the database. When the operation completes
            // and Mobile Services has assigned an Id, the item is added to the CollectionView
            try
            {
                await todoTable.InsertAsync(todoItem);
                items.Add(todoItem);
            }
            catch (MobileServiceInvalidOperationException e)
            {
                MessageDialog errormsg = new MessageDialog(e.Response.Content, 
                    string.Format("{0} (HTTP {1})",                     
                    e.Response.StatusDescription,
                    e.Response.StatusCode));
                var ignoreAsyncOpResult = errormsg.ShowAsync();
            }
        }

   This version of the method includes error handling for the **MobileServiceInvalidOperationException** that displays the error response in a popup.

### <a name="add-timestamp"></a>Add a timestamp on insert

The previous tasks validated an insert and either accepted or rejected it. Now, you will update inserted data by using a server script that adds a timestamp property to the object before it gets inserted.

1. In the **Scripts** tab in the [Management Portal], replace the current **Insert** script with the following function, and then click **Save**.

        function insert(item, user, request) {
            if (item.Text.length > 10) {
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
            } else {
                item.createdAt = new Date();
                request.execute();
            }
        }

    This function augments the previous insert script by adding a new **createdAt** timestamp property to the object before it gets inserted by the call to **request**.**execute**. 

    <div class="dev-callout"><b>Note</b>
	<p>Dynamic schema must be enabled the first time that this insert script runs. With dynamic schema enabled, Mobile Services automatically adds the <b>createdAt</b> column to the <b>TodoItem</b> table on the first execution. Dynamic schema is enabled by default for a new mobile service, and it should be disabled before the app is published to the Windows Store.</p>
    </div>

2. In Visual Studio, press the **F5** key to run the app, then type text (shorter than 10 characters) in **Insert a TodoItem** and click **Save**.

   Notice that the new timestamp does not appear in the app UI.

3. Back in the Management Portal, click the **Browse** tab in the **todoitem** table.
   
   Notice that there is now a **createdAt** column, and the new inserted item has a timestamp value.
  
Next, you need to update the Windows Store app to display this new column.

### <a name="update-client-timestamp"></a>Update the client to display the timestamp

The Mobile Service client will ignore any data in a response that it cannot serialize into properties on the defined type. The final step is to update the client to display this new data.

1. In Visual Studio, open the file MainPage.xaml.cs, then replace the existing **TodoItem** class with the following definition:

	    public class TodoItem
	    {
	        public int Id { get; set; }
	        public string Text { get; set; }
	        public bool Complete { get; set; }
	        
            [DataMember(Name="createdAt")]
	        public DateTime? CreatedAt { get; set; }
	    }
	
    This new class definition includes the new timestamp property, as a nullable DateTime type.
  
    <div class="dev-callout"><b>Note</b>
	<p>The <b>DataMemberAttribute</b> tells the client to map the new <b>CreatedAt</b> property in the app to the <b>createdAt</b> column defined in the TodoItem table, which has a different casing. By using this attribute, your app can have property names on objects that differ from column names in the SQL Database. Without this attribute, an error would occur because of the casing differences.</p>
    </div>

5. Add the following XAML element just below the **CheckBoxComplete** element in the MainPage.xaml file:
	      
        <TextBlock Name="WhenCreated" Text="{Binding CreatedAt}" VerticalAlignment="Center"/>

   This displays the new **CreatedAt** property in a text box. 
	
6. Press the **F5** key to run the app. 

   Notice that the timestamp is only displayed for items inserted after you updated the insert script.

7. Replace the existing **RefreshTodoItems** method with the following code:

        private void RefreshTodoItems()
        {
            // This query filters out completed TodoItems and 
            // items without a timestamp. 
            items = todoTable
               .Where(todoItem => todoItem.Complete == false
                   && todoItem.CreatedAt != null)
               .ToCollectionView();

            ListItems.ItemsSource = items;
        }

   This method updates the query to also filter out items that do not have a timestamp value.
	
8. Press the **F5** key to run the app.

   Notice that all items created without timestamp value disappear from the UI.

You have completed this working with data tutorial.

### <a name="next-steps"> </a>Next Steps

Now that you have completed this tutorial, consider continuing on with the final tutorial in the data series: 

Server scripts are also used when authorizing users and for sending push notifications. For more information see the following tutorials:

* [Authorize users with scripts]
  <br/>Learn how to filter data based on the ID of an authenticated user.

* [Get started with push notifications] 
  <br/>Learn how to send a very basic push notification to your app.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Add string length validation]: #string-length-validation
[Update the client to support validation]: #update-client-validation
[Add a timestamp on insert]: #add-timestamp
[Update the client to display the timestamp]: #update-client-timestamp

[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-portal-data-tables.png
[2]: ../Media/mobile-insert-script-users.png
[3]: ../Media/mobile-quickstart-startup.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Authorize users with scripts]: ./mobile-services-authorize-users-dotnet/
[Refine queries with paging]: ./mobile-services-paging-data-dotnet/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal]: https://manage.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/