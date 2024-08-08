---
title: Connect your SAP system by deploying your data connector agent container | Microsoft Sentinel
description: This article describes how to connect your SAP system to Microsoft Sentinel by deploying the container that that hosts the SAP data connector agent.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/28/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As an security, infrastructure, or SAP BASIS team member, I want to deploy the container that hosts the Microsoft Sentinel SAP data connector agent, so that I can ingest SAP data into Microsoft Sentinel.
---

# Connect your SAP system by deploying your data connector agent container

For the Microsoft Sentinel solution for SAP applications to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

This article describes how to deploy the container that hosts the SAP data connector agent and connect to your SAP system, and is the third step in deploying the Microsoft Sentinel solution for SAP applications. Make sure to perform the steps in this article in the order that they're presented.

:::image type="content" source="media/deployment-steps/deploy-data-connector.png" alt-text="Diagram of the SAP solution deployment flow, highlighting the Deploy your data agent container step." border="false" :::

Content in this article is relevant for your **security**, **infrastructure**, and  **SAP BASIS** teams.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

Before you deploy the data connector agent:

- Make sure that have all the deployment prerequisites in place. For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

- Make sure that you have the [Microsoft Sentinel solution for SAP applications](deploy-sap-security-content.md) installed in your Microsoft Sentinel workspace.

- Make sure that your system is fully [prepared for the deployment](preparing-sap.md). If you're deploying the data connector agent to communicate with Microsoft Sentinel over SNC, make sure that you completed [Configure your system to use SNC for secure connections](preparing-sap.md#configure-your-system-to-use-snc-for-secure-connections).

## Watch a demo video

