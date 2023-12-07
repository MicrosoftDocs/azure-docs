---
title: Create custom Conda channel for package management
description: Learn how to create a custom Conda channel for package management
author: shuaijunye
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 07/07/2022
ms.author: shuaijunye
ms.subservice: spark
---

# Create a custom Conda channel for package management 
When installing Python packages, the Conda package manager uses channels to look for packages. You may need to create a custom Conda channel for various reasons. For example, you may find that:

- your workspace is data exfiltration protected and outbound connections are blocked.  
- you have packages that you don't want to upload to public repositories.
- you want to set up an alternate repository for the users within your workspace.

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
sudo chmod 777 -R /usr/lib/anaconda3  
```

4. To create a similar environment to what is created available in the Azure Synapse runtime, you may download [this template](https://github.com/Azure-Samples/Synapse/blob/main/Spark/Python/base_environment.yml). There may be slight differences between the template and the actual Azure Synapse Environment. Once downloaded, you can run the following command:
```
apt-get -yq install gcc g++
conda env update --prune -f base_environment.yml
```

## Mount the storage account onto your machine
Next, we will mount the Azure Data Lake Storage  Gen2 account onto your local machine. This process can also be done with a WASB account; however, we will go through an example for the  ADLSg2 account 
 
For more information on how to mount the storage account on your local machine, you can visit [this page](https://github.com/Azure/azure-storage-fuse#blobfuse). 

1. You can install blobfuse from the Linux Software Repository for Microsoft products.

```
wget https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb 
sudo dpkg -i packages-microsoft-prod.deb 
sudo apt-get update 
sudo apt-get install blobfuse fuse 
export AZURE_STORAGE_ACCOUNT=<storage-account-name>
export AZURE_STORAGE_SAS_TOKEN="<SAS>" 
export AZURE_STORAGE_BLOB_ENDPOINT=*.dfs.core.windows.net
```

2. Create your mountpoint (```mkdir /path/to/mount```) and mount a Blob container with blobfuse. In this example, let's use the value **privatechannel** for the **mycontainer** variable.
   
```
sudo mkdir /home/trusted-service-user/privatechannel 
sudo mkdir -p /mnt/blobfusetmp 
blobfuse /home/trusted-service-user/privatechannel --container-name=privatechannel --tmp-path=/mnt/blobfusetmp --use-adls=true --log-level=LOG_DEBUG 
sudo chown trusted-service-user /mnt/blobfusetmp 
```
## Create the channel
In the next set of steps, we will create a custom Conda channel.

1. On your local machine, create a directory to organize all the packages for your custom channel. Organize all the ```tar.bz2``` packages from https://repo.anaconda.com/pkgs/main/linux-64/ into the subdirectory. Be sure to also include all dependent tar.bz2 packages as well.
   
```

cd ~/privatechannel/ 
mkdir -p channel/linux64 

<Add all .tar.bz2 from https://repo.anaconda.com/pkgs/main/linux-64/> 
// Note: Add all dependent .tar.bz2 as well 

cd channel 
mkdir noarch 
echo '{}' > noarch/repodata.json 
bzip2 -k noarch/repodata.json 

// Create channel 
conda index channel/noarch 
conda index channel/linux-64 
conda index channel
```

2. Now, you may check the storage account where your ```privatechannel/channel``` directory would have been created.

>[!Note]
> Conda does not honor the SAS token associated to a container. Therefore, you must mark the container "privatechannel" as public access.


For more information, you can also [visit the Conda user guide](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/create-custom-channels.html) to creating custom channels. 

## Storage account permissions
Now, we will need to validate the permissions on the storage account. To set these permissions, navigate to the path where custom channel will be created. Then, create a SAS token for ```privatechannel``` that has read, list, and execute permissions. 

The channel name will now be the blob SAS URL that is generated from this process.  

## Create a sample Conda environment configuration file
Last, verify the installation process by creating a sample Conda ```environment.yml``` file. If you have in a data exfiltration protection enabled workspace, you must specify the ``nodefaults`` channel in your environment file.

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
Once you've created the sample Conda file, you can create a virtual Conda environment. You can verify this locally by running the following commands:

```
conda env create --file sample.yml  
source activate env 
conda list 
```
Now that you've verified your custom channel, you can use the [Python pool management](./apache-spark-manage-pool-packages.md#manage-packages-from-synapse-studio-or-azure-portal) process to update the libraries on your Apache Spark pool.

## Next steps
- View the default libraries: [Apache Spark version support](apache-spark-version-support.md)
- Manage Session level Python packages: [Python package management on Notebook Session](./apache-spark-manage-session-packages.md#session-scoped-python-packages)
