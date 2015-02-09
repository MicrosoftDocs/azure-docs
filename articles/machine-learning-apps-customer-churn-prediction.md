<properties title="Machine Learning app: Text Analytics | Azure" pageTitle="Machine Learning app: Customer Churn Prediction | Azure " description="Customer Churn Prediction is a churn analytics service built with Azure Machine Learning. It's designed to predict when a customer (player, subscriber, user, etc.) is likely to end his or her relationship with a company or service." services="machine-learning" documentationCenter="" authors="LuisCabrer" manager="paulettm" /> 

<tags ms.service="machine-learning" ms.devlang="na" ms.topic="reference" ms.tgt_pltfrm="na" ms.workload="multiple" ms.date="02/09/2015" ms.author="luisca"/>


# Machine Learning Customer Churn Prediction Service#

[Customer Churn Prediction](http://go.microsoft.com/fwlink/?LinkID=525814&clcid=0x409) is a churn analytics service built with Azure Machine Learning. It's designed to predict when a customer (player, subscriber, user, etc.) is likely to end his or her relationship with a company or service.  Being able to predict which customers have a high risk of leaving the relationship with a company provides the company with a window of opportunity to approach them and reduce the likelihood of their leaving.



##How does the service work?##
By providing historical data to the service, you enable it to learn and train a model that fits your business. Once the model has learned these patterns, you can provide it information about your more recent customers and receive a prediction identifying the subset of customers that have a high risk of leaving your business.

##Using the service##
Follow these three simple steps to get started predicting churn for your business:

1.	Answer a small number of questions about your business churn problem. The answer to these questions will help tune our service to your business needs and ensure the best results.

2.	Provide historical data to the service. This data needs to cover the interactions between customers and your business (e.g., details of purchases made by customers) for a consecutive period of time based on your churn problem description. Using this data, our service will train a model to predict future churn risk for your customers.

3.	Try your new model!  Provide history data similar to the data you used for training the model, but this data should cover a different set of customers and should be as recent as possible. In return, our service will provide a probability score for each customer - the higher the score, the higher the probability that the customer will leave your business.


