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

For connectivity to applications that don't support the aforementioned protocols and standards, customers and [partners](https://social.technet.microsoft.com/wiki/contents/articles/1589.fim-2010-mim-2016-management-agents-from-partners.aspx) have built custom [ECMA 2.0](https://learn.microsoft.com/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)) connectors for Microsoft Identity Manager (MIM) 2016. You can now use those ECMA 2.0 connectors with the lightweight Azure AD provisioning agent, without needing MIM sync deployed.  

## Limitations 

Custom connectors built for MIM rely on the [ECMA framework](https://learn.microsoft.com/previous-versions/windows/desktop/forefront-2010/hh859557(v=vs.100)). The following table includes capabilities of the ECMA framework that are either partially supported or not supported by the Azure AD provisioning agent. For a list of known limitations for the Azure AD provisioning service and on-premises application provisioning, see [here](https://learn.microsoft.com/azure/active-directory/app-provisioning/known-issues?pivots=app-provisioning#on-premises-application-provisioning).  


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


