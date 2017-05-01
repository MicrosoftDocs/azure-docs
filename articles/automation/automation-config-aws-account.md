---
title: Configure Authentication with Amazon Web Services  | Microsoft Docs
description: This article describes how to create and validate an AWS credential for runbooks in Azure Automation managing AWS resources.
services: automation
documentationcenter: ''
author: mgoedtel
manager: jwhit
editor: tysonn
keywords: aws authentication, configure aws

ms.assetid: b6dde4bb-26ac-4876-9aa9-e586bed30d6b
ms.service: automation
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/14/2017
ms.author: magoedte

---
# Authenticate Runbooks with Amazon Web Services
Automating common tasks with resources in Amazon Web Services (AWS) can be accomplished with Automation runbooks in Azure.  You can automate many tasks in AWS using Automation runbooks just like you can with resources in Azure.  All that is required are two things:

* An AWS subscription and a set of credentials.  Specifically your AWS Access Key and Secret Key.  For more information, please review the article [Using AWS Credentials](http://docs.aws.amazon.com/powershell/latest/userguide/specifying-your-aws-credentials.html).
* An Azure subscription and Automation account.  For more information on setting up an Azure Automation account, please review the article [Configure Azure Run As Account](automation-sec-configure-azure-runas-account.md).  

To authenticate with AWS, you must specify a set of AWS credentials to authenticate your runbooks running from Azure Automation. If you already have an Automation account created and you want to use that to authenticate with AWS, you can follow the steps in the following section.  If you want to dedicated an account for runbooks targetting AWS resources, you should first create a new [Automation account](automation-offering-get-started.md) (skip the option to create a service principal) and then follow the steps below.

## Configure Automation account
For Azure Automation to communicate with AWS, you first need to retrieve your AWS credentials and store them as assets in Azure Automation.  Perform the following steps documented in the AWS document [Managing Access Keys for your AWS Account](http://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html) to create an Access Key and copy the **Access Key ID** and **Secret Access Key** (optionally download your key file to store it somewhere safe).

After you have created and copied your AWS security keys, you need to create a Credential asset with an Azure Automation account to securely store them and reference them with your runbooks.  Follow the steps in the section **To create a new credential** in the [Credential assets in Azure Automation](automation-credentials.md#to-create-a-new-credential-asset-with-the-azure-portal) article and enter the following information:

1. In the **Name** box, enter **AWScred** or an appropriate value following your naming standards.  
2. In the **User name** box type your **Access ID** and your **Secret Access Key** in the **Password** and **Confirm password** box.   

## Next steps
* Reivew the solution article [Automating deployment of a VM in Amazon Web Services](automation-scenario-aws-deployment.md) to learn how to create runbooks to automate tasks in AWS.

