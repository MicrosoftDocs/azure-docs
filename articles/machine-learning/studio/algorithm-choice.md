---
title: How to choose algorithms for Azure Machine Learning Studio | Microsoft Docs
description: How to choose Azure Machine Learning Studio algorithms for supervised and unsupervised learning in clustering, classification, or regression experiments.
services: machine-learning
author: pakalra
ms.author: pakalra
manager: cgronlun
editor: cgronlun

ms.assetid: a3b23d7f-f083-49c4-b6b1-3911cd69f1b4
ms.service: machine-learning
ms.component: studio
ms.topic: article
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

- [logistic regression](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-logistic-regression)
- [decision forest](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-decision-forest)
- [decision jungle](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-decision-jungle)
- [boosted decision tree](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-boosted-decision-tree)
- [neural network](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-neural-network)
- [averaged perceptron](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-averaged-perceptron)
- [support vector machine](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-support-vector-machine)
- [locally deep support vector machine](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-locally-deep-support-vector-machine)
- [Bayes’ point machine](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/two-class-bayes-point-machine)

### Multi-class classification

- [logistic regression](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/multiclass-logistic-regression)
- [decision forest](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/multiclass-decision-forest)
- [decision jungle](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/multiclass-decision-jungle)
- [neural network](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/multiclass-neural-network)
- [one-v-all](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/one-vs-all-multiclass)

### Regression

- [linear](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/linear-regression)
- [Bayesian linear](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/bayesian-linear-regression)
- [decision forest](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/decision-forest-regression)
- [boosted decision tree](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/boosted-decision-tree-regression)
- [fast forest quantile](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/fast-forest-quantile-regression)
- [neural network](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/neural-network-regression)
- [Poisson](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/poisson-regression)
- [ordinal](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/ordinal-regression)

### Anomaly detection

- [support vector machine](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/one-class-support-vector-machine)
- [PCA-based anomaly detection](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/pca-based-anomaly-detection)
- [K-means](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/k-means-clustering)

## More help with algorithms

- For a downloadable infographic that describes algorithms and provides examples, see [Downloadable Infographic: Machine learning basics with algorithm examples](basics-infographic-with-algorithm-examples.md).

- For a list by category of all the machine learning algorithms available in Machine Learning Studio, see [Initialize Model](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/machine-learning-initialize-model) in the Machine Learning Studio Algorithm and Module Help.

- For a complete alphabetical list of algorithms and modules in Machine Learning Studio, see [A-Z list of Machine Learning Studio modules](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/index) in the Machine Learning Studio Algorithm and Module Help.

- To download and print a diagram that gives an overview of the capabilities of Machine Learning Studio, see [Overview diagram of Azure Machine Learning Studio capabilities](studio-overview-diagram.md).
