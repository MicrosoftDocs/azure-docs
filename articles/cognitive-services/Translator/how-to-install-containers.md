---
title: Install and run containers - Translator Text
titleSuffix: Azure Cognitive Services
description: How to download, install, and run containers for Translator Text Analytics in this walkthrough tutorial.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: dapine
---

# Install and run Translator Text containers

<!--
    ACOM forward link:
    https://docs.microsoft.com/azure/cognitive-services/translator/howto-install-containers
-->

Containers enable you to run the Translator Text APIs in your own environment and are great for specific security and data governance requirements.

## Prerequisites

You must meet the following prerequisites before using Translator Text containers:

|Required|Purpose|
|--|--|
|Docker Engine| You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).<br><br> **On Windows**, Docker must also be configured to support Linux containers.<br><br>|
|Familiarity with Docker | You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker` commands.|

## Request access to the container registry

You must first complete and submit the [Cognitive Translator Text Containers Request form](https://aka.ms/translatorcontainerform) to request access to the container.

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

### The host computer

The host is an x64-based computer with a Linux OS that runs the Docker container. It can be a computer on your premises or a Docker hosting service in Azure, such as:

* Azure Kubernetes Service.
* Azure Container Instances.
* A [Kubernetes](https://kubernetes.io/) cluster deployed to Azure Stack.

### Container requirements and recommendations

The following table describes the minimum and recommended CPU cores, at least 2.6 gigahertz (GHz) or faster, and memory, in gigabytes (GB), to allocate for each Translator Text container.

| Container | Minimum | Language pair |
|-----------|---------|---------------|
| Translator Text | 4 core, 4 GB memory | 4 |

For every language pair, it's recommended to have 1 GB of memory. By default, the Translator Text container has 3 or 4 language pairs, depending on the `<image-tag>` you're running. See [supported languages and translation](#supported-languages-and-translation) for the details. The core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

## Get the container image with `docker pull`

Container images for Translator Text are available in the following container repository. The table also maps the container image tags and their corresponding supported languages.

| Container | Image tag | Languages supported |
|-----------|-----------|---------------------|
| `containerpreview.azurecr.io/microsoft/cognitive-services-translator-text` | `ar_de_en_ru_zh_1.0.0` | `ar-SA`, `zh-CN`, `de-DE`, and `ru-RU` |
| `containerpreview.azurecr.io/microsoft/cognitive-services-translator-text` | `de_en_es_fr_1.0.0` | `de-DE`, `fr-FR`, and `es-ES` |

[!INCLUDE [Tip for using docker list](../../../includes/cognitive-services-containers-docker-list-tip.md)]

### Docker pull for the Translator Text container

To perform the [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/) command, you first need access to the container registry. From the Azure CLI you can login to the Azure Container Registry using the [`az acr login`](https://docs.microsoft.com/cli/azure/acr?view=azure-cli-latest#az-acr-login) command.

```azureinteractive
az acr login --name containerpreview.azurecr.io
```

This command will authenticate your current user with the corresponding Azure Container Registry. Now, you're free to execute the `docker pull` command.

> [!NOTE]
> Depending on what language support you need, provide the corresponding `<image-tag>`.

```Docker
docker pull containerpreview.azurecr.io/microsoft/cognitive-services-translator-text:<image-tag>
```

## How to use the container

Once the container is on the [host computer](#the-host-computer), use the following process to work with the container.

1. [Run the container](#run-the-container-with-docker-run). More [examples](translator-text-container-config.md#example-docker-run-commands) of the `docker run` command are available.
1. [Query the container's translate endpoint](#query-the-containers-translate-endpoint).

## Run the container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run any of the three containers. [Examples](translator-text-container-config.md#example-docker-run-commands) of the `docker run` command are available.

### Run container example of docker run command

```Docker
docker run --rm -it -p 5000:80 --memory 4g --cpus 4 \
containerpreview.azurecr.io/microsoft/cognitive-services-translator-text:ar_de_en_ru_zh_1.0.0 \
Eula=accept
```

This command:

* Runs a Translator Text container from the container image
* Allocates 4 CPU core and 4 gigabytes (GB) of memory
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Accepts the end user agreement (EULA)
* Automatically removes the container after it exits. The container image is still available on the host computer

### How to collect docker logs

For troubleshooting purposes, it may be useful to view the docker logs from the container's execution. First, execute the [docker ps](https://docs.docker.com/engine/reference/commandline/ps/) command with the formatting flag to limit the details displayed for all the containers.

```Docker
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Status}}"

