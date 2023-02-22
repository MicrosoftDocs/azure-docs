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

1. Run the following script to create a new table named `MyTestPeopleTable`.

    ```sql
    CREATE TABLE [dbo].[MyTestPeopleTable] (
        [Id] INT IDENTITY (1, 1) NOT NULL,
        [Name] VARCHAR (25) NULL,
        PRIMARY KEY (Id)
    );
    ```

1. Run the following script to add data into the *MyTestPeopleTable* table.

    ```sql
    INSERT INTO [dbo].[MyTestPeopleTable] (Name)
    VALUES ('Sunny');
    
    INSERT INTO [dbo].[MyTestPeopleTable] (Name)
    VALUES ('Dheeraj');
    ```

## Link the database to your static web app

Now that you have sample data in the database, you can configure your static web app to connect to the database.

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

## Create the database configuration file

Next, create a configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string.

    ```bash
    DATABASE_CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
    ```

    Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. Use the `swa db init` command to generate a database configuration file.

    ```bash
    swa db init --database-type mssql
    ```

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
          "People": { 
            "source": "dbo.MyTestPeopleTable", 
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
| **Entity model** | Defines the entities exposed via routes in the REST API, or as types in the GraphQL schema. In this case, the name *People*, is the name exposed to the endpoint while `entities.<NAME>.source` is the database schema and table mapping. Notice how the API endpoint name doesn't need to be identical to the table name. |
| **Entity security** | Permissions rules listed in the `entity.<NAME>.permissions` array control the authorization settings for an entity. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

With the static web app configured to connect to the database, you can now verify the connection.

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

To run each command, open the browser developer tools and paste in each command into the console window.

### List all items

Run the following code in the browser's console window to select all items.

::: zone pivot="static-web-apps-rest"

```javascript
(() => {
  const endpoint = 'http://localhost:4280/data-api/api/people';
  
  async function getAll() {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.table(data.value);
    } catch (error) {
      console.error(error);
    }
  }
  
  getAll();
})();
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
(() => {
  async function getAll() {
    
    const query = `
      {
          people
          { 
              items
              {
                  Id
                  Name
              }
          }
       }`;
  
    try {
      const endpoint = "http://localhost:4280/data-api/graphql";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      const result = await response.json();
      console.table(result.data.people.items);
    } catch (error) {
      console.log(error);
    }
  }
  
  getAll();
})();
```

The browser's console window displays a table that lists all the records in the database.

::: zone-end

| ID | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |

### Get by ID

Run the following code in the browser's console window to get an item by its unique identifier.

::: zone pivot="static-web-apps-rest"

```javascript
(() => {
  async function getById(id) {
    try {
      const endpoint = `http://localhost:4280/data-api/api/people/Id/${id}`;
      const response = await fetch(endpoint);
      const result = await response.json();
      console.table(result.value);
    } catch (error) {
      console.error(error);
    }
  }
  
  getById(1);
})();
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
(() => {
  async function getById(id) {
    
    const query = `
      {
          people_by_pk(Id: 1) {
            Id
            Name
      }`;

    try {
      const endpoint = "http://localhost:4280/data-api/graphql";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      const result = await response.json();
      console.table(result.data.people_by_pk);
    } catch (error) {
      console.log(error);
    }
  }
  
  getById(1);
})();
```

::: zone-end

The browser's console window displays a table listing the single record requested from the database.

| ID | Name |
|---|---|
| 1 | Sunny |

### Update

Run the following code in the browser's console window to update a record.

::: zone pivot="static-web-apps-rest"

Static Web Apps support both the `PUT` and `PATCH` verbs. A `PUT` request updates the whole record, while `PATCH` does a partial update.

This example uses a `PUT` request to do the update.

```javascript
(() => {
  
  async function update(id, data) {
    try {
      const endpoint = 'http://localhost:4280/data-api/api/people/Id';
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.table(result.value);
    } catch (error) {
      console.error(error);
    }
  }
  
  update(1, { Name: 'Molly' });
})();

```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
(() => {
  
  async function update(id, newValues) {
    
    const mutation = `
      mutation update($id: Int!, $item: UpdatePeopleInput!) {
        updatePeople(Id: $id, item: $item) {
          Id
          Name
        }
      }`;

    const query = {
      query: mutation,
      variables: {
        id: id,
        item: newValues
      } 
    };

    try {
      const endpoint = "http://localhost:4280/data-api/graphql";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });
  
      const result = await res.json();
      console.table(result.data.updatePeople);
    } catch(error) {
      console.error(error);
    }
  }
  
  update(1, { Name: "Molly" });
})();
```

::: zone-end

The browser's console window now displays a table showing the updated data.

| ID | Name |
|---|---|
| 1 | Molly |

### Create

Run the following code in the browser's console window to create a new record.

::: zone pivot="static-web-apps-rest"

```javascript
(() => {
  
  async function create(data) {
    const endpoint = `http://localhost:4280/data-api/api/people/`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.table(result.value);
    } catch (error) {
      console.error(error);
    }
  }
  
  create({ Name: 'Pedro' });
})();
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
(() => {
  
  async function create(data) {
    
    const query = `
      mutation {
        createPeople(item: ${ JSON.stringify(data) })
        {
          Id
          Name
        }
      }`;
  
    try {
      const endpoint = "http://localhost:4280/data-api/graphql";
      const result = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
    
      const response = await result.json();
      console.table(response);
    } catch(error) {
      console.error(error);
    }
  }
  
  create({ Name: "Pedro" });
})();
```

::: zone-end

The browser's console window now displays a table showing the new record in the database.

| ID | Name |
|---|---|
| 3 | Pedro |

### Delete

Run the following code in the browser's console window to delete a record.

::: zone pivot="static-web-apps-rest"

```javascript
(() => {
  
  async function del(id) {
    try {
      const endpoint = 'http://localhost:4280/data-api/api/people/Id';
      const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE"
      });
      console.log(`Record deleted: ${response.ok}`)
    } catch (error) {
      console.error(error);
    }
  }
  
  del(3);
})();
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
(() => {
  
  async function del(personId) {
    
    const mutation = `
        mutation deletePeople($id: Int!) {
          deletePeople(Id: $id) {
            Id
          }
        }`;

    const query = {
        query: mutation,
        variables: {
            id: personId
        }
    };

    try {
      const endpoint = "http://localhost:4280/data-api/graphql";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
      });
  
      const result = await response.json();
      console.log(`Record deleted: ${result.data.deletePeople.Id}`);
    } catch(error) {
      console.error(error);
    }
  }
  
  del(1);
})();
```

::: zone-end

The browser's console window now displays a table showing the response from the delete request.

| ID | Name |
|---|---|
| 2 | Dheeraj |
| 3 | Pedro |

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

1. **Remove sample data**: In your database, delete the table named `MyTestPeopleTable`.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
