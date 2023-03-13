---
title: Agent job error codes
description: Learn how to understand and remediate errors raised by the Azure Storage Mover Agent.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 03/10/2023
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

# Agent Job Error Codes

An Azure Storage Mover agent uses string status codes for statuses that are conveyed to the end user. All XDM status codes have the prefix *AZSM* followed by 4 decimal digits. The first decimal digit indicates the high-level scope of the status. Each status code should belong to one of the following scopes:

1. Status that applies to the entire agent.<br />These use the scope digit '0' and hence have the prefix "AZSM0".
1. Status that applies to a specific job that is being run by the agent.<br />These use the scope digit '1' and hence have the prefix "AZSM1".
1. Status that applies to a specific file/dir being transferred by a job that is being run by the agent.<br />These use the scope digit '2' and hence have the prefix "AZSM2".

Each of these scopes can then further divide the statuses into categories and sub-categories and typically reserve 20 status codes for each sub-category to accommodate future expansion.

> [!IMPORTANT]
> *AZSM0000* is the special scope-agnostic status code indicating successful operation. This should be used to signify successful operation at any scope/level.

|Error Code                       |Error Message | Details/Troubleshooting steps/Mitigation |
|---------------------------------|--------------|------------------------------------------|
| **<a name="AZSM1001">AZSM1001</a>** |Failed to mount source path | Verify the provided server information, name or IP-address, is valid, or the source location is correct. |
| **<a name="AZSM1002">AZSM1002</a>** |Encountered an error while scanning the source  | Retry or create a support ticket. |
| **<a name="AZSM1003">AZSM1003</a>** |Failed to access source folder due to permission issues | Check if the agent has been granted permissions correctly to the source file share. |
| **<a name="AZSM1004">AZSM1004</a>** |Source path provided is invalid | Create a new endpoint with a valid source share path and update the job definition and retry. |
| **<a name="AZSM1020">AZSM1020</a>** |Miscellaneous error while accessing source  | Retry or create a support ticket. |
| **<a name="AZSM1021">AZSM1021</a>** |Failed to access target folder due to permission issues  | Retry or create a support ticket. |
| **<a name="AZSM1022">AZSM1022</a>** |Target path provided is invalid | Create a new endpoint with a valid target container and path and update the job definition and retry. |
| **<a name="AZSM1023">AZSM1023</a>** |Lease expired for this agent on the target container  | Retry or create a support ticket. |
| **<a name="AZSM1024">AZSM1024</a>** |Authorization failure on claiming the target container | The agent does not have the permission to access the target container. The role assignment is performed automatically while running jobs from the portal. If you are using the APIs/Powershell cmdlets/SDKs, then manually create a 'Storage Blob Data Contributor' role assignment for the agent to access the target storage account blob container. The [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access) article may help resolve this issue. |
| **<a name="AZSM1025">AZSM1025</a>** |Authentication failure on claiming the target container  | Retry or create a support ticket. |
| **<a name="AZSM1026">AZSM1026</a>** |Blob type in the target container not supported by the agent | This blob type is unsupported by the current Storage Mover agent. |
| **<a name="AZSM1040">AZSM1040</a>** |Miscellaneous error while accessing target  | Retry or create a support ticket. |
| **<a name="AZSM1041">AZSM1041</a>** |Failed to send job progress  | Retry or create a support ticket. |
| **<a name="AZSM1042">AZSM1042</a>** |Failed to create job  | Retry or create a support ticket. |
| **<a name="AZSM1043">AZSM1043</a>** |Failed to resume job  | Retry or create a support ticket. |
| **<a name="AZSM1044">AZSM1044</a>** |Failed to finalize the job  | Retry or create a support ticket. |
| **<a name="AZSM1045">AZSM1045</a>** |Job was aborted while it was still running  | Retry or create a support ticket. |
| **<a name="AZSM1060">AZSM1060</a>** |Miscellaneous error during job execution  | Retry or create a support ticket. |

## I'd like to retain any content below this section for future work

I'd like to retain any content below this section for future work.

## Upgrade-related status codes (range AZSM0001-AZSM0020)

|Status code| Description                                   |
|-----------|-----------------------------------------------|
|"AZSM0001" | Image download during agent upgrade failed.   |
|"AZSM0002" | Pre-upgrade checks for agent upgrade failed.  |
|"AZSM0003" | Actual upgrade process failed.                |
|"AZSM0004" | Post-upgrade checks for agent upgrade failed. |
|"AZSM0005" | Rollback for agent upgrade failed.            |

## Job run-related status codes

Status codes for various job run failures. These should cover *all* possible cases of job runs failures. These will be conveyed to the user as part of "jobrunlog" telling what happened to the job.

