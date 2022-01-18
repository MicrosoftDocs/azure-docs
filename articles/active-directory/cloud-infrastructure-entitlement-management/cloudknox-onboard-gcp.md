---
title:  Microsoft CloudKnox Permissions Management - Onboard the Google Cloud Platform (GCP) authorization system
description: How to onboard the Google Cloud Platform (GCP) authorization system on CloudKnox.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/13/2022
ms.author: v-ydequadros
---

# Onboard the Google Cloud Platform (GCP) authorization system

This topic describes how to onboard the Google Cloud Platform (GCP) authorization system on Microsoft CloudKnox Permissions Management (CloudKnox).

**To onboard the GCP authorization system on CloudKnox:**

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

    The **Welcome to CloudKnox GCP Onboarding** screen appears, displaying four steps to onboard a GCP project.

    1. **Paste the environment vars from the CloudKnox portal.**

        1. Return to CloudKnox and select **Copy Export Variables**.
        1. In the GCP Onboarding shell editor, paste the variables you copied.
        1. Select the link to authorize access to your Google account.
        1. In the **Sign in with Google** dialog, select all the permissions, and then select **Allow**.

    1. **Execute the following command.**

        - When the **Google Sign In** box appears, copy the code in the box and paste it into the **GCP Onboarding screen**. 
        
        Running this code confirms that you're the owner of the account and are logging in.
    1. **Execute the script to create the provider.**

        - To create the provider, copy and paste the script into the **GCP Onboarding screen**.
    1. **Execute the script to onboard the projects.**

        1. To set the PROJECT_ID, copy and paste the script into the **GCP Onboarding screen**.
        1. In the Authorize Cloud Shell dialog, to authorize all API calls that require your credentials, select **Authorize**.
    
         The workload-identity-pool.sh creates all the required entities to facilitate the connection between OIDC and GCP.
11. When you run the script, you're asked to confirm that you want to enable the controller. Enter: **Y** for read and write permissions or **N** for read-only permissions into the project.
12. In the **CloudKnox Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, in the **Recently Uploaded On** and **Recently Transformed On** columns, you’ll see that CloudKnox has started collecting data.





<!---## Next steps--->
<!---For an overview of the CloudKnox installation process, see[CloudKnox Installation overview](cloudknox-installation.html).--->
<!---For information on how to enable CloudKnox on your Azure AD tenant, see [Enable Microsoft CloudKnox Permissions Management on your Azure AD tenant](cloudknox-onboard-enable-tenant.html).--->
<!---For information on how to install GCP on CloudKnox, see [Install CloudKnox Sentry on GCP](cloudknox-sentry-install-gcp.md)--->