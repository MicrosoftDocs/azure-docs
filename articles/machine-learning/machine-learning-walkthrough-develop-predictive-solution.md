---
title: A predictive solution for credit risk with Machine Learning | Microsoft Docs
description: A detailed walkthrough showing how to create a predictive analytics solution for credit risk assessment in Azure Machine Learning Studio.
keywords: credit risk, predictive analytics solution,risk assessment
services: machine-learning
documentationcenter: ''
author: garyericson
manager: jhubbard
editor: cgronlun

ms.assetid: 43300854-a14e-4cd2-9bb1-c55c779e0e93
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 12/16/2016
ms.author: garye

---
# Walkthrough: Develop a predictive analytics solution for credit risk assessment in Azure Machine Learning

In this walkthrough, we'll take an extended look at the process of developing a solution in Machine Learning Studio. We'll develop a predictive analytics model in Machine Learning Studio, and then deploy it as an Azure Machine Learning web service where the model can make predictions using new data. 

> [!TIP]
> This walkthrough assumes you've used Machine Learning Studio at least once before, and that you have some understanding of machine learning concepts, though it assumes you're not an expert in either.
> 
>If you've never used **Azure Machine Learning Studio** before, you might want to start with the tutorial, [Create your first data science experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md). That tutorial takes you through Machine Learning Studio for the first time, showing you the basics of how to drag-and-drop modules onto your experiment, connect them together, run the experiment, and look at the results.
>
>If you're new to machine learning, the video series [Data Science for Beginners](machine-learning-data-science-for-beginners-the-5-questions-data-science-answers.md) might be a good place to start. This video series is a great introduction to machine learning using everyday language and concepts.
> 

## The problem

Suppose you need to predict an individual's credit risk based on the information they give on a credit application.  

Credit risk assessment is a complex problem, of course, but we'll simplify the parameters of the question a bit. Then, we'll use it as an example of how you can use Microsoft Azure Machine Learning with Machine Learning Studio and the Machine Learning web service to create such a predictive analytics solution.  

## The solution

In this detailed walkthrough, we'll start with publicly available credit risk data, develop and train a predictive model based on that data, and then deploy the model as a web service that can be used by others for credit risk assessment.

[!INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

To create a credit risk assessment solution, we'll follow these steps:  

1. [Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2. [Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3. [Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4. [Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5. [Deploy the web service](machine-learning-walkthrough-5-publish-web-service.md)
6. [Access the web service](machine-learning-walkthrough-6-access-web-service.md)

This walkthrough is based on a simplified version of the
[Binary Classfication: Credit risk prediction](http://go.microsoft.com/fwlink/?LinkID=525270) sample experiment in the [Cortana Intelligence Gallery](http://gallery.cortanaintelligence.com/).


> [!TIP]
> To download and print a diagram that gives an overview of the capabilities of Machine Learning Studio, see [Overview diagram of Azure Machine Learning Studio capabilities](machine-learning-studio-overview-diagram.md).
> 
> 
