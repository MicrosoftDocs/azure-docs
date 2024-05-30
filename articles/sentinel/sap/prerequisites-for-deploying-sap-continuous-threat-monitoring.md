---
title: Prerequisites for deploying Microsoft Sentinel solution for SAP® applications
description: This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP® applications.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 03/21/2024

---

# Prerequisites for deploying Microsoft Sentinel solution for SAP® applications

This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP® applications.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:

1. [Deployment overview](deployment-overview.md)

1. **Deployment prerequisites (*You are here*)**

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Configure auditing](configure-audit.md)

1. [Deploy the solution content from the content hub](deploy-sap-security-content.md)

1. [Deploy the data connector agent](deploy-data-connector-agent-container.md)

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure data connector to use Secure Network Communication (SNC)](configure-snc.md)
   - [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
   - [Configure audit log monitoring rules](configure-audit-log-rules.md)
   - [Deploy SAP connector manually](sap-solution-deploy-alternate.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Table of prerequisites

To successfully deploy the Microsoft Sentinel solution for SAP® applications, you must meet the following prerequisites:

### Azure prerequisites

| Prerequisite | Description |Required/optional |
| ---- | ----------- |----------- |
| **Access to Microsoft Sentinel** | Make a note of your Microsoft Sentinel *workspace ID* and *primary key*.<br>You can find these details in Microsoft Sentinel: from the navigation menu, select **Settings** > **Workspace settings** > **Agents management**. Copy the *Workspace ID* and *Primary key* and paste them aside for use during the deployment process. |Required |
| **Permissions to create Azure resources** | At a minimum, you must have the necessary permissions to deploy solutions from the Microsoft Sentinel content hub. For more information, see the [Microsoft Sentinel content hub catalog](../sentinel-solutions-catalog.md). |Required |
| **Permissions to create an Azure key vault or access an existing one** | Use Azure Key Vault to store secrets required to connect to your SAP system (recommended when this is a required prerequisite). For more information, see [Assign key vault access permissions](deploy-data-connector-agent-container.md#assign-key-vault-access-permissions). |Required if you plan to store the SAP system credentials in Azure Key Vault. <br><br>Optional if you plan to store them in a configuration file. For more information, see [Create a virtual machine and configure access to your credentials](deploy-data-connector-agent-container.md#create-a-virtual-machine-and-configure-access-to-your-credentials).|
| **Permissions to assign a privileged role to the SAP data connector agent** | Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** role. To grant this role, you need **Owner** permissions on the resource group where your Microsoft Sentinel workspace resides. <br><br>For more information, see [Deploy the data connector agent](deploy-data-connector-agent-container.md#deploy-the-data-connector-agent). | Required. <br> If you don't have **Owner** permissions on the resource group, the relevant step can also be performed by another user who does have the relevant permissions, separately after the agent is fully deployed.|

### System prerequisites

| Prerequisite | Description |
| ---- | ----------- |
| **System architecture** | The data connector component of the SAP solution is deployed as a Docker container, and each SAP client requires its own container instance.<br>The container host can be either a physical machine or a virtual machine, can be located either on-premises or in any cloud. <br>The VM hosting the container ***does not*** have to be located in the same Azure subscription as your Microsoft Sentinel workspace, or even in the same Microsoft Entra tenant. |
| **Virtual machine sizing recommendations** | **Minimum specification**, such as for a lab environment:<br>*Standard_B2s* VM, with:<br>- Two cores<br>- 4-GB RAM<br><br>**Standard connector** (default):<br>*Standard_D2as_v5* VM or<br>*Standard_D2_v5* VM, with: <br>- Two cores<br>- 8-GB RAM<br><br>**Multiple connectors**:<br>*Standard_D4as_v5* or<br>*Standard_D4_v5* VM, with: <br>- Four cores<br>- 16-GB RAM |
| **Administrative privileges** | Administrative privileges (root) are required on the container host machine. |
| **Supported Linux versions** | The SAP data connector agent is tested with the following Linux distributions:<br>- Ubuntu 18.04 or higher<br>- SLES version 15 or higher<br>- RHEL version 7.7 or higher<br><br>If you have a different operating system, you might need to deploy and configure the container manually. For more information, open a support ticket. |
| **Network connectivity** | Ensure that the container host has access to: <br>- Microsoft Sentinel <br>- Azure key vault (in deployment scenario where Azure key vault is used to store secrets<br>- SAP system via the following TCP ports: *32xx*, *5xx13*, *33xx*, *48xx* (when SNC is used), where *xx* is the SAP instance number. |
| **Software utilities** | The [SAP data connector deployment script](reference-kickstart.md) installs the following required software on the container host VM (depending on the Linux distribution used, the list might vary slightly): <br>- [Unzip](http://infozip.sourceforge.net/UnZip.html)<br>- [NetCat](https://sectools.org/tool/netcat/)<br>- [Docker](https://www.docker.com/)<br>- [jq](https://stedolan.github.io/jq/)<br>- [curl](https://curl.se/) |
| **Managed identity or service principal** | The latest version of the SAP data connector agent requires a managed identity or service principal to authenticate to Microsoft Sentinel. <br><br>Legacy agents are supported for updates to the latest version, and then must use a managed identity or service principal to continue updating to subsequent versions. |


### SAP prerequisites

| Prerequisite | Description |
| ---- | ----------- |
| **Supported SAP versions** | The SAP data connector agent support SAP NetWeaver systems and was tested on [SAP_BASIS versions 731](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) and above. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on the older [SAP_BASIS version 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows). |
| **Required software** | SAP NetWeaver RFC SDK 7.50 ([Download here](https://aka.ms/sentinel4sapsdk))<br>Make sure that you also have an SAP user account in order to access the SAP software download page. |
| **SAP system details** | Make a note of the following SAP system details for use in this tutorial:<br>- SAP system IP address and FQDN hostname<br>- SAP system number, such as `00`<br>- SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <br>- SAP client ID, such as `001` |
| **SAP NetWeaver instance access** | The SAP data connector agent uses one of the following mechanisms to authenticate to the SAP system: <br>- SAP ABAP user/password<br>- A user with an X.509 certificate (This option requires extra configuration steps) |

## SAP environment validation steps

> [!NOTE]
>
> Step-by-step instructions for deploying a CR and assigning the required role are available in the [**Deploying SAP CRs and configuring authorization**](preparing-sap.md) guide. Determine which CRs need to be deployed, retrieve the relevant CRs from the links in the tables below, and proceed to the step-by-step guide.

- [Create and configure a role (required)](#create-and-configure-a-role-required)
- [Retrieve additional information from SAP (optional)](#retrieve-additional-information-from-sap-optional)

### Create and configure a role (required)

To allow the SAP data connector to connect to your SAP system, you must create a role. Create the role by loading the role authorizations from the [**/MSFTSEN/SENTINEL_RESPONDER**](https://aka.ms/SAP_Sentinel_Responder_Role) file.

The **/MSFTSEN/SENTINEL_RESPONDER** role includes both log retrieval and [attack disruption response actions](https://aka.ms/attack-disrupt-defender). To enable only log retrieval, without attack disruption response actions, either deploy the SAP *NPLK900271* CR on the SAP system, or load the role authorizations from the [**MSFTSEN_SENTINEL_CONNECTOR**](https://aka.ms/SAP_Sentinel_Connector_Role) file. The **/MSFTSEN/SENTINEL_CONNECTOR** role that has all the basic permissions for the data connector to operate.

| SAP BASIS versions | Sample CR |
| --- | --- |
| Any version  | *NPLK900271*: [K900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900271.NPL), [R900271.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900271.NPL) | 

Experienced SAP administrators might choose to create the role manually and assign it the appropriate permissions. In such cases, make sure to follow the recommended authorizations for each log. For more information, see [Required ABAP authorizations](preparing-sap.md#required-abap-authorizations).

### Retrieve additional information from SAP (optional)

You can deploy extra CRs from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR) to enable the SAP data connector to retrieve certain information from your SAP system.
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

After verifying that all the prerequisites are met, proceed to the next step to deploy the required CRs to your SAP system and configure authorization.

> [!div class="nextstepaction"]
> [Deploying SAP CRs and configuring authorization](preparing-sap.md)
