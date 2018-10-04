--- 
title: How to use the Anomaly Finder API with Java - Microsoft Cognitive Services | Microsoft Docs
description: Get information and code samples to help you quickly get started using Java and the Anomaly Detection in Cognitive Services.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.technology: anomaly-detection
ms.topic: article
ms.date: 05/01/2018
ms.author: kefre
---

# Use the Anomaly Finder API with Java

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

This article provides information and code samples to help you quickly get started using the Anomaly Detection API with Java to accomplish task of getting anomaly detection result for time series data.

## Prerequisites

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]

## Getting anomaly points with the Anomaly Detection API using Java

[!INCLUDE [DataContract](../includes/datacontract.md)]

### Example of time series data

The example of the time series data points is as follows.

[!INCLUDE [Request](../includes/request.md)]

### Analyze data and get anomaly points Java example

To run the sample, perform the following steps:
1. Create a new Command-Line App.
2. Replace the Main class with the following code (keep any `package` statements).
3. Replace the `[YOUR_SUBSCRIPTION_KEY]` value with your valid subscription key.
4. Replace the `[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]` with the example or your own data points.
5. Download these global libraries from the Maven Repository to the `lib` directory in your project:
   * `org.apache.httpcomponents:httpclient:4.5.2`
6. Run 'Main'.

```java

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class Main {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    public static final String subscriptionKey = "[YOUR_SUBSCRIPTION_KEY]";

    public static final String uriBase = "https://api.labs.cognitive.microsoft.com/anomalyfinder/v1.0/anomalydetection";

    public static void main(String[] args) {
        final String content = "[REPLACE_WITH_THE_EXAMPLE_OR_YOUR_OWN_DATA_POINTS]";

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost request = new HttpPost(uriBase);

        // Request headers.
        request.setHeader("Content-Type", "application/json");
        request.setHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

        try {
            StringEntity params = new StringEntity(content);
            request.setEntity(params);

            CloseableHttpResponse response = client.execute(request);
            try {
                HttpEntity respEntity = response.getEntity();
                if (respEntity != null) {
                    System.out.println("----------");
                    System.out.println(response.getStatusLine());
                    System.out.println("Response content is :\n");
                    System.out.println(EntityUtils.toString(respEntity, "utf-8"));
                    System.out.println("----------");
                }
            } catch (Exception respEx) {
                respEx.printStackTrace();
            } finally {
                response.close();
            }

        } catch (Exception ex) {
            System.err.println("Exception on Anomaly Detection: " + ex.getMessage());
            ex.printStackTrace();
        } finally {
            try {
                client.close();
            } catch (Exception e) {
                System.err.println("Exception on closing HttpClient: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}

```

### Example response

A successful response is returned in JSON. Example response is as follows.
[!INCLUDE [Response](../includes/response.md)]

## Next steps

> [!div class="nextstepaction"]
> [Java app](../tutorials/java-tutorial.md)
