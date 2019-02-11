---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 01/30/2019
ms.author: tomfitz
---
## Deploy template from Cloud Shell

You can use [Cloud Shell](../articles/cloud-shell/overview.md) to deploy your template. To deploy an external template, provide the URI of the template exactly as you would for any external deployment. To deploy a local template, you must first load your template into the storage account for your Cloud Shell. This section describes how to load the template to your cloud shell account, and deploy it as a local file. If you haven't used Cloud Shell, see [Overview of Azure Cloud Shell](../articles/cloud-shell/overview.md) for information about setting it up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select your Cloud Shell resource group. The name pattern is `cloud-shell-storage-<region>`.

   ![Select resource group](./media/resource-manager-cloud-shell-deploy/select-cs-resource-group.png)

1. Select the storage account for your Cloud Shell.

   ![Select storage account](./media/resource-manager-cloud-shell-deploy/select-storage.png)

1. Select **Blobs**.

   ![Select blobs](./media/resource-manager-cloud-shell-deploy/select-blobs.png)

1. Select **+ Container**.

   ![Add container](./media/resource-manager-cloud-shell-deploy/add-container.png)

1. Give your container a name and an access level. The sample template in this article contains no sensitive information, so allow anonymous read access. Select **OK**.

   ![Provide container values](./media/resource-manager-cloud-shell-deploy/provide-container-values.png)

1. Select the container you created.

   ![Select new container](./media/resource-manager-cloud-shell-deploy/select-container.png)

1. Select **Upload**.

   ![Upload blob](./media/resource-manager-cloud-shell-deploy/upload-blob.png)

1. Find and upload your template.

   ![Upload file](./media/resource-manager-cloud-shell-deploy/find-and-upload-template.png)

1. After it has uploaded, select the template.

   ![Select new template](./media/resource-manager-cloud-shell-deploy/select-new-template.png)

1. Copy the URL.

   ![Copy URL](./media/resource-manager-cloud-shell-deploy/copy-url.png)

1. Open the prompt.

   ![Open Cloud Shell](./media/resource-manager-cloud-shell-deploy/start-cloud-shell.png)
