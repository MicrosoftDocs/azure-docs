---
title: Azure CycleCloud Tutorial - Cluster Templates and Persistent Storage | Microsoft Docs
description: In this tutorial, you will modify a cluster template to add storage to the cluster's NFS server.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: tutorial
ms.date: 08/01/2018
ms.author: adjohnso
---

# Azure CycleCloud Tutorial: Modify a Cluster Template to Add Persistent Storage

This tutorial shows how to modify a standard HPC cluster to add persistent storage to the file system. At the end of this exercise, you will have:

* Installed and configured the Azure CycleCloud CLI
* Created a new CycleCloud [project](~/projects.md)
* Modified a cluster template to add storage to the cluster's NFS Server
* Added a new cluster type in CycleCloud

Azure CycleCloud's cluster types are great for standard use cases, but users often find themselves needing to customize the clusters for more advanced or differently configured deployments. In default Azure CycleCloud clusters, the master nodes are also NFS servers that provide a shared filesystem for other nodes in the cluster. Adding managed disks to a VM in a compute cluster is a very easy and commonly used customization in Azure CycleCloud.

## Prerequisites

For this tutorial, you will need:

1. An Azure account with an active subscription.
2. Azure CycleCloud set up on your Azure account.
3. A Shell session in a terminal.
  * If you are using a Windows machine, use the [browser-based Bash shell](https://shell.azure.com).
  * For non-Windows machines, install and use Azure CLI v2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](~/includes/cloud-shell-try-it.md)]

## Install Azure CycleCloud CLI

Download the CycleCloud CLI installer with this command in your cloud shell:

```azurecli-interactive
wget https://cyclecloudarm.blob.core.windows.net/cyclecloudrelease/7.5.0/cyclecloud-cli.zip
```

The cloud shell will show you the progress of the download. When it is complete, unzip the file:

```azurecli-interactive
unzip cyclecloud-cli.zip
```

After all the files have been unpacked, navigate to the install directory with `cd cyclecloud-cli-installer` then run the script:

```azurecli-interactive
./install.sh
```

> [!NOTE]
> If you receive an error stating "/home/your-name/bin not found in your PATH environment variable", fix it with the following: `export PATH=$PATH:~/bin`.

Once the CLI has been installed, you'll need to connect it to your Azure CycleCloud server. The Azure CycleCloud CLI communicates with the server using a REST API, and must be initialized with your Azure CycleCloud server:

1. Initialize the server with `cyclecloud initialize`. You will be prompted for the CycleServer URL, which is the FQDN of your application server. Enter it in the format **https://FQDN**.
2. The installed Azure CycleCloud server uses either a Let's Encrypt SSL certificate, or a self-signed certificate. Type `yes` when asked to allow the certificate.
3. Log in with the same username and password used for the CycleCloud web interface.
4. Test that the CycleCloud CLI is working with `cyclecloud show_cluster`.

## Create a New CycleCloud Project

Azure CycleCloud clusters are defined using text files. In this next step, you will create a new CycleCloud Project and generate a template from it.

1. Create a directory for the project with `mkdir ~/cyclecloud_projects/` and move to that directory.
2. Initiate a new project with `cyclecloud project init [project-name]`. For example, you can use:

```azurecli-interactive
cyclecloud project init azurecyclecloud_tutorial
```

When prompted for a Default Locker, specify `azure-storage`. The shell will confirm that your project has been created.

The `cyclecloud project init` command creates a new directory structure, and includes a `project.ini` file that defines attributes for the project. You will need to edit this file to specify your project as an *application*, which will allow CycleCloud to generate the appropriate template.

Edit the `project.ini` file to change the application type. If you are using Cloud Shell and would like a text editor with a GUI, run the following:

```azurecli-interactive
cd ~/cyclecloud_projects/azurecyclecloud_tutorial
code .
```

Add the line and enter `type = application` into the project.ini file, then save the changes.

## Generate a New Cluster Template File

Run the following command to create a new cluster template based on the modification you made to the project.ini file. You will need to specify a location for the output template:

```azurecli-interactive
cyclecloud project generate_template templates/extended_nfs.template.txt
```

## Add Volumes to the NFS Server

Once your new template file has been generated, you will edit it to add volumes to the file server. In Cloud Shell, use the following command:

```azurecli-interactive
code templates/extended_nfs.template.txt
```

**After** line 44, add the following blocks:

```
# Add 2 premium disks in a RAID 0 configuration to the NFS export
[[[volume nfs-1]]]
Size = 512
SSD = True
Mount = nfs
Persistent = true

[[[volume nfs-2]]]
Size = 512
SSD = True
Mount = nfs
Persistent = true

[[[configuration cyclecloud.mounts.nfs]]]
mountpoint = /mnt/exports
fs_type = ext4
raid_level = 0
```

Save your changes.

![Edit Cluster Template window](~/images/edit-cluster-template.png)

The lines added tell CycleCloud that two premium 512 GB disks (SSD = True) with a RAID 0 config should be added to the master node when it is provisioned, then mount the volume at `/mnt/exports/` and format the lot as an `ext4` filesystem.

The Persistent = true tag indicates that the two managed disks will not be deleted when the cluster is terminated, but will be deleted if the cluster itself is deleted. You can find more information about customizing volumes and mounts in a CycleCloud cluster in our [Storage documentation](~/attach-storage.md).

## Import the New Cluster Template

In your shell, import the template into the application server:

```azurecli-interactive
cyclecloud import_template -f templates/extended_nfs.template.txt
```

Once it is complete, return to the CycleCloud web interface and create a new cluster. You should see the a new application type called azurecyclecloud_tutorial:

![New Cluster Type](~/images/new-cluster-type.png)

## Start the Cluster

Start a new cluster using your new application template. When selecting your Virtual Machine settings, ensure you choose one that supports attached premium storage such as **Standard_D2s_v3**.

![VM Machine Type SSD Yes](~/images/SSD-VM.png)

When your cluster is up, log into the master node and verify that `/mnt/exports/` is a 1TB volume with:

```azurecli-interactive
df -h /mnt/exports
```

You should see something similar to the following:

``` output
Filesystem                         Size  Used Avail Use% Mounted on
/dev/mapper/vg_cyclecloud_nfs-lv0  1.1T   80M  1.1T   1% /mnt/exports
```

## Next Steps

In this tutorial, you learned how to:

* Install and configure the Azure CycleCloud CLI
* Create a new CycleCloud [project](~/projects.md)
* Modify cluster template to add storage to the cluster's NFS Server
* Add a new cluster type in CycleCloud

To continue exploring the features of Azure CycleCloud, try the Deploy a Custom Application tutorial.

> [!div class="nextstepaction"]
> [Next Tutorial](~/tutorials/deploy-custom-application.md)
