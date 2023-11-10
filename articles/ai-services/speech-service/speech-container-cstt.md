---
title: Custom speech to text containers - Speech service
titleSuffix: Azure AI services
description: Install and run custom speech to text containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.custom: devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 08/29/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-sdk-cli
keywords: on-premises, Docker, container
---

# Custom speech to text containers with Docker

The Custom speech to text container transcribes real-time speech or batch audio recordings with intermediate results. You can use a custom model that you created in the [Custom Speech portal](https://speech.microsoft.com/customspeech). In this article, you'll learn how to download, install, and run a Custom speech to text container.

For more information about prerequisites, validating that a container is running, running multiple containers on the same host, and running disconnected containers, see [Install and run Speech containers with Docker](speech-container-howto.md).

## Container images

The Custom speech to text container image for all supported versions and locales can be found on the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/custom-speech-to-text/tags) syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-speech-to-text`. 

:::image type="content" source="./media/containers/mcr-tags-custom-speech-to-text.png" alt-text="A screenshot of the search connectors and triggers dialog." lightbox="./media/containers/mcr-tags-custom-speech-to-text.png":::

The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text`. Either append a specific version or append `:latest` to get the most recent version.

| Version | Path |
|-----------|------------|
| Latest | `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:latest` |
| 3.12.0 | `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:3.12.0-amd64` |

All tags, except for `latest`, are in the following format and are case sensitive:

```
<major>.<minor>.<patch>-<platform>-<prerelease>
```

> [!NOTE]
> The `locale` and `voice` for custom speech to text containers is determined by the custom model ingested by the container.

The tags are also available [in JSON format](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/custom-speech-to-text/tags/list) for your convenience. The body includes the container path and list of tags. The tags aren't sorted by version, but `"latest"` is always included at the end of the list as shown in this snippet:

```json
{
  "name": "azure-cognitive-services/speechservices/custom-speech-to-text",
  "tags": [
    "2.10.0-amd64",
    "2.11.0-amd64",
    "2.12.0-amd64",
    "2.12.1-amd64",
    <--redacted for brevity-->
    "latest"
  ]
}
```

### Get the container image with docker pull