Watch a video demonstration of the deployment process described in this article.
<br>
> [!VIDEO https://www.youtube.com/embed/bg0vmUvcQ5Q?si=hugWYn1wjlq4seCR]

## Create a virtual machine and configure access to your credentials

We recommend that you store your SAP and authentication secrets in an [Azure key vault](/azure/key-vault/general/authentication). How you access your key vault depends on where your virtual machine (VM) is deployed:

|Deployment method  |Access method  |
|---------|---------|
|**Container on an Azure VM**     |  We recommend using an Azure system-assigned managed identity to access Azure Key Vault. <br><br>If a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using a Microsoft Entra ID registered-application service principal, or, as a last resort, a configuration file.  |
|**A container on an on-premises VM**, or **a VM in a third-party cloud environment**     |   Authenticate to Azure Key Vault using a Microsoft Entra ID registered-application service principal.    |

If you can't use a registered application or a service principal, use a configuration file to manage your credentials, though this method isn't preferred. For more information, see [Deploy a data connector agent container using a configuration file](sap-solution-deploy-alternate.md#deploy-a-data-connector-agent-container-using-a-configuration-file).

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

    For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md).

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

1. In your key vault, assign the following Azure role-based access control or vault access policy permissions on the secrets scope to the [identity that you created and copied earlier](#create-a-virtual-machine-and-configure-access-to-your-credentials).

    |Permission model  |Permissions required  |
    |---------|---------|
    |**Azure role-based access control**     |  Key Vault Secrets User       |
    |**Vault access policy**     |  `get`, `list`       |

    Use the options in the portal to assign the permissions, or run one of the following commands to assign key vault secrets permissions to your identity, substituting actual names for the `<placeholder>` values. Select the tab for the type of identity you'd created.

    The policy specified in the commands allows the VM to list and read secrets from the key vault.

    - **Azure role-based access control permission model**:

        #### [Managed identity](#tab/managed-identity)

        ```Azure CLI
        az role assignment create --assignee-object-id <ManagedIdentityId> --role "Key Vault Secrets User" --scope /subscriptions/<KeyVaultSubscriptionId>/resourceGroups/<KeyVaultResourceGroupName> /providers/Microsoft.KeyVault/vaults/<KeyVaultName>
        ```

        #### [Registered application](#tab/registered-application)

        ```Azure CLI
        az role assignment create --assignee-object-id <ServicePrincipalObjectId> --role "Key Vault Secrets User" --scope /subscriptions/<KeyVaultSubscriptionId>/resourceGroups/<KeyVaultResourceGroupName>/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
        ```

        To find the object ID of the app registration’s service principal, go to the Microsoft Entra ID portal's **Enterprise applications** page. Search for the name of the app registration there, and copy the **Object ID** value.

        > [!IMPORTANT]
        > Do not confuse the object ID from the **Enterprise Applications** page with the app registration's object ID found on the **App registrations** page. Only the object ID from the **Enterprise applications** page will work.

        ---

    - **Vault access policy permission model**:

        #### [Managed identity](#tab/managed-identity)

        ```Azure CLI
        az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --object-id <ManagedIdentityId> --secret-permissions get list
        ```

        #### [Registered application](#tab/registered-application)

        ```Azure CLI
        az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --spn <ApplicationId> --secret-permissions get list
        ```

        To find the object ID of the app registration, go to the Microsoft Entra ID portal's **App registrations** page. Search for name of the app registration and copy the **Application (client) ID** value.

        ---

1. In the same key vault, assign the following Azure role-based access control or vault access policy permissions on the secrets scope to the user configuring the data connector agent:

    |Permission model  |Permissions required  |
    |---------|---------|
    |**Azure role-based access control**     |  Key Vault Secrets Officer    |
    |**Vault access policy**     |  `get`, `list`, `set`, `delete`     |

    Use the options in the portal to assign the permissions, or run one of the following commands to assign key vault secrets permissions to the user, substituting actual names for the `<placeholder>` values:

    - **Azure role-based access control permission model**:

        ```Azure CLI
        az role assignment create --role "Key Vault Secrets Officer" --assignee <UserPrincipalName> --scope /subscriptions/<KeyVaultSubscriptionId>/resourceGroups/<KeyVaultResourceGroupName>/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
        ```

    - **Vault access policy permission model**:

        ```Azure CLI
        az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --upn <UserPrincipalName>--secret-permissions get list set delete
        ```

## Deploy the data connector agent

Now that you've created a VM and a Key Vault, your next step is to create a new agent and connect to one of your SAP systems. We recommend that your **security** team perform the procedures in this section with help from the **SAP BASIS** team.

1. **Sign in to the newly created VM** on which you're installing the agent, as a user with sudo privileges.

1. **Download or transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download)** to the machine.

Continue with one of the following tabs, depending on whether you're using the portal or the command line, to deploy the agent. We recommend that you use deploy the data connector agent from the portal, including the Azure portal, or the Defender portal if you've onboarded your workspace to the unified security operations platform. However:

- Deploying the data connector agent from the portal is available only for use with an Azure key vault.
- If you've previously installed SAP connector agents with the kickstart scripts or manually, configuring or managing those agents in the portal isn't supported.

> [!IMPORTANT]
> Deploying the container and creating connections to SAP systems from the portal is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Advanced users might always want to deploy the data connector agent manually, such as in a Kubernetes cluster. For more information, see [Deploy the SAP data connector manually](sap-solution-deploy-alternate.md).

## [Portal](#tab/portal)

### Deploy the data connector agent from the portal (Preview)

This procedure describes how to create a new agent and connect it to your SAP system using the Azure or Defender portals, authenticating with a managed identity or a Microsoft Entra ID registered application.

1. In the Azure portal, from the Microsoft Sentinel navigation menu, select **Data connectors**. In the Defender portal, select **Microsoft Sentinel > Configuration > Data connectors**.

1. In the search bar, enter *SAP*. Select **Microsoft Sentinel for SAP** from the search results and then **Open connector page**.

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. In the **Create a collector agent** pane, enter the following the agent details:

    |Name |Description  |
    |---------|---------|
    |**Agent name**     |  Enter an agent name, including any of the following characters: <ul><li> a-z<li> A-Z<li>0-9<li>_ (underscore)<li>. (period)<li>- (dash)</ul>       |
    |**Subscription** / **Key vault**     |   Select the **Subscription** and **Key vault** from their respective drop-downs.      |
    |**NWRFC SDK zip file path on the agent VM**     |  Enter the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). <br><br>Make sure that this path includes the SDK version number in the following syntax: `<path>/NWRFC<version number>.zip`. For example: `/src/test/nwrfc750P_12-70002726.zip`.       |
    |**Enable SNC connection support**     |Select to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC).  <br><br>If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.     <br><br>If you want to use an SNC connection, make sure to select **Enable SNC connection support** at this stage as you can't go back and enable an SNC connection after you finish deploying the agent.     |
    |**Authentication to Azure Key Vault**     |   To authenticate to your key vault using a managed identity, leave the default **Managed Identity** option selected.  To authenticate to your key vault using a registered application, select **Application Identity**. <br><br>You must have the managed identity or registered application set up ahead of time. For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).     |

    For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent-managed-id.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Select **Create** and review the recommendations before you complete the deployment:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. <a name="role"></a>Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this procedure can also be performed after the agent deployment is complete.

    Copy the **Role assignment commands** from step 1 and run them on your agent VM, replacing the `Object_ID` placeholder with your VM identity object ID. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-role.png" alt-text="Screenshot of the Copy icon for the command from step 1.":::

    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM or application name. Copy the value of the **Object ID** field to use with your copied command.

    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's managed or application identity, including only the scope of the specified agent's data in the workspace.

    > [!IMPORTANT]
    > Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
    >
    > If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Microsoft Sentinel workspace.

