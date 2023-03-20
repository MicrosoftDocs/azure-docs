---
title: Agent job error codes
description: Learn how to understand and remediate errors raised by the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/20/2023
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

!########################################################
-->

# Troubleshooting Job Run Error Codes

An Azure Storage Mover agent uses string status codes for statuses that are conveyed to the end user. All XDM status codes have the prefix *AZSM* followed by 4 decimal digits. The first decimal digit indicates the high-level scope of the status. Each status code should belong to one of the following scopes:

- Status that applies to the entire agent.<br />These use the scope digit '0' and hence have the prefix "AZSM0".
- Status that applies to a specific job that is being run by the agent.<br />These use the scope digit '1' and hence have the prefix "AZSM1".
- Status that applies to a specific file/dir being transferred by a job that is being run by the agent.<br />These use the scope digit '2' and hence have the prefix "AZSM2".

Each of these scopes can then further divide the statuses into categories and sub-categories and typically reserve 20 status codes for each sub-category to accommodate future expansion.

> [!TIP]
> *AZSM0000* is the special scope-agnostic status code indicating successful operation. This should be used to signify successful operation at any scope/level.

## Job run error codes

|Error Code                       |Error Message | Details/Troubleshooting steps/Mitigation |
|---------------------------------|--------------|------------------------------------------|
| <a name="AZSM1001"></a>AZSM1001 |Failed to mount source path | Verify the provided server information, name or IP-address, is valid, or the source location is correct. |
| <a name="AZSM1002"></a>AZSM1002 |Encountered an error while scanning the source  | Retry or create a support ticket. |
| <a name="AZSM1003"></a>AZSM1003 |Failed to access source folder due to permission issues | Check if the agent has been granted permissions correctly to the source file share. |
| <a name="AZSM1004"></a>AZSM1004 |Source path provided is invalid | Create a new endpoint with a valid source share path and update the job definition and retry. |
| <a name="AZSM1020"></a>AZSM1020 |Miscellaneous error while accessing source  | Retry or create a support ticket. |
| <a name="AZSM1021"></a>AZSM1021 |Failed to access target folder due to permission issues  | Retry or create a support ticket. |
| <a name="AZSM1022"></a>AZSM1022 |Target path provided is invalid | Create a new endpoint with a valid target container and path and update the job definition and retry. |
| <a name="AZSM1023"></a>AZSM1023 |Lease expired for this agent on the target container  | Retry or create a support ticket. |
| <a name="AZSM1024"></a>AZSM1024 |Authorization failure on claiming the target container | The agent does not have the permission to access the target container. The role assignment is performed automatically while running jobs from the portal. If you are using the APIs/Powershell cmdlets/SDKs, then manually create a 'Storage Blob Data Contributor' role assignment for the agent to access the target storage account blob container. The [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access) article may help resolve this issue. |
| <a name="AZSM1025"></a>AZSM1025 |Authentication failure on claiming the target container  | Retry or create a support ticket. |
| <a name="AZSM1026"></a>AZSM1026 |Blob type in the target container not supported by the agent | This blob type is unsupported by the current Storage Mover agent. |
| <a name="AZSM1040"></a>AZSM1040 |Miscellaneous error while accessing target  | Retry or create a support ticket. |
| <a name="AZSM1041"></a>AZSM1041 |Failed to send job progress  | Retry or create a support ticket. |
| <a name="AZSM1042"></a>AZSM1042 |Failed to create job  | Retry or create a support ticket. |
| <a name="AZSM1043"></a>AZSM1043 |Failed to resume job  | Retry or create a support ticket. |
| <a name="AZSM1044"></a>AZSM1044 |Failed to finalize the job  | Retry or create a support ticket. |
| <a name="AZSM1045"></a>AZSM1045 |Job was aborted while it was still running  | Retry or create a support ticket. |
| <a name="AZSM1060"></a>AZSM1060 |Miscellaneous error during job execution  | Retry or create a support ticket. |
