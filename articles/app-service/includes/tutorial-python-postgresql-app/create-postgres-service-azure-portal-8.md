---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

In your local environment using the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html), connect to the PostgreSQL database server, and create the `restaurant` database:

```Console
psql --host=<server-name>.postgres.database.azure.com \
     --port=5432 \
     --username=<admin-user> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server-name>` and `<admin-user>` are the values from a previous step. If you have trouble connecting, restart the database and try again.

Optionally, verify that the `restaurant` database was successfully created by running `\c restaurant` to change the prompt from `postgres` (default) to the `restaurant`. Type `\?` to show help or `\q` to quit.
