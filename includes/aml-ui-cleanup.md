---
title: "include file"
description: "include file"
services: machine-learning
ms.service: machine-learning
ms.custom: "include file"
ms.topic: "include"
author: sgilley
ms.author: sgilley
ms.date: 05/06/2019
---

>[!IMPORTANT]
>The resources you created can be used as prerequisites to other Azure Machine Learning service tutorials and how-to articles. 


### Delete entire resource group

If you don't plan to use the resource group you created, delete it so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.
 
   ![Delete in the Azure portal](./media/aml-ui-cleanup/delete-resources.png)

1. From the list, select the resource group you created.

1. On the far right, select **...**.

1. Select **Delete**.

Deleting the resource group also deletes all resources you created in the visual interface.  

### Delete compute target

The compute target used to run experiments autoscales to **0** nodes when not in use to avoid extra charges.

To delete the compute resource altogether, select it in the **Compute** section of your workspace in the [Azure portal](https://portal.azure.com).

![Delete compute target](./media/aml-ui-cleanup/delete-compute-target.png)

### Delete visual interface individual assets

On the visual interface webpage, delete individual assets by selecting them, and then selecting the delete button.

![Delete experiments](./media/aml-ui-cleanup/delete-experiment.png)
