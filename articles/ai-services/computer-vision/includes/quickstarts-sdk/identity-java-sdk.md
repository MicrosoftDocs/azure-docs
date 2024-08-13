---
title: "Face Java client library quickstart"
description: Use the Face client library for Java to detect faces and identify faces (facial recognition search).
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 08/08/2024
ms.author: pafarley
---

Get started with facial recognition using the Face client library for Java. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](https://aka.ms/azsdk-java-face-ref) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/face/azure-ai-vision-face) | [Package (Maven)](https://central.sonatype.com/artifact/com.azure/azure-ai-vision-face) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/face/azure-ai-vision-face/src/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of the [Java Development Kit (JDK)](https://www.microsoft.com/openjdk)
* [Apache Maven](https://maven.apache.org/download.cgi) installed. On Linux, install from the distribution repositories if available.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Create environment variables

[!INCLUDE [create environment variables](../face-environment-variables.md)]

## Identify and verify faces

1. Install the client library

    Open a console window and create a new folder for your quickstart application. Copy the following content to a new file. Save the file as `pom.xml` in your project directory:

    <!-- [!INCLUDE][](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-quickstart-code/master/java/Face/pom.xml)] -->
    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <groupId>com.example</groupId>
      <artifactId>my-application-name</artifactId>
      <version>1.0.0</version>
      <dependencies>
        <!-- https://mvnrepository.com/artifact/com.azure/azure-ai-vision-face -->
        <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-ai-vision-face</artifactId>
          <version>1.0.0-beta.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient -->
        <dependency>
          <groupId>org.apache.httpcomponents</groupId>
          <artifactId>httpclient</artifactId>
          <version>4.5.13</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.google.code.gson/gson -->
        <dependency>
          <groupId>com.google.code.gson</groupId>
          <artifactId>gson</artifactId>
          <version>2.11.0</version>
        </dependency>
      </dependencies>
    </project>
    ```

    Install the SDK and dependencies by running the following in the project directory:

    ```console
    mvn clean dependency:copy-dependencies
    ```

1. Create a new Java application

    Create a file named `Quickstart.java`, open it in a text editor, and paste in the following code:

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

    [!code-java[](~/cognitive-services-quickstart-code/java/Face/Quickstart.java?name=snippet_single)]


1. Run your face recognition app from the application directory with the `javac` and `java` commands.

    #### [Windows](#tab/windows)

    ```console
    javac -cp target\dependency\* Quickstart.java
    java -cp .;target\dependency\* Quickstart
    ```

    #### [Linux](#tab/linux)

    ```console
    javac -cp target/dependency/* Quickstart.java
    java -cp .:target/dependency/* Quickstart
    ```

    ---



## Output

```console
========IDENTIFY FACES========

Create a person group (3761e61a-16b2-4503-ad29-ed34c58ba676).
Create a person group person 'Family1-Dad'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Dad) from image `Family1-Dad1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Dad) from image `Family1-Dad2.jpg`
Create a person group person 'Family1-Mom'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Mom) from image `Family1-Mom1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Mom) from image `Family1-Mom2.jpg`
Create a person group person 'Family1-Son'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Son) from image `Family1-Son1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Son) from image `Family1-Son2.jpg`

Train person group 3761e61a-16b2-4503-ad29-ed34c58ba676.
Training status: succeeded.

Pausing for 60 seconds to avoid triggering rate limit on free account...
4 face(s) with 4 having sufficient quality for recognition.
Person 'Family1-Dad' is identified for the face in: identification1.jpg - d7995b34-1b72-47fe-82b6-e9877ed2578d, confidence: 0.96807.
Verification result: is a match? true. confidence: 0.96807
Person 'Family1-Mom' is identified for the face in: identification1.jpg - 844da0ed-4890-4bbf-a531-e638797f96fc, confidence: 0.96902.
Verification result: is a match? true. confidence: 0.96902
No person is identified for the face in: identification1.jpg - c543159a-57f3-4872-83ce-2d4a733d71c9.
Person 'Family1-Son' is identified for the face in: identification1.jpg - 414fac6c-7381-4dba-9c8b-fd26d52e879b, confidence: 0.9281.
Verification result: is a match? true. confidence: 0.9281

========DELETE PERSON GROUP========

Deleted the person group 3761e61a-16b2-4503-ad29-ed34c58ba676.

End of quickstart.
```



## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for Java to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview-identity.md)
* More extensive sample code can be found on [GitHub](https://aka.ms/FaceSamples).
