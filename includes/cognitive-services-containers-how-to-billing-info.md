---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 002/08/2019
---


Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (e.g., the image or text that is being analyzed) to Microsoft. The container reports usage about every 10 to 15 minutes.

The `docker run` uses the following arguments for billing purposes:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource specified in `Billing`. |
| `Billing` | The endpoint of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned LUIS Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |

> [!IMPORTANT]
> All three options must be specified with valid values, or the container won't start.
