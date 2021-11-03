---
title: Configure application settings for Azure Static Web Apps
description: Learn to configure application settings for Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.service: static-web-apps
ms.topic: how-to
ms.date: 09/23/2021
ms.author: buhollan
ms.custom: devx-track-js
---

# Configure application settings for Azure Static Web Apps

Application settings hold configuration settings for values that may change, such as database connection strings. Adding application settings allows you to modify the configuration input to your app, without having to change application code.

Application settings:

- Are available as environment variables to the backend API of a static web app
- Can be used to store secrets used in [authentication configuration](key-vault-secrets.md)
- Are encrypted at rest
- Are copied to [staging](review-publish-pull-requests.md) and production environments
- May only be alphanumeric characters, `.`, and `_`

> [!IMPORTANT]
> The application settings described in this article only apply to the backend API of an Azure Static Web App.
>
> To configure environment variables that are required to build your frontend web application, see [Build configuration](build-configuration.md#environment-variables).

## Prerequisites

- An Azure Static Web Apps application
- [Azure CLI](/cli/azure/install-azure-cli) — required if you are using the command line

## Configure API application settings for local development

APIs in Azure Static Web Apps are powered by Azure Functions, which allows you to define application settings in the _local.settings.json_ file when you're running the application locally. This file defines application settings in the `Values` property of the configuration.

> [!NOTE]
> The _local.settings.json_ file is only used for local development. Use the [Azure portal](https://portal.azure.com) to configure application settings for production.

The following sample _local.settings.json_ shows how to add a value for the `DATABASE_CONNECTION_STRING`.

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

Settings defined in the `Values` property can be referenced from code as environment variables. In Node.js functions, for example, they're available in the `process.env` object.

```js
const connectionString = process.env.DATABASE_CONNECTION_STRING;
```

The `local.settings.json` file is not tracked by the GitHub repository because sensitive information, like database connection strings, are often included in the file. Since the local settings remain on your machine, you need to manually configure your settings in Azure.

Generally, configuring your settings is done infrequently, and isn't required with every build.

## Configure application settings

You can configure application settings via the Azure portal or with the Azure CLI.

### Use the Azure portal

The Azure portal provides an interface for creating, updating and deleting application settings.

1. Navigate to the [Azure portal](https://portal.azure.com).

1. In the search bar, search for and select **Static Web Apps**.

1. Click on the **Configuration** option in the sidebar.

1. Select the environment that you want to apply the application settings to. Staging environments are automatically created when a pull request is generated, and are promoted into production once the pull request is merged. You can set application settings per environment.

1. Click on the **Add Button** to add a new app setting.

    :::image type="content" source="media/application-settings/configuration.png" alt-text="Azure Static Web Apps configuration view":::

1. Enter a **Name** and **Value**.

1. Click **OK**.

1. Click **Save**.

### Use the Azure CLI

You can use the `az rest` command to do bulk uploads of your settings to Azure. The command accepts application settings as JSON objects in a parent property called `properties`.

The easiest way to create a JSON file with the appropriate values is to create a modified version of your _local.settings.json_ file.

1. To ensure your new file with sensitive data isn't exposed publicly, add the following entry into your _.gitignore_ file.

   ```bash
   local.settings*.json
   ```

1. Next, make a copy of your _local.settings.json_ file and name it _local.settings.properties.json_.

1. Inside the new file, remove all other data from the file except for the application settings and rename `Values` to `properties`.

   Your file should now look similar to the following example:

   ```json
   {
     "properties": {
       "DATABASE_CONNECTION_STRING": "<YOUR_DATABASE_CONNECTION_STRING>"
     }
   }
   ```

1. Execute the following command to list the static web apps in your subscription and display their details.

    ```bash
    az staticwebapp list -o json
    ```

    Locate the static web app you want to configure and note its ID.

1. From a terminal or command line, execute the following command to upload the settings. Replace `<YOUR_APP_ID>` with the ID of the app you retrieved in the previous step.

   ```bash
   az rest --method put --headers "Content-Type=application/json" --uri "<YOUR_APP_ID>/config/functionappsettings?api-version=2019-12-01-preview" --body @local.settings.properties.json
   ```

  > [!IMPORTANT]
  > The "local.settings.properties.json" file must be in the same directory where this command is run. This file can be named anything you like. The name is not significant.

### View application settings with the Azure CLI

Application settings are available to view through the Azure CLI.

- From a terminal or command line, execute the following command. Make sure to replace the placeholder `<YOUR_APP_ID>` with your value.

   ```bash
   az rest --method post --uri "<YOUR_APP_ID>/listFunctionAppSettings?api-version=2019-12-01-preview"
   ```

## Next steps

> [!div class="nextstepaction"]
> [Configure front-end frameworks](front-end-frameworks.md)
