---
title: Deploy and configure the container hosting the SAP data connector agent via the UI
description: This article shows you how to use the UI to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 01/18/2023
---

# Deploy and configure the container hosting the SAP data connector agent (via UI)

This article shows you how to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.

This article shows you how to deploy the container and create SAP systems via the UI. Alternatively, you can [deploy the data connector agent using other methods](deploy-data-connector-agent-container-other-methods.md): Managed identity, a registered application, a configuration file, or directly on the VM. 

## Deployment milestones

Deployment of the Microsoft Sentinel Solution for SAP is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md) 

1. **Deploy data connector agent (*You are here*)**

1. [Configure Microsoft Sentinel Solution for SAP](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)

## Data connector agent deployment overview

For the Microsoft Sentinel Solution for SAP to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using a *kickstart* script; however, you can choose to [deploy the container manually](deploy-data-connector-agent-container-other-methods.md?tabs=deploy-manually#deploy-the-data-connector-agent-container).

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system - that's why you created a user and a role for the agent in your SAP system in the previous step. 

Your SAP authentication mechanism, and where you deploy your VM, will determine how and where your agent configuration information, including your SAP authentication secrets, is stored. These are the options, in descending order of preference:

- An Azure Key Vault, accessed through an Azure **system-assigned managed identity**
- An Azure Key Vault, accessed through an Azure AD **registered-application service principal**
- A plaintext **configuration file**

If your **SAP authentication** infrastructure is based on **SNC**, using **X.509 certificates**, your only option is to use a configuration file. Select the [**Configuration file** tab below](deploy-data-connector-agent-container-other-methods.md?tabs=config-file#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

If you're not using SNC, then your SAP configuration and authentication secrets can and should be stored in an [**Azure Key Vault**](../../key-vault/general/authentication.md). How you access your key vault depends on where your VM is deployed:

- **A container on an Azure VM** can use an Azure [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault. Select the [**Managed identity** tab](deploy-data-connector-agent-container-other-methods.md?tabs=managed-identity#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container using managed identity.

    In the event that a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md), or, as a last resort, a configuration file.

- **A container on an on-premises VM**, or **a VM in a third-party cloud environment**, can't use Azure managed identity, but can authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md). Select the [**Registered application** tab below](deploy-data-connector-agent-container-other-methods.md?tabs=registered-application#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

    If for some reason a registered-application service principal can't be used, you can use a configuration file, though this is not preferred.

## Deploy the data connector agent container via the UI

In this section, you deploy the data connector agent. After you deploy the agent, you configure the agent to [connect to an SAP system](#connect-to-a-new-sap-system). 

### Prerequisites

- Follow the [Microsoft Sentinel Solution for SAP deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).
- If you plan to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), [deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md).

### Deploy the data connector agent

1. From the Microsoft Sentinel portal, select **Data connectors**.
1. In the search bar, type *Microsoft Sentinel for SAP*.
1. Select the **Microsoft Sentinel for SAP** connector and select **Open connector**.

    You create an agent and SAP system under the **Configuration > Add an API based collector agent** area.
    
    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the Configuration > Add an API based collector agent area of the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. Deploy the agent. To add a system, you must add an agent first. 
    
    1. [Create a new agent](#create-a-new-agent)
    1. [Connect the agent to a new SAP system](#connect-to-a-new-sap-system)

#### Create a new agent

1. In the **Configuration** area, select **Add new agent (Preview)**.
    
    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Under **Create a collector agent** on the right, define the agent details:
    - Type the agent name, and select the subscription and key vault.
    - Under **NWRFC SDK zip file path on the agent VM**, type a path that contains the SAP NetWeaver Remote Function Call (RFC), Software Development Kit (SDK) archive (.zip file). For example, *src/test/NWRFC.zip*.
    - To ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), select **Enable SNC connection support**. If you select this option, under **SAP Cryptographic Library path on the agent VM**, provide the path that contains the `sapgenpse` binary and `libsapcrypto.so` library.
    
    > [!NOTE]
    > Make sure that you select **Enable SNC connection support** at this stage if you want to use an SNC connection. You can't go back and enable an SNC connection after you finish deploying the agent.   
       
    Learn more about [deploying the connector over a SNC connection](configure-snc.md).

    - To deploy the container and create SAP systems via managed identity, leave the default option **Managed Identity**, selected. To deploy the container and create SAP systems via a registered application, select **Application Identity**.
        - If you select **Application Identity**, provide the [application ID and secret](/active-directory/develop/howto-create-service-principal-portal).

1. Select **Create** and review the recommendations before you complete the deployment:    

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. Under **Just one step before we finish**, select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon." border="false"::: next to **Agent command**.
1. In your target VM (the VM where you plan to install the agent), open a terminal and run the command you copied in the previous step.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**. 

    At this stage, the agent's **Health** status is **Incomplete installation. Please follow the instructions**. If the agent is added successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. 

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the health statuses Configuration > Add an API based collector agent area of the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

    The table displays the agent name and health status for agents you deploy via the UI only.   
    
    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon."::: to the right of the **Health** column and copy the command next to **Agent command** on the bottom right.

#### Connect to a new SAP system

1. In the **Configuration** area, select **Add new system (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/create-system.png" alt-text="Screenshot of the Add new system area.":::

1. Under **Select an agent**, select the [agent you created in the previous step](#create-a-new-agent).
1. Under **System identifier**, select the server type and provide the server details.
1. Select **Next: Authentication**.
1. For basic authentication, provide the user and password. If you selected an SNC connection when you [set up the agent](#create-a-new-agent), select **SNC** and provide the certificate details.
1. Select **Next: Logs**.
1. Select which logs you want to pull from SAP, and select **Next: Review and create**.
1. Review the settings you defined. Select **Previous** to modify any settings, or select **Deploy** to deploy the system.1. 

    The system configuration you defined is deployed into Azure Key Vault. You can now see the system details in the table under **Configure an SAP system and assign it to a collector agent**. This table displays the associated agent name, SAP System ID (SID), and health status for systems that you added via the UI or via other methods. 

    At this stage, the system's **Health** status is **Pending**. If the agent is updated successfully, it pulls the configuration from Azure Key vault, and the status changes to **System healthy**. This update can take up to 10 minutes.

    [TBD - screenshot]

    Learn more about how to [monitor your SAP system health](../monitor-sap-system-health.md).

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel Solution for SAP content:
> [!div class="nextstepaction"]
> [Deploy the solution content from the content hub](deploy-sap-security-content.md)
