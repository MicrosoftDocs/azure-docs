---
title: include file
description: include file
services: azure-communication-services
author: jbeauregardb
manager: vravikumar

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: jbeauregardb
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/azure/developer/java/fundamentals/java-jdk-install) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).
- Create an [Application Insights Resources](/previous-versions/azure/azure-monitor/app/create-new-resource) in Azure portal.

## Setting Up

### Create a new Java application

Open your terminal or command window. Navigate to the directory where you'd like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

You'll notice that the 'generate' task created a directory with the same name as the `artifactId`. Under this directory, the src/main/java directory contains the project source code, the `src/test/java directory` contains the test source, and the `pom.xml` file is the project's Project Object Model, or POM.

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-communication-identity</artifactId>
      <version>1.0.0</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-monitor-opentelemetry-exporter</artifactId>
      <version>1.0.0-beta.4</version>
    </dependency>
```

### Set up the app framework

From the project directory:

1. Navigate to the */src/main/java/com/communication/quickstart* directory
1. Open the *App.java* file in your editor
1. Replace the `System.out.println("Hello world!");` statement
1. Add `import` directives

Use the following code to begin:

```java
package com.communication.quickstart;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.SimpleSpanProcessor;
import com.azure.monitor.opentelemetry.exporter.*;
import com.azure.communication.identity.*;

public class App
{
    public static void main( String[] args ) throws Exception
    {
        System.out.println("Azure Communication Services - Export Telemetry to Application Insights");
        // Quickstart code goes here
    }
}
```
## Setting up the telemetry tracer with communication identity SDK calls

Initialize a `CommunicationIdentityClient` with your connection string. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

```java

    CommunicationIdentityClient client = new CommunicationIdentityClientBuilder()
        .connectionString("<COMMUNICATION-RESOURCE-CONNECTION-STRING>")
        .buildClient();
```

First, in order to create the span that will allow you to trace the requests in the Azure Monitor, you will have to create an instance of an `AzureMonitorTraceExporter` object. You will need to provide the [connection string](../../../azure-monitor/app/sdk-connection-string.md) from your Application Insights Resource.

```java
    AzureMonitorTraceExporter exporter = new AzureMonitorExporterBuilder()
        .connectionString("<APPLICATION-INSIGHTS-CONNECTION-STRING>")
        .buildTraceExporter();
```

This exporter will then allow you to create the following instances to make the request tracing possible. Add the following code after creating the `AzureMonitorTraceExporter`:

```java

    SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
        .addSpanProcessor(SimpleSpanProcessor.create(exporter))
        .build();

    OpenTelemetrySdk openTelemetrySdk = OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .buildAndRegisterGlobal();

    Tracer tracer = openTelemetrySdk.getTracer("Sample");
```
Once the tracer has been initialized, you can create the span that will be in charge of tracing your requests.

```java
    Span span = tracer.spanBuilder("sample-span").startSpan();
    final Scope scope = span.makeCurrent();
    try {
        // Thread bound (sync) calls will automatically pick up the parent span and you don't need to pass it explicitly.
        client.createUser();
    } finally {
        span.end();
        scope.close();
    }
    Thread.sleep(10000);
```

## Run the code

Navigate to the directory containing the *pom.xml* file and compile the project by using the following `mvn` command.

```console
mvn compile
```

Then, build the package.

```console
mvn package
```

Run the following `mvn` command to execute the app.

```console
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```