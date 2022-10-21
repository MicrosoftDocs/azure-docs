---
title: 'Quickstart: Connect to Azure MySQL with GitHub Actions'
description: Use Azure MySQL from a GitHub Actions workflow
author: juliakm
ms.service: mysql
ms.subservice: single-server
ms.topic: quickstart
ms.author: jukullam
ms.custom: github-actions-azure, mode-other
ms.date: 06/20/2022
---

# Quickstart: Use GitHub Actions to connect to Azure MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Get started with [GitHub Actions](https://docs.github.com/en/actions) by using a workflow to deploy database updates to [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/).

## Prerequisites

You'll need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have a GitHub account, [sign up for free](https://github.com/join).
- A GitHub repository with sample data (`data.sql`).

    > [!IMPORTANT]
    > This quickstart assumes that you have cloned a GitHub repository to your computer so that you can add the associated IP address to a firewall rule, if necessary.

- An Azure Database for MySQL server.
  - [Quickstart: Create an Azure Database for MySQL server in the Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)

## Workflow file overview

A GitHub Actions workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has two sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Generate deployment credentials. |
|**Deploy** | 1. Deploy the database. |

## Generate deployment credentials
# [Service principal](#tab/userlevel)

You can create a [service principal](../../active-directory/develop/app-objects-and-service-principals.md) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac&preserve-view=true) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

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
> It's always a good practice to grant minimum access. The scope in the previous example is limited to the specific server and not the entire resource group.

# [OpenID Connect](#tab/openid)

OpenID Connect is an authentication method that uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is more complex process that offers hardened security. 

