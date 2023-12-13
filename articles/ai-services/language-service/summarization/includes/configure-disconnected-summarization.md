---
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 10/05/2023
ms.author: jboback
---

To use this container disconnected from the internet, you must first request access by filling out an application, and purchasing a commitment plan. See [Use Docker containers in disconnected environments](../../../containers/disconnected-containers.md) for more information.

If you have been approved to run the container disconnected from the internet, use the following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

The `DownloadLicense=True` parameter in your `docker run` command will download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container. You can only use a license file with the appropriate container that you've been approved for. For example, you can't use a license file for a speech to text container with a Language services container.

## Download the summarization disconnected container models

A pre-requisite for running the summarization container is to download the models first. This can be done by running one of the following commands using a CPU container image as an example:

```bash
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=ExtractiveSummarization billing={ENDPOINT_URI} apikey={API_KEY}
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=AbstractiveSummarization billing={ENDPOINT_URI} apikey={API_KEY}
docker run -v {HOST_MODELS_PATH}:/models mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu downloadModels=ConversationSummarization billing={ENDPOINT_URI} apikey={API_KEY}
```
It's not recommended to download models for all skills inside the same `HOST_MODELS_PATH`, as the container loads all models inside the `HOST_MODELS_PATH`. Doing so would use a large amount of memory. It's recommended to only download the model for the skill you need in a particular `HOST_MODELS_PATH`.

In order to ensure compatibility between models and the container, re-download the utilized models whenever you create a container using a new image version. When using a disconnected container, the license should be downloaded again after downloading the models.

## Run the disconnected container with `docker run`


| Placeholder                     | Value                                                                                                                                    | Format or example                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `{IMAGE}`                       | The container image you want to use.                                                                                                     | `mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu` |
| `{LICENSE_MOUNT}`               | The path where the license will be downloaded, and mounted.                                                                              | `/host/license:/path/to/license/directory`                                   |
| `{HOST_MODELS_PATH}`            | The path where the models were downloaded, and mounted.                                                                                  | `/host/models:/models`                                                       |
| `{ENDPOINT_URI}`                | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com`                |
| `{API_KEY}`                     | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal.             | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                                           |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.                                                                      | `/path/to/license/directory`                                                 |


```bash
docker run --rm -it -p 5000:5000 \ 
-v {LICENSE_MOUNT} \
-v {HOST_MODELS_PATH} \
{IMAGE} \
eula=accept \
rai_terms=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License={CONTAINER_LICENSE_DIRECTORY} 
```

Once the license file has been downloaded, you can run the container in a disconnected environment. The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. An output mount must also be specified so that billing usage records can be written.


| Placeholder                     | Value                                                                                                      | Format or example                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `{IMAGE}`                       | The container image you want to use.                                                                       | `mcr.microsoft.com/azure-cognitive-services/textanalytics/summarization:cpu` |
| `{MEMORY_SIZE}`                 | The appropriate size of memory to allocate for your container.                                             | `4g`                                                                         |
| `{NUMBER_CPUS}`                 | The appropriate number of CPUs to allocate for your container.                                             | `4`                                                                          |
| `{LICENSE_MOUNT}`               | The path where the license will be located and mounted.                                                    | `/host/license:/path/to/license/directory`                                   |
| `{HOST_MODELS_PATH}`            | The path where the models were downloaded, and mounted.                                                    | `/host/models:/models`                                                       |
| `{OUTPUT_PATH}`                 | The output path for logging [usage records](../../../containers/disconnected-containers.md#usage-records). | `/host/output:/path/to/output/directory`                                     |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.                                        | `/path/to/license/directory`                                                 |
| `{CONTAINER_OUTPUT_DIRECTORY}`  | Location of the output folder on the container's local filesystem.                                         | `/path/to/output/directory`                                                  |


```bash
docker run --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \ 
-v {LICENSE_MOUNT} \ 
-v {HOST_MODELS_PATH} \
-v {OUTPUT_PATH} \
{IMAGE} \
eula=accept \
rai_terms=accept \
Mounts:License={CONTAINER_LICENSE_DIRECTORY}
Mounts:Output={CONTAINER_OUTPUT_DIRECTORY}
```