<properties 
	pageTitle="Machine Learning Algorithm Cheat Sheet | Azure" 
	description="A downloadable machine learning algorithm cheat sheet that can help you figure out how to choose a machine learning algorithm."
	services="machine-learning"
	documentationCenter="" 
	authors="brohrer" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/13/2015" 
	ms.author="brohrer;garye" />


# Microsoft Azure Machine Learning Algorithm Cheat Sheet

[Azure Machine Learning Studio](https://studio.azureml.net/) comes with a large number of machine learning algorithms that you can use to build your predictive analytics solutions. These algorithms fall into the general machine learning categories of ***regression***, ***classification***, ***clustering***, and ***anomaly detection***, and each one is designed to address a different type of machine learning problem.

The question is, is there something that can help me quickly figure out how to choose a machine learning algorithm for my specific solution?

**Download the cheat sheet here: [Microsoft Azure Machine Learning Algorithm Cheat Sheet](http://download.microsoft.com/download/A/6/1/A613E11E-8F9C-424A-B99D-65344785C288/microsoft-machine-learning-algorithm-cheat-sheet-v2.pdf)**

![Machine Learning Algorithm cheat sheet: How do I choose a Machine Learning algorithm?][cheat-sheet]

[cheat-sheet]: ./media/machine-learning-algorithm-cheat-sheet/cheat-sheet-small.png

The **Microsoft Azure Machine Learning Algorithm Cheat Sheet** is designed to help you sift through the available machine learning algorithms and choose the appropriate one to use for your predictive analytics solution.
The cheat sheet asks you questions about both the nature of your data and the problem you're working to address, and then suggests an algorithm for you to try.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

[Azure Machine Learning Studio](https://studio.azureml.net/) gives you the flexibility to experiment - 
try one algorithm, and if you're not satisfied with the results, try another.
Here's an example from the [Azure Machine Learning Gallery](http://gallery.azureml.net) of an experiment that tries several algorithms against the same data and compares the results:
[Compare Multi-class Classifiers: Letter recognition](http://gallery.azureml.net/Details/a635502fc98b402a890efe21cec65b92).

For a deeper discussion of the different types of machine learning algorithms and how they're used, see [How to choose an algorithm in Azure Machine Learning](machine-learning-algorithm-choice.md).
For a list of all the machine learning algorithms available in Machine Learning Studio, see [Initialize Model][initialize-model] in the Machine Learning Studio Algorithm and Module Help.

###Footnotes:

* In many cases there are several appropriate algorithms. Every ML algorithm has its own style or **inductive bias**. For a specific problem, one algorithm will be a better fit than others, but knowing which will be the best fit beforehand is not always possible. In cases like these, several algorithms are listed together in the same leaf of the decision tree. An appropriate strategy in this case would be to try one, and if the results are not yet satisfactory, try the others. Here’s an example comparison of several algorithms’ performance on the same problem: http://gallery.azureml.net/Details/a635502fc98b402a890efe21cec65b92 	
* There are three main categories of machine learning: supervised learning, unsupervised learning, and reinforcement learning.
* In **supervised learning**, data points are each labeled or associated with category or value of interest.  An example of a categorical label is assigning an image as either a ‘cat’ or a ‘dog’.  An example of a value label is the sale price associated with a used car. The goal of supervised learning is to study many labeled examples like these, and then to be able to make predictions about future data points—to identify new photos with the correct animal and to assign accurate sale prices to other used cars. This is a popular and useful type of machine learning. All of the modules in Azure ML are supervised learning algorithms except for K-means Clustering.
* In **unsupervised learning**, data points have no labels associated with them. Instead, the goal of an unsupervised learning algorithm is to organize the data in some way or to describe its structure. This can mean grouping it into clusters, as K-means does, or finding different ways of looking at complex data so that it appears simpler.
* In **reinforcement learning**, the algorithm gets to choose an action in response to each data point. It is a common approach in robotics, where the set of sensor readings at one point in time is a data point, and the algorithm must choose the robot’s next action. It is also a natural fit for Internet of Things applications. The learning algorithm also receives a reward signal a short time later, indicating how good the decision was. Based on this, the algorithm modifies its strategy in order to achieve the highest reward. Currently there are no reinforcement learning algorithm modules in Azure ML.
* These are approximate **rules of thumb**. Some can be bent, and some can be flagrantly violated. This is intended to suggest a starting point. Don’t be afraid run a head-to-head competition between several algorithms on your data. There is simply no substitute for understanding the principles of each algorithm and understanding the system that generated your data. 
* **Bayesian methods** make the assumption of statistically independent data points. This means that the unmodeled variability in one data point is uncorrelated with others, that is, it can’t be predicted. For example, if the data being recorded is number of minutes until the next subway train arrives, two measurements taken a day apart are statistically independent. Two measurements taken a minute apart are not statistically independent—the value of one is highly predictive of the value of the other. 
* **Boosted decision tree regression** takes advantage of feature overlap, or interaction among features. That means that, in any given data point, the value of one feature is somewhat predictive of the value of another. For example in daily high/low temperature data, knowing the low temperature for the day allows one to make a reasonable guess at the high. The information contained in the two features is somewhat redundant. 
* Classifying data into more than two categories can be done by either using an inherently multi-class classifier, or by combining a set of two-class classifiers into an ensemble. In the ensemble approach, there is a separate two-class classifier for each class. Each one separates the data into two categories:  “this class” and “not this class.” Then these classifiers vote on the correct assignment of the data point. This is the operational principle behind the **One-v-All multiclass classifier**. 
* Several methods, including logistic regression and the Bayes point machine, assume **linear class boundaries**, that is, that the boundaries between classes are approximately straight lines (or hyperplanes in the more general case). Often, this is a characteristic of the data that you don’t know until after you’ve tried to separate it, but it’s something that can typically be learned by visualizing beforehand. If the eyeballed class boundaries look very irregular, stick with decision trees, decision jungles, support vector machines, or neural networks. 
* Neural networks can be used with categorical variables by creating a **dummy variable** for each category and setting it to 1 in cases where the category applies, 0 where it doesn’t.


<!-- This is how you can add a link to the image in HTML. Don't know how to do this in markdown.
<a href="http://download.microsoft.com/download/A/6/1/A613E11E-8F9C-424A-B99D-65344785C288/microsoft-machine-learning-algorithm-cheat-sheet.pdf">
<img src="C:\Users\garye\azure-content-pr\articles\media\machine-learning-algorithm-cheat-sheet\cheat-sheet-small.png">
</a>
-->

<!-- Module References -->
[initialize-model]: https://msdn.microsoft.com/library/azure/0c67013c-bfbc-428b-87f3-f552d8dd41f6/
