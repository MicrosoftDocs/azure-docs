<properties title="Develop a predictive solution with Azure Machine Learning" pageTitle="Develop a predictive solution with Machine Learning | Azure" description="Walkthrough of how to create a predictive analytics experiment in Azure Machine Learning Studio" metaKeywords="" services="machine-learning" solutions="" documentationCenter="" authors="garye" manager="paulettm" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="machine-learning" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/06/2014" ms.author="garye" />


# Develop a predictive solution with Azure Machine Learning
 
Suppose you need to predict an individual's credit risk based on the information they give on a credit application.  

That's a complex problem, of course, but let's simplify the parameters of the question a bit and use it as an example of how you might be able to use Microsoft Azure Machine Learning with ML Studio and ML API service to create such a predictive analytics solution.  

In this walkthrough, we'll follow the process of developing a predictive analytics model in ML Studio and then publishing it to the ML API service. We'll start with publicly-available credit risk data, develop and train a predictive model based on that data, and then publish the model as a web service that can be used by others.  

We'll follow these steps:  

1.	[Create an ML workspace][create-workspace]
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	[Publish the web service][publish]
6.	[Access the web service][access-ws]

[create-workspace]: ../machine-learning-walkthrough-1-create-ml-workspace/
[upload-data]: ../machine-learning-walkthrough-2-upload-data/
[create-new]: ../machine-learning-walkthrough-3-create-new-experiment/
[train-models]: ../machine-learning-walkthrough-4-train-and-evaluate-models/
[publish]: ../machine-learning-walkthrough-5-publish-web-service/
[access-ws]: ../machine-learning-walkthrough-6-access-web-service/

This walkthrough is based on a simplified version of the 
[Credit risk prediction sample experiment][risk] included with ML Studio.

[risk]: ../machine-learning-sample-credit-risk-prediction/
