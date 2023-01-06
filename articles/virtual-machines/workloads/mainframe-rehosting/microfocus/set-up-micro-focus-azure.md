---
title: Install Micro Focus Enterprise Server 5.0 and Enterprise Developer 5.0 on Azure | Microsoft Docs
description: In this article, learn how to install Micro Focus Enterprise Server 5.0 and Enterprise Developer 5.0 on Microsoft Azure.
services: virtual-machines
documentationcenter:
author: swread
ms.author: sread
editor: swread
manager: mamccrea 
ms.topic: conceptual
ms.date: 06/29/2020
tags:
keywords:
ms.service: virtual-machines
ms.subservice: mainframe-rehosting
---

# Install Micro Focus Enterprise Server 5.0 and Enterprise Developer 5.0 on Azure

This article shows how to set up [Micro Focus Enterprise Server 5.0](https://www.microfocus.com/documentation/enterprise-developer/ed50pu5/ES-WIN/GUID-F7D8FD6E-BDE0-4169-8D8C-96DDFFF6B495.html) and [Micro Focus Enterprise Developer 5.0](https://www.microfocus.com/documentation/enterprise-developer/ed50/) on
Microsoft Azure.

A common workload on Azure is a development and test environment. This scenario is common because it's so cost-effective and easy to deploy and tear down. With Enterprise Server, Micro Focus has created one of the largest mainframe rehosting platforms available. You can run z/OS workloads on a less expensive x86 platform on Azure using either Windows or Linux virtual machines (VMs).

This setup uses Azure VMs running the Windows Server 2016 image from the Azure Marketplace with Microsoft SQL Server 2017 already installed. This setup also
applies to Azure Stack.

The corresponding development environment for Enterprise Server is Enterprise Developer, which runs on either Microsoft Visual Studio 2017 or later, Visual Studio Community (free to download), or Eclipse. This article shows how to deploy it using a Windows Server 2016 virtual machine that comes with Visual Studio 2017 or later installed.

## Prerequisites

Before getting started, check out these prerequisites:

-   An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

-   The Micro Focus software and a valid license (or trial license). If you're an existing Micro Focus customer, contact your Micro Focus representative. Otherwise, [request a trial](https://www.microfocus.com/products/enterprise-suite/enterprise-server/trial/).

-   Get the documentation for [Enterprise Server and Enterprise Developer](https://www.microfocus.com/documentation/enterprise-developer/ed50/).

    > [!Note]
    > There are a few options for controlling access to your VMs:
    > -   A best practice is to set up [Azure Bastion](https://azure.microsoft.com/services/azure-bastion/).
    > -   A [site-to-site virtual private network (VPN)](../../../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
    tunnel.
    > -   A jumpbox VM.

## Install Enterprise Server

1.  For better security and manageability, consider creating a new resource group just for this project—for example, **RGMicroFocusEntServer**. Use the first part of the name in Azure to choose the type of resource to make it easier to spot in a list.

2.  Create a virtual machine. From the Azure Marketplace, select the virtual machine and operating system you want. Here’s a recommended setup:

    -   **Enterprise Server:** Select **ES2 v3 VM** (with 2 vCPUs and 16 GB memory) with Windows Server 2016 and SQL Server 2017 installed. This
        image is available from the Azure Marketplace. Enterprise Server can use Azure SQL Database as well.

    -   **Enterprise Developer:** Select **B2ms VM** (with 2 vCPUs and 8 GB memory) with Windows 10 and Visual Studio installed. This image is available from the Azure Marketplace.

3.  In the **Basics** section, enter your username and password. Select the **Subscription** and **Location/Region** you would like to use for the VMs. Select **RGMicroFocusEntServer** for the resource group.

4.  Put both VMs into the same virtual network so they can communicate with each other.

5.  Accept the defaults for the rest of the settings. Remember the username and password you create for the administrator of these VMs.

6.  When the virtual machines have been created, open inbound ports **9003, 86,** and **80** for HTTP and **3389** for Remote Desktop Protocol (RDP) on the Enterprise Server machine and **3389** on the Developer machine.

7.  To sign into the Enterprise Server virtual machine, in Azure portal, select the ES2 v3 VM. Go to the **Overview** section and select **Connect** to launch an RDP session. Sign in using the credentials you created for the VM.

8.  From the RDP session, load the following two files. Because you're using Windows, you can drag and drop the files into the RDP session:

    -   `es\_50.exe`, the Enterprise Server installation file.

    -   `mflic`, the corresponding license file—Enterprise Server won't load
        without it.

9.  Double-click the file to start the installation. In the first window, select the installation location and accept the end-user license agreement.

    ![Screenshot shows the Micro Focus Enterprise Server dialog box where you can start the installation.](media/install-image-1.png)

    When Setup is complete, the following message appears:

    ![Screenshot shows a success message in the Micro Focus Enterprise Server dialog box.](media/install-image-2.png)

 ### Check for updates

After the installation, be sure to check for any additional updates as a number of prerequisites, such as the Microsoft C++ Redistributable and .NET Framework, are installed along with Enterprise Server.

### Upload the license

1.  Start the Micro Focus License Administration.

2.  Select **Start** \> **Micro Focus License Manager** \> **License Administration**, and then click the **Install** tab. Choose the type of license format to upload: a license file or a 16-character license code. For example, for a file, in **License file**, browse to the *`mflic` file uploaded previously to the VM and select **Install Licenses**.

    ![Screenshot shows the Micro Focus License Administration dialog box where you can select Install Licenses.](media/install-image-3.png)

3.  Verify that Enterprise Server loads. Try launching the Enterprise Server Administration site from a browser using this URL: `http://localhost:86/`. The Enterprise Server Administration page is displayed as shown.

    ![Enterprise Server Administration page](media/install-image-4.png)

## Install Enterprise Developer on the developer machine

1.  Select the resource group created earlier (for example, **RGMicroFocusEntServer**), then select the developer image.

2.  To sign into the virtual machine, go to the **Overview** section and select **Connect**. This sign-in launches an RDP session. Sign in using the credentials you created for the VM.

3.  From the RDP session, load the following two files (drag and drop if you like):

    -   `edvs2017.exe`, the Enterprise Server installation file.

    -   `mflic`, the corresponding license file (Enterprise Developer will not
        load without it).

4.  Double-click the **edvs2017.exe** file to start the installation. In the first window, select the installation location and accept the end-user license agreement. If you want, choose **Install Rumba 9.5** to install this terminal emulator, which you'll probably need.

    ![Micro Focus Enterprise Developer for Visual Studio 2017 Setup dialog box](media/install-image-5.png)

5.  After setup is complete, the following message appears:

    ![Setup successful message](media/install-image-6.png)

6.  Start the Micro Focus License Manager just as you did for Enterprise Server. Choose **Start** \> **Micro Focus License Manager** \> **License Administration**, and click the **Install** tab.

7.  Choose the type of license format to upload: a license file or a 16-character license code. For example, for a file, in **License file**, browse to the `mflic` file uploaded previously to the VM and select  **Install Licenses**.

    ![Micro Focus License Administration dialog box](media/install-image-7.png)

When Enterprise Developer loads, your deployment of a Micro Focus development and test environment on Azure is complete!

**Next steps**

-   [Set up the BankDemo application](./demo.md)

-   [Run Enterprise Server in Docker containers](./run-enterprise-server-container.md)

-   [Mainframe application migration](/azure/architecture/cloud-adoption/infrastructure/mainframe-migration/application-strategies)