1. Select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon next to the Agent deployment command." border="false"::: next to the **Agent deployment command** in step 2. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-agent.png" alt-text="Screenshot of the Agent command to copy in step 2.":::

1. After you've copied the command line, select **Close**.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**.

    At this stage, the agent's **Health** status is **"Incomplete installation. Please follow the instructions"**. Once the agent is installed successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    > [!NOTE]
    > The table displays the agent name and health status for only those agents you deploy via the Azure portal. Agents deployed using the command line aren't displayed here. For more information, see the [**Command line** tab](deploy-data-connector-agent-container.md?tabs=command-line) instead.
    >

1. On the VM where you plan to install the agent, open a terminal and run the **Agent deployment command** that you'd copied in the previous step.

    The script updates the OS components and installs the Azure CLI,  Docker software, and other required utilities, such as jq, netcat, and curl.

    Supply extra parameters to the script as needed to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon next to the Health column."::: to the right of the **Health** column and copy the command next to **Agent deployment command** on the bottom right.

1. In the Microsoft Sentinel solution for SAP application's data connector page, in the **Configuration** area, select **Add new system (Preview)**, and then enter the following details: <!--validate this--> <!--From Naomi - It is not clear how to connect to an SAP system using ASCS. When selecting ABAP server, the solution will not connect to the SAP system, and there is no indication in the documentation what using the Message Server is, since this does not align to the SAP terminology. Update the documentation to align the terminology with SAP terms, and make it clearer what this configuration is used for - use scenarios and examples here.>

    - Under **Select an agent**, select the agent you created earlier.
    - Under **System identifier**, select the server type and provide the server details.

    When you're done, select  **Next: Authentication**.

    For example: <!--can we get a screenshot with an example?-->

    :::image type="content" source="media/deploy-data-connector-agent-container/create-system.png" alt-text="Screenshot of the Add new system area's System settings tab.":::

