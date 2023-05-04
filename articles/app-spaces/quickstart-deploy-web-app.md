---
title: Deploy a web app with Azure App Spaces
description: Learn how to deploy a web app with Azure App Spaces in the Azure portal.
ms.author: chcomley
author: chcomley
ms.service: app-spaces
ms.topic: quickstart
ms.date: 05/05/2023
---

# Quickstart: Deploy a web app with Azure App Spaces

In this quickstart, learn how to connect to GitHub and deploy your web app to the recommended Azure services with Azure App Spaces. For more information, see [Azure App Spaces overview](overview.md).

## Prerequisites

To deploy your repository to App Spaces, you must have the following:

- [Azure account and subscription](https://signup.azure.com/)
- [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository). If you don't have your own repository, see [Deploy an Azure App Spaces sample app](deploy-app-spaces-template.md).
- Write access to your chosen repository to deploy with GitHub Actions.

## Deploy your repo

Do the following steps to deploy an existing repository from GitHub. 

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#home).
2. Enter `App Spaces` in the search box, and then select **App Spaces**.
3. Choose **Start deploying**.
   
   :::image type="content" source="media/start-deploying.png" alt-text="Screenshot showing button, Start deploying, highlighted by red box.":::

4. Select the organization, repository, and branch that contain your web app code. If you can't find an organization or repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). 
   
   :::image type="content" source="media/connect-to-github.png" alt-text="Screenshot showing required selections to connect to GitHub.":::

   Azure automatically detects information about your web app and suggests an Azure service to use to deploy your app.

5. Define App Space details, and then select **Deploy App Space**:
   
   - Enter a name for your App Space.
   - Choose a container app environment from the dropdown menu or select **Create new**, enter a name, and then select **Create**.
   - Choose a subscription to manage your deployed resources and costs. 
   - Choose the region closest to your users for optimal performance.
     - If necessary, choose **Choose another language** (.NET, Node JS, Python, PHP, or Java) or **Choose another Azure service** (Container Apps, Static Web Apps, or App Services).
     - If necessary, check the box next to **Create a database for my App Space**.

     :::image type="content" source="media/define-app-space-details.png" alt-text="Screenshot showing recommended Azure service to deploy to, other information needed, and the button, Deploy App Space highlighted with a red box.":::

Your web application code deploys to App Spaces.

## Manage components

You can manage various components of your App Space, like hosting, monitoring, and managed identities and container apps environments.

:::image type="content" source="media/manage-components.png" alt-text="Screenshot showing left-side navigation for managing App Space components.":::

### Container App

You can do the following tasks on the Container App page:
- View information tabs:
  - Secrets
  - Container details
  - Environment variables
  - Log Stream
  - Deployment
- Discover more Azure Container Apps features, like:
  - Manage your app with revisions
  - Set up continuous deployment
  - Create secrets

   :::image type="content" source="media/container-details.png" alt-text="Screenshot showing Container App details and other tabs.":::

### Container registry

You can do the following tasks on the Container registry page:
- View usage information in GiB:
  - Included in SKU (Basic, Standard, or Premium)
  - Used
  - Additional storage
- View registry metrics:
  - Image pull count
  - Image push count
  - Task run duration
  - Agent pool cpu time
- [Automate container image builds and maintenance with ACR Tasks](../container-registry/container-registry-tasks-overview.md)
- [Explore Container Security capabilities](../defender-for-cloud/defender-for-containers-introduction.md)

   :::image type="content" source="media/container-registry-advanced-view.png" alt-text="Screenshot showing advanced view for Container registry, including usage and security integrations.":::

### Monitoring

You can do the following tasks on the Log Analytics workspace page when you select **Go to advanced view**:
- Move your resource group or subscription
- Add tags
- View monitoring information, such as:
  - CPU usage
  - Memory working set bytes
  - Network in bytes
  - Network out bytes
- Set alerts
- Manage usage and costs
- Create and share Workbooks

   :::image type="content" source="media/monitoring-advanced-view.png" alt-text="Screenshot showing advanced view for monitoring, Log Analytics workspace.":::

For more information, see the [Log Analytics tutorial](../azure-monitor/logs/log-analytics-tutorial.md).

### Additional

You can also view the essentials for your Container Apps Environment and Managed Identities. This view is hidden by default.

## Related articles

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](deploy-app-spaces-template.md)
