---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 05/13/2020
ms.author: cshoe
---

## View the website

There are two aspects to deploying a static app. The first provisions the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

:::image type="content" source="../aricles/static-web-apps/media/getting-started/overview-window.png" alt-text="Overview window":::

1. Clicking on the banner that says, "Click here to check the status of your GitHub Actions runs" takes you to the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can navigate to your website via the generated URL.

1. Once GitHub Actions workflow is complete, you can click on the _URL_ link to open the website in new tab.
