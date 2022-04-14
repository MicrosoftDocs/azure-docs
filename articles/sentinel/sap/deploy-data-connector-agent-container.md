---
title: Deploy and configure the SAP data connector agent container | Microsoft Docs
description: This article shows you how to deploy the SAP data connector agent container in order to ingest SAP data into Microsoft Sentinel, as part of Microsoft Sentinel's Continuous Threat Monitoring solution for SAP.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/12/2022
---

# Deploy and configure the SAP data connector agent container

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article shows you how to deploy the SAP data connector agent container in order to ingest SAP data into Microsoft Sentinel, as part of Microsoft Sentinel's Continuous Threat Monitoring solution for SAP.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Deployment milestones

Deployment of the SAP continuous threat monitoring solution is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. **Deploy data connector agent (*You are here*)**

1. [Deploy SAP security content](deploy_sap_security_content.md)

1. Optional deployment steps
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)


## Data connector agent deployment overview

The Continuous Threat Monitoring solution for SAP is built on first getting all your SAP log data into Microsoft Sentinel, so that all the other components of the solution can do their jobs. To accomplish this, you need to deploy the SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in other clouds, or on-premises. You install and configure this container using a *kickstart* script.

The agent connects to your SAP system to pull the logs from it, and then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system - that's why you created a user and a role for the agent in your SAP system in the previous step. 

Your SAP authentication infrastructure, and where you deploy your VM, will determine how and where your agent configuration information, including your SAP authentication secrets, is stored. These are the options:

- A plaintext configuration file
- An Azure AD enterprise application service principal
- An Azure managed identity

