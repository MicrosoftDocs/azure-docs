<properties
	pageTitle="Create a Secure Linux VM using a Azure template | Microsoft Azure"
	description="Create a Secure Linux VM on Azure using an Azure Resource Manager template."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="vlivech"
	manager="timlt"
	editor=""
	tags="azure-service-management,azure-resource-manager" />

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/15/2015"
	ms.author="vlivech"/>

# Create a secured Linux VM using an Azure template

Templates allow you to create VMs on Azure with settings that you want to customize during the launch, things like usernames and hostnames.  For this article we will focus on launching an Ubuntu VM using a quick template that is on Azure repo on GitHub.  

## Goal

- Clone Azure Quickstart Templates from Github
- Edit the Ubuntu 'simple linux VM' template
- Add SSH Public Key to template
- Launch a new VM using that template

## Prerequisites

- An Azure account. [Get a free trial.](https://azure.microsoft.com/pricing/free-trial/)
- [SSH key pair](virtual-machines-linux-mac-create-ssh-keys.md)

## Introduction

Cloud Templates use json files to instruct Azure on how to build your new VM with the settings you have chosen and written in the template file.  Templates can be used for simple one off tasks like launching an Ubuntu VM like we will do in this article.  Templates can also be used to construct complex Azure configurations of entire environments like a testing, dev or produciton deployment from the networking to the OS.  This template will contain a SSH public key which will be placed into `~/.ssh/authorized_keys` on Ubuntu during creation in Azure.  This will allow for a secure way to login by default.  This template will enable your first login to the new VM using SSH keys instead of passwords.  To completely disable password logins, read [Disable SSH passwords on your Linux VM by configuring SSHD.](virtual-machines-linux-mac-disable-ssh-password-usage.md)

## Quick Commands

After creating and editing the **azuredeploy.parameters.json** file with your SSH public key and other arguments, this deployment requires only one command:

1. `username@macbook$ azure group create -n <exampleRGname> -l <exampleAzureRegion> azuredeploy.json -e azuredeploy.parameters.json`

## Detailed Walk Through

Clone the Azure QuickStart Templates repo to your workstation.  Once it is cloned:

```
username@macbook$ cd 101-vm-simple-linux
```

Now edit the `azuredeploy.parameters.json` file to change the Ubuntu settings to your own configuration:

_The `UbuntuOSVersion` calls for Ubuntu 14 LTS which is fine for this walk through and can be left unchanged._

```
username@macbook$ vim azuredeploy.parameters.json

# Change anything <example> to your own settings

{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminUsername": {
      "value": "azureUser"
    },
    "dnsLabelPrefix": {
      "value": "GEN-UNIQUE"
    },
    "sshKeyData": {
      "value": "GEN-SSH-PUB-KEY"
    },
    "vmSize": {
      "value": "Standard_A2"
    },
    "vmName": {
      "value": "sshvm"
    }
  }
}
```

Run this command to launch the VM using that local template

_replace <example> with your own settings_

```
# Example Command
username@macbook$ azure group create -n <exampleRGname> -l <exampleAzureRegion> azuredeploy.json -e azuredeploy.parameters.json

# Full command
username@macbook$ azure group create -n simpleUbuntu -l westus azuredeploy.json -e azuredeploy.parameters.json
```

This will use the `azuredeploy.parameters.json` file that we edited to create a Resource Group with a single Ubuntu VM inside of it.

Templates can also be called from URLs, like this example that uses the same files as the last example but these are now in a repo on Github.  Make sure to use the raw links to the json files.

```
# Example Command
username@macbook$ azure group create -n <exampleRGname> -l <exampleAzureRegion> --template-uri <https://raw.githubusercontent.com/repo/template.json> -e  <https://raw.githubusercontent.com/repo/template.parameters.json>

# Full Command
username@macbook$ azure group create -n simpleUbuntu -l westus --template-uri https://raw.githubusercontent.com/vlivech/SecureUbuntuVMTemplate/master/azuredeploy.json -e https://raw.githubusercontent.com/vlivech/SecureUbuntuVMTemplate/master/azuredeploy.parameters.json
```
