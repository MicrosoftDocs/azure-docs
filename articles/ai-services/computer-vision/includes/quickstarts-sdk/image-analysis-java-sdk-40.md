---
title: "Quickstart: Image Analysis client 4.0 SDK for .NET"
description: In this quickstart, get started with the Image Analysis 4.0 client SDK for .NET.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
---
 
<a name="HOLTop"></a>

Use the Image Analysis client SDK for Java to analyze an image to read text and generate an image caption. This quickstart analyzes a remote image and prints the results to the console. 

[Reference documentation](https://aka.ms/azsdk/image-analysis/ref-docs/java) | [Maven Package](https://aka.ms/azsdk/image-analysis/package/maven) | [Samples](https://aka.ms/azsdk/image-analysis/samples/java)

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* A Windows 10 (or higher) x64, or Linux x64 machine.
* Java Development Kit (JDK) version 8 or above installed, such as [Azul Zulu OpenJDK](https://www.azul.com/downloads/?package=jdk), [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk), [Oracle Java](https://www.java.com/download/), or your preferred JDK. Run `java -version` from a command line to see your version and confirm a successful installation. Make sure that the Java installation is native to the system architecture and not running through emulation.
* [Apache Maven](https://maven.apache.org/download.cgi) installed. On Linux, install from the distribution repositories if available. Run `mvn -v` to confirm successful installation.
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal. In order to use the captioning feature in this quickstart, you must create your resource in one of the supported Azure regions (see [Image captions](/azure/ai-services/computer-vision/concept-describe-images-40)). After it deploys, select **Go to resource**.
   * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
   * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Set up application

Open a console window and create a new folder for your quickstart application.

1. Open a text editor and copy the following content to a new file. Save the file as `pom.xml` in your project directory
    <!-- [!INCLUDE][](https://raw.githubusercontent.com/Azure-Samples/azure-ai-vision-sdk/main/docs/learn.microsoft.com/java/image-analysis/quick-start/pom.xml)] -->
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
          <version>1.0.0-beta.1</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-nop -->
        <!-- Optional: provide a slf4j implementation. Here we use a no-op implementation
        just to make the slf4j console spew warning go away. We can still use the internal
        logger in azure.core library. See
        https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/vision/azure-ai-vision-imageanalysis#enable-http-requestresponse-logging -->
        <dependency>
          <groupId>org.slf4j</groupId>
          <artifactId>slf4j-nop</artifactId>
          <version>1.7.36</version> <!-- {x-version-update;org.slf4j:slf4j-nop;external_dependency} -->
        </dependency>
      </dependencies>
    </project>
    ```
1. Install the SDK and dependencies by running the following in the project directory:
    ```console
    mvn clean dependency:copy-dependencies
    ```
1. Once the operation succeeds, verify that the folders `target\dependency` were creating and they contain `.jar` files.

For more information, see the [SDK installation guide](../../sdk/install-sdk.md?pivots=programming-language-java).

[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze Image

Open a text editor and copy the following content to a new file. Save the file as `ImageAnalysis.java`

[!code-java[](~/cognitive-services-quickstart-code/java/ComputerVision/4-0/ImageAnalysis.java?name=snippet_single)]

> [!TIP]
> The code analyzes an image from a URL. You can also analyze a local image file, or an image from a memory buffer. For more information, see the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md).

To compile the Java file, run the following command:

```console
javac ImageAnalysis.java -cp ".;target\dependency\*"
``` 

You should see the file `ImageAnalysis.class` created in the current folder.

To run the application, run the following command:

```console
java -cp ".;target\dependency\*" ImageAnalysis
``` 

## Output

The console output should show something similar to the following text:

```console
Image analysis results:
 Caption:
   "a person pointing at a screen", Confidence 0.7768
 Read:
   Line: '9:35 AM', Bounding polygon [(x=131, y=130), (x=214, y=130), (x=214, y=148), (x=131, y=148)]
     Word: '9:35', Bounding polygon [(x=132, y=130), (x=172, y=131), (x=171, y=149), (x=131, y=148)], Confidence 0.9770
     Word: 'AM', Bounding polygon [(x=180, y=131), (x=203, y=131), (x=202, y=149), (x=180, y=149)], Confidence 0.9980
   Line: 'Conference room 154584354', Bounding polygon [(x=132, y=153), (x=224, y=153), (x=224, y=161), (x=132, y=160)]
     Word: 'Conference', Bounding polygon [(x=143, y=153), (x=174, y=154), (x=174, y=161), (x=143, y=161)], Confidence 0.6930
     Word: 'room', Bounding polygon [(x=176, y=154), (x=188, y=154), (x=188, y=161), (x=176, y=161)], Confidence 0.9590
     Word: '154584354', Bounding polygon [(x=192, y=154), (x=224, y=154), (x=223, y=161), (x=192, y=161)], Confidence 0.7050
   Line: ': 555-123-4567', Bounding polygon [(x=133, y=164), (x=183, y=164), (x=183, y=170), (x=133, y=170)]
     Word: ':', Bounding polygon [(x=134, y=165), (x=137, y=165), (x=136, y=171), (x=133, y=171)], Confidence 0.1620
     Word: '555-123-4567', Bounding polygon [(x=143, y=165), (x=182, y=165), (x=181, y=171), (x=143, y=171)], Confidence 0.6530
   Line: 'Town Hall', Bounding polygon [(x=545, y=178), (x=588, y=179), (x=588, y=190), (x=545, y=190)]
     Word: 'Town', Bounding polygon [(x=545, y=179), (x=569, y=180), (x=569, y=190), (x=545, y=190)], Confidence 0.9880
     Word: 'Hall', Bounding polygon [(x=571, y=180), (x=589, y=180), (x=589, y=190), (x=571, y=190)], Confidence 0.9900
   Line: '9:00 AM - 10:00 AM', Bounding polygon [(x=545, y=191), (x=596, y=191), (x=596, y=199), (x=545, y=198)]
     Word: '9:00', Bounding polygon [(x=546, y=191), (x=556, y=192), (x=556, y=199), (x=546, y=199)], Confidence 0.7580
     Word: 'AM', Bounding polygon [(x=558, y=192), (x=565, y=192), (x=564, y=199), (x=558, y=199)], Confidence 0.9890
     Word: '-', Bounding polygon [(x=567, y=192), (x=570, y=192), (x=569, y=199), (x=567, y=199)], Confidence 0.8960
     Word: '10:00', Bounding polygon [(x=571, y=192), (x=585, y=192), (x=585, y=199), (x=571, y=199)], Confidence 0.7970
     Word: 'AM', Bounding polygon [(x=587, y=192), (x=594, y=193), (x=593, y=199), (x=586, y=199)], Confidence 0.9940
   Line: 'Aaron Blaion', Bounding polygon [(x=542, y=201), (x=581, y=201), (x=581, y=207), (x=542, y=207)]
     Word: 'Aaron', Bounding polygon [(x=545, y=201), (x=560, y=202), (x=560, y=208), (x=545, y=208)], Confidence 0.7180
     Word: 'Blaion', Bounding polygon [(x=562, y=202), (x=579, y=202), (x=579, y=207), (x=562, y=207)], Confidence 0.2740
   Line: 'Daily SCRUM', Bounding polygon [(x=537, y=258), (x=574, y=259), (x=574, y=266), (x=537, y=265)]
     Word: 'Daily', Bounding polygon [(x=538, y=259), (x=551, y=259), (x=551, y=266), (x=538, y=265)], Confidence 0.4040
     Word: 'SCRUM', Bounding polygon [(x=553, y=259), (x=570, y=260), (x=570, y=265), (x=553, y=266)], Confidence 0.6970
   Line: '10:00 AM-11:00 AM', Bounding polygon [(x=535, y=266), (x=589, y=265), (x=589, y=272), (x=535, y=273)]
     Word: '10:00', Bounding polygon [(x=539, y=267), (x=553, y=266), (x=552, y=273), (x=539, y=274)], Confidence 0.2190
     Word: 'AM-11:00', Bounding polygon [(x=554, y=266), (x=578, y=266), (x=578, y=272), (x=554, y=273)], Confidence 0.1750
     Word: 'AM', Bounding polygon [(x=580, y=266), (x=587, y=266), (x=586, y=272), (x=580, y=272)], Confidence 1.0000
   Line: 'Charlene de Crum', Bounding polygon [(x=538, y=272), (x=588, y=273), (x=588, y=279), (x=538, y=279)]
     Word: 'Charlene', Bounding polygon [(x=538, y=273), (x=562, y=273), (x=562, y=280), (x=538, y=280)], Confidence 0.3220
     Word: 'de', Bounding polygon [(x=563, y=273), (x=569, y=273), (x=569, y=280), (x=563, y=280)], Confidence 0.9100
     Word: 'Crum', Bounding polygon [(x=570, y=273), (x=582, y=273), (x=583, y=280), (x=571, y=280)], Confidence 0.8710
   Line: 'Quarterly NI Handa', Bounding polygon [(x=537, y=295), (x=588, y=295), (x=588, y=302), (x=537, y=302)]
     Word: 'Quarterly', Bounding polygon [(x=539, y=296), (x=563, y=296), (x=563, y=302), (x=538, y=302)], Confidence 0.6030
     Word: 'NI', Bounding polygon [(x=564, y=296), (x=570, y=296), (x=571, y=302), (x=564, y=302)], Confidence 0.7300
     Word: 'Handa', Bounding polygon [(x=572, y=296), (x=588, y=296), (x=588, y=302), (x=572, y=302)], Confidence 0.9050
   Line: '11.00 AM-12:00 PM', Bounding polygon [(x=538, y=303), (x=587, y=303), (x=587, y=309), (x=538, y=309)]
     Word: '11.00', Bounding polygon [(x=539, y=303), (x=552, y=303), (x=553, y=309), (x=539, y=310)], Confidence 0.6710
     Word: 'AM-12:00', Bounding polygon [(x=554, y=303), (x=578, y=303), (x=578, y=309), (x=554, y=309)], Confidence 0.6560
     Word: 'PM', Bounding polygon [(x=579, y=303), (x=586, y=303), (x=586, y=309), (x=580, y=309)], Confidence 0.4540
   Line: 'Bobek Shemar', Bounding polygon [(x=538, y=310), (x=577, y=310), (x=577, y=316), (x=538, y=316)]
     Word: 'Bobek', Bounding polygon [(x=539, y=310), (x=554, y=311), (x=554, y=317), (x=539, y=317)], Confidence 0.6320
     Word: 'Shemar', Bounding polygon [(x=556, y=311), (x=576, y=311), (x=577, y=317), (x=556, y=317)], Confidence 0.2190
   Line: 'Weekly aband up', Bounding polygon [(x=538, y=332), (x=583, y=333), (x=583, y=339), (x=538, y=338)]
     Word: 'Weekly', Bounding polygon [(x=539, y=333), (x=557, y=333), (x=557, y=339), (x=539, y=339)], Confidence 0.5750
     Word: 'aband', Bounding polygon [(x=558, y=334), (x=573, y=334), (x=573, y=339), (x=558, y=339)], Confidence 0.4750
     Word: 'up', Bounding polygon [(x=574, y=334), (x=580, y=334), (x=580, y=339), (x=574, y=339)], Confidence 0.8650
   Line: '12:00 PM-1:00 PM', Bounding polygon [(x=538, y=339), (x=585, y=339), (x=585, y=346), (x=538, y=346)]
     Word: '12:00', Bounding polygon [(x=539, y=339), (x=553, y=340), (x=553, y=347), (x=539, y=346)], Confidence 0.7090
     Word: 'PM-1:00', Bounding polygon [(x=554, y=340), (x=575, y=340), (x=575, y=346), (x=554, y=347)], Confidence 0.9080
     Word: 'PM', Bounding polygon [(x=576, y=340), (x=583, y=340), (x=583, y=346), (x=576, y=346)], Confidence 0.9980
   Line: 'Danielle MarchTe', Bounding polygon [(x=538, y=346), (x=583, y=346), (x=583, y=352), (x=538, y=352)]
     Word: 'Danielle', Bounding polygon [(x=539, y=347), (x=559, y=347), (x=559, y=352), (x=539, y=353)], Confidence 0.1960
     Word: 'MarchTe', Bounding polygon [(x=560, y=347), (x=582, y=347), (x=582, y=352), (x=560, y=352)], Confidence 0.5710
   Line: 'Product reviret', Bounding polygon [(x=537, y=370), (x=578, y=370), (x=578, y=375), (x=537, y=375)]
     Word: 'Product', Bounding polygon [(x=539, y=370), (x=559, y=370), (x=559, y=376), (x=539, y=375)], Confidence 0.7000
     Word: 'reviret', Bounding polygon [(x=560, y=370), (x=578, y=371), (x=578, y=375), (x=560, y=376)], Confidence 0.2180
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the Image Analysis client SDK and make basic image analysis calls. Next, learn more about the Analysis 4.0 API features.


> [!div class="nextstepaction"]
>[Call the Analyze Image 4.0 API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* Sample source code can be found on [GitHub](https://aka.ms/azsdk/image-analysis/samples/java).
