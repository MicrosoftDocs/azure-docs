---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

In the previous tutorial ([[Self-hosting the portal]]), we recommended disabling CAPTCHA through the setting `"useHipCaptcha": false`. Communication with CAPTCHA happens through an endpoint, which allows CORS only for the managed developer portal hostname. If your portal is self-hosted, it uses a different hostname and the communication won't be allowed.

To enable the CAPTCHA in your self-hosted portal you need to:

1. Assign a custom domain (for example, `api.contoso.com`) to the **Developer portal** endpoint of your API Management service. This domain applies to the managed version of your portal as well as the CAPTCHA endpoint. [The official Azure documentation article](https://docs.microsoft.com/azure/api-management/configure-custom-domain) describes how to set the custom domain.
1. Update the configuration of your self-hosted portal:

    | File | New value |
    | -- | -- |
    | `./src/config.design.json`| `"backendUrl": "https://api.contoso.com"` (replace with the custom hostname) |
    | `./src/config.design.json`| `"useHipCaptcha": true` |
    | `./src/config.publish.json`| `"backendUrl": "https://api.contoso.com"` (replace with the custom hostname) |
    | `./src/config.publish.json` | `"useHipCaptcha": true` |
    | `./src/config.runtime.json` | `"backendUrl": "https://api.contoso.com"` (replace with the custom hostname) |

1. Run the portal's publishing step.
1. Upload and host the newly published portal.
1. Expose the self-hosted portal through a custom domain. The portal domain's first and second levels need to match those of the domain assigned in the first step (for example, `portal.contoso.com`). The exact steps depend on your hosting platform of choice. If you used the Azure Storage Account, you can refer to [the official Azure documentation](https://docs.microsoft.com/azure/storage/blobs/storage-custom-domain-name) for instructions.
