---
title: CycleCloud Manual Installation
description: Review instructions on installing CycleCloud manually. Get information about system requirements, SSH keys, installation, configuration, and updating.
author: adriankjohnson
ms.date: 02/20/2020
ms.author: adjohnso
---

# Manual Installation

Azure CycleCloud can be installed using an [ARM template](~/articles/cyclecloud/how-to/install-arm.md), via [Azure Marketplace](~/articles/cyclecloud/qs-install-marketplace.md) or using a container in the [Azure Container Registry](~/articles/cyclecloud/how-to/run-in-container.md). We recommend installing using the Azure Marketplace image, but for some production situations it may be useful to manually install CycleCloud as outlined below.

> [!NOTE]
> The CycleCloud product encompasses many pieces, including node configuration software known as [Jetpack](~/articles/cyclecloud/jetpack.md), and a installable webserver platform called CycleServer. Because of this, you will find CycleServer referenced in many commands and directory names on the machine where the CycleCloud server is installed.

## System Requirements

To install CycleCloud, you must have administrator (root) rights. In addition, your system needs to meet the following minimum requirements:

* A 64-bit Linux distribution
* Java Runtime Environment (version 8)
* At least 8GB of RAM (16GB recommended)
* Four or more CPU cores
* At least 250GB of free disk space

> [!NOTE]
> CycleCloud may be installed on physical or virtualized hardware.

## SSH Key

The default SSH key used in CycleCloud is */opt/cycle_server/.ssh/cyclecloud.pem*. If this does not already exist, it will be automatically generated upon startup (or restart) of CycleCloud.

## Installation

To determine what Linux distro you are using, run the following command:

```bash
cat /etc/lsb-release
```

If this file exists, the contents will indicate if it is a Debian-based distro like Ubuntu. If it does not exist, run this command:

```bash
cat /etc/redhat-release
```

If this file exists, the contents will indicate if it is an Enterprise-Linux based distro like RedHat Enterprise Linux or Alma Linux.

### Installing on Debian or Ubuntu

First, download the Microsoft signing key and add to Apt's trusted keyring:

```bash
sudo apt-get -qq update && sudo apt-get -y -qq install curl gnupg2
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc |
  gpg --dearmor | sudo tee /etc/apt/keyrings/microsoft.gpg > /dev/null
sudo chmod go+r /etc/apt/keyrings/microsoft.gpg

```

Then, configure Apt to pull from the CycleCloud repository:

```bash
echo "deb [signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/cyclecloud stable main" |
  sudo tee /etc/apt/sources.list.d/cyclecloud.list > /dev/null
sudo apt-get -qq update 
```

Finally, install CycleCloud with `apt`:

::: moniker range="<=cyclecloud-7"
```bash
sudo apt -y install cyclecloud
```
::: moniker-end
::: moniker range="=cyclecloud-8"

```bash
sudo apt-get -y -q install cyclecloud8
```

::: moniker-end

> [!NOTE]
> The CycleCloud Apt repository distribution release for Ubuntu family platform uses a floating "stable" moniker. CycleCloud is officially supported on all Ubuntu LTS releases under support by Canonical. The CycleCloud package files are not specific to a version of GLIBC (GNU C Library) or Ubuntu release.

### Installing on Enterprise Linux (RHEL) clones

First, configure a _cyclecloud.repo_ file:

```bash
cat | sudo tee /etc/yum.repos.d/cyclecloud.repo > /dev/null <<EOF
[cyclecloud]
name=cyclecloud
baseurl=https://packages.microsoft.com/yumrepos/cyclecloud
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
```

Finally, install cyclecloud with `yum` (or `dnf`):

::: moniker range="<=cyclecloud-7"
```bash
sudo yum -y install cyclecloud
```
::: moniker-end
::: moniker range="=cyclecloud-8"

```bash
sudo yum -y -qq install cyclecloud8
```
::: moniker-end

::: moniker range="<=cyclecloud-7"
### Installing from the Microsoft Download center

