1.	Sign in to the [Microsoft Azure Preview portal](https://portal.azure.com/).
2.	In the Jumpbar, click **New**, then select **Data + storage**, and then click **DocumentDB**. 

	![Screen shot of the Azure Preview portal, highlighting the New button, Data + storage in the Create blade, and DocumentDB in the Data + storage blade][1]   

	<!-- Alternatively, from the Startboard, you can browse the Azure Marketplace, select **Data + storage**, choose **DocumentDB**, and then click **Create**.  -->
	
	<!-- ![Screen shot of the Azure Preview portal, showing the Marketplace blade with the DocumentDB tile highlighted, and the DocumentDB blade with the Create button highlighted][2]    -->
   

3. In the **New DocumentDB** blade, specify the desired configuration for the DocumentDB account. 
 
	![Screen shot of the New DocumentDB blade][3] 


	- In the **Id** box, enter a name to identify the DocumentDB account. This value becomes the host name within the URI. The **Id** may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. 
	
		> [AZURE.NOTE] *documents.azure.com* is appended to the endpoint name you choose, the result of which will become your DocumentDB account endpoint.

	- The **Account Tier** lens is locked because DocumentDB supports a single standard account tier. For more information, see [DocumentDB pricing](http://go.microsoft.com/fwlink/p/?LinkID=402317&clcid=0x409).

	- In **Resource group**, select or create a resource group for your DocumentDB account.  By default, a new Resource group will be created.  You may, however, choose to select an existing resource group to which you would like to add your DocumentDB account. For more information, see [Using resource groups to manage your Azure resources](resource-group-portal.md).

	- For **Subscription**, select the Azure subscription that you want to use for the DocumentDB account. If your account has only one subscription, that account will be selected automatically.
 
	- Use **Location** to specify the geographic location in which your DocumentDB account will be hosted.   

4.	Once the new DocumentDB account options are configured, click **Create**.  It can take a few minutes for the DocumentDB account to be created.  To check the status, you can monitor the progress on the Startboard.  
	![Screen shot of the Creating tile on the Startboard][4]  
  
	Or, you can monitor your progress from the Notifications hub.  

	![Screen shot of the Notifications hub, showing that the DocumentDB account is being created][5]  

	![Screen shot of the Notifications hub, showing that the DocumentDB account was created successfully and deployed to a resource group][6]

5.	After the DocumentDB account has been created, it is ready for use with the default settings.

	> [AZURE.NOTE] The default consistency of the DocumentDB account will be set to Session.  You can adjust the default consistency setting via the [Azure Preview portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB).  
 
    ![Screen shot of the Resource Group blade][7]  


<!--Image references-->
[1]: media/documentdb-create-dbaccount/ca1.png
[2]: media/documentdb-create-dbaccount/ca2.png
[3]: media/documentdb-create-dbaccount/ca3.png
[4]: media/documentdb-create-dbaccount/ca4.png
[5]: media/documentdb-create-dbaccount/ca5.png
[6]: media/documentdb-create-dbaccount/ca6.png
[7]: media/documentdb-create-dbaccount/ca7.png

[How to: Create a DocumentDB account]: #Howto
[Next steps]: #NextSteps
[documentdb-manage]:documentdb-manage.md
