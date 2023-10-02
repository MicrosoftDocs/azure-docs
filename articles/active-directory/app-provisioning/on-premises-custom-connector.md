---
title: Microsoft Entra provisioning to applications using custom connectors
description: This document describes how to configure Microsoft Entra ID to provision users with external systems that offer REST and SOAP APIs.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 06/8/2023
ms.author: billmath
ms.reviewer: arvinh
---


# Provisioning with the custom connectors

Microsoft Entra ID supports preintegrated connectors for applications that support the following protocols and standards:  

> [!div class="checklist"]
> - [SCIM 2.0](on-premises-scim-provisioning.md)
> - [SQL](tutorial-ecma-sql-connector.md)
> - [LDAP](on-premises-ldap-connector-configure.md)
> - [REST](on-premises-ldap-connector-configure.md)
> - [SOAP](on-premises-ldap-connector-configure.md)

For connectivity to applications that don't support the aforementioned protocols and standards, customers and [partners](https://social.technet.microsoft.com/wiki/contents/articles/1589.fim-2010-mim-2016-management-agents-from-partners.aspx) have built custom [ECMA 2.0](/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)) connectors for Microsoft Identity Manager (MIM) 2016. You can now use those ECMA 2.0 connectors with the lightweight Microsoft Entra provisioning agent, without needing MIM sync deployed.



## Exporting and importing a MIM connector
If you have a custom ECMA 2.0 connector in MIM, you can export it by following the instructions [here](on-premises-migrate-microsoft-identity-manager.md#export-a-connector-configuration-from-mim-sync).  You need to save the XML file, the DLL, and related software for your connector.

To import your connector, you can use the instructions [here](on-premises-migrate-microsoft-identity-manager.md#import-a-connector-configuration).  You will need to copy the DLL for your connector, and any of its prerequisite DLLs, to that same ECMA subdirectory of the Service directory.  After the xml has been imported, continue through the wizard and ensure that all the required fields are populated.

## Updating a custom connector dll
When updating a connector, ensure that the dll is updated in all required locations. Use the steps below to properly update your custom connector dll:
1. Close the Microsoft ECMA2Host Configuration Wizard.
2. Stop the Microsoft ECMA2Host service.
3. Manually update the custom connector dll into the following folders.
    1. ECMA
    2. ECMA > Cache > {connector name}
    3. ECMA > Cache > {connector name} > AutosyncService
4. Start the Microsoft ECMA2Host service.
   
 > [!NOTE]
 > If multiple connectors are using the same custom dll, you will need to complete step 3.ii and 3.iii for each connector. 
 
## Requirements

Custom connectors built for MIM rely on the [ECMA framework](/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)). Please ensure that you are following best practices such as:
* Ensuring that methods in your connector are declared as public
* Excluding prefixes from method names. For example: 
  * **Correct:** public Schema GetSchema (KeyedCollection<string, ConfigParameter> configParameters)
  * **Incorrect:** Schema PrefixGetSchema.GetSchema (KeyedCollection<string, ConfigParameter> configParameters)
    
The following table includes capabilities of the ECMA framework that are either partially supported or not supported by the Microsoft Entra provisioning agent. For a list of known limitations for the Microsoft Entra provisioning service and on-premises application provisioning, see [here](known-issues.md#on-premises-application-provisioning).  


| **Capability / feature**   | **Support**   | **Comments**   | 
| --- | --- | --- | 
| Object type  | Partially supported  | Supports one object type  | 
| Partitions  | Partially supported  | Supports one partition  | 
| Hierarchies  | Not supported  |   | 
| Full export   | Not supported  |   | 
| ExportPasswordInFirstPass  | Not supported  |   | 
| Normalizations  | Not supported  |   | 
| Concurrent operations  | Ignored  |   |
| DeleteAddAsReplace  | Ignored  |   | 

## Next steps

- [App provisioning](user-provisioning.md)
- [ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
- [ECMA Connector Host LDAP connector](on-premises-ldap-connector-configure.md)
