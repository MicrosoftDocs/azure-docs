---
title: Use Docker containers in disconnected environments
titleSuffix: Azure Cognitive Services
description: Learn how to run Azure Cognitive Services Docker containers disconnected from the internet.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 02/27/2022
ms.author: aahi
---

# Use Docker containers in disconnected environments

Containers enable you to run Cognitive Services APIs in your own environment, and are great for your specific security and data governance requirements. Disconnected containers enable you to use several of these APIs disconnected from the internet. Currently, the following containers can be run in this manner:

* [Speech-to-Text](../speech-service/speech-container-howto.md?tabs=stt)
* [Custom Speech-to-Text](../speech-service/speech-container-howto.md?tabs=cstt)
* [Neural Text-to-Speech](../speech-service/speech-container-howto.md?tabs=ntts)
* [Text Translation (Standard)](../translator/containers/translator-disconnected-containers.md)
* [Language Understanding (LUIS)](../LUIS/luis-container-howto.md)
* Azure Cognitive Service for Language
  * [Sentiment Analysis](../language-service/sentiment-opinion-mining/how-to/use-containers.md)
  * [Key Phrase Extraction](../language-service/key-phrase-extraction/how-to/use-containers.md)
  * [Language Detection](../language-service/language-detection/how-to/use-containers.md)
* [Computer Vision - Read](../computer-vision/computer-vision-how-to-install-containers.md)

Disconnected container usage is also available for the following Applied AI service:

* [Form Recognizer](../../applied-ai-services/form-recognizer/containers/form-recognizer-disconnected-containers.md)

Before attempting to run a Docker container in an offline environment, make sure you know the steps to successfully download and use the container. For example:

* Host computer requirements and recommendations.
* The Docker `pull` command you'll use to download the container.
* How to validate that a container is running.
* How to send queries to the container's endpoint, once it's running.

## Request access to use containers in disconnected environments

