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
>You can use the resources that you created as prerequisites for other Azure Machine Learning service tutorials and how-to articles.


If you don't plan to use the resources that you created, delete them so you don't incur any charges.

### Delete resources

To delete experiments, web services, or datasets that you created, select them, and then select **Delete**.

![Delete experiments](./media/aml-ui-cleanup/delete-experiment.png)

### Delete compute target

To avoid extra charges, the compute target used to run experiments automatically scales to `0` nodes when it's not being used.

To delete the compute resource altogether, select it in the **Compute** section of your workspace in the [Azure portal](https://portal.azure.com) and then select **Delete**.

![Delete compute target](./media/aml-ui-cleanup/delete-compute-target.png)