---
title: Certificates in Azure Container Apps
description: Learn the different options available to using and managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/15/2024
ms.author: cshoe
---

# Certificates in Azure Container Apps

You can add digital security certificates to secure custom DNS names in Azure Container Apps to support secure communication among your apps.

## Options

The following table lists the options available to manage certificates in Container Apps:

| Option | Description |
|---|---|
| [Custom domain with a free certificate](./custom-domains-managed-certificates.md) | A private certificate that's free of charge and easy to use if you just need to secure your custom domain in Container Apps. |
| [Custom domain with an existing certificate](./custom-domains-certificates) | You can upload a private certificate if you already have one. |

If you chose to manage your own certificate, you can use [Azure Key Vault certificates](./key-vault-certificates-manage.md) to handle security.

## Next steps

> [!div class="nextstepaction"]
> [Set up custom domain with an existing certificate](custom-domains-certificates.md)
