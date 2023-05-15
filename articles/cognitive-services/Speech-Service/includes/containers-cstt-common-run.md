---
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/18/2023
ms.author: eur
---

The following table represents the various `docker run` parameters and their corresponding descriptions:

| Parameter | Description |
|---------|---------|
| `{VOLUME_MOUNT}` | The host computer [volume mount](https://docs.docker.com/storage/volumes/), which Docker uses to persist the custom model. An example is `c:\CustomSpeech` where the `c:\` drive is located on the host machine. |
| `{MODEL_ID}` | The custom speech or base model ID. For more information, see [Get the model ID](#get-the-model-id). |
| `{ENDPOINT_URI}` | The endpoint is required for metering and billing. For more information, see [billing arguments](../speech-container-howto.md#billing-arguments). |
| `{API_KEY}` | The API key is required. For more information, see [billing arguments](../speech-container-howto.md#billing-arguments). |

When you run the custom speech to text container, configure the port, memory, and CPU according to the custom speech to text container [requirements and recommendations](../speech-container-howto.md#container-requirements-and-recommendations).

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

* Runs a custom speech to text container from the container image.
* Allocates 4 CPU cores and 8 GB of memory.
* Loads the custom speech to text model from the volume input mount, for example, *C:\CustomSpeech*.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Downloads the model given the `ModelId` (if not found on the volume mount).
* If the custom model was previously downloaded, the `ModelId` is ignored.
* Automatically removes the container after it exits. The container image is still available on the host computer.

For more information about `docker run` with Speech containers, see [Install and run Speech containers with Docker](../speech-container-howto.md#run-the-container).
