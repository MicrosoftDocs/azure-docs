---
title:  Microsoft CloudKnox Permissions Management - Onboard the Amazon Web Services (AWS) authorization system
description: How to onboard the Amazon Web Services (AWS) authorization system on Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/18/2022
ms.author: v-ydequadros
---

# Onboard the Amazon Web Services (AWS) authorization system

This topic describes how to onboard the Amazon Web Services (AWS) authorization system on Microsoft CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

> [!NOTE] 
> Before beginning this task, make sure you have completed the steps provided in Enable CloudKnox on your Azure Active Directory tenant.

<!---[Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.html).--->

**To onboard the AWS authorization system on CloudKnox:**

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **AWS**, and then select **Create Configuration**.

1. In **CloudKnox Onboarding – Azure OIDC App Creation**, enter the **OIDC Azure App Name**.

1. To create the app registration, copy the script and run it in your command-line app.

1. To confirm that the app was created, open **App Registrations** in Azure and, on the **All applications** tab, locate your app.

1. Select the app name to open the **Expose an API** page.

    The API is displayed in the **Application ID URI** box. This API enables the connection with the OIDC account.
1. Log in to AWS and select the CloudKnox account as the OIDC provider.

1. Return to CloudKnox, and in the **CloudKnox Onboarding – Azure OIDC Account Details & IDP Access** box, enter the **AWS OIDC Account ID**. Then select **Launch Template**.

    The **AWS Quick create stack** page opens. 

1. To create basic entities, for example the OIDC provider, the assumed role policy, or the role the IDC provider requires to connect to Azure AD Security Token Service (Azure AD STS), scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack.**

    AWS creates the required IDC entities including the role that the IDC provider needs to connect to Azure AD STS. These entity names are listed in the **Resources** page.

1. In the **CloudKnox Data Collectors** tab, select **Next**.

1. In the **Enter Your AWS Account ID** box, enter your account ID.

1. To avoid rule-naming collisions, in the AWS **Member Account Role** box, enter a new name. Then select **Launch Template**.

    The **AWS Quick create stack** page opens, displaying the template.

    <!---Insert AWS-template1.jpg, AWS-template2.jpg, AWS-template3.jpg--->

1. In the **CloudTrailBucketName** box, enter a name. 

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE] 
    >  A *cloud bucket* collects all the activity in a single account that CloudKnox monitors. Entering the name of a cloud bucket here provides CloudKnox with the access required to collect activity data. 

1. In the **EnableController** box, from the drop-down list, select: 

    - **True**, if you want the controller to provide CloudKnox with read and write access so that any remediation you want to do from the CloudKnox platform can be done automatically.
    - **False**, if you want the controller to provide CloudKnox with read-only access.

    <!---Insert AWS-template4.jpg--->

1. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    AWS creates the resources required to create an OIDC connection and lists them in the AWS **Resources** tab. 

    This completes the sequence of required connections from Azure AD STS to the OIDC connection account and the AWS member account.

1. Return to the **CloudKnox Data Collectors** tab and select **Next**.

1. (Optional but recommended) In the **CloudKnox Onboarding – AWS Central Logging Account Details** box, enter the **Logging Account ID** and **Logging Account Role**. Then select **Next**.

1. In the **Enter Your AWS Account ID** box, enter your account ID.

1. To avoid rule-naming collisions, in the AWS **Member Account Role** box, enter a new name. Then select **Launch Template**.

    The **AWS Quick create stack** page opens, displaying the template.

1. Review the information in the template, make changes, if necessary, then scroll to the bottom of the page.

1. In the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **View Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This confirms that CloudKnox has started collecting and processing your AWS data.

1. To view your data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process takes a few minutes, so you may have to refresh your screen a few times to see the data.


<!---## Next steps--->

<!---For information on how to onboard Microsoft Azure, see [Onboard the Azure authorization system](cloudknox-onboard-azure.html).--->
<!---For information on how to onboard Google Cloud Platform (GCP), see [Onboard the GCP authorization system](cloudknox-onboard-gcp.html).--->

