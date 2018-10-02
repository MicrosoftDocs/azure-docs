--- 
title: What is Anomaly Finder? - Microsoft Cognitive Services | Microsoft Docs 
description: Use advanced algorithms in Anomaly Finder to help you identify anomalies in time series data and return information in Microsoft Cognitive Services. 
services: cognitive-services 
author: tonyxing
 
ms.service: cognitive-services 
ms.technology: anomaly-detection 
ms.topic: article
ms.date: 04/19/2018 
ms.author: tonyxing
--- 

# What is Anomaly Finder?

[!INCLUDE [PrivatePreviewNote](../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

Anomaly Finder enables you to monitor data over time and detect anomalies with machine learning that adapts to your unique data by automatically applying the right statistical model regardless of industry, scenario, or data volume. Using a time series as input, the Anomaly Finder API returns whether or not a data point is an anomaly, determines the expected value, and upper and lower bounds for visualization. 
As a prebuilt AI service, Anomaly Finder doesn’t require any machine learning expertise beyond understanding how to use a RESTful API. This makes development simple and versatile since it works with any time series data and can also be built into streaming data systems. Anomaly Finder encompasses a broad span of use cases – for instance, financial tools for managing fraud, theft, changing markets, and potential business incidents, or monitoring IoT device traffic while preserving anonymity. This solution can also be monetized as part of a service for end-customers to understand changes in data, spending, return on investment, or user activity.
Try out the Anomaly Finder API and gain deeper understanding of your data. 

See what you can build with this API:

* Learn to predict the expected values based on historical data in the time series
* Tell whether a data point is an anomaly out of historical pattern
* Generate a band to visualize the range of "normal" value

![Anomaly_Finder](./media/anomaly_detection1.png) 

Fig. 1: Detect anomalies in sales revenues

![Anomaly_Finder](./media/anomaly_detection2.png)

Fig. 2: Detect pattern changes in service requests

## Requirements

- Minimum data for input time series: Minimum of 13 data points for time series without clear periodicity, minimum of 4 cycles of data points for the time series with known periodicity. 
- Data integrity: time series data points are separated in the same interval and no missing points. 

## Identify anomalies

Anomaly detection API returns result that whether any given data points are anomalies or not, and provides additional information as follows
* Period - The periodicity that the API used to detect the anomaly points.
* WarningText - The possible warning information.
* ExpectedValue - The predicted value by the learning based model
* IsAnomaly - The result on whether the data points are anomalies or not
* IsAnomaly_Neg - The result on whether the data points are anomalies in negative direction (dips)
* IsAnomaly_Pos - The result on whether the data points are anomalies in positive direction (spikes)
* UpperMargin - The sum of ExpectedValue and UpperMargin determines the upper bound that data point is still thought as normal
* LowerMargin - (ExpectedValue - LowerMargin) determines the lower bound that data point is still thought as normal

> [!Note]
> UpperMargin and LowerMargin can be used to generate a band around actual time series to visualize the range of normal values. 

## Adjusting lower and upper bounds in post processing on the response

Anomaly detection API returns default result on whether a data point is anomaly or not, and the upper and lower bound can be calculated from ExpectedValue and UpperMargin/LowerMargin. Those default values should work just fine for most cases. However, some scenarios require different bounds than the default ones. The recommend practice is applying a coefficiency on the UpperMargin or LowerMargin to adjust the dynamic bounds.

### Examples with 1/1.5/2 as coefficiency

![Default Sensitivity](./media/sensitivity_1.png)

![1.5 Sensitivity](./media/sensitivity_1.5.png)

![2 Sensitivity](./media/sensitivity_2.png)

Request with sample data

[!INCLUDE [Request](./includes/request.md)]

Sample JSON response

[!INCLUDE [Response](./includes/response.md)]
