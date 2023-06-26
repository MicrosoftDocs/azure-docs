---
title: Quick start for inbound provisioning to Azure Active Directory with PowerShell
description: Learn how to configure Inbound Provisioning API with PowerShell.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 06/26/2023
ms.author: kenwith
ms.reviewer: arvinh
---

# Quick start for inbound provisioning to Azure Active Directory with PowerShell

This document describes how to use PowerShell to configure the inbound provisioning API for Azure Active Directory (Azure AD). To perform the steps described in this doc, you need either the Azure AD Application Administrator or the Global Administrator role.  

Using the steps in this guide, you will be able to successfully convert a CSV file containing HR data into a SCIM bulk request payload and send it to the Azure AD inbound provisioning API endpoint. 

To help you with this conversion process, we are providing a sample PowerShell script that you can customize as per your requirements. You can download this script from the Inbound Provisioning Private Preview Teams folder.  

## Configure provisioning job for API-based data ingestion 

The following steps successfully configure out-of-the-box provisioning job with default mappings: 

1. Sign in to Microsoft Entra portal with Global Administrator or Application Administrator role credentials.  
1. Browse to **Azure Active Directory** > **Applications** > **Enterprise applications**. 
1. Click **New application** to create a new provisioning application to store the configuration for API-driven inbound provisioning. 

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/new-application.png" alt-text="Screenshot of how to create a new application.":::

1. Type 'API-driven' in the search text box. Select the application **API-driven Inbound User Provisioning to Azure AD**. 

   >[!NOTE]
   >The application “API-driven Inbound User Provisioning to on-premises AD” is not yet supported in private preview. We will provide an update once it is supported.

   :::image type="content" border="true" source="./media/inbound-provisioning-api-powershell/select-app.png" alt-text="Screenshot of how to select the inbound provisioning API application.":::

1. You can rename the application to meet your naming requirements and then click **Create**. 
