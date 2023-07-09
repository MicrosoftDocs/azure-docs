---
title: Anomaly Detector multivariate Java client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/29/2021
ms.author: mbullwin
---

Get started with the Anomaly Detector multivariate client library for Java. Follow these steps to install the package start using the algorithms provided by the service. The new multivariate anomaly detector APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for Java to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much, and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

[Library reference documentation](/java/api/com.azure.ai.anomalydetector) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/anomalydetector/azure-ai-anomalydetector) | [Package (Maven)](https://repo1.maven.org/maven2/com/azure/azure-ai-anomalydetector/3.0.0-beta.2/) | [Sample code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/anomalydetector/azure-ai-anomalydetector/src/samples/java/com/azure/ai/anomalydetector/MultivariateSample.java)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of the [Java Development Kit(JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* The [Gradle build tool](https://gradle.org/install/), or another dependency manager.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button.
    * You'll need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Gradle project

This quickstart uses the Gradle dependency manager. You can find more client library information on the [Maven Central Repository](https://search.maven.org/artifact/com.azure/azure-ai-metricsadvisor).

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `gradle init` command from your working directory. This command creates essential build files for Gradle, including *build.gradle.kts* which is used at runtime to create and configure your application.

```console
gradle init --type basic
```

When prompted to choose a **DSL**, select **Kotlin**.

### Install the client library

Locate *build.gradle.kts* and open it with your preferred IDE or text editor. Then copy in this build configuration. Be sure to include the project dependencies.

```kotlin
dependencies {
    compile("com.azure:azure-ai-anomalydetector")
}
```

### Create a Java file

Create a folder for your sample app. From your working directory, run the following command:

```console
mkdir -p src/main/java
```

Navigate to the new folder and create a file called *MetricsAdvisorQuickstarts.java*. Open it in your preferred editor or IDE and add the following `import` statements:

```java
package com.azure.ai.anomalydetector;

import com.azure.ai.anomalydetector.models.*;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.http.*;
import com.azure.core.http.policy.*;
import com.azure.core.http.rest.PagedIterable;
import com.azure.core.http.rest.PagedResponse;
import com.azure.core.http.rest.Response;
import com.azure.core.http.rest.StreamResponse;
import com.azure.core.util.Context;
import reactor.core.publisher.Flux;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
```

Create variables your resource's Azure endpoint and key. Create another variable for the example data file.

> [!NOTE]
> You will always have the option of using one of two keys. This is to allow secure key rotation. For the purposes of this quickstart use the first key. 

```java
String key = "YOUR_API_KEY";
String endpoint = "YOUR_ENDPOINT";
```

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

To use the Anomaly Detector multivariate APIs, you need to first train your own models. Training data is a set of multiple time series that meet the following requirements:

Each time series should be a CSV file with two (and only two) columns, "timestamp" and "value" (all in lowercase) as the header row. The "timestamp" values should conform to ISO 8601; the "value" could be integers or decimals with any number of decimal places. For example:

|timestamp | value|
|-------|-------|
|2019-04-01T00:00:00Z| 5|
|2019-04-01T00:01:00Z| 3.6|
|2019-04-01T00:02:00Z| 4|
|`...`| `...` |

Each CSV file should be named after a different variable that will be used for model training. For example, "temperature.csv" and "humidity.csv". All the CSV files should be zipped into one zip file without any subfolders. The zip file can have whatever name you want. The zip file should be uploaded to Azure Blob storage. Once you generate the blob SAS (Shared access signatures) URL for the zip file, it can be used for training. Refer to this document for how to generate SAS URLs from Azure Blob Storage.

## Code examples

These code snippets show you how to do the following with the Anomaly Detector client library for Node.js:

* [Authenticate the client](#authenticate-the-client)
* [Train a model](#train-a-model)
* [Detect anomalies](#detect-anomalies)
* [Export model](#export-model)
* [Delete model](#delete-model)

## Authenticate the client

Instantiate a `anomalyDetectorClient` object with your endpoint and credentials.

```java
HttpHeaders headers = new HttpHeaders()
    .put("Accept", ContentType.APPLICATION_JSON);

HttpPipelinePolicy authPolicy = new AzureKeyCredentialPolicy(key,
    new AzureKeyCredential(key));
AddHeadersPolicy addHeadersPolicy = new AddHeadersPolicy(headers);

HttpPipeline httpPipeline = new HttpPipelineBuilder().httpClient(HttpClient.createDefault())
    .policies(authPolicy, addHeadersPolicy).build();
// Instantiate a client that will be used to call the service.
HttpLogOptions httpLogOptions = new HttpLogOptions();
httpLogOptions.setLogLevel(HttpLogDetailLevel.BODY_AND_HEADERS);

AnomalyDetectorClient anomalyDetectorClient = new AnomalyDetectorClientBuilder()
    .pipeline(httpPipeline)
    .endpoint(endpoint)
    .httpLogOptions(httpLogOptions)
    .buildClient();
```

## Train a model

### Construct a model result and train model

First we need to construct a model request. Make sure that start and end time align with your data source.

To use the Anomaly Detector multivariate APIs, we need to train our own model before using detection. Data used for training is a batch of time series, each time series should be in a CSV file with only two columns, **"timestamp"** and **"value"**(the column names should be exactly the same). Each CSV file should be named after each variable for the time series. All of the time series should be zipped into one zip file and be uploaded to [Azure Blob storage](../../../../storage/blobs/storage-blobs-introduction.md#blobs), and there's no requirement for the zip file name. Alternatively, an extra meta.json file can be included in the zip file if you wish the name of the variable to be different from the .zip file name. Once we generate [blob SAS (Shared access signatures) URL](../../../../storage/common/storage-sas-overview.md), we can use the url to the zip file for training.

```java
Path path = Paths.get("test-data.csv");
List<String> requestData = Files.readAllLines(path);
List<TimeSeriesPoint> series = requestData.stream()
    .map(line -> line.trim())
    .filter(line -> line.length() > 0)
    .map(line -> line.split(",", 2))
    .filter(splits -> splits.length == 2)
    .map(splits -> {
        TimeSeriesPoint timeSeriesPoint = new TimeSeriesPoint();
        timeSeriesPoint.setTimestamp(OffsetDateTime.parse(splits[0]));
        timeSeriesPoint.setValue(Float.parseFloat(splits[1]));
        return timeSeriesPoint;
    })
    .collect(Collectors.toList());

Integer window = 28;
AlignMode alignMode = AlignMode.OUTER;
FillNAMethod fillNAMethod = FillNAMethod.LINEAR;
Integer paddingValue = 0;
AlignPolicy alignPolicy = new AlignPolicy()
                                .setAlignMode(alignMode)
                                .setFillNAMethod(fillNAMethod)
                                .setPaddingValue(paddingValue);
String source = "YOUR_SAMPLE_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS";
OffsetDateTime startTime = OffsetDateTime.of(2021, 1, 2, 0, 0, 0, 0, ZoneOffset.UTC);
OffsetDateTime endTime = OffsetDateTime.of(2021, 1, 3, 0, 0, 0, 0, ZoneOffset.UTC);
String displayName = "Devops-MultiAD";

ModelInfo request = new ModelInfo()
                        .setSlidingWindow(window)
                        .setAlignPolicy(alignPolicy)
                        .setSource(source)
                        .setStartTime(startTime)
                        .setEndTime(endTime)
                        .setDisplayName(displayName);
TrainMultivariateModelResponse trainMultivariateModelResponse = anomalyDetectorClient.trainMultivariateModelWithResponse(request, Context.NONE);
String header = trainMultivariateModelResponse.getDeserializedHeaders().getLocation();
String[] substring = header.split("/");
UUID modelId = UUID.fromString(substring[substring.length - 1]);
System.out.println(modelId);

//Check model status until the model is ready
Response<Model> trainResponse;
while (true) {
    trainResponse = anomalyDetectorClient.getMultivariateModelWithResponse(modelId, Context.NONE);
    ModelStatus modelStatus = trainResponse.getValue().getModelInfo().getStatus();
    if (modelStatus == ModelStatus.READY || modelStatus == ModelStatus.FAILED) {
        break;
    }
    TimeUnit.SECONDS.sleep(10);
}

if (trainResponse.getValue().getModelInfo().getStatus() != ModelStatus.READY){
    System.out.println("Training failed.");
    List<ErrorResponse> errorMessages = trainResponse.getValue().getModelInfo().getErrors();
    for (ErrorResponse errorMessage : errorMessages) {
        System.out.println("Error code:  " + errorMessage.getCode());
        System.out.println("Error message:  " + errorMessage.getMessage());
    }
}
```

## Detect anomalies

```java
DetectionRequest detectionRequest = new DetectionRequest().setSource(source).setStartTime(startTime).setEndTime(endTime);
DetectAnomalyResponse detectAnomalyResponse = anomalyDetectorClient.detectAnomalyWithResponse(modelId, detectionRequest, Context.NONE);
String location = detectAnomalyResponse.getDeserializedHeaders().getLocation();
String[] substring = location.split("/");
UUID resultId = UUID.fromString(substring[substring.length - 1]);

DetectionResult detectionResult;
while (true) {
    detectionResult = anomalyDetectorClient.getDetectionResult(resultId);
    DetectionStatus detectionStatus = detectionResult.getSummary().getStatus();;
    if (detectionStatus == DetectionStatus.READY || detectionStatus == DetectionStatus.FAILED) {
        break;
    }
    TimeUnit.SECONDS.sleep(10);
}

if (detectionResult.getSummary().getStatus() != DetectionStatus.READY){
    System.out.println("Inference failed");
    List<ErrorResponse> detectErrorMessages = detectionResult.getSummary().getErrors();
    for (ErrorResponse errorMessage : detectErrorMessages) {
        System.out.println("Error code:  " + errorMessage.getCode());
        System.out.println("Error message:  " + errorMessage.getMessage());
    }
}
```

## Export model

> [!NOTE]
> The export command is intended to be used to allow running Anomaly Detector multivariate models in a containerized environment. This is not currently not supported for multivariate, but support will be added in the future.

To export your trained model use the `exportModelWithResponse`.

```java
StreamResponse response_export = anomalyDetectorClient.exportModelWithResponse(model_id, Context.NONE);
Flux<ByteBuffer> value = response_export.getValue();
FileOutputStream bw = new FileOutputStream("result.zip");
value.subscribe(s -> write(bw, s), (e) -> close(bw), () -> close(bw));
```

## Delete model

To delete an existing model that is available to the current resource use the `deleteMultivariateModelWithResponse` function.

```java
Response<Void> deleteMultivariateModelWithResponse = anomalyDetectorClient.deleteMultivariateModelWithResponse(model_id, Context.NONE);
```

## Run the application

You can build the app with:

```console
gradle build
```
### Run the application

Before running it can be helpful to check your code against the [full sample code](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/anomalydetector/azure-ai-anomalydetector/src/samples/java/com/azure/ai/anomalydetector/MultivariateSample.java).

Run the application with the `run` goal:

```console
gradle run
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [What is the Anomaly Detector API?](../../overview.md)
* [Best practices when using the Anomaly Detector API.](../../concepts/best-practices-multivariate.md)
