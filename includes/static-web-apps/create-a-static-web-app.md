---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 10/17/2022
ms.author: cshoe
---

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure portal.

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.

In the _Basics_ section, begin by configuring your new app and linking it to a GitHub repository.

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-basics.png" alt-text="Screenshot of the Static Web Apps Basics tab in the Azure portal.":::


1. Select your _Azure subscription_.
1. Next to _Resource Group_, select the **Create new** link.
1. Enter **static-web-apps-test** in the textbox.
1. Under to _Static Web App details_, enter **my-first-static-web-app** in the textbox.
1. Under _Azure Functions and staging details_, select a region closest to you.
1. Under _Deployment details_, select **GitHub**.
1. Select the **Sign-in with GitHub** button and authenticate with GitHub.

After you sign in with GitHub, enter the repository information.

:::image type="content" source="../../articles/static-web-apps/media/getting-started-portal/quickstart-portal-source-control.png" alt-text="Repository details":::