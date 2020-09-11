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

You can deploy a static site to an Azure Storage blog using [GitHub Actions](https://docs.github.com/en/actions). 

> [!NOTE]
> If you are using [App Service Web Apps](https://docs.microsoft.com/azure/static-web-apps/), then you do not need to manually set up a GitHub Actions workflow.
> Azure Static Web Apps automatically creates a GitHub workflow for you. 