1.  If you do not have an existing application, register a [new Active Directory application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You'll use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. 

    This command generates JSON output with a different `objectId` and will be used in the next step. The new  `objectId` is the `assignee-object-id`. 
    
    Copy the `appOwnerTenantId` to use as a GitHub secret for `AZURE_TENANT_ID` later. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with the generated `assignee-object-id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli). 

    ```azurecli-interactive
    az role assignment create --role contributor --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --assignee-principal-type ServicePrincipal --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/
    ```

1. Run the following command to [create a new federated identity credential](/graph/api/application-post-federatedidentitycredentials?view=graph-rest-beta&preserve-view=true) for your active directory application.

    * Replace `APPLICATION-OBJECT-ID` with the **objectId (generated while creating app)** for your Active Directory application.
    * Set a value for `CREDENTIAL-NAME` to reference later.
    * Set the `subject`. The value of this is defined by GitHub depending on your workflow:
      * Jobs in your GitHub Actions environment: `repo:< Organization/Repository >:environment:< Name >`
      * For Jobs not tied to an environment, include the ref path for branch/tag based on the ref path used for triggering the workflow: `repo:< Organization/Repository >:ref:< ref path>`.  For example, `repo:n-username/ node_express:ref:refs/heads/my-branch` or `repo:n-username/ node_express:ref:refs/tags/my-tag`.
      * For workflows triggered by a pull request event: `repo:< Organization/Repository >:pull_request`.
    
    ```azurecli
    az rest --method POST --uri 'https://graph.microsoft.com/beta/applications/<APPLICATION-OBJECT-ID>/federatedIdentityCredentials' --body '{"name":"<CREDENTIAL-NAME>","issuer":"https://token.actions.githubusercontent.com","subject":"repo:organization/repository:ref:refs/heads/main","description":"Testing","audiences":["api://AzureADTokenExchange"]}' 
    ```
    
    To learn how to create a Create an active directory application, service principal, and federated credentials in Azure portal, see [Connect GitHub and Azure](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).
    
---

## Copy the MySQL connection string

In the Azure portal, go to your Azure Database for MySQL server and open **Settings** > **Connection strings**. Copy the **ADO.NET** connection string. Replace the placeholder values for `your_database` and `your_password`. The connection string will look similar to the following.

> [!IMPORTANT]
>
> - For Single server use **Uid=adminusername@servername**. Note the **@servername** is required.
> - For Flexible server , use **Uid= adminusername** without the @servername.

```output
   Server=my-mysql-server.mysql.database.azure.com; Port=3306; Database={your_database}; Uid=adminname@my-mysql-server; Pwd={your_password}; SslMode=Preferred;
```

You'll use the connection string as a GitHub secret.

## Configure GitHub secrets
# [Service principal](#tab/userlevel)

1. In [GitHub](https://github.com/), browse your repository.

2. Select **Settings > Secrets > New secret**.

3. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`.

    When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

    ```yaml
    - uses: azure/login@v1
        with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}
   ```

4. Select **New secret** again.

5. Paste the connection string value into the secret's value field. Give the secret the name `AZURE_MYSQL_CONNECTION_STRING`.

# [OpenID Connect](#tab/openid)

You need to provide your application's **Client ID**, **Tenant ID**, and **Subscription ID** to the login action. These values can either be provided directly in the workflow or can be stored in GitHub secrets and referenced in your workflow. Saving the values as GitHub secrets is the more secure option.

1. Open your GitHub repository and go to **Settings**.

1. Select **Settings > Secrets > New secret**.

1. Create secrets for `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`. Use these values from your Active Directory application for your GitHub secrets:

    |GitHub Secret  | Active Directory Application  |
    |---------|---------|
    |AZURE_CLIENT_ID     |      Application (client) ID   |
    |AZURE_TENANT_ID     |     Directory (tenant) ID    |
    |AZURE_SUBSCRIPTION_ID     |     Subscription ID    |

1. Save each secret by selecting **Add secret**.

---

## Add your workflow

1. Go to **Actions** for your GitHub repository.

2. Select **Set up your workflow yourself**.

3. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this.

    ```yaml
    name: CI

    on:
    push:
        branches: [ main ]
    pull_request:
        branches: [ main ]
    ```

4. Rename your workflow `MySQL for GitHub Actions` and add the checkout and login actions. These actions will check out your site code and authenticate with Azure using the `AZURE_CREDENTIALS` GitHub secret you created earlier.

    # [Service principal](#tab/userlevel)
    
    ```yaml
    name: MySQL for GitHub Actions
    
    on:
        push:
            branches: [ main ]
        pull_request:
            branches: [ main ]
    
    jobs:
        build:
            runs-on: windows-latest
            steps:
            - uses: actions/checkout@v1
            - uses: azure/login@v1
                with:
                    creds: ${{ secrets.AZURE_CREDENTIALS }}
      ```
    
    # [OpenID Connect](#tab/openid)
    
    ```yaml
    name: MySQL for GitHub Actions
    
    on:
        push:
            branches: [ main ]
        pull_request:
            branches: [ main ]
    
    jobs:
        build:
            runs-on: windows-latest
            steps:
            - uses: actions/checkout@v1
            - uses: azure/login@v1
                with:
                  client-id: ${{ secrets.AZURE_CLIENT_ID }}
                  tenant-id: ${{ secrets.AZURE_TENANT_ID }}
                  subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    ```
    
    ___

5. Use the Azure MySQL Deploy action to connect to your MySQL instance. Replace `MYSQL_SERVER_NAME` with the name of your server. You should have a MySQL data file named `data.sql` at the root level of your repository.

    ```yaml
    - uses: azure/mysql@v1
      with:
        server-name: MYSQL_SERVER_NAME
        connection-string: ${{ secrets.AZURE_MYSQL_CONNECTION_STRING }}
        sql-file: './data.sql'
    ```

6. Complete your workflow by adding an action to sign out of Azure. Here's the completed workflow. The file will appear in the `.github/workflows` folder of your repository.

    # [Service principal](#tab/userlevel)
    
    ```yaml
    name: MySQL for GitHub Actions
    
    on:
      push:
          branches: [ main ]
      pull_request:
          branches: [ main ]
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
    # [OpenID Connect](#tab/openid)
    
    ```yaml
    name: MySQL for GitHub Actions
  
    on:
      push:
          branches: [ main ]
      pull_request:
          branches: [ main ]
    jobs:
        build:
            runs-on: windows-latest
            steps:
              - uses: actions/checkout@v1
              - uses: azure/login@v1
                with:
                  client-id: ${{ secrets.AZURE_CLIENT_ID }}
                  tenant-id: ${{ secrets.AZURE_TENANT_ID }}
                  subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
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
    ___

## Review your deployment

1. Go to **Actions** for your GitHub repository.

2. Open the first result to see detailed logs of your workflow's run.

    :::image type="content" source="media/quickstart-mysql-github-actions/github-actions-run-mysql.png" alt-text="Log of GitHub Actions run":::

## Clean up resources

When your Azure MySQL database and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure and GitHub integration](/azure/developer/github/)
