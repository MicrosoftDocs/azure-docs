---
title: "Tutorial: Add a database connection in Azure Static Web Apps"
description: Learn to add a database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 02/11/2023
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
| [Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) | If you don't already have one, follow the steps in to [create a single database guide](/azure/azure-sql/database/single-database-create-quickstart). |
| [Existing static web app](getting-started.md) | If you don't already have one, follow the steps in the [getting started guide](getting-started.md).  |
| [Azure Data Studio](https://aka.ms/azuredatastudio) | Data client used to create a sample table and add sample data. |

Begin by configuring your database to work with Azure Static Web Apps database connection feature.

## Configure database security

To work in a development environment, you need to allowlist your IP address for access to the database. You also need to allowlist Azure resources so that Static Web Apps workers can access your database when you deploy.

1. Go to your Azure SQL Server the [Azure portal](https://portal.azure.com).

1. Under the *Security* section, select **Networking**.

1. Select the **Add your client IPv4 address** button.

1. Select the **Allow Azure services and resources to access this server** checkbox.

1. Select **Save**.

## Get database connection string

You need the database connection string to set up your development environment.

1. Under the *Settings* section, select **SQL databases**.

1. Select the SQL database you created for this tutorial.

1. In the *Settings* section, select **Connection strings**

1. From the *ADO.NET (SQL authentication)* box, copy the connection string and set it aside in a text editor.

    1. Make sure to replace the `{your_password}` placeholder in the connection string with your password.

## Create sample data

Create a sample table and seed it with sample data to match the tutorial.

1. From the *Overview* window of your SQL database, select **Connect with...** to open the connection drop-down.

1. Select **Azure Data Studio**.

1. Find the text "*Already have the app?*" at the bottom of the window and select the link **Launch it now** to open Azure Data Studio.

1. If a dialog box appears, and asks *Open Azure Data Studio*, select **Open Azure Data Studio**.

1. When the Azure Data Studio dialog window opens asking *Are you sure you want to connect?* appears, select **Open**.

1. In the *Connection* window, enter the SQL Server user name and password.

1. Select **Connect**.

1. Select <kbd>CMD/CTRL</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> to open the *Severs* window.

1. Select <kbd>CMD/CTRL</kbd> + <kbd>N</kbd> to open a new query window.

1. Run the following script to create a new table named `MyTestPeopleTable`.

    ```sql
    CREATE TABLE [dbo].[MyTestPeopleTable] (
        [Id]       INT          IDENTITY (1, 1) NOT NULL,
        [Name]     VARCHAR (25) NULL
    );
    ```

    > [!NOTE]
    > The `Id` field is auto-incremented.

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

1. Ensure your local version is synchronized with what's on GitHub by synchronizing with the server.

    ```bash
    git pull origin main
    ```

## Create the database configuration file

Next, create a configuration file that your static web app uses to interface with the database.

1. Open your terminal and create a new variable to hold your connection string.

    ```bash
    DATABASE_CONNECTION_STRING=<YOUR_CONNECTION_STRING>
    ```

  Make sure to replace `<YOUR_CONNECTION_STRING>` with the connections string value you set aside in a text editor.

1. In the local repository of your static web app, create a new folder named **db-config**.

1. Create a file named **staticwebapp.database.config.json** and paste in the following sample configuration file.

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
| Database connection | The database connection string is pulled from an environment variable named `DATABASE_CONNECTION_STRING`. |
| API endpoint | The REST endpoint is available via `/data-api/api` while the GraphQL endpoint is exposed through `/data-api/graphql`. |
| API Security | The `runtime.host.cors` settings allow you to define which origins are allowed to make requests to the API. In this case, the configuration reflects a development environment and allowlists the *http://localhost:4280* location. |
| Entity model | Entities are defined according to the document or table names. The setting `entity.<NAME>.source` points to the entity name. Note how the API endpoint name doesn't need to be identical to the table name. |
| Entity security | Entity permissions are defined in `entity.<NAME>.permissions` array. You can secure an entity with roles in the same way you [secure routes with roles](./configuration.md#securing-routes-with-roles).  |

With the static web app configured to connect to the database, you can now verify the connection.

## Update build configuration

1. From the *.github/workflows* folder, open the workflow YAML file.

1. On a new line after the `output_location` entry, add the following line:

    ```yml
    data_api_location: "db-config"
    ```

1. Save and close the file.

## Start the application locally

Now you can run your website and manipulate data in the database directly.

1. Use npm to install or update the Static Web Apps CLI. Select which command is best for your situation.

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

    ```bash
    npm update
    ```

1. Start the static web app with the database configuration.

    ```bash
    swa start /. --data-api-location db-config
    ```

## Manipulate data

The following commands are implemented as framework-agnostic code.

To run each command, open the developer tools and paste in each command into the browser's developer console window.

> [!NOTE]
> Keys sent in requests must match the database column capitalization.

### Return all items

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
  
    const endpoint = "http://localhost:4280/data-api/graphql";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Length": query.length,
            "Content-Type": "application/json"
        },
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
      const data = await response.json();
      console.table(data.value);
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
  
    const endpoint = "http://localhost:4280/data-api/graphql";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Length": query.length,
            "Content-Type": "application/json"
        },
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

`PUT` updates the whole record, `PATCH` does a partial update.

This example uses a `PUT` verb to do the update.

```javascript
(() => {
  
  async function update(id, data) {
    try {
      const endpoint = 'http://localhost:4280/data-api/api/people/Id';
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
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
      mutation updatePeople($id: Int!, $item: UpdatePeopleInput!) {
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
  
    const endpoint = "http://localhost:4280/data-api/graphql";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const result = await res.json();
    console.table(result.data.updatePeople);
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
    
    const endpoint = "http://localhost:4280/data-api/graphql";
    const query = `
      mutation {
        createPeople(item: ${ JSON.stringify(data) })
        {
          ID
          Name
        }
      }`;
  
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
  
    const data = await res.json();
    console.table(data);
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

## Clean up resources

If you want to remove the resources created during this tutorial, you need to unlink the database and remove sample data.

1. **Unlink database**: Open your static web app in the Azure portal. Under the *Settings* section, select **Database connection**. Next to the linked database, select **View details**. In the *Database connection details* window, select the **Unlink** button.

1. **Remove sample data**: In your database, delete the table named `MyTestPeopleTable`.

## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md)