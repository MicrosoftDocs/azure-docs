---
title: Install Microsoft CloudKnox Permissions Management Sentry on Amazon Web Services (AWS)
description: How to install Microsoft CloudKnox Permissions Management Sentry on Amazon Web Services (AWS).
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: conceptual
ms.date: 01/13/2022
ms.author: v-ydequadros
---

# Install Microsoft CloudKnox Permissions Management Sentry on Amazon Web Services (AWS)

This topic describes how to install the Microsoft CloudKnox Permissions Management sentry on Amazon Web Services (AWS).

<!---![AWS Sentry Installation](sentry-install-AWS.jpg)--->

## What is the CloudKnox Sentry?

The CloudKnox Sentry is an agent packaged in a virtual appliance. It gathers information on users, their privileges, activity, and resources for any monitored Amazon Web Services (AWS) accounts. It can be deployed in two ways:

- *Read only* (controller disabled), which only collects information about the account.  
- *Controller enabled*, which allows the CloudKnox Sentry to make changes to identity and access management (IAM) roles, policies, and users.

To provide visibility and insights, the CloudKnox Sentry collects information from many sources. It uses *Read*, *List*, and *Describe* privileges to help CloudKnox display resource information. For example, to display ec2 instances and s3 buckets.

CloudKnox gathers CloudTrail event logs and ties them to individual identities to gain insight into activity within the AWS account.

### The CloudKnox Sentry architecture

The CloudKnox Sentry is a Linux Photon based appliance that: 

- Collects information about the GCP account. 
- Uses an IAM role to read identity entitlements, resource information, and CloudTrail data on an hourly basis.
- Uploads the collected data to CloudKnox's SaaS Application for processing.

Inbound traffic to the Sentry is only received on port 9000, and is used for configuration by the CloudKnox administrator. We recommend only allowing traffic from observable source IP addresses that your administrator has configured. 

Outbound traffic is only received on port 443, and is used to make API calls to AWS, CloudKnox, and for identity provider (IDP) Integration.

