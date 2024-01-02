---
title: Microsoft Sentinel solution for SAP® applications - deploy and configure the SAP data connector agent container
description: This article shows you how to use the UI to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 01/02/2024
---

# Deploy and configure the container hosting the SAP data connector agent

This article shows you how to deploy the container that hosts the SAP data connector agent, and how to use it to create connections to your SAP systems. This two-step process is required to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel solution for SAP® applications.

The recommended method to deploy the container and create connections to SAP systems is via the UI. This method is explained in the article, and also demonstrated in [this video on YouTube](https://www.youtube.com/watch?v=bg0vmUvcQ5Q). Also shown in this article is a way to accomplish these objectives by calling a *kickstart* script from the command line.

Alternatively, you can deploy the data connector agent manually by issuing individual commands from the command line, as described in [this article](deploy-data-connector-agent-container-other-methods.md).

> [!IMPORTANT]
> Deploying the container and creating connections to SAP systems via the UI is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

## Deployment milestones

Deployment of the Microsoft Sentinel solution for SAP® applications is divided into the following sections:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Configure auditing](configure-audit.md)

1. [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md) 

1. **Deploy data connector agent (*You are here*)**

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps   
   - [Configure data connector to use SNC](configure-snc.md)
   - [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
   - [Configure audit log monitoring rules](configure-audit-log-rules.md)
   - [Deploy SAP connector manually](sap-solution-deploy-alternate.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Data connector agent deployment overview

For the Microsoft Sentinel solution for SAP® applications to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using the Microsoft Sentinel portal in Azure ("the UI"); however, you can choose to deploy the container using a *kickstart* script, or to [deploy the container manually](deploy-data-connector-agent-container-other-methods.md?tabs=deploy-manually#deploy-the-data-connector-agent-container).

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system&mdash;that's why you created a user and a role for the agent in your SAP system in the previous step. 

You have a few choices of how and where to store your agent configuration information, including your SAP authentication secrets. The decision of which one to use can be affected by where you deploy your VM and by which SAP authentication mechanism you decide to use. These are the options, in descending order of preference:

- An **Azure Key Vault**, accessed through an Azure **system-assigned managed identity**
- An **Azure Key Vault**, accessed through a Microsoft Entra ID **registered-application service principal**
- A plaintext **configuration file**

For any of these scenarios, you have the extra option to authenticate using SAP's Secure Network Communication (SNC) and X.509 certificates. This option provides a higher level of authentication security, but it's only a practical option in a limited set of scenarios.

Ideally, your SAP configuration and authentication secrets can and should be stored in an [**Azure Key Vault**](../../key-vault/general/authentication.md). How you access your key vault depends on where your VM is deployed:

- **A container on an Azure VM** can use an Azure [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault. Select the [**Managed identity** tab](deploy-data-connector-agent-container-other-methods.md?tabs=managed-identity#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container using managed identity.

    In the event that a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using an [Microsoft Entra registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md), or, as a last resort, a [**configuration file**](deploy-data-connector-agent-container-other-methods.md?tabs=config-file#deploy-the-data-connector-agent-container).

- **A container on an on-premises VM**, or **a VM in a third-party cloud environment**, can't use Azure managed identity, but can authenticate to Azure Key Vault using an [Microsoft Entra registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md). Select the [**Registered application** tab below](deploy-data-connector-agent-container-other-methods.md?tabs=registered-application#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

- If for some reason a registered-application service principal can't be used, you can use a [**configuration file**](reference-systemconfig.md), though this is not preferred.

## Prerequisites

Before you deploy the data connector agent, make sure you have done the following:

- Follow the [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).
- If you plan to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), [take the preparatory steps for deploying the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md).
- Set up a Key Vault, using either a [managed identity](deploy-data-connector-agent-container.md?tabs=managed-identity#create-key-vault) or a [registered application](deploy-data-connector-agent-container.md?tabs=registered-application#create-key-vault) (links are to the procedures shown below). Make sure you have the necessary permissions. 
    - If your circumstances do not allow for using Azure Key Vault, create a [**configuration file**](reference-systemconfig.md) to use instead.
- For more information on these options, see the [overview section](#data-connector-agent-deployment-overview).

## Deploy the data connector agent container

This section has three steps:
- In the first step, you [create the virtual machine and set up your access to your SAP system credentials](#create-virtual-machine-and-configure-access-to-your-credentials). (This step may need to be performed by other appropriate personnel, but it must be done first. See [Prerequisites](#prerequisites).)
- In the second step, you [set up and deploy the data connector agent](#deploy-the-data-connector-agent).
- In the third step, you configure the agent to [connect to an SAP system](#connect-to-a-new-sap-system). 

### Create virtual machine and configure access to your credentials

# [Managed identity](#tab/managed-identity)

#### Create a managed identity with an Azure VM

1. Run the following command to **Create a VM** in Azure (substitute actual names from your environment for the `<placeholders>`):

    ```azurecli
    az vm create --resource-group <resource group name> --name <VM Name> --image Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest --admin-username <azureuser> --public-ip-address "" --size  Standard_D2as_v5 --generate-ssh-keys --assign-identity --role <role name> --scope <subscription Id>

    ```

    For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md).

    > [!IMPORTANT]
    > After the VM is created, be sure to apply any security requirements and hardening procedures applicable in your organization.
    >

    The command above will create the VM resource, producing output that looks like this:

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

# [Registered application](#tab/registered-application)

#### Register an application to create an application identity

1. Run the following command from the Azure command line to **create and register an application**:

    ```azurecli
    az ad sp create-for-rbac
    ```

    The command above will create the application, producing output that looks like this:

    ```json
    {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "azure-cli-2022-01-28-17-59-06",
      "password": "ssssssssssssssssssssssssssssssssss",
      "tenant": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    }
    ```

1. Copy the **appId**, **tenant**, and **password** from the output. You'll need these for assigning the key vault access policy and running the deployment script in the coming steps.

1. Before proceeding any further, create a virtual machine on which to deploy the agent. You can create this machine in Azure, in another cloud, or on-premises.

# [Configuration file](#tab/config-file)

#### Create a configuration file

Key Vault is the recommended method to store your authentication credentials and configuration data.

If you are prevented from using Azure Key Vault, you can use a configuration file instead. See the appropriate reference file:

- [Systemconfig.ini file reference](reference-systemconfig.md) (for agent versions deployed before June 22, 2023).
- [Systemconfig.json file reference](reference-systemconfig-json.md) (for versions deployed June 22 or later).

Once you have the file prepared, but before proceeding any further, create a virtual machine on which to deploy the agent. Then, skip the Key Vault steps below and go directly to the step after them&mdash;[Deploy the data connector agent](#deploy-the-data-connector-agent).

---

#### Create Key Vault

1. Run the following commands to **create a key vault** (substitute actual names for the `<placeholders>`):  
    (If you'll be using an existing key vault, ignore this step.)

    ```azurecli
    az keyvault create \
      --name <KeyVaultName> \
      --resource-group <KeyVaultResourceGroupName>
    ```    

1. Copy the name of the (newly created or existing) key vault and the name of its resource group. You'll need these when you assign the key vault access policy and run the deployment script in the coming steps.

#### Assign a key vault access policy

1. Run the following command to **assign a key vault access policy** to the identity that you created and copied above (substitute actual names for the `<placeholders>`). Choose the appropriate tab for the type of identity you created to see the relevant command.

    # [Managed identity](#tab/managed-identity)

    Run this command to assign the access policy to your VM's **system-assigned managed identity**:

    ```azurecli
    az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --object-id <VM system-assigned identity> --secret-permissions get list set
    ```

    This policy will allow the VM to list, read, and write secrets from/to the key vault.

    # [Registered application](#tab/registered-application)

    Run this command to assign the access policy to a **registered application identity**:

    ```azurecli
    az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --spn <appId> --secret-permissions get list set
    ```

    This policy will allow the VM to list, read, and write secrets from/to the key vault.

    # [Configuration file](#tab/config-file)

    Move on, nothing to see here...

    ---


### Deploy the data connector agent

Now that you've created a VM and a Key Vault, your next step is to create a new agent and connect to one of your SAP systems.

1. **Sign in to the newly created VM** on which you are installing the agent, as a user with sudo privileges.

1. **Download or transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download)** to the machine.

# [Azure portal](#tab/azure-portal/managed-identity)

Create a new agent through the Azure portal, authenticating with a managed identity:

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. In the search bar, type *SAP*.

1. Select **Microsoft Sentinel for SAP** from the search results, and select **Open connector page**.

1. To collect data from a SAP system, you must follow these two steps:
    
    1. [Create a new agent](#create-a-new-agent)
    1. [Connect the agent to a new SAP system](#connect-to-a-new-sap-system)

#### Create a new agent

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. Under **Create a collector agent** on the right, define the agent details:

    - Enter the **Agent name**. The agent name can include these characters: 
        - a-z
        - A-Z 
        - 0-9 
        - _ (underscore)
        - . (period)
        - \- (dash)

    - Select the **Subscription** and **Key Vault** from their respective drop-downs.

    - Under **NWRFC SDK zip file path on the agent VM**, type the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). For example, */src/test/NWRFC.zip*.

    - To ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), select **Enable SNC connection support**. If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.
    
        > [!NOTE]
        > Make sure that you select **Enable SNC connection support** at this stage if you want to use an SNC connection. You can't go back and enable an SNC connection after you finish deploying the agent.   
       
        Learn more about [deploying the connector over a SNC connection](configure-snc.md).

    - To authenticate to your key vault using a managed identity, leave the default option **Managed Identity**, selected. You must have the managed identity set up ahead of time, as mentioned in the  [prerequisites](#prerequisites).

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Select **Create** and review the recommendations before you complete the deployment:    

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. Under **Just one step before we finish**, select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon." border="false"::: next to **Agent command**.

   The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl). You can supply additional parameters to the script to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).
   
1. In your target VM (the VM where you plan to install the agent), open a terminal and run the command you copied in the previous step.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**. 

    At this stage, the agent's **Health** status is **Incomplete installation. Please follow the instructions**. If the agent is added successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. 

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    The table displays the agent name and health status for agents you deploy via the UI only.   
    
    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon."::: to the right of the **Health** column and copy the command next to **Agent command** on the bottom right.

# [Azure portal](#tab/azure-portal/registered-application)

Create a new agent through the Azure portal, authenticating with a Microsoft Entra registered application:

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. In the search bar, type *SAP*.

1. Select **Microsoft Sentinel for SAP** from the search results, and select **Open connector page**.

1. To collect data from a SAP system, you must follow these two steps:
    
    1. [Create a new agent](#create-a-new-agent)
    1. [Connect the agent to a new SAP system](#connect-to-a-new-sap-system)

#### Create a new agent

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. Under **Create a collector agent** on the right, define the agent details:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent.png" alt-text="Screenshot of the Create a collector agent area.":::

    - Enter the **Agent name**. The agent name can include these characters: 
        - a-z
        - A-Z 
        - 0-9 
        - _ (underscore)
        - . (period)
        - \- (dash)

    - Select the **Subscription** and **Key Vault** from their respective drop-downs.

    - Under **NWRFC SDK zip file path on the agent VM**, type the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). For example, */src/test/NWRFC.zip*.

    - To ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), select **Enable SNC connection support**. If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.
    
        > [!NOTE]
        > Make sure that you select **Enable SNC connection support** at this stage if you want to use an SNC connection. You can't go back and enable an SNC connection after you finish deploying the agent.   
       
        Learn more about [deploying the connector over a SNC connection](configure-snc.md).

    - To authenticate to your key vault using a registered application, select **Application Identity**. You must have the registered application (application identity) set up ahead of time, as mentioned in the [prerequisites](#prerequisites).

1. Select **Create** and review the recommendations before you complete the deployment:    

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. Under **Just one step before we finish**, select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon." border="false"::: next to **Agent command**.

1. In your target VM (the VM where you plan to install the agent), open a terminal and run the command you copied in the previous step.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**. 

    At this stage, the agent's **Health** status is **Incomplete installation. Please follow the instructions**. If the agent is added successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. 

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    The table displays the agent name and health status for agents you deploy via the UI only.   
    
    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon."::: to the right of the **Health** column and copy the command next to **Agent command** on the bottom right.

# [Azure portal](#tab/azure-portal/config-file)

The UI can only be used with Azure Key Vault.

To use the command line to create an agent using a config file, see [these instructions](?tabs=config-file%2Ccommand-line#deploy-the-data-connector-agent).

# [Command line](#tab/command-line/managed-identity)

Create a new agent using the command line, authenticating with a managed identity:

1. **Download and run the deployment Kickstart script**:
    For public cloud, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```
    For Microsoft Azure operated by 21Vianet, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh --cloud mooncake
    ```
    For Azure Government - US, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh --cloud fairfax
    ```
    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter your SAP and key vault details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. You'll use it in the next step.

1. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

# [Command line](#tab/command-line/registered-application)

Create a new agent using the command line, authenticating with a Microsoft Entra registered application:

1. Run the following commands to **download the deployment Kickstart script** from the Microsoft Sentinel GitHub repository and **mark it executable**:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    
1. **Run the script**, specifying the application ID, secret (the "password"), tenant ID, and key vault name that you copied in the previous steps.

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret ssssssssssssssssssssssssssssssssss -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname <key vault name>
    ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the amount of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. You'll use it in the next step.

1. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

# [Command line](#tab/command-line/config-file)

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Run the following commands to **download the deployment Kickstart script** from the Microsoft Sentinel GitHub repository and **mark it executable**:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    
1. **Run the script**:

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode cfgf
    ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the amount of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. You'll use it in the next step.

1. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

---

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

    Learn more about how to [monitor your SAP system health](../monitor-sap-system-health.md).

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP® applications content:
> [!div class="nextstepaction"]
> [Deploy the solution content from the content hub](deploy-sap-security-content.md)
