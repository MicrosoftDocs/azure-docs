---
title: Manage imported data assets (preview)
titleSuffix: Azure Machine Learning
description: Learn how to manage imported data assets also known as edit auto-deletion.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: ambadal
author: AmarBadal
ms.reviewer: franksolomon
ms.date: 04/30/2023
ms.custom: data4ml
---

# Manage imported data assets (preview)
[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v2](how-to-import-data-assets.md)

In this article, learn how to manage imported data assets from life-cycle point of view. We learn how to modify or update auto-delete settings on the data assets that are imported on to a managed datastore (`workspacemanagedstore`) that Microsoft manages for the customer.

> [!NOTE] 
> Auto-delete settings capability or lifecycle management is offered currently only on the imported data assets in managed datastore aka `workspacemanagedstore`.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Modifying auto delete settings

You can change the auto-delete setting value or condition
# [Azure CLI](#tab/cli)

```cli
> az ml data update -n <my_imported_ds> -v <version_number> --set auto_delete_setting.value='45d'

> az ml data update -n <my_imported_ds> -v <version_number> --set auto_delete_setting.condition='created_greater_than'

```

# [Python SDK](#tab/Python-SDK)
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

---

## Deleting/removing auto delete settings

You can remove a previously configured auto-delete setting.
 
# [Azure CLI](#tab/cli)

```cli
> az ml data update -n <my_imported_ds> -v <version_number> --remove auto_delete_setting


```

# [Python SDK](#tab/Python-SDK)
```python
from azure.ai.ml.entities import Data  
from azure.ai.ml.constants import AssetTypes  

name='<my_imported_ds>'
version='<version_number>'
type='mltable'
 
my_data=Data(name=name,version=version,type=type, auto_delete_setting=None)

ml_client.data.create_or_update(my_data) 

```

---

## Query on the configured auto delete settings

You can view and list the data assets with certain conditions or with values configured in the "auto-delete" settings, as shown in this Azure CLI code sample:

```cli
> az ml data list --query '[?auto_delete_setting.\"condition\"==''created_greater_than'']'

> az ml data list --query '[?auto_delete_setting.\"value\"==''30d'']'
```

## Next steps

- [Read data in a job](how-to-read-write-data-v2.md#read-data-in-a-job)
- [Working with tables in Azure Machine Learning](how-to-mltable.md)
- [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md)