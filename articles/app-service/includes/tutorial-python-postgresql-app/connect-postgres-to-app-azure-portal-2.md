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

Create application settings:

1. Select **+ New application setting** to create settings for each of the following values (which are expected by the django sample app):

    * *DBHOST* &rarr; Use the server name you used earlier when created the database, for example, *msdocs-python-postgres-webapp-db-\<unique id>*.
    The code in azuresite/production.py automatically appends .postgres.database.azure.com to create the full PostgreSQL server URL.
    * *DBNAME* &rarr;  Enter `restaurant`, the name of the application database.
    * *DBUSER* &rarr; The administrator user name used when you provisioned the database.
    * *DBPASS* &rarr; The administrator **secure password** you created earlier.

1. Confirm you have four settings and view their hidden values.

1. Select **Save** and to apply the settings.
