1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	In the Jumpbar, click **New**, click **Data + Storage**, and then click **DocumentDB (NoSQL)**.

	![Screen shot of the Azure portal, highlighting More Services, and DocumentDB (NoSQL)](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-1.png)  

3. In the **New account** blade, specify the desired configuration for the DocumentDB account.

	![Screen shot of the New DocumentDB blade](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-2.png)

	- In the **ID** box, enter a name to identify the DocumentDB account.  When the **ID** is validated, a green check mark appears in the **ID** box. The **ID** value becomes the host name within the URI. The **ID** may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. Note that *documents.azure.com* is appended to the endpoint name you choose, the result of which becomes your DocumentDB account endpoint.

    - In the **NoSQL API** box, select **DocumentDB**.  

	- For **Subscription**, select the Azure subscription that you want to use for the DocumentDB account. If your account has only one subscription, that account is selected by default.

	- In **Resource Group**, select or create a resource group for your DocumentDB account.  By default, a new resource group is created. For more information, see [Using the Azure portal to manage your Azure resources](../articles/azure-portal/resource-group-portal.md).

	- Use **Location** to specify the geographic location in which to host your DocumentDB account. 

4.	Once the new DocumentDB account options are configured, click **Create**. To check the status of the deployment, check the Notifications hub.  

	![Create databases quickly - Screen shot of the Notifications hub, showing that the DocumentDB account is being created](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-4.png)  

	![Screen shot of the Notifications hub, showing that the DocumentDB account was created successfully and deployed to a resource group - Online database creator notification](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-5.png)

5.	After the DocumentDB account is created, it is ready for use with the default settings. The default consistency of the DocumentDB account is set to **Session**.  You can adjust the default consistency by clicking **Default Consistency** in the resource menu. To learn more about the consistency levels offered by DocumentDB, see [Consistency levels in DocumentDB](../articles/documentdb/documentdb-consistency-levels.md).

    ![Screen shot of the Resource Group blade - begin application development](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-6.png)  

    ![Screen shot of the Consistency Level blade - Session Consistency](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-7.png)  

[How to: Create a DocumentDB account]: #Howto
[Next steps]: #NextSteps
[documentdb-manage]:../articles/documentdb/documentdb-manage.md
