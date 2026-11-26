---
title: Access Azure Files from Windows 365 Cloud PCs
description: Configure identity-based access to SMB Azure file shares from Microsoft Entra joined Windows 365 Cloud PCs and deploy drive mappings with Intune.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/10/2026
ms.author: kendownie
# Customer intent: "As an endpoint and storage administrator, I want to give Windows 365 users identity-based access to shared files so that they can use a network drive without managing storage account credentials."
---

# Access Azure Files from Microsoft Entra joined Windows 365 Cloud PCs

**Applies to:** SMB Azure file shares; Microsoft Entra joined Windows 365 Cloud PCs using an Azure network connection (ANC).

Windows 365 Cloud PCs have a fixed amount of storage. If your users need more space, you can connect their Cloud PCs to an Azure file share and map it as a network drive in File Explorer, such as D: or Z:. Microsoft Entra Kerberos authenticates the user. Azure role-based access control (Azure RBAC) and Windows access control lists (ACLs) determine which files the user can access.

In this article, you learn how to:

- Plan the identity, network, and permissions configuration.
- Configure Azure Files and the Cloud PC for Microsoft Entra Kerberos.
- Validate access before deploying drive mappings through Microsoft Intune.
- Plan for ticket expiration and long-running sessions.

> [!NOTE]
> The optional drive-mapping automation is from the community-maintained [azure-files-cloudpc repository](https://github.com/Mauvlans/azure-files-cloudpc), not a Microsoft product. Review and test that code independently before deployment.

> [!IMPORTANT]
> Microsoft Entra Kerberos currently doesn't support ticket-granting ticket (TGT) renewal. Access can fail after approximately 10 hours, when the client needs a new service ticket. Signing out of Windows and signing back in restores access. Disconnecting from the Cloud PC isn't the same as signing out. Evaluate this limitation before selecting this architecture for persistent sessions.

## Scenario and scope

This example provides a shared data drive to users in the same Microsoft Entra tenant as the storage account. It uses Cloud PCs whose network adapters are connected to a customer-managed virtual network through an ANC.

The article doesn't configure Cloud PC provisioning, FSLogix profile containers, cross-tenant access, or migration of an existing storage account's identity source. The ANC is a requirement of this example, not a general requirement for every Azure Files client.

For other identity and device configurations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md).

## Architecture

:::image type="content" source="media/windows-365-cloud-pc-workloads/cloud-pc-files-architecture.svg" alt-text="Diagram that shows Intune management, Microsoft Entra Kerberos authentication, and a Cloud PC accessing Azure Files through a private endpoint." border="false":::

*Figure 1. Management, authentication, and file access use different paths. The illustrated data path uses a private endpoint.*

| Component | Purpose |
| --- | --- |
| Windows 365 Cloud PC | Hosts the user's Windows session and the SMB client. Its network adapter is in the ANC subnet. |
| Microsoft Entra ID | Provides the sign-in identity and Microsoft Entra Kerberos tickets. |
| Microsoft Intune | Delivers the client policy and, optionally, the drive-mapping application. It isn't in the file-data path. |
| Virtual network and DNS | Provide name resolution and connectivity to the storage endpoint. |
| Azure Files | Hosts the SMB share and enforces share-level permissions and Windows ACLs. |
| Optional mapping task | Creates or repairs a drive mapping in the signed-in user's non-elevated session. It isn't a file proxy or authentication service. |

### Authentication and authorization flow

:::image type="content" source="media/windows-365-cloud-pc-workloads/cloud-pc-files-access-flow.svg" alt-text="Diagram that shows Windows sign-in, cloud ticket retrieval, a CIFS service ticket request, and the Azure Files share and file permission checks." border="false":::

*Figure 2. A valid Kerberos ticket establishes identity. Both authorization layers must also allow the requested operation.*

1. The user signs in to a Microsoft Entra joined Cloud PC. With cloud ticket retrieval enabled, Windows obtains the cloud TGT during sign-in.
1. The SMB client requests a Kerberos service ticket for the storage account's CIFS service through the Microsoft Entra KDC proxy.
1. The client connects to the storage account over SMB on TCP port 445 and presents the service ticket.
1. Azure Files checks the user's effective share-level access.
1. Azure Files evaluates Windows ACLs on the requested directory or file.
1. If all checks succeed, the user can perform the permitted operation through the mapped drive.

