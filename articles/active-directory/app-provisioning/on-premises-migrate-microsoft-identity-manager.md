---
title: 'Export a Microsoft Identity Manager connector for use with the Microsoft Entra ECMA Connector Host'
description: Describes how to create and export a connector from MIM Sync to be used with the Microsoft Entra ECMA Connector Host.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 09/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Export a Microsoft Identity Manager connector for use with the Microsoft Entra ECMA Connector Host

You can import into the Microsoft Entra ECMA Connector Host a configuration for a specific connector from a Forefront Identity Manager Synchronization Service or Microsoft Identity Manager Synchronization Service (MIM Sync) installation. The MIM Sync installation is only used for configuration, not for the ongoing synchronization from Microsoft Entra ID.


## Create a connector configuration in MIM Sync
This section is included for illustrative purposes, if you wish to set up MIM Sync with a connector. If you already have MIM Sync with your ECMA connector configured, skip to the next section.

 1. Prepare a Windows Server 2016 server, which is distinct from the server that will be used for running the Microsoft Entra ECMA Connector Host. This host server should either have a SQL Server 2016 database colocated or have network connectivity to a SQL Server 2016 database. One way to set up this server is by deploying an Azure virtual machine with the image **SQL Server 2016 SP1 Standard on Windows Server 2016**. This server doesn't need internet connectivity other than remote desktop access for setup purposes.
 1. Create an account for use during the MIM Sync installation. It can be a local account on that Windows Server instance. To create a local account, open **Control Panel** > **User Accounts**, and add the user account **mimsync**.
 1. Add the account created in the previous step to the local Administrators group.
 1. Give the account created earlier the ability to run a service. Start **Local Security Policy** and select **Local Policies** > **User Rights Assignment** > **Log on as a service**. Add the account mentioned earlier.
 1. Install MIM Sync on this host.
 1. After the installation of MIM Sync is complete, sign out and sign back in.
 1. Install your connector on the same server as MIM Sync. For illustration purposes, use either of the Microsoft-supplied SQL or LDAP connectors for download from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=51495).
 1. Start the Synchronization Service UI. Select **Management Agents**. Select **Create**, and specify the connector management agent. Be sure to select a connector management agent that's ECMA based.
 1. Give the connector a name, and configure the parameters needed to import and export data to the connector. Be sure to configure that the connector can import and export single-valued string attributes of a user or person object type.

## Export a connector configuration from MIM Sync

 1. On the MIM Sync server computer, start the Synchronization Service UI, if it isn't already running. Select **Management Agents**.
 1. Select the connector, and select **Export Management Agent**. Save the XML file, and the DLL and related software for your connector, to the Windows server that will be holding the ECMA Connector Host.

At this point, the MIM Sync server is no longer needed.

## Import a connector configuration

 1. Install the ECMA Connector host and provisioning agent on a Windows Server, using the [provisioning users into SQL based applications](on-premises-sql-connector-configure.md#3-install-and-configure-the-azure-ad-connect-provisioning-agent) or [provisioning users into LDAP directories](on-premises-ldap-connector-configure.md#install-and-configure-the-azure-ad-connect-provisioning-agent) articles.
 1. Sign in to the Windows server as the account that the Microsoft Entra ECMA Connector Host runs as.
 1. Change to the directory C:\Program Files\Microsoft ECMA2host\Service\ECMA. Ensure there are one or more DLLs already present in that directory. Those DLLs correspond to Microsoft-delivered connectors.
 1. Copy the MA DLL for your connector, and any of its prerequisite DLLs, to that same ECMA subdirectory of the Service directory.
 1. Change to the directory C:\Program Files\Microsoft ECMA2Host\Wizard. Run the program Microsoft.ECMA2Host.ConfigWizard.exe to set up the ECMA Connector Host configuration.
 1. A new window appears with a list of connectors. By default, no connectors will be present. Select **New connector**.
 1. Specify the management agent XML file that was exported from MIM Sync earlier. Continue with the configuration and schema-mapping instructions from the section "Create a connector" in either the [provisioning users into SQL based applications](on-premises-sql-connector-configure.md#6-create-a-generic-sql-connector) or [provisioning users into LDAP directories](on-premises-ldap-connector-configure.md#configure-a-generic-ldap-connector) articles.

## Next steps

- Learn more about [App provisioning](user-provisioning.md)
- [Configuring Microsoft Entra ID to provision users into SQL based applications](on-premises-sql-connector-configure.md) with the Generic SQL connector
- [Configuring Microsoft Entra ID to provision users into LDAP directories](on-premises-ldap-connector-configure.md) with the Generic LDAP connector
