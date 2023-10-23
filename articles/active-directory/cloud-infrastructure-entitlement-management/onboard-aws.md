---
title:  Onboard an Amazon Web Services (AWS) account to Permissions Management
description: How to onboard an Amazon Web Services (AWS) account to Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/13/2023
ms.author: jfields
---

# Onboard an Amazon Web Services (AWS) account

This article describes how to onboard an Amazon Web Services (AWS) account in Microsoft Entra Permissions Management.

> [!NOTE]
> You must have Global Administrator permissions to perform the tasks in this article.

## Explanation

There are several moving parts across AWS and Azure, which are required to be configured before onboarding.

* A Microsoft Entra OIDC App
* An AWS OIDC account
* An (optional) AWS Management account
* An (optional) AWS Central logging account
* An AWS OIDC role
* An AWS Cross Account role assumed by OIDC role
 

## Onboard an AWS account

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**.

<a name='1-create-an-azure-ad-oidc-app'></a>

### 1. Create a Microsoft Entra OIDC App

1. On the **Permissions Management Onboarding - Microsoft Entra OIDC App Creation** page, enter the **OIDC Azure app name**.

    This app is used to set up an OpenID Connect (OIDC) connection to your AWS account. OIDC is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated on this page create the app of this specified name in your Microsoft Entra tenant with the right configuration.

1. To create the app registration, copy the script and run it in your Azure command-line app.

    > [!NOTE]
    > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
    > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the *audience value* used while making an OIDC connection with your AWS account.

1. Return to Permissions Management, and in the **Permissions Management Onboarding - Microsoft Entra OIDC App Creation**, select **Next**.

### 2. Set up an AWS OIDC account

1. In the **Permissions Management Onboarding - AWS OIDC Account Setup** page, enter the **AWS OIDC account ID** where the OIDC provider is created. You can change the role name to your requirements.
1. Open another browser window and sign in to the AWS account where you want to create the OIDC provider.
1. Select **Launch Template**. This link takes you to the **AWS CloudFormation create stack** page.
1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create Stack.**

    This AWS CloudFormation stack creates an OIDC Identity Provider (IdP) representing Microsoft Entra STS and an AWS IAM role with a trust policy that allows external identities from Microsoft Entra ID to assume it via the OIDC IdP. These entities are listed on the **Resources** page.

1. Return to Permissions Management, and in the **Permissions Management Onboarding - AWS OIDC Account Setup** page, select **Next**.

### 3. Set up the AWS Management account connection (Optional)

1. If your organization has Service Control Policies (SCPs) that govern some or all of the member accounts, set up the Management account connection in the **Permissions Management Onboarding - AWS Management Account Details** page.

    Setting up the Management account connection allows Permissions Management to auto-detect and onboard any AWS member accounts that have the correct Permissions Management role.

1. In the **Permissions Management Onboarding - AWS Management Account Details** page, enter the **Management Account ID** and **Management Account Role**.

1. Open another browser window and sign in to the AWS console for your Management account.

1.  Return to Permissions Management, and in the **Permissions Management Onboarding - AWS Management Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    This AWS CloudFormation stack creates a role in the Management account with the necessary permissions (policies) to collect SCPs and list all the accounts in your organization.

    A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.

1.  Return to Permissions Management, and in **Permissions Management Onboarding - AWS Management Account Details**, select **Next**.

### 4. Set up the AWS Central logging account connection (Optional but recommended)

1. If your organization has a central logging account where logs from some or all of your AWS account are stored, in the **Permissions Management Onboarding - AWS Central Logging Account Details** page, set up the logging account connection.

    In the **Permissions Management Onboarding - AWS Central Logging Account Details** page, enter the **Logging Account ID** and **Logging Account Role**.

1. In another browser window, sign in to the AWS console for the AWS account you use for central logging.

1.  Return to Permissions Management, and in the **Permissions Management Onboarding - AWS Central Logging Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**, and then select **Create stack**.

    This AWS CloudFormation stack creates a role in the logging account with the necessary permissions (policies) to read S3 buckets used for central logging. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.

