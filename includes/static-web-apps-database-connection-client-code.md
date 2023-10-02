---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 02/28/2028
ms.author: cshoe
---

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


1. Start the static web app with the database configuration.

    ```bash
    swa start ./src --data-api-location swa-db-connections
    ```

Now that the CLI is started, you can access your database via the endpoints as defined in the *staticwebapp.database.config.json* file.

::: zone pivot="static-web-apps-rest"
The `http://localhost:4280/data-api/rest/<ENTITY_NAME>` endpoint accepts `GET`, `PUT`, `POST` and `DELETE` requests to manipulate data in the database.
::: zone-end

::: zone pivot="static-web-apps-graphql"
The `http://localhost:4280/data-api/graphql` endpoint accepts GraphQL queries and mutations.
::: zone-end

## Manipulate data

The following framework-agnostic commands demonstrate how to do full CRUD operations on your database.

The output for each function appears in the browser's console window.

Open the developer tools by pressing <kbd>CMD/CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>I</kbd> and select the **Console** tab.

### List all items

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function list() {
  const endpoint = '/data-api/rest/Person';
  const response = await fetch(endpoint);
  const data = await response.json();
  console.table(data.value);
}
```

In this example:

* The default request for the `fetch` API uses the verb `GET`.
* Data in the response payload is found in the `value` property.

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

::: zone-end

Refresh the page and select the **List** button.

The browser's console window now displays a table that lists all the records in the database.

| ID | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |

Here's a screenshot of what it should look like in your browser.

:::image type="content" source="../articles/static-web-apps/media/database-add/static-web-apps-database-connections-list.png" alt-text="Web browser showing results from a database selection in the developer tools console window.":::

### Get by ID

Add the following code between the `script` tags in *index.html*.

::: zone pivot="static-web-apps-rest"

```javascript
async function get() {
  const id = 1;
  const endpoint = `/data-api/rest/Person/Id`;
  const response = await fetch(`${endpoint}/${id}`);
  const result = await response.json();
  console.table(result.value);
}
```

In this example:

* The endpoint is suffixed with `/person/Id`.
* The ID value is appended to the end of the endpoint location.
* Data in the response payload is found in the `value` property.

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

* The GraphQL query selects the `Id` and `Name` fields from the database.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.person_by_pk` property.

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

```javascript
async function update() {

  const id = 1;
  const data = {
    Name: "Molly"
  };

  const endpoint = '/data-api/rest/Person/Id';
  const response = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}

```

In this example:

* The endpoint is suffixed with `/person/Id/`.
* The ID value is appended to the end of the endpoint location.
* The REST verb is `PUT` to update the database record.
* Data in the response payload is found in the `value` property.

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

* The GraphQL query selects the `Id` and `Name` fields from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.updatePerson` property.

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

  const endpoint = `/data-api/rest/Person/`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.table(result.value);
}
```

In this example:

* The endpoint is suffixed with `/person/`.
* The REST verb is `POST` to add a database record.
* Data in the response payload is found in the `value` property.

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

* The GraphQL query selects the `Id` and `Name` fields from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.updatePerson` property.

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
  const endpoint = '/data-api/rest/Person/Id';
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

In this example:

* The endpoint is suffixed with `/person/Id/`.
* The ID value is appended to the end of the endpoint location.
* The REST verb is `DELETE` to remove the database record.
* If the delete is successful the response payload `ok` property is `true`.

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

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query)
  });

  const result = await response.json();
  console.log(`Record deleted: ${ result.data.deletePerson.Id }`);
}
```

In this example:

* The GraphQL query selects the `Id` field from the database.
* The `query` object holds the GraphQL query in the `query` property.
* The argument values to the GraphQL function are passed in via the `query.variables` property.
* The request passed to the server requires a payload where the `query` property holds the query definition.
* Data in the response payload is found in the `data.deletePerson` property.

::: zone-end

Refresh the page and select the **Delete** button.

The browser's console window now displays a table showing the response from the delete request.

*Record deleted: 3*

Now that you've worked with your site locally, you can now deploy it to Azure.

## Deploy your site

To deploy this site to production, you just need to commit the configuration file and push your changes to the server.

1. Add the file changes to track.

    ```bash
    git add .
    ```

1. Commit the configuration changes.

    ```bash
    git commit -am "Add database configuration"
    ```

1. Push your changes to the server.

    ```bash
    git push origin main
    ```



