---
title: Deploy to Azure Storage with GitHub Actions
description: Azure Storage static website hosting, providing a cost-effective, scalable solution for hosting modern web applications.
author: juliakm
ms.service: storage
ms.topic: how-to
ms.author: jukullam
ms.reviewer: dineshm
ms.date: 09/11/2020
ms.subservice: blobs
ms.custom: devx-track-javascript, github-actions-azure

---

# Set up a GitHub Action to deploy your static website in Azure Storage

You can deploy a static site to an Azure Storage blog using [GitHub Actions](https://docs.github.com/en/actions). Once you have set up a GitHub Actions workflow, you will be able to automatically deploy your site to Azure from GitHub when you make changes to your site's code. 

> [!NOTE]
> If you are using [App Service Web Apps](https://docs.microsoft.com/azure/static-web-apps/), then you do not need to manually set up a GitHub Actions workflow.
> Azure Static Web Apps automatically creates a GitHub workflow for you. 

## Prerequisites

An Azure subscription and GitHub account. 

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A working static website hosted in Azure Storage. Learn how to [host a static website in Azure Storage](storage-blob-static-website-how-to.md).
- A GitHub repository with your static website code. 

## Generate deployment credentials

You can create a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) with the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac&preserve-view=true) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

```azurecli-interactive
   az ad sp create-for-rbac --name "myStorageApp" --role contributor \
                            --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                            --sdk-auth
```

In the example above, replace the placeholders with your subscription ID and resource group name. The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to below. Copy this JSON object for later.

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

In [GitHub](https://github.com/), browse your repository, select **Settings > Secrets > Add a new secret**.

To use [user-level credentials](#generate-deployment-credentials), paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name like `AZURE_CREDENTIALS`.

When you configure the workflow file later, you use the secret for the input `creds` of the Azure Login action. For example:

```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

## Add your workflow

1. Go to **Actions**. 

    :::image type="content" source="media/storage-blob-static-website/storage-blob-github-actions-header.png" alt-text="GitHub actions menu item":::

1. Select _Set up your workflow yourself_. 

1. Delete everything after `branches: [ master ]`. Your remaining workflow should look like this. 

    ```yml
    name: CI

    on:
    push:
        branches: [ master ]
    pull_request:
        branches: [ master ]
    ```

1. Add the checkout action. 

    ```yml
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
    ```