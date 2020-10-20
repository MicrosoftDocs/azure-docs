---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 10/20/2020
ms.author: tomfitz
---

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select your Cloud Shell resource group. The name pattern is `cloud-shell-storage-<region>`.

   ![Select resource group](./media/resource-manager-cloud-shell-deploy/select-cloud-shell-resource-group.png)

1. Select the storage account for your Cloud Shell.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/cloud-shell-storage.png" alt-text="Select storage account":::

1. Select **File Shares**.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/files-shares.png" alt-text="Select file shares":::

1. Select the default file share for your cloud shell. The file share has the name format of `cs-<user>-<domain>-com-<uniqueGuid>`.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/select-file-share.png" alt-text="Default file share":::

1. Add a new directory to hold your templates. Select that directory.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/add-directory.png" alt-text="Add directory":::

1. Select **Upload**.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/upload-template.png" alt-text="Upload template":::

1. Find and upload your template.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/select-template.png" alt-text="Select template":::

1. Open the Cloud Shell prompt.

   :::image type="content" source="./media/resource-manager-cloud-shell-deploy/open-cloud-shell.png" alt-text="Open Cloud Shell":::
