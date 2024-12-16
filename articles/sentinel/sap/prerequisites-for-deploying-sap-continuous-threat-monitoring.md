---
title: Prerequisites for deploying Microsoft Sentinel solution for SAP applications
description: This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP applications.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 11/05/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
zone_pivot_groups: sentinel-sap-connection

#Customer intent: As a security administrator, I want to understand the prerequisites for deploying a Microsoft Sentinel solution for SAP applications so that I can ensure a smooth and compliant deployment process.

---

# Deployment prerequisites for the Microsoft Sentinel solutions for SAP applications

This article lists the prerequisites required for deployment of the Microsoft Sentinel solution for SAP applications, which differ depending on whether you're deploying a data connector agent or using the agentless solution with the SAP Cloud Connector. Select the option at the top of this page that matches your deployment.

Reviewing and ensuring that you have or understand all the prerequisites is the first step in deploying the Microsoft Sentinel solution for SAP applications. Select a connection type to list the prerequisites for your environment.

:::zone pivot="connection-agent"

:::image type="content" source="media/deployment-steps/prerequisites.png" alt-text="Diagram of the steps included in deploying the Microsoft Sentinel solution for SAP applications, with the prerequisites step highlighted." border="false":::

Content in this article is relevant for your **security**, **infrastructure**, and **SAP BASIS** teams.

:::zone-end

:::zone pivot="connection-agentless"

:::image type="content" source="media/deployment-steps/prerequisites-agentless.png" alt-text="Diagram of the steps included in deploying the Microsoft Sentinel solution for SAP applications, with the prerequisites step highlighted." border="false":::

Content in this article is relevant for your **security** and **SAP BASIS** teams.

