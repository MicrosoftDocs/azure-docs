---
title: Connect a Go application to Azure Cosmos DB's API for MongoDB
description: This quickstart demonstrates how to connect an existing Go application to Azure Cosmos DB's API for MongoDB.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.devlang: golang
ms.topic: quickstart
ms.date: 04/26/2022
ms.custom: mode-api, devx-track-azurecli, devx-track-go
---
# Quickstart: Connect a Go application to Azure Cosmos DB's API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Python](quickstart-python.md)
> * [Java](quickstart-java.md)
> * [Node.js](quickstart-nodejs.md)
> * [Go](quickstart-go.md)
>  

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. In this quickstart, you create and manage an Azure Cosmos DB account by using the Azure Cloud Shell, clone an existing sample application from GitHub and configure it to work with Azure Cosmos DB. 

The sample application is a command-line based `todo` management tool written in Go. Azure Cosmos DB's API for MongoDB is [compatible with the MongoDB wire protocol](./introduction.md), making it possible for any MongoDB client driver to connect to it. This application uses the [Go driver for MongoDB](https://github.com/mongodb/mongo-go-driver) in a way that is transparent to the application that the data is stored in an Azure Cosmos DB database.

## Prerequisites
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with the connection string `.mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true`.
- [Go](https://go.dev/) installed on your computer, and a working knowledge of Go.
- [Git](https://git-scm.com/downloads).
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Clone the sample application

Run the following commands to clone the sample repository.

1. Open a command prompt, create a new folder named `git-samples`, then close the command prompt.

    ```bash
    mkdir "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/cosmosdb-go-mongodb-quickstart
    ```

## Review the code

This step is optional. If you're interested in learning how the application works, you can review the following snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application). The application layout is as follows:

```bash
.
├── go.mod
├── go.sum
└── todo.go
```

The following snippets are all taken from the `todo.go` file.

### Connecting the Go app to Azure Cosmos DB

[`clientOptions`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo/options?tab=doc#ClientOptions) encapsulates the connection string for Azure Cosmos DB, which is passed in using an environment variable (details in the upcoming section). The connection is initialized using [`mongo.NewClient`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#NewClient) to which the `clientOptions` instance is passed. [`Ping` function](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Client.Ping) is invoked to confirm successful connectivity (it is a fail-fast strategy)

```go
    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    defer cancel()

    clientOptions := options.Client().ApplyURI(mongoDBConnectionString).SetDirect(true)
    
    c, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatalf("unable to initialize connection %v", err)
    }

    err = c.Ping(ctx, nil)
    if err != nil {
        log.Fatalf("unable to connect %v", err)
    }
```

> [!NOTE] 
> Using the [`SetDirect(true)`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo/options?tab=doc#ClientOptions.SetDirect) configuration is important, without which you will get the following connectivity error: `unable to connect connection(cdb-ms-prod-<azure-region>-cm1.documents.azure.com:10255[-4]) connection is closed`
>

### Create a `todo` item

To create a `todo`, we get a handle to a [`mongo.Collection`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Collection) and invoke the [`InsertOne`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Collection.InsertOne) function. 

```go
func create(desc string) {
    c := connect()
    ctx := context.Background()
    defer c.Disconnect(ctx)

    todoCollection := c.Database(database).Collection(collection)
    r, err := todoCollection.InsertOne(ctx, Todo{Description: desc, Status: statusPending})
    if err != nil {
        log.Fatalf("failed to add todo %v", err)
    }
```

We pass in a `Todo` struct that contains the description and the status (which is initially set to `pending`)

```go
type Todo struct {
    ID          primitive.ObjectID `bson:"_id,omitempty"`
    Description string             `bson:"description"`
    Status      string             `bson:"status"`
}
```
### List `todo` items

We can list TODOs based on criteria. A [`bson.D`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/bson?tab=doc#D) is created to encapsulate the filter criteria

```go
func list(status string) {
    .....
    var filter interface{}
    switch status {
    case listAllCriteria:
        filter = bson.D{}
    case statusCompleted:
        filter = bson.D{{statusAttribute, statusCompleted}}
    case statusPending:
        filter = bson.D{{statusAttribute, statusPending}}
    default:
        log.Fatal("invalid criteria for listing todo(s)")
    }
```

[`Find`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Collection.Find) is used to search for documents based on the filter and the result is converted into a slice of `Todo`

```go
    todoCollection := c.Database(database).Collection(collection)
    rs, err := todoCollection.Find(ctx, filter)
    if err != nil {
        log.Fatalf("failed to list todo(s) %v", err)
    }
    var todos []Todo
    err = rs.All(ctx, &todos)
    if err != nil {
        log.Fatalf("failed to list todo(s) %v", err)
    }
```

Finally, the information is rendered in tabular format

```go
    todoTable := [][]string{}

    for _, todo := range todos {
        s, _ := todo.ID.MarshalJSON()
        todoTable = append(todoTable, []string{string(s), todo.Description, todo.Status})
    }

    table := tablewriter.NewWriter(os.Stdout)
    table.SetHeader([]string{"ID", "Description", "Status"})

    for _, v := range todoTable {
        table.Append(v)
    }
    table.Render()
```

### Update a `todo` item

A `todo` can be updated based on its `_id`. A [`bson.D`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/bson?tab=doc#D) filter is created based on the `_id` and another one is created for the updated information, which is a new status (`completed` or `pending`) in this case. Finally, the [`UpdateOne`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Collection.UpdateOne) function is invoked with the filter and the updated document

```go
func update(todoid, newStatus string) {
....
    todoCollection := c.Database(database).Collection(collection)
    oid, err := primitive.ObjectIDFromHex(todoid)
    if err != nil {
        log.Fatalf("failed to update todo %v", err)
    }
    filter := bson.D{{"_id", oid}}
    update := bson.D{{"$set", bson.D{{statusAttribute, newStatus}}}}
    _, err = todoCollection.UpdateOne(ctx, filter, update)
    if err != nil {
        log.Fatalf("failed to update todo %v", err)
    }
```

### Delete a `todo`

A `todo` is deleted based on its `_id` and it is encapsulated in the form of a [`bson.D`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/bson?tab=doc#D) instance. [`DeleteOne`](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.3.2/mongo?tab=doc#Collection.DeleteOne) is invoked to delete the document.

```go
func delete(todoid string) {
....
    todoCollection := c.Database(database).Collection(collection)
    oid, err := primitive.ObjectIDFromHex(todoid)
    if err != nil {
        log.Fatalf("invalid todo ID %v", err)
    }
    filter := bson.D{{"_id", oid}}
    _, err = todoCollection.DeleteOne(ctx, filter)
    if err != nil {
        log.Fatalf("failed to delete todo %v", err)
    }
}
```

## Build the application

Change into the directory where you cloned the application and build it (using `go build`).

```bash
cd monogdb-go-quickstart
go build -o todo
```

To confirm that the application was built properly.

```bash
./todo --help
```

## Setup Azure Cosmos DB

### Sign in to Azure

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]. 

If you are using an installed Azure CLI, sign in to your Azure subscription with the [az login](/cli/azure/reference-index#az-login) command and follow the on-screen directions. You can skip this step if you're using the Azure Cloud Shell.

```azurecli
az login 
``` 
   
### Add the Azure Cosmos DB module

If you are using an installed Azure CLI, check to see if the `cosmosdb` component is already installed by running the `az` command. If `cosmosdb` is in the list of base commands, proceed to the next command. You can skip this step if you're using the Azure Cloud Shell.

If `cosmosdb` is not in the list of base commands, reinstall [Azure CLI](/cli/azure/install-azure-cli).

### Create a resource group

Create a [resource group](../../azure-resource-manager/management/overview.md) with the [az group create](/cli/azure/group#az-group-create). An Azure resource group is a logical container into which Azure resources like web apps, databases and storage accounts are deployed and managed. 

The following example creates a resource group in the West Europe region. Choose a unique name for the resource group.

If you are using Azure Cloud Shell, select **Try It**, follow the onscreen prompts to login, then copy the command into the command prompt.

```azurecli-interactive
az group create --name myResourceGroup --location "West Europe"
```

### Create an Azure Cosmos DB account

Create an Azure Cosmos DB account with the [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command.

In the following command, please substitute your own unique Azure Cosmos DB account name where you see the `<cosmosdb-name>` placeholder. This unique name will be used as part of your Azure Cosmos DB endpoint (`https://<cosmosdb-name>.documents.azure.com/`), so the name needs to be unique across all Azure Cosmos DB accounts in Azure. 

```azurecli-interactive
az cosmosdb create --name <cosmosdb-name> --resource-group myResourceGroup --kind MongoDB
```

The `--kind MongoDB` parameter enables MongoDB client connections.

When the Azure Cosmos DB account is created, the Azure CLI shows information similar to the following example. 

> [!NOTE]
> This example uses JSON as the Azure CLI output format, which is the default. To use another output format, see [Output formats for Azure CLI commands](/cli/azure/format-output-azure-cli). 

```json
{
  "databaseAccountOfferType": "Standard",
  "documentEndpoint": "https://<cosmosdb-name>.documents.azure.com:443/",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Document
DB/databaseAccounts/<cosmosdb-name>",
  "kind": "MongoDB",
  "location": "West Europe",
  "name": "<cosmosdb-name>",
  "readLocations": [
    {
      "documentEndpoint": "https://<cosmosdb-name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<cosmosdb-name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ],
  "resourceGroup": "myResourceGroup",
  "type": "Microsoft.DocumentDB/databaseAccounts",
  "writeLocations": [
    {
      "documentEndpoint": "https://<cosmosdb-name>-westeurope.documents.azure.com:443/",
      "failoverPriority": 0,
      "id": "<cosmosdb-name>-westeurope",
      "locationName": "West Europe",
      "provisioningState": "Succeeded"
    }
  ]
} 
```

### Retrieve the database key

In order to connect to an Azure Cosmos DB database, you need the database key. Use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command to retrieve the primary key.

```azurecli-interactive
az cosmosdb keys list --name <cosmosdb-name> --resource-group myResourceGroup --query "primaryMasterKey"
```

The Azure CLI outputs information similar to the following example. 

```json
"RUayjYjixJDWG5xTqIiXjC..."
```

## Configure the application 

<a name="devconfig"></a>
### Export the connection string, MongoDB database and collection names as environment variables. 

```bash
export MONGODB_CONNECTION_STRING="mongodb://<COSMOSDB_ACCOUNT_NAME>:<COSMOSDB_PASSWORD>@<COSMOSDB_ACCOUNT_NAME>.documents.azure.com:10255/?ssl=true&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@<COSMOSDB_ACCOUNT_NAME>@"
```

> [!NOTE] 
> The `ssl=true` option is important because of Azure Cosmos DB requirements. For more information, see [Connection string requirements](connect-account.md#connection-string-requirements).
>

For the `MONGODB_CONNECTION_STRING` environment variable, replace the placeholders for `<COSMOSDB_ACCOUNT_NAME>` and `<COSMOSDB_PASSWORD>`

1. `<COSMOSDB_ACCOUNT_NAME>`: The name of the Azure Cosmos DB account you created
2. `<COSMOSDB_PASSWORD>`: The database key extracted in the previous step

```bash
export MONGODB_DATABASE=todo-db
export MONGODB_COLLECTION=todos
```

You can choose your preferred values for `MONGODB_DATABASE` and `MONGODB_COLLECTION` or leave them as is.

## Run the application

To create a `todo`

```bash
./todo --create "Create an Azure Cosmos DB database account"
```

If successful, you should see an output with the MongoDB `_id` of the newly created document:

```bash
added todo ObjectID("5e9fd6befd2f076d1f03bd8a")
```

Create another `todo`

```bash
./todo --create "Get the MongoDB connection string using the Azure CLI"
```

List all the `todo`s

```bash
./todo --list all
```

You should see the ones you just added in a tabular format as such

```bash
+----------------------------+--------------------------------+-----------+
|             ID             |          DESCRIPTION           |  STATUS   |
+----------------------------+--------------------------------+-----------+
| "5e9fd6b1bcd2fa6bd267d4c4" | Create an Azure Cosmos DB      | pending   |
|                            | database account               |           |
| "5e9fd6befd2f076d1f03bd8a" | Get the MongoDB connection     | pending   |
|                            | string using the Azure CLI     |           |
+----------------------------+--------------------------------+-----------+
```

To update the status of a `todo` (e.g. change it to `completed` status), use the `todo` ID

```bash
./todo --update 5e9fd6b1bcd2fa6bd267d4c4,completed
```

List only the completed `todo`s

```bash
./todo --list completed
```

You should see the one you just updated

```bash
+----------------------------+--------------------------------+-----------+
|             ID             |          DESCRIPTION           |  STATUS   |
+----------------------------+--------------------------------+-----------+
| "5e9fd6b1bcd2fa6bd267d4c4" | Create an Azure Cosmos DB      | completed |
|                            | database account               |           |
+----------------------------+--------------------------------+-----------+
```

### View data in Data Explorer

Data stored in Azure Cosmos DB is available to view and query in the Azure portal.

To view, query, and work with the user data created in the previous step, login to the [Azure portal](https://portal.azure.com) in your web browser.

In the top Search box, enter **Azure Cosmos DB**. When your Azure Cosmos DB account blade opens, select your Azure Cosmos DB account. In the left navigation, select **Data Explorer**. Expand your collection in the Collections pane, and then you can view the documents in the collection, query the data, and even create and run stored procedures, triggers, and UDFs. 

:::image type="content" source="./media/quickstart-go/go-cosmos-db-data-explorer.png" alt-text="Data Explorer showing the newly created document":::


Delete a `todo` using it's ID

```bash
./todo --delete 5e9fd6b1bcd2fa6bd267d4c4,completed
```

List the `todo`s to confirm

```bash
./todo --list all
```

The `todo` you just deleted should not be present

```bash
+----------------------------+--------------------------------+-----------+
|             ID             |          DESCRIPTION           |  STATUS   |
+----------------------------+--------------------------------+-----------+
| "5e9fd6befd2f076d1f03bd8a" | Get the MongoDB connection     | pending   |
|                            | string using the Azure CLI     |           |
+----------------------------+--------------------------------+-----------+
```

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB for MongoDB account using the Azure Cloud Shell, and create and run a Go command-line app to manage `todo`s. You can now import additional data to your Azure Cosmos DB account.

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
