---
title: Machine learning and AI with ONNX in Azure SQL Edge
description: Machine learning in Azure SQL Edge supports models in the Open Neural Network Exchange (ONNX) format. ONNX is an open format you can use to interchange models between various machine learning frameworks and tools.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: hudequei, randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.subservice: machine-learning
ms.topic: conceptual
keywords: deploy SQL Edge
---
# Machine learning and AI with ONNX in SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Machine learning in Azure SQL Edge supports models in the [Open Neural Network Exchange (ONNX)](https://onnx.ai/) format. ONNX is an open format you can use to interchange models between various [machine learning frameworks and tools](https://onnx.ai/supported-tools).

## Overview

To infer machine learning models in Azure SQL Edge, you first need to get a model. This can be a pretrained model or a custom model trained with your framework of choice. Azure SQL Edge supports the ONNX format and you need to convert the model to this format. There should be no effect on model accuracy, and once you have the ONNX model, you can deploy the model in Azure SQL Edge and use [native scoring with the PREDICT T-SQL function](/sql/advanced-analytics/sql-native-scoring/).

## Get ONNX models

To obtain a model in the ONNX format:

- **Model Building Services**: Services such as the [automated Machine Learning feature in Azure Machine Learning](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb) and [Azure Custom Vision Service](../ai-services/custom-vision-service/getting-started-build-a-classifier.md) support directly exporting the trained model in the ONNX format.

- [**Convert and/or export existing models**](https://github.com/onnx/tutorials#converting-to-onnx-format): Several training frameworks (for example, [PyTorch](https://pytorch.org/docs/stable/onnx.html), Chainer, and Caffe2) support native export functionality to ONNX, which allows you to save your trained model to a specific version of the ONNX format. For frameworks that don't support native export, there are standalone ONNX Converter installable packages that enable you to convert models trained from different machine learning frameworks to the ONNX format.

     **Supported frameworks**
   * [PyTorch](http://pytorch.org/docs/master/onnx.html)
   * [Tensorflow](https://github.com/onnx/tensorflow-onnx)
   * [Keras](https://github.com/onnx/keras-onnx)
   * [Scikit-learn](https://github.com/onnx/sklearn-onnx)
   * [CoreML](https://github.com/onnx/onnxmltools)

    For the full list of supported frameworks and examples, see [Converting to ONNX format](https://github.com/onnx/tutorials#converting-to-onnx-format).

## Limitations

Currently, not all ONNX models are supported by Azure SQL Edge. The support is limited to models with **numeric data types**:

- [int and bigint](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql)
- [real and float](/sql/t-sql/data-types/float-and-real-transact-sql).

Other numeric types can be converted to supported types by using [CAST and CONVERT](/sql/t-sql/functions/cast-and-convert-transact-sql).

The model inputs should be structured so that each input to the model corresponds to a single column in a table. For example, if you're using a pandas dataframe to train a model, then each input should be a separate column to the model.

## Next steps

- [Deploy SQL Edge through Azure portal](deploy-portal.md)
- [Deploy an ONNX model on Azure SQL Edge](deploy-onnx.md)
