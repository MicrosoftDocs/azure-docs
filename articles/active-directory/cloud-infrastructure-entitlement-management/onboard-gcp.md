---
title:  Onboard a Google Cloud Platform (GCP) project in Permissions Management
description: How to onboard a Google Cloud Platform (GCP) project on Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: jfields
---

# Onboard a Google Cloud Platform (GCP) project

This article describes how to onboard a Google Cloud Platform (GCP) project in Microsoft Entra Permissions Management.

> [!NOTE]
> You must have the Global Administrator role assignment to perform the tasks in this article.

## Explanation

For GCP, Permissions Management is scoped to a *GCP project*. A GCP project is a logical collection of your resources in GCP, like a subscription in Azure, but with further configurations you can perform such as application registrations and OIDC configurations.

<!-- Diagram from Gargi-->

There are several moving parts across GCP and Azure, which should be configured before onboarding.

* A Microsoft Entra OIDC App
* A Workload Identity in GCP
* OAuth2 confidential client grants utilized
* A GCP service account with permissions to collect


## Onboard a GCP project

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** tab, select **GCP**, then select **Create Configuration**.

<a name='1-create-an-azure-ad-oidc-app'></a>

### 1. Create a Microsoft Entra OIDC app.

1. On the **Permissions Management Onboarding - Microsoft Entra OIDC App Creation** page, enter the **OIDC Azure App Name**.

    This app is used to set up an OpenID Connect (OIDC) connection to your GCP project. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated creates the app of this specified name in your Microsoft Entra tenant with the right configuration.

1. To create the app registration, copy the script and run it in your command-line app.

    > [!NOTE]
    > 1. To confirm the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the *audience value* used while making an OIDC connection with your GCP account.
    > 1. Return to the Permissions Management window, and in the **Permissions Management Onboarding - Microsoft Entra OIDC App Creation**, select **Next**.

### 2. Set up a GCP OIDC project.
1. In the **Permissions Management Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project Number** and **OIDC Project ID** of the GCP project in which the OIDC provider and pool is created. You can change the role name to your requirements.

    > [!NOTE]
    > You can find the **Project number** and **Project ID** of your GCP project on the GCP **Dashboard** page of your project in the **Project info** panel.

1. You can change the **OIDC Workload Identity Pool Id**, **OIDC Workload Identity Pool Provider Id** and **OIDC Service Account Name** to meet your requirements.

    Optionally, specify **G-Suite IDP Secret Name** and **G-Suite IDP User Email** to enable G-Suite integration.


1. You can either download and run the script at this point or you can do it in the Google Cloud Shell.

1. Select **Next** after successfully running the setup script. 

Choose from three options to manage GCP projects. 

#### Option 1: Automatically manage 

The automatically manage option allows you to automatically detect and monitor projects without extra configuration. Steps to detect a list of projects and onboard for collection:  

1. Grant **Viewer** and **Security Reviewer** roles to a service account created in the previous step at a project, folder or organization level. 

To enable Controller mode **On** for any projects, add these roles to the specific projects:
- Role Administrators
- Security Admin 

The required commands to run in Google Cloud Shell are listed in the Manage Authorization screen for each scope of a project, folder or organization. This is also configured in the GCP console.

3. Select **Next**.

#### Option 2: Enter authorization systems 
You have the ability to specify only certain GCP member projects to manage and monitor with Permissions Management (up to 100 per collector). Follow the steps to configure these GCP member projects to be monitored: 
1. In the **Permissions Management Onboarding - GCP Project Ids** page, enter the **Project IDs**.

    You can enter up to comma separated 100 GCP project IDs. 

2. You can choose to download and run the script at this point, or you can do it via Google Cloud Shell.
    
    To enable controller mode 'On' for any projects, add these roles to the specific projects:
    - Role Administrators
    - Security Admin 

3. Select **Next**.

#### Option 3: Select authorization systems 

This option detects all projects accessible by the Cloud Infrastructure Entitlement Management application.  

1. Grant **Viewer** and **Security Reviewer** roles to a service account created in the previous step at a project, folder or organization level. 

To enable Controller mode **On** for any projects, add these roles to the specific projects:
- Role Administrators
- Security Admin 

The required commands to run in Google Cloud Shell are listed in the Manage Authorization screen for each scope of a project, folder or organization. This is also configured in the GCP console.

3. Select **Next**.


### 3. Review and save.

1. In the **Permissions Management Onboarding – Summary** page, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration**.

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.**
    
    The status column in your Permissions Management UI shows you which step of data collection you're at:  
 
    - **Pending**: Permissions Management has not started detecting or onboarding yet. 
    - **Discovering**: Permissions Management is detecting the authorization systems. 
    - **In progress**: Permissions Management has finished detecting the authorization systems and is onboarding. 
    - **Onboarded**: Data collection is complete, and all detected authorization systems are onboarded to Permissions Management. 

### 4. View the data.

1. To view the data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process may take some time, depending on the size of the account and how much data is available for collection.



## Next steps

- To enable or disable the controller after onboarding is complete, see [Enable or disable the controller](onboard-enable-controller-after-onboarding.md).
- To add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md).
