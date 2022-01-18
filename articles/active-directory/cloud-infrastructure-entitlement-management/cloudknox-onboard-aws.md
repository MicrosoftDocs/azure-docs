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
ms.date: 01/17/2022
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

2. On the **Data Collectors** tab, select **AWS**, and then select **Create Configuration**.



3. In the **CloudKnox Onboarding – Azure OIDC App Creation** dialog, enter the **OIDC Azure App Name**.
4. To create the app registration, copy the script in the dialog and run it in your CLI.
5. To confirm that the app was created, open **App Registrations** in Azure and, on the **All applications** tab, locate your app.
6. Select the app name to open the **Expose an API** page.

    The API is displayed in the **Application ID URI** box. This API enables the connection with the OIDC account.
7. Log in to AWS and select the CloudKnox account as the OIDC provider.
8. Return to CloudKnox, and in the **CloudKnox Onboarding – Azure OIDC Account Details & IDP Access** dialog, enter the **AWS OIDC Account ID**. Then select **Launch Template**.

    The **AWS Quick create stack** page opens. 
9. To create basic entities, for example the OIDC provider, the assumed role policy, or the role the IDC provider requires to connect to Azure AD Security Token Service (Azure AD STS), scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack.**

    AWS creates the required IDC entities including the role that the IDC provider needs to connect to Azure AD STS. These entity names are listed in the **Resources** page.
10. In the **CloudKnox Data Collectors** tab, select **Next**.
11. In the **Enter Your AWS Account ID** box, enter your account ID.
12. To avoid rule-naming collisions, in the **AWS Member Account Role** box, enter a new name. Then select **Launch Template**.

    The **AWS Quick create stack** page opens. 
13. In the **CloudTrailBucketName** box, enter a name. 

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE] 
    >  A *cloud bucket* collects all the activity in a single account that CloudKnox monitors. Entering the name of a cloud bucket here provides CloudKnox with the access required to collect activity data. 

14. In the **EnableController** box, from the drop-down list, select: 

    - **True**, if you want the controller to provide CloudKnox with read and write access so that any remediation you want to do from the CloudKnox platform can be done automatically.
    - **False**, if you want the controller to provide CloudKnox with read-only access.

15. Scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    AWS creates the required resources and lists them in the **Resources** page, completing the sequence of required connections from Azure AD STS to the OIDC connection account and the AWS member account.

16. Return to the **CloudKnox Data Collectors** tab and select **Next**.

17. In the **CloudKnox Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    On the **Data Collections** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that CloudKnox has started collecting data.




<!---## Next steps--->

<!---For information on how to onboard Microsoft Azure, see [Onboard the Azure authorization system](cloudknox-onboard-azure.html).--->
<!---For information on how to onboard Google Cloud Platform (GCP), see [Onboard the GCP authorization system](cloudknox-onboard-gcp.html).--->

