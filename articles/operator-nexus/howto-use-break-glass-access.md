---
title:  How to use Method D v2.0 secure break-glass access
description: Process of using Method D v2.0 Breakglass access
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 11/04/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Use Method D v2.0 Breakglass Access

Breakglass access using Method D v2.0 is a streamlined approach for administrators to grant secure, emergency access to critical network fabric devices. This guide will walk you through setting up and using Breakglass access, including generating SSH keys, granting permissions, and accessing network fabric devices.

## Generating SSH Keys using the Nexusidentity Azure CLI

To start with Breakglass IAM configuration, you will need to set up SSH keys using the Nexusidentity extension. Make sure you have the following prerequisites installed and updated.

### Prerequisites

- **Setup Method D v2.0** using as referred in [article](howto-setup-break-glass-access-.md)
- **Windows Computer** with PowerShell
- **OpenSSH**: Version 9.4 or higher
- **Python**: Version 3.11 or higher (64-bit)
- **Azure CLI**: Version 2.61 or higher (64-bit)
- **Nexusidentity Extension**: This extension must be added to Azure CLI.

### Steps to Install Nexusidentity Extension and Generate SSH Keys

1. **Open PowerShell**:

> [!Note]
> Use non-admin mode for this process.

2. **Update Azure CLI**:

   - Run the following command to update Azure CLI to the latest version:

     ```Azure CLI
     az upgrade
     ```

3. **Install Nexusidentity extension**:

   - To add the Nexusidentity extension

     ```Azure CLI
     az extension add --name nexusidentity
     ```

4. **Generate SSH Keys with Nexusidentity extension**:

   a. Download the [Yubico Key Manager](https://www.yubico.com/support/download/yubikey-manager) to reset your YubiKey for initial setup.
   
   b. Attach your **YubiKey** to your computer.

   c. Log in to Azure with:

      ```Azure CLI
      az login
      ```

   d. Run the following command to generate SSH keys:

      ```Azure CLI
      az nexusidentity gen-keys
      ```

   e. During this process:

      - If prompted to overwrite keys in token, press **Enter**.

      - Select the **Security Key** in the popup window and follow the prompts.

      - Enter your **YubiKey PIN** and touch the device when prompted.

      - If prompted to overwrite keys- press **Enter**

      - If prompted to enter a passphrase, press **Enter**.
   
   f. After successful key generation, you should see:

      ```
      Successfully uploaded public key to Microsoft Entra Id account {user.mail}
      ```

## Granting break-glass permissions to an Entra user on a Network Fabric

To enable Breakglass access administrator can assign below roles to Entra users on a Network Fabric device.

- **Nexus Network Fabric Service Reader**:

  - Allows the user to execute show commands on fabric devices.

  - Does not permit access to configuration mode.

- **Nexus Network Fabric Service Writer**:

  - Allows show commands as well as commands to modify the running configuration.

Once these roles are assigned, the corresponding username and public SSH key will be automatically provisioned across all devices within the designated fabric instance.

> [!Note]
> If a subscription owner assigns an user,  the Network Fabric Service Reader or Writer role at the subscription scope, this role assignment will be inherited by all Network Fabric instances. Consequently, the user will be granted the privileges associated with the built-in role across all Network Fabric instances.

> [!Note]
> Breakglass user accounts are reconciled every 4 hours. For immediate reconciliation, open a support ticket with the network fabric support team.

## 3. Break-glass access to Network Fabric device

Once permissions are granted, users can access network fabric devices with their FIDO-2 hardware token (e.g., YubiKey). Follow the steps below to use Breakglass access.

1. **Prepare for access**:

   - Make sure your **FIDO-2 hardware token** is plugged into your computer.

2. **Use SSH with the `-J` option**:

   - The `-J` option enables you to log in through a jump server and access a fabric device directly. This involves authentication  first with the jump server and then with the fabric device (using ssh keys).

   Use the following command format to access a fabric device:

   ```bash
   ssh -J JumpBoxUsername@JumpBoxIp EntraUsername@FabricDeviceIP
   ```

> [!Note]
> This command establishes a secure connection, using the jump server as an intermediary for authentication.
