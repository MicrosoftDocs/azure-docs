---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 03/11/2019
---


Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data (for example, the image or text that is being analyzed) to Microsoft. 

### Connecting to Azure

The container needs the billing argument values to run. These values allow the container to connect to Azure billing successfully for this container. The container reports usage about every 10 to 15 minutes. If the container doesn't connect within the allowed time window to Azure, the container will continue to run but will not serve endpoint queries until the connection to Azure is restored. The connection is attempted 10 times at the same time interval of 10 to 15 minutes. If it can't connect to Azure within the 10 tries, the container will stop running. 

### Billing arguments

All three of the following options must be specified with valid values in order for the `docker run` command to start the container:

| Option | Description |
|--------|-------------|
| `ApiKey` | The API key of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to an API key for the provisioned resource specified in `Billing`. |
| `Billing` | The endpoint of the Cognitive Service resource used to track billing information.<br/>The value of this option must be set to the endpoint URI of a provisioned LUIS Azure resource.|
| `Eula` | Indicates that you've accepted the license for the container.<br/>The value of this option must be set to `accept`. |


