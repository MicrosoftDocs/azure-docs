---
title: "Quickstart: Connect to Azure PostgreSQL with GitHub Actions"
description: Use Azure PostgreSQL from a GitHub Actions workflow
author: sunilagarwal
ms.author: sunila
ms.reviewer: maghan
ms.date: 04/28/2023
ms.service: postgresql
ms.subservice: single-server
ms.topic: quickstart
ms.custom: github-actions-azure, mode-other, devx-track-azurecli
---

# Quickstart: Use GitHub Actions to connect to Azure PostgreSQL

[!INCLUDE [applies-to-postgresql-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Get started with [GitHub Actions](https://docs.github.com/en/actions) by using a workflow to deploy database updates to [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/).

## Prerequisites

You need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub repository with sample data (`data.sql`). If you don't have a GitHub account, [sign up for free](https://github.com/join).
- An Azure Database for PostgreSQL server.
    - [Quickstart: Create an Azure Database for PostgreSQL server in the Azure portal](quickstart-create-server-database-portal.md)

## Workflow file overview

A GitHub Actions workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has two sections:

| Section | Tasks |
| --- | --- |
| **Authentication** | 1. Generate deployment credentials. |
| **Deploy** | 1. Deploy the database. |

## Generate deployment credentials

[!INCLUDE [include](~/articles/reusable-content/github-actions/generate-deployment-credentials.md)]

## Copy the PostgreSQL connection string

In the Azure portal, go to your Azure Database for PostgreSQL server and open **Settings** > **Connection strings**. Copy the **ADO.NET** connection string. Replace the placeholder values for `your_database` and `your_password`. The connection string looks similar to this.

> [!IMPORTANT]  
> - For Single server use ```user=adminusername@servername```  . Note the ```@servername``` is required.
> - For Flexible server , use ```user= adminusername``` without the  ```@servername```.

```output
psql host={servername.postgres.database.azure.com} port=5432 dbname={your_database} user={adminusername} password={your_database_password} sslmode=require
```

You use the connection string as a GitHub secret.

## Configure the GitHub secrets

[!INCLUDE [include](~/articles/reusable-content/github-actions/create-secrets-with-openid.md)]

## Add your workflow

1. Go to **Actions** for your GitHub repository.

1. Select **Set up your workflow yourself**.

1. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this.

    ```yaml
    name: CI

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]
    ```

1. Rename your workflow `PostgreSQL for GitHub Actions` and add the checkout and sign in actions. These actions check out your site code and authenticate with Azure using the GitHub secret(s) you created earlier.

    # [Service principal](#tab/userlevel)

    ```yaml
    name: PostgreSQL for GitHub Actions

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]

    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: azure/login@v1
        with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

    # [OpenID Connect](#tab/openid)

    ```yaml
    name: PostgreSQL for GitHub Actions

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]

    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: azure/login@v1
        with:
            client-id: ${{ secrets.AZURE_CLIENT_ID }}
            tenant-id: ${{ secrets.AZURE_TENANT_ID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    ```

    ---

1. Use the Azure PostgreSQL Deploy action to connect to your PostgreSQL instance. Replace `POSTGRESQL_SERVER_NAME` with the name of your server. You should have a PostgreSQL data file named `data.sql` at the root level of your repository.

    ```yaml
     - uses: azure/postgresql@v1
       with:
        connection-string: ${{ secrets.AZURE_POSTGRESQL_CONNECTION_STRING }}
        server-name: POSTGRESQL_SERVER_NAME
        plsql-file: './data.sql'
    ```

1. Complete your workflow by adding an action to sign out of Azure. Here's the completed workflow. The file appears in the `.github/workflows` folder of your repository.

    # [Service principal](#tab/userlevel)

    ```yaml
   name: PostgreSQL for GitHub Actions

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]


    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: azure/login@v1
        with:
            client-id: ${{ secrets.AZURE_CREDENTIALS }}

    - uses: azure/postgresql@v1
      with:
        server-name: POSTGRESQL_SERVER_NAME
        connection-string: ${{ secrets.AZURE_POSTGRESQL_CONNECTION_STRING }}
        plsql-file: './data.sql'

        # Azure logout
    - name: logout
      run: |
         az logout
    ```

    # [OpenID Connect](#tab/openid)

    ```yaml
   name: PostgreSQL for GitHub Actions

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]


    jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v1
        - uses: azure/login@v1
        with:
            client-id: ${{ secrets.AZURE_CLIENT_ID }}
            tenant-id: ${{ secrets.AZURE_TENANT_ID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

    - uses: azure/postgresql@v1
      with:
        server-name: POSTGRESQL_SERVER_NAME
        connection-string: ${{ secrets.AZURE_POSTGRESQL_CONNECTION_STRING }}
        plsql-file: './data.sql'

        # Azure logout
    - name: logout
      run: |
         az logout
    ```

    ---

## Review your deployment

1. Go to **Actions** for your GitHub repository.

1. Open the first result to see detailed logs of your workflow's run.

    :::image type="content" source="media/how-to-deploy-github-action/gitbub-action-postgres-success.png" alt-text="Log of GitHub Actions run" lightbox="media/how-to-deploy-github-action/gitbub-action-postgres-success.png":::

## Clean up resources

When your Azure PostgreSQL database and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure and GitHub integration](/azure/developer/github/)
<br/>
> [!div class="nextstepaction"]
> [Learn how to connect to the server](how-to-connect-query-guide.md)
