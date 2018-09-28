---
title: Validate ADFS Integration for Azure Stack
description: Use the Azure Stack Readiness Checker to validate ADFS integration for Azure Stack.
services: azure-stack
documentationcenter: ''
author: PatAltimore
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/27/2018
ms.author: patricka
ms.reviewer: jerskine

---

# Validate ADFS integration for Azure Stack

Use the Azure Stack Readiness Checker tool (AzsReadinessChecker) to validate that your environment is ready for ADFS integration with Azure Stack. You should validate ADFS integration before you begin an Azure Stack deployment.

## Get the readiness checker tool

Download the latest version of the Azure Stack Readiness Checker tool (AzsReadinessChecker) from the [PSGallery](https://aka.ms/AzsReadinessChecker).  

## Prerequisites

The following prerequisites must be in place.

**The computer where the tool runs:**

- Windows 10 or Windows Server 2016, with internet connectivity.
- PowerShell 5.1 or later. To check your version, run the following PowerShell cmd and then review the *Major* version and *Minor* versions:  

   > `$PSVersionTable.PSVersion`
- Configure [PowerShell for Azure Stack](azure-stack-powershell-install.md).
- The latest version of [Microsoft Azure Stack Readiness Checker](https://aka.ms/AzsReadinessChecker) tool.

**Azure Active Directory environment:**

- Identify the Azure AD account you will use for Azure Stack and ensure it is an Azure Active Directory Global administrator.
- Identify your Azure AD Tenant Name. The tenant name must be the *primary* domain name for your Azure Active Directory. For example, *contoso.onmicrosoft.com*. 
- Identify the AzureEnvironement you will use: *AzureCloud*, *AzureGermanCloud*, or *AzureChinaCloud*.

## Validate ADFS integration

## Next Steps

[Validate Azure registration](azure-stack-validate-registration.md)  
[View the readiness report](azure-stack-validation-report.md)  
[General Azure Stack integration considerations](azure-stack-datacenter-integration.md)  