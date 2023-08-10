---
title: Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan
description: Learn how to use Tanzu Dev Tools in the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: zlhe
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/28/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
---

# Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article describes how to configure VMware Tanzu Dev Tools. Dev Tools includes a set of developer tools to help make the development experience easier for both the inner and outer loop. Currently, Dev Tools includes Application Live View and Application Accelerator for use with the Azure Spring Apps Enterprise plan.

[Dev Tools Portal](https://docs.vmware.com/en/VMware-Tanzu-Application-Platform/1.3/tap/GUID-tap-gui-about.html) is a centralized portal that you can use to access any Dev Tools. You can use Dev Tools Portal to view the applications and services running for your organization. In this article, you learn how to use Dev Tools Portal to configure single sign-on (SSO) and endpoint exposure so that you can get access to any Dev Tools.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [Azure CLI](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. Use the following command to remove previous versions and install the latest extension. If you previously installed the `spring-cloud` extension, uninstall it to avoid configuration and version mismatches.

  ```azurecli
  az extension remove --name spring
  az extension add --name spring
  az extension remove --name spring-cloud
  ```

- Custom roles that delegate permissions to Azure Spring Apps resources. For more information, see [How to use permissions in Azure Spring Apps](how-to-permissions.md).

## Configure Dev Tools Portal

Dev Tools Portal supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider (IdP) that supports the OpenID Connect Discovery protocol.

> [!NOTE]
> Azure Spring Apps supports only authorization servers that support the OpenID Connect Discovery protocol. Make sure to configure the external authorization server to allow redirects back to the Dev Tools Portal. See your authorization server's documentation and add `https://dev-tool-portal-external-url/oauth2/callback` to the list of allowed redirect URIs.

The following table describes SSO properties:

| Property       | Required? | Description                                                                                                                                     |
|----------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `metadataUri`  | Yes       | The URI of a JSON file with generic OIDC provider configuration. The result is expected to be an OpenID Provider Configuration Response.        |
| `clientId`     | Yes       | The OpenID Connect client ID provided by your IdP.                                                                                              |
| `clientSecret` | Yes       | The OpenID Connect client secret provided by your IdP.                                                                                          |
| `scopes`       | Yes       | A list of scopes to include in JSON Web Token (JWT) identity tokens. This list should be based on the scopes allowed by your identity provider. |

> [!NOTE]
> If you configure an SSO property incorrectly, such as providing the wrong password, remove the property and add it again with the correct configuration.

You can configure Dev Tools Portal using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to configure Dev Tools Portal using the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).
1. Select **Developer Tools**.
1. Select the **Configuration** tab.
1. On the **Configuration** page, update **Scope**, **Client ID**, **Client Secret**, and **Metadata Url**, and then select **Save**.
1. Select **Assign endpoint** to expose the public endpoint.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to update the SSO configuration using the Azure CLI:

```azurecli
az spring dev-tool update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --client-id "<client-id>" \
    --scopes "scope1,scope2" \
    --client-secret "<client-secret>" \
    --metadata-url "https://example.com/.well-known/openid-configuration"
    --assign-endpoint
```

---

## Assign public endpoint

You can assign a public endpoint using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to access Dev Tools Portal and assign a public endpoint:

1. Select **Developer Tools**.
1. Select **Assign endpoint** to assign a public endpoint. Azure Spring Apps generates a URL within a few minutes.
1. Save the URL for use later. Application Live View and Application Accelerator will then get their corresponding endpoints.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to assign a public endpoint using the Azure CLI:

```azurecli
az spring dev-tool update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --assign-endpoint
```

---

## Next steps

- [Azure Spring Apps](index.yml)
