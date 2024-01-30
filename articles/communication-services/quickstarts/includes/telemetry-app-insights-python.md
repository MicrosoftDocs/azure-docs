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
- [Python](https://www.python.org/downloads/) 3.7+.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).
- Create an [Application Insights Resources](/previous-versions/azure/azure-monitor/app/create-new-resource) in Azure portal.

## Setting Up

### Create a new Python application

1. Open your terminal or command window create a new directory for your app, and navigate to it.

   ```console
   mkdir application-insights-quickstart && cd application-insights-quickstart
   ```

1. Use a text editor to create a file called **application-insights-quickstart.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

   ```python
    import os
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier

    from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

   try:
      print("Azure Communication Services - Access Tokens Quickstart")
      # Quickstart code goes here
   except Exception as ex:
      print("Exception:")
      print(ex)
   ```

### Install the package

While still in the application directory, install the Azure Communication Services Identity SDK for Python package and the Microsoft Opentelemetry Exporter for the Azure Monitor.

```console
pip install azure-communication-identity
pip install azure-monitor-opentelemetry-exporter --pre
```

## Setting up the telemetry tracer with communication identity SDK calls

Instantiate a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add this code inside the `try` block:

```python
connection_string = os.environ["COMMUNICATION_SERVICES_CONNECTION_STRING"]
identity_client = CommunicationIdentityClient.from_connection_string(connection_string)
```

First, in order to create the span that will allow you to trace the requests in the Azure Monitor, you will have to create an instance of an `AzureMonitorTraceExporter` object. You will need to provide the [connection string](../../../azure-monitor/app/sdk-connection-string.md) from your Application Insights Resource.

```python
exporter = AzureMonitorTraceExporter.from_connection_string(
    "<APPLICATION-INSIGHTS-RESOURCE-CONNECTION-STRING>"
)
```

This exporter will then allow you to create the following instances to make the request tracing possible. Add the following code after creating the `AzureMonitorTraceExporter`:

```python
    trace.set_tracer_provider(TracerProvider())
    tracer = trace.get_tracer(__name__)
    span_processor = BatchSpanProcessor(exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
```
Once the tracer has been initialized, you can create the span that will be in charge of tracing your requests.

```python
with tracer.start_as_current_span(name="MyIdentityApplication"):
    user = identity_client.create_user()
```

## Run the code

From a console prompt, navigate to the directory containing the **application-insights-quickstart.py** file, then execute the following `python` command to run the app.

```console
python application-insights-quickstart.py
```
