---
title: Install and run Docker containers for Translator API
titleSuffix: Azure Cognitive Services
description: Use the Docker container for Translator API to translate text.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 04/28/2021
ms.author: lajanuar
keywords: on-premises, Docker, container, identify
---

# Install and run Translator containers (Preview)

  Containers package everything an application needs to run—dependencies, configurations, libraries, and other binaries—and to enable smooth and consistent deployment across any computing environment. The Translator container works in collaboration with  [Docker](/dotnet/architecture/microservices/container-docker-introduction/docker-defined),  an open-source platform for the development lifecycle of containerized applications, to enable you to run features of the Translator API in your own environment.

> [!NOTE]
 > Containers offer encapsulation, isolation, and portability in a predictable environment and can add a layer of security to your application. However, containers should only be considered one part of the overall program for securing your app. To learn more about container security, *see* our [**Container security**](/azure/security-center/container-security) documentation.
<!-- markdownlint-disable MD033 -->

The following Translator container is in gated preview:

|Container| Features|Available pricing tiers|Latest version|
|---|---|---|---|
|Text Translator| You provide an input sentence in a source language and Azure's pre-trained model translates that sentence into a chosen target language.|[Translator pricing](/pricing/details/cognitive-services/translator/)<ul><li> **S1**</li><li>**S2**</li> <li>**S3**</li> <li>**S3-HD**</li></ul>|v3.0|