<!--- - To view the Google Cloud Platform (GCP) architecture, select [here](cloudknox-sentry-install-gcp.md#architecture).--->

<!---![Sentry Architecture AWS](sentry-architecture-AWS.png)--->

### Port requirements

**Required ports for the CloudKnox Sentry**

| Traffic      | Port | Description                                                                                               |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------- |
| [TCP Inbound](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Required%20Ports%20for%20the%20CloudKnox%20Sentry%2094690cf56f754d5281d9a8e3421b3072/TCP%20Inbound%20e3ae4234a50446378b86dd78581f81d1.html)  | 9000 | Configuration. </p> Ask the administrators source IP for this information only when you're doing a configuration. |
| [TCP Outbound](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Required%20Ports%20for%20the%20CloudKnox%20Sentry%2094690cf56f754d5281d9a8e3421b3072/TCP%20Outbound%20b73565be0d984fefa69e8f9e0922d321.html) | 443  | API calls to AWS, CloudKnox, and identity provider (IDP) integration.       |

### Multi-account collection from one Sentry

For AWS organizations with multiple AWS accounts, you can set up one Sentry to collect data from multiple AWS accounts. Allow the Sentry's IAM role to assume a cross-account role in the account from which you want to collect data. To allow cross-account access, configure a trust relationship.

**Explanation and diagram**

<!---![Multi-Account Collection Diagram](multi-account-AWS.png)--->

**Example**

If you set up the Sentry in Account B to collect entitlement, resource, and activity data from Account A:

1. Every hour, Sentry starts a data collection job by assuming the role passed to it.

2. The role then assumes a cross-account role to Account A.

3. Through the API, the cross-account role collects information about user privileges, groups, resources, configuration, and activity from native AWS services. It then returns the data to the CloudKnox Sentry.

    <!---### Sentry installation video--->

### Centralized S3 collection

If your AWS organization stores multiple CloudTrails in a centralized S3 bucket, you can configure CloudKnox to collect appropriate CloudTrails using a cross-account role. 

The Sentry first collects entitlement and resource information from the target AWS account. It then assumes a separate cross-account role in the AWS account that holds the S3 bucket and stores the CloudTrails. 

During Sentry configuration, you must specify the AWS AccountID and IAM Role in that account that the Sentry assumes. To allow cross-account access, configure a trust relationship.

<!---**Explanation and diagram**--->

<!---![Multi-Account Collection Diagram](multi-account-AWS.png)--->

**Example**

If Account A stores CloudTrail into a centralized S3 in Account C, the following flow takes place:

1. The Sentry assumes a *Cross Account role* to Account A to gather resources and IAM entitlements.

2. If it isn't able to collect CloudTrail locally, the Sentry assumes a role in Account C and pulls event logs from Account A.

## CloudKnox Sentry deployment instructions

The following instructions guide you through the installation and configuration of the CloudKnox Sentry.

**Prerequisites**

1. Identify the AWS accounts from which you want CloudKnox to collect data.

2. Verify that CloudTrail is turned on for the target AWS account.

    If it isn't already turned on, create a new CloudTrail. The CloudTrail must be enabled for CloudKnox to function.

3. Ensure that the administrator deploying and configuring the Sentry Appliance can route to that appliance from their workstation on SSH port 22.

### Deploy the CloudKnox Sentry

**The CloudFormation template**

The Sentry's CloudFormation template uses the CloudKnox Sentry AMI to create an IAM Role, Auto-Scale group, Secrets Manager secret, Security group, and EC2 instance.

1. To create a new CloudFormation stack:
   1. Select **Upload a template file**.
   2. Upload the *sentry-cloudformation.yaml* template.
   3. Select **Next**.

2. To configure the CloudFormation template:
   1. Specify a stack name.
   2. Select a subnet and Virtual Private Cloud (VPC) in which to deploy the sentry.  
      During configuration, you must access the Sentry through the web browser over port 22. 
   3. Choose a VPC and subnet that you can route from your machine to the appliance.

3. Enter an existing Security Group ID.   
   Leave box blank if you want the CloudFormation template to create the security group.

4. To configure the sentry after deployment using SSH access into the instance, select **Allow**.  
    To update the stack later and remove the inbound port 22 access from security group, select **Deny**.

5. In **InstanceType**, enter *m5.xlarge*

6. Select a **KeyPair**.

7. In **IAMRoleName**, enter a role name to create one, or accept the default value.

8. In **Position URL**, accept the default unless CloudKnox support recommends something else.

9. In **Secret Prefix**, enter the prefix string that CloudKnox can use to create/update/read secret saved data. With this prefix string, CloudKnox: 

     - Adds access to the CloudKnox role policy to the secret prefix.  
     - Creates the **S3 Bucket Name** bucket to store cached data. 
     - Adds access to this bucket to the CloudKnox role policy.

10. In **Instance Count Desired/Min/Max**, enter the counts needed for CloudKnox sentry instances. (Approximately 1 for collection of 30 AWS accounts.) Then select **Next**.

11. Create any necessary tags, and then select **Next**.

12. Review the information you entered, and then select **Create Stack**.

## Multi-account collection from one Sentry configuration

The Sentry automatically collects data from the account in which it's deployed. To collect data from other AWS accounts, you must configure the Sentry to allow it to assume a role in which it can collect the target account's information.

### Cross-account collection configuration (For multi-account collection from one Sentry)

Create a cross-account role that allows the Sentry's EC2 instance to assume the data collection role for each account from which the Sentry collects data. The account in which it was deployed is excluded.

#### Create a cross-account role for data collection

1. To create a new IAM Role in the target collection account, enter the following information:

     - In **Role type**, enter another AWS account.
     - In **Account ID**, enter the Account ID of the AWS Account in which the Sentry was deployed.
     - In **Attach policy**, enter *SecurityAudit*

         Optional: To allow the Sentry to modify IAM permissions, enable the **Privilege On Demand** feature. Then create and attach the PrivilegeOnDemand.json policy to the IAM role.

     - In **Role Name**, enter `IAM_R_KNOX_SECURITY_XA` 

         (This value is configurable.)
  
2. Modify the role's trust relationship.
   In this step, you limit who and what can assume this cross-account role by specifying the instanceId of the Sentry.

   1. Select the **Trust relationships** tab.
   2. Select **Edit trust relationship**.
   3. Replace the **Principal** with the following string: 
 
       `arn:aws:iam::<accountofSentry>:role/IAM_R_KNOX_SECURITY`

      Where *accountofSentry* is the AWS AccountId holding the sentry.

3. Repeat step 2 for any other accounts targeted for data collection.

4. To run this role creation using the CloudFormation template, use [this CFT](https://knox-software.s3.amazonaws.com/cloud-formation/cloudknox-sentry-prod.yaml).

### Collect CloudTrail from a S3 bucket in local account

To grant access to the local S3 bucket collecting CloudTrail logs, add a policy to the IAM role you created earlier.

1. Create a new IAM Policy, or add it as an *Inline Policy*.

     - Modify and insert the following JSON code (knox-cloudtrail-get.json), where the highlighted areas are dependent on the path of the CloudTrails.

```json
	{
	   "Version": "2012-10-17",
	   "Statement": [
	       {
	           "Sid": "GetStmt",
	           "Effect": "Allow",
	           "Action": "s3:GetObject",
	           "Resource": ["arn:aws:s3:::<BUCKET_NAME>/*"]
	       },
	       {
	           "Sid": "ListStmt",
	           "Effect": "Allow",
	           "Action": "s3:ListBucket",
	           "Resource": "arn:aws:s3:::<BUCKET_NAME>"
	       }
	   ]
	}
```

2. Name the policy *IAM_R_KNOX_SECURITY_CLOUDTRAIL*

3. Create the policy.

4. Attach the policy to run:

   `aws:iam::<accountofSentry>:role/IAM_R_KNOX_SECURITY role`

5. To create this role using CloudFormation template, use [this CFT](https://knox-software.s3.amazonaws.com/cloud-formation/member-account.yaml).

### Collect CloudTrail from a centralized S3 bucket

If your organization's CloudTrail is centralized into one S3 bucket, create a cross-account role to collect the appropriate CloudTrails in the S3 bucket.

1. In the AWS account with the S3 bucket holding the organization's CloudTrails, create **Cross Account Role for Collection**.

    1. Browse to the S3 Bucket that contains the CloudTrails.   
         Make a note of the path of the CloudTrails you want to collect. The paths should look similar to these examples:

        `<BUCKET_NAME>/AWSLogs/<ACCOUNT_ID_MONITORED>`

         Or

         `arn:aws:s3:::<BUCKET_NAME>/<PREFIX>/AWSLogs/<ACCOUNT_ID_MONITORED>/*`


   2. Create a new IAM Role in the account holding the CloudTrails.

         - In **Role type**, enter another AWS account.
         - In **Account ID**, enter the Account ID of the AWS Account in which the Sentry was deployed.

   3. Create a new policy, or skip this step and add *Inline Policy* after creating the role.

2. Modify and insert the following JSON (knox-cloudtrail-get.json), 
  where the highlighted areas are dependent on the path of the CloudTrails.

``` json
	{
	   "Version": "2012-10-17",
	   "Statement": [
	       {
	           "Sid": "GetStmt",
	           "Effect": "Allow",
	           "Action": "s3:GetObject",
	           "Resource": ["arn:aws:s3:::<BUCKET_NAME>/<PREFIX>/AWSLogs/<ACCOUNT_ID_MONITORED>/*",
	                        "arn:aws:s3:::<BUCKET_NAME>/<PREFIX>/AWSLogs/<ACCOUNT_ID_MONITORED>/*",
	                        "arn:aws:s3:::<BUCKET_NAME>/<PREFIX>/AWSLogs/<ACCOUNT_ID_MONITORED>/*"]
	
	       },
	       {
	           "Sid": "ListStmt",
	           "Effect": "Allow",
	           "Action": "s3:ListBucket",
	           "Resource": "arn:aws:s3:::<BUCKET_NAME>"
	       }
	   ]
	}
```

3. Name the policy: `IAM_R_KNOX_SECURITY_CLOUDTRAIL` and then select **Create** to create the policy.

4. Modify the role's trust relationship.   
    In this step, you limit who and what can assume this cross-account role by specifying the `instanceId` of the Sentry.

   1. Select the **Trust relationships** tab and then select **Edit trust relationship**.
   2. Replace the **Principal** with the following string:

       `arn:aws:iam::<accountofSentry>:role/IAM_R_KNOX_SECURITY`

       Where *accountofSentry* is the AccountId of the AWS holding the sentry. 
   3. If the role name isn't IAM_R_KNOX_SECURITY, update the string with EC2 role name.

5. To create the role using the CloudFormation template, use [this CFT](https://knox-software.s3.amazonaws.com/cloud-formation/member-account-with-cloudtrail.yaml).

### Cross-account collection configuration (For the master account)

The Cloud Sentry lists accounts from the master account and can automatically collect from accounts sentry has access to collect from cross-account roles. This master account role also includes permission to collect SCP applicable for the accounts. For this feature, we must create a cross-account role that allows the Sentry's EC2 instance to assume master account role. 

1. Create the cross-account roles for collection.

     1. Create a new IAM Role in the master account:

         - In **Role type**, enter another AWS account.
         - In **Account ID**, enter the Account ID of the AWS Account in which the Sentry was deployed.
     2. Attach the policy: `arn:aws:iam::aws:policy/service-role/AWSConfigRoleForOrganizations`.
     3. Add an inline policy to include the following code:

```
      "organizations:ListPoliciesForTarget"
      "organizations:DescribeOrganizationalUnit"
      "organizations:DescribeAccount"
      "organizations:ListParents"
      "organizations:ListOrganizationalUnitsForParent"
      "organizations:ListRoots"
      "organizations:ListPolicies"
      "organizations:DescribePolicy"
```

2. In **Role Name**, enter `IAM_R_KNOX_SECURITY_XA` (The role name is configurable.)

3. Modify the role's **Trust Relationships**.   
    In this step, you limit who and what can assume this cross-account role by specifying the instanceId of the Sentry.

   1. Select the **Trust relationships** tab.

   2. Select **Edit trust relationship**.

   3. Replace the Principal with the following string:

        `arn:aws:iam::<accountofSentry>:role/IAM_R_KNOX_SECURITY`

      Where *accountofSentry* is the AccountId of the AWS holding the sentry.

4. To run this creation of role using CloudFormation template, use [this CFT](https://knox-software.s3.amazonaws.com/cloud-formation/master-account.yaml).

## Connect CloudKnox Sentry with the CloudKnox dashboard

Follow the instructions below to configure the Sentry in CloudKnox dashboard.

1. Log in to CloudKnox and select the gear icon to open the **Data Collectors** tab. 

2. Under the AWS section, select **Deploy**.

    <!---Add screenshot.--->

3. Select **Next**.

4. Select **Next** again if all the above steps are completed from the documentation link.

5. Enter the appliance DNS name or IP of the Sentry that you deployed in AWS, and then select **Next**.

    <!---Add screenshot.--->
6. Follow the instructions on the **Configure Appliance** screen.

    <!---Add screenshots.--->

### Configure Sentry

1. To configure the AWS Sentry, run the following script:

   `sudo /opt/cloudknox/sentrysoftwareservice/bin/runAWSConfigCLI.sh`

2. For a first-time deployment, enter the email and PIN you obtained from the previous step.

3. When the following question appears:

    *Are you upgrading a Sentry 1.0 Installation? (Y/N)*

    To upgrade from sentry v1.0, enter **Y**. Otherwise, enter **N**.

4. To automatically collect accounts listed in the master account role, enter **Y**. 

5. If you configured CloudKnox with autodetect in step 4, and if you're doing the configuration without a master account, enter each account ID and role name to collect data manually:

    `Auto Detect Collection Accounts From Master Account (Y/N):`

6. If you configured CloudKnox with autodetect in step 4, enter the following details:

    *Master Account ID*

    *Master Account Role Name*

    *Member Account Role Name*

7. If CloudTrail logs go into centralized account S3 bucket, enter a cross-account role name for collecting from S3 bucket:

    *Logging Account Role Name*

### Modify Sentry configuration

1. To modify the sentry configuration to add IDP configuration or change account configuration option, run the following script:

    `sudo /opt/cloudknox/sentrysoftwareservice/bin/runAWSConfigCLI.sh`

2. Select an option to update each configuration.

      1 - Add/Update member accounts</p>
      2 - Add/Update master account</p>
      3 - Add/Update CloudTrail accounts</p>
      4 - Remove master accounts</p>
      5 - Delete member accounts</p>
      6 - Delete CloudTrail accounts</p>
      7 - Add/Update Okta IdP</p>
      8 - Add/Update AD IdP</p>
      9 - Delete IdP</p>
      10 - Add IdP to member accounts</p>
      11 - Remove IdP from member accounts</p>
      12 - Delete configuration</p>
      13 - Display configuration</p>
      Q - Quit Configuration


### Post installation

After successfully configuring your CloudKnox Sentry, it begins initial data collection across the accounts you provided during configuration.

You can view the status of each AWS account's collection in the **Data-Sources** view. 

Initial collection may take up to 24 hours depending on the activity in the account.

### Resources

**Policy library**



| Name         | Applied in | Description                                                                        |URL              |
| ------------ | ---------- | ---------------------------------------------------------------------------------- | ----------------|
| [CFT for Account With CloudTrail bucket](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Policy%20Library%208bf8f80041cf458189416d38a706bf8a/CFT%20for%20Account%20With%20Cloudtrail%20bucket%205aaf15ecad214df39a380ced713d246d.html)  | AWS Account where centralized CloudTrail is stored. | IAM policy that allows Sentry to collect centralized CloudTrail data from a single S3 bucket. | https://knox-software.s3.amazonaws.com/cloud-formation/member-account-with-cloudtrail.yaml  | 
| [CFT for sentry install](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Policy%20Library%208bf8f80041cf458189416d38a706bf8a/CFT%20for%20sentry%20install%20b3a30900f55945c982ecf97435d689ed.html)| AWS account where sentry is deployed. | CloudFormation template to create the CloudKnox Sentry. | https://knox-software.s3.amazonaws.com/cloud-formation/cloudknox-sentry-prod.yaml  |
| [Untitled](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Policy%20Library%208bf8f80041cf458189416d38a706bf8a/Untitled%2069f81b8a656b49da896741e7d0d1a15b.html)| CFT for upgrade from sentry V1.0. | CloudFormation template to create the CloudKnox Sentry. | https://knox-software.s3.amazonaws.com/cloud-formation/sentry-upgrade.yaml  |
| [CFT CrossAccountMember yaml](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Policy%20Library%208bf8f80041cf458189416d38a706bf8a/CFT%20CrossAccountMember%20yaml%20b0b0cf4be80a48a387f93a135bcbfcc8.html)| AWS Account without a Sentry from which you want to collect data. | You can use this CloudFormation template to create a cross-account role that allows the Sentry to collect from other AWS accounts. You may have to make other modifications.| https://knox-software.s3.amazonaws.com/cloud-formation/member-account.yaml  |
| [Controller enabled policy](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203/Policy%20Library%208bf8f80041cf458189416d38a706bf8a/Controller%20enabled%20policy%2064f2c8589316442aa1e4f3460dde95cb.html)| Enabled controller mode in CloudKnox role turns on the JEP controller and the POD feature.|     |           |


<!--- Last row, third column
{ "Version": "2012-10-17", "Statement": [ { "Sid": "VisualEditor0", "Effect": "Allow", "Action": [ "iam:PutUserPermissionsBoundary", "iam:AttachUserPolicy", "iam:DeleteUserPolicy", "iam:DeletePolicy", "iam:AttachRolePolicy", "iam:PutRolePolicy", "iam:CreatePolicy", "iam:DetachRolePolicy", "iam:AttachGroupPolicy", "iam:DeleteRolePolicy", "iam:PutUserPolicy", "iam:DetachGroupPolicy", "iam:CreatePolicyVersion", "iam:DetachUserPolicy", "iam:DeleteGroupPolicy", "iam:DeletePolicyVersion", "iam:PutGroupPolicy", "iam:SetDefaultPolicyVersion" ], "Resource": "*" } ] }--->

<!---## Next steps--->

<!---For an overview of the CloudKnox installation process, see[CloudKnox Installation overview cloud](cloudknox-installation.html).--->
<!---For information on how to enable CloudKnox on your Azure AD tenant, see [Enable Microsoft CloudKnox Permissions Management on your Azure AD tenant](cloudknox-onboard-enable-tenant.html).--->
<!---For information on how to install Azure on CloudKnox, see [Install CloudKnox Sentry on Azure](cloudknox-sentry-install-azure.md)--->
<!---For information on how to install GCP on CloudKnox, see [Install CloudKnox Sentry on GCP](cloudknox-sentry-install-gcp.md)--->