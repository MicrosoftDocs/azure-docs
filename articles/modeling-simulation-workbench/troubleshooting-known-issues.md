---
title: Known issues for Modeling and Simulation Workbench
description: "Troubleshooting guide for known issues on Azure Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: troubleshooting-known-issue
ms.date: 09/29-2024

#customer intent: As a user, I want to troubleshoot and understand known issues with Azure Modeling and Simulation Workbench.

---

# Known issues: Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench is a secure, cloud-based platform for collaborative engineering, design, and simulation workloads that require security and confidentiality. The Workbench provides isolation for separate enterprises, allowing each to bring in code, data, or applications and apply them to a shared environment without exposing confidential intellectual property.

This Known Issues guide provides troubleshooting and advisory information for resolving or acknowledging issues to be addressed. Where applicable, workaround or mitigation steps are provided.

## EDA license upload failures on server name

When uploading Electronic Design Automation (EDA) license files with server names that contain a dash ("-") symbol, the chamber license file server fails to process the file. For some license files, the `SERVER` line server name isn't being parsed correctly. The parser fails to tokenize this line in order to reformat for the chamber license server environment.

### Troubleshooting steps

If your license server has any dash ("-") characters in the name and fails when uploading a license file, this issue might be present for your release. Replace the server name with any single word placeholder using only alphanumeric characters (A-Z, a-z, 0-9) and no special characters or "-". For example if your `SERVER` line looks like this:

```INI
SERVER license-server-01 6045BDEB339C 1717
```

Replace the license server name to a name without dashes. The name is irrelevant as the license server transforms whatever is in the server position with the correctly formatted name.

```INI
SERVER serverplaceholder 6045BDEB339C 1717
```

## Users on public IP connector with IP on allowlist can't access workbench desktop or data pipeline

A chamber with a public IP connector configured to allow users who's IP is listed after the first entry of the allowlist can't access the chamber either through the desktop or data pipeline using AzCopy. If the allowlist on a public IP connector contains overlapping networks, in some instances the preprocessor might fail to detect the overlapping networks before attempting to commit them to the active NSG. Failures aren't reported back to the user. Other NSG rules elsewhere - either before or after the interfering rule - might not be processed, defaulting to the "deny all" rule. Access to the connector might be blocked unexpectedly for users that previously had access and appear elsewhere in the list. Access is blocked for all connector interactions including desktop, data pipeline upload, and data pipeline download. The connector still responds to port queries, but doesn't allow interactions from an IP or IP range shown in the connector networking allowlist.

### Prerequisites

* A chamber is configured with a public IP connector (gateway appears as "None").

* The allowlist has entries with CIDR-masked IP ranges less than a single host /32 (/31 and smaller).

* The IP ranges of two or more entries with subnet masking are overlapping. Overlapping ranges can sometimes be identified with leading octets being identical, but trailing octets marked with a "0".

### Troubleshooting steps

If a user that could previously access the workbench loses connectivity even though their IP is still on the allowlist, an overlapping but unhandled error with the allowlist might be blocking. Loss of connectivity doesn't preclude that any onsite or local firewall, VPN, or gateway might also be blocking access.

Users should identify overlapping IP ranges by checking the allowlist of masked subnets less than a single host (less than /32) and ensure that those subnets have no overlap. Those overlapping subnets should be replaced with nonoverlapping subnets. An indicator of this is that the first allowlist entry is acknowledged, but other rules aren't.

## Data pipeline upload file corruption or truncation

Uploaded files to a chamber through the data pipeline might be truncated or otherwise corrupt.

### Troubleshooting steps

While uploading files into a chamber, you might see a file that isn't the expected length, corrupt, or otherwise doesn't pass a hash check.

### Possible causes

The file isn't corrupt or truncated, but still uploading. The data pipeline isn't a single stage and files placed in the upload pipeline don't appear instantaneously in the */mount/datapipeline/datain* directory and are likely still completing. Check back later and verify the length or hash.

<!-- KEEP THIS FOR FUTURE CHANGES
## [Issue]
Required: Issue - H2

Each known issue should be in its own section. 
Provide a title for the section so that users can 
easily identify the issue that they are experiencing.

[Describe the issue.]

<!-- Required: Issue description (no heading)

Describe the issue.

### Prerequisites

<!--Optional: Prerequisites - H3

Use clear and unambiguous language, and use
an unordered list format. 

### Troubleshooting steps

<!-- Optional: Troubleshooting steps - H3

Not all known issues can be corrected, but if a solution 
is known, describe the steps to take to correct the issue.

### Possible causes

<!-- Optional: Possible causes - H3

In an H3 section, describe potential causes.

-->