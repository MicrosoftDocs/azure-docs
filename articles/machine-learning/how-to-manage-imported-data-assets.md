---
title: Manage imported data assets (preview)
titleSuffix: Azure Machine Learning
description: Learn how to manage imported data assets also known as edit autodeletion.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: ambadal
author: AmarBadal
ms.reviewer: franksolomon
ms.date: 06/19/2023
ms.custom: data4ml, devx-track-azurecli
---

# Manage imported data assets (preview)
[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you'll learn how to manage imported data assets from a life-cycle perspective. We learn how to modify or update auto delete settings on the data assets imported into a managed datastore (`workspacemanagedstore`) that Microsoft manages for the customer.

> [!NOTE]
> Auto delete settings capability, or lifecycle management, is currently offered only through the imported data assets in managed datastore, also known as `workspacemanagedstore`.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Modifying auto delete settings

You can change the auto delete setting value or condition as shown in these code samples:

# [Azure CLI](#tab/cli)

```cli
> az ml data update -n <my_imported_ds> -v <version_number> --set auto_delete_setting.value='45d'

> az ml data update -n <my_imported_ds> -v <version_number> --set auto_delete_setting.condition='created_greater_than'

```

# [Python SDK](#tab/python)
```python
from azure.ai.ml.entities import Data 
from azure.ai.ml.constants import AssetTypes 

name='<my_imported_ds>'
version='<version_number>'
type='mltable'
auto_delete_setting = AutoDeleteSetting(
    condition='created_greater_than', value='45d'
) 
my_data=Data(name=name,version=version,type=type, auto_delete_setting=auto_delete_setting)

ml_client.data.create_or_update(my_data) 

```

# [Studio](#tab/azure-studio)

These steps describe how to modify the auto delete settings of an imported data asset in `workspacemanageddatastore` in the Azure Machine Learning studio:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. As shown in the next screenshot, under **Assets** in the left navigation, select **Data**. At the **Data assets** tab, select an imported data asset located in the **workspacemanageddatastore**

   :::image type="content" source="./media/how-to-manage-imported-data-assets/data-assets-list.png" lightbox="./media/how-to-manage-imported-data-assets/data-assets-list.png" alt-text="Screenshot highlighting the imported data asset name in workspace managed datastore in the Data assets tab.":::

1. As shown in the next screenshot, the details page of the data asset has an **Auto delete setting** property. This property is currently active on the data asset. Verify that you have the correct **Version:** of the data asset selected in the drop-down, and select the pencil icon to edit the property.

   :::image type="content" source="./media/how-to-manage-imported-data-assets/data-assets-details.png" lightbox="./media/how-to-manage-imported-data-assets/data-assets-details.png" alt-text="Screenshot showing the edit of the auto delete setting.":::

1. To change the auto delete **Condition** setting, select **Created greater than**, and change **Value** to any numerical value. Then, select **Save** as shown in the next screenshot:

   :::image type="content" source="./media/how-to-manage-imported-data-assets/edit-managed-data-asset-details.png" lightbox="./media/how-to-manage-imported-data-assets/edit-managed-data-asset-details.png" alt-text="Screenshot that shows the managed data asset auto delete settings choices.":::

   > [!NOTE]
   > At this time, the supported values range from 1 day to 3 years.

1. After a successful edit, you'll return to the data asset detail page. This page shows the updated values in **Auto delete settings** property box, as shown in the next screenshot:

   :::image type="content" source="./media/how-to-manage-imported-data-assets/new-managed-data-asset-details.png" lightbox="./media/how-to-manage-imported-data-assets/new-managed-data-asset-details.png" alt-text="Screenshot showing the managed data asset auto delete settings.":::

   > [!NOTE]
   > The auto delete setting is available only on imported data assets in a workspacemanaged datastore, as shown in the above screenshot.

---

## Deleting/removing auto delete settings

If you don't want a specific data asset version to become part of life-cycle management, you can remove a previously configured auto delete setting.

# [Azure CLI](#tab/cli)

```cli
> az ml data update -n <my_imported_ds> -v <version_number> --remove auto_delete_setting

```

# [Python SDK](#tab/python)
```python
from azure.ai.ml.entities import Data 
from azure.ai.ml.constants import AssetTypes 

name='<my_imported_ds>'
version='<version_number>'
type='mltable'
 
my_data=Data(name=name,version=version,type=type, auto_delete_setting=None)

ml_client.data.create_or_update(my_data) 

```
# [Studio](#tab/azure-studio)

These steps describe how to delete or clear the auto delete settings of an imported data asset in `workspacemanageddatastore` in the Azure Machine Learning studio:

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. As shown in this screenshot, under **Assets** in the left navigation, select **Data**. On the **Data assets** tab, select an imported data asset located in the **workspacemanageddatastore**:

   :::image type="content" source="./media/how-to-manage-imported-data-assets/data-assets-list.png" lightbox="./media/how-to-manage-imported-data-assets/data-assets-list.png" alt-text="Screenshot highlighting the imported data asset name in workspace managed datastore in the Data assets tab.":::

1. As shown in the next screenshot, the details page of the data asset has an **Auto delete setting** property. This property is currently active on the data asset. Verify that you have the correct **Version:** of the data asset selected in the drop-down, and select the pencil icon to edit the property.

   :::image type="content" source="./media/how-to-manage-imported-data-assets/data-assets-details.png" lightbox="./media/how-to-manage-imported-data-assets/data-assets-details.png" alt-text="Screenshot showing the edit of the auto delete setting.":::

1. To delete or clear the auto delete setting, select the **Clear auto delete setting** trash can icon at the bottom of the page, as shown in this screenshot:

   :::image type="content" source="./media/how-to-manage-imported-data-assets/clear-managed-data-asset-details.png" lightbox="./media/how-to-manage-imported-data-assets/clear-managed-data-asset-details.png" alt-text="Screenshot showing the managed data asset auto delete settings choices.":::

1. After a successful deletion, you'll return to the data asset detail page. This page shows the **Auto delete settings** property box, which displays **None**, as shown in this screenshot:

   :::image type="content" source="./media/how-to-manage-imported-data-assets/cleared-managed-data-asset-details.png" lightbox="./media/how-to-manage-imported-data-assets/cleared-managed-data-asset-details.png" alt-text="This screenshot shows the managed data asset auto delete settings.":::
---

## Query on the configured auto delete settings

This Azure CLI code sample shows the data assets with certain conditions, or with values configured in the **auto delete** settings:

```cli
> az ml data list --query '[?auto_delete_setting.\"condition\"==''created_greater_than'']'

> az ml data list --query '[?auto_delete_setting.\"value\"==''30d'']'
```

## Next steps

- [Access data in a job](how-to-read-write-data-v2.md#access-data-in-a-job)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md)
