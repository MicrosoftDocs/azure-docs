---
title: Reference - Python server SDK for Azure Web PubSub
description: Learn about the Python server SDK for the Azure Web PubSub service. You can use this library in your app server to manage the WebSocket client connections.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: how-to
ms.custom: kr2b-contr-experiment, devx-track-python
ms.date: 05/23/2022
---

# Azure Web PubSub service client library for Python

[Azure Web PubSub Service](./index.yml) is an Azure-managed service that helps developers easily build web applications with real-time features and publish-subscribe pattern. Any scenario that requires real-time publish-subscribe messaging between server and clients or among clients can use Azure Web PubSub service. Traditional real-time features that often require polling from server or submitting HTTP requests can also use Azure Web PubSub service.

You can use this library in your app server side to manage the WebSocket client connections, as shown in following diagram:

![The overflow diagram shows the overflow of using the service client library.](media/sdk-reference/service-client-overflow.png)

Use this library to:

- Send messages to hubs and groups.
- Send messages to particular users and connections.
- Organize users and connections into groups.
- Close connections.
- Grant, revoke, and check permissions for an existing connection.

## Prerequisites

- Python 3.6 or later is required to use this package.
- You need an [Azure subscription][azure_sub] and an [Azure WebPubSub service instance][webpubsubservice_docs] to use this package.
- An existing Azure Web PubSub service instance.

> [!IMPORTANT]
> Azure SDK Python packages support for Python 2.7 is ending 01 January 2022. For more information, see [Azure SDK Python packages support](https://github.com/Azure/azure-sdk-for-python/issues/20691).

## Install the package

Use this command to install the package:

```bash
python -m pip install azure-messaging-webpubsubservice
```

## Create and authenticate a WebPubSubServiceClient

You can authenticate the `WebPubSubServiceClient` using a [connection string][connection_string]:

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient

>>> service = WebPubSubServiceClient.from_connection_string(connection_string='<connection_string>', hub='hub')
```

Or use the service endpoint and the access key:

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
>>> from azure.core.credentials import AzureKeyCredential

>>> service = WebPubSubServiceClient(endpoint='<endpoint>', hub='hub', credential=AzureKeyCredential("<access_key>"))
```

Or use [Microsoft Entra ID][microsoft_entra_id_doc]:

1. [pip][pip] install [`azure-identity`][azure_identity_pip].
2. [Enable Microsoft Entra authorization on your Webpubsub resource][microsoft_entra_id_doc].
3. Update code to use [DefaultAzureCredential][default_azure_credential].

   ```python
   >>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
   >>> from azure.identity import DefaultAzureCredential
   >>> service = WebPubSubServiceClient(endpoint='<endpoint>', hub='hub', credential=DefaultAzureCredential())
   ```

## Examples

### Broadcast messages in JSON format

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient

>>> service = WebPubSubServiceClient.from_connection_string('<connection_string>', hub='hub1')
>>> service.send_to_all(message = {
        'from': 'user1',
        'data': 'Hello world'
    })
```

The WebSocket client receives JSON serialized text: `{"from": "user1", "data": "Hello world"}`.

### Broadcast messages in plain-text format

```python
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
>>> service = WebPubSubServiceClient.from_connection_string('<connection_string>', hub='hub1')
>>> service.send_to_all(message = 'Hello world', content_type='text/plain')
```

The WebSocket client receives text: `Hello world`.

### Broadcast messages in binary format

```python
>>> import io
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient
>>> service = WebPubSubServiceClient.from_connection_string('<connection_string>', hub='hub')
>>> service.send_to_all(message=io.StringIO('Hello World'), content_type='application/octet-stream')
```

The WebSocket client receives binary text: `b'Hello world'`.

## Logging

This SDK uses Python standard logging library.
You can configure logging to print debugging information to the `stdout` or anywhere you want.

```python
import sys
import logging
from azure.identity import DefaultAzureCredential
>>> from azure.messaging.webpubsubservice import WebPubSubServiceClient

# Create a logger for the 'azure' SDK
logger = logging.getLogger('azure')
logger.setLevel(logging.DEBUG)

# Configure a console output
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

endpoint = "<endpoint>"
credential = DefaultAzureCredential()

# This WebPubSubServiceClient will log detailed information about its HTTP sessions, at DEBUG level
service = WebPubSubServiceClient(endpoint=endpoint, hub='hub', credential=credential, logging_enable=True)
```

Similarly, `logging_enable` can enable detailed logging for a single call, even when it isn't enabled for the `WebPubSubServiceClient`:

```python
result = service.send_to_all(..., logging_enable=True)
```

HTTP request and response details are printed to `stdout` with this logging configuration.

## Next steps

- [Source code](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/webpubsub/azure-messaging-webpubsubservice)
- [Package (Pypi)][package]
- [API reference documentation](/python/api/overview/azure/messaging-webpubsubservice-readme)
- [Product documentation][webpubsubservice_docs]

For more samples, see [Azure Web PubSub service client library for Python Samples][samples].

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For more information, see [Contributor License Agreement](https://cla.microsoft.com).

When you submit a pull request, a CLA-bot automatically determines whether you need to provide a CLA and decorate the PR appropriately, for example, "label", "comment". Follow the instructions provided by the bot. You only need to do this action once across all repos using our CLA.

This project has adopted the Microsoft Open Source Code of Conduct. For more information, see [Code of Conduct][code_of_conduct] FAQ or contact [Open Source Conduct Team](mailto:opencode@microsoft.com) with questions or comments.

<!-- LINKS -->

[webpubsubservice_docs]: ./index.yml
[azure_cli]: /cli/azure
[azure_sub]: https://azure.microsoft.com/free/
[package]: https://pypi.org/project/azure-messaging-webpubsubservice/
[default_cred_ref]: https://aka.ms/azsdk-python-identity-default-cred-ref
[cla]: https://cla.microsoft.com
[code_of_conduct]: https://opensource.microsoft.com/codeofconduct/
[coc_faq]: https://opensource.microsoft.com/codeofconduct/faq/
[coc_contact]: mailto:opencode@microsoft.com
[azure_identity_credentials]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#credentials
[azure_identity_pip]: https://pypi.org/project/azure-identity/
[default_azure_credential]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#defaultazurecredential
[pip]: https://pypi.org/project/pip/
[enable_aad]: howto-develop-create-instance.md
[api_key]: howto-websocket-connect.md#authorization
[connection_string]: howto-websocket-connect.md#authorization
[azure_portal]: howto-develop-create-instance.md
[azure-key-credential]: https://aka.ms/azsdk-python-core-azurekeycredential
[microsoft_entra_id_doc]: howto-authorize-from-application.md
[samples]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/webpubsub/azure-messaging-webpubsubservice/samples
