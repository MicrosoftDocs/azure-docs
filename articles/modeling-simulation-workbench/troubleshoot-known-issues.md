---
title: Known issues for Azure Modeling and Simulation Workbench
description: "Troubleshooting guide for known issues on Azure Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: troubleshooting-known-issue
ms.date: 09/29/2024

#customer intent: As a user, I want to troubleshoot and understand known issues with Azure Modeling and Simulation Workbench.

---

# Known issues: Azure Modeling and Simulation Workbench

The Modeling and Simulation Workbench is a secure, cloud-based platform for collaborative engineering, design, and simulation workloads that require security and confidentiality. The Workbench provides isolation for separate enterprises, allowing each to bring in code, data, or applications and apply them to a shared environment without exposing confidential intellectual property.

This Known Issues guide provides troubleshooting and advisory information for resolving or acknowledging issues to be addressed. Where applicable, workaround or mitigation steps are provided.

## Cadence dependencies

When a Chamber Admin is attempting installation of some recent releases of Cadence tools, some users report missing dependencies on Modeling and Simulation Workbench. To fix this issue, install missing dependencies.

### Troubleshooting steps

During installation, the Cadence dependency checker `checkSysConf` reports that the following packages are missing from Modeling and Simulation Workbench VMs. Some of those packages are installed, but fail the dependency check due to other dependencies.

* `xterm`
* `motif`
* `libXp`
* `apr`
* `apr-util`

A Chamber Admin can install these packages with the following command in a terminal:

```bash
sudo yum install motif apr apr-util xterm
```

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

## Synopsys license files upload failures due to missing port numbers

Certain Synopsys EDA license files fail when uploaded to the Modeling and Simulation Workbench chamber license service without a port number.

### Troubleshooting steps

A Synopsys license file issued without a port number on the `VENDOR` line won't successfully upload unless edited by hand to include the port number. The port number can be found on the chamber license server overview page.

A license file issued without a port number on the `VENDOR` line is shown.

```INI
VENDOR snpslmd /path/to/snpslmd
```

Add the license server port to the end of the `VENDOR` line. You don't need to update the tool file path, indicated in the example as */path/to/snpslmd* or any other content.

```INI
VENDOR snpslmd /path/to/snpslmd 27021
```

## Users on public IP connector with IP on allowlist can't access workbench desktop or data pipeline

A chamber with a public IP connector configured to allow users who's IP is listed after the first entry of the allowlist can't be accessed either through the desktop or data pipeline using AzCopy. If the allowlist on a public IP connector contains overlapping networks, in some instances the preprocessor might fail to detect the overlapping networks before attempting to commit them to the active NSG. Failures aren't reported back to the user. Other NSG rules elsewhere - either before or after the interfering rule - might not be processed, defaulting to the "deny all" rule. Access to the connector might be blocked unexpectedly for users that previously had access and appear elsewhere in the list. Access is blocked for all connector interactions including desktop, data pipeline upload, and data pipeline download. The connector still responds to port queries, but doesn't allow interactions from an IP or IP range shown in the connector networking allowlist.

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

## Azure VMs located in the same region as a workbench can't access a public IP connector

Resources deployed outside of a workbench, in particular virtual machines (VM), can't access a chamber through a public IP connector if located in the same region. A VM deployed in the same region or even the same resource group as a workbench isn't able to connect to the chamber's connector. The VM's public facing IP address is on the allowlist. A locally installed version of AzCopy is unable to access the chamber's data pipeline. Errors include timeouts or not authorized.

### Prerequisites

* A workbench chamber is deployed using a public IP connector in one region.

* A virtual machine or other resource with a public facing IP address is deployed in the same region.

* The connector's allowlist has the public facing IP address of the VM.

### Troubleshooting steps

Azure resources in the same region don't use public IP or internet to communicate. Rather, if an Azure resource initiates communication to another Azure resource in the same region, private Azure networking is used. As a result, both the source and destination IP addresses are private network addresses, which aren't permitted on the connector's allowlist.

The VM or other directly communicating resource should be located in another region beside's the workbench's region. Networking continues to happen on Azure's backbone network and doesn't pass over the general internet, but instead uses the public IP address. The new region can be any permissible region for the resource and doesn't need to be an active region for the Modeling and Simulation Workbench.

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
