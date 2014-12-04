<properties pageTitle="Calling SQL stored procedures with a JavaScript back end" metaKeywords="stored procedures, SQL, mobile devices, Azure" description="explains how to use SQL stored procedures in a mobile services JavaScript backed." metaCanonical="" services="mobile-services" documentationCenter="Mobile" title="Calling SQL stored procedures with a JavaScript back end" authors="ricksal" solutions="" manager="dwrede" editor="" />

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-multiple" ms.devlang="multiple" ms.topic="article" ms.date="11/21/2014" ms.author="ricksal" />


# Calling SQL stored procedures with a JavaScript back end 
 
Reasons why you might want to call SQL Server stored procedures:

- your mobile service uses existing stored procedures which you must access 
- your application architecture dictates the use of stored procedures for database access
- personal preference



This topic tells you how to:



+ [Call a simple stored procedure]
+ [Call a stored procedure with parameters]
+ [Find out more]



This article discusses stored procedures in a mobile service with a JavaScript back end. 

But you can instead create mobile services with a .Net back end, which has a completely different architecture based on the Entity Framework. To learn more, see [How the Azure Mobile Services .Net Backend works].




##Call a simple stored procedure 




**"My database uses stored procedures: how do I call them from a mobile service?"**




You do this with the [mssql object], which lets you execute *Transact-SQL* ("T-SQL") statements that call the procedure. 





###Writing and testing the Transact SQL code




Assume the stored stored procedure is named *GetAll*, and your mobile service is named **todolist**.



1. Select the **Databases** icon in the Azure portal side bar, and then select your database, whose name is your mobile service name, suffixed with "**_db**".



2. On the Database Quick Start page, press the **Manage** link at the bottom of the page.


3. Log in to the database.


4.  Press **New Query** in the top bar, and add the following code:
  
  			EXEC todolist.GetAll
  
  
5. Click **Run** and verify the results.




Note how the procedure name is prefixed with the name of the database schema, which by default is the name of your mobile service.




  
###Where do I put the call to the mssql  object?




If you need to call the stored procedure directly, the most flexible way is to write and call a [custom API]. 




1. From your mobile service Dashboard, click **API**, then click **CREATE**, name your script ***getall***, and add this code to call the stored procedure:






		exports.get = function(request, response) {
		    var mssql = request.service.mssql;
		    var sql = "EXEC todolist.GetAll";
		    mssql.query(sql, {
		        success: function(results) {                          
		                response.send(200, results); 
		        }, error: function(err) {
				        response.send(400, { error: err });        
		        }
		    })
		};





2. Test it in a browser by putting this url into the address line:




		https://todolist.azure-mobile.net/api/getall





You can instead put similar code inside a standard *read*, *insert*, *update*, or *delete*  server script of a table, and your code will bypass the default behavior, and call the stored procedure. Similar code can go inside a *Scheduler* script. However, creating a custom API is the most flexible.




###Calling the code from the client




Modify the client code to call the **invokeApi** method on the **MobileServiceClient** object. The exact code syntax is specific to your client device, and is explained in the following topics:



