---
title: Configure Authentication with Amazon Web Services
description: This article describes how to create and validate an AWS credential for runbooks in Azure Automation managing AWS resources.
keywords: aws authentication, configure aws
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 04/17/2018
ms.topic: conceptual
manager: carmonm
---
# Authenticate Runbooks with Amazon Web Services

Automating common tasks with resources in Amazon Web Services (AWS) can be accomplished with Automation runbooks in Azure. You can automate many tasks in AWS using Automation runbooks just like you can with resources in Azure. All that is required are two things:

* An AWS subscription and a set of credentials. Specifically your AWS Access Key and Secret Key. For more information, review the article [Using AWS Credentials](https://docs.aws.amazon.com/powershell/latest/userguide/specifying-your-aws-credentials.html).
* An Azure subscription and Automation account.

To authenticate with AWS, you must specify a set of AWS credentials to authenticate your runbooks running from Azure Automation. If you already have an Automation account created and you want to use that to authenticate with AWS, you can follow the steps in the following section: If you want to dedicate an account for runbooks targeting AWS resources, you should first create a new [Automation account](automation-offering-get-started.md) (skip the option to create a service principal) and use the following steps:

## Configure Automation account

For Azure Automation to communicate with AWS, you first need to retrieve your AWS credentials and store them as assets in Azure Automation. Perform the following steps documented in the AWS document [Managing Access Keys for your AWS Account](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html) to create an Access Key and copy the **Access Key ID** and **Secret Access Key** (optionally download your key file to store it somewhere safe).

After you have created and copied your AWS security keys, you need to create a Credential asset with an Azure Automation account to securely store them and reference them with your runbooks. Follow the steps in the section: **To create a new credential** in the [Credential assets in Azure Automation](shared-resources/credentials.md#to-create-a-new-credential-asset-with-the-azure-portal) article and enter the following information:

1. In the **Name** box, enter **AWScred** or an appropriate value following your naming standards.
2. In the **User name** box, type your **Access ID** and your **Secret Access Key** in the **Password** and **Confirm password** box.

## Next steps

* Review the solution article [Automating deployment of a VM in Amazon Web Services](automation-scenario-aws-deployment.md) to learn how to create runbooks to automate tasks in AWS.
