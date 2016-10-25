<properties
   pageTitle="Automating Application Deployment with Virtual Machine Extensions | Microsoft Azure"
   description="Azure Virtual Machine DotNet Core Tutorial"
   services="virtual-machines-windows"
   documentationCenter="virtual-machines"
   authors="neilpeterson"
   manager="timlt"
   editor="tysonn"
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="10/21/2016"
   ms.author="nepeters"/>

# Application deployment with Azure Resource Manager templates

Once all Azure infrastructural requirements have been identified and translated into a deployment template, the actual application deployment needs to be addressed. Application deployment here is referring to installing the actual application binaries onto Azure resources. For the Music Store sample, .Net Core and IIS need to be installed and configured on each virtual machine. The Music Store binaries need to be installed onto the virtual machine, and the Music Store database pre-created.

This document details how Virtual Machine extensions can automate application deployment and configuration to Azure virtual machines. All dependencies and unique configurations are highlighted. For the best experience, pre-deploy an instance of the solution to your Azure subscription and work along with the Azure Resource Manager template. The complete template can be found here – [Music Store Deployment on Windows](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-Windows).

## Configuration script

Virtual Machine extensions are specialized programs that execute against virtual machines to provide configuration automation. Extensions are available for many specific purposes such as anti-virus, logging configuration, and Docker configuration. The Custom Script extension can be used to run any script against a virtual machine. With the Music Store sample, it is up to the custom script extension to configure the Windows virtual machines and install the Music Store application.

Before detailing how virtual machine extensions are declared in an Azure Resource Manager template, examine the script that is run. This script configures the Windows virtual machine to host the Music Store application. When run, the script installs all needed software, install the Music store application from source control, and prepare the database. 

> This sample is for demonstration purposes.

```none
Param (
    [string]$user,
    [string]$password,
    [string]$sqlserver
)

# firewall
netsh advfirewall firewall add rule name="http" dir=in action=allow protocol=TCP localport=80

# folders
New-Item -ItemType Directory c:\temp
New-Item -ItemType Directory c:\music

# install iis
Install-WindowsFeature web-server -IncludeManagementTools

# install dot.net core sdk
Invoke-WebRequest http://go.microsoft.com/fwlink/?LinkID=615460 -outfile c:\temp\vc_redistx64.exe
Start-Process c:\temp\vc_redistx64.exe -ArgumentList '/quiet' -Wait
Invoke-WebRequest https://go.microsoft.com/fwlink/?LinkID=809122 -outfile c:\temp\DotNetCore.1.0.0-SDK.Preview2-x64.exe
Start-Process c:\temp\DotNetCore.1.0.0-SDK.Preview2-x64.exe -ArgumentList '/quiet' -Wait
Invoke-WebRequest https://go.microsoft.com/fwlink/?LinkId=817246 -outfile c:\temp\DotNetCore.WindowsHosting.exe
Start-Process c:\temp\DotNetCore.WindowsHosting.exe -ArgumentList '/quiet' -Wait

# download / config music app
Invoke-WebRequest  https://github.com/Microsoft/dotnet-core-sample-templates/raw/master/dotnet-core-music-windows/music-app/music-store-azure-demo-pub.zip -OutFile c:\temp\musicstore.zip
Expand-Archive C:\temp\musicstore.zip c:\music
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replaceserver>", $sqlserver } | Set-Content C:\music\config.json
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replaceuser>", $user } | Set-Content C:\music\config.json
(Get-Content C:\music\config.json) | ForEach-Object { $_ -replace "<replacepass>", $password } | Set-Content C:\music\config.json

# workaround for db creation bug
Start-Process 'C:\Program Files\dotnet\dotnet.exe' -ArgumentList 'c:\music\MusicStore.dll'

# configure iis
Remove-WebSite -Name "Default Web Site"
Set-ItemProperty IIS:\AppPools\DefaultAppPool\ managedRuntimeVersion ""
New-Website -Name "MusicStore" -Port 80 -PhysicalPath C:\music\ -ApplicationPool DefaultAppPool
& iisreset
```

## VM Script Extension

VM Extensions can be run against a virtual machine at build time by including the extension resource in the Azure Resource Manager template. The extension can be added with the Visual Studio Add Resource wizard, or by inserting valid JSON into the template. The Script Extension resource is nested inside the Virtual Machine resource; this can be seen in the following example.

Follow this link to see the JSON sample within the Resource Manager template – [VM Script Extension](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L339). 

Notice in the below JSON that the script is stored in GitHub. This script could also be stored in Azure Blob storage. Also, Azure Resource Manager templates allow the script execution string to be constructed such that template parameters values can be used as parameters for script execution. In this case data is provided when deploying the templates, and these values can then be used when executing the script.

```none
{
  "apiVersion": "2015-06-15",
  "type": "extensions",
  "name": "config-app",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
    "[variables('musicstoresqlName')]"
  ],
  "tags": {
    "displayName": "config-app"
  },
  "properties": {
    "publisher": "Microsoft.Compute",
    "type": "CustomScriptExtension",
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-windows/scripts/configure-music-app.ps1"
      ]
    },
    "protectedSettings": {
      "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -File configure-music-app.ps1 -user ',parameters('adminUsername'),' -password ',parameters('adminPassword'),' -sqlserver ',variables('musicstoresqlName'),'.database.windows.net')]"
    }
  }
}
```

For more information on using the custom script extension, see [Custom script extensions with Resource Manager templates](./virtual-machines-windows-extensions-customscript.md).

## Next Step

<hr>

[Explore More Azure Resource Manager Templates](https://github.com/Azure/azure-quickstart-templates)
