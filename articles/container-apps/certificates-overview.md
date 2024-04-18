---
title: Certificates in Azure Container Apps
description: Learn the different options available to using and managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/28/2024
ms.author: cshoe
---

# Certificates in Azure Container Apps

You can add digital security certificates to secure custom DNS names in Azure Container Apps to support secure communication among your apps.

## Options

The following table lists the options available to add certificates in Container Apps:

| Option | Description |
|---|---|
| [Create a free Azure Container Apps managed certificate](./custom-domains-managed-certificates.md) | A private certificate that's free of charge and easy to use if you just need to secure your custom domain in Container Apps. |
| Import a certificate from Key Vault | Useful if you use [Azure Key Vault](../key-vault/index.yml) to manage your [PKCS12 certificates](https://wikipedia.org/wiki/PKCS_12). |
| [Upload a private certificate](./custom-domains-certificates.md) | You can upload a private certificate if you already have one. |

## Next steps

> [!div class="nextstepaction"]
> [Set up custom domain with existing certificate](custom-domains-certificates.md)
