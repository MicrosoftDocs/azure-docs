<properties 
	pageTitle="How to interpret model results in Azure Machine Learning   | Azure" 
	description="How to to choose the optimal parameter set for an algorithm using and visualizing score model outputs." 
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
	ms.date="04/21/2015" 
	ms.author="bradsev" />


# How to interpret model results in Azure Machine Learning 
 
**Understanding & Visualizing 'Score Model' Output**
This topic explains how to visualize and interpret prediction results in the Azure Machine Learning Studio. After you have trained a model and done predictions on top of it ("scored the model"), you need to understand and interpret the prediction result you have obtained.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)] 

There are four major kinds of machine learning models in Azure Machine Learning: 

* classification
* clustering
* regression
* recommender systems

The modules used do prediction on top of these modules, called "scoring" them, given some test data, are:

* [Score Model][score-model] module for classification and regression, 
* [Assign to Clusters][assign-to-clusters] module for clustering 
* [Score Matchbox Recommender][score-matchbox-recommender] for recommendation systems 
 
This document explains how to interpret prediction results for each of these modules. For an overview of these kinds of models, see [How to choose parameters to optimize your algorithms in Azure Machine Learning](machine-learning-algorithm-parameters-optimize.md).

This topic addresses prediction interpretation but not model evaluation. For more information on how to evaluate your model, please refer to [How to evaluate model performance in Azure Machine Learning](machine-learning-evaluate-model-performance.md).

If you are new to Azure Machine Learning, and help on how to create a simple experiment to get started, see [Create a simple experiment in Azure Machine Learning Studio](machine-learning-create-experiment.md) in the Azure Machine Learning Studio. 

##Classification
There are two sub-categories of classification problems: 

* problems with only two classes (two-class or binary classification) 
* problems with more than two classes (multi-class classification) 

Azure Machine Learning has different modules to deal with each of these types of classification. But the ways to interpret their prediction results are very similar. We will talk about two-class classification problems first, and then address multi-class classification problems.

###Two-class classification
**Example experiment**

An example of two-class classification problem is the classification of Iris flowers: the task is to classify Iris flowers based on their features. Note that the Iris dataset provided in Azure Machine Learning is a subset of the popular [Iris dataset](http://en.wikipedia.org/wiki/Iris_flower_data_set) containing instances of only 2 flower species (classes 0 and 1). There are four features for each flower (sepal length, sepal width, petal length and petal width).

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/1.png)

Figure 1 Experiment of Iris Two-Class Classification Problem

An experiment has been performed to solve this problem, as shown in Figure 1. A two-class boosted decision tree model has been trained and scored. Now we can visualize the prediction results from [Score Model][score-model] module by clicking on the output port of [Score Model][score-model] module and then clicking on **Visualize** in the appeared menu. This will bring up the scoring results as shown in Figure 2.

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/1_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/2.png)

Figure 2 Visualize Score Model Result in Two-Class Classification

**Result interpretation**

There are six columns in the results table. The left four columns are the four features. The right two columns, Scored Labels and Scored Probabilities are the prediction results. The Scored Probabilities column shows the probability that a flower belongs to the positive class (class 1). For example, the first number 0.028571 in the column means there is 0.028571 probability that the first flower belongs to class 1. The Scored Labels column shows the predicted class for each flower. This is based on the Scored Probabilities column. If the scored probability of a flower is larger than 0.5, it is predicted as class 1, otherwise, it is predicted as class 0. 

**Web service publication**

Once the prediction results have been understood and judged sound, the experiment can be published as a web service so that we can deploy it in various applications and be called to obtain class predictions on any new iris flower. For the procedure on how to change a training experiment into a scoring experiment and publish it as a web service, see [Publish the Azure Machine Learning web service](machine-learning-walkthrough-5-publish-web-service.md). Following this procedure provides you with a scoring experiment as shown in Figure 3.

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/3.png)

Figure 3 Scoring Experiment of Iris Two-Class Classification Problem

