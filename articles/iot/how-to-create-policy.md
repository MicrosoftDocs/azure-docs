---
title: Set up a managed root and intermediate CA
titleSuffix: Azure Device Registry
description: Learn how to provision a Microsoft-managed root certificate authority and create an intermediate CA policy in Azure Device Registry.
author: dimatx
ms.author: dimatokar
ms.service: azure-device-registry
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 09/16/2026

# Customer intent: As an IoT administrator, I want to set up a root and intermediate certificate authority so that Azure Device Registry can issue device certificates.
---

# Set up a managed root and intermediate CA

This article explains how to create root and intermediate certificate authorities within your [Azure Device Registry](../iot-hub/iot-hub-device-registry-overview.md) namespace. Use this workflow if you want Azure Device Registry to provision certificate authorities in Microsoft cloud PKI on your behalf.

For information about how the root and intermediate CAs establish trust, see [CA hierarchy in Azure Device Registry](concept-managed-ca-hierarchy.md).

## Prerequisites

Before you begin, make sure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Device Registry namespace. For setup instructions, see [Get started with Azure Device Registry for Azure IoT Hub](device-registry/get-started-azure-device-registry.md).
- Permission to create and manage certificate authorities in this Azure Device Registry namespace, such as the [Azure Device Registry Administrator](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-administrator) role. If you don't have access, ask your Azure administrator to assign you this role on the namespace.
## Set up the certificate authorities

Use the Azure portal or Azure CLI to create root and intermediate certificate authorities.

# [Azure portal](#tab/portal)

### Create a root CA

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
After you create an intermediate CA, you must create a certificate policy before you can issue device certificates. For instructions, see [Create or edit a certificate policy](how-to-create-edit-certificate-policy.md).

# [Azure CLI](#tab/cli)

### Prepare the Azure CLI

1. [Install Azure CLI](/cli/azure/install-azure-cli). To check the installed version, run `az version`. To install the latest version, run `az upgrade`.
1. Sign in to Azure by running `az login`.
1. Install the `azure-iot` extension when prompted on first use. To update an existing installation, run `az extension update --name azure-iot`.

### Set variables

The following examples use Bash syntax. Optionally, define shared variables for the commands in this article. If you don't set these variables, replace each variable reference in the commands with its value.

You must create certificate authorities in the same region as their Azure Device Registry namespace.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
SUBSCRIPTION_ID="<subscription-id>"
```

### Create the root CA

Run the following command to enable certificate management and provision a root CA for the namespace:

```azurecli
az iot adr ns ca create --name "<root-ca-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription "$SUBSCRIPTION_ID" --type Root
```

Verify that provisioning succeeded and review the root CA certificate information:

```azurecli
az iot adr ns ca show --name "<root-ca-name>" --namespace "$NS_NAME" --resource-group "$RG_NAME" --subscription "$SUBSCRIPTION_ID"
```

### Create an intermediate CA

Create an intermediate certificate authority that's issued by the namespace root CA.

```azurecli
az iot adr ns ca create --name "<ica-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription "$SUBSCRIPTION_ID" --type ICA --issuer-type Microsoft --issuer-ca-name "<root-ca-name>"

```

Verify that the intermediate certificate authority properties match the values that you specified:


```azurecli
az iot adr ns ca show --ca-name "<ica-name>" --ns "$NS_NAME" --resource-group "$RG_NAME" --subscription "$SUBSCRIPTION_ID"
```

After you create an intermediate CA, you must create a certificate policy before you can issue device certificates. For instructions, see [Create or edit a certificate policy](how-to-create-edit-certificate-policy.md).

---

## Related content

- [CA hierarchy in Azure Device Registry](concept-managed-ca-hierarchy.md)
- [Create an intermediate CA with an external root CA](how-to-create-policy-external-certificate.md)
- [Certificate revocation and policy management](concepts-certificate-policy-management.md)

- [Key concepts for certificate management](iot-certificate-management-concepts.md)
