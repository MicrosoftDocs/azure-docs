---
title: 'Prerequisites for Azure AD ECMA Connector Host'
description: This article describes the prerequisites and hardware requirements you need for using the Azure AD ECMA Connector Host.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/28/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Prerequisites for the Azure AD ECMA Connector Host

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability.

This article provides guidance on the prerequisites that are needed for using the Azure Active Directory (Azure AD) ECMA Connector Host.

This flow guides you through the process of installing and configuring the Azure AD ECMA Connector Host.

 ![Diagram that shows the installation flow.](./media/on-premises-ecma-prerequisites/flow-1.png)

For more installation and configuration information, see:

   - [Installation of the Azure AD ECMA Connector Host](on-premises-ecma-install.md)
   - [Configure the Azure AD ECMA Connector Host and the provisioning agent](on-premises-ecma-configure.md)
   - [Azure AD ECMA Connector Host generic SQL connector configuration](on-premises-sql-connector-configure.md)

## On-premises prerequisites

 - A target system, such as a SQL database, in which users can be created, updated, and deleted.
 - An ECMA 2.0 or later connector for that target system, which supports export, schema retrieval, and optionally full import or delta import operations. If you don't have an ECMA connector ready during configuration, you can validate the end-to-end flow if you have a SQL Server instance in your environment and use the generic SQL connector.
 - A Windows Server 2016 or later computer with an internet-accessible TCP/IP address, connectivity to the target system, and with outbound connectivity to login.microsoftonline.com. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy. The server should have at least 3 GB of RAM.
 - A computer with .NET Framework 4.7.1.

## Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
 
    [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]
 - The Hybrid Administrator role for configuring the provisioning agent and the Application Administrator or Cloud Administrator roles for configuring provisioning in the Azure portal.

## Next steps

- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL connector](on-premises-sql-connector-configure.md)
- [Tutorial - ECMA Connector Host generic SQL connector](tutorial-ecma-sql-connector.md)
