---
title: Reference - Python server SDK for Azure Web PubSub service
description: The reference describes the Python server SDK for Azure Web PubSub service
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual 
ms.date: 08/26/2021
---

# Python server SDK for Azure Web PubSub service

Use the library to:

- Send messages to hubs and groups.
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections
- Grant/revoke/check permissions for an existing connection

[Source code](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/webpubsub/azure-messaging-webpubsubservice) | [Package (Pypi)][package] | [API reference documentation](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/webpubsub/azure-messaging-webpubsubservice) | [Product documentation][webpubsubservice_docs] |
[Samples][samples_ref]

## Getting started

### Installations the package

```bash
python -m pip install azure-messaging-webpubsubservice
```

#### Prerequisites

- Python 2.7, or 3.6 or later is required to use this package.
- You need an [Azure subscription][azure_sub], and an [Azure WebPubSub service instance][webpubsubservice_docs] to use this package.
- An existing Azure Web PubSub service instance.

### Authenticating the client

In order to interact with the Azure WebPubSub service, you'll need to create an instance of the [WebPubSubServiceClient][webpubsubservice_client_class] class. In order to authenticate against the service, you need to pass in an AzureKeyCredential instance with endpoint and access key. The endpoint and access key can be found on Azure portal.

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
>>> from azure.core.credentials import AzureKeyCredential
>>> client = WebPubSubServiceClient(endpoint='<endpoint>', credential=AzureKeyCredential('somesecret'))
>>> client
<WebPubSubServiceClient endpoint:'<endpoint>'>
```

## Examples

### Sending a request

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
>>> from azure.core.credentials import AzureKeyCredential
>>> from azure.messaging.webpubsubservice.rest import build_send_to_all_request
>>> client = WebPubSubServiceClient(endpoint='<endpoint>', credential=AzureKeyCredential('somesecret'))
>>> request = build_send_to_all_request('default', json={ 'Hello':  'webpubsub!' })
>>> request
<HttpRequest [POST], url: '/api/hubs/default/:send?api-version=2020-10-01'>
>>> response = client.send_request(request)
>>> response
<RequestsTransportResponse: 202 Accepted>
>>> response.status_code 
202
>>> with open('file.json', 'r') as f:
>>>    request = build_send_to_all_request('ahub', content=f, content_type='application/json')
>>>    response = client.send_request(request)
>>> print(response)
<RequestsTransportResponse: 202 Accepted>
```

## Key concepts

[!INCLUDE [Terms](includes/terms.md)]

## Troubleshooting

### Logging

This SDK uses Python standard logging library.
You can configure logging print debugging information to the stdout or anywhere you want.

```python
import logging

logging.basicConfig(level=logging.DEBUG)
```

Http request and response details are printed to stdout with this logging config.

[webpubsubservice_docs]: https://aka.ms/awps/doc
[azure_cli]: /cli/azure
[azure_sub]: https://azure.microsoft.com/free/
[webpubsubservice_client_class]: https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/webpubsub/azure-messaging-webpubsubservice/azure/messaging/webpubsubservice/__init__.py
[package]: https://pypi.org/project/azure-messaging-webpubsubservice/
[default_cred_ref]: https://aka.ms/azsdk-python-identity-default-cred-ref
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/python

## Next steps

[!INCLUDE [next step](includes/include-next-step.md)]
