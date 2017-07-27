---
title: Enable FTP in App Service on Azure Stack | Microsoft Docs
description: Steps to complete to enable FTP in App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/6/2017
ms.author: anwestg

---
# Enable FTP in App Service on Azure Stack

Once you have successfully deployed App Service on Azure Stack if you wish to enable FTP publishing, so that your tenants can upload their application files and content, there are some additional steps that need to be completed.  In future releases these steps will be automated.

> [!NOTE]
> These steps are for Service or Enterprise Administrators configuring an App Service on Azure Stack Resource Provider.

## Enable FTP

1.  Log in to the Azure Stack portal as the service administrator.
2.  Browse to **Network interfaces** and select the **FTP-NIC** under **Resource Group** - **AppService-LOCAL**. ![Azure Stack Network Interfaces][1]
3.  Note the **Public IP Address** of the **FTP-NIC**. 
![Azure Stack Network Interface Details][2]
4.  Next Browse to **Virtual Machines** and select the **FTP0-VM**. ![Azure Stack Virtual Machines][3]
5.  Open a remote desktop session to the VM using the **Connect** button and login to the session using the Administrator credentials you set during App Service deployment.  
![Azure Stack Virtual Machine Details][4]
6.  Open **Internet Information Service (IIS) Manager** on the FTP VM (FTP0-VM).
7.  Under **Sites** select **Hosting FTP Site**.
8.  Open **FTP Firewall Support**. ![IIS Manager on App Service FTP0-VM][5]
9.  Enter the Public IP Address of the FTP-NIC and click **Apply** ![IIS Manager FTP Firewall Support][6]

## Validate the enabling of FTP

1.  Log in to the Azure Stack portal as either the service administrator or as a tenant.
2.  Browse to **App Services** and select a Web, Mobile, or API App you have created. ![App Services][7]
3.  In the application details note the **FTP Hostname** and **FTP/deployment username**. ![App Service App Details][8]
> [!NOTE]
> If you do not see an entry under **FTP/deployment username**, you need to set the Deployment credentials first using the **Deployment Credentials** Blade.

4.  Open Windows Explorer, enter the FTP hostname into the file address bar for example, ftp://ftp.appservice.azurestack.local
5.  When prompted enter the **Deployment credentials** you noted in step 3, if the feature has been enabled you will see a directory listing of the app service application's contents. ![FTP File Listing][9]
<!--Image references-->
[1]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-network-interfaces.png
[2]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-network-interface-details.png
[3]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-virtual-machines.png
[4]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-virtual-machines-FTP0-VM.png
[5]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-IIS-Manager.png
[6]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-IIS-Manager-FTP-Firewall-Support.png
[7]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-validate-app-services.png
[8]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-validate-app-service-app-detail.png
[9]: ./media/azure-stack-app-service-enable-ftp/azure-stack-app-service-enable-ftp-validate-ftp-file-listing.png
