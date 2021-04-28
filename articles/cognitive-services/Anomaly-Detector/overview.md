---
title: What is the Anomaly Detector API?
titleSuffix: Azure Cognitive Services
description: Use the Anomaly Detector API's algorithms to apply anomaly detection on your time series data.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: overview
ms.date: 02/16/2021
ms.author: mbullwin
keywords: anomaly detection, machine learning, algorithms
ms.custom: cog-serv-seo-aug-2020
---

# What is the Anomaly Detector API?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

The Anomaly Detector API enables you to monitor and detect abnormalities in your time series data without having to know machine learning. The Anomaly Detector API's algorithms adapt by automatically identifying and applying the best-fitting models to your data, regardless of industry, scenario, or data volume. Using your time series data, the API determines boundaries for anomaly detection, expected values, and which data points are anomalies.

![Detect pattern changes in service requests](./media/anomaly_detection2.png)

Using the Anomaly Detector doesn't require any prior experience in machine learning, and the RESTful API enables you to easily integrate the service into your applications and processes.

This documentation contains the following types of articles:
* The [quickstarts](./Quickstarts/client-libraries.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./how-to/identify-anomalies.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](./concepts/anomaly-detection-best-practices.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/batch-anomaly-detection-powerbi.md) are longer guides that show you how to use this service as a component in broader business solutions.

## Features

With the Anomaly Detector, you can automatically detect anomalies throughout your time series data, or as they occur in real-time.

|Feature  |Description  |
|---------|---------|
|Anomaly detection in real-time. | Detect anomalies in your streaming data by using previously seen data points to determine if your latest one is an anomaly. This operation generates a model using the data points you send, and determines if the target point is an anomaly. By calling the API with each new data point you generate, you can monitor your data as it's created. |
|Detect anomalies throughout your data set as a batch. | Use your time series to detect any anomalies that might exist throughout your data. This operation generates a model using your entire time series data, with each point analyzed with the same model.         |
|Detect change points throughout your data set as a batch. | Use your time series to detect any trend change points that exist in your data. This operation generates a model using your entire time series data, with each point analyzed with the same model.    |
| Get additional information about your data. | Get useful details about your data and any observed anomalies, including expected values, anomaly boundaries, and positions. |
| Adjust anomaly detection boundaries. | The Anomaly Detector API automatically creates boundaries for anomaly detection. Adjust these boundaries to increase or decrease the API's sensitivity to data anomalies, and better fit your data. |

## Demo

Check out this [interactive demo](https://aka.ms/adDemo) to understand how Anomaly Detector works.
To run the demo, you need to create an Anomaly Detector resource and get the API key and endpoint.

## Notebook

To learn how to call the Anomaly Detector API, try this [Notebook](https://aka.ms/adNotebook). This Jupyter Notebook shows you how to send an API request and visualize the result.

To run the Notebook, complete the following steps:

1. Get a valid Anomaly Detector API subscription key and an API endpoint. The section below has instructions for signing up.
1. Sign in, and select Clone, in the upper right corner.
1. Uncheck the "public" option in the dialog box before completing the clone operation, otherwise your notebook, including any subscription keys, will be public.
1. Select **Run on free compute**
1. Select one of the notebooks.
1. Add your valid Anomaly Detector API subscription key to the `subscription_key` variable.
1. Change the `endpoint` variable to your endpoint. For example: `https://westus2.api.cognitive.microsoft.com/anomalydetector/v1.0/timeseries/last/detect`
1. On the top menu bar, select **Cell**, then **Run All**.

## Workflow

The Anomaly Detector API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

[!INCLUDE [cognitive-services-anomaly-detector-data-requirements](../../../includes/cognitive-services-anomaly-detector-data-requirements.md)]

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../includes/cognitive-services-anomaly-detector-signup-requirements.md)]

After signing up:

1. Take your time series data and convert it into a valid JSON format. Use [best practices](concepts/anomaly-detection-best-practices.md) when preparing your data to get the best results.
1. Send a request to the Anomaly Detector API with your data.
1. Process the API response by parsing the returned JSON message.

## Algorithms

* See the following technical blogs for information about the algorithms used:
    * [Introducing Azure Anomaly Detector API](https://techcommunity.microsoft.com/t5/AI-Customer-Engineering-Team/Introducing-Azure-Anomaly-Detector-API/ba-p/490162)
    * [Overview of SR-CNN algorithm in Azure Anomaly Detector](https://techcommunity.microsoft.com/t5/AI-Customer-Engineering-Team/Overview-of-SR-CNN-algorithm-in-Azure-Anomaly-Detector/ba-p/982798)

You can read the paper [Time-Series Anomaly Detection Service at Microsoft](https://arxiv.org/abs/1906.03821) (accepted by KDD 2019) to learn more about the SR-CNN algorithms developed by Microsoft.

> [!VIDEO https://www.youtube.com/embed/ERTaAnwCarM]

## Service availability and redundancy

### Is the Anomaly Detector service zone resilient?

Yes. The Anomaly Detector service is zone-resilient by default.

### How do I configure the Anomaly Detector service to be zone-resilient?

No customer configuration is necessary to enable zone-resiliency. Zone-resiliency for Anomaly Detector resources is available by default and managed by the service itself.

## Deploy on premises using Docker containers

[Use Anomaly Detector containers](anomaly-detector-container-howto.md) to deploy API features on-premises. Docker containers enable you to bring the service closer to your data for compliance, security, or other operational reasons.

## Join the Anomaly Detector community

* Join the [Anomaly Detector Advisors group on Microsoft Teams](https://aka.ms/AdAdvisorsJoin)
* See selected [user generated content](user-generated-content.md)

## Next steps

* [Quickstart: Detect anomalies in your time series data using the Anomaly Detector](quickstarts/client-libraries.md)
* The Anomaly Detector API [online demo](https://github.com/Azure-Samples/AnomalyDetector/tree/master/ipython-notebook)
* The Anomaly Detector [REST API reference](https://aka.ms/anomaly-detector-rest-api-ref)
