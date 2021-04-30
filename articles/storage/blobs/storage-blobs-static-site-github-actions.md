---
title: Use GitHub Actions to deploy a static site to Azure Storage
description: Azure Storage static website hosting with GitHub Actions
author: juliakm
ms.service: storage
ms.topic: how-to
ms.author: jukullam
ms.reviewer: dineshm
ms.date: 01/11/2021
ms.subservice: blobs
ms.custom: devx-track-javascript, github-actions-azure, devx-track-azurecli

---

# Set up a GitHub Actions workflow to deploy your static website in Azure Storage

Get started with [GitHub Actions](https://docs.github.com/en/actions) by using a workflow to deploy a static site to an Azure storage account. Once you have set up a GitHub Actions workflow, you will be able to automatically deploy your site to Azure from GitHub when you make changes to your site's code.

> [!NOTE]
> If you are using [Azure Static Web Apps](../../static-web-apps/index.yml), then you do not need to manually set up a GitHub Actions workflow.
> Azure Static Web Apps automatically creates a GitHub Actions workflow for you. 

## Prerequisites

An Azure subscription and GitHub account. 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub repository with your static website code. If you don't have a GitHub account, [sign up for free](https://github.com/join).  
- A working static website hosted in Azure Storage. Learn how to [host a static website in Azure Storage](storage-blob-static-website-how-to.md). To follow this example, you should also deploy [Azure CDN](static-website-content-delivery-network.md).

> [!NOTE]
> It's common to use a content delivery network (CDN) to reduce latency to your users around the globe and to reduce the number of transactions to your storage account. Deploying static content to a cloud-based storage service can reduce the need for potentially expensive compute instance. For more information, see [Static Content Hosting pattern](/azure/architecture/patterns/static-content-hosting).

## Generate deployment credentials

You can create a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

Replace the placeholder `myStaticSite` with the name of your site hosted in Azure Storage. 

```azurecli-interactive
   az ad sp create-for-rbac --name {myStaticSite} --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth
```

In the example above, replace the placeholders with your subscription ID and resource group name. The output is a JSON object with the role assignment credentials that provide access to your storage account similar to below. Copy this JSON object for later.

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

## Configure the GitHub secret

1. In [GitHub](https://github.com/), browse your repository.

1. Select **Settings > Secrets > New secret**.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret a name like `AZURE_CREDENTIALS`.

    When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

    ```yaml
    - uses: azure/login@v1
    with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

## Add your workflow

1. Go to **Actions** for your GitHub repository. 

    :::image type="content" source="media/storage-blob-static-website/storage-blob-github-actions-header.png" alt-text="GitHub actions menu item":::

1. Select **Set up your workflow yourself**. 

1. Delete everything after the `on:` section of your workflow file. For example, your remaining workflow may look like this. 

    ```yaml
    name: CI

    on:
        push:
            branches: [ master ]
        pull_request:
            branches: [ master ]
    ```

1. Rename your workflow `Blob storage website CI` and add the checkout and login actions. These actions will checkout your site code and authenticate with Azure using the `AZURE_CREDENTIALS` GitHub secret you created earlier. 

    ```yaml
    name: Blob storage website CI

    on:
        push:
            branches: [ master ]
        pull_request:
            branches: [ master ]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:            
        - uses: actions/checkout@v2
        - uses: azure/login@v1
          with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
    ```

1. Use the Azure CLI action to upload your code to blob storage and to purge your CDN endpoint. For `az storage blob upload-batch`, replace the placeholder with your storage account name. The script will upload to the `$web` container. For `az cdn endpoint purge`, replace the placeholders with your CDN profile name, CDN endpoint name, and resource group.

    ```yaml
        - name: Upload to blob storage
          uses: azure/CLI@v1
          with:
            azcliversion: 2.0.72
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME> -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            azcliversion: 2.0.72
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"
    ``` 

1. Complete your workflow by adding an action to logout of Azure. Here is the completed workflow. The file will appear in the `.github/workflows` folder of your repository.

    ```yaml
    name: Blob storage website CI

    on:
        push:
            branches: [ master ]
        pull_request:
            branches: [ master ]

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
            azcliversion: 2.0.72
            inlineScript: |
                az storage blob upload-batch --account-name <STORAGE_ACCOUNT_NAME> -d '$web' -s .
        - name: Purge CDN endpoint
          uses: azure/CLI@v1
          with:
            azcliversion: 2.0.72
            inlineScript: |
               az cdn endpoint purge --content-paths  "/*" --profile-name "CDN_PROFILE_NAME" --name "CDN_ENDPOINT" --resource-group "RESOURCE_GROUP"
      
      # Azure logout 
        - name: logout
          run: |
                az logout
    ```

## Review your deployment

1. Go to **Actions** for your GitHub repository. 

1. Open the first result to see detailed logs of your workflow's run. 
 
    :::image type="content" source="../media/index/github-actions-run.png" alt-text="Log of GitHub actions run":::

## Clean up resources

When your static website and GitHub repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Static Web Apps](../../static-web-apps/index.yml)