1. Return to Permissions Management, and in the **Permissions Management Onboarding - AWS Central Logging Account Details** page, select **Next**.

### 5. Set up an AWS member account

Select **Enable AWS SSO checkbox**, if the AWS account access is configured through AWS SSO. 

Choose from three options to manage AWS accounts. 

#### Option 1: Automatically manage 

Choose this option to automatically detect and add to the monitored account list, without extra configuration. Steps to detect list of accounts and onboard for collection: 

- Deploy Management account CFT (Cloudformation template) which creates organization account role that grants permission to OIDC role created earlier to list accounts, OUs and SCPs. 
- If AWS SSO is enabled, organization account CFT also adds policy needed to collect AWS SSO configuration details. 
- Deploy Member account CFT in all the accounts that need to be monitored by Microsoft Entra Permissions Management. These actions create a cross account role that trusts the OIDC role created earlier. The SecurityAudit policy is attached to the role created for data collection. 

Any current or future accounts found get onboarded automatically. 

To view status of onboarding after saving the configuration: 

- Go to **Data Collectors** tab.  
- Click on the status of the data collector.  
- View accounts on the **In Progress** page 

#### Option 2: Enter authorization systems
1. In the **Permissions Management Onboarding - AWS Member Account Details** page, enter the **Member Account Role** and the **Member Account IDs**.

     You can enter up to 100 account IDs. Click the plus icon next to the text box to add more account IDs.

    > [!NOTE]
    > Do the following steps for each account ID you add:

1. Open another browser window and sign in to the AWS console for the member account.

1. Return to the **Permissions Management Onboarding - AWS Member Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.

1. In the **CloudTrailBucketName** page, enter a name.

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE]
    >  A *cloud bucket* collects all the activity in a single account that Permissions Management monitors. Enter the name of a cloud bucket here to provide Permissions Management with the access required to collect activity data.

1. From the **Enable Controller** dropdown, select:

    - **True**, if you want the controller to provide Permissions Management with read and write access so that any remediation you want to do from the Permissions Management platform can be done automatically.
    - **False**, if you want the controller to provide Permissions Management with read-only access.

1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    This AWS CloudFormation stack creates a collection role in the member account with necessary permissions (policies) for data collection.

    A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.

1. Return to Permissions Management, and in the **Permissions Management Onboarding - AWS Member Account Details** page, select **Next**.

    This step completes the sequence of required connections from Microsoft Entra STS to the OIDC connection account and the AWS member account.
    
#### Option 3: Select authorization systems 

This option detects all AWS accounts that are accessible through OIDC role access created earlier.  

- Deploy Management account CFT (Cloudformation template) which creates organization account role that grants permission to OIDC role created earlier to list accounts, OUs and SCPs. 
- If AWS SSO is enabled, organization account CFT also adds policy needed to collect AWS SSO configuration details. 
- Deploy Member account CFT in all the accounts that need to be monitored by Microsoft Entra Permissions Management. These actions create a cross account role that trusts the OIDC role created earlier. The SecurityAudit policy is attached to the role created for data collection. 
- Click Verify and Save. 
- Go to the newly create Data Collector row under AWSdata collectors. 
- Click on Status column when the row has **Pending** status 
- To onboard and start collection, choose specific ones from the detected list and consent for collection. 

### 6. Review and save

1. In **Permissions Management Onboarding – Summary**, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** dashboard, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.**

    The status column in your Permissions Management UI shows you which step of data collection you're at:  
 
    - **Pending**: Permissions Management has not started detecting or onboarding yet. 
    - **Discovering**: Permissions Management is detecting the authorization systems. 
    - **In progress**: Permissions Management has finished detecting the authorization systems and is onboarding. 
    - **Onboarded**: Data collection is complete, and all detected authorization systems are onboarded to Permissions Management. 

### 7. View the data

1. To view the data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process may take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](onboard-gcp.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](onboard-enable-controller-after-onboarding.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md).
