---
title: Install and run Docker containers for Translator API
titleSuffix: Azure AI services
description: Use the Docker container for Translator API to translate text.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
keywords: on-premises, Docker, container, identify
---

# Install and run Translator containers

Containers enable you to run several features of the Translator service in your own environment. Containers are great for specific security and data governance requirements. In this article you learn how to download, install, and run a Translator container.

Translator container enables you to build a translator application architecture that is optimized for both robust cloud capabilities and edge locality.

See the list of [languages supported](../language-support.md) when using Translator containers. 

> [!IMPORTANT]
>
> * To use the Translator container, you must submit an online request and have it approved. For more information, _see_ [Request approval to run container](#request-approval-to-run-container).
> * Translator container supports limited features compared to the cloud offerings.  For more information, _see_ [**Container translate methods**](translator-container-supported-parameters.md).

<!-- markdownlint-disable MD033 -->

## Prerequisites

To get started, you need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You also need:

| Required | Purpose |
|--|--|
| Familiarity with Docker | <ul><li>You should have a basic understanding of Docker concepts like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology).</li></ul> |
| Docker Engine | <ul><li>You need the Docker Engine installed on a [host computer](#host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul> |
| Translator resource | <ul><li>An Azure [Translator](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) regional resource (not `global`) with an associated API key and endpoint URI. Both values are required to start the container and can be found on the resource overview page.</li></ul>|

|Optional|Purpose|
|---------|----------|
|Azure CLI (command-line interface) |<ul><li> The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It's available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell.</li></ul> |

## Required elements

All Azure AI containers require three primary elements:

* **EULA accept setting**. An end-user license agreement (EULA) set with a value of `Eula=accept`.

* **API key** and **Endpoint URL**.  The API key is used to start the container. You can retrieve the API key and Endpoint URL values by navigating to the Translator resource **Keys and Endpoint** page and selecting the `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon.

> [!IMPORTANT]
>
> * Keys are used to access your Azure AI resource. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Host computer

[!INCLUDE [Host Computer requirements](../../../../includes/cognitive-services-containers-host-computer.md)]

## Container requirements and recommendations

The following table describes the minimum and recommended CPU cores and memory to allocate for the Translator container.

| Container | Minimum |Recommended | Language Pair |
|-----------|---------|---------------|----------------------|
| Translator |`2` cores, 2-GB memory |`4` cores, 8-GB memory | 4 |

* Each core must be at least 2.6 gigahertz (GHz) or faster. 

* For every language pair, it's recommended to have 2 GB of memory. By default, the Translator offline container has four language pairs. 

* The core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!NOTE]
>
> * CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the docker run command.
>
> * The minimum and recommended specifications are based on Docker limits, not host machine resources.

## Request approval to run container

Complete and submit the [**Azure AI services
Application for Gated Services**](https://aka.ms/csgate-translator) to request access to the container.

[!INCLUDE [Request access to public preview](../../../../includes/cognitive-services-containers-request-access.md)]


## Translator container image

The Translator container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/translator` repository and is named `text-translation`. The fully qualified container image name is `mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest`.

To use the latest version of the container, you can use the `latest` tag. You can find a full list of [tags on the MCR](https://mcr.microsoft.com/product/azure-cognitive-services/translator/text-translation/tags).

## Get container images with **docker commands**

> [!IMPORTANT]
>
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements.
> * The `EULA`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to download a container image from Microsoft Container registry and run it.

```Docker
docker run --rm -it -p 5000:5000 --memory 12g --cpus 4 \
-v /mnt/d/TranslatorContainer:/usr/local/models \
-e apikey={API_KEY} \
-e eula=accept \
-e billing={ENDPOINT_URI} \
-e Languages=en,fr,es,ar,ru  \
mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest
```

The above command:

* Downloads and runs a Translator container from the container image.
* Allocates 12 gigabytes (GB) of memory and four CPU core.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Accepts the end-user agreement (EULA)
* Configures billing endpoint
* Downloads translation models for languages English, French, Spanish, Arabic, and Russian
* Automatically removes the container after it exits. The container image is still available on the host computer.

### Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Azure AI container running on the HOST together. You also can have multiple containers of the same Azure AI container running.

## Query the container's Translator endpoint

 The container provides a REST-based Translator endpoint API. Here's an example request:

```curl
curl -X POST "http://localhost:5000/translate?api-version=3.0&from=en&to=zh-HANS"
    -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

> [!NOTE]
> If you attempt the cURL POST request before the container is ready, you'll end up getting a *Service is temporarily unavailable* response. Wait until the container is ready, then try again.

## Stop the container

[!INCLUDE [How to stop the container](../../../../includes/cognitive-services-containers-stop.md)]

## Troubleshoot

### Validate that a container is running

There are several ways to validate that the container is running:

* The container provides a homepage at `/` as a visual validation that the container is running.

* You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the following request URLs to validate the container is running. The example request URLs listed point to `http://localhost:5000`, but your specific container may vary. Keep in mind that you're navigating to your container's **External IP address** and exposed port.

| Request URL | Purpose |
|--|--|
| `http://localhost:5000/` | The container provides a home page. |
| `http://localhost:5000/ready` | Requested with GET. Provides a verification that the container is ready to accept a query against the model.  This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/status` | Requested with GET.  Verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/swagger` | The container provides a full set of documentation for the endpoints and a **Try it out** feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |

:::image type="content" source="../../../../includes/media/cognitive-services-containers-api-documentation/container-webpage.png" alt-text="Container home page":::

[!INCLUDE [Diagnostic container](../../containers/includes/diagnostics-container.md)]

## Text translation code samples

### Translate text with swagger

#### English &leftrightarrow; German

Navigate to the swagger page: `http://localhost:5000/swagger/index.html`

1. Select **POST /translate**
1. Select **Try it out**
1. Enter the **From** parameter as `en`
1. Enter the **To** parameter as `de`
1. Enter the **api-version** parameter as `3.0`
1. Under **texts**, replace `string` with the following JSON

```json
  [
        {
            "text": "hello, how are you"
        }
  ]
```

Select **Execute**, the resulting translations are output in the **Response Body**. You should expect something similar to the following response:

```json
"translations": [
      {
          "text": "hallo, wie geht es dir",
          "to": "de"
      }
    ]
```

### Translate text with Python

```python
import requests, json

url = 'http://localhost:5000/translate?api-version=3.0&from=en&to=fr'
headers = { 'Content-Type': 'application/json' }
body = [{ 'text': 'Hello, how are you' }]

request = requests.post(url, headers=headers, json=body)
response = request.json()

print(json.dumps(
    response,
    sort_keys=True,
     indent=4,
     ensure_ascii=False,
     separators=(',', ': ')))
```

### Translate text with C#/.NET console app

Launch Visual Studio, and create a new console application. Edit the `*.csproj` file to add the `<LangVersion>7.1</LangVersion>` node—specifies C# 7.1. Add the [Newtoonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json/) NuGet package, version 11.0.2.

In the `Program.cs` replace all the existing code with the following script:

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
        const string TranslateApi = "/translate?api-version=3.0&from=en&to=de";

        static async Task Main(string[] args)
        {
            var textToTranslate = "Sunny day in Seattle";
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

## Summary

In this article, you learned concepts and workflows for downloading, installing, and running Translator container. Now you know:

* Translator provides Linux containers for Docker.
* Container images are downloaded from the container registry and run in Docker.
* You can use the REST API to call 'translate' operation in Translator container by specifying the container's host URI.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure AI containers](../../cognitive-services-container-support.md?context=%2fazure%2fcognitive-services%2ftranslator%2fcontext%2fcontext)
