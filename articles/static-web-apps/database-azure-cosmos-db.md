---
title: "Tutorial: Add an Azure Cosmos DB database connection in Azure Static Web Apps"
description: Learn to add an  Azure Cosmos DB database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 03/07/2023
---

# Tutorial: Add an Azure Cosmos DB database connection in Azure Static Web Apps (preview)

In this tutorial, you learn how to connect an Azure Cosmos DB for NoSQL database to your static web app. Once configured, you can make GraphQL requests to the built-in `/data-api` endpoint to manipulate data without having to write backend code.

For the sake of simplicity, this tutorial shows you how to use an Azure database for local development purposes, but you may also use a local database server for your local development needs.

> [!NOTE]
> This tutorial shows how to use Azure Cosmos DB for NoSQL. If you would like to use another database, refer to the [Azure SQL](database-azure-sql.md), [MySQL](database-mysql.md), or [PostgreSQL](database-postgresql.md) tutorials.

:::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from Cosmos DB in the developer tools console window.":::

In this tutorial, you learn to:

> [!div class="checklist"]
> * Link a Azure Cosmos DB for NoSQL database to your static web app
> * Create, read, update, and delete data

## Prerequisites

To complete this tutorial, you need to have an existing Azure Cosmos DB for NoSQL database and static web app.

| Resource | Description |
|---|---|
| [Azure Cosmos DB for NoSQL Database](/azure/cosmos-db/nosql/quickstart-portal) | If you don't already have one, follow the steps in the [Create an Azure Cosmos DB database](/azure/cosmos-db/nosql/quickstart-portal) guide. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide to create a *No Framework* static web app. |

Begin by configuring your database to work with the Azure Static Web Apps database connection feature.

## Configure database connectivity

Azure Static Web Apps must have network access to your database for database connections to work. Additionally, to use an Azure database for local development, you need to configure your database to allow requests from your own IP address.

1. Go to your Azure Cosmos DB for NoSQL account in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Networking**.

1. Under the *Public access* section, select **All networks**. This action allows you to use the cloud database for local development, that your deployed Static Web Apps resource can access your database, and that you can query your database from the portal. 

1. Select **Save**.

## Get database connection string for local development

To use your Azure database for local development, you need to retrieve the connection string of your database. You may skip this step if you plan to use a local database for development purposes.

1. Go to your Azure Cosmos DB for NoSQL account in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Keys**.

1. From the *PRIMARY CONNECTION STRING* box, copy the connection string and set it aside in a text editor.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial.

1. On the left-hand navigation window, select **Data Explorer**.

1. Select **New Container**. Enter the Database ID as `Create new`, and enter `MyTestPersonDatabase` as value.

1. Enter the Container ID of `MyTestPersonContainer`.

1. Enter a partition key of `id` (this value is prefixed with `/`).

1. Select **OK**.

1. Select the *MyTestPersonContainer* container. 

1. Select its *Items*.

1. Select **New Item** and enter the following value:

    ```
    {
        "id": "1",
        "Name": "Sunny"
    }
    ```

## Configure the static web app

The rest of this tutorial focuses on editing your static web app's source code to make use of database connections locally.  

> [!IMPORTANT]
> The following steps assume you are working with the static web app created in the [getting started guide](getting-started.md). If you are using a different project, make sure to adjust the following git commands to match your branch names.

1. Switch to the `main` branch.

    ```bash
    git checkout main
    ```

1. Synchronize your local version with what's on GitHub by using `git pull`.

    ```bash
    git pull origin main
    ```

### Create the database configuration file

