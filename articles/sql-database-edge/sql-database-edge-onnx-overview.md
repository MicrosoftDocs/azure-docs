---
title: Machine Learning and Artificial Intelligence with ONNX in SQL Database Edge | Microsoft Docs
description: Learn about Machine Learning and Artificial Intelligence with ONNX in SQL Database Edge
keywords: deploy sql database edge
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: stevestein
ms.author: sourabha
ms.reviewer: sstein
ms.date: 10/16/2019
---

# Machine Learning and Artificial Intelligence with ONNX in SQL Database Edge

Machine Learning in Azure SQL Database Edge Preview supports models in the [Open Neural Network Exchange (ONNX)](https://onnx.ai/) format. ONNX is an open format for ML models, allowing you to interchange models between various [ML frameworks and tools](https://onnx.ai/supported-tools).

There are several ways that you can obtain a model in the ONNX format, including:

- [ONNX Model Zoo](https://github.com/onnx/models): Contains several pre-trained ONNX models for different types of tasks. Download a version that is supported by Windows ML and you are ready to go!

- [Native export from ML training frameworks](https://onnx.ai/supported-tools): Several training frameworks support native export functionality to ONNX, like Chainer, Caffee2, and PyTorch, allowing you to save your trained model to specific versions of the ONNX format. In addition, services such as [Azure Machine Learning Service](https://azure.microsoft.com/services/machine-learning-service/) and [Azure Custom Vision](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier) also provide native ONNX export.
    - To learn how to train and export an ONNX model in the cloud using Custom Vision, check out [Tutorial: Use an ONNX model from Custom Vision with Windows ML (preview)](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/custom-vision-onnx-windows-ml).

- [Convert existing models using WinMLTools](https://docs.microsoft.com/windows/ai/windows-ml/convert-model-winmltools): This Python package allows models to be converted from several training framework formats to ONNX. As a developer, you can specify which version of ONNX you would like to convert your model to, depending on which builds of Windows your application targets. If you are not familiar with Python, you can use [Windows ML's UI-based Dashboard](https://github.com/Microsoft/Windows-Machine-Learning/tree/master/Tools/WinMLDashboard) to easily convert your models with just a few clicks.

> [!IMPORTANT]
> Not all ONNX versions are supported by SQL Server Machine Learning Services. We only support predicting numeric data types through the ONNX model and we will be introducing the support for other data types in the future.

Once you have an ONNX model, you'll deploy the model in Azure SQL Database Edge, and then you can use native scoring with the [PREDICT T-SQL function](/sql/advanced-analytics/sql-native-scoring/).

## Next steps

- For pricing and availability-related details, see [Azure SQL Database Edge](https://azure.microsoft.com/services/sql-database-edge/).
- Request to enable Azure SQL Database Edge for your subscription.
- To get started, see the following:
  - [Deploy SQL Database Edge through Azure portal](sql-database-edge-deploy-portal.md)
  - [Deploy a streaming job for Azure SQL Database Edge](sql-database-edge-stream-analytics.md)