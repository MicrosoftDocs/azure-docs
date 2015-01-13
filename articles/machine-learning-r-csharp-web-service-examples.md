<properties title="" pageTitle="Sample Web Services Built with R on Azure ML and Published to Marketplace | Azure" description="Sample Web Services Built with R on Azure ML and Published to Marketplace" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="jaymathe" manager="paulettm" editor="cgronlun" videoId="" scriptId=""/>

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/13/2014" ms.author="jaymathe" /> 


#Sample Web Services Built with R on Azure ML and Published to Marketplace




With the Azure Machine Learning Studio, users can write R code and with a few clicks of a button, publish it as a web service for other individuals and devices to consume around the world. From producing simple calculators that provide statistical functionality to creating a custom text mining sentiment analysis predictor for example, both new and experienced R users can benefit from the ease with which users of Azure ML can operationalize R code. While these web services could be consumed by users, potentially through a mobile app or a website, the purpose of these web services is also to serve as an example of how Azure ML can operationalize R scripts for analytical purposes and be used to create web services on top of R code.

In this page you can find a broad set of example web services that were created using Azure ML and published to the Microsoft Azure Marketplace. Each web service has a comprehensive document attached, embedding sample data sets for testing the services and explaining how the user can create a similar service themselves. 

![Workflow][1]

Consider the following scenarios:

####Scenario 1: Generic Model 
A user works with a generic model that can be applied to a new user’s data, such as a basic forecasting of time series data or a custom-built R method with advanced analytics. This user publishes the model as a web service for others to consume with their data.

* [Binary Classifier](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-binary-classifier/)
* [Cluster Model](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-cluster-model/)
* [Multivariate Linear Regression](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-multivariate-linear-regression/)
* [Forecasting-Exponential Smoothing](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-forecasting-exponential-smoothing/)
* [ETS + STL Forecasting](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-retail-demand-forecasting/)
* [Forecasting-AutoRegressive Integrated Moving Average (ARIMA)](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-arima/)
* [Survival Analysis](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-survival-analysis/)

####Scenario 2: Trained Model – Specific Data 
A user has data that provides useful predictions through R code, such as a large sample of personality questionnaires clustered through a k-means algorithm to predict the user’s personality type or health survey data that can be used to predict an individual’s risk for lung cancer with a survival analysis R package. The user publishes the data through a web service that predicts a new user’s outcome.

####Scenario 3: Trained Model – Generic Data 
A user has generic data (such as a text corpus) that allow a web service to be built that can be applied generically across different types of use cases and scenarios.

* [Lexicon Based Sentiment Analysis](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-lexicon-based-sentiment-analysis/)

####Scenario 4: Advanced Calculator 
A user provides advanced calculations or simulations, that doesn’t require any trained model or fitting of a model to the user’s data.

* [Difference in Proportions Test](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-difference-in-two-proportions/)
* [Normal Distribution Suite](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-normal-distribution/)
* [Binomial Distribution Suite](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-r-csharp-binomial-distribution/)

##FAQ
For Frequently Asked Questions on consumption of the web service or publishing to marketplace, see [here](http://azure.microsoft.com/en-us/documentation/articles/machine-learning-marketplace-faq).

[1]: ./media/machine-learning-r-csharp-web-service-examples/base1.png


