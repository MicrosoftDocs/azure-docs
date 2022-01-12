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

* [Speech to Text (Standard)](../speech-service/speech-container-howto.md?tabs=stt)
* [Text to Speech (Neural)](../speech-service/speech-container-howto.md?tabs=ntts)
* Azure Cognitive Service for Language
    * [Sentiment Analysis](../language-service/sentiment-opinion-mining/how-to/use-containers.md)
    * [Key Phrase Extraction](../language-service/key-phrase-extraction/how-to/use-containers.md)
    * [Language Detection](../language-service/language-detection/how-to/use-containers.md)
* [Computer Vision - Read](../computer-vision/computer-vision-how-to-install-containers.md)

Disconnected container usage is also available for the following Applied AI service:
* [Form Recognizer – Custom/Invoice](../../applied-ai-services/form-recognizer/containers/form-recognizer-container-install-run.md)

Before attempting to run a Docker container in an offline environment, make sure you know the steps to successfully download and use the container. For example:
* Host computer requirements and recommendations.
* The Docker `pull` command you will use to download the container.
* How to validate that a container is running.
* How to send queries to the container's endpoint, once it's running.

## Request access to use containers in disconnected environments

Fill out and submit the [request form](https://aka.ms/csdisconnectedcontainers) to request access to the containers disconnected from the internet.

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]


## Purchase a commitment plan to use containers in disconnected environments

### Create a new resource

1. Sign into the [Azure portal](https://portal.azure.com/) and select **Create a new resource** for one of the applicable Cognitive Services or Applied AI services listed above. 

2. Enter the applicable information to create your resource. Be sure to select **Commitment tier disconnected containers** as your pricing tier.

    :::image type="content" source="media/offline-container-signup.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/offline-container-signup.png":::

3. Select **Review + Create** at the bottom of the page. Review the information, and select **Create**. 

## Download a Docker container with `docker pull`

After you have a license file, download the Docker container you have approval to run in a disconnected environment. For example:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice:latest
```

## Configure the container to be run in a disconnected environment

Now that you've downloaded your container, you will need to run the container with the `DownloadLicense=True` parameter in your `docker run` command. This parameter will download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container.

> [!IMPORTANT]
> * When you run the container with `DownloadLicense=True`, your environment must be connected to the internet, and you must provide a valid key and endpoint. Once your container has been configured, it can be run disconnected from the internet, and without your key and endpoint. 
> * You can only use a license file with the appropriate container that you've been approved for. For example, you cannot use a license file for a speech-to-text container with a form recognizer container. 
> * If your container requires additional encrypted models, they should be downloaded by running the container with the `DownloadModel=True` flag.

The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
| `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `4g` | 
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|

```bash
docker run {IMAGE} --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \ 
-v {LICENSE_MOUNT} \
eula=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License={LICENSE_MOUNT} \ 
```

## Run the container in a disconnected environment

Once the license file has been downloaded, you can run the container in a disconnected environment. The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values. 

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. An output mount must also be specified so that billing usage records can be written.

 Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
 `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `4g` | 
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/path/to/license/directory` |
| `{OUTPUT_PATH}` | The output path for logging [usage records](#usage-records). | `/path/to/output/directory` |

```bash
docker run {IMAGE} --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \ 
-v {LICENSE_MOUNT} \ 
-v /host/output:{OUTPUT_PATH} \
eula=accept \
Mounts:License={LICENSE_MOUNT}
Mounts:Output={OUTPUT_PATH}
```

## Usage records

when operating Docker containers in a disconnected environment, the container will write usage records to a volume where they are collected over time. You can also call a REST endpoint to generate a report about service usage.

### Arguments for storing logs

When run in a disconnected environment, an output mount must be available to the container to store usage logs. For example, you would include `-v /host/output:{OUTPUT_PATH}` and `Mounts:Output={OUTPUT_PATH}` in the example below, replacing `{OUTPUT_PATH}` with the path where the logs will be stored:

```Docker
docker run -v /host/output:{OUTPUT_PATH} ... <image> ... Mounts:Output={OUTPUT_PATH}
```

### Get records using the container endpoints

The container provides two endpoints for returning records about its usage.

#### Get all records 

The following endpoint will provide a report summarizing all of the usage collected in the mounted billing record directory.

```http
https://<service>/records/usage-logs/
```

It will return JSON similar to the example below. 

```json
{
  "apiType": "noop",
  "serviceName": "noop",
  "meters": [
    {
      "name": "Sample.Meter",
      "quantity": 253
    }
  ]
}
```
#### Get records for a specific month

The following endpoint will provide a report summarizing usage over a specific month and year.

```HTTP
https://<service>/records/usage-logs/{MONTH}/{YEAR}
```

it will return a JSON response similar to the example below:

```json
{
  "apiType": "string",
  "serviceName": "string",
  "meters": [
    {
      "name": "string",
      "quantity": 253
    }
  ]
}
```
## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](disconnected-container-faq.yml).
## Next steps

[Azure Cognitive Services containers overview](../cognitive-services-container-support.md)