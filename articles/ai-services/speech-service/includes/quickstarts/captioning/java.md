---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to [install the Speech SDK](~/articles/ai-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre). The sample in this quickstart works with the [Microsoft Build of OpenJDK 17](https://www.microsoft.com/openjdk)

1. Install [Apache Maven](https://maven.apache.org/install.html). Then run `mvn -v` to confirm successful installation.
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
        <dependencies>
            <dependency>
            <groupId>com.microsoft.cognitiveservices.speech</groupId>
            <artifactId>client-sdk</artifactId>
            <version>1.36.0</version>
            </dependency>
        </dependencies>
    </project>
    ```
1. Install the Speech SDK and dependencies.
    ```console
    mvn clean dependency:copy-dependencies
    ```
1. You must also install [GStreamer](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Create captions from speech

Follow these steps to build and run the captioning quickstart code example.

1. Copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/java/jre/console/captioning/"  title="Copy the samples"  target="_blank">scenarios/java/jre/captioning/</a> sample files from GitHub into your project directory. The `pom.xml` file that you created in [environment setup](#set-up-the-environment) must also be in this directory.
1. Open a command prompt and run this command to compile the project files. 
    ```console
    javac Captioning.java -cp ".;target\dependency\*" -encoding UTF-8
    ```
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    java -cp ".;target\dependency\*" Captioning --input caption.this.mp4 --format any --output caption.output.txt --srt --realTime --threshold 5 --delay 0 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    > [!IMPORTANT]
    > Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.
    > 
    > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). Otherwise use the `--key` and `--region` arguments.


## Check results

[!INCLUDE [Example output](example-output-v2.md)]

## Usage and arguments

Usage: `java -cp ".;target\dependency\*" Captioning --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments-v2.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
