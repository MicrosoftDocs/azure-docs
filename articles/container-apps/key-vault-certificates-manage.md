---
title: Import certificates from Azure Key Vault to Azure Container Apps
description: Learn to managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 08/14/2024
ms.author: cshoe
---

# Import certificates from Azure Key Vault to Azure Container Apps

You can set up Azure Key Vault to centrally manage your container app's TLS/SSL certificates and handle updates, renewals, and monitoring.

## Prerequisites

An Azure Key Vault resource is required to store your certificate. See [Import a certificate in Azure Key Vault](/azure/key-vault/certificates/tutorial-import-certificate?tabs=azure-portal) or [Configure certificate auto-rotation in Key Vault](/azure/key-vault/certificates/tutorial-rotate-certificates) to create a Key Vault and add a certificate.

## Enable managed identity for Container Apps environment

Azure Container Apps uses an environment level managed identity to access your Key Vault and import your certificate. To enable system-assigned managed identity, follow these steps:

1. Open the [Azure portal](https://portal.azure.com) and find your Azure Container Apps environment where you want to import a certificate.

1. From *Settings*, select **Identity**.

1. On the *System assigned* tab, find the *Status* switch and select **On**.

1. Select **Save**, and when the *Enable system assigned managed identity* window appears, select **Yes**.

1. Under the *Permissions* label, select **Azure role assignments** to open the role assignments window.

1. Select **Add role assignment** and enter the following values:

    | Property | Value |
    |--|--|
    | Scope | Select **Key Vault**. |
    | Subscription | Select your Azure subscription. |
    | Resource | Select your vault. |
    | Role | Select **Key Vault Secrets User**. |

1. Select **Save**.

For more detail on RBAC vs. legacy access policies, see [Azure role-based access control (Azure RBAC) vs. access policies](/azure/key-vault/general/rbac-access-policy).

## Import certificate from Key Vault

1. Open the Azure portal and go to your Azure Container Apps environment.

1. From *Settings*, select **Certificates**.

1. Select the **Bring your own certificates (.pfx)** tab.

1. Select **Add certificate**.

1. In the *Add certificate* panel, in *Source*, select **Import from Key Vault**.

1. Select **Select key vault certificate** and select the following values:

    | Property | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |
    | Key vault | Select your vault. |
    | Certificate | Select your certificate. |

    > [!NOTE]
    > If you see an error, *"The operation "List" is not enabled in this key vault's access policy."*, you need to configure an access policy in your Key Vault to allow your user account to list certificates. For more information, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).

1. Select **Select**.

1. In the *Add certificate* panel, in *Managed identity*, select **System assigned**. If you're using a user-assigned managed identity, select your user-assigned managed identity.

1. Select **Add**.

> [!NOTE]
> If you receive an error message, verify that the managed identity is assigned the **Key Vault Secrets User** role on the Key Vault.

## Configure a custom domain

After configuring your certificate, you can use it to secure your custom domain. Follow the steps in [Add a custom domain](custom-domains-certificates.md#add-a-custom-domain-and-certificate) and select the certificate you imported from Key Vault.

## Rotate certificates

When you rotate your certificate in Key Vault, Azure Container Apps automatically updates the certificate in your environment. It takes up to 12 hours for the new certificate to be applied.

## Related

> [!div class="nextstepaction"]
> [Certificates in Azure Container Apps](certificates-overview.md)
