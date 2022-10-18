---
title: Use GitHub Actions to deploy a static site to Azure Storage
description: Azure Storage static website hosting with GitHub Actions
author: juliakm
ms.service: storage
ms.topic: how-to
ms.author: jukullam
ms.reviewer: dineshm
ms.date: 01/24/2022
ms.subservice: blobs
ms.custom: devx-track-javascript, github-actions-azure, devx-track-azurecli

---

# Use GitHub Actions workflow to deploy your static website in Azure Storage

Get started with [GitHub Actions](https://docs.github.com/en/actions) by using a workflow to deploy a static site to an Azure storage account. Once you have set up a GitHub Actions workflow, you will be able to automatically deploy your site to Azure from GitHub when you make changes to your site's code.

> [!NOTE]
> If you are using [Azure Static Web Apps](../../static-web-apps/index.yml), then you do not need to manually set up a GitHub Actions workflow.
> Azure Static Web Apps automatically creates a GitHub Actions workflow for you.

## Prerequisites

An Azure subscription and GitHub account.

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub repository with your static website code. If you do not have a GitHub account, [sign up for free](https://github.com/join).
- A working static website hosted in Azure Storage. Learn how to [host a static website in Azure Storage](storage-blob-static-website-how-to.md). To follow this example, you should also deploy [Azure CDN](static-website-content-delivery-network.md).

> [!NOTE]
> It's common to use a content delivery network (CDN) to reduce latency to your users around the globe and to reduce the number of transactions to your storage account. Deploying static content to a cloud-based storage service can reduce the need for potentially expensive compute instance. For more information, see [Static Content Hosting pattern](/azure/architecture/patterns/static-content-hosting).

## Generate deployment credentials


# [Service principal](#tab/userlevel)

You can create a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

Replace the placeholder `myStaticSite` with the name of your site hosted in Azure Storage.

```azurecli-interactive
   az ad sp create-for-rbac --name {myStaticSite} --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth
```

In the example, replace the placeholders with your subscription ID and resource group name. The output is a JSON object with the role assignment credentials that provide access to your storage account. Copy this JSON object for later.

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
> It is always a good practice to grant minimum access. The scope in the previous example is limited to the specific App Service app and not the entire resource group.

# [OpenID Connect](#tab/openid)

OpenID Connect is an authentication method that uses short-lived tokens. Setting up [OpenID Connect with GitHub Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) is more complex process that offers hardened security. 

1.  If you do not have an existing application, register a [new Active Directory application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md). Create the Active Directory application. 

    ```azurecli-interactive
    az ad app create --display-name myApp
    ```

    This command will output JSON with an `appId` that is your `client-id`. Save the value to use as the `AZURE_CLIENT_ID` GitHub secret later. 

    You will use the `objectId` value when creating federated credentials with Graph API and reference it as the `APPLICATION-OBJECT-ID`.

1. Create a service principal. Replace the `$appID` with the appId from your JSON output. 

    This command generates JSON output with a different `objectId` and will be used in the next step. The new  `objectId` is the `assignee-object-id`. 
    
    Copy the `appOwnerTenantId` to use as a GitHub secret for `AZURE_TENANT_ID` later. 

    ```azurecli-interactive
     az ad sp create --id $appId
    ```

1. Create a new role assignment by subscription and object. By default, the role assignment will be tied to your default subscription. Replace `$subscriptionId` with your subscription ID, `$resourceGroupName` with your resource group name, and `$assigneeObjectId` with the generated `assignee-object-id`. Learn [how to manage Azure subscriptions with the Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli). 

    ```azurecli-interactive
    az role assignment create --role contributor --scope /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName --subscription $subscriptionId --assignee-object-id  $assigneeObjectId --assignee-principal-type ServicePrincipal
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

## Configure the GitHub secret

# [Service principal](#tab/userlevel)

1. In [GitHub](https://github.com/), browse your repository.

1. Select **Settings > Secrets > New secret**.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret a name like `AZURE_CREDENTIALS`.

    When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

    ```yaml
    - uses: azure/login@v1
    with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

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

# [Service principal](#tab/userlevel)


1. Go to **Actions** for your GitHub repository.

    :::image type="content" source="media/storage-blob-static-website/storage-blob-github-actions-header.png" alt-text="GitHub Actions menu item":::

1. Select **Set up your workflow yourself**.

1. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this.

    ```yaml
    name: CI

    on:
        push:
            branches: [ main ]
    ```

1. Rename your workflow `Blob storage website CI` and add the checkout and login actions. These actions will check out your site code and authenticate with Azure using the `AZURE_CREDENTIALS` GitHub secret you created earlier.

    ```yaml
    name: Blob storage website CI

    on:
        push:
            branches: [ main ]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: azure/login@v1
          with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

1. Use the Azure CLI action to upload your code to blob storage and to purge your CDN endpoint. For `az storage blob upload-batch`, replace the placeholder with your storage account name. The script will upload to the `$web` container. For `az cdn endpoint purge`, replace the placeholders with your CDN profile name, CDN endpoint name, and resource group. To speed up your CDN purge, you can add the `--no-wait` option to `az cdn endpoint purge`. To enhance security, you can also add the `--account-key` option with your [storage account key](../common/storage-account-keys-manage.md).

    ```yaml
        - name: Upload to blob storage
          uses: azure/CLI@v1
          with:
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME>  --auth-mode key -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"
    ```

1. Complete your workflow by adding an action to logout of Azure. Here is the completed workflow. The file will appear in the `.github/workflows` folder of your repository.

    ```yaml
    name: Blob storage website CI

    on:
        push:
            branches: [ main ]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: azure/login@v1
          with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}

        - name: Upload to blob storage
          uses: azure/CLI@v1
          with:
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME> --auth-mode key -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"

      # Azure logout
        - name: logout
          run: |
                az logout
          if: always()
    ```

# [OpenID Connect](#tab/openid)

1. Go to **Actions** for your GitHub repository.

    :::image type="content" source="media/storage-blob-static-website/storage-blob-github-actions-header.png" alt-text="GitHub Actions menu item":::

1. Select **Set up your workflow yourself**.

1. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this.

    ```yaml
    name: CI with OpenID Connect

    on:
        push:
            branches: [ main ]
    ```

1. Add a permissions section. 


    ```yaml
    name: CI with OpenID Connect

    on:
        push:
            branches: [ main ]

    permissions:
          id-token: write
          contents: read
    ```

1. Add checkout and login actions. These actions will check out your site code and authenticate with Azure using the GitHub secrets you created earlier.

    ```yaml
    name: CI with OpenID Connect

    on:
        push:
            branches: [ main ]

    permissions:
          id-token: write
          contents: read

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: azure/login@v1
          with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    ```

1. Use the Azure CLI action to upload your code to blob storage and to purge your CDN endpoint. For `az storage blob upload-batch`, replace the placeholder with your storage account name. The script will upload to the `$web` container. For `az cdn endpoint purge`, replace the placeholders with your CDN profile name, CDN endpoint name, and resource group. To speed up your CDN purge, you can add the `--no-wait` option to `az cdn endpoint purge`. To enhance security, you can also add the `--account-key` option with your [storage account key](../common/storage-account-keys-manage.md).

    ```yaml
        - name: Upload to blob storage
          uses: azure/CLI@v1
          with:
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME>  --auth-mode key -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"
    ```

1. Complete your workflow by adding an action to logout of Azure. Here is the completed workflow. The file will appear in the `.github/workflows` folder of your repository.

    ```yaml
    name: CI with OpenID Connect

    on:
        push:
            branches: [ main ]

    permissions:
          id-token: write
          contents: read

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: azure/login@v1
          with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

        - name: Upload to blob storage
          uses: azure/CLI@v1
          with:
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME> --auth-mode key -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"

      # Azure logout
        - name: logout
          run: |
                az logout
          if: always()
    ```
---

## Review your deployment

1. Go to **Actions** for your GitHub repository.

1. Open the first result to see detailed logs of your workflow's run.

    :::image type="content" source="../media/index/github-actions-run.png" alt-text="Log of GitHub Actions run":::

## Clean up resources

When your static website and GitHub repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Static Web Apps](../../static-web-apps/index.yml)