The storage account's Microsoft Entra application enables the authentication flow. Assigning users to that application isn't a substitute for Azure Files data permissions.

## Prerequisites

Before you begin, confirm the following requirements.

| Area | Requirement |
| --- | --- |
| Cloud PC | An existing, Intune-managed, Microsoft Entra joined Cloud PC on the intended ANC subnet. Check the join state and network placement on the same device. |
| Windows version | Use a supported Windows version and current cumulative updates. The community sample targets Windows 11 24H2 or later; a base build check alone doesn't validate required fixes. Follow the current Azure Files OS requirements linked in the next section. |
| Tenant and cloud | Use identities and a storage subscription in the same tenant. For cloud-only identities, current Azure Files guidance lists Azure public cloud support, not Azure Government or Azure operated by 21Vianet. |
| Storage | An SMB Azure file share. Only one identity source can be configured per storage account. Don't change a production account from AD DS or Microsoft Entra Domain Services as part of this pilot. |
| Network | DNS resolution, TCP 445 to the storage endpoint, and the HTTPS connectivity required for Microsoft Entra sign-in, Kerberos, Intune, and Windows 365. |
| Windows services | The WinHTTP Web Proxy Auto-Discovery Service and IP Helper service are running, as required by the Azure Files authentication guidance. |
| Administration | Separate permissions to manage storage and network resources, assign Azure roles, configure Microsoft Entra applications and consent, and create and assign Intune policies and apps. Use least privilege for each task. |
| Security approval | Approval for the storage application's applicable MFA Conditional Access exclusion and for any pilot session-limit policy. |

For exact supported operating systems, updates, identity restrictions, and application-management policy requirements, see [Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites).

### Plan groups and permissions

Use separate groups for device management and file access. Record their object IDs so you don't confuse similarly named groups.

| Group or role | Scope and purpose |
| --- | --- |
| Pilot Cloud PC device group | Receives Intune policy and the mapping application. Membership doesn't grant file access. |
| File-access user group | Receives the appropriate share-scoped data role and the required Windows ACL permissions. |
| Temporary ACL administrator | Receives only the permissions needed to initialize or correct ACLs. Remove temporary elevation after verification. |

For a simple read/write pilot, assign **Storage File Data SMB Share Contributor** at the share scope and grant the file-access group **Modify** through an appropriate inherited Windows ACL. Use a read-only role and ACL when users don't need write access.

Effective permissions must allow the user through both layers. The same group at both layers makes the example easier to audit, but identical group assignments aren't a platform requirement: a user can receive effective permissions through different groups. Review deny entries and inheritance as well as allow entries.

## Step 1: Configure your Cloud PC

Configure a Microsoft Entra joined Cloud PC connected to your Azure virtual network by following the Windows 365 documentation:

1. [Create an Azure network connection for Windows 365](/windows-365/enterprise/create-azure-network-connection). Select **Microsoft Entra Join** and the virtual network and subnet that the Cloud PC uses.
1. [Create a provisioning policy for Windows 365](/windows-365/enterprise/create-provisioning-policy). Select **Microsoft Entra Join** as the join type and **Azure network connection** as the network, then select your ANC. Complete the image selection and policy assignment described in that article.
1. After provisioning finishes, confirm that the Cloud PC is Microsoft Entra joined and connected to the intended ANC subnet. If you already have a Cloud PC that meets these requirements, use it for the pilot.

## Step 2: Configure storage network access

Choose a storage access model before creating resources.

| Option | Configuration | Considerations |
| --- | --- | --- |
| Private endpoint | Create a private endpoint for the file service, configure private DNS resolution from the ANC virtual network, and restrict public network access as required. | Provides a private IP destination. Custom DNS requires an appropriate forwarding or resolver design. |
| Service endpoint | Enable the Microsoft.Storage service endpoint on the Cloud PC subnet and allow that subnet in a default-deny storage firewall configuration. | Uses the public storage endpoint with virtual-network restrictions. It isn't a private endpoint. Review existing IP rules, virtual network rules, and bypass settings. |

