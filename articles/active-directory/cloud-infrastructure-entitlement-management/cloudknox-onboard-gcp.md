---
title:  Onboard a Google Cloud Platform (GCP) project in CloudKnox Permissions Management
description: How to onboard a Google Cloud Platform (GCP) project on CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/07/2022
ms.author: v-ydequadros
---

# Onboard a Google Cloud Platform (GCP) project

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to onboard a Google Cloud Platform (GCP) project on CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> A Global Administrator or a Super Admin (Admin for all authorization system types) can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Onboard a GCP project

1. If the **Data Collectors** dashboard isn't displayed when CloudKnox launches: 

    - In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** tab, select **GCP**, and then select **Create Configuration**.

### 1. Create an Azure AD OIDC app.

1. On **CloudKnox On Boarding - Azure AD OIDC App Creation** page, enter the **OIDC Azure App Name**.
    This app will be used to setup an OpenID Connect (OIDC) connection to your GCP project. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated will create the app of this specified name in your Azure AD tenant with the right configuration.
        
1. To create the app registration, copy the script and run it in your Azure command-line app.

    > [!NOTE]    
    > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the "audience" value used while making an OIDC connection with your AWS account.

    1. Return to CloudKnox, and in the **CloudKnox On Boarding - Azure AD OIDC App Creation**, select **Next**.
        
### 2. Set up a GCP OIDC project.

1. In the **CloudKnox Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project ID** and **OIDC Project Number** of the GCP project in which the OIDC provider and pool will be created. You can change the role name to your requirements. 

    > [!NOTE] 
    > You can find the **Project number** and **Project ID** of your GCP project on the GCP **Dashboard** page of your project in the **Project info** panel.

1. You can change the **OIDC Workload Identity Pool Id**, **OIDC Workload Identity Pool Provider Id** and **OIDC Service Account Name** to your requirements.

    1. Optionally, specify **G-Suite IDP Secret Name** and **G-Suite IDP User Email** to enable G-Suite integration.
    1. You can choose to download and run the script at this point (or you can do that via Google Cloud Shell at step 6).
    1. Select **Next**.

### 3. Set up GCP member projects.

1. In the **CloudKnox Onboarding - GCP Project Ids** box, enter the **Project IDs**.

    You can enter up to 10 GCP project IDs in this box. Click the plus icon next to the text box to insert more project IDs.
        
1. You can choose to download and run the script at this point (or you can do that via Google Cloud Shell in the next step).
    
### 4. Run scripts in cloud shell. (Optional if not already executed.)

1. In the **CloudKnox Onboarding - GCP Project Ids** box, select **Launch SSH**.
1. To copy all your scripts into your current directory, in **Open in Cloud Shell**, select **Trust repo**, and then select **Confirm**.
    The Cloud Shell provisions the Cloud Shell machine and makes a connection to your Cloud Shell instance.

    > [!NOTE]     
    > Follow the instructions in the browser as they may be different from the ones given here.
        
        
    The **Welcome to CloudKnox GCP onboarding** screen appears, displaying four steps you must complete to onboard your GCP project.

### 5. Paste the environment vars from the CloudKnox portal.

1. Return to CloudKnox and select **Copy export variables**.
1. In the GCP Onboarding shell editor, paste the variables you copied and enter.
1. Execute **gcloud auth login**. 
1. Follow instructions displayed on the screen to authorize access to your Google account.
1. Execute **sh mciem-workload-identity-pool.sh** to create the workload identity pool, provider and service account.
1. Execute **sh mciem-member-projects.sh** to give CloudKnox permissions to read from each of the member projects. 

    Choose **y** for **Enable controller** if you want to manage permissions via CloudKnox. 

    If you choose **n**, the projects will onboard in a read-only mode.

1. Optionally,  execute **mciem-enable-gcp-api.sh** to enable all recommended GCP APIs.

1. Return to **CloudKnox Onboarding - GCP Project Ids** box, and then select **Next**.

### 6. Review and save.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your GCP data.

### 7. View your data.

- To view your data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process takes a few minutes, so you may have to refresh your screen a few times to see the data.



## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For an overview on CloudKnox, see [What's CloudKnox Permissions Management?](cloudknox-overview.md)
- For information on how to start viewing information about your authorization system in CloudKnox, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).
- 
<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->
