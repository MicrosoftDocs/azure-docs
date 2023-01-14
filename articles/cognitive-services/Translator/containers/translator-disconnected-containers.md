---
title: Use Translator Docker containers in disconnected environments
titleSuffix: Azure Cognitive Services
description: Learn how to run Azure Cognitive Services Translator containers in disconnected environments.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 01/13/2023
ms.author: lajanuar
---

# Use Translator containers in disconnected environments

* Containers enable you to run Translator APIs in your own environment, and are great for your specific security and data governance requirements.
* Disconnected containers enable you to use several of these APIs disconnected from the internet.

Before attempting to run a Docker container in an offline environment, make sure you're familiar with the following requirements to successfully download and use the container:

* Host computer requirements and recommendations.
* The Docker `pull` command you'll use to download the container.
* How to validate that a container is running.
* How to send queries to the container's endpoint, once it's running.

## Request access to use containers in disconnected environments

Complete and submit the [request form](https://aka.ms/csdisconnectedcontainers) to request access to the containers disconnected from the internet.

[!INCLUDE [Request access to public preview](../../../../includes/cognitive-services-containers-request-access.md)]

Access is limited to customers that meet the following requirements:

* Your organization should be identified as strategic customer or partner with Microsoft.
* Disconnected containers are expected to run fully offline, hence your use cases must meet atleast one of these or similar requirements:
  * Environment or device(s) with zero connectivity to internet.
  * Remote location that occasionally has internet access.
  * Organization under strict regulation of not sending any kind of data back to cloud.
* Application completed as instructed. Make certain to pay close attention to guidance provided throughout the application to ensure you provide all the necessary information required for approval.

## Purchase a commitment plan to use containers in disconnected environments

### Create a new resource

1. Create a [Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal.

2. Enter the applicable information to create your resource. Be sure to select **Commitment tier disconnected containers** as your pricing tier.

    > [!NOTE]
    >
    > * You will only see the option to purchase a commitment tier if you have been approved by Microsoft.

    :::image type="content" source="../media/create-resource-offline-container.png" alt-text="A screenshot showing resource creation on the Azure portal.":::

3. Select **Review + Create** at the bottom of the page. Review the information, and select **Create**.

## Gather required parameters

There are three required parameters for all Cognitive Services' containers:

* The end-user license agreement (EULA) must be present with a value of *accept*.
* The endpoint URL for your resource from the Azure portal.
* The API key for your resource from the Azure portal.

Both the endpoint URL and API key are needed when you first run the container, to configure it for disconnected usage. You can find the key and endpoint on the **Key and endpoint** page for your resource.

  :::image type="content" source="../media/quickstarts/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

> [!IMPORTANT]
> You will only use your key and endpoint to configure the container to be run in a disconnected environment. After you configure the container, you won't need them to send API requests. Store them securely, for example, using Azure Key Vault. Only one key is necessary for this process.

## Download a Docker container with `docker pull`

    After you have a license file, download the Docker container you have approval to run in a disconnected environment. For example:

    |Docker pull command | Value |Format|
    |----------|-------|------|
    |&bullet; **docker pull [image]**</br>&bullet; **docker pull [image]:latest**|The latest container image.|&bullet; mcr.microsoft.com/azure-cognitive-services/translator/text-translation</br>  </br>&bullet; mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest |
    |||
    |&bullet; **docker pull [image]:version** | A specific container image |mcr.microsoft.com/azure-cognitive-services/translator/text-translation:1.0.019410001-amd64 |

    **Example Docker pull command**

    ```docker
      docker pull mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest
    ```

## Configure the container to run in a disconnected environment

Now that you've downloaded your container, you'll need to execute the `docker run` command with the following parameters:

* **`DownloadLicense=True`**. This parameter will download a license file that will enable your Docker container to run when it isn't connected to the internet. It also contains an expiration date, after which the license file will be invalid to run the container. You can only use the license file in corresponding approved container.
* **`Languages={language list}`**. You must include this parameter to download model files for the [languages](../language-support.md) you want to translate.

> [!IMPORTANT]
> The container will generate a `docker run` template that you can use to run the container, containing parameters you will need for the downloaded models and configuration file. Make sure you save this template.

The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholder values with your own values.

| Parameter | Value | Format|
|-------------|-------|---|
| `[image]` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/translator/text-translation` |
| `{LICENSE_MOUNT}` | The path where the license will be downloaded, and mounted.  | `/host/license:/path/to/license/directory` |
 | `{MODEL_MOUNT_PATH}`| The path where the machine translation models will be downloaded, and mounted.  Your directory structure must be formatted as **/usr/local/models** | /host/translator/models:/usr/local/models|
| `{ENDPOINT_URI}` | The endpoint for authenticating your service request. You can find it on your resource's **Key and endpoint** page, in the Azure portal. | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
| `{API_KEY}` | The key for your Text Analytics resource. You can find it on your resource's **Key and endpoint** page, in the Azure portal. |`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`|
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |

    **Example Docker pull command**

    ```docker

    docker run --rm -it -p 5000:5000

    -v {MODEL_MOUNT_PATH} \

    -v {LICENSE_MOUNT_PATH} \

    Mounts:License={CONTAINER_LICENSE_DIRECTORY} \

    -e DownloadLicense=true \

    -e eula=accept \

    -e billing={ENDPOINT_URI} \

    -e apikey={API_KEY} \

    -e Languages={LANGUAGES_LIST}

    [image]
    ```

### Translation models and container configuration

After you've [configured the container](#configure-the-container-to-run-in-a-disconnected-environment), the values for the downloaded translation models and container configuration will be generated and displayed in the container output. For example:

    ```bash
      -e MODELS= usr/local/models/model1/, usr/local/models/model2/
      -e TRANSLATORSYSTEMCONFIG=/usr/local/models/Config/5a72fa7c-394b-45db-8c06-ecdfc98c0832
    ```

## Run the container in a disconnected environment

Once the license file has been downloaded, you can run the container in a disconnected environment with your license, appropriate memory, and suitable CPU allocations. The following example shows the formatting of the `docker run` command you'll use, with placeholder values. Replace these placeholders values with your own values.

Wherever the container is run, the license file must be mounted to the container and the location of the license folder on the container's local filesystem must be specified with `Mounts:License=`. In addition, an output mount must be specified so that billing usage records can be written.

Placeholder | Value | Format|
|-------------|-------|---|
| `{IMAGE}` | The container image you want to use. | `mcr.microsoft.com/azure-cognitive-services/translator/text-translation` |
 `{MEMORY_SIZE}` | The appropriate size of memory to allocate for your container. | `16g` |
| `{NUMBER_CPUS}` | The appropriate number of CPUs to allocate for your container. | `4` |
| `{LICENSE_MOUNT}` | The path where the license will be located and mounted.  | `/host/translator/license:/path/to/license/directory` |
|`{MODEL_MOUNT_PATH}`| The path where the machine translation models will be downloaded, and mounted.  Your directory structure must be formatted as **/usr/local/models** | /host/translator/models:/usr/local/models|
|`{MODELS_DIRECTORY_LIST}`|List of comma separated directories each having a machine translation model. | /usr/local/models/enu_esn_generalnn_2022240501,/usr/local/models/esn_enu_generalnn_2022240501 |
| `{OUTPUT_PATH}` | The output path for logging [usage records](#usage-records). | `/host/output:/path/to/output/directory` |
| `{CONTAINER_LICENSE_DIRECTORY}` | Location of the license folder on the container's local filesystem.  | `/path/to/license/directory` |
| `{CONTAINER_OUTPUT_DIRECTORY}` | Location of the output folder on the container's local filesystem.  | `/path/to/output/directory` |
|`{TRANSLATOR_CONFIG_JSON}`| Translator system configuration file used by container internally.| /usr/local/models/Config/5a72fa7c-394b-45db-8c06-ecdfc98c0832 |

    ```docker

        docker run --rm -it -p 5000:5000 --memory {MEMORY_SIZE} --cpus {NUMBER_CPUS} \

    -v {MODEL_MOUNT_PATH} \

    -v {LICENSE_MOUNT_PATH} \

    -v {OUTPUT_MOUNT_PATH} \

    Mounts:License={CONTAINER_LICENSE_DIRECTORY} \

    Mounts:Output={CONTAINER_OUTPUT_DIRECTORY} \

    -e MODELS={MODELS_DIRECTORY_LIST} \

    -e TRANSLATORSYSTEMCONFIG={TRANSLATOR_CONFIG_JSON} \

    -e eula=accept \

    [image]
    ```

That's it! You've learned how to create and run disconnected containers for Translator Service.

### Other parameters and commands

Here are a few more parameters and commands you may need to run the container.

## Usage records

When operating Docker containers in a disconnected environment, the container will write usage records to a volume where they're collected over time. You can also call a REST endpoint to generate a report about service usage.

### Arguments for storing logs

When run in a disconnected environment, an output mount must be available to the container to store usage logs. For example, you would include `-v /host/output:{OUTPUT_PATH}` and `Mounts:Output={OUTPUT_PATH}` in the following example, replacing `{OUTPUT_PATH}` with the path where the logs will be stored:

    ```docker
    docker run -v /host/output:{OUTPUT_PATH} ... <image> ... Mounts:Output={OUTPUT_PATH}
    ```

### Get records using the container endpoints

The container provides two endpoints for returning records about its usage.

#### Get all records

The following endpoint will provide a report summarizing all of the usage collected in the mounted billing record directory.

    ```HTTP
    https://<service>/records/usage-logs/
    ```

for example: `http://localhost:5000/records/usage-logs`.

It will return JSON similar to this example:

    ```json
    {
    "apiType": "noop",
    "serviceName": "noop",
    "meters": [
    {
        "name": "string",
        "quantity": 256345435
    }
    ]
    }
    ```

#### Get records for a specific month

The following endpoint will provide a report summarizing usage over a specific month and year.

    ```HTTP
    https://<service>/records/usage-logs/{MONTH}/{YEAR}
    ```

it will return a JSON response similar to this example:

    ```json
    {
      "apiType": "string",
      "serviceName": "string",
      "meters": [
        {
          "name": "string",
          "quantity": 56097
        }
      ]
    }
    ```

## Purchase a different commitment plan for disconnected containers

Commitment plans for disconnected containers have a calendar year commitment period. When you purchase a plan, you'll be charged the full price immediately. During the commitment period, you can't change your commitment plan, however you can purchase more unit(s) at a pro-rated price for the remaining days in the year. You have until midnight (UTC) on the last day of your commitment, to end a commitment plan.

You can choose a different commitment plan in the **Commitment Tier pricing** settings of your resource.

## End a commitment plan

 If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's auto-renewal to **Do not auto-renew**. Your commitment plan will expire on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You'll be able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. You have until midnight (UTC) on the last day of the year to end a commitment plan for disconnected containers. If you do so, you won't be charged for the following year.

## Troubleshooting

Run the container with an output mount and logging enabled. Those settings will enable the container to generate log files that are helpful for troubleshooting issues that happen while starting or running the container.

> [!TIP]
> For more troubleshooting information and guidance, see [Disconnected containers Frequently asked questions (FAQ)](../../containers/disconnected-container-faq.yml).

## Next steps

> [!div class="nextstepaction"]
> [Translate text request parameters for containers](translator-container-supported-parameters.md)
