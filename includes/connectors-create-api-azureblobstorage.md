### Prerequisites

- A [Azure Blob Storage](https://azure.microsoft.com/documentation/services/storage/) account  


Before you can use your Azure Blob Storage account in a Logic app, you must authorize the Logic app to connect to your Azure Blob Storage account.Fortunately, you can do this easily from within your Logic app on the Azure Portal.  

Here are the steps to authorize your Logic app to connect to your Azure Blob Storage account:  
1. To create a connection to Azure Blob Storage, in the Logic app designer, select **Show Microsoft managed APIs** in the drop down list then enter *Azure Blob Storage* in the search box. Select the trigger or action you'll like to use:  
![Azure Blob Storage connection creation step](./media/connectors-create-api-azureblobstorage/azureblobstorage-1.png)  
2. If you haven't created any connections to Azure Blob Storage before, you'll get prompted to provide your Azure Blob Storage credentials. These credentials will be used to authorize your Logic app to connect to, and access your Azure Blob Storage account's data:  
![Azure Blob Storage connection creation step](./media/connectors-create-api-azureblobstorage/azureblobstorage-2.png)  
3. Notice the connection has been created and you are now free to proceed with the other steps in your Logic app:  
 ![Azure Blob Storage connection creation step](./media/connectors-create-api-azureblobstorage/azureblobstorage-3.png)  