If your SAP authentication infrastructure is based on PKI, using X.509 certificates, your only option is to use a configuration file. [Follow these instructions](#deploy-using-configuration-file-for-secrets-storage) to deploy your agent container.

If not, then it depends on where your VM is deployed:

- A container on an Azure VM can use an Azure [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault. [Follow these instructions](#deploy-using-azure-key-vault-for-secret-storage) to deploy your agent container using managed identity.

    Such a container can also authenticate to Azure Key Vault using an [Azure AD service principal](../../active-directory/develop/app-objects-and-service-principals.md), or a configuration file.

- A container on an on-premises VM, or a VM in a third-party cloud environment, can't use Azure managed identity, but can authenticate to Azure Key Vault using a [service principal](../../active-directory/develop/app-objects-and-service-principals.md). [Follow these instructions](#deploy-using-enterprise-application-identity-for-secrets-storage-in-key-vault) to deploy your agent container.

### Summary

| Authentication | VM location | Config file | Azure AD<br>service principal | Azure<br>managed identity |
| -------------- | ----------- | :----------------: | :---------------------------: | :-----------------------: |
| X.509  | regardless     | &#10004; | &#10008; | &#10008; |
| Other  | On-premises<br>Non-Azure cloud | &#10004; | preferable | &#10008; |
|        | Azure cloud | last resort | if unable to use<br>managed identity | ideal |

### Prerequisites

[See this article](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#table-of-prerequisites).

Deploying the data connector container using a kickstart script requires the Linux distros and versions listed at the link above. If you have a different operating system, you can [deploy and configure the container manually](#manual-sap-data-connector-deployment).

The instructions below require the Azure CLI. [Learn how to install the Azure CLI](/cli/azure/install-azure-cli).

### Recommended virtual machine sizing

The following table describes the recommended sizing for your virtual machine, depending on your intended usage:
In general, at least 2 cores and at least 4 GB of memory is recommended for the VM acting as host for the data connector agent container

|Usage  |Recommended sizing  |
|---------|---------|
|**Minimum specification**, such as for a lab environment | *Standard_B2s* VM |
|**Standard connector** (default) | *Standard_D2as_v5* VM or<br>*Standard_D2_v5* VM, with: <br>- 2 cores<br>- 8 GB RAM |
|**Multiple connectors** | *Standard_D4as_v5* or<br> *Standard_D4_v5* VM, with: <br>- 4 cores<br>- 16 GB RAM |
| | |

## Deploy the data connector agent container

# [Managed identity](#tab/managed-identity)

### Agent deployment steps

1. Create a VM in Azure using the following sample command:

    ```azurecli
    az vm create --resource-group [resource group name] --name [VM Name] --image Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest --admin-username azureuser --public-ip-address "" --size  Standard_D2as_v5 --generate-ssh-keys --assign-identity
    ```

    The command will create the VM resource, producing output that looks like this:

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

    Copy the **systemAssignedIdentity** GUID, as it will be used in the next step.

    For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md).

    > [!IMPORTANT]
    > After the VM is created, be sure to apply any security requirements and hardening procedures applicable in your organization.
    >

1. Create a key vault using the following command:

    ```azurecli
    kvgp=<KVResourceGroup>
    kvname=<keyvaultname>

    #Create a key vault
    az keyvault create \
      --name $kvname \
      --resource-group $kvgp
    ```

    If an an existing key vault will be used, locate and copy its name and the name of its resource group.

1. Assign a key vault access policy to the VM assigned identity (to allow it to list, read, and write secrets from the key vault), using the following command:

    ```azurecli
    az keyvault set-policy -n [key vault name] -g [key vault resource group] --object-id [vm system assigned identity] --secret-permissions get list set
    ```

1. Sign in to the newly created machine and configure a data disk to be mounted at the Docker root directory.

1. Download and run the deployment Kickstart script:

    ```bash
    wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
    ```

    The Kickstart script simplifies the process of deploying the data connector container by performing the following actions:

   1. Updates the OS components.

   1. Installs prerequisite software:
      - azure-cli
      - docker

   1. Prompts for configuration parameter values.

   1. Configures the container.

   Note the Docker container name in the script output.

1. Configure the Docker container to start automatically.

    The sample code below assumes the name of the created container is `sapcon-a4h`.

    To view a list of the available containers use the command: `docker ps -a`.

    ```bash
    docker update --restart unless-stopped sapcon-a4h
    ```

# [Service principal](#tab/service-principal)

1. Create an enterprise application by running the following command:

    ```azurecli
    az ad sp create-for-rbac
    ```

    The command will create the application, producing output that looks like this:

    ```json
    {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "azure-cli-2022-01-28-17-59-06",
      "password": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      "tenant": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    }
    ```

    Copy the **appId** from the output, as you'll need it later.

1. Create a key vault using the following command:

    ```azurecli
    kvgp=<KVResourceGroup>
    kvname=<keyvaultname>

    #Create a key vault
    az keyvault create \
      --name $kvname \
      --resource-group $kvgp
    ```

    If an an existing key vault will be used, locate and copy its name and the name of its resource group.

1. Assign a key vault access policy to the enterprise application (to allow it to list, read, and write secrets from the key vault) by running the following command:

    ```azurecli
    az keyvault set-policy -n [key vault name] -g [key vault resource group] --spn [appid] --secret-permissions get list set
    ```

    For example:

    ```azurecli
    az keyvault set-policy -n sentinelkeyvault -g sentinelresourcegroup --application-id aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --secret-permissions get list set
    ```

1. Download and run the Kickstart script:


    Download the script from the Microsoft Sentinel GitHub repository, and mark it executable.

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    
    Run the script, specifying the application ID, secret, tenant ID, and key vault name.

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname [key vault name]
    ```

    The Kickstart script simplifies the process of deploying the data connector container by performing the following actions:

    - Updates the OS components.

    - Installs prerequisite software:
       - azure-cli
       - docker
       - jq
       - nc
       - curl

    - Prompts for configuration parameter values.

    - Configures the container.
    
    Note the Docker container name in the script output.

1. Configure the Docker container to start automatically:

    The sample code below assumes the name of the created container is `sapcon-a4h`.

    To view a list of the available containers use the command: `docker ps -a`.

    ```bash
    docker update --restart unless-stopped sapcon-a4h
    ```

# [Configuration file](#tab/config-file)

1. Download and run the Kickstart script by running the following commands:

    Download the script from the Microsoft Sentinel GitHub repository, and mark it executable.

    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```

    Run the script, specifying application ID, secret, tenant ID, keyvault name

    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode cfgf
    ```

    Kickstart script simplifies the process of deploying the data connector container by performing the following actions:
    - Updating the OS components
    - Install prerequisite software
       - curl
       - jq
       - netcat
       - azure-cli
       - docker
    - Prompt for configuration parameter values
    - Configure the container

---

## Deploy SAP data connector manually

1. Prepare a machine running a [supported](#prerequisites) version of the Operating System

1. Transfer [SDK](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#table-of-prerequisites) to the target machine

1. Install [Docker](https://www.docker.com/)

1. Create a folder to store container configuration and metadata, retreive sample systemconfig.ini file.

   ````bash
   sid=<SID>
   mkdir -p /opt/sapcon/$sid
   cd /opt/sapcon/$sid
   wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/template/systemconfig.ini 

   ````

   Replace <*SID*> with the name of the SAP instance

1. Edit the systemconfig.ini file, configure relevant settings. For more information on the available settings see [Continuous Threat Monitoring for SAP container configuration file reference](reference_systemconfig.md)

1. Retreive latest container image image and create a new container

   ````bash
   sid=<SID>
   docker pull mcr.microsoft.com/azure-sentinel/solutions/sapcon:latest
   docker create -d --restart unless-stopped -v /opt/sapcon/$sid/:/sapcon-app/sapcon/config/system --name sapcon-$sid sapcon   
   ````

   Replace <*SID*> with the name of the SAP instance

1. Copy SDK into the container

   ````bash
   sdkfile=<sdkfilename> 
   sid=<SID>
   docker cp $sdkfile sapcon-$sid:/sapcon-app/inst/
   ````

## Next steps

Once connector is deployed, proceed to deploy Continuous Threat Monitoring for SAP solution content
> [!div class="nextstepaction"]
> [Deploy SAP security content](deploy_sap_security_content.md)