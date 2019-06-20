---
title: "Quickstart: Get answer from knowledge base - REST, Java - QnA Maker"
titlesuffix: Azure Cognitive Services 
description: This Java REST-based quickstart walks you through getting an answer from a knowledge base, programmatically.
services: cognitive-services
author: diberry
manager: nitinme

ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/28/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the QnA Maker service, I want to programmatically get an answer a knowledge base using Java. 
---

# Get answers to a question from a knowledge base with Java

This quickstart walks you through programmatically getting an answer from a published QnA Maker knowledge base. The knowledge base contains questions and answers from [data sources](../Concepts/data-sources-supported.md) such as FAQs. The [question](../how-to/metadata-generateanswer-usage.md#generateanswer-request-configuration) is sent to the QnA Maker service. The [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response-properties) includes the top-predicted answer. 

## Prerequisites

* [JDK SE](https://aka.ms/azure-jdks)  (Java Development Kit, Standard Edition)
* This sample uses the Apache [HTTP client](https://hc.apache.org/httpcomponents-client-ga/) from HTTP Components. You need to add the following Apache HTTP client libraries to your project: 
    * httpclient-4.5.3.jar
    * httpcore-4.4.6.jar
    * commons-logging-1.2.jar
* [Visual Studio Code](https://code.visualstudio.com/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your Azure dashboard for your QnA Maker resource. 
* **Publish** page settings. If you do not have a published knowledge base, create an empty knowledge base, then import a knowledge base on the **Settings** page, then publish. You can download and use [this basic knowledge base](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/qna-maker/knowledge-bases/basic-kb.tsv). 

    The publish page settings include POST route value, Host value, and EndpointKey value. 

    ![Publish settings](../media/qnamaker-quickstart-get-answer/publish-settings.png)

The code for this quickstart is in the [https://github.com/Azure-Samples/cognitive-services-qnamaker-java](https://github.com/Azure-Samples/cognitive-services-qnamaker-java/tree/master/documentation-samples/quickstarts/get-answer) repository. 

## Create a java file

Open VSCode and create a new file named `GetAnswer.java` and add the following class:

```Java
public class GetAnswer {

    public static void main(String[] args) 
    {

    }
}
```

## Add the required dependencies

This quickstart uses Apache classes for HTTP requests. Above the GetAnswer class, at the top of the `GetAnswer.java` file, add necessary dependencies to the project:

[!code-java[Add the required dependencies](~/samples-qnamaker-java/documentation-samples/quickstarts/get-answer/GetAnswer.java?range=5-13 "Add the required dependencies")]

## Add the required constants

At the top of the `GetAnswer.java` class, add the required constants to access QnA Maker. These values are on the **Publish** page after you publish the knowledge base.  

[!code-java[Add the required constants](~/samples-qnamaker-java/documentation-samples/quickstarts/get-answer/GetAnswer.java?range=26-42 "Add the required constants")]

## Add a POST request to send question

The following code makes an HTTPS request to the QnA Maker API to send the question to the knowledge base and receives the response:

[!code-java[Add a POST request to send question to knowledge base](~/samples-qnamaker-java/documentation-samples/quickstarts/get-answer/GetAnswer.java?range=44-72 "Add a POST request to send question to knowledge base")]

The `Authorization` header's value includes the string `EndpointKey`. 

Learn more about the [request](../how-to/metadata-generateanswer-usage.md#generateanswer-request) and [response](../how-to/metadata-generateanswer-usage.md#generateanswer-response).

## Build and run the program

Build and run the program from the command line. It will automatically send the request to the QnA Maker API, then it will print to the console window.

1. Build the file:

    ```bash
    javac -cp "lib/*" GetAnswer.java
    ```

1. Run the file:

    ```bash
    java -cp ".;lib/*" GetAnswer
    ```

[!INCLUDE [JSON request and response](../../../../includes/cognitive-services-qnamaker-quickstart-get-answer-json.md)] 


[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
