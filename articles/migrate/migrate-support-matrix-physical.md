---
title: Azure Migrate support matrix for physical server assessment and migration
description: Summarizes settings and limitations for physical server assessment and migration using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/23/2019
ms.author: raynew
---

# Support matrix for physical server assessment and migration

You can use the [Azure Migrate service](migrate-overview.md) to assess and migrate machines to the Microsoft Azure cloud. This article summarizes support settings and limitations for assessing and migrating on-premises physical servers.


## Physical server scenarios

The table summarizes supported scenarios for physical servers.

**Deployment** | **Details***
--- | ---
**Assess on-premises physical servers** | [Set up](tutorial-prepare-physical.md) your first assessment.
**Migrate physical servers to Azure** | [Try out](tutorial-migrate-physical-virtual-machines.md) migration to Azure.


## Azure Migrate projects

**Support** | **Details**
--- | ---
**Azure permissions** | You need Contributor or Owner permissions in the subscription to create an Azure Migrate project.
**Physical servers** | Assess up to 250 physical servers in a single project. You can have multiple projects in an Azure subscription. A project can include physical servers, VMware VMs and Hyper-V VMs, up to the assessment limits.
**Geography** | You can create Azure Migrate projects in a number of geographies. Although you can create projects in specific geographies, you can assess or migrate machines for other target locations. The project geography is only used to store the discovered metadata.

  **Geography** | **Metadata storage location**
  --- | ---
  Azure Government | US Gov Virginia
  Asia Pacific | East Asia or Southeast Asia
  Australia | Australia East or Australia Southeast
  Brazil | Brazil South
  Canada | Canada Central or Canada East
  Europe | North Europe or West Europe
  France | France Central
  India | Central India or South India
  Japan |  Japan East or Japan West
  Korea | Korea Central or Korea South
  United Kingdom | UK South or UK West
  United States | Central US or West US 2


 > [!NOTE]
 > Support for Azure Government is currently only available for the [older version](https://docs.microsoft.com/azure/migrate/migrate-services-overview#azure-migrate-versions) of Azure Migrate.


## Assessment-physical server requirements

| **Support**                | **Details**               
| :-------------------       | :------------------- |
| **Physical server deployment**       | The physical server can be standalone or deployed in a cluster. |
| **Permissions**           | **Windows:** Set up a local user account on all the Windows servers that you want to include in the discovery.The user account needs to be added to these groups-Remote Desktop Users, Performance Monitor Users and Performance Log users. <br/> **Linux:** You need a root account on the Linux servers that you want to discover. |
| **Operating system** | All [Windows](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) and [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) operating systems that are supported by Azure. |


## Assessment-appliance requirements

For assessment, Azure Migrate runs a lightweight appliance to discover physical servers, and send server metadata and performance data to Azure Migrate. The appliance can run either on a physical server or a VM, and you set it up using a PowerShell script that you download from the Azure portal. The following table summarizes the appliance requirements.

| **Support**                | **Details**               
| :-------------------       | :------------------- |
| **Appliance deployment**   |  You deploy the appliance either on a physical server or VM.<br/>  The host machine must be running Windows Server 2012 R2 or later.<br/> The host needs sufficient space to allocate 16 GB RAM, 8 vCPUs, around 80 GB of storage space, and an external switch for the appliance VM.<br/> The appliance needs a static or dynamic IP address, and internet access.
| **Azure Migrate project**  |  An appliance can be associated with a single project.<br/> Any number of appliances can be associated with a single project.<br/> You can assess up to 35,000 machines in a project.
| **Discovery**              | A single appliance can discover up to 200 servers.
| **Assessment group**       | You can add up to 35,000 machines in a single group.
| **Assessment**             | You can assess up to 35,000 machines in a single assessment.


## Assessment-appliance URL access

To assess VMs, the Azure Migrate appliance needs internet connectivity.

- When you deploy the appliance, Azure Migrate does a connectivity check to the URLs summarized in the table below.
- If you're using a URL-based proxy, allow access to the URLs in the table, making sure that the proxy resolves any CNAME records received while looking up the URLs.
- If you have an intercepting proxy, you might need to import the server certificate from the proxy server to the appliance.


**URL** | **Details**  
--- | ---
*.portal.azure.com | Navigation to the Azure portal
*.windows.net <br/> *.msftauth.net <br/> *.msauth.net <br/> *.microsoft.com <br/> *.live.com  | Sign in to your Azure subscription
*.microsoftonline.com <br/> *.microsoftonline-p.com | Creation of Azure Active Directory applications for appliance to service communications.
management.azure.com | Creation of Azure Active Directory applications for appliance to service communications.
dc.services.visualstudio.com | Logging and monitoring
*.vault.azure.net | Manage secrets in Azure Key Vault when communicating between the appliance and service.
aka.ms/* | Allow access to aka links.
https://download.microsoft.com/download/* | Allows downloads from the Microsoft Download site.



## Assessment-port requirements

The following table summarizes port requirements for assessment.

**Device** | **Connection**
--- | ---
**Appliance** | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/> Inbound connections on port 44368 to remotely access the appliance management app using the URL: ``` https://<appliance-ip-or-name>:44368 ```<br/> Outbound connections on ports 443, 5671 and 5672 to send discovery and performance metadata to Azure Migrate.
**Physical servers** | **Windows:** Inbound connections on ports 443, 5989 to pull configuration and performance metadata from Windows servers. <br/> **Linux:**  Inbound connections on port 22 (UDP) to pull configuration and performance metadata from Linux servers. |


## Next steps

[Prepare for physical server assessment](tutorial-prepare-physical.md) for physical server assessment and migration.
