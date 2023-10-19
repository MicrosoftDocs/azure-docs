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
ms.date: 10/16/2023
ms.author: jfields
---

# Configure AWS IAM Identity Center as an identity provider (preview)

If you're an Amazon Web Services (AWS) customer who uses the AWS IAM Identity Center, you can configure the Identity Center as an identity provider in Permissions Management. Configuring your AWS IAM Identity Center information allows you to receive more accurate data for your identities in Permissions Management.

> [!NOTE]
> Configuring AWS IAM Identity Center as an identity provider is an optional step. By configuring identity provider information, Permissions Management can read user and role access configured at AWS IAM Identity Center. Admins can see the augmented view of assigned permissions to the identities. You can return to these steps to configure an IdP at any time.

## How to configure AWS IAM Identity Center as an identity provider

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches, select **Settings** (gear icon), and then select the **Data Collectors** subtab. 


2. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**. If a Data Collector already exists in your AWS account and you want to add AWS IAM integration, then: 
    - Select the Data Collector for which you want to configure AWS IAM. 
    - Click on the ellipsis next to the **Authorization Systems Status**. 
    - Select **Integrate Identity Provider**. 

3. On the **Integrate Identity provider (IdP)** page, select the box for **AWS IAM Identity Center**. 

4. Fill in the following fields:
    - The **AWS IAM Identity Center Region**. Specify the region where AWS IAM Identity Center is installed. All data configured in the IAM Identity Center  
    is stored in the Region where the IAM Identity Center is installed.   
    - Your **AWS Management Account ID**
    - Your **AWS Management Account Role**

5. Select **Launch Management Account Template**. The template opens in a new window. 
6. If the Management Account stack is created with the Cloud Formation Template as part of the previous onboarding steps, update the stack by running ``EnableSSO`` as true. Running this command creates a new stack when running the Management Account Template. 

The template execution attaches the AWS managed policy  ``AWSSSOReadOnly`` and the newly created custom policy ``SSOPolicy`` to the AWS IAM role that allows Microsoft Entra Permissions Management to collect organizational information. The following details are requested in the template. All fields are prepopulated, and you can edit the data as you need: 
- **Stack name** – The Stack name is the name of the AWS stack for creating the required AWS resources for Permissions Management to collect organizational information. The default value is ``mciem-org-<tenant-id>``. 

- **CFT Parameters**
    - **OIDC Provider Role Name** – Name of the IAM Role OIDC Provider that can assume the role. The default value is the OIDC account role (as entered in Permissions Management).

    - **Org Account Role Name** - Name of the IAM Role. The default value is prepopulated with the Management account role name (as entered in Microsoft Entra PM).

    - **true** – Enables AWS SSO. The default value is ``true`` when the template is launched from the Configure Identity Provider (IdP) page, otherwise the default is ``false``. 

    - **OIDC Provider Account ID** – The Account ID where the OIDC Provider is created. The default value is the OIDC Provider Account ID (as entered in Permissions Management). 

    - **Tenant ID** – ID of the tenant where the application is created. The default value is ``tenant-id`` (the configured tenant). 
7. Click **Next** to review and confirm the information you've entered.

8. Click **Verify Now & Save**.


## Next steps

- For information on how to attach and detach permissions AWS identities, see [Attach and detach policies for AWS identities](how-to-attach-detach-permissions.md).
