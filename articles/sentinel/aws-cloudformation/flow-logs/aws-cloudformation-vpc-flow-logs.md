---
title: Deploy AWS VPC Flow Logs collection for Microsoft Sentinel with CloudFormation
description: Use an AWS CloudFormation stack to configure AWS VPC Flow Logs to S3 and ingest them into Microsoft Sentinel with the AWS S3 connector.
author: KanenasCS
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: how-to
ms.collection: microsoft-sentinel
ms.date: 12/01/2025
---

# Deploy AWS VPC Flow Logs collection for Microsoft Sentinel with CloudFormation

### 1. Create the CloudFormation stack

1. Sign in to the **AWS Management Console**.
2. In the search bar, search for **CloudFormation** and open the **CloudFormation** service.

![](images/flowlogs-step-1.png)

3. Select **Create stack** → **With new resources (standard)**.

(images/flowlogs-step-2.png)

---

#### 1.1 Step 1 – Specify template

1. Under **Prepare template**, select **Choose an existing template**.
2. Under **Template source**, select **Upload a template file**, then choose and upload the provided template file.
3. Click **Next**.

![](images/flowlogs-step-3.png)

---

#### 1.2 Step 2 – Specify stack details

Fill in the following parameters:

- **Stack name**: Enter a name for the stack.  
- **AWSRoleName**: Enter the IAM role name (the name must start with `OIDC_XXXXX`).  
- **BucketName**: Enter the name of the S3 bucket to be used.  
  - If you already have a generic S3 bucket or wish to use another existing bucket, enter its name here.  
- **CreateNewBucket**: Set to `false` if you are using an existing S3 bucket (leave as `true` if a new bucket should be created).  
- **FlowLogsPrefix (Optional)**: Optionally specify an S3 prefix for Flow Logs (must end with `/`).  
  - If left empty, the default `AWSLogs/${AWS::AccountId}/vpcflowlogs/` will be used.  
- **SentinelSQSQueueName**: Enter the name of the Amazon SQS queue.  
- **SentinelWorkspaceId**: Enter the **External ID** from the Azure connector page:  
  - In the Azure portal, go to **Microsoft Sentinel → Data connectors → open the relevant connector → expand _Setup with PowerShell script_** and copy the **External ID**.

![](images/flowlogs-step-4.png)  
![](images/flowlogs-step-5.png)

After filling all required fields, click **Next**.

![](images/flowlogs-step-6.png)

---

#### 1.3 Step 3 – Configure stack options

1. Leave the default options unchanged.
2. Acknowledge that AWS CloudFormation might create IAM resources with custom names by selecting the required checkbox.

![](images/flowlogs-step-7.png)

3. Click **Next**.

---

#### 1.4 Step 4 – Review

1. Review all settings and confirm that all required fields are correctly populated.

![](images/flowlogs-step-8.png)  
![](images/flowlogs-step-9.png)

2. Click **Submit** to create the stack.

Monitor the stack creation:

1. In **CloudFormation → Stacks → Events**, monitor the progress status.

![](images/flowlogs-step-10.png)

2. When the status indicates completion, verify in the left panel that the stack has been successfully created.

![](images/flowlogs-step-11.png)

---

### 2. Create VPC Flow Logs

1. In the AWS Management Console, search for and open the **VPC (Virtual Private Cloud)** service.

![](images/flowlogs-step-12.png)

2. In the left pane, select **Your VPCs**.

![](images/flowlogs-step-13.png)

3. Select the VPC for which you want to enable Flow Logs and open its details.

![](images/flowlogs-step-14.png)

4. Navigate to the **Flow logs** tab.

![](images/flowlogs-step-15.png)

5. Click **Create flow log**.

![](images/flowlogs-step-16.png)

6. Under **Flow log settings**, configure the following:

   - **Name**: Enter a name for the flow log.  
   - **Filter**: Select one of the following (recommended: **All**):  
     - All  
     - Accept  
     - Reject  
   - **Maximum aggregation interval**: Choose **1 minute** or **10 minutes** (recommended: **1 minute**).  
   - **Destination**: Select **Send to an Amazon S3 bucket**.  
   - **S3 bucket ARN**: Enter the ARN of the S3 bucket created or specified in the previous steps.  
     - To find it: open the **S3** service → select the bucket → **Properties** tab → copy the **ARN**.

![](images/flowlogs-step-17.png)

   - **Partition logs by time**: Choose **Every 1 hour** or **Every 24 hours** (recommended: **Every 1 hour**).  
   - Leave all other settings at their default values.

![](images/flowlogs-step-18.png)  
![](images/flowlogs-step-19.png)

7. Click **Create flow log**.
