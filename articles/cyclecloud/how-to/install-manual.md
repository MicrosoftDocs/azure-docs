---
title: CycleCloud Manual Installation
description: Review instructions on installing CycleCloud manually. Get information about system requirements, SSH keys, installation, configuration, and updating.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Manual installation

You can install Azure CycleCloud with an [ARM template](~/articles/cyclecloud/how-to/install-arm.md), through [Azure Marketplace](~/articles/cyclecloud/qs-install-marketplace.md), or by using a container in the [Azure Container Registry](~/articles/cyclecloud/how-to/run-in-container.md). We recommend installing with the Azure Marketplace image. However, for some production situations, manually installing CycleCloud as described in this article might be useful.

> [!NOTE]
> The CycleCloud product includes many components, such as the node configuration software known as [Jetpack](~/articles/cyclecloud/jetpack.md), and an installable webserver platform called CycleServer. Because of this architecture, you see references to CycleServer in many commands and directory names on the machine where you install the CycleCloud server.

## System requirements

To install CycleCloud, you must have administrator (root) rights. In addition, your system needs to meet the following minimum requirements:

* A 64-bit Linux distribution
* Java Runtime Environment (version 8)
* At least 8 GB of RAM (16 GB recommended)
* Four or more CPU cores
* At least 250 GB of free disk space

> [!NOTE]
> You can install CycleCloud on physical or virtualized hardware.

## SSH key

The default SSH key used in CycleCloud is **/opt/cycle_server/.ssh/cyclecloud.pem**. If this key doesn't already exist, CycleCloud automatically generates it when it starts up (or restarts).

## Installation

To determine your Linux distribution, run the following command:

```bash
cat /etc/lsb-release
```

If the `/etc/os-release` file exists, its contents show if your distribution is Debian-based, like Ubuntu. If the file doesn't exist, run this command:

```bash
cat /etc/redhat-release
```

If the `/etc/redhat-release` file exists, its contents show if your distribution is Enterprise-Linux based, like RedHat Enterprise Linux or Alma Linux.

### Installing on Debian or Ubuntu

First, download the Microsoft signing key and add it to Apt's trusted keyring:

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
:::

::: moniker range="=cyclecloud-8"
```bash
sudo apt-get -y -q install cyclecloud8
```
:::

> [!NOTE]
> The CycleCloud Apt repository distribution release for Ubuntu family platform uses a floating "stable" moniker. CycleCloud officially supports all Ubuntu LTS releases that Canonical supports. The CycleCloud package files don't target a specific version of GLIBC (GNU C Library) or Ubuntu release.

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

Download the [Azure CycleCloud install file](https://www.microsoft.com/download/details.aspx?id=57182) from the Microsoft Download Center and install it using a package manager.

For the .rpm install file:

```bash
yum install <filename.rpm>
```

For the .deb install file:

```bash
dpkg -i <filename.deb>
```

> [!NOTE]
>You must have write permission to the _/opt_ directory. The CycleCloud installer creates a `cycle_server` user and Unix group. It installs into the _/opt/cycle_server_ directory by default and assigns `cycle_server:cycle_server` ownership to the directory.

When the installer finishes running, it provides a link to complete the installation from your browser. Copy the link into your web browser and follow the configuration steps.
::: moniker-end

### Insiders builds

CycleCloud Insiders builds are available for prerelease feature testing. Insiders builds might contain unresolved issues. Note: the Insiders builds aren't labeled differently than production builds; they're just early release candidates.

The following steps add the Insiders repository to give you access to Insiders builds. When you run this command on a machine, installing or upgrading the package gets the latest version from the Insiders repository. You don't need to add both the standard and Insiders repositories because the latest Insiders build is either the same as or newer than the latest standard build.

These instructions switch to only using Insiders builds. To switch back, follow the [preceding installation instructions](#installation).

### Debian/Ubuntu

To install the Insiders build on Debian or Ubuntu, run the following command:

```bash
echo "deb [signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/cyclecloud-insiders stable main" |
  sudo tee /etc/apt/sources.list.d/cyclecloud.list > /dev/null
sudo apt-get -qq update 
```

This command is the same as the [standard installation steps](#installing-on-debian-or-ubuntu) but uses [https://packages.microsoft.com/repos/cyclecloud-insiders/pool/main/c/cyclecloud8/](https://packages.microsoft.com/repos/cyclecloud-insiders/pool/main/c/cyclecloud8/) instead.

### Enterprise Linux

To install the Insiders build on Enterprise Linux, run the following command:

```bash
cat | sudo tee /etc/yum.repos.d/cyclecloud.repo > /dev/null <<EOF
[cyclecloud]
name=cyclecloud
baseurl=https://packages.microsoft.com/yumrepos/cyclecloud-insiders
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF
```

This command is the same as the [standard installation steps](#installing-on-enterprise-linux-rhel-clones) but uses [https://packages.microsoft.com/yumrepos/cyclecloud-insiders/](https://packages.microsoft.com/yumrepos/cyclecloud-insiders/) instead.

### Notes on security

The default installation of CycleCloud uses non-encrypted HTTP running on port 8080. We strongly recommend [configuring SSL](ssl-configuration.md) for all installations.

Don't install CycleCloud on a shared drive or any drive where non-admin users have access. Anyone with access to the CycleCloud group can access non-encrypted data. We recommend that you don't add non-admin users to this group.

> [!NOTE]
> You can customize the default CycleCloud configuration for specific environments by using settings in the $CS_HOME/config/cycle_server.properties file.

## Configuration

After installation, you can configure CycleCloud through your web browser. The sign-in screen loads after the webserver fully initializes, which can take several minutes.

### Step 1: Welcome

::: moniker range="=cyclecloud-7"
![Welcome Screen](../images/version-7/setup-step1.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Welcome Screen](../images/version-8/setup-step1.png)
::: moniker-end

Enter a **Site Name** and select **Next**.

### Step 2: License Agreement

::: moniker range="=cyclecloud-7"
![License Screen](../images/version-7/setup-step2.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![License Screen](../images/version-8/setup-step2.png)
::: moniker-end

Accept the license agreement and then select **Next**.

### Step 3: Administrator Account

::: moniker range="=cyclecloud-7"
![Administrator Account setup](../images/version-7/setup-step3.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Administrator Account setup](../images/version-8/setup-step3.png)
::: moniker-end


Set up the local administrator account for CycleCloud. Use this account to administer the CycleCloud application. It's not an operating system account. Enter a **User ID**, **Name**, and **Password**, and then select **Done** to continue.

> [!NOTE]
> All CycleCloud account passwords must be between 8 and 123 characters long. They must meet at least three of the following four conditions:
> * Contain at least one uppercase letter
> * Contain at least one lowercase letter
> * Contain at least one number
> * Contain at least one special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?

### Step 4: Set Your SSH Key

After you set up your administrator account, set your SSH public key so you can easily access any Linux machines that CycleCloud starts. To set your SSH public key, go to **My Profile** under the user menu in the top right and choose **Edit Profile**. [Learn about creating SSH keys here.](/azure/virtual-machines/linux/mac-create-ssh-keys)

## Update CycleCloud

See the [Update Azure CycleCloud](~/articles/cyclecloud/how-to/upgrade-and-migrate.md) page.
