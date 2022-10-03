---
title: What is Multivariate Anomaly Detection?
titleSuffix: Azure Cognitive Services
description: Overview of new Anomaly Detector preview multivariate APIs.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 07/06/2022
ms.author: mbullwin
ms.custom: references_regions
keywords: anomaly detection, machine learning, algorithms
---

# What is Multivariate Anomaly Detector? (Public Preview)

The **multivariate anomaly detection** APIs further enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between up to 300 different signals are now automatically counted as key factors. This new capability helps you to proactively protect your complex systems such as software applications, servers, factory machines, spacecraft, or even your business, from failures.

![Multiple time series line graphs for variables of: rotation, optical filter, pressure, bearing with anomalies highlighted in orange](./media/multivariate-graph.png)

Imagine 20 sensors from an auto engine generating 20 different signals like rotation, fuel pressure, bearing, etc. The readings of those signals individually may not tell you much about system level issues, but together they can represent the health of the engine. When the interaction of those signals deviates outside the usual range, the multivariate anomaly detection feature can sense the anomaly like a seasoned expert. The underlying AI models are trained and customized using your data such that it understands the unique needs of your business. With the new APIs in Anomaly Detector, developers can now easily integrate the multivariate time series anomaly detection capabilities into predictive maintenance solutions, AIOps monitoring solutions for complex enterprise software, or business intelligence tools.


## Sample Notebook

To learn how to call the Multivariate Anomaly Detector API, try this [Notebook](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/API%20Sample/Multivariate%20API%20Demo%20Notebook.ipynb). To run the Notebook, you only need a valid Anomaly Detector API **subscription key** and an **API endpoint**. In the notebook, add your valid Anomaly Detector API subscription key to the `subscription_key` variable, and change the `endpoint` variable to your endpoint.
 
Multivariate Anomaly Detector includes three main steps, **data preparation**, **training** and **inference**.
 
### Data preparation
For data preparation, you should prepare two parts of data, **training data** and **inference data**. As for training data, you should upload your data to Blob Storage and generate an SAS url which will be used in training API. As for inference data, you could either use the same data format as training data, or send the data into API header, which will be formatted as JSON. This depends on what API you choose to use in the inference process.
 
### Training
When training a model, you should call an asynchronous API on your training data, which means you won't get the model status immediately after calling this API, you should request another API to get the model status.
 
### Inference
In the inference process, you have two options to choose, an asynchronous API or a synchronous API. If you would like to do a batch validation, you are suggested to use the asynchronous API. If you want to do streaming in a short granularity and get the inference result immediately after each API request, you are suggested to use the synchronous API.
* As for the asynchronous API, you won't get the inference result immediately like training process, which means you should use another API to request the result after some time. Data preparation is similar with the training process.
* As for synchronized API, you could get the inference result immediately after you request, and you should send your data in a JSON format into the API body.

## Region support

The preview of Multivariate Anomaly Detector is currently available in 26 Azure regions.

| Geography | Regions           | 
| ------------- | ---------------- | 
| Africa         | South Africa North  | 
| Asia Pacific         | Southeast Asia, East Asia| 
| Australia    | Australia East |
| Brazil |Brazil South|
|Canada    |  Canada Central    |
| Europe         | North Europe, West Europe, Switzerland North | 
|France    |France Central |
|Germany| Germany West Central |
|India| Jio India West, Central India  |
|Japan    | Japan East    |
|Korea | Korea Central |
|Norway | Norway East|
|United Arab Emirates| UAE North |
| United Kingdom    | UK South |
| United States          | East US, East US 2, South Central US, West US, West US 2, West US 3,  Central US, North Central US| 




## Algorithms

See the following technical documents for information about the algorithms used:

* Blog: [Introducing Multivariate Anomaly Detection](https://techcommunity.microsoft.com/t5/azure-ai/introducing-multivariate-anomaly-detection/ba-p/2260679)
* Paper: [Multivariate time series Anomaly Detection via Graph Attention Network](https://arxiv.org/abs/2009.02040)


> [!VIDEO https://www.youtube.com/embed/FwuI02edclQ]


## Join the Anomaly Detector community

Join the [Anomaly Detector Advisors group on Microsoft Teams](https://aka.ms/AdAdvisorsJoin) for better support and any updates!

## Next steps

- [Tutorial](./tutorials/learn-multivariate-anomaly-detection.md): This article is an end-to-end tutorial of how to use the multivariate APIs.
- [Quickstarts](./quickstarts/client-libraries-multivariate.md).
- [Best Practices](./concepts/best-practices-multivariate.md): This article is about recommended patterns to use with the multivariate APIs.