---
title: Prerequisites for deploying Microsoft Sentinel solution for SAP® applications
description: This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP® applications.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/07/2022
---
# Prerequisites for deploying Microsoft Sentinel solution for SAP® applications

This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP® applications.

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. **Deployment prerequisites (*You are here*)**

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy data connector agent](deploy-data-connector-agent-container.md)

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure data connector to use SNC](configure-snc.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Table of prerequisites

To successfully deploy the Microsoft Sentinel solution for SAP® applications, you must meet the following prerequisites:

### Azure prerequisites

| Prerequisite | Description |
| ---- | ----------- |
| **Access to Microsoft Sentinel** | Make a note of your Microsoft Sentinel *workspace ID* and *primary key*.<br>You can find these details in Microsoft Sentinel: from the navigation menu, select **Settings** > **Workspace settings** > **Agents management**. Copy the *Workspace ID* and *Primary key* and paste them aside for use during the deployment process. |
| *[Optional]* **Permissions to create Azure resources** | At a minimum, you must have the necessary permissions to deploy solutions from the Microsoft Sentinel content hub. For more information, see the [Microsoft Sentinel content hub catalog](../sentinel-solutions-catalog.md). |
| *[Optional]* **Permissions to create an Azure key vault or access an existing one** | The recommended deployment scenario is to use Azure Key Vault to store secrets required to connect to your SAP system. For more information, see the [Azure Key Vault documentation](../../key-vault/index.yml). |

### System prerequisites

| Prerequisite | Description |
| ---- | ----------- |
| **System architecture** | The data connector component of the SAP solution is deployed as a Docker container, and each SAP client requires its own container instance.<br>The container host can be either a physical machine or a virtual machine, can be located either on-premises or in any cloud. <br>The VM hosting the container ***does not*** have to be located in the same Azure subscription as your Microsoft Sentinel workspace, or even in the same Azure AD tenant. |
| **Virtual machine sizing recommendations** | **Minimum specification**, such as for a lab environment:<br>*Standard_B2s* VM, with:<br>- 2 cores<br>- 4 GB RAM<br><br>**Standard connector** (default):<br>*Standard_D2as_v5* VM or<br>*Standard_D2_v5* VM, with: <br>- 2 cores<br>- 8 GB RAM<br><br>**Multiple connectors**:<br>*Standard_D4as_v5* or<br>*Standard_D4_v5* VM, with: <br>- 4 cores<br>- 16 GB RAM |
| **Administrative privileges** | Administrative privileges (root) are required on the container host machine. |
| **Supported Linux versions** | The SAP data connector agent has been tested with the following Linux distributions:<br>- Ubuntu 18.04 or higher<br>- SLES version 15 or higher<br>- RHEL version 7.7 or higher<br><br>If you have a different operating system, you may need to [deploy and configure the container manually](deploy-data-connector-agent-container.md?tabs=deploy-manually#deploy-the-data-connector-agent-container) instead of using the kickstart script. |
| **Network connectivity** | Ensure that the container host has access to: <br>- Microsoft Sentinel <br>- Azure key vault (in deployment scenario where Azure key vault is used to store secrets<br>- SAP system via the following TCP ports: *32xx*, *5xx13*, *33xx*, *48xx* (when SNC is used), where *xx* is the SAP instance number. |
| **Software utilities** | The [SAP data connector deployment script](reference-kickstart.md) installs the following required software on the container host VM (depending on the Linux distribution used, the list may vary slightly): <br>- [Unzip](http://infozip.sourceforge.net/UnZip.html)<br>- [NetCat](https://sectools.org/tool/netcat/)<br>- [Docker](https://www.docker.com/)<br>- [jq](https://stedolan.github.io/jq/)<br>- [curl](https://curl.se/)<br><br>

### SAP prerequisites

| Prerequisite | Description |
| ---- | ----------- |
| **Supported SAP versions** | The SAP data connector agent support SAP NetWeaver systems and was tested on [SAP_BASIS versions 731](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) and above. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on the older [SAP_BASIS version 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows). |
| **Required software** | SAP NetWeaver RFC SDK 7.50 ([Download here](https://aka.ms/sentinel4sapsdk))<br>Make sure that you also have an SAP user account in order to access the SAP software download page. |
| **SAP system details** | Make a note of the following SAP system details for use in this tutorial:<br>- SAP system IP address and FQDN hostname<br>- SAP system number, such as `00`<br>- SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <br>- SAP client ID, such as `001` |
| **SAP NetWeaver instance access** | The SAP data connector agent uses one of the following mechanisms to authenticate to the SAP system: <br>- SAP ABAP user/password<br>- A user with an X.509 certificate (This option requires additional configuration steps) |

## SAP environment validation steps

> [!NOTE]
>
> Step-by-step instructions for deploying a CR and assigning the required role are available in the [**Deploying SAP CRs and configuring authorization**](preparing-sap.md) guide. Determine which CRs need to be deployed, retrieve the relevant CRs from the links in the tables below, and proceed to the step-by-step guide.

- [Create and configure a role (required)](#create-and-configure-a-role-required)
- [Retrieve additional information from SAP (optional)](#retrieve-additional-information-from-sap-optional)

### Create and configure a role (required)

To allow the SAP data connector to connect to your SAP system, you must create a role. Create the role by deploying CR **NPLK900271** or by loading the role authorizations from the [MSFTSEN_SENTINEL_CONNECTOR_ROLE_V0.0.27.SAP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Sample%20Authorizations%20Role%20File) file. 

> [!NOTE]
> Alternatively, you can create a role that has minimal permissions by deploying change request *NPLK900268*, or loading the role authorizations from the [MSFTSEN_SENTINEL_AGENT_BASIC_ROLE_V0.0.1.SAP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Sample%20Authorizations%20Role%20File) file.
> This change request or authorizations file creates the **/MSFTSEN/SENTINEL_AGENT_BASIC** role. This role has the minimal required permissions for the data connector to operate. Note that if you choose to deploy this role, you might need to update it frequently.

Experienced SAP administrators may choose to create the role manually and assign it the appropriate permissions. In such a case, it is not necessary to deploy the CR *NPLK900271*, but you must instead create a role using the recommendations outlined in [Expert: Deploy SAP CRs and deploy required ABAP authorizations](preparing-sap.md#required-abap-authorizations). 

| SAP BASIS versions | Sample CR |
| --- | --- |
| Any version  | *NPLK900271*: [K900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL), [R900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL) | 

### Retrieve additional information from SAP (optional)

You can deploy additional CRs from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR) to enable the SAP data connector to retrieve certain information from your SAP system.
- **SAP BASIS 7.5 SP12 and above**: Client IP Address information from security audit log
- **ANY SAP BASIS version**: DB Table logs, Spool Output log

| SAP BASIS versions | Recommended CR |Notes |
| --- | --- | --- |
| - 750 and later | *NPLK900202*: [K900202.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900202.NPL), [R900202.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900202.NPL) | Deploy the relevant [SAP note](#deploy-sap-note-optional). |
| - 740  | *NPLK900201*: [K900201.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900201.NPL), [R900201.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900201.NPL) | |

#### Deploy SAP note (optional)

If you choose to retrieve additional information with the [NPLK900202 optional CR](#retrieve-additional-information-from-sap-optional), ensure that the following SAP note is deployed in your SAP system, according to its version:

| SAP BASIS versions | Notes |
| --- | --- |
| - 750 SP04 to SP12<br>- 751 SP00 to SP06<br>- 752 SP00 to SP02 | [2641084 - Standardized read access to data of Security Audit Log](https://launchpad.support.sap.com/#/notes/2641084)* |

## Next steps

After verifying that all the prerequisites have been met, proceed to the next step to deploy the required CRs to your SAP system and configure authorization.

> [!div class="nextstepaction"]
> [Deploying SAP CRs and configuring authorization](preparing-sap.md)
