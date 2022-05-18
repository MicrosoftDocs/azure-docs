---
title: Add an account/ subscription/ project to Microsoft CloudKnox Permissions Management after onboarding is complete
description: How to add an account/ subscription/ project to Microsoft CloudKnox Permissions Management after onboarding is complete.
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

# Add an account/ subscription/ project after onboarding is complete

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to add an Amazon Web Services (AWS) account, Microsoft Azure subscription, or Google Cloud Platform (GCP) project in Microsoft CloudKnox Permissions Management (CloudKnox) after you've completed the onboarding process.

## Add an AWS account after onboarding is complete

1. In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data collectors** tab.
1. On the **Data collectors** dashboard, select **AWS**.
1. Select the ellipses **(...)** at the end of the row, and then select **Edit Configuration**.

    The **CloudKnox Onboarding - Summary** page displays.

1. Go to **AWS Account IDs**, and then select **Edit** (the pencil icon).

    The **CloudKnox Onboarding - AWS Member Account Details** page displays.

1. Go to **Enter Your AWS Account IDs**, and then select **Add** (the plus **+** sign).
1. Copy your account ID from AWS and paste it into the **Enter Account ID** box.

    The AWS account ID is automatically added to the script.

    If you want to add more account IDs, repeat steps 5 and 6 to add up to a total of 10 account IDs.

1. Copy the script.
1. Go to AWS and start the Cloud Shell.
1. Create a new script for the new account and press the **Enter** key.
1. Paste the script you copied.
1. Locate the account line, delete the original account ID (the one that was previously added), and then run the script.
1. Return to CloudKnox, and the new account ID you added will be added to the list of account IDs displayed in the **CloudKnox Onboarding - Summary** page.
1. Select **Verify now & save**.

    When your changes are saved, the following message displays: **Successfully updated configuration.**


## Add an Azure subscription after onboarding is complete

1. In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data collectors** tab.
1. On the **Data collectors** dashboard, select **Azure**.
1. Select the ellipses **(...)** at the end of the row, and then select **Edit Configuration**.

    The **CloudKnox Onboarding - Summary** page displays.

1. Go to **Azure subscription IDs**, and then select **Edit** (the pencil icon).
1. Go to **Enter your Azure Subscription IDs**, and then select **Add subscription** (the plus **+** sign).
1. Copy and paste your subscription ID from Azure and paste it into the subscription ID box.

    The subscription ID is automatically added to the subscriptions line in the script.

    If you want to add more subscription IDs, repeat steps 4 and 5 to add up to a total of 10 subscriptions.

1. Copy the script.
1. Go to Azure and start the Cloud Shell.
1. Create a new script for the new subscription and press enter.
1. Paste the script you copied.
1. Locate the subscription line and delete the original subscription ID (the one that was previously added), and then run the script.
1. Return to CloudKnox, and the new subscription ID you added will be added to the list of subscription IDs displayed in the **CloudKnox Onboarding - Summary** page.
1. Select **Verify now & save**.

    When your changes are saved, the following message displays: **Successfully updated configuration.**

## Add a GCP project after onboarding is complete

1. In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data collectors** tab.
1. On the **Data collectors** dashboard, select **GCP**.
1. Select the ellipses **(...)** at the end of the row, and then select **Edit Configuration**.

    The **CloudKnox Onboarding - Summary** page displays.

1. Go to **GCP Project IDs**, and then select **Edit** (the pencil icon).
1. Go to **Enter your GCP Project IDs**, and then select **Add Project ID** (the plus **+** sign).
1. Copy and paste your project ID from Azure and paste it into the **Project ID** box.

    The project ID is automatically added to the **Project ID** line in the script.

    If you want to add more project IDs, repeat steps 4 and 5 to add up to a total of 10 project IDs.

1. Copy the script.
1. Go to GCP and start the Cloud Shell.
1. Create a new script for the new project ID and press enter.
1. Paste the script you copied.
1. Locate the project ID line and delete the original project ID (the one that was previously added), and then run the script.
1. Return to CloudKnox, and the new project ID you added will be added to the list of project IDs displayed in the **CloudKnox Onboarding - Summary** page.
1. Select **Verify now & save**.

    When your changes are saved, the following message displays: **Successfully updated configuration.**



## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an AWS account](cloudknox-onboard-aws.md).
 - For information on how to onboard a Microsoft Azure subscription, see [Onboard a Microsoft Azure subscription](cloudknox-onboard-azure.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a GCP project](cloudknox-onboard-gcp.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](cloudknox-onboard-enable-controller-after-onboarding.md).
