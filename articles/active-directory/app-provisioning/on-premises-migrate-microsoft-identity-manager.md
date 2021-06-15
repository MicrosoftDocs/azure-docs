---
title: 'Export a Microsoft Identity Manager connector for use with Azure AD ECMA Connector Host'
description: Describes how to create and export a connector from MIM Sync to be used with Azure AD ECMA Connector Host.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/01/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Export a Microsoft Identity Manager connector for use with Azure AD ECMA Connector Host

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.

You can import into Azure AD ECMA Connector Host a configuration for a specific connector from a FIM Sync or MIM Sync installation.  Note that the MIM Sync installation is only used for configuration, not for the ongoing synchronization from Azure AD.

>[!IMPORTANT]
>Currently, only the Generic SQL (GSQL) connector is support for use with the Azure AD ECMA Connector Host.


## Creating and exporting a connector configuration in MIM Sync
If you already have MIM Sync with your ECMA connector already configured, then skip to step 10.

 1. Prepare a Windows Server 2016 server, which is distinct from the server that will be used for running the Azure AD ECMA Connector Host.  This host server should either have a SQL Server 2016 database co-located, or have network connectivity to a SQL Server 2016 database.  One way to set up this server is by deploying an Azure Virtual Machine with the image **SQL Server 2016 SP1 Standard on Windows Server 2016**.  Note that this server does not need Internet connectivity, other than remote desktop access for setup purposes.
 2. Create an account for use during the MIM Sync installation.  This can be a local account on that Windows Server.  To create a local account, launch control panel, open user accounts, and add a user account **mimsync**.
 3. Add the account created in the previous step to the local Administrators group.
 4. Give the account created earlier the ability to run a service.  Launch Local Security Policy, click on Local Policies, User Rights Assignment, and **Log on as a service**.  Add the account mentioned earlier.
 5. Install MIM Sync on this host. If you do not have MIM Sync binaries, then you can install an evaluation by downloading the ZIP file from [https://www.microsoft.com/en-us/download/details.aspx?id=48244](https://www.microsoft.com/en-us/download/details.aspx?id=48244), mounting the ISO image, and copying the folder **Synchronization Service** to the Windows Server host.  Then run the setup program contained in that folder.   Note that evaluation software is time-limited and will expire, and is not intended for production use.
 6. Once the installation of MIM Sync is complete, log out and log back in.
 7. Install your connector on that same server as MIM Sync.  (For illustration purposes, this test lab guide will illustrate using one of the Microsoft-supplied connectors for download from [https://www.microsoft.com/en-us/download/details.aspx?id=51495](https://www.microsoft.com/en-us/download/details.aspx?id=51495) ).
 8. Launch the Synchronization Service UI.  Click on **Management Agents**.  Click **Create**, and specify the connector management agent.  Be sure to select a connector management agent that is ECMA-based.
 9. Give the connector a name, and configure the parameters needed to import and export data to the connector.  Be sure to configure that the connector can import and export single-valued string attributes of a user or person object type.
 10. On the MIM Sync server computer, launch the Synchronization Service UI, if not already running.  Click on **Management Agents**.
 11. Select the connector, and click **Export Management Agent**.  Save the XML file, as well as the DLL and related software for your connector, to the Windows Server which will be holding the ECMA Connector host.

At this point, the MIM Sync server is no longer needed.

 1. Sign into the Windows Server as the account which the Azure AD ECMA Connector Host will run as.
 2. Change to the directory c:\program files\Microsoft ECMA2host\Service\ECMA and ensure there are one or more DLLs already present in that directory.  (Those DLLs correspond to Microsoft-delivered connectors).
 3. Copy the MA DLL for your connector, and any of its prerequisite DLLs, to that same ECMA subdirectory of the Service directory.
 4. Change to the directory C:\program files\Microsoft ECMA2Host\Wizard and run the program Microsoft.ECMA2Host.ConfigWizard.exe to set up the ECMA Connector Host configuration.
 5. A new window will appear with a list of connectors. By default, no connectors will be present.  Click **;New connector**.
 6. Specify the management agent xml file that was exported from MIM earlier.  Continue with the configuration and schema mapping instructions from the section Configuring a connector above.



## Next Steps


- [App provisioning](user-provisioning.md)
- [Azure AD ECMA Connector Host prerequisites](on-premises-ecma-prerequisites.md)
- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL Connector](on-premises-sql-connector-configure.md)