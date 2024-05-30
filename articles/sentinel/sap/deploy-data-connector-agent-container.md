---
title: Microsoft Sentinel solution for SAP applications - deploy and configure the SAP data connector agent container
description: This article shows you how to use the Azure portal to deploy the container that hosts the SAP data connector agent, in order to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 04/01/2024
---

# Deploy and configure the container hosting the SAP data connector agent

This article shows you how to deploy the container that hosts the SAP data connector agent, and how to use it to create connections to your SAP systems. This two-step process is required to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel solution for SAP applications.

The recommended method to deploy the container and create connections to SAP systems is via the Azure portal. This method is explained in the article, and also demonstrated in [this video on YouTube](https://www.youtube.com/watch?v=bg0vmUvcQ5Q). Also shown in this article is a way to accomplish these objectives by calling a *kickstart* script from the command line.

Alternatively, you can deploy the data connector Docker container agent manually, such as in a Kubernetes cluster. For more information, open a support ticket.

> [!IMPORTANT]
> Deploying the container and creating connections to SAP systems via the Azure portal is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]

## Deployment milestones

Deployment of the Microsoft Sentinel solution for SAP® applications is divided into the following sections:

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. [Configure auditing](configure-audit.md)

1. **Deploy the data connector agent (*You are here*)**

1. [Deploy the Microsoft Sentinel solution for SAP applications® from the content hub](deploy-sap-security-content.md) 

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps   
   - [Configure data connector to use SNC](configure-snc.md)
   - [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)
   - [Configure audit log monitoring rules](configure-audit-log-rules.md)
   - [Deploy SAP connector manually](sap-solution-deploy-alternate.md)
   - [Select SAP ingestion profiles](select-ingestion-profiles.md)

## Data connector agent deployment overview

For the Microsoft Sentinel solution for SAP applications to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using the Azure portal (in PREVIEW); however, you can choose to deploy the container using a *kickstart* script. If you want to deploy the data connector Docker container agent manually, such as in a Kubernetes cluster, open a support ticket for more details.

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system&mdash;that's why you created a user and a role for the agent in your SAP system in the previous step. 

You have a few choices of how and where to store your agent configuration information, including your SAP authentication secrets. The decision of which one to use can be affected by where you deploy your VM and by which SAP authentication mechanism you decide to use. These are the options, in descending order of preference:

- An **Azure Key Vault**, accessed through an Azure **system-assigned managed identity**
- An **Azure Key Vault**, accessed through a Microsoft Entra ID **registered-application service principal**
- A plaintext **configuration file**

For any of these scenarios, you have the extra option to authenticate using SAP's Secure Network Communication (SNC) and X.509 certificates. This option provides a higher level of authentication security, but it's only a practical option in a limited set of scenarios.

Deploying the data connector agent container includes the following steps:

1. [Creating the virtual machine and setting up access to your SAP system credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials). This procedure may need to be performed by another team in your organization, but must be performed before the other procedures in this article.

