---
title: Configure container - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn how to use the Form Recognizer container to parse form and table data.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: pafarley
---
# Configure containers

The **Form Recognizer** container runtime environment is configured using the `docker run` command arguments. This container has several required settings, along with a few optional settings. Several [examples](#example-docker-run-commands) of the command are available. The container-specific settings are the billing settings.

# Configuration settings

This container has the following configuration settings:

|Required|Setting|Purpose|
|--|--|--|
|Yes|[ApiKey](#apikey-configuration-setting)|Used to track billing information.|
|Yes|[Billing](#billing-configuration-setting)|Specifies the endpoint URI of the service resource on Azure.|
|Yes|[Eula](#eula-setting)| Indicates that you've accepted the license for the container.|
|Yes|[Logging](#logging-settings)|Provides ASP.NET Core logging support for your container. |
|Yes|[Mounts](#mount-settings)|Read and write data from host computer to container and from container back to host computer.|

> [!IMPORTANT]
> The [`ApiKey`](#apikey-configuration-setting), [`Billing`](#billing-configuration-setting), and [`Eula`](#eula-setting) settings are used together, and you must provide valid values for all three of them; otherwise your container won't start. For more information about using these configuration settings to instantiate a container, see [Billing](form-recognizer-container-howto.md#billing).

## ApiKey configuration setting

The `ApiKey` setting specifies the Azure resource key used to track billing information for the container. You must specify a value for the ApiKey and the value must be a valid key for the _Forms Recognizer_ resource specified for the [`Billing`](#billing-configuration-setting) configuration setting.

This setting can be found in the following place:

* Azure portal: **Form Recognizer's** Resource Management, under **Keys**

<!-- 

## ApplicationInsights setting

[!INCLUDE [Container shared configuration ApplicationInsights settings](../../../includes/cognitive-services-containers-configuration-shared-settings-application-insights.md)]

 -->

## Billing configuration setting

The `Billing` setting specifies the endpoint URI of the _Forms Recognizer_ resource on Azure used to meter billing information for the container. You must specify a value for this configuration setting, and the value must be a valid endpoint URI for a _Forms Recognizer_ resource on Azure.

This setting can be found in the following place:

* Azure portal: **Form Recognizer's** Overview, labeled `Endpoint`

|Required| Name | Data type | Description |
|--|------|-----------|-------------|
|Yes| `Billing` | String | Billing endpoint URI<br><br>Example:<br>`Billing=https://westus.api.cognitive.microsoft.com` |

## Eula setting

[!INCLUDE [Container shared configuration eula settings](../../../includes/cognitive-services-containers-configuration-shared-settings-eula.md)]


<!-- ## Fluentd settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-fluentd.md)]

 -->

<!-- ## Http proxy credentials settings

[!INCLUDE [Container shared configuration fluentd settings](../../../includes/cognitive-services-containers-configuration-shared-settings-http-proxy.md)]

 -->

## Logging settings

The `Logging` settings manage ASP.NET Core logging support for your container. You can use the same configuration settings and values for your container that you use for an ASP.NET Core application.

The following logging providers are supported by the container:

|Provider|Purpose|
|--|--|
|[Console](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#console-provider)|The ASP.NET Core `Console` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
|[Debug](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#debug-provider)|The ASP.NET Core `Debug` logging provider. All of the ASP.NET Core configuration settings and default values for this logging provider are supported.|
<!--|[Disk](#disk-logging)|The JSON logging provider. This logging provider writes log data to the output mount.|-->

<!-- ### Disk logging

The `Disk` logging provider supports the following configuration settings:  

| Name | Data type | Description |
|------|-----------|-------------|
| `Format` | String | The output format for log files.<br/> **Note:** This value must be set to `json` to enable the logging provider. If this value is specified without also specifying an output mount while instantiating a container, an error occurs. |
| `MaxFileSize` | Integer | The maximum size, in megabytes (MB), of a log file. When the size of the current log file meets or exceeds this value, a new log file is started by the logging provider. If -1 is specified, the size of the log file is limited only by the maximum file size, if any, for the output mount. The default value is 1. |

For more information about configuring ASP.NET Core logging support, see [Settings file configuration](https://docs.microsoft.com/aspnet/core/fundamentals/logging/?view=aspnetcore-2.1#settings-file-configuration). -->


## Mount settings

Use bind mounts to read and write data to and from the container. You can specify an input mount or output mount by specifying the `--mount` option in the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command.

The Form Recognizer container requires an **input** and **output** mount. The input mount can be read-only and is required to access the data that will be used for training and scoring. The output mount has to be writable and will be used to store the models and temporary data.

The exact syntax of the host mount location varies depending on the host operating system. Additionally, the [host computer](form-recognizer-container-howto.md#the-host-computer)'s mount location may not be accessible due to a conflict between permissions used by the Docker service account and the host mount location permissions.

|Optional| Name | Data type | Description |
|-------|------|-----------|-------------|
|Required| `Input` | String | The target of the input mount. The default value is `/input`.    <br><br>Example:<br>`--mount type=bind,src=c:\input,target=/input`|
|Required| `Output` | String | The target of the output mount. The default value is `/output`.  <br><br>Example:<br>`--mount type=bind,src=c:\output,target=/output`|

## Example docker run commands

The following examples use the configuration settings to illustrate how to write and use `docker run` commands.  Once running, the container continues to run until you [stop](form-recognizer-container-howto.md#stop-the-container) it.

* **Line-continuation character**: The Docker commands in the following sections use the back slash, `\`, as a line continuation character for a bash shell. Replace or remove this based on your host operating system's requirements. For example, the line continuation character for windows is a carot, `^`. Replace the back slash with the carot.
* **Argument order**: Do not change the order of the arguments unless you are very familiar with Docker containers.

Replace {_argument_name_} with your own values:

| Placeholder | Value | Format or example |
|-------------|-------|---|
|{BILLING_KEY} | The endpoint key of the Form Recognizer resource. |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{BILLING_ENDPOINT_URI} | The billing endpoint value including region for the Form Recognizer resource.|`https://westus.api.cognitive.microsoft.com`|
|{COMPUTER_VISION_API_KEY}| The endpoint key of the Computer Vision API resource.|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
|{COMPUTER_VISION_API_BILLING_ENDPOINT_URI} | The billing endpoint value including region for the Computer Vision API.|`https://westus.api.cognitive.microsoft.com`|

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](form-recognizer-container-howto.md#billing).
> The ApiKey value is the **Key** from the Azure Form Recognizer Resource keys page.

## Form Recognizer container Docker examples

The following Docker examples are for the Form Recognizer container.

### Basic example


```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
containerpreview.azurecr.io/microsoft/form-recognizer
eula=accept apikey={BILLING_KEY}
billing={BILLING_ENDPOINT_URI} computervisionapikey={COMPUTER_VISION_API_KEY}
computervisionendpointuri={COMPUTER_VISION_API_BILLING_ENDPOINT_URI}
```


### Logging to console example with command-line arguments

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
containerpreview.azurecr.io/microsoft/form-recognizer
eula=accept apikey={BILLING_KEY}
billing={BILLING_ENDPOINT_URI} computervisionapikey={COMPUTER_VISION_API_KEY}
computervisionendpointuri={COMPUTER_VISION_API_BILLING_ENDPOINT_URI}
Logging:Console:LogLevel:Default=Information
  ```

### Logging to output mount's file example with command-line arguments

```Docker
docker run --rm -it -p 5000:5000 --memory 4g --cpus 2
--mount type=bind,source=c:\input,target=/input  
--mount type=bind,source=c:\output,target=/output
containerpreview.azurecr.io/microsoft/form-recognizer
eula=accept apikey={BILLING_KEY}
billing={BILLING_ENDPOINT_URI} computervisionapikey={COMPUTER_VISION_API_KEY}
computervisionendpointuri={COMPUTER_VISION_API_BILLING_ENDPOINT_URI}
Logging:Disk:Format=json
  ```
  