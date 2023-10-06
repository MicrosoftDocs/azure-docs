---
title: Microsoft Sentinel solution for SAP® applications - deploy and configure the SAP data connector agent container (via UI)
description: This article shows you how to use the UI to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 01/18/2023
---

# Deploy and configure the container hosting the SAP data connector agent (via UI)

This article shows you how to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel solution for SAP® applications.

This article shows you how to deploy the container and create SAP systems via the UI. Also see [this video](https://www.youtube.com/watch?v=bg0vmUvcQ5Q) that shows the agent deployment process via the UI.

Alternatively, you can [deploy the data connector agent using other methods](deploy-data-connector-agent-container-other-methods.md): Managed identity, a registered application, a configuration file, or directly on the VM.

> [!IMPORTANT]
> Deploying the container and creating SAP systems via the UI is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

## Deployment milestones

Deployment of the Microsoft Sentinel solution for SAP® applications is divided into the following sections

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

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using a *kickstart* script; however, you can choose to [deploy the container manually](deploy-data-connector-agent-container-other-methods.md?tabs=deploy-manually#deploy-the-data-connector-agent-container).

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system - that's why you created a user and a role for the agent in your SAP system in the previous step. 

Your SAP authentication mechanism, and where you deploy your VM, will determine how and where your agent configuration information, including your SAP authentication secrets, is stored. These are the options, in descending order of preference:

- An **Azure Key Vault**, accessed through an Azure **system-assigned managed identity**
- An **Azure Key Vault**, accessed through an Azure AD **registered-application service principal**
- A plaintext **configuration file**

If your SAP authentication is done using SNC and X.509 certificates, your only option is to use a configuration file. Select the [**Configuration file** tab below](deploy-data-connector-agent-container-other-methods.md?tabs=config-file#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

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
- Set up a [managed identity](#managed-identity) or a [registered application](#registered-application). For more information on these options, see the [overview section](#data-connector-agent-deployment-overview).

#### Managed identity

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Run the following command to **Create a VM** in Azure (substitute actual names for the `<placeholders>`):

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

1. Copy the **systemAssignedIdentity** GUID, as it will be used in the coming steps.
   
1. Run the following commands to **create a key vault** (substitute actual names for the `<placeholders>`). If you'll be using an existing key vault, ignore this step:

    ```azurecli
    az keyvault create \
      --name <KeyVaultName> \
      --resource-group <KeyVaultResourceGroupName>
    ```    

1. Copy the name of the (newly created or existing) key vault and the name of its resource group. You'll need these when you run the deployment script in the coming steps.

1. Run the following command to **assign a key vault access policy** to the VM's system-assigned identity that you copied above (substitute actual names for the `<placeholders>`):

    ```azurecli
    az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --object-id <VM system-assigned identity> --secret-permissions get list set
    ```

    This policy will allow the VM to list, read, and write secrets from/to the key vault.

#### Registered application

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Run the following command to **create and register an application**:

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

1. Run the following commands to **create a key vault** (substitute actual names for the `<placeholders>`). If you'll be using an existing key vault, ignore this step:

    ```azurecli
    az keyvault create \
      --name <KeyVaultName> \
      --resource-group <KeyVaultResourceGroupName>
    ```

1. Copy the name of the (newly created or existing) key vault and the name of its resource group. You'll need these for assigning the key vault access policy and running the deployment script in the coming steps.

1. Run the following command to **assign a key vault access policy** to the registered application ID that you copied above (substitute actual names or values for the `<placeholders>`):

    ```azurecli
    az keyvault set-policy -n <KeyVaultName> -g <KeyVaultResourceGroupName> --spn <appId> --secret-permissions get list set
    ```

    For example:

    ```azurecli
    az keyvault set-policy -n sentinelkeyvault -g sentinelresourcegroup --application-id aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --secret-permissions get list set
    ```

    This policy will allow the VM to list, read, and write secrets from/to the key vault.

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
    - Type the agent name. The agent name can include these characters: 
        - a-z
        - A-Z 
        - 0-9 
        - _ 
        - . 
        - \-
    - Select the subscription and key vault.
    - Under **NWRFC SDK zip file path on the agent VM**, type a path that contains the SAP NetWeaver Remote Function Call (RFC), Software Development Kit (SDK) archive (.zip file). For example, */src/test/NWRFC.zip*.
    - To ingest NetWeaver/ABAP logs over a secure connection using Secure Network Communications (SNC), select **Enable SNC connection support**. If you select this option, under **SAP Cryptographic Library path on the agent VM**, provide the path that contains the `sapgenpse` binary and `libsapcrypto.so` library.
    
    > [!NOTE]
    > Make sure that you select **Enable SNC connection support** at this stage if you want to use an SNC connection. You can't go back and enable an SNC connection after you finish deploying the agent.   
       
    Learn more about [deploying the connector over a SNC connection](configure-snc.md).

    - To deploy the container and create SAP systems via managed identity, leave the default option **Managed Identity**, selected. To deploy the container and create SAP systems via a registered application, select **Application Identity**. You set up the managed identity or registered application (application identity) in the [prerequisites](#prerequisites).

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

    Learn more about how to [monitor your SAP system health](../monitor-sap-system-health.md).

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP® applications content:
> [!div class="nextstepaction"]
> [Deploy the solution content from the content hub](deploy-sap-security-content.md)