1. On the **Authentication** tab, enter the following details:

    - For basic authentication, enter the user and password.
    - If you selected an SNC connection when you [set up the agent](#deploy-the-data-connector-agent), select **SNC** and enter the certificate details.

1. Select **Next: Logs**.

1. On the **Logs** tab, select the logs you want to ingest from SAP, and then select **Next: Review and create**.

1. Review the settings you defined. Select **Previous** to modify any settings, or select **Deploy** to deploy the system.

The system configuration you defined is deployed into Azure Key Vault. You can now see the system details in the table under **Configure an SAP system and assign it to a collector agent**. This table displays the associated agent name, SAP System ID (SID), and health status for systems that you added via the portal or otherwise.

At this stage, the system's **Health** status is **Pending**. If the agent is updated successfully, it pulls the configuration from Azure Key vault, and the status changes to **System healthy**. This update can take up to 10 minutes.

For more information, see [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md).

## [Command line](#tab/command-line)

### Deploy the data connector agent from the command line

This procedure describes how to create a new agent and connect it to your SAP system via the command line, authenticating with a managed identity or a Microsoft Entra ID registered application.

If you're using a configuration file to store your credentials, see [Deploy a data connector agent container using a configuration file](sap-solution-deploy-alternate.md#deploy-a-data-connector-agent-container-using-a-configuration-file).

1. To start creating your new agent, download and run the deployment kickstart script:

    - **For a managed identity**, use one of the following command options:

        - For the Azure public commercial cloud:

            ```bash
            wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
            ```

        - For Microsoft Azure operated by 21Vianet, add `--cloud mooncake` to the end of the copied command.

        - For Azure Government - US, add `--cloud fairfax` to the end of the copied command.

    - **For a registered application**, use the following command to download the deployment kickstart script from the Microsoft Sentinel GitHub repository and mark it executable:

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
        chmod +x ./sapcon-sentinel-kickstart.sh
        ```

        Run the script, specifying the application ID, secret (the "password"), tenant ID, and key vault name that you copied in the previous steps. For example:

        ```bash
        ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret ssssssssssssssssssssssssssssssssss -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname <key vault name>
        ```

    - **To configure secure SNC configuration**, specify the following base parameters:

        - `--use-snc`
        - `--cryptolib <path to sapcryptolib.so>`
        - `--sapgenpse <path to sapgenpse>`
        - `--server-cert <path to server certificate public key>`

        If the client certificate is in *.crt* or *.key* format, use the following switches:

        - `--client-cert <path to client certificate public key>`
        - `--client-key <path to client certificate private key>`

        If the client certificate is in *.pfx* or *.p12* format, use the following switches:

        - `--client-pfx <pfx filename>`
        - `--client-pfx-passwd <password>`

        If the client certificate was issued by an enterprise CA, add the following switch for each CA in the trust chain:

        - `--cacert <path to ca certificate>`

        For example:

        ```bash
        wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
        chmod +x ./sapcon-sentinel-kickstart.sh    --use-snc     --cryptolib /home/azureuser/libsapcrypto.so     --sapgenpse /home/azureuser/sapgenpse     --client-cert /home/azureuser/client.crt --client-key /home/azureuser/client.key --cacert /home/azureuser/issuingca.crt    --cacert /home/azureuser/rootca.crt --server-cert /home/azureuser/server.crt
        ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. Supply extra parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter your SAP and key vault details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the command in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this procedure can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-managed></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the kickstart script:

        ```bash
        docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+
        ```

        For example, an agent ID returned might be `234fba02-3b34-4c55-8c0e-e6423ceb405b`.

    1. Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles by running the following commands:

    ```bash
    az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Microsoft Sentinel Business Applications Agent Operator" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>

    az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Reader" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>
    ```

    Replace placeholder values as follows:

    |Placeholder  |Value  |
    |---------|---------|
    |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM or registered application name. Copy the value of the **Object ID** field to use with your copied command.      |
    |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
    |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
    |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-managed).      |

1. To configure the Docker container to start automatically, run the following command, replacing the `<container-name>` placeholder with the name of your container:

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

### Deploy the data connector agent for secure communication with SNC

