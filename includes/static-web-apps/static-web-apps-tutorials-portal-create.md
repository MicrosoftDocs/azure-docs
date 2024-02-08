---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 08/02/2023
ms.author: cshoe
---

Now that the repository is created, you can create a static web app from the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.

::: zone pivot="github"

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-basics.png" alt-text="Screenshot of the basics section in the Azure portal.":::

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
| Branch | Select **main**. |

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Screenshot of repository details in the Azure portal.":::

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
| Branch | Select **main**. |

> [!NOTE]
> Make sure the branch you are using is not protected, and that you have sufficient permissions to issue a `push` command. To verify, browse to your DevOps repository and go to **Repos** -> **Branches** and select **More options**. Next, select your branch, and then **Branch policies** to ensure required policies aren't enabled.

::: zone-end