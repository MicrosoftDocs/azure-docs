---
title: Application deployment using MAppsCli in AVE
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Quickstart: Application deployment using MAppsCli in AVE

The MAppsCli toolset is used to orchestrate the deployment of remote app packages. This document shows you how to run the MAppsCli within a product virtual enclave.

# Deployment Setup

## Prerequisites

The most common use case for the MAppsCli is to deploy remote app packages which can be accessed from an AVD common desktop. Before you can start using the MAppsCli, you'll need to make sure your enclave has the following.

- Connection to an Active Directory (AD) domain
- Connection to Azure Virtual Desktop (AVD)

## Deploy necessary Azure resources

Before using the MAppsCli, the following resources need to be deployed.

1. New or existing [Community](docs/How%20To%20Guides/Create-a-Community-in-the-Azure-portal)
2. [Enclave](docs/How%20To%20Guides/Create-an-Enclave-in-the-Azure-Portal) for the Community
3. [Workload](docs/How%20To%20Guides/Create-a-Workload-in-the-Azure-Portal) for the Enclave
4. [Storage Account](/docs/How%20To%20Guides/Service%20Catalog/Deploy-a-Storage-Account-from-the-Service-Catalog-into-a-Workload)
    - Setup with **public network access**
    - This will contain artifacts needed to run the MAppsCli
5. Enclave Connection
    - This will connect the CIDR range for the Enclave virtual network's `AzureVirtualEnclaveSubnet` subnet to an Enclave Endpoint with connectivity to AD endpoints. For example: `contoso4-identity-enclave-ep`.

> [!NOTE] This assumes that the target Enclave is in the same Community as the Enclave with access to AD resources, such as: `contoso4-identity`. Otherwise, you'll have to also create a Community Connection.