Based on the reason for job run failure these are grouped under the following categories:

### Source-related status codes (range AZSM1001-AZSM1020)

|Status code| Description                                                |
|-----------|------------------------------------------------------------|
|"AZSM1001" | Cannot mount source path.                                  |
|"AZSM1002" | Scanning failed for the job.                               |
|"AZSM1003" | Cannot access source folder/file due to permission issues. |
|"AZSM1004" | Invalid source path provided.                              |
|"AZSM1020" | Cannot access target folder due to other issues.           |

### Target-related status codes (range AZSM1021-AZSM1040)

|Status code| Description                                                   |
|-----------|---------------------------------------------------------------|
|"AZSM1021" | Cannot access target folder due to permission issues.         |
|"AZSM1022" | Invalid target path provided.                                 |
|"AZSM1023" | Lease expired for the target container for agent.             |
|"AZSM1024" | Authorization failure on claiming the target container.       |
|"AZSM1025" | Authentication failure on claiming the target container.      |
|"AZSM1026" | Blob type in the target container not supported by the agent. |
|"AZSM1027" | Target container is being used by some other job.             |
|"AZSM1040" | Cannot access target folder due to other issues.              |

### Status codes unrelated to source or target access (range AZSM1041-AZSM1060)

|Status code| Description                  |
|-----------|------------------------------|
|"AZSM1041" | Unable to send job progress. |
|"AZSM1042" | Failed to create job.        |
|"AZSM1043" | Failed to resume the job.    |
|"AZSM1044" | Failed to finalize the job.  |
|"AZSM1045" | Job canceled.                |
|"AZSM1060" | Job failed.                  |

## Copy failure-specific status codes

Status codes for various copy failures are provided below. These should cover all possible scenarios in which a source file is prevented from being copied to target. These codes will be conveyed to the user as part of the copy log.

### Excluded (status code range AZSM2001 - AZSM2020)

The file was excluded by at least one user specified filter. This is not actually an error but neverthless we make a note of it to let user know that these files were skipped due to some exclusion filter.

|Status code| Description                                              |
|-----------|----------------------------------------------------------|
|"AZSM2001" | File was excluded by at least one user specified filter. |

### Unsupported (status code range AZSM2021 - AZSM2040)

One or more of the source file's characteristics makes it unfit for storing in the target, e.g., the source file may have deeper directory depths than what the target supports, or it may have path/component lengths longer than that supported by the target, or it may be a filetype not supported by the target, etc.

|Status code| Description                                              |
|-----------|----------------------------------------------------------|
|"AZSM2021" | Filetype in source cannot be stored in the target. |
|"AZSM2022" | Source file path has one or more characters that are not supported by the target. |
|"AZSM2023" | Source file path has one or more components that have length larger than max component length supported by target namespace. |
|"AZSM2024" | Source file path has total length larger than max path length supported by target namespace. |
|"AZSM2025" | Source file path has directory depth larger than what target namespace supports. |
|"AZSM2026" | Source file size is larger than what target supports. |

### NoCopyNecessary (status code range AZSM2041 - AZSM2060)

The sync engine concluded that the file does not need to be copied as it has not changed since last sync. File was inferred by sync engine as "unchanged since last sync hence not needing copy".

|Status code| Description                  |
|-----------|------------------------------|
|"AZSM2041" | By file time |
|"AZSM2042" | By target compare |

### Failed (status code range == AZSM2061 - AZSM2080)

The copy failed due to some transient reason, either while reading from the source or writing to the target.

|Status code| Description                  |
|-----------|------------------------------|

|"AZSM2061" | Error encountered when scanning the source. |
|"AZSM2062" | Could not read source file due to permission issues. |
|"AZSM2063" | Encountered I/O error while reading source file. |
|"AZSM2064" | Timed out while reading source file. |
|"AZSM2065" | Transport error when sending file to target. |
|"AZSM2066" | Status returned by target. |
|"AZSM2067" | Timed out while writing file to target. |
|"AZSM2068" | Error encountered when scanning the target. |
|"AZSM2069" | Could not read/write target file due to permission issues. |
|"AZSM2070" | Could not write target file because a lease is active. |

