1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the Jumpbar, click **New**, click **Databases**, and then click **NoSQL (DocumentDB)**.
   
   ![Screen shot of the Azure portal, highlighting More Services, and DocumentDB (NoSQL)](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-1.png)  
3. In the **New account** blade, specify the desired configuration for the DocumentDB account.
   
    ![Screen shot of the New DocumentDB blade](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-2.png)
   
   * In the **ID** box, enter a name to identify the DocumentDB account.  When the **ID** is validated, a green check mark appears in the **ID** box. The **ID** value becomes the host name within the URI. The **ID** may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. Note that *documents.azure.com* is appended to the endpoint name you choose, the result of which becomes your DocumentDB account endpoint.
   * In the **NoSQL API** box, select **DocumentDB**.  
   * For **Subscription**, select the Azure subscription that you want to use for the DocumentDB account. If your account has only one subscription, that account is selected by default.
   * In **Resource Group**, select or create a resource group for your DocumentDB account.  By default, a new resource group is created. For more information, see [Using the Azure portal to manage your Azure resources](../articles/azure-portal/resource-group-portal.md).
   * Use **Location** to specify the geographic location in which to host your DocumentDB account. 
4. Once the new DocumentDB account options are configured, click **Create**. To check the status of the deployment, check the Notifications hub.  
   
   ![Create databases quickly - Screen shot of the Notifications hub, showing that the DocumentDB account is being created](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-4.png)  
   
   ![Screen shot of the Notifications hub, showing that the DocumentDB account was created successfully and deployed to a resource group - Online database creator notification](./media/documentdb-create-dbaccount/create-nosql-db-databases-json-tutorial-5.png)
5. After the DocumentDB account is created, it is ready for use with the default settings. To review the default settings, click the **NoSQL (DocumentDB)** icon on the Jumpbar, click your new account, and then click **Default Consistency** in the Resource Menu.

   ![Screen shot showing how to open your Azure DocumentDB database account in the Azure portal](./media/documentdb-create-dbaccount/azure-documentdb-database-open-account-portal.png)  

   The default consistency of the DocumentDB account is set to **Session**.  You can adjust the default consistency by clicking **Default Consistency** in the resource menu. To learn more about the consistency levels offered by DocumentDB, see [Consistency levels in DocumentDB](../articles/documentdb/documentdb-consistency-levels.md).

[How to: Create a DocumentDB account]: #Howto
[Next steps]: #NextSteps
[documentdb-manage]:../articles/documentdb/documentdb-manage.md
