---
title: "Tutorial: Add a database connection in Azure Static Web Apps"
description: Learn to add a database connection to a web application in Azure Static Web Apps
author: craigshoemaker
ms.author: cshoe
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 02/02/23
zone_pivot_groups: static-web-apps-api-protocols
---

# Tutorial: Add a database connection in Azure Static Web Apps (preview)

Uninstall SWA CLI
Upgrade SWA CLI

## Create and seed table

```sql
CREATE TABLE [dbo].[People] (
    [ID]       INT          IDENTITY (1, 1) NOT NULL,
    [Name]     VARCHAR (25) NULL
);
```

ID is auto-incremented

```sql
INSERT INTO [dbo].[People] (Id, Name)
VALUES ('Sunny');

INSERT INTO [dbo].[People] (ID, Name)
VALUES ('Dheeraj');
```

copy connection string

add as an environment variable named `DATABASE_CONNECTION_STRING`

::: zone pivot="static-web-apps-rest"
::: zone-end

::: zone pivot="static-web-apps-graphql"
::: zone-end

*staticwebapp.database.config.json*

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
        "source": "dbo.people", 
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

Save to a folder named *db-config*.

`swa start /. --data-api-location db-config`

> [!NOTE]
> Keys sent in requests must match the database column capitalization.

::: zone pivot="static-web-apps-rest"

```javascript
const url = 'http://localhost:4280/data-api/api/people';

async function getAll() {
  try 
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getAll();
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function getAll() {

  const query = `{
    people
    { 
      items
      {
        ID
        Name
      }
    }
  }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log(data);
}

getAll();
```

::: zone-end

| ID | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |

## Get by ID

::: zone pivot="static-web-apps-rest"

```javascript
const url = 'http://localhost:4280/data-api/api/people';

async function getById(id) {
  try {
    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getById(1);

```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function getById(id) {

  const query = `{
    person(id: ${ id }) {
      ID
      Name
    }
  }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log(data);
}

getById(1);
```

::: zone-end

| ID | Name |
|---|---|
| 1 | Sunny |

## Update data

::: zone pivot="static-web-apps-rest"

`PUT` updates the whole record, `PATCH` does a partial update.

This example uses a `PUT` verb to do the update.

```javascript
const url = 'http://localhost:4280/data-api/api/people';

async function update(id, data) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

update(1, { Name: 'Molly' });

```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function update(1, ) {

  const query = `
    mutation {
    updatePerson(
      ID: 1,
      data: {
        Name: "Molly"
      })
      {
        ID
        Name
      }
    }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(data);
}

update();
```

::: zone-end

| ID | Name |
|---|---|
| 1 | Molly |
| 2 | Dheeraj |

## Create

::: zone pivot="static-web-apps-rest"

```javascript
const url = `http://localhost:4280/data-api/api/people/`;

async function create(data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

create({ Name: 'Pedro' });
```
::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function create(data) {

  const query = `
    mutation {
      createPeople(item: ${ JSON.stringify(data) })
      {
        ID
        Name
      }
    }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log(data);
}

create({ Name: "Pedro" });
```

::: zone-end

| ID | Name |
|---|---|
| 1 | Sunny |
| 2 | Dheeraj |
| 3 | Pedro |


## Delete

::: zone pivot="static-web-apps-rest"

```javascript
const url = 'http://localhost:4280/data-api/api/people/Id';

async function del(id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

del(1);
```

::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function del(id) {

  const query = `mutation {
    deletePerson(id: ${id})
  }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(data);
}

del(1);
```
::: zone-end


::: zone pivot="static-web-apps-rest"


::: zone-end

::: zone pivot="static-web-apps-graphql"

```javascript
const url = "http://localhost:4280/data-api/graphql";

async function getById(id) {

  const query = `query {
    person(ID: ${id}) {
      ID
      Name
    }
  }`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(data);
}

getById(1);
```

::: zone-end

| ID | Name |
|---|---|
| 2 | Dheeraj |
| 3 | Pedro |



## Next steps

> [!div class="nextstepaction"]
> [Configure your database](database-configuration.md)