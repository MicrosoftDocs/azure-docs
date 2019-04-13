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


### Delete everything

If you don't plan to use anything you created, delete the entire resource group so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left.
 
   ![Delete in the Azure portal](./media/aml-ui-cleanup/delete-resources.png)

1. From the list, select the resource group you created.

1. On the far right, select the **ellipsis (...)**.

1. Select **Delete resource group**.

Deleting the resource group also deletes all resources you created in the visual interface.  

### Delete only compute target

The compute target you created here **automatically autoscales** to zero nodes when not in use to minimize charges.  But, if you want to delete the compute target, use these steps:

1. In the [Azure portal](https://portal.azure.com), open your workspace.

    ![Delete compute target](./media/aml-ui-cleanup/delete-compute-target.png)

1. In the **Compute** section of your workspace, select the resource.

1. Select **Delete**.

### Delete individual assets

In the visual interface where you created your experiment, delete individual assets by selecting them, and then selecting the delete button.

![Delete experiments](./media/aml-ui-cleanup/delete-experiment.png)
