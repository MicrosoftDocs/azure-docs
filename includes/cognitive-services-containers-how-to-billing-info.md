---
author: aahill
ms.author: aahi
ms.date: 07/27/2021
ms.service: cognitive-services
ms.topic: include
---

Queries to the container are billed at the pricing tier of the Azure resource that's used for the `ApiKey` parameter.

Azure AI services containers aren't licensed to run without being connected to the metering or billing endpoint. You must enable the containers to communicate billing information with the billing endpoint at all times. Azure AI services containers don't send customer data, such as the image or text that's being analyzed, to Microsoft.

### Connect to Azure

The container needs the billing argument values to run. These values allow the container to connect to the billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect to Azure within the allowed time window, the container continues to run but doesn't serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container stops serving requests. See the [Azure AI services container FAQ](../articles/ai-services/containers/container-faq.yml#how-does-billing-work) for an example of the information sent to Microsoft for billing.

### Billing arguments

The <a href="https://docs.docker.com/engine/reference/commandline/run/" target="_blank">`docker run` <span class="docon docon-navigate-external x-hidden-focus"></span></a> command will start the container when all three of the following options are provided with valid values:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Azure AI services resource that's used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource that's specified in `Billing`. |
| `Billing` | The endpoint of the Azure AI services resource that's used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you accepted the license for the container.<br/>The value of this option must be set to **accept**. |
