<properties 
	pageTitle="Feature Engineering and Selection in Azure Machine Learning | Azure" 
	description="Explains the purposes of feature selection and feature engineering and provides examples of their role in the data enhancement process of machine learning." 
	services="machine-learning"
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="zhangya;bradsev" />


# Feature engineering and selection in Azure Machine Learning

This topic explains the purposes of feature engineering and feature selection in the data enhancement process of machine learning. It illustrates what these processes involve using examples provided by Azure Machine Learning Studio.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

The training data used in machine learning can often be enhanced by the selection or extraction of features from the raw data collected. A  example of an engineered feature in the context of learning how to classify the images of handwritten characters is a bit density map constructed from the raw bit distribution data. This map can help locate the edges of the characters more efficiently than the raw distribution.

Engineered and selected features increase the efficiency of the training process which attempts to extract the key information contained in the data. They also improve the power of these models to classify the input data accurately and to predict outcomes of interest more robustly. Feature engineering and selection can also combine to make the learning more computationally tractable. It does so by enhancing and then reducing the number of features needed to calibrate or train a model. Mathematically speaking, the features selected to train the model are a minimal set of independent variables that explain the patterns in the data and then predict outcomes successfully. 

The engineering and selection of features is one part of a larger process, which typically consists of four steps: 

* data collection 
* data enhancement 
* model construction 
* post-processing 

Engineering and selection are the **data enhancement** step of machine learning. Three aspects of this process may be distinguished for our purposes:

* **data pre-processing**: This process tries to insure that the collected data is clean and consistent. It includes tasks such as integrating multiple datasets, handling missing data, handling inconsistent data, and converting data types.
* **feature engineering** This process attempts to create additional relevant features from the existing raw features in the data, and to increase predictive power to the learning algorithm.
* **feature selection**: This process selects the key subset of original data features in an attempt to reduce the dimensionality of the training problem. 