- [Windows Store C#]
- [Windows Store JavaScript]
- [Windows Phone]
- [iOS]
- [Android]
- [HTML]











##<a name="parameters"></a>Call a stored procedure with parameters








Let's assume the stored stored procedure is named *ItemsByStatus*, that it has a single parameter named *Status*, and that we want to call it from a custom API.







1. Follow the steps in the preceding section to write and test the T-SQL code  using the Azure database portal, but use this T-SQL code instead:





		EXEc todolist.ItemsByStatus @Status = 1






2. Click the **Run** symbol and verify the results. 







3. As in the preceding step, create a new custom API named **completeall** with the following code that calls the stored procedure. Note that in the code below, you replace the actual value of the **@Status** parameter that you used in testing with **"?"**, which will get filled at run-time with the supplied parameter.




		exports.get = function(request, response) {	
		    var mssql = request.service.mssql;
		    var param1 = parseInt(request.query.status);
		    var sql = "EXEC todolist.ItemsByStatus @Status = ?";
		    mssql.query(sql, [param1], {
		        success: function(results) { 
		                 response.send(200, results[0]); 
		            }, error: function(err) {
				        response.send(400, { error: err });        
		        }
		    })
		};





4. Test the API with this URL in a browser:




		https://todolist.azure-mobile.net/api/completeall?status=1





5. Call the API from the client as described in the preceding section.

###More complex parameter signatures

The stored procedure in the preceding section had only a single parameter. Here is the syntax to use for a longer signature:

		function read(query, user, request) {
		    var sql = 'EXEC MySProc @Param1 = ?, @Param2 = ?, @Param3 = ?';
		    var param1 = request.parameters.first;
		    var param2 = request.parameters.second;
		    var param3 = request.parameters.third;
		    mssql.query(sql, [param1, param2, param3], {
		        success: function(results) {
		            request.respond(200, results);
		        }
		    });
		}

Note that in the **EXEC** statement the parameters are called by name rather than by position. This is the recommended syntax, and insulates your code from minor changes in the stored procedure, such as changing the parameter order, or adding optional parameters.

##<a name="more"></a>Find out more

This topic just scratches the surface. 

For detailed references on the code used, see these topics:

- [mssql object]: reference information about the central object used to call stored procedures in mobile services

- [Work with a JavaScript backend mobile service]: more general information about the Javascript backend, including material about the mssql object

Here other scenarios you may encounter:

- [How do I do more than 1 read operation by scripting] describes how to conditionally read a table, or alternatively call a stored procedure. This blogger, Carlos Figueira, freqently posts about Azure Mobile Services and databases.

- [Accessing a Stored Procedure from a different Schema] describes solutions for problems you may encounter when accessing stored procedures that reside in different schemas of the same mobile services database


You can also use the Azure portal to manage and create new stored procedures.

<!-- Anchors. -->
[Introduction]: #intro
[Calling stored procedure basics]: #calling
[Sample code]: #sample
[Call a simple stored procedure]: #simple
[Call a stored procedure with parameters]: #parameters
[Cross-Schema Issues]: #schema
[Find out more]: #more

[1]: ./media/mobile-services-how-to-use-server-scripts/1-mobile-insert-script-users.png
[2]: ./media/mobile-services-how-to-use-server-scripts/2-mobile-custom-api-script.png
[3]: ./media/mobile-services-how-to-use-server-scripts/3-mobile-schedule-job-script.png
[4]: ./media/mobile-services-how-to-use-server-scripts/4-mobile-source-local-cli.png

<!-- URLs. -->
[Accessing a Stored Procedure from a different Schema]: http://blogs.msdn.com/b/jpsanders/archive/2013/05/02/windows-azure-mobile-services-accessing-a-stored-procedure-from-a-different-schema.aspx
[How the Azure Mobile Services .Net Backend works]: http://curah.microsoft.com/64518/how-the-azure-mobile-services-net-backend-works
[custom API]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-android-call-custom-api/
[How do i do more than 1 read operation by scripting]: http://social.msdn.microsoft.com/Forums/windowsazure/en-US/fccf4ae7-f43c-4c2d-8518-32e2df84a824/how-do-i-do-more-than-1-read-operation-by-scripting?forum=azuremobile
[Mobile Services server script reference]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554226.aspx
[Schedule backend jobs in Mobile Services]: /en-us/develop/mobile/tutorials/schedule-backend-tasks/
[Windows Store C#]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-windows-store-dotnet-call-custom-api/
[Windows Store JavaScript]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-windows-store-javascript-call-custom-api/
[Windows Phone]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-windows-phone-call-custom-api/
[iOS]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-ios-call-custom-api/ 
[Android]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-android-call-custom-api/
[HTML]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-html-call-custom-api/

[request object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554218.aspx
[response object]: http://msdn.microsoft.com/en-us/library/windowsazure/dn303373.aspx
[User object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554220.aspx
[push object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx
[insert function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554229.aspx
[insert]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554229.aspx
[update function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554214.aspx
[delete function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554215.aspx
[read function]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554224.aspx
[update]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554214.aspx
[delete]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554215.aspx
[read]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554224.aspx
[query object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj613353.aspx
[table object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554210.aspx
[tables object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj614364.aspx
[mssql object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554212.aspx
[console object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554209.aspx
[Read and write data]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631640.aspx
[Validate data]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631638.aspx
[Modify the request]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631635.aspx
[Modify the response]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631631.aspx
[Management Portal]: https://manage.windowsazure.com/
[Schedule jobs]: http://msdn.microsoft.com/en-us/library/windowsazure/jj860528.aspx
[Validate and modify data in Mobile Services by using server scripts]: /en-us/develop/mobile/tutorials/validate-modify-and-augment-data-dotnet/
[Commands to manage Azure Mobile Services]: /en-us/manage/linux/other-resources/command-line-tools/#Commands_to_manage_mobile_services/#Mobile_Scripts
[Azure SDK for Node.js]: http://go.microsoft.com/fwlink/p/?LinkId=275539
[Send HTTP request]: http://msdn.microsoft.com/en-us/library/windowsazure/jj631641.aspx
[Send email from Mobile Services with SendGrid]: /en-us/develop/mobile/tutorials/send-email-with-sendgrid/
[Get started with authentication]: http://go.microsoft.com/fwlink/p/?LinkId=287177
[crypto API]: http://go.microsoft.com/fwlink/p/?LinkId=288802
[path API]: http://go.microsoft.com/fwlink/p/?LinkId=288803
[querystring API]: http://go.microsoft.com/fwlink/p/?LinkId=288804
[url API]: http://go.microsoft.com/fwlink/p/?LinkId=288805
[util API]: http://go.microsoft.com/fwlink/p/?LinkId=288806
[zlib API]: http://go.microsoft.com/fwlink/p/?LinkId=288807
[Custom API]: http://msdn.microsoft.com/en-us/library/windowsazure/dn280974.aspx
[Call a custom API from the client]: /en-us/develop/mobile/tutorials/call-custom-api-dotnet/#define-custom-api
[express.js library]: http://go.microsoft.com/fwlink/p/?LinkId=309046
[Define a custom API that supports periodic notifications]: /en-us/develop/mobile/tutorials/create-pull-notifications-dotnet/
[express object in express.js]: http://expressjs.com/api.html#express
[Store server scripts in source control]: /en-us/develop/mobile/tutorials/store-scripts-in-source-control/
[Leverage shared code and Node.js modules in your server scripts]: /en-us/develop/mobile/tutorials/store-scripts-in-source-control/#use-npm
[service object]: http://msdn.microsoft.com/en-us/library/windowsazure/dn303371.aspx
[App settings]: http://msdn.microsoft.com/en-us/library/dn529070.aspx
[config module]: http://msdn.microsoft.com/en-us/library/dn508125.aspx
[Support for package.json in Azure Mobile Services]: http://go.microsoft.com/fwlink/p/?LinkId=391036
[Work with a JavaScript backend mobile service]: http://azure.microsoft.com/en-us/documentation/articles/mobile-services-how-to-use-server-scripts/