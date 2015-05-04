<properties 
	pageTitle="Sample Web Services Built with R on Azure ML and Published to Marketplace | Azure" 
	description="Sample Web Services Built with R on Azure ML and Published to Marketplace" 
	services="machine-learning" 
	documentationCenter="" 
	authors="jaymathe" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="jaymathe"/> 


#Sample solutions using R on Machine Learning and published to Marketplace

In Azure Machine Learning Studio, users can write R code and with a few clicks, publish it as a web service for applications and devices to consume around the world. 


[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]


From producing simple calculators that provide statistical functionality to creating a custom text-mining sentiment analysis predictor, both new and experienced R users can benefit from the ease with which users of Azure Machine Learning can operationalize R code. While these web services could be consumed by users, potentially through a mobile app or a website, the purpose of these web services is also to serve as an example of how Machine Learning can operationalize R scripts for analytical purposes and be used to create web services on top of R code.

On this page you can find a broad set of example web services that were created using Machine Learning and published to the Azure Marketplace. Each web service has a comprehensive document attached, embedding sample data sets for testing the services and explaining how the user can create a similar service themselves. 

![Workflow][1]

Consider the following scenarios.

##Scenario 1: generic model 
A user works with a generic model that can be applied to a new user’s data, such as a basic forecasting of time series data or a custom-built R method with advanced analytics. This user publishes the model as a web service for others to consume with their data.

* [Binary Classifier](machine-learning-r-csharp-binary-classifier.md)
* [Cluster Model](machine-learning-r-csharp-cluster-model.md)
* [Multivariate Linear Regression](machine-learning-r-csharp-multivariate-linear-regression.md)
* [Forecasting - Exponential Smoothing](machine-learning-r-csharp-forecasting-exponential-smoothing.md)
* [ETS + STL Forecasting](machine-learning-r-csharp-retail-demand-forecasting.md)
* [Forecasting - Autoregressive Integrated Moving Average (ARIMA)](machine-learning-r-csharp-arima.md)
* [Survival Analysis](machine-learning-r-csharp-survival-analysis.md)

##Scenario 2: trained model – specific data 
A user has data that provides useful predictions through R code, such as a large sample of personality questionnaires clustered through a k-means algorithm to predict the user’s personality type, or health survey data that can be used to predict an individual’s risk for lung cancer with a survival analysis R package. The user publishes the data through a web service that predicts a new user’s outcome.

##Scenario 3: trained model – generic data 
A user has generic data (such as a text corpus) that allows a web service to be built and applied generically across different types of use cases and scenarios.

* [Lexicon Based Sentiment Analysis](machine-learning-r-csharp-lexicon-based-sentiment-analysis.md)

##Scenario 4: advanced calculator 
A user provides advanced calculations or simulations that don’t require any trained model or fitting of a model to the user’s data.

* [Difference in Proportions Test](machine-learning-r-csharp-difference-in-two-proportions.md)
* [Normal Distribution Suite](machine-learning-r-csharp-normal-distribution.md)
* [Binomial Distribution Suite](machine-learning-r-csharp-binomial-distribution.md)

##FAQ
For frequently asked questions on consumption of the web service or publishing to the Marketplace, see [here](machine-learning-marketplace-faq.md).

[1]: ./media/machine-learning-r-csharp-web-service-examples/base1.png


