<properties
   pageTitle="Install MongoDB on a Linux VM | Microsoft Azure"
   description="Learn how to install and configure MongoDB on a Linux virtual machine in Azure using the Resource Manager deployment model."
   services="virtual-machines-linux"
   documentationCenter=""
   authors="iainfoulds"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="09/29/2016"
   ms.author="iainfou"/>

# Install and Configure MongoDB on a Linux VM in Azure
[MongoDB](http://www.mongodb.org) is a popular open-source, high-performance NoSQL database. This article shows you how to install and configure MongoDB on a Linux VM in Azure using the Resource Manager deployment model. Examples are shown that detail how to:

- [Manually install and configure a basic MongoDB instance](#manually-install-and-configure-mongodb-on-a-vm)
- [Create a basic MongoDB instance using a Resource Manager template](#create-basic-mongodb-instance-on-centos-using-a-template)
- [Create a complex MongoDB sharded cluster with replica sets using a Resource Manager template](#create-a-complex-mongodb-sharded-cluster-on-centos-using-a-template)


## Prerequisites
This article requires the following:

- an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/)).
- the [Azure CLI](../xplat-cli-install.md) logged in with `azure login`
- the Azure CLI *must be* in Azure Resource Manager mode using `azure config mode arm`


## Manually install and configure MongoDB on a VM
MongoDB [provide installation instructions](https://docs.mongodb.com/manual/administration/install-on-linux/) for Linux distros including Red Hat / CentOS, SUSE, Ubuntu, and Debian. The following example creates a `CoreOS` VM using an SSH key stored at `.ssh/azure_id_rsa.pub`. Answer the prompts for storage account name, DNS name, and admin credentials:

```bash
azure vm quick-create --ssh-publickey-file .ssh/azure_id_rsa.pub --image-urn CentOS
```

Log on to the VM using the public IP address displayed at the end of the preceding VM creation step:

```bash
ssh ops@40.78.23.145
```

To add the installation sources for MongoDB, create a `yum` repository file as follows:

```bash
sudo touch /etc/yum.repos.d/mongodb-org-3.2.repo
```

Open the MongoDB repo file for editing. Add the following lines:

```bash
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
```

Install MongoDB using `yum` as follows:

```bash
sudo yum install -y mongodb-org
```

By default, SELinux is enforced on CentOS images that prevents you from accessing MongoDB. Install policy management tools and configure SELinux to allow MongoDB to operate on its default TCP port 27017 as follows. 

```bash
sudo yum install -y policycoreutils-python
sudo semanage port -a -t mongod_port_t -p tcp 27017
```

Start the MongoDB service as follows:

```bash
sudo service mongod start
```

Verify the MongoDB installation by connecting using the local `mongo` client:

```bash
mongo
```

Now test the MongoDB instance by adding some data and then searching:

```
> db
test
> db.foo.insert( { a : 1 } )  
> db.foo.find()  
{ "_id" : ObjectId("57ec477cd639891710b90727"), "a" : 1 }
> exit
```

If desired, configure MongoDB to start automatically during a system reboot:

```bash
sudo chkconfig mongod on
```


## Create basic MongoDB instance on CentOS using a template
You can create a basic MongoDB instance on a single CentOS VM using the following Azure quickstart template from Github. This template uses the Custom Script extension for Linux to add a `yum` repository to your newly created CentOS VM and then install MongoDB.

- [Basic MongoDB instance on CentOS](https://github.com/Azure/azure-quickstart-templates/tree/master/mongodb-on-centos) - https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-on-centos/azuredeploy.json

The following example creates a resource group with the name `myResourceGroup` in the `WestUS` region. Enter your own values as follows:

```bash
azure group create --name myResourceGroup --location WestUS \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-on-centos/azuredeploy.json
```

> [AZURE.NOTE] The Azure CLI returns you to a prompt within a few seconds of creating the deployment, but the installation and configuration takes a few minutes to complete. Check the status of the deployment with `azure group deployment show myResourceGroup`, entering the name of your resource group accordingly. Wait until the `ProvisioningState` shows 'Succeeded' before trying to SSH to the VM.

Once the deployment is complete, SSH to the VM. Obtain the IP address of your VM using the `azure vm show` command as in the following example:

```bash
azure vm show --resource-group myResourceGroup --name myVM
```

Near the end of the output, the `Public IP address` is displayed. SSH to your VM with the IP address of your VM:

```bash
ssh ops@138.91.149.74
```

Verify the MongoDB installation by connecting using the local `mongo` client as follows:

```bash
mongo
```

Now test the instance by adding some data and searching as follows:

```
> db
test
> db.foo.insert( { a : 1 } )  
> db.foo.find()  
{ "_id" : ObjectId("57ec477cd639891710b90727"), "a" : 1 }
> exit
```


## Create a complex MongoDB Sharded Cluster on CentOS using a template
You can create a complex MongoDB sharded cluster using the following Azure quickstart template from Github. This template follows the [MongoDB sharded cluster best practices](https://docs.mongodb.com/manual/core/sharded-cluster-components/) to provide redundancy and high availability. The template creates two shards, with three nodes in each replica set. One config server replica set with three nodes is also created, plus two `mongos` router servers to provide consistency to applications from across the shards.

- [MongoDB Sharding Cluster on CentOS](https://github.com/Azure/azure-quickstart-templates/tree/master/mongodb-sharding-centos) - https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-sharding-centos/azuredeploy.json

> [AZURE.WARNING] Deploying this complex MongoDB sharded cluster requires more than 20 cores, which is typically the default core count per region for a subscription. Open an Azure support request to increase your core count.

The following example creates a resource group with the name `myResourceGroup` in the `WestUS` region. Enter your own values as follows:

```bash
azure group create --name myResourceGroup --location WestUS \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/mongodb-sharding-centos/azuredeploy.json
```

> [AZURE.NOTE] The Azure CLI returns you to a prompt within a few seconds of creating the deployment, but the installation and configuration can take over an hour to complete. Check the status of the deployment with `azure group deployment show myResourceGroup`, adjusting the name of your resource group accordingly. Wait until the `ProvisioningState` shows 'Succeeded' before connecting to the VMs.


## Next steps
In these examples, you connect to the MongoDB instance locally from the VM. If you want to connect to the MongoDB instance from another VM or network, ensure the appropriate [Network Security Group rules are created](virtual-machines-linux-nsg-quickstart.md).

For more information about creating using templates, see the [Azure Resource Manager overview](../resource-group-overview.md).

The Azure Resource Manager templates use the Custom Script Extension to download and execute scripts on your VMs. For more information, see [Using the Azure Custom Script Extension with Linux Virtual Machines](virtual-machines-linux-extensions-customscript.md).