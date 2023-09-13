---
title: How to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc
description: Learn how to troubleshoot delivery of Extended Security Updates for Windows Server 2012 through Azure Arc.
ms.date: 09/06/2023
ms.topic: conceptual
---

# Troubleshoot delivery of Extended Security Updates for Windows Server 2012

This article provides information on troubleshooting and resolving issues that may occur while attempting to [enable Extended Security Updates for Windows Server 2012 through Arc-enabled servers](deliver-extended-security-updates.md).

## License provisioning issues

If you're unable to provision a Windows Server 2012 Extended Security Update license for Azure Arc-enabled servers, check the following:

- **Permissions:** Validate you have sufficient permissions (Contributor role or higher) over the subscription and resource group.  

- **Core minimums:** Validate you have specified sufficient cores for the ESU License. Physical core-based licenses require a minimum of 16 cores, and virtual core-based licenses require a minimum of 8 cores per VM. 

- **Conventions:** Validate you have selected an appropriate subscription and resource group and provided a unique name for the ESU license.     

## ESU enrollment issues

If you're unable to successfully link your Azure Arc-enabled server to an activated Extended Security Updates license, assure the following conditions are met:

- **Connectivity:** Azure Arc-enabled server is **Connected**. 

- **Agent version:** Connected Machine agent is version 1.34 or higher. If the agent version is below 1.34, you must update to a higher agent version.

- **Operating system:** Only Azure Arc-enabled servers with an Operating System that is Windows Server 2012 / 2012 R2 are eligible for this Extended Security Update option.

- **Environment:** The underlying server should not be running on Azure Stack HCI, Azure VMware Solution, or as an Azure Virtual Machine. In these scenarios, WS2012 ESUs are available for free.

- **License properties:** Ensure that the license is activated and has sufficient physical or virtual cores to cover the intended scope of servers.

## ESU patches issues

If you have problems receiving ESU patches after the server has been successfully enrolled in Extended Security Updates enabled by Azure Arc, or want additional information regarding issues affecting ESU deployment, see [Troubleshoot issues in ESU](/troubleshoot/windows-client/windows-7-eos-faq/troubleshoot-extended-security-updates-issues).

