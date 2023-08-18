---
title: Install IBM zD&T dev/test environment on Azure | Microsoft Docs
description: Deploy IBM Z Development and Test Environment (zD&T) on Azure Virtual Machine (VM) infrastructure as a service (IaaS).
services: virtual-machines
ms.service: virtual-machines
ms.subservice: mainframe-rehosting
documentationcenter:
author: swread
ms.author: sread
editor: swread
manager: mamccrea 
ms.topic: conceptual
ms.date: 04/02/2019
tags:
keywords:
---

# Install IBM zD&T dev/test environment on Azure

To create a dev/test environment for mainframe workloads on IBM Z Systems, you can deploy IBM Z Development and Test Environment (zD&T) on Azure Virtual Machine (VM) infrastructure as a service (IaaS).

With zD&T, you can take advantage of the cost savings of the x86 platform for your less critical development and test environments, and then push the updates back to a Z System production environment. For more information, see the [IBM ZD&T installation instructions](https://www-01.ibm.com/support/docview.wss?uid=swg24044565#INSTALL).

Azure and Azure Stack support the following versions:

- zD&T Personal Edition
- zD&T Parallel Sysplex
- zD&T Enterprise Edition

All editions of zD&T run only on x86 Linux systems, not Windows Server. Enterprise Edition is supported on either Red Hat Enterprise Linux (RHEL) or Ubuntu/Debian. Both RHEL and Debian VM images are available for Azure.

This article shows you how to set up zD&T Enterprise Edition on Azure so you can use the zD&T Enterprise Edition web server for creation and management of environments. Installing zD&T does not install any environments. You must create these separately as installation packages. For example, Application Developers Controlled Distributions (ADCD) are volume images of test environments. They are contained in zip images on the media distribution available from IBM. See how to [set up an ADCD environment on Azure](demo.md).

For more information, see the [zD&T Overview](https://www.ibm.com/support/knowledgecenter/en/SSTQBD_12.0.0/com.ibm.zdt.overview.gs.doc/topics/c_product_overview.html) in the IBM Knowledge Center.

This article shows you how to set up Z Development and Test Environment (zD&T) Enterprise Edition on Azure. Then you can use the zD&T Enterprise Edition web server to create and manage Z-based environments on Azure.

## Prerequisites

> [!NOTE]
> IBM allows zD&T Enterprise Edition to be installed in dev/test environments only—*not* production environments.

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- You need access to the media, which is available only to IBM customers and partners. For more information, contact your IBM representative or see the contact information on the [zD&T](https://www.ibm.com/us-en/marketplace/z-systems-development-test-environment) website.

- A [licensing server](https://www.ibm.com/support/knowledgecenter/en/SSTQBD_12.0.0/com.ibm.zsys.rdt.tools.user.guide.doc/topics/zdt_ee.html). This is required for access to the environments. The way you create it depends on how you license the software from IBM:

     - **Hardware-based licensing server** requires a USB hardware device that contains the Rational Tokens necessary to access all portions of the software. You must obtain this from IBM.

     - **Software-based licensing server** requires you to set up a centralized server for the management of the licensing keys. This method is preferred and requires you to set up the keys you receive from IBM in the management server.

## Create the base image and connect

1. In Azure portal, [create a VM](../../../linux/quick-create-portal.md) with the operating system configuration you want. This article assumes a B4ms VM (with 4 vCPUs and 16 GB of memory) running Ubuntu 16.04.

2. After the VM is created, open inbound ports 22 for SSH, 21 for FTP and 9443 for the web server.

3. Get the SSH credentials shown on the **Overview** blade of the VM via the **Connect** button. Select the **SSH** tab and copy the SSH logon command to the clipboard.

4. Log on to a [Bash shell](../../../../cloud-shell/quickstart.md) from your local PC and paste the command. It will be in the form **ssh\<user id\>\@\<IP Address\>**. When prompted for your credentials, enter them to establish a connection to your Home directory.

## Copy the installation file to the server

The installation file for the web server is **ZDT\_Install\_EE\_V12.0.0.1.tgz**. It is included in the media supplied by IBM. You must upload this file to your Ubuntu VM.

1. From the command line, enter the following command to make sure everything is up to date in the newly created image:

    ```
    sudo apt-get update
    ```

2. Create the directory to install to:

    ```
    mkdir ZDT
    ```

3. Copy the file from your local machine to the VM:

    ```
    scp ZDT_Install_EE_V12.0.0.1.tgz  your_userid@<IP Address /ZDT>   =>
    ```
    
> [!NOTE]
> This command copies the installation file to the ZDT directory in your Home directory, which varies depending on whether your client runs Windows or Linux.

## Install the Enterprise Edition

1. Go to the ZDT directory and decompress the ZDT\_Install\_EE\_V12.0.0.1.tgz file using the following commands:

    ```
    cd ZDT
    tar zxvf ZDT\_Install\_EE\_V12.0.0.0.tgz
    ```

2. Run the installer:

    ```
    chmod 755 ZDT\_Install\_EE\_V12.0.0.0.x86_64
    ./ZDT_Install_EE_V12.0.0.0.x86_64
    ```

3. Select **1** to install Enterprise Server.

4. Press **Enter** and read the license agreements carefully. At the end of the license, enter **Yes** to proceed.

5. When prompted to change the password for the newly created user, **ibmsys1**, use the command **sudo passwd ibmsys1** and enter the new password.

6. To verify if the installation was successful enter

    ```
    dpkg -l | grep zdtapp
    ```

7. Verify that the output contains the string **zdtapp 12.0.0.0**, indicating that the package gas been installed successfully

### Starting Enterprise Edition

Keep in mind that when the web server starts, it runs under the zD&T user ID that was created during the installation process.

1. To start the web server, use the root User ID to run the following command:

    ```
    sudo /opt/ibm/zDT/bin/startServer
    ```

2. Copy the URL output by the script, which looks like:

    ```
    https://<your IP address or domain name>:9443/ZDTMC/login.htm
    ```

3. Paste the URL into a web browser to open the management component for your zD&T installation.

## Next steps

[Set up an Application Developers Controlled Distribution (ADCD) in IBM zD&T v1](./demo.md)
