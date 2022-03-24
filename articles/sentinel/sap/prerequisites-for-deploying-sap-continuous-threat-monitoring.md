---
title: Prerequisites for deploying SAP continuous threat monitoring | Microsoft Docs
description: Prerequisites for deploying SAP continuous threat monitoring.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 2/01/2022
---
# Prerequisites for deploying SAP continuous threat monitoring

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article lists the prerequisites required for deployment of the Microsoft Sentinel Continuous Threat Monitoring solution for SAP.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Deployment milestones

Track your SAP solution deployment journey through this series of articles:


1. [Deployment overview](deployment-overview.md)

1. **Prerequisites (*You are here*)**

1. [Prepare SAP environment by deploying SAP CRs, configure Authorization and create user](preparing_sap.md)

1. [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md)

1. [Deploy SAP security content](deploy_sap_security_content.md)

1. Optional deployment steps
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)

## Table of prerequisites

To successfully deploy the SAP Continuous Threat Monitoring solution, the following prerequisites must be met.

| Area | Description |
| ---- | ----------- |
| **Azure prerequisites** | **Access to Microsoft Sentinel**: Make a note of the Microsoft Sentinel *workspace ID* and *primary key*.<br>You can find these details in Microsoft Sentinel: from the navigation menu, select **Settings** > **Workspace settings** > **Agents management**. Copy the *Workspace ID* and *Primary key* and paste them aside for use during the deployment process.<br><br>*[Optional]* **Permissions to create Azure resources**: At a minimum, you must have the necessary permissions to deploy solutions from the Microsoft Sentinel content hub. For more information, see the [Microsoft Sentinel content hub catalog](../sentinel-solutions-catalog.md). <br><br>*[Optional]* **Permissions to create an Azure key vault or access an existing one**: The recommended deployment scenario is to use Azure Key Vault to store secrets required to connect to your SAP system. For more information, see the [Azure Key Vault documentation](../../key-vault/index.yml). |
| **System prerequisites** | **System architecture**: The data connector component of the SAP solution is deployed as a Docker container, and each SAP client requires its own container instance.<br>Container host can be either a physical machine or a virtual machine, can be located either on-premises or in any cloud. <br>The VM hosting the container ***does not*** have to be located in the same Azure subscription as your Microsoft Sentinel workspace, or even in the same Azure AD tenant.<br><br>**Administrative privileges**: Administrative privileges (root) are required on the container host machine.<br><br>**Supported Linux versions**: Your Docker container host machine must run one of the following Linux distributions:<ul><li>Ubuntu 18.04 or higher<li>SLES version 15 or higher<li>RHEL version 7.7 or higher</ul><br> **Network connectivity**: Ensure that the container host has access to: <ul><li>Microsoft Sentinel <li>Azure key vault (in deployment scenario where Azure key vault is used to store secrets<li>SAP system via the following TCP ports: <br>- *32xx*<br>- *5xx13*<br>- *33xx*<br>- *48xx* (in case SNC is used)<br>where *xx* is the SAP instance number. </ul><br>**Software**: The SAP data connector deployment script automatically installs software prerequisites. For more information, see [Automatically installed software](#automatically-installed-software). Make sure that you also have an SAP user account in order to access the SAP software download page. |
| **Software prerequisites** | **Required software**: SAP NetWeaver RFC SDK 7.50 ([Download here](https://aka.ms/sap-sdk-download))<!-- old link: https://launchpad.support.sap.com/#/softwarecenter/template/products/%20_APP=00200682500000001943&_EVENT=DISPHIER&HEADER=Y&FUNCTIONBAR=N&EVENT=TREE&NE=NAVIGATE&ENR=01200314690100002214&V=MAINT&TA=ACTUAL&PAGE=SEARCH/SAP%20NW%20RFC%20SDK -->.<br>At the link, select **SAP NW RFC SDK 7.50** -> **Linux on X86_64 64BIT** -> **Download the latest version**. |
| **SAP prerequisites** | **Supported SAP versions**: We recommend using [SAP_BASIS versions 750 SP13](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) or later. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on the older [SAP_BASIS version 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows).<br><br>**SAP system details**: Make a note of the following SAP system details for use in this tutorial:<li>SAP system IP address and FQDN hostname<li>SAP system number, such as `00`<li>SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <li>SAP client ID, such as `001`<br><br>**SAP NetWeaver instance access**: The SAP data connector agent uses one of the following mechanisms to authenticate to the SAP system: <li>SAP ABAP user/password<li>A user with an X.509 certificate (This option requires additional configuration steps) |
| **Administrative workstation prerequisites** | **Required software**: Azure Command-Line Interface (CLI).<br>[See installation instructions](https://aka.ms/azcli). |

### Automatically installed software

The [SAP data connector deployment script](reference_kickstart.md) installs the following software on the container host VM (depending on the Linux distribution used, the list may vary slightly):

- [Unzip](http://infozip.sourceforge.net/UnZip.html)
- [NetCat](https://sectools.org/tool/netcat/)
- [Docker](https://www.docker.com/)
- [jq](https://stedolan.github.io/jq/)
- [curl](https://curl.se/)

## SAP change request (CR) deployment

Besides all the prerequisites listed above, a successful deployment of the SAP data connector depends on your SAP environment being properly configured and updated. This includes ensuring that the relevant SAP change requests (CRs), as well as a Microsoft-provided CR, are deployed on the SAP system and that a role is created in SAP to enable access for the SAP data connector.

> [!NOTE]
>  Step-by-step instructions for deploying a CR and assigning the required role are available in the [Deploying SAP CRs and configuring authorization](preparing_sap.md) guide. Retrieve the required CRs from the links in the tables below and proceed to the step-by-step guide.
>
> Experienced SAP administrators may choose to create the role manually and assign it the appropriate permissions. In such a case, it is **not** necessary to deploy the CR *NPLK900163*, but you must instead create a role using the recommendations outlined in [Expert: Deploy SAP CRs and deploy required ABAP authorizations](preparing_sap.md#required-abap-authorizations). In any case, you must still deploy CR *NPLK900180* to enable the SAP data connector agent to collect data from your SAP system successfully.


### SAP environment validation steps 

1. Ensure the following SAP notes are deployed in your SAP system, according to its version:

| SAP BASIS versions | Required note |
| --- | --- |
| - 750 SP01 to SP12<br>- 751 SP01 to SP06<br>- 752 SP01 to SP03 | [2641084 - Standardized read access to data of Security Audit Log](https://launchpad.support.sap.com/#/notes/2641084)* |
| - 700 to 702<br>- 710 to 711<br>- 730<br>- 731<br>- 740<br>- 750 | [2173545: CD: CHANGEDOCUMENT_READ_ALL](https://launchpad.support.sap.com/#/notes/2173545)* |
| - 700 to 702<br>- 710 to 711<br>- 730<br>- 731<br>- 740<br>- 750 to 752 | [2502336 - CD: RSSCD100 - read only from archive, not from database](https://launchpad.support.sap.com/#/notes/2502336)* |
| | * A SAP account is required to access SAP notes |

2. Download and install one of the following SAP change requests from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR), according to the SAP version in use:

| SAP BASIS versions | Required CR |
| --- | --- |
| - 750 and later | *NPLK900180*: [K900180.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900180.NPL), [R900180.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900180.NPL) |
| - 740  | *NPLK900179*: [K900179.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900179.NPL), [R900179.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900179.NPL) |
| | |

3. (Optional) Download and install the following SAP change request from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR) to create a role required for the SAP data connector agent to connect to your SAP system:

| SAP BASIS versions | Required CR |
| --- | --- |
| Any version  | *NPLK900163** [K900163.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900163.NPL), [R900163.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900163.NPL)|
| | |

> [!NOTE]
> \* The optional NPLK900163 change request deploys a sample role 


## Next steps

After verifying that all the prerequisites have been met, proceed to the next step to deploy the required CRs to your SAP system and configure authorization.

> [!div class="nextstepaction"]
> [Deploying SAP CRs and configuring authorization](preparing_sap.md)