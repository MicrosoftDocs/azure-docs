---
title: 'Configure Microsoft Entra ID authentication'
titleSuffix: Azure Bastion
description: Learn how to configure Microsoft Entra ID authentication for RDP and SSH connections through Azure Bastion, including role assignments, virtual machine extensions, and connection steps.
author: cherylmc
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/09/2026
ms.author: cherylmc

# Customer intent: "As a cloud administrator, I want to configure Microsoft Entra ID authentication with Azure Bastion, so that I can use identity-based access policies and MFA for my virtual machines."
---

# Configure Microsoft Entra ID authentication for Azure Bastion

<a name="entra-id"></a>

<a name="microsoft-entra-id-authentication-preview"></a>

Microsoft Entra ID authentication for [Azure Bastion](bastion-overview.md) lets you sign in to your virtual machines using your organizational identity instead of local virtual machine credentials. With Entra ID authentication, you can enforce [multifactor authentication (MFA)](/entra/identity/authentication/concept-mfa-howitworks), apply [conditional access policies](/entra/identity/conditional-access/overview), and centralize identity management across your Azure virtual machines.

> [!NOTE]
> Microsoft Entra ID authentication for **RDP** connections in the portal is in **public preview**. Microsoft Entra ID authentication for **SSH** connections in the portal is **generally available**.

## Prerequisites

Before you configure Entra ID authentication, verify the following:

* **Azure Bastion host:** A Bastion host deployed in the virtual network where the virtual machine is located, or in a [peered virtual network](vnet-peering.md). The minimum SKU depends on the connection method:

  | Connection method | Minimum SKU |
  |---|---|
  | Azure portal (RDP or SSH) | Basic |
  | Native client (RDP with `--enable-mfa`) | Standard |
  | Native client (SSH with `--auth-type AAD`) | Standard |

* **Supported operating systems:**
  * **Windows virtual machines (RDP):** Windows 10 version 20H2 or later, Windows 11 21H2 or later, or Windows Server 2022 or later.
  * **Linux virtual machines (SSH):** Any Linux distribution that supports the AADSSHLoginForLinux extension.

* **Native client connections:** Azure CLI version 2.32 or later. Run `az extension add --name ssh` to install the SSH extension. For setup details, see [Configure Bastion for native client connections](native-client.md).


## Entra ID authentication overview

Entra ID authentication supports both RDP and SSH connections. The authentication flow works as follows:

1. You initiate a connection to a virtual machine through Azure Bastion.
1. Bastion redirects you to Microsoft Entra ID for authentication, where MFA and conditional access policies are evaluated.
1. After successful authentication, Bastion brokers the connection to the target virtual machine.
1. The virtual machine-level extension (**AADLoginForWindows** or **AADSSHLoginForLinux**) validates the Entra ID token and grants access based on your assigned role.

Entra ID authentication is available through two connection methods:

* **Azure portal:** Connect directly from the Azure portal using RDP (Windows virtual machines) or SSH (Linux virtual machines). The [Basic SKU](bastion-sku-comparison.md) or higher is required.
* **[Native client](native-client.md)"** Connect using the Azure CLI from your local computer with the [`az network bastion rdp`](/cli/azure/network/bastion#az-network-bastion-rdp) or [`az network bastion ssh`](/cli/azure/network/bastion#az-network-bastion-ssh) command. The [Standard SKU](bastion-sku-comparison.md) or higher is required.

When all requirements are met, Microsoft Entra ID appears as the default authentication option on the Bastion connection page in the Azure portal. If any requirement isn't met, the option doesn't appear.

> [!NOTE]
> The sign-in experience differs between connection methods. Portal connections use passwordless authentication—you sign in with your Entra ID credentials and don't need a local VM password. Native client RDP connections prompt for password entry after MFA completes. For more information, see [Sign in using password/passwordless authentication with Microsoft Entra ID](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows#sign-in-using-passwordpasswordless-authentication-with-microsoft-entra-id).

## Assign roles

Users connecting with Entra ID authentication need **one of** the following role assignments:

