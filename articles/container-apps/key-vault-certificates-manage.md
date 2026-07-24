---
title: Import Certificates from Azure Key Vault to Azure Container Apps
description: Find out how to use Azure Key Vault to manage certificates for Azure Container Apps. Follow steps for importing a certificate into a container app environment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 11/14/2025
ms.author: cshoe
# customer intent: As a developer, I want to find out how to import an Azure Key Vault certificate into an Azure Container Apps environment so that I can use Key Vault to centrally manage my container app certificates.
---

# Import certificates from Azure Key Vault to Azure Container Apps

You can use Azure Key Vault to centrally manage Transport Layer Security (TLS) and Secure Sockets Layer (SSL) certificates for your container app. Key Vault can handle certificate updates, renewals, and monitoring.

This article shows you how to import a Key Vault certificate into an Azure Container Apps environment.

## Prerequisites

- A Key Vault resource
- A certificate stored in your key vault

For steps to create a key vault and add a certificate, see [Import a certificate in Azure Key Vault](/azure/key-vault/certificates/tutorial-import-certificate?tabs=azure-portal) or [Configure certificate autorotation in Key Vault](/azure/key-vault/certificates/tutorial-rotate-certificates).

## Exceptions

Container Apps supports most certificate types. But there are a few exceptions to keep in mind:

- Elliptic Curve Digital Signature Algorithm (ECDSA) p384 and p521 certificates aren't supported.
- If you want to use an Azure App Service certificate, you need to use the Azure CLI to import it from Key Vault into Container Apps. This article shows you how to use the Azure portal to import a certificate. But you can't use the Azure portal to import App Service certificates, due to how these certificates are saved in Key Vault.

## Enable managed identity for your Container Apps environment

Container Apps uses an environment-level managed identity to access your key vault and import your certificate. You can use a system-assigned identity or a user-assigned identity for this purpose. To use a system-assigned managed identity, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com), and then go to the Container Apps environment that you want to import a certificate into.

1. Select **Settings** > **Identity**.

1. On the **System assigned** tab, turn on the **Status** switch.

1. Select **Save**. When the **Enable system assigned managed identity** window appears, select **Yes**.

1. Under **Permissions**, select **Azure role assignments** to open the role assignments window.

1. Select **Add role assignment**, and then select the following values:

    | Property | Value |
    |--|--|
    | Scope | **Key Vault** |
    | Subscription | Your Azure subscription |
    | Resource | Your key vault |
    | Role | **Key Vault Secrets User** |

1. Select **Save**.

Key Vault offers two authorization systems: Azure role-based access control (Azure RBAC) and a legacy access policy model. For detailed information about the two systems, see [Azure role-based access control (Azure RBAC) vs. access policies (legacy)](/azure/key-vault/general/rbac-access-policy).

## Import a certificate from Key Vault

To import a certificate from Key Vault into your container app environment, take the steps in the following sections.

### Initiate the process

1. In the Azure portal, go to your container app environment.

1. Select **Settings** > **Certificates**.

1. Go to the **Bring your own certificates (.pfx)** tab.

1. Select **Add certificate**.

### Add the certificate

1. In the **Add certificate** dialog, next to **Source**, select **Import from Key Vault**.

1. Select **Select key vault certificate**, and then select the following values:

    | Property | Value |
    |--|--|
    | Subscription | Your Azure subscription |
    | Key vault | Your key vault |
    | Certificate | Your certificate |

    > [!NOTE]
    > If an error message appears that says, "The operation 'List' is not enabled in this key vault's access policy," you need to configure an access policy in your key vault to allow your user account to list certificates. For more information, see [Assign a Key Vault access policy (legacy)](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).

1. Select **Select**.

1. In the **Add certificate** dialog, next to **Managed identity**, select **System assigned**. If you're using a user-assigned managed identity, select your user-assigned managed identity instead.

1. Select **Add**.

> [!NOTE]
> If an error message appears, verify that the managed identity is assigned the **Key Vault Secrets User** role for your key vault.

## Configure a custom domain

After you configure your certificate, you can use it to help secure your custom domain. Follow the steps in [Add a custom domain and certificate](custom-domains-certificates.md#add-a-custom-domain-and-certificate), and select the certificate you imported from Key Vault.

## Rotate certificates

When you rotate your certificate in Key Vault, Container Apps automatically updates the certificate in your environment. It takes up to 12 hours for the new certificate to be applied.

## Next step

> [!div class="nextstepaction"]
> [Certificates in Azure Container Apps](certificates-overview.md)
