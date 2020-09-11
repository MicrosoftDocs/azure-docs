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

## Sign in to GitHub and add your secret

1. Sign in to GitHub and open your GitHub repository. 

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

1. Search the Marketplace for `Azure Static Website Deploy`. You can view the action here.  