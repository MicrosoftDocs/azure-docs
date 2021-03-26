---
title: Enable CAPTCHA in the self-hosted developer portal
titleSuffix: Azure API Management
description: Learn how to enable CAPTCHA for your self-hosted developer portal in API Management.
author: dlepow
ms.author: apimpm
ms.date: 03/24/2021
ms.service: api-management
ms.topic: how-to
---

# Enable CAPTCHA in the self-hosted developer portal

In the tutorial to [self-host the developer portal](developer-portal-self-host.md#configure-json-files-static-website-and-cors-settings), you may have disabled CAPTCHA through the `useHipCaptcha` setting. Communication with CAPTCHA happens through an endpoint, which lets Cross-Origin Resource Sharing (CORS) happen for only the managed developer portal hostname. If your developer portal is self-hosted, it uses a different hostname and CAPTCHA won't allow the communication.

## Update the JSON config files

To enable the CAPTCHA in your self-hosted portal:

1. Assign a custom domain (for example, `api.contoso.com`) to the **Developer portal** endpoint of your API Management service.

    This domain applies to the managed version of your portal and the CAPTCHA endpoint. For steps, see [Configure a custom domain name for your Azure API Management instance](configure-custom-domain.md).

1. Go to the `src` folder in the [local environment](developer-portal-self-host.md#set-up-local-environment) for your self-hosted portal.

1. Update the configuration `json` files:

    | File | New value | Note |
    | ---- | --------- | ---- |
    | `config.design.json`| `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |
    |  | `"useHipCaptcha": true` | Change the value to `true` |
    | `config.publish.json`| `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |
    |  | `"useHipCaptcha": true` | Change the value to `true` |
    | `config.runtime.json` | `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |

1. [Publish](developer-portal-self-host.md#publish-locally) the portal.

1. [Upload](developer-portal-self-host.md#upload-static-files-to-a-blob) and host the newly published portal.

1. Expose the self-hosted portal through a custom domain.

The portal domain's first and second levels need to match the domain set up in the first step. For example, `portal.contoso.com`. The exact steps depend on your hosting platform of choice. If you used an Azure storage account, you can refer to [Map a custom domain to an Azure Blob Storage endpoint](../storage/blobs/storage-custom-domain-name.md) for instructions.

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Self-host the developer portal](developer-portal-self-host.md)