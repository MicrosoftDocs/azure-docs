---
title: Troubleshoot replication issues in agentless VMware VM migration
description: Get help with replication cycle failures
author: piyushdhore-microsoft
ms.author: dhananjayanr
ms.manager: dhananjayanr
ms.topic: troubleshooting
ms.service: azure-migrate
ms.reviewer: jsuri
ms.date: 07/14/2026
ms.custom: vmware-scenario-422, engagement-fy24
# Customer intent: As a VMware administrator, I want to troubleshoot replication cycle failures during agentless VM migration, so that I can ensure seamless and reliable data transfer to the cloud.
---

# Troubleshooting replication issues in agentless VMware VM migration

When you replicate a VMware virtual machine by using the agentless replication method, you replicate data from the virtual machine's disks (vmdks) to replica managed disks in your Azure subscription. When replication starts for a VM, an initial replication cycle occurs, in which full copies of the disks are replicated. After the initial replication completes, incremental replication cycles are scheduled periodically to transfer any changes that occurred since the previous replication cycle. You might occasionally see replication cycles failing for a VM. These failures can happen for many reasons, ranging from issues in on-premises network configuration to problems at the Azure Migrate Cloud Service backend. 

This article describes some common issues and specific errors that you might encounter when you replicate on-premises VMware VMs by using the agentless method. It also provides recommended actions to remediate them.

## Common Replication Errors
The following error codes frequently occur during agentless VMware replication in Azure Migrate. Use the guidance in the following table to fix these errors. 

| **Error** | **Cause** | **Action** |
|--|--|--|
| **542**:StorageAccountNotFound | The operation failed because of one of the following reasons:<br/>- You moved the storage account to a different resource group.<br/>- You deleted the storage account used for storing replication data for the virtual machines.<br/>- You migrated the storage account from Classic to Resource Manager deployment model. | Stop replication on the virtual machine and restart or re-enable replication on the virtual machine. |
| **587**:StateContainerNotFound | Replication was disabled for the virtual machine. | Stop replication on the virtual machine and restart or re-enable replication on the virtual machine. |
| **633**:SubscriptionSnapshotOperationThrottled | The subscription has a large number of protected disks, resulting in aggregate snapshot operations exceeding the Azure subscription-level rate limit. | Retry the operation after 30 minutes. If the issue persists, consider distributing protected virtual machines across multiple subscriptions or contact support. |
| **508**:ResyncSnapshotDoesNotExist | Resync snapshot is deleted. | Restart resynchronization. If the issue persists, contact support. |
| **1039**:InsufficientPermissionsOnKeyVault | The required permissions on the Key Vault might be removed. | 1. Grant the **Hyper-V Recovery Manager** app the following Key Vault permissions: get, list, delete, set, update, regeneratekey, getsas, listsas, deletesas, setsas, recover, backup, restore.<br/>2. Grant the **\*authandaccessaadapp** app the following Key Vault permissions: get, list, set, update, delete, recover, backup, restore.<br/>3. Ensure the certificate attached to the AAD app is valid and installed on the appliance.<br/>4. Ensure existing Azure policies within the subscription have exemptions to allow access to the Key Vault.<br/>5. Ensure the network configuration allows access to the Key Vault resource.<br/>6. Retry the operation. If the issue persists, contact support. |
| **572**:ConsolidateDisksFailed | Couldn't consolidate the disks on the VM at the end of the replication cycle. | Retry the operation. Stop any backup apps that might be running before retrying. If the issue persists, contact support. |
| **1022**:HostConnectionRefused | The Azure Migrate appliance is unable to connect to the vSphere host. This condition might happen if:<br/>- The appliance is unable to resolve the hostname of the vSphere host.<br/>- The appliance is unable to connect to the vSphere host on TCP port 902 (default port used by VMware VDDK) because the port is blocked on the host or by a network firewall. | 1. Verify hostname resolution from the appliance: `nslookup '<HostName>'`.<br/>2. If DNS resolution fails, either fix DNS or add a static entry in `C:\Windows\System32\drivers\etc\hosts` on the appliance.<br/>3. Validate TCP connectivity: `Test-NetConnection '<HostName>' -Port 902`.<br/>4. If the TCP test fails, engage your network team to remove the firewall block. |
| **563**:DiskSnapshotChangeIdIsNotAvailable | The operation failed because either:<br/>- Changed Block Tracking (CBT) isn't enabled on the disk, or<br/>- The disk is marked as an independent disk. | - Enable Changed Block Tracking (CBT) and retry. For more information, see [VMware CBT guidance](https://go.microsoft.com/fwlink/?linkid=2125430).<br/>- Remove the independent disk or make it dependent.<br/>- Stop any backup apps that might be running before retrying. If the issue persists, contact support. |
| **566**:NoDiskSnapshotsFound | The operation failed due to one of the following reasons:<br/>- Path of one or more included disks changed due to Storage vMotion.<br/>- One or more included disks is no longer attached to the VM. | - If this condition occurred during replication, wait for a few cycles. Replication turns green again if the failure was due to Storage vMotion. If not, stop replication and replicate again.<br/>- If this condition occurred during migration, wait 15 minutes before retrying migration.<br/>- If the issue persists, contact support. |
| **1023**:SnapshotDiskAttachedInPhysicalMode | Raw disk attached in physical mode isn't supported by snapshot replication. | Retry the operation after attaching the disk in virtual mode. If the issue persists, contact support. |