Choose the storage region with Cloud PC latency, resilience, availability, and cost in mind. Size capacity and performance for the expected workload rather than accepting sample defaults.

For private endpoint access, continue using the normal share path, for example `\\<storage-account>.file.core.windows.net\<share>`. DNS resolves that name to the private endpoint address. Don't change the UNC path to an IP address.

If the virtual network uses custom DNS, configure and test private endpoint name resolution. Don't assume that creating a private DNS zone automatically configures an on-premises resolver. See [Azure Files networking considerations](storage-files-networking-overview.md) and [Configure Azure Files network endpoints](storage-files-networking-endpoints.md).

## Step 3: Create a storage account and Azure Files SMB share

Follow [Create a classic file share](create-classic-file-share.md) to create a storage account and SMB file share suitable for your workload.

Select the region, redundancy, capacity, and performance settings for your Cloud PC users. Apply the private endpoint or service endpoint configuration selected in Step 2, and verify DNS resolution and network access from the Cloud PC.

## Step 4: Configure identity-based access with Microsoft Entra Kerberos

Follow all the steps in [Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md).

### Step 4.1: Review Conditional Access

Microsoft Entra Kerberos doesn't support satisfying an MFA challenge for Azure Files SMB access. Have the security administrator review the policies that apply to the storage account's application.

Where required, exclude only the application named `[Storage Account] <storage-account>.file.core.windows.net` from the applicable MFA-requiring policies. Don't disable MFA tenant-wide or exclude unrelated applications.

Record the decision and review network restrictions, least-privilege file access, and monitoring as part of the security assessment. These controls don't make the SMB connection MFA-authenticated.

