---
title: 'Quickstart: Connect to Azure MySQL with GitHub Actions'
description: Use Azure MySQL from a GitHub Actions workflow
author: juliakm
ms.service: mysql
ms.topic: quickstart
ms.author: jukullam
ms.date: 10/12/2020
ms.custom: github-actions-azure

---

# Quickstart: Use GitHub Actions to connect to Azure MySQL

**APPLIES TO**: :::image type="icon" source="./media/applies-to/yes.png" border="false":::Azure Database for MySQL - Single Server :::image type="icon" source="./media/applies-to/yes.png" border="false":::Azure Database for MySQL - Flexible Server

Get started with [GitHub Actions](https://docs.github.com/en/actions) by using a workflow to deploy database updates to [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/).


## Prerequisites

You will need: 
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub repository with sample data (`data.sql`). If you don't have a GitHub account, [sign up for free](https://github.com/join).  
- An Azure Database for MySQL server.
    - [Quickstart: Create an Azure Database for MySQL server in the Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)

## Workflow file overview

A GitHub Actions workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has two sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Define a service principal. <br /> 2. Create a GitHub secret. |
|**Deploy** | 1. Deploy the database. |

## Generate deployment credentials

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac&preserve-view=true) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

Replace the placeholders `server-name` with the name of your MySQL server hosted on Azure. Replace the `subscription-id` and `resource-group` with the subscription ID and resource group connected to your MySQL server.  

```azurecli-interactive
   az ad sp create-for-rbac --name {server-name} --role contributor \
                            --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                            --sdk-auth
```

The output is a JSON object with the role assignment credentials that provide access to your database similar to below. Copy this output JSON object for later.

```output 
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

> [!IMPORTANT]
> It is always a good practice to grant minimum access. The scope in the previous example is limited to the specific server and not the entire resource group.

## Copy the MySQL connection string 

In the Azure portal, go to your Azure Database for MySQL server and open **Settings** > **Connection strings**. Copy the **ADO.NET** connection string. Replace the placeholder values for `your_database` and `your_password`. The connection string will look similar to this. 

> [!IMPORTANT]
> - For Single server use **Uid=adminusername@servername**. Note the **@servername** is required.
> - For Flexible server , use **Uid= adminusername** without the @servername. Note that MySQL Flexible server is in preview. 


```output
   Server=my-mysql-server.mysql.database.azure.com; Port=3306; Database={your_database}; Uid=adminname@my-mysql-server; Pwd={your_password}; SslMode=Preferred;
```
You will use the connection string as a GitHub secret. 

## Configure the GitHub secrets

1. In [GitHub](https://github.com/), browse your repository.

1. Select **Settings > Secrets > New secret**.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`.

    When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

    ```yaml
    - uses: azure/login@v1
        with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}
   ```

1. Select **New secret** again. 

1. Paste the connection string value into the secret's value field. Give the secret the name `AZURE_MYSQL_CONNECTION_STRING`.


## Add your workflow

1. Go to **Actions** for your GitHub repository. 

2. Select **Set up your workflow yourself**. 

2. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this. 

    ```yaml
    name: CI

    on:
    push:
        branches: [ master ]
    pull_request:
        branches: [ master ]
    ```

1. Rename your workflow `MySQL for GitHub Actions` and add the checkout and login actions. These actions will checkout your site code and authenticate with Azure using the `AZURE_CREDENTIALS` GitHub secret you created earlier. 

    ```yaml
    name: MySQL for GitHub Actions

    on:
        push:
            branches: [ master ]
        pull_request:
            branches: [ master ]

    jobs:
        build:
            runs-on: windows-latest
            steps:
            - uses: actions/checkout@v1
            - uses: azure/login@v1
                with:
                    creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

1. Use the Azure MySQL Deploy action to connect to your MySQL instance. Replace `MYSQL_SERVER_NAME` with the name of your server. You should have a MySQL data file named `data.sql` at the root level of your repository. 

    ```yaml
    - uses: azure/mysql@v1
      with:
        server-name: MYSQL_SERVER_NAME
        connection-string: ${{ secrets.AZURE_MYSQL_CONNECTION_STRING }}
        sql-file: './data.sql'
    ``` 

1. Complete your workflow by adding an action to logout of Azure. Here is the completed workflow. The file will appear in the `.github/workflows` folder of your repository.

    ```yaml
    name: MySQL for GitHub Actions

    on:
         push:
            branches: [ master ]
        pull_request:
            branches: [ master ]


     jobs:
        build:
            runs-on: windows-latest
            steps:
            - uses: actions/checkout@v1
            - uses: azure/login@v1
                with:
                    creds: ${{ secrets.AZURE_CREDENTIALS }}

            - uses: azure/mysql@v1
                with:
                    server-name: MYSQL_SERVER_NAME
                    connection-string: ${{ secrets.AZURE_MYSQL_CONNECTION_STRING }}
                    sql-file: './data.sql'

            # Azure logout 
            - name: logout
                run: |
                    az logout
    ```

## Review your deployment

1. Go to **Actions** for your GitHub repository. 

1. Open the first result to see detailed logs of your workflow's run. 
 
    :::image type="content" source="media/quickstart-mysql-github-actions/github-actions-run-mysql.png" alt-text="Log of GitHub actions run":::

## Clean up resources

When your Azure MySQL database and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure and GitHub integration](/azure/developer/github/)
