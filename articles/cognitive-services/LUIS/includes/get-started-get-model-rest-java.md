---
title: Get model with REST call in Java
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 05/18/2020
ms.author: diberry
---
## Prerequisites

* Azure Language Understanding - Authoring resource 32 character key and authoring endpoint URL. Create with the [Azure portal](../luis-how-to-azure-subscription.md#create-resources-in-the-azure-portal) or [Azure CLI](../luis-how-to-azure-subscription.md#create-resources-in-azure-cli).
* Import the [Pizza](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/luis/apps/pizza-with-machine-learned-entity.json) app from the `Azure-Samples/cognitive-services-sample-data-files` GitHub repository.
* The LUIS application ID for the imported Pizza app. The application ID is shown in the application dashboard.
* The version ID within the application that receives the utterances.
* [JDK SE](https://aka.ms/azure-jdks)  (Java Development Kit, Standard Edition)
* [Visual Studio Code](https://code.visualstudio.com/) or your favorite IDE

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](get-started-get-model-json-example-utterances.md)]

## Change model programmatically

1. Create a new folder to hold your Java project, such as `java-model-with-rest`.

1. Make a subdirectory named `lib` and copy in the following java libs into the `lib` subdirectory:

    * [commons-logging-1.2.jar](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-language-understanding/master/documentation-samples/quickstarts/analyze-text/java/lib/commons-logging-1.2.jar)
    * [httpclient-4.5.3.jar](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-language-understanding/master/documentation-samples/quickstarts/analyze-text/java/lib/httpclient-4.5.3.jar)
    * [httpcore-4.4.6.jar](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-language-understanding/master/documentation-samples/quickstarts/analyze-text/java/lib/httpcore-4.4.6.jar)

1. Create a new file named `Model.java`. Add the following code:

```java
import java.io.*;
import java.net.URI;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

// To compile, execute this command at the console:
//      Windows: javac -cp ";lib/*" Model.java
//      macOs: javac -cp ":lib/*" Model.java
//      Linux: javac -cp ":lib/*" Model.java

// To run, execute this command at the console:
//      Windows: java -cp ";lib/*" Model
//      macOs: java -cp ":lib/*" Model
//      Linux: java -cp ":lib/*" Model

public class Model
{
    public static void main(String[] args)
    {
        try
        {
            //////////
            // Values to modify.

            // YOUR-APP-ID: The App ID GUID found on the www.luis.ai Application Settings page.
            String AppId = "YOUR-APP-ID";

            // YOUR-AUTHORING-KEY: Your LUIS authoring key, 32 character value.
            String Key = "YOUR-AUTHORING-KEY";

            // YOUR-AUTHORING-ENDPOINT: Replace this with your authoring key endpoint.
            // For example, "https://your-resource-name.api.cognitive.microsoft.com/"
            String Endpoint = "YOUR-AUTHORING-ENDPOINT";

            // NOTE: Replace this your version number. The Pizza app uses a version number of "0.1".
            String Version = "0.1";
            //////////

            // The list of utterances to add, in JSON format.
            String Utterances = "[{'text': 'order a pizza', 'intentName': 'ModifyOrder', 'entityLabels': [{'entityName': 'Order', 'startCharIndex': 6, 'endCharIndex': 12}]}, {'text': 'order a large pepperoni pizza', 'intentName': 'ModifyOrder', 'entityLabels': [{'entityName': 'Order', 'startCharIndex': 6, 'endCharIndex': 28}, {'entityName': 'FullPizzaWithModifiers', 'startCharIndex': 6, 'endCharIndex': 28}, {'entityName': 'PizzaType', 'startCharIndex': 14, 'endCharIndex': 28}, {'entityName': 'Size', 'startCharIndex': 8, 'endCharIndex': 12}]}, {'text': 'I want two large pepperoni pizzas on thin crust', 'intentName': 'ModifyOrder', 'entityLabels': [{'entityName': 'Order', 'startCharIndex': 7, 'endCharIndex': 46}, {'entityName': 'FullPizzaWithModifiers', 'startCharIndex': 7, 'endCharIndex': 46}, {'entityName': 'PizzaType', 'startCharIndex': 17, 'endCharIndex': 32}, {'entityName': 'Size', 'startCharIndex': 11, 'endCharIndex': 15}, {'entityName': 'Quantity', 'startCharIndex': 7, 'endCharIndex': 9}, {'entityName': 'Crust', 'startCharIndex': 37, 'endCharIndex': 46}]}]";

            // Create the URLs for uploading example utterances and for training.
            URIBuilder addUtteranceURL = new URIBuilder(Endpoint + "luis/authoring/v3.0-preview/apps/" + AppId + "/versions/" + Version + "/examples");
            URIBuilder trainURL = new URIBuilder(Endpoint + "luis/authoring/v3.0-preview/apps/" + AppId + "/versions/" + Version + "/train");
            URI addUtterancesURI = addUtteranceURL.build();
            URI trainURI = trainURL.build();


            // Add the utterances.

            // Create the request.
            HttpClient addUtterancesClient = HttpClients.createDefault();
            HttpPost addUtterancesRequest = new HttpPost(addUtterancesURI);

            // Add the headers.
            addUtterancesRequest.setHeader("Ocp-Apim-Subscription-Key",Key);
            addUtterancesRequest.setHeader("Content-type","application/json");

            // Add the body.
            StringEntity stringEntity = new StringEntity(Utterances);
            addUtterancesRequest.setEntity(stringEntity);

            // Execute the request and obtain the response.
            HttpResponse addUtterancesResponse = addUtterancesClient.execute(addUtterancesRequest);
            HttpEntity addUtterancesEntity = addUtterancesResponse.getEntity();

            // Print the response on the console.
            if (addUtterancesEntity != null)
            {
                System.out.println(EntityUtils.toString(addUtterancesEntity));
            }


            // Train the model.

            // Create the request.
            HttpClient trainClient = HttpClients.createDefault();
            HttpPost trainRequest = new HttpPost(trainURI);

            // Add the headers.
            trainRequest.setHeader("Ocp-Apim-Subscription-Key",Key);
            trainRequest.setHeader("Content-type","application/json");

            // Execute the request and obtain the response.
            HttpResponse trainResponse = trainClient.execute(trainRequest);
            HttpEntity trainEntity = trainResponse.getEntity();

            // Print the response on the console.
            if (trainEntity != null)
            {
                System.out.println(EntityUtils.toString(trainEntity));
            }


            // Get the training status.


            // Create the request.
            HttpClient trainStatusClient = HttpClients.createDefault();
            HttpGet trainStatusRequest = new HttpGet(trainURI);

            // Add the headers.
            trainStatusRequest.setHeader("Ocp-Apim-Subscription-Key",Key);
            trainStatusRequest.setHeader("Content-type","application/json");

            // Execute the request and obtain the response.
            HttpResponse trainStatusResponse = trainStatusClient.execute(trainStatusRequest);
            HttpEntity trainStatusEntity = trainStatusResponse.getEntity();

            // Print the response on the console.
            if (trainStatusEntity != null)
            {
                System.out.println(EntityUtils.toString(trainStatusEntity));
            }
        }

        // Display errors if they occur.
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
```

1. Replace the values starting with `YOUR-` with your own values.

    |Information|Purpose|
    |--|--|
    |`YOUR-APP-ID`| Your LUIS app ID. |
    |`YOUR-AUTHORING-KEY`|Your 32 character authoring key.|
    |`YOUR-AUTHORING-ENDPOINT`| Your authoring URL endpoint. For example, `https://replace-with-your-resource-name.api.cognitive.microsoft.com/`. You set your resource name when you created the resource.|

    Assigned keys and resources are visible in the LUIS portal in the Manage section, on the **Azure resources** page. The app ID is available in the same Manage section, on the **Application Settings** page.

1. With a command prompt in the same directory as where you created the `Model.java` file, enter the following command to compile the Java file:

    ::: zone pivot="client-operating-system-linux"

    ```console
    javac -cp ":lib/*" Model.java
    ```

    ::: zone-end

    ::: zone pivot="client-operating-system-macos"

    ```console
    javac -cp ":lib/*" Model.java
    ```

    ::: zone-end

    ::: zone pivot="client-operating-system-windows"

    ```console
    javac -cp ";lib/*" Model.java
    ```

    ::: zone-end

1. Run the Java application from the command line by entering the following text in the command prompt:

    ::: zone pivot="client-operating-system-linux"

    ```console
    java -cp ":lib/*" Model
    ```

    ::: zone-end

    ::: zone pivot="client-operating-system-macos"

    ```console
    java -cp ":lib/*" Model
    ```

    ::: zone-end

    ::: zone pivot="client-operating-system-windows"

    ```console
    java -cp ";lib/*" Model
    ```

    ::: zone-end

## Clean up resources

When you are finished with this quickstart, delete the project folder from the file system.

## Next steps

> [!div class="nextstepaction"]
> [Best practices for an app](../luis-concept-best-practices.md)