See [Disable multifactor authentication on the storage account](storage-files-identity-auth-hybrid-identities-enable.md#disable-multifactor-authentication-on-the-storage-account).

### Step 4.2: Configure share and file permissions

1. [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md) to the file-access group at the intended share scope.
1. Allow time for role assignments and group membership changes to propagate. The community repository advises allowing approximately 30 minutes for share RBAC; propagation time isn't a service guarantee.
1. [Configure directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md) for the intended user/group SIDs and inheritance model.
1. Verify the actual ACL on the root and a test directory. Don't assume an existing share has the intended descriptor.
1. Remove temporary administrative data access and any temporary firewall rules after configuration.

For cloud-only identities, use the currently documented SID-based ACL procedure; don't assume that File Explorer can resolve and select cloud-only groups. For hybrid identities, follow the documented AD DS connectivity requirements when managing ACLs.

> [!NOTE]
> SMB and FileREST ACL administration use different permissions. An SMB Share Elevated Contributor role doesn't automatically grant the privileged FileREST access used by the community repository's REST example. Review the API, role, and request requirements before adopting that alternative.

### Step 4.3: Enable cloud ticket retrieval on the Cloud PC

Follow [Configure the clients to retrieve Kerberos tickets](storage-files-identity-auth-hybrid-identities-enable.md#configure-the-clients-to-retrieve-kerberos-tickets).

1. In Intune, create a **Settings catalog** policy for **Kerberos > Cloud Kerberos Ticket Retrieval Enabled**, and set it to **Enabled**.
1. Assign the policy to the pilot Cloud PC device group.
1. Sync the device and follow the documented policy refresh or restart requirements.
1. Verify the effective client configuration, not just the Intune assignment status.
1. Sign out of Windows and sign back in to establish a new user session after configuration.

The documented effective registry value is `CloudKerberosTicketRetrievalEnabled = 1` under `HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters`. See [Configure the clients to retrieve Kerberos tickets](storage-files-identity-auth-hybrid-identities-enable.md#configure-the-clients-to-retrieve-kerberos-tickets).

If the same clients also access storage accounts configured for AD DS, follow the documented coexistence and realm-mapping instructions. Don't apply a tenant-wide client change without reviewing those dependencies.

## Step 5: Validate direct access before deploying drive mappings

On a pilot Cloud PC, validate access in the intended user's normal, non-elevated Windows session.

1. Confirm the device is Microsoft Entra joined and that its network adapter is in the intended ANC subnet.
1. Resolve the storage hostname. For a private endpoint, confirm the resulting destination is the intended private IP address.
1. Confirm TCP 445 connectivity and the required Microsoft Entra HTTPS connectivity.
1. Confirm cloud ticket retrieval is enabled and inspect Kerberos ticket state with the Windows `klist` utility.
1. Open the share by its UNC path without entering a storage account key or separate account credentials.
1. Verify the intended read, create, update, and delete operations. Don't use production files as test content.

## Step 6: Deploy the optional drive-mapping application

After direct access succeeds, use your approved Intune application process to deploy the reviewed community agent from the [azure-files-cloudpc repository](https://github.com/Mauvlans/azure-files-cloudpc).

1. Review the generated tenant-specific configuration: tenant ID, UNC path, drive letter, label, and mapping requirements. Don't package placeholder configuration.
1. Confirm ticket-cache purge is disabled. The sample setting `tgt.allowTicketPurge` defaults to `false`.
1. Build the package with the repository's packaging script. The build emits the Win32 application package and a standalone, version-stamped detection script.
1. In Intune, create a **Windows app (Win32)** with **System** installation behavior and appropriate architecture and supported OS requirements.
1. Use the generated detection script, not the source template. The detection script must work without adjacent package files.
1. Assign the app to the pilot device group and verify installation and detection.
1. Sign in as a pilot user and verify that the mapped drive appears in File Explorer and supports the intended operations.

The installer runs as SYSTEM to install protected files and register the task. The mapping task runs in the signed-in user's non-elevated context, so Explorer can see the mapping. Don't change the task to map drives as SYSTEM.

At the reviewed source state, the manifest specifies a 30-minute repeat interval and a 120-second sign-in delay. The installer also attempts reconnect and unlock triggers. Treat these as sample settings, not service guarantees. Verify the effective task after installation.

For upgrades, increment the package version before rebuilding and update the package and detection rule together. Review script signing, application control, and execution policy behavior under your organization's endpoint security standards.

## Plan for ticket expiration and long-running sessions

Windows 365 sessions can outlive the approximately 10-hour cloud TGT lifetime. An existing SMB session might continue temporarily, but subsequent ticket acquisition can fail. Don't describe the limitation as an exact 10-hour drive-disconnection timer.

The sample attempts non-destructive recovery and can notify the user to sign out. Refreshing a primary refresh token (PRT) or repairing a drive mapping isn't a supported guarantee of mid-session cloud TGT renewal.

The repository's optional Intune policy uses an eight-hour active session limit with forced sign-out, plus idle and disconnected session limits. This is a sample-specific operational mitigation, not an Azure Files requirement or a general Windows 365 recommendation.

> [!WARNING]
> Forced sign-out closes applications and can cause loss of unsaved work. Get endpoint and business-owner approval, communicate the behavior, and validate actual enforcement across reconnect, idle, and disconnected sessions. Don't assume a session limit guarantees a total sign-in age below the ticket lifetime.

If uninterrupted long-running sessions are a requirement, treat the ticket limitation as an architecture decision. The documented AD DS cloud trust mitigation requires an eligible AD DS-joined or hybrid-joined architecture; it isn't a configuration toggle for Microsoft Entra-only Cloud PCs.

See [Authentication stops after approximately 10 hours](/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication#authentication-stops-after-approximately-10-hours-when-using-microsoft-entra-kerberos).

## See also

- [Microsoft Entra Kerberos authentication for Azure Files](storage-files-identity-auth-hybrid-identities-enable.md)
- [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md)
- [Configure directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md)
- [Azure Files networking considerations](storage-files-networking-overview.md)
- [Azure Files authentication troubleshooting](/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication)
- [Community sample: Azure Files drive mapping for Windows 365](https://github.com/Mauvlans/azure-files-cloudpc)