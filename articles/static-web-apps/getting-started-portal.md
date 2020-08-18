---
title: "Quickstart: Building your first static web app with Azure Static Web Apps using the Azure portal"
description: Learn to build an Azure Static Web Apps instance with the Azure portal.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 08/13/2020
ms.author: cshoe
---

# Quickstart: Building your first static web app in the Azure portal

Azure Static Web Apps publishes websites to a production environment by building apps from a GitHub repository. In this quickstart, you build a web application using your preferred front-end framework.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account

[!INCLUDE [create repository from template](../../includes/static-web-apps-getting-started-create-repo.md)]

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

- Navigate to the [Azure portal](https://portal.azure.com)
- Select **Create a Resource**
- Search for **Static Web Apps**
- Select **Static Web Apps (Preview)**
- Select **Create**

### Basics

Begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="media/getting-started-portal/basics-tab.png" alt-text="Basics tab":::

- Select your _Azure subscription_
- Select or create a new _Resource Group_
- Name the app **my-first-static-web-app**.
  - Valid characters are `a-z` (case insensitive), `0-9`, and `-`.
- Select a _Region_ closest to you
- Select the **Free** _SKU_
- Select the **Sign-in with GitHub** button and authenticate with GitHub

Once you sign in with GitHub, then enter the repository information.

:::image type="content" source="media/getting-started-portal/repository-details.png" alt-text="Repository details":::

- Select your preferred _Organization_
- Select **my-first-web-static-app** from the _Repository_ drop-down
- Select **master** from the _Branch_ drop-down
- Select the **Next: Build >** button to edit the build configuration

:::image type="content" source="media/getting-started-portal/next-build-button.png" alt-text="Next Build button":::

> [!NOTE]
>  If you don't see any repositories, you may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

### Build

Next, add configuration details specific to your preferred front-end framework.

# [No Framework](#tab/vanilla-javascript)

- Enter **/** in the _App location_ box
- Clear the default value from the _Api location_ box
- Clear the default value from _App artifact location_ box

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

---

Select the **Review + create** button.

:::image type="content" source="media/getting-started-portal/review-create.png" alt-text="Review create button":::

To change these values after you create the app, you can edit the [workflow file](github-actions-workflow.md).

### Review + create

After the request validates, you can continue to create the application.

Select the **Create** button

:::image type="content" source="media/getting-started-portal/create-button.png" alt-text="Create button":::

Once the resource is created, select the **Go to resource** button

:::image type="content" source="media/getting-started-portal/resource-button.png" alt-text="Go to resource button":::

[!INCLUDE [view website](../../includes/static-web-apps-getting-started-view-website.md)]

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com)
1. Search for **my-first-web-static-app** from the top search bar
1. Select on the app name
1. Select on the **Delete** button
1. Select **Yes** to confirm the delete action

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
