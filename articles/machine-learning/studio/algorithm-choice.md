---
title: How to choose algorithms for Azure Machine Learning Studio | Microsoft Docs
description: How to choose Azure Machine Learning Studio algorithms for supervised and unsupervised learning in clustering, classification, or regression experiments.
services: machine-learning
documentationcenter: ''
author: pakalra
ms.author: pakalra
manager: cgronlun
editor: cgronlun
tags: ''

ms.assetid: a3b23d7f-f083-49c4-b6b1-3911cd69f1b4
ms.service: machine-learning
ms.component: studio
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 08/23/2018

---
# How to choose algorithms for Azure Machine Learning Studio

The answer to the question "What machine learning algorithm should I use?" is always "It depends." It depends on the size, quality, and nature of the data. It depends on what you want to do with the answer. It depends on how the math of the algorithm was translated into instructions for the computer you are using. And it depends on how much time you have. Even the most experienced data scientists can't tell which algorithm will perform best before trying them.

## The Azure Machine Learning Studio Algorithm Cheat Sheet

The **Azure Machine Learning Studio Algorithm Cheat Sheet** helps you choose the right machine learning algorithm for your predictive analytics solutions from the Azure Machine Learning Studio library of algorithms.

> [!NOTE]
> To download the cheat sheet, go to [Machine learning algorithm cheat sheet for Azure Machine Learning Studio](algorithm-cheat-sheet.md).
> 
> 

This cheat sheet has a very specific audience in mind: a beginning data scientist with undergraduate-level machine learning, trying to choose an algorithm to start with in Machine Learning Studio. That means that it makes some generalizations and oversimplifications, but it points you in a safe direction. It also means that there are lots of algorithms not listed here. These are the algorithms that you can find today in Machine Learning Studio.

These recommendations are compiled feedback and tips from many data scientists and machine learning experts. We didn't agree on everything, but I've tried to harmonize our opinions into a rough consensus. Most of the statements of disagreement begin with "It depends…"

## How to use the cheat sheet

To make the best use of the algorithm cheat sheet, see [How to choose machine learning algorithms](../service/algorithm-choice.md). This article provides an in-depth look at the algorithms identified in the cheat sheet.

Here is a list of the Machine Learning Studio algorithms mentioned in the cheat sheet:

### Two-class classification

- [logistic regression](/azure/machine-learning/studio-module-reference/two-class-logistic-regression)
- [decision forest](/azure/machine-learning/studio-module-reference/two-class-decision-forest)
- [decision jungle](/azure/machine-learning/studio-module-reference/two-class-decision-jungle)
- [boosted decision tree](/azure/machine-learning/studio-module-reference/two-class-boosted-decision-tree)
- [neural network](/azure/machine-learning/studio-module-reference/two-class-neural-network)
- [averaged perceptron](/azure/machine-learning/studio-module-reference/two-class-averaged-perceptron)
- [support vector machine](/azure/machine-learning/studio-module-reference/two-class-support-vector-machine)
- [locally deep support vector machine](/azure/machine-learning/studio-module-reference/two-class-locally-deep-support-vector-machine)
- [Bayes’ point machine](/azure/machine-learning/studio-module-reference/two-class-bayes-point-machine)

### Multi-class classification

- [logistic regression](https://msdn.microsoft.com/library/azure/dn905853.aspx)
- [decision forest](https://msdn.microsoft.com/library/azure/dn906015.aspx)
- [decision jungle ](https://msdn.microsoft.com/library/azure/dn905963.aspx)
- [neural network](https://msdn.microsoft.com/library/azure/dn906030.aspx)
- [one-v-all](https://msdn.microsoft.com/library/azure/dn905887.aspx)

### Regression

- [linear](https://msdn.microsoft.com/library/azure/dn905978.aspx)
- [Bayesian linear](https://msdn.microsoft.com/library/azure/dn906022.aspx)
- [decision forest](https://msdn.microsoft.com/library/azure/dn905862.aspx)
- [boosted decision tree](https://msdn.microsoft.com/library/azure/dn905801.aspx)
- [fast forest quantile](https://msdn.microsoft.com/library/azure/dn913093.aspx)
- [neural network](https://msdn.microsoft.com/library/azure/dn905924.aspx)
- [Poisson](https://msdn.microsoft.com/library/azure/dn905988.aspx)
- [ordinal](https://msdn.microsoft.com/library/azure/dn906029.aspx)

### Anomaly detection

- [support vector machine](https://msdn.microsoft.com/library/azure/dn913103.aspx)
- [PCA-based anomaly detection](https://msdn.microsoft.com/library/azure/dn913102.aspx)
- [K-means](https://msdn.microsoft.com/library/azure/5049a09b-bd90-4c4e-9b46-7c87e3a36810/)

## More help with algorithms

- For a downloadable infographic that describes algorithms and provides examples, see [Downloadable Infographic: Machine learning basics with algorithm examples](basics-infographic-with-algorithm-examples.md).

- For a list by category of all the machine learning algorithms available in Machine Learning Studio, see [Initialize Model](/azure/machine-learning/studio-module-reference/machine-learning-initialize-model) in the Machine Learning Studio Algorithm and Module Help.

- For a complete alphabetical list of algorithms and modules in Machine Learning Studio, see [A-Z list of Machine Learning Studio modules](/azure/machine-learning/studio-module-reference/index) in the Machine Learning Studio Algorithm and Module Help.

- To download and print a diagram that gives an overview of the capabilities of Machine Learning Studio, see [Overview diagram of Azure Machine Learning Studio capabilities](studio-overview-diagram.md).