## Connectivity and timeout errors

These errors indicate that the Azure Migrate appliance can't reach one of the Azure service endpoints (Service Bus, Event Hubs, cache Storage Account, or Key Vault) within the expected time. Validate appliance health, gateway service status, and network connectivity to Azure.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **1011**:DiskUploadTimedOut | The appliance is unable to connect to Azure Cloud Services, or replication is progressing slowly, causing the cycle to time out. Possible causes:<br/>- Appliance down.<br/>- Gateway service not running.<br/>- Connectivity issues to Service Bus / Event Hubs / cache Storage Account / Key Vault.<br/>- vCenter-level throttling while reading the disk. | 1. Ensure the Azure Migrate appliance is up and running.<br/>2. Check the gateway service (services.msc → **Microsoft Azure Gateway Service**); if stopped, start it or run `Net Start asrgwy`.<br/>3. Validate connectivity to the cache Storage Account: `azcopy bench 'https://[account].blob.core.windows.net/[container]?SAS'`.<br/>4. Validate Service Bus connectivity using the Service Bus Explorer (**Receive Messages > Peek** on Snapshot Manager).<br/>5. Validate Key Vault connectivity: `test-netconnection <KeyVaultURI> -P 443` — confirm `TcpTestSucceeded = True`.<br/>6. If any test fails, engage your network team to fix firewall or connectivity issues. |
| **1012**:DiskDownloadTimeout | The download service is experiencing technical difficulties. | Retry the operation. If the problem persists, contact support. |
| **181008**:DisposeArtefactsTimedOut | The component trying to replicate data to Azure is either down or not responding. The gateway service on the appliance might be down, or it's experiencing connectivity problems to Service Bus, Event Hubs, or Appliance Storage Account. | 1. Ensure the Azure Migrate appliance is running.<br/>2. Check the gateway service is running; if not, run `Net Start asrgwy`.<br/>3. Validate connectivity to the appliance Storage Account: `azcopy bench 'https://[account].blob.core.windows.net/[container]?SAS'`.<br/>4. Validate Service Bus connectivity by using the Service Bus Explorer.<br/>5. Validate Key Vault connectivity: `test-netconnection <KeyVaultURI> -P 443`.<br/>6. Engage your network team if any of these tests fail. |
| **1003**:SnapshotReplicationComponentTimeOut | The component is experiencing downtime or a network outage. | For further investigation, see [the Azure Migrate replication troubleshooting guide](https://go.microsoft.com/fwlink/?linkid=2142917). Validate appliance health, gateway service, and connectivity to Azure endpoints as documented earlier. |

## Key Vault access and configuration problems

These errors occur when the user configuring replication doesn't have the required access policy on the Migrate project Key Vault, or when a Key Vault created by a different user doesn't carry an access policy for the current user.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **KeyVaultOperationFailed**:ConfigureManagedStorageAccount | The User Access Policy for the Key Vault doesn't grant the currently signed-in user the permissions to configure storage accounts to be Key Vault managed. This problem typically happens when:<br/>- The signed-in user is a remote principal on the customer's Azure tenant (CSP subscription), or<br/>- A different user (user2) is retrying replication after the Key Vault was created by user1, and user2 has no access policy in the Key Vault. | **CSP / remote principal case:** delete the Key Vault, sign out, and sign in with a user account from the customer's Entra tenant that has **Owner** or **Contributor + User Access Administrator** on the Migrate project resource group.<br/><br/>**Multi-user case:** run the following PowerShell to create an access policy for user2 in the Key Vault:<br/>`$userPrincipalId = $(Get-AzureRmADUser -UserPrincipalName 'user2_email_address').Id`<br/>`Set-AzureRmKeyVaultAccessPolicy -VaultName 'keyvaultname' -ObjectId $userPrincipalId -PermissionsToStorage get, list, delete, set, update, regeneratekey, getsas, listsas, deletesas, setsas, recover, backup, restore, purge` |
| **KeyVaultOperationFailed**:GenerateSasDefinition | Same underlying cause as **ConfigureManagedStorageAccount** — the signed-in user doesn't hold the necessary Key Vault access policy to generate SAS definitions. | Apply the same remediation as **ConfigureManagedStorageAccount** earlier. Ensure the user account has the required permissions on the Key Vault (specifically the SAS-related permissions: `getsas, listsas, deletesas, setsas`). |

## VMware Changed Block Tracking and snapshot data errors

The agentless replication method uses VMware Changed Block Tracking (CBT). These errors occur when CBT is reset, disabled, or blocked by pre-existing snapshots on the source VM.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **FetchChangedBlocksFailed**:Encountered an error while trying to fetch change blocks | The agentless replication method uses VMware CBT to replicate only blocks changed since the last cycle. This error occurs if CBT for a replicating VM is reset or if the CBT file is corrupt. One known problem: CBT resets after a Storage vMotion in vSphere 5.x. For more information, see [VMware KB 1020128](https://kb.vmware.com/s/article/1020128). | 1. If you opted for **Automatically repair replication**, right-click the VM and select **Repair Replication**.<br/>2. Otherwise, stop replication, reset CBT on the VM, and reconfigure replication.<br/>3. On vSphere 5.5, apply the updates in [VMware KB 1020128](https://kb.vmware.com/s/article/1020128).<br/>4. You can also reset CBT via VMware PowerCLI. |
| **1018**:ChangeBlockTrackingReset | The change block tracking on the VM is reset. | Repair replication for the VM. If **Automatically Repair Replication** is enabled, right-click the VM and select **Repair Replication**. Otherwise, stop replication, reset CBT on the source VM per [VMware KB 1020128](https://kb.vmware.com/s/article/1020128), and reconfigure replication. |
| **ProtectionReadinessError**:CBT cannot be enabled — snapshots present | Change tracking can't be enabled for the VM because snapshots are already present on the VM. | Delete the existing snapshots on the VM, or enable Changed Block Tracking on the VM, and retry. |

## VMware environment and internal errors

These errors surface from the underlying VMware environment or API during snapshot lifecycle operations (create, delete, consolidate). Remediation typically involves following the referenced VMware knowledge base article for the specific condition.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **InternalError**:Server Refused Connection | Known VMware issue in VDDK 6.7. | Stop the gateway service on the appliance (`Net Stop asrgwy`), apply the update from [this VMware KB](https://go.microsoft.com/fwlink/?linkid=2138889), and restart the gateway service (`Net Start asrgwy`). |
| **InternalError**:InvalidSnapshotConfiguration | An invalid snapshot configuration was detected, typically after a disk was removed from a multi-disk VM. | Follow the resolution provided in [VMware KB](https://go.microsoft.com/fwlink/?linkid=2138890). |
| **InternalError**:GenerateSnapshotHung | Snapshot generation stops responding. The create-snapshot task hangs at 95% or 99%. | Follow the resolution provided in [VMware KB](https://go.microsoft.com/fwlink/?linkid=2138969). |
| **InternalError**:FailedToConsolidateDisks | Disk consolidation at the end of a replication cycle fails. | Follow the resolution provided in [VMware KB](https://go.microsoft.com/fwlink/?linkid=2138970) using the appropriate **Reason**. |
| **InternalError**:AnotherTaskInProgress | Conflicting VM tasks run in the background, or a vCenter Server task times out. | Wait for the conflicting task to complete and retry. If vCenter tasks are timing out, investigate vCenter health. |
| **InternalError**:OperationNotAllowedInCurrentState | vCenter Server management agents stop working. | Follow the resolution provided in [VMware KB](https://go.microsoft.com/fwlink/?linkid=2138971). |
| **InternalError**:SnapshotDiskSizeInvalid | Known VMware issue in which the disk size indicated by the snapshot becomes zero. | Contact VMware support or refer to the applicable VMware KB for the ESXi/vCenter version in use. |
| **InternalError**:MemoryAllocationFailed | NFC host buffer is out of memory. | Compute vMotion the affected VM to a different host with free resources. |
| **InternalError**:FileLargerThanMaxSupported | The snapshot file size exceeds the maximum supported file size (VMware error 1012384). | Follow the resolution provided in [VMware KB](https://knowledge.broadcom.com/external/article?articleNumber=316392). |
| **InternalError**:CannotConnectToHost | ESXi host can't connect to the network (VMware error 1004109). | Investigate ESXi host network connectivity and restore management network access. |
| **InvalidChangeTrackerErrorCode**:SnapshotSaveFailure | A problem with the underlying datastore where the snapshot is being stored. | Follow the resolution provided in [VMware KB](https://kb.vmware.com/s/article/2042742). |
| **UnableToOpenSnapshotFile**:SnapshotCreationFailure | The snapshot file size is larger than available free space in the datastore where the VM is located. | Free up datastore space or move the VM to a datastore with sufficient free space.|
| **1028**:VMwareGenericFailure | A VMware operation failed and the underlying error is surfaced through the appliance. | Inspect the runtime error string in the failure message and refer to [the Azure Migrate VMware troubleshooting guide](https://go.microsoft.com/fwlink/?linkid=2143208) for the matching VMware condition. |

## Next steps

- Review the [Azure Migrate agentless VMware migration documentation](./tutorial-migrate-vmware.md).
