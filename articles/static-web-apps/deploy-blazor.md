---
title: 'Deploy a Blazor app on Azure Static Web Apps'
description: Learn to deploy a Blazor app on Azure Static Web Apps.
services: static-web-apps
ms.custom: engagement-fy23
author: craigshoemaker
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 07/21/2023
ms.author: cshoe
---

# Deploy a Blazor app on Azure Static Web Apps

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository supported by a serverless backend. The following tutorial shows how to deploy C# Blazor WebAssembly app that displays weather data returned by a serverless API.

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account. If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## 1. Create a repository

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app that you can deploy to Azure Static Web Apps.

1. Make sure you're signed in to GitHub and go to the following location to create a new repository:
   [https://github.com/staticwebdev/blazor-starter/generate](https://github.com/login?return_to=/staticwebdev/blazor-starter/generate)
2. Name your repository **my-first-static-blazor-app**.

## 2. Create a static web app

Now that the repository is created, create a static web app from the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web App**.
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

5. Select **Sign in with GitHub** and authenticate with GitHub, if you're prompted.
6. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **my-first-static-blazor-app**. |
    | _Branch_ | Select **main**. |

   > [!NOTE]
   > If you don't see any repositories, you may need to authorize Azure Static Web Apps on GitHub. Then browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps,** select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

7. In the _Build Details_ section, select **Blazor** from the _Build Presets_ drop-down and the following values are populated.

    | Property | Value | Description |
    | --- | --- | --- |
    | App location | **Client** | Folder containing the Blazor WebAssembly app |
    | API location | **Api** | Folder containing the Azure Functions app |
    | Output location | **wwwroot** | Folder in the build output containing the published Blazor WebAssembly application |

8. Select **Review + Create** to verify the details are all correct.

9. Select **Create** to start the creation of the static web app and provision a GitHub Actions for deployment.

10. Once the deployment is completed, select **Go to resource**.

11. Select **Go to resource**.

   :::image type="content" source="media/deploy-blazor/resource-button.png" alt-text="Go to resource button":::

## 3. View the website

There are two aspects to deploying a static app. The first provisions the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can go to your new static web app, the deployment build must first finish running.

The Static Web Apps overview window displays a series of links that help you interact with your web app.

1. Select the banner that says, _Click here to check the status of your GitHub Actions runs_ to see the GitHub Actions running against your repository. Once you verify the deployment job is complete, then you can go to your website via the generated URL.

   :::image type="content" source="./media/deploy-blazor/overview-window.png" alt-text="Screenshot showing overview window.":::

2. Once GitHub Actions workflow is complete, you can select the _URL_ link to open the website in new tab.

   :::image type="content" source="media/deploy-blazor/my-first-static-blazor-app.png" alt-text="Screenshot of Static Web Apps Blazor webpage.":::
   
## 4. Understand the application overview

Together, the following projects make up the parts required to create a Blazor WebAssembly application running in the browser supported by an Azure Functions API backend.

|Visual Studio project |Description |
|---------|---------|
|Api   | The C# Azure Functions application implements the API endpoint that provides weather information to the Blazor WebAssembly app. The **WeatherForecastFunction** returns an array of `WeatherForecast` objects.        |
|Client    |The front-end Blazor WebAssembly project. A [fallback route](#fallback-route) is implemented to ensure client-side routing is functional.         |
|Shared    | Holds common classes referenced by both the Api and Client projects, which allow data to flow from API endpoint to the front-end web app. The [`WeatherForecast`](https://github.com/staticwebdev/blazor-starter/blob/main/Shared/WeatherForecast.cs) class is shared among both apps.        |

**Blazor static web app**
:::image type="content" source="./media/deploy-blazor/blazor-app-complete.png" alt-text="Complete Blazor app.":::

### Fallback route

The app exposes URLs like `/counter` and `/fetchdata`, which map to specific routes of the app. Since this app is implemented as a single page, each route is served the `index.html` file. To ensure that requests for any path return `index.html`, a [fallback route](./configuration.md#fallback-routes) gets implemented in the `staticwebapp.config.json` file found in the client project's root folder.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

The JSON configuration ensures that requests to any route in the app return the `index.html` page.

## Clean up resources

If you're not going to use this application, you can delete the Azure Static Web Apps instance through the following steps:

1. Open the [Azure portal](https://portal.azure.com).
2. Search for **my-blazor-group** from the top search bar.
3. Select on the group name.
4. Select **Delete**.
5. Select **Yes** to confirm the delete action.

## Next steps

> [!div class="nextstepaction"]
> [Authenticate and authorize](./authentication-authorization.md)

## Related articles

- [Set up authentication and authorization](authentication-authorization.md)
- [Configure app settings](application-settings.md)
- [Enable monitoring](monitor.md)
- [Azure CLI](https://github.com/Azure/static-web-apps-cli)
