---
title: Azure AD provisioning to applications via web services connector
description: This document describes how to configure Azure AD to provision users with external systems that offer web services based APIs.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 05/11/2023
ms.author: billmath
ms.reviewer: arvinh
---


# Provisioning with the web services connector
The following documentation provides information about the generic web services connector. Microsoft Entra Identity Governance supports provisioning accounts into various applications such as SAP ECC, Oracle eBusiness Suite, and line of business applications that expose REST or SOAP APIs. Customers that have previously deployed MIM to connect to these applications can easily switch to using the lightweight Azure AD provisioning agent, while reusing the same web services connector built for MIM.  

## Capabilities supported

> [!div class="checklist"]
> - Create users in your application.
> - Remove users in your application when they don't need access anymore.
> - Keep user attributes synchronized between Azure AD and your application.
> - Discover the schema for your application.

The web services connector implements the following functionalities:

- SOAP Discovery: Allows the administrator to enter the WSDL path exposed by the target web service. Discovery will produce a tree structure of its hosted web services with their inner  endpoint(s)/operations along with the operation’s Meta data description. There's no limit to the number of discovery operations that can be done (step by step). The discovered operations  are used later to configure the flow of operations that implement the connector’s operations against the data-source (as Import/Export).

- REST Discovery: Allows the administrator to enter Restful service details i.e. Service Endpoint, Resource Path, Method and Parameter details. A user can add an unlimited number of Restful services. The rest services information will be stored in the ```discovery.xml``` file of the ```wsconfig``` project. They'll be used later by the user to configure the Rest Web Service activity in the workflow.

- Connector Space Schema configuration: Allows the administrator to configure the connector space schema. The schema configuration will include a listing of Object Types and attributes for a specific implementation. The administrator can specify the object types that will be supported by the Web Service MA. The administrator may also choose here the attributes that will be part of the Connector space Schema.

- Operation Flow configuration: Workflow designer UI for configuring the implementation of FIM operations (Import/Export) per object type through exposed web service operations functions such as:

    - Assignment of parameters from connector space to web service functions.
    - Assignment of parameters from web service functions to the connector space.


##  Documentation for popular applications
Integrations with popular applications such as [SAP ECC 7.0](on-premises-sap-connector-configure.md) and Oracle eBusiness Suite can be found [here](https://www.microsoft.com/download/details.aspx?id=51495). You can also configure a template to connect to your own [rest or SOAP API](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-ma-ws).


For more information, see [the Overview of the generic Web Service connector](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-ma-ws) in the MIM documentation library.

## Next steps

- [App provisioning](user-provisioning.md)
- [ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
- [ECMA Connector Host LDAP connector](on-premises-ldap-connector-configure.md)