Next, create the configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string. The specific syntax may vary depending on the shell type you're using.

    # [Bash](#tab/bash)

    ```bash
    export DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $env:DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    ---

    Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. Use npm to install or update the Static Web Apps CLI. Select which command is best for your situation.

    To install, use `npm install`.

    # [Bash](#tab/bash)

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

    # [PowerShell](#tab/powershell)
    
    ```powershell
    npm install -g @azure/static-web-apps-cli
    ```
    ---

    To update, use `npm update`.

    # [Bash](#tab/bash)

    ```bash
    npm update
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    npm update
    ```

    ---
    
1. Use the `swa db init` command to generate a database configuration file.

    # [Bash](#tab/bash)

    ```bash
    swa db init --database-type cosmosdb_nosql --cosmosdb_nosql-database MyTestPersonDatabase
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    swa db init --database-type cosmosdb_nosql --cosmosdb_nosql-database MyTestPersonDatabase
    ```

    ---

    The `init` command creates the *staticwebapp.database.config.json* file in the *swa-db-connections* folder.

1. Paste in this sample schema into the *staticwebapp.database.schema.gql* file you generated.

    Since Cosmos DB for NoSQL is a schema agnostic database, Azure Static Web Apps database connections can't extract the schema of your database. The *staticwebapp.database.schema.gql* file allows you to specify the schema of your Cosmos DB for NoSQL database for Static Web Apps.

    ```gql
    type Person @model {
      id: ID
      Name: String
    }
    ```

1. Paste in this sample configuration into file *staticwebapp.database.config.json* you generated. Notice that Cosmos DB for NoSQL has more options in the `data-source` object to indicate the Cosmos DB database and the schema file needed for database connections to understand the schema of the database.

```json
{
  "$schema": "https://github.com/Azure/data-api-builder/releases/latest/download/dab.draft.schema.json",
  "data-source": {
    "database-type": "cosmosdb_nosql",
    "options": {
      "database": "MyTestPersonDatabase",
      "schema": "staticwebapp.database.schema.gql"
    },
    "connection-string": "@env('DATABASE_CONNECTION_STRING')"
  },
  "runtime": {
    "graphql": {
      "allow-introspection": true,
      "enabled": true,
      "path": "/graphql"
    },
    "host": {
      "mode": "production",
      "cors": {
        "origins": ["http://localhost:4280"],
        "allow-credentials": false
      },
      "authentication": {
        "provider": "StaticWebApps"
      }
    }
  },
  "entities": {
    "Person": {
      "source": "MyTestPersonContainer",
      "permissions": [
        {
          "actions": ["*"],
          "role": "anonymous"
        }
      ]
    }
  }
}
```

Before moving on to the next step, review the following table that explains different aspects of the configuration file. For full documentation on the configuration file and functionality such as relationships and policies for item-level security, refer to [Data API Builder documentation](/azure/data-api-builder/configuration-file).

| Feature | Explanation |
|---|---|
| **Database connection** | In development, the runtime reads the connection string from the value of the connection string in the configuration file. While you can specify your connection string directly in the configuration file, a best practice is to store connection strings in a local environment variable. You can refer to environment variable values in the configuration file via the `@env('DATABASE_CONNECTION_STRING')` notation. The value of the connection string gets overwritten by Static Web Apps for the deployed site with the information collected when you connect your database. |
| **API endpoint** | The GraphQL endpoint is available through `/data-api/graphql` as configured in this configuration file. You may configure the GraphQL path, but the `/data-api` prefix isn't configurable. |
| **API Security** | The `runtime.host.cors` settings allow you to define allowed origins that can make requests to the API. In this case, the configuration reflects a development environment and allowlists the *http://localhost:4280* location. |
| **Entity model** | Defines the entities exposed via routes as types in the GraphQL schema. In this case, the name *Person*, is the name exposed to the endpoint while `entities.<NAME>.source` is the database schema and table mapping. Notice how the API endpoint name doesn't need to be identical to the table name. |
| **Entity security** | Permissions rules listed in the `entity.<NAME>.permissions` array control the authorization settings for an entity. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

> [!NOTE]
> The configuration file's `connection-string`, `host.mode`, and `graphql.allow-introspection` properties are overwritten when you deploy your site. Your connection string is overwritten with the authentication details collected when you connect your database to your Static Web Apps resource. The `host.mode` property is set to `production`, and the `graphql.allow-introspection` is set to `false`. These overrides provide consistency in your configuration files across your development and production workloads, while ensuring your Static Web Apps resource with database connections enabled is secure and production-ready.

With the static web app configured to connect to the database, you can now verify the connection.

### Update home page

Replace the markup between the `body` tags in the *index.html* file with the following HTML.

```html
<h1>Static Web Apps Database Connections</h1>
<blockquote>
    Open the console in the browser developer tools to see the API responses.
</blockquote>
<div>
    <button id="list" onclick="list()">List</button>
    <button id="get" onclick="get()">Get</button>
    <button id="update" onclick="update()">Update</button>
    <button id="create" onclick="create()">Create</button>
    <button id="delete" onclick="del()">Delete</button>
</div>
<script>
    // add JavaScript here
</script>
```

## Start the application locally

Now you can run your website and manipulate data in the database directly.

1. Use npm to install or update the Static Web Apps CLI. Select which command is best for your situation.

    To install, use `npm install`.

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

    To update, use `npm update`.

    ```bash
    npm update
    ```

1. Start the static web app with the database configuration.

    ```bash
    swa start ./src --data-api-location swa-db-connections
    ```

Now that the CLI is started, you can access your database via the endpoints as defined in the *staticwebapp.database.config.json* file.

The `http://localhost:4280/data-api/graphql` endpoint accepts GraphQL queries and mutations.

## Manipulate data

The following framework-agnostic commands demonstrate how to do full CRUD operations on your database.

The output for each function appears in the browser's console window.

Open the developer tools by pressing <kbd>CMD/CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>I</kbd> and select the **Console** tab.

### List all items

Add the following code between the `script` tags in *index.html*.

```javascript
async function list() {

  const query = `
      {
        people {
          items {
            id
            Name
          }
        }
      }`;
      
  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query })
  });
  const result = await response.json();
  console.table(result.data.people.items);
}
```

In this example:

