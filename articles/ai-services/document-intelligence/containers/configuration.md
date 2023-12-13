---
title: Configure Document Intelligence (formerly Form Recognizer) containers
titleSuffix: Azure AI services
description: Learn how to configure the Document Intelligence container to parse form and table data.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 12/12/2023
ms.author: lajanuar
---



:::moniker range="doc-intel-2.0.0 || doc-intel-3.1.0||doc-intel-4.0.0 "
    Document Intelligence containers are currently only supported by REST API 2022-08-31 (GA) and the SDKs that target REST API 2022-08-31 (GA). See [Configure Document Intelligence v3.0 containers](configuration.md#configure-document-intelligence-v30-containers?view=doc-intel-3.0.0&preserve-view=true)
:::moniker-end

:::moniker range="doc-intel-3.0.0"

# Configure Document Intelligence v3.0 containers

**This content applies to:** ![checkmark](../media/yes-icon.png) **v3.0 (GA)**

With Document Intelligence containers, you can build an application architecture optimized to take advantage of both robust cloud capabilities and edge locality. Containers provide a minimalist, isolated environment that can be easily deployed on-premises and in the cloud. In this article, we show you how to configure the Document Intelligence container run-time environment by using the `docker compose` command arguments. Document Intelligence features are supported by six Document Intelligence feature containers—**Layout**, **Business Card**,**ID Document**,  **Receipt**, **Invoice**, **Custom**. These containers have both required and optional settings. For a few examples, see the [Example docker-compose.yml file](#example-docker-composeyml-file) section.

## Configuration settings

Each container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[Key](#key-and-billing-configuration-setting)|Tracks billing information.|
|Yes|[Billing](#key-and-billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.  For more information, _see_ [Billing](install-run.md#billing). For more information and a complete list of regional endpoints, _see_ [Custom subdomain names for Azure AI services](../../../ai-services/cognitive-services-custom-subdomains.md).|
|Yes|[Eula](#eula-setting)| Indicates that you accepted the license for the container.|
|No|[ApplicationInsights](#applicationinsights-setting)|Enables adding [Azure Application Insights](/azure/application-insights) customer support for your container.|
|No|[Fluentd](#fluentd-settings)|Writes log and, optionally, metric data to a Fluentd server.|
|No|HTTP Proxy|Configures an HTTP proxy for making outbound requests.|
|No|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |

> [!IMPORTANT]
> The [`Key`](#key-and-billing-configuration-setting), [`Billing`](#key-and-billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together. You must provide valid values for all three settings; otherwise, your containers won't start. For more information about using these configuration settings to instantiate a container, see [Billing](install-run.md#billing).

## Key and Billing configuration setting

The `Key` setting specifies the Azure resource key that is used to track billing information for the container. The value for the Key must be a valid key for the resource that is specified for `Billing` in the "Billing configuration setting" section.

The `Billing` setting specifies the endpoint URI of the resource on Azure that is used to meter billing information for the container. The value for this configuration setting must be a valid endpoint URI for a resource on Azure. The container reports usage about every 10 to 15 minutes.

 You can find these settings in the Azure portal on the **Keys and Endpoint** page.

   :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot of Azure portal keys and endpoint page.":::

## EULA setting

[!INCLUDE [Container shared configuration eula settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared configuration fluentd settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]

## Volume settings

Use [**volumes**](https://docs.docker.com/storage/volumes/) to read and write data to and from the container. Volumes are the preferred for persisting data generated and used by Docker containers. You can specify an input mount or an output mount by including the `volumes` option and specifying `type` (bind), `source` (path to the folder) and `target` (file path parameter).

The Document Intelligence container requires an input volume and an output volume. The input volume can be read-only (`ro`), and is required for access to the data that is used for training and scoring. The output volume has to be writable, and you use it to store the models and temporary data.

The exact syntax of the host volume location varies depending on the host operating system. Additionally, the volume location of the [host computer](install-run.md#host-computer-requirements) might not be accessible because of a conflict between the Docker service account permissions and the host mount location permissions.

## Example docker-compose.yml file

The **docker compose** method is built from three steps:

 1. Create a Dockerfile.
 1. Define the services in a **docker-compose.yml** so they can be run together in an isolated environment.
 1. Run `docker-compose up` to start and run your services.

### Single container example

In this example, enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Layout container instance.

#### **Layout container**

```yml
version: "3.9"
services:
  azure-cognitive-service-layout:
    container_name: azure-cognitive-service-layout
    image: mcr.microsoft.com/azure-cognitive-services/form-recognizer/layout
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - key={FORM_RECOGNIZER_KEY}

    ports:
      - "5000"
    networks:
      - ocrvnet
networks:
  ocrvnet:
    driver: bridge
```

### Multiple containers example

#### **Receipt and OCR Read containers**

In this example, enter {FORM_RECOGNIZER_ENDPOINT_URI} and {FORM_RECOGNIZER_KEY} values for your Receipt container and {COMPUTER_VISION_ENDPOINT_URI} and {COMPUTER_VISION_KEY} values for your Azure AI Vision Read container.

```yml
version: "3"
services:
  azure-cognitive-service-receipt:
    container_name: azure-cognitive-service-receipt
    image: cognitiveservicespreview.azurecr.io/microsoft/cognitive-services-form-recognizer-receipt:2.1
    environment:
      - EULA=accept
      - billing={FORM_RECOGNIZER_ENDPOINT_URI}
      - key={FORM_RECOGNIZER_KEY}
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
      - billing={COMPUTER_VISION_ENDPOINT_URI}
      - key={COMPUTER_VISION_KEY}
    networks:
      - ocrvnet

networks:
  ocrvnet:
    driver: bridge
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about running multiple containers and the docker compose command](install-run.md)

* [Azure container instance recipe](../../../ai-services/containers/azure-container-instance-recipe.md)

:::moniker-end
