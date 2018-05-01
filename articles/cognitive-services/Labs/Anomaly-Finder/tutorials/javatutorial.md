---
title: Anomaly Detection API C# tutorial | Microsoft Docs
description: Explore a basic Windows app that uses the Anomaly Detection API in Microsoft Cognitive Services. Send original data points to API and get the expected value and anormaly points.
services: cognitive-services
author: wenya
manager: bix

ms.service: cognitive-services
ms.technology: anomaly-detection
ms.topic: article
ms.date: 04/20/2018
ms.author: wenya
---

# Anomaly Detection API Java Tutorial

This article demonstrates using a simple Java application to invoke the Anomaly Detection API.  
The example submits the time series data to the Anomaly Detection API with your subscription key, then gets all the anomaly points and expected value for each data point from the API.

## Prerequisites

### Platform requirements

This tutorial has been developed using [IntelliJ IDEA](https://www.jetbrains.com/idea). 
And also you need to install [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) version 1.8+, and an up-to-date [Apache's Maven](http://maven.apache.org/) build tool.

### Subscribe to Anomaly Detection and get a subscription key 

[!INCLUDE [GetSubscriptionKey](../get-subscription-key.md)]
 

## Download the tutorial project

1. Go to the MicrosoftAnomalyDetection [Java repository](https://github.com/MicrosoftAnomalyDetection/java-sample).
2. Click the Clone or download button.
3. Click Download ZIP to download a .zip file of the tutorial project.

### <a name="Step1">Step 1: Open the tutorial project</a>

1. Extract the .zip file of the tutorial project.
2. In IntelliJ IDEA, click File -> Open, Open File or Project dialog box appears.
3. Select the root path of the extracted project, then click OK.
4. In the Projects panel, expand src -> main -> java
5. Double-click com.microsoft.cognitiveservice.anomalydetection.Main.java to load the file into the editor.

### <a name="Step2">Step 2: Replace subscriptionKey and URI region </a>

```
// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
public static final String subscriptionKey = "<Subscription Key>";

public static final String uriBase = "https://labsportalppe.azure-api.net/anomalyfinder/v1.0/anomalydetection";

```

### <a name="Step3">Step 3: Build and Run the tutorial project</a>

1. Bring up the menu by right-clicking anywhere in com.microsoft.cognitiveservice.anomalydetection.Main.java source code tab. 
2. Select Run 'Main.main()'
3. The result of the sample request will be returned and shown in terminal.

### Result of the tutorial project

[!INCLUDE [diagrams](../diagrams.md)]
