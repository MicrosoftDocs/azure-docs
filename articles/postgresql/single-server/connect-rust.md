---
title: Use Rust to interact with Azure Database for PostgreSQL
description: Learn to connect and query data in Azure Database for PostgreSQL Single Server using Rust code samples.
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.author: sunila
author: sunilagarwal
ms.devlang: rust
ms.custom: kr2b-contr-experiment
ms.date: 06/24/2022
---

# Quickstart: Use Rust to interact with Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

In this article, you will learn how to use the [PostgreSQL driver for Rust](https://github.com/sfackler/rust-postgres) to connect and query data in Azure Database for PostgreSQL. You can explore CRUD (create, read, update, delete) operations implemented in sample code, and run the application locally to see it in action.

## Prerequisites

For this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- A recent version of [Rust](https://www.rust-lang.org/tools/install) installed.
- An Azure Database for PostgreSQL single server. Create one using [Azure portal](./quickstart-create-server-database-portal.md) <br/> or [Azure CLI](./quickstart-create-server-database-azure-cli.md).
- Based on whether you are using public or private access, complete **ONE** of the actions below to enable connectivity.

  |Action| Connectivity method|How-to guide|
  |:--------- |:--------- |:--------- |
  | **Configure firewall rules** | Public | [Portal](./how-to-manage-firewall-using-portal.md) <br/> [CLI](./quickstart-create-server-database-azure-cli.md#configure-a-server-based-firewall-rule)|
  | **Configure service endpoint** | Public | [Portal](./how-to-manage-vnet-using-portal.md) <br/> [CLI](./how-to-manage-vnet-using-cli.md)|
  | **Configure private link** | Private | [Portal](./how-to-configure-privatelink-portal.md) <br/> [CLI](./how-to-configure-privatelink-cli.md) |

- [Git](https://git-scm.com/downloads) installed.

## Get database connection information

Connecting to an Azure Database for PostgreSQL database requires a fully qualified server name and login credentials. You can get this information from the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), search for and select your Azure Database for PostgreSQL server name.
1. On the server's **Overview** page, copy the fully qualified **Server name** and the **Admin username**. The fully qualified **Server name** is always of the form *\<my-server-name>.postgres.database.azure.com*, and the **Admin username** is always of the form *\<my-admin-username>@\<my-server-name>*.

## Review the code (optional)

If you're interested in learning how the code works, you can review the following snippets. Otherwise, feel free to skip ahead to [Run the application](#run-the-application).

### Connect

The `main` function starts by connecting to Azure Database for PostgreSQL and it depends on following environment variables for connectivity information `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD` and, `POSTGRES_DBNAME`. By default, the PostgreSQL database service is configured to require `TLS` connection. You can choose to disable requiring `TLS` if your client application does not support `TLS` connectivity. For details, please refer [Configure TLS connectivity in Azure Database for PostgreSQL - Single Server](./concepts-ssl-connection-security.md).

The sample application in this article uses TLS with the [postgres-openssl crate](https://crates.io/crates/postgres-openssl/). [postgres::Client::connect](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.connect) function is used to initiate the connection and the program exits in case this fails.

```rust
fn main() {
    let pg_host = std::env::var("POSTGRES_HOST").expect("missing environment variable POSTGRES_HOST");
    let pg_user = std::env::var("POSTGRES_USER").expect("missing environment variable POSTGRES_USER");
    let pg_password = std::env::var("POSTGRES_PASSWORD").expect("missing environment variable POSTGRES_PASSWORD");
    let pg_dbname = std::env::var("POSTGRES_DBNAME").unwrap_or("postgres".to_string());

    let builder = SslConnector::builder(SslMethod::tls()).unwrap();
    let tls_connector = MakeTlsConnector::new(builder.build());

    let url = format!(
        "host={} port=5432 user={} password={} dbname={} sslmode=require",
        pg_host, pg_user, pg_password, pg_dbname
    );
    let mut pg_client = postgres::Client::connect(&url, tls_connector).expect("failed to connect to postgres");
...
}
```

### Drop and create table

The sample application uses a simple `inventory` table to demonstrate the CRUD (create, read, update, delete) operations.

```sql
CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);
```

The `drop_create_table` function initially tries to `DROP` the `inventory` table before creating a new one. This makes it easier for learning/experimentation, as you always start with a known (clean) state. The [execute](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.execute) method is used for create and drop operations.

```rust
const CREATE_QUERY: &str =
    "CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);";

const DROP_TABLE: &str = "DROP TABLE inventory";

fn drop_create_table(pg_client: &mut postgres::Client) {
    let res = pg_client.execute(DROP_TABLE, &[]);
    match res {
        Ok(_) => println!("dropped table"),
        Err(e) => println!("failed to drop table {}", e),
    }
    pg_client
        .execute(CREATE_QUERY, &[])
        .expect("failed to create 'inventory' table");
}
```

### Insert data

`insert_data` adds entries to the `inventory` table. It creates a [prepared statement](https://docs.rs/postgres/0.19.0/postgres/struct.Statement.html) with [prepare](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.prepare) function.

```rust
const INSERT_QUERY: &str = "INSERT INTO inventory (name, quantity) VALUES ($1, $2) RETURNING id;";

fn insert_data(pg_client: &mut postgres::Client) {

    let prep_stmt = pg_client
        .prepare(&INSERT_QUERY)
        .expect("failed to create prepared statement");

    let row = pg_client
        .query_one(&prep_stmt, &[&"item-1", &42])
        .expect("insert failed");

    let id: i32 = row.get(0);
    println!("inserted item with id {}", id);
...
}
```

Also note the usage of [prepare_typed](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.prepare_typed) method, that allows the types of query parameters to be explicitly specified.

```rust
...
let typed_prep_stmt = pg_client
        .prepare_typed(&INSERT_QUERY, &[Type::VARCHAR, Type::INT4])
        .expect("failed to create prepared statement");

let row = pg_client
        .query_one(&typed_prep_stmt, &[&"item-2", &43])
        .expect("insert failed");

let id: i32 = row.get(0);
println!("inserted item with id {}", id);
...
```

Finally, a `for` loop is used to add `item-3`, `item-4` and, `item-5` with randomly generated quantity for each.

```rust
...
    for n in 3..=5 {
        let row = pg_client
            .query_one(
                &typed_prep_stmt,
                &[
                    &("item-".to_owned() + &n.to_string()),
                    &rand::thread_rng().gen_range(10..=50),
                ],
            )
            .expect("insert failed");

        let id: i32 = row.get(0);
        println!("inserted item with id {} ", id);
    }
...
```

### Query data

`query_data` function demonstrates how to retrieve data from the `inventory` table. The [query_one](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.query_one) method is used to get an item by its `id`.

```rust
const SELECT_ALL_QUERY: &str = "SELECT * FROM inventory;";
const SELECT_BY_ID: &str = "SELECT name, quantity FROM inventory where id=$1;";

fn query_data(pg_client: &mut postgres::Client) {

    let prep_stmt = pg_client
        .prepare_typed(&SELECT_BY_ID, &[Type::INT4])
        .expect("failed to create prepared statement");

    let item_id = 1;

    let c = pg_client
        .query_one(&prep_stmt, &[&item_id])
        .expect("failed to query item");

    let name: String = c.get(0);
    let quantity: i32 = c.get(1);
    println!("quantity for item {} = {}", name, quantity);
...
}
```

All rows in the inventory table are fetched using a `select * from` query with the [query](https://docs.rs/postgres/0.19.0/postgres/struct.Client.html#method.query) method. The returned rows are iterated over to extract the value for each column using [get](https://docs.rs/postgres/0.19.0/postgres/row/struct.Row.html#method.get).

> [!TIP]
> Note how `get` makes it possible to specify the column either by its numeric index in the row, or by its column name.

```rust
...
    let items = pg_client
        .query(SELECT_ALL_QUERY, &[])
        .expect("select all failed");

    println!("listing items...");

    for item in items {
        let id: i32 = item.get("id");
        let name: String = item.get("name");
        let quantity: i32 = item.get("quantity");
        println!(
            "item info: id = {}, name = {}, quantity = {} ",
            id, name, quantity
        );
    }
...
```

### Update data

The `update_date` function randomly updates the quantity for all the items. Since the `insert_data` function had added `5` rows, the same is taken into account in the `for` loop - `for n in 1..=5`

> [!TIP]
> Note that we use `query` instead of `execute` since we intend to get back the `id` and the newly generated `quantity` (using [RETURNING clause](https://www.postgresql.org/docs/current/dml-returning.html)).

```rust
const UPDATE_QUERY: &str = "UPDATE inventory SET quantity = $1 WHERE name = $2 RETURNING quantity;";

fn update_data(pg_client: &mut postgres::Client) {
    let stmt = pg_client
        .prepare_typed(&UPDATE_QUERY, &[Type::INT4, Type::VARCHAR])
        .expect("failed to create prepared statement");

    for id in 1..=5 {
        let row = pg_client
            .query_one(
                &stmt,
                &[
                    &rand::thread_rng().gen_range(10..=50),
                    &("item-".to_owned() + &id.to_string()),
                ],
            )
            .expect("update failed");

        let quantity: i32 = row.get("quantity");
        println!("updated item id {} to quantity = {}", id, quantity);
    }
}
```

### Delete data

Finally, the `delete` function demonstrates how to remove an item from the `inventory` table by its `id`. The `id` is chosen randomly - it's a random integer between `1` to `5` (`5` inclusive) since the `insert_data` function had added `5` rows to start with.

> [!TIP]
> Note that we use `query` instead of `execute` since we intend to get back the info about the item we just deleted (using [RETURNING clause](https://www.postgresql.org/docs/current/dml-returning.html)).

```rust
const DELETE_QUERY: &str = "DELETE FROM inventory WHERE id = $1 RETURNING id, name, quantity;";

fn delete(pg_client: &mut postgres::Client) {
    let stmt = pg_client
        .prepare_typed(&DELETE_QUERY, &[Type::INT4])
        .expect("failed to create prepared statement");

    let item = pg_client
        .query_one(&stmt, &[&rand::thread_rng().gen_range(1..=5)])
        .expect("delete failed");

    let id: i32 = item.get(0);
    let name: String = item.get(1);
    let quantity: i32 = item.get(2);
    println!(
        "deleted item info: id = {}, name = {}, quantity = {} ",
        id, name, quantity
    );
}
```

## Run the application

1. To begin with, run the following command to clone the sample repository:

    ```bash
    git clone https://github.com/Azure-Samples/azure-postgresql-rust-quickstart.git
    ```

2. Set the required environment variables with the values you copied from the Azure portal:

    ```bash
    export POSTGRES_HOST=<server name e.g. my-server.postgres.database.azure.com>
    export POSTGRES_USER=<admin username e.g. my-admin-user@my-server>
    export POSTGRES_PASSWORD=<admin password>
    export POSTGRES_DBNAME=<database name. it is optional and defaults to postgres>
    ```

3. To run the application, change into the directory where you cloned it and execute `cargo run`:

    ```bash
    cd azure-postgresql-rust-quickstart
    cargo run
    ```

    You should see an output similar to this:

    ```bash
    dropped 'inventory' table
    inserted item with id 1
    inserted item with id 2
    inserted item with id 3 
    inserted item with id 4 
    inserted item with id 5 
    quantity for item item-1 = 42
    listing items...
    item info: id = 1, name = item-1, quantity = 42 
    item info: id = 2, name = item-2, quantity = 43 
    item info: id = 3, name = item-3, quantity = 11 
    item info: id = 4, name = item-4, quantity = 32 
    item info: id = 5, name = item-5, quantity = 24 
    updated item id 1 to quantity = 27
    updated item id 2 to quantity = 14
    updated item id 3 to quantity = 31
    updated item id 4 to quantity = 16
    updated item id 5 to quantity = 10
    deleted item info: id = 4, name = item-4, quantity = 16 
    ```

4. To confirm, you can also connect to Azure Database for PostgreSQL [using psql](./quickstart-create-server-database-portal.md#connect-to-the-server-with-psql) and run queries against the database, for example:

    ```sql
    select * from inventory;
    ```

[Having issues? Let us know](https://aka.ms/postgres-doc-feedback)

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps

> [!div class="nextstepaction"]
> [Manage Azure Database for PostgreSQL server using Portal](./how-to-create-manage-server-portal.md)<br/>

> [!div class="nextstepaction"]
> [Manage Azure Database for PostgreSQL server using CLI](./how-to-manage-server-cli.md)<br/>

[Cannot find what you are looking for? Let us know.](https://aka.ms/postgres-doc-feedback)
