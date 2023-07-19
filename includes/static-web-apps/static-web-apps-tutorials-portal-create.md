---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 07/19/2023
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
| Branch | Select **main**. |

:::image type="content" source="media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Repository details":::

> [!NOTE]
> If you don't see any repositories:
> - You may need to authorize Azure Static Web Apps in GitHub. Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**.
> - You may need to authorize Azure Static Web Apps in your Azure DevOps organization. You must be an owner of the organization to grant the permissions. Request third-party application access via OAuth. For more information, see [Authorize access to REST APIs with OAuth 2.0](/azure/devops/integrate/get-started/authentication/oauth).

::: zone-end

::: zone pivot="azure-devops"