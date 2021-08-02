---
title: Connect a Rust application to Azure Cosmos DB's API for MongoDB
description: This quickstart demonstrates how to build a Rust application backed by Azure Cosmos DB's API for MongoDB.
author: abhirockzz
ms.author: abhishgu
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: rust
ms.topic: quickstart
ms.date: 01/12/2021

---
# Quickstart: Connect a Rust application to Azure Cosmos DB's API for MongoDB
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

> [!div class="op_single_selector"]
> * [.NET](create-mongodb-dotnet.md)
> * [Java](create-mongodb-java.md)
> * [Node.js](create-mongodb-nodejs.md)
> * [Xamarin](create-mongodb-xamarin.md)
> * [Golang](create-mongodb-go.md)
> * [Rust](create-mongodb-rust.md)
>

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. The sample presented in this article is a simple command-line based application that uses the [Rust driver for MongoDB](https://github.com/mongodb/mongo-rust-driver). Since Azure Cosmos DB's API for MongoDB is [compatible with the MongoDB wire protocol](./mongodb-introduction.md), it is possible for any MongoDB client driver to connect to it.

You will learn how to use the MongoDB Rust driver to interact with Azure Cosmos DB's API for MongoDB by exploring CRUD (create, read, update, delete) operations implemented in the sample code. Finally, you can run the application locally to see it in action.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/) without an Azure subscription. You can also use the [Azure Cosmos DB Emulator](https://aka.ms/cosmosdb-emulator) with the connection string `.mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true`.
- [Rust](https://www.rust-lang.org/tools/install) (version 1.39 or above)
- [Git](https://git-scm.com/downloads)

## Set up Azure Cosmos DB

To set up an Azure Cosmos DB account, follow the [instructions here](create-mongodb-dotnet.md). The application will need the MongoDB connection string which you can fetch using the Azure portal. For details, see [Get the MongoDB connection string to customize](connect-mongodb-account.md#get-the-mongodb-connection-string-to-customize).

## Run the application

### Clone the sample application

Run the following commands to clone the sample repository.

1. Open a command prompt, create a new folder named `git-samples`, then close the command prompt.

    ```bash
    mkdir "C:\git-samples"
    ```

1. Open a git terminal window, such as git bash, and use the `cd` command to change to the new folder to install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer. 

    ```bash
    git clone https://github.com/Azure-Samples/cosmosdb-rust-mongodb-quickstart
    ```

### Build the application

To build the binary:

```bash
cargo build --release
```

### Configure the application 

Export the connection string, MongoDB database, and collection names as environment variables. 

```bash
export MONGODB_URL="mongodb://<COSMOSDB_ACCOUNT_NAME>:<COSMOSDB_PASSWORD>@<COSMOSDB_ACCOUNT_NAME>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@<COSMOSDB_ACCOUNT_NAME>@"
```

> [!NOTE] 
> The `ssl=true` option is important because of Cosmos DB requirements. For more information, see [Connection string requirements](connect-mongodb-account.md#connection-string-requirements).
>

For the `MONGODB_URL` environment variable, replace the placeholders for `<COSMOSDB_ACCOUNT_NAME>` and `<COSMOSDB_PASSWORD>`

- `<COSMOSDB_ACCOUNT_NAME>`: The name of the Azure Cosmos DB account you created
- `<COSMOSDB_PASSWORD>`: The database key extracted in the previous step

```bash
export MONGODB_DATABASE=todos_db
export MONGODB_COLLECTION=todos
```

You can choose your preferred values for `MONGODB_DATABASE` and `MONGODB_COLLECTION` or leave them as is.

To run the application, change to the correct folder (where the application binary exists):

```bash
cd target/release
```

To create a `todo`

```bash
./todo create "Create an Azure Cosmos DB database account"
```

If successful, you should see an output with the MongoDB `_id` of the newly created document:

```bash
inserted todo with id = ObjectId("5ffd1ca3004cc935004a0959")
```

Create another `todo`

```bash
./todo create "Get the MongoDB connection string using the Azure CLI"
```

List all the `todo`s

```bash
./todo list all
```

You should see the ones you just added:

```bash
todo_id: 5ffd1ca3004cc935004a0959 | description: Create an Azure Cosmos DB database account | status: pending
todo_id: 5ffd1cbe003bcec40022c81c | description: Get the MongoDB connection string using the Azure CLI | status: pending
```

To update the status of a `todo` (for example, change it to `completed` status), use the `todo` ID as such:

```bash
./todo update 5ffd1ca3004cc935004a0959 completed

#output
updating todo_id 5ffd1ca3004cc935004a0959 status to completed
updated status for todo id 5ffd1ca3004cc935004a0959
```

List only the completed `todo`s

```bash
./todo list completed
```

You should see the one you just updated

```bash
listing 'completed' todos

todo_id: 5ffd1ca3004cc935004a0959 | description: Create an Azure Cosmos DB database account | status: completed
```

Delete a `todo` using it's ID

```bash
./todo delete 5ffd1ca3004cc935004a0959
```

List the `todo`s to confirm

```bash
./todo list all
```

The `todo` you just deleted should not be present.

### View data in Data Explorer

Data stored in Azure Cosmos DB is available to view and query in the Azure portal.

To view, query, and work with the user data created in the previous step, login to the [Azure portal](https://portal.azure.com) in your web browser.

In the top Search box, enter **Azure Cosmos DB**. When your Cosmos account blade opens, select your Cosmos account. In the left navigation, select **Data Explorer**. Expand your collection in the Collections pane, and then you can view the documents in the collection, query the data, and even create and run stored procedures, triggers, and UDFs.

## Review the code (optional)

If you're interested in learning how the application works, you can review the code snippets in this section. The following snippets are taken from the `src/main.rs` file.

The `main` function is the entry point for the `todo` application. It expects the connection URL for Azure Cosmos DB's API for MongoDB to be provided by the `MONGODB_URL` environment variable. A new instance of `TodoManager` is created, followed by a [`match` expression](https://doc.rust-lang.org/book/ch06-02-match.html) that delegates to the appropriate `TodoManager` method based on the operation chosen by the user - `create`, `update`, `list`, or `delete`.

```rust
fn main() {
    let conn_string = std::env::var_os("MONGODB_URL").expect("missing environment variable MONGODB_URL").to_str().expect("failed to get MONGODB_URL").to_owned();
    let todos_db_name = std::env::var_os("MONGODB_DATABASE").expect("missing environment variable MONGODB_DATABASE").to_str().expect("failed to get MONGODB_DATABASE").to_owned();
    let todos_collection_name = std::env::var_os("MONGODB_COLLECTION").expect("missing environment variable MONGODB_COLLECTION").to_str().expect("failed to get MONGODB_COLLECTION").to_owned();

    let tm = TodoManager::new(conn_string,todos_db_name.as_str(), todos_collection_name.as_str());
      
    let ops: Vec<String> = std::env::args().collect();
    let op = ops[1].as_str();

    match op {
        CREATE_OPERATION_NAME => tm.add_todo(ops[2].as_str()),
        LIST_OPERATION_NAME => tm.list_todos(ops[2].as_str()),
        UPDATE_OPERATION_NAME => tm.update_todo_status(ops[2].as_str(), ops[3].as_str()),
        DELETE_OPERATION_NAME => tm.delete_todo(ops[2].as_str()),
        _ => panic!(INVALID_OP_ERR_MSG)
    }
}
```

`TodoManager` is a `struct` that encapsulates a [mongodb::sync::Collection](https://docs.rs/mongodb/1.1.1/mongodb/sync/struct.Collection.html). When you try to instantiate a `TodoManager` using the `new` function, it initiates a connection to Azure Cosmos DB's API for MongoDB.

```rust
struct TodoManager {
    coll: Collection
}
....
impl TodoManager{
    fn new(conn_string: String, db_name: &str, coll_name: &str) -> Self{
        let mongo_client = Client::with_uri_str(&*conn_string).expect("failed to create client");
        let todo_coll = mongo_client.database(db_name).collection(coll_name);
            
        TodoManager{coll: todo_coll}
    }
....
```

Most importantly, `TodoManager` has methods to help manage `todo`s. Let's go over them one by one.

The `add_todo` method takes in a `todo` description provided by the user and creates an instance of `Todo` struct, which looks like below. The [serde](https://github.com/serde-rs/serde) framework is used to map (serialize/de-serialize) BSON data into instances of `Todo` structs. Notice how `serde` field attributes are used to customize the serialization/de-serialzation process. For example, `todo_id` field in the Todo `struct` is an `ObjectId` and it is stored in MongoDB as `_id`.

```rust
#[derive(Serialize, Deserialize)]
struct Todo {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    todo_id: Option<bson::oid::ObjectId>,
    #[serde(rename = "description")]
    desc: String,
    status: String,
}
```

[Collection.insert_one](https://docs.rs/mongodb/1.1.1/mongodb/struct.Collection.html#method.insert_one) accepts a [Document](https://docs.rs/bson/1.1.0/bson/document/struct.Document.html) representing the `todo` details to be added. Note that the conversion from `Todo` to a `Document` is a two-step process, achieved using a combination of [to_bson](https://docs.rs/bson/1.1.0/bson/ser/fn.to_bson.html) and [as_document](https://docs.rs/bson/1.1.0/bson/enum.Bson.html#method.as_document).

```rust
fn add_todo(self, desc: &str) {
    let new_todo = Todo {
        todo_id: None,
        desc: String::from(desc),
        status: String::from(TODO_PENDING_STATUS),
    };
    
    let todo_doc = mongodb::bson::to_bson(&new_todo).expect("struct to BSON conversion failed").as_document().expect("BSON to Document conversion failed").to_owned();
        
    let r = self.coll.insert_one(todo_doc, None).expect("failed to add todo");    
    println!("inserted todo with id = {}", r.inserted_id);
}
```

[Collection.find](https://docs.rs/mongodb/1.1.1/mongodb/struct.Collection.html#method.find) is used to get the retrieve *all* the `todo`s or filters them based on the user provided status (`pending` or `completed`). Note how in the `while` loop, each `Document` obtained as a result of the search is converted into a `Todo` struct using [bson::from_bson](https://docs.rs/bson/1.1.0/bson/de/fn.from_bson.html). This is the opposite of what was done in the `add_todo` method.

```rust
fn list_todos(self, status_filter: &str) {
    let mut filter = doc!{};
    if status_filter == TODO_PENDING_STATUS ||  status_filter == TODO_COMPLETED_STATUS{
        println!("listing '{}' todos",status_filter);
        filter = doc!{"status": status_filter}
    } else if status_filter != "all" {
        panic!(INVALID_FILTER_ERR_MSG)
    }

    let mut todos = self.coll.find(filter, None).expect("failed to find todos");
    
    while let Some(result) = todos.next() {
        let todo_doc = result.expect("todo not present");
        let todo: Todo = bson::from_bson(Bson::Document(todo_doc)).expect("BSON to struct conversion failed");
        println!("todo_id: {} | description: {} | status: {}", todo.todo_id.expect("todo id missing"), todo.desc, todo.status);
    }
}
```

A `todo` status can be updated (from `pending` to `completed` or vice versa). The `todo` is converted to a 
[bson::oid::ObjectId](https://docs.rs/bson/1.1.0/bson/oid/struct.ObjectId.html) which then used by the[Collection.update_one](https://docs.rs/mongodb/1.1.1/mongodb/struct.Collection.html#method.update_one) method to locate the document that needs to be 
updated.

```rust
fn update_todo_status(self, todo_id: &str, status: &str) {

    if status != TODO_COMPLETED_STATUS && status != TODO_PENDING_STATUS {
        panic!(INVALID_FILTER_ERR_MSG)
    }

    println!("updating todo_id {} status to {}", todo_id, status);
    
    let id_filter = doc! {"_id": bson::oid::ObjectId::with_string(todo_id).expect("todo_id is not valid ObjectID")};

    let r = self.coll.update_one(id_filter, doc! {"$set": { "status": status }}, None).expect("update failed");
    if r.modified_count == 1 {
        println!("updated status for todo id {}",todo_id);
    } else if r.matched_count == 0 {
        println!("could not update. check todo id {}",todo_id);
    }
}
```

Deleting a `todo` is straightforward using the [Collection.delete_one](https://docs.rs/mongodb/1.1.1/mongodb/struct.Collection.html#method.delete_one) method.


```rust
fn delete_todo(self, todo_id: &str) {
    println!("deleting todo {}", todo_id);
    
    let id_filter = doc! {"_id": bson::oid::ObjectId::with_string(todo_id).expect("todo_id is not valid ObjectID")};

    self.coll.delete_one(id_filter, None).expect("delete failed").deleted_count;
}
``` 

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB MongoDB API account using the Azure Cloud Shell, and create and run a Rust command-line app to manage `todo`s. You can now import additional data to your Azure Cosmos DB account.

> [!div class="nextstepaction"]
> [Import MongoDB data into Azure Cosmos DB](../dms/tutorial-mongodb-cosmos-db.md?toc=%2fazure%2fcosmos-db%2ftoc.json%253ftoc%253d%2fazure%2fcosmos-db%2ftoc.json)
