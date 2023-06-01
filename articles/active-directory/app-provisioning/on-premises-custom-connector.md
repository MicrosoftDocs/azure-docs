---
title: Azure AD provisioning to applications using custom connectors
description: This document describes how to configure Azure AD to provision users with external systems that offer REST and SOAP APIs.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 05/19/2023
ms.author: billmath
ms.reviewer: arvinh
---


# Provisioning with the custom connectors

Azure AD supports preintegrated connectors for applications that support the following protocols and standards:  

> [!div class="checklist"]
> - [SCIM 2.0](on-premises-scim-provisioning.md)
> - [SQL](tutorial-ecma-sql-connector.md)
> - [LDAP](on-premises-ldap-connector-configure.md)
> - [REST](on-premises-ldap-connector-configure.md)
> - [SOAP](on-premises-ldap-connector-configure.md)

For connectivity to applications that don't support the aforementioned protocols and standards, customers and [partners](https://social.technet.microsoft.com/wiki/contents/articles/1589.fim-2010-mim-2016-management-agents-from-partners.aspx) have built custom [ECMA 2.0](/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)) connectors for Microsoft Identity Manager (MIM) 2016. You can now use those ECMA 2.0 connectors with the lightweight Azure AD provisioning agent, without needing MIM sync deployed.  \



## Exporting and importing a MIM connector
If you've got a customer connector in MIM, you can export it by following the instructions [here](on-premises-migrate-microsoft-identity-manager.md#export-a-connector-configuration-from-mim-sync).  You need to save the XML file, the DLL, and related software for your connector.

To import your connector, you can use the instructions [here](on-premises-migrate-microsoft-identity-manager.md#import-a-connector-configuration).  You will need to copy the DLL for your connector, and any of its prerequisite DLLs, to that same ECMA subdirectory of the Service directory.  After the xml has been imported, continue through the wizard and ensure that all the required fields are populated.

## Limitations 

Custom connectors built for MIM rely on the [ECMA framework](/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)). The following table includes capabilities of the ECMA framework that are either partially supported or not supported by the Azure AD provisioning agent. For a list of known limitations for the Azure AD provisioning service and on-premises application provisioning, see [here](known-issues.md#on-premises-application-provisioning).  


| **Capability / feature**   | **Support**   | **Comments**   | 
| --- | --- | --- | 
| Object type  | Partially supported  | Supports one object type  | 
| Partitions  | Partially supported  | Supports one partition  | 
| Hierarchies  | Not supported  |   | 
| Full export   | Not supported  |   | 
| DeleteAddAsReplace  | Not supported  |   | 
| ExportPasswordInFirstPass  | Not supported  |   | 
| Normalizations  | Not supported  |   | 
| Concurrent operations  | Not supported  |   |
 

## Next steps

- [App provisioning](user-provisioning.md)
- [ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
- [ECMA Connector Host LDAP connector](on-premises-ldap-connector-configure.md)


