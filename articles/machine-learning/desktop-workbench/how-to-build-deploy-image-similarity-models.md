---
title: Build and deploy an image similarity model using Azure Machine Learning Package for Computer Vision. 
description: Learn how to build, train, test and deploy a computer vision image similarity model using the Azure Machine Learning Package for Computer Vision. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: jmartens
ms.author: netahw
author: nhaiby
ms.date: 05/20/2018

ROBOTS: NOINDEX
---

# Build and deploy image similarity models with Azure Machine Learning

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]


In this article, learn how to use Azure Machine Learning Package for Computer Vision (AMLPCV) to train, test, and deploy an image similarity model. For an overview of this package and its detailed reference documentation, see https://aka.ms/aml-packages/vision.

A large number of problems in the computer vision domain can be solved using image similarity. These problems include building models that answer questions such as:
+ _Is an OBJECT present in the image? For example, "dog", "car", "ship", and so on_
+ _What class of eye disease severity is evinced by this patient's retinal scan?_

When building and deploying this model with AMLPCV, you go through the following steps:
1. Dataset creation
2. Image visualization and annotation
3. Image augmentation
4. Deep Neural Network (DNN) model definition
5. Classifier training
6. Evaluation and visualization
7. Web service deployment
8. Web service load testing

[CNTK](https://www.microsoft.com/cognitive-toolkit/) is used as the deep learning framework, training is performed locally on a GPU powered machine such as the ([Deep learning Data Science VM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.dsvm-deep-learning?tab=Overview)), and deployment uses the Azure ML Operationalization CLI.

## Prerequisites

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

1. The following accounts and application must be set up and installed:
   - An Azure Machine Learning Experimentation account 
   - An Azure Machine Learning Model Management account
   - Azure Machine Learning Workbench installed

   If these three are not yet created or installed, follow the [Azure Machine Learning Quickstart and Workbench installation](../desktop-workbench/quickstart-installation.md) article. 

1. The Azure Machine Learning Package for Computer Vision must be installed. Learn how to install this package as described at https://aka.ms/aml-packages/vision.

## Sample data and notebook

### Get the Jupyter notebook

Download the notebook to run the sample described here yourself.

> [!div class="nextstepaction"]
> [Get the Jupyter notebook](https://aka.ms/aml-packages/vision/notebooks/object_detection)

### Load the sample data

The following example uses a dataset consisting of 63 tableware images. Each image is labeled as belonging to one of four different classes (bowl, cup, cutlery, plate). The number of images in this example is small so that this sample can be executed quickly. In practice at least 100 images per class should be provided. All images are located at *"../sample_data/imgs_recycling/"*, in subdirectories called "bowl", "cup", "cutlery", and "plate".

![Azure Machine Learning dataset](media/how-to-build-deploy-image-classification-models/recycling_examples.jpg)

## Next steps

Learn more about Azure Machine Learning Package for Computer Vision in these articles:

+ Learn how to [improve the accuracy of this model](how-to-improve-accuracy-for-computer-vision-models.md).

+ Read the [package overview](https://aka.ms/aml-packages/vision).

+ Explore the [reference documentation](https://docs.microsoft.com/python/api/overview/azure-machine-learning/computer-vision) for this package.

+ Learn about [other Python packages for Azure Machine Learning](reference-python-package-overview.md).
