---
title: IDE integration with Azure ML Workbench | Microsoft Docs
description: This article details how to integrate Azure ML Workbench with your IDE .
services: machine-learning
author: ahgyger
ms.author: ahgyger
manager: hning86
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/07/2017
---
# IDE Integration with Azure ML Workbench

## Prerequisites
To step through this how-to guide, you need one of these IDE:
- [VS Code](https://code.visualstudio.com/Download)
- [PyCharm](https://www.jetbrains.com/pycharm/download)

You also need to have an Azure Machine Learning (ML) experimentation account and the Azure ML Workbench.

## Configure Project IDE 
In Azure ML Workbench, click on **File** > **Configure Project IDE**. 

![Configure Project IDE](/media/ide-integration/Configure.PNG)

This opens a form with two fields:
- Name: Name of the IDE. 
- Execution Path: The path to your IDE. 

![Configure Project IDE Form](/media/ide-integration/ConfigureIDEPath.PNG)

## Open a Project with an IDE
Once you have a project open in Azure ML Workbench, a new context menu will be activated allowing to open the project in the IDE you have previously configured. Click on **File** > **Open Project (...)** to open the project folder in the IDE and to configure the IDE embeded terminal to interact with Azure ML Command Line Interface (CLI).

![Open Project in IDE](/media/ide-integration/Open-with-code.PNG)

## Next steps
For information about getting started with Azure ML Workbench see [Quickstart: Classifying Iris Flower Dataset](quick-start-iris.md).
