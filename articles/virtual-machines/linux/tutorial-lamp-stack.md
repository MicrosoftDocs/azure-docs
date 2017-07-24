---
title: Deploy LAMP on a Linux virtual machine in Azure | Microsoft Docs
description: Tutorial - Install the LAMP stack on a Linux VM in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 6c12603a-e391-4d3e-acce-442dd7ebb2fe
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 07/24/2017
ms.author: danlep

---
# Install a LAMP web server on an Azure VM
This article walks you through how to deploy an Apache web server, MySQL, and PHP (the LAMP stack) on Azure. In this tutorial you learn how to:

> [!div class="checklist"]
> * 
> * 
> * 
> * 
> * 

For more 
 on the LAMP stack, see the [Ubuntu documenation](https://help.ubuntu.com/community/ApacheMySQLPHP).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Before you begin

To complete the example in this tutorial, you must have an existing Ubuntu Linux virtual machine (the 'L' in the LAMP stack). If needed, this [script sample](../scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed. 

## Create a DNS name for your VM

Run the following command to find the IP address of your VM:

```azurecli-interactive
az network public-ip list --resource-group myResourceGroup --query [].ipAddress
```

## Open port 80 for web traffic 

By default only SSH connections are allowed into Linux VMs deployed in Azure. Because this VM is going to be a web server, you need to open port 80 from the internet. Use the [az vm open-port](/cli/azure/vm#open-port) command to open the desired port.  
 
```azurecli-interactive 
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```
## SSH into your VM


Use the following command to create an SSH session with the virtual machine. Make sure to substitute the correct public IP address of your virtual machine. In this example, the IP address is *40.68.254.142*.

```bash
ssh 40.68.254.142
```

## Install Apache, MySQL, and PHP

Run the following commands to update Ubuntu package sources and install Apache, MySQL, and PHP. If you want to install a LAMP web server on another Linux distribution, use a supported package manager to install Apache, MySQL, and PHP.


```bash
sudo apt-get update
sudo apt-get install apache2 mysql-server php php-mysql
```



> [!TIP]
> You can alternatively install Apache, MySQL, and PHP on Ubuntu using `sudo apt-get install lampserver^` (including the caret (^) character at the end).
>



You are prompted to install these packages and other dependencies. When prompted, set an administrative password for MySQL, and then [Enter] to continue. Follow the remaining prompts. This process installs the minimum required PHP extensions needed to use PHP with MySQL. 

![][1]

## Verify the installation
Check the installation by finding out the versions of Apache, MySQL, and PHP on your VM:

### Apache

```bash
apache2 -v
```

### MySQL

```bash
msql -V
```
### PHP

```bash
php -v
```









## Quick command summary

1. Save and edit the [azuredeploy.parameters.json file](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.parameters.json) to your preference on your local machine.
2. Run the following two commands to create a resource group and then deploy your template:

```azurecli
az group create -l westus -n myResourceGroup
az group deployment create -g myResourceGroup \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json \
    --parameters @filepathToParameters.json
```

### Deploy LAMP on existing VM
The following commands updates packages, then installs Apache, MySQL, and PHP:

```bash
sudo apt-get update
sudo apt-get install apache2 mysql-server php5 php5-mysql
```

## Deploy LAMP on new VM walkthrough

1. Create a resource group with [az group create](/cli/azure/group#create) to contain the new VM:

```azurecli
az group create -l westus -n myResourceGroup
```
To create the VM itself, you can use an already written Azure Resource Manager template found [here on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/lamp-app).

2. Save the [azuredeploy.parameters.json file](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.parameters.json) to your local machine.
3. Edit the **azuredeploy.parameters.json** file to your preferred inputs.
4. Deploy the template with [az group deployment create] referencing the downloaded json file:

```azurecli
az group deployment create -g myResourceGroup \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json \
    --parameters @filepathToParameters.json
```

The output is similar to the following example:

```json
{
"id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Resources/deployments/azuredeploy",
"name": "azuredeploy",
"properties": {
    "correlationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "debugSetting": null,
}
...
"provisioningState": "Succeeded",
"template": null,
"templateLink": {
    "contentVersion": "1.0.0.0",
    "uri": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/lamp-app/azuredeploy.json"
    },
    "timestamp": "2017-02-22T00:05:51.860411+00:00"
},
"resourceGroup": "myResourceGroup"
}
```

You have now created a Linux VM with LAMP already installed on it. If you wish, you can verify the install by jumping down to [Verify LAMP Successfully Installed](#verify-lamp-successfully-installed).

## Deploy LAMP on existing VM walkthrough
If you need help creating a Linux VM, you can head [here to learn how to create a Linux VM](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-linux-quick-create-cli). 
Next, you need to SSH into the Linux VM. If you need help with creating an SSH key, you can head [here to learn how to create an SSH key on Linux/Mac](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
If you have an SSH key already, go ahead and SSH from your command line into your Linux VM with `ssh azureuser@mypublicdns.westus.cloudapp.azure.com`.

Now that you are working within your Linux VM, we can walk through installing the LAMP stack on Debian-based distributions. The exact commands might differ for other Linux distros.

#### Installing on Debian/Ubuntu
You need the following packages installed: `apache2`, `mysql-server`, `php5`, and `php5-mysql`. You can install these packages by directly grabbing these packages or using Tasksel.
Before installing you need to download and update package lists.

```bash
sudo apt-get update
```

##### Individual packages
Using apt-get:

```bash
sudo apt-get install apache2 mysql-server php5 php5-mysql
```

##### Using tasksel
Alternatively you can download Tasksel, a Debian/Ubuntu tool that installs multiple related packages as a coordinated "task" onto your system.

```bash
sudo apt-get install tasksel
sudo tasksel install lamp-server
```

After running either of the previous options, you will be prompted to install these packages and various other dependencies. To set an administrative password for MySQL, press 'y' and then 'Enter' to continue, and follow any other prompts. This process installs the minimum required PHP extensions needed to use PHP with MySQL. 

![][1]

Run the following command to see other PHP extensions that are available as packages:

```bash
apt-cache search php5
```

#### Create info.php document
You should now be able to check what version of Apache, MySQL, and PHP you have through the command line by typing `apache2 -v`, `mysql -v`, or `php -v`.

If you would like to test further, you can create a quick PHP info page to view in a browser. Create a file with Nano text editor with this command:

```bash
sudo nano /var/www/html/info.php
```

Within the GNU Nano text editor, add the following lines:

```php
<?php
phpinfo();
?>
```

Then save and exit the text editor.

Restart Apache with this command so all new installs take effect.

```bash
sudo service apache2 restart
```

## Verify LAMP successfully installed
Now you can check the PHP info page you created by opening a browser and going to http://youruniqueDNS/info.php. It should look similar to this image.

![][2]

You can check your Apache installation by viewing the Apache2 Ubuntu Default Page by going to you http://youruniqueDNS/. The output is similar to the following example:

![][3]

Congratulations, you have just setup a LAMP stack on your Azure VM!

## Next steps
Check out the Ubuntu documentation on the LAMP stack:

* [https://help.ubuntu.com/community/ApacheMySQLPHP](https://help.ubuntu.com/community/ApacheMySQLPHP)

[1]: ./media/deploy-lamp-stack/configmysqlpassword-small.png
[2]: ./media/deploy-lamp-stack/phpsuccesspage.png
[3]: ./media/deploy-lamp-stack/apachesuccesspage.png
