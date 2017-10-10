---
title: Call a Language Understanding Intelligent Services (LUIS) app using Java | Microsoft Docs 
description: Learn to call a LUIS app using Java. 
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 09/29/2017
ms.author: v-demak
---

# Call a LUIS app using Java

This quickstart shows you how to call your Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll be able to use Java code to pass utterances to a LUIS endpoint and get results.

## Before you begin
You need a Cognitive services API key to make calls to the sample LUIS app we use in this walkthrough. 
To get an API key follow these steps: 
  1. You first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  2. Log in to the Azure portal at https://portal.azure.com. 
  3. Follow the steps in [Creating Subscription Keys using Azure](./AzureIbizaSubscription.md) to get a key.
  4. Go back to https://www.luis.ai and log in using your Azure account. 

## Understand what LUIS returns

To understand what a LUIS app returns, you can paste the URL of a sample LUIS app into a browser window. The sample app you'll use is an IoT app that detects whether the user wants to turn on or turn off lights.

1. The endpoint of the sample app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60340f5f-99c1-4043-8ab9-c810ff16252d?subscription-key=<YOUR_API_KEY>&verbose=false&q=turn%20on%20the%20left%20light`. Copy the URL and substitute your subscription key for the value of the `subscription-key` field.
2. Paste the URL into a browser window and press Enter. The browswer displays a JSON result that indicates that LUIS detects the `TurnOn` intent and the `Light` entity with the value `left`.

    ![JSON result detects the intent TurnOn](./media/luis-get-started-node-get-intent/json-turn-on-left.png)
3. Change the value of the `q=` parameter in the URL to `turn off the floor light`, and press enter. The result now indicates that the LUIS detected the `TurnOff` intent and the `Light` entity with value `floor`. 

    ![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/json-turn-off-floor.png)


## Consume a LUIS result using the Endpoint API with Java 

You can use Java to access the same results you saw in the browser window in the previous step. 
1. Copy the following code to create a class in your IDE:

```java
// This sample uses the Apache HTTP client from HTTP Components (http://hc.apache.org/httpcomponents-client-ga/)
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class LuisGetRequest {

    public static void main(String[] args) 
    {
        HttpClient httpclient = HttpClients.createDefault();

        try
        {

            // The ID of a public sample LUIS app that recognizes intents for turning on and off lights
            String AppId = "60340f5f-99c1-4043-8ab9-c810ff16252d";
            // Add your subscription key 
            String SubscriptionKey = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

        URIBuilder builder = 
            new URIBuilder("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/" + AppId + "?");

            builder.setParameter("q", "turn on the left light");
            builder.setParameter("timezoneOffset", "0");
            builder.setParameter("verbose", "false");
            builder.setParameter("spellCheck", "false");
            builder.setParameter("staging", "false");

            URI uri = builder.build();
            HttpGet request = new HttpGet(uri);
            request.setHeader("Ocp-Apim-Subscription-Key", SubscriptionKey);

            HttpResponse response = httpclient.execute(request);
            HttpEntity entity = response.getEntity();


            if (entity != null) 
            {
                System.out.println(EntityUtils.toString(entity));
            }
        }

        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```
2. Replace the value of the `SubscriptionKey` variable with your LUIS subscription key.

3. In your IDE, add references to `httpclient` and `httpcore` libraries.

4. Run the console application. It displays the same JSON that you saw earlier in the browser window.

![Console window displays JSON result from LUIS](./media/luis-get-started-java-get-intent/console-turn-on.png)

## Next steps

* See the [LUIS Endpoint API reference](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to learn more about the parameters for calling your LUIS endpoint.
