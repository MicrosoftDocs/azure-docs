---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 04/16/2019
---

Queries to the container are billed at the pricing tier of the Azure resource used for the `<ApiKey>`.

Cognitive Services containers are not licensed to run without being connected to the billing endpoint for metering. Customers need to enable the containers to communicate billing information with billing endpoint at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft. 

### Connecting to Azure

The container needs the billing argument values to run. These values allow the container to connect to billing endpoint. The container reports usage about every 10 to 15 minutes. If the container doesn't connect within the allowed time window to Azure, the container will continue to run but will not serve queries until the billing endpoint is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to the billing endpoint within the 10 tries, the container will stop running. 

### Billing arguments

All three of the following options must be specified with valid values in order for the `docker run` command to start the container:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource specified in `Billing`. |
| `Billing` | The endpoint of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |


