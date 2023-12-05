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

[Reference documentation](/java/api/com.azure.ai.vision.imageanalysis) | [Maven Package](https://mvnrepository.com/artifact/com.azure/azure-ai-vision-imageanalysis) | [Samples](https://github.com/Azure-Samples/azure-ai-vision-sdk)

> [!TIP]
> The Analysis 4.0 API can do many different operations. See the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

## Prerequisites

* A Windows 10 (or higher) x64, or Linux x64 machine.
* Java Development Kit (JDK) version 8 or above installed, such as [Azul Zulu OpenJDK](https://www.azul.com/downloads/?package=jdk), [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk), [Oracle Java](https://www.java.com/download/), or your preferred JDK. Run `java -version` from a command line to see your version and confirm a successful installation. Make sure that the Java installation is native to the system architecture and not running through emulation.
* [Apache Maven](https://maven.apache.org/download.cgi) installed. On Linux, install from the distribution repositories if available. Run `mvn -v` to confirm successful installation.
* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="create a Vision resource"  target="_blank">create a Vision resource</a> in the Azure portal. In order to use the captioning feature in this quickstart, you must create your resource in one of the following Azure regions: East US, France Central, Korea Central, North Europe, Southeast Asia, West Europe, West US. After it deploys, select **Go to resource**.
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
1. Install the SDK and dependencies by running the following in the project directory:
    ```console
    mvn clean dependency:copy-dependencies
    ```
1. Once the operation succeeds, verify that the folders `target\dependency` were creating and they contain `.jar` files.

For more information, see the [SDK installation guide](../../sdk/install-sdk.md?pivots=programming-language-java).

[!INCLUDE [create environment variables](../environment-variables.md)]

## Analyze Image

Open a text editor and copy the following content to a new file. Save the file as `ImageAnalysis.java`

[!code-java[](~/azure-ai-vision-sdk/docs/learn.microsoft.com/java/image-analysis/quick-start/ImageAnalysis.java?name=snippet_single)]

> [!TIP]
> The code shows analyzing an image URL. You can also analyze a local image file, or an image from a memory buffer. For more information, see the [Analyze Image how-to guide](../../how-to/call-analyze-image-40.md).

To compile the Java file, run the following:

```console
javac ImageAnalysis.java -cp ".;target\dependency\*"
``` 

You should see the file `ImageAnalysis.class` created in the current folder.

To run the application:

```console
java -cp ".;target\dependency\*" ImageAnalysis
``` 

## Output

The console output should show something similar to the following text:

```console
Caption:
   "a person pointing at a screen", Confidence 0.4892
Text:
   Line: '9:35 AM', Bounding polygon {{X=130,Y=129},{X=215,Y=130},{X=215,Y=149},{X=130,Y=148}}
     Word: '9:35', Bounding polygon {{X=131,Y=130},{X=171,Y=130},{X=171,Y=149},{X=130,Y=149}}, Confidence 0.9930
     Word: 'AM', Bounding polygon {{X=179,Y=130},{X=204,Y=130},{X=203,Y=149},{X=178,Y=149}}, Confidence 0.9980
   Line: 'E Conference room 154584354', Bounding polygon {{X=130,Y=153},{X=224,Y=154},{X=224,Y=161},{X=130,Y=161}}
     Word: 'E', Bounding polygon {{X=131,Y=154},{X=135,Y=154},{X=135,Y=161},{X=131,Y=161}}, Confidence 0.1040
     Word: 'Conference', Bounding polygon {{X=142,Y=154},{X=174,Y=154},{X=173,Y=161},{X=141,Y=161}}, Confidence 0.9020
     Word: 'room', Bounding polygon {{X=175,Y=154},{X=189,Y=155},{X=188,Y=161},{X=175,Y=161}}, Confidence 0.7960
     Word: '154584354', Bounding polygon {{X=192,Y=155},{X=224,Y=154},{X=223,Y=162},{X=191,Y=161}}, Confidence 0.8640
   Line: '#: 555-173-4547', Bounding polygon {{X=130,Y=163},{X=182,Y=164},{X=181,Y=171},{X=130,Y=170}}
     Word: '#:', Bounding polygon {{X=131,Y=163},{X=139,Y=164},{X=139,Y=171},{X=131,Y=171}}, Confidence 0.0360
     Word: '555-173-4547', Bounding polygon {{X=142,Y=164},{X=182,Y=165},{X=181,Y=171},{X=142,Y=171}}, Confidence 0.5970
   Line: 'Town Hall', Bounding polygon {{X=546,Y=180},{X=590,Y=180},{X=590,Y=190},{X=546,Y=190}}
     Word: 'Town', Bounding polygon {{X=547,Y=181},{X=568,Y=181},{X=568,Y=190},{X=546,Y=191}}, Confidence 0.9810
     Word: 'Hall', Bounding polygon {{X=570,Y=181},{X=590,Y=181},{X=590,Y=191},{X=570,Y=190}}, Confidence 0.9910
   Line: '9:00 AM - 10:00 AM', Bounding polygon {{X=546,Y=191},{X=596,Y=192},{X=596,Y=200},{X=546,Y=199}}
     Word: '9:00', Bounding polygon {{X=546,Y=192},{X=555,Y=192},{X=555,Y=200},{X=546,Y=200}}, Confidence 0.0900
     Word: 'AM', Bounding polygon {{X=557,Y=192},{X=565,Y=192},{X=565,Y=200},{X=557,Y=200}}, Confidence 0.9910
     Word: '-', Bounding polygon {{X=567,Y=192},{X=569,Y=192},{X=569,Y=200},{X=567,Y=200}}, Confidence 0.6910
     Word: '10:00', Bounding polygon {{X=570,Y=192},{X=585,Y=193},{X=584,Y=200},{X=570,Y=200}}, Confidence 0.8850
     Word: 'AM', Bounding polygon {{X=586,Y=193},{X=593,Y=194},{X=593,Y=200},{X=586,Y=200}}, Confidence 0.9910
   Line: 'Aaron Buaion', Bounding polygon {{X=543,Y=201},{X=581,Y=201},{X=581,Y=208},{X=543,Y=208}}
     Word: 'Aaron', Bounding polygon {{X=545,Y=202},{X=560,Y=202},{X=559,Y=208},{X=544,Y=208}}, Confidence 0.6020
     Word: 'Buaion', Bounding polygon {{X=561,Y=202},{X=580,Y=202},{X=579,Y=208},{X=560,Y=208}}, Confidence 0.2910        
   Line: 'Daily SCRUM', Bounding polygon {{X=537,Y=259},{X=575,Y=260},{X=575,Y=266},{X=537,Y=265}}
     Word: 'Daily', Bounding polygon {{X=538,Y=259},{X=551,Y=260},{X=550,Y=266},{X=538,Y=265}}, Confidence 0.1750
     Word: 'SCRUM', Bounding polygon {{X=552,Y=260},{X=570,Y=260},{X=570,Y=266},{X=551,Y=266}}, Confidence 0.1140
   Line: '10:00 AM 11:00 AM', Bounding polygon {{X=536,Y=266},{X=590,Y=266},{X=590,Y=272},{X=536,Y=272}}
     Word: '10:00', Bounding polygon {{X=539,Y=267},{X=553,Y=267},{X=552,Y=273},{X=538,Y=272}}, Confidence 0.8570
     Word: 'AM', Bounding polygon {{X=554,Y=267},{X=561,Y=267},{X=560,Y=273},{X=553,Y=273}}, Confidence 0.9980
     Word: '11:00', Bounding polygon {{X=564,Y=267},{X=578,Y=267},{X=577,Y=273},{X=563,Y=273}}, Confidence 0.4790
     Word: 'AM', Bounding polygon {{X=579,Y=267},{X=586,Y=267},{X=585,Y=273},{X=578,Y=273}}, Confidence 0.9940
   Line: 'Churlette de Crum', Bounding polygon {{X=538,Y=273},{X=584,Y=273},{X=585,Y=279},{X=538,Y=279}}
     Word: 'Churlette', Bounding polygon {{X=539,Y=274},{X=562,Y=274},{X=561,Y=279},{X=538,Y=279}}, Confidence 0.4640     
     Word: 'de', Bounding polygon {{X=563,Y=274},{X=569,Y=274},{X=568,Y=279},{X=562,Y=279}}, Confidence 0.8100
     Word: 'Crum', Bounding polygon {{X=570,Y=274},{X=582,Y=273},{X=581,Y=279},{X=569,Y=279}}, Confidence 0.8850
   Line: 'Quarterly NI Hands', Bounding polygon {{X=538,Y=295},{X=588,Y=295},{X=588,Y=301},{X=538,Y=302}}
     Word: 'Quarterly', Bounding polygon {{X=540,Y=296},{X=562,Y=296},{X=562,Y=302},{X=539,Y=302}}, Confidence 0.5230     
     Word: 'NI', Bounding polygon {{X=563,Y=296},{X=570,Y=296},{X=570,Y=302},{X=563,Y=302}}, Confidence 0.3030
     Word: 'Hands', Bounding polygon {{X=572,Y=296},{X=588,Y=296},{X=588,Y=302},{X=571,Y=302}}, Confidence 0.6130
   Line: '11.00 AM-12:00 PM', Bounding polygon {{X=536,Y=304},{X=588,Y=303},{X=588,Y=309},{X=536,Y=310}}
     Word: '11.00', Bounding polygon {{X=538,Y=304},{X=552,Y=304},{X=552,Y=310},{X=538,Y=310}}, Confidence 0.6180
     Word: 'AM-12:00', Bounding polygon {{X=554,Y=304},{X=578,Y=304},{X=577,Y=310},{X=553,Y=310}}, Confidence 0.2700      
     Word: 'PM', Bounding polygon {{X=579,Y=304},{X=586,Y=304},{X=586,Y=309},{X=578,Y=310}}, Confidence 0.6620
   Line: 'Bebek Shaman', Bounding polygon {{X=538,Y=310},{X=577,Y=310},{X=577,Y=316},{X=538,Y=316}}
     Word: 'Bebek', Bounding polygon {{X=539,Y=310},{X=554,Y=310},{X=554,Y=317},{X=539,Y=316}}, Confidence 0.6110
     Word: 'Shaman', Bounding polygon {{X=555,Y=310},{X=576,Y=311},{X=576,Y=317},{X=555,Y=317}}, Confidence 0.6050        
   Line: 'Weekly stand up', Bounding polygon {{X=537,Y=332},{X=582,Y=333},{X=582,Y=339},{X=537,Y=338}}
     Word: 'Weekly', Bounding polygon {{X=538,Y=332},{X=557,Y=333},{X=556,Y=339},{X=538,Y=338}}, Confidence 0.6060        
     Word: 'stand', Bounding polygon {{X=558,Y=333},{X=572,Y=334},{X=571,Y=340},{X=557,Y=339}}, Confidence 0.4890
     Word: 'up', Bounding polygon {{X=574,Y=334},{X=580,Y=334},{X=580,Y=340},{X=573,Y=340}}, Confidence 0.8150
   Line: '12:00 PM-1:00 PM', Bounding polygon {{X=537,Y=340},{X=583,Y=340},{X=583,Y=347},{X=536,Y=346}}
     Word: '12:00', Bounding polygon {{X=539,Y=341},{X=553,Y=341},{X=552,Y=347},{X=538,Y=347}}, Confidence 0.8260
     Word: 'PM-1:00', Bounding polygon {{X=554,Y=341},{X=575,Y=341},{X=574,Y=347},{X=553,Y=347}}, Confidence 0.2090       
     Word: 'PM', Bounding polygon {{X=576,Y=341},{X=583,Y=341},{X=582,Y=347},{X=575,Y=347}}, Confidence 0.0390
   Line: 'Delle Marckre', Bounding polygon {{X=538,Y=347},{X=582,Y=347},{X=582,Y=352},{X=538,Y=353}}
     Word: 'Delle', Bounding polygon {{X=540,Y=348},{X=559,Y=347},{X=558,Y=353},{X=539,Y=353}}, Confidence 0.5800
     Word: 'Marckre', Bounding polygon {{X=560,Y=347},{X=582,Y=348},{X=582,Y=353},{X=559,Y=353}}, Confidence 0.2750       
   Line: 'Product review', Bounding polygon {{X=538,Y=370},{X=577,Y=370},{X=577,Y=376},{X=538,Y=375}}
     Word: 'Product', Bounding polygon {{X=539,Y=370},{X=559,Y=371},{X=558,Y=376},{X=539,Y=376}}, Confidence 0.6150       
     Word: 'review', Bounding polygon {{X=560,Y=371},{X=576,Y=371},{X=575,Y=376},{X=559,Y=376}}, Confidence 0.0400 
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
* Sample source code can be found on [GitHub](https://github.com/Azure-Samples/azure-ai-vision-sdk).
