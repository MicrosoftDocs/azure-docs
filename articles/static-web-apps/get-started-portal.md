---
title: 'Quickstart: Building your first static web app with Azure Static Web Apps using the Azure portal'
description: Learn to deploy a static site to Azure Static Web Apps with the Azure portal.
services: static-web-apps
author: craigshoemaker
ms.author: cshoe
ms.date: 05/07/2021
ms.topic: quickstart
ms.service: static-web-apps
ms.custom:
  - mode-portal
---

# Quickstart: Building your first static site in the Azure portal

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository. In this quickstart, you deploy a web application to Azure Static Web apps using the Azure portal.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="media/getting-started-portal/quickstart-portal-basics.png" alt-text="Basics section":::

1. Select your _Azure subscription_.
1. Next to _Resource Group_, select the **Create new** link.
1. Enter **static-web-apps-test** in the textbox.
1. Under to _Static Web App details_, enter **my-first-static-web-app** in the textbox.
1. Under _Azure Functions and staging details_, select a region closest to you.
1. Under _Deployment details_, select **GitHub**.
1. Select the **Sign-in with GitHub** button and authenticate with GitHub.

After you sign in with GitHub, enter the repository information.

:::image type="content" source="media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Repository details":::

1. Select your preferred _Organization_ name.
1. Select **my-first-web-static-app** from the _Repository_ drop-down.
1. Select **main** from the _Branch_ drop-down.

   > [!NOTE]
   > If you don't see any repositories, you may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

1. In the _Build Details_ section, add configuration details specific to your preferred front-end framework.

    # [No Framework](#tab/vanilla-javascript)

    1. Select **Custom** from the _Build Presets_ dropdown.
    1. Keep the default value in the _App location_ box.
    1. Leave the _Api location_ box empty.
    1. Leave the _App artifact location_ box empty.

    # [Angular](#tab/angular)

    1. Select **Angular** from the _Build Presets_ dropdown.
    1. Keep the default value in the _App location_ box.
    1. Leave the _Api location_ box empty.
    1. Type **dist/angular-basic** in the _App artifact location_ box.

    # [React](#tab/react)

    1. Select **React** from the _Build Presets_ dropdown.
    1. Keep the default value in the _App location_ box.
    1. Leave the _Api location_ box empty.
    1. Type **build** in the _App artifact location_ box.

    # [Vue](#tab/vue)

    1. Select **Vue.js** from the _Build Presets_ dropdown.
    1. Keep the default value in the _App location_ box.
    1. Leave the _Api location_ box empty.
    1. Keep the default value in the _App artifact location_ box.

    ---

1. Select **Review + create**.

    :::image type="content" source="media/getting-started-portal/review-create.png" alt-text="Review create button":::

    > [!NOTE]
    > You can edit the [workflow file](github-actions-workflow.md) to change these values after you create the app.

1. Select **Create**.

    :::image type="content" source="media/getting-started-portal/create-button.png" alt-text="Create button":::

1. Select **Go to resource**.

    :::image type="content" source="media/getting-started-portal/resource-button.png" alt-text="Go to resource button":::

[!INCLUDE [view website](../../includes/static-web-apps-get-started-view-website.md)]

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-first-web-static-app** from the top search bar.
1. Select the app name.
1. Select the **Delete** button.
1. Select **Yes** to confirm the delete action (this action may take a few moments to complete).

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