> [!IMPORTANT]
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it’s commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also [requires registration](https://aka.ms/SentinelSAPAgentlessSignUp) and is only available to approved customers and partners during the preview period. For more information, see [Microsoft Sentinel for SAP goes agentless ](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238).

:::zone-end

:::zone pivot="connection-agent"

## Azure prerequisites

Typically, Azure prerequisites are managed by your **security** teams.

| Prerequisite | Description |Required/optional |
| ---- | ----------- |----------- |
| **Access to Microsoft Sentinel** | Make a note of your *workspace ID and *primary key* for your Log Analytics workspace enabled for Microsoft Sentinel.<br>You can find these details in Microsoft Sentinel: from the navigation menu, select **Settings** > **Workspace settings** > **Agents management**. Copy the *Workspace ID* and *Primary key* and paste them aside for use during the deployment process. |Required |
| **Permissions to create Azure resources** | At a minimum, you must have the necessary permissions to deploy solutions from the Microsoft Sentinel content hub. For more information, see [Prerequisites for deploying Microsoft Sentinel solutions](../sentinel-solutions-deploy.md#prerequisites). |Required |
| **Permissions to create an Azure key vault or access an existing one** | Use Azure Key Vault to store secrets required to connect to your SAP system. For more information, see [Assign key vault access permissions](deploy-data-connector-agent-container.md#assign-key-vault-access-permissions). |Required if you plan to store the SAP system credentials in Azure Key Vault. <br><br>Optional if you plan to store them in a configuration file. For more information, see [Create a virtual machine and configure access to your credentials](deploy-data-connector-agent-container.md#create-a-virtual-machine-and-configure-access-to-your-credentials).|
| **Permissions to assign a privileged role to the SAP data connector agent** | Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** role. To grant this role, you need **Owner** permissions on the resource group where your Microsoft Sentinel workspace resides. <br><br>For more information, see [Connect your SAP system by deploying your data connector agent container](deploy-data-connector-agent-container.md). | Required. <br> If you don't have **Owner** permissions on the resource group, the relevant step can also be performed by another user who does have the relevant permissions, separately after the agent is fully deployed.|

## System prerequisites for the data connector agent container

Typically, system prerequisites are managed by your **infrastructure** teams.

| Prerequisite | Description |
| ---- | ----------- |
| **System architecture** | The data connector component of the SAP solution is deployed as a Docker container.<br>The container host can be either a physical machine or a virtual machine, can be located either on-premises or in any cloud. <br>The VM hosting the container ***does not*** have to be located in the same Azure subscription as your Microsoft Sentinel workspace, or even in the same Microsoft Entra tenant. |
| **Supported Linux versions** | The SAP data connector agent is tested with the following Linux distributions:<br>- Ubuntu 18.04 or higher<br>- SLES version 15 or higher<br>- RHEL version 7.7 or higher<br><br>If you have a different operating system, you might need to deploy and configure the container manually. <br><br>For more information, see [Deploy the Microsoft Sentinel for SAP data connector agent container with expert options](sap-solution-deploy-alternate.md) or open a support ticket. |
| **Virtual machine sizing recommendations** | **Minimum specification**, such as for a lab environment:<br>*Standard_B2s* VM, with:<br>- Two cores<br>- 4-GB RAM<br><br>**Standard connector** (default):<br>*Standard_D2as_v5* VM or<br>*Standard_D2_v5* VM, with: <br>- Two cores<br>- 8-GB RAM<br><br>**Multiple connectors**:<br>*Standard_D4as_v5* or<br>*Standard_D4_v5* VM, with: <br>- Four cores<br>- 16-GB RAM |
| **Administrative privileges** | Administrative privileges (root) are required on the container host machine. |
| **Network connectivity** | Ensure that the container host has access to: <br>- Microsoft Sentinel <br>- Azure key vault (in deployment scenario where Azure key vault is used to store secrets<br>- SAP system via the following TCP ports: *32xx*, *5xx13*, *33xx*, *48xx* (when SNC is used), where *xx* is the SAP instance number. |
| **Software utilities** | The [SAP data connector deployment script](reference-kickstart.md) installs the following required software on the container host VM (depending on the Linux distribution used, the list might vary slightly): <br>- [Unzip](http://infozip.sourceforge.net/UnZip.html)<br>- [NetCat](https://sectools.org/tool/netcat/)<br>- [Docker](https://www.docker.com/)<br>- [jq](https://stedolan.github.io/jq/)<br>- [curl](https://curl.se/) |
| **Managed identity or service principal** | The latest version of the SAP data connector agent requires a [managed identity](/entra/identity/managed-identities-azure-resources/) or [service principal](/entra/identity-platform/app-objects-and-service-principals?tabs=browser) to authenticate to Microsoft Sentinel. <br><br>Legacy agents are supported for updates to the latest version, and then must use a managed identity or service principal to continue updating to subsequent versions. |

## SAP prerequisites for the data connector agent container

We recommend that your **SAP BASIS** team verify and ensure SAP system prerequisites. We strongly recommend that any management of your SAP system is carried out by an experienced SAP system administrator.

| Prerequisite | Description |
| ---- | ----------- |
| **Supported SAP versions** | The SAP data connector agent support SAP NetWeaver systems and was tested on [SAP_BASIS versions 731](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows) and above. <br><br>Certain steps in this tutorial provide alternative instructions if you're working on the older [SAP_BASIS version 740](https://support.sap.com/en/my-support/software-downloads/support-package-stacks/product-versions.html#:~:text=SAP%20NetWeaver%20%20%20%20SAP%20Product%20Version,%20%20SAPKB710%3Cxx%3E%20%207%20more%20rows). |
| **Required software** | SAP NetWeaver RFC SDK 7.50 ([Download here](https://aka.ms/sentinel4sapsdk))<br>Make sure that you also have an SAP user account in order to access the SAP software download page. |
| **SAP system details** | Make a note of the following SAP system details: <br>- SAP system IP address and FQDN hostname<br>- SAP system number, such as `00`<br>- SAP System ID, from the SAP NetWeaver system (for example, `NPL`) <br>- SAP client ID, such as `001` |
| **SAP NetWeaver instance access** | The SAP data connector agent uses one of the following mechanisms to authenticate to the SAP system: <br>- SAP ABAP user/password<br>- A user with an X.509 certificate. This option requires extra configuration steps. For more information, see [Configure your system to use SNC for secure connections](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).|
| **SAP role requirements** | To allow the SAP data connector to connect to your SAP system, you must create an SAP system role. We recommend creating the required system role by deploying the SAP *NPLK900271* change request (CR). For more information, see [Configure the Microsoft Sentinel role](preparing-sap.md#configure-the-microsoft-sentinel-role).|
| **Recommended CRs for extra support** | Deploy recommended CRs on your SAP system to retrieve extra details, such as client IP address and extra logs. For more information, see [Configure support for extra data retrieval (recommended)](preparing-sap.md#configure-support-for-extra-data-retrieval-recommended). |

:::zone-end

:::zone pivot="connection-agentless"

## Azure prerequisites

Typically, Azure prerequisites are managed by your **security** teams.

| Prerequisite | Description |Required/optional |
| ---- | ----------- |----------- |
| **Access to the limited preview** | The **Agentless solution** requires you to register, and is only available to approved customers and partners during the limited preview period. For more information, see [Limited Preview Sign Up: Microsoft Sentinel Solution for SAP - Agent-less Data Connector](https://aka.ms/SentinelSAPAgentlessSignUp). |Required |
| **Permissions to create Azure resources** | You must have: <br><br>- The necessary permissions to deploy solutions from the Microsoft Sentinel content hub. For more information, see [Prerequisites for deploying Microsoft Sentinel solutions](../sentinel-solutions-deploy.md#prerequisites) and [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/permissions-reference#application-administrator). <br>Owner on the Microsoft Sentinel resource group , required for:<br><br>- Creation of data collection rule and data collection endpoint.<br><br>- Monitoring Metrics Publisher role assignment on data collection rule. |Required |
| **Permissions in** **Microsoft Entra**|You must have permissions in Microsoft Entra ID required to create app registrations. This permission can be obtained through membership of built-in Microsoft Entra ID role:<br><br>- Application Developer.|Required |

## SAP prerequisites for the agentless data connector

We recommend that your **SAP BASIS** team verify and ensure SAP system prerequisites. We strongly recommend that any management of your SAP system is carried out by an experienced SAP system administrator.

| Prerequisite | Description |
| ---- | ----------- |
| **Supported SAP versions** | The **Agentless** solution supports SAP NetWeaver systems with [SAP_BASIS versions 750](https://userapps.support.sap.com/sap(bD1kZSZjPTAwMQ==)/support/pam/pam.html?smpsrv=https%3a%2f%2fwebsmp201.sap-ag.de#ts=60&s=netweaver%207.5&o=most_viewed%7Cdesc&st=l&rpp=20&page=1&pvnr=73554900100900000414&pt=g%7Cd) and above. |
| **SAP system** | Your SAP system must have: <br><br>An SAP BTP Subaccount with following services enabled:  <br>    - SAP Integration Suite <br>- SAP Process Integration Runtime <br>- Cloud Foundry Runtime<br>    For more information, see the [SAP documentation](https://help.sap.com/docs/sap-hana-spatial-services/onboarding/creating-subaccount-on-sap-business-technology-platform-sap-btp ). [Trial accounts](https://developers.sap.com/tutorials/hcp-create-trial-account.html) are supported.<br><br>The [SAP Cloud Connector](https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/installation?locale=en-US) deployed <br><br>SAP NetWeaver version 7.5 or higher|
| **SAP roles and permissions** | You must have the following roles in your SAP systems: <br><br>**In SAP NetWeaver 7.5+**: SAP Netweaver Administrator <br><br>**In SAP BTP, all of the following roles**:<br>- Subaccount administrator <br>- Integration Provisioner <br>- PI_Administrator <br>- PI_Integration_Developer <br>- PI_Business_Expert| 

:::zone-end


## Plan your ingestion

We recommend that you test your systems to determine the number of logs that each of your SAP systems sends to Microsoft Sentinel. Microsoft Sentinel billing depends on log ingestion size, which in turn depends on factors such as system usage, modules deployed, number of users, running use cases, network traffic, and log types.

For more information, see:

- [Solution pricing](solution-overview.md#solution-pricing)
- [Plan costs and understand Microsoft Sentinel pricing and billing](../billing.md)
- [Reduce costs for Microsoft Sentinel](../billing-reduce-costs.md)
- [Manage and monitor costs for Microsoft Sentinel](../billing-monitor-costs.md)

## Next step

> [!div class="nextstepaction"]
> [Install the Microsoft Sentinel solution for SAP applications](deploy-sap-security-content.md)
