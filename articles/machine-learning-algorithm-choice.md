<properties 
	title="" 
	pageTitle="How to choose an algorithm in Azure Machine Learning | Azure" 
	description="Explains how to How to choose an algorithm in Azure Machine Learning." 
	services="machine-learning"
	documentationCenter="" 
	authors="garyericson" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/26/2015" 
	ms.author="bradsev;garye" />


# How to choose an algorithm in Azure Machine Learning

[Azure Machine Learning Studio](https://studio.azureml.net/) comes with a large number of machine learning algorithms that you can use to build your predictive analytics solutions. These algorithms fall into the general machine learning categories of ***regression***, ***classification***, ***clustering***, and ***anomaly detection***, and each one is designed to address a different type of machine learning problem.

For beginning and experienced data scientists alike, choosing an appropriate learning algorithm can be daunting. The nature of the data partially drives the decision, constraining the choice to a class of algorithms, say, classification or regression. But often the final choice of algorithm is a black-box mixture of trial-and-error, personal experience, and arbitrary selection. 

A number of resources are available to help with this decision. Here are some we've found useful:

- [Microsoft Azure Machine Learning Algorithm Cheat Sheet](machine-learning-algorithm-cheat-sheet.md) - a handy reference to walk you through the algorithm decision, specifically tailored for algorithms available in Azure Machine Learning Studio

- [Choosing a Learning Algorithm in Azure Machine Learning](http://blogs.technet.com/b/machinelearning/archive/2015/05/20/choosing-a-learning-algorithm-in-azure-ml.aspx) - a blog post introducing the Algorithm Cheat Sheet by Brandon Rohrer, a senior data scientist with the Azure Machine Learning

- [Choosing a Machine Learning Classifier](http://blog.echen.me/2011/04/27/choosing-a-machine-learning-classifier/) - a great blog from Edwin Chen giving quick tips on how to select the best classification algorithm

- [Choosing the right estimator](http://scikit-learn.org/stable/tutorial/machine_learning_map/) - a cool flowchart from [scikit-learn](http://scikit-learn.org/stable/index.html) that provides a simple guide to choosing between standard machine learning algorithms

For a complete list of all the machine learning algorithms available in Machine Learning Studio, see [Initialize Model](https://msdn.microsoft.com/library/azure/0c67013c-bfbc-428b-87f3-f552d8dd41f6/) in the Machine Learning Studio Algorithm and Module Help.
