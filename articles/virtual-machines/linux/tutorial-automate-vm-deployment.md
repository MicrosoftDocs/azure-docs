---
title: Automate Linux VM configuration in Azure | Microsoft Docs
description: Learn how to use cloud-init and Key Vault to automate the configuration of Linux VMs in Azure 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/11/2017
ms.author: iainfou
---

# How to automate the deployment of Linux virtual machines in Azure
To create virtual machines (VMs) in a quick and consistent manner, some form of automation is typically desired. A common approach is to use [cloud-init](https://cloudinit.readthedocs.io). This tutorial shows you how to use cloud-init to automatically install packages, configure the NGINX web server, and deploy a Node.js app.

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Step 1 - cloud-init overview
Cloud-init is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use `apt-get install` or `yum install` to install a package. Instead you define a list of packages to install and cloud-init automatically uses the native package management tool for the distro you select.

We are working with our partners to get cloud-init included and working in the images that they provide to Azure. The following table outlines the current cloud-init availability on Marketplace images:

| Alias | Publisher | Offer | SKU | Version | cloud-init |
|:--- |:--- |:--- |:--- |:--- |:--- |
| UbuntuLTS |Canonical |UbuntuServer |14.04.4-LTS |latest |yes |
| RHEL |Redhat |RHEL |7.2 |latest |no |
| CentOS |OpenLogic |Centos |7.2 |latest |no |
| CoreOS |CoreOS |CoreOS |Stable |latest |yes |
| Debian |credativ |Debian |8 |latest |no |
| openSUSE |SUSE |openSUSE |13.2 |latest |no |


## Step 2 - Create cloud-init config
To see cloud-init in action, lets create a VM that installs NGINX and runs a simple 'Hello World' Node.js app. The cloud-init configuration installs the required packages, creates a Node.js app, then initializes and starts the app.

Create a file named `cloud-init.txt` and paste the following configuration:

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
  - nodejs
  - npm
write_files:
  - owner: www-data:www-data
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection keep-alive;
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
      }
  - owner: azureuser:azureuser
  - path: /home/azureuser/myapp/index.js
    content: |
      var express = require('express')
      var app = express()
      var os = require('os');
      app.get('/', function (req, res) {
        res.send('Hello World from host ' + os.hostname() + '!')
      })
      app.listen(3000, function () {
        console.log('Hello world app listening on port 3000!')
      })
runcmd:
  - service nginx restart
  - cd "/home/azureuser/myapp"
  - npm init
  - npm install express -y
  - nodejs index.js
```


## Step 3 - Create virtual machine
Create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroup` in the `westus` location:

```azurecli
az group create --name myResourceGroup --location westus
```