[Top](#application-deployment-using-mappscli-in-ave)

## Download and install artifacts for MAppsCli

The MAppsCli has the following dependencies.

| Name | Lowside Link | Aztoolbox Link |
| :- | :-: | :-: |
| AzCopy | https://aka.ms/downloadazcopy-v10-windows | ht<span>tps://</span>ms.portal.azure.<domain>/?Microsoft_Azure_Toolbox=true#view/Microsoft_Azure_Toolbox/Overview.ReactView/toolPublisher/Microsoft/toolName/AzCopy/toolVersion/10.17.0 |
| Azure CLI | https://aka.ms/installazurecliwindowsx64 | ht<span>tps://</span>ms.portal.azure.<domain>/?Microsoft_Azure_Toolbox=true#view/Microsoft_Azure_Toolbox/Overview.ReactView/toolPublisher/Microsoft/toolName/AzureCLI/toolVersion/2.58.0 |
| Az PowerShell | https://github.com/Azure/azure-powershell/releases/download/v11.5.0-April2024/Az-Cmdlets-11.5.0.38451-x64.msi | ht<span>tps://</span>ms.portal.azure.<domain>/?Microsoft_Azure_Toolbox=true#view/Microsoft_Azure_Toolbox/Overview.ReactView/toolPublisher/Microsoft/toolName/AzPowerShell/toolVersion/11.4.0 |
| Bicep CLI | https://github.com/Azure/bicep/releases/tag/v0.20.4 | ht<span>tps://</span>ms.portal.azure.<domain>/?Microsoft_Azure_Toolbox=true#view/Microsoft_Azure_Toolbox/Overview.ReactView/toolPublisher/Microsoft/toolName/BicepCLI/toolVersion/0.22.6 |
| PowerShell 7 | https://github.com/PowerShell/PowerShell/releases/tag/v7.2.5 | N/A |

For downloading other dependencies from Azure Toolbox, a user can go to the Azure Toolbox page directly by entering the following shortcuts for the specified environment. 

| Environment | Endpoint Url |
| :- | :-: |
| Commercial/Public | https://aka.ms/aztoolbox |
| US Sec | https://aka.microsoft.scloud/aztoolbox |
| US Nat | https://aka.eaglex.ic.gov/aztoolbox |


Follow the steps below from a VM within an Enclave, such as a Management VM, before running the MappsCli.

1. Upload the artifacts to the Storage Account you deployed
2. Download the artifacts from the Storage Account
3. Download the MAppsCli installer

[Top](#application-deployment-using-mappscli-in-ave)

## Azure networking requirements

The most common use scenario for the MAppsCli is to deploy remote applications to an AD domain so that it can be accessed from an AVD desktop. Because of these dependencies, additional configuration must be performed after creating an enclave connection.

### Configure the enclave virtual network security groups

From the Enclave you created, go to its virtual network which can be accessed from your Enclave's management resource group. From there go to the Security Group corresponding to the `AzureVirtualEnclaveSubnet` subnet.

#### Add the following inbound security rules

| Source | Source service tag | Source port ranges | Destination | Destination IP/CIDR ranges | Service | Destination port ranges | Protocol | Action | Priority | Name |
| :- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| Service Tag | WindowsVirtualDesktop | * | IP Addresses | 10.0.30.0/23 | Custom | * | Any | Allow | 100 | AllowWVDtoEnclaveSubnetInbound |

#### Add the following outbound security rules

| Source | Source service tag | Source port ranges | Destination | Destination IP/CIDR ranges | Service | Destination port ranges | Protocol | Action | Priority | Name |
| :- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| IP Addresses | 10.0.30.0/23 | * | Service Tag | Storage.NorthCentralUS (or other location such as Storage.EastUS) | HTTPS | 443 | TCP | Allow | 100 | AllowCidrBlockHTTPSOutboundToStorage |
| IP Addresses | 10.0.30.0/23 | * | Service Tag | Internet | Custom | * | Any | Allow | 200 | AllowCidrBlockCustom8080Outbound |
| IP Addresses | 10.0.30.0/23 | * | IP Addresses | 10.0.10.0/23 | Custom | 80,443 | TCP | Allow | 1006 | mappscli-test-to-Desktop |
| IP Addresses | 10.0.30.0/23 | * | IP Addresses | 10.0.4.0/23 | Custom | 443,445,5061,8057,8120,9110,9120,48000-50999 | TCP | Allow | 1007 | mappscli-test-to-Collab |
| IP Addresses | 10.0.30.0/23 | * | IP Addresses | 10.0.4.0/23 | Custom | 3478,48000-50999 | UDP | Allow | 1008 | mappscli-test-to-Collab-UDP |

### Configure the enclave virtual network DNS servers

Follow the steps below to configure the DNS servers for your Enclave virtual network.

1. From the virtual network, open **Settings**, then select **DNS servers**.
2. Check that **DNS servers** is set to **Custom**.
3. Add the following IP Addresses: `10.0.2.4` and `10.0.2.5`.
4. Remove the following IP address if it exists: `168.63.129.16`.

> [!NOTE] IP Address 168.63.129.16 is a virtual public IP address that facilitates communications to Azure platform services. To learn more, see [What is IP address 168.63.129.16](https://learn.microsoft.com/en-us/azure/virtual-network/what-is-ip-address-168-63-129-16).

[Top](#application-deployment-using-mappscli-in-ave)

## Azure access control requirements

The MAppsCli uses AzCopy in the background to transfer files to and from a Storage Account. The following roles need to be added to the target Storage Account.

> [!IMPORTANT] You will need Owner permissions in the subscription to add roles to a Storage Account in an Azure Virtual Enclave.

- **Storage Blob Data Contributor** for an AAD user/group
  - Required when running `mappscli catalog upload` to upload files to the Storage Account.
- **Storage Blob Data Reader** for a Managed Identity
  - Required if you are using a User Assigned Managed Identity when running `mappscli package deploy`.

[Top](#application-deployment-using-mappscli-in-ave)

## Additional app package deployment considerations

### Parameter configuration for an app package from mapps-package-examples

Assuming that you are using an app package from the [mapps-package-examples](https://msazure.visualstudio.com/Project%20Honeycomb/_git/mapps-package-examples) repo, you will need to make sure certain parameters are defined for the MAppsCli to work properly.

Check for the following in the app package's `parameters.json` and `metadata.json`.

- Make sure the KeyVault resource contains secrets for the domain admin credentials.
- Set the `enclave.subnetName` parameter to: **AzureVirtualEnclaveSubnet**.
- Add a value for the `vms.<appName>.artifactDownloadDirectory` parameter.
  - This is to that the downloaded application artifacts stay persistent in the app VM during the deployment process.
  - Can be set to value like: `C:\\Temp`.

### Additional dependencies for MAppsCli package deploy

- When running `mappscli package deploy`, the VM's location will be the same as the enclave that it is in, regardless of whether there is an `enclave.Location` override in the app package's `parameters.json`.
- It is recommended to set the `enclave.Location` parameter in the app package's `parameters.json` to the same location as the enclave where the VM is in. This is because the deployed Host Pool resource has to be in the same location as the deployed VM.
- Make sure that a Workspace resource is deployed to the resource group specified in the app package's `parameters.json`.

> [!NOTE] The current version of the app package in the [mapps-package-examples](https://msazure.visualstudio.com/Project%20Honeycomb/_git/mapps-package-examples) repo did not include functionality for creating a Workspace if one doesn't exist. This is not so much on the MAppsCli as it is on the individual app package. A Workspace can be created either manually or by adding a few lines of PowerShell code to the target app package.

[Top](#application-deployment-using-mappscli-in-ave)

## Running the MAppsCli from a VM in an enclave

Once the dependencies have been met, you can run the MAppsCli from a VM that is connected to an Enclave, such as a management VM, with PowerShell.

```powershell
# Setup MAppsCli configuration
mappscli config add-blob-catalog 'remoteBlob' 'https://somesa.blob.core.windows.net/someContainer'
mappscli config set-catalog 'remoteBlob'
mappscli config add-lfs-catalog 'lfs' 'C:\some-path\packages\'
mappscli config set-local-storage-path 'C:\some-path\packages\'

# Setup artifacts
azcopy login --tenant-id 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
Connect-AzAccount -Tenant 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -UseDeviceAuthentication
```

Assuming the the app packages from the [mapps-package-examples](https://msazure.visualstudio.com/Project%20Honeycomb/_git/mapps-package-examples) repo are downloaded to the VM, bundle and upload the app package to a Storage Account. Make sure the app package contains the following before uploading to the Storage Account.

- Checksum `<appPackage>.checksum.txt` file
- Compressed `<appPackage>.zip` file containing code for the app package
- `parameters.json`
- `metadata.json`

```powershell
mappscli local bundle 'C:\some-path\appPackage\' 'C:\some-path\bundle\'
mappscli local validate 'C:\some-path\bundle\appPackage\'
mappscli catalog upload 'appPackage' 'C:\some-path\bundle\appPackage\'
```

Once there is an app package in a Storage Account, download the app package and run the MAppsCli package deployment from a VM with PowerShell.

> [!NOTE] The `-sepu` or `--set-execution-policy-unrestricted` flag is used to set the execution policy of the **Process** scope to **Unrestricted** for the duration of the package deploy. For more information, you can run `mappscli package deploy --help`.

```powershell
mappscli catalog get 'appPackage'
mappscli package deploy 'appPackage' -sepu
```

[Top](#application-deployment-using-mappscli-in-ave)

## Troubleshooting

### Domain join is not working

From the VM where you are running MAppsCli, run the following on the domain controller (DC). For example: `contoso4-dc1.contoso4.com`. Check to see that it returns the private IP address of the DC. If it returns a different IP address, you'll have to look at your enclave's virtual network DNS server configuration. For more information, see [Configure the enclave virtual network DNS servers](#configure-the-enclave-virtual-network-dns-servers).

  ```powershell
  nslookup '<domain controller name>'
  ```

After verifying the previous step, run the following from the app VM that is deployed to determine connectivity to the domain controller. In the example below, we are testing connectivity with port 389, which is for the Lightweight Directory Access Protocol (LDAP), used by AD.

  ```powershell
  Test-NetConnection -ComputerName '<domain controller name>' -Port 389
  ```

[Top](#application-deployment-using-mappscli-in-ave)
