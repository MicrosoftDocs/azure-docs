---
title: Collecting data in Azure Security Insights | Microsoft Docs
description: Learn how to collect data in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/4/2019
ms.author: rkarlin

---
# Collecting data from AWS


This article provides instructions for connecting Security Insights to your existing Amazon Web Services account using the connector. This connection streams AWS logs into Security Insights. 
  
## How to connect Amazon Web Services to Security Insights  

To stream logs from AWS to Security Insights, you first have to download keys to your AWS instance, and then paste them in the new account you create in Security Insights.

## Step 1: Download your AWS keys
  
1.  In your [Amazon Web Services console](https://console.aws.amazon.com/), under **Security, Identity & Compliance**, click on **IAM**.  
  
     ![AWS identity and access](./media/security-insights-connect-aws/aws-identity-and-access.png "AWS identity and access")  
  
2.  Click on the **Users** tab and then click **Add user**.  
  
     ![AWS users](./media/security-insights-connect-aws/aws-users.png "AWS users")      
  
4.  In the **Details** step, provide a new user name for Security Insights. Make sure that under **Access type** you select **Programmatic access** and click **Next Permissions**.  

     ![create user in AWS](./media/security-insights-connect-aws/aws-create-user.png "Create user in AWS")

5. Click on the JSON tab:

     ![AWS JSON](./media/security-insights-connect-aws/aws-json.png "AWS JSON tab")

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

     ![AWS code](./media/security-insights-connect-aws/aws-code.png "AWS code")
    
6. Click **Review policy**.

7. Provide a **Name** and click **Create policy**.

     ![AWS name policy](./media/security-insights-connect-aws/aws-create-policy.png "AWS create policy")

9. Back in the **Add user** screen, refresh the list if necessary, and select the user you created, and click **Next Review**.

   ![Review user policy in AWS](./media/security-insights-connect-aws/aws-review-user.png "Review user in AWS")

10. If all the details are correct, click **Create user**.

    ![User permissions in AWS](./media/security-insights-connect-aws/aws-user-permissions.png "Review user permissions in AWS")

11. When you get the success message, click **Download .csv** to save a copy of the new user's credentials, you need these later.  

    ![Download csv in AWS](./media/security-insights-connect-aws/aws-download-csv.png "Download csv in AWS")
  
## Step 2: Set Security Insights to gather the data

1. In Security Insights, click **Data collection** and then select the **AWS** tile.

2. Click **Add account**. In the **AWS account details** pane, provide the keys that you saved at the end of Step 1 and click **Connect**.


## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Center. To learn more about Security Center, see the following articles:

*