This topic only covers the feature engineering and feature selection aspects of the data enhancement process. For additional information on the data pre-processing step, see the [Pre-processing Data in Azure ML Studio](http://azure.microsoft.com/documentation/videos/preprocessing-data-in-azure-ml-studio/) video.


## Creating Features from Your Data - Feature Engineering

The training data consists of a matrix composed of examples (records or observations stored in rows), each of which has a set of features (variables or fields stored in columns). The features specified in the experimental design are expected to characterize the patterns in the data. Although many of the raw data fields can be directly included in the selected feature set used to train a model, it is often the case that additional (engineered) features need to be constructed from the features in the raw data to generate an enhanced training dataset. 

What kind of features should be created to enhance the dataset when training a model? Engineered features that enhance the training provide information that better differentiates the patterns in the data. We expect the new features to provide additional information that is not clearly captured or easily apparent in the original or existing feature set. But this process is something of an art. Sound and productive decisions often require some domain expertise. 

When starting with Azure Machine Learning, it is easiest to grasp this process concretely using samples provided in the Studio. Two examples are presented here:

* A regression example [Prediction of the number of bike rentals](machine-learning-sample-prediction-of-number-of-bike-rentals.md) in a supervised experiment where the target values are known 
* A text mining classification example using [Feature Hashing][feature-hashing]

### Example 1: Adding Temporal Features for Regression Model ###

Let's use the experiment "Demand forecasting of bikes" in Azure Machine Learning Studio to demonstrate how to engineer features for a regression task. The objective of this experiment is to predict the demand for the bikes, that is, the number of bike rentals within a specific month/day/hour. The dataset "Bike Rental UCI dataset" is used as the raw input data. This dataset is based on real data from the Capital Bikeshare company that maintains a bike rental network in Washington DC in the United States. The dataset represents the number of bike rentals within a specific hour of a day in the years 2011 and year 2012 and contains 17379 rows and 17 columns. The raw feature set contains weather conditions (temperature/humidity/wind speed) and the type of the day (holiday/weekday). The field to predict is "cnt", a count which represents the bike rentals within a specific hour and which ranges ranges from 1 to 977.

With the goal of constructing effective features in the training data, four regression models are built using the same algorithm but with four different training datasets. The four datasets represent the same raw input data, but with an increasing number of features set. These features are grouped into four categories:
 
1. A = weather + holiday + weekday + weekend features for the predicted day
2. B = number of bikes that were rented in each of the previous 12 hours
3. C = number of bikes that were rented in each of the previous 12 days at the same hour
4. D = number of bikes that were rented in each of the previous 12 weeks at the same hour and the same day

Besides feature set A, which already exist in the original raw data, the other three sets of features are created through the feature engineering process. Feature set B captures very recent demand for the bikes. Feature set C captures the demand for bikes at a particular hour. Feature set D captures demand for bikes at particular hour and particular day of the week. The four training datasets each includes feature set A, A+B, A+B+C, and A+B+C+D, respectively.

In the Azure Machine Learning experiment, these four training datasets are formed via four branches from the pre-processed input dataset. Except the left most branch, each of these branches contains an [Execute R Script][execute-r-script] module, in which a set of derived features (feature set B, C, and D) are respectively constructed and appended to the imported dataset. The following figure demonstrates the R script used to create feature set B in the second left branch.

![create features](./media/machine-learning-feature-selection-and-engineering/addFeature-Rscripts.png) 

The comparison of the performance results of the four models are summarized in the following table. The best results are shown by features A+B+C. Note that the error rate decreases when additional feature set are included in the training data. It verifies our presumption that the feature set B, C provide additional relevant information for the regression task. But adding the D feature does not seem to provide any additional reduction in the error rate.

![result comparison](./media/machine-learning-feature-selection-and-engineering/result1.png) 

### <a name="example2"></a> Example 2: Creating Features in Text Mining  

Feature engineering is widely applied in tasks related to text mining, such as document classification and sentiment analysis. For example, when we want to classify documents into several categories, a typical assumption is that the word/phrases included in one doc category are less likely to occur in another doc category. In another words, the frequency of the words/phrases distribution is able to characterize different document categories. In text mining applications, because individual pieces of text-contents usually serve as the input data, the feature engineering process is needed to create the features involving word/phrase frequencies.

To achieve this task, a technique called **feature hashing** is applied to efficiently turn arbitrary text features into indices. Instead of associating each text feature (words/phrases) to a particular index, this method functions by applying a hash function to the features and using their hash values as indices directly.

In Azure Machine Learning, there is a [Feature Hashing][feature-hashing] module that creates these word/phrase features conveniently. Following figure shows an example of using this module. The input dataset contains two columns: the book rating ranging from 1 to 5, and the actual review content. The goal of this [Feature Hashing][feature-hashing] module is to retrieve a bunch of new features that show the occurrence frequency of the corresponding word(s)/phrase(s) within the particular book review. To use this module, we need to complete the following steps:

* First, select the column that contains the input text ("Col2" in this example). 
* Second, set the "Hashing bitsize" to 8, which means 2^8=256 features will be created. The word/phase in all the text will be hashed to 256 indices. The parameter "Hashing bitsize" ranges from 1 to 31. The word(s)/phrase(s) are less likely to be hashed into the same index if setting it to be a larger number. 
* Third, set the parameter "N-grams" to 2. This gets the occurrence frequency of unigrams (a feature for every single word) and bigrams (a feature for every pair of adjacent words) from the input text. The parameter "N-grams" ranges from 0 to 10, which indicates the maximum number of sequential words to be included in a feature.  

!["Feature Hashing" module](./media/machine-learning-feature-selection-and-engineering/feature-Hashing1.png) 

The following figure shows what the these new feature look like. 

!["Feature Hashing" example](./media/machine-learning-feature-selection-and-engineering/feature-Hashing2.png) 

## Filtering Features from Your Data - Feature Selection  ##

Feature selection is a process that is commonly applied for the construction of training datasets for predictive modeling tasks such as classification or regression tasks. The goal is to select a subset of the features from the original dataset that reduce its dimensions by using a minimal set of features to represent the maximum amount of variance in the data. This subset of features are, then, the only features to be included to train the model. Feature selection serves two main purposes. 

* First, feature selection often increases classification accuracy by eliminating irrelevant, redundant, or highly correlated features. 
* Second, it decreases the number of features which makes model training process more efficient. This is particularly important for learners that are expensive to train such as support vector machines. 

Although feature selection does seek to reduce the number of features in the dataset used to train the model, it is not usually referred to by the term "dimensionality reduction". Feature selection methods extract a subset of original features in the data without changing them.  Dimensionality reduction methods employ engineered features that can transform the original features and thus modify them. Examples of dimensionality reduction methods include Principal Component Analysis, canonical correlation analysis, and Singular Value Decomposition.

Among others, one widely applied category of feature selection methods in a supervised context is called "filter based feature selection". By evaluating the correlation between each feature and the target attribute, these methods apply a statistical measure to assign a score to each feature. The features are then ranked by the score, which may be used to help set the threshold for keeping or eliminating a specific feature. Examples of the statistical measures used in these methods include Person correlation, mutual information, and the Chi squared test.

In Azure Machine Learning Studio, there are modules provided for feature selection. As shown in the following figure, these modules include [Filter-Based Feature Selection][filter-based-feature-selection] and [Fisher Linear Discriminant Analysis][fisher-linear-discriminant-analysis].
 
![Feature selection example](./media/machine-learning-feature-selection-and-engineering/feature-Selection.png)


Consider, for example, the use of the [Filter-Based Feature Selection][filter-based-feature-selection] module. For the purpose of convenience, we continue to use the text mining example outlined above. Assume that we want to build a regression model after a set of 256 features are created through the [Feature Hashing][feature-hashing] module, and that the response variable is the "Col1" and represents a book review ratings ranging from 1 to 5. By setting "Feature scoring method" to be "Pearson Correlation", the "Target column" to be "Col1", and the "Number of desired features" to 50. Then the module [Filter-Based Feature Selection][filter-based-feature-selection] will produce a dataset containing 50 features together with the target attribute "Col1". The following figure shows the flow of this experiment and the input parameters we just described.

![Feature selection example](./media/machine-learning-feature-selection-and-engineering/feature-Selection1.png)

The following figure shows the resulting datasets. Each feature is scored based on the Pearson Correlation between itself and the target attribute "Col1". The features with top scores are kept.

![Feature selection example](./media/machine-learning-feature-selection-and-engineering/feature-Selection2.png)

The corresponding scores of the selected features are shown in the following figure.

![Feature selection example](./media/machine-learning-feature-selection-and-engineering/feature-Selection3.png)

By applying this [Filter-Based Feature Selection][filter-based-feature-selection] module, 50 out of 256 features are selected because they have the most correlated features with the target variable "Col1", based on the scoring method "Pearson Correlation". 

## Conclusion
Feature engineering and feature selection are two commonly performed steps to prepare the training data when building a machine learning model. Normally feature engineering is applied first to generate additional features, and then the feature selection step is performed to eliminate irrelevant, redundant, or highly correlated features. 

Note that it is not always necessarily to perform feature engineering or feature selection. Whether it is needed or not depends on the data we have or collect, the algorithm we pick, and the objective of the experiment.       

<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[feature-hashing]: https://msdn.microsoft.com/library/azure/c9a82660-2d9c-411d-8122-4d9e0b3ce92a/
[filter-based-feature-selection]: https://msdn.microsoft.com/library/azure/918b356b-045c-412b-aa12-94a1d2dad90f/
[fisher-linear-discriminant-analysis]: https://msdn.microsoft.com/library/azure/dcaab0b2-59ca-4bec-bb66-79fd23540080/
