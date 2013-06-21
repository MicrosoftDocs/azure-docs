

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, and then click **Create a custom API**.

   ![][1]

   This displays the **Create a new custom API** dialog.

3. Type _completeall_ in **API name**, and then click the check button.

   ![][2]

  This creates the new API.

   	<div class="dev-callout"><b>Note</b>
   		<p>Default permissions are set, which means that any user of the app can call the custom API. However, the application key is not distributed or stored securely and cannot be considered a secure credential. Because of this, you should consider restricting access to only authenticated users on operations that modify data or affect the mobile service.</p>
   	</div>

4. Click the new **completeall** entry in the API table.

	![][3]

5. Click the **Script** tab and replace the existing code with the following:

		exports.post = function(request, response) {
			var mssql = request.service.mssql;
			var sql = "UPDATE todoitem SET complete = 1 " + 
                "WHERE complete = 0; SELECT @@ROWCOUNT as count";
			mssql.query(sql, {
				success: function(results) {			
					if(results.length == 1)							
						response.send(200, results[0]);			
				}
			})
		};


	This code uses the [mssql object] to access the **todoitem** table directly to set the completed flag on all items. Because the **exports.post** function is used, clients send a POST request to perform the operation. The number of changed rows is returned to the client as an integer value.

   	<div class="dev-callout"><b>Note</b>
   		<p>The <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj554218.aspx" target="_blank">request</a> and <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn303373.aspx" target="_blank">response</a> object supplied to custom API functions are implemented by the <a href="http://go.microsoft.com/fwlink/p/?LinkId=309046" target="_blank">Express.js library</a>. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn280974.aspx" target="_blank">Custom API</a>. </p>
   	</div>

Next, you will modify the quickstart app to add a new button and code that asynchronously calls the new custom API.

<!-- Anchors. -->

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create-dialog2.png
[3]: ../Media/mobile-custom-api-select2.png

<!-- URLs. -->
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[mssql object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554212.aspx
