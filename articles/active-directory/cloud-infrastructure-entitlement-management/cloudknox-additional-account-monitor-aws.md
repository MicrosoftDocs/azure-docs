---
title: Add Amazon Web Services (AWS) accounts after deploying the Microsoft CloudKnox Permissions Management Sentry
description: Placeholder topic on how to add Amazon Web Services (AWS) accounts after deploying the Microsoft CloudKnox Permissions Management Sentry
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/20/2021
ms.author: v-ydequadros
---


# Add Amazon Web Services (AWS) accounts after deploying the Microsoft CloudKnox Permissions Management Sentry

After you've deployed the Microsoft CloudKnox Permissions Management Sentry, you can add other Amazon Web Services (AWS) accounts and monitor them.

## Add AWS accounts after deploying a sentry

To add AWS accounts to the CloudKnox sentry:

1. Create a cross-account IAM role for each Amazon Web Services (AWS) account you want to add.
2. Configure AWS Sentry (UI).
3. Configure Sentry CLI configuration.
 
## Create a cross-account IAM role for each AWS account

1. To deploy and create a cross account IAM role on each AWS account you want to monitor, download the [CloudFormation template](https://knox-software.s3.amazonaws.com/cloud-formation/member-account.yaml).
2. Update the *EC2_ACCOUNT_ID* for the account ID where the Sentry EC2 instance is deployed.
3. Replace *EC2_ROLE* with the IAM role that is attached to the EC2 instance.

## Configure AWS Sentry (UI)

1. Log in to the [CloudKnox admin console](https://app.cloudknox.io/data-sources/data-collectors).
2. Select **Dashboard**.
3. Select the ellipses (**...**) next to the AWS account currently being monitored by CloudKnox Sentry, and then select **Configure Sentry**.
4. Make a note of the email and PIN displayed under the **Configure Sentry** information. You'll need them later.

## Configure Sentry CLI configuration

1. To configure AWS Sentry, run the following script: 

   `sudo /opt/cloudknox/sentrysoftwareservice/bin/runAWSConfigCLI.sh`
2. To add other AWS accounts, select Option 1, **Add new AWS Accounts**.
3. Enter the **Account ID** and **Role Name** for each AWS account you want to add,until all accounts are added.

<!---## Next steps--->

