---
title: Certificate Revocation and Policy Management (Preview)
titleSuffix: Azure IoT Hub
description: This article discusses the concepts of revoking leaf certificates, revoking policies, deleting policies, and deleting credential resources in Azure IoT Hub certificate management.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 03/13/2026
#Customer intent: As an IoT Hub administrator or security team member, I want to understand the impact of revoking certificates and deleting certificate policies and credentials, so that I can make informed decisions about certificate lifecycle management.
---

# Certificate revocation and policy management concepts (preview)

Certificate management in Azure IoT Hub enables you to issue, manage, and revoke X.509 certificates throughout their lifecycle. This article introduces the key concepts related to revoking device certificates, revoking policies, deleting policies, and deleting credential resources. These operations are part of a coordinated lifecycle management strategy that helps you maintain your security posture when certificates expire, devices are decommissioned, or business requirements change.

[!INCLUDE [public-preview-banner](includes/public-preview-banner.md)]

## Relationship between certificate lifecycle operations

Certificate lifecycle in Azure Device Registry (ADR) follows a structured hierarchy: a credential resource establishes the root CA at the namespace-level, a policy defines the issuing CA that signs device certificates, and each device uses its own certificate. Linked IoT hubs trust the issuing CA that ADR syncs from the policy. Revocation and deletion operations let you act at the right level for the problem you need to solve:

- **Revoke device certificates** when the issue is limited to one device.
- **Revoke a policy** when the issue affects every certificate that policy issued.
- **Delete a policy** when you no longer need that issuing path for future certificate issuance.
- **Delete a credential resource** when you no longer need to use certificate management in the namespace.

## Prerequisites