CONTAINER ID    IMAGE                                                                       STATUS
ed6f115697f3    containerpreview.azurecr.io/microsoft/cognitive-services-translator-text    Up 4 minutes
```

Then, run the [docker logs](https://docs.docker.com/engine/reference/commandline/logs/) command with the `<Container ID>` for the corresponding container in question to view its logs.

```Docker
docker logs <Container ID> --timestamps --since=4h | grep Error
```

The docker logs command above will collect the "Error" logs for the last four hours.

## Supported languages and translation

The `POST /translate` method supports the following languages conversions, moving from *English* to a target language and vice versa. Please note that while you can go to and from English with one of the languages listed, you *cannot* go from one *non-English* language to another *non-English* language.

> [!NOTE]
> For optimal quality, consumers should only send one sentence per request.

| Language conversion | Language ISO conversion | Image tags |
|--|--|:--|
| English :left_right_arrow: Chinese | `en-US` :left_right_arrow: `zh-CN` | `ar_de_en_ru_zh_1.0.0` |
| English :left_right_arrow: Russian | `en-US` :left_right_arrow: `ru-RU` | `ar_de_en_ru_zh_1.0.0` |
| English :left_right_arrow: Arabic | `en-US` :left_right_arrow: `ar-SA` | `ar_de_en_ru_zh_1.0.0` |
| English :left_right_arrow: German | `en-US` :left_right_arrow: `de-DE` | `ar_de_en_ru_zh_1.0.0` and `de_en_es_fr_1.0.0` |
| English :left_right_arrow: Spanish | `en-US` :left_right_arrow: `es-ES` | `de_en_es_fr_1.0.0` |
| English :left_right_arrow: French | `en-US` :left_right_arrow: `fr-FR` | `de_en_es_fr_1.0.0` |

> [!IMPORTANT]
> The `Eula` must be specified to run the container; otherwise, the container won't start.

## Query the container's translate endpoint

The container provides a REST-based translate endpoint API. Several example usages of this endpoint are as follows:

# [cURL](#tab/curl)


Execute the following cURL command, from your desired CLI.

```curl
curl -X POST "http://localhost:5000/translate?api-version=3.0&from=en-US&to=de-DE"
    -H "Content-Type: application/json" -d "[{'Text':'hello, how are you'}]"
```

> [!TIP]
> If you attempt this cURL POST before the container is ready, you'll end up getting a "Service is temporarily unavailable" response. Simply wait until the container is ready, then try again.

The following output will be printed to the console.

```console
"translations": [
    {
        "text": "hallo, wie geht es dir",
        "to": "de-DE"
    }
]
```

# [Swagger](#tab/Swagger)

Navigate to the swagger page, http://localhost:5000/swagger/index.html

1. Select **POST /translate**
1. Select **Try it out**
1. Enter the **From** parameter as `en-US`
1. Enter the **To** parameter as `de-DE`
1. Enter the **api-version** parameter as `3.0`
1. Under **texts**, replace `string` with the following JSON
    ```json
    [
        {
            "text": "hello, how are you"
        }
    ]
    ```
1. Select **Execute**, the resulting translations are output in the **Response Body**. You should expect something similar to the following:
    ```json
    "translations": [
      {
          "text": "hallo, wie geht es dir",
          "to": "de-DE"
      }
    ]
    ```

# [.NET Core](#tab/netcore)

1. Launch Visual Studio, and create a new console application.
1. Edit the `*.csproj` file to add the `<LangVersion>7.1</LangVersion>` node - this specifies C# 7.1.
1. Add the [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) NuGet package, version 11.0.2.
1. In `Program.cs`, replace all the existing code with the following:
    ```csharp
    using Newtonsoft.Json;
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;

    namespace TranslateContainer
    {
        class Program
        {
            const string ApiHostEndpoint = "http://localhost:5000";
            const string TranslateApi = "/translate?api-version=3.0&from=en-US&to=de-DE";

            static async Task Main(string[] args)
            {
                var textToTranslate = "hello, how are you";
                var result = await TranslateTextAsync(textToTranslate);

                Console.WriteLine(result);
                Console.ReadLine();
            }

            static async Task<string> TranslateTextAsync(string textToTranslate)
            {
                var body = new object[] { new { Text = textToTranslate } };
                var requestBody = JsonConvert.SerializeObject(body);

                var client = new HttpClient();
                using (var request =
                    new HttpRequestMessage
                    {
                        Method = HttpMethod.Post,
                        RequestUri = new Uri($"{ApiHostEndpoint}{TranslateApi}"),
                        Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
                    })
                {
                    // Send the request and await a response.
                    var response = await client.SendAsync(request);

                    return await response.Content.ReadAsStringAsync();
                }
            }
        }
    }
    ```
1. Press **F5** to run the program.
1. The following output will be printed to the console.
    ```console
    "translations": [
      {
          "text": "hallo, wie geht es dir",
          "to": "de-DE"
      }
    ]
    ```

***

[!INCLUDE [Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshooting

If you run the container with an output [mount](translator-text-container-config.md#mount-settings) and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

<!--blogs/samples/video course -->

[!INCLUDE [Discoverability of more container information](../../../includes/cognitive-services-containers-discoverability.md)]

## Summary

In this article, you learned concepts and workflow for downloading, installing, and running Translator Text containers. In summary:

* Translator Text provides multiple Linux containers for Docker, encapsulating various language pairs.
* Container images are downloaded from the "Container Preview" registry.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Translator Text containers by specifying the host URI of the container.

## Next steps

* Review [Configure containers](translator-text-container-config.md) for configuration settings
* Refer to [container frequently asked questions (FAQ)](../containers/container-faq.md) to resolve issues related to functionality.
