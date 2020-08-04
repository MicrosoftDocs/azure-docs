---
title: "Quickstart - Set up logs, metrics, and tracing"
description: Describes set up procedure for logs, metrics, and tracing for Azure Spring Cloud apps.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/04/2020
ms.custom: devx-track-java
---

# Quickstart: Set up logs, metrics, and tracing for Azure Spring Cloud apps

[Diagnostic services](diagnostic-services.md)
[Distributed tracing](spring-cloud-tutorial-distributed-tracing.md)
[Stream logs in real time](spring-cloud-howto-log-streaming.md)

## Set up logs following deployment in the Azure portal

## Set up logs following CLI deployment

## Set up logs following IntelliJ deployment
The following procedure assumes you have completed [deployment of an Azure Spring Cloud app using IntelliJ](spring-cloud-quickstart-deploy-apps.md#intellij-deployment).

## Show streaming logs
To get the logs:
1. Select **Azure Explorer**, then **Spring Cloud**.
1. Right-click the running app.
1. Select **Streaming Logs** from the drop-down list.

    ![Select streaming logs](media/spring-cloud-intellij-howto/streaming-logs.png)

1. Select instance.

    ![Select instance](media/spring-cloud-intellij-howto/select-instance.png)

1. The streaming log will be visible in the output window.

    ![Streaming log output](media/spring-cloud-intellij-howto/streaming-log-output.png)

## Next steps
* [Diagnostic services](diagnostic-services.md)
* [Distributed tracing](spring-cloud-tutorial-distributed-tracing.md)
* [Stream logs in real time](spring-cloud-howto-log-streaming.md)