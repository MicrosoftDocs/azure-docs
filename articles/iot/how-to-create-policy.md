---
title: Set up a managed root and intermediate CA (preview)
titleSuffix: Azure Device Registry
description: Learn how to provision a Microsoft-managed root certificate authority and create an intermediate CA policy in Azure Device Registry.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 09/16/2026

# Customer intent: As an IoT administrator, I want to set up a root and intermediate certificate authority so that Azure Device Registry can issue device certificates.
---

# Set up a managed root and intermediate CA (preview)

This article explains how to create root and intermediate certificate authorities within your [Azure Device Registry](../iot-hub/iot-hub-device-registry-overview.md) namespace. Use this workflow if you want Azure Device Registry to provision certificate authorities in Microsoft cloud PKI on your behalf.

[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]

For information about how the root and intermediate CAs establish trust, see [CA hierarchy in Azure Device Registry](concept-managed-ca-hierarchy.md).

## Prerequisites

Before you begin, make sure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Device Registry namespace. For setup instructions, see [Deploy Azure IoT Hub with ADR integration and certificate management](../iot-hub/iot-hub-device-registry-setup.md).
- Permission to manage certificate authorities and policies in the namespace, such as the [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role.
## Set up the certificate authorities

Use the Azure portal or Azure CLI to create root and intermediate certificate authorities.

# [Azure portal](#tab/portal)

### Create a root CA

#### Option 1: Create a root CA for a new namespace

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Device Registry**.
1. Select **Namespaces**, and then select **Create** to create a new namespace. Check the box to let Azure create a Microsoft-managed root CA by default, or leave it unchecked if you plan to bring your own external root CA.

   :::image type="content" source="media/how-to-create-policy/create-namespace.png" alt-text="Screenshot of portal page showing create namespace." lightbox="media/how-to-create-policy/create-namespace.png":::
   
#### Option 2: Create a root CA for an existing namespace

1. In the **Namespaces** list, select your namespace.
1. Under **Security**, select **Certificate Authorities**.
1. Select **Create**. **Root Certificate Authority** is disabled if the namespace already has one root CA by default.

   :::image type="content" source="media/how-to-create-policy/create-certificate-authority.png" alt-text="Screenshot of the credential policies portal page showing the option to create a policy." lightbox="media/how-to-create-policy/create-certificate-authority.png":::  

1. Select **Root Certificate Authority**. 
1. Give the certificate authority a name that is 3-63 characters in length, then select **Create**.
1. Wait for Azure to finish provisioning the root CA. When provisioning is complete, the resource appears on the **Certificate Authorities** page.

### Create an intermediate certificate authority

1. On the **Certificate Authorities** page, select **Create**.
1. Select **Intermediate Certificate Authority.** 

1. Select **Use this namespace's Root CA**, enter a name for the intermediate CA, and then select **Create**.
# [Azure CLI](#tab/cli)

### Prepare the Azure CLI

1. [Install Azure CLI](/cli/azure/install-azure-cli). To check the installed version, run `az version`. To install the latest version, run `az upgrade`.
1. Sign in to Azure by running `az login`.
1. Install the `azure-iot` extension when prompted on first use. To update an existing installation, run `az extension update --name azure-iot`.

### Set variables

Optionally, define variables for the commands in this article.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
```

### Create the root CA

Run the following command to enable certificate management and provision a root CA for the namespace:

```azurecli
az iot adr ns ca create --name "<root-ca-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription <subscription_id> --location <region> --type Root
```

Verify that provisioning succeeded and review the root CA certificate information:

```azurecli
az iot adr ns ca show --name "<root-ca-name>" --namespace "$NS_NAME" --resource-group "$RG_NAME"
```

### Create an intermediate CA

Create an intermediate certificate authority that's issued by the namespace root CA.

```azurecli
az iot adr ns ca create --name "<ica-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription <subscription_id> --location <location> --type ICA --issuer-type Microsoft --issuer-ca-name "<root-ca-name>"

```

Verify that the intermediate certificate authority properties match the values that you specified:

```azurecli
az iot adr ns ca show --ca-name "<ica-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription <subscription_id>
```

---

## Related content

- [CA hierarchy in Azure Device Registry](concept-managed-ca-hierarchy.md)
- [Create an intermediate CA with an external root CA](how-to-create-policy-external-certificate.md)
- [Certificate revocation and policy management](concepts-certificate-policy-management.md)

- [Key concepts for certificate management](iot-certificate-management-concepts.md)
