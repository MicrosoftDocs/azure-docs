---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 08/02/2023
ms.author: cshoe
---

There are two aspects to deploying a static app. The first creates the underlying Azure resources that make up your app. The second is a workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

The Static Web Apps *Overview* window displays a series of links that help you interact with your web app.

::: zone pivot="github"

:::image type="content" source="../../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Screenshot of Azure Static Web Apps overview window.":::

1. Selecting _GitHub Action runs_ in the Overview takes you to the GitHub Actions running against your repository.  Verify that the deployment action is complete before continuing. 

1. Once the GitHub Actions workflow is complete, you can select the _URL_ link to open the website in new tab.

::: zone-end

::: zone pivot="azure-devops"

Once the  workflow is complete, you can select the _URL_ link to open the website in new tab.

::: zone-end