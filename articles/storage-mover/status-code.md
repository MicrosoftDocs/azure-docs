---
title: Troubleshooting Azure Storage Mover job run error codes
description: Learn how to understand and remediate errors raised by the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 08/07/2023
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final       

REVIEW Stephen/Fabian: completed
REVIEW Engineering: not reviewed
EDIT PASS: completed

Initial doc score: 79
Current doc score: 100 (648, 0)

!########################################################
-->

# Troubleshooting Storage Mover job run error codes

An Azure Storage Mover agent uses string status codes for statuses that are conveyed to the end user. All status codes have the prefix *AZSM* followed by four decimal digits. The first decimal digit indicates the high-level scope of the status. Each status code should belong to one of the following scopes:

- Status that applies to the entire agent.<br />These codes use the scope digit `0`, and therefore and have the prefix `AZSM0`.
- Status that applies to a specific job run by the agent.<br />These codes use the scope digit `1` and therefore have the prefix `AZSM1`.
- Status that may be set by the agent on a specific file or directory that is transferred by a job run by the agent.<br />These codes use the scope digit `2` and therefore have the prefix `AZSM2`.

Each of these scopes further divides statuses into categories and subcategories. Each subcategory typically reserves 20 status codes to accommodate future expansion.

> [!TIP]
> *AZSM0000* is the special scope-agnostic status code indicating successful operation. This should be used to signify successful operation at any scope/level.

|Error Code                       |Error Message | Details/Troubleshooting steps/Mitigation |
|---------------------------------|--------------|------------------------------------------|
| <a name="AZSM1001"></a>AZSM1001 |Failed to mount source path | Verify the provided server name or IP-address is valid, or the source location is correct. If using SMB, verify the provided username and password is correct. |
| <a name="AZSM1002"></a>AZSM1002 |Encountered an error while scanning the source  | Retry or create a support ticket. |
| <a name="AZSM1003"></a>AZSM1003 |Failed to access source folder due to permission issues | Verify that the agent has been granted permissions to the source file share. |
| <a name="AZSM1004"></a>AZSM1004 |Source path provided is invalid | Create a new endpoint with a valid source share path and update the job definition and retry. |
| <a name="AZSM1020"></a>AZSM1020 |Miscellaneous error while accessing source  | Retry or create a support ticket. |
| <a name="AZSM1021"></a>AZSM1021 |Failed to access target folder due to permission issues  | Retry or create a support ticket. |
| <a name="AZSM1022"></a>AZSM1022 |Target path provided is invalid | Create a new endpoint with a valid target container and path and update the job definition and retry. |
| <a name="AZSM1023"></a>AZSM1023 |Lease expired for this agent on the target container  | Retry or create a support ticket. |
| <a name="AZSM1024"></a>AZSM1024 |Authorization failure accessing the target location | The agent doesn't have sufficient permission to access the target location. RBAC (role-based access control) role assignments are performed automatically when resources are created using the Azure portal. If you're using the APIs, PowerShell cmdlets, or SDKs, manually create a role assignment for the agent's managed identity to access the target location. For NFS, use the *Storage Blob Data Contributor* role assignment. For SMB, use *Storage File Data Privileged Contributor*. The [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access) article may help resolve this issue. |
| <a name="AZSM1025"></a>**AZSM1025** |Authentication failure accessing the source location | Verify that the agent has been granted permissions to the source location. |
| <a name="AZSM1026"></a>**AZSM1026** |Target type is not supported by the agent | This target type is unsupported by the current Storage Mover agent. |
| <a name="AZSM1027"></a>**AZSM1027** |The target location is busy | The agent can't access the target location because an existing lease is active. This error may be caused by another agent writing to the location. Ensure no other job is running against the target. Retry or create support ticket. |
| <a name="AZSM1028"></a>**AZSM1028** |Key Vault access failure | Verify that the agent has been granted permissions to the relevant Key Vault. |
| <a name="AZSM1040"></a>**AZSM1040** |Miscellaneous error while accessing target  | It's likely that this error is temporary. Retry the migration job again. If the issue persists, please create a support ticket for further assistance. |
| <a name="AZSM1041"></a>**AZSM1041** |Failed to send job progress  | It's likely that this error is temporary. Retry the migration job again. If the issue persists, please create a support ticket for further assistance. |
| <a name="AZSM1042"></a>**AZSM1042** |Failed to create job  | It's likely that this error is temporary. Retry the migration job again. If the issue persists, please create a support ticket for further assistance. |
| <a name="AZSM1043"></a>**AZSM1043** |Failed to resume job  | Retry or create a support ticket. |
| <a name="AZSM1044"></a>**AZSM1044** |Failed to finalize the job  | Retry or create a support ticket. |
| <a name="AZSM1045"></a>**AZSM1045** |Job was aborted while it was still running  | Retry or create a support ticket. |
| <a name="AZSM1060"></a>**AZSM1060** |Miscellaneous error during job execution  | Retry or create a support ticket. |
| <a name="AZSM2021"></a>**AZSM2021** |File type not supported by target. | This target type does not support files of this type. Reference scalability and performance targets for [Azure Files](/azure/storage/files/storage-files-scale-targets) and [Azure Blob Storage](/azure/storage/blobs/scalability-targets) for additional information. |
| <a name="AZSM2024"></a>**AZSM2024** |Source path length longer than max supported by target.  | Refer to guidance within the [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata) article. |
| <a name="AZSM2026"></a>**AZSM2026** |Source file has size larger than max supported by target.  | Refer to guidance within the [Naming and referencing shares, directories, files, and metadata](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata) article. |
| <a name="AZSM2061"></a>**AZSM2061** |Unknown Error encountered when scanning the source. |  This is probably a transient error. Rerun the migration job. |
| <a name="AZSM2062"></a>**AZSM2062** |Failed to read source file due to permission issues. | Verify that the agent has been granted permissions to the source location. |
| <a name="AZSM2063"></a>**AZSM2063** |Encountered I/O error while reading source file.  | It's likely that this error is temporary. Retry the migration job again. If the issue persists, please create a support ticket for further assistance. |
| <a name="AZSM2069"></a>**AZSM2069** |Failed to read target file due to permission issues.  | Verify that the agent has been granted permissions to the target location. |
| <a name="AZSM2070"></a>**AZSM2070** |Cannot write blob because it has an active lease. | This error may be caused by another agent writing to the location. Ensure no other job is running against the target. Retry or create support ticket. |
| <a name="AZSM2080"></a>**AZSM2080** |Copy failed due to an unknown error.  | It's likely that this error is temporary. Retry the migration job again. If the issue persists, please create a support ticket for further assistance. |
