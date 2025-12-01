---
title: Deploy AWS GuardDuty log collection for Microsoft Sentinel with CloudFormation
description: Use an AWS CloudFormation stack to send encrypted AWS GuardDuty findings to S3 and ingest them into Microsoft Sentinel with the AWS S3 connector.
author: KanenasCS
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: how-to
ms.collection: microsoft-sentinel
ms.date: 12/01/2025
---

# Deploy AWS GuardDuty log collection for Microsoft Sentinel with CloudFormation

### 1. Create the CloudFormation stack

1. Sign in to the **AWS Management Console**.
2. In the search bar, search for **CloudFormation** and open the **CloudFormation** service.

![](images/guardduty-step-1.png)

3. Select **Create stack** → **With new resources (standard)**.

![](images/guardduty-step-2.png)

---

#### 1.1 Step 1 – Specify template

1. Under **Prepare template**, select **Choose an existing template**.
2. Under **Template source**, select **Upload a template file**, then choose and upload the provided template file.
3. Click **Next**.

![](images/guardduty-step-3.png)

---

#### 1.2 Step 2 – Specify stack details

Fill in the following parameters:

- **Stack name**: Enter a name for the stack.  
- **AWSRoleName**: Enter the IAM role name (the name must start with `OIDC_XXXXX`).  
- **GuardDutyBucketName**: Enter the name of the S3 bucket to be used.  
  - If you already have a generic S3 bucket or wish to use another existing bucket, enter its name here.  
- **BucketName**: Set to `false` if you are using an existing S3 bucket (leave as `true` if a new bucket should be created).  
- **GuardDutyKmsAliasName**: Alias name (without the `alias/` prefix) for the new KMS key that will encrypt GuardDuty findings.  
- **SentinelSQSQueueName**: Enter the name of the Amazon SQS queue.  
- **LogFileSuffix**: S3 object key suffix for GuardDuty exported findings used in the notification filter (must be `.gz` by default).  
- **SentinelWorkspaceId**: Enter the **Workspace ID** from the Azure Log Analytics workspace page:  
  - In the Azure portal, go to **Log Analytics workspace → Overview** and copy the **Workspace ID**.

![](images/guardduty-step-4.png)

After filling all required fields, click **Next**.

![](images/guardduty-step-5.png)

---

#### 1.3 Step 3 – Configure stack options

1. Leave the default options unchanged.
2. Acknowledge that AWS CloudFormation might create IAM resources with custom names by selecting the required checkbox.

![](images/guardduty-step-6.png)

3. Click **Next**.

---

#### 1.4 Step 4 – Review

1. Review all settings and confirm that all required fields are correctly populated.

![](images/guardduty-step-7.png)

2. Click **Submit** to create the stack.

Monitor the stack creation:

1. In **CloudFormation → Stacks → Events**, monitor the progress status.
2. When the status indicates completion, verify in the left panel that the stack has been successfully created.

![](images/guardduty-step-8.png)

---

### 2. Export GuardDuty logs

1. Go to the **GuardDuty** console and open **Settings**.

![](images/guardduty-step-9.png)

2. Under **Findings export options**, choose **Configure now** (or **Edit** if already configured).

![](images/guardduty-step-10.png)

3. Enter the **KMS key ARN** and **S3 bucket ARN**, then click **Save**.

![](images/guardduty-step-11.png)
