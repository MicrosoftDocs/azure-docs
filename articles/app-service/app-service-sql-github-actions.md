---
title: 'Tutorial: Use GitHub Actions to deploy to App Service for Containers and connect to a database'
description: Learn how to deploy a C# ASP.NET app to Azure and to Azure SQL Database
ms.devlang: csharp
ms.topic: tutorial
ms.date: 04/22/2021
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

Install <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a> with the **ASP.NET and web development** workload.

If you've installed Visual Studio already, add the workloads in Visual Studio by clicking **Tools** > **Get Tools and Features**.

## Download the sample

1. [Download the sample project](https://github.com/Azure-Samples/dotnet-sqldb-tutorial/archive/master.zip).

1. Extract (unzip) the  *dotnet-sqldb-tutorial-master.zip* file.

The sample project contains a basic [ASP.NET MVC](https://www.asp.net/mvc) create-read-update-delete (CRUD) app using [Entity Framework Code First](/aspnet/mvc/overview/getting-started/getting-started-with-ef-using-mvc/creating-an-entity-framework-data-model-for-an-asp-net-mvc-application).
