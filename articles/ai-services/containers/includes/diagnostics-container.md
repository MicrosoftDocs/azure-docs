---

titleSuffix: Azure AI services
services: cognitive-services
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/08/2021
ms.author: aahi
---

If you're having trouble running an Azure AI services container, you can try using the Microsoft diagnostics container. Use this container to diagnose common errors in your deployment environment that might prevent Azure AI services containers from functioning as expected.

To get the container, use the following `docker pull` command:

```bash
docker pull mcr.microsoft.com/azure-cognitive-services/diagnostic
```

Then run the container. Replace `{ENDPOINT_URI}` with your endpoint, and replace `{API_KEY}` with your key to your resource:

```bash
docker run --rm mcr.microsoft.com/azure-cognitive-services/diagnostic \
eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

The container will test for network connectivity to the billing endpoint.
