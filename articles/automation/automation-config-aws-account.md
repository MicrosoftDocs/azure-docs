---
title: Authenticate Azure Automation runbooks with Amazon Web Services
description: This article tells how to authenticate runbooks with Amazon Web Services.
keywords: aws authentication, configure aws
services: automation
ms.subservice: process-automation
ms.date: 10/28/2022
ms.custom: engagement-fy23
ms.topic: conceptual
---
# Authenticate runbooks with Amazon Web Services

You can automate common tasks with resources in Amazon Web Services (AWS) using Automation runbooks in Azure. You can automate many tasks in AWS using Automation runbooks similar to the resources in Azure. Ensure that you have the Azure subscription to authenticate. 

## Obtain AWS subscription and credentials

Ensure that you obtain an AWS subscription and specify a set of AWS credentials to authenticate your runbooks running from Azure Automation. Specific credentials required are the AWS Access Key and Secret Key. See [Using AWS Credentials](https://docs.aws.amazon.com/powershell/latest/userguide/specifying-your-aws-credentials.html).

## Configure Automation account

You can use an existing Automation account to authenticate with AWS. Alternatively, you can dedicate an account for runbooks targeting AWS resources. In this case, create a new [Automation account](automation-create-standalone-account.md).  

## Store AWS credentials

You must store the AWS credentials as assets in Azure Automation. See [Managing Access Keys for your AWS Account](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html) for instructions on how to create the Access Key and the Secret Key. When the keys are available, copy the Access Key ID and the Secret Key ID in a safe place. You can download your key file to store it safely.

### Create credential asset

After you have created and copied your AWS security keys, you must create a Credential asset with the Automation account. The asset allows you to securely store the AWS keys and reference them in your runbooks. See [Create a new credential asset with the Azure portal](shared-resources/credentials.md#create-a-new-credential-asset-with-the-azure-portal). 

Enter the following AWS information in the fields provided:
    
* **Name** - **AWScred**, or an appropriate value following your naming standards
* **User name** - Your access ID
* **Password** - Name of your Secret Key 

## Next steps

* To learn how to create runbooks to automate tasks in AWS, see [Deploy an Amazon Web Services VM with a runbook](automation-scenario-aws-deployment.md).