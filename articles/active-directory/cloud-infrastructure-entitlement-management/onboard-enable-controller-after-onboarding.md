---
title: Enable or disable the controller in Microsoft Entra Permissions Management after onboarding is complete
description: How to enable or disable the controller in Microsoft Entra Permissions Management after onboarding is complete.
services: active-directory
author: mtillman
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2022
ms.author: mtillman
---

# Enable or disable the controller after onboarding is complete

> [!IMPORTANT]
> Entra Permissions Management (Entra) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to enable or disable the controller in Microsoft Azure and Google Cloud Platform (GCP) after onboarding is complete.

This article also describes how to enable the controller in Amazon Web Services (AWS) if you disabled it during onboarding. You can only enable the controller in AWS at this time; you can't disable it.

## Enable the controller in AWS

> [!NOTE]
>  You can only enable the controller in AWS; you can't disable it at this time.

1. Sign in to the AWS console of the member account in a separate browser window.
1. Go to the Entra home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **AWS**, and then select **Create Configuration**.
1. On the **Entra Onboarding - AWS Member Account Details** page, select **Launch Template**.

    The **AWS CloudFormation create stack** page opens, displaying the template.
1. In the **CloudTrailBucketName** box, enter a name.

    You can copy and paste the **CloudTrailBucketName** name from the **Trails** page in AWS.

    > [!NOTE]
    >  A *cloud bucket* collects all the activity in a single account that Entra monitors. Enter the name of a cloud bucket here to provide Entra with the access required to collect activity data.

1. In the **EnableController** box, from the drop-down list, select **True** to provide Entra with read and write access so that any remediation you want to do from the Entra platform can be done automatically.

1. Scroll to the bottom of the page, and in the **Capabilities** box and select **I acknowledge that AWS CloudFormation might create IAM resources with custom names**. Then select **Create stack**.

    This AWS CloudFormation stack creates a collection role in the member account with necessary permissions (policies) for data collection. A trust policy is set on this role to allow the OIDC role created in your AWS OIDC account to access it. These entities are listed in the **Resources** tab of your CloudFormation stack.

1. Return to Entra, and on the Entra **Onboarding - AWS Member Account Details** page, select **Next**.
1. On **Entra Onboarding – Summary** page, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully created configuration.**

## Enable or disable the controller in Azure


1. In Azure, open the **Access control (IAM)** page.
1. In the **Check access** section, in the **Find** box, enter **Cloud Infrastructure Entitlement Management**.

    The **Cloud Infrastructure Entitlement Management assignments** page appears, displaying the roles assigned to you.

    - If you have read-only permission, the **Role** column displays **Reader**.
    - If you have administrative permission, the **Role** column displays **User Access Administrative**.

1. To add the administrative role assignment, return to the **Access control (IAM)** page, and then select **Add role assignment**.
1. Add or remove the role assignment for Cloud Infrastructure Entitlement Management.

1. Go to the Entra home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **Azure**, and then select **Create Configuration**.
1. On the **Entra Onboarding - Azure Subscription Details** page, enter the **Subscription ID**, and then select **Next**.
1. On **Entra Onboarding – Summary** page, review the controller permissions, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**


## Enable or disable the controller in GCP

1. Execute the **gcloud auth login**.
1. Follow the instructions displayed on the screen to authorize access to your Google account.
1. Execute the **sh mciem-workload-identity-pool.sh** to create the workload identity pool, provider, and service account.
1. Execute the **sh mciem-member-projects.sh** to give Entra permissions to access each of the member projects.

    - If you want to manage permissions through Entra, select **Y** to **Enable controller**.
    - If you want to onboard your projects in read-only mode, select **N** to **Disable controller**.

1. Optionally, execute **mciem-enable-gcp-api.sh** to enable all recommended GCP APIs.

1. Go to the Entra home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.
1. On the **Data Collectors** dashboard, select **GCP**, and then select **Create Configuration**.
1. On the **Entra Onboarding - Azure AD OIDC App Creation** page, select **Next**.
1. On the **Entra Onboarding - GCP OIDC Account Details & IDP Access** page, enter the **OIDC Project Number** and **OIDC Project ID**, and then select **Next**.
1. On the **Entra Onboarding - GCP Project IDs** page, enter the **Project IDs**, and then select **Next**.
1. On the **Entra Onboarding – Summary** page, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an AWS account](cloudknox-onboard-aws.md).
- For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a GCP project](cloudknox-onboard-gcp.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md).
