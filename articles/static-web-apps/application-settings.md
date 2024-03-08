---
title: Configure application settings for Azure Static Web Apps
description: Learn how to configure application settings for Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 01/10/2023
ms.author: cshoe
ms.custom: engagement-fy23
---

# Configure application settings for Azure Static Web Apps

Application settings hold configuration values that may change, such as database connection strings. Adding application settings allows you to modify the configuration input to your app, without having to change application code.

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
- [Azure CLI](/cli/azure/install-azure-cli)-required if you are using the command line

## Configure API application settings for local development

APIs in Azure Static Web Apps are powered by Azure Functions, which allows you to define application settings in the _local.settings.json_ file when you run the application locally. This file defines application settings in the `Values` property of the configuration.

> [!NOTE]
> The _local.settings.json_ file is only used for local development. Use the [Azure portal](#configure-application-settings) to configure application settings for production.

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

The `local.settings.json` file isn't tracked by the GitHub repository because sensitive information, like database connection strings, are often included in the file. Since the local settings remain on your machine, you need to manually configure your settings in Azure.

Generally, configuring your settings is done infrequently, and isn't required with every build.

## Configure application settings

You can configure application settings via the [Azure portal](https://portal.azure.com) or with the [Azure CLI](#use-the-azure-cli).

### Use the Azure portal

The Azure portal provides an interface for creating, updating and deleting application settings.

1. Go to the [Azure portal](https://portal.azure.com).
1. Open your static web app.
1. Select **Configuration** in the sidebar.
1. Select the environment to which you want to apply the application settings. You can configure application settings per environment. When you create a pull request, staging environments are automatically created, and then promoted into production when you merge the pull request. 
1. Select **+ Add** to add a new app setting.
   :::image type="content" source="media/application-settings/configuration.png" alt-text="Screenshot of Azure Static Web Apps configuration view":::
1. Enter a **Name** and **Value**.
1. Select **OK**.
1. Select **Save**.

### Use the Azure CLI

Use the `az staticwebapp appsettings` command to update your settings in Azure.

In a terminal or command line, execute the following command to add or update a setting named `message` with a value of `Hello world`. Make sure to replace the placeholder `<YOUR_APP_ID>` with your value.

   ```azurecli
   az staticwebapp appsettings set --name <YOUR_APP_ID> --setting-names "message=Hello world"
   ```

  > [!TIP]
  > You can add or update multiple settings by passing multiple name-value pairs to `--setting-names`.

#### View application settings with the Azure CLI

In a terminal or command line, execute the following command. Make sure to replace the placeholder `<YOUR_APP_ID>` with your value.

   ```azurecli
   az staticwebapp appsettings list --name <YOUR_APP_ID>
   ```

#### Delete application settings with the Azure CLI

In a terminal or command line, execute the following command to delete a setting named `message`. Make sure to replace the placeholder `<YOUR_APP_ID>` with your value.

   ```azurecli
   az staticwebapp appsettings delete --name <YOUR_APP_ID> --setting-names "message"
   ```

  > [!TIP]
  > Delete multiple settings by passing multiple setting names to `--setting-names`.

## Next steps

> [!div class="nextstepaction"]
> [Define configuration for Azure Static Web Apps in the  _staticwebapp.config.json_  file](configuration.md)

## Related articles

- [Override defaults with custom registration](authentication-custom.md)
- [Define settings that control the build process](./build-configuration.md)
- [API overview](apis-overview.md)
