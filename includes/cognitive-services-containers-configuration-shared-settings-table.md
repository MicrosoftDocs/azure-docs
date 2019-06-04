---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 05/15/2019
---

The container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#the-apikey-configuration-setting)|Track billing information.|
|No|[ApplicationInsights](#the-applicationinsights-setting)|Enable adding [Azure Application Insights](https://docs.microsoft.com/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#the-billing-configuration-setting)|Specify the endpoint URI of the service resource on Azure.|
|Yes|[Eula](#the-eula-setting)| Indicate that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Write log and, optionally, metric data to a Fluentd server.|
|No|Http Proxy|Configure an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provide ASP.NET Core logging support for your container. |
|No|[Mounts](#mount-settings)|Read and write data from the host computer to the container and from the container back to the host computer.|
