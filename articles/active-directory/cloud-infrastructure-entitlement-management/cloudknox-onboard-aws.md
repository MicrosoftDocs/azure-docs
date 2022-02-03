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
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Onboard an Amazon Web Services (AWS) account

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to onboard an Amazon Web Services (AWS) account on CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> Any group member can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Onboard an AWS account

1. If the **Data collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data collectors** tab.

1. On the **Data collectors** tab, select **AWS**, and then select **Create configuration**.

1. In **CloudKnox onboarding – Azure AD OIDC app creation**, enter the **Azure AD OIDC Azure app name**.

    OIDC stands for *OpenID Connect*, an authentication protocol which allows you to verify user identity when a user is trying to access a protected HTTPs end point.

1. To create the app registration, copy the script and run it in your Azure command-line app.

    You can change the app name, but you can't change the application ID URL.

1. To confirm that the app was created, open **App registrations** in Azure and, on the **All applications** tab, locate your app.

1. Select the app name to open the **Expose an API** page.

    The API is displayed in the **Overview** page and the **Application ID URI** box. This API enables the connection with the OIDC account.

    If you aren't already logged in to AWS, you're prompted to do so. 

1. Open a new browser window and log in to AWS. Then select the AWS account where you want to create the OIDC provider.

1. Return to CloudKnox, and in the **CloudKnox onboarding – Azure AD OIDC account details & IDP access** box, enter the **AWS OIDC account ID**. Then select **Launch template**.

    The AWS OIDC account ID specifies where you want to create the OIDC connector. You can change the role name to your requirements. 

    The **AWS Quick create stack** page opens. 

1. To create basic entities, for example the OIDC provider, the assumed role policy, or the role the Internet Data Center (IDC) provider requires to connect to Azure AD. For Azure AD to generate security tokens that are used with AWS, scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack.**

    AWS creates the required IDC entities including the role that the IDC provider needs to connect to Azure AD. These entity names are listed on the **Resources** page.

1. In the **CloudKnox Data collectors** tab, select **Next**.

1. In the **Enter your AWS account ID** box, enter your account ID.

    You can enter up to 10 account IDs. Click the plus icon next to the text box to insert more subscriptions.

1. In the AWS **Member account role** box, enter a new name. Then select **Launch template**.

    The **AWS Quick create stack** page opens, displaying the template.

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

    AWS creates the resources required to create an OIDC connection and lists them in the AWS **Resources** tab. 

    This step completes the sequence of required connections from Azure AD to the OIDC connection account and the AWS member account.

1. Return to the CloudKnox **Data collectors** tab and select **Next**.

1. Optional but recommended: You can use the master account to detect all the AWS accounts in your organization. This option automatically onboards newly added AWS accounts if they have a correct CloudKnox role. 

    In the **CloudKnox onboarding – AWS central logging account details** box, enter the **Logging account ID** and **Logging account role**. Then select **Next**.

1. In the **Enter your AWS account ID** box, enter your account ID.

1. To avoid rule-naming collisions, in the AWS **Member account role** box, enter a new name. Then select **Launch template**.

    The **AWS Quick create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **View now & save**.

    The following message appears: **Successfully created configuration.**

    On the **Data collectors** tab, the **Recently uploaded On** column displays **Collecting** and the **Recently transformed on** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your AWS data.

1. To view your data, select the **Authorization systems** tab. 

    The **Status** column in the table displays **Collecting data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->