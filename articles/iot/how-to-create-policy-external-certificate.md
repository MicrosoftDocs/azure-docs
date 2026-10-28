---
title: Bring your own CA
titleSuffix: Azure Device Registry
description: Create or edit an external CA policy in Azure Device Registry so you can use your external CA to issue IoT device certificates.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: how-to
ms.date: 09/16/2026
ai-usage: ai-generated

#Customer intent: As an IoT administrator, I want to create or edit an external CA policy in Azure Device Registry so I can issue and manage device certificates by using my external CA lifecycle.
---

# Bring your own CA

This article explains how to create an intermediate certificate authority within your [Azure Device Registry](../iot-hub/iot-hub-device-registry-overview.md) namespace that is **signed and issued by an external CA.** Use this workflow if your organization maintains a private Public Key Infrastructure (PKI) and requires all IoT devices to chain up to a common trusted root.  

> [!TIP]
> If you do not possess an external root CA but would like to test this flow, see the additional instructions below to get started with a self-signed root CA and private key using OpenSSL.
> 
[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]
## Prerequisites

Before you begin, make sure you have the required setup and permissions so you can create, activate, and edit an external CA policy without deployment delays.

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Device Registry namespace. For setup steps, see [Deploy Azure IoT Hub with ADR integration](../iot-hub/iot-hub-device-registry-setup.md).
- Permissions to manage policies in the Device Registry namespace, such as the [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role.
- CA signing authority: Access to an external PKI (or a managed CA) to perform a one-time signing operation. You need to upload a Microsoft-generated CSR and have your root CA sign it to create the intermediate CA (ICA) certificate.

## Requirements for your external CA

To use an external CA, your CA must meet the following requirements:

| Property| Requirements|
| -------- | -------- |
|Key type and cryptography|The CA key type must be ECC (P-256, P-384, P-521) with `OID 1.2.840.10045.2.1`. Explicit EC parameters are rejected, only named curve encoding (OID) is allowed. **RSA is rejected.**|
|Signature|Signature algorithm must be SHA-256 or higher with ECDSA (ecdsa-with-SHA256, SHA384, or SHA512). SHA-1 is rejected.|
|Path length|Path length for your CA must be set to 1.|
| Subject|The subject on the signed certificate must match the subject from the original CSR (case-insensitive with whitespace normalization)|
|Extensions|BasicConstraints must be present, marked `critical`, with `CA:TRUE`. KeyUsage must include `DigitalSignature`, `KeyCertSign`, and `CrlSign`. If the EKU extension is present, it must include `ClientAuth (OID 1.3.6.1.5.5.7.3.2)`. If EKU is absent entirely, that's acceptable (unconstrained CA per RFC 5280). Subject Key Identifier (SKI) must be present. X.509 Version must be Version 3.|
|Validity period|Certificate must not be expired. Certificate `NotBefore` must not be in the future. Must have at least 365 days of remaining validity.|

Choose the workflow that matches how you operate your environment.

# [Azure portal](#tab/portal)

## Create an intermediate CA that an external CA signs

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open your **Azure Device Registry** namespace.

1. On the **Certificate Authorities** page, select **Create**.

1. Select **Intermediate Certificate Authority.** 

1. Select **Use an external CA**, enter a name for the intermediate CA, and then select **Create**.
1. Refresh the **Certificate Authorities** list if needed. Select the certificate authority and confirm the status is **Pending Activation**.

1. Select the **Pending Activation** link.

1. In the banner, select **Complete Setup.**

1. Select **Download certificate signing request (CSR) file**.

   :::image type="content" source="media/how-to-create-policy-external-certificate/certificate-signing-request-download.png" alt-text="Screenshot showing certificate signing request download link." lightbox="media/how-to-create-policy-external-certificate/certificate-signing-request-download.png":::
   
1. Upload the certificate signing request to your external CA. Have your CA sign the certificate. The signed certificate's subject must exactly match the subject of the original CSR.

    If you don't have an external root CA, you can use this resource to create one: [Create a self-signed root CA and private key using OpenSSL and PowerShell](../iot-hub/reference-self-sign-script.md).
1. Select and upload the **signed full certificate chain.**

1. Select **Save** to activate the certificate authority.

1. Refresh the certificate authority details and verify the status is active.

 

# [Azure CLI](#tab/cli)

## Azure CLI prerequisites

Prepare Azure CLI and sign in so the external CA policy commands run against the correct subscription, resource group, and Device Registry namespace.

- [Azure CLI](/cli/azure/install-azure-cli) installed on your machine.
- The `azure-iot` extension. Install it by running:

  ```azurecli
  az extension add --name azure-iot
  ```

- Sign in to Azure by running `az login`.

## Set variables

Optionally, define reusable variables before you run create, activation, and verification commands.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
SUBCRIPTION_ID="<subscription-id>"
```

## Create an intermediate CA that is signed by an external CA

Run the following command to create an intermediate CA that your external CA signs.

```azurecli
az iot adr ns ca create \
    --name "<external-ica-name>" \
    --ns "$NS_NAME" \
    --resource-group "$RG_NAME" \
    --subscription "$SUBSCRIPTION_ID" \
    --location <location> \
    --type ICA \
    --issuer-type External
```

## Activate the intermediate CA

After creation, the certificate authority is **pending activation** and the service returns a certificate signing request (CSR) file. Look for `certificateSigningRequest` in the console output. Copy the value, including the BEGIN and END markers, to a file called *csr.pem* on your local machine. Submit that CSR to your external CA. Retrieve the full signed certificate chain and upload it to Azure, activating the intermediate certificate authority.

```azurecli
az iot adr ns ca activate \
    --name "<external-ica-name>" \
    --ns "$NS_NAME" \
    --resource-group "$RG_NAME" \ 
    --subscription "$SUBSCRIPTION_ID" \
    --certificate-chain-file "C:\path\to\signed-chain.pem"

```

If you don't have an external root CA, use this sample to create one: [Create a self-signed root CA and private key using OpenSSL and PowerShell](../iot-hub/reference-self-sign-script.md).
## Related content

- [Deploy Azure IoT Hub with ADR integration](../iot-hub/iot-hub-device-registry-setup.md)
- [Set up a Microsoft-managed root and intermediate CA](how-to-create-policy.md)
- [Certificate revocation and policy management](concepts-certificate-policy-management.md)

- [Key concepts for certificate management (preview)](iot-certificate-management-concepts.md)
