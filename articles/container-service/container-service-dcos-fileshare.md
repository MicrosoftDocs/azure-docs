---
title: File share for Azure DC/OS cluster | Microsoft Docs
description: Create and mount a file share to a DC/OS cluster in Azure Container Service
services: container-service
documentationcenter: ''
author: julienstroheker
manager: dcaro
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure, FileShare, cifs

ms.assetid:
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/14/2017
ms.author: juliens

---
# Create and mount a file share to a DC/OS cluster
In this article, we'll explore how to create a file share on Azure and mount it on each agent and master of the DC/OS cluster. Setting up a file share makes it easier to share files across your cluster such as configuration, access, logs, and more.

Before working through this example, you need a DC/OS cluster that is configured in Azure Container Service. See [Deploy an Azure Container Service cluster](container-service-deployment.md).

## Create a file share on Microsoft Azure
### Using the portal

1. Log in to the portal.
2. Create a storage account.
   
  ![Azure container service create Storage Account](media/container-service-dcos-fileshare/createSA.png)

3. When it's created, click **Files** in the **Services** section.
   
  ![Azure container service Files section](media/container-service-dcos-fileshare/filesServices.png)

4. Click **+ File share** and enter a name for this new share (**Quota** is not mandatory).
   
  ![Azure container service + File Share](media/container-service-dcos-fileshare/newFileShare.png)  

### Using Azure CLI 2.0

If you need to, [install and set up the Azure CLI](/cli/azure/install-azure-cli.md).

```azurecli
################# Change these four parameters ##############
DCOS_PERS_STORAGE_ACCOUNT_NAME=anystorageaccountname
DCOS_PERS_RESOURCE_GROUP=AnyResourceGroupName
DCOS_PERS_LOCATION=eastus
DCOS_PERS_SHARE_NAME=demoshare
#############################################################

# Create the storage account with the parameters
az storage account create -n $DCOS_PERS_STORAGE_ACCOUNT_NAME -g $DCOS_PERS_RESOURCE_GROUP -l $DCOS_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string -n $DCOS_PERS_STORAGE_ACCOUNT_NAME -g $DCOS_PERS_RESOURCE_GROUP -o tsv`

# Create the share
az storage share create -n $DCOS_PERS_SHARE_NAME
```

## Mount the share in your cluster

Next, we need to mount this share on every virtual machine inside your cluster using the cifs tool/protocol. 
We do that with the following command line: `mount -t cifs`.

Here is an example that uses:
* Storage account name **`anystorageaccountname`**
* The fictitious account key **`P/GuXXXuoRtIVsV+faSfLhuNyZDrTzPmZDm3RyCL4XS6ghyiHYriN12gl+w5JMN2gXGtOhCzxFf2JuGqXXXX1w==`** 
* The mount point **`/mnt/share/demoshare`**

```bash
sudo mount -t cifs //anystorageaccountname.file.core.windows.net/demoshare /mnt/share/demoshare -o vers=3.0,username=anystorageaccountname,password=P/GuXXXuoRtIVsV+faSfLhuNyZDrTzPmZDm3RyCL4XS6ghyiHYriN12gl+w5JMN2gXGtOhCzxFf2JuGqXXXX1w==,dir_mode=0777,file_mode=0777
```

We will run this command on each virtual machine of our cluster (master and agent nodes). If you have a large number of agents, we recommend automating this process by creating scripts.  

### Set up scripts

1. First, SSH to the master (or the first master) of your DC/OS-based cluster. For example, `ssh userName@masterFQDN –A –p 22`, where the masterFQDN is the fully qualified domain name of the master VM.

2. Copy your private key to the working directory (~) on master.

3. Change the permissions on it with the following command: `chmod 600 yourPrivateKeyFile`.

4. Import your private key using the `ssh-add yourPrivateKeyFile` command. You may have to run `eval ssh-agent -s` if it doesn't work the first time.

5. From the master, create two files, using your favorite editor such as vi, nano, or vim: 
  
  * One with the script to execute on each VM, called **cifsMount.sh** 
  * Another one to initiate all the ssh connections that will call the first script, called **mountShares.sh**


```bash
# cifsMount.sh

# Install the cifs utils, should be already installed
sudo apt-get update && sudo apt-get -y install cifs-utils

# Create the local folder that will contain our share
if [ ! -d "/mnt/share/demoshare" ]; then sudo mkdir -p "/mnt/share/demoshare" ; fi

# Mount the share under the previous local folder created
sudo mount -t cifs //anystorageaccountname.file.core.windows.net/demoshare /mnt/share/demoshare -o vers=3.0,username=anystorageaccountname,password=P/GuXXXuoRtIVsV+faSfLhuNyZDrTzPmZDm3RyCL4XS6ghyiHYriN12gl+w5JMN2gXGtOhCzxFf2JuGqXXXX1w==,dir_mode=0777,file_mode=0777
```
  
```bash
# mountShares.sh

# Install jq used for the next command
sudo apt-get install jq

# Create the local folder that will contain our share
if [ ! -d "/mnt/share/demoshare" ]; then sudo mkdir -p "/mnt/share/demoshare" ; fi

# Mount the share on the current vm (master)
sudo mount -t cifs //anystorageaccountname.file.core.windows.net/demoshare /mnt/share/demoshare -o vers=3.0,username=anystorageaccountname,password=P/GuXXXuoRtIVsV+faSfLhuNyZDrTzPmZDm3RyCL4XS6ghyiHYriN12gl+w5JMN2gXGtOhCzxFf2JuGqXXXX1w==,dir_mode=0777,file_mode=0777

# Get the IP address of each node using the mesos API and store it inside a file called nodes
curl http://leader.mesos:1050/system/health/v1/nodes | jq '.nodes[].host_ip' | sed 's/\"//g' | sed '/172/d' > nodes
  
# From the previous file created, run our script to mount our share on each node
cat nodes | while read line
  do
    ssh `whoami`@$line -o StrictHostKeyChecking=no -i yourPrivateKeyFile < ./cifsMount.sh
    done
```  
> [!IMPORTANT]
> You have to change the **'mount'** command with your own settings such as the name of your storage account and the password.
>  

The folder where you created the previous scripts should now have 3 files:  

* **cifsMount.sh**
* **mountShares.sh**
* **yourPrivateKeyFile** 

### Run the scripts

Execute the **mountShares.sh** file with the following command: `sh mountShares.sh`.

You should see the result printing in the terminal. After the scripts complete, you can use the file share in your cluster.

You can optimize the scripts, but this example is straightforward and its purpose is to provide guidance.

> [!NOTE] 
> This method is not recommended for scenarios that require high IOPS, but it is very useful to share documents and information across the cluster.
>

## Next steps
* Read more about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).
* DC/OS container management through the [Marathon REST API](container-service-mesos-marathon-rest.md).