Use the following procedure to configure the Microsoft Sentinel SAP data connector agent container to use SNC for secure communications with your SAP system.

**Prerequisites**: Make sure that your SAP system is configured to use SNC for secure connections before you start this procedure. For more information, see [SAP documentation](https://help.sap.com/docs/SAP_NETWEAVER_731/a42446bded624585958a36a71903a4a7/c3d2281db19ec347a2365fba6ab3b22b.html?q=SNC). <!--not sure this is the right link for us - it's Java only?-->

**To configure the container for secure communication with SNC**:

1. Transfer the *libsapcrypto.so* and *sapgenpse* files to the system where you're creating the container.

1. Transfer the client certificate, including both private and public keys to the system where you're creating the container.

    The client certificate and key can be in *.p12*, *.pfx*, or Base64 *.crt* and *.key* format.

1. Transfer the server certificate (public key only) to the system where you're creating the container.

    The server certificate must be in Base64 *.crt* format.

1. If the client certificate was issued by an enterprise certification authority, transfer the issuing CA and root CA certificates to the system where you're creating the container.

1. Get the kickstart script from the Microsoft Sentinel GitHub repository:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    ```

1. Change the script's permissions to make it executable:

    ```bash
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```

For more information about options that are available in the kickstart script, see [Reference: Kickstart script](reference-kickstart.md).

---

## Check health and connectivity

We recommend periodically checking on your data connector agent's health and connectivity.

1. To confirm your data connector agent's connection, go to the **Microsoft Sentinel for SAP** data connector page and check the connection status. For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-data-connector.png" alt-text="Screenshot that shows the Microsoft Sentinel for SAP data connector page." lightbox="media/deploy-sap-security-content/sap-data-connector.png":::

1. Select **Logs > Custom logs** to view the logs streaming in from the SAP system. For example:

    :::image type="content" source="./media/deploy-sap-security-content/sap-logs-in-sentinel.png" alt-text="Screenshot that shows the SAP ABAP logs in the Custom Logs area in Microsoft Sentinel." lightbox="media/deploy-sap-security-content/sap-logs-in-sentinel.png":::

    SAP logs aren't displayed in the Microsoft Sentinel **Logs** page until your SAP system is connected and data starts streaming into Microsoft Sentinel.

    For more information, see [Microsoft Sentinel solution for SAP applications solution logs reference](sap-solution-log-reference.md).

For more information, see [Monitor the health and role of your SAP systems](../monitor-sap-system-health.md) and watch the following video:
<br>
> [!VIDEO https://www.youtube.com/embed/FasuyBSIaQM?si=apdesRR29Lvq6aQM]

## Stop log ingestion and disable the connector

To stop ingesting SAP logs into the Microsoft Sentinel workspace, and to stop the data stream from the Docker container, sign into your data connector agent machine and run:

```bash
docker stop sapcon-[SID/agent-name]
```

To stop ingesting a specific SID for a multi-SID container, make sure that you also delete the SID from the connector page UI in Microsoft Sentinel:

1. In Microsoft Sentinel, select **Configuration > Data connectors** and search for **Microsoft Sentinel for SAP**.
1. Select the data connector row and then select **Open connector page** in the side pane.
1. In the **Configuration** area on the **Microsoft Sentinel for SAP** data connector page, locate the SID agent you want to remove and select **Delete**. <!--need validation for this-->

The Docker container stops and doesn't send any more SAP logs to the Microsoft Sentinel workspace. This stops both the ingestion and billing for the SAP system related to the connector.

If you need to reenable the Docker container, sign into the data connector agent machine and run:

```bash
docker start sapcon-[SID]
```

## Next step

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP applications content:
> [!div class="nextstepaction"]
> [Enable SAP detections and threat protection](deployment-solution-configuration.md)

## Related content

For more video content, see the [Microsoft Security Community YouTube channel](https://www.youtube.com/@MicrosoftSecurityCommunity).
