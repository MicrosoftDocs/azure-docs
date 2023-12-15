---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

[Reference documentation](/java/api/com.azure.ai.vision.imageanalysis) | [Maven Package](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

This guide shows how to install the Vision SDK for Java.

## Platform requirements

[!INCLUDE [Requirements](java-requirements.md)]

## Install the Vision SDK for Java

The Azure AI Vision SDK for Java is available as a Maven package. For more information, see the package <a href="https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis" target="_blank">azure-ai-vision-imageanalysis</a> in the Maven repository.


# [Maven](#tab/maven)

Follow these steps to install the Vision SDK for Java using Apache Maven:

1. Install [Apache Maven](https://maven.apache.org/download.cgi). On Linux, install from the distribution repositories if available.
1. Open a command prompt and run `mvn -v` to confirm successful installation.
1. Open a command prompt where you want to place the new project, and create a new pom.xml file.
1. Copy the following XML content into your pom.xml file:
    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>azure.ai.vision.imageanalysis.samples</groupId>
    <artifactId>image-analysis-quickstart</artifactId>
    <version>0.0</version>
    <dependencies>
        <!-- https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis -->
        <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-vision-imageanalysis</artifactId>
        <version>0.15.1-beta.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.azure/azure-core-http-netty -->
        <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-core-http-netty</artifactId>
        <version>1.13.6</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
        <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>2.0.7</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
        <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>2.0.7</version>
        </dependency>
    </dependencies>
    </project>
    ```
1. Update the version value in `<version>0.15.1-beta.1</version>` based on the latest version you find in the Maven repository for the [azure-ai-vision-imageanalysis](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis) package.
1. Run the following Maven command to install the Vision SDK and dependencies.
    ```console
    mvn clean dependency:copy-dependencies
    ```
1. Verify that the local folder path `target\dependency` was created, and it contains `.jar` files including three file named `azure-ai-vision-*.jar`

# [Gradle](#tab/gradle)

1. Install [Gradle](https://gradle.org/install).
1. In a command prompt run `gradle -v` to confirm successful installation.
1. Create you Java application using Gradle. See for example [Building Java Applications Sample](https://docs.gradle.org/8.3/samples/sample_building_java_applications.html).
1. Update your `build.gradle` file by inserting 4 new dependencies:
    ```gradle
    dependencies {
        implementation 'com.azure:azure-ai-vision-imageanalysis:0.15.1-beta.1'
        implementation 'com.azure:azure-core-http-netty:1.13.6'
        implementation 'org.slf4j:slf4j-api:2.0.7'
        implementation 'org.slf4j:slf4j-simple:2.0.7'
    }
    ```
1. Update the version value in `com.azure:azure-ai-vision-imageanalysis:0.15.1-beta.1` based on the latest version you find in the Maven repository for the [azure-ai-vision-imageanalysis](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis) package.
1. Update your Java application to do Image Analysis using the Azure AI Vision SDK, compile and run your application.
---
