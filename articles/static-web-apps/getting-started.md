---
title: "Quickstart: Building your first static web app with Azure Static Web Apps"
description: Learn to build an Azure Static Web Apps instance with your preferred front-end framework.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 05/08/2020
ms.author: cshoe
---

# Quickstart: Building your first static web app

Azure Static Web Apps publishes websites to a production environment by building apps from a GitHub repository. In this quickstart, you build a web application using your preferred front-end framework from a GitHub repository.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account

## Create a repository

This article uses GitHub template repositories to make it easy for you to create a new repository. The templates feature starter apps built with different front-end frameworks.

# [Angular](#tab/angular)

- Make sure you are logged in to GitHub and, navigate to the following location to create a new repository
  - https://github.com/staticwebdev/angular-basic/generate
- Name your repository **my-first-static-web-app**

# [React](#tab/react)

- Make sure you are logged in to GitHub and, navigate to the following location to create a new repository
  - https://github.com/staticwebdev/react-basic/generate
- Name your repository **my-first-static-web-app**

# [Vue](#tab/vue)

- Make sure you are logged in to GitHub and, navigate to the following location to create a new repository
  - https://github.com/staticwebdev/vue-basic/generate
- Name your repository **my-first-static-web-app**

# [No Framework](#tab/vanilla-javascript)

- Make sure you are logged in to GitHub and, navigate to the following location to create a new repository
  - https://github.com/staticwebdev/vanilla-basic/generate
- Name your repository **my-first-static-web-app**

> [!NOTE]
> Azure Static Web Apps requires at least one HTML file to create a web app. The repository you create in this step includes a single _index.html_ file.

---

Click the **Create repository from template** button.

:::image type="content" source="media/getting-started/create-template.png" alt-text="Create repository from template":::

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

- Navigate to the [Azure portal](https://portal.azure.com)
- Click **Create a Resource**
- Search for **Static Web Apps**
- Click **Static Web Apps (Preview)**
- Click **Create**

### Basics

Begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="media/getting-started/basics-tab.png" alt-text="Basics tab":::

- Select your _Azure subscription_
- Select or create a new _Resource Group_
- Name the app **my-first-static-web-app**.
  - Valid characters are `a-z` (case insensitive), `0-9`, and `-`.
- Select a _Region_ closest to you
- Select the **Free** _SKU_
- Click the **Sign-in with GitHub** button and authenticate with GitHub

Once you sign in with GitHub, then enter the repository information.

:::image type="content" source="media/getting-started/repository-details.png" alt-text="Repository details":::

- Select your preferred _Organization_
- Select **my-first-web-static-app** from the _Repository_ drop-down
- Select **master** from the _Branch_ drop-down
- Click the **Next: Build >** button to edit the build configuration

:::image type="content" source="media/getting-started/next-build-button.png" alt-text="Next Build button":::

### Build

Next, add configuration details specific to your preferred front-end framework.

# [Angular](#tab/angular)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **dist/angular-basic** in the _App artifact location_ box

# [React](#tab/react)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **build** in the _App artifact location_ box

# [Vue](#tab/vue)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Enter **dist** in the _App artifact location_ box

# [No Framework](#tab/vanilla-javascript)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Clear the default value from _App artifact location_ box

---

Click the **Review + create** button.

:::image type="content" source="media/getting-started/review-create.png" alt-text="Review create button":::

To change these values after you create the app, you can edit the [workflow file](github-actions-workflow.md).

### Review + create

After the request validates, you can continue to create the application.

Click the **Create** button

:::image type="content" source="media/getting-started/create-button.png" alt-text="Create button":::

Once the resource is created, click the **Go to resource** button

:::image type="content" source="media/getting-started/resource-button.png" alt-text="Go to resource button":::

## View the website

There are two aspects to deploying a static app. The first provisions the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

:::image type="content" source="media/getting-started/overview-window.png" alt-text="Overview window":::

1. Clicking on the banner that says, "Click here to check the status of your GitHub Actions runs" takes you to the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can navigate to your website via the generated URL.

2. Once GitHub Actions workflow is complete, you can click on the _URL_ link to open the website in new tab.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com)
1. Search for **my-first-web-static-app** from the top search bar
1. Click on the app name
1. Click on the **Delete** button
1. Click **Yes** to confirm the delete action

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
