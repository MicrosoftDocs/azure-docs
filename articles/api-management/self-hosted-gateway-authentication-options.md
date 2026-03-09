---
title: Authentication Options for Self-hosted Gateway - Azure API Management
description: Options for the Azure API Management self-hosted gateway to authenticate to the cloud-based API Management instance.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 02/19/2026
ms.author: danlep
---

# Self-hosted gateway authentication options

The gateway container's [configuration settings](self-hosted-gateway-settings-reference.md) provide options for authenticating the connection between the self-hosted gateway and the cloud-based API Management instance's configuration endpoint.

## Options and considerations

The following table lists authentication options for the self-hosted gateway and considerations for each option. The linked articles provide step-by-step instructions for how to configure each authentication method.

|Option  |Considerations  |
|---------|---------|
| [Microsoft Entra ID workload identity authentication](self-hosted-gateway-enable-workload-identity.md)   | No secrets or certificates to manage - uses federated identity credentials.<br/><br/>Automatic token rotation with short-lived tokens.<br/><br/>Native integration with Azure Kubernetes Service.        |
| [Microsoft Entra ID authentication with client secret](self-hosted-gateway-enable-azure-ad.md)   | Configure Microsoft Entra apps with client secrets or certificates.<br/><br/>Manage access per app with custom role assignments.<br/><br/>Configure secret expiration times per your organization's policies.<br/><br/>Use standard Microsoft Entra procedures to rotate secrets.        |
| [Access token](self-hosted-gateway-default-authentication.md) (also called *gateway token* or an *authentication key*)    |  Token expires at least every 30 days and must be renewed.<br/><br/>Backed by a gateway key that you can rotate independently.<br/><br/>Regenerating the gateway key invalidates all access tokens.<br/><br/>System events are generated when a self-hosted gateway access token is near expiration or expires.      |

## Related content

- Learn more about the API Management [self-hosted gateway](self-hosted-gateway-overview.md).
- Learn more about [Microsoft Entra workload identity for AKS](/azure/aks/workload-identity-overview).
- Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).
