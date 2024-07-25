---
title: Include file
description: Include file
author: sdgilley
ms.service: machine-learning
services: machine-learning
ms.topic: include
ms.date: 03/22/2023
ms.author: sgilley
ms.custom: include file
---

## Set your kernel and open in Visual Studio Code (VS Code)

1. On the top bar above your opened notebook, create a compute instance if you don't already have one.

    :::image type="content" source="../media/tutorial-azure-ml-in-a-day/create-compute.png" alt-text="Screenshot shows how to create a compute instance." lightbox="../media/tutorial-azure-ml-in-a-day/create-compute.png":::

1. If the compute instance is stopped, select **Start compute** and wait until it's running.

    :::image type="content" source="../media/tutorial-azure-ml-in-a-day/start-compute.png" alt-text="Screenshot shows how to start a stopped compute instance." lightbox="../media/tutorial-azure-ml-in-a-day/start-compute.png":::

1. Make sure that the kernel, found on the top right, is `Python 3.10 - SDK v2`. If not, use the dropdown to select this kernel.

    :::image type="content" source="../media/tutorial-azure-ml-in-a-day/set-kernel.png" alt-text="Screenshot shows how to set the kernel." lightbox="../media/tutorial-azure-ml-in-a-day/set-kernel.png":::

1. If you see a banner that says you need to be authenticated, select **Authenticate**.

1. You can run the notebook here, or open it in VS Code for a full integrated development environment (IDE) with the power of Azure Machine Learning resources. Select **Open in VS Code**, then select either the web or desktop option.  When launched this way, VS Code is attached to your compute instance, the kernel, and the workspace file system.

    :::image type="content" source="../media/tutorial-azure-ml-in-a-day/open-vs-code.png" alt-text="Screenshot shows how to open the notebook in VS Code." lightbox="../media/tutorial-azure-ml-in-a-day/open-vs-code.png":::

> [!Important]
> The rest of this tutorial contains cells of the tutorial notebook. Copy/paste them into your new notebook, or switch to the notebook now if you cloned it.