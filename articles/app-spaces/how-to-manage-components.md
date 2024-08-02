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

[!include [preview note](./includes/preview-note.md)]

You can manage the components of your App Spaces by selecting the component on the __App Space__ page. 

[!include [component types](./includes/component-types-table.md)]

::: zone pivot="static"
## Deployment

The **Deployment** section in App Spaces provides a detailed log of all deployment activities and utilizes GitHub Actions to automate the deployment process. You can redeploy the application if necessary. The section also includes a **Workflow run** log that tracks the deployment process step-by-step, starting from setting up the job, logging into Azure, checking out the branch, building and pushing the container image to the registry, and completing the job. This detailed workflow, powered by GitHub Actions, ensures transparency and provides insights into the deployment timeline, making it easier to manage and troubleshoot deployments.
::: zone-end
::: zone pivot="app"
## Deployment
The **Deployment** section in App Spaces provides a detailed log of all deployment activities and utilizes GitHub Actions to automate the deployment process. You can redeploy the application if necessary. The section also includes a **Workflow run** log that tracks the deployment process step-by-step, starting from setting up the job, logging into Azure, checking out the branch, building and pushing the container image to the registry, and completing the job. This detailed workflow, powered by GitHub Actions, ensures transparency and provides insights into the deployment timeline, making it easier to manage and troubleshoot deployments.
::: zone-end
::: zone pivot="database"
::: zone-end

::: zone pivot="static"
## Logs
App Spaces provides robust logging capabilities for static app components, which can be filtered over a range of time periods from the last hour to the last 30 days. You can enable logs through the **Log Settings** button, which offers different configuration options. The **Auto** setting automatically collects logs for HTTP requests, global errors, and usage analytics. For more customized tracking, you can choose the **Manual with npm packages** option to set up custom event tracking with IntelliSense. Alternatively, the **Manual with React and Angular plug-ins** option allows you to configure connection strings to define where to send telemetry data by replacing the placeholder `YOUR_CONNECTION_STRING` with the actual connection string. These flexible logging options ensure comprehensive monitoring and analysis tailored to specific needs.

Select **Open in advanced queries** to go to the [Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md).

For Application Insights, see [Enable a framework extension for Application Insights JavaScript SDK](https://go.microsoft.com/fwlink/?linkid=2269911).
::: zone-end
::: zone pivot="app"
## Logs

Select system logs to check service-level events, or console logs to debug code. For more information, see [Use queries in Log Analytics](../azure-monitor/logs/queries.md).

Select **Open in advanced queries** to go to the [Log Analytics workspace](../azure-monitor/logs/log-analytics-workspace-overview.md).
::: zone-end
::: zone pivot="database"
::: zone-end

::: zone pivot="static"
## Metrics
This tab provides metrics for Static Web Apps, displayed in two primary graphs: **Requests** and **Data Out**.
- The **Requests** graph tracks the number of HTTP requests made to the static web app, giving insights into traffic and user activity.
- The **Data Out** graph measures the amount of data transferred from the app to users, which helps in understanding bandwidth usage. You can filter these metrics to view data over various time ranges. 
::: zone-end
::: zone pivot="app"
## Metrics
This tab provides metrics for Azure Container Apps, displayed in three primary graphs: **Requests**, **CPU Usage Nanocores**, and **Memory Working Set Bytes**. 
- The **Requests** graph provides a visual representation of HTTP requests made to the app, offering valuable insights into app traffic and user engagement over time. 
- The **CPU Usage Nanocores** graph illustrates the CPU utilization of the app in nanocores, aiding in monitoring resource consumption and performance optimization.
- The **Memory Working Set Bytes** graph displays the memory usage of the app, enabling users to track memory utilization trends and identify potential memory-related issues.
::: zone-end
::: zone pivot="database"
::: zone-end

## Settings

::: zone pivot="static"
The **Settings** tab is divided into four main categories: General, Domains, Routes, and Authentication.

- In the **General** settings, you can specify the component name, ensuring easy identification and management.
- The **Domains** section provides information about the current domains associated with your app, and you can create new [App Service domains](../app-service/manage-custom-dns-buy-domain.md) as needed. 
- The **Routes** section allows you to [define route rules to restrict access to users based on specific roles or to perform actions such as redirects or rewrites](../static-web-apps/configuration.md#routes). 
- The **Authentication** section is where you set up an authentication provider for your site. The available providers are Google and GitHub. Here, you can configure the client ID, client secret, and the API path for getting roles. After authentication, this API path will be called with the user's claims, and it must return an array of roles to determine which routes the user can access based on the roles defined in the Routes section. Learn more at [Authenticate and authorize Static Web Apps](../static-web-apps/authentication-authorization.yml).


::: zone-end
::: zone pivot="app"
The **Settings** tab is divided into three categories: General, Environment variables, and Secrets.

- In **General** section, options include defining the component name for easy identification within the app space, specifying the listening port to manage inbound connections, and configuring the ingress settings for controlling network traffic routing to the database.
- In the **Environment variables** section, you can set up essential environment-specific variables, such as database usernames, connection strings, mount locations, and other parameters crucial for seamless database operations.
- In the **Secrets** section provides a secure repository for storing sensitive data by inputting key/value pairs. These secrets can be referenced by environment variables, ensuring the protection of confidential information within the database component. 
::: zone-end
::: zone pivot="database"
The **Settings** tab is divided into three categories: General, Environment variables, and Secrets.

- In **General** section, options include defining the component name for easy identification within the app space, specifying the listening port to manage inbound connections, and configuring the ingress settings for controlling network traffic routing to the database.
- In the **Environment variables** section, you can set up essential environment-specific variables, such as database usernames, connection strings, mount locations, and other parameters crucial for seamless database operations.
- In the **Secrets** section provides a secure repository for storing sensitive data by inputting key/value pairs. These secrets can be referenced by environment variables, ensuring the protection of confidential information within the database component. 
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
| Resource name  | The internal name used within App Spaces|
::: zone-end
::: zone pivot="app"

This tab shows the following details:

| Name | Description |
|------|-------------|
| URL            | The direct link to your app|
| Location       | The Azure region where your app is hosted|
| Resource group | The specific resource group managing your app|
| Pricing        | [Pricing details](https://go.microsoft.com/fwlink/?linkid=2261690)|
| Repository     | The GitHub repository used for the app's source code|
| Branch         | The GitHub branch used for the app's source code|
| Subscription   | The Azure subscription under which the app is running|
| Resource name  | The internal name used within App Spaces|

::: zone-end
::: zone pivot="database"

This tab shows the following details:

| Name | Description |
|------|-------------|
| URL            | The direct link to your app|
| Location       | The Azure region where your app is hosted|
| Resource group | The specific resource group managing your app|
| Pricing        | [Pricing details](https://go.microsoft.com/fwlink/?linkid=2261690)|
| Subscription   | The Azure subscription under which the app is running|
| Resource name  | The internal name used within App Spaces|

::: zone-end

## Related content

- [App Spaces overview](overview.md)
- [Deploy a starter app in App Spaces](quickstart-deploy-starter-app.md)
- [Deploy your app in App Spaces](quickstart-deploy-your-app.md)
