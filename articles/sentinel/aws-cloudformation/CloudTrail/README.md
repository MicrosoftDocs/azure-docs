### 1. Microsoft Sentinel configuration

1. Sign in to the **Azure portal**.
2. Navigate to **Microsoft Sentinel** and then to **Content Hub**.
3. Install the connector **Amazon Web Services S3**.

![image1](images/Picture1.png)

4. Navigate to **Data connectors** and open the **Amazon Web Services S3** connector page.

---

### 2. Create the CloudFormation stack

1. Sign in to the **AWS Management Console**.
2. In the search bar, search for **CloudFormation** and open the **CloudFormation** service.

![image2](images/Picture2.png)

3. Select **Create stack** → **With new resources (standard)**.

![image3](images/Picture3.png)

---

#### 2.1 Step 1 – Specify template

1. Under **Prepare template**, select **Choose an existing template**.
2. Under **Template source**, select **Upload a template file**, then choose and upload the provided template file.
3. Click **Next**.

![image5](images/Picture4.png)

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

![image6](images/Picture5.png)

After filling all required fields, click **Next**.

![image7](images/Picture6.png)

---

#### 2.3 Step 3 – Configure stack options

1. Leave the default options unchanged.
2. Acknowledge that AWS CloudFormation might create IAM resources with custom names by selecting the required checkbox.

![image8](images/Picture7.png)

3. Click **Next**.

---

#### 2.4 Step 4 – Review

1. Review all settings and confirm that all required fields are correctly populated.

![image9](images/Picture8.png)

2. Click **Submit** to create the stack.

Monitor the stack creation:

1. In **CloudFormation → Stacks → Events**, monitor the progress status.
2. When the status indicates completion, verify in the left panel that the stack has been successfully created.

![image10](images/Picture9.png)

---

### 3. Export CloudTrail logs

1. Go to the **CloudTrail** dashboard and create a trail (if one does not already exist).

![image11](images/Picture14.png)

2. Configure the trail:

   - **Trail name**: Enter the trail name that you used in the CloudFormation stack in the previous steps (for example, `management-events`).  
   - **Enable for all accounts in organization**: Optional, if there are other accounts in the organization.  
   - **Storage location**: Choose **Use existing S3 bucket** and enter the **ARN** of the S3 bucket that was created by CloudFormation.  
   - **Log file SSE-KMS encryption**: Disable.  

   Click **Next**.

![image12](images/Picture15.png)

3. **Choose log events** (minimum configuration):

   - **Management events**: Enabled.  
   - **API activity**: **Read** and **Write**.  

   Click **Next**.

![image13](images/Picture16.png)

4. Click **Create trail**.

![image14](images/Picture17.png)
