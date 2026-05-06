---
title: Revoke Certificates and Delete Policies in Azure Device Registry
titleSuffix: Azure IoT Hub
description: Learn how to revoke device and policy certificates, and delete policies and credential resources in Azure Device Registry for IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ai-usage: ai-generated
ms.date: 04/14/2026
#Customer intent: As an IoT Hub administrator, I want to revoke certificates and delete policies or credential resources so I can protect production devices and manage certificate lifecycle operations safely.
---

# Revoke certificates and delete policies (preview)

This article shows you how to run certificate lifecycle operations for Azure Device Registry in Azure IoT Hub:

- Revoke certificates at the device level.
- Revoke certificates at the policy level.
- Delete a policy.
- Delete a credential resource.

Use these procedures when you need to respond to a security event, retire certificate resources, or clean up certificate paths in production.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Prerequisites

Before you begin, make sure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).
- An existing production deployment with IoT Hub Gen2 linked to a Device Registry namespace. For setup steps, see [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md).
- A configured credential and policy in the Device Registry namespace. For setup steps, see [Configure a Root CA credential in Azure Device Registry](how-to-configure-credential.md).
- Device Provisioning Service (DPS) configured for devices that use operational certificate issuance and rotation.
- The [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role on the Device Registry namespace.

# [Azure portal](#tab/portal)

## Revoke certificates for a device

Use these steps to rotate one device certificate when you need to isolate risk to a single device.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your **Azure Device Registry** namespace.
1. Under **Namespace resources** on the sidebar menu, select **Devices**.
1. Select the target device.
1. Select **Revoke device certificates**.
1. (Optional) Select **Also disable device after revoking** if you need to block device authentication.
1. Confirm the operation.

## Revoke certificates for a policy

Use these steps to rotate a policy issuer when you need to invalidate certificates issued by that policy.

1. Open your **Azure Device Registry** namespace.
1. Under **Namespace resources** on the sidebar menu, select **Credential Policies**.
1. Select the target policy.
1. Select **Revoke certificates**, and confirm the operation.

For a standard policy that uses your namespace's root CA, Azure Device Registry rotates the issuing CA and syncs the replacement CA to linked hubs.

For a policy that uses an external root, you cannot revoke the policy on Azure Device Registry as the CRL is also external. You must ensure that the revocation also propagates to that external CA's certificate revocation list (CRL) or OCSP responder. We require that you revoke all of your leaf certificates and then delete your policy.

## Delete a policy

Use these steps to remove a policy when you no longer need it for certificate issuance.

1. Open your **Azure Device Registry** namespace.
1. Under **Namespace resources** on the sidebar menu, select **Credential policies**.
1. Select the target policy.
1. Select **Delete policy**, and confirm the operation.

## Delete a credential resource

Use these steps to remove a credential resource when you need to retire that certificate path.

1. Open **Credential policies** in your Device Registry namespace.
1. Select the credential resource.
1. Select **Delete**, and confirm the delete operation.

# [Azure CLI](#tab/cli)

## Set variables

Define shared variables first so you can reuse the same values across all commands and reduce input errors.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
HUB_NAME="<iot-hub-name>"
POLICY_NAME="<policy-name>"
DEVICE_ID="<device-id>"
```

## Revoke a device

Run this command to revoke a device from Device Registry.

```azurecli
az iot adr ns device revoke \
  -n <device-id> \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  -y
```

To revoke a device and also disable it, run the following command.

```azurecli
az iot adr ns device revoke \
  -n <device-id> \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  -disable
  -y
```

## Revoke certificates for a policy that uses the namespace-level root CA

Run this command to rotate a standard policy issuer and trigger the service-managed revoke flow.

```azurecli
az iot adr ns policy revoke-issuer \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --policy-name "$POLICY_NAME" \
  -y
```


## Delete a policy

Run this command to remove a policy that you no longer need in the namespace.

```azurecli
az iot adr ns policy delete \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --policy-name "$POLICY_NAME" \
  -y
```

Run this command to confirm the deleted policy no longer appears.

```azurecli
az iot adr ns policy list --ns "$NS_NAME" -g "$RG_NAME"
```

Verify that the deleted policy no longer appears.

## Delete a credential resource

Run this command to remove the credential resource when you retire that trust anchor path.

```azurecli
az iot adr ns credential delete \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --credential-name default \
  -y
```

Run this command to confirm the credential resource is no longer available.

```azurecli
az iot adr ns credential show \
  --ns "$NS_NAME" \
  -g "$RG_NAME" \
  --credential-name default
```

Verify that the credential resource is no longer available.

---

## Related content

- [Certificate revocation and policy management concepts](concepts-certificate-policy-management.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md)
