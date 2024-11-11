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

The Break-Glass mechanism provides temporary and emergency access to Azure Operator Nexus (AON) devices or services, primarily for disaster recovery, incident response, or essential maintenance. Access is granted under controlled Identity Access Management (IAM) policies, maintaining security even during emergencies.

For Network Fabric environments, the current break-glass model, known as Method D v1.5, relies on shared password authentication. This model, however, is limited to 15 shared accounts and poses significant security risks. Method D v2.0 introduces a modernized approach, implementing FIDO-2 devices and SSH keys to secure break-glass access. Key improvements include:

- **Strict Access Control**: Customer administrators control access through individual assignments instead of shared accounts.

- **Strong Authentication**: Break-glass access is managed via Microsoft Entra with Multi-Factor Authentication (MFA) and Single Sign-On (SSO), eliminating local account dependencies.

- **Enhanced Security**: Unauthorized access attempts are logged for audit and investigation purposes.

## Setting Up Method D v2.0 for break-glass access

### Step 1: Configure FIDO-2 Token and Register the Public Key in Microsoft Entra

To set up secure access, users need a FIDO-2 hardware token, which provides unphishable multi-factor authentication using both a fingerprint and a personal PIN.

1. **Connect the FIDO-2 Token**: Insert the FIDO-2 token into your computer.

2. **Run the AZ CLI Command**: Log in to your Azure account and execute the following command:

   ```Azure CLI
   az nexusidentity gen-keys
   ```
   This command, available from Azure CLI 2.65.0, detects the attached hardware token, prompts for a fingerprint scan and PIN, and stores the public key in your Entra account.

> [!NOTE] 
> Re-run this command anytime you need to refresh your break-glass credentials.

### Step 2: Assign Break-Glass Permissions to a Network Fabric Instance

With assistance from Microsoft, customer administrators can assign one of two roles scoped to a specific Network Fabric instance:

- **Nexus Network Fabric Service Reader**: Allows users to view configuration but restricts access to modification commands.

- **Nexus Network Fabric Service Writer**: Provides permission to modify the running configuration.

These roles match permissions provided under the TelcoRO and TelcoRW accounts in Method D v1.5.

After assigning read or write access, usernames and public keys are synced across all devices within the instance. This sync occurs within a four-hour window or can be triggered immediately by running a Nexus Network Fabric reconcile operation.

### Day-to-Day Break-Glass Access Workflow

To log into a Fabric device:

1. **Connect FIDO-2 Token**: Ensure the FIDO-2 token is plugged into your computer.

2. **Log In with SSH**: Use one of the following methods:

   - **Direct SSH Access with Jump Host**:

     ```bash
     ssh -J JumpBoxUsername@JumpBoxIp EntraUsername@FabricDeviceIP
     ```

> [!NOTE] 
> This command authenticates first on the jump server, then on the Fabric device.

   - **Indirect Access Using SSH-Agent Forwarding**:

     First, connect to the jump server and then SSH into the Fabric device. SSH-agent forwarding relays authentication requests to your local machine, using the token to complete the process.

3. **Authenticate**: During authentication, you’ll be prompted to verify via fingerprint and PIN, ensuring robust security.

> [!Fallback] 
> Method D v1.5 remains available as a fallback for emergency access if Method D v2.0 is temporarily unavailable.
