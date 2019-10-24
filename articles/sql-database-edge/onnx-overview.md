---
title: Machine learning and AI with ONNX in Azure SQL Database Edge Preview | Microsoft Docs
description: Machine learning in Azure SQL Database Edge Preview supports models in the Open Neural Network Exchange (ONNX) format. ONNX is an open format you can use to interchange models between various machine learning frameworks and tools.
keywords: deploy sql database edge
services: sql-database-edge
ms.service: sql-database-edge
#ms.subservice: machine-learning
ms.topic: conceptual
author: ronychatterjee
ms.author: achatter
ms.reviewer: davidph
ms.date: 11/04/2019
---

# Machine learning and AI with ONNX in SQL Database Edge Preview

Machine learning in Azure SQL Database Edge Preview supports models in the [Open Neural Network Exchange (ONNX)](https://onnx.ai/) format. ONNX is an open format you can use to interchange models between various [machine learning frameworks and tools](https://onnx.ai/supported-tools).

## Supported tool kits

ONNXMLTools enables you to convert models from different machine learning tool kits to an ONNX model. Currently, for numeric data types and single column inputs, the following tool kits are supported:

* [scikit-learn](https://github.com/onnx/sklearn-onnx)
* [Tensorflow](https://github.com/onnx/tensorflow-onnx)
* [Keras](https://github.com/onnx/keras-onnx)
* [CoreML](https://github.com/onnx/onnxmltools)
* [Spark ML (experimental)](https://github.com/onnx/onnxmltools/tree/master/onnxmltools/convert/sparkml)
* [LightGBM](https://github.com/onnx/onnxmltools)
* [libsvm](https://github.com/onnx/onnxmltools)
* [XGBoost](https://github.com/onnx/onnxmltools)

## Get ONNX models

There are several ways that you can obtain a model in the ONNX format:

- [ONNX Model Zoo](https://github.com/onnx/models): Contains several pre-trained ONNX models for different types of tasks. You can download and use versions that are supported by Windows Machine Learning.

- [Native export from machine learning training frameworks](https://onnx.ai/supported-tools): Several training frameworks support native export functionality to ONNX, which allows you to save your trained model to a specific version of the ONNX format. For example, Chainer, Caffee2, and PyTorch. In addition, services such as [Azure Machine Learning Service](https://azure.microsoft.com/services/machine-learning-service/) and [Azure Custom Vision](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier) also provide native ONNX export.

  - To learn how to train and export an ONNX model in the cloud using Custom Vision, see [Tutorial: Use an ONNX model from Custom Vision with Windows ML (preview)](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/custom-vision-onnx-windows-ml).

- [Convert existing models using WinMLTools](https://docs.microsoft.com/windows/ai/windows-ml/convert-model-winmltools): This Python package allows models to be converted from several training framework formats to ONNX. You can specify which version of ONNX you would like to convert your model to, depending on which builds of Windows your application targets. If you are not familiar with Python, you can use the [Windows Machine Learning UI-based Dashboard](https://github.com/Microsoft/Windows-Machine-Learning/tree/master/Tools/WinMLDashboard) to  convert your models.

> [!IMPORTANT]
> Not all ONNX versions are supported by Azure SQL database Edge. Only predicting numeric data types through the ONNX model is currently supported.

Once you have an ONNX model, you can deploy the model in Azure SQL Database Edge. You can then use [native scoring with the PREDICT T-SQL function](/sql/advanced-analytics/sql-native-scoring/).

## Limitations

Currently, this support is limited to models with **numeric data types**:

- [int and bigint](https://docs.microsoft.com/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql5)
- [real and float](https://docs.microsoft.com/sql/t-sql/data-types/float-and-real-transact-sql).
  
Other numeric types can be converted to supported types by using CAST and CONVERT [CAST and CONVERT](https://docs.microsoft.com/sql/t-sql/functions/cast-and-convert-transact-sql).

The model inputs should be structured so that each input to the model corresponds to a single column in a table. For example, if you are using a pandas dataframe to train a model, then each input should be a separate column to the model.

## Next steps

- [Deploy SQL Database Edge through Azure portal](deploy-portal.md)
- [Deploy an ONNX model on Azure SQL Database Edge Preview](deploy-onnx.md)