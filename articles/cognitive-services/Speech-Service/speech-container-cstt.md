---
title: Custom speech-to-text containers - Speech service
titleSuffix: Azure Cognitive Services
description: Install and run custom speech-to-text containers with Docker to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/06/2023
ms.author: eur
zone_pivot_groups: programming-languages-speech-services
keywords: on-premises, Docker, container
---

# Custom speech-to-text containers with Docker

The Custom speech-to-text container transcribes real-time speech or batch audio recordings with intermediate results. You can use a custom model that you created in the [Custom Speech portal](https://speech.microsoft.com/customspeech). In this article, you'll learn how to download, install, and run a Custom speech-to-text container.

> [!NOTE]
> You must [request and get approval](speech-container-overview.md#request-approval-to-run-the-container) to use a Speech container. 

For more information about prerequisites, validating that a container is running, running multiple containers on the same host, and running disconnected containers, see [Install and run Speech containers with Docker](speech-container-howto.md).

## Container images

The Custom speech-to-text container image for all supported versions and locales can be found on the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/custom-speech-to-text/tags) syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-speech-to-text`. 

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
> The `locale` and `voice` for custom speech-to-text containers is determined by the custom model ingested by the container.

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

You need the [prerequisites](speech-container-howto.md#prerequisites).

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text:latest
```

> [!NOTE]
> The `locale` and `voice` for custom Speech containers is determined by the custom model ingested by the container.


## Get the custom model ID

The custom speech-to-text container relies on a Custom Speech model. The custom model has to have been [trained](how-to-custom-speech-train-model.md) by using the [Speech Studio](https://aka.ms/speechstudio/customspeech).

The custom speech **Model ID** is required to run the container. For more information about how to get the model ID, see [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md).

![Screenshot that shows the Custom Speech training page.](media/custom-speech/custom-speech-model-training.png)

Obtain the **Model ID** to use as the argument to the `ModelId` parameter of the `docker run` command.

![Screenshot that shows Custom Speech model details.](media/custom-speech/custom-speech-model-details.png)

## Run the container with docker run

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. 

The following table represents the various `docker run` parameters and their corresponding descriptions:

| Parameter | Description |
|---------|---------|
| `{VOLUME_MOUNT}` | The host computer [volume mount](https://docs.docker.com/storage/volumes/), which Docker uses to persist the custom model. An example is `c:\CustomSpeech` where the `c:\` drive is located on the host machine. |
| `{MODEL_ID}` | The custom speech model ID. For more information, see [Get the custom model ID](#get-the-custom-model-id). |
| `{ENDPOINT_URI}` | The endpoint is required for metering and billing. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |
| `{API_KEY}` | The API key is required. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). |

When you run the custom speech-to-text container, configure the port, memory, and CPU according to the custom speech-to-text container [requirements and recommendations](speech-container-howto.md#container-requirements-and-recommendations).

Here's an example `docker run` command with placeholder values. You must specify the `VOLUME_MOUNT`, `MODEL_ID`, `ENDPOINT_URI`, and `API_KEY` values:

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 4 \
-v {VOLUME_MOUNT}:/usr/local/models \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
ModelId={MODEL_ID} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a custom speech-to-text container from the container image.
* Allocates 4 CPU cores and 8 GB of memory.
* Loads the custom speech-to-text model from the volume input mount, for example, *C:\CustomSpeech*.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Downloads the model given the `ModelId` (if not found on the volume mount).
* If the custom model was previously downloaded, the `ModelId` is ignored.
* Automatically removes the container after it exits. The container image is still available on the host computer.

### Base model download on the custom speech-to-text container

You can get the available base model information by using option `BaseModelLocale={LOCALE}`. This option gives you a list of available base models on that locale under your billing account. For example:

```bash
docker run --rm -it \
mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text \
BaseModelLocale={LOCALE} \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a custom speech-to-text container from the container image.
* Checks and returns the available base models of the target locale.

The output gives you a list of base models with the information locale, model ID, and creation date time. You can use the model ID to download and use the specific base model you prefer. For example:
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

### Display model download on the custom speech-to-text container

You can get the available display models information and choose to download those models into your speech-to-text container to get highly improved final display output. 

> [!NOTE] 
> Display model download is available with custom-speech-to-text container version 3.1.0 and later.

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

#### Custom pronunciation on the custom speech-to-text container

You can get custom pronunciation results in the output. All you need to do is have your own custom pronunciation rules set up in your custom model and mount the model to a custom-speech-to-text container.




## Use the container


### Host authentication

[!INCLUDE [Speech container authentication](includes/container-speech-config.md)]



## Next steps

* Review [configure containers](speech-container-configuration.md) for configuration settings.
* Learn how to [use Speech service containers with Kubernetes and Helm](speech-container-howto-on-premises.md).
* Use more [Cognitive Services containers](../cognitive-services-container-support.md).


