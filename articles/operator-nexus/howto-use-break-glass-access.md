---
title:  How to use Method D v2.0 secure break-glass access
description: Process of using Method D v2.0 break glass access
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 11/04/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Use Method D v2.0 break glass access

Break glass access using Method D v2.0 is a streamlined approach for administrators to grant secure, emergency access to critical network fabric devices. This guide walks you through setting up and using break glass access, including generating SSH keys, granting permissions, and accessing network fabric devices.

Method D v2.0 also supports assigning roles to Entra Groups, streamlining the management of break glass access by applying group-based role assignments. 

## Generating SSH Keys using the Nexusidentity Azure CLI

To start with break glass Identity and Access Management (IAM) configuration, you need to set up SSH keys using the Nexusidentity extension. Make sure you have the following prerequisites installed and updated.

### Prerequisites

- **Setup Method D v2.0** using as referred in [article](howto-set-up-break-glass-access.md).
- **Windows** machine with PowerShell or **Linux** machine with bash terminal.
- **OpenSSH**: Version 9.4 or higher.
- **Python**: Version 3.11 or higher (64-bit).
- **Azure CLI**: Version 2.61 or higher (64-bit).
- **Managednetworkfabric extension**: 7.0.0
- **Nexusidentity extension**: 1.0.0b4 or higher.
- **YubiKey firmware version**: Must be 5.2.3 or higher.
- **Enable Long paths**: - Windows long paths support must be enabled [Refer](https://pip.pypa.io/warnings/enable-long-paths).
- **Microsoft Authentication Library (MSAL) version**: 1.31.2b1
- **azure-mgmt-resource**: 23.1.1

### Prerequisites and Setup for Group-based role assignments

**Create Security Groups**: Define Entra security groups that include users requiring BreakGlass access.
**Assign Roles to Groups**: Assign BreakGlass roles to security groups instead of individual users.

### Steps to install Nexusidentity extension and generate SSH keys 

1.  **Enabling long paths** (Windows OS only)
   
- Run the following PowerShell as an administrator.

   ```PowerShell 
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

- Close the PowerShell terminal.

2. **Open PowerShell**: (Windows OS only)

> [!Note]
> Use non-admin mode for this process.

3. **Update Azure CLI**:

   - Run the following command to update Azure CLI to the latest version:

     ```Azure CLI
     az upgrade
     ```

4. **Install Nexusidentity extension**:

   - To add the Nexusidentity extension

     ```Azure CLI
     az extension add --name nexusidentity
     ```

5. **Generate SSH Keys with Nexusidentity extension**:

   a. Download the [Yubico Key Manager](https://www.yubico.com/support/download/yubikey-manager) to reset your YubiKey for initial setup.
   
   b. Attach your **YubiKey** to your computer.

   c. Log in to Azure with:

      ```Azure CLI
      az login
      ```

   d. To generate SSH keys run the following command:

      ```Azure CLI
      az nexusidentity gen-keys
      ```

   > [!NOTE]
   > Method Dv2.0 passkeys require the YubiKey hardware token with a firmware version of 5.2.3 or higher.

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

To enable break glass access, administrator can assign below roles to Entra users on a Network Fabric device.

- **Nexus Network Fabric Service Reader**:

  - Allows the user to execute show commands on fabric devices.

  - Doesn't permit access to configuration mode.

- **Nexus Network Fabric Service Writer**:

  - Allows show commands and commands to modify the running configuration.

Once these roles are assigned, the corresponding username and public SSH key are automatically provisioned across all devices within the designated fabric instance.

> [!Note]
> If a subscription owner assigns an user,  the Network Fabric Service Reader or Writer role at the subscription scope, this role assignment will be inherited by all Network Fabric instances. Consequently, the user will be granted the privileges associated with the built-in role across all Network Fabric instances.

> [!Note]
> break glass user accounts are reconciled every 4 hours. For immediate reconciliation, open a support ticket with the network fabric support team.

## Scope for group based role assignments

Role assignments can be made at either the subscription or fabric scope. These role assignments were validated at the fabric level. Each user must have rights for the specific fabric instance, which may be inherited from higher-level grants (for example, subscription-level assignments).

Multiple groups can be assigned the same Nexus Network Fabric (NNF) built-in role (for example, Nexus Network Fabric Service Reader or Writer) for a given fabric instance.

### User Limitations
A maximum of 200 user accounts (across all groups and individual assignments) can be granted BreakGlass access.

Multiple groups may be assigned to the same role for a fabric instance, but the 200-user limit still applies.

> [!Note] 
> Nested groups are not supported. Only direct group memberships are considered.

## Break-glass access to Network Fabric device

Once permissions are granted, users can access network fabric devices with their FIDO-2 hardware token (for example, YubiKey). Follow these steps to use break glass access.

1. **Prepare for access**:

   - Make sure your **FIDO-2 hardware token** is plugged into your computer.

2. **Use SSH with the `-J` option**:

   - The `-J` option enables you to log in through a jump server and access a fabric device directly. This process involves authentication first with the jump server and then with the fabric device using SSH keys.

   Use the following command format to access a fabric device:

   ```bash
   ssh -J JumpBoxUsername@JumpBoxIp EntraUsername@FabricDeviceIP
   ```

> [!Note]
> This command establishes a secure connection, using the jump server as an intermediary for authentication.

## Group based role assignment synchronization
Upon assigning an Entra Group to a BreakGlass role, all users in that group will have the appropriate device access provisioned during the next synchronization cycle.

### Reconciliation Process

BreakGlass account reconciliation occurs every four hours and ensures alignment between Entra role assignments and device access:

- **User Removed from Group**: Device access is revoked.

- **User Added to Group**: Appropriate device access is provisioned.

- **Group Role Assignment Removed**: All users in the group have their access revoked.

- **Failure to Resolve Group Membership**: If group membership can't be verified (for example, due to Entra API failures or connectivity issues), no changes are made to existing device accounts.

