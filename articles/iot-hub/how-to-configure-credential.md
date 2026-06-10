---
title: Configure a credential in Azure Device Registry
titleSuffix: Azure IoT Hub
description: Configure a credential in your Azure Device Registry namespace to enable Microsoft-backed X.509 certificate management for IoT devices.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ai-usage: ai-generated
ms.date: 04/14/2026
#Customer intent: As a developer setting up certificate management, I want to configure a root CA credential in my ADR namespace.
---

# Configure a credential in Azure Device Registry (preview)

When you enable [Microsoft-backed X.509 certificate management](iot-hub-certificate-management-overview.md) in your [Azure Device Registry (ADR)](iot-hub-device-registry-overview.md) namespace, you create a single credential resource within that ADR namespace. A credential manages one unique root CA within your own cloud PKI.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

Microsoft manages the PKI and root CA for your ADR namespace, so you don't need on-premises PKI infrastructure.

When you configure a credential, Microsoft:

- Generates and stores the root certificate in [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)
- Manages the root certificate lifecycle
- Lets you create issuing CAs (policies) that the root CA signs

You can configure a root CA credential in your ADR namespace by using the Azure portal or Azure CLI.

## Prerequisites

# [Azure portal](#tab/portal)

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Device Registry namespace. For setup instructions, see [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md).
- Ensure that you have the privilege to perform role assignments within your target ADR namespace scope. Performing role assignments in Azure requires a [privileged role](../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope.

# [Azure CLI](#tab/cli)

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing Azure Device Registry namespace. For setup instructions, see [Deploy Azure IoT Hub with ADR integration](iot-hub-device-registry-setup.md).
- Ensure that you have the privilege to perform role assignments within your target ADR namespace scope. Performing role assignments in Azure requires a [privileged role](../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope.
- [Azure CLI](/cli/azure/install-azure-cli) installed on your machine.

  1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

---

## Configure a credential

# [Azure portal](#tab/portal)

Follow these steps to configure your root CA credential.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Azure Device Registry** from the search bar.

1. In the resource menu, select **Namespaces**, and then select your ADR namespace from the list.

1. In the resource menu of your ADR namespace, select **Credential policies (Preview)** under **Namespace resources**.

1. On the **Credential policies (Preview)** page, select **Enable** from the **Enable certificate management** dialog.

   :::image type="content" source="./media/how-to-configure-credential/enable-certificate-management.png" alt-text="Screenshot of the Certificate management page for an Azure Device Registry namespace in the Azure portal, highlighting the Enable button in the Enable certificate management dialog." lightbox="./media/how-to-configure-credential/enable-certificate-management.png":::

1. Azure provisions a root CA credential for your namespace. This process takes a few moments to complete.

1. After provisioning is complete, your root CA credential is ready to use. The credential is displayed on the **Credential policies (Preview)** page.

# [Azure CLI](#tab/cli)

Follow these steps to configure your root CA credential.

1. Run `az iot ns credential create` to enable credential management and create a new root CA for your ADR namespace.

   ```azurecli
   az iot adr ns credential create --namespace <namespace> \
     --resource-group <resource_group>
   ```

   In the command, replace the following placeholders with your own information:

   - `<namespace>`: The name of an existing ADR namespace.
   - `<resource_group>`: The name of the resource group for the ADR namespace.

1. Run `az iot adr ns policy create` to create a new policy for your ADR namespace. The policy is configured to use the ECC certificate type and remains valid for 30 days.

   ```azurecli
   az iot adr ns policy create --name <policy> \
     --namespace <namespace> \
     --resource-group <resource_group> \
     --cert-key-type ECC \
     --cert-validity-days 30
   ```

   In the command, replace the following placeholders with your own information:

   - `<policy>`: The name of the policy to be created for the ADR namespace.  
   - `<namespace>`: The name of an existing ADR namespace.
   - `<resource_group>`: The name of the resource group for the ADR namespace.

1. Run `az iot adr ns credential sync` to synchronize the credentials between your ADR namespace and your linked IoT hub.

   ```azurecli
   az iot adr ns credential sync --ns myNamespace -g myRG
   
   ```
   
   In the command, replace the following placeholders with your own information:
   
   - `<policy>`: The name of an existing policy for the ADR namespace.  
   - `<namespace>`: The name of an existing ADR namespace.
   - `<resource_group>`: The name of the resource group for the ADR namespace.
      
### Verify credential configuration

After you enable credential management, verify that your root CA credential is provisioned by running the `az iot adr ns credential show` command:

```azurecli
az iot adr ns credential show --namespace <namespace> \
  --resource-group <resource_group>
```

In the command, replace the following placeholders with your own information:

- `<namespace>`: The name of an existing ADR namespace.
- `<resource_group>`: The name of the resource group for the ADR namespace.

This command displays the details of your root CA credential, including its provisioning status and certificate information.

---

You can now create issuing CAs (policies) with either a [Microsoft-issued certificate](how-to-create-policy.md) or an [external CA](how-to-create-policy-external-certificate.md) within your namespace that is signed by your unique credential. To issue and manage X.509 certificates for your IoT devices, use these policies with Device Provisioning Service.

## Next steps

After you configure your root CA credential, you can:

- [Create issuing CA policies](iot-hub-device-registry-overview.md) within your namespace to issue X.509 certificates for your IoT devices
- [Link an IoT hub to your ADR namespace](iot-hub-device-registry-setup.md) to enable certificate-based authentication for your devices
- [Set up Device Provisioning Service](../iot-dps/quick-setup-auto-provision.md) enrollments to provision devices with issued certificates

For more information about certificate management and the complete workflow, see:

- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [What is X.509 certificate management?](iot-hub-certificate-management-overview.md)
