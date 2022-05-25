---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

Before you can do anything, you need to install the Speech SDK. The sample in this quickstart works with the [Java Runtime](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre).

1. Install [Apache Maven](https://maven.apache.org/install.html)
1. Create a new `pom.xml` file in the root of your project, and copy the following into it:
    ```xml
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
        <groupId>com.microsoft.cognitiveservices.speech.samples</groupId>
        <artifactId>quickstart-eclipse</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <build>
            <sourceDirectory>src</sourceDirectory>
            <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                <source>1.8</source>
                <target>1.8</target>
                </configuration>
            </plugin>
            </plugins>
        </build>
        <repositories>
            <repository>
            <id>maven-cognitiveservices-speech</id>
            <name>Microsoft Cognitive Services Speech Maven Repository</name>
            <url>https://csspeechstorage.blob.core.windows.net/maven/</url>
            </repository>
        </repositories>
        <dependencies>
            <dependency>
            <groupId>com.microsoft.cognitiveservices.speech</groupId>
            <artifactId>client-sdk</artifactId>
            <version>1.21.0</version>
            </dependency>
        </dependencies>
    </project>
    ```
1. Install the Speech SDK and dependencies.
    ```console
    mvn clean dependency:copy-dependencies
    ```
1. You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/java/jre/captioning/"  title="Copy the samples"  target="_blank">scenarios/java/jre/captioning/</a> sample files from GitHub into your project directory.
1. Open a command prompt and run this command to compile the project files. 
    ```console
    javac Captioning.java -cp ".;target\dependency\*"
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    java -cp ".;target\dependency\*" Captioning --key YourSubscriptionKey --region YourServiceRegion --input c:\caption\caption.this.mp4 --format any --output c:\caption\caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource [region](~/articles/cognitive-services/speech-service/regions.md), such as `westus` or `northeurope`. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    The output file with complete captions is written to `c:\caption\caption.output.txt`. Intermediate results are shown in the console:
    ```console
    00:00:00,180 --> 00:00:01,600
    Welcome to
    
    00:00:00,180 --> 00:00:01,820
    Welcome to applied
    
    00:00:00,180 --> 00:00:02,420
    Welcome to applied mathematics
    
    00:00:00,180 --> 00:00:02,930
    Welcome to applied mathematics course
    
    00:00:00,180 --> 00:00:03,100
    Welcome to applied Mathematics course 2
    
    00:00:00,180 --> 00:00:03,230
    Welcome to applied Mathematics course 201.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Create-captions-from-speech" target="_target">I ran into an issue</a>

## Usage and arguments

Usage: `java -cp ".;target\dependency\*" Captioning --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