* The GraphQL query selects the `Id` and `Name` fields from the database.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.people.items` property.

Refresh the page and select the **List** button.

The browser's console window now displays a table that lists all the records in the database.

| id | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |

Here's a screenshot of what it should look like in your browser.

:::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from a database selection in the developer tools console window.":::

### Get by ID

Add the following code between the `script` tags in *index.html*.

```javascript
async function get() {

  const id = '1';

  const gql = `
    query getById($id: ID!) {
      person_by_pk(id: $id) {
        id
        Name
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
    },
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  const result = await response.json();
  console.table(result.data.person_by_pk);
}
```

In this example:

* The GraphQL query selects the `id` and `Name` fields from the database.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.person_by_pk` property.

Refresh the page and select the **Get** button.

The browser's console window now displays a table listing the single record requested from the database.

| id | Name |
|---|---|
| 1 | Sunny |

### Update

Add the following code between the `script` tags in *index.html*.

```javascript
async function update() {

  const id = '1';
  const data = {
    id: id,
    Name: "Molly"
  };

  const gql = `
    mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdatePersonInput!) {
      updatePerson(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
        id
        Name
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
      _partitionKeyValue: id,
      item: data
    } 
  };

  const endpoint = "/data-api/graphql";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const result = await res.json();
  console.table(result.data.updatePerson);
}
```

In this example:

* The GraphQL query selects the `id` and `Name` fields from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.updatePerson` property.

Refresh the page and select the **Update** button.

The browser's console window now displays a table showing the updated data.

| id | Name |
|---|---|
| 1 | Molly |

### Create

Add the following code between the `script` tags in *index.html*.

```javascript
async function create() {

  const data = {
    id: "3",
    Name: "Pedro"
  };

  const gql = `
    mutation create($item: CreatePersonInput!) {
      createPerson(item: $item) {
        id
        Name
      }
    }`;
  
  const query = {
    query: gql,
    variables: {
      item: data
    } 
  };
  
  const endpoint = "/data-api/graphql";
  const result = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const response = await result.json();
  console.table(response.data.createPerson);
}
```

In this example:

* The GraphQL query selects the `id` and `Name` fields from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.updatePerson` property.

Refresh the page and select the **Create** button.

The browser's console window now displays a table showing the new record in the database.

| id | Name |
|---|---|
| 3 | Pedro |

### Delete

Add the following code between the `script` tags in *index.html*.

```javascript
async function del() {

  const id = '3';

  const gql = `
    mutation del($id: ID!, $_partitionKeyValue: String!) {
      deletePerson(id: $id, _partitionKeyValue: $_partitionKeyValue) {
        id
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
    _partitionKeyValue: id
    }
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const result = await response.json();
  console.log(`Record deleted: ${ JSON.stringify(result.data) }`);
}
```

In this example:

* The GraphQL query selects the `Id` field from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.deletePerson` property.

Refresh the page and select the **Delete** button.

The browser's console window now displays a table showing the response from the delete request.

*Record deleted: 2*

Now that you've worked with your site locally, you can now deploy it to Azure.

## Deploy your site

To deploy this site to production, you just need to commit the configuration file and push your changes to the server.

1. Commit the configuration changes.

    ```bash
    git commit -am "Add database configuration"
    ```

1. Push your changes to the server.

    ```bash
    git push origin main
    ```

1. Wait for your web app to build.

1. Go to your static web app in the browser.

1. Select the **List** button to list all items.

    The output should resemble what's shown in this screenshot.

    :::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from listing records from the database in the developer tools console window.":::

## Connect the database to your static web app

Use the following steps to create a connection between the Static Web Apps instance of your site and your database.

1. Open your static web app in the Azure portal.

1. In the *Settings* section, select **Database connection**.

1. Under the *Production* section, select the **Link existing database** link.

1. In the *Link existing database* window, enter the following values:

    | Property | Value |
    |---|---|
    | Database Type | Select your database type from the dropdown list. |
    | Subscription | Select your Azure subscription from the dropdown list. |
    | Database Name | Select the name of the database you want to link to your static web app. |
    | Authentication Type | Select **Connection string**. |

1. Select **OK**.

## Verify that your database is connected to your Static Web Apps resource

Once you've connected your database to your static web app and the site is finished building, use the following steps to verify the database connection.

1. Open your static web app in the Azure portal.

1. In the *Essentials* section, select the **URL** of your Static Web Apps resource to navigate to your static web app.

1. Select the **List** button to list all items.

    The output should resemble what's shown in this screenshot.

    :::image type="content" source="media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from listing records from the database in the developer tools console window.":::

## Clean up resources

If you want to remove the resources created during this tutorial, you need to unlink the database and remove the sample data.

1. **Unlink database**: Open your static web app in the Azure portal. Under the *Settings* section, select **Database connection**. Next to the linked database, select **View details**. In the *Database connection details* window, select the **Unlink** button.

1. **Remove sample data**: In your database, delete the table named `MyTestPersonContainer`.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
