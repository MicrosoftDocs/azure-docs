---
title: How to configure a container for Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to configure the Form Recognizer container to parse form and table data.
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 06/19/2019
ms.author: dapine
---
# Configure Form Recognizer containers

By using Azure Form Recognizer containers, you can build an application architecture that's optimized to take advantage of both robust cloud capabilities and edge locality.

You configure the Form Recognizer container run-time environment by using the `docker run` command arguments. This container has several required settings and a few optional settings. For a few examples, see the ["Example docker run commands"](#example-docker-run-commands) section. The container-specific settings are the billing settings.

## Configuration settings

[!INCLUDE [Container shared configuration settings table](../../../includes/cognitive-services-containers-configuration-shared-settings-table.md)]

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together. You must provide valid values for all three settings; otherwise, your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](form-recognizer-container-howto.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key that's used to track billing information for the container. The value for the ApiKey must be a valid key for the _Form Recognizer_ resource that's specified for `Billing` in the "Billing configuration setting" section.

You can find this setting in the Azure portal, in **Form Recognizer Resource Management**, under **Keys**.

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Form Recognizer_ resource on Azure that's used to meter billing information for the container. The value for this configuration setting must be a valid endpoint URI for a _Form Recognizer_ resource on Azure. The container reports usage about every 10 to 15 minutes.

You can find this setting in the Azure portal, in **Form Recognizer Overview**, under **Endpoint**.

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westus2.api.cognitive.microsoft.com/` |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]

## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

## HTTP proxy credentials settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

## Logging settings

[!INCLUDE [Container shared configuration logging settings](../../../includes/cognitive-services-containers-configuration-shared-settings-logging.md)]


## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or an output mount by specifying the `--mount` option in the [`docker run` command](https://docs.docker.com/engine/reference/commandline/run/).

The Form Recognizer container requires an input mount and an output mount. The input mount can be read-only, and it's required for access to the data that's used for training and scoring. The output mount has to be writable, and you use it to store the models and temporary data.

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the mount location of the [host computer](form-recognizer-container-howto.md#the-host-computer) might not be accessible because of a conflict between the Docker service account permissions and the host mount location permissions.

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Required| `Input` | String | The target of the input mount. The default value is `/input`.    <br><br>Example:<br>`--mount type=bind,src=c:\input,target=/input`|
|Required| `Output` | String | The target of the output mount. The default value is `/output`.  <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands. When it's running, the container continues to run until you [stop it](form-recognizer-container-howto.md#stop-the-container).

* **Line-continuation character**: The Docker commands in the following sections use a back slash (\\) as a line continuation character. Replace or remove this character, depending on your host operating system's requirements.
* **Argument order**: Don't change the order of the arguments unless you're familiar with Docker containers.

Replace {_argument_name_} in the following table with your own values:

| Placeholder | Value |
|-------------|-------|
|{BILLING_KEY} | The key that's used to start the container. It's available on the Azure portal Form Recognizer Keys page.  |
|{BILLING_ENDPOINT_URI} | The billing endpoint URI value is available on the Azure portal Form Recognizer Overview page.|
|{COMPUTER_VISION_API_KEY}| The key is available on the Azure portal Computer Vision API Keys page.|
|{COMPUTER_VISION_ENDPOINT_URI}|The billing endpoint. If you're using a cloud-based Computer Vision resource, the URI value is available on the Azure portal Computer Vision API Overview page. If you're using a  *cognitive-services-recognize-text* container, use the billing endpoint URL that's passed to the container in the `docker run` command.|

> [!IMPORTANT]
> To run the container, specify the `Eula`, `Billing`, and `ApiKey` options; otherwise, the container won't start. For more information, see [Billing](#billing-configuration-setting).

> [!NOTE] 
> The ApiKey value is the **Key** from the Azure Form Recognizer Resource keys page.

## Form Recognizer container Docker examples

The following Docker examples are for the Form Recognizer container.

### Basic example for Form Recognizer

```Docker
docker run --rm -it -p 5000:5000 --memory 8g --cpus 2 \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY} \
FormRecognizer:ComputerVisionApiKey={COMPUTER_VISION_API_KEY} \
FormRecognizer:ComputerVisionEndpointUri={COMPUTER_VISION_ENDPOINT_URI}
```

### Logging example for Form Recognizer

```Docker
docker run --rm -it -p 5000:5000 --memory 8g --cpus 2 \
--mount type=bind,source=c:\input,target=/input  \
--mount type=bind,source=c:\output,target=/output \
containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer \
Eula=accept \
Billing={BILLING_ENDPOINT_URI} \
ApiKey={BILLING_KEY} \
FormRecognizer:ComputerVisionApiKey={COMPUTER_VISION_API_KEY} \
FormRecognizer:ComputerVisionEndpointUri={COMPUTER_VISION_ENDPOINT_URI}
Logging:Console:LogLevel:Default=Information
```


## Next steps

* Review [Install and run containers](form-recognizer-container-howto.md).
