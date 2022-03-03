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

This article lists the prerequisites required for deployment of SAP continuous threat monitoring

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Deployment milestones
Deployment of the SAP continuous threat monitoring solution is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. **Prerequisites (*You are here*)**

1. [Prepare SAP environment by deploying SAP CRs, configure Authorization and create user](preparing_sap.md)

1. [Deploy and configure the data connector agent container](deploy_data_connector_agent_container.md)

1. [Deploy SAP security content](deploy_sap_security_content.md)

1. [Optional deployment steps](optional_deployment_steps.md)
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)

## Table of Prerequisites
To successfully deploy the SAP continuous threat monitoring, a number of pre-requisites must be met.

| Area | Description |
| --- | --- |
|**Azure prerequisites** | **Access to Microsoft Sentinel**. Make a note of the Microsoft Sentinel workspace ID and key.<br><br>To view these details from **Microsoft Sentinel** panel in Azure, select **Settings** > **Workspace settings** > **Agents management**. Note down the **Workspace ID** and **Primary** or **Secondary key** <br><br>*[Optional]* **Ability to create Azure resources**, minimal requirement is ability to deploy a Solution from Microsoft Sentinel Content hub. For more information, see the [Microsoft Sentinel content hub catalog](../sentinel-solutions-catalog.md). <br><br>*[Optional]* **Ability to create or access to an existing Azure key vault**. The recommended deployment scenario is to use Azure key vault to store secrets required to connect to SAP system. For more information, see the [Azure Key Vault documentation](../../key-vault/index.yml). |
|**System prerequisites** | **System architecture**. The SAP solution is deployed as a Docker container, and each SAP client requires its own container instance.<br>Container host can be either a physical machine or a virtual machine, can be located either on-premise or in the cloud. Microsoft Sentinel workspace can be located in a different Azure subscription than the VM, or even a different Azure AD tenant.<br><br>**Administrative privileges** Administrative privileges (root) are required on the container host machine<br><br>**Supported Linux version** Docker container host machine must run one of the following Linux distributions:<br>- Ubuntu 18.04 or higher<br>- SLES version 15 or higher<br>- RHEL version 7.7 or higher<br><br> **Network connectivity**. Ensure that the container host has access to: <br>- Microsoft Sentinel <br>- Azure key vault (in scenario where Azure key vault is used to store secrets<br>- SAP system via the following TCP ports: <br>- *32xx*<br>- *5xx13*<br>- *33xx*<br>- *48xx* (in case SNC is used)<br>where *xx* is the SAP instance number. <br><br>**Software**. The SAP data connector deployment script automatically installs software prerequisites. For more information, see [Automatically installed software](#automatically-installed-software). Make sure that you also have an SAP user account in order to access the SAP software download page.<br><br>
|**Software prerequisites**| To download the SDK use the following [link](https://launchpad.support.sap.com/#/softwarecenter/template/products/%20_APP=00200682500000001943&_EVENT=DISPHIER&HEADER=Y&FUNCTIONBAR=N&EVENT=TREE&NE=NAVIGATE&ENR=01200314690100002214&V=MAINT&TA=ACTUAL&PAGE=SEARCH/SAP%20NW%20RFC%20SDK)<br>Select **SAP NW RFC SDK 7.50** -> **Linux on X86_64 64BIT** -> Download the latest version
|**SAP prerequisites** | **Supported SAP versions**. We recommend using [SAP_BASIS versions 750 SP13](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) or later. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on older SAP version [SAP_BASIS 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows).<br><br> **SAP system details**. Make a note of the following SAP system details for use in this tutorial:<br>- SAP system IP address and FQDN hostname<br>- SAP system number, such as `00`<br>- SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <br>- SAP client ID, such as `001`<br><br>**SAP NetWeaver instance access**. SAP continuous threat monitoring data connector uses one of the following mechanisms to authenticate to the SAP system: <br>- SAP ABAP user/password. <br>- A user with an X509 certificate. (This option requires additional configuration steps.|
|**Administrative workstation prerequisites** | **Required software**.<br>[Azure Command-Line Interface](https://aka.ms/azcli)
| | |

### Automatically installed software

The [SAP data connector deployment script](reference_kickstart.md) installs the following software on the container host VM (depending on the Linux distribution used, list may vary slightly):

- [Unzip](http://infozip.sourceforge.net/UnZip.html)
- [NetCat](https://sectools.org/tool/netcat/)
- [Docker](https://www.docker.com/)
- [jq](https://stedolan.github.io/jq/)
- [curl](https://curl.se/)

## SAP prerequisites

To successfully deploy the SAP continuous threat monitoring, a number of prerequisites must be met. That includes ensuring relevant SAP CRs (change requests) are deployed on the SAP system, a Microsoft-provided CR is deployed on the SAP system and a role is created in SAP to enable access for SAP continuous threat monitoring data connector.

> [!NOTE]
>  Step-by-step instructions on how to perform a deployment of a CR and deploy the required role are available in the [Deploying SAP CRs and configuring authorization](preparing_sap.md) guide. Retrieve the required CRs from the links in the tables below and proceed to the step-by-step guide.
>
> Experienced SAP administrators may choose to create the role manually and assign it relevant permissions. In such case, it is **not** necessary to deploy the *NPLK900163*, but instead create a role using recommendations outlined in [Expert: Deploy SAP CRs and deploy required ABAP authorizations](preparing_sap.md#required-abap-authorizations) as reference. Deployment of *NPLK900180* is still required to enable SAP continuous threat monitoring data connector agent to collect data from SAP successfully


### SAP environment validation steps 
1. Ensure the following SAP notes are deployed in SAP system, depending on the version:

| SAP BASIS versions | Required note |
| --- | --- |
| - 750 SP01 to SP12<br>- 751 SP01 to SP06<br>- 752 SP01 to SP03 | [2641084 - Standardized read access to data of Security Audit Log](https://launchpad.support.sap.com/#/notes/2641084)* |
| - 700 to 702<br>- 710 to 711<br>- 730<br>- 731<br>- 740<br>- 750 | [2173545: CD: CHANGEDOCUMENT_READ_ALL](https://launchpad.support.sap.com/#/notes/2173545)* |
| - 700 to 702<br>- 710 to 711<br>- 730<br>- 731<br>- 740<br>- 750 to 752 | [2502336 - CD: RSSCD100 - read only from archive, not from database](https://launchpad.support.sap.com/#/notes/2502336)* |
| | * A SAP account is required to access SAP notes |

2. Download and install one of the following SAP change requests from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR) depending on the SAP version in use:

| SAP BASIS versions | Required CR |
| --- | --- |
| - 750 and later | *NPLK900180* [K900180.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900180.NPL), [R900180.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900180.NPL) |
| - 740  | *NPLK900179* [K900179.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900179.NPL), [R900179.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900179.NPL) |
| | |

3. (Optional) Download and install the following SAP change request from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR) to create a role required for SAP continuous threat monitoring data collector to connect to SAP system
1. 
| SAP BASIS versions | Required CR |
| --- | --- |
| Any version  | *NPLK900163** [K900163.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/K900163.NPL), [R900163.NPL](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/CR/R900163.NPL)|
| | |

> [!NOTE]
> \* The optional NPLK900163 change request deploys a sample role 


## Next steps

After verification that prerequisites are met, proceed to deploy CRs to SAP system and configure authorization

> [!div class="nextstepaction"]
> [Deploying SAP CRs and configuring authorization](preparing_sap.md)