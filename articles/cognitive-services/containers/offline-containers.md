---
title: Use Docker containers in disconnected environments
titleSuffix: Learn how to run Cognitive Services Docker containers disconnected from the internet
description: Use Azure Cognitive Services in 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 01/04/2022
ms.author: aahi
---

# Use Docker containers in disconnected environments

Containers enable you to run Cognitive Services APIs in your own environment, and are great for your specific security and data governance requirements. Disconnected containers enable you to use several of these APIs completely disconnected from the internet. Currently, the following containers can be run in this manner:

* Speech to Text (Standard)
* Text to Speech (Neural)
* Language Understanding standard (Text Requests)
* Azure Cognitive Service for Language
    * Sentiment Analysis
    * Key Phrase Extraction
    * Language Detection
* Computer Vision - Read

Commitment tier pricing is also available for the following Applied AI service container:
* Form Recognizer – Custom/Invoice


## Request access to use containers in disconnected environments

Fill out and submit the [request form](https://aka.ms/csgate) to request access to the containers disconnected from the internet.

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]


## Purchase a commitment plan to use containers in disconnected environments

To use a container in a disconnected environment, you will need to sign up for a pricing plan that allows you to run select containers in disconnected environments, for a specified amount of time. See [Quickstart: Purchase commitment tier pricing](../commitment-tier.md) for more information.

> [!CAUTION]
> When purchasing a commitment plan, make sure you're purchasing a plan for disconnected containers.

## Familiarize yourself with the Docker container you want to run

Before running a Docker container in a disconnected environment, make sure you know the steps to successfully download and use the container. For example:
* The host computer requirements and recommendations.
* The Docker `pull` command you will use to download the container.
* Validate that a container is running.
* Send queries to the container's endpoint, once it's running.

See the following articles for more information
* [Speech to Text container (Standard)](../speech-service/speech-container-howto.md?tabs=stt)
* [Text to Speech container (Neural)](../speech-service/speech-container-howto.md?tabs=ntts)
* [Language Understanding standard container (Text Requests)](../luis/luis-container-howto.md)
* Azure Cognitive Service for Language
    * [Sentiment Analysis container](../language-service/sentiment-opinion-mining/how-to/use-containers.md)
    * [Key Phrase Extraction container](../language-service/key-phrase-extraction/how-to/use-containers.md)
    * [Language Detection container](../language-service/language-detection/how-to/use-containers.md)
* [Computer Vision - Read container](../computer-vision/computer-vision-how-to-install-containers.md)
* [Form Recognizer – Custom/Invoice container](../../applied-ai-services/form-recognizer/containers/form-recognizer-container-install-run.md)

## Download a license file 

After you have been approved and purchased a commitment plan for disconnected containers, you will need to download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container.

 To get your license file:

1. Log in to the [Azure portal](https://portal.azure.com/), and navigate to the Azure resource you purchased a commitment plan for. Make sure **Overview** is selected in the left navigation menu.
1. Under **Activate the container(s) with the licensing file**, download the file shown. 
1. The license file will be named `license.dat`. Place this file in a memorable location on your computer.

## Download a Docker container with `docker pull`

After you have a license file, download the Docker container you have approval to run in a disconnected environment. For example:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:latest
```

> [!IMPORTANT]
> You can only use a license file with the appropriate container that you've been approved for. For example, you cannot use a license file for a speech-to-text container with a form recognizer container. 

## Configure the container to be run in a disconnected environment.

Now that you've downloaded a container and license file, you can run the container in a disconnected environment. 
The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `4g` | 
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_LOCATION}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |

```bash
docker run -v {LICENSE_MOUNT}  --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus 4 \ 
{IMAGE} \
eula=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License={LICENSE_LOCATION}
```

> [!TIP]
> If your container requires additional encrypted models, they should be downloaded by running the container with the `DownloadModel=True` flag.

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with the `LicenseFolderKey` parameter 

```bash
docker run -v {LICENSE_MOUNT} {IMAGE} \
eula=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
Mounts:License={LICENSE_LOCATION}
```

## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

## Next steps

[Azure Cognitive Services containers overview](../cognitive-services-container-support.md)