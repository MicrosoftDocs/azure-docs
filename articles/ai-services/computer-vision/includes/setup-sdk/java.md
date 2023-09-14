---
author: PatrickFarley
ms.service: cognitive-services
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

[Reference documentation](/java/api/com.azure.ai.vision.imageanalysis) | [Maven Package](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

This guide shows how to install the Vision SDK for Java.

## Platform requirements

[!INCLUDE [Requirements](java-requirements.md)]

## Install the Vision SDK for Java

The Vision SDK for Java is available as a Maven package. For more information, see <a href="https://www.nuget.org/packages/Azure.AI.Vision.ImageAnalysis" target="_blank">Azure.AI.Vision.ImageAnalysis</a>.


# [Maven](#tab/maven)

## Apache Maven

Follow these steps to install the Azure AI Vision SDK for Java using Apache Maven:

1. Install [Apache Maven](https://maven.apache.org/download.cgi). On Linux, install from the distribution repositories if available.

1. Open a command prompt and run `mvn -v` to confirm successful installation.

1. Open a command prompt where you want to place the new project, and create a new pom.xml file.

1. Copy the following XML content into pom.xml

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

1. Update the version value in `<version>0.15.1-beta.1</version>` based on the latest version you find in the [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis). 

1. Run the following Maven command to install the Vision SDK and dependencies.
```console
    mvn clean dependency:copy-dependencies
```


# [Gradle](#tab/gradle)

Gradle configurations require an explicit reference to the .jar dependency extension:
```gradle
// build.gradle

dependencies {
    implementation group: 'com.azure', name: ' azure-ai-vision-imageanalysis', version: "0.15.1-beta.1", ext: "jar"
}
```

Update the version number based on the latest version you find in the [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis). 

---
