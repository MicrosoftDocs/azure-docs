---
title: Certificate revocation (preview)
titleSuffix: Azure Device Registry
description: Learn about certificate revocation and policy management, and how to revoke certificates and delete policies and credentials in Azure Device Registry for IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 08/31/2026

#Customer intent: As an IoT Hub administrator or security team member, I want to understand and perform certificate revocation and policy management operations, so that I can protect production devices and manage certificate lifecycles safely.
---

# Certificate revocation (preview)

Certificate management in Azure Device Registry enables you to issue, manage, and revoke X.509 certificates throughout their lifecycle. This article explains the key concepts related to revoking intermediate certificate authorities (CAs) and device certificates. These operations are part of a coordinated lifecycle management strategy that helps you maintain your security posture when certificates expire, devices are decommissioned, or business requirements change.

[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]

## Prerequisites

Before you begin, make sure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A configured intermediate certificate authority Azure Device Registry namespace. For setup steps, see [Set up a root and intermediate CA](how-to-create-policy.md).
- Device Provisioning Service (DPS) configured for devices that use operational certificate issuance and rotation.
- The [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role assigned on the Azure Device Registry namespace. This role grants full access to manage certificates. If you don't have this role assigned, contact your Azure administrator.

## Revoking device certificates

When you revoke a device certificate in Azure Device Registry (ADR), you revoke all certificates that you ever issued to that device. As part of this process, the device certificate's unique identifier is added to the issuing CA's Certificate Revocation List (CRL), preventing the device from authenticating to IoT Hub by using any previously issued certificate. The certificate revocation list is available via the Certificate Distribution Point (CDP) on the certificate.

To restore connectivity, the device must be reprovisioned and request a new certificate. This action is recommended when a device is compromised, decommissioned, or is no longer trusted. By default, the device remains enabled in IoT Hub and can reconnect once a new certificate is issued. However, if immediate access needs to be blocked, you can both revoke the certificate and disable the device to prevent any further connections.

> [!IMPORTANT]
> IoT Hub doesn't evaluate the CA's certificate revocation list (CRL) at device connection. IoT Hub enforces certificate revocation through a credential identifier embedded in each issued certificate. During device authentication, IoT Hub compares the identifier in the certificate with the device resource's identifier. Revoking a certificate rotates the stored identifier, invalidating all previously issued certificates and ensuring that only certificates issued after the rotation remain valid.

### Impact of revoking a device certificate

Revoking a device's certificates affects only the target device and doesn't affect other devices or the intermediate certificate authority that issued the certificate.

- **Device certificate is revoked**: Azure Device Registration invalidates all device certificates ever issued to that device. Devices must reprovision to get a new certificate.

- **IoT Hub trust updates**: IoT Hub accepts new certificates issued by the same intermediate CA.

- **Device can stay enabled**: By default, the device identity stays enabled, so the device can reconnect after it gets the new certificate.
- **No impact on CAs or other devices**: Other devices that use the same intermediate CA keep their certificates and maintain connectivity.

## Revoking an intermediate certificate authority

When you revoke an intermediate CA in Azure Device Registry, you affect every device certificate ever issued by that CA. Other certificate authorities aren't impacted. Use this action when the issue applies to the whole certificate path, such as a suspected CA key compromise.

The revoke flow differs based on the intermediate CA type:

- **Microsoft Cloud Root CA-signed**: The issuing CA certificate is added to the namespace-level root CA's certificate revocation list (CRL). Azure Device Registry generates a replacement intermediate CA and syncs the new CA to linked IoT hubs automatically.

- **External CA-signed**: You can't revoke an intermediate CA that you configured with an external CA. You must ensure that the revocation also propagates to that external CA's certificate revocation list (CRL) or OCSP responder.

When you revoke a CA, ADR automatically rotates a new CA in its place.

### Impact of revoking a certificate authority

Revoking an intermediate CA affects every device whose certificate it issued.

- **Intermediate CA rotates**: Azure Device Registry generates a replacement intermediate CA and syncs the new CA to linked IoT hubs automatically.

- **All issued device certificates are affected**: Devices that use certificates from the previous intermediate CA must request and receive new device certificates before they can resume normal authentication.

- **IoT Hub trust changes**: Linked IoT hubs automatically stop trusting the previous issuing CA and trust the replacement CA.

- **Other CAs stay separate**: If your deployment uses multiple CAs, revoking one CA doesn't affect certificates that other CAs issued.

- **Security containment**: This action is useful when you suspect the intermediate CA or its private key is compromised, or when you need a full certificate refresh for that CA.

- **Microsoft-managed Root CA**: Microsoft Cloud PKI infrastructure handles the revocation. Microsoft maintains and manages the revocation list.

- **External Root CA**: If an external root CA signs your intermediate CA, you must ensure that the revocation also propagates to that external CA's certificate revocation list (CRL) or OCSP responder.

## Certificate lifecycle best practices

Revoking certificates is a high-impact operation that is impossible to reverse. A well-defined lifecycle strategy helps you avoid unplanned device outages, reduce your security exposure, and respond quickly when incidents occur. The following practices apply whether you're managing a handful of devices or a fleet of thousands.

- **Monitor certificate expiration**: Actively track when certificates are approaching expiration and plan renewal schedules to avoid service interruptions.
- **Use separate intermediate CAs for device cohorts when your design allows**: Separate certificate authorities by model, manufacturer, site, or environment to limit the impact of a revocation.

- **Maintain audit records**: Use Azure audit logs to track all certificate revocation for compliance and security investigations.

## Revoke certificates

Use the following procedures to revoke certificates at the device or intermediate CA level.

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

## Revoke an intermediate certificate authority

Use these steps to rotate a policy issuer when you need to invalidate certificates issued by that policy.

1. Open your **Azure Device Registry** namespace.
1. Under **Namespace resources** on the sidebar menu, select **Certificate Authorities**.
1. Select the target intermediate certificate authority.

1. Select **Revoke and rotate**, and confirm the operation.

For an intermediate CA that is issued by your namespace's root CA, Azure Device Registry rotates the intermediate CA and syncs the replacement CA to linked hubs.

For an intermediate CA that is issued by an external CA, you can't revoke the CA in Azure Device Registry because the CRL is also external. You must ensure that the revocation propagates to that external CA's certificate revocation list (CRL) or Online Certificate Status Protocol (OCSP) responder. 

# [Azure CLI](#tab/cli)

## Set variables

Optionally, define shared variables so you can reuse the same values across all commands and reduce input errors.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
```

## Revoke certificates for a device by using Azure CLI

Run this command to revoke certificates for a device in Azure Device Registry.

```azurecli
az iot adr ns device auth revoke-certs \
  --name "<authentication-profile-name>" \
  --device-name "<registry-device-name>" \
  --ns "<namespace-name>" \
  --resource-group "<resource-group-name>" \
  --subscription "<subscription-id>" \
  --yes
```

If you're unsure of the name of your device's authentication profile name, run this command.


```azurecli
az iot adr ns device auth list \
  --device-name "<device-name>" \
  --ns "<namespace-name>" \
  --resource-group "<resource-group-name>" \
  --subscription "<subscription-id>" \
  --query "[].name" \
  --output tsv
```

## Revoke and rotate an intermediate certificate authority

Run this command to revoke and rotate an intermediate certificate authority that your namespace root CA issued.

```azurecli
az iot adr ns ca revoke \
  --name "<intermediate-ca-name>" \
  --ns "<namespace-name>" \
  --resource-group "<resource-group-name>" \
  --subscription "<subscription-id>" \
  --yes
```

---

## Related content

- [Key concepts for certificate management](iot-certificate-management-concepts.md)
- [What is certificate management (preview)?](iot-certificate-management-overview.md)

- [Authenticate devices with X.509 CA certificates](../iot-hub/authenticate-authorize-x509.md)
- [Azure role-based access control (RBAC) for IoT Hub](../iot-hub/authenticate-authorize-azure-ad.md)
