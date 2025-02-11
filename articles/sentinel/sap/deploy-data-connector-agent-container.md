---
title: Connect your SAP system to Microsoft Sentinel | Microsoft Sentinel
description: This article describes how to connect your SAP system to Microsoft Sentinel by deploying the container that that hosts the SAP data connector agent.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 10/28/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
zone_pivot_groups: sentinel-sap-connection

#Customer intent: As a security, infrastructure, or SAP BASIS team member, I want to connect my SAP system to Microsoft Sentinel so that I can ingest SAP data into Microsoft Sentinel for enhanced monitoring and threat detection.

---

# Connect your SAP system to Microsoft Sentinel

For the Microsoft Sentinel solution for SAP applications to operate correctly, you must first get your SAP data into Microsoft Sentinel. Do this by either deploying the Microsoft Sentinel SAP data connector agent, or by connecting the Microsoft Sentinel agentless data connector for SAP. Select the option at the top of the page that matches your environment.

This article describes the third step in deploying one of the Microsoft Sentinel solutions for SAP applications.

:::zone pivot="connection-agent"

:::image type="content" source="media/deployment-steps/deploy-data-connector.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Connect your SAP system step." border="false" :::

Content in this article is relevant for your **security**, **infrastructure**, and  **SAP BASIS** teams. Make sure to perform the steps in this article in the order that they're presented.

:::zone-end

:::zone pivot="connection-agentless"

:::image type="content" source="media/deployment-steps/deploy-data-connector-agentless.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Connect your SAP system step."  :::

Content in this article is relevant for your **security** team, using information provided by your **SAP BASIS** teams.

:::zone-end


> [!IMPORTANT]
> Microsoft Sentinel's **Agentless solution** is in limited preview as a prereleased product, which may be substantially modified before it’s commercially released. Microsoft makes no warranties expressed or implied, with respect to the information provided here. Access to the **Agentless solution** also [requires registration](https://aka.ms/SentinelSAPAgentlessSignUp) and is only available to approved customers and partners during the preview period. For more information, see [Microsoft Sentinel for SAP goes agentless ](https://community.sap.com/t5/enterprise-resource-planning-blogs-by-members/microsoft-sentinel-for-sap-goes-agentless/ba-p/13960238).

## Prerequisites

Before you connect your SAP system to Microsoft Sentinel:

- Make sure that all of the deployment prerequisites are in place. For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

:::zone pivot="connection-agent"

- Make sure that you have the Microsoft Sentinel solution for **SAP applications** [installed in your Microsoft Sentinel workspace](deploy-sap-security-content.md)

- Make sure that your SAP system is fully [prepared for the deployment](preparing-sap.md).

- If you're deploying the data connector agent to communicate with Microsoft Sentinel over SNC, make sure that you completed [Configure your system to use SNC for secure connections](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).

:::zone-end

:::zone pivot="connection-agentless"

- Make sure that you have the Microsoft Sentinel **SAP Agentless** solution [installed in your Microsoft Sentinel workspace](deploy-sap-security-content.md)

- Make sure that your SAP system is fully [prepared for the deployment](preparing-sap.md).

