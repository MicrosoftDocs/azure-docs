---
title: Automating Application Deployment with Virtual Machine Extensions | Microsoft Docs
description: Azure Virtual Machine DotNet Core Tutorial
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 9fc8b1ba-60f5-410b-8190-9f1ff885e50e
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/21/2016
ms.author: nepeters
ms.custom: H1Hack27Feb2017

---
# Application deployment with Azure Resource Manager templates for Linux VMs

Once all Azure infrastructural requirements have been identified and translated into a deployment template, the actual application deployment needs to be addressed. Application deployment here is referring to installing the actual application binaries onto Azure resources. For the Music Store sample, .Net Core, NGINX, and Supervisor need to be installed and configured on each virtual machine. The Music Store binaries need to be installed onto the virtual machine, and the Music Store database pre-created.

This document details how Virtual Machine extensions can automate application deployment and configuration to Azure virtual machines. All dependencies and unique configurations are highlighted. For the best experience, pre-deploy an instance of the solution to your Azure subscription and work along with the Azure Resource Manager template. The complete template can be found here – [Music Store Deployment on Ubuntu](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-linux).

## Configuration script
Virtual Machine extensions are specialized programs that execute against virtual machines to provide configuration automation. Extensions are available for many specific purposes such as anti-virus, logging configuration, and Docker configuration. A custom script extension can be used to run any script against a virtual machine. With the Music Store sample, it is up to the custom script extension to configure the Ubuntu virtual machines and install the Music Store application. 

Before detailing how virtual machine extensions are declared in an Azure Resource Manager template, examine the script that is run. This script configures the Ubuntu virtual machine to host the Music Store application. When run, the script installs all needed software, install the Music store application from source control, and prepare the database. 

To learn more about hosting a .Net Core application on Linux, see [Publish to a Linux production environment](https://docs.asp.net/en/latest/publishing/linuxproduction.html).

> This sample is for demonstration purposes.
> 
> 

```bash
#!/bin/bash

# install dotnet core
sudo sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/dotnet-release/ trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-key adv --keyserver apt-mo.trafficmanager.net --recv-keys 417A0893
sudo apt-get update
sudo apt-get install -y dotnet-dev-1.0.0-preview2-003121

# download application
sudo wget https://raw.github.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/music-app/music-store-azure-demo-pub.tar /
sudo mkdir /opt/music
sudo tar -xf music-store-azure-demo-pub.tar -C /opt/music

# install nginx, update config file
sudo apt-get install -y nginx
sudo service nginx start
sudo touch /etc/nginx/sites-available/default
sudo wget https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/music-app/nginx-config/default -O /etc/nginx/sites-available/default
sudo cp /opt/music/nginx-config/default /etc/nginx/sites-available/
sudo nginx -s reload

# update and secure music config file
sed -i "s/<replaceserver>/$1/g" /opt/music/config.json
sed -i "s/<replaceuser>/$2/g" /opt/music/config.json
sed -i "s/<replacepass>/$3/g" /opt/music/config.json
sudo chown $2 /opt/music/config.json
sudo chmod 0400 /opt/music/config.json

# config supervisor
sudo apt-get install -y supervisor
sudo touch /etc/supervisor/conf.d/music.conf
sudo wget https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/music-app/supervisor/music.conf -O /etc/supervisor/conf.d/music.conf
sudo service supervisor stop
sudo service supervisor start

# pre-create music store database
/usr/bin/dotnet /opt/music/MusicStore.dll &
```

## VM Script Extension
VM Extensions can be run against a virtual machine at build time by including the extension resource in the Azure Resource Manager template. The extension can be added with the Visual Studio Add Resource wizard, or by inserting valid JSON into the template. The Script Extension resource is nested inside the Virtual Machine resource; this can be seen in the following example.

Follow this link to see the JSON sample within the Resource Manager template – [VM Script Extension](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-linux/azuredeploy.json#L359). 

Notice in the below JSON that the script is stored in GitHub. This script could also be stored in Azure Blob storage. Also, Azure Resource Manager templates allow the script execution string to constructed such that template parameters values can be used as parameters for script execution. In this case data is provided when deploying the templates, and these values can then be used when executing the script.

```json
{
  "apiVersion": "2015-06-15",
  "type": "extensions",
  "name": "config-app",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', concat(variables('vmName'),copyindex()))]"
  ],
  "tags": {
    "displayName": "config-app"
  },
  "properties": {
    "publisher": "Microsoft.Azure.Extensions",
    "type": "CustomScript",
    "typeHandlerVersion": "2.0",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "fileUris": [
        "https://raw.githubusercontent.com/Microsoft/dotnet-core-sample-templates/master/dotnet-core-music-linux/scripts/config-music.sh"
      ]
    },
    "protectedSettings": {
      "commandToExecute": "[concat('sudo sh config-music.sh ',variables('musicStoreSqlName'), ' ', parameters('adminUsername'), ' ', parameters('sqlAdminPassword'))]"
    }
  }
}
```

For more information on using the custom script extension, see [Custom script extensions with Resource Manager templates](extensions-customscript.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Next Step
<hr>

[Explore More Azure Resource Manager Templates](https://github.com/Azure/azure-quickstart-templates)

