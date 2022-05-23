---
title:  Onboard a Google Cloud Platform (GCP) project in CloudKnox Permissions Management
description: How to onboard a Google Cloud Platform (GCP) project on CloudKnox Permissions Management.
services: active-directory
author: mtillman
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2022
ms.author: mtillman
---

# Onboard a Google Cloud Platform (GCP) project

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.


> [!NOTE] 
> The CloudKnox Permissions Management (CloudKnox) PREVIEW is currently not available for tenants hosted in the European Union (EU).


This article describes how to onboard a Google Cloud Platform (GCP) project on CloudKnox Permissions Management (CloudKnox).

> [!NOTE]
> A *global administrator* or *super admin* (an admin for all authorization system types) can perform the tasks in this article after the global administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## View a training video on configuring and onboarding a GCP account

To view a video on how to configure and onboard GCP accounts in CloudKnox, select [Configure and onboard GCP accounts](https://www.youtube.com/watch?app=desktop&v=W3epcOaec28).


## Onboard a GCP project

1. If the **Data Collectors** dashboard isn't displayed when CloudKnox launches: 

    - In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** tab, select **GCP**, and then select **Create Configuration**.

### 1. Create an Azure AD OIDC app.

1. On the **CloudKnox Onboarding - Azure AD OIDC App Creation** page, enter the **OIDC Azure App Name**.

    This app is used to set up an OpenID Connect (OIDC) connection to your GCP project. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated will create the app of this specified name in your Azure AD tenant with the right configuration.
        
1. To create the app registration, copy the script and run it in your command-line app.

    > [!NOTE]    
    > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the *audience value* used while making an OIDC connection with your AWS account.

    1. Return to CloudKnox, and in the **CloudKnox Onboarding - Azure AD OIDC App Creation**, select **Next**.
        
### 2. Set up a GCP OIDC project.

1. In the **CloudKnox Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project ID** and **OIDC Project Number** of the GCP project in which the OIDC provider and pool will be created. You can change the role name to your requirements. 

    > [!NOTE] 
    > You can find the **Project number** and **Project ID** of your GCP project on the GCP **Dashboard** page of your project in the **Project info** panel.

1. You can change the **OIDC Workload Identity Pool Id**, **OIDC Workload Identity Pool Provider Id** and **OIDC Service Account Name** to meet your requirements.

    Optionally, specify **G-Suite IDP Secret Name** and **G-Suite IDP User Email** to enable G-Suite integration.

    You can either download and run the script at this point or you can do it in the Google Cloud Shell, as described [later in this article](cloudknox-onboard-gcp.md#4-run-scripts-in-cloud-shell-optional-if-not-already-executed).
1. Select **Next**.

### 3. Set up GCP member projects.

1. In the **CloudKnox Onboarding - GCP Project Ids** page, enter the **Project IDs**.

    You can enter up to 10 GCP project IDs. Select the plus icon next to the text box to insert more project IDs.
        
1. You can choose to download and run the script at this point, or you can do it via Google Cloud Shell, as described in the [next step](cloudknox-onboard-gcp.md#4-run-scripts-in-cloud-shell-optional-if-not-already-executed).
    
### 4. Run scripts in Cloud Shell. (Optional if not already executed)

1. In the **CloudKnox Onboarding - GCP Project Ids** page, select **Launch SSH**.
1. To copy all your scripts into your current directory, in **Open in Cloud Shell**, select **Trust repo**, and then select **Confirm**.

    The Cloud Shell provisions the Cloud Shell machine and makes a connection to your Cloud Shell instance.

    > [!NOTE]     
    > Follow the instructions in the browser as they may be different from the ones given here.

    The **Welcome to CloudKnox GCP onboarding** screen appears, displaying steps you must complete to onboard your GCP project.

### 5. Paste the environment vars from the CloudKnox portal.

1. Return to CloudKnox and select **Copy export variables**.
1. In the GCP Onboarding shell editor, paste the variables you copied, and then press **Enter**.
1. Execute the **gcloud auth login**. 
1. Follow instructions displayed on the screen to authorize access to your Google account.
1. Execute the **sh mciem-workload-identity-pool.sh** to create the workload identity pool, provider, and service account.
1. Execute the **sh mciem-member-projects.sh** to give CloudKnox permissions to access each of the member projects. 

    - If you want to manage permissions through CloudKnox, select **Y** to **Enable controller**. 

    - If you want to onboard your projects in read-only mode, select **N** to **Disable controller**.

1. Optionally, execute **mciem-enable-gcp-api.sh** to enable all recommended GCP APIs.

1. Return to **CloudKnox Onboarding - GCP Project Ids**, and then select **Next**.

### 6. Review and save.

1. In the **CloudKnox Onboarding – Summary** page, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.** 

    You have now completed onboarding GCP, and CloudKnox has started collecting and processing your data.

### 7. View the data.

- To view the data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process may take some time, depending on the size of the account and how much data is available for collection.



## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](cloudknox-onboard-enable-controller-after-onboarding.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md).
