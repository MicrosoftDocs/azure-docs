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

Many frontend frameworks and static site generators allow the use of environment variables during development time. At build time, these variables are replaced by their values in the generated HTML or JavaScript. As such it's a good idea to avoid putting sensitive information into the frontend portion of your application. These settings should be moved to the API portion if possible.

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
    "DATABASE_CONNECTION_STRING": "the-connection-string",
  }
}
```

Settings defined in the `Values` property can be referenced from code as environment variables, available from the `process.env` object.

```js
const connectionString = process.env.DATABASE_CONNECTION_STRING;
```

The `local.settings.json` file is not tracked by the GitHub repository because sensitive information, like a database connection string, is often included in the file. Since the local settings remain on your machine, you need to manually upload your settings to Azure.

Uploading your settings is done infrequently, and doesn't need to occur with every build.

## Upload settings

You can upload settings via a third-party utility or with the Azure CLI.

### Using upload-env

The [upload-env](https://github.com/burkeholland/static-apps-env) Node.js module automatically uploads application settings specified in the `Values` section of the _local.settings.json_ file. During an upload, the module does not delete any settings, but does add or overwrite existing settings.

1. Open a terminal and navigate to the folder that contains the _api_ of your Azure Static Web Apps application.

1. Execute the following command to begin the upload process

    ```bash
    npx upload-env
    ```

1. Select the Azure subscription associated with your Azure Static Web Apps instance,  and press **Enter**

1. Enter the Resource Group where your Azure Static Web Apps instance is located, and press **Enter**

1. Enter the name of your Azure Static Web Apps instance and press **Enter**

As this command executes, the settings from your _local.settings.json_ file are uploaded to your app.

    ![terminal confirming settings have been uploaded]()

### Using the Azure CLI

The `az rest` command uploads settings either as a string value, or by specifying a file. The command accepts application settings as JSON objects in a parent property called `properties`.

#### Uploading settings as string values

1. From a terminal or command line, execute the following command. Make sure to replace the values `<YOUR_SUBSCRIPTION_ID>`, `<YOUR_RESOURCE_GROUP>`, and `<YOUR_STATIC_SITE_NAME>` with the appropriate values.

```bash
az rest --method put --headers "Content-Type=application/json" --uri "/subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<YOUR_RESOURCE_GROUP>/providers/Microsoft.Web/staticSites/<YOUR_STATIC_SITE_NAME>/config/functionappsettings?api-version=2019-12-01-preview" --body "{\"properties\": { \"SETTING_NAME\": \"setting value\" }}"
```

#### Uploading settings from a file

Ensure that your file is a JSON file in the proper format. It must be an object, with a parent property called "properties".

```json
{
   "properties": {
      "SETTING_NAME_1": "setting value 1",
      "SETTING_NAME_2": "setting value 2",
   }
}
```

1. From a terminal or command line, execute the following command. Replace the values <YOUR_SUBSCRIPTION_ID>, <YOUR_RESOURCE_GROUP>, <YOUR_STATIC_SITE_NAME>, and <YOUR_FILE_NAME>.json**. You can find this information on the "Overview" tab for your application in the Azure portal.

    ![Azure portal showing overview tab of an Azure Static Web Apps instance]()

```bash
az rest --method put --headers "Content-Type=application/json" --uri "/subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<YOUR_RESOURCE_GROUP>/providers/Microsoft.Web/staticSites/<YOUR_STATIC_SITE_NAME>/config/functionappsettings?api-version=2019-12-01-preview" --body @<YOUR_FILE_NAME>.json
```

> [!IMPORTANT]
> The .json file that you reference in the <YOUR_FILE_NAME>.json setting file must in the same directory where this command is run.

## Viewing app settings

Application settings are available to view through the Azure CLI.

1. From a terminal or command line, execute the following command. Make sure to replace the placeholders <YOUR_SUBSCRIPTION_ID>, <YOUR_RESOURCE_GROUP>, <YOUR_STATIC_SITE_NAME> with your values.

## Next steps

> [!div class="nextstepaction"]
> [Setup local development for Azure Static Web Apps](local-development.md)