Download the [Azure CycleCloud install file](https://www.microsoft.com/download/details.aspx?id=57182) from the Microsoft Download Center and install using a package manager.

For the .rpm install file:

```bash
yum install <filename.rpm>
```

For the .deb install file:

```bash
dpkg -i <filename.deb>
```

> [!NOTE]
>You must have write permission to the _/opt_ directory. The CycleCloud installer will create a `cycle_server` user and unix group, install into the _/opt/cycle_server_ directory by default, and assign `cycle_server:cycle_server` ownership to the directory.

Once the installer has finished running, you will be provided a link to complete the installation from your browser. Copy the link provided into your web browser and follow the configuration steps.
::: moniker-end

### Insiders Builds

CycleCloud Insiders builds are available for pre-release feature testing. Insiders builds may contain unresolved issues. Note: the Insiders builds are not labeled differently than production builds; they are just early release candidates.

The steps below will add the Insiders repository to provide access to Insiders builds. Once you run this on a machine, installing or upgrading the package will pull the latest from the Insiders repository. There is no need to have both the standard and Insiders repositories added, because the latest Insiders build is either the same as, or newer than, the latest standard build.

Note that these instructions switch to only using Insiders builds. You can switch back by following the [above Installation instructions](#installation).

### Debian/Ubuntu

To install the Insiders build on Debian or Ubuntu, run the following:

```bash
echo "deb [signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/cyclecloud-insiders stable main" |
  sudo tee /etc/apt/sources.list.d/cyclecloud.list > /dev/null
sudo apt-get -qq update 
```

This is the same as the [standard installation steps above](#installing-on-debian-or-ubuntu) but with [https://packages.microsoft.com/repos/cyclecloud-insiders/pool/main/c/cyclecloud8/](https://packages.microsoft.com/repos/cyclecloud-insiders/pool/main/c/cyclecloud8/) instead.

### Enterprise Linux

To install the Insiders build on Enterprise Linux, run the following:

```bash
cat | sudo tee /etc/yum.repos.d/cyclecloud.repo > /dev/null <<EOF
[cyclecloud]
name=cyclecloud
baseurl=https://packages.microsoft.com/yumrepos/cyclecloud-insiders
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
```

This is the same as the [standard installation steps above](#installing-on-enterprise-linux-rhel-clones) but with [https://packages.microsoft.com/yumrepos/cyclecloud-insiders/](https://packages.microsoft.com/yumrepos/cyclecloud-insiders/) instead.

### Notes on Security

The default installation of CycleCloud uses non-encrypted HTTP running on port 8080. We strongly recommend [configuring SSL](ssl-configuration.md) for all installations.

Do not install CycleCloud on a shared drive, or any drive in which non-admin users have access. Anyone with access to the CycleCloud group will gain access to non-encrypted data. We recommend that non-admin users not be added to this group.

> [!NOTE]
> The default CycleCloud configuration may be customized for specific environments using settings in the $CS_HOME/config/cycle_server.properties file.

## Configuration

Once installed, you can configure CycleCloud through your web browser. The login screen will load after the webserver has fully initialized, which can take several minutes.

### Step 1: Welcome

::: moniker range="=cyclecloud-7"
![Welcome Screen](../images/version-7/setup-step1.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Welcome Screen](../images/version-8/setup-step1.png)
::: moniker-end

Enter a **Site Name** then click **Next**.

### Step 2: License Agreement

::: moniker range="=cyclecloud-7"
![License Screen](../images/version-7/setup-step2.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![License Screen](../images/version-8/setup-step2.png)
::: moniker-end

Accept the license agreement and then click **Next**.

### Step 3: Administrator Account

::: moniker range="=cyclecloud-7"
![Administrator Account setup](../images/version-7/setup-step3.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Administrator Account setup](../images/version-8/setup-step3.png)
::: moniker-end


You will now set up the local administrator account for CycleCloud. This account is used to administer the CycleCloud application - it is NOT an operating system account. Enter a **User ID**, **Name** and **Password**, then click **Done** to continue.

> [!NOTE]
> All CycleCloud account passwords must be between 8 and 123 characters long, and meet at least 3 of the following 4 conditions:
> * Contain at least one upper case letter
> * Contain at least one lower case letter
> * Contain at least one number
> * Contain at least one special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?

### Step 4: Set Your SSH Key

Once you have set up your administrator account, you can set your SSH public key so that you can easily access any Linux machines started by CycleCloud. To set your SSH public key, go to **My Profile** under the user menu in the top right and choose **Edit Profile**. [Learn about creating SSH keys here.](/azure/virtual-machines/linux/mac-create-ssh-keys)

## Update CycleCloud

See the [Update Azure CycleCloud](~/articles/cyclecloud/how-to/upgrade-and-migrate.md) page.
