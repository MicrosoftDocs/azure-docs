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

- **Strict access control**: Customer administrators control access through individual assignments instead of shared accounts.

- **Strong authentication**: Break-glass access is managed via Microsoft Entra with Multi-Factor Authentication (MFA) and Single Sign-On (SSO), eliminating local account dependencies.

- **Enhanced security**: Unauthorized access attempts are logged for audit and investigation purposes.

## Prerequisites

Starting with `NNF-7.0.0`, Method DV2.0 is enabled by default to enhance the security of break-glass access for on-premises network devices. The following steps are required from the `NNF-7.0.0` release onwards.

1. **Register the Resource Provider**  
   
   Register the `Microsoft.NexusIdentity` resource provider within your subscription.

   ```Azure CLI
   az provider register --namespace Microsoft.NexusIdentity --wait
   ```

2. **Validate the Resource Provider registration**  
   
   Confirm that the registration status shows as `Registered`.

   ```Azure CLI
   az provider show --namespace Microsoft.NexusIdentity -o table
   ```

   > [!NOTE]
   > Ensure the status displays as `Registered` to proceed.

3. **On-Behalf-Of (OBO) tokens to control access**

As part of the Secure Future Initiative (SFI), all customer resources now require On-Behalf-Of (OBO) tokens to control access. This security measure enhances protection and simplifies access management. Method DV2.0 uses OBO tokens to grant reader permissions to Microsoft’s 1P service for the Network Fabric resource, allowing the service to read built-in NNF roles assigned to Breakglass users.

To ensure correct workflow functionality, assign the following permissions for Create, Read, Update, and Delete (CRUD) operations on Network Fabric (NF) resources only:

```plaintext
Microsoft.NexusIdentity/identitySets/read
Microsoft.NexusIdentity/identitySets/write
Microsoft.NexusIdentity/identitySets/delete
```

4. **Delegate Azure RBAC Administrator Role**  

   Add the Azure RBAC administrator role with “delegate permissions” to the Nexus Identity App ID for the permissions listed above. 

### Deployment scenarios

To set up the required permissions for Network Fabric, follow the appropriate instructions based on your deployment type.

#### **New deployment scenarios**

If Network Fabric instances have not yet been created, permissions need to be assigned at the **Resource Group** level. This allows the NexusIdentity service to manage Network Fabric resources within the designated group. 

**Steps to assign permissions at the Resource Group level:**

1. **Navigate to the Azure Portal**  

   Go to the **Resource Group** that will contain your Network Fabric resources.

2. **Open Access Control (IAM)**  

   In the resource group’s menu, select **Access control (IAM)** to manage roles and permissions.

3. **Add a role assignment**  

   - Click **Add > Add role assignment**.

   - In the **Role** dropdown, select **Constrained Reader**. This role provides limited, read-only access to manage Network Fabric resources without full administrative privileges.

4. **Select the NexusIdentity Service Principal**  

   - Under **Members**, click **Select members**.

   - Search for and select **NexusIdentity User RP service principal**. This service principal allows the NexusIdentity service to manage resources within the Resource Group.

5. **Review and Save**  

   Confirm the role assignment details, then click **Review + assign** to apply the permissions.

   > **Outcome:** The NexusIdentity service can now read and manage Network Fabric resources within the specified Resource Group, preparing it for future deployment actions.

#### **Existing Deployment Scenarios**

If Network Fabric instances are already created, permissions should be applied directly to the **Network Fabric resource** to ensure only the necessary access is granted for ongoing management.

**Steps to assign permissions at the Network Fabric resource level:**

1. **Locate the Network Fabric Resource** 

   Go to the **Network Fabric** resource that requires delegated permissions.

2. **Open Access Control (IAM)**  

   In the Network Fabric resource menu, select **Access control (IAM)** to manage roles and permissions for that specific resource.

3. **Add a Role Assignment**  

   - Click **Add > Add role assignment**.

   - In the **Role** dropdown, select **Constrained Reader** to provide restricted, read-only access tailored to managing Network Fabric resources.

4. **Assign to the NexusIdentity Service Principal**  

   - Under **Members**, select **Select members**.

   - Search for and select **NexusIdentity User RP service principal**.

5. **Review and Confirm**  

   Verify the role assignment and click **Review + assign** to finalize.

   > **Outcome:** The NexusIdentity service now has the necessary delegated permissions to manage the Network Fabric resource directly, enabling CRUD operations within the specific scope.

> [!NOTE]
> Complete these steps before performing any Create, Read, Update, or Delete (CRUD) operations, such as creating, deleting, or upgrading Network Fabric resources to `NNF-7.0.0`. Without these permissions, CRUD operations will fail. 

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
