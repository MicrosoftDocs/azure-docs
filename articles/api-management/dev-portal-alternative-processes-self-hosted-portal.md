---
title: Alternative processes for self-hosted portal
titleSuffix: Azure API Management
description: Learn about alternative processes you can use when you self-host a portal.
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Alternative processes for self-hosted portal

There are several new processes you can explore when you self-host a portal. You can:

* Edit content directly in files instead of having to use the visual editor.

* Use your own Content Management System (CMS) to manage your content.

* Use production builds of the designer and the publisher.

* Use an Azure Function App to publish your portal.

* Front the files of your portal with a Content Delivery Network (CDN) to reduce page loading times.

This article provides information on each of the processes.

## Edit content through files, not visual editor

The [self-hosting tutorial](dev-portal-self-host-portal.md) described the workflow of editing content and customizing the portal through the built-in visual editor. You can also use REST API to fetch the underlying data files, edit them directly in a text editor, and upload new versions through API calls.

## Bring your own CMS

By default, the portal stores, saves, and retrieves its content using an API Management service.

You can set up your portal deployment to use a different data source. For example, use a headless CMS to manage your content.

## Build for production

If you would like to host the development environment of the portal online for collaboration purposes, use production builds of the designer and the publisher. Production builds bundle the files, exclude source maps, and so on.

Run this command to create a bundle in the `./dist/designer` directory:

```console
npm run build-designer
```

The result is a single page application. You can still deploy it to a static web host like a Azure Blob Storage Static Website.

Similarly, run this command to place a compiled and optimized publisher in the `./dist/publisher` folder:

```console
npm run build-publisher
```

## Use a Function App to publish the portal

![API Management developer portal development - publish external portal](media/dev-portal/readme-dev-publish-external.png)

Running the publishing step in the cloud is an alternative to executing it locally.

To implement it with an Azure Function App, first you'll need to:

- [Create an Azure Function](../azure-functions/functions-create-first-azure-function.md).

    Make sure it's a JavaScript language Function.

- Install Azure Functions Core Tools:

    ```console
    npm install –g azure-function-core-tools
    ```

### Configure output storage

You'll upload the content directly to website hosting ("$web" container of output storage), instead of a local folder. Account for it in the `./src/config.publish.json` file:

```json
{
   ...
   "outputBlobStorageContainer": "$web",
   "outputBlobStorageConnectionString": "DefaultEndpointsProtocol=...",
   ...
}
```

### Build and deploy the Function App

There's a sample HTTP Trigger Function in the `./examples` folder. To build it and place it in `./dist/function`:

1. Run this command:

    ```console
    npm run build-function
    ```
1. Sign in to Azure:

    ```console
    az login
    ```

1. Go to the function:

    ```console
    cd ./dist/function
    ```

1. Deploy the function app:

    ```console
    func azure functionapp publish <function app name>
    ```

1. Once it's deployed, invoke it with a cURL HTTP call:

    ```console
    curl -X POST https://<function app name>.azurewebsites.net/api/publish
    ```

## Hosting and CDN

Although, in the previous section we suggested using Azure Storage Account as a hosting for your website, you can publish the files through any solution, including services of hosting providers.

You can also front the files with a CDN to reduce page loading times. We recommend using [Azure CDN](https://azure.microsoft.com/services/cdn/).

## Next steps

- [Architectural concepts](dev-portal-architectural-concepts.md)