Fill out and submit the [request form](https://aka.ms/csdisconnectedcontainers) to request access to the containers disconnected from the internet.

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

Access is limited to customers that meet the following requirements:

* Your organization should be identified as strategic customer or partner with Microsoft.
* Disconnected containers are expected to run fully offline, hence your use cases must meet one of below or similar requirements:
  * Environment or device(s) with zero connectivity to internet.
  * Remote location that occasionally has internet access.
  * Organization under strict regulation of not sending any kind of data back to cloud.
* Application completed as instructed - Please pay close attention to guidance provided throughout the application to ensure you provide all the necessary information required for approval.

## Purchase a commitment plan to use containers in disconnected environments

### Create a new resource

1. Sign into the [Azure portal](https://portal.azure.com/) and select **Create a new resource** for one of the applicable Cognitive Services or Applied AI services listed above.

2. Enter the applicable information to create your resource. Be sure to select **Commitment tier disconnected containers** as your pricing tier.

    > [!NOTE]
    >
    > * You will only see the option to purchase a commitment tier if you have been approved by Microsoft.
    > * Pricing details are for example only.

    :::image type="content" source="media/offline-container-signup.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/offline-container-signup.png":::

3. Select **Review + Create** at the bottom of the page. Review the information, and select **Create**.

## Gather required parameters

There are three primary parameters for all Cognitive Services' containers that are required. The end-user license agreement (EULA) must be present with a value of *accept*. Additionally, both an endpoint URL and API key are needed when you first run the container, to configure it for disconnected usage.

You can find the key and endpoint on the **Key and endpoint** page for your resource.

> [!IMPORTANT]
> You will only use your key and endpoint to configure the container to be run in a disconnected environment. After you configure the container, you won't need them to send API requests. Store them securely, for example, using Azure Key Vault. Only one key is necessary for this process.

## Download a Docker container with `docker pull`

After you have a license file, download the Docker container you have approval to run in a disconnected environment. For example:

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice:latest
```

## Configure the container to be run in a disconnected environment

Now that you've downloaded your container, you'll need to run the container with the `DownloadLicense=True` parameter in your `docker run` command. This parameter will download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container. You can only use a license file with the appropriate container that you've been approved for. For example, you can't use a license file for a speech-to-text container with a form recognizer container. Please do not rename or modify the license file as this will prevent the container from running successfully.

> [!IMPORTANT]
>
> * [**Translator container only**](../translator/containers/translator-how-to-install-container.md):
>   * You must include a parameter to download model files for the [languages](../translator/language-support.md) you want to translate. For example: `-e Languages=en,es`
>   * The container will generate a `docker run` template that you can use to run the container, containing parameters you will need for the downloaded models and configuration file. Make sure you save this template.

The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

| Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/host/license:/path/to/license/directory` |
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, on the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, on the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |

```bash
docker run --rm -it -p 5000:5000 \ 
-v {LICENSE_MOUNT} \
{IMAGE} \
eula=accept \
billing={ENDPOINT_URI} \
apikey={API_KEY} \
DownloadLicense=True \
Mounts:License={CONTAINER_LICENSE_DIRECTORY} 
```

After you've configured the container, use the next section to run the container in your environment with the license, and appropriate memory and CPU allocations.

## Run the container in a disconnected environment

> [!IMPORTANT]
> If you're using the Translator, Neural text-to-speech, or Speech-to-text containers, read the **Additional parameters** section below for information on commands or additional parameters you will need to use.

Once the license file has been downloaded, you can run the container in a disconnected environment. The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. An output mount must also be specified so that billing usage records can be written.

Placeholder | Value | Format or example |
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/form-recognizer/invoice` |
 `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `4g` |
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license will be located and mounted.  | `/host/license:/path/to/license/directory` |
| `{OUTPUT_PATH}` | The output path for logging [usage records](#usage-records). | `/host/output:/path/to/output/directory` |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |
| `{CONTAINER_OUTPUT_DIRECTORY}` | Location of the output folder on the container's local filesystem.  | `/path/to/output/directory` |

```bash
docker run --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \ 
-v {LICENSE_MOUNT} \ 
-v {OUTPUT_PATH} \
{IMAGE} \
eula=accept \
Mounts:License={CONTAINER_LICENSE_DIRECTORY}
Mounts:Output={CONTAINER_OUTPUT_DIRECTORY}
```

### Additional parameters and commands

See the following sections for additional parameters and commands you may need to run the container.

#### Translator container

If you're using the [Translator container](../translator/containers/translator-how-to-install-container.md), you'll need to add parameters for the downloaded translation models and container configuration. These values are generated and displayed in the container output when you [configure the container](#configure-the-container-to-be-run-in-a-disconnected-environment) as described above. For example:

```bash
-e MODELS= /path/to/model1/, /path/to/model2/
-e TRANSLATORSYSTEMCONFIG=/path/to/model/config/translatorsystemconfig.json
```

#### Speech containers

# [Speech-to-text](#tab/stt)

The [Speech-to-Text](../speech-service/speech-container-howto.md?tabs=stt) container provides a default directory for writing the license file and billing log at runtime. The default directories are /license and /output respectively. 

When you're mounting these directories to the container with the `docker run -v` command, make sure the local machine directory is set ownership to `user:group nonroot:nonroot` before running the container.

Below is a sample command to set file/directory ownership.

```bash
sudo chown -R nonroot:nonroot <YOUR_LOCAL_MACHINE_PATH_1> <YOUR_LOCAL_MACHINE_PATH_2> ...
```

# [Neural Text-to-Speech](#tab/ntts)

The [Neural Text-to-Speech](../speech-service/speech-container-howto.md?tabs=ntts) container provides a default directory for writing the license file and billing log at runtime. The default directories are /license and /output respectively. 

When you're mounting these directories to the container with the `docker run -v` command, make sure the local machine directory is set ownership to `user:group nonroot:nonroot` before running the container.

Below is a sample command to set file/directory ownership.

```bash
sudo chown -R nonroot:nonroot <YOUR_LOCAL_MACHINE_PATH_1> <YOUR_LOCAL_MACHINE_PATH_2> ...
```

# [Custom Speech-to-Text](#tab/cstt)

In order to prepare and configure the Custom Speech-to-Text container you will need two separate speech resources:

1. A regular Azure Speech Service resource which is either configured to use a "**S0 - Standard**" pricing tier or a "**Speech to Text (Custom)**" commitment tier pricing plan. This will be used to train, download, and configure your custom speech models for use in your container.
1. An Azure Speech Service resource which is configured to use the "**DC0 Commitment (Disconnected)**" pricing plan. This is used to download your disconnected container license file required to run the container in disconnected mode.
   
To download all the required models into your Custom Speech-to-Text container follow the instructions for Custom Speech-to-Text containers on the [Install and run Speech containers](../speech-service/speech-container-howto.md?tabs=cstt) page and use the  speech resource in step 1.

After all required models have been downloaded to your host computer, you need to download the disconnected license file using the instructions in the above chapter, titled [Configure the container to be run in a disconnected environment](./disconnected-containers.md#configure-the-container-to-be-run-in-a-disconnected-environment), using the Speech resource from step 2.

To run the container in disconnected mode, follow the instructions from above chapter titled [Run the container in a disconnected environment](./disconnected-containers.md#run-the-container-in-a-disconnected-environment) and add an additional `-v` parameter to mount the directory containing your custom speech model.

Example for running a Custom Speech-to-Text container in disconnected mode:
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

The [Custom Speech-to-Text](../speech-service/speech-container-howto.md?tabs=cstt) container provides a default directory for writing the license file and billing log at runtime. The default directories are /license and /output respectively. 

When you're mounting these directories to the container with the `docker run -v` command, make sure the local machine directory is set ownership to `user:group nonroot:nonroot` before running the container.

Below is a sample command to set file/directory ownership.

```bash
sudo chown -R nonroot:nonroot <YOUR_LOCAL_MACHINE_PATH_1> <YOUR_LOCAL_MACHINE_PATH_2> ...
```

---

## Usage records

When operating Docker containers in a disconnected environment, the container will write usage records to a volume where they're collected over time. You can also call a REST endpoint to generate a report about service usage.

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

## Purchase a different commitment plan for disconnected containers

Commitment plans for disconnected containers have a calendar year commitment period. When you purchase a plan, you'll be charged the full price immediately. During the commitment period, you can't change your commitment plan, however you can purchase additional unit(s) at a pro-rated price for the remaining days in the year. You have until midnight (UTC) on the last day of your commitment, to end a commitment plan.

You can choose a different commitment plan in the **Commitment Tier pricing** settings of your resource.

## End a commitment plan

If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's auto-renewal to **Do not auto-renew**. Your commitment plan will expire on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You'll be able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. You have until midnight (UTC) on the last day of the year to end a commitment plan for disconnected containers, and not be charged for the following year.

## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](disconnected-container-faq.yml).

## Next steps

[Azure Cognitive Services containers overview](../cognitive-services-container-support.md)