Now we need to set the input and output for the web service. Obviously, the input is the right input port of [Score Model][score-model], which is the Iris flower features input. The choice of the output depends on whether we are interested in the predicted class (scored label), the scored probability, or both. Here,  it is assumed that we are interested in both. To select the desired output columns, we need to use a [Project Columns][project-columns] module. We click on [Project Columns][project-columns] module, click on **Launch column selector** in the right panel, and select **Scored Labels** and **Scored Probabilities**. After setting the output port of [Project Columns][project-columns] module and running it again, we should be ready to publish the scoring experiment as a web service by clicking on **PUBLISH WEB SERVICE** button at the bottom. The final experiment looks like Figure 4.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/4.png)

Figure 4 Final Scoring Experiment of Iris Two-Class Classification Problem

After running the web service, and entering some feature values of a test instance, the returned result returns two numbers. The first number is the scored label, the second is the scored probability. This flower is predicted as class 1 with 0.9655 probability. 
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/4_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/5.png)

Figure 5 Web Service Result of Iris Two-Class Classification

###Multi-class classification
**Example experiment**

In this experiment we will perform a letter recognition task as an example of multi-class classification. The classifier will attempt to predict a certain letter (class), given some hand-written attribute values extracted from the hand-written images. In the training data, there are sixteen features extracted from hand-written letter images. The twenty-six letters form our twenty-six classes. An experiment has been set up to train a multi-class classification model for letter recognition and predict on the same feature set on a test dataset, as shown in Figure 6.

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/5_1.png)
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/6.png)

Figure 6 Experiment of Letter Recognition Multi-Class Classification Problem

Visualizing the results from [Score Model][score-model] module by right/left clicking on the output port of [Score Model][score-model] module and then clicking **Visualize**, you should see a window as in Figure 7.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/7.png)

Figure 7 Visualize Score Model Result in Multi-Class Classification

**Result interpretation**

The left sixteen columns represent the feature values of the test set. The columns with names Scored Probabilities for Class "XX" are just like the Scored Probabilities column in the two-class case. They show the probability that the corresponding entry falls into a certain class. For example, for the first entry, there is 0.003571 probability that it is an “A”, 0.000451 probability that it is a “B”, so on and so forth. The last column Scored Labels is the same as Scored Labels in the two-class case. It selects the class with the largest scored probability as the predicted class of the corresponding entry. For example, for the first entry, the scored label is “F” since it has the largest probability to be an “F” (0.916995).

**Web service publication**

This time, instead of using [Project Columns][project-columns] to select some columns as the output of our web service, we would like to get the scored label for each entry and the probability of the scored label. The basic logic is to find the largest probability among all the scored probabilities. To do this, we need to use [Execute R Script][execute-r-script] module. The R code is shown in Figure 8 and the experiment is as Figure 9.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/8.png)

Figure 8 R code for extracting Scored Labels and the associated probabilities of the labels
  
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/9.png)

Figure 9 Final Scoring Experiment of Letter Recognition Multiclass Classification Problem

After publishing and running the web service, and entering some input feature values, the returned result looks like Figure 10. This hand-written letter, with its extracted sixteen features, is predicted to be a “T” with 0.9715 probability. 
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/9_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/10.png)

Figure 10 Web Service Result of Iris Two-Class Classification

##Regression

Regression problems are different from classification problems. In a classification problem, we are trying to predict discrete classes, such as which class an Iris flower belongs to. But in a regression problem, we are trying to predict a continuous variable, such as the price of a car, as you can see in the following example.

**Example experiment**

We use automobile price prediction as our example for regression. We are trying to predict the price of a car based on its features including make, fuel type, body type, drive wheel, etc. The experiment is shown in Figure 11.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/11.png)

Figure 11 Experiment of Automobile Price Regression Problem

Visualizing [Score Model][score-model] module, the result looks like Figure 12.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/12.png)

Figure 12 Visualize Scoring Result for Automobile Price Prediction Problem

**Result interpretation**

