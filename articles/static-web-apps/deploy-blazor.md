---
title: 'Tutorial: Building a static web app with Blazor in Azure Static Web Apps'
description: Learn to build an Azure Static Web Apps website with Blazor.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 04/09/2021
ms.author: cshoe
---

# Tutorial: Building a static web app with Blazor in Azure Static Web Apps

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository. In this tutorial, you deploy a web application to Azure Static Web apps using the Azure portal.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account

## Application overview

Azure Static Web Apps allows you to create static web applications supported by a serverless backend. The following tutorial demonstrates how to deploy C# Blazor web application that returns weather data.

:::image type="content" source="./media/deploy-blazor/blazor-app-complete.png" alt-text="Complete Blazor app":::

The app featured in this tutorial is made up from three different Visual Studio projects:

- **Api**: The C# Azure Functions application which implements the API endpoint that provides weather information to the static app. The **WeatherForecastFunction** returns an array of `WeatherForecast` objects.

- **Client**: The front-end Blazor web assembly project. A [fallback route](#fallback-route) is implemented to ensure all routes are served the _index.html_ file.

- **Shared**: Holds common classes referenced by both the Api and Client projects which allows data to flow from API endpoint to the front-end web app. The [`WeatherForecast`](https://github.com/staticwebdev/blazor-starter/blob/main/Shared/WeatherForecast.cs) class is shared among both apps.

Together, these projects make up the parts required create a Blazor web assembly application running in the browser supported by an API backend.

## Fallback route

The application exposes URLs like _/counter_ and _/fetchdata_ which map to specific routes of the application. Since this app is implemented as a single page application, each route is served the _index.html_ file. To ensure that request for any path return _index.html_ a [fallback route](./configuration.md#fallback-routes) is implemented in the _staticwebapp.config.json_ file found in the _wwwroot_ folder of the Client project.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

The above configuration ensures that requests to any route in the app returns the _index.html_ page.

## Create a repository

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app deployed to Azure Static Web Apps.

1. Make sure you're signed in to GitHub and navigate to the following location to create a new repository:
   - [https://github.com/staticwebdev/blazor-starter/generate](https://github.com/login?return_to=/staticwebdev/blazor-starter/generate)
1. Name your repository **my-first-static-blazor-app**.

## Create a static web app

Now that the repository is created, create a static web app from the Azure portal.

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **my-blazor-group**  |
    | _Name_ | **my-first-static-blazor-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **my-first-static-blazor-app**. |
    | _Branch_ | Select **main**. |

1. In the _Build Details_ section, select **Blazor** from the _Build Presets_ drop-down and keep the default values.

### Review and create

1. Select the **Review + Create** button to verify the details are all correct.

1. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Action for deployment.

1. Once the deployment completes click, **Go to resource**.

1. Select **Go to resource**.

   :::image type="content" source="media/deploy-blazor/resource-button.png" alt-text="Go to resource button":::

## View the website

There are two aspects to deploying a static app. The first provisions the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

:::image type="content" source="./media/deploy-blazor/overview-window.png" alt-text="Overview window":::

1. Clicking on the banner that says, _Click here to check the status of your GitHub Actions runs_ takes you to the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can navigate to your website via the generated URL.

2. Once GitHub Actions workflow is complete, you can select the _URL_ link to open the website in new tab.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-blazor-group** from the top search bar.
1. Select on the group name.
1. Select on the **Delete** button.
1. Select **Yes** to confirm the delete action.

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization](./authentication-authorization.md)
