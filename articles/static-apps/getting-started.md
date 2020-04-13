---
title: "Quickstart: Building your first app with App Service Static Apps"
description: Learn to build an App Service Static App with your preferred front-end framework.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  quickstart
ms.date: 05/08/2020
ms.author: cshoe
---

# Quickstart: Building your first static app

App Service Static Apps publishes apps to a production environment by building web apps from a GitHub repository.

In this quickstart, you build a web application from a GitHub repository.

If you don't have a Azure subscription, [create a free trial account](https://azure.microsoft.com/en-us/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account

## Create a repository

To help make it easy for you to create a new repository, you can create a new repo from a GitHub template repository. Each template includes a simple application powered by your preferred front-end framework.

# [Angular](#tab/angular)

- Navigate to the following location to create a new repository
  - https://github.com/staticwebdev/angular-basic/generate
- Name your repository **my-first-static-app**
- Click the **Create repository from template** button

# [React](#tab/react)

- Navigate to the following location to create a new repository
  - https://github.com/staticwebdev/react-basic/generate
- Name your repository **my-first-static-app**
- Click the **Create repository from template** button

# [Svelte](#tab/svelte)

- Navigate to the following location to create a new repository
  - https://github.com/staticwebdev/svelte-basic/generate
- Name your repository **my-first-static-app**
- Click the **Create repository from template** button

# [Vanilla JavaScript](#tab/vanilla-javascript)

- Navigate to the following location to create a new repository
  - https://github.com/staticwebdev/vanilla-basic/generate
- Name your repository **my-first-static-app**
- Click the **Create repository from template** button

# [Vue](#tab/vue)

- Navigate to the following location to create a new repository
  - https://github.com/staticwebdev/vue-basic/generate
- Name your repository **my-first-static-app**
- Click the **Create repository from template** button

---

## Create a static app

Now that the repo is created, you can create a static app from the Azure portal.

- Navigate to the [Azure portal](https://portal.azure.com)
- In the top bar, search for **Static Apps**
- Click **Static Apps**

![placeholder](https://via.placeholder.com/500x200)

### Basics

Begin by configuring your new app and linking it to a GitHub repository.

- Select your _Azure subscription_
- Select or create a new _Resource Group_
- Name the app **my-first-static-app**.
  - Valid characters are `a-z` (case insensitive), `0-9`, and `_`.
- Select _Region_ closest to you
- Select the **Free** _SKU_
- Click the **Sign-in with GitHub** button and authenticate with GitHub
- Select your preferred _Organization_
- Select **my-first-static-app** from the _Repository_ drop-down
- Select **master** from the _Branch_ drop down
- Click the **Next: Build >** button to edit the build configuration

### Build

Next, add configuration details specific to your preferred front-end framework.

# [Angular](#tab/angular)

- Enter **src** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **dist** in the _App artifact location_ box
- Click the **Review + create** button

# [React](#tab/react)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **build** in the _App artifact location_ box
- Click the **Review + create** button

# [Svelte](#tab/svelte)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **public** in the _App artifact location_ box
- Click the **Review + create** button

# [Vanilla JavaScript](#tab/vanilla-javascript)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Clear the default value from _App artifact location_ box
- Click the **Review + create** button

# [Vue](#tab/vue)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **dist** in the _App artifact location_ box
- Click the **Review + create** button

---

### Review + create

After the build validates, you can proceed to create the application.

- Click the **Create** button
- Once the deployment is complete, click the **Go to resource** button

## View website

There are two automated aspects to deploying a static app. The first provisions the underlying Azure resources and services that make up your app. The second is a GitHub build process that builds your application and makes it publicly available.

> [!NOTE]
> You can ensure that the GitHub build process is complete by checking the status of your commits available at `https://github.com/<YOUR_GITHUB_USERNAME>/my-first-static-app/actions`.

Once the provisioning and deployment is complete, you can click on the _URL_ link in the Azure portal to launch your app in the browser.

## Clean up resources

If you're not going to continue to use this application, you can delete the static app through the following steps:

1. Open the Azure portal
1. Search for **my-first-static-app**
1. Click on the **Delete** button
1. Click **Yes** to confirm the delete action

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
