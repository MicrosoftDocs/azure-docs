---
title: Deploy AWS CloudTrail log collection for Microsoft Sentinel with CloudFormation
description: Use an AWS CloudFormation stack to configure AWS CloudTrail to send logs to an S3 bucket and onboard them to Microsoft Sentinel via the AWS S3 connector.
author: KanenasCS
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: how-to
ms.collection: microsoft-sentinel
ms.date: 12/01/2025
---

# Deploy AWS CloudTrail log collection for Microsoft Sentinel with CloudFormation

### 1. Microsoft Sentinel configuration

1. Sign in to the **Azure portal**.
2. Navigate to **Microsoft Sentinel** and then to **Content Hub**.
3. Install the connector **Amazon Web Services S3**.

![Azure Sentinel Security hub](images/cloudtrail-step-1.png)

4. Navigate to **Data connectors** and open the **Amazon Web Services S3** connector page.

---

### 2. Create the CloudFormation stack

1. Sign in to the **AWS Management Console**.
2. In the search bar, search for **CloudFormation** and open the **CloudFormation** service.

![CloudFormation Service](images/cloudtrail-step-2.png)

3. Select **Create stack** → **With new resources (standard)**.

![Create stack](images/cloudtrail-step-3.png)

---

#### 2.1 Step 1 – Specify template

1. Under **Prepare template**, select **Choose an existing template**.
2. Under **Template source**, select **Upload a template file**, then choose and upload the provided template file.
3. Click **Next**.

![Step 1](images/cloudtrail-step-4.png)

---

#### 2.2 Step 2 – Specify stack details

Fill in the following parameters:

- **Stack name**: Enter a name for the stack.  
- **AWSRoleName**: Enter the IAM role name (the name must start with `OIDC_XXXXX`).  
- **GuardDutyBucketName**: Enter the name of the S3 bucket to be used.  
  - If you already have a generic S3 bucket or want to use an existing bucket, enter its name here.  
- **BucketName**: Set to `false` if you are using an existing S3 bucket (leave as `true` if a new bucket should be created).  
- **CloudTrail-TrailName**: Name of the existing CloudTrail trail that delivers logs to the S3 bucket.  
- **SentinelSQSQueueName**: Enter the name of the Amazon SQS queue.  
- **LogFileSuffix**: S3 object key suffix for CloudTrail exported findings used in the notification filter (must be `.gz` as the default).  
- **SentinelWorkspaceId**: Enter the Workspace ID from the Azure Log Analytics workspace page:  
  - In the Azure portal, go to **Log Analytics workspace → Overview** and copy the **Workspace ID**.

![Step 2](images/cloudtrail-step-5.png)

After filling all required fields, click **Next**.

![Step 2.1](images/cloudtrail-step-6.png)

---

#### 2.3 Step 3 – Configure stack options

1. Leave the default options unchanged.
2. Acknowledge that AWS CloudFormation might create IAM resources with custom names by selecting the required checkbox.

![Step 3](images/cloudtrail-step-7.png)

3. Click **Next**.

---

#### 2.4 Step 4 – Review

1. Review all settings and confirm that all required fields are correctly populated.

![Step 4](images/cloudtrail-step-8.png)

2. Click **Submit** to create the stack.

Monitor the stack creation:

1. In **CloudFormation → Stacks → Events**, monitor the progress status.
2. When the status indicates completion, verify in the left panel that the stack has been successfully created.

![Progress of creation](images/cloudtrail-step-9.png)

---

### 3. Export CloudTrail logs

1. Go to the **CloudTrail** dashboard and create a trail (if one does not already exist).

![CloudTrail Service](images/cloudtrail-step-14.png)

2. Configure the trail:

   - **Trail name**: Enter the trail name that you used in the CloudFormation stack in the previous steps (for example, `management-events`).  
   - **Enable for all accounts in organization**: Optional, if there are other accounts in the organization.  
   - **Storage location**: Choose **Use existing S3 bucket** and enter the **ARN** of the S3 bucket that was created by CloudFormation.  
   - **Log file SSE-KMS encryption**: Disable.  

   Click **Next**.

![Create Trail](images/cloudtrail-step-15.png)

3. **Choose log events** (minimum configuration):

   - **Management events**: Enabled.  
   - **API activity**: **Read** and **Write**.  

   Click **Next**.

![Events logs](images/cloudtrail-step-16.png)

4. Click **Create trail**.

![logging events](images/cloudtrail-step-17.png)
