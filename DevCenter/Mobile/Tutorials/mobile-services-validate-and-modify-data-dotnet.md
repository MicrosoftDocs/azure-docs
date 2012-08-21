<properties linkid="mobile-services-validate-and-modify-data-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Validate and modify data in Windows Azure Mobile Services" metakeywords="access and change data, Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Validate and modify data sent to the Windows Azure Mobile Services using server scripts." umbraconavihide="0" disquscomments="1"></properties>

# Validate and modify data in Mobile Services using server scripts
Language: **C# and XAML**  

This topic shows you how to leverage server scripts in Windows Azure Mobile Services. Server scripts are registered in a mobile service and can be used to perform a wide range of operations on data being inserted and updated, including validation and data modification. In this tutorial, you will define and register server scripts that validate and modify data. Because the behavior of server side scripts often affects the client, you will also update the Windows Store app to take advantage of the new server behaviors.

This tutorial walks you through these basic steps:

1. [Add string length validation]
2. [Update the client to support validation]
3. 

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

    This script checks the length of the **TodoItem.Text** property and sends an error response when the length exceeds 10 characters. 

5. Repeat Steps 3 and 4 to replace the **Update** operation with a similar function, as follows:

        function update(item, user, request) {
            if (item.Text.length > 10) {
                request.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
            } else {
                request.execute();
            }
        }

### <a name="update-client-validation"></a>Update the client to support validation

Now that the mobile service is validating data and sending error responses, you need to update your app to be able to handle error responses from validation.

6. In Visual Studio 2012 Express for Windows 8, open the project that you modified when you completed the tutorial [Get started with data].

2. Press the F5 key to run the app
6. 	Run the app (unmodified from the Getting Started tutorial) and type in todo item text that exceeds 10 characters. The app will crash. That is because we have not yet added error handling code. 

We will add that in the next step.

	1. Modify client app to show error message based on service response. (see client app with error handling code)

	2. Augment todo item by adding date(time) of creation.  The insert script now looks as follows:
	function insert(item, user, context) {
	    if (item.Text.length > 10) {
	        context.respond(statusCodes.BAD_REQUEST, 'Text length must be under 10');
	    } else {
	        item.createdAt = new Date();
	        context.execute();
	    }
	}
	
	3. Run the app and add a few rows. The timestamp is not seen in the app UI because the client is unaware of the addition. But you can see the added column in the portal if you go to TABLES, select the TodoItem table and then click on BROWSE.
	4. Next we need to change our object model to read back the automatically added create timestamp. Note the DataMember element added to convert JS style camel casing used by script code to C# style Pascal casing. The column naming in Mobile Services is case preserving when created but case insensitive in case of queries. But the default serializer will not serialize createdAt into CreatedAt without explicit DataMember attribute.
	    public class TodoItem
	    {
	        public int Id { get; set; }
	        public string Text { get; set; }
	        public bool Complete { get; set; }
	        [DataMember(Name="createdAt")]
	        public DateTime? CreatedAt { get; set; }
	    }
	
	5. Next, we need to change the UI to show the newly added CreatedAt element. Add the following XAML element just below the "CheckBoxComplete" element in MainPage.xaml.
	<TextBlock Name="WhenCreated" Text="{Binding CreatedAt}" VerticalAlignment="Center"/>
	
	6. Run the app and browse data in portal to see added column and datetime info for new rows (only)
	7. Add a query to client to restrict results to those with timestamp. The modified query is as follows:
	MobileServiceTableQuery<TodoItem> query = todoTable
	                .Where(todoItem => todoItem.Complete == false && todoItem.CreatedAt != null);
	8. Run the app and notice that the rows without create timestamp disappear.



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