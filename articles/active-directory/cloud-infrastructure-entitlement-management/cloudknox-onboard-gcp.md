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
ms.date: 01/18/2022
ms.author: v-ydequadros
---

# Onboard the Google Cloud Platform (GCP) authorization system

This topic describes how to onboard the Google Cloud Platform (GCP) authorization system on Microsoft CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

> [!NOTE] 
> Before beginning this task, make sure you have completed the steps provided in Enable CloudKnox on your Azure Active Directory tenant.

<!---[Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.html).--->

**To onboard the GCP authorization system on CloudKnox:**

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **GCP**, and then select **Create Configuration**.

    The **CloudKnox Onboarding – Azure OIDC App Creation** box displays the **OIDC Azure Project Name** box, and the Azure command-line interface (CLI) script.

    <!---1. In the **OIDC Workload Identity Pool Id** box, enter your ID.--->
    <!---1. In the **OIDC Service Account Name** box, enter your account name.--->

1. To create an application that will establish the OIDC connection with GCP, copy the Azure CLI script and run it in your command-line app.

    <!---Add info on how to do this manually.--->

1. When the app is successfully created, return to CloudKnox and select **Next**.

    The **CloudKnox Onboarding – GCP OIDC Account Details and IDP Access** box appears.

1. In the **OIDC GCP Project Number** box, enter the GCP project number.

1. In the **OIDC GCP Project ID** box, enter the GCP project ID, and then select **Next**.

1. In the **Enter your GCP Project IDs** box, enter the GCP project ID from which you want to collect data. 

    You can enter up to 10 GCP project IDs in this box.

1. To launch Google Cloud, select **Launch SSH**.

1. To copy all your scripts from the GitHub repository into your current directory, in **Open in Cloud Shell**, select **Trust repo** and then select **Confirm**.

    The Cloud Shell provisions the Cloud Shell machine and makes a connection to your Cloud Shell instance.

    The **Welcome to CloudKnox GCP Onboarding** screen appears. The pane on the right displays four steps you must complete to onboard your GCP project:

    1. **Paste the environment vars from the CloudKnox portal.**

        1. Return to CloudKnox and select **Copy Export Variables**.
        1. In the GCP Onboarding shell editor, paste the variables you copied.
        1. Select the link to authorize access to your Google account.
        1. In **Sign in with Google**, select all the permissions, and then select **Allow**.

    1. **Execute the following command.**

        When the **Google Sign In** box appears: 
        1. Go to CloudKnox and copy the script in the box. 
        1. Return to Google and paste the script into the **GCP Onboarding screen**. 
        1. Run the script to confirm that you're the owner of the account and are logging in.

    1. **Execute the script to create the provider.**

        - To create the provider, copy and paste the script into the **GCP Onboarding screen**.

    1. **Execute the script to onboard the projects.**

        1. To set the PROJECT_ID, copy and paste the script into the **GCP Onboarding screen**.
        1. To authorize all API calls that require your credentials, in **Authorize Cloud Shell**, select **Authorize**.

         The workload-identity-pool.sh creates all the required entities to facilitate the connection between OIDC and GCP.

1. When you run the script, you're asked to confirm that you want to enable the controller. 

    - Enter: **Y** for read and write permissions or **N** for read-only permissions into the project.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **View Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This confirms that CloudKnox has started collecting and processing your GCP data.

1. To view your data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process takes a few minutes, so you may have to refresh your screen a few times to see the data.



<!---## Next steps--->

<!---For information on how to onboard Amazon Web Services (AWS), see [Onboard the (AWS) authorization system](cloudknox-onboard-aws.html).--->
<!---For information on how to onboard Microsoft Azure, see [Onboard the Azure authorization system](cloudknox-onboard-azure.html).--->
