---
title: Configure your environment for Datadog
description: This article describes how to configure your Azure environment to create an instance of Datadog.
author: pdjokar96
ms.author: piyushdash
ms.topic: how-to
ms.date: 03/10/2025
ms.custom: sfi-image-nochange
---

# Configure your environment for Datadog

Before you create a Datadog resource, you must configure your Azure environment. This article walks through every prerequisite so you can complete the setup in one pass.

## Prerequisites checklist

Review the following requirements before you begin:

| Requirement | Details |
|------------|---------|
| **Azure account** | An active Azure subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you don't have one. |
| **Azure role** | **Owner** access on the subscription. [Check your access](../../role-based-access-control/check-access.md) before you begin. The Owner role is required because the integration creates role assignments (Monitoring Reader) and diagnostic settings on your resources. |
| **Resource provider** | `Microsoft.Datadog` must be registered in your subscription. Azure registers it automatically when you create a Datadog resource, but if your organization restricts resource provider registration, you may need to register it manually. |
| **Enterprise application** (for SSO) | Required only if you want single sign-on. See [Add enterprise application](#add-enterprise-application) below. |

### Verify resource provider registration

To check whether `Microsoft.Datadog` is registered in your subscription:

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider show --namespace Microsoft.Datadog --query "registrationState" --output tsv
```

If the output isn't `Registered`, register it:

```azurecli
az provider register --namespace Microsoft.Datadog
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResourceProvider -ProviderNamespace Microsoft.Datadog | Select-Object RegistrationState
```

If the output isn't `Registered`, register it:

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Datadog
```

# [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to **Subscriptions** and select your subscription.
2. In the service menu, select **Settings** > **Resource providers**.
3. Search for **Microsoft.Datadog**.
4. If the status isn't **Registered**, select the provider and select **Register**.

---

> [!NOTE]
> Resource provider registration is a one-time operation per subscription.

## Add enterprise application

To use the Security Assertion Markup Language (SAML) single sign-on (SSO) feature within the Datadog resource, you must set up an enterprise application in Microsoft Entra ID. To add an enterprise application, you need one of these roles: Cloud Application Administrator, Application Administrator, or owner of the service principal.

> [!TIP]
> If you don't need SSO, you can skip this step and proceed directly to [creating a Datadog resource](create.md). You can configure SSO later.

Use the following steps to set up the enterprise application:

1. Go to [Azure portal](https://portal.azure.com). Select **Microsoft Entra ID**.
1. In the left pane, select **Manage > Enterprise applications**.
1. Select **New Application**.
1. In **Add from the gallery**, search for *Datadog*. Select the search result then select **Add**.
1. Once the app is created, go to properties from the side panel. Set **User assignment required?** to **No**, and select **Save**.
1. Go to **Single sign-on** from the side panel. Then select **SAML**.
1. Select **Yes** when prompted to save single sign-on settings.

The following SAML values are preconfigured by the Datadog gallery app:

| Setting | Expected value |
|---------|---------------|
| **Identifier (Entity ID)** | `https://us3.datadoghq.com/account/saml/metadata.xml` |
| **Reply URL (ACS URL)** | `https://us3.datadoghq.com/account/saml/assertion` |

> [!IMPORTANT]
> If another enterprise application in your tenant already uses the same SAML identifier, you see an error when saving. Either disable the conflicting app or use it as the enterprise app for Datadog SSO. See [Troubleshooting SSO](troubleshoot.md#single-sign-on-errors) for more information.

### Verify SSO configuration

After setting up the enterprise application, verify the configuration:

1. In **Microsoft Entra ID** > **Enterprise applications**, find and select your Datadog app.
2. Select **Single sign-on** from the service menu.
3. Confirm the **SAML Signing Certificate** section shows an active certificate.
4. Confirm the **Identifier** and **Reply URL** values match the expected values above.

## Next steps

Your environment is ready. Proceed to create your Datadog resource:

> [!div class="nextstepaction"]
> [QuickStart: Create a new Datadog resource](create.md)

- [Link to an existing Datadog organization](link-to-existing-organization.md)

