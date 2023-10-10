---
title: How to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc
description: Learn how to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc.
ms.date: 09/14/2023
ms.topic: conceptual
---

# Troubleshoot delivery of Extended Security Updates for Windows Server 2012

This article provides information on troubleshooting and resolving issues that may occur while [enabling Extended Security Updates for Windows Server 2012 and Windows Server 2012 R2 through Arc-enabled servers](deliver-extended-security-updates.md).

## License provisioning issues

If you're unable to provision a Windows Server 2012 Extended Security Update license for Azure Arc-enabled servers, check the following:

- **Permissions:** Verify you have sufficient permissions (Contributor role or higher) within the scope of ESU provisioning and linking.  

- **Core minimums:** Verify you have specified sufficient cores for the ESU License. Physical core-based licenses require a minimum of 16 cores, and virtual core-based licenses require a minimum of 8 cores per virtual machine (VM). 

- **Conventions:** Verify you have selected an appropriate subscription and resource group and provided a unique name for the ESU license.     

## ESU enrollment issues

If you're unable to successfully link your Azure Arc-enabled server to an activated Extended Security Updates license, verify the following conditions are met:

- **Connectivity:** Azure Arc-enabled server is **Connected**. For information about viewing the status of Azure Arc-enabled machines, see [Agent status](overview.md#agent-status).

- **Agent version:** Connected Machine agent is version 1.34 or higher. If the agent version is less than 1.34, you need to update it to this version or higher.

- **Operating system:** Only Azure Arc-enabled servers running the Windows Server 2012 and 2012 R2 operating system are eligible to enroll in Extended Security Updates.

- **Environment:** The connected machine should not be running on Azure Stack HCI, Azure VMware solution, or as an Azure virtual machine. In these scenarios, WS2012 ESUs are available for free.

- **License properties:** Verify the license is activated and has been allocated sufficient physical or virtual cores to support the intended scope of servers.

## ESU patches issues

If you have issues receiving ESUs after successfully enrolling the server through Arc-enabled servers, or you need additional information related to issues affecting ESU deployment, see [Troubleshoot issues in ESU](/troubleshoot/windows-client/windows-7-eos-faq/troubleshoot-extended-security-updates-issues).

