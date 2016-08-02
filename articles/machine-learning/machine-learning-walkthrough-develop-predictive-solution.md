<properties
	pageTitle="A predictive solution for credit risk with Machine Learning | Microsoft Azure"
	description="A detailed walkthrough showing how to create a predictive analytics solution for credit risk assessment in Azure Machine Learning Studio."
	keywords="credit risk, predictive analytics solution,risk assessment"
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
	ms.topic="get-started-article"
	ms.date="06/10/2016"
	ms.author="garye"/>


# Walkthrough: Develop a predictive analytics solution for credit risk assessment in Azure Machine Learning

Suppose you need to predict an individual's credit risk based on the information they give on a credit application.  

Credit risk assessment is a complex problem, of course, but let's simplify the parameters of the question a bit. Then, we can use it as an example of how you can use Microsoft Azure Machine Learning with Machine Learning Studio and the Machine Learning web service to create such a predictive analytics solution.  

In this detailed walkthrough, we'll follow the process of developing a predictive analytics model in Machine Learning Studio and then deploying it as an Azure Machine Learning web service. We'll start with publicly available credit risk data, develop and train a predictive model based on that data, and then deploy the model as a web service that can be used by others for credit risk assessment.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

<!-- -->

>[AZURE.TIP] To download and print a diagram that gives an overview of the capabilities of Machine Learning Studio, see [Overview diagram of Azure Machine Learning Studio capabilities](machine-learning-studio-overview-diagram.md).

To create a credit risk assessment solution, we'll follow these steps:  

1.	[Create a Machine Learning workspace](machine-learning-walkthrough-1-create-ml-workspace.md)
2.	[Upload existing data](machine-learning-walkthrough-2-upload-data.md)
3.	[Create a new experiment](machine-learning-walkthrough-3-create-new-experiment.md)
4.	[Train and evaluate the models](machine-learning-walkthrough-4-train-and-evaluate-models.md)
5.	[Deploy the web service](machine-learning-walkthrough-5-publish-web-service.md)
6.	[Access the web service](machine-learning-walkthrough-6-access-web-service.md)

This walkthrough is based on a simplified version of the
[Binary Classfication: Credit risk prediction](http://go.microsoft.com/fwlink/?LinkID=525270) sample experiment in the [Cortana Intelligence Gallery](http://gallery.cortanaintelligence.com/).
