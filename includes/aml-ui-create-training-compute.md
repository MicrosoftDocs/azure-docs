---
title: "include file"
description: "include file"
services: machine-learning
author: peterclu
ms.service: machine-learning
ms.author: peterlu
manager: cgronlund
ms.custom: "include file"
ms.topic: "include"
ms.date: 10/09/2019
---

A pipeline runs on a compute target, which is a compute resource that's attached to your workspace. After you create a compute target, you can reuse it for future runs.

1. Select **Run** at the top of the canvas to run the pipeline.

1. When the **Settings** pane appears, select **Select compute target**.

    If you already have an available compute target, you can select it to run this pipeline.

    > [!NOTE]
    > The designer can run experiments only on Azure Machine Learning Compute targets. Other compute targets won't be shown.

1. Enter a name for the compute resource.

1. Select **Save**.

    ![Setup compute target](./media/aml-ui-create-training-compute/set-compute.png)

1. Select **Run**.

1. In the **Set up pipeline run** dialog box, select **+ New experiment** for the **Experiment**.

    > [!NOTE]
    > Experiments group similar pipeline runs together. If you run a pipeline multiple times, you can select the same experiment for successive runs.

    1. Enter a descriptive name for **Experiment Name**.

    1. Select **Run**.
    
    You can view run status and details at the top right of the canvas.

    > [!NOTE]
    > It takes approximately five minutes to create a compute resource. After the resource is created, you can reuse it and skip this wait time for future runs.
    >
    > The compute resource autoscales to zero nodes when it's idle to save cost. When you use it again after a delay, you might experience approximately five minutes of wait time while it scales back up.
