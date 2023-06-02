---
title: Configure AWS IAM Identity Center as an identity provider
description: How to configure AWS IAM Identity Center as an identity provider.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/02/2023
ms.author: jfields
---

# Configure AWS IAM Identity Center as an identity provider

This article describes how to configure your AWS IAM Identity Center as an identity provider (IdP) for an Amazon Web Services (AWS) account in Permissions Management.

> [!NOTE]
> Configuring AWS IAM Identity Center as an identity provider is an optional step. By configuring identity provider information, Permissions Management can read user and role access configured at AWS IAM Identity Center. Admins can see the augmented view of assigned permissions to the identities. You can return to these steps to configure an IdP at any time.

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches, select **Settings** (gear icon), and then select the **Data Collectors** subtab. 


2. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**. If a Data Collector already exists in your AWS account and you want to add AWS IAM integration, do the following: 
    - Select the Data Collector for which you want to AWS IAM. 
    - Click on the ellipsis next to the Authorization Systems Status. 
    - Select Integrate Identity Provider. 

3. On the **Integrate Identity provider (IdP)** page, select the box for **AWS IAM Identity Center**. 

4. Fill in the following fields:
    - The **AWS IAM Identity Center Region**. Specify the region where AWS IAM Identity Center is installed. All the data configured in IAM Identity Center is stored in the Region, IAM Identity Center is installed.   
    - Your **AWS Management Account ID**
    - Your **AWS Management Account Role**

5. Select **Launch Management Management Account Template**. The template opens in a new window. 
6. The Master Management Account Template collects information to create update the AWS IAM Role that allows Microsoft Entra Permissions Management to collect organizational information. The following details are requested in the template. All fields are pre-populated, and you can edit the data as you need: 

    - **Stack name** – This is the name of the AWS stack for creating the required AWS resources for Permissions Management to collect organizational information. Default value - "mciem-org-tenant-id>". 
    - **CFT Parameters**
        - **OIDC Provider Role Name** – Name of the IAM Role OIDC Provider that can assume the role. Default value – OIDC account role (as entered in Permissions Management). 

        - **Org Account Role Name** - Name of the IAM Role. Default value - Pre-populated with Master account role name (as entered in Microsoft Entra PM). 

        - **false** – Enables AWS SSO. Default value – true, when the template is launched from the Configure Identity Provider (IdP) page, otherwise the default is false. 

        - **OIDC Provider Account ID** – The Account ID where the OIDC Provider is created. Default value – OIDC Provider Account ID (as entered in Permissions Management). 

        - **Tenant ID** – ID of the tenant where the application is created. Default value – tenant-id (the configured tenant). 
7. Click **Next** to review and confirm the information you've entered.

8. Click **Verify Now & Save**.


## Next steps

- For information on how to attach and detach permissions AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
