---
title: Use Docker containers in disconnected environments
titleSuffix: Azure AI services
description: Learn how to run Azure AI services Docker containers disconnected from the internet.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: reference
ms.date: 07/28/2023
ms.author: aahi
---

# Use Docker containers in disconnected environments

Containers enable you to run Azure AI services APIs in your own environment, and are great for your specific security and data governance requirements. Disconnected containers enable you to use several of these APIs disconnected from the internet. Currently, the following containers can be run in this manner:

* [Speech to text](../speech-service/speech-container-howto.md?tabs=stt)
* [Custom Speech to text](../speech-service/speech-container-howto.md?tabs=cstt)
* [Neural Text to speech](../speech-service/speech-container-howto.md?tabs=ntts)
* [Text Translation (Standard)](../translator/containers/translator-disconnected-containers.md)
* Azure AI Language
  * [Sentiment Analysis](../language-service/sentiment-opinion-mining/how-to/use-containers.md)
  * [Key Phrase Extraction](../language-service/key-phrase-extraction/how-to/use-containers.md)
  * [Language Detection](../language-service/language-detection/how-to/use-containers.md)
  * [Summarization](../language-service/summarization/how-to/use-containers.md)
  * [Named Entity Recognition](../language-service/named-entity-recognition/how-to/use-containers.md)
* [Azure AI Vision - Read](../computer-vision/computer-vision-how-to-install-containers.md)
* [Document Intelligence](../../ai-services/document-intelligence/containers/disconnected.md)

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

## Purchase a commitment tier pricing plan for disconnected containers

### Create a new resource

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a new resource** for one of the applicable Azure AI services listed above.

2. Enter the applicable information to create your resource. Be sure to select **Commitment tier disconnected containers** as your pricing tier.

    > [!NOTE]
    >
    > * You will only see the option to purchase a commitment tier if you have been approved by Microsoft.
    > * Pricing details are for example only.

1. Select **Review + Create** at the bottom of the page. Review the information, and select **Create**.

### Configure container for disconnected usage

See the following documentation for steps on downloading and configuring the container for disconnected usage:

* [Vision - Read](../computer-vision/computer-vision-how-to-install-containers.md#run-the-container-disconnected-from-the-internet) 
* [Language Understanding (LUIS)](../LUIS/luis-container-howto.md#run-the-container-disconnected-from-the-internet)
* [Text Translation (Standard)](../translator/containers/translator-disconnected-containers.md)
* [Document Intelligence](../../ai-services/document-intelligence/containers/disconnected.md)

**Speech service**

* [Speech to text](../speech-service/speech-container-stt.md?tabs=disconnected#run-the-container-with-docker-run)
* [Custom Speech to text](../speech-service/speech-container-cstt.md?tabs=disconnected#run-the-container-with-docker-run)
* [Neural Text to speech](../speech-service/speech-container-ntts.md?tabs=disconnected#run-the-container-with-docker-run)

**Language service**

* [Sentiment Analysis](../language-service/sentiment-opinion-mining/how-to/use-containers.md#run-the-container-disconnected-from-the-internet)
* [Key Phrase Extraction](../language-service/key-phrase-extraction/how-to/use-containers.md#run-the-container-disconnected-from-the-internet)
* [Language Detection](../language-service/language-detection/how-to/use-containers.md#run-the-container-disconnected-from-the-internet)

## Environment variable names in Kubernetes deployments
Some Azure AI Containers, for example Translator, require users to pass environmental variable names that include colons (`:`) when running the container. This will work fine when using Docker, but Kubernetes does not accept colons in environmental variable names.
To resolve this, you can replace colons with double underscore characters (`__`) when deploying to Kubernetes. See the following example of an acceptable format for environment variable names:

```Kubernetes
        env:  
        - name: Mounts__License
          value: "/license"
        - name: Mounts__Output
          value: "/output"
```

This example replaces the default format for the `Mounts:License` and `Mounts:Output` environment variable names in the docker run command.

## Container image and license updates

[!INCLUDE [License update information](../../../includes/cognitive-services-containers-license-update.md)]

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

## Purchase a commitment plan to use containers in disconnected environments

Commitment plans for disconnected containers have a calendar year commitment period. When you purchase a plan, you'll be charged the full price immediately. During the commitment period, you can't change your commitment plan, however you can purchase additional unit(s) at a pro-rated price for the remaining days in the year. You have until midnight (UTC) on the last day of your commitment, to end a commitment plan.

You can choose a different commitment plan in the **Commitment Tier pricing** settings of your resource.

## End a commitment plan

If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's auto-renewal to **Do not auto-renew**. Your commitment plan will expire on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You'll be able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. You have until midnight (UTC) on the last day of the year to end a commitment plan for disconnected containers, and not be charged for the following year.

## Troubleshooting

If you run the container with an output mount and logging enabled, the container generates log files that are helpful to troubleshoot issues that happen while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](disconnected-container-faq.yml).

## Next steps

[Azure AI containers overview](../cognitive-services-container-support.md)
