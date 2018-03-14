---
title: Key Vault VM Extension for Windows | Microsoft Docs
description: Deploy an agent performing automatic refresh of Key Vault secrets on virtual machines using a virtual machine extension.
services: virtual-machines-windows
documentationcenter: ''
author: dragav
manager: jeconnoc 
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/14/2018
ms.author: dragosav

---
# Key Vault virtual machine extension for Windows

## Overview

The Key Vault VM extension provides automatic refresh of secrets stored in an Azure key vault. Specifically, the extension monitors a list of observed certificates stored in key vaults, and, upon detecting a change, retrieves, and installs the corresponding certificates. The Key Vault VM extension is published and supported by Microsoft, currently on Windows VMs, with Linux support to follow shortly. This document details the supported platforms, configurations, and deployment options for the Key Vault VM extension for Windows. 

## Prerequisites

The Key Vault VM extension depends on the Managed Service Identity VM extension, in order to authenticate itself to the Key Vault service. Please refer to the documentation for the MSI VM Extension for further details.

### Operating system

The Key Vault VM extension supports currently all Windows versions, with support for select Linux distributions and versions to follow up shortly.

| Distribution | Version |
|---|---|
| Windows | Core |

### Internet connectivity

The Key Vault VM extension for Windows requires that the target virtual machine is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Key Vault VM extension. The extension does not require protected settings - all its settings are considered information without security impact. The extension requires a list of monitored secrets, polling frequency, and the destination certificate store. Specifically:  

```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KVVMExtensionForWindows",
      "apiVersion": "2016-10-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
			"publisher": "Microsoft.Azure.KeyVault.Edp",
			"type": "KeyVaultForWindows",
			"typeHandlerVersion": "0.0",
			"autoUpgradeMinorVersion": true,
			"settings": {
				"secretsManagementSettings": {
					"pollingIntervalInS": <polling interval in seconds>,
					"certificateStoreName": <certificate store name, e.g.: "MY">,
					"certificateStoreLocation": <certificate store location, e.g.: "LOCAL_MACHINE">,
					"observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: "https://myvault.vault.azure.net:443/secrets/mycertificate"
				}		  
			}
      }
    }
```

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2016-10-01 | date |
| publisher | Microsoft.Azure.KeyVault.Edp | string |
| type | KeyVaultForWindows | string |
| typeHandlerVersion | 0.0 | int |
| pollingIntervalInS | 3600 | int |
| certificateStoreName | MY | string |
| certificateStoreLocation  | LOCAL_MACHINE | string |
| observedCertificates  | ["https://myvault.vault.azure.net:443/secrets/mycertificate"] | string array


## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment refresh of certificates. The extension can be deployed to individual VMs or VM scale sets. The schema and configuration are common to both template types. 

The JSON configuration for a virtual machine extension must be nested inside the virtual machine resource fragment of the template, specifically `"resources": []` object of the virtual machine.

```json
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "KVVMExtensionForWindows",
      "apiVersion": "2016-10-01",
      "location": "<location>",
      "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
      ],
      "properties": {
			"publisher": "Microsoft.Azure.KeyVault.Edp",
			"type": "KeyVaultForWindows",
			"typeHandlerVersion": "0.0",
			"autoUpgradeMinorVersion": true,
			"settings": {
				"secretsManagementSettings": {
					"pollingIntervalInS": <polling interval in seconds>,
					"certificateStoreName": <certificate store name, e.g.: "MY">,
					"certificateStoreLocation": <certificate store location, e.g.: "LOCAL_MACHINE">,
					"observedCertificates": <list of KeyVault URIs representing monitored certificates, e.g.: "https://myvault.vault.azure.net:443/secrets/mycertificate"
				}		  
			}
      }
    }
```

## Azure PowerShell deployment

The Azure PowerShell can be used to deploy the Key Vault VM extension to an existing virtual machine or virtual machine scale set. 

* To deploy the extension on a VM:
    
    ```powershell
        # Build settings
        $settings = '{"secretsManagementSettings": 
    		{ "pollingIntervalInS": "' + <pollingInterval> + 
    		'", "certificateStoreName": "' + <certStoreName> + 
    		'", "certificateStoreLocation": "' + <certStoreLoc> + 
    		'", "observedCertificates": ["' + <observedCerts> + '"] } }'
        $extName = <VMName> + '/KeyVaultForWindows' 
        $extPublisher = "Microsoft.Azure.KeyVault.Edp"
        $extType = "KeyVaultForWindows"
    
        # Start the deployment
        Set-AzureRmVmExtension -VMName <VMName> -Name $extName -Publisher $extPublisher -Type $extType -SettingString $settings
    
    ```

* To deploy the extension on a VM scale set, for instance as part of a Service Fabric cluster:

    ```powershell
    
        # Build settings
        $settings = '{"secretsManagementSettings": 
    		{ "pollingIntervalInS": "' + <pollingInterval> + 
    		'", "certificateStoreName": "' + <certStoreName> + 
    		'", "certificateStoreLocation": "' + <certStoreLoc> + 
    		'", "observedCertificates": ["' + <observedCerts> + '"] } }'
        $extName = <VMSSName> + '_KeyVaultForWindows' 
        $extPublisher = "Microsoft.Azure.KeyVault.Edp"
        $extType = "KeyVaultForWindows"
    
        # Start the deployment
        Add-AzureRmVmssExtension -VirtualMachineScaleSet <VMSS> -Name $extName -Publisher $extPublisher -Type $extType -Setting $settings
    
    ```

Please be aware of the following restrictions/requirements:
- The deployment must be done in the South Central US region
- Key Vault restrictions:
	- It must exist at the time of the deployment 
	- Must be located in the same region and resource group as the deployment
	- Must be enabled for deployment and template deployment

## Azure CLI deployment

Samples for deploying the Key Vault VM extension in Azure CLI will be available shortly. 

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure PowerShell. To see the deployment state of extensions for a given VM, run the following command using the Azure PowerShell.

```powershell
Get-AzureRMVMExtension -VMName <vmName> -ResourceGroupname <resource group name>
```

Extension execution output is logged to the following file:

```
%windrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.KeyVault.Edp.KeyVaultForWindows\<version>\akvvm_service_<date>.log
```


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
