---
title: Submit jobs to an HPC Pack cluster in Azure | Microsoft Docs
description: Learn how to set up an on-premises computer to submit jobs to an HPC Pack cluster in Azure
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management,hpc-pack

ms.assetid: 78f6833c-4aa6-4b3e-be71-97201abb4721
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-multiple
ms.workload: big-compute
ms.date: 10/14/2016
ms.author: danlep

---
# Submit HPC jobs from an on-premises computer to an HPC Pack cluster deployed in Azure
[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

Configure an on-premises client computer to submit jobs to a [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) cluster in Azure. This article shows you how to set up a local computer with client tools to submit job over HTTPS to the cluster in Azure. In this way, several cluster users can submit jobs to a cloud-based HPC Pack cluster, but without connecting directly to the head node VM or accessing an Azure subscription.

![Submit a job to a cluster in Azure][jobsubmit]

## Prerequisites
* **HPC Pack head node deployed in an Azure VM** - We recommend that you use
  automated tools such as an [Azure quickstart template](https://azure.microsoft.com/documentation/templates/) or an [Azure PowerShell script](classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
  to deploy the head node and cluster. You need the DNS
  name of the head node and the credentials of a cluster administrator to
  complete the steps in this article.
* **Client computer** - You need a Windows or Windows Server client computer that can run HPC Pack client utilities (see [system requirements](https://technet.microsoft.com/library/dn535781.aspx)). If you only want to use the HPC Pack web portal or REST API to submit jobs, you can use any client computer of your choice.
* **HPC Pack installation media** - To install the HPC Pack client utilities, the free installation package for the
  latest version of HPC Pack (HPC Pack 2012 R2) is available from the
  [Microsoft Download
  Center](http://go.microsoft.com/fwlink/?LinkId=328024). Make sure that you
  download the same version of HPC Pack that is installed on the head node
  VM.

## Step 1: Install and configure the web components on the head node
To enable a REST interface to submit jobs to the cluster over HTTPS,
ensure that the HPC Pack web components are configured on the HPC Pack head
node. If they aren't already installed, first install the web
components by running the HpcWebComponents.msi installation file. Then,
configure the components by running the HPC PowerShell script
**Set-HPCWebComponents.ps1**.

For detailed procedures, see [Install the Microsoft HPC Pack Web
Components](http://technet.microsoft.com/library/hh314627.aspx).

> [!TIP]
> Certain Azure quickstart templates for HPC Pack install and configure the web components automatically. If you use the [HPC Pack IaaS deployment script](classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json) to create the cluster,
> you can optionally install and configure the web components as part of the deployment.
> 
> 

**To install the web components**

1. Connect to the head node VM by using the credentials of a cluster administrator.
2. From the HPC Pack Setup folder, run HpcWebComponents.msi on the head node.
3. Follow the steps in the wizard to install the web components

**To configure the web components**

1. On the head node, start HPC PowerShell as an administrator.
2. To change directory to the location of the configuration script, type the following command:
   
    ```powershell
    cd $env:CCP_HOME\bin
    ```
3. To configure the REST interface and start the HPC Web Service, type the following command:
   
    ```powershell
    .\Set-HPCWebComponents.ps1 –Service REST –enable
    ```
4. When prompted to select a certificate, choose the certificate that corresponds to the public DNS name of the head node. For example, if you deploy the head node VM using the classic deployment model, the certificate name looks like CN=&lt;*HeadNodeDnsName*&gt;.cloudapp.net. If you use the Resource Manager deployment model, the certificate name looks like CN=&lt;*HeadNodeDnsName*&gt;.&lt;*region*&gt;.cloudapp.azure.com.
   
   > [!NOTE]
   > You select this certificate later when you submit jobs to the head node from an on-premises computer. Don't select or configure a certificate that corresponds to the computer name of the head node in the Active Directory domain (for example, CN=*MyHPCHeadNode.HpcAzure.local*).
   > 
   > 
5. To configure the web portal for job submission, type the following command:
   
    ```powershell
    .\Set-HPCWebComponents.ps1 –Service Portal -enable
    ```
6. After the script completes, stop and restart the HPC Job Scheduler Service by typing the following commands:
   
    ```powershell
    net stop hpcscheduler
    net start hpcscheduler
    ```

## Step 2: Install the HPC Pack client utilities on an on-premises computer
If you want to install the HPC Pack client utilities on your computer, download the
HPC Pack setup files (full installation) from the [Microsoft Download
Center](http://go.microsoft.com/fwlink/?LinkId=328024). When you begin the installation, choose the setup option for the **HPC Pack client utilities**.

To use the HPC Pack client tools to submit jobs to the head node VM, you also need to export a certificate from the head node and install it on the client computer. The certificate must be in .CER format.

**To export the certificate from the head node**

1. On the head node, add the Certificates snap-in to a Microsoft Management Console for the Local Computer account. For steps to add the snap-in, see [Add the Certificates Snap-in to an MMC](https://technet.microsoft.com/library/cc754431.aspx).
2. In the console tree, expand **Certificates – Local Computer** > **Personal**, and then click **Certificates**.
3. Locate the certificate that you configured for the HPC Pack web components in [Step 1: Install and configure the web components on the head node](#step-1:-install-and-configure-the-web-components-on-the-head-node) (for example, CN=&lt;*HeadNodeDnsName*&gt;.cloudapp.net).
4. Right-click the certificate, and click **All Tasks** > **Export**.
5. In the Certificate Export Wizard, click **Next**, and ensure that **No, do not export the private key** is selected.
6. Follow the remaining steps of the wizard to export the certificate in DER encoded binary X.509 (.CER) format.

**To import the certificate on the client computer**

1. Copy the certificate that you exported from the head node to a folder on the client computer.
2. On the client computer, run certmgr.msc.
3. In Certificate Manager, expand **Certificates – Current user** > **Trusted Root Certification Authorities**, right-click **Certificates**, and then click **All Tasks** > **Import**.
4. In the Certificate Import Wizard, click **Next** and follow the steps to import the certificate that you exported from the head node to the Trusted Root Certification Authorities store.

> [!TIP]
> You might see a security warning, because the certification authority on the head node isn't recognized by the client computer. For testing purposes, you can ignore this warning and complete the certificate import.
> 
> 

## Step 3: Run test jobs on the cluster
To verify your configuration, try running jobs on the cluster in Azure
from the on-premises computer. For example, you can use HPC Pack GUI tools or command-line commands to submit jobs to the cluster. You can also use a web-based portal to submit jobs.

**To run job submission commands on the client computer**

1. On a client computer where the HPC Pack client utilities are installed, start a Command Prompt.
2. Type a sample command. For example, to list all jobs on the cluster, type a command similar to one of the following, depending on the full DNS name of the head node:
   
    ```command
    job list /scheduler:https://<HeadNodeDnsName>.cloudapp.net /all
    ```
   
    or
   
    ```command
    job list /scheduler:https://<HeadNodeDnsName>.<region>.cloudapp.azure.com /all
    ```
   
   > [!TIP]
   > Use the full DNS name of the head node, not the IP address, in the scheduler URL. If you specify the IP address, an error appears similar to "The server certificate needs to either have a valid chain of trust or to be placed in the trusted root store."
   > 
   > 
3. When prompted, type the user name (in the form &lt;DomainName&gt;\\&lt;UserName&gt;) and password of the HPC cluster administrator or another cluster user that you configured. You can choose to store the credentials locally for more job operations.
   
    A list of jobs appears.

**To use HPC Job Manager on the client computer**

1. If you didn't previously store domain credentials for a cluster user when submitting a job, you can add the credentials in Credential Manager.
   
    a. In Control Panel on the client computer, start Credential Manager.
   
    b. Click **Windows Credentials** > **Add a generic credential**.
   
    c. Specify the Internet address (for example, https://&lt;HeadNodeDnsName&gt;.cloudapp.net/HpcScheduler or https://&lt;HeadNodeDnsName&gt;.&lt;region&gt;.cloudapp.azure.com/HpcScheduler), and the user name (&lt;DomainName&gt;\\&lt;UserName&gt;) and password of the cluster administrator or another cluster user that you configured.
2. On the client computer, start HPC Job Manager.
3. In the **Select Head Node** dialog box, type the URL to the head node in Azure (for example, https://&lt;HeadNodeDnsName&gt;.cloudapp.net or https://&lt;HeadNodeDnsName&gt;.&lt;region&gt;.cloudapp.azure.com).
   
    HPC Job Manager opens and shows a list of jobs on the head node.

**To use the web portal running on the head node**

1. Start a web browser on the client computer, and enter one of the following addresses, depending on the full DNS name of the head node:
   
    ```
    https://<HeadNodeDnsName>.cloudapp.net/HpcPortal
    ```
   
    or
   
    ```
    https://<HeadNodeDnsName>.<region>.cloudapp.azure.com/HpcPortal
    ```
2. In the security dialog box that appears, type the domain credentials of the HPC cluster administrator. (You can also add other cluster users in different roles. See [Managing Cluster Users](https://technet.microsoft.com/library/ff919335.aspx).)
   
    The web portal opens to the job list view.
3. To submit a sample job that returns the string “Hello World” from the cluster, click **New job** in the left-hand navigation.
4. On the **New Job** page, under **From submission pages**, click **HelloWorld**. The job submission page appears.
5. Click **Submit**. If prompted, provide the domain credentials of the HPC cluster administrator. The job is submitted, and the job ID appears on the **My Jobs** page.
6. To view the results of the job that you submitted, click the job ID, and then click **View Tasks** to view the command output (under **Output**).

## Next steps
* You can also submit jobs to the Azure cluster with the [HPC Pack REST API](http://social.technet.microsoft.com/wiki/contents/articles/7737.creating-and-submitting-jobs-by-using-the-rest-api-in-microsoft-hpc-pack-windows-hpc-server.aspx).
* If you want to submit cluster jobs from a Linux client, see the Python sample in the [HPC Pack 2012 R2 SDK and Sample Code](https://www.microsoft.com/download/details.aspx?id=41633).

<!--Image references-->
[jobsubmit]: ./media/virtual-machines-windows-hpcpack-cluster-submit-jobs/jobsubmit.png