1. [Set up and deploy the data connector agent](#deploy-the-data-connector-agent).

1. [Configure the agent to connect to an SAP system.](#connect-to-a-new-sap-system)

## Prerequisites

Before you deploy the data connector agent, make sure that have all the deployment prerequisites in place. For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

Also, if you plan to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), take the relevant preparatory steps. For more information, see [Deploy the Microsoft Sentinel for SAP data connector by using SNC](configure-snc.md).

## Create a virtual machine and configure access to your credentials

Ideally, your SAP configuration and authentication secrets can and should be stored in an [**Azure Key Vault**](../../key-vault/general/authentication.md). How you access your key vault depends on where your VM is deployed:

- **A container on an Azure VM** can use an Azure [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault.

    In the event that a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using a [Microsoft Entra ID registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md), or, as a last resort, a **configuration file**.

- **A container on an on-premises VM**, or **a VM in a third-party cloud environment**, can't use Azure managed identity, but can authenticate to Azure Key Vault using a [Microsoft Entra ID registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md).

- If for some reason a registered-application service principal can't be used, you can use a [**configuration file**](reference-systemconfig.md), though this is not preferred.

> [!NOTE]
> This procedure may need to be performed by another team in your organization, but must be performed before the other procedures in this article.
>

Select one of the following tabs, depending on how you plan to store and access your authentication credentials and configuration data.

# [Managed identity](#tab/create-managed-identity)

### Create a managed identity with an Azure VM

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

# [Registered application](#tab/create-registered-application)

### Register an application to create an application identity

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

# [Configuration file](#tab/create-config-file)

### Use a configuration file

Key Vault is the recommended method to store your authentication credentials and configuration data.

If you are prevented from using Azure Key Vault, you can use a configuration file instead:

1. Create a virtual machine on which to deploy the agent.
1. Continue with deploying the data connector agent using the configuration file. For more information, see 
[Command line options](#command-line-options).

The configuration file is generated during the agent deployment. For more information, see:

- [Systemconfig.json file reference](reference-systemconfig-json.md) (for versions deployed June 22 or later).
- [Systemconfig.ini file reference](reference-systemconfig.md) (for agent versions deployed before June 22, 2023).

---

### Create a key vault

This procedure describes how to create a key vault to store your agent configuration information, including your SAP authentication secrets. If you'll be using an existing key vault, skip directly to [step 2](#step2).

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

    # [Assign managed identity permissions](#tab/perms-managed-identity)

    Run one of the following commands, depending on your preferred Key Vault permission model, to assign key vault secrets permissions to your VM's system-assigned managed identity. The policy specified in the commands allows the VM to list and read secrets from the key vault.

    - **Azure role-based access control permission model**:

        ```Azure CLI
        az role assignment create --assignee-object-id <ManagedIdentityId> --role "Key Vault Secrets User" --scope /subscriptions/<KeyVaultSubscriptionId>/resourceGroups/<KeyVaultResourceGroupName> /providers/Microsoft.KeyVault/vaults/<KeyVaultName>
        ```

    - **Vault access policy permission model**:

        ```Azure CLI
        az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --object-id <ManagedIdentityId> --secret-permissions get list
        ```

    # [Assign registered application permissions](#tab/perms-registered-application)

    Run one of the following commands, depending on your preferred Key Vault permission model, to assign key vault secrets permissions to your VM's registered application identity. The policy specified in the commands allows the VM to list and read secrets from the key vault.

    - **Azure role-based access control permission model**:

        ```Azure CLI
        az role assignment create --assignee-object-id <ServicePrincipalObjectId> --role "Key Vault Secrets User" --scope /subscriptions/<KeyVaultSubscriptionId>/resourceGroups/<KeyVaultResourceGroupName>/providers/Microsoft.KeyVault/vaults/<KeyVaultName>
        ```

        To find the object ID of the app registration’s service principal, go to the Microsoft Entra ID portal's **Enterprise applications** page. Search for the name of the app registration there, and copy the **Object ID** value.

        > [!IMPORTANT]
        > Do not confuse the object ID from the **Enterprise Applications** page with the app registration's object ID found on the **App registrations** page. Only the object ID from the **Enterprise applications** page will work.

    - **Vault access policy permission model**:

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

Now that you've created a VM and a Key Vault, your next step is to create a new agent and connect to one of your SAP systems.

1. **Sign in to the newly created VM** on which you are installing the agent, as a user with sudo privileges.

1. **Download or transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download)** to the machine.

Use one of the following sets of procedures, depending on whether you're using a managed identity or a registered application to access your key vault, and whether you're using the Azure portal or the command line to deploy the agent:

- [Azure portal options (Preview)](#azure-portal-options-preview)
- [Command line options](#command-line-options)

> [!TIP]
> The Azure portal can only be used with an Azure key vault. If you're using a configuration file instead, use the relevant [command line option](#command-line-options).
>

### Azure portal options (Preview)

Select one of the following tabs, depending on the type of identity you're using to access your key vault.

> [!NOTE]
> If you previously installed SAP connector agents manually or using the kickstart scripts, you can't configure or manage those agents in the Azure portal. If you want to use the portal to configure and update agents, you must reinstall your existing agents using the portal.

# [Deploy with a managed identity](#tab/deploy-azure-managed-identity)

This procedure describes how to create a new agent through the Azure portal, authenticating with a managed identity:

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. In the search bar, enter *SAP*.

1. Select **Microsoft Sentinel for SAP** from the search results, and select **Open connector page**.

1. To collect data from an SAP system, you must follow these two steps:

    1. [Create a new agent](#create-a-new-agent)
    1. [Connect the agent to a new SAP system](#connect-to-a-new-sap-system)

#### Create a new agent

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. Under **Create a collector agent** on the right, define the agent details:

    |Name |Description  |
    |---------|---------|
    |**Agent name**     |  Enter an agent name, including any of the following characters: <ul><li> a-z<li> A-Z<li>0-9<li>_ (underscore)<li>. (period)<li>- (dash)</ul>       |
    |**Subscription** / **Key vault**     |   Select the **Subscription** and **Key vault** from their respective drop-downs.      |
    |**NWRFC SDK zip file path on the agent VM**     |  Enter the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). <br><br>Make sure that this path includes the SDK version number in the following syntax: `<path>/NWRFC<version number>.zip`. For example: `/src/test/nwrfc750P_12-70002726.zip`.       |
    |**Enable SNC connection support**     |Select to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC).  <br><br>If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.         |
    |**Authentication to Azure Key Vault**     |   To authenticate to your key vault using a managed identity, leave the default **Managed Identity** option selected.  <br><br>You must have the managed identity set up ahead of time. For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).     |

    > [!NOTE]
    > If you want to use an SNC connection, make sure to select **Enable SNC connection support** at this stage as you can't go back and enable an SNC connection after you finish deploying the agent. For more information, see [Deploy the Microsoft Sentinel for SAP data connector by using SNC](configure-snc.md).

    For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent-managed-id.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Select **Create** and review the recommendations before you complete the deployment:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. <a name="role"></a>Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this procedure can also be performed after the agent deployment is complete.

    Copy the **Role assignment commands** from step 1 and run them on your agent VM, replacing the `Object_ID` placeholder with your VM identity object ID. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-role.png" alt-text="Screenshot of the Copy icon for the command from step 1.":::

    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM name. Copy the value of the **Object ID** field to use with your copied command.

    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's managed identity, including only the scope of the specified agent's data in the workspace.

    > [!IMPORTANT]
    > Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
    >
    > If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Microsoft Sentinel workspace.

1. Select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon." border="false"::: next to the **Agent deployment command** in step 2. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-agent.png" alt-text="Screenshot of the Agent command to copy in step 2.":::

1. After you've copied the command line, select **Close**.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**.

    At this stage, the agent's **Health** status is **"Incomplete installation. Please follow the instructions"**. Once the agent is installed successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    > [!NOTE]
    > The table displays the agent name and health status for only those agents you deploy via the Azure portal. Agents deployed using the [command line](#command-line-options) aren't displayed here.
    >

1. On the VM where you plan to install the agent, open a terminal and run the **Agent deployment command** that you'd copied in the previous step.

    The script updates the OS components and installs the Azure CLI,  Docker software, and other required utilities, such as jq, netcat, and curl.

    Supply additional parameters to the script as needed to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon."::: to the right of the **Health** column and copy the command next to **Agent deployment command** on the bottom right.

### Connect to a new SAP system

Anyone adding a new connection to an SAP system must have write permission to the [key vault where the SAP credentials are stored](#create-a-key-vault). For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).

1. In the **Configuration** area, select **Add new system (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/create-system.png" alt-text="Screenshot of the Add new system area.":::

1. Under **Select an agent**, select the [agent you created in the previous step](#create-a-new-agent).

1. Under **System identifier**, select the server type and provide the server details.

1. Select **Next: Authentication**.

1. For basic authentication, provide the user and password. If you selected an SNC connection when you [set up the agent](#create-a-new-agent), select **SNC** and provide the certificate details.

1. Select **Next: Logs**.

1. Select which logs you want to pull from SAP, and select **Next: Review and create**.

1. Review the settings you defined. Select **Previous** to modify any settings, or select **Deploy** to deploy the system.

1. The system configuration you defined is deployed into Azure Key Vault. You can now see the system details in the table under **Configure an SAP system and assign it to a collector agent**. This table displays the associated agent name, SAP System ID (SID), and health status for systems that you added via the Azure portal or via other methods. 

    At this stage, the system's **Health** status is **Pending**. If the agent is updated successfully, it pulls the configuration from Azure Key vault, and the status changes to **System healthy**. This update can take up to 10 minutes.

    Learn more about how to [monitor your SAP system health](../monitor-sap-system-health.md).

# [Deploy with a registered application](#tab/deploy-azure-registered-application)

This procedure describes how to create a new agent through the Azure portal, authenticating with a Microsoft Entra ID registered application.

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. In the search bar, enter *SAP*.

1. Select **Microsoft Sentinel for SAP** from the search results, and select **Open connector page**.

1. To collect data from an SAP system, you must follow these two steps:

    1. [Create a new agent](#create-a-new-agent-1)
    1. [Connect the agent to a new SAP system](#connect-to-a-new-sap-system-1)

#### Create a new agent

1. In the **Configuration** area, select **Add new agent (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/configuration-new-agent.png" alt-text="Screenshot of the instructions to add an SAP API-based collector agent." lightbox="media/deploy-data-connector-agent-container/configuration-new-agent.png":::

1. Under **Create a collector agent** on the right, define the agent details:


    |Name |Description  |
    |---------|---------|
    |**Agent name**     |  Enter an agent name, including any of the following characters: <ul><li> a-z<li> A-Z<li>0-9<li>_ (underscore)<li>. (period)<li>- (dash)</ul>       |
    |**Subscription** / **Key vault**     |   Select the **Subscription** and **Key vault** from their respective drop-downs.      |
    |**NWRFC SDK zip file path on the agent VM**     |  Enter the path in your VM that contains the SAP NetWeaver Remote Function Call (RFC) Software Development Kit (SDK) archive (.zip file). For example, */src/test/NWRFC.zip*.       |
    |**Enable SNC connection support**     |Select to ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC).  <br><br>If you select this option, enter the path that contains the `sapgenpse` binary and `libsapcrypto.so` library, under **SAP Cryptographic Library path on the agent VM**.         |
    |**Authentication to Azure Key Vault**     |   To authenticate to your key vault using a registered application, select **Application Identity**. <br><br>You must have the registered application (application identity) set up ahead of time. For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).     |

    > [!NOTE]
    > If you want to use an SNC connection, make sure to select **Enable SNC connection support** at this stage as you can't go back and enable an SNC connection after you finish deploying the agent. For more information, see [Deploy the Microsoft Sentinel for SAP data connector by using SNC](configure-snc.md).

    For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/create-agent-app-id.png" alt-text="Screenshot of the Create a collector agent area.":::

1. Select **Create** and review the recommendations before you complete the deployment:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment.png" alt-text="Screenshot of the final stage of the agent deployment.":::

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this procedure can also be performed after the agent deployment is complete.

    Copy the **Role assignment commands** from step 1 and run them on your agent VM, replacing the `Object_ID` placeholder with your VM identity object ID. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-role.png" alt-text="Screenshot of the Copy icon for the command from step 1.":::

    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your application name. Copy the value of the **Object ID** field to use with your copied command.

    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's application identity, including only the scope of the specified agent's data in the workspace.

    > [!IMPORTANT]
    > Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
    >
    > If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Microsoft Sentinel workspace.

1. Select **Copy** :::image type="content" source="media/deploy-data-connector-agent-container/copy-icon.png" alt-text="Screenshot of the Copy icon." border="false"::: next to the **Agent deployment command** in step 2. For example:

    :::image type="content" source="media/deploy-data-connector-agent-container/finish-agent-deployment-agent.png" alt-text="Screenshot of the Agent command to copy in step 2.":::

1. After you've copied the command line, select **Close**.

    The relevant agent information is deployed into Azure Key Vault, and the new agent is visible in the table under **Add an API based collector agent**. 

    At this stage, the agent's **Health** status is **"Incomplete installation. Please follow the instructions"**. Once the agent is installed successfully, the status changes to **Agent healthy**. This update can take up to 10 minutes. 

    :::image type="content" source="media/deploy-data-connector-agent-container/installation-status.png" alt-text="Screenshot of the health statuses of API-based collector agents on the SAP data connector page." lightbox="media/deploy-data-connector-agent-container/installation-status.png":::

    The table displays the agent name and health status for only those agents you deploy via the Azure portal. Agents deployed using the [command line](#command-line-options) aren't displayed here.

1. On the VM where you plan to install the agent, open a terminal and run the **Agent deployment command** that you'd copied in the previous step.

    The script updates the OS components and installs the Azure CLI,  Docker software, and other required utilities, such as jq, netcat, and curl.

    Supply additional parameters to the script as needed to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

    If you need to copy your command again, select **View** :::image type="content" source="media/deploy-data-connector-agent-container/view-icon.png" border="false" alt-text="Screenshot of the View icon."::: to the right of the **Health** column and copy the command next to **Agent deployment command** on the bottom right.

### Connect to a new SAP system

Anyone adding a new connection to an SAP system must have write permission to the [key vault where the SAP credentials are stored](#create-a-key-vault). For more information, see [Create a virtual machine and configure access to your credentials](#create-a-virtual-machine-and-configure-access-to-your-credentials).

1. In the **Configuration** area, select **Add new system (Preview)**.

    :::image type="content" source="media/deploy-data-connector-agent-container/create-system.png" alt-text="Screenshot of the Add new system area.":::

1. Under **Select an agent**, select the [agent you created in the previous step](#create-a-new-agent).

1. Under **System identifier**, select the server type and provide the server details.

1. Select **Next: Authentication**.

1. For basic authentication, provide the user and password. If you selected an SNC connection when you [set up the agent](#create-a-new-agent), select **SNC** and provide the certificate details.

1. Select **Next: Logs**.

1. Select which logs you want to pull from SAP, and select **Next: Review and create**.

1. Review the settings you defined. Select **Previous** to modify any settings, or select **Deploy** to deploy the system.

1. The system configuration you defined is deployed into Azure Key Vault. You can now see the system details in the table under **Configure an SAP system and assign it to a collector agent**. This table displays the associated agent name, SAP System ID (SID), and health status for systems that you added via the Azure portal or via other methods. 

    At this stage, the system's **Health** status is **Pending**. If the agent is updated successfully, it pulls the configuration from Azure Key vault, and the status changes to **System healthy**. This update can take up to 10 minutes.

    Learn more about how to [monitor your SAP system health](../monitor-sap-system-health.md).

---


### Command line options

Select one of the following tabs, depending on the type of identity you're using to access your key vault:

# [Deploy with a managed identity](#tab/deploy-cli-managed-identity)

Create a new agent using the command line, authenticating with a managed identity:

1. **Download and run the deployment Kickstart script**:

    For the Azure public commercial cloud, the command is:

    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```

    - For Microsoft Azure operated by 21Vianet, add `--cloud mooncake` to the end of the copied command.

    - For Azure Government - US, add `--cloud fairfax` to the end of the copied command.

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

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

    1. <a name=agent-id-managed></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the Kickstart script:

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
    |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM name. Copy the value of the **Object ID** field to use with your copied command.      |
    |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
    |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
    |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-managed).      |

1. To configure the Docker container to start automatically, run the following command, replacing the `<container-name>` placeholder with the name of your container:

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

# [Deploy with a registered application](#tab/deploy-cli-registered-application)

Create a new agent using the command line, authenticating with a Microsoft Entra ID registered application:

1. Run the following commands to **download the deployment Kickstart script** from the Microsoft Sentinel GitHub repository and **mark it executable**:

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    
1. **Run the script**, specifying the application ID, secret (the "password"), tenant ID, and key vault name that you copied in the previous steps.

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret ssssssssssssssssssssssssssssssssss -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname <key vault name>
    ```

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.

1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this step can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-application></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the Kickstart script:

        ```bash
        docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+'
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
    |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your application name. Copy the value of the **Object ID** field to use with your copied command.      |
    |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
    |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
    |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-application).      |

1. To configure the Docker container to start automatically, run the following command, replacing the `<container-name>` placeholder with the name of your container:

    ```bash
    docker update --restart unless-stopped <container-name>
    ```


# [Deploy with a configuration file](#tab/deploy-cli-config-file)

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

    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

1. **Follow the on-screen instructions** to enter the requested details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. To see the list of docker containers on your VM, run:

    ```bash
    docker ps -a
    ```

    You'll use the name of the docker container in the next step.


1. Deploying the SAP data connector agent requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

    To run the commands in this step, you must be a resource group owner on your Microsoft Sentinel workspace. If you aren't a resource group owner on your workspace, this step can also be performed later on.

    Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles to the VM's identity:

    1. <a name=agent-id-file></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of the docker container that you'd created with the Kickstart script:

        ```bash
        docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+'
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
    |`<OBJ_ID>`     | Your VM identity object ID. <br><br>    To find your VM identity object ID in Azure, go to **Enterprise application** > **All applications**, and select your VM or application name, depending on whether you're using a managed identity or a registered application. <br><br>Copy the value of the **Object ID** field to use with your copied command.      |
    |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
    |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
    |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#agent-id-file).      |


1. Run the following command to configure the Docker container to start automatically.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

---

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP® applications content:
> [!div class="nextstepaction"]
> [Deploy the solution content from the content hub](deploy-sap-security-content.md)

See this [YouTube video](https://youtu.be/FasuyBSIaQM), on the [Microsoft Security Community YouTube channel](https://www.youtube.com/@MicrosoftSecurityCommunity), for guidance on checking the health and connectivity of the SAP connector.
