Now let's clone a Table app from github, set the connection string, and run it. You'll see how easy it is to work with data programmatically. 

1. Open a git terminal window, such as git bash, and `cd` to a working directory.  

2. Run the following command to clone the sample repository. 

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-table-dotnet-getting-started.git
    ```

3. Then open the solution file in Visual Studio. 

## Update your connection string

Now we'll update the connection string information so your app can talk to Azure Cosmos DB. 

1. In the [Azure portal](http://portal.azure.com/), in the Azure Cosmos DB left navigation menu, click **Connection String**, and then click **Read-write Keys**. You'll use the copy buttons on the right side of the screen to copy the connection string into the app.config file in the next step.

    ![View and copy the Endpoint and Account Key in the Connection String pane](./media/create-table-dotnet/keys.png)
BUGBUG: The picture is wrong

2. In Visual Studio, open the app.config file. 

3. Copy your URI value from the portal (using the copy button) and paste the value into the app.config file as the value of the CosmosDBStorageConnectionString. 

    `<add key="CosmosDBStorageConnectionString" 
        value="DefaultEndpointsProtocol=https;AccountName=MYSTORAGEACCOUNT;AccountKey=AUTHKEY;TableEndpoint=https://account-name.table.cosmosdb.azure.com" />`    

> [!NOTE]
> To use this app with Azure Table storage, you need to change the connection string in `app.config file`. Use the account name as Table-account name and key as Azure Storage Primary key. <br>
>`<add key="StandardStorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key;EndpointSuffix=core.windows.net" />`
> 
>

You've now updated your app with all the info it needs to communicate with Azure Cosmos DB. 

## Build and deploy the app

1. In Visual Studio, right-click on the **CosmosDBTableGetStarted** project in **Solution Explorer** and then click **Manage NuGet Packages**. 

2. In the NuGet **Browse** box, type *Microsoft.Azure.CosmosDB.Table*.
BUGBUG: CONFIRM THE ABOVE WORKS

3. From the results, install the **Microsoft.Azure.CosmosDB.Table** library. This installs the Azure Cosmos DB Table API package as well as all dependencies.
BUGBUG: CONFIRM THE NAME ABOVE IS RIGHT

4. Click CTRL + F5 to run the application.

    The console window displays the data being added, retrieved, queried, replaced and deleted from the table. When the script completes, press any key to close the console window. 
    
    ![Console output of the quickstart](./media/create-table-dotnet/azure-cosmosdb-table-quickstart-console-output.png)

5. If you want to see the new entities in Data Explorer, just comment the DeleteTable region in program.cs so they aren't deleted, then run the sample again. 

    You can now go back to Data Explorer, click **Refresh**, expand the **people** table and click **Entities**, and then work with this new data. 

    ![New entities in Data Explorer](./media/create-table-dotnet/azure-cosmosdb-table-quickstart-data-explorer.png)
