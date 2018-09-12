---
title: Azure CycleCloud Tutorial - Deploy a New Application to an HPC Cluster | Microsoft Docs
description: In this tutorial, you will use a project to install a custom application to your cluster.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: tutorial
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud Tutorial: Deploy a New Application to an HPC Cluster

This tutorial shows how to use a CycleCloud project to install a custom application on every node of a cluster. By the end of this exercise, you will:

* Use [CycleCloud projects](~/projects.md) to install a custom application
* Stage application installation files in the project's *blobs* directory
* Write a script that is executed on every cluster node as it boots
* Start a new cluster that uses the new project

Azure CycleCloud's projects are used to customize cluster templates, but they can also be used for complex cluster configuration tasks such as customizing a VM during the configuration process.

## Prerequisites

For this tutorial, you will need:

1. An Azure account with an active subscription.
2. Azure CycleCloud set up on your Azure account.
3. [CycleCloud CLI](~/install-cyclecloud-cli.md) installed and configured.
3. A Shell session in a terminal.
  * If you are using a Windows machine, use the [browser-based Bash shell](https://shell.azure.com).
  * For non-Windows machines, install and use Azure CLI v2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

[!INCLUDE [cloud-shell-try-it.md](~/includes/cloud-shell-try-it.md)]

## Customizing Cluster Nodes

When provisioning a VM as a cluster node, there are often configuration steps that need to be performed during the VM boot process. These steps can range from configuring application path environment variables to more complicated tasks such as binding a node to an Active Directory domain. While Azure CycleCloud supports the use of custom images with baked-in applications, it's not unusual to install the applications as part of the node preparation stage. Doing the installations during the node prep will save considerable time, as you won't need to create a new custom image for every variation of the application or application version. 

This tutorial illustrates how you could use CycleCloud Projects to install [Salmon](https://combine-lab.github.io/salmon/), a popular bioinformatics application that is used for quantifying RNA in RNA sequencing experiments.

## CycleCloud Projects

[CycleCloud Project](~/projects.md) consists of three main components: templates, specs, and blobs.

* **Templates** define the architecture of the CycleCloud cluster. They dictate how the nodes of a cluster are laid out, and how each node is configured.
* **Specs** define the configuration of each node. These configuration steps are captured in scripts. You can have no specs or multiple specs assigned to each node in a cluster template.
* **Blobs** are collections of files that can be accessed by all cluster nodes configured to use a spec of a project. Application installers and sample test data are stored in blobs.

## Installing Salmon using CycleCloud Projects

> [!NOTE]
> The recommended process for installing Salmon is using [Bioconda](https://bioconda.github.io/), a Conda channel for packaging bioinformatics tools. Azure CycleCloud comes with an Anaconda project/cluster type that makes this process simple. However, for the purposes of this tutorial, we will set up and install Salmon from scratch.

### Set Up a New Project

If you completed the tutorial on [modifying cluster templates](modify-cluster-template.md), you should already have a `cyclecloud_projects` sub-directory in your home directory. If not, create this directory now with the `mkdir` command. This directory can be used as the base directory for all projects. Go into the directory and initialize a new project named `salmon`. Specify azure-storage as the default locker.

```azurecli-interactive
cd cyclecloud_projects
cyclecloud project init salmon
```

Move into the new project directory. It will contain three sub-directories, one for each component of a CycleCloud project: `blobs`, `specs`, and `templates`. A `project.ini` file containing project properties is also created.

### Stage the Salmon Installer

In the `blobs` directory, download the Salmon installation file:

```azurecli-interactive
wget -q https://github.com/COMBINE-lab/salmon/releases/download/v0.11.2/salmon-0.11.2-linux_x86_64.tar.gz
```

Return to the Salmon project directory (`cd ..`) and open the `project.ini` file in Cloud Shell editor:

```azurecli-interactive
code project.ini
```

Add the following to the file:

``` project.ini
[project]
version = 1.0.0
name = salmon
type = application

[blobs]
files = salmon-0.11.2-linux_x86_64.tar.gz
```

The addition to the `project.ini` file defined the project type as `application` and the location of the required installation file within the `blobs` directory. Save the file and exit the editor.

## Specs

The `specs` directory contains specifications of a project, and can contain one or more specs. For example, a project may have a default spec that contains configurations steps meant to be performed on every node of a cluster, and also a master spec that contains scripts meant to only be invoked on the cluster's headnode.

A `default` spec is automatically created in each new CycleCloud project. Within each spec are two sub-directories: `chef` and `cluster-init`

The `chef` directory holds [Chef](https://docs.chef.io/chef_overview.html) cookbooks and recipes that can be used in configuring nodes.

The `cluster-init` directory contains three sub-directories: `files`, `scripts`, and `tests`.

* **files** contains small files that are downloaded into every cluster node using this spec.
* **scripts** has collections of scripts that are executed on each node using this spec when the node boots.
* **tests** contains test scripts used to validate the successful deployment of a spec.

### Create a New Script

Create a new script named `10.install_salmon.sh` inside the `default/cluster-init/scripts` directory.

> [!NOTE]
> We use "[here documents](https://en.wikipedia.org/wiki/Here_document)" to simplify the creation of new files.

To create the script file, copy the lines below and paste it into Cloud Shell. Alternatively, you could use a text editor to create and edit the file.

``` script
cat << EOF > ./10.install_salmon.sh
#!/bin/bash
set -ex

# make a /mnt/resource/apps directory
# Azure VMs that have ephemeral storage have that mounted at /mnt/resource. If that does not exist this command will create it.
mkdir -p /mnt/resource/apps

# Create tempdir
tmpdir=$(mktemp -d)

# download salmon installer into tempdir and unpack it into the apps directory
pushd $tmpdir
SALMON_VERSION=0.11.2
jetpack download "salmon-${SALMON_VERSION}-linux_x86_64.tar.gz"
tar xf salmon-${SALMON_VERSION}-linux_x86_64.tar.gz -C /mnt/resource/apps

# make the salmon install dir readable by all
chmod -R a+rX /mnt/resource/apps/salmon-${SALMON_VERSION}-linux_x86_64

#clean up
popd
rm -rf $tmpdir
EOF
```

### Stage Files on Every Node

It is sometimes useful to stage small files on every node of a cluster, such as application configuration parameters or license files. In this step, you will use cluster-init to stage environment files in `/etc/profile.d` of each node so that the `salmon` binary will be in the path of every user.

Create a new script called `20.add_salmon_to_path.sh` in the scripts directory of the default spec `salmon/specs/default/cluster-init/scripts/`:

``` script
cat << EOF > ./20.add_salmon_to_path.sh
#! /bin/bash

# create a symlink to the salmon directory
SALMON_VERSION=0.11.2
ln -s /mnt/resource/apps/salmon-${SALMON_VERSION}-linux_x86_64 /mnt/resource/apps/salmon

# add the profile files into /etc/profile.d
cp $CYCLECLOUD_SPEC_PATH/files/salmon.sh /etc/profile.d/
cp $CYCLECLOUD_SPEC_PATH/files/salmon.csh /etc/profile.d/

# make sure both are readable and executable
chmod a+rx /etc/profile.d/salmon.*
EOF
```

Next, move to the `files` directory and create two files, `salmon.sh` and `salmon.csh`:

``` script
cat << EOF > ./salmon.sh
#!/bin/sh
export PATH=$PATH:/mnt/resource/apps/salmon/bin
EOF
```

``` script
cat << EOF > ./salmon.csh
#!/bin/csh
setenv PATH $PATH\:/mnt/resource/salmon/bin
EOF
```

Review the files in the salmon project's default spec. The `scripts` directory should contain `10.install_salmon.sh`, `20.add_salmon_to_path.sh`, and `README.txt`. In `files`, you should see `README.txt`, `salmon.csh`, and `salmon.sh`.

### Upload the Project

One of the steps in setting up a new Azure CycleCloud installation is the creation of an Azure storage account and an accompanying blob container. This container is the *locker* that the CycleCloud server uses to stage CycleCloud projects for cluster nodes. CycleCloud cluster nodes orchestrated by this CycleCloud server are configured to download CycleCloud projects from this locker as part of the boot-up process of the node.

A storage account and container was created when you installed and set up CycleCloud. To see the locker, use the `cyclecloud locker list` command:

``` example
ellen@Azure:~/cyclecloud_projects/salmon/specs/default/cluster-init$ cd
ellen@Azure:~$ cyclecloud locker list
azure-storage (az://cyclecloudcbekjhvzjrzswz/cyclecloud)
ellen@Azure:~$
```

In the above example, the storage account name is `cyclecloudcbekjhvzjrzswz` and the blob container name is `cyclecloud`.

The `cyclecloud project upload` command packages up the contents of the project and uploads it into the locker. To do this, it needs to have credentials to access the blob container associated with the locker. You could [create an SAS key](https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-generate-sas), or you can use a previously-created service principal. To do this,
edit the cyclecloud configuration file:

```azurecli-interactive
code ~/.cycle/config.ini
```

Add the section below, filling in the `subscription_id`, `tenant_id`, `application_id`, and `application_secret` with the appropriate information. As well, replace the storage account name below with the name retrieved above:

``` config.ini
[pogo azure-storage]
type = az
subscription_id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
tenant_id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
application_id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
application_secret = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
matches = az://xxxxxxxxxxxxxxxxxxx/xxxxxxxxxxxxx
```

Your `~/.cycle/config.ini` should now look similar to this:

![config.ini file](~/images/cyclecloud-config-ini.png)

Finally, upload the project from its directory with `cyclecloud project upload`.

## Create a New Cluster with the Salmon Project

Having uploaded the salmon project into the CycleCloud locker, you can now create a new cluster in CycleCloud and specify that each node should use the `salmon:default` spec. For this tutorial, we will use Grid Engine as the base scheduler.

From the Cluster page of your Azure CycleCloud web portal, use the "+" symbol in the bottom-left-hand corner of the page to add a new Grid Engine cluster:

![New Grid Engine cluster screen](~/images/new-gridengine-cluster.png)

Give the cluster a descriptive name and complete the Required Settings screen.

Under **Software** on the Advanced Settings screen, **browse** for the Master Cluster-Init file:

![Advanced Settings screen](~/images/browse-specs.png)

In the file browser, double click on the `salmon/` folder, then the `1.0.0/` folder. Click once on the `default/` folder to highlight it, and click the **Select** button. This will tell your cluster to use the `default` spec of version `1.0.0` of the project `salmon`.

Repeat this step for the Execute Cluster-Init. When finished, your Advanced Settings screen should look like this:

![salmon specs selected](~/images/salmon-specs-selected.png)

Save your cluster and start it up. When the master node turns green, [log into it](~/connect-to-master-node.md) and verify that `salmon` has been installed:

``` output
ellen@Azure:~$ ssh ellen@40.117.78.137

 __        __  |    ___       __  |    __         __|
(___ (__| (___ |_, (__/_     (___ |_, (__) (__(_ (__|
        |

Cluster: SalmonCluster
Version: 7.5.0
Run List: recipe[cyclecloud], role[central_manager], role[application_server], role[sge_master_role], role[scheduler], role[monitor], recipe[cluster_init]
[ellen@ip-0A000404 ~]$ salmon
salmon v0.11.2

Usage:  salmon -h|--help or
        salmon -v|--version or
        salmon -c|--cite or
        salmon [--no-version-check] <COMMAND> [-h | options]

Commands:
    index Create a salmon index
    quant Quantify a sample
    alevin single cell analysis
    swim  Perform super-secret operation
    quantmerge Merge multiple quantifications into a single file
```

## Next Steps

In this tutorial, you learned how to:

* Use [CycleCloud projects](~/projects.md) to install a custom application
* Stage application installation files in the project's *blobs* directory
* Write a script that is executed on every cluster node as it boots
* Start a new cluster that uses the new project

Return to the Azure CycleCloud documentation home for additional tutorials and documentation.

To continue exploring the features of Azure CycleCloud, try the Deploy a Custom Application tutorial.

> [!div class="nextstepaction"]
> [Next Tutorial](~/tutorials/modify-cluster-template.md)
