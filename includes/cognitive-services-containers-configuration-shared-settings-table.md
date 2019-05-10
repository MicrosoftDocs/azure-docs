---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 01/22/2019
---

This container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Used to track billing information.|
|No|[ApplicationInsights](#applicationinsights-setting)|Allows you to add [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.|
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Write log and, optionally, metric data to a Fluentd server.|
|No|[Http Proxy](#http-proxy-credentials-settings)|Configure an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |
|No|[Mounts](#mount-settings)|Read and write data from host computer to container and from container back to host computer.|
