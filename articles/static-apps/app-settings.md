---
title: Configure application settings for Azure Static Web Apps
description: #Required; article description that is displayed in search results.
services: static-web-apps
author: burkeholland
ms.service: static-web-apps
ms.topic: how-to
ms.date: 05/08/2020
ms.author: buhollan
---

# Configure application settings for Azure Static Web Apps

Application settings hold configuration settings for values that may change, such as database connection strings. Adding application settings allow you to modify the configuration input to your app, without having to change application code.

Application settings are also sometimes referred to as environment variables.

## Prerequisites

- An Azure Static Web Apps application
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Node.js and npm](https://nodejs.org/en/download/), the Node.js package manager.
  - This requirement is used only to run the simple upload solution. It is not needed if the Azure CLI `rest` command is used to sync application settings to Azure.

## Types of application settings

There are typically two aspects to an Azure Static Web Apps application. The first is the web application, or static content, which is represented by HTML, CSS, JavaScript, and images. The second is the back-end API, which is powered by an Azure Functions application.

This article demonstrates how to manage application settings for the back-end API in Azure Functions.

Many front-end frameworks and static site generators allow the use of environment variables during development. At build time, these variables are replaced by their values in the generated HTML or JavaScript. Since data in HTML and JavaScript is easily discoverable by site visitor, you want to avoid putting sensitive information in the front-end application. Settings that hold sensitive data are best located in API app.

For more information about how to use environment variables with your JavaScript framework or library, refer to the following articles for more detail.

### JavaScript frameworks and libraries

- [Angular](https://angular.io/guide/build#configuring-application-environments)
- [React](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Svelte](https://linguinecode.com/post/how-to-add-environment-variables-to-your-svelte-js-app)
- [Vue](https://cli.vuejs.org/guide/mode-and-env.html)

### Static site generators

- [Gatsby](https://www.gatsbyjs.org/docs/environment-variables/)
- [Hugo](https://gohugo.io/getting-started/configuration/)
- [Jekyll](https://jekyllrb.com/docs/configuration/environments/)

## About application settings

APIs in Azure Static Web Apps are powered by Azure Functions, which allows you to define application settings in the _local.settings.json_ file. This file defines application settings in the `Values` property of the configuration.

The following sample _local.settings.json_ shows how to add an application setting for the `DATABASE_CONNECTION_STRING`.

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_CONNECTION_STRING": "<YOUR_DATABASE_CONNECTION_STRING>"
  }
}
```

Settings defined in the `Values` property can be referenced from code as environment variables, available from the `process.env` object.

```js
const connectionString = process.env.DATABASE_CONNECTION_STRING;
```

The `local.settings.json` file is not tracked by the GitHub repository because sensitive information, like database connection strings, are often included in the file. Since the local settings remain on your machine, you need to manually upload your settings to Azure.

Generally, uploading your settings is done infrequently, and isn't required with every build.

## Upload settings

You can upload settings via the Azure Portal or with the Azure CLI.

### Using the Azure Portal

The Azure Portal provides an interface for creating, updating and deleting App Settings.

1. Navigate to the [Azure Portal](https://portal.azure.com).

1. In the search bar, type "static web apps". Select "Static Web Apps" from the dropdown menu.

1. Select your Static Web App from the list.

1. Click on the "Configuration" option in the sidebar.

1. Click on the "Add Button" to add a new app setting.

:::image type="content" source="media/app-settings/configuration-env-variables.png" alt-text="Azure Static Web Apps configuration view":::

1. Enter a **Name** and **Value** and press "OK".

### Using the Azure CLI

You can use the `az rest` command to upload your settings to Azure. The command accepts application settings as JSON objects in a parent property called `properties`.

The easiest way to create a JSON file with the appropriate values is to create a modified version of your _local.settings.json_ file.

1. To ensure your new file with sensitive data isn't exposed publicly, add the following entry into your _.gitignore_ file.

   ```bash
   local.settings*.json
   ```

2. Next, make a copy of your _local.settings.json_ file and name it _local.settings.properties.json_.

3. Inside the new file, remove all other data from the file except for the application settings and rename `Values` to `properties`.

   Your file should now look similar to the following example:

   ```json
   {
     "properties": {
       "DATABASE_CONNECTION_STRING": "<YOUR_DATABASE_CONNECTION_STRING>"
     }
   }
   ```

The Azure CLI command requires a number of values specific to your account to run the upload. From the _Overview_ window of your Static Web Apps resource, you have access to the following information:

1. Static site name
2. Resource group name
3. Subscription ID

:::image type="content" source="media/app-settings/azure-static-web-apps-overview.png" alt-text="Azure Static Web Apps Overview":::

4. From a terminal or command line, execute the following command. Make sure to replace the placeholders of `<YOUR_STATIC_SITE_NAME>`, `<YOUR_RESOURCE_GROUP_NAME>`, and `<YOUR_SUBSCRIPTION_ID>` with your values from the _Overview_ window.

   ```bash
   az rest --method put --headers "Content-Type=application/json" --uri "/subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<YOUR_RESOURCE_GROUP_NAME>/providers/Microsoft.Web/staticSites/<YOUR_STATIC_SITE_NAME>/config/functionappsettings?api-version=2019-12-01-preview" --body @local.settings.properties.json
   ```

> [!IMPORTANT]
> The "local.settings.properties.json" file must be in the same directory where this command is run. This file can be named anything you like. The name is not significant.

### Viewing app settings with the Azure CLI

Application settings are available to view through the Azure CLI.

1. From a terminal or command line, execute the following command. Make sure to replace the placeholders `<YOUR_SUBSCRIPTION_ID>`, `<YOUR_RESOURCE_GROUP_NAME>`, `<YOUR_STATIC_SITE_NAME>` with your values.

## Next steps

> [!div class="nextstepaction"]
> [setup local development for azure static web apps](local-development.md)