In this scoring result, Scored Labels is the result column. The numbers are the predicted price for each car.

**Web service publication**

We can publish the regression experiment into a web service and call it for automobile price prediction in the same way as in the two-class classification use case.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/13.png)

Figure 13 Scoring Experiment of Automobile Price Regression Problem

Running the web service, the returned result looks like Figure 14. The predicted price for this car is 15085.52. 
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/13_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/14.png)

Figure 14 Web Service Result of Automobile Price Regression Problem

##Clustering

**Example experiment**

Let’s use the Iris dataset again to build a clustering experiment. Here, we filter out the class labels in the dataset so that it only has features and can be used for clustering. In this Iris use case, let’s specify the number of clusters to be 2 during training process, which means we would like to cluster the flowers into two classes. The experiment is shown in Figure 15.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/15.png)

Figure 15 Experiment of Iris Clustering Problem

Clustering differs from classification in that the training dataset doesn’t have ground-truth labels by itself. Rather, we are interested in how to group the training dataset instances into distinct clusters. During the training process, the model labels the entries by learning the differences between their features. After that, the trained model can be further used to classify future entries. There are two parts of the result we are interested in within a clustering problem. The first part is how to label the training dataset, the second part is how to classify a new dataset with the trained model.

The first part of the result can be visualized by clicking on the left output port of [Train Clustering Model][train-clustering-model] module and clicking on **Visualize** afterwards. The visualization window is shown in Figure 16.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/16.png)

Figure 16 Visualize Clustering Result for Training Dataset

The result of the second part, clustering new entries with the trained clustering model, is shown in Figure 17.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/17.png)

Figure 17 Visualize Clustering Result on New Dataset

**Result interpretation**

Although the results of the two parts stem from different experiment stages, they look exactly the same and are interpreted in the same way. The first four columns are features. The last column Assignments is the prediction result. The entries assigned the same number are predicted to be in the same cluster, i.e. they share similarities in some way (we have used the default Euclidean distance metric in this experiment). Recall that we specified the number of clusters to be 2. So in the Assignments column, the entries are labeled either 0 or 1.

**Web service publication**

We can publish the clustering experiment into a web service and call it for clustering predictions in the same way as in the two-class classification use case.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/18.png)

Figure 18 Scoring Experiment of Iris Clustering Problem

After running the web service, the returned result looks like Figure 19. This flower is predicted to be in cluster 0. 
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/18_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/19.png)

Figure 19 Web Service Result of Iris Two-Class Classification

##Recommender System
**Example experiment**

For recommender systems, we will use the restaurant recommendation problem as an example: to recommend restaurants for customers based on their rating history. The input data consists of three parts: 

* restaurant ratings from customers 
* customer feature data 
* restaurant feature data 

There are several things we can do with Azure Machine Learning’s built-in [Train Matchbox Recommender][train-matchbox-recommender] module: 

- Predict ratings for a given user and item
- Recommend items to a given user
- Find users related to a given user
- Find items related to a given item

We can choose what we want to do by selecting from the four options in the **Recommender prediction kind** menu on the right panel. Here, we will walk through all of the four scenarios. A typical Azure Machine Learning experiment for recommender system looks like Figure 20. For details on how to use those recommender system modules, please see help page for [Train Matchbox Recommender][train-matchbox-recommender] and [Score Matchbox Recommender][score-matchbox-recommender].
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/19_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/20.png)

Figure 20 Recommender System Experiment

**Result interpretation**

*Predict ratings for a given user and item*

By selecting Rating Prediction in the **Recommender prediction kind** menu, we ask the recommender system to predict the rating for a given user and item. The visualization of the [Score Matchbox Recommender][score-matchbox-recommender] output looks like Figure 21.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/21.png)

Figure 21 Visualize Score Result of Recommender System - Rating Prediction

There are three columns. The first two columns are the user-item pairs provided by the input data. The third column is the predicted rating of a user for a certain item. For example, in the first row, customer U1048 is predicted to rate restaurant 135026 as 2.

