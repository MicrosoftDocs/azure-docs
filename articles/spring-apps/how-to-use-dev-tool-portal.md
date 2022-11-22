---
title: Use Tanzu Application Platform GUI tools in Azure Spring Apps
titleSuffix: Azure Spring Apps Enterprise Tier
description: Learn how to use Tanzu Application Platform GUI tools with Azure Spring Apps Enterprise tier.
author: karlerickson
ms.author: zlhe
ms.service: spring-apps
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Tanzu Application Platform GUI tools in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

VMware Tanzu Dev Tools includes a set of developer tools to help ease developer experience for both inner and outer loop. For now, it includes App live view and app accelerator in Enterprise tier. Dev Tools has a centralized portal - Dev Tools Portal which serves as the place to access any Dev Tools. here in this article, you can learn how to configure Dev Tools centrally against Dev Tools Portal on SSO config and endpoint exposure so that you can get access to any Dev tools.

[Dev Tools Portal](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-tap-gui-about.html) is a tool for your developers to view your applications and services running for your organization.

## Prerequities
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To provision an Azure Marketplace offer purchase, see the [Prerequisites](how-to-enterprise-marketplace-offer.md#prerequisites) section of [View Azure Spring Apps Enterprise tier offering from Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- [Create custom roles that delegate permissions to Azure Spring Apps resources](https://learn.microsoft.com/en-us/azure/spring-apps/how-to-permissions?tabs=Azure-portal).

## Configure Dev Tools Portal

The following sections describe configuration in Dev Tools Portal.

### Configure single sign-on (SSO)

Dev Tools Portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Only authorization servers supporting the OpenID Connect Discovery protocol are supported. Be sure to configure the external authorization server to allow redirects back to the Dev Tools Portal. Refer to your authorization server's documentation and add `https://<dev-tool-portal-external-url>/api/auth/oidc/handler/frame` to the list of allowed redirect URIs.

| Property | Required? | Description |
| - | - | - |
| metadataUri | Yes | The URI of a JSON file with generic OIDC provider configuration. The result is expected to be an OpenID Provider Configuration Response. |
| clientId | Yes | The OpenID Connect client ID provided by your IdP |
| clientSecret | Yes | The OpenID Connect client secret provided by your IdP |
| scopes | Yes | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider |

> [!NOTE]
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.

#### [Portal](#tab/Portal)
1. Open the [Azure portal](https://portal.azure.com).
1. Select **Developer Tools (Preview)**.
1. Select **Configuration** tab.
1. Update **Scope**, **Client ID**, **Client Secret** and **Metadata Url** in the form. Then click **Save** button.
1. After SSO configuration saved successfully, click **Assign endpoint** button to expose public endpoint.

#### [CLI](#tab/Azure-CLI)
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

## Assign public endpoint

#### [Portal](#tab/Portal)
To access Dev Tools Portal, use the following steps to assign a public endpoint:

1. Select **Developer Tools (Preview)**.
1. Click *Assign endpoint* button to assign a public endpoint. A URL will be generated within a few minutes.
1. Save the URL for use later. Application Live View and Application Accelerator will then get their corresponding endpoints.

#### [CLI](#tab/Azure-CLI)
You can use the Azure CLI to assign a public endpoint with the following command:

```azurecli
az spring dev-tool update \
    --resource-group <resource-group-name> \
    --name <Azure-Spring-Apps-service-instance-name> \
    --assign-endpoint
```
