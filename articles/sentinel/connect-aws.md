---
title: Connect Symantec AWS data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Symantec AWS data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/04/2019
ms.author: rkarlin

---

# Connect Azure Sentinel to AWS

Use the AWS connector to stream all your AWS CloudTrail events into Azure Sentinel. This connection process delegates access for Azure Sentinel to your AWS resource logs, creating a trust relationship between AWS CloudTrail and
Azure Sentinel. This is accomplished on AWS by creating a role that gives permission to Azure Sentinel to access your AWS logs.

## Prerequisites

You must have write permission on the Azure Sentinel workspace.

 
1.  In your Amazon Web Services console, under **Security, Identity & Compliance**, click on **IAM**.

    ![AWS1](./media/connect-aws/aws-1.png)

2.  Choose **Roles** and click **Create role**.

    ![AWS2](./media/connect-aws/aws-2.png)

3.  Choose **Another AWS account.** In the **Account ID** field, enter the **Microsoft Account ID** (**123412341234**) that can be found in the AWS connector page in the Azure Sentinel portal.

    ![AWS3](./media/connect-aws/aws-3.png)

4.  Make sure **Require External ID** is selected and then and enter the External ID (Workspace ID) that can be found in the AWS connector page in the Azure Sentinel portal.

    ![AWS4](./media/connect-aws/aws-4.png)

5.  Under **Attach permissions policy** select **AWSCloudTrailReadOnlyAccess**.

    ![AWS5](./media/connect-aws/aws-5.png)

6.  Enter a Tag (Optional).

    ![AWS6](./media/connect-aws/aws-6.png)

7.  Then, enter a **Role name** and click the **Create role** button.

    ![AWS7](./media/connect-aws/aws-7.png)

8.  In the Roles list, choose the role you created.

    ![AWS8](./media/connect-aws/aws-8.png)

9.  Copy the **Role ARN** and paste it into the **Role to add** field in the Azure Sentinel Portal.

    ![AWS9](./media/connect-aws/aws-9.png)

10. To use the relevant schema in Log Analytics for AWS events, search for **AWSCloudTrail**.
