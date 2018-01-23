## Deploy template from Cloud Shell

You can use [Cloud Shell](../articles/cloud-shell/overview.md) to deploy your template. However, you must first load your template into the file share for your Cloud Shell. If you have not used Cloud Shell, see [Overview of Azure Cloud Shell](../articles/cloud-shell/overview.md) for information about setting it up.

1. Log in to the [Azure portal](https://portal.azure.com).

1. Select your Cloud Shell resource group. The name pattern is `cloud-shell-storage-<region>`.

   ![Select resource group](./media/resource-manager-cloud-shell-deploy/select-cs-resource-group.png)

1. Select the storage account for your Cloud Shell.

   ![Select storage account](./media/resource-manager-cloud-shell-deploy/select-storage.png)

1. Select **Files**.

   ![Select files](./media/resource-manager-cloud-shell-deploy/select-files.png)

1. Select the file share for Cloud Shell. The name pattern is `cs-<user>-<domain>-com-<uniqueGuid>`.

   ![Select file share](./media/resource-manager-cloud-shell-deploy/select-file-share.png)

1. Select **Add directory**.

   ![Add directory](./media/resource-manager-cloud-shell-deploy/select-add-directory.png)

1. Name it **templates**, and select **Okay**.

   ![Name directory](./media/resource-manager-cloud-shell-deploy/name-templates.png)

1. Select your new directory.

   ![Select directory](./media/resource-manager-cloud-shell-deploy/select-templates.png)

1. Select **Upload**.

   ![Select upload](./media/resource-manager-cloud-shell-deploy/select-upload.png)

1. Find and upload your template.

   ![Upload file](./media/resource-manager-cloud-shell-deploy/upload-files.png)

1. Open the prompt.

   ![Open Cloud Shell](./media/resource-manager-cloud-shell-deploy/start-cloud-shell.png)
