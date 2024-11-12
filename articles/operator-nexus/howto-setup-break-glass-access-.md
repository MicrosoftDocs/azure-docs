---
title:  How to set up secure break-glass access
description: Process of setting up secure 
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 11/04/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Secure break-glass access

The Break-Glass mechanism provides temporary and emergency access to Azure Operator Nexus devices or services, primarily for disaster recovery, incident response, or essential maintenance. Access is granted under controlled Identity Access Management (IAM) policies, maintaining security even during emergencies.

For Network Fabric environments, the current break-glass model, known as Method D v1.5, relies on shared password authentication. This model, however, is limited to 15 shared accounts and poses significant security risks. Method D v2.0 introduces a modernized approach, implementing FIDO-2 devices and SSH keys to secure break-glass access. Key improvements include:

- **Strict access control**: Customer administrators control access through individual assignments instead of shared accounts.

- **Strong authentication**: Break-glass access is managed via Microsoft Entra with Multi-Factor Authentication (MFA) and Single Sign-On (SSO), eliminating local account dependencies.

- **Enhanced security**: Unauthorized access attempts are logged for audit and investigation purposes.

## Prerequisites for upgrading or installing runtime version 4.0.0

With the installation or upgrade to Runtime Fabric version 4.0.0, **MethodDV2.0** is enabled by default, enhancing security for BreakGlass access on on-premises network devices. Follow these steps to ensure secure and effective access control.

### Step 1: Register NexusIdentity Resource Provider

Customers must register the **Microsoft.NexusIdentity** user resource provider on their subscription.

1. Register the resource provider:

   ```Azure CLI
   az provider register --namespace Microsoft.NexusIdentity --wait
   ```
   
2. Verify the registration status:

   ```Azure CLI
   az provider show --namespace Microsoft.NexusIdentity -o table
   ```

   The registration status should display as **"Registered"**.

### Step 2: Assign necessary permissions for Network Fabric access

As part of the **Secure Future Initiative (SFI)**, **On-Behalf-Of (OBO) tokens** are now required to grant access to customer resources. This token provides **reader permissions** to Microsoft’s 1P service for the Network Fabric instance, allowing access to NNF built-in roles assigned to BreakGlass users. Assign the following permissions to the end-user for Create, Read, Update, and Delete (CRUD) operations on Network Fabric (NF) resources.

#### Required permissions

1. `Microsoft.NexusIdentity/identitySets/read`
2. `Microsoft.NexusIdentity/identitySets/write`
3. `Microsoft.NexusIdentity/identitySets/delete`

#### Configure Azure RBAC for NexusIdentityRP

1. Under **Privileged Administrator Roles**, select **Azure RBAC Administrator** as the built-in role and click **Next**.

2. In the **Members** tab, add **NexusIdentityRP** with the following details:

   - **Object ID:** `71949d44-2def-42f7-b10b-993a3f952347`

   - **Type:** `App`

3. Select **Role and Principal**, then assign:

   - **Role:** Reader

   - **Principal:** NexusIdentityRP

4. Click **Save** to finalize the configuration.

### Deployment scenario permissions

- **New deployment scenarios:** Grant constrained delegated permissions at the **resource group scope**.

- **Existing deployment scenarios:** Grant constrained delegated permissions at the **Network Fabric scope**.

>[!NOTE] These steps are required for creating, deleting, or upgrading Network Fabric to runtime version 4.0.0, even if MethodDV2.0 is not utilized. Failure to complete these steps will cause CRUD operations to fail.

#### Additional Prerequisites for Method DV2.0

To use Method DV2.0, complete the following setup steps on the end-user machine:

1. **Python requirement**  

   Ensure that Python version 3.11 is installed on the end-user machine.

2. **Azure CLI requirement**  

   - If Azure CLI is not installed, download and install the latest 64-bit MSI installer.

   - If Azure CLI is already installed, upgrade to version 2.61 or higher.

   > [!NOTE]
   > Only the 64-bit Azure CLI installer is supported, as certain Python packages required by Method DV2.0 are incompatible with the 32-bit version.

## Setting Up Method D v2.0 for break-glass access

### Step 1: Configure FIDO-2 token and register the public key in Microsoft Entra

To set up secure access, users need a FIDO-2 hardware token, which provides unphishable multi-factor authentication using both a fingerprint and a personal PIN.

1. **Connect the FIDO-2 token**: Insert the FIDO-2 token into your computer.

2. **Run the AZ CLI command**: Log in to your Azure account and execute the following command:

   ```Azure CLI
   az nexusidentity gen-keys
   ```
   This command, available from Azure CLI 2.65.0, detects the attached hardware token, prompts for a fingerprint scan and PIN, and stores the public key in your Entra account.

> [!NOTE] 
> Re-run this command anytime you need to refresh your break-glass credentials.

### Step 2: Assign break-lgass permissions to a Network Fabric instance

With assistance from Microsoft, customer administrators can assign one of two roles scoped to a specific Network Fabric instance:

- **Nexus Network Fabric Service reader**: Allows users to view configuration but restricts access to modification commands.

- **Nexus Network Fabric Service writer**: Provides permission to modify the running configuration.

These roles match permissions provided under the TelcoRO and TelcoRW accounts in Method D v1.5.

After assigning read or write access, usernames and public keys are synced across all devices within the instance. This sync occurs within a four-hour window or can be triggered immediately by running a Nexus Network Fabric reconcile operation.

### Day-to-day break-glass access workflow

To log into a Fabric device:

1. **Connect FIDO-2 token**: Ensure the FIDO-2 token is plugged into your computer.

2. **Log In with SSH**: Use one of the following methods:

   - **Direct SSH access with jump host**:

     ```bash
     ssh -J JumpBoxUsername@JumpBoxIp EntraUsername@FabricDeviceIP
     ```

> [!NOTE] 
> This command authenticates first on the jump server, then on the Fabric device.

   - **Indirect access using SSH-agent forwarding**:

     First, connect to the jump server and then SSH into the Fabric device. SSH-agent forwarding relays authentication requests to your local machine, using the token to complete the process.

3. **Authenticate**: During authentication, you’ll be prompted to verify via fingerprint and PIN, ensuring robust security.

> [!Fallback] 
> Method D v1.5 remains available as a fallback for emergency access if Method D v2.0 is temporarily unavailable.
