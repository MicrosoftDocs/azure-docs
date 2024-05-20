---
title: Manage components in App Spaces
description: Learn how to manage App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: how-to
ms.date: 05/20/2024
zone_pivot_groups: app-spaces-component-types
---

# Manage components in App Spaces

You can manage the components of your App Space by selecting the component on the __App Space__ page. 

[!include [component types](./includes/component-types-table.md)]

::: zone pivot="static"
## Deployment

The **Deployment** section in App Spaces provides a detailed log of all deployment activities and utilizes GitHub Actions to automate the deployment process. You have the option to redeploy the application if necessary. The section also includes a **Workflow run** log that tracks the deployment process step-by-step, starting from setting up the job, logging into Azure, checking out the branch, building and pushing the container image to the registry, and completing the job. This detailed workflow, powered by GitHub Actions, ensures transparency and provides insights into the deployment timeline, making it easier to manage and troubleshoot deployments.
::: zone-end
::: zone pivot="app"
## Deployment
Deployment info for app component.
::: zone-end
::: zone pivot="database"
::: zone-end

::: zone pivot="static"
## Logs
App Spaces provides robust logging capabilities for static app components, which can be filtered over a range of time periods from the last hour to the last 30 days. Users can enable logs through the "Log Settings" button, which offers different configuration options. The "Auto" setting automatically collects logs for HTTP requests, global errors, and usage analytics. For more customized tracking, users can choose the "Manual with npm packages" option to set up custom event tracking with IntelliSense. Alternatively, the "Manual with React and Angular plug-ins" option allows users to configure connection strings to define where to send telemetry data by replacing the placeholder `YOUR_CONNECTION_STRING` with the actual connection string. These flexible logging options ensure comprehensive monitoring and analysis tailored to specific needs.

For Application Insights, see [Enable a framework extension for Application Insights JavaScript SDK](https://go.microsoft.com/fwlink/?linkid=2269911).
::: zone-end
::: zone pivot="app"
## Logs
For more information, see [View log streams in Azure Container Apps](https://go.microsoft.com/fwlink/?linkid=2259026).
::: zone-end
::: zone pivot="database"
::: zone-end

::: zone pivot="static"
## Metrics
This tab provides metrics for static web apps, displayed in two primary graphs: "Requests" and "Data Out." The "Requests" graph tracks the number of HTTP requests made to the static web app, giving insights into traffic and user activity. The "Data Out" graph measures the amount of data transferred from the app to users, which helps in understanding bandwidth usage. Users can filter these metrics to view data over various time ranges, from the last hour up to the last 30 days, allowing for flexible monitoring and analysis of app performance and usage trends.
::: zone-end
::: zone pivot="app"
## Metrics
metrics info for app component.
::: zone-end
::: zone pivot="database"
metrics info for database.
::: zone-end

## Settings

::: zone pivot="static"
The **Settings** tab is divided into four main categories: General, Domains, Routes, and Authentication.

- In the **General** settings, you can specify the component name, ensuring easy identification and management.
- The **Domains** section provides information about the current domains associated with your app, and you can create new domains as needed. 
- The **Routes** section allows you to [define route rules to restrict access to users based on specific roles or to perform actions such as redirects or rewrites](../static-web-apps/configuration.md#routes). 
- The **Authentication** section is where you set up an authentication provider for your site. The available providers are Google and GitHub. Here, you can configure the client ID, client secret, and the API path for getting roles. After authentication, this API path will be called with the user's claims, and it must return an array of roles to determine which routes the user can access based on the roles defined in the Routes section.

This comprehensive settings structure ensures that your application is secure, manageable, and adaptable to various user access needs.


::: zone-end
::: zone pivot="app"
settings info for app component.
::: zone-end
::: zone pivot="database"
The **Settings** tab is divided into three categories: General, Environment variables, and Secrets.

- In **General** section, options include defining the component name for easy identification within the app space, specifying the listening port to manage inbound connections, and configuring the ingress settings for controlling network traffic routing to the database.
- In the **Environment variables** section, users can set up essential environment-specific variables, such as database usernames, connection strings, mount locations, and other parameters crucial for seamless database operations.
- In the **Secrets** section provides a secure repository for storing sensitive data by inputting key/value pairs. These secrets can then be referenced by environment variables, ensuring the protection of confidential information within the database component. 
- With these comprehensive settings, users can tailor their database configurations to meet specific requirements while prioritizing security and efficiency within Azure App Spaces.
::: zone-end


## Info

::: zone pivot="static"
This tab shows the following details:

| Name | Description |
|------|-------------|
| URL            | The direct link to your app|
| Location       | The Azure region where your app is hosted|
| Resource group | The specific resource group managing your app|
| Pricing        | [Pricing details](https://go.microsoft.com/fwlink/?linkid=2260405)|
| Repository     | The GitHub repository used for the app's source code|
| Branch         | The GitHub branch used for the app's source code|
| Subscription   | The Azure subscription under which the app is running|
| Resource name  | The internal name used within Azure App Spaces|
::: zone-end
::: zone pivot="app"
info for app component.
ACA info link: https://go.microsoft.com/fwlink/?linkid=2261690

This tab shows the following details:

| Name | Description |
|------|-------------|
|URL | App URL |
|Location | App region |
|Resource group | App's resource group |
|Pricing | Pricing details |
|Repository|Component's GitHub repo|
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|
::: zone-end
::: zone pivot="database"
info for database.
DB info link: https://go.microsoft.com/fwlink/?linkid=2261690

| Name | Description |
|------|-------------|
|URL | App URL |
|Resource group | App's resource group |
|Pricing | Pricing details |
|Location | App region |
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|

::: zone-end




## Related articles

- [App Spaces overview](overview.md)
- [Deploy a starter app in App Spaces](quickstart-deploy-starter-app.md)
- [Deploy your app in App Spaces](quickstart-deploy-your-app.md)
