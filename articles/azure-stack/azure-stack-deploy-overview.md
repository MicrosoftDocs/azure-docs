---
title: Evaluate the Azure Stack Development Kit | Microsoft Docs
description: Learn how to deploy the Azure Stack Development Kit for evaluation purposes.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 03/22/2018
ms.author: jeffgilb
ms.custom: mvc

---
# Quickstart: Evaluate the Azure Stack Development Kit
The [Azure Stack Development Kit (ASDK)](.\asdk\asdk-what-is.md) is a testing and development environment that you can deploy to evaluate and demonstrate Azure Stack features and services. To get started with the ASDK, you need to prepare the host computer hardware and then run some scripts (installation takes several hours). After that, you can sign in to the admin and user portals to start using Azure Stack.

## Prerequisites 
Before installing the ASDK, you need to prepare the computer that will host the development kit (the development kit host). The development kit host computer must meet minimum hardware, software, and network requirements. 

You also need to choose between using Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) as the identity solution for your deployment. 

Be sure that the development kit host meets the minimum hardware requirements and that you have made your identity solution decision made before starting your deployment so that the installation process runs smoothly. 

**[Review the ASDK deployment planning considerations](.\asdk\asdk-deploy-considerations.md)**

> [!TIP]
> You can use the [Azure Stack deployment requirements check tool](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) after installing the operating system on the development kit host computer to confirm that your hardware meets all requirements.

## Download and extract the deployment package
After ensuring that your development kit host computer meets the basic requirements for installing the ASDK, the next step is to download and extract the ASDK deployment package. The deployment package includes the Cloudbuilder.vhdx file, which is a virtual hard drive that includes a bootable operating system and the Azure Stack installation files.

You can download the deployment package to the development kit host or to another computer. The extracted deployment files take up 60 GB of free disk space, so using another computer can help reduce the hardware requirements for the development kit host.

**[Download and extract the Azure Stack Development Kit (ASDK)](.\asdk\asdk-download.md)**

## Prepare the development kit host computer
Before you can install the ASDK on the host computer, the environment must be prepared and the system configured to boot from VHD. After the development kit host computer has been prepared, it boots from the CloudBuilder.vhdx virtual machine hard drive so that you can begin ASDK deployment.

**[Prepare the ASDK host computer](.\asdk\asdk-prepare-host.md)**

## Install the ASDK on the host computer
After preparing the development kit host computer, the ASDK can be deployed into the CloudBuilder.vhdx image. The ASDK can be deployed using a graphical user interface (GUI) provided by downloading and running the asdk-installer.ps1 PowerShell script or completely from [the command line](.\asdk\asdk-deploy-powershell.md). 

> [!NOTE]
> Optionally, after the host computer has booted into the CloudBuilder.vhdx, you can configure [Azure Stack telemetry settings](.\asdk\asdk-telemetry.md#set-telemetry-level-in-the-windows-registry) *before* installing the ASDK.


**[Install the Azure Stack Development Kit (ASDK)](.\asdk\asdk-install.md)**

## Perform post-deployment configurations
After installing the ASDK, there are a few recommended post-installation checks and configuration changes that should be made. You can validate your installation was installed successfully using the test-AzureStack cmdlet, and install Azure Stack PowerShell and GitHub tools. 

After deployments that use Azure AD, you must activate both the Azure Stack administrator and tenant portals. This activation consents to giving the Azure Stack portal and Azure Resource Manager the correct permissions (listed on the consent page) for all users of the directory.

You should also reset the password expiration policy to make sure that the password for the development kit host doesn't expire before your evaluation period ends.

> [!NOTE]
> Optionally, you can also configure [Azure Stack telemetry settings](.\asdk\asdk-telemetry.md#enable-or-disable-telemetry-after-deployment) *after* installing the ASDK.

**[Post-ASDK deployment tasks](.\asdk\asdk-post-deploy.md)**

## Register with Azure
You must register Azure Stack with Azure so that you can [download Azure marketplace items](.\asdk\asdk-marketplace-item.md) to Azure Stack.

**[Register Azure Stack with Azure](.\asdk\asdk-register.md)**

## Next steps
Congratulations! After completing these steps, you’ll have a development kit environment with both [administrator](https://adminportal.local.azurestack.external) and [user](https://portal.local.azurestack.external) portals. 
