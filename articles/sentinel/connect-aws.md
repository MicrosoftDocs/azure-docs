---
title: Collecting AWS data in Azure Sentinel | Microsoft Docs
description: Learn how to collect AWS data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: e1a462bd-323d-4886-b349-87de6a54e77c
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Collect data from AWS


This article provides instructions for connecting Azure Sentinel to your existing Amazon Web Services account using the connector. This connection streams your AWS CloudTrail logs into your Azure Sentinel workspace in just a few clicks. 
  
## How to connect Amazon Web Services to Azure Sentinel  

To stream logs from AWS to Azure Sentinel, you first have to download keys to your AWS instance, and then paste them in the new account you create in Azure Sentinel.

## Step 1: Download your AWS keys
  
1.  In your [Amazon Web Services console](https://console.aws.amazon.com/), under **Security, Identity & Compliance**, click on **IAM**.  
  
     ![AWS identity and access](./media/connect-aws/aws-identity-and-access.png "AWS identity and access")  
  
2.  Click on the **Users** tab and then click **Add user**.  
  
     ![AWS users](./media/connect-aws/aws-users.png "AWS users")
  
4.  In the **Details** step, provide a new user name for Azure Sentinel. Make sure that under **Access type** you select **Programmatic access** and click **Next permissions**.  

     ![create user in AWS](./media/connect-aws/aws-create-user.png "Create user in AWS")

5. Click on the JSON tab:

     ![AWS JSON](./media/connect-aws/aws-json.png "AWS JSON tab")

6. Paste the following script into the provided area:

    ```     
    {  
      "Version" : "2012-10-17",  
      "Statement" : [{  
          "Action" : [  
            "cloudtrail:DescribeTrails",  
            "cloudtrail:LookupEvents",  
            "cloudtrail:GetTrailStatus",  
            "cloudwatch:Describe*",  
            "cloudwatch:Get*",  
            "cloudwatch:List*",  
            "iam:List*",  
            "iam:Get*",
            "s3:ListAllMyBuckets",
            "s3:PutBucketAcl",
            "s3:GetBucketAcl",
            "s3:GetBucketLocation"
          ],  
          "Effect" : "Allow",  
          "Resource" : "*"  
        }  
      ]  
     }  
  
    ```  

     ![AWS code](./media/connect-aws/aws-code.png "AWS code")
    
6. Click **Review policy**.

7. Provide a **Name** and click **Create policy**.

     ![AWS name policy](./media/connect-aws/aws-create-policy.png "AWS create policy")

9. Back in the **Add user** screen, refresh the list if necessary, and select the user you created, and click **Next review**.

   ![Review user policy in AWS](./media/connect-aws/aws-review-user.png "Review user in AWS")

10. If all the details are correct, click **Create user**.

    ![User permissions in AWS](./media/connect-aws/aws-user-permissions.png "Review user permissions in AWS")

11. When you get the success message, click **Download .csv** to save a copy of the new user's credentials, you need these later.  

    ![Download csv in AWS](./media/connect-aws/aws-download-csv.png "Download csv in AWS")
  
## Step 2: Set Azure Sentinel to gather the data

1. In Azure Sentinel, click **Data collection** and then select the **AWS** tile.

2. Under **Add account to Azure Sentinel integration** click **Add account**. 
1. In the **AWS account details** pane, provide the **AWS account name**, the **Access key, and the **Secret key** that you saved at the end of Step 1 and click **Connect**.
 
 
> [!NOTE]
> Make sure you don't connect the same account twice, this will stop the connection from working properly.

## Next steps
In this document, you learned how to connect AWS to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](qs-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
