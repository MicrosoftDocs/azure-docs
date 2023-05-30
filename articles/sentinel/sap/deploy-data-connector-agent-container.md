---
title: Deploy and configure the container hosting the SAP data connector agent
description: This article shows you how to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel solution for SAP® applications.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/12/2022
---

# Deploy and configure the container hosting the SAP data connector agent

This article shows you how to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel solution for SAP® applications.

## Deployment milestones

Deployment of the Microsoft Sentinel solution for SAP® applications is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Work with the solution across multiple workspaces](cross-workspace.md) (PREVIEW)

1. [Prepare SAP environment](preparing-sap.md)

1. **Deploy data connector agent (*You are here*)**

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. [Configure Microsoft Sentinel solution for SAP® applications](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)


## Data connector agent deployment overview

For the Microsoft Sentinel solution for SAP® applications to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using a *kickstart* script; however, you can choose to [deploy the container manually](?tabs=deploy-manually#deploy-the-data-connector-agent-container).

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system - that's why you created a user and a role for the agent in your SAP system in the previous step. 

Your SAP authentication infrastructure, and where you deploy your VM, will determine how and where your agent configuration information, including your SAP authentication secrets, is stored. These are the options, in descending order of preference:

- An Azure Key Vault, accessed through an Azure **system-assigned managed identity**
- An Azure Key Vault, accessed through an Azure AD **registered-application service principal**
- A plaintext **configuration file**

If your **SAP authentication** infrastructure is based on **SNC**, using **X.509 certificates**, your only option is to use a configuration file. Select the [**Configuration file** tab below](?tabs=config-file#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

If you're not using SNC, then your SAP configuration and authentication secrets can and should be stored in an [**Azure Key Vault**](../../key-vault/general/authentication.md). How you access your key vault depends on where your VM is deployed:

- **A container on an Azure VM** can use an Azure [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault. Select the [**Managed identity** tab below](?tabs=managed-identity#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container using managed identity.

    In the event that a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md), or, as a last resort, a configuration file.

- **A container on an on-premises VM**, or **a VM in a third-party cloud environment**, can't use Azure managed identity, but can authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md). Select the [**Registered application** tab below](?tabs=registered-application#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

    If for some reason a registered-application service principal can't be used, you can use a configuration file, though this is not preferred.

## Deploy the data connector agent container

# [Managed identity](#tab/managed-identity)

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

1. **Sign in to the newly created machine** with a user with sudo privileges.

1. **download and run the deployment Kickstart script**:
    For public cloud, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```
    For Azure China 21Vianet, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh --cloud mooncake
    ```
    For Azure Government - US, the command is:
    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh --cloud fairfax
    ```
    The script updates the OS components, installs the Azure CLI and Docker software and other required utilities (jq, netcat, curl), and prompts you for configuration parameter values. You can supply additional parameters to the script to minimize the number of prompts or to customize the container deployment. For more information on available command line options, see [Kickstart script reference](reference-kickstart.md).

2. **Follow the on-screen instructions** to enter your SAP and key vault details and complete the deployment. When the deployment is complete, a confirmation message is displayed:

    ```bash
    The process has been successfully completed, thank you!
    ```

   Note the Docker container name in the script output. You'll use it in the next step.

3. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

# [Registered application](#tab/registered-application)

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

1. Run the following commands to **create a key vault** (substitute actual names for the `<placeholders>`). If you'll be using an existing key vault, ignore this step :

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

   Note the Docker container name in the script output. You'll use it in the next step.

1. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

# [Configuration file](#tab/config-file)

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

   Note the Docker container name in the script output. You'll use it in the next step.

1. Run the following command to **configure the Docker container to start automatically**.

    ```bash
    docker update --restart unless-stopped <container-name>
    ```

    To view a list of the available containers use the command: `docker ps -a`.

# [Manual deployment](#tab/deploy-manually)

1. Transfer the [SAP NetWeaver SDK](https://aka.ms/sap-sdk-download) to the machine on which you want to install the agent.

1. Install [Docker](https://www.docker.com/) on the VM, following the [recommended deployment steps](https://docs.docker.com/engine/install/) for the chosen operating system.

1. Use the following commands (replacing `<SID>` with the name of the SAP instance) to create a folder to store the container configuration and metadata, and to download a sample systemconfig.ini file into that folder.

   ```bash
   sid=<SID>
   mkdir -p /opt/sapcon/$sid
   cd /opt/sapcon/$sid
   wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.ini 

   ```

1. Edit the systemconfig.ini file to [configure the relevant settings](reference-systemconfig.md).

1. Run the following commands (replacing `<SID>` with the name of the SAP instance) to retrieve the latest container image, create a new container, and configure it to start automatically.

   ```bash
   sid=<SID>
   docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest
   docker create -d --restart unless-stopped -v /opt/sapcon/$sid/:/sapcon-app/sapcon/config/system --name sapcon-$sid sapcon   
   ```

1. Run the following command to copy the SDK into the container. Replace `<SID>` with the name of the SAP instance and `<sdkfilename>` with full filename of the SAP NetWeaver SDK.

   ```bash
   sdkfile=<sdkfilename> 
   sid=<SID>
   docker cp $sdkfile sapcon-$sid:/sapcon-app/inst/
   ```

1. Run the following command (replacing `<SID>` with the name of the SAP instance) to start the container.

   ```bash
   sid=<SID>
   docker start sapcon-$sid
   ```

---

## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel solution for SAP® applications content:
> [!div class="nextstepaction"]
> [Deploy SAP security content](deploy-sap-security-content.md)
