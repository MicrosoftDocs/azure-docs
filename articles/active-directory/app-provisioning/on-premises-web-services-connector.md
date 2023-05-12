---
title: Azure AD Provisioning to applications via Web services
web services based APIs.
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
The following documentation provides information about the generic web services connector. The ECMA Connector Host can be used to integrate Azure AD with external systems that offer web services based APIs.

The web services connector implements the following functionalities:

- SOAP Discovery: Allows the administrator to enter WSDL path exposed by the target web service. Discovery will produce a tree structure of its hosted web services with their inner  endpoint(s)/operations along with the operation’s Meta data description. There is no limit to the number of discovery operations that can be done (step by step). The discovered operations  are used later to configure the flow of operations that implement the connector’s operations against the data-source (as Import/Export/Password).

- REST Discovery: Allows the administrator to enter Restful service details i.e. Service Endpoint, Resource Path, Method and Parameter details. A user can add unlimited number of Restful services. The rest services information will be stored in ```discovery.xml``` file of ```wsconfig``` project. They will be used later by the user to configure the Rest Web Service activity in the workflow.

- Connector Space Schema configuration: Allows the administrator to configure the connector space schema. The schema configuration will include a listing of Object Types and attributes for a specific implementation. The administrator can specify the object types that will be supported by the Web Service MA. The administrator may also choose here the attributes that will be part of the Connector space Schema.

- Operation Flow configuration: Workflow designer UI for configuring the implementation of FIM operations (Import/Export/Password) per object type through exposed web service operations functions such as:

    - Assignment of parameters from connector space to web service functions.
    - Assignment of parameters from web service functions to the connector space.


##  Download the project files and additional documentation
The connector requires a Web Service Project file to connect with the correct data source. This project can be downloaded from [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=51495) along with additional [documentation](https://www.microsoft.com/download/details.aspx?id=29943) for using the connector with Oracle eBusiness, Oracle PeopleSoft and SAP. You can also create one.

When the ECMA Connector Host invokes the Web Service connector, it loads its configured project file (WsConfig file). This file helps it recognize the data source’s Endpoint that should be used to establish a connection. The file also tells it the workflow to execute in order to implement an operation. To execute the configured workflows, the web service connector leverages the .NET 4 Workflow Foundation run time engine.


## Additional configuration information

For additional information see [the Overview of the generic Web Service connector](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-ma-ws) in the MIM documentation library.

## Next steps

- [App provisioning](user-provisioning.md)
- [ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
- [ECMA Connector Host LDAP connector](on-premises-ldap-connector-configure.md)