---
title: Create or Edit a Policy with Microsoft Root CA in Azure Device Registry
titleSuffix: Azure IoT Hub
description: Create or edit a policy in your Azure Device Registry namespace to issue Microsoft-backed X.509 certificates for IoT devices.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ai-usage: ai-generated
ms.date: 04/14/2026
#Customer intent: As an IoT administrator, I want to create or edit a policy in Azure Device Registry so I can issue Microsoft-backed X.509 device certificates with the validity period my deployment requires.
---

# Create or edit a policy with a Microsoft root CA (preview)

This article explains how to create or edit a policy within your [Azure Device Registry (ADR)](iot-hub-device-registry-overview.md) namespace to manage an __issuing CA__ signed by your namespace's unique __root CA__.

Use this workflow if you want ADR to provide a fully managed public key infrastructure (PKI) for your namespace. When a device requests a certificate, the platform returns a full certificate chain consisting of:

- __The device certificate:__ Unique to the specific IoT device.

- __The issuing CA (ICA):__ The CA managed by ADR that signs the device request.

- __The namespace root CA:__ The unique, namespace-level root managed by the credential resource.

Your device identities are cryptographically scoped to their namespace, providing high tenant isolation and a simplified management experience without the need for an external private PKI.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

In certificate management, a credential manages the namespace-level root CA, and a policy manages the issuing CA that signs device certificates. 

## Prerequisites

Before you begin, make sure you have:

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).
- An existing ADR namespace. For setup steps, see [Deploy Azure IoT Hub with ADR integration](iot-hub-device-registry-setup.md).
- A configured credential in the ADR namespace. For setup steps, see [Configure a credential in Azure Device Registry](how-to-configure-credential.md).
- Permissions to manage policies in the ADR namespace, such as the [Azure Device Registry Credentials Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#azure-device-registry-credentials-contributor) role.

## Create a policy

You can create a policy by using the Azure portal or the Azure CLI. In this preview workflow, use the Azure portal when you need to change the validity period for an existing policy.

# [Azure portal](#tab/portal)

## Create a policy by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open your **Azure Device Registry** namespace.

1. In the sidebar menu, under **Namespace resources**, select **Credential policies**.

1. Select **Create Policy**.

    :::image type="content" source="media/how-to-create-policy/certificate-management.png" alt-text="Screenshot showing the Credential policies pane.":::

1. In the **Basics** tab, complete the fields as follows:

    | Property | Value |    
    | -------- | ----- |
    | **Name** | Enter a unique name for your policy. The name must be between 3 and 50 alphanumeric characters and can include hyphens (`'-'`). |
    | **Validity period (days)** | Enter the number of days the issued certificates are valid. |
    | **Select a Root CA for certificates in this policy** | Accept the default value, **Use this namespace's Microsoft-issued Root CA (Default)**. |

    :::image type="content" source="media/how-to-create-policy/add-policy.png" alt-text="Screenshot showing the Create polcy dialog.":::

1. Select **Next**, then **Review + create**.

1. Refresh the **Policies** list if needed, and verify that the new policy appears.

## Edit a policy

Edit an existing policy to update its validity period when security or operational requirements change.

1. In the sidebar menu of your ADR namespace, under **Namespace resources**, select **Credential policies**.

1. Select the policy that you want to edit.

1. On the **Overview** page, select **edit** next to **Validity period**.

1. Change the **Validity period** value.

1. Select **Save**.

1. Refresh the page to verify that the updated validity period appears.

## Synchronize the credential

Synchronize your new or updated policy.

1. In the sidebar menu of your ADR namespace, under **Namespace resources**, select **Credential policies**.

1. Select **Sync all**, and then **Yes**.

    :::image type="content" source="media/how-to-create-policy/sync-credential.png" alt-text="Screenshot showing the Sync all button.":::

# [Azure CLI](#tab/cli)

## Azure CLI prerequisites

Prepare the Azure CLI and authenticate to Azure so you can run the policy commands against the correct subscription and namespace.

- [Azure CLI](/cli/azure/install-azure-cli) installed on your machine.
- The `azure-iot` extension. Install it by running the following command:

  ```azurecli
  az extension add --name azure-iot
  ```

- Sign in to Azure by running `az login`.

## Set variables for the Azure CLI

Define shared variables before running the commands.

```azurecli
RG_NAME="<resource-group>"
NS_NAME="<adr-namespace>"
POLICY_NAME="<policy-name>"
VALIDITY_DAYS="<validity-days>"
```

## Create the policy by using the Azure CLI

Run this command to create a policy that chains to your credential.

```azurecli
az iot adr ns policy create \
  --namespace "$NS_NAME" \
  -g "$RG_NAME" \
  --name "$POLICY_NAME" \
  --cert-validity-days "$VALIDITY_DAYS"
```

To set a custom certificate subject during creation, add the `--cert-subject` parameter.

## Verify the policy by using the Azure CLI

Run this command to view the policy details.

```azurecli
az iot adr ns policy show \
  --namespace "$NS_NAME" \
  -g "$RG_NAME" \
  --name "$POLICY_NAME"
```

Verify that the policy is returned and that the displayed properties match the values you created.

## Edit policy validity period

You can update the validity period for an existing external CA policy by using the following command. This example changes the validity period to *10* days.

```azurecli
az iot adr ns policy update \
  --name "$POLICY_NAME" \
  --cert-validity-days 10 \
  --namespace "$NS_NAME" \
  -g "$RG_NAME"
```

## Synchronize the credential

Use the following command to synchronize your new or updated policy.

```azurecli
az iot adr ns credential sync \
  --ns "$NS_NAME" \
  -g "$RG_NAME"
```

---

## Related content

- [Deploy Azure IoT Hub with ADR integration](iot-hub-device-registry-setup.md)
- [Configure a credential in Azure Device Registry](how-to-configure-credential.md)
- [Revoke certificates and delete policies in Azure Device Registry](how-to-revoke-certificate-delete-policy.md)
- [Key concepts for certificate management (preview)](iot-hub-certificate-management-concepts.md)