*Recommend items to a given user*

By selecting **Item Recommendation** in the **Recommender prediction kind** menu, we ask the recommender system to recommend items to a given user. There is one more parameter we need to choose in this scenario, Recommended item selection. The option **From Rated Items (for model evaluation)** is primarily for model evaluation during the training process. For this prediction stage, we will choose **From All Items**. The visualization of the [Score Matchbox Recommender][score-matchbox-recommender] output looks like Figure 22.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/22.png)

Figure 22 Visualize Score Result of Recommender System - Item Recommendation

There are six columns. The first column represents the given user IDs to recommend items for, provided by the input data. The rest five columns represent the items recommended to the user, in a descending order in terms of relevance. For example, in the first row, the most recommended restaurant for customer U1048 is 134986, followed by 135018 134975 135021 and 132862. 

*Find users related to a given user*

By selecting Related Users in the “Recommender prediction kind” menu, we ask the recommender system to find related users to a given user. Related users are the users who have similar preferences. There is one more parameter we need to choose in this scenario, Related user selection. The option “From Users That Rated Items (for model evaluation)” is primarily for model evaluation during the training process. We choose “From All Users” for this prediction stage. The visualization of the [Score Matchbox Recommender][score-matchbox-recommender] output looks like Figure 23.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/23.png)

Figure 23 Visualize Score Result of Recommender System - Related Users

There are six columns. The first column are the given user IDs to find related users for, provided by input data. The rest five columns store the predicted related users of the user, in a descending order in terms of relevance. For example, in the first row, the most relevant customer for customer U1048 is U1051, followed by U1066 U1044 U1017 and U1072. 

**Find items related to a given item**

By selecting **Related Items** in the **Recommender prediction kind** menu, we ask the recommender system to find related items to a given item. Related items are the items most likely to be liked by the same user. There is one more parameter we need to choose in this scenario, Related item selection. The option **From Rated Items (for model evaluation)** is primarily for model evaluation during the training process. We choose **From All Items** for this prediction stage. The visualization of the [Score Matchbox Recommender][score-matchbox-recommender] output looks like Figure 24.
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/24.png)

Figure 24 Visualize Score Result of Recommender System - Related Items

There are six columns. The first column represents the given item IDs to find related items for, provided by the input data. The other five columns store the predicted related items of the item, in a descending order in terms of relevance. For example, in the first row, the most relevant item for item 135026 is 135074, followed by 135035 132875 135055 and 134992. 
Web service publication

The process of publishing these experiments as web services to get predictions is similar for each of the four scenarios. Here we will take the second scenario, recommend items to a given user, as an example. You can follow the same procedure with the other three.

Saving the trained recommender system as a trained model, filtering the input data to a single user ID column as requested, we can hook up the experiment as in Figure 25 and publish it as a web service.

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/25.png)
 
Figure 25 Scoring Experiment of Restaurant Recommendation Problem 

Running the web service, the returned result looks like Figure 14. The five recommended restaurants for user U1048 are 134986, 135018, 134975, 135021 and 132862. 
 
![screenshot_of_experiment](./media/machine-learning-interpret-model-results/25_1.png)

![screenshot_of_experiment](./media/machine-learning-interpret-model-results/26.png)

Figure 26 Web Service Result of Restaurant Recommendation Problem


<!-- Module References -->
[assign-to-clusters]: https://msdn.microsoft.com/library/azure/eed3ee76-e8aa-46e6-907c-9ca767f5c114/
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[project-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
[score-matchbox-recommender]: https://msdn.microsoft.com/library/azure/55544522-9a10-44bd-884f-9a91a9cec2cd/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
[train-clustering-model]: https://msdn.microsoft.com/library/azure/bb43c744-f7fa-41d0-ae67-74ae75da3ffd/
[train-matchbox-recommender]: https://msdn.microsoft.com/library/azure/fa4aa69d-2f1c-4ba4-ad5f-90ea3a515b4c/
