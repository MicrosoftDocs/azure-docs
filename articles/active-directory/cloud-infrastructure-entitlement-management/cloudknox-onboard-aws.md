---
title:  Onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management
description: How to onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2022
ms.author: kenwith
---

# Onboard an Amazon Web Services (AWS) account

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

> [!NOTE] 
> The CloudKnox Permissions Management (CloudKnox) PREVIEW is currently not available for tenants hosted in the European Union (EU).


This article describes how to onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> A *global administrator* or *super admin* (an admin for all authorization system types) can perform the tasks in this article after the global administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).


## View a training video on configuring and onboarding an AWS account

To view a video on how to configure and onboard AWS accounts in CloudKnox, select [Configure and onboard AWS accounts](https://www.youtube.com/watch?v=R6K21wiWYmE).

## Onboard an AWS account

1. If the **Data Collectors** dashboard isn't displayed when CloudKnox launches: 

    - In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**.

### 1. Create an Azure AD OIDC App.

1. On the **CloudKnox Onboarding - Azure AD OIDC App Creation** page, enter the **OIDC Azure app name**.

    This app is used to set up an OpenID Connect (OIDC) connection to your AWS account. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated on this page create the app of this specified name in your Azure AD tenant with the right configuration.
        
1. To create the app registration, copy the script and run it in your Azure command-line app.

    > [!NOTE] 
    > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the *audience value* used while making an OIDC connection with your AWS account.

1. Return to CloudKnox, and in the **CloudKnox Onboarding - Azure AD OIDC App Creation**, select **Next**.

### 2. Set up an AWS OIDC account.

1. In the **CloudKnox Onboarding - AWS OIDC Account Setup** page, enter the **AWS OIDC account ID** where the OIDC provider is created. You can change the role name to your requirements.
1. Open another browser window and sign in to the AWS account where you want to create the OIDC provider.
1. Select **Launch Template**. This link takes you to the **AWS CloudFormation create stack** page. 
1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create Stack.**

    This AWS CloudFormation stack creates an OIDC Identity Provider (IdP) representing Azure AD STS and an AWS IAM role with a trust policy that allows external identities from Azure AD to assume it via the OIDC IdP. These entities are listed on the **Resources** page.

1. Return to CloudKnox, and in the **CloudKnox Onboarding - AWS OIDC Account Setup** page, select **Next**.

### 3. Set up an AWS master account. (Optional)

1. If your organization has Service Control Policies (SCPs) that govern some or all of the member accounts, set up the master account connection in the **CloudKnox Onboarding - AWS Master Account Details** page.

    Setting up the master account connection allows CloudKnox to auto-detect and onboard any AWS member accounts that have the correct CloudKnox role.

    - In the **CloudKnox Onboarding - AWS Master Account Details** page, enter the **Master Account ID** and **Master Account Role**.
    
1. Open another browser window and sign in to the AWS console for your master account.

1.  Return to CloudKnox, and in the **CloudKnox Onboarding - AWS Master Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.
    
    This AWS CloudFormation stack creates a role in the master account with the necessary permissions (policies) to collect SCPs and list all the accounts in your organization. 

    A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.
    
1.  Return to CloudKnox, and in **CloudKnox Onboarding - AWS Master Account Details**, select **Next**.

### 4. Set up an AWS Central logging account. (Optional but recommended)

1. If your organization has a central logging account where logs from some or all of your AWS account are stored, in the **CloudKnox Onboarding - AWS Central Logging Account Details** page, set up the logging account connection.

    In the **CloudKnox Onboarding - AWS Central Logging Account Details** page, enter the **Logging Account ID** and **Logging Account Role**.
    
1. In another browser window, sign in to the AWS console for the AWS account you use for central logging.

1.  Return to CloudKnox, and in the **CloudKnox Onboarding - AWS Central Logging Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**, and then select **Create stack**.
    
    This AWS CloudFormation stack creates a role in the logging account with the necessary permissions (policies) to read S3 buckets used for central logging. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.
    
1. Return to CloudKnox, and in the **CloudKnox Onboarding - AWS Central Logging Account Details** page, select **Next**.

### 5. Set up an AWS member account.

1. In the **CloudKnox Onboarding - AWS Member Account Details** page, enter the **Member Account Role** and the **Member Account IDs**. 

     You can enter up to 10 account IDs. Click the plus icon next to the text box to add more account IDs.

    > [!NOTE]
    > Perform the next 6 steps for each account ID you add.

1. Open another browser window and sign in to the AWS console for the member account. 

1. Return to the **CloudKnox Onboarding - AWS Member Account Details** page, select **Launch Template**. 

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. In the **CloudTrailBucketName** page, enter a name. 

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE] 
    >  A *cloud bucket* collects all the activity in a single account that CloudKnox monitors. Enter the name of a cloud bucket here to provide CloudKnox with the access required to collect activity data. 

1. From the **Enable Controller** dropdown, select: 

    - **True**, if you want the controller to provide CloudKnox with read and write access so that any remediation you want to do from the CloudKnox platform can be done automatically.
    - **False**, if you want the controller to provide CloudKnox with read-only access.

1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    This AWS CloudFormation stack creates a collection role in the member account with necessary permissions (policies) for data collection. 

    A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack. 

1. Return to CloudKnox, and in the **CloudKnox Onboarding - AWS Member Account Details** page, select **Next**. 
        
    This step completes the sequence of required connections from Azure AD STS to the OIDC connection account and the AWS member account.

### 6. Review and save.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** dashboard, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.** 

    You have now completed onboarding AWS, and CloudKnox has started collecting and processing your data.

### 7. View the data.

1. To view the data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process may take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](cloudknox-onboard-enable-controller-after-onboarding.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md).
