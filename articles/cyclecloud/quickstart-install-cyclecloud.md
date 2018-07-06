# Azure CycleCloud QuickStart 1: Install and Setup CycleCloud

Azure CycleCloud is a free application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and Big Compute/Data workloads. CycleCloud enables users to create environments for workloads on any point of the parallel and distributed processing spectrum, from loosely-coupled parallel workloads to tightly-coupled applications such as MPI jobs on Infiniband/RDMA. By managing resource provisioning, configuration, and monitoring, CycleCloud allows users and IT staff to focus on business needs instead infrastructure.

## Gather the Prerequisites

The full list of prerequisites is available on the QuickStart Overview.

### Subscription ID

Run this command to list all available Azure subscription IDs:

      $ az account list -o table

### Service Principal

If you do not have a service principal available, you can create one now. Note that your service principal name must be unique - in the example below, "CCLab" can be replaced with whatever you like:

      $ az ad sp create-for-rbac --name CCLab

The output will display a series of information. You will need to save the App ID, password, and tenant ID:

    "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "CcIntroTraining",
    "name": "http://CcIntroTraining",
    "password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

### SSH KeyPair

In Windows, use the [PuttyGen application](https://www.ssh.com/ssh/putty/windows/puttygen#sec-Creating-a-new-key-pair-for-authentication) to create a ssh keypair. You will need to do the following:

  1. **Save Public Key**
  2. **Save Private Key**
  3. **Conversions - Export Open SSH Key**

In Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new ssh keypair.

## Install and Setup Azure CycleCloud

This lab uses an Azure Resource Manager template to:
1.	Create the VM for CycleCloud, and to install CycleCloud on that VM
2.	Create and configure the network for the CycleCloud environment
3.	Create a bastion host for enabling more secure access to the CycleCloud instance

For the purposes of this quickstart, the CycleCloud application is installed with a template and much of the setup is done for you. However, CycleCloud can also be installed manually, providing greater control over the installation and configuration process. For more information, see the Manual CycleCloud Installation documentation.

## Clone the Repo

Start by cloning the CycleCloud repo:

      $ git clone https://github.com/CycleCloud/cyclecloud_arm.git

There are two ARM templates in the .git file:
      * `deploy-vnet.json` creates a VNET with 3 separate subnets:
        *	`cycle`: The subnet in which the CycleCloud server is started
        *	`compute`: A /22 subnet for the HPC clusters
        *	`user`: The subnet for creating login nodes
      *	`deploy-cyclecloud.json` provisions and sets up the CycleCloud application server

## Create a Resource Group and VNET

Create a resource group in the region of your choice. Note that resource group names are unique within a subscription:

      az group create --name "{RESOURCE-GROUP}" --location "{REGION}"

For example, you could use "CCLab" as the resource group name and western Europe as the region:

      az group create --name "CCLab" --location "South Central US"

## Add Parameters

Locate and edit the `params-cyclecloud.json` file. Specify the following parameters:

* rsaPublicKey
* applicationSecret
* tenantID
* applicationID
* cyclecloudAdminPW

### rsaPublicKey

To copy the ssh key, open the **exported** public key, and copy the contents of the key into the `params-cyclecloud.json`.

An example `params-cyclecloud.json` might look like this:

      {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
      "vnetName": { "value": "cyclevnet" },
      ...
      "rsaPublicKey": { "value": "ssh-rsa MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFw2R8/EGVpXRRkr9bHVg3mf/ybv
      aFd/FbJ1PckwfcvSnVY7IFXfez6nirztAWoEQzSZNy96MP5DVEiAfJSG3ajeaonW
      WW06Sn1CKTW0Vo0MMEshdpMRDqsELx0vTF4uev5sQrsDTbWgFoM9mgJ4GdweW0sJ
      80uAUQlCcalQNW+FAgMBAAE="}
      }

### Application Parameters

`applicationSecret`, `tenantID`, and `applicationID` were all generated when setting up the Service Principal for your Azure Active Directory. Input those values now.

### CycleCloud Admin Password

Specify a password for the CycleCloud application server `admin` user. The password needs to meet the following specifications:

* Between 3-8 characters and meeting three of the following four conditions:
   - Contains an upper case character
   - Contains a lower case character
   - Contains a number
   - Contains a special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?  ~ " ( ) ;

## Deploy the CycleCloud Virtual Machine

Deploy the CycleCloud VM using the edited `params-cyclecloud.json`:

      $ az group deployment create --name "cyclecloud_deployment" --resource-group "{RESOURCE-GROUP}" --template-file deploy-cyclecloud.json --parameters params-cyclecloud.json

## Log into the CycleCloud Application Server

To connect to the CycleCloud webserver, retrieve the FQDN of the CycleServer VM from the Azure Portal, then browse to https://cycleserverfqdn/. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser.

Login to the webserver using the `cycleadmin` user and the `cyclecloudAdminPW` password defined in the `params-cyclecloud.json` parameters file.

That's the end of QuickStart 1, which covered the installation and setup of Azure CycleCloud via ARM Template. Continue on to QuickStart 2 now!
