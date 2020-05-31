---
title: Connect AWS CloudTrail to Azure Sentinel | Microsoft Docs
description: Learn how to connect AWS CloudTrail data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/27/2020
ms.author: yelevin

---

# Connect Azure Sentinel to AWS CloudTrail

Use the AWS connector to stream all your AWS CloudTrail events into Azure Sentinel. This connection process delegates access for Azure Sentinel to your AWS resource logs, creating a trust relationship between AWS CloudTrail and
Azure Sentinel. This is accomplished on AWS by creating a role that gives permission to Azure Sentinel to access your AWS logs.

> [!NOTE]
> AWS CloudTrail has [built-in limitations](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/WhatIsCloudTrail-Limits.html) in its LookupEvents API. It allows no more than two transactions per second (TPS) per account, and each query can return a maximum of 50 records. Consequently, if a single tenant constantly generates more than 100 records per second in one region, backlogs and delays in data ingestion will result.

## Prerequisites

You must have write permission on the Azure Sentinel workspace.

> [!NOTE]
> Azure Sentinel collects CloudTrail events from all regions. It is recommended that you do not stream events from one region to another.

## Connect AWS 


1. In Azure Sentinel, select **Data connectors** and then select the **Amazon Web Services** line in the table and in the AWS pane to the right,  click **Open connector page**.

1. Follow the instructions under **Configuration** using the following steps.
 
1.  In your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.

    ![AWS1](./media/connect-aws/aws-1.png)

1.  Choose **Roles** and select **Create role**.

    ![AWS2](./media/connect-aws/aws-2.png)

1.  Choose **Another AWS account.** In the **Account ID** field, enter the **Microsoft Account ID** (**123412341234**) that can be found in the AWS connector page in the Azure Sentinel portal.

    ![AWS3](./media/connect-aws/aws-3.png)

1.  Make sure **Require External ID** is selected and then and enter the External ID (Workspace ID) that can be found in the AWS connector page in the Azure Sentinel portal.

    ![AWS4](./media/connect-aws/aws-4.png)

1.  Under **Attach permissions policy** select **AWSCloudTrailReadOnlyAccess**.

    ![AWS5](./media/connect-aws/aws-5.png)

1.  Enter a Tag (Optional).

    ![AWS6](./media/connect-aws/aws-6.png)

1.  Then, enter a **Role name** and select the **Create role** button.

    ![AWS7](./media/connect-aws/aws-7.png)

1.  In the Roles list, choose the role you created.

    ![AWS8](./media/connect-aws/aws-8.png)

1.  Copy the **Role ARN**. In the Azure Sentinel portal, in the Amazon Web Services connector screen, paste it into the **Role to add** field and click **Add**.

    ![AWS9](./media/connect-aws/aws-9.png)

1. To use the relevant schema in Log Analytics for AWS events, search for **AWSCloudTrail**.



## Next steps
In this document, you learned how to connect AWS CloudTrail to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