You need the [prerequisites](speech-container-howto.md#prerequisites) including required hardware. Please also see the [recommended allocation of resources](speech-container-howto.md#container-requirements-and-recommendations) for each Speech container. 

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:latest
```

> [!NOTE]
> The `locale` and `voice` for custom Speech containers is determined by the custom model ingested by the container.

## Get the model ID

Before you can [run](#run-the-container-with-docker-run) the container, you need to know the model ID of your custom model or a base model ID. When you run the container you specify one of the model IDs to download and use. 

# [Custom model ID](#tab/custom-model)

The custom model has to have been [trained](how-to-custom-speech-train-model.md) by using the [Speech Studio](https://aka.ms/speechstudio/customspeech). For information about how to get the model ID, see [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md).

![Screenshot that shows the Custom Speech training page.](media/custom-speech/custom-speech-model-training.png)

Obtain the **Model ID** to use as the argument to the `ModelId` parameter of the `docker run` command.

![Screenshot that shows Custom Speech model details.](media/custom-speech/custom-speech-model-details.png)


# [Base model ID](#tab/base-model)

You can get the available base model information by using option `BaseModelLocale={LOCALE}`. This option gives you a list of available base models on that locale under your billing account. 

To get base model IDs, you use the `docker run` command. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
BaseModelLocale={LOCALE} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command checks the container image and returns the available base models of the target locale.

> [!NOTE]
> Although you use the `docker run` command, the container isn't started for service.

The output gives you a list of base models with the information locale, model ID, and creation date time. For example:

```
Checking available base model for en-us
2020/10/30 21:54:20 [Info] Searching available base models for en-us
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2016-11-04T08:23:42Z, Id: a3d8aab9-6f36-44cd-9904-b37389ce2bfa
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2016-11-04T12:01:02Z, Id: cc7826ac-5355-471d-9bc6-a54673d06e45
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2017-08-17T12:00:00Z, Id: a1f8db59-40ff-4f0e-b011-37629c3a1a53
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-04-16T11:55:00Z, Id: c7a69da3-27de-4a4b-ab75-b6716f6321e5
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-09-21T15:18:43Z, Id: da494a53-0dad-4158-b15f-8f9daca7a412
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-10-19T11:28:54Z, Id: 84ec130b-d047-44bf-a46d-58c1ac292ca7
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-11-26T07:59:09Z, Id: ee5c100f-152f-4ae5-9e9d-014af3c01c56
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2018-11-26T09:21:55Z, Id: d04959a6-71da-4913-9997-836793e3c115
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-01-11T10:04:19Z, Id: 488e5f23-8bc5-46f8-9ad8-ea9a49a8efda
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-02-18T14:37:57Z, Id: 0207b3e6-92a8-4363-8c0e-361114cdd719
2020/10/30 21:54:21 [Info] [Base model] Locale: en-us, CreatedDate: 2019-03-03T17:34:10Z, Id: 198d9b79-2950-4609-b6ec-f52254074a05
2020/10/30 21:54:21 [Fatal] Please run this tool again and assign --modelId '<one above base model id>'. If no model id listed above, it means currently there is no available base model for en-us
```

---

## Display model download

Before you [run](#run-the-container-with-docker-run) the container, you can optionally get the available display models information and choose to download those models into your speech to text container to get highly improved final display output. Display model download is available with custom-speech-to-text container version 3.1.0 and later.

> [!NOTE]
> Although you use the `docker run` command, the container isn't started for service.

You can query or download any or all of these display model types: Rescoring (`Rescore`), Punctuation (`Punct`), resegmentation (`Resegment`), and wfstitn (`Wfstitn`). Otherwise, you can use the `FullDisplay` option (with or without the other types) to query or download all types of display models. 

Set the `BaseModelLocale` to query the latest available display model on the target locale. If you include multiple display model types, the command will return the latest available display models for each type. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
Punct Rescore Resegment Wfstitn \   # Specify `FullDisplay` or a space-separated subset of display models
BaseModelLocale={LOCALE} \           
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Set the `DisplayLocale` to download the latest available display model on the target locale. When you set `DisplayLocale`, you must also specify `FullDisplay` or a space-separated subset of display models. The command will download the latest available display model for each specified type. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
Punct Rescore Resegment Wfstitn \   # Specify `FullDisplay` or a space-separated subset of display models
DisplayLocale={LOCALE} \           
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

Set one model ID parameter to download a specific display model: Rescoring (`RescoreId`), Punctuation (`PunctId`), resegmentation (`ResegmentId`), or wfstitn (`WfstitnId`). This is similar to how you would download a base model via the `ModelId` parameter. For example, to download a rescoring display model, you can use the following command with the `RescoreId` parameter:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
RescoreId={RESCORE_MODEL_ID} \         
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

> [!NOTE]
> If you set more than one query or download parameter, the command will prioritize in this order: `BaseModelLocale`, model ID, and then `DisplayLocale` (only applicable for display models).

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container for service. 

# [Custom speech to text](#tab/container)

[!INCLUDE [Custom speech container run](includes/containers-cstt-common-run.md)]

# [Disconnected custom speech to text](#tab/disconnected)

To run disconnected containers (not connected to the internet), you must submit [this request form](https://aka.ms/csdisconnectedcontainers) and wait for approval. For more information about applying and purchasing a commitment plan to use containers in disconnected environments, see [Use containers in disconnected environments](../containers/disconnected-containers.md) in the Azure AI services documentation.

If you have been approved to run the container disconnected from the internet, the following example shows the formatting of the `docker run` command to use, with placeholder values. Replace these placeholder values with your own values.

In order to prepare and configure a disconnected custom speech to text container you will need two separate speech resources:

- A regular Azure AI Speech resource which is either configured to use a "**S0 - Standard**" pricing tier or a "**Speech to Text (Custom)**" commitment tier pricing plan. This is used to train, download, and configure your custom speech models for use in your container.
- An Azure AI Speech resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan. This is used to download your disconnected container license file required to run the container in disconnected mode.

Follow these steps to download and run the container in disconnected environments. 
1. [Download a model for the disconnected container](#download-a-model-for-the-disconnected-container). For this step, use a regular Azure AI Speech resource which is either configured to use a "**S0 - Standard**" pricing tier or a "**Speech to Text (Custom)**" commitment tier pricing plan.
1. [Download the disconnected container license](#download-the-disconnected-container-license). For this step, use an Azure AI Speech resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan.
1. [Run the disconnected container for service](#run-the-disconnected-container). For this step, use an Azure AI Speech resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan.

### Download a model for the disconnected container

For this step, use a regular Azure AI Speech resource which is either configured to use a "**S0 - Standard**" pricing tier or a "**Speech to Text (Custom)**" commitment tier pricing plan.

[!INCLUDE [Custom speech container run](includes/containers-cstt-common-run.md)]

### Download the disconnected container license

Next, you download your disconnected license file. The `DownloadLicense=True` parameter in your `docker run` command will download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container. 

You can only use a license file with the appropriate container and model that you've been approved for. For example, you can't use a license file for a `speech-to-text` container with a `neural-text-to-speech` container.

| Placeholder | Description | 
|-------------|-------|
| `{IMAGE}` | The container image you want to use.<br/><br/>For example: `mcr.microsoft.com/azure-cognitive-services/custom-speech-to-text:latest` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.<br/><br/>For example: `/host/license:/path/to/license/directory` |
| `{MODEL_PATH}` | The path where the model is located.<br/><br/>For example: `/host/models:/usr/local/models` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal.<br/><br/>For example: `https://<your-resource-name>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Speech resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.<br/><br/>For example: `/path/to/license/directory` |

For this step, use an Azure AI Speech resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan.

```bash
docker run --rm -it -p 5000:5000 \ 
-v {LICENSE_MOUNT} \
-v {MODEL_PATH} \
{IMAGE} \
eula=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License={CONTAINER_LICENSE_DIRECTORY} 
```

### Run the disconnected container

Once the license file has been downloaded, you can run the container in a disconnected environment. The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. An output mount must also be specified so that billing usage records can be written.

| Placeholder | Description | 
|-------------|-------|
| `{IMAGE}` | The container image you want to use.<br/><br/>For example: `mcr.microsoft.com/azure-cognitive-services/custom-speech-to-text:latest` |
| `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container.<br/><br/>For example: `4g` |
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container.<br/><br/>For example: `4` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.<br/><br/>For example: `/host/license:/path/to/license/directory` |
| `{MODEL_PATH}` | The path where the model is located.<br/><br/>For example: `/host/models:/usr/local/models` |
| `{OUTPUT_PATH}` | The output path for logging.<br/><br/>For example: `/host/output:/path/to/output/directory`<br/><br/>For more information, see [usage records](../containers/disconnected-containers.md#usage-records) in the Azure AI services documentation. |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal.<br/><br/>For example: `https://<your-resource-name>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Speech resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.<br/><br/>For example: `/path/to/license/directory` |
| `{CONTAINER_OUTPUT_DIRECTORY}` | Location of the output folder on the container's local filesystem.<br/><br/>For example: `/path/to/output/directory` |

For this step, use an Azure AI Speech resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan.

```bash
docker run --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \ 
-v {LICENSE_MOUNT} \ 
-v {OUTPUT_PATH} \
-v {MODEL_PATH} \
{IMAGE} \
eula=accept \
Mounts:License={CONTAINER_LICENSE_DIRECTORY}
Mounts:Output={CONTAINER_OUTPUT_DIRECTORY}
```

The Custom Speech to text container provides a default directory for writing the license file and billing log at runtime. The default directories are /license and /output respectively. 

When you're mounting these directories to the container with the `docker run -v` command, make sure the local machine directory is set ownership to `user:group nonroot:nonroot` before running the container.

Below is a sample command to set file/directory ownership.

```bash
sudo chown -R nonroot:nonroot <YOUR_LOCAL_MACHINE_PATH_1> <YOUR_LOCAL_MACHINE_PATH_2> ...
```

---


## Use the container

[!INCLUDE [Speech container authentication](includes/containers-speech-config-ws.md)]

[Try the speech to text quickstart](get-started-speech-to-text.md) using host authentication instead of key and region.

## Next steps

* See the [Speech containers overview](speech-container-overview.md)
* Review [configure containers](speech-container-configuration.md) for configuration settings
* Use more [Azure AI containers](../cognitive-services-container-support.md)
