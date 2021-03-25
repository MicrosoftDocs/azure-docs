---
title: Alternative processes for self-hosted portal
titleSuffix: Azure API Management
description: Learn about alternative processes you can use when you self-host a developer portal in Azure API Management.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Alternative processes for self-hosted developer portal

There are several alternative processes you can explore when you [self-host a developer portal](developer-portal-self-host.md):

* Edit content directly in files instead of using the visual editor.

* Use your own content management system (CMS) to manage your content.

* Use production builds of the designer and the publisher.

* Use an Azure Function App to publish your portal.

* Front the files of your portal with a Content Delivery Network (CDN) to reduce page loading times.

This article provides information on each of the processes. 

If you have not already done so, set up a [local environment](developer-portal-self-host.md#set-up-local-environment) for the latest release of the developer portal.

## Edit content through files, not visual editor

In the tutorial to [self-host the developer portal](developer-portal-self-host.md), we described the workflow to edit content and customize the portal through the built-in visual editor. You can also use the  REST API to fetch the underlying data files, edit them directly in a text editor, and upload new versions through API calls.

## Bring your own CMS

By default, the portal's page and other content is retrieved from, saved to, and stored in an API Management service.

You can configure your portal deployment to use a different data source - for example, a headless CMS to manage your content. 

## Build for production

If you want to host the development environment of the portal online for collaboration purposes, use production builds of the designer and the publisher. Production builds bundle the files, exclude source maps, etc.

Create a bundle in the `./dist/designer` directory by running the command:

```sh
npm run build-designer
```

The result is a single page application, so you can still deploy it to a static web host, such as the Azure Blob Storage Static Website.

Similarly, place a compiled and optimized publisher in the `./dist/publisher` folder:

```sh
npm run build-publisher
```

## Use Function App to publish the portal

:::image type="content" source="media/developer-portal-alternative-processes-self-host/developer-portal-publish-external.png" alt-text="Publish portal using Function App":::

Run the publishing step in the cloud as an alternative to executing it locally.

To implement publishing with an Azure Function App, you need the following prerequisites:

- [Create an Azure Function](../azure-functions/functions-create-first-azure-function.md). The Function needs to be a JavaScript language Function.
- Install Azure Functions Core Tools:
    ```sh
    npm install –g azure-function-core-tools
    ```

### Step 1: Configure output storage

Uploading the content directly to the hosting website ("$web" container of output storage), instead of a local folder. Configure this change in the `./src/config.publish.json` file:

```json
{
   ...
   "outputBlobStorageContainer": "$web",
   "outputBlobStorageConnectionString": "DefaultEndpointsProtocol=...",
   ...
}
```

### Step 2: Build and deploy the Function App

There is a sample HTTP Trigger Function in the `./examples` folder. To build it and place it in `./dist/function`, run the following command:

```sh
npm run build-function
```

Then, sign in to the Azure CLI and deploy it:

```sh
az login
cd ./dist/function
func azure functionapp publish <function app name>
```

Once it is deployed, you can invoke it with an HTTP call:

```sh
curl -X POST https://<function app name>.azurewebsites.net/api/publish
```

## Hosting and CDN

Although in the previous section we suggested using an Azure storage account to host your website, you can publish the files through any solution, including services of hosting providers.

You can also front the files with a Content Delivery Network (CDN) to reduce page loading times. We recommend using [Azure CDN](https://azure.microsoft.com/services/cdn/).

## Next steps

- [Architectural concepts for the developer portal](developer-portal-architectural-concepts.md)
