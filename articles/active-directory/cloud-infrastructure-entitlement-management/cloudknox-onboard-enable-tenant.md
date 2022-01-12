---
title:  Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant
description: How to enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/12/2022
ms.author: v-ydequadros
---

# Enable Microsoft CloudKnox Permissions Management on your Azure Active Directory (Azure AD) tenant

This topic describes how to:

- Enable Microsoft CloudKnox Permissions Management (CloudKnox) on your Azure Active Directory (Azure AD) tenant.
- Onboard the Amazon Web Services (AWS) authorization system.
- Onboard the Microsoft Azure (Azure) authorization system.
- Onboard the Google Cloud Platform (GCP) authorization system.

## Enable CloudKnox on your Azure AD tenant

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

1. Log in to your Azure AD tenant and select **Next**.
2. Select the **CloudKnox Permissions Management** tile.

    The **Welcome to CloudKnox Permissions Management** screen appears. 

    This screen provides information on how to enable CloudKnox on your tenant.

3. To provide access to CloudKnox first party application, create a service principle that points to CloudKnox first party application.
4. Copy the script on the **Welcome** screen, paste the script into your command-line interface (CLI), and run it.
5. When the script has run successfully, return to the **Welcome to CloudKnox** screen.
6. Select **Enable CloudKnox Permissions Management**.

    The tenant completes the onboarding process and launches CloudKnox.

## Onboard the AWS authorization system

1. On the CloudKnox homepage, select **Settings**.
2. On the **Data Collectors** tab, select **AWS**, and then select **Create Configuration**.
3. In the **CloudKnox Onboarding – Azure OIDC App Creation** dialog, enter the **OIDC Azure App Name**.
4. To create the app registration, copy the script in the dialog and run it in your CLI.
5. To confirm that the app was created, open **App Registrations** in Azure and, on the **All applications** tab, locate your app.
6. Select the app name to open the **Expose an API** page.

    The API is displayed in the **Application ID URI** box. This API facilitates the connection with the OIDC account.
7. Log in to AWS and select the CloudKnox account as the OIDC provider.
8. Return to CloudKnox, and in the **CloudKnox Onboarding – Azure OIDC Account Details & IDP Access** dialog, enter the **AWS OIDC Account ID**. Then select **Launch Template**.

    The **AWS Quick create stack** page opens. 
9. To create basic entities, for example the OIDC provider, the assumed role policy, or the role the IDC provider requires to connect to Azure AD Security Token Service (Azure AD STS), scroll to the bottom of the page, and in the **Capabilities** box, select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack.**

    AWS creates the required IDC entities including the role that the IDC provider needs to connect to Azure AAD STS. These entity names are listed in the **Resources** page.
10. In the **CloudKnox Data Collectors** tab, select **Next**.
11. In the **Enter Your AWS Account ID** box, enter your account ID.
12. To avoid rule naming collisions, in the **AWS Member Account Role** box, enter a new name. Then select **Launch Template**.

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


## Onboard the Azure authorization system

1. On the CloudKnox homepage, select **Settings**.
2. On the **Data Collectors** tab, select **Azure**, and then select **Create Configuration**.
3. In the **CloudKnox Onboarding – Azure Subscription Details** dialog, select settings for the following fields:

    1. **Permission Level** – From the drop-down list, select the required Subscription Level.
    1. **Controller Status** – From the drop-down list, select the required Controller Status:
**Enabled for read and write permissions** or **Disabled for read-only permissions**.
    1. Enter your **Azure Subscription IDs**.
    1. Select **Next**.

4. In the **CloudKnox Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    On the **Data Collectors** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that CloudKnox has started collecting data.


## Onboard the GCP authorization system

1. On the CloudKnox homepage, select **Settings**.
2. On the **Data Collectors** tab, select **GCP**, and then select **Create Configuration**.
3. In the **CloudKnox Onboarding – Azure OIDC App Creation** dialog, in the **OIDC Azure Project Name** box, enter the **GCP Project Name**.
4. In the **OIDC Workload Identity Pool Id** box, enter your ID.
5. In the **OIDC Service Account Name** box, enter your account name.
6. Select **Next**.
7. To create the app registration, copy the script in the dialog and run it in your CLI.
8. In the **CloudKnox Onboarding – GCP Product Info** dialog, in the **Enter Your GCP Project ID** box, enter the **GCP project ID**.
9. To launch a Secure Shell (SSH), select **Launch SSH**. 
10. To copy all your scripts from the GitHub repository into your current directory, in the **Open in Cloud Shell** dialog, select **Trust repo** and then select **Confirm**.

    The **Welcome to CloudKnox GCP Onboarding** screen appears, display four steps you have to take to onboard a GCP project.

    1. **Paste the environment vars from the CloudKnox portal.**

        1. Return to CloudKnox and select **Copy Export Variables**.
        1. In the GCP Onboarding shell editor, paste the variables you copied.
        1. Select the link to authorize access to your Google account.
        1. In the **Sign in with Google** dialog, select all the permissions, and then select **Allow**.

    1. **Execute the following command.**

        - When the **Google Sign In** box appears displaying some code, copy the code and paste it into the **GCP Onboarding screen**. 
        
        This verifies that you are the owner of the account and are logging in.
    1. **Execute the script to create the provider.**

        - To create the provider, copy and paste the script into the **GCP Onboarding screen**.
    1. **Execute the script to onboard the projects.**

        1. To set the PROJECT_ID, copy and paste the script into the **GCP Onboarding screen**.
        1. In the Authorize Cloud Shell dialog, to authorize all API calls that require your credentials, select Authorize.
    
        This creates the workload-identity-pool.sh, which creates all the required entities to facilitate the connection between OIDC and GCP.
20. When you run the script, you're asked to confirm that you want to enable the controller. Enter: **Y** for read and write permissions or **N** for read-only permissions into the project.
21. In the **CloudKnox Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that CloudKnox has started collecting data.





<!---## Next steps--->