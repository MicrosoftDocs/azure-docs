---
title: "Tutorial: Add a database connection in Azure Static Web Apps"
description: Learn to add a database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 02/16/2023
zone_pivot_groups: static-web-apps-api-protocols
---

# Tutorial: Add a database connection in Azure Static Web Apps (preview)

In this tutorial, you learn to connect an Azure SQL database to your static web app. Once configured, you issue REST or GraphQL requests to manipulate data without having to write data access code.

> [!div class="checklist"]
> * Link a Azure SQL database to your static web app
> * Create, read, update, and delete data

## Prerequisites

To complete this tutorial, you need to have an existing Azure SQL database and static web app. Additionally, you need to install Azure Data Studio.

| Resource | Description |
|---|---|
| [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) | If you don't already have one, follow the steps in the [create a single database](/azure/azure-sql/database/single-database-create-quickstart) guide. |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started](getting-started.md) guide.  |

Begin by configuring your database to work with the Azure Static Web Apps database connection feature.

## Configure database security

To work in a development environment, you need to allowlist your IP address, and some Azure resources so the Static Web Apps worker can access the database.

1. Go to your Azure SQL Server in the [Azure portal](https://portal.azure.com).

1. Under the *Security* section, select **Networking**.

1. Under the *Public access* tab, next to *Public network access*, select **Selected networks**.

1. Under the *Firewall rules* section, select the **Add your client IPv4 address** button.

1. Under the *Exceptions* section, select the **Allow Azure services and resources to access this server** checkbox.

1. Select **Save**.

## Get database connection string

You need the database connection string to set up your development environment.

1. Under the *Settings* section, select **SQL databases**.

1. Select the SQL database you created for this tutorial.

1. In the *Settings* section, select **Connection strings**

1. From the *ADO.NET (SQL authentication)* box, copy the connection string and set it aside in a text editor.

    Make sure to replace the `{your_password}` placeholder in the connection string with your password.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial.

1. On the left-hand navigation window, select **Query editor**.

1. Sign in to the server with your Active Directory account or the server's user name and password.

1. Run the following script to create a new table named `MyTestPersonTable`.

    ```sql
    CREATE TABLE [dbo].[MyTestPersonTable] (
        [Id] INT IDENTITY (1, 1) NOT NULL,
        [Name] VARCHAR (25) NULL,
        PRIMARY KEY (Id)
    );
    ```

1. Run the following script to add data into the *MyTestPersonTable* table.

    ```sql
    INSERT INTO [dbo].[MyTestPersonTable] (Name)
    VALUES ('Sunny');
    
    INSERT INTO [dbo].[MyTestPersonTable] (Name)
    VALUES ('Dheeraj');
    ```

## Configure the static web app

The rest this tutorial focuses on working with local files in your static web app.

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

Next, create a configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string.

    # [Bash](#tab/bash)

    ```bash
    DATABASE_CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $env:DATABASE_CONNECTION_STRING='<YOUR_CONNECTION_STRING>'
    ```

    ---

    Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. Use the `swa db init` command to generate a database configuration file.

    # [Bash](#tab/bash)

    ```bash
    swa db init --database-type mssql
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    swa db init --database-type mssql
    ```

    ---

    The `init` command creates the *staticwebapp.database.config.json* file in the *swa-db-connections* folder.

1. Paste in this sample into file *staticwebapp.database.config.json* you generated.

    ```json
    { 
        "$schema": "dab.draft-01.schema.json", 
        "data-source": { 
          "database-type": "mssql", 
          "connection-string": "@env(DATABASE_CONNECTION_STRING)" 
        }, 
        "runtime": { 
          "rest": { 
            "path": "/api" 
          }, 
          "graphql": { 
            "path": "/graphql" 
          }, 
          "host": { 
            "mode": "development", 
            "cors": { 
              "origins": ["http://localhost:4280"], 
              "allow-credentials": true 
            }, 
            "authentication": { 
              "provider": "StaticWebApps" 
            } 
          } 
        }, 
        "entities": { 
          "Person": { 
            "source": "dbo.MyTestPersonTable", 
            "permissions": [ 
              { 
                "actions": ["*"], 
                "role": "admin" 
              }, 
              { 
                "actions": ["read"], 
                "role": "anonymous" 
              } 
            ], 
          }, 
        } 
      } 
    ```

Before moving on to the next step, review the following table that explains different aspects of the configuration file.

| Feature | Explanation |
|---|---|
| **Database connection** | In development, the runtime reads the connection string from an environment variable named `DATABASE_CONNECTION_STRING`. |
| **API endpoint** | The REST endpoint is available via `/data-api/api` while the GraphQL endpoint is available through `/data-api/graphql`. |
| **API Security** | The `runtime.host.cors` settings allow you to define allowed origins that can make requests to the API. In this case, the configuration reflects a development environment and allowlists the *http://localhost:4280* location. |
| **Entity model** | Defines the entities exposed via routes in the REST API, or as types in the GraphQL schema. In this case, the name *Person*, is the name exposed to the endpoint while `entities.<NAME>.source` is the database schema and table mapping. Notice how the API endpoint name doesn't need to be identical to the table name. |
| **Entity security** | Permissions rules listed in the `entity.<NAME>.permissions` array control the authorization settings for an entity. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

With the static web app configured to connect to the database, you can now verify the connection.

### Update home page

Replace the markup between the `body` tags with the following HTML.

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

## Manipulate data

The following framework-agnostic commands demonstrate how to do full CRUD operations on your database.

The output for each function appears in the browser's console window.

Open the developer tools by pressing <kbd>CMD/CTRL</kbd> + <kbd>SHIFT</kdb> + <kbd>I</kbd> and select the **Console** tab.

### List all items

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function list() {
  const endpoint = 'http://localhost:4280/data-api/api/person';
  const response = await fetch(endpoint);
  const data = await response.json();
  console.table(data.value);
}
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
async function list() {

  const query = `
      {
        people {
          items {
            Id
            Name
          }
        }
      }`;
      
  const endpoint = "http://localhost:4280/data-api/graphql";
  const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query })
  });
  const result = await response.json();
  console.table(result.data.people.items);
}
```

Refresh the page and select the **List** button.

The browser's console window now displays a table that lists all the records in the database.

::: zone-end

| ID | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |

### Get by ID

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function get() {
  const id = 1;
  const endpoint = `http://localhost:4280/data-api/api/person/Id/${id}`;
  const response = await fetch(endpoint);
  const result = await response.json();
  console.table(result.value);
}
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
async function get() {

  const id = 1;

  const gql = `
    query getById($id: Int!) {
      person_by_pk(Id: $id) {
        Id
        Name
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
    },
  };

  const endpoint = "http://localhost:4280/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  const result = await response.json();
  console.table(result.data.person_by_pk);
}
```

::: zone-end

Refresh the page and select the **Get** button.

The browser's console window now displays a table listing the single record requested from the database.

| ID | Name |
|---|---|
| 1 | Sunny |

### Update

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

Static Web Apps support both the `PUT` and `PATCH` verbs. A `PUT` request updates the whole record, while `PATCH` does a partial update.

This example uses a `PUT` request to do the update.

```javascript
async function update() {

  const id = 1;
  const data = {
    Name: "Molly"
  };

  const endpoint = 'http://localhost:4280/data-api/api/person/Id';
  const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}

```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
async function update() {

  const id = 1;
  const data = {
    Name: "Molly"
  };

  const gql = `
    mutation update($id: Int!, $item: UpdatePersonInput!) {
      updatePerson(Id: $id, item: $item) {
        Id
        Name
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
      item: data
    } 
  };

  const endpoint = "http://localhost:4280/data-api/graphql";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const result = await res.json();
  console.table(result.data.updatePerson);
}
```

::: zone-end

Refresh the page and select the **Update** button.

The browser's console window now displays a table showing the updated data.

| ID | Name |
|---|---|
| 1 | Molly |

### Create

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function create() {

  const data = {
    Name: "Pedro"
  };

  const endpoint = `http://localhost:4280/data-api/api/person/`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
async function create() {

  const data = {
    Name: "Pedro"
  };

  const gql = `
    mutation create($item: CreatePersonInput!) {
      createPerson(item: $item) {
        Id
        Name
      }
    }`;
  
  const query = {
    query: gql,
    variables: {
      item: data
    } 
  };
  
  const endpoint = "http://localhost:4280/data-api/graphql";
  const result = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const response = await result.json();
  console.table(response.data.createPerson);
}
```

::: zone-end

Refresh the page and select the **Create** button.

The browser's console window now displays a table showing the new record in the database.

| ID | Name |
|---|---|
| 3 | Pedro |

### Delete

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function del() {
  const id = 3;
  const endpoint = 'http://localhost:4280/data-api/api/person/Id';
  const response = await fetch(`${endpoint}/${id}`, {
    method: "DELETE"
  });
  if(response.ok) {
    console.log(`Record deleted: ${ id }`)
  } else {
    console.log(response);
  }
}
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
async function del() {

  const id = 3;

  const gql = `
    mutation del($id: Int!) {
      deletePerson(Id: $id) {
        Id
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id
    }
  };

  const endpoint = "http://localhost:4280/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const result = await response.json();
  console.log(`Record deleted: ${ result.data.deletePerson.Id }`);
}
```

::: zone-end

Refresh the page and select the **Delete** button.

The browser's console window now displays a table showing the response from the delete request.

*Record deleted: 2*

Now that you've worked with your site locally, you can now deploy it to Azure.

## Connect the database to your static web app

Before you deploy your site, you first need to create a connection between the Static Web Apps instance of your site and your database.

1. Open your static web app in the Azure portal.

1. In the *Settings* section, select **Database connection**.

1. Under the *Production* section, select the **Link existing database** link.

1. In the *Link existing database* window, enter the following values:

    | Property | Value |
    |---|---|
    | Database Type | Select your database type from the dropdown list. |
    | Subscription | Select your Azure subscription from the dropdown list. |
    | Resource Name | Select the database server name that has your desired database. |
    | Database Name | Select the name of the database you want to link to your static web app. |
    | Authentication Type | Select **Connection string**, and enter the SQL server user name and password |

1. Select **OK**.

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

Now wait for your web app to build, and then send a request to [list all items](#list-all-items) to verify a production connection to the database.

## Clean up resources

If you want to remove the resources created during this tutorial, you need to unlink the database and remove the sample data.

1. **Unlink database**: Open your static web app in the Azure portal. Under the *Settings* section, select **Database connection**. Next to the linked database, select **View details**. In the *Database connection details* window, select the **Unlink** button.

1. **Remove sample data**: In your database, delete the table named `MyTestPersonTable`.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
