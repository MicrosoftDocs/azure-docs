---
title: Sentiment Analysis using Deep Learning with Azure Machine Learning | Microsoft Docs
description: How to perform sentiment analysis using deep learning with Azure ML Workbench.
services: machine-learning
documentationcenter: ''
author: miprasad
manager: kristin.tolle
editor: miprasad

ms.assetid: 
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/20/2018
ms.author: miprasad

ROBOTS: NOINDEX
---



# Sentiment Analysis using Deep Learning with Azure Machine Learning

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



Sentiment analysis is a well-known task in the realm of natural language processing. Given a set of texts, the aim is to determine the sentiment of that text. The objective of this solution is to use Deep Learning for predicting sentiment from movie reviews.

The solution is located at https://github.com/Azure/MachineLearningSamples-SentimentAnalysis

## Link to the Gallery GitHub repository

Follow this link to the public GitHub repository:

[https://github.com/Azure/MachineLearningSamples-SentimentAnalysis](https://github.com/Azure/MachineLearningSamples-SentimentAnalysis)

## Use case overview

The explosion of data and the proliferation of mobile devices have created lots of opportunities for customers to express their feelings and attitudes about anything and everything at any time. This opinion or "sentiment" is often generated through social channels in the form of reviews, chats, shares, likes, tweets, etc. The sentiment can be invaluable for businesses looking to improve products and services, make more informed decisions, and better promote their brands.

To get value from sentiment analysis, businesses must have the ability to mine vast stores of unstructured social data for actionable insights. In this sample, we develop deep learning models for performing sentiment analysis of movie reviews using AMLWorkbench

## Prerequisites

* An [Azure account](https://azure.microsoft.com/free/) (free trials are available).

* An installed copy of [Azure Machine Learning Workbench](../service/overview-what-is-azure-ml.md) following the [quick start installation guide](quickstart-installation.md) to install the program and create a workspace.

* For operationalization, it is best if you have Docker engine installed and running locally. If not, you can use the cluster option. However, running an Azure Container Service (ACS) can be expensive.

* This Solution assumes that you are running Azure Machine Learning Workbench on Windows 10 with Docker engine locally installed. On a macOS, the instruction is largely the same.

## Data description

The dataset used for this sample is a small hand-crafted dataset and is located in the [data folder](https://github.com/Azure/MachineLearningSamples-SentimentAnalysis/tree/master/data).

The first column contains movie reviews and the second column contains their sentiment (0 - negative and 1 - positive). The dataset is merely used for demonstration purposes but typically to get robust sentiment scores, you need a large dataset. For example, the [IMDB Movie reviews sentiment classification problem](https://keras.io/datasets/#datasets ) from Keras consists of a dataset of 25,000 movies reviews from IMDB, labeled by sentiment (positive or negative). The intention of this lab is to show you how to perform sentiment analysis using deep learning with AMLWorkbench.

## Scenario structure

The folder structure is arranged as follows:

1. All the code related to sentiment analysis using AMLWorkbench is in the root folder
2. data: Contains the dataset used in the solution
3. docs: Contains all the hands-on labs

The order of Hands-on Labs to carry out the solution is as follows:

| Order| File Name | Related Files |
|--|-----------|------|
| 1 | [`SentimentAnalysisDataPreparation.md`](https://github.com/Azure/MachineLearningSamples-SentimentAnalysis/blob/master/docs/SentimentAnalysisDataPreparation.md) | 'data/sampleReviews.txt' |
| 2 | [`SentimentAnalysisModelingKeras.md`](https://github.com/Azure/MachineLearningSamples-SentimentAnalysis/blob/master/docs/SentimentAnalysisModelingKeras.md) | 'SentimentExtraction.py' |
| 3 | [`SentimentAnalysisOperationalization.md`](https://github.com/Azure/MachineLearningSamples-SentimentAnalysis/blob/master/docs/SentimentAnalysisOperationalization.md) | 'Operaionalization' |

## Conclusion

In conclusion, this solution introduces you to using Deep Learning to perform sentiment analysis with the Azure Machine Learning Workbench. We also operationalize using HDF5 models.
