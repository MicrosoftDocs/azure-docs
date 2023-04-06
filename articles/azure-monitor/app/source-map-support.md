---
title: Source map support for JavaScript applications - Azure Monitor Application Insights
description: Learn how to upload source maps to your Azure Storage account blob container by using Application Insights.
ms.topic: conceptual
ms.date: 06/23/2020
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Source map support for JavaScript applications

Application Insights supports the uploading of source maps to your Azure Storage account blob container. You can use source maps to unminify call stacks found on the **End-to-end transaction details** page. You can also use source maps to unminify any exception sent by the [JavaScript SDK][ApplicationInsights-JS] or the [Node.js SDK][ApplicationInsights-Node.js].

![Screenshot that shows selecting the option to unminify a call stack by linking with a storage account.](./media/source-map-support/details-unminify.gif)

## Create a new storage account and blob container

If you already have an existing storage account or blob container, you can skip this step.

1. [Create a new storage account][create storage account].
1. [Create a blob container][create blob container] inside your storage account. Set **Public access level** to **Private** to ensure that your source maps aren't publicly accessible.

    > [!div class="mx-imgBorder"]
    >![Screenshot that shows setting the container access level to Private.](./media/source-map-support/container-access-level.png)

## Push your source maps to your blob container

Integrate your continuous deployment pipeline with your storage account by configuring it to automatically upload your source maps to the configured blob container.

You can upload source maps to your Azure Blob Storage container with the same folder structure they were compiled and deployed with. A common use case is to prefix a deployment folder with its version, for example, `1.2.3/static/js/main.js`. When you unminify via an Azure blob container called `sourcemaps`, the pipeline tries to fetch a source map located at `sourcemaps/1.2.3/static/js/main.js.map`.

### Upload source maps via Azure Pipelines (recommended)

If you're using Azure Pipelines to continuously build and deploy your application, add an [Azure file copy][azure file copy] task to your pipeline to automatically upload your source maps.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows adding an Azure file copy task to your pipeline to upload your source maps to Azure Blob Storage.](./media/source-map-support/azure-file-copy.png)

## Configure your Application Insights resource with a source map storage account

You have two options for configuring your Application Insights resource with a source map storage account.

### End-to-end transaction details tab

From the **End-to-end transaction details** tab, select **Unminify**. Configure your resource if it's unconfigured.

1. In the Azure portal, view the details of an exception that's minified.
1. Select **Unminify**.
1. If your resource isn't configured, configure it.

### Properties tab

To configure or change the storage account or blob container that's linked to your Application Insights resource:

1. Go to the **Properties** tab of your Application Insights resource.
1. Select **Change source map Blob Container**.
1. Select a different blob container as your source map container.
1. Select **Apply**.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows reconfiguring your selected Azure blob container on the Properties pane.](./media/source-map-support/reconfigure.png)

## Troubleshooting

This section offers troubleshooting tips for common issues.

### Required Azure role-based access control settings on your blob container

Any user on the portal who uses this feature must be assigned at least as a [Storage Blob Data Reader][storage blob data reader] to your blob container. Assign this role to anyone who might use the source maps through this feature.

> [!NOTE]
> Depending on how the container was created, this role might not have been automatically assigned to you or your team.

### Source map not found

1. Verify that the corresponding source map is uploaded to the correct blob container.
1. Verify that the source map file is named after the JavaScript file it maps to and uses the suffix `.map`.
   
   For example, `/static/js/main.4e2ca5fa.chunk.js` searches for the blob named `main.4e2ca5fa.chunk.js.map`.
1. Check your browser's console to see if any errors were logged. Include this information in any support ticket.

## Next steps

[Azure file copy task](/azure/devops/pipelines/tasks/deploy/azure-file-copy)

<!-- Remote URLs -->
[create storage account]: ../../storage/common/storage-account-create.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=azure-portal
[create blob container]: ../../storage/blobs/storage-quickstart-blobs-portal.md
[storage blob data reader]: ../../role-based-access-control/built-in-roles.md#storage-blob-data-reader
[ApplicationInsights-JS]: https://github.com/microsoft/applicationinsights-js
[ApplicationInsights-Node.js]: https://github.com/microsoft/applicationinsights-node.js
[azure file copy]: https://aka.ms/azurefilecopyreadme
