---
title: What is Anomaly Detector?
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API's algorithms to apply anomaly detection on your time series data.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: overview
ms.date: 10/17/2022
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
ms.custom: cog-serv-seo-aug-2020
---

# What is Anomaly Detector?

Anomaly Detector is an AI service with a set of APIs, which enables you to monitor and detect anomalies in your time series data with little ML knowledge, either batch validation or real-time inference.

This documentation contains the following types of articles:
* The [quickstarts](./Quickstarts/client-libraries.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-to/identify-anomalies.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](./concepts/anomaly-detection-best-practices.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/batch-anomaly-detection-powerbi.md) are longer guides that show you how to use this service as a component in broader business solutions.

## Features

With the Anomaly Detector, you can either detect anomalies in one variable using Univariate Anomaly Detector, or detect anomalies in multiple variables with Multivariate Anomaly Detector.

|Feature  |Description  |
|---------|---------|
|Univariate Anomaly Detector | Detect anomalies in one variable, like revenue, cost, etc. The model is selected automatically based on your data pattern. |
|Multivariate Anomaly Detector| Detect anomalies in multiple variables with correlations, which are usually gathered from equipment or other complex system. The underlying model used is a Graph Attention Network (GAT).|

### When to use **Univariate Anomaly Detector** v.s. **Multivariate Anomaly Detector**

If your goal is to detect anomalies out of a normal pattern on each individual time series purely based on their own historical data, use univariate anomaly detection APIs. For example, you want to detect daily revenue anomalies based on revenue data itself, or you want to detect a CPU spike purely based on CPU data.

If your goal is to detect system level anomalies from a group of time series data, use multivariate anomaly detection APIs. Particularly, when any individual time series won't tell you much, and you have to look at all signals (a group of time series) holistically to determine a system level issue. For example, you have an expensive physical asset like aircraft, equipment on an oil rig, or a satellite. Each of these assets has tens or hundreds of different types of sensors. You would have to look at all those time series signals from those sensors to decide whether there is a system level issue.

## Demo

Check out this [interactive demo](https://aka.ms/adDemo) to understand how Anomaly Detector works.
To run the demo, you need to create an Anomaly Detector resource and get the API key and endpoint.

## Notebook

To learn how to call the Anomaly Detector API, try this [Notebook](https://aka.ms/adNotebook). This Jupyter Notebook shows you how to send an API request and visualize the result.

To run the Notebook, you should get a valid Anomaly Detector API **subscription key** and an **API endpoint**. In the notebook, add your valid Anomaly Detector API subscription key to the `subscription_key` variable, and change the `endpoint` variable to your endpoint.

## Service availability and redundancy

### Is the Anomaly Detector service zone resilient?

Yes. The Anomaly Detector service is zone-resilient by default.

### How do I configure the Anomaly Detector service to be zone-resilient?

No customer configuration is necessary to enable zone-resiliency. Zone-resiliency for Anomaly Detector resources is available by default and managed by the service itself.


## Next steps

* [What is Univariate Anomaly Detector?](./overview-univariate.md)
* [What is Multivariate Anomaly Detector?](./overview-multivariate.md)
* Join the [Anomaly Detector Advisors group on Microsoft Teams](https://aka.ms/AdAdvisorsJoin) for better support and any updates!