* **[Virtual Machine Administrator Login:](/azure/role-based-access-control/built-in-roles#virtual-machine-administrator-login)** Grants administrator-level access to the virtual machine.
* **[Virtual Machine User Login:](/azure/role-based-access-control/built-in-roles#virtual-machine-user-login)** Grants regular user-level access to the virtual machine.

The following [Reader](/azure/role-based-access-control/built-in-roles#reader) role assignments on the relevant resources are also required:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

You can assign roles at the virtual machine, resource group, or subscription scope.

### [Portal](#tab/portal)

Follow these steps to assign the required roles using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to the virtual machine you want to configure.
1. Select **Access control (IAM)** from the left menu.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, search for and select **Virtual Machine Administrator Login** (or **Virtual Machine User Login** for standard access). Select **Next**.
1. On the **Members** tab, select **+ Select members**, search for the user or group, select them, and choose **Select**.
1. Select **Review + assign** to complete the role assignment.
1. Repeat the previous steps to assign the required Reader roles on the virtual machine, NIC, Bastion resource, and virtual network.

### [Azure CLI](#tab/cli)

Assign the **Virtual Machine Administrator Login** role at the virtual machine scope:

```azurecli
az role assignment create \
  --assignee "<UserPrincipalNameOrObjectId>" \
  --role "Virtual Machine Administrator Login" \
  --scope "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<VMName>"
```

To assign **Virtual Machine User Login** instead, replace the `--role` value:

```azurecli
az role assignment create \
  --assignee "<UserPrincipalNameOrObjectId>" \
  --role "Virtual Machine User Login" \
  --scope "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/virtualMachines/<VMName>"
```

Assign the required Reader roles. For example, the Reader role on the Bastion resource:

```azurecli
az role assignment create \
  --assignee "<UserPrincipalNameOrObjectId>" \
  --role "Reader" \
  --scope "/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/bastionHosts/<BastionName>"
```

---

## Install the virtual machine extension

The virtual machine extension validates the Entra ID token and grants access to the virtual machine. You can enable the extension during virtual machine creation by selecting **Login with Microsoft Entra ID**, or add it to an existing virtual machine using the following steps.

### [Windows](#tab/windows)

Install the **AADLoginForWindows** extension on Windows virtual machines.

**Supported operating systems:** Windows 10 version 20H2 or later, Windows 11 21H2 or later, Windows Server 2022 or later.

#### Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to your Windows virtual machine.
1. Select **Extensions + applications** from the left menu.
1. Select **+ Add**.
1. Search for **AADLoginForWindows**, select the extension, and select **Next**.
1. Select **Review + create**, then select **Create** to install the extension.
1. Wait for the extension to finish provisioning. Verify the status on the **Extensions + applications** page shows **Provisioning succeeded**.

#### Azure CLI

```azurecli
az vm extension set \
  --publisher Microsoft.Azure.ActiveDirectory \
  --name AADLoginForWindows \
  --resource-group "<ResourceGroupName>" \
  --vm-name "<VMName>"
```

### [Linux](#tab/linux)

Install the **AADSSHLoginForLinux** extension on Linux virtual machines.

**Supported operating systems:** Any Linux distribution that supports the AADSSHLoginForLinux extension.

#### Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to your Linux virtual machine.
1. Select **Extensions + applications** from the left menu.
1. Select **+ Add**.
1. Search for **AADSSHLoginForLinux**, select the extension, and select **Next**.
1. Select **Review + create**, then select **Create** to install the extension.
1. Wait for the extension to finish provisioning. Verify the status on the **Extensions + applications** page shows **Provisioning succeeded**.

#### Azure CLI

```azurecli
az vm extension set \
  --publisher Microsoft.Azure.ActiveDirectory \
  --name AADSSHLoginForLinux \
  --resource-group "<ResourceGroupName>" \
  --vm-name "<VMName>"
```

---

> [!TIP]
> For detailed setup guidance, see [Enable Microsoft Entra sign in for a Windows virtual machine in Azure](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows) or [Enable Microsoft Entra sign in for a Linux virtual machine in Azure](/entra/identity/devices/howto-vm-sign-in-azure-ad-linux).

## Connect using Entra ID authentication

After you complete the role assignments and install the virtual machine extension, you can connect to your virtual machine using Entra ID authentication. When all requirements are met, **Microsoft Entra ID** appears as the default authentication option on the Bastion connection page in the Azure portal.

### [Portal: RDP (Windows)](#tab/portal-rdp)

Connect to a Windows virtual machine using RDP with Entra ID authentication in the Azure portal. The [Basic SKU](bastion-sku-comparison.md) or higher is required.

1. In the [Azure portal](https://portal.azure.com), navigate to your Windows virtual machine. Select **Connect** > **Bastion**.
1. In the **Connection settings** section, set **Protocol** to **RDP**. Enter the port number if you changed it from the default of 3389.
1. For **Authentication type**, select **Microsoft Entra ID (Preview)**. If this option doesn't appear, verify that the virtual machine extension is installed and the required roles are assigned.
1. Select **Connect** to open the RDP connection in a new browser tab.
1. When prompted, sign in with your Microsoft Entra ID credentials. Multifactor authentication (MFA) and conditional access policies are evaluated during this step.

> [!NOTE]
> If you encounter sign-in issues, see [Troubleshoot Microsoft Entra sign-in problems](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows#troubleshoot-sign-in-problems).

### [Portal: SSH (Linux)](#tab/portal-ssh)

Connect to a Linux virtual machine using SSH with Entra ID authentication in the Azure portal. The [Basic SKU](bastion-sku-comparison.md) or higher is required.

1. In the [Azure portal](https://portal.azure.com), navigate to your Linux virtual machine. Select **Connect** > **Bastion**.
1. In the **Connection settings** section, set **Protocol** to **SSH**.
1. For **Authentication type**, select **Microsoft Entra ID**. If this option doesn't appear, verify that the virtual machine extension is installed and the required roles are assigned.
1. Select **Connect** to establish the SSH connection.

### [Native client: RDP](#tab/native-rdp)

Connect to a Windows virtual machine using the Azure CLI native client with Entra ID authentication. The [Standard SKU](bastion-sku-comparison.md) or higher is required, and Bastion must be configured for [native client support](native-client.md).

Run the following command to connect with Entra ID authentication using the `--enable-mfa` flag:

```azurecli
az network bastion rdp \
  --name "<BastionName>" \
  --resource-group "<ResourceGroupName>" \
  --target-resource-id "<VMResourceId>" \
  --enable-mfa
```

When prompted, sign in with your Microsoft Entra ID credentials.

### [Native client: SSH](#tab/native-ssh)

Connect to a Linux virtual machine using the Azure CLI native client with Entra ID authentication. The [Standard SKU](bastion-sku-comparison.md) or higher is required, and Bastion must be configured for [native client support](native-client.md).

Run the following command to connect using the `--auth-type "AAD"` parameter:

```azurecli
az network bastion ssh \
  --name "<BastionName>" \
  --resource-group "<ResourceGroupName>" \
  --target-resource-id "<VMResourceId>" \
  --auth-type "AAD"
```

---

## Limitations

* RDP and Entra ID authentication in the portal can't be used concurrently with [graphical session recording](session-recording.md).
* Microsoft Entra ID authentication isn't supported for [IP-based](connect-ip-address.md) RDP or SSH connections.
* Microsoft Entra ID authentication for portal connections is supported for RDP to Windows virtual machines and SSH to Linux virtual machines only.
* For [native client](connect-vm-native-client-windows.md) RDP connections, remote connection to virtual machines joined to Microsoft Entra ID is allowed only from Windows 10 or later PCs that are [Microsoft Entra registered, Microsoft Entra joined, or Microsoft Entra hybrid joined](/entra/identity/devices/overview) to the *same* directory as the virtual machine.

## Next steps

* [Create an RDP connection to a Windows virtual machine](bastion-connect-vm-rdp-windows.md)
* [Create an SSH connection to a Linux virtual machine](bastion-connect-vm-ssh-linux.md)
* [Connect to a virtual machine using a native client](connect-vm-native-client-windows.md)
* [Configure Kerberos authentication](kerberos-authentication-portal.md) for domain-joined virtual machines
* [Azure Bastion FAQ](bastion-faq.md)
