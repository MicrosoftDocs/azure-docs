---
title: How to use Dev Tool Portal for VMware Tanzu with Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to use Dev Tool Portla for VMware Tanzu with Azure Spring Apps Enterprise Tier.
author: 
ms.author: zlhe
ms.service: spring-apps
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Dev Tool Portal
> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use Dev Tool Portal for VMware Tanzu® with Azure Spring Apps Enterprise Tier.

[Dev Tool Portal](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-tap-gui-about.html) is a tool for your developers to view your applications and services running for your organization.

## Prerequities
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To provision an Azure Marketplace offer purchase, see the [Prerequisites](how-to-enterprise-marketplace-offer.md#prerequisites) section of [View Azure Spring Apps Enterprise tier offering from Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Configure Dev Tool Portal

The following sections describe configuration in Dev Tool Portal.

### Configure single sign-on (SSO)

Dev Tool Portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Only authorization servers supporting the OpenID Connect Discovery protocol are supported. Be sure to configure the external authorization server to allow redirects back to the Dev Tool Portal. Refer to your authorization server's documentation and add `https://<dev-tool-portal-external-url>/api/auth/oidc/handler/frame` to the list of allowed redirect URIs.

| Property | Required? | Description |
| - | - | - |
| metadataUri | Yes | The URI of a JSON file with generic OIDC provider configuration. The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scopes | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

To set up SSO with Azure AD, see [How to set up single sign-on with Azure AD for Spring Cloud Gateway and API Portal for Tanzu](./how-to-set-up-sso-with-azure-ad.md).

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

To update SSO configuration and expose to public with Azure CLI, run the following command:

```azurecli
az spring dev-tool update \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-service-instance-name> \
    --client-id "<client-id>" \
    --scopes "scope1,scope2" \
    --client-secret "<client-secret>" \
    --metadata-url "https://example.com/.well-known/openid-configuration"
    --assign-endpoint
```

## Assign a public endpoint for Dev Tool Portal

To access Dev Tool Portal, use the following steps to assign a public endpoint:

1. Select **Developer Tools (Preview)**.
1. Click *Assign endpoint* button to assign a public endpoint. A URL will be generated within a few minutes.
1. Save the URL for use later.

You can also use the Azure CLI to assign a public endpoint with the following command:

```azurecli
az spring dev-tool update \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-service-instance-name> \
    --assign-endpoint
```
