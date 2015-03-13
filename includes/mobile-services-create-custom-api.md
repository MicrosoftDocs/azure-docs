

1. Log into the Azure Management Portal, click **Mobile Services**, and then select your mobile service.

2. Click the **API** tab, and then click **Create**. This displays the **Create a new custom API** dialog.

3. Type _completeall_ in **API name**, and then click the check button to create the new API.

	> [AZURE.NOTE] With default permissions, anyone with the app key may call the custom API. However, the application key is not considered a secure credential because it may not be distributed or stored securely. Consider restricting access to only authenticated users for additional security.

4. Click on **completeall** in the API table.

5. Click the **Script** tab, replace the existing code with the following code, then click **Save**. 	This code uses the [mssql object] to access the **todoitem** table directly to set the `complete` flag on all items. Because the **exports.post** function is used, clients send a POST request to perform the operation. The number of changed rows is returned to the client as an integer value.


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



> [AZURE.NOTE]
> The <a href="http://msdn.microsoft.com/library/windowsazure/jj554218.aspx" target="_blank">request</a> and <a href="http://msdn.microsoft.com/library/windowsazure/dn303373.aspx" target="_blank">response</a> object supplied to custom API functions are implemented by the <a href="http://go.microsoft.com/fwlink/p/?LinkId=309046" target="_blank">Express.js library</a>. For more information, see <a href="http://msdn.microsoft.com/library/windowsazure/dn280974.aspx" target="_blank">Custom API</a>.

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[mssql object]: http://msdn.microsoft.com/library/windowsazure/jj554212.aspx
