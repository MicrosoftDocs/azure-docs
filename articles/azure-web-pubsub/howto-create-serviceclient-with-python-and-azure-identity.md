---
title: How to create a WebPubSubServiceClient with Python and Azure Identity
description: How to create a WebPubSubServiceClient with Python and Azure Identity
author: terencefan
ms.author: tefa
ms.date: 11/15/2021
ms.service: azure-web-pubsub
ms.custom: devx-track-python
ms.topic: how-to
---

# How to create a `WebPubSubServiceClient` with Python and Azure Identity

This how-to guide shows you how to create a `WebPubSubServiceClient` using Microsoft Entra ID in Python.

## Requirements

- Install [azure-identity](https://pypi.org/project/azure-identity/) package from pypi.org.

  ```bash
  python -m pip install azure-identity
  ```

- Install [azure-messaging-webpubsubservice](https://pypi.org/project/azure-messaging-webpubsubservice/) package from pypi.org.

  ```bash
  python -m pip install azure-messaging-webpubsubservice
  ```

## Sample codes

1. Create a `TokenCredential` with Azure Identity SDK.

   ```python
   from azure.identity import DefaultAzureCredential

   credential = DefaultAzureCredential()
   ```

   `credential` can be any class that inherits from `TokenCredential` class.

   - EnvironmentCredential
   - ClientSecretCredential
   - ClientCertificateCredential
   - ManagedIdentityCredential
   - VisualStudioCredential
   - VisualStudioCodeCredential
   - AzureCliCredential

   To learn more, see [Azure Identity client library for Python](/python/api/overview/azure/identity-readme)

2. Then create a `client` with `endpoint`, `hub`, and `credential`.

   ```python
   from azure.identity import DefaultAzureCredential

   credential = DefaultAzureCredential()

   client = WebPubSubServiceClient(hub="<hub>", endpoint="<endpoint>", credential=credential)
   ```

   Learn how to use this client, see [Azure Web PubSub service client library for Python](/python/api/overview/azure/messaging-webpubsubservice-readme)

## Complete sample

- [Simple chatroom with Microsoft Entra ID authorization](https://github.com/Azure/azure-webpubsub/tree/main/samples/python/chatapp-aad)
