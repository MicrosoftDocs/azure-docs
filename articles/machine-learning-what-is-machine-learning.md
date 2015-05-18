<properties 
    pageTitle="What is Azure Machine Learning? | Microsoft Azure" 
    description="Overview of the Azure Machine Learning service." 
    services="machine-learning" 
    documentationCenter="" 
    authors="tedway" 
    manager="neerajkh" 
    editor="cgronlun"/>

<tags 
    ms.service="machine-learning" 
    ms.workload="data-services" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/22/2015" 
    ms.author="tedway;olgali"/>


# What is machine learning?
Machine learning is at work all around you.  When you shop online, machine learning helps recommend other products based on what you've purchased.  When your credit card is swiped, machine learning helps the bank do fraud detection and notify you if the transaction seems suspicious. Machine learn is the process of creating models to learn from existing data and do predictive analytics on future data. 

## What is Azure Machine Learning?
Azure Machine Learning is a powerful cloud-based predictive analytics service that makes it possible to quickly create analytics solutions. We built Azure Machine Learning to democratize machine learning: We eliminated the heavy lifting involved in building and deploying machine learning technology to make it accessible to everybody. It is a fully managed service, which means you do not need to buy any hardware nor manually manage virtual machines.

You can use the browser-based tool [Machine Learning Studio](machine-learning-what-is-ml-studio.md) to quickly create and automate machine learning workflows.  You can drag and drop hundreds of existing [Machine Learning libraries](https://msdn.microsoft.com/library/azure/f5c746fd-dcea-4929-ba50-2a79c4c067d7) to jump-start your predictive analytics solutions, and then optionally add your own custom [R](machine-learning-r-quickstart.md) and [Python](machine-learning-execute-python-scripts.md) scripts to extend them. Studio works in any browser and enables you to rapidly develop and iterate on solutions.
![Predictive analytics experiments in the cloud with Azure Machine Learning Studio](./media/machine-learning-what-is-machine-learning/AzureMLStudio.png)

You can easily discover and create [web services](machine-learning-publish-a-machine-learning-web-service.md), [train and retrain your models through APIs](machine-learning-retrain-models-programmatically.md), [manage endpoints](machine-learning-create-endpoint.md) and [scale web services](machine-learning-scaling-endpoints.md) on a per customer basis, and configure diagnostics for service monitoring and debugging.  The newest features include:

- The ability to create a configurable custom R module, incorporate your own train/predict R-scripts, and add Python scripts using a large ecosystem of libraries such as numpy, scipy, pandas, or scikit-learn. You can now train on terabytes of data using [Learning with Counts][learning-with-counts], use PCA or one-class SVM for anomaly detection, and easily modify, filter, and clean data using familiar SQLite. 
- [Machine Learning Community Gallery](machine-learning-gallery-how-to-use-contribute-publish.md) lets you discover and use interesting experiments authored by others. You can ask questions or post comments about experiments in the [Gallery](http://gallery.azureml.net) or publish your own. You can share links to interesting experiments via social channels such as LinkedIn and Twitter. The gallery is a great way for users to get started with Azure Machine Learning and learn from others in the community.
![Try predictive experiment samples or contribute your own in Azure Machine Learning Gallery](./media/machine-learning-what-is-machine-learning/AzureMLGallery.png)
- You can purchase [Marketplace apps](https://datamarket.azure.com/browse?query=machine+learning) through an Azure subscription and consume finished web services for Recommendations, Text Analytics, and Anomaly Detection directly from the Azure Marketplace. 
- A step-by-step guide for the Data Science journey from raw data to a consumable web service to ease the path for cloud-based data science. We have added the ability to use popular tools such as iPython Notebook and Python Tools for Visual Studio with Azure Machine Learning.

## Get started now
You can learn the basics of predictive analytics and machine learning using a [step-by-step tutorial](machine-learning-create-experiment.md) and by [building on samples](machine-learning-sample-experiments.md).  No Azure subscription or credit card is required to get started using Machine Learning when you try experiments in Studio.


<!-- Module References -->
[learning-with-counts]: https://msdn.microsoft.com/library/azure/81c457af-f5c0-4b2d-922c-fdef2274413c/
