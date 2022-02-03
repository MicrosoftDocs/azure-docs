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
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Onboard a Google Cloud Platform (GCP) project

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to onboard a Google Cloud Platform (GCP) project on CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> Any group member can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Onboard a GCP project

1. If the **Data collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data collectors** tab.

1. On the **Data collectors** tab, select **GCP**, and then select **Create configuration**.

    The **CloudKnox onboarding – Azure OIDC app creation** box displays the **OIDC Azure project name** box, and the Azure command-line interface (CLI) script.

    OpenID Connect (OIDC) is an authentication protocol that allows you to verify a user's identity when they're trying to access a protected HTTPS end point.

    <!---1. In the **OIDC Workload Identity Pool Id** box, enter your ID.--->
    <!---1. In the **OIDC Service Account Name** box, enter your account name.--->

1. To create an application that establishes the OIDC connection with GCP, copy the Azure CLI script. Then run the script in your command-line app.

    <!---Add info on how to do this manually.--->

1. When the app is successfully created, return to CloudKnox and select **Next**.

    The **CloudKnox onboarding – GCP OIDC account details and IDP access** box appears.

1. In the **OIDC GCP project number** box, enter the GCP project number.

1. In the **OIDC GCP project ID** box, enter the GCP project ID, and then select **Next**.

1. In the **Enter your GCP project IDs** box, enter the GCP project ID from which you want to collect data. 

    You can enter up to 10 GCP project IDs in this box. Click the plus icon next to the text box to insert more project IDs.

1. To launch Google Cloud, select **Launch SSH**.

1. To copy all your scripts into your current directory, in **Open in Cloud Shell**, select **Trust repo**, and then select **Confirm**.

    The Cloud Shell provisions the Cloud Shell machine and makes a connection to your Cloud Shell instance.

    > [!NOTE] 
    > Follow the instructions in the browser as they may be different from the ones given here.


1. The **Welcome to CloudKnox GCP onboarding** screen appears, displaying four steps you must complete to onboard your GCP project:

    1. **Paste the environment vars from the CloudKnox portal.**

        1. Return to CloudKnox and select **Copy export variables**.
        1. In the GCP Onboarding shell editor, paste the variables you copied.
        1. Select the link to authorize access to your Google account.
        1. In **Sign in with Google**, select all the permissions, and then select **Allow**.

    1. **Execute the following command.**

        When the **Google sign in** box appears: 

        1. Go to CloudKnox and copy the script in the box. 
        1. Return to Google and paste the script into the **GCP onboarding screen**. 
        1. Run the script to confirm that you're the owner of the account and are logging in.

    1. **Execute the script to create the provider.**

        - To create the provider, copy and paste the script into the **GCP onboarding screen**.

1. **Execute the script to onboard the projects.**

    1. To set the PROJECT_ID, copy and paste the script into the **GCP onboarding screen**.
    1. To authorize all API calls that require your credentials, in **Authorize Cloud Shell**, select **Authorize**.

     The workload-identity-pool.sh creates all the entities that are required to enable the connection between OIDC and GCP.

1. When you run the script, you're asked to confirm that you want to enable the controller. 

    - Enter: **Y** for read and write permissions or **N** for read-only permissions into the project.

1. In **CloudKnox onboarding – Summary**, review the information you’ve added, and then select **View now & save**.

    The following message appears: **Successfully created configuration.**

    On the **Data collectors** tab, the **Recently uploaded on** column displays **Collecting** and the **Recently transformed on** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your GCP data.

1. To view your data, select the **Authorization systems** tab. 

    The **Status** column in the table displays **Collecting data.**

    The data collection process takes a few minutes, so you may have to refresh your screen a few times to see the data.



## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->