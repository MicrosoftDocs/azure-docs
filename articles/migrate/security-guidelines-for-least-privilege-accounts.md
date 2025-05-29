---
title: Security guidelines for least privilege accounts for Azure Migrate
description: Azure Migrate appliance discovers on-premises servers, collects metadata, and supports workload analysis with secure, least-privilege access.
ms.topic: conceptual
author: habibaum
ms.author: v-uhabiba
ms.manager: molir
ms.service: azure-migrate
ms.date: 05/29/2025
ms.custom: engagement-fy24

# Security guidelines for least privilege accounts for Azure Migrate

Azure Migrate Appliance is a lightweight appliance used by Azure Migrate: Discovery and Assessment uses to discover on-premises servers and send their configuration and performance metadata to Azure. It also performs software inventory, agentless dependency analysis, and discovers workloads like web apps and SQL Server instances and databases. To use these capabilities, users add server and guest credentials in the Appliance Config Manager. For security and efficiency, we recommend following the principle of least privilege to reduce potential risks.

## Discovery of VMware estate:  

To discover basic configurations of servers running in a VMware estate, the following permissions are required.

vCenter account: To perform deep discovery of the VMware estate and to run software inventory and dependency analysis, add the following extra privileges.

- Read-only: Use the built in read-only role or create a clone of it and assign the user role to vCenter account.  
- Guest operations: Add guest operations privileges to the read-only user role. 

### Guest user accounts for Windows & Linux 

Guest user accounts allow limited access to Windows and Linux servers for discovery and assessment capablilites.

Windows: Use a Windows local guest user account  

Linux: Use a Linux guest user account

Limitations: You can add a Windows guest or a Linux non-sudo user account to collect dependency mapping data. However, with least privilege accounts, some process details, such as process name or application name, might not be collected if those processes run under higher privilege. These appear as "Unknown processes" under machine in the single server view.

### Elevated privileges for guest accounts

If you encounter the above errors, we recommend adding the following privileges:

Windows: Use a Windows administrator account.

Linux: Use a Linux sudo user account with the required permissions:

 `usr/bin/netstat, /usr/bin/ls`

If netstat isn't available,the user needs sudo permissions for the ss command.

For more details, refer to the [dependency mapping data collection]()

## Discovery of scoped VMware estate