- Make sure your DCR is configured as described in [Install the solution from the content hub](deploy-sap-security-content.md#install-the-solution-from-the-content-hub).

:::zone-end

:::zone pivot="connection-agent"

## Watch a demo video

Watch one of the following video demonstrations of the deployment process described in this article.

A deep dive on the portal options:
<br><br>
> [!VIDEO https://www.youtube.com/embed/bg0vmUvcQ5Q?si=hugWYn1wjlq4seCR]

Includes more details about using Azure KeyVault. No audio, demonstration only with captions:
<br><br>
> [!VIDEO https://www.youtube.com/embed/TXANRi88mqI?si=D_5TlOlswKW9OSee]

## Create a virtual machine and configure access to your credentials

We recommend creating a dedicated virtual machine for your data connector agent container to ensure optimal performance and avoid potential conflicts. For more information, see [System prerequisites for the data connector agent container](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#system-prerequisites-for-the-data-connector-agent-container).

We recommend that you store your SAP and authentication secrets in an [Azure key vault](/azure/key-vault/general/authentication). How you access your key vault depends on where your virtual machine (VM) is deployed:

|Deployment method  |Access method  |
|---------|---------|
|**Container on an Azure VM**     |  We recommend using an Azure system-assigned managed identity to access Azure Key Vault. <br><br>If a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using a Microsoft Entra ID registered-application service principal, or, as a last resort, a configuration file.  |
|**A container on an on-premises VM**, or **a VM in a third-party cloud environment**     |   Authenticate to Azure Key Vault using a Microsoft Entra ID registered-application service principal.    |

If you can't use a registered application or a service principal, use a configuration file to manage your credentials, though this method isn't preferred. For more information, see [Deploy the data connector using a configuration file](deploy-command-line.md#deploy-the-data-connector-using-a-configuration-file).

For more information, see:

- [Authentication in Azure Key Vault](/azure/key-vault/general/authentication)
- [What are manged identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals?tabs=browser)

Your virtual machine is typically created by your **infrastructure** team. Configuring access to credentials and managing key vaults is typically done by your **security** team.

## [Managed identity](#tab/managed-identity)

### Create a managed identity with an Azure VM

1. Run the following command to **Create a VM** in Azure, substituting actual names from your environment for the `<placeholders>`:

    ```azurecli
    az vm create --resource-group <resource group name> --name <VM Name> --image Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest --admin-username <azureuser> --public-ip-address "" --size  Standard_D2as_v5 --generate-ssh-keys --assign-identity --role <role name> --scope <subscription Id>

    ```

    For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](/azure/virtual-machines/linux/quick-create-cli).

    > [!IMPORTANT]
    > After the VM is created, be sure to apply any security requirements and hardening procedures applicable in your organization.
    >

    This command creates the VM resource, producing output that looks like this:

    ```json
    {
      "fqdns": "",
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourcegroupname/providers/Microsoft.Compute/virtualMachines/vmname",
      "identity": {
        "systemAssignedIdentity": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
        "userAssignedIdentities": {}
      },
      "location": "westeurope",
      "macAddress": "00-11-22-33-44-55",
      "powerState": "VM running",
      "privateIpAddress": "192.168.136.5",
      "publicIpAddress": "",
      "resourceGroup": "resourcegroupname",
      "zones": ""
    }
    ```

1. Copy the **systemAssignedIdentity** GUID, as it will be used in the coming steps. This is your **managed identity**.

## [Registered application](#tab/registered-application)

### Register an application to create an application identity

1. Run the following command from the Azure command line to **create and register an application**:

    ```azurecli
    az ad sp create-for-rbac
    ```

    This command creates the application, producing output that looks like this:

    ```json
    {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "azure-cli-2022-01-28-17-59-06",
      "password": "ssssssssssssssssssssssssssssssssss",
      "tenant": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    }
    ```

    For more information, see the [Azure CLI reference documentation](/cli/azure/ad/sp#az-ad-sp-create-for-rbac).

1. Copy the **appId**, **tenant**, and **password** from the output. You need these for assigning the key vault access policy and running the deployment script in the coming steps.

1. Before proceeding any further, create a virtual machine on which to deploy the agent. You can create this machine in Azure, in another cloud, or on-premises.

---

### Create a key vault

This procedure describes how to create a key vault to store your agent configuration information, including your SAP authentication secrets. If you're using an existing key vault, skip directly to [step 2](#step2).

**To create your key vault**:

1. Run the following commands, substituting actual names for the `<placeholder>` values.  

    ```azurecli
    az keyvault create \
      --name <KeyVaultName> \
      --resource-group <KeyVaultResourceGroupName>
    ```

1. <a name=step2></a>Copy the name of your key vault and the name of its resource group. You'll need these when you assign the key vault access permissions and run the deployment script in the next steps.

### Assign key vault access permissions

1. In your key vault, assign the Azure **Key Vault Secrets Reader** role to the [identity that you created and copied earlier](#create-a-virtual-machine-and-configure-access-to-your-credentials).

1. In the same key vault, assign the following Azure roles to the user configuring the data connector agent:

    - **Key Vault Contributor**, to deploy the agent
    - **Key Vault Secrets Officer**, to add new systems

## Deploy the data connector agent from the portal (Preview)

Now that you created a VM and a Key Vault, your next step is to create a new agent and connect to one of your SAP systems. While you can run multiple data connector agents on a single machine, we recommend that you start with one only, monitor the performance, and then increase the number of connectors slowly.

This procedure describes how to create a new agent and connect it to your SAP system using the Azure or Defender portals. We recommend that your **security** team perform this procedure with help from the **SAP BASIS** team.

Deploying the data connector agent from the portal is supported from both the Azure portal, and the Defender portal if you onboarded your workspace to the unified security operations platform.

While deployment is also supported from the command line, we recommend that you use the portal for typical deployments. Data connector agents deployed using the command line can be managed only via the command line, and not via the portal. For more information, see [Deploy an SAP data connector agent from the command line](deploy-command-line.md).

> [!IMPORTANT]
> Deploying the container and creating connections to SAP systems from the portal is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

**Prerequisites**:

- To deploy your data connector agent via the portal, you need:

    - Authentication via a managed identity or a registered application
    - Credentials stored in an Azure Key Vault

    If you don't have these prerequisites, [deploy the SAP data connector agent from the command line](deploy-command-line.md) instead.

- To deploy the data connector agent, you also need sudo or root privileges on the data connector agent machine.

- If you want to ingest Netweaver/ABAP logs over a secure connection using Secure Network Communications (SNC), you need:

    - The path to the `sapgenpse` binary and `libsapcrypto.so` library
    - The details of your client certificate

    For more information, see [Configure your system to use SNC for secure connections](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).

**To deploy the data connector agent**:

1. Sign in to the newly created VM on which you're installing the agent, as a user with sudo privileges.

1. Download and/or transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine.

1. In Microsoft Sentinel, select **Configuration > Data connectors**.

1. In the search bar, enter *SAP*. Select **Microsoft Sentinel for SAP** from the search results and then **Open connector page**.

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. In the **Create a collector agent** pane, enter the following agent details:

    |Name |Description  |
    |---------|---------|
    |**Agent name**     |  Enter a meaningful agent name for your organization. We don't recommend any specific naming convention, except that the name can include only the following types of characters: <ul><li> a-z<li> A-Z<li>0-9<li>_ (underscore)<li>. (period)<li>- (dash)</ul>       |
    |**Subscription** / **Key vault**     |   Select the **Subscription** and **Key vault** from their respective drop-downs.      |
    |**NWRFC SDK zip file path on the agent VM**     |  Enter the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). <br><br>Make sure that this path includes the SDK version number in the following syntax: `<path>/NWRFC<version number>.zip`. For example: `/src/test/nwrfc750P_12-70002726.zip`.       |
    |**Enable SNC connection support**     |Select to ingest NetWeaver/ABAP logs over a [secure connection using SNC](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).  <br><br>If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.     <br><br>If you want to use an SNC connection, make sure to select **Enable SNC connection support** at this stage as you can't go back and enable an SNC connection after you finish deploying the agent. If you want to change this setting afterwards, we recommend that you create a new agent instead.  |
    |**Authentication to Azure Key Vault**     |   To authenticate to your key vault using a managed identity, leave the default **Managed Identity** option selected. To authenticate to your key vault using a registered application, select **Application Identity**. <br><br>You must have the managed identity or registered application set up ahead of time. For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).     |

    For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent-managed-id.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Select **Create** and review the recommendations before you complete the deployment:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. <a name="role"></a>Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this procedure can also be performed after the agent deployment is complete.

    Under **Just a few more steps before we finish**, copy the *Role assignment commands* from step 1 and run them on your agent VM, replacing the `[Object_ID]` placeholder with your VM identity object ID. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-role.png" alt-text="Screenshot of the Copy icon for the command from step 1.":::

    To find your VM identity object ID in Azure:

    - For a managed identity, the object ID is listed on the VM's **Identity** page.

    - For a service principal, go to **Enterprise application** in Azure. Select **All applications** and then select your VM. The object ID is displayed on the **Overview** page.

    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's managed or application identity, including only the scope of the specified agent's data in the workspace.

    > [!IMPORTANT]
    > Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
    >
    > If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Microsoft Sentinel workspace.

1. Select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon next to the Agent deployment command." border="false"::: next to the **Agent deployment command** in step 2. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-agent.png" alt-text="Screenshot of the Agent command to copy in step 2.":::

1. Copy the command line to a separate location and then select **Close**.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**.

    At this stage, the agent's **Health** status is **"Incomplete installation. Please follow the instructions"**. Once the agent is installed successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    > [!NOTE]
    > The table displays the agent name and health status for only those agents you deploy via the Azure portal. Agents deployed using the command line aren't displayed here. For more information, see the [**Command line** tab](deploy-data-connector-agent-container.md?tabs=command-line) instead.
    >

1. On the VM where you plan to install the agent, open a terminal and run the **Agent deployment command** that you copied in the previous step. This step requires sudo or root privileges on the data connector agent machine.

    The script updates the OS components and installs the Azure CLI,  Docker software, and other required utilities, such as jq, netcat, and curl.

    Supply extra parameters to the script as needed to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon next to the Health column."::: to the right of the **Health** column and copy the command next to **Agent deployment command** on the bottom right.

1. In the Microsoft Sentinel solution for SAP application's data connector page, in the **Configuration** area, select **Add new system (Preview)** and enter the following details:

    - Under **Select an agent**, select the agent you created earlier.
    - Under **System identifier**, select the server type:

        - **ABAP Server**
        - **Message Server** to use a message server as part of an ABAP SAP Central Services (ASCS).

    - Continue by defining related details for your server type:

        - **For an ABAP server**, enter the ABAP Application server IP address/FQDN, the system ID and number, and the client ID.
        - **For a message server**, enter the message server IP address/FQDN, the port number or service name, and the logon group

    When you're done, select  **Next: Authentication**.

    For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-system.png" alt-text="Screenshot of the Add new system area's System settings tab.":::

1. On the **Authentication** tab, enter the following details:

    - For basic authentication, enter the user and password.
    - If you selected an SNC connection [when you set up the agent](#deploy-the-data-connector-agent-from-the-portal-preview), select **SNC** and enter the certificate details. 

    When you're done, select **Next: Logs**.

1. On the **Logs** tab, select the logs you want to ingest from SAP, and then select **Next: Review and create**. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/logs-page.png" alt-text="Screenshot of the Logs tab in the Add new system side pane.":::

1. (Optional) For optimal results in monitoring the SAP PAHI table, select **Configuration History**. For more information, see [Verify that the PAHI table is updated at regular intervals](preparing-sap.md#verify-that-the-pahi-table-is-updated-at-regular-intervals).

1. Review the settings you defined. Select **Previous** to modify any settings, or select **Deploy** to deploy the system.

The system configuration you defined is deployed into the Azure key vault you defined during the deployment. You can now see the system details in the table under **Configure an SAP system and assign it to a collector agent**. This table displays the associated agent name, SAP System ID (SID), and health status for systems that you added via the portal or otherwise.

At this stage, the system's **Health** status is **Pending**. If the agent is updated successfully, it pulls the configuration from Azure Key vault, and the status changes to **System healthy**. This update can take up to 10 minutes.

:::zone-end

:::zone pivot="connection-agentless"

## Connect your agentless data connector

1. In Microsoft Sentinel, go to the **Configuration > Data connectors** page and locate the **SAP ABAP and S/4 via cloud connector (Preview)** data connector.

1. In the **Configuration** area, under **Connect an SAP integration suite to Microsoft Sentinel**, select **Add connection**.

1. In the **Agentless connection** side pane, enter the following details:

    | Field        | Description                      |
    |-------------------------------|---------------------------------------|
    | **RFC destination name**      | The name of the RFC destination, taken from your BTP destination.                |
    | **SAP Agentless Client ID**   | The *clientid* value taken from the Process Integration Runtime service key JSON file.                 |
    | **SAP Agentless Client Secret** | The *clientsecret* value taken from the Process Integration Runtime service key JSON file.             |
    | **Authorization server URL**  | The *tokenurlurl* value taken from the Process Integration Runtime service key JSON file. For example: `https://your-tenant.authentication.region.hana.ondemand.com/oauth/token` |
    | **Integration Suite Endpoint** | The *url* value taken from the Process Integration Runtime service key JSON file. For example: `https://your-tenant.it-account-rt.cfapps.region.hana.ondemand.com` |

:::zone-end

## Check connectivity and health

After you deploy the SAP data connector, check your agent's health and connectivity. For more information, see [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md).

## Next step

Once the connector is deployed, proceed to configure the Microsoft Sentinel solution for SAP applications content. Specifically, configuring details in the watchlists is an essential step in enabling detections and threat protection.

> [!div class="nextstepaction"]
> [Enable SAP detections and threat protection](deployment-solution-configuration.md)
