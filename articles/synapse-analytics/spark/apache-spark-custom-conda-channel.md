---
title: Create custom Conda channel for package management
description: Learn how to create a custom Conda channel for package management
services: synapse-analytics
author: midesa
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/26/2020
ms.author: midesa
ms.reviewer: jrasnick 
ms.subservice: spark
---

# Create a custom Conda channel for package management 
When installing Python packages, the Conda package manager uses channels to look for packages. You may need to create a custom Conda channel for various reasons. For example, you may find that:

- your workspace is data exfiltration protected and outbound connections are blocked.  
- you have packages that you don't want to upload to public repositories.
- you want to set up am alternate repository for the users within your workspace.

In this article, we'll provide a step-by-step guide to help you create your custom Conda channel within your Azure Data Lake Storage account.

## Set up your local machine

1. Install Conda on your local machine.You can refer to the [Azure Synapse Spark runtime](./apache-spark-version-support.md) to identify the Conda version that is used on the same runtime.
   
2. To create a custom channel, install conda-build.
```
conda install conda-build
```
3. Organize all the packages in for the platform you want to serve. In this example, we will install Anaconda archive on your local machine.

```
sudo wget https://repo.continuum.io/archive/Anaconda3-4.4.0-Linux-x86_64.sh 
sudo chmod +x Anaconda3-4.4.0-Linux-x86_64.sh  
sudo bash Anaconda3-4.4.0-Linux-x86_64.sh -b -p /usr/lib/anaconda3 
export PATH="/usr/lib/anaconda3/bin:$PATH" 
sudo chmod 777 -R /usr/lib/anaconda3a.  
```
## Mount the storage account onto your machine
Next, we will mount the Azure Data Lake Storage  Gen2 account onto your local machine. This process can also be done with a WASB account; however, we will go through an example for the  ADLSg2 account 
 
For more information on how to mount the storage account on your local machine, you can visit [this page](https://github.com/Azure/azure-storage-fuse#blobfuse ). 

1. You can install blobfuse from the Linux Software Repository for Microsoft products.

```
wget https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb 
sudo dpkg -i packages-microsoft-prod.deb 
sudo apt-get update 
sudo apt-get install blobfuse fuse 
export AZURE_STORAGE_ACCOUNT=<<myaccountname>
export AZURE_STORAGE_ACCESS_KEY=<<myaccountkey>>
export AZURE_STORAGE_BLOB_ENDPOINT=*.dfs.core.windows.net 
```

2. Create your mountpoint (```mkdir /path/to/mount```) and mount a Blob container with blobfuse. In this example, let's use the value **privatechannel** for the **mycontainer** variable.
   
```
blobfuse /path/to/mount --container-name=mycontainer --tmp-path=/mnt/blobfusetmp --use-adls=true --log-level=LOG_DEBUG 
sudo mkdir -p /mnt/blobfusetmp
sudo chown <myuser> /mnt/blobfusetmp
```
## Create the channel
In the next set of steps, we will create a custom Conda channel. 

1. On your local machine, create a directory to organize all the packages for your custom channel.
   
```
mkdir /home/trusted-service-user/privatechannel 
cd ~/privatechannel/ 
mkdir channel1/linux64 
```

2. Organize all the ```tar.bz2``` packages from https://repo.anaconda.com/pkgs/main/linux-64/ into the subdirectory. Be sure to also include all dependent tar.bz2 packages as well. 

```
cd channel1 
mkdir noarch 
echo '{}' > noarch/repodata.json 
bzip2 -k noarch/repodata.json 

// Create channel 

conda index channel1/noarch 
conda index channel1/linux-64 
conda index channel1 
```

For more information, you can also [visit the Conda user guide](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/create-custom-channels.html) to creating custom channels. 

## Storage account permissions
Now, we will need to validate the permissions on the storage account. To set these permissions, navigate to the path where custom channel will be created. Then, create a SAS token for ```privatechannel``` that has read, list, and execute permissions. 

The channel name will now be the blob SAS URL that is generated from this process.  

## Create a sample Conda environment configuration file
Last, verify the installation process by creating a sample Conda ```environment.yml``` file. If you have in a DEP enabled workspace, you must specify the ``nodefaults`` channel in your environment file.

Here is an example Conda configuration file:
```
name: sample 
channels: 
  - https://<<storage account name>>.blob.core.windows.net/privatechannel/channel?<<SAS Token>
  - nodefaults 
dependencies: 
  - openssl 
  - ncurses 
```
Once you've created the sample Conda file, you can create a virtual Conda environment. 

```
conda env create –file sample.yml  
source activate env 
conda list 
```
Now that you've verified your custom channel, you can use the [Python pool management](./apache-spark-manage-python-packages.md) process to update the libraries on your Apache Spark pool.

## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Manage Python packages: [Python package management](./apache-spark-manage-python-packages.md)

