---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['vscode-azure-tools']
ms.custom: devx-track-python
---

In the dialog box at the top of the VS Code window, add each setting name followed by its value.

Add the following settings:

* *DBHOST* &rarr; Enter the server name you used earlier when created the database, for example, *msdocs-python-postgres-webapp-db-\<unique-id>*. The code in *azuresite/production.py* automatically appends `.postgres.database.azure.com` to create the full PostgreSQL server URL.
* *DBNAME* &rarr; Enter *restaurant*.
* *DBUSER* &rarr; Enter the administrator user name you specified when creating the database. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion.
* *DBPASS* &rarr; Enter the administrator password you specified when creating the database. The code in *azuresite/production.py* automatically constructs the full Postgres username from `DBUSER` and `DBHOST`, so don't include the `@server` portion.
