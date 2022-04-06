---
title: Deploy and configure the data connector agent container | Microsoft Docs
description: Deploy and configure the data connector agent container
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 2/01/2022
---

# Deploy and configure the data connector agent container


[!INCLUDE [Banner for top of topics](../includes/banner.md)]

The following article provides guidance on how to create a user account for use by SAP data connector and assign it to necessary role.

> [!IMPORTANT]
> The Microsoft Sentinel SAP solution is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Deployment milestones
Deployment of the SAP continuous threat monitoring solution is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment by deploying SAP CRs, configure Authorization and create user](preparing-sap.md)

1. **Deploy and configure the data connector agent container (*You are here*)**

1. [Deploy SAP security content](deploy_sap_security_content.md)

1. Optional deployment steps
   - [Configure auditing](configure_audit.md)
   - [Configure SAP data connector to use SNC](configure_snc.md)


## Data connector agent deployment overview
Data connector agent container should run on a VM running Linux, hosted either on-premises or in the cloud.
Data connector agent can store configuration in Azure Key vault, in a configuration file, or in environment variables.

Depending on the scenario, different configuration instructions have to be followed.

When configuration is stored in Azure Key Vault, depending on the host VM placement, configuration will differ:<br>
   - A container running on the host in Azure can leverage Managed identity to seamlessly access Azure Key vault
More information on managed identity can be found here: [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md)
   - A container running on-premise, in a 3rd party cloud environment, or in Azure (but does not utilize Managed Identity) can authenticate to Azure KeyVault using a service principal. More information on service principals can be found here: [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md)

### Prerequisites
To deploy Data connector agent, a host running Linux must be deployed.
Deployment of data connector container through a kickstart script supports **Ubuntu version 18.04 or higher**, **SLES version 15 or higher**, or **RHEL version 7.7 or higher**
In case of a different Operating system, deploy and configure the container manually. For more information on manual configuration see [Manual deployment of data connector agent](#manual-sap-data-connector-deployment)
Azure CLI is used in this step-by-step guide. For more information on how to deploy Azure CLI see [How to install the Azure CLI](/cli/azure/install-azure-cli)

## Deployment of data connector agent running on an Azure VM using Azure Keyvault for secret storage

### Recommended virtual machine sizing

The following table describes the recommended sizing for your virtual machine, depending on your intended usage:
In general, at least 2 cores and at least 4 GB of memory is recommended for the VM acting as host for the data connector agent container

|Usage  |Recommended sizing  |
|---------|---------|
|**Minimum specification**, such as for a lab environment | A *Standard_B2s* VM |
|**Standard connector** (default) | A *Standard_D2as_v5* or *Standard_D2_v5*, 2VM, with: <br>- 2 cores<br>- 8-GB memory |
|**Multiple connectors** |A A *Standard_D4as_v5* or *Standard_D4_v5* VM, with: <br>- 4 cores<br>- 16-GB memory |
| | |

### Agent deployment steps
1. Create a VM in Azure
Sample command to create a Virtual machine:
    ```azurecli
    az vm create --resource-group [resource group name] --name [VM Name] --image Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest --admin-username azureuser --public-ip-address "" --size  Standard_D2as_v5 --generate-ssh-keys --assign-identity
    ```
    Resource creation will complete with output similar to the following:
    ```
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
    Note the **systemAssignedIdentity** GUID as it will be used in the next step
    For more information, see [Quickstart: Create a Linux virtual machine with the Azure CLI](../../virtual-machines/linux/quick-create-cli.md).

    > [!IMPORTANT]
    > After VM creation completes, be sure to apply any security requirements and hardening procedures applicable in your organization
    >

1. Create a key vault

    If an an existing Key vault will be used, locate Key vault name and resource group name
    ```azurecli
    kvgp=<KVResourceGroup>
    kvname=<keyvaultname>

    #Create a key vault
    az keyvault create \
      --name $kvname \
      --resource-group $kvgp
    ```
1. Assign access policy to the VM identity

    ```azurecli
    az keyvault set-policy -n [key vault name] -g [key vault resource group] --object-id [vm system assigned identity] --secret-permissions get list set
    ```
1. Logon to the newly created machine and configure data disk to be mounted at docker root directory
1. Download and execute the deployment kickstart script

   Kickstart script simplifies the process of deploying the data connector container by performing the following actions:
   1. Updating the OS components
   1. Install prerequisite software
      - azure-cli
      - docker
   1. Prompt for configuration parameter values
   1. Configure the container

   ```bash
   wget -O sapcon-sentinel-kickstart.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh && bash ./sapcon-sentinel-kickstart.sh
   ```
   Note the docker container name in the script output
1. Configure the docker container to automatically startup
Below sample assumes the name of the created container is `sapcon-a4h`.
To view list of available container use `docker ps -a` command
    ```bash
    docker update --restart unless-stopped sapcon-a4h
    ```

## Deployment of Microsoft Sentinel continuous protection for SAP data connector using Enterprise application identity for secrets storage in Key Vault

1. Create an enterprise application

    Run the following command to create an enterprise application

    ```azurecli
    az ad sp create-for-rbac
    ```
    Command output will be similar to the following:
    ```
    {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "azure-cli-2022-01-28-17-59-06",
      "password": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      "tenant": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    }
    ```
    Note the appId provided
1. Assign enterprise applications access policy to allow listing, reading, writing secrets from the keyvault<Br>
Run the following command, replacing *[key vault name]*, *[key vault resource group]*, *[appid]* with names of key vault, resource group and the appId of the enterprise application retreived in the previous step
    ```azurecli
    az keyvault set-policy -n [key vault name] -g [key vault resource group] --spn [appid] --secret-permissions get list set
    ```
    Sample:
    ```azurecli
    az keyvault set-policy -n sentinelkeyvault -g sentinelresourcegroup --application-id aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --secret-permissions get list set
    ```
1. Download and run the kickstart script<br>
Download the script for github repository and mark it executable
    ```bash
    wget https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-kickstart.sh
    chmod +x ./sapcon-sentinel-kickstart.sh
    ```
    Run the script, specifying application ID, secret, tenant ID, keyvault name
    ```bash
    ./sapcon-sentinel-kickstart.sh --keymode kvsi --appid aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa --appsecret zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz -tenantid bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb -kvaultname [key vault name]
    ```
    Kickstart script simplifies the process of deploying the data connector container by performing the following actions:
    - Updating the OS components
    - Install prerequisite software
       - azure-cli
       - docker
       - jq
       - nc
       - curl
    - Prompt for configuration parameter values
    - Configure the container
    
    Note the docker container name in the script output
1. Configure the docker container to automatically startup<br>
Below sample assumes the name of the created container is `sapcon-a4h`.
To view list of available container use `docker ps -a` command
    ```bash
    docker update --restart unless-stopped sapcon-a4h
    ```

## Deployment of Microsoft Sentinel continuous protection for SAP data connector using configuration file for secrets storage

1. Download and run the kickstart script
Download the script for github repository and mark it executable
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

## Manual SAP data connector deployment
1. Prepare a machine running a [supported](#prerequisites) version of the Operating System
1. Transfer [SDK](prerequisites-for-deploying-sap-continuous-threat-monitoring.md#table-of-prerequisites) to the target machine
1. Install [docker](https://www.docker.com/)
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