To perform certificate revocation and policy management operations, you must have the [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role assigned on the Azure Device Registry namespace. This role grants full access to manage credentials and policies (`microsoft.deviceregistry/namespaces/credentials/*` and `microsoft.deviceregistry/namespaces/credentials/policies/*`). 

If you don't have this role assigned, contact your Azure administrator to request the necessary permissions.

## Revoking device certificates

When you revoke a device’s certificate in Azure Device Registry (ADR), all certificates that have ever been issued to that device are revoked. As part of this process, the device certificate’s unique identifier is added to the issuing CA’s Certificate Revocation List (CRL), preventing the device from authenticating to IoT Hub using any previously issued certificate.

To restore connectivity, the device must be reprovisioned and request a new certificate. This action is recommended when a device has been compromised, decommissioned, or is no longer trusted. By default, the device remains enabled in IoT Hub and can reconnect once a new certificate is issued. However, if immediate access needs to be blocked, you can both revoke the certificate and disable the device to prevent any further connections.

> [!IMPORTANT]
> IoT Hub does not evaluate the CA's certificate revocation list (CRL) during device connection. Instead, revocation is enforced by using a per-device unique identifier embedded in the certificate at the time of issuance.
> When a device connects using its certificate, IoT Hub extracts this identifier and compares it against the device’s current identifier stored in the service to determine whether the certificate has been revoked. When a device's certificate is revoked, its unique identifier is rotated. Any certificates issued after revocation contain the new identifier, while previously issued certificates no longer match and are treated as revoked.

### Impact of revoking a device certificate

Revoking a device's certificates affects only the target device and doesn't affect other devices or the policy that issued the certificate.

- **Device certificate rotates**: Azure Device Registration invalidates all device certificates ever issued to that device. Devices must reprovision to be issued a new certificate.

- **IoT Hub trust updates**: The issuing CA certificate that is stored within IoT hub accepts new certificates issued by the policy. 

- **Device can stay enabled**: By default, the device identity stays enabled, so the device can reconnect after it gets the new certificate.
- **Revoke and disable blocks access**: If you revoke and disable the device, the device can't connect until you re-enable it.

- **No impact on policy or other devices**: Other devices that use the same policy keep their certificates.

## Revoking a policy

Revoking a policy rotates the issuing CA for that policy and affects every device certificate that policy issued. Use this action when the issue applies to the whole certificate path, such as a suspected CA key compromise.

The revoke flow differs based on the policy type:

- **Microsoft Root CA-signed policy**: The issuing CA certificate is added to the namespace-level root CA's certificate revocation list (CRL). Azure Device Registry generates a replacement issuing CA and syncs the new CA to linked IoT hubs automatically.

- **External CA-signed policy**: You cannot revoke a policy that has been configured with an external CA. You must ensure that the revocation also propagates to that external CA's certificate revocation list (CRL) or OCSP responder.

### Impact of revoking a policy

Because a policy acts as an issuing CA, revoking it affects every device whose certificate it issued.

- **Issuing CA rotates**: The policy stops using the current issuing CA and moves to a replacement issuing CA.
- **All issued device certificates are affected**: Devices that use certificates from the previous issuing CA must request and receive new device certificates before they can resume normal authentication.

- **IoT Hub trust changes**: Linked IoT hubs stop trusting the previous issuing CA and must trust the replacement CA.
- **Standard policy flow completes in ADR**: For a service-managed policy, ADR syncs the replacement CA to linked hubs automatically.
- **BYOR flow needs customer action**: For a BYOR policy, you must sign the new CSR, activate the policy, and run credential sync.
- **Other policies stay separate**: If your deployment uses multiple policies, revoking one policy doesn't affect certificates that other policies issued.
- **Security containment**: This action is useful when you suspect the issuing CA or its private key is compromised, or when you need a full certificate refresh for that policy.
- **Microsoft-managed Root CA**: Azure PKI infrastructure handles the revocation. Microsoft maintains and manages the revocation list.
- **External Root CA**: If an external root CA signs your policy, you must ensure that the revocation also propagates to that external CA's certificate revocation list (CRL) or OCSP responder.

## Deleting a policy

Deleting a policy removes the issuing CA configuration for future certificate issuance. This action is a final cleanup step. Unlike revocation, deletion removes the policy configuration instead of rotating the issuing CA. Delete a policy only after you confirm that you no longer need the policy for future device certificate operations. To delete a policy, find the policy in the Azure portal and select **Delete**.

Once you delete a policy, it can no longer issue new device certificates, but IoT Hub continues to accept any valid device certificates. If you want to decommission all existing device certificates under that policy, you must delete the CA certificate from the IoT hub.

> [!IMPORTANT]
> For policies that are configured using an external CA, you **must** revoke each device certificate before deleting the policy. If you are unable to revoke each device certificate, you must delete your credential resource and create a new policy.

### Impact of deleting a policy

Deleting a policy permanently removes the policy configuration. Unlike revocation, deletion doesn't just mark the policy as invalid.

- **Policy is permanently removed**: The policy and its configuration are deleted from your ADR namespace. This operation can't be undone.
- **Dependent resources**: Any device enrollment linked to this policy in Device Provisioning Service (DPS) can't issue new certificates. DPS enrollments referencing the deleted policy must be updated to use a different policy or be disabled.
- **Audit information**: While the policy is deleted, you might retain historical records and audit logs related to the policy based on your compliance requirements.
- **No impact on active certificates**: If certificates issued by this policy are still valid, deleting the policy doesn't immediately invalidate them. However, new certificate issuance through this policy isn't possible. To decommission all existing device certificates under that policy, you must delete the CA certificate from the IoT hub.

## Deleting a credential resource

When you delete a credential resource, you remove the namespace-level trust anchor for that certificate chain. This action retires the credential path that policies depend on. Delete a credential resource only when you're certain no downstream policies or devices need it, such as when you retire a full certificate chain or remove older certificate infrastructure. To delete a credential resource, go to Azure Device Registry, select the namespace, and under **Credential policies**, select the credential resource and **Delete**.

### Impact of deleting a credential resource

Deleting a credential removes the root of trust for an entire ADR namespace's certificate hierarchy.

- **Credential resource is permanently removed**: The credential resource and its associated metadata are deleted from your ADR namespace.
- **Cascading deletion**: If any policies are still associated with this credential, you must first revoke or delete those policies before you can delete the credential.
- **No new certificate issuance**: New certificate issuance through any policy signed by this credential isn't possible.
- **Irreversible operation**: Deleting a credential can't be undone. To use certificate management with this chain again, you must create a new credential and policies.

## Certificate lifecycle best practices

Revoking certificates and deleting policies are high-impact operations that are difficult or impossible to reverse. A well-defined lifecycle strategy helps you avoid unplanned device outages, reduce your security exposure, and respond quickly when incidents occur. The following practices apply whether you're managing a handful of devices or a fleet of thousands.

- **Monitor certificate expiration**: Actively track when certificates are approaching expiration and plan renewal schedules to avoid service interruptions.
- **Use separate policies for device cohorts when your design allows**: Separate policies by model, manufacturer, site, or environment to limit the impact of a policy revoke. In the current preview, each credential supports one policy, so you might need to map cohorts across separate credentials.
- **Maintain audit records**: Use Azure audit logs to track all certificate revocation, policy deletion, and credential deletion operations for compliance and security investigations.

## Related content

- [Revoke certificates and delete policies (preview)](how-to-revoke-certificate-delete-policy.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [What is certificate management (preview)?](iot-hub-certificate-management-overview.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)
- [Authenticate devices with X.509 CA certificates](authenticate-authorize-x509.md)

- [Azure role-based access control (RBAC) for IoT Hub](authenticate-authorize-azure-ad.md)
