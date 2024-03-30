---
title: Update the Azure Linux Agent from GitHub
description: Learn how to update Azure Linux Agent for your Linux VM in Azure
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.custom: linux-related-content
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 02/03/2023
---
# How to update the Azure Linux Agent on a VM

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

To update your [Azure Linux Agent](https://github.com/Azure/WALinuxAgent) on a Linux VM in Azure, you must already have:

- A running Linux VM in Azure.
- A connection to that Linux VM using SSH.

You should always check for a package in the Linux distro repository first. It's possible the package available may not be the latest version, however, enabling autoupdate will ensure the Linux Agent will always get the latest update. Should you have issues installing from the package managers, you should seek support from the distro vendor.

> [!NOTE]
> For more information, see [Endorsed Linux distributions on Azure](../linux/endorsed-distros.md)

Verify the [Minimum version support for virtual machine agents in Azure](https://support.microsoft.com/help/4049215/extensions-and-virtual-machine-agent-minimum-version-support) before proceeding.

# [Ubuntu](#tab/ubuntu)

1. Check your current package version

```bash
sudo apt list --installed | grep walinuxagent
```

2. Update package cache

```bash
sudo apt-get -qq update
```

3. Install the latest package version

```bash
sudo apt-get install walinuxagent
```

4. Ensure auto update is enabled.

- First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

- Find 'AutoUpdate.Enabled'. If you see this output, it's enabled:

```config
AutoUpdate.Enabled=y
```

- To enable it, run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=y/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

5. Restart the waagent service

```bash
sudo systemctl restart walinuxagent
```

6. Validate waagent service is up and running

```bash
sudo systemctl status walinuxagent
```

# [Red Hat / CentOS](#tab/rhel)

1. Check your current package version

```bash
sudo yum list WALinuxAgent
```

2. Check available updates

```bash
sudo yum check-update WALinuxAgent
```

3. Install the latest package version

```bash
sudo yum install WALinuxAgent -y
```

4. Ensure auto update is enabled

- First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

- Find 'AutoUpdate.Enabled'. If you see this text, it's enabled:

```config
AutoUpdate.Enabled=y
```

- To enable it, run:

```bash
sudo sed -i 's/\# AutoUpdate.Enabled=y/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

5. Restart the waagent service

```bash
sudo systemctl restart waagent
```

6. Validate waagent service is up and running

```bash
sudo systemctl status waagent
```

# [SLES](#tab/sles)

1. Check your current package version

```bash
sudo zypper info python-azure-agent
```

2. Check available updates. The above output will show you if the package is up to date.

3. Install the latest package version

```bash
sudo zypper install python-azure-agent
```

4. Ensure auto update is enabled

- First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

- Find 'AutoUpdate.Enabled'. If you see this output, it's enabled:

```config
AutoUpdate.Enabled=y
```

- To enable it, run:

```bash
sudo sed -i 's/AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

5. Restart the waagent service

```bash
sudo systemctl restart waagent
```

6. Validate waagent service is up and running

```bash
sudo systemctl status waagent
```

# [Debian](#tab/debian)

1. Check your current package version

```bash
sudo dpkg -l | grep waagent
```

2. Update package cache

```bash
sudo apt-get -qq update
```

3. Install the latest package version

```bash
sudo apt-get install waagent
```

4. Enable agent auto update.

- First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

- Find 'AutoUpdate.Enabled'. If you see this output, it's enabled:

```config
AutoUpdate.Enabled=y
```

- To enable it, run:

```bash
sudo sed -i 's/AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

5. Restart the waagent service:

```bash
sudo systemctl restart walinuxagent.service
```

6. Validate waagent service is up and running

```bash
sudo systemctl status walinuxagent
```

# [Oracle Linux](#tab/oraclelinux)

1. For Oracle Linux, make sure that the `Addons` repository is enabled.

    - To validate if the repository is enabled, use the following command

    ```bash
    sudo yum repolist all | grep -i addons
    ```

    - In case the `Addons` repository is disabled, you can enable it using the following command:

        - **Oracle Linux 6.x:**

        ```bash
        sudo yum-config-manager --enable ol6_addons
        ```

        - **Oracle Linux 7.x:**

        ```bash
        sudo yum-config-manager --enable ol7_addons
        ```

        - **Oracle Linux 8.x:**

         ```bash
        sudo yum-config-manager --enable ol8_addons
        ```

        - **Oracle Linux 9.x:**

         ```bash
        sudo yum-config-manager --enable ol9_addons
        ```

    - If you don't find the add-on repository, you can simply add these lines at the end of your `.repo` file according to your Oracle Linux release:

        - **For Oracle Linux 6 virtual machines:**

        ```config
        [ol6_addons]
        name=Add-Ons for Oracle Linux $releasever ($basearch)
        baseurl=https://public-yum.oracle.com/repo/OracleLinux/OL6/addons/x86_64
        gpgkey=https://public-yum.oracle.com/RPM-GPG-KEY-oracle-ol6
        gpgcheck=1
        enabled=1
        ```

        - **For Oracle Linux 7 virtual machines:**

        ```config
        [ol7_addons]
        name=Oracle Linux $releasever Add ons ($basearch)
        baseurl=http://public-yum.oracle.com/repo/OracleLinux/OL7/addons/$basearch/
        gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
        gpgcheck=1
        enabled=1
        ```

        - **For Oracle Linux 8 virtual machines:**

        ```config
        [ol8_addons]
        name=Oracle Linux $releasever Add ons ($basearch)
        baseurl=http://public-yum.oracle.com/repo/OracleLinux/OL8/addons/$basearch/
        gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
        gpgcheck=1
        enabled=1
        ```

        - **For Oracle Linux 9 virtual machines:**

        ```config
        [ol9_addons]
        name=Oracle Linux 9 Addons ($basearch)
        baseurl=https://public-yum.oracle.com/repo/OracleLinux/OL9/addons/$basearch/
        gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
        gpgcheck=1
        enabled=1
        ```

> [!IMPORTANT]
> Keep in consideration Oracle Linux 6.x is already EOL. Oracle Linux version 6.10 has available [ELS support](https://www.oracle.com/a/ocom/docs/linux/oracle-linux-extended-support-ds.pdf), which [will end on 07/2024](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

2. Then install the latest version of the Azure Linux Agent using the following command:

```bash
sudo yum install WALinuxAgent -y
```

3. Enable agent auto update.

- First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

- Find 'AutoUpdate.Enabled'. If you see this output, it's enabled:

```config
AutoUpdate.Enabled=y
```

- To enable it, run:

```bash
sudo sed -i 's/\# AutoUpdate.Enabled=y/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

4. Restart the waagent service:

```bash
sudo service waagent restart
```

5. Validate waagent service is up and running

```bash
sudo systemctl status waagent
```

- In case of issues, execute the following commands and validate the waagent status one more time:

```bash
sudo systemctl daemon-reload
sudo systemctl restart waagent
sudo systemctl status waagent
```

---

Typically this is all you need, but if for some reason you need to install it from https://github.com directly, use the following steps.

## Update the Linux Agent when no agent package exists for distribution
<!--
Install wget, there are some distros that don't install it by default, such as Red Hat, CentOS, and Oracle Linux versions 6.4 and 6.5.

### 1. Download the latest version

Open [the release of Azure Linux Agent in GitHub](https://github.com/Azure/WALinuxAgent/releases) in a web page, and find out the latest version number. (You can locate your current version by typing `waagent --version`.)

For version 2.2.x or later, type:

```bash
wget https://github.com/Azure/WALinuxAgent/archive/refs/tags/v2.2.x.zip
unzip v2.2.x.zip
cd WALinuxAgent-2.2.x
```

The following line uses version 2.2.14 as an example:

```bash
wget https://github.com/Azure/WALinuxAgent/archive/refs/tags/v2.2.14.zip
unzip v2.2.14.zip
cd WALinuxAgent-2.2.14
```

### 2. Install the Azure Linux Agent

1. For version 2.2.x, use:
You may need to install the package `setuptools` first--see [setuptools](https://pypi.python.org/pypi/setuptools). Then run:

```bash
sudo python setup.py install
```

2. Ensure auto update is enabled. First, check to see if it's enabled:

```bash
sudo cat /etc/waagent.conf | grep -i autoupdate
```

3. Find 'AutoUpdate.Enabled'. If you see this entry, it's enabled:

```config
AutoUpdate.Enabled=y
```

4. To enable it, run:

```bash
sudo sed -i 's/# AutoUpdate.Enabled=n/AutoUpdate.Enabled=y/g' /etc/waagent.conf
```

### 3. Restart the waagent service

For most of Linux distros:

```bash
sudo service waagent restart
```

For Ubuntu and Debian, use:

```bash
sudo service walinuxagent restart
```

### 4. Confirm the Azure Linux Agent version

```bash
sudo waagent -version
```

You'll see that the Azure Linux Agent version has been updated to the new version.
-->
For more information regarding updating the Azure Linux Agent when no package exists, see [Azure Linux Agent README](https://github.com/Azure/WALinuxAgent).