> [!NOTE]
> The Translator container provides multi-language support for text translation. It does not provide support for transliteration, dictionaries, or language detection. **Language detection** container support is available in our[** Text Analytics containers**](text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=language#get-the-container-image-with-docker-pull)

## Prerequisites

To get started, you'll need an active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

You'll also need the following to use Translator containers:

| Required | Purpose |
|--|--|
| Familiarity with Docker | <ul><li>You should have a basic understanding of Docker concepts, like registries, repositories, containers, and container images, as well as knowledge of basic `docker`  [terminology and commands](/dotnet/architecture/microservices/container-docker-introduction/docker-terminology).</li></ul> |
| Docker Engine | <ul><li>You need the Docker Engine installed on a [host computer](#the-host-computer). Docker provides packages that configure the Docker environment on [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms). For a primer on Docker and container basics, see the [Docker overview](https://docs.docker.com/engine/docker-overview/).</li><li> Docker must be configured to allow the containers to connect with and send billing data to Azure. </li><li> On **Windows**, Docker must also be configured to support **Linux** containers.</li></ul> |
| Translator resource | <ul><li>An Azure [Translator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) resource and the associated API key and endpoint URI. Both values are required to start the container and can be found on the resource overview page.</li></ul>|
|||

|Optional|Purpose|
|---------|----------|
|Azure CLI (command-line interface) |<ul><li> The [Azure CLI](/cli/azure/install-azure-cli) enables you to use a set of online commands to create and manage Azure resources. It is available to install in Windows, macOS, and Linux environments and can be run in a Docker container and Azure Cloud Shell.</li></ul> |
|||

## Required elements

All Cognitive Services containers require three primary elements:

* **EULA accept setting**. An end-user license agreement (EULA) set with a value of `Eula=accept`.

* **Endpoint URL**. You can retrieve the URL value by navigating to the Translator resource _Keys and Endpoint_  and _Overview_ pages. On the `Overview` page, hover over  _Endpoint_, a `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon will appear. Copy and paste to a convenient location. 

:::image type="content" source="../containers/media/overview-endpoint-uri.png" alt-text="location of endpoint url on resource overview page":::

* **API key**. The API key is used to start the container, and is available on the Translator resource  `Keys and Endpoint` page. Navigate to the *Keys* page, and click on the `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon. You can also find Endpoint URL in this location as well.

:::image type="content" source="../containers/media/keys-copy-api-key.png" alt-text="API key page and location.":::

> [!IMPORTANT] Subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service. *See* [Azure Cognitive Services security](../cognitive-services-security.md) for ways to securely store and access your credentials.

## Host computer

To use containers, you'll need and x64-based computer with a Linux OS that runs Docker containers. It can be a computer on your premises or a Docker hosting service on Azure, such as [**Azure Kubernetes Service**](/azure/aks/intro-kubernetes), [**Azure Container Instances**](/azure/container-instances/container-instances-overview), or a [**Kubernetes cluster deployed to Azure Stack Hub**](/azure-stack/user/azure-stack-solution-template-kubernetes-deploy).

## Container requirements and recommendations

The following table describes the minimum and recommended specifications for Translator containers. At least 2 gigabytes (GB) of memory are required and each CPU must be at least 2.6 gigahertz (GHz) or faster. and memory, in gigabytes (GB), to allocate for each Translator. The following table describes the minimum and recommended allocation of resources for each Translator container.

| Container | Minimum |Recommended | Language Pair |
|-----------|---------|---------------|----------------------|
| Text Translator |2 core, 2-GB memory |4 core, 8-GB memory | 4 |
|||

For every language pair, it's recommended to have 2 GB of memory. By default, the Translator offline container has four language pairs. See [supported languages and translation](#supported-languages-and-translation) for the details. The core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

> [!NOTE]
> * CPU core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the docker run command.
>
> * The minimum and recommended specifications are based on Docker limits, not host machine resources.

## Request approval to the run the container

Fill out and submit the [**Azure Cognitive Services
Application for Gated Services**](https://aka.ms/csgate) to request access to the container. 

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

## Container images

Container images for Translator are available in the following container registry:

|Container|Repository|
|-----------|-----------|
|Text Translator| translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator|


> [!TIP]
> You can use the [**docker images**](https://docs.docker.com/engine/reference/commandline/images/) command to list your downloaded container images. For example, the following command lists the ID, repository, and tag of each downloaded container image, formatted as a table:
>
>```dockerfile
>  docker images --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"
>
>  IMAGE ID        REPOSITORY                                                                     TAG
>  d7324af7220f    translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator    en_ar_de_ru_zh_1.0.11
>  7ee233eec36c    translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator    en_es_fr_nl_pt_1.0.11
>  fd92f07b283c    translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator    en_fa_ja_ko_uk_1.0.11
>```

### Language support

The following table lists the language supported by each container image:

| Image Tag | Languages Supported |
|-----------|---------------------|
| `en_ar_de_ru_zh_1.0.11` |Arabic—Saudi Arabia (`ar-SA` ), German (`de-DE`), Russian (`ru-RU`), Chinese—PRC `zh-CN` |
| `en_es_fr_nl_pt_1.0.11` | Spanish—Spain (`es-ES`), French—Standard `fr-FR`, Dutch—Standard `nl-NL`, Portuguese—Brazil (`pt-BR`) |
| `en_fa_ja_ko_uk_1.0.11` |Farsi—Iran (`fa-IR`), Japanese (`ja-JP`), Korean (`ko-KR`), and (Ukrainian (`uk-UA)`|

### Text translation support

 The `POST /translate` method supports the following language conversions to and from *English*. </br>**NOTE**: while the process can translate from English to one of the languages listed, it *cannot*  process a translation from a *non-English* language to another *non-English* language.

> For optimal quality consumers should only send one sentence per request.

| Language Conversion | Language ISO Conversion | Image Tags |
|--|--|:--|
| English  &leftrightarrow; Arabic | `en-US`  &leftrightarrow; `ar-SA` | `en_ar_de_ru_zh_1.0.11` |
| English  &leftrightarrow; Chinese | `en-US`  &leftrightarrow; `zh-CN` | `en_ar_de_ru_zh_1.0.11` |
| English  &leftrightarrow; German | `en-US`  &leftrightarrow; `de-DE` | `en_ar_de_ru_zh_1.0.11` |
| English  &leftrightarrow; Russian | `en-US`  &leftrightarrow; `ru-RU` | `en_ar_de_ru_zh_1.0.11` |
| English  &leftrightarrow; French | `en-US`  &leftrightarrow; `fr-FR` | `en_es_fr_nl_pt_1.0.11` |
| English  &leftrightarrow; Dutch | `en-US`  &leftrightarrow; `nl-NL` | `en_es_fr_nl_pt_1.0.11` |
| English  &leftrightarrow; Portuguese (Brazil) | `en-US`  &leftrightarrow; `pt-BR` | `en_es_fr_nl_pt_1.0.11` |
| English  &leftrightarrow; Spanish | `en-US`  &leftrightarrow; `es-ES` | `en_es_fr_nl_pt_1.0.11` |
| English  &leftrightarrow; Japanese | `en-US`  &leftrightarrow; `ja-JP` | `en_fa_ja_ko_uk_1.0.11` |
| English  &leftrightarrow; Korean | `en-US`  &leftrightarrow; `ja-JP` | `en_fa_ja_ko_uk_1.0.11` |
| English  &leftrightarrow; Persian | `en-US`  &leftrightarrow; `ja-JP` | `en_fa_ja_ko_uk_1.0.11` |
| English  &leftrightarrow; Ukranian | `en-US`  &leftrightarrow; `ja-JP` | `en_fa_ja_ko_uk_1.0.11` |

## Get container images with **docker  pull**

* To perform the [**docker pull**](https://docs.docker.com/engine/reference/commandline/pull/) command, you first need to access the container registry. From the Azure CLI, you can log in to the Azure Container Registry using the following command:

```azurecli
 [az acr login](https://docs.microsoft.com/cli/azure/acr?view=azure-cli-latest#az-acr-login) 
```

* Next, authenticate your current user name with the corresponding Azure Container Registry

```azurecli
az acr login --name translatorcontainerpreview
```

* Now, you're free to execute the `docker pull` command.

* Depending on the language support you need, provide the corresponding `<image-tag>`.

```dockerfile
docker pull translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator:<image-tag>
```

## Use the container

Once the container is on your [host computer](#host-computer), use the following process to work with the container.

1. [**Run the container with docker run**](#run-the-container-with-docker-run).
1. [**Query the container's Translator endpoint**](#query-the-containers-translator-endpoint).
1. [**Stop the container**](#stop-the-container)

### Run the container with **docker run**

> [!IMPORTANT]
>
> * The docker commands in the following sections use the back slash, `\`, as a line continuation character. Replace or remove this based on your host operating system's requirements. 
> * The `EULA`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start.  For more information, see [Billing](#billing).

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the containers. The container will continue to run until you stop it.

```dockerfile
docker run --rm -it -p 5000:5000 --memory 8g --cpus 4 \
translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator:en_ar_de_ru_zh_1.0.11 \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

The above command:

* Runs a Translator offline container from the container image.
* Allocates eight gigabytes (GB) of memory and four CPU core.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container
* Accepts the end-user agreement (EULA)
* Automatically removes the container after it exits. The container image is still available on the host computer.

### Run multiple containers on the same host

If you intend to run multiple containers with exposed ports, make sure to run each container with a different exposed port. For example, run the first container on port 5000 and the second container on port 5001.

You can have this container and a different Azure Cognitive Services container running on the HOST together. You also can have multiple containers of the same Cognitive Services container running.

## Query the container's Translator endpoint

 The container provides a REST-based Translator endpoint API. Here is an example request:

```curl
curl -X POST "http://localhost:5000/translate?api-version=3.0&from=en-US&to=zh-CN"
    -H "Content-Type: application/json" -d "[{'Text':'Hello, what is your name?'}]"
```

> [!NOTE]
> If you attempt the cURL POST request before the container is ready, you'll end up getting a *Service is temporarily unavailable* response. Wait until the container is ready, then try again.

## Stop the container

[!INCLUDE [How to stop the container](../../../includes/cognitive-services-containers-stop.md)]

## Troubleshoot

### Validate that a container is running

There are several ways to validate that the container is running:

* The container provides a homepage at `\` as a visual validation that the container is running.

 * You can open your favorite web browser and navigate to the external IP address and exposed port of the container in question. Use the various request URLs below to validate the container is running. The example request URLs listed below are `http://localhost:5000`, but your specific container may vary. Keep in mind that you're  navigating to your container's **External IP address** and exposed port.

| Request URL | Purpose |
|--|--|
| `http://localhost:5000/` | The container provides a home page. |
| `http://localhost:5000/ready` | Requested with GET. Provides a verification that the container is ready to accept a query against the model.  This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/status` | Requested with GET.  Verifies if the api-key used to start the container is valid without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/). |
| `http://localhost:5000/swagger` | The container provides a full set of documentation for the endpoints and a **Try it out** feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |

:::image type="content" source="../../../includes/media/cognitive-services-containers-api-documentation/container-webpage.png" alt-text="Container home page":::

### View your container's logs

  If you're having trouble during the docker run process, it may be useful to view the **docker logs** from the container's execution. First, execute the `docker ps` command with the formatting flag to limit the details displayed for all the containers.

```dockerfile
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Status}}"

CONTAINER ID        IMAGE                                                                      STATUS
d7324af7220f        translatorcontainerpreview.azurecr.io/cognitive-services-offline-translator   Up 4 minutes
```

Then, run the `docker logs` command with the <Container ID> for the corresponding container in question to view its logs. The following command will collect Error logs for the last four hours.

```dockerfile
docker logs <Container ID> --timestamps --since=4h | grep Error
```

## Billing

The Text Analytics containers send billing information to Azure, using a _Translator_ resource on your Azure account. 

[!INCLUDE [Container's Billing Settings](../../../includes/cognitive-services-containers-how-to-billing-info.md)]

For more information about these options, see [Configure containers](../translator-container-configuration.md).

## Text translation code samples

### Translate text with swagger

#### English &leftrightarrow; German

Navigate to the swagger page: <http://localhost:5000/swagger/index.html>

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

1. Select **Execute**, the resulting translations are output in the **Response Body**. You should expect something similar to the following response:

```json
"translations": [
      {
          "text": "hallo, wie geht es dir",
          "to": "de-DE"
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

In the `Program.cs` replace all the existing code with the following:

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

In this article, you learned concepts and workflows for downloading, installing, and running Translator offline containers. Now you know:

* Translator provides Linux containers for Docker that support 12 language pairs.
* Container images are downloaded from the Container Preview Registry.
* Container images run in Docker.
* You can use either the REST API or SDK to call operations in Translator offline containers by specifying the container's host URI.

## Next steps

> [!div class="nextstepaction"]
> [Learn to ](code-in-docs.md)

* Review [configure containers](speech-container-configuration.md) for configuration settings
