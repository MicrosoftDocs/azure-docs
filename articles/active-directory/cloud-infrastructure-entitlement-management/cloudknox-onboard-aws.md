---
title:  CloudKnox Permissions Management - Onboard the Amazon Web Services (AWS) authorization system
description: How to onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/03/2022
ms.author: v-ydequadros
---

# Onboard an Amazon Web Services (AWS) account

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.
This article describes how to onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> A Global Administrator or a Super Admin (Admin for all authorization system types) can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Onboard an AWS account

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **AWS**, and then select **Create Configuration**.

1. **Azure AD OIDC App Creation**
    1. On **CloudKnox Onboarding - Azure AD OIDC App Creation** page, enter the **OIDC Azure app name**.
        This app will be used to setup an OIDC connection to your AWS account. OIDC stands for *OpenID Connect*, it is an interoperable authentication protocol based on the OAuth 2.0 family of specifications. The scripts generated will create the app of this specified name in your Azure AD tenant with the right configuration.
        
    1. To create the app registration, copy the script and run it in your Azure command-line app.
        > [!NOTE] 
        > 1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.
        > 1. Select the app name to open the **Expose an API** page. The **Application ID URI** displayed in the **Overview** page is the "audience" value used while making an OIDC connection with your AWS account.

    1. Return to CloudKnox, and in the **CloudKnox Onboarding - Azure AD OIDC App Creation**, select **Next**.

1. **AWS OIDC Account Setup**
    1. In the **CloudKnox Onboarding - AWS OIDC Account Setup** page, enter the **AWS OIDC account ID** where the OIDC provider will be created. You can change the role name to your requirements.
    1. In another browser window and log in to the AWS account where you want to create the OIDC provider.
    1. Select **Launch Template**. This is a quick link that takes you to the The **AWS CloudFormation create stack** page. 
    1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create Stack.**

        This AWS CloudFormation stack, creates an OIDC Identity Provider (IdP) representing Azure AD STS and an AWS IAM role with a trust policy that allows external identities from Azure AD to assume it via the OIDC IdP. These entities are listed on the **Resources** page.

    1. Return to CloudKnox, and in the **CloudKnox Onboarding - AWS OIDC Account Setup** page, select **Next**.

1. **AWS Master Account Setup** (Optional)
    1. In the **CloudKnox Onboarding - AWS Master Account Details** page you should setup the master account connection if your organization has Service Control Policies (SCPs) that govern some or all of the member accounts. Setting up the master account connection will also allow CloudKnox to auto detect and onboard any aws member accounts that have the correct CloudKnox role.

        In the **CloudKnox Onboarding - AWS Master Account Details** box, enter the **Master Account ID** and **Master Account Role**.
    
    1. In another browser window and log in to the AWS console of your master account.

    1.  Return to CloudKnox, and in the "**CloudKnox Onboarding - AWS Master Account Details**" select **Launch Template**.

        The **AWS CloudFormation create stack** page opens, displaying the template.

    1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

    1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.
    
        This AWS CloudFormation stack creates a role in the master account with the necessary permissions (policies) to collect SCPs and list all the accounts in your organization. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.
    
    1.  Return to CloudKnox, and in the "**CloudKnox Onboarding - AWS Master Account Details**" select **Next**.

1. **AWS Central Logging Account Setup** (Optional)
    1.  Optional but recommended: In the **CloudKnox Onboarding - AWS Central Logging Account Details** page you should setup the logging account connection if your organization has a central logging account where logs from some or all of your AWS account are stored.

        In the **CloudKnox Onboarding - AWS Central Logging Account Details** box, enter the **Logging Account ID** and **Logging Account Role**.
    
    1. In another browser window log in to the AWS console of your AWS account used for central logging.

    1.  Return to CloudKnox, and in the "**CloudKnox Onboarding - AWS Central Logging Account Details**" page select **Launch Template**.

        The **AWS CloudFormation create stack** page opens, displaying the template.

    1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

    1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.
    
        This AWS CloudFormation stack creates a role in the logging account with the necessary permissions (policies) to read S3 buckets used for central logging. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.
    
    1.  Return to CloudKnox, and in the "**CloudKnox Onboarding - AWS Central Logging Account Details**" page, select **Next**.

1. **AWS Member Account Setup**
    1. In the **CloudKnox Onboarding - AWS Member Account Details** box, enter the **Member Account Role** and the **Member Account IDs**. 

        You can enter up to 10 account IDs. Click the plus icon next to the text box to insert more account IDs.
        > [!NOTE]
        > For each of the accounts entered here perform the next 5 steps.

    1. In another browser window log into the AWS console of the member account in another browser window. 

    1. Return to the **CloudKnox Onboarding - AWS Member Account Details** page, Select **Launch Template**. 

        The **AWS CloudFormation create stack** page opens, displaying the template.

        <!---Insert AWS-template1.jpg, AWS-template2.jpg, AWS-template3.jpg--->

    1. In the **CloudTrailBucketName** box, enter a name. 

        You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

        > [!NOTE] 
        >  A *cloud bucket* collects all the activity in a single account that CloudKnox monitors. Entering the name of a cloud bucket here provides CloudKnox with the access required to collect activity data. 

    1. In the **EnableController** box, from the drop-down list, select: 

        <!---Mrudula: Add the procedure "to enable/disable the controller after the onboarding."--->

        - **True**, if you want the controller to provide CloudKnox with read and write access so that any remediation you want to do from the CloudKnox platform can be done automatically.
        - **False**, if you want the controller to provide CloudKnox with read-only access.

        <!---Insert AWS-template4.jpg--->

    1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

        This AWS CloudFormation stack creates a collection role in the member account with necessary permissions (policies) for data collection. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack. 

    1. Return to the CloudKnox, and in the **CloudKnox Onboarding - AWS Member Account Details** page, select **Next**. 
        
        This step completes the sequence of required connections from Azure AD STS to the OIDC connection account and the AWS member account.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your AWS data.

1. To view your data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
- For an overview on CloudKnox, see [What is CloudKnox Permissions Management?](cloudknox-overview.md).
- For information on how to start viewing information about your authorization system in CloudKnox, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).

<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->

