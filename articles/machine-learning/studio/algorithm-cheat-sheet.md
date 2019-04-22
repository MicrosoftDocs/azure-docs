---
title: Machine learning algorithm cheat sheet
titleSuffix: Azure Machine Learning Studio
description: A printable machine learning algorithm cheat sheet helps you choose the right algorithm for your predictive model in Azure Machine Learning Studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-ms.author=pakalra, previous-author=pakalra
ms.date: 03/04/2019
---
# Machine learning algorithm cheat sheet for Azure Machine Learning Studio

The **Azure Machine Learning Studio Algorithm Cheat Sheet** helps you choose the right algorithm for a predictive analytics model.

[Azure Machine Learning Studio](https://studio.azureml.net/) has a large library of algorithms from the ***regression***, ***classification***, ***clustering***, and ***anomaly detection*** families. Each is designed to address a different type of machine learning problem.

## Download: Machine learning algorithm cheat sheet

**Download the cheat sheet here: [Machine Learning Algorithm Cheat Sheet (11x17 in.)](https://download.microsoft.com/download/A/6/1/A613E11E-8F9C-424A-B99D-65344785C288/microsoft-machine-learning-algorithm-cheat-sheet-v7.pdf)**

![Machine learning algorithm cheat sheet: Learn how to choose a Machine Learning algorithm.](./media/algorithm-cheat-sheet/machine-learning-algorithm-cheat-sheet-small_v_0_6-01.png)

Download and print the Machine Learning Studio Algorithm Cheat Sheet in tabloid size to keep it handy and get help choosing an algorithm.

> [!NOTE]
> For help in using this cheat sheet for choosing the right algorithm, plus a deeper discussion of the different types of machine learning algorithms and how they're used, see [How to choose algorithms for Microsoft Azure Machine Learning Studio](algorithm-choice.md).

## Notes and terminology definitions for the Machine Learning Studio algorithm cheat sheet

* The suggestions offered in this algorithm cheat sheet are approximate rules-of-thumb. Some can be bent, and some can be flagrantly violated. This is intended to suggest a starting point. Don’t be afraid to run a head-to-head competition between several algorithms on your data. There is simply no substitute for understanding the principles of each algorithm and the system that generated your data.

* Every machine learning algorithm has its own style or *inductive bias*. For a specific problem, several algorithms may be appropriate and one algorithm may be a better fit than others. But it's not always possible to know beforehand which is the best fit. In cases like these, several algorithms are listed together in the cheat sheet. An appropriate strategy would be to try one algorithm, and if the results are not yet satisfactory, try the others. Here’s an example from the [Azure AI Gallery](https://gallery.azure.ai/) of an experiment that tries several algorithms against the same data and compares the results: [Compare Multi-class Classifiers: Letter recognition](https://gallery.azure.ai/Details/a635502fc98b402a890efe21cec65b92).

* There are three main categories of machine learning: **supervised learning**, **unsupervised learning**, and **reinforcement learning**.

  * In **supervised learning**, each data point is labeled or associated with a category or value of interest.  An example of a categorical label is assigning an image as either a ‘cat’ or a ‘dog’.  An example of a value label is the sale price associated with a used car. The goal of supervised learning is to study many labeled examples like these, and then to be able to make predictions about future data points. For example, identifying new photos with the correct animal or assigning accurate sale prices to other used cars. This is a popular and useful type of machine learning. All of the modules in Azure Machine Learning Studio are supervised learning algorithms except for [K-Means Clustering][k-means-clustering].

  * In **unsupervised learning**, data points have no labels associated with them. Instead, the goal of an unsupervised learning algorithm is to organize the data in some way or to describe its structure. This can mean grouping it into clusters, as K-means does, or finding different ways of looking at complex data so that it appears simpler.

  * In **reinforcement learning**, the algorithm gets to choose an action in response to each data point. It is a common approach in robotics, where the set of sensor readings at one point in time is a data point, and the algorithm must choose the robot’s next action. It's also a natural fit for Internet of Things applications. The learning algorithm also receives a reward signal a short time later, indicating how good the decision was. Based on this, the algorithm modifies its strategy in order to achieve the highest reward. Currently there are no reinforcement learning algorithm modules in Azure Machine Learning studio.

* **Bayesian methods** make the assumption of statistically independent data points. This means that the unmodeled variability in one data point is uncorrelated with others, that is, it can’t be predicted. For example, if the data being recorded is the number of minutes until the next subway train arrives, two measurements taken a day apart are statistically independent. However, two measurements taken a minute apart are not statistically independent - the value of one is highly predictive of the value of the other.

* **Boosted decision tree regression** takes advantage of feature overlap or interaction among features. That means that, in any given data point, the value of one feature is somewhat predictive of the value of another. For example, in daily high/low temperature data, knowing the low temperature for the day allows you to make a reasonable guess at the high. The information contained in the two features is somewhat redundant.

* Classifying data into more than two categories can be done either by using an inherently multi-class classifier, or by combining a set of two-class classifiers into an **ensemble**. In the ensemble approach, there is a separate two-class classifier for each class - each one separates the data into two categories:  “this class” and “not this class.” Then these classifiers vote on the correct assignment of the data point. This is the operational principle behind [One-vs-All Multiclass][one-vs-all-multiclass].

* Several methods, including logistic regression and the Bayes point machine, assume **linear class boundaries**. That is, they assume that the boundaries between classes are approximately straight lines (or hyperplanes in the more general case). Often this is a characteristic of the data that you don’t know until after you’ve tried to separate it, but it’s something that typically can be learned by visualizing beforehand. If the class boundaries look very irregular, stick with decision trees, decision jungles, support vector machines, or neural networks.

* Neural networks can be used with categorical variables by creating a **dummy variable** for each category, setting it to 1 in cases where the category applies, 0 where it doesn’t.

## Next steps

* For a downloadable infographic that describes algorithms and provides examples, see [Downloadable Infographic: Machine learning basics with algorithm examples](basics-infographic-with-algorithm-examples.md).

* For a list by category of all the machine learning algorithms available in Machine Learning Studio, see [Initialize Model][initialize-model] in the Machine Learning Studio Algorithm and Module Help.

* For a complete alphabetical list of algorithms and modules in Machine Learning Studio, see [A-Z list of Machine Learning Studio modules][a-z-list] in Machine Learning Studio Algorithm and Module Help.



<!-- Module References -->
[a-z-list]: /azure/machine-learning/studio-module-reference/a-z-module-list
[initialize-model]: /azure/machine-learning/studio-module-reference/machine-learning-initialize-model
[k-means-clustering]: /azure/machine-learning/studio-module-reference/k-means-clustering
[one-vs-all-multiclass]: /azure/machine-learning/studio-module-reference/one-vs-all-multiclass