<!--
    AgentStatusMap holds a small description string corresponding to agent statuses.
    --------------------------------------------------------------------------------
	XDM_AGSTATUS_UPG_DOWNLOAD_FAILED:   "Image download failed for agent upgrade",
	XDM_AGSTATUS_UPG_PRE_CHECK_FAILED:  "Pre-upgrade checks failed for agent upgrade",
	XDM_AGSTATUS_UPG_UPGRADE_FAILED:    "Actual upgrade failed for agent upgrade",
	XDM_AGSTATUS_UPG_POST_CHECK_FAILED: "Post upgrade checks failed for agent upgrade",
	XDM_AGSTATUS_UPG_ROLLBACK_FAILED:   "Rollback failed for agent upgrade",

    JobRunLogStatusMap holds a small description string corresponding to jobrun log statuses.
    -----------------------------------------------------------------------------------------
	XDM_JLSTATUS_SRC_MNT_FAILED:             "Failed to mount source path",
	XDM_JLSTATUS_SRC_SCAN_FAILED:            "Encountered an error while scanning the source",
	XDM_JLSTATUS_SRC_PERM:                   "Failed to access source folder due to permission issues",
	XDM_JLSTATUS_SRC_INVALID_PATH:           "Source path provided is invalid",
	XDM_JLSTATUS_SRC_UNKNOWN:                "Miscellaneous error while accessing source",
	XDM_JLSTATUS_TGT_PERM:                   "Failed to access target folder due to permission issues",
	XDM_JLSTATUS_TGT_INVALID_PATH:           "Target path provided is invalid",
	XDM_JLSTATUS_TGT_LEASE_EXPIRED:          "Lease expired for this agent on the target container",
	XDM_JLSTATUS_TGT_AUTHZ:                  "Authorization failure on claiming the target container",
	XDM_JLSTATUS_TGT_AUTHN:                  "Authentication failure on claiming the target container",
	XDM_JLSTATUS_TGT_BLOBTYPE:               "Blob type in the target container not supported by the agent",
	XDM_JLSTATUS_TGT_UNKNOWN:                "Miscellaneous error while accessing target",
	XDM_JLSTATUS_OTHER_JOB_PROGRESS_FAILURE: "Failed to send job progress",
	XDM_JLSTATUS_OTHER_CREATE_JOB_FAILED:    "Failed to create job",
	XDM_JLSTATUS_OTHER_RESUME_FAILED:        "Failed to resume job",
	XDM_JLSTATUS_OTHER_FINALIZE_JOB_FAILED:  "Failed to finalize the job",
	XDM_JLSTATUS_OTHER_JOB_CANCELED:         "Job was aborted while it was still running",
	XDM_JLSTATUS_OTHER_UNKNOWN:              "Miscellaneous error during job execution",
	XDM_JLSTATUS_TGT_CONTAINER_BUSY:         "Target container is in use by some other job",

    CopyLogStatusMap holds a small description string corresponding to copylog statuses.
    ------------------------------------------------------------------------------------
	XDM_CLSTATUS_EXCLUDED:                  "File excluded by a user specified filter",
	XDM_CLSTATUS_UNSUPP_FILETYPE:           "File type not supported by target",
	XDM_CLSTATUS_UNSUPP_CHAR:               "One or more characters in source filename not supported by target",
	XDM_CLSTATUS_UNSUPP_COMPONENT_LENGTH:   "One or more source path components longer than max supported by target",
	XDM_CLSTATUS_UNSUPP_TOTAL_LENGTH:       "Source path length longer than max supported by target",
	XDM_CLSTATUS_UNSUPP_DIR_DEPTH:          "Source path has directory depth larger than max supported by target",
	XDM_CLSTATUS_UNSUPP_FILE_SIZE:          "Source file has size larger than max supported by target",
	XDM_CLSTATUS_NCN_BY_FILETIME:           "File has not changed since last sync as per filetime check",
	XDM_CLSTATUS_NCN_BY_TARGETCOMPARE:      "File has not changed since last sync as per target compare check",
	XDM_CLSTATUS_FAILED_TARGET_SCANFAILED:  "Encountered an error while scanning the target",
	XDM_CLSTATUS_FAILED_TARGET_PERM:        "Failed to read target file due to permission issues",
	XDM_CLSTATUS_FAILED_SOURCE_PERM:        "Failed to read source file due to permission issues",
	XDM_CLSTATUS_FAILED_SOURCE_IO:          "Encountered I/O error while reading source file",
	XDM_CLSTATUS_FAILED_SOURCE_TIMEDOUT:    "Timed out while reading source file",
	XDM_CLSTATUS_FAILED_SOURCE_SCANFAILED:  "Encountered an error while scanning the source",
	XDM_CLSTATUS_FAILED_TARGET_TRANSPORT:   "Transport error when sending file to target",
	XDM_CLSTATUS_FAILED_TARGET_IO:          "Target failed file copy with an error",
	XDM_CLSTATUS_FAILED_TARGET_TIMEDOUT:    "Timed out while writing file to target",
	XDM_CLSTATUS_FAILED_TARGET_PERM_LEASED: "Cannot write blob because it has an active lease",
-->
