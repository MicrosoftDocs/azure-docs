<properties
    pageTitle="What is Machine Learning on Azure? | Microsoft Azure"
    description="Explains basic concepts of the fully-managed Machine Learning service, a cloud technology you can use to create, operationalize, and monetize solutions."
	keywords="what is machine learning,cloud technology,predictive,what is predictive analytics,operationalize"
	services="machine-learning"
    documentationCenter=""
    authors="cjgronlund"
    manager="paulettm"
    editor="cgronlun"/>

<tags
    ms.service="machine-learning"
    ms.workload="data-services"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="04/28/2016"
    ms.author="cgronlun;tedway;olgali"/>


# Introduction to machine learning on Microsoft Azure

## What is machine learning?

Machine learning uses computers to run predictive models that learn from existing data in order to forecast future behaviors, outcomes, and trends.

These forecasts or predictions from machine learning can make apps and devices smarter. When you shop online, machine learning helps recommend other products you might like based on what you've purchased. When your credit card is swiped, machine learning compares the transaction to a database of transactions and helps the bank do fraud detection.

## What is Machine Learning on Microsoft Azure?

Azure Machine Learning is a powerful cloud-based predictive analytics service that makes it possible to quickly create and deploy predictive models as analytics solutions.

Azure Machine Learning not only provides tools to model predictive analytics, but also provides a fully-managed service you can use to deploy your predictive models as ready-to-consume web services. Azure Machine Learning provides tools for creating complete predictive analytics solutions in the cloud: Quickly create, test, operationalize, and manage predictive models. You do not need to buy any hardware nor manually manage virtual machines.

![What is machine learning? Basic workflow to operationalize predictive analytics on Azure Machine Learning.](./media/machine-learning-what-is-machine-learning/machine-learning-service-parts-and-workflow.png)

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## What is predictive analytics?

Predictive analytics uses various statistical techniques - in this case, machine learning - to analyze collected or current data for patterns or trends in order to forecast future events.

