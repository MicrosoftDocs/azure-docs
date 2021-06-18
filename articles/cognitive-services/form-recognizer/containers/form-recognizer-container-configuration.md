---
title: How to configure a container for Form Recognizer
titleSuffix: Azure Applied AI Services
description: Learn how to configure the Form Recognizer container to parse form and table data.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: lajanuar
---
# Configure Form Recognizer containers

By using Azure Form Recognizer containers, you can build an application architecture that's optimized to take advantage of both robust cloud capabilities and edge locality.

You configure the Form Recognizer container run-time environment by using the `docker compose` command arguments. This container has several required settings and a few optional settings. For a few examples, see the [Example docker-compose.yml file](#example-docker-compose-yml-file) section. The container-specific settings are the billing settings.

## Configuration settings

The container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Tracks billing information.|
|No|[ApplicationInsights](#applicationinsights-setting)|Enables adding [Azure Application Insights](/azure/application-insights) telemetry support to your container.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.|
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|No|[Fluentd](#fluentd-settings)|Writes log and, optionally, metric data to a Fluentd server.|
|No|HTTP Proxy|Configures an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together. You must provide valid values for all three settings; otherwise, your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](form-recognizer-container-install-run.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key that's used to track billing information for the container. The value for the ApiKey must be a valid key for the _Form Recognizer_ resource that's specified for `Billing` in the "Billing configuration setting" section.

You can find this setting in the Azure portal, in **Form Recognizer Resource Management**, under **Keys**.

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Form Recognizer_ resource on Azure that's used to meter billing information for the container. The value for this configuration setting must be a valid endpoint URI for a _Form Recognizer_ resource on Azure. The container reports usage about every 10 to 15 minutes.

You can find this setting in the Azure portal, in **Form Recognizer Overview**, under **Endpoint**.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI. For more information on obtaining _see_ [Billing]](form-recognizer-container-install-run.md#billing). For more information and a complete list of regional endpoints, _see_ [Custom subdomain names for Cognitive Services](../../cognitive-services-custom-subdomains.md). |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Volume settings

Use [**volumes**](https://docs.docker.com/storage/volumes/) to read and write data to and from the container. Volumes are the preferred for persisting data generated and used by Docker containers. You can specify an input mount or an output mount by including the `volumes` option and specifying `type` (bind), `source` (path to the folder) and `target` (file path parameter).

The Form Recognizer container requires an input volume and an output volume. The input volume can be read-only (`ro`), and it's required for access to the data that's used for training and scoring. The output volume has to be writable, and you use it to store the models and temporary data.

The exact syntax of the host volume location varies depending on the host operating system. Additionally, the volume location of the [host computer](form-recognizer-container-install-run.md#host-computer-requirements) might not be accessible because of a conflict between the Docker service account permissions and the host mount location permissions.

## Example docker-compose.yml file

The `docker compose` method is comprised of three steps:

 1. Create a Dockerfile.
 1. Define the services in a **docker-compose.yml** so they can be run together in an isolated environment.
 1. Run `docker-compose up` to starts and runs your services.
 
| Placeholder | Value |
|-------------|-------|
| **{API_KEY}** | The key that's used to start the container. It's available on the Azure portal Form Recognizer Keys page. |
| **{ENDPOINT_URI}** | The billing endpoint URI value is available on the Azure portal Form Recognizer Overview page.|

> [!IMPORTANT]
> To run the container, specify the `Eula`, `Billing`, and `ApiKey` options; otherwise, the container won't start. For more information, see [Billing](#billing-configuration-setting).

### Single container

**Layout container**

```yml
version: "3.9"
services:
azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    environment:
      - EULA=accept
      - billing={ENDPOINT_URI}
      - apikey={API_KEY}
    ports:
      - "5000"
    networks:
      - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

### Multiple containers

**Receipt and OCR Read containers**

```yml
version: "3"
services:
  azure-cognitive-service-receipt:
    container_name: azure-cognitive-service-receipt
    image: cognitiveservicespreview.azurecr.io/microsoft/cognitive-services-form-recognizer-receipt:2.1
    environment:
      - EULA=accept 
      - billing= # Billing endpoint
      - apikey= # Subscription key
      - AzureCognitiveServiceReadHost=http://azure-cognitive-service-read:5000
    ports:
      - "5000:5050"
    networks:
      - ocrvnet
  azure-cognitive-service-read:
    container_name: azure-cognitive-service-read
    image: mcr.microsoft.com/azure-cognitive-services/vision/read:3.2
    environment:
      - EULA=accept 
      - billing= # Billing endpoint
      - apikey= # Subscription key
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

## Next steps

* Review [Install and run containers](form-recognizer-container-install-run.md).
