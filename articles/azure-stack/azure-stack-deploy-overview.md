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
ms.date: 10/15/2018
ms.author: jeffgilb
ms.custom: mvc

---
# Quickstart: evaluate the Azure Stack Development Kit

The [Azure Stack Development Kit (ASDK)](.\asdk\asdk-what-is.md) is a testing and development environment that you can deploy to evaluate and demonstrate Azure Stack features and services. To get started with the ASDK, you need to prepare the host computer hardware and then run some scripts (installation takes several hours). After that, you can sign in to the administrator or user portals to start using Azure Stack.

## Prerequisites

### ASDK host computer requirements

Before installing the ASDK, you need to prepare the computer that will host the development kit. The development kit host computer must meet the hardware, software, and network requirements described in **[Review the ASDK deployment planning considerations](.\asdk\asdk-deploy-considerations.md)**.

> [!TIP]
> You can use the [Azure Stack deployment requirements check tool](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) after installing the operating system on the development kit host computer to confirm that your hardware meets all requirements.

### Account requirements

You also need to choose between using Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) as the identity solution for your deployment. Review the account requirements in **[deployment planning considerations](.\asdk\asdk-deploy-considerations.md#account-requirements)**

## Download and extract the deployment package

After preparing your development kit host computer, download and extract the ASDK deployment package. The deployment package includes the Cloudbuilder.vhdx file, which is a virtual hard drive (VHD) with a bootable operating system, and the Azure Stack installation files.

You can download the deployment package to the development kit host or to another computer. The extracted deployment files take up 60 GB of free disk space, so using another computer can help reduce the storage requirements on the development kit host.

**[Download and extract the Azure Stack Development Kit (ASDK)](.\asdk\asdk-download.md)**

## Prepare the host computer

Before you can install the ASDK, the host environment must be prepared and the system configured to boot from the development kit VHD. When you restart the host, it boots from CloudBuilder.vhdx and you can start deploying the ASDK.

**[Prepare the ASDK host computer](.\asdk\asdk-prepare-host.md)**

## Install the ASDK on the host computer

After the host computer boots from the VHD, you can deploy the development kit to the Cloudbuilder virtual environment. You can deploy the ASDK using the graphical user interface (GUI), provided by running the asdk-installer.ps1 PowerShell script, or from [the PowerShell command line](.\asdk\asdk-deploy-powershell.md)

> [!NOTE]
> After the host boots from the Cloudbuilder.vhdx image, you have the option of configuring [Azure Stack telemetry settings](.\asdk\asdk-telemetry.md#set-telemetry-level-in-the-windows-registry) *before* installing the ASDK.

**[Install the Azure Stack Development Kit (ASDK)](.\asdk\asdk-install.md)**

## Perform post-deployment configurations

After installing the ASDK, there are a few recommended post-installation checks and configuration changes that should be made.

**Tools**

Install Azure Stack PowerShell and GitHub tools, and check the success of your installation using the test-AzureStack cmdlet.

**Identity solution**

For a deployment that uses Azure AD, you must activate both the Azure Stack administrator and tenant portals. This activation consents to giving the Azure Stack portal and Azure Resource Manager the correct permissions (listed on the consent page) for all users of the directory.

**Password expiration**

You should reset the password expiration policy to make sure that the password for the development kit host doesn't expire before your evaluation period ends.

> [!NOTE]
> You also have the option of configuring [Azure Stack telemetry settings](.\asdk\asdk-telemetry.md#enable-or-disable-telemetry-after-deployment) *after* installing the ASDK.

**[Post-ASDK deployment tasks](.\asdk\asdk-post-deploy.md)**

## Register with Azure

You must register Azure Stack with Azure so that you can [download Azure marketplace items](.\asdk\asdk-marketplace-item.md) to Azure Stack.

**[Register Azure Stack with Azure](.\asdk\asdk-register.md)**

## Next steps

Congratulations! By completing the steps in this quickstart you have an ASDK environment with an [administrator](https://adminportal.local.azurestack.external) portal and a [user](https://portal.local.azurestack.external) portal.
