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


If you don't plan to use the resources you created, delete them, so you don't incur any charges.

### Delete resources

Delete experiments, web services, or datasets you created by selecting them, and then selecting **Delete**.

![Delete experiments](./media/aml-ui-cleanup/delete-experiment.png)

### Delete compute target

The compute target used to run experiments autoscales to `0` nodes when not in use to avoid extra charges.

To delete the compute resource altogether, select it in the **Compute** section of your workspace in the [Azure portal](https://portal.azure.com).

![Delete compute target](./media/aml-ui-cleanup/delete-compute-target.png)