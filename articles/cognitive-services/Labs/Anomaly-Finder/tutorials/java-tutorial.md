---
title: "Tutorial: Anomaly Detection, Java"
titlesuffix: Azure Cognitive Services
description: Explore a Java app that uses the Anomaly Detection API. Send original data points to API and get the expected value and anomaly points.
services: cognitive-services
author: wenya
manager: bix

ms.service: cognitive-services
ms.component: anomaly-detection
ms.topic: tutorial
ms.date: 05/01/2018
ms.author: wenya
---

# Tutorial: Anomaly Detection with Java application

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

This article demonstrates using a simple Java application to invoke the Anomaly Detection API.  
The example submits the time series data to the Anomaly Detection API with your subscription key, then gets all the anomaly points and expected value for each data point from the API.

## Prerequisites

### Platform requirements

This tutorial has been developed using [IntelliJ IDEA](https://www.jetbrains.com/idea). 
And also you need to install [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) version 1.8+, and an up-to-date [Apache's Maven](http://maven.apache.org/) build tool.

### Subscribe to Anomaly Detection and get a subscription key 

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]
 

## Download the tutorial project

1. Go to the MicrosoftAnomalyDetection [Java repository](https://github.com/MicrosoftAnomalyDetection/java-sample).
2. Click the Clone or download button.
3. Click Download ZIP to download a .zip file of the tutorial project.

<a name="Step1"></a>
### Open the tutorial project

1. Extract the .zip file of the tutorial project.
2. In IntelliJ IDEA, click **File > Open**, Open File or Project dialog box appears.
3. Select the root path of the extracted project, then click OK.
4. In the Projects panel, expand **src > main > java**.
5. Double-click com.microsoft.cognitiveservice.anomalydetection.Main.java to load the file into the editor.

<a name="Step2"></a>
### Replace subscriptionKey and URI region

```
// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
public static final String subscriptionKey = "<Subscription Key>";

public static final String uriBase = "https://api.labs.cognitive.microsoft.com/anomalyfinder/v1.0/anomalydetection";

```

<a name="Step3"></a>
### Build and run the tutorial project

1. Bring up the menu by right-clicking anywhere in com.microsoft.cognitiveservice.anomalydetection.Main.java source code tab. 
2. Select Run 'Main.main()'
3. The result of the sample request will be returned and shown in terminal.

### Result of the tutorial project

[!INCLUDE [diagrams](../includes/diagrams.md)]

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.labs.cognitive.microsoft.com/docs/services/anomaly-detection/operations/post-anomalydetection)