Now create a VM with [az vm create](/cli/azure/vm#create). Use the `--custom-data` parameter to pass in your cloud-init config file. Provide the full path to the `cloud-init.txt` config if you saved the file outside of your present working directory. The following example creates a VM named `myAutomatedVM`:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myAutomatedVM \
    --image Canonical:UbuntuServer:14.04.4-LTS:latest \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
```

It takes a few minutes for the VM to be created, the packages to install, and the app to start. When the VM has been created, take note of the `publicIpAddress` displayed by the Azure CLI. This address is used to access the Node.js app via a web browser.

## Step 4 - Test web app
To allow web traffic to reach your VM, open port 80 from the Internet with [az vm open-port](/cli/azure/vm#open-port):

```azurecli
az vm open-port --port 80 --resource-group myResourceGroup --name myAutomatedVM
```

Now, open a web browser and enter `http://<publicIpAddress>` in the address bar. Provide your own public IP address from the VM create process. Your Node.js app is displayed as follows:

![View running NGINX site](./media/tutorial-automate-vm-deployment/nginx.png)

## Step 5 - Secure with Key Vault
This optional section expands the use of automated deployments to include a certificate and apply it to NGINX. Rather than using a custom image that includes the certificates, you securely store certificates in Azure Key Vault and inject them during the VM deployment. This process ensures the most up-to-date certificates are provisioned on a VM. 

Azure Key Vault safeguards crytopgraphic keys and secrets, such certificates or passwords. Key Vault helps streamline the key management process and enables you to maintain control of keys that access and encrypt your data. This scenario introduces some Key Vault concepts to create and use a certificate, though is not an exhaustive overview on how to use Key Vault.

### Create an Azure Key Vault
First, create a Key Vault with [az keyvault create](/cli/azure/keyvault#create) and enable it for use when you deploy a VM. Each Key Vault requires a unique name. The following example adds some randomness to the key vault name:

```azurecli
keyvault_name=mykeyvault$RANDOM
az keyvault create --resource-group myResourceGroup --name $keyvault_name --enabled-for-deployment
```

### Generate certificate and store in Key Vault
In this tutorial, we generate a self-signed certificate. For production use, import a valid certificate signed by trusted provider with [az keyvault certificate import](/cli/azure/certificate#import). The following example generates a self-signed certificate with [az keyvault certificate create](/cli/azure/certificate#create) that uses the default certificate policy:

```azurecli
az keyvault certificate create \
    --vault-name $keyvault_name \
    --name mycert \
    --policy "$(az keyvault certificate get-default-policy)"
```


### Prepare certificate for use with VM
Obtain the ID of your certificate with [az keyvault secret list-versions](/cli/azure/keyvault/secret#list-versions). To use the certificate during the VM create process, convert the certificate with [az vm format-secret](/cli/azure/vm#format-secret). The following example assigns the output of these commands to variables for ease of use in the next steps:

```azurecli
secret=$(az keyvault secret list-versions \
          --vault-name $keyvault_name \
          --name mycert \
          --query "[?attributes.enabled].id" --output tsv)
vm_secret=$(az vm format-secret --secret "$secret")
```


### Create cloud-init config to secure NGINX
When you create a VM, certificates and keys are stored in the protected `/var/lib/waagent/` directory. To automate adding the certificate to the VM and configuring NGINX, lets expand on the cloud-init config from the previous example.

Create a file named `cloud-init-secured.txt` and paste the following configuration:

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
  - nodejs
  - npm
write_files:
  - owner: www-data:www-data
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        listen 443 ssl;
        ssl_certificate /etc/nginx/ssl/mycert.cert;
        ssl_certificate_key /etc/nginx/ssl/mycert.prv;
        location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection keep-alive;
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
        }
      }
  - owner: azureuser:azureuser
  - path: /home/azureuser/myapp/index.js
    content: |
      var express = require('express')
      var app = express()
      var os = require('os');
      app.get('/', function (req, res) {
        res.send('Hello World from host ' + os.hostname() + '!')
      })
      app.listen(3000, function () {
        console.log('Hello world app listening on port 3000!')
      })
runcmd:
  - secretsname=$(find /var/lib/waagent/ -name "*.prv" | cut -c -57)
  - mkdir /etc/nginx/ssl
  - cp $secretsname.crt /etc/nginx/ssl/mycert.cert
  - cp $secretsname.prv /etc/nginx/ssl/mycert.prv
  - service nginx restart
  - cd "/home/azureuser/myapp"
  - npm init
  - npm install express -y
  - nodejs index.js
```

### Create secure VM
Now create a VM with [az vm create](/cli/azure/vm#create). Inject the certificate data from Key Vault with the `--secrets` parameter. As in the previous example, you also pass in the cloud-init config with the `--custom-data` parameter:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVMWithCerts \
    --image Canonical:UbuntuServer:14.04.4-LTS:latest \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init-secured.txt \
    --secrets "$vm_secret"
```

It takes a few minutes for the VM to be created, the packages to install, and the app to start. When the VM has been created, take note of the `publicIpAddress` displayed by the Azure CLI. This address is used to access the Node.js app via a web browser.


### Test secure web app
To allow secure web traffic to reach your VM, open port 443 from the Internet with [az vm open-port](/cli/azure/vm#open-port):

```azurecli
az vm open-port --port 443 --resource-group myResourceGroup --name myVMWithCerts --priority 2000
```

Now, open a web browser and enter `https://<publicIpAddress>` in the address bar. Provide your own public IP address from the VM create process. A security warning is displayed from the self-signed certificate. Accept the warning to continue:

![Accept web browser security warning](./media/tutorial-automate-vm-deployment/browser-warning.png)

Your secured NGINX site and Node.js app is then displayed:

![View running secure NGINX site](./media/tutorial-automate-vm-deployment/secured-nginx.png)


## Step 6 - Delete resource group
If you continue in the series of tutorials to [create custom VM images](./tutorial-custom-images.md), you can re-use the VMs you created here. Otherwise, delete the resource group, which deletes the virtual machine.

```azurecli
az group delete --name myResourceGroup --no-wait --yes
```

## Next steps

Tutorial - [Create custom VM images](./tutorial-custom-images.md)

Further reading:

- [Use cloud-init to customize a Linux VM during creation](using-cloud-init.md)
- [What is Azure Key Vault?](../../key-vault/key-vault-whatis.md)