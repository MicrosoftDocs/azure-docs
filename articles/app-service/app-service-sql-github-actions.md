---
title: 'Tutorial: Use GitHub Actions to deploy to App Service for Containers and connect to a database'
description: Learn how to deploy an ASP.NET core app to Azure and to Azure SQL Database with GitHub Actions
ms.devlang: csharp
ms.topic: tutorial
ms.date: 04/22/2021
ms.author: juliakm
ms.custom: github-actions-azure
---

# Tutorial: Use GitHub Actions to deploy to App Service and connected to a database 

This tutorial walks you through setting up a GitHub Actions workflow to deploy an ASP.NET Core application with an [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md). When you're finished, you have an ASP.NET app running in Azure and connected to SQL Database.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Use a GitHub Actions workflow to add resources to Azure
> * Use a GitHub Actions workflow to build a container with the latest web app changes

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial:


- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
    - A GitHub repository to store your Resource Manager templates and your workflow files. To create one, see [Creating a new repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).


## Download the sample

1. [Download the sample project](https://github.com/Azure-Samples/dotnetcore-containerized-sqldb-ghactions/archive/refs/heads/main.zip).

1. Extract (unzip) the  *dotnetcore-containerized-sqldb-ghactions.zip* file.

[!INCLUDE [deployment credentials](includes/github-actions-deployment-creds.md)]

## Add resources

