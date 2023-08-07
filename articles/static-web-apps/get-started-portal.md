---
title: 'Quickstart: Build your first static web app'
description: Learn to deploy a static site to Azure Static Web Apps with the Azure portal.
services: static-web-apps
author: craigshoemaker
ms.author: cshoe
ms.date: 09/19/2022
ms.topic: quickstart
ms.service: static-web-apps
zone_pivot_groups: devops-or-github
---

# Quickstart: Build your first static web app

Azure Static Web Apps publishes a website to a production environment by building apps from an Azure DevOps or GitHub repository. In this quickstart, you deploy a web application to Azure Static Web apps using the Azure portal.

## Prerequisites

::: zone pivot="github"
- If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).
- [GitHub](https://github.com) account
::: zone-end

::: zone pivot="azure-devops"
- If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).
- [Azure DevOps](https://azure.microsoft.com/services/devops) organization
::: zone-end

::: zone pivot="github"

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

::: zone-end

::: zone pivot="azure-devops"

## Create a repository

This article uses an Azure DevOps repository to make it easy for you to get started. The repository features a starter app used to deploy using Azure Static Web Apps.

1. Sign in to Azure DevOps.
2. Select **New repository**.
3. In the *Create new project* window, expand **Advanced** menu and make the following selections:

    | Setting | Value |
    |--|--|
    | Project | Enter **my-first-web-static-app**. |
    | Visibility | Select **Private**. |
    | Version control | Select **Git**.  |
    | Work item process | Select the option that best suits your development methods. |

4. Select **Create**.
5. Select the **Repos** menu item.
6. Select the **Files** menu item.
7. Under the *Import repository* card, select **Import**.
8. Copy a repository URL for the framework of your choice, and paste it into the *Clone URL* box.

    # [No Framework](#tab/vanilla-javascript)
    
    [https://github.com/staticwebdev/vanilla-basic.git](https://github.com/staticwebdev/vanilla-basic.git)
    
    # [Angular](#tab/angular)
    
    [https://github.com/staticwebdev/angular-basic.git](https://github.com/staticwebdev/angular-basic.git)
    
    # [Blazor](#tab/blazor)
    
    [https://github.com/staticwebdev/blazor-basic.git](https://github.com/staticwebdev/blazor-basic.git)
    
    # [React](#tab/react)
    
    [https://github.com/staticwebdev/react-basic.git](https://github.com/staticwebdev/react-basic.git)
    
    # [Vue](#tab/vue)
    
    [https://github.com/staticwebdev/vue-basic.git](https://github.com/staticwebdev/vue-basic.git)
    
    ---

9. Select **Import** and wait for the import process to complete.

::: zone-end

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.

::: zone pivot="github"

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="media/getting-started-portal/quickstart-portal-basics.png" alt-text="Basics section":::

| Setting | Value |
|--|--|
| Subscription | Select your Azure subscription. |
| Resource Group | Select the **Create new** link, and enter **static-web-apps-test** in the textbox. |
| Name | Enter **my-first-static-web-app** in the textbox. |
| Plan type | Select **Free**. |
| Azure Functions and staging details | Select a region closest to you. |
| Source | Select **GitHub**. |

Select **Sign-in with GitHub** and authenticate with GitHub.

After you sign in with GitHub, enter the repository information.

| Setting | Value |
|--|--|
| Organization | Select your organization. |
| Repository| Select **my-first-web-static-app**. |
| Branch | Select **<branch_name>**. |

:::image type="content" source="media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Repository details":::

> [!NOTE]
> If you don't see any repositories:
> - You may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**.
> - You may need to authorize Azure Static Web Apps in your Azure DevOps organization. You must be an owner of the organization to grant the permissions. Request third-party application access via OAuth. For more information, see [Authorize access to REST APIs with OAuth 2.0](/azure/devops/integrate/get-started/authentication/oauth).

::: zone-end

::: zone pivot="azure-devops"

In the _Basics_ section, begin by configuring your new app and linking it to an Azure DevOps repository.

| Setting | Value |
|--|--|
| Subscription | Select your Azure subscription. |
| Resource Group | Select the **Create new** link, and enter **static-web-apps-test** in the textbox. |
| Name | Enter **my-first-static-web-app** in the textbox. |
| Plan type | Select **Free**. |
| Azure Functions and staging details | Select a region closest to you. |
| Source | Select **DevOps**. |
| Organization | Select your organization. |
| Project | Select your project. |
| Repository| Select **my-first-web-static-app**. |
| Branch | Select **<branch_name>**. |

> [!NOTE]
> Make sure the branch you are using is not protected, and that you have sufficient permissions to issue a `push` command. To verify, browse to your DevOps repository and go to **Repos** -> **Branches** and select **More options**. Next, select your branch, and then **Branch policies** to ensure required policies aren't enabled.

::: zone-end

In the _Build Details_ section, add configuration details specific to your preferred front-end framework.

# [No Framework](#tab/vanilla-javascript)

1. Select **Custom** from the _Build Presets_ dropdown.
1. Type **./src** in the _App location_ box.
1. Leave the _Api location_ box empty.
1. Type **./src** _App artifact location_ box.

# [Angular](#tab/angular)

1. Select **Angular** from the _Build Presets_ dropdown.
1. Keep the default value in the _App location_ box.
1. Leave the _Api location_ box empty.
1. Type **dist/angular-basic** in the _App artifact location_ box.

# [Blazor](#tab/blazor)

1. Select **Blazor** from the _Build Presets_ dropdown.
1. Keep the default value of **Client** in the _App location_ box.
1. Leave the _Api location_ box empty.
1. Keep the default value of **wwwroot** in the _App artifact location_ box.

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

Select **Review + create**.

:::image type="content" source="media/getting-started-portal/review-create.png" alt-text="Review and create your Azure Static Web Apps instance.":::

::: zone pivot="github"

> [!NOTE]
> You can edit the [workflow file](build-configuration.md) to change these values after you create the app.

::: zone-end

Select **Create**.

:::image type="content" source="media/getting-started-portal/create-button.png" alt-text="Create your Azure Static Web Apps instance.":::

Select **Go to resource**.

:::image type="content" source="media/getting-started-portal/resource-button.png" alt-text="Proceed to go to the newly created resource.":::

## View the website

There are two aspects to deploying a static app. The first creates the underlying Azure resources that make up your app. The second is a workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

The Static Web Apps *Overview* window displays a series of links that help you interact with your web app.

::: zone pivot="github"

:::image type="content" source="./media/getting-started/overview-window.png" alt-text="The Azure Static Web Apps overview window.":::

1. Selecting on the banner that says, _Select here to check the status of your GitHub Actions runs_ takes you to the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can go to your website via the generated URL.

2. Once GitHub Actions workflow is complete, you can select the _URL_ link to open the website in new tab.

::: zone-end

::: zone pivot="azure-devops"

Once the  workflow is complete, you can select the _URL_ link to open the website in new tab.

::: zone-end

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-first-web-static-app** from the top search bar.
1. Select the app name.
1. Select **Delete**.
1. Select **Yes** to confirm the delete action (this action may take a few moments to complete).

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
