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
ms.date: 04/20/2022
ms.author: jfields
---

# Onboard a Google Cloud Platform (GCP) project

This article describes how to onboard a Google Cloud Platform (GCP) project on Permissions Management.

> [!NOTE]
> A *global administrator* or *super admin* (an admin for all authorization system types) can perform the tasks in this article after the global administrator has initially completed the steps provided in [Enable Permissions Management on your Azure Active Directory tenant](onboard-enable-tenant.md).

## Explanation

For GCP, permissions management is scoped to a *GCP project*. A GCP project is a logical collection of your resources in GCP, like a subscription in Azure, albeit with further configurations you can perform such as application registrations and OIDC configurations.

<!-- Diagram from Gargi-->

There are several moving parts across GCP and Azure, which are required to be configured before onboarding.

* An Azure AD OIDC App
* A Workload Identity in GCP
* OAuth2 confidential client grants utilized
* A GCP service account with permissions to collect


## Onboard a GCP project

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** tab, select **GCP**, and then select **Create Configuration**.

### 1. Create an Azure AD OIDC app.

1. On the **Permissions Management Onboarding - Azure AD OIDC App Creation** page, enter the **OIDC Azure App Name**.

    This app is used to set up an OpenID Connect (OIDC) connection to your GCP project. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated will create the app of this specified name in your Azure AD tenant with the right configuration.

1. To create the app registration, copy the script and run it in your command-line app.

    > [!NOTE]
    > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the *audience value* used while making an OIDC connection with your GCP account.
    > 1. Return to the Permissions Management window, and in the **Permissions Management Onboarding - Azure AD OIDC App Creation**, select **Next**.

### 2. Set up a GCP OIDC project.

Choose from 3 options to manage GCP projects. 

#### Option 1: Automatically manage 

The automatically manage option allows projects to be automatically detected and monitored without extra configuration. Steps to detect list of projects and onboard for collection:  

Firstly, grant Viewer and Security Reviewer role to service account created in previous step at organization, folder or project scope. 

Once done, the steps are listed in the screen, which shows how to further configure in the GPC console, or programatically with the gcloud CLI.

Once everything has been configured, click next, then 'Verify Now & Save'.

Any current or future projects found get onboarded automatically. 

To view status of onboarding after saving the configuration: 

- Navigate to data collectors tab
- Click on the status of the data collector
- View projects on the In Progress page 

#### Option 2: Enter authorization systems 

1. In the **Permissions Management Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project ID** and **OIDC Project Number** of the GCP project in which the OIDC provider and pool will be created. You can change the role name to your requirements.

    > [!NOTE]
    > You can find the **Project number** and **Project ID** of your GCP project on the GCP **Dashboard** page of your project in the **Project info** panel.

1. You can change the **OIDC Workload Identity Pool Id**, **OIDC Workload Identity Pool Provider Id** and **OIDC Service Account Name** to meet your requirements.

    Optionally, specify **G-Suite IDP Secret Name** and **G-Suite IDP User Email** to enable G-Suite integration.

    You can either download and run the script at this point or you can do it in the Google Cloud Shell, as described [later in this article](onboard-gcp.md#4-run-scripts-in-cloud-shell-optional-if-not-already-executed).
1. Select **Next**.

#### Option 3: Select authorization systems 

This option detects all projects that are accessible by the Cloud Infrastructure Entitlement Management application.  

- Firstly, grant Viewer and Security Reviewer role to service account created in previous step at organization, folder or project scope
- Once done, the steps are listed in the screen to do configure manually in the GPC console, or programatically with the gcloud CLI
- Click Next
- Click 'Verify Now & Save' 
- Navigate to newly create Data Collector row under GCP data collectors
- Click on Status column when the row has “Pending” status 
- To onboard and start collection, choose specific ones from the detected list and consent for collection

### 3. Set up GCP member projects.

1. In the **Permissions Management Onboarding - GCP Project Ids** page, enter the **Project IDs**.

    You can enter up to 10 GCP project IDs. Select the plus icon next to the text box to insert more project IDs.

1. You can choose to download and run the script at this point, or you can do it via Google Cloud Shell, as described in the [next step](onboard-gcp.md#4-run-scripts-in-cloud-shell-optional-if-not-already-executed).

### 4. Run scripts in Cloud Shell. (Optional if not already executed)

1. In the **Permissions Management Onboarding - GCP Project Ids** page, select **Launch SSH**.
1. To copy all your scripts into your current directory, in **Open in Cloud Shell**, select **Trust repo**, and then select **Confirm**.

    The Cloud Shell provisions the Cloud Shell machine and makes a connection to your Cloud Shell instance.

    > [!NOTE]
    > Follow the instructions in the browser as they may be different from the ones given here.

    The **Welcome to Permissions Management GCP onboarding** screen appears, displaying steps you must complete to onboard your GCP project.

### 5. Paste the environmental variables from the Permissions Management portal.

1. Return to Permissions Management and select **Copy export variables**.
1. In the GCP Onboarding shell editor, paste the variables you copied, and then press **Enter**.
1. Execute the **gcloud auth login**.
1. Follow instructions displayed on the screen to authorize access to your Google account.
1. Execute the **sh mciem-workload-identity-pool.sh** to create the workload identity pool, provider, and service account.
1. Execute the **sh mciem-member-projects.sh** to give Permissions Management permissions to access each of the member projects.

    - If you want to manage permissions through Permissions Management, select **Y** to **Enable controller**.

    - If you want to onboard your projects in read-only mode, select **N** to **Disable controller**.

1. Optionally, execute **mciem-enable-gcp-api.sh** to enable all recommended GCP APIs.

1. Return to **Permissions Management Onboarding - GCP Project Ids**, and then select **Next**.

### 6. Review and save.

1. In the **Permissions Management Onboarding – Summary** page, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.**

    You have now completed onboarding GCP, and Permissions Management has started collecting and processing your data.

### 7. View the data.

- To view the data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process may take some time, depending on the size of the account and how much data is available for collection.



## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](onboard-aws.md).
- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](onboard-azure.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](onboard-enable-controller-after-onboarding.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md).
