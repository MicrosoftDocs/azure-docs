---
title: Enable or disable the controller in Permissions Management after onboarding is complete
description: How to enable or disable the controller in Permissions Management after onboarding is complete.
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

# Enable or disable the controller after onboarding is complete

With the controller, you can decide what level of access to grant in Permissions Management.

* Enable to grant read and write access to your environments. You can right-size permissions and remediate through Permissions Management.
    
* Disable to grant read-only access to your environments.


This article describes how to enable the controller in Amazon Web Services (AWS), Microsoft Azure and Google Cloud Platform (GCP) after onboarding is complete.


This article also describes how to disable the controller in Microsoft Azure and Google Cloud Platform (GCP). Once you enable the controller in AWS, you can't disable it.


## Enable the controller in AWS

> [!NOTE]
>  You can enable the controller in AWS if you disabled it during onboarding. Once you enable the controller in AWS, you can’t disable it.

1. In a separate browser window, sign in to the AWS console of the member account.
1. Go to the Permissions Management home page, select **Settings** (the gear icon), then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **AWS**, then select **Create Configuration**.
1. On the **Permissions Management Onboarding - AWS Member Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.
1. In the **CloudTrailBucketName** box, enter a name.

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE]
    >  A *cloud bucket* collects all the activity in a single account that Permissions Management monitors. Enter the name of a cloud bucket here to provide Permissions Management with the access required to collect activity data.

1. In the **EnableController** box, from the drop-down list, select **True** to provide Permissions Management with read and write access so that any remediation you want to do from the Permissions Management platform can be done automatically.

1. Scroll to the bottom of the page, and in the **Capabilities** box and select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    This AWS CloudFormation stack creates a collection role in the member account with necessary permissions (policies) for data collection. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.

1. Return to Permissions Management, and on the Permissions Management **Onboarding - AWS Member Account Details** page, select **Next**.
1. On **Permissions Management Onboarding – Summary** page, review the information you've added, then select **Verify Now & Save**.

    The following message appears: **Successfully created configuration.**

## Enable or disable the controller in Azure

You can enable or disable the controller in Azure at the Subscription level of your Management Group(s).  

1. From the Azure [**Home**](https://portal.azure.com) page, select **Management groups**.
1. Locate the group for which you want to enable or disable the controller, then select the arrow to expand the group menu and view your subscriptions. Alternatively, you can select the **Total Subscriptions** number listed for your group.
1. Select the subscription for which you want to enable or disable the controller, then click **Access control (IAM)** in the navigation menu.
1. In the **Check access** section, in the **Find** box, enter **Cloud Infrastructure Entitlement Management**.

    The **Cloud Infrastructure Entitlement Management assignments** page appears, displaying the roles assigned to you.

    - If you have read-only permission, the **Role** column displays **Reader**.
    - If you have administrative permission, the **Role** column displays **User Access Administrator**.

1. To add the administrative role assignment, return to the **Access control (IAM)** page, then select **Add role assignment**.
1. Add or remove the role assignment for Cloud Infrastructure Entitlement Management.

1. Go to the Permissions Management home page, select **Settings** (the gear icon), then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **Azure**, then select **Create Configuration**.
1. On the **Permissions Management Onboarding - Azure Subscription Details** page, enter the **Subscription ID**, then select **Next**.
1. On **Permissions Management Onboarding – Summary** page, review the controller permissions, then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**


## Enable or disable the controller in GCP

1. Execute the **gcloud auth login**.
1. Follow the instructions displayed on the screen to authorize access to your Google account.
1. Execute the ``sh mciem-workload-identity-pool.sh`` to create the workload identity pool, provider, and service account.
1. Execute the ``sh mciem-member-projects.sh`` to give Permissions Management permissions to access each of the member projects.

    - If you want to manage permissions through Permissions Management, select **Y** to **Enable controller**.
    - If you want to onboard your projects in read-only mode, select **N** to **Disable controller**.

1. Optionally, execute ``mciem-enable-gcp-api.sh`` to enable all recommended GCP APIs.

1. Go to the Permissions Management home page, select **Settings** (the gear icon), then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **GCP**, and then select **Create Configuration**.
1. On the **Permissions Management Onboarding - Microsoft Entra OIDC App Creation** page, select **Next**.
1. On the **Permissions Management Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project Number** and **OIDC Project ID**, and then select **Next**.
1. On the **Permissions Management Onboarding - GCP Project IDs** page, enter the **Project IDs**, then select **Next**.
1. On the **Permissions Management Onboarding – Summary** page, review the information you've added, then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

## Next steps

- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md).
