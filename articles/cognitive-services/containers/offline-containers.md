---
title: Use Docker containers in disconnected environments
titleSuffix: Learn how to run Cognitive Services Docker containers disconnected from the internet
description: Use Azure Cognitive Services in 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 09/17/2021
ms.author: aahi
---

# Use Docker containers in disconnected environments

Containers enable you to run Cognitive Services APIs in your own environment, and are great for your specific security and data governance requirements. Disconnected containers enable you to use several of these APIs completely disconnected from the internet. Currently, the following containers can be run in this manner:
* Speech containers
* Text Analytics containers
* TBD 


## Request access to use containers in disconnected environments

> [!IMPORTANT]
> * On the form, you must use an email address associated with an Azure subscription ID.
> * The Azure resource (billing endpoint and apikey) you use to run the container must have been created with the approved Azure subscription ID. 
> * Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

Fill out and submit the [Cognitive Services request form](https://aka.ms/csgate) to request access to use containers disconnected from the internet.

The form requests information about you, your company, and the user scenario for which you'll use the container. After you've submitted the form, the Azure Cognitive Services team reviews it to ensure that you meet the criteria for usage.

## Sign up for commitment tiers

To use a container in a disconnected environment, you will need to sign up for a pricing plan that offers a set amount of service for a specified amount of time. To sign up for a commitment tier:

1. Sign on to the [Azure portal](https://portal.azure.com/).
2. TBD 
3. TBD

## Use `docker run` to download the license file

> [!TIP]
> Make sure you know the requirements for your host computer, and the `docker pull` command for the docker container you want to use. See the following articles for more information
> * [Speech containers](../speech-service/speech-container-howto.md) 
> * [Text Analytics containers](../text-analytics/how-tos/text-analytics-how-to-install-containers.md)
> * TBD

After you've signed up for a commitment tier, you'll be able to download a license file using a `docker run` command. This file will let you run the container offline.

The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| `{LICENSE_LOCATION}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |

```bash
docker run -v {LICENSE_MOUNT} {IMAGE} \
eula=accept billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License=/path/to/license/directory
```

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with the `LicenseFolderKey` parameter 

```bash
docker run -v <license-mount> <image> \
eula=accept \
billing=<> \
apikey=<> \
Mounts:License=/path/to/license/directory
```

## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

[!INCLUDE [Cognitive Services FAQ note](../containers/includes/cognitive-services-faq-note.md)]

## Next steps

* link 1
* link 2
