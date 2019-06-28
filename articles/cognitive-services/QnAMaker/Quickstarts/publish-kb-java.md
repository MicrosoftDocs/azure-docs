---
title: Publish knowledge base, REST, Java
titleSuffix: QnA Maker - Azure Cognitive Services 
description: This Java REST-based quickstart walks you through publishing your knowledge base which pushes the latest version of the tested knowledge base to a dedicated Azure Search index representing the published knowledge base. It also creates an endpoint that can be called in your application or chat bot.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: quickstart
ms.date: 02/28/2019
ms.author: diberry
---

# Quickstart: Publish a knowledge base in QnA Maker using Java

This REST-based quickstart walks you through programmatically publishing your knowledge base (KB). Publishing pushes the latest version of the knowledge base to a dedicated Azure Search index and creates an endpoint that can be called in your application or chat bot.

This quickstart calls QnA Maker APIs:
* [Publish](https://docs.microsoft.com/rest/api/cognitiveservices/qnamaker/knowledgebase/publish) - this API doesn't require any information in the body of the request.

## Prerequisites

* [JDK SE](https://aka.ms/azure-jdks)  (Java Development Kit, Standard Edition)
* This sample uses the Apache [HTTP client](https://hc.apache.org/httpcomponents-client-ga/) from HTTP Components. You need to add the following Apache HTTP client libraries to your project: 
    * httpclient-4.5.3.jar
    * httpcore-4.4.6.jar
    * commons-logging-1.2.jar
* [Visual Studio Code](https://code.visualstudio.com/)
* You must have a [QnA Maker service](../How-To/set-up-qnamaker-service-azure.md). To retrieve your key, select **Keys** under **Resource Management** in your Azure dashboard for your QnA Maker resource. . 
* QnA Maker knowledge base (KB) ID found in the URL in the kbid query string parameter as shown below.

    ![QnA Maker knowledge base ID](../media/qnamaker-quickstart-kb/qna-maker-id.png)

    If you don't have a knowledge base yet, you can create a sample one to use for this quickstart: [Create a new knowledge base](create-new-kb-csharp.md).

> [!NOTE] 
> The complete solution file(s) are available from the [**Azure-Samples/cognitive-services-qnamaker-java** GitHub repository](https://github.com/Azure-Samples/cognitive-services-qnamaker-java/tree/master/documentation-samples/quickstarts/publish-knowledge-base).

## Create a Java file

Open VSCode and create a new file named `PublishKB.java`.

## Add the required dependencies

At the top of `PublishKB.java`, above the class, add the following lines to add necessary dependencies to the project:

[!code-java[Add the required dependencies](~/samples-qnamaker-java/documentation-samples/quickstarts/publish-knowledge-base/PublishKB.java?range=1-13 "Add the required dependencies")]

## Create PublishKB class with main method

After the dependencies, add the following class:

```Go
public class PublishKB {

    public static void main(String[] args) 
    {
    }
}
```

## Add required constants

In the **main** method, add the required constants to access QnA Maker. Replace the values with your own.

[!code-java[Add the required constants](~/samples-qnamaker-java/documentation-samples/quickstarts/publish-knowledge-base/PublishKB.java?range=27-30 "Add the required constants")]

## Add POST request to publish knowledge base

After the required constants, add the following code, which makes an HTTPS request to the QnA Maker API to publish a knowledge base and receives the response:

[!code-java[Add a POST request to publish knowledge base](~/samples-qnamaker-java/documentation-samples/quickstarts/publish-knowledge-base/PublishKB.java?range=32-44 "Add a POST request to publish knowledge base")]

The API call returns a 204 status for a successful publish without any content in the body of the response. The code adds content for 204 responses.

For any other response, that response is returned unaltered.

## Build and run the program

Build and run the program from the command line. It will automatically send the request to the QnA Maker API, then it will print to the console window.

1. Build the file:

    ```bash
    javac -cp "lib/*" PublishKB.java
    ```

1. Run the file:

    ```bash
    java -cp ".;lib/*" PublishKB
    ```

[!INCLUDE [Clean up files and knowledge base](../../../../includes/cognitive-services-qnamaker-quickstart-cleanup-resources.md)] 

## Next steps

After the knowledge base is published, you need the [endpoint URL to generate an answer](../Tutorials/create-publish-answer.md#generating-an-answer).  

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://go.microsoft.com/fwlink/?linkid=2092179)