Azure Machine Learning is a particularly powerful way to do predictive analytics: You can work from a ready-to-use library of algorithms, create models on an internet-connected PC without purchasing additional equipment or infrastructure, and deploy your predictive solution quickly. You can also find ready-to-use examples and solutions in the [Microsoft Azure Marketplace](https://datamarket.azure.com/browse?query=machine+learning) or [Cortana Intelligence Gallery](http://gallery.cortanaintelligence.com/).

## Build complete machine learning solutions in the cloud

Azure Machine Learning has everything you need to create predictive analytics solutions in the cloud from a large algorithm library, to a studio for building models, to an easy way to deploy your model as a web service.

### Machine Learning Studio: Create predictive models

Create predictive models in [Machine Learning Studio](machine-learning-what-is-ml-studio.md), a browser-based tool, by dragging, dropping, and connecting modules.

![What is predictive analytics: Example of a predictive analytics experiment in Azure Machine Learning Studio](./media/machine-learning-what-is-machine-learning/azure-machine-learning-studio-predictive-score-experiment.png)

* Use a large library of [Machine Learning algorithms and modules](https://msdn.microsoft.com/library/azure/f5c746fd-dcea-4929-ba50-2a79c4c067d7) in Machine Learning Studio to jump-start your predictive models. Choose from a library of sample experiments, R and Python packages, and best-in-class algorithms from Microsoft businesses like Xbox and Bing. Extend Studio modules with your own custom  [R](machine-learning-r-quickstart.md) and [Python](machine-learning-execute-python-scripts.md) scripts.
* In [Cortana Intelligence Gallery](machine-learning-gallery-how-to-use-contribute-publish.md) you can try analytics solutions authored by others or contribute your own using Azure services including Machine Learning, HDInsight (Hadoop), Stream Analytics, and Data Lake Analytics, as well as Azure big data stores and data management services.  Post questions or comments about experiments to the community, or share links to experiments via social networks such as LinkedIn and Twitter.  

	![Try predictive experiments or contribute your own in Azure Cortana Intelligence Gallery](./media/machine-learning-what-is-machine-learning/machine-learning-cortana-intelligence-gallery.png)

### Operationalize predictive analytics solutions: Purchase web services or publish your own

* Purchase ready-to-consume web services from [Microsoft Azure Marketplace](https://datamarket.azure.com/browse?query=machine+learning), such as Recommendations, Text Analytics, and Anomaly Detection.

* Operationalize your predictive analytics models:
    * [Deploy web services](machine-learning-publish-a-machine-learning-web-service.md)
    * [Train and retrain models through APIs](machine-learning-retrain-models-programmatically.md)
    * [Manage web service endpoints](machine-learning-create-endpoint.md)
    * [Scale web services](machine-learning-scaling-endpoints.md)
    * [Consume web services](machine-learning-consume-web-services.md)

## Key machine learning terminology and concepts
### Data exploration, descriptive analytics, and predictive analytics

**Data exploration** is the process of gathering information about a large and often unstructured data set in order find characteristics for focused analysis. **Data mining** refers to automated data exploration.

**Descriptive analytics** is the process of analyzing a data set in order to summarize what happened. The vast majority of business analytics - such as sales reports, web metrics, and social networks analysis - are descriptive.

**Predictive analytics** is the process of building models from historical or current data in order to forecast future outcomes.


### Supervised and unsupervised learning
 **Supervised learning** algorithms are trained with labeled data - in other words, data comprised of examples of the answers wanted. For instance, a model that identifies fraudulent credit card use would be trained from a data set in which data points indicating known fraudulent and valid charges were labeled. Most machine learning is supervised.

 **Unsupervised learning** is used on data with no labels, and the goal is to find relationships in the data. For instance, you might want to find groupings of customer demographics with similar buying habits.

### Model training and evaluation
A machine learning model is an abstraction of the question you are trying to answer or the outcome you want to predict. Models are trained and evaluated from existing data.

#### Training from data
In Azure Machine Learning, a model is built from an algorithm module that processes training data and functional modules, such as a scoring module.

In supervised learning, if you're training a fraud detection model, you'll use a set of transactions that are labeled as either fraudulent or valid. You'll split your data set randomly, and use part to train the model and part to test or evaluate the model.

#### Evaluation data
Once you have a trained model, evaluate the model using the remaining test data. You use data you already know the outcomes for, so that you can tell whether your model predicts accurately.

### Other common machine learning terms

* **algorithm**: A self-contained set of rules used to solve problems through data processing, calculation, or automated reasoning.
* **categorical data**: Data that is organized by categories and that can be divided into groups. For example a categorical data set for autos could specify year, make, model, and price.
* **classification**: A model for organizing data points into categories based on a data set for which category groupings are already known.
* **feature engineering**: The process of extracting or selecting features related to a data set in order to enhance the data set and improve outcomes. For instance, airfare data could be enhanced by days of the week and holidays. See [Feature selection and engineering in Azure Machine Learning](machine-learning-feature-selection-and-engineering.md).
* **module**: A functional element in a Machine Learning Studio model, such as the Enter Data module which enables entering and editing small data sets. An algorithm is also a type of module in Machine Learning Studio.
* **model**: For supervised learning, a model is the product of a machine learning experiment comprised of a training data set, an algorithm module, and functional modules, such as a Score Model module.
* **numerical data**: Data that has meaning as measurements (continuous data) or counts (discrete data). Also referred to as *quantitative data*.
* **partition**: The method by which you divide data into samples. See [Partition and Sample](https://msdn.microsoft.com/library/azure/dn905960.aspx) for more information.
* **prediction**: A prediction is a forecast of a value or values from a machine learning model. You might also see the term "predicted score"; however, predicted scores are not the final output of a model. An evaluation of the model follows the score.
* **regression**: A model for predicting a continuous value based on independent variables, such as predicting the price of a car based on its year and make.
* **score**: A predicted value generated from a trained classification or regression model, using the [Score Model module](https://msdn.microsoft.com/library/azure/dn905995.aspx) in Machine Learning Studio. Classification models also return a score for the probability of the predicted value. Once you've generated scores from a model, you can evaluate the model's accuracy using the [Evaluate Model module](https://msdn.microsoft.com/library/azure/dn905915.aspx).
* **sample**: A part of a data set intended to be representative of the whole. Samples can be selected randomly or based on specific features of the data set.



## Next steps
You can learn the basics of predictive analytics and machine learning using a [step-by-step tutorial](machine-learning-create-experiment.md) and by [building on samples](machine-learning-sample-experiments.md).  


<!-- Module References -->
[learning-with-counts]: https://msdn.microsoft.com/library/azure/81c457af-f5c0-4b2d-922c-fdef2274413c/
