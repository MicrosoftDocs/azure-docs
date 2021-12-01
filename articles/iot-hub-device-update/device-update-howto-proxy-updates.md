---
title: Device Update for Azure IoT Hub tutorial using the Device Update binary agent| Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Device Update binary agent for Proxy Updates.
author: valls
ms.author: valls
ms.date: 11/12/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Device Update binary agent for Proxy Updates

## How To Import Example Updates

> Tip: perform these steps on machine that supports Power Shell

### Import Example Updates using PowerShell scritps

#### Install and Import ADU PowerShell Modules

- Install PowerShellGet [see details here](https://docs.microsoft.com/en-us/powershell/scripting/gallery/installing-psget?view=powershell-7.1)

```ps
Install-PackageProvider -Name NuGet -Force

[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

Install-Module -Name PowerShellGet -Force -AllowClobber

Update-Module -Name PowerShellGet

```

- Install Azure Az PowerShell Modules

```ps

Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

```

- Create storage account
- Get container for updates storage

**For example**

```ps

Import-Module .\AduAzStorageBlobHelper.psm1
Import-Module .\AduImportUpdate.psm1

$AzureSubscriptionId = '<YOUR SUBSCRIPTION ID>'
$AzureResourceGroupName = '<YOUR RESOURCE GROUP NAME>'
$AzureStorageAccountName = '<YOUR STORAGE ACCOUNT>'
$AzureBlobContainerName =  '<YOUR BLOB CONTAINER NAME>'

$container = Get-AduAzBlobContainer  -SubscriptionId $AzureSubscriptionId -ResourceGroupName $AzureResourceGroupName -StorageAccountName $AzureStorageAccountName -ContainerName $AzureBlobContainerName

```

- Get REST API token

```ps
Install-Module MSAL.PS

$AzureAdClientId = '<AZURE AD CLIENT ID>'

$AzureAdTenantId = '<AZURE AD TENANT ID>'

$token = Get-MsalToken -ClientId $AzureAdClientId -TenantId $AzureAdTenantId -Scopes 'https://api.adu.microsoft.com/user_impersonation' -Authority https://login.microsoftonline.com/$AzureAdTenantId/v2.0 
```

#### Import Example Updates

Go to `sample-updates` directory, then run following commands to import **all** updates.  
Note that you can choose to import only updates you want to try.

```ps

./ImportSampleMSOEUpdate-1.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

./ImportSampleMSOEUpdate-2.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

./ImportSampleMSOEUpdate-3.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

./ImportSampleMSOEUpdate-4.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

./ImportSampleMSOEUpdate-5.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

./ImportSampleMSOEUpdate-10.x.ps1 -AccountEndpoint intmoduleidtest.api.int.adu.microsoft.com -InstanceId intModuleIdTestInstance -BlobContainer $container -AuthorizationToken $token.AccessToken -Verbose

```

## Setup Test Device

### Prerequisites

- Ubuntu 18.04 LTS Server VM

### Install the Device Update Agent and Dependencies

- Register packages.microsoft.com in APT package repository

```sh
curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ~/microsoft-prod.list

sudo cp ~/microsoft-prod.list /etc/apt/sources.list.d/

curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > ~/microsoft.gpg

sudo cp ~/microsoft.gpg /etc/apt/trusted.gpg.d/

sudo apt-get update
```

- Install test **deviceupdat-agent-[version].deb** package on the test device.  
e.g.

  ```sh
  sudo apt-get install ./deviceupdate-agent-0.8.0-publc-preview-refresh.deb
  ```

Note: this will automatically install the delivery-optimization-agent package from packages.micrsofot.com

- Specify a connection string in /etc/adu/du-config.json
- Ensure that /ect/adu/du-diagnostics-config.json contain correct settings.  
  e.g.  

```sh
{
  "logComponents":[
    {
      "componentName":"adu",
      "logPath":"/var/log/adu/"
    },
    {
      "componentName":"do",
      "logPath":"/var/log/deliveryoptimization-agent/"
    }
  ],
  "maxKilobytesToUploadPerLogPath":50
}
```

- Restart `adu-agent` service

```sh
sudo systemctl restart adu-agent
```

### Setup Mock Components

For testing and demonstration purposes, we'll be creating following mock components on the device:

- 3 motors
- 2 cameras
- hostfs
- rootfs

**IMPORTANT**  
This components configuration depends on the implementation of an example Component Enuerator extension called libcontoso-component-enumerator.so, which required a mock component inventory data file `/usr/local/contoso-devices/components-inventory.json`

> Tip: you can copy [`demo`](https://github.com/Azure/adu-private-preview/tree/user/wewilair/v0.8.0-docs/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo) folder to your home directory on the test VM an run `~/demo/tools/reset-demo-components.sh` to copy required files to the right locations.

#### Add /usr/local/contoso-devices/components-inventory.json

- Copy [components-inventory.json](./demo-devices/contoso-devices/components-inventory.json) to **/usr/local/contoso-devices** folder
  
#### Register Contoso Components Enumerator extension

- Copy [libcontoso-component-enumerator.so](./sample-components-enumerator/libcontoso-component-enumerator.so) to /var/lib/adu/extensions/sources folder
- Register the extension

```sh
sudo /usr/bin/AducIotAgent -E /var/lib/adu/extensions/sources/libcontoso-component-enumerator.so
```

#### 

**Congratulations!** Your VM should now support Proxy Updates!

 
