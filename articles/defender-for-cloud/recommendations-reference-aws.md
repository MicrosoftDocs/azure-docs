---
title: Reference table for all security recommendations for AWS resources
description: This article lists all Microsoft Defender for Cloud security recommendations that help you harden and protect your Amazon Web Services (AWS) resources.
ms.topic: reference
ms.date: 03/13/2024
ms.custom: generated
ai-usage: ai-assisted
---

# Security recommendations for Amazon Web Services (AWS) resources

This article lists all the recommendations you might see in Microsoft Defender for Cloud if you connect an Amazon Web Services (AWS) account by using the **Environment settings** page. The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you completed. To decide which recommendations to resolve first, look at the severity of each recommendation and its potential effect on your secure score.

## AWS Compute recommendations

### [Amazon EC2 instances managed by Systems Manager should have a patch compliance status of COMPLIANT after a patch installation](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5b3c2887-d7b7-4887-b074-4e6057027709)

**Description**: This control checks whether the compliance status of the Amazon EC2 Systems Manager patch compliance is COMPLIANT or NON_COMPLIANT after the patch installation on the instance.
It only checks instances managed by AWS Systems Manager Patch Manager.
It doesn't check whether the patch was applied within the 30-day limit prescribed by PCI DSS requirement '6.2'.
It also doesn't validate whether the patches applied were classified as security patches.
You should create patching groups with the appropriate baseline settings and ensure in-scope systems are managed by those patch groups in Systems Manager. For more information about patch groups, see [AWS Systems Manager User Guide](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-patch-group-tagging.html).

**Severity**: Medium

### [Amazon EFS should be configured to encrypt file data at rest using AWS KMS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4e482075-311f-401e-adc7-f8a8affc5635)

**Description**: This control checks whether Amazon Elastic File System is configured to encrypt the file data using AWS KMS. The check fails in the following cases:
*"[Encrypted](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html)" is set to "false" in the DescribeFileSystems response.
 The "[KmsKeyId](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html)" key in the [DescribeFileSystems](https://docs.aws.amazon.com/efs/latest/ug/API_DescribeFileSystems.html) response doesn't match the KmsKeyId parameter for [efs-encrypted-check](https://docs.aws.amazon.com/config/latest/developerguide/efs-encrypted-check.html).
 Note that this control doesn't use the "KmsKeyId" parameter for [efs-encrypted-check](https://docs.aws.amazon.com/config/latest/developerguide/efs-encrypted-check.html). It only checks the value of "Encrypted". For an added layer of security for your sensitive data in Amazon EFS, you should create encrypted file systems.
 Amazon EFS supports encryption for file systems at-rest. You can enable encryption of data at rest when you create an Amazon EFS file system.
To learn more about Amazon EFS encryption, see [Data encryption in Amazon EFS](https://docs.aws.amazon.com/efs/latest/ug/encryption.html) in the Amazon Elastic File System User Guide.

**Severity**: Medium

### [Amazon EFS volumes should be in backup plans](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e864e460-158b-4a4a-beb9-16ebc25c1240)

**Description**: This control checks whether Amazon Elastic File System (Amazon EFS) file systems are added to the backup plans in AWS Backup. The control fails if Amazon EFS file systems aren't included in the backup plans.
 Including EFS file systems in the backup plans helps you to protect your data from deletion and data loss.

**Severity**: Medium

### [Application Load Balancer deletion protection should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5c508bf1-26f9-4696-bb61-8341d395e3de)

**Description**: This control checks whether an Application Load Balancer has deletion protection enabled. The control fails if deletion protection isn't configured.
Enable deletion protection to protect your Application Load Balancer from deletion.

**Severity**: Medium

### [Auto Scaling groups associated with a load balancer should use health checks](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/837d6a45-503f-4c95-bf42-323763960b62)

**Description**: Auto Scaling groups that are associated with a load balancer are using Elastic Load Balancing health checks.
 PCI DSS doesn't require load balancing or highly available configurations. This is recommended by AWS best practices.

**Severity**: Low

### [AWS accounts should have Azure Arc auto provisioning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/882a80f0-943f-473e-b6d7-40c7a625540e)

**Description**: For full visibility of the security content from Microsoft Defender for servers, EC2 instances should be connected to Azure Arc. To ensure that all eligible EC2 instances automatically receive Azure Arc, enable autoprovisioning from Defender for Cloud at the AWS account level. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and [Microsoft Defender for Servers](plan-defender-for-servers.md).

**Severity**: High

### [CloudFront distributions should have origin failover configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4779e962-2ea3-4126-aa76-379ea271887c)

**Description**: This control checks whether an Amazon CloudFront distribution is configured with an origin group that has two or more origins.
CloudFront origin failover can increase availability. Origin failover automatically redirects traffic to a secondary origin if the primary origin is unavailable or if it returns specific HTTP response status codes.

**Severity**: Medium

### [CodeBuild GitHub or Bitbucket source repository URLs should use OAuth](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9694d4ef-f21a-40b7-b535-618ac5c5d21e)

**Description**: This control checks whether the GitHub or Bitbucket source repository URL contains either personal access tokens or a user name and password.
Authentication credentials should never be stored or transmitted in clear text or appear in the repository URL. Instead of personal access tokens or user name and password, you should use OAuth to grant authorization for accessing GitHub or Bitbucket repositories.
 Using personal access tokens or a user name and password could expose your credentials to unintended data exposure and unauthorized access.

**Severity**: High

### [CodeBuild project environment variables should not contain credentials](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a88b4b72-b461-4b5e-b024-91da1cbe500f)

**Description**: This control checks whether the project contains the environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
Authentication credentials `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` should never be stored in clear text, as this could lead to unintended data exposure and unauthorized access.

**Severity**: High

### [DynamoDB Accelerator (DAX) clusters should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/58e67d3d-8b17-4c1c-9bc4-550b10f0328a)

**Description**: This control checks whether a DAX cluster is encrypted at rest.
 Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. The encryption adds another set of access controls to limit the ability of unauthorized users to access to the data.
 For example, API permissions are required to decrypt the data before it can be read.

**Severity**: Medium

### [DynamoDB tables should automatically scale capacity with demand](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/47476790-2527-4bdb-b839-3b48ed18dccf)

**Description**: This control checks whether an Amazon DynamoDB table can scale its read and write capacity as needed. This control passes if the table uses either on-demand capacity mode or provisioned mode with auto scaling configured.
 Scaling capacity with demand avoids throttling exceptions, which helps to maintain availability of your applications.

**Severity**: Medium

### [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3)

**Description**: Connect your EC2 instances to Azure Arc in order to have full visibility to Microsoft Defender for Servers security content. Learn more about [Azure Arc](../azure-arc/servers/overview.md), and about [Microsoft Defender for Servers](plan-defender-for-servers.md) on hybrid-cloud environment.

**Severity**: High

### [EC2 instances should be managed by AWS Systems Manager](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4be5393d-cc33-4ef7-acae-80295bc3ae35)

**Description**: Status of the Amazon EC2 Systems Manager patch compliance is 'COMPLIANT' or 'NON_COMPLIANT' after the patch installation on the instance.
 Only  instances managed by AWS Systems Manager Patch Manager are checked. Patches that were applied within the 30-day limit prescribed by PCI DSS requirement '6' aren't checked.

**Severity**: Medium

### [EDR configuration issues should be resolved on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/695abd03-82bd-4d7f-a94c-140e8a17666c)

**Description**: To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. <br> Note: Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint (MDE) enabled.

**Severity**: High

### [EDR solution should be installed on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77d09952-2bc2-4495-8795-cc8391452f85)

**Description**: To protect EC2s, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it.

**Severity**: High

### [Instances managed by Systems Manager should have an association compliance status of COMPLIANT](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/67a90ae0-b3d1-44f0-9dcf-a03234ebeb65)

**Description**: This control checks whether the status of the AWS Systems Manager association compliance is COMPLIANT or NON_COMPLIANT after the association is run on an instance. The control passes if the association compliance status is COMPLIANT.
A State Manager association is a configuration that is assigned to your managed instances. The configuration defines the state that you want to maintain on your instances. For example, an association can specify that antivirus software must be installed and running on your instances, or that certain ports must be closed.
After you create one or more State Manager associations, compliance status information is immediately available to you in the console or in response to AWS CLI commands or corresponding Systems Manager API operations. For associations, "Configuration" Compliance shows statuses of Compliant or Non-compliant and the severity level assigned to the association, such as *Critical* or *Medium*. To learn more about State Manager association compliance, see [About State Manager association compliance](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-compliance-about.html#sysman-compliance-about-association) in the AWS Systems Manager User Guide.
You must configure your in-scope EC2 instances for Systems Manager association. You must also configure the patch baseline for the security rating of the vendor of patches, and set the autoapproval date to meet PCI DSS *3.2.1* requirement *6.2*. For more guidance on how to [Create an association](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-state-assoc.html), see Create an association in the AWS Systems Manager User Guide. For more information on working with patching in Systems Manager, see [AWS Systems Manager Patch Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html) in the AWS Systems Manager User Guide.

**Severity**: Low

### [Lambda functions should have a dead-letter queue configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65)

**Description**: This control checks whether a Lambda function is configured with a dead-letter queue. The control fails if the Lambda function isn't configured with a dead-letter queue.
As an alternative to an on-failure destination, you can configure your function with a dead-letter queue to save discarded events for further processing.
 A dead-letter queue acts the same as an on-failure destination. It's used when an event fails all processing attempts or expires without being processed.
A dead-letter queue allows you to look back at errors or failed requests to your Lambda function to debug or identify unusual behavior.
From a security perspective, it's important to understand why your function failed and to ensure that your function doesn't drop data or compromise data security as a result.
 For example, if your function can't communicate to an underlying resource, that could be a symptom of a denial of service (DoS) attack elsewhere in the network.

**Severity**: Medium

### [Lambda functions should use supported runtimes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e656e5b7-130c-4fb4-be90-9bdd4f82fdfb)

**Description**: This control checks that the Lambda function settings for runtimes match the expected values set for the supported runtimes for each language. This control checks for the following runtimes:
 **nodejs14.x**, **nodejs12.x**, **nodejs10.x**, **python3.8**, **python3.7**, **python3.6**, **ruby2.7**, **ruby2.5**, **java11**, **java8**, **java8.al2**, **go1.x**, **dotnetcore3.1**, **dotnetcore2.1**
[Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) are built around a combination of operating system, programming language, and software libraries that are subject to maintenance and security updates. When a runtime component is no longer supported for security updates, Lambda deprecates the runtime. Even though you can't create functions that use the deprecated runtime, the function is still available to process invocation events. Make sure that your Lambda functions are current and don't use out-of-date runtime environments.
To learn more about the supported runtimes that this control checks for the supported languages, see [AWS Lambda runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html) in the AWS Lambda Developer Guide.

**Severity**: Medium

### [Management ports of EC2 instances should be protected with just-in-time network access control](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b26b102-ccde-4697-aa30-f0621f865f99)

**Description**: Microsoft Defender for Cloud identified some overly permissive inbound rules for management ports in your network. Enable just-in-time access control to protect your Instances from internet-based brute-force attacks. [Learn more.](just-in-time-access-usage.md)

**Severity**: High

### [Unused EC2 security groups should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f065cc7b-f63b-4865-b8ff-4a1292e1a5cb)

**Description**: Security groups should be attached to Amazon EC2 instances or to an ENI.
 Healthy finding can indicate there are unused Amazon EC2 security groups.

**Severity**: Low

## AWS Container recommendations

### [EKS clusters should grant the required AWS permissions to Microsoft Defender for Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7d3a977e-46f1-419a-9046-4bd44db80aac)

**Description**: Microsoft Defender for Containers provides protections for your EKS clusters.
 To monitor your cluster for security vulnerabilities and threats, Defender for Containers needs permissions for your AWS account. These permissions are used to enable Kubernetes control plane logging on your cluster and establish a reliable pipeline between your cluster and Defender for Cloud's backend in the cloud.
 Learn more about [Microsoft Defender for Cloud's security features for containerized environments](defender-for-containers-introduction.md).

**Severity**: High

### [EKS clusters should have Microsoft Defender's extension for Azure Arc installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/38307993-84fb-4636-8ce7-3a64466bb5cc)

**Description**: Microsoft Defender's [cluster extension](../azure-arc/kubernetes/extensions.md) provides security capabilities for your EKS clusters. The extension collects data from a cluster and its nodes to identify security vulnerabilities and threats.
 The extension works with [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md).
Learn more about [Microsoft Defender for Cloud's security features for containerized environments](defender-for-containers-introduction.md?tabs=defender-for-container-arch-aks).

**Severity**: High

### [Microsoft Defender for Containers should be enabled on AWS connectors](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/11d0f4af-6924-4a2e-8b66-781a4553c828)

**Description**: Microsoft Defender for Containers provides real-time threat protection for containerized environments and generates alerts about suspicious activities.
Use this information to harden the security of Kubernetes clusters and remediate security issues.

Important: When you enabled Microsoft Defender for Containers and deployed Azure Arc to your EKS clusters, the protections - and charges - will begin. If you don't deploy Azure Arc on a cluster, Defender for Containers won't protect it, and no charges are incurred for this Microsoft Defender plan for that cluster.

**Severity**: High

### Data plane recommendations

All the [Kubernetes data plane security recommendations](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported for AWS after you [enable Azure Policy for Kubernetes](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening).

## AWS Data recommendations

### [Amazon Aurora clusters should have backtracking enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d0ef47dc-95aa-4765-a075-72c07df8acff)

**Description**: This control checks whether Amazon Aurora clusters have backtracking enabled.
Backups help you to recover more quickly from a security incident. They also strengthen the resilience of your systems. Aurora backtracking reduces the time to recover a database to a point in time. It doesn't require a database restore to do so.
For more information about backtracking in Aurora, see [Backtracking an Aurora DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html) in the Amazon Aurora User Guide.

**Severity**: Medium

### [Amazon EBS snapshots shouldn't be publicly restorable](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/02e8de17-1a01-45cb-b906-6d07a78f4b3c)

**Description**: Amazon EBS snapshots shouldn't be publicly restorable by everyone unless explicitly allowed, to avoid accidental exposure of data. Additionally, permission to change Amazon EBS configurations should be restricted to authorized AWS accounts only.

**Severity**: High

### [Amazon ECS task definitions should have secure networking modes and user definitions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0dc124a8-2a69-47c5-a4e1-678d725a33ab)

**Description**: This control checks whether an active Amazon ECS task definition that has host networking mode also has privileged or user container definitions.
 The control fails for task definitions that have host network mode and container definitions where privileged=false or is empty and user=root or is empty.
If a task definition has elevated privileges, it is because the customer specifically opted in to that configuration.
 This control checks for unexpected privilege escalation when a task definition has host networking enabled but the customer didn't opt in to elevated privileges.

**Severity**: High

### [Amazon Elasticsearch Service domains should encrypt data sent between nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b63a099-6c0c-4354-848b-17de1f3c8ae3)

**Description**: This control checks whether Amazon ES domains have node-to-node encryption enabled. HTTPS (TLS) can be used to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. Only encrypted connections over HTTPS (TLS) should be allowed. Enabling node-to-node encryption for Amazon ES domains ensures that intra-cluster communications are encrypted in transit. There can be a performance penalty associated with this configuration. You should be aware of and test the performance trade-off before enabling this option.

**Severity**: Medium

### [Amazon Elasticsearch Service domains should have encryption at rest enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cf747c91-14f3-4b30-aafe-eb12c18fd030)

**Description**: It's important to enable encryptions rest of Amazon ES domains to protect sensitive data

**Severity**: Medium

### [Amazon RDS database should be encrypted using customer managed key](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9137f5de-aac8-4cee-a22f-8d81f19be67f)

**Description**: This check identifies RDS databases that are encrypted with default KMS keys and not with customer managed keys. As a leading practice, use customer managed keys to encrypt the data on your RDS databases and maintain control of your keys and data on sensitive workloads.

**Severity**: Medium

### [Amazon RDS instance should be configured with automatic backup settings](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/894259c2-c1d5-47dc-b5c6-b242d5c76fdf)

**Description**: This check identifies RDS instances, which aren't set with the automatic backup setting. If Automatic Backup is set, RDS creates a storage volume snapshot of your DB instance, backing up the entire DB instance and not just individual databases, which provide for point-in-time recovery. The automatic backup happens during the specified backup window time and keeps the backups for a limited period of time as defined in the retention period. It's recommended to set automatic backups for your critical RDS servers that help in the data restoration process.

**Severity**: Medium

### [Amazon Redshift clusters should have audit logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e2a0ec17-447b-44b6-8646-c0b5584b6b0a)

**Description**: This control checks whether an Amazon Redshift cluster has audit logging enabled.
Amazon Redshift audit logging provides additional information about connections and user activities in your cluster. This data can be stored and secured in Amazon S3 and can be helpful in security audits and investigations. For more information, see [Database audit logging](https://docs.aws.amazon.com/redshift/latest/mgmt/db-auditing.html) in the *Amazon Redshift Cluster Management Guide*.

**Severity**: Medium

### [Amazon Redshift clusters should have automatic snapshots enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7a152832-6600-49d1-89be-82e474190e13)

**Description**: This control checks whether Amazon Redshift clusters have automated snapshots enabled. It also checks whether the snapshot retention period is greater than or equal to seven.
Backups help you to recover more quickly from a security incident. They strengthen the resilience of your systems. Amazon Redshift takes periodic snapshots by default. This control checks whether automatic snapshots are enabled and retained for at least seven days. For more information about Amazon Redshift automated snapshots, see [Automated snapshots](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html#about-automated-snapshots) in the *Amazon Redshift Cluster Management Guide*.

**Severity**: Medium

### [Amazon Redshift clusters should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7f5ac036-11e1-4cda-89b5-a115b9ae4f72)

**Description**: We recommend Amazon Redshift clusters to avoid public accessibility by evaluating the 'publiclyAccessible' field in the cluster configuration item.

**Severity**: High

### [Amazon Redshift should have automatic upgrades to major versions enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/176f9062-64d0-4edd-bb0f-915012a6ef16)

**Description**: This control checks whether automatic major version upgrades are enabled for the Amazon Redshift cluster.
Enabling automatic major version upgrades ensures that the latest major version updates to Amazon Redshift clusters are installed during the maintenance window.
 These updates might include security patches and bug fixes. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: Medium

### [Amazon SQS queues should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/340a07a1-7d68-4562-ac25-df77c214fe13)

**Description**: This control checks whether Amazon SQS queues are encrypted at rest.
Server-side encryption (SSE) allows you to transmit sensitive data in encrypted queues. To protect the content of messages in queues, SSE uses keys managed in AWS KMS.
For more information, see [Encryption at rest](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html) in the Amazon Simple Queue Service Developer Guide.

**Severity**: Medium

### [An RDS event notifications subscription should be configured for critical cluster events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/65659c22-6588-405b-b118-614c2b4ead5b)

**Description**: This control checks whether an Amazon RDS event subscription exists that has notifications enabled for the following source type,
 event category key-value pairs. DBCluster: ["maintenance" and "failure"].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database instance events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ff4f3ab3-8ed7-4b4f-a721-4c3b66a59140)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type.
 event category key-value pairs. DBInstance: ["maintenance", "configuration change" and "failure"].
RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database parameter group events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c6f24bb0-b696-451c-a26e-0cc9ea8e97e3)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type.
 event category key-value pairs. DBParameterGroup: ["configuration","change"].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database security group events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ab5c51fb-ecdb-46de-b8df-c28ae46ce5bc)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type, event category key-value pairs.DBSecurityGroup: ["configuration","change","failure"].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for a rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [API Gateway REST and WebSocket API logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2cac0072-6f56-46f0-9518-ddec3660ee56)

**Description**: This control checks whether all stages of an Amazon API Gateway REST or WebSocket API have logging enabled.
 The control fails if logging isn't enabled for all methods of a stage or if logging Level is neither ERROR nor INFO.
 API Gateway REST or WebSocket API stages should have relevant logs enabled. API Gateway REST and WebSocket API execution logging provides detailed records of requests made to API Gateway REST and WebSocket API stages.
 The stages include API integration backend responses, Lambda authorizer responses, and the requestId for AWS integration endpoints.

**Severity**: Medium

### [API Gateway REST API cache data should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a0ce4e0-b61e-4ec7-ab65-aeaff3893bd3)

**Description**: This control checks whether all methods in API Gateway REST API stages that have cache enabled are encrypted. The control fails if any method in an API Gateway REST API stage is configured to cache and the cache isn't encrypted.
 Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. It adds another set of access controls to limit unauthorized users ability access the data. For example, API permissions are required to decrypt the data before it can be read.
 API Gateway REST API caches should be encrypted at rest for an added layer of security.

**Severity**: Medium

### [API Gateway REST API stages should be configured to use SSL certificates for backend authentication](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ec268d38-c94b-4df3-8b4e-5248fcaaf3fc)

**Description**: This control checks whether Amazon API Gateway REST API stages have SSL certificates configured.
 Backend systems use these certificates to authenticate that incoming requests are from API Gateway.
 API Gateway REST API stages should be configured with SSL certificates to allow backend systems to authenticate that requests originate from API Gateway.

**Severity**: Medium

### [API Gateway REST API stages should have AWS X-Ray tracing enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5cbaff4f-f8d5-49fe-9fdc-63c4507ac670)

**Description**: This control checks whether AWS X-Ray active tracing is enabled for your Amazon API Gateway REST API stages.
 X-Ray active tracing enables a more rapid response to performance changes in the underlying infrastructure. Changes in performance could result in a lack of availability of the API.
 X-Ray active tracing provides real-time metrics of user requests that flow through your API Gateway REST API operations and connected services.

**Severity**: Low

### [API Gateway should be associated with an AWS WAF web ACL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d69eb8b0-79ba-4963-a683-a96a8ea787e2)

**Description**: This control checks whether an API Gateway stage uses an AWS WAF web access control list (ACL).
 This control fails if an AWS WAF web ACL isn't attached to a REST API Gateway stage.
 AWS WAF is a web application firewall that helps protect web applications and APIs from attacks. It enables you to configure an ACL, which is a set of rules that allow, block, or count web requests based on customizable web security rules and conditions that you define.
 Ensure that your API Gateway stage is associated with an AWS WAF web ACL to help protect it from malicious attacks.

**Severity**: Medium

### [Application and Classic Load Balancers logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ba5c359-495f-4ba6-9897-7fdbc0aed675)

**Description**: This control checks whether the Application Load Balancer and the Classic Load Balancer have logging enabled. The control fails if `access_logs.s3.enabled` is false.
Elastic Load Balancing provides access logs that capture detailed information about requests sent to your load balancer. Each log contains information such as the time the request was received, the client's IP address, latencies, request paths, and server responses. You can use these access logs to analyze traffic patterns and to troubleshoot issues.
To learn more, see [Access logs for your Classic Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/access-log-collection.html) in User Guide for Classic Load Balancers.

**Severity**: Medium

### [Attached EBS volumes should be encrypted at-rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0bde343a-0681-4ee2-883a-027cc1e655b8)

**Description**: This control checks whether the EBS volumes that are in an attached state are encrypted. To pass this check, EBS volumes must be in use and encrypted. If the EBS volume isn't attached, then it isn't subject to this check.
For an added layer of security of your sensitive data in EBS volumes, you should enable EBS encryption at rest. Amazon EBS encryption offers a straightforward encryption solution for your EBS resources that doesn't require you to build, maintain, and secure your own key management infrastructure. It uses AWS KMS customer master keys (CMK) when creating encrypted volumes and snapshots.
To learn more about Amazon EBS encryption, see [Amazon EBS encryption](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html) in the Amazon EC2 User Guide for Linux Instances.

**Severity**: Medium

### [AWS Database Migration Service replication instances shouldn't be public](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/132a70b8-ffda-457a-b7a3-e6f2e01fc0af)

**Description**: To protect your replicated instances from threats. A private replication instance should have a private IP address that you can't access outside of the replication network.
 A replication instance should have a private IP address when the source and target databases are in the same network, and the network is connected to the replication instance's VPC using a VPN, AWS Direct Connect, or VPC peering.
 You should also ensure that access to your AWS DMS instance configuration is limited to only authorized users.
 To do this, restrict users' IAM permissions to modify AWS DMS settings and resources.

**Severity**: High

### [Classic Load Balancer listeners should be configured with HTTPS or TLS termination](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/773667f7-6511-4aec-ae9c-e3286c56a254)

**Description**: This control checks whether your Classic Load Balancer listeners are configured with HTTPS or TLS protocol for front-end (client to load balancer) connections. The control is applicable if a Classic Load Balancer has listeners. If your Classic Load Balancer doesn't have a listener configured, then the control doesn't report any findings.
The control passes if the Classic Load Balancer listeners are configured with TLS or HTTPS for front-end connections.
The control fails if the listener isn't configured with TLS or HTTPS for front-end connections.
Before you start to use a load balancer, you must add one or more listeners. A listener is a process that uses the configured protocol and port to check for connection requests. Listeners can support both HTTP and HTTPS/TLS protocols. You should always use an HTTPS or TLS listener, so that the load balancer does the work of encryption and decryption in transit.

**Severity**: Medium

### [Classic Load Balancers should have connection draining enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dd60e31e-073a-42b6-9b23-db7ca86fd5e0)

**Description**: This control checks whether Classic Load Balancers have connection draining enabled.
Enabling connection draining on Classic Load Balancers ensures that the load balancer stops sending requests to instances that are deregistering or unhealthy. It keeps the existing connections open. This is useful for instances in Auto Scaling groups, to ensure that connections aren't severed abruptly.

**Severity**: Medium

### [CloudFront distributions should have AWS WAF enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0e0d5964-2895-45b1-b646-fcded8d567be)

**Description**: This control checks whether CloudFront distributions are associated with either AWS WAF or AWS WAFv2 web ACLs. The control fails if the distribution isn't associated with a web ACL.
AWS WAF is a web application firewall that helps protect web applications and APIs from attacks. It allows you to configure a set of rules, called a web access control list (web ACL), that allow, block, or count web requests based on customizable web security rules and conditions that you define. Ensure your CloudFront distribution is associated with an AWS WAF web ACL to help protect it from malicious attacks.

**Severity**: Medium

### [CloudFront distributions should have logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/88114970-36db-42b3-9549-20608b1ab8ad)

**Description**: This control checks whether server access logging is enabled on CloudFront distributions. The control fails if access logging isn't enabled for a distribution.
 CloudFront access logs provide detailed information about every user request that CloudFront receives. Each log contains information such as the date and time the request was received, the IP address of the viewer that made the request, the source of the request, and the port number of the request from the viewer.
These logs are useful for applications such as security and access audits and forensics investigation. For more information on how to analyze access logs, see Querying Amazon CloudFront logs in the Amazon Athena User Guide.

**Severity**: Medium

### [CloudFront distributions should require encryption in transit](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a67adff8-625f-4891-9f61-43f837d18ad2)

**Description**: This control checks whether an Amazon CloudFront distribution requires viewers to use HTTPS directly or whether it uses redirection. The control fails if ViewerProtocolPolicy is set to allow-all for defaultCacheBehavior or for cacheBehaviors.
HTTPS (TLS) can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over HTTPS (TLS) should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS.

**Severity**: Medium

### [CloudTrail logs should be encrypted at rest using KMS CMKs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/190f732b-c68e-4816-9961-aba074272627)

**Description**: We recommended configuring CloudTrail to use SSE-KMS.
Configuring CloudTrail to use SSE-KMS provides more confidentiality controls on log data as a given user must have S3 read permission on the corresponding log bucket and must be granted decrypt permission by the CMK policy.

**Severity**: Medium

### [Connections to Amazon Redshift clusters should be encrypted in transit](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/036bb56b-c442-4352-bb4c-5bd0353ad314)

**Description**: This control checks whether connections to Amazon Redshift clusters are required to use encryption in transit. The check fails if the Amazon Redshift cluster parameter require_SSL isn't set to *1*.
TLS can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over TLS should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS.

**Severity**: Medium

### [Connections to Elasticsearch domains should be encrypted using TLS 1.2](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/effb5011-f8db-45ac-b981-b5bdfd7beb88)

**Description**: This control checks whether connections to Elasticsearch domains are required to use TLS 1.2. The check fails if the Elasticsearch domain TLSSecurityPolicy isn't Policy-Min-TLS-1-2-2019-07.
HTTPS (TLS) can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over HTTPS (TLS) should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS. TLS 1.2 provides several security enhancements over previous versions of TLS.

**Severity**: Medium

### [DynamoDB tables should have point-in-time recovery enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cc873508-40c1-41b6-8507-8a431d74f831)

**Description**: This control checks whether point-in-time recovery (PITR) is enabled for an Amazon DynamoDB table.
 Backups help you to recover more quickly from a security incident. They also strengthen the resilience of your systems. DynamoDB point-in-time recovery automates backups for DynamoDB tables. It reduces the time to recover from accidental delete or write operations.
 DynamoDB tables that have PITR enabled can be restored to any point in time in the last 35 days.

**Severity**: Medium

### [EBS default encryption should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/56406d4c-87b4-4aeb-b1cc-7f6312d78e0a)

**Description**: This control checks whether account-level encryption is enabled by default for Amazon Elastic Block Store(Amazon EBS).
 The control fails if the account level encryption isn't enabled.
When encryption is enabled for your account, Amazon EBS volumes and snapshot copies are encrypted at rest. This adds another layer of protection for your data.
For more information, see [Encryption by default](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default) in the Amazon EC2 User Guide for Linux Instances.
Note that following instance types don't support encryption: R1, C1, and M1.

**Severity**: Medium

### [Elastic Beanstalk environments should have enhanced health reporting enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4170067b-345d-47ed-ab4a-c6b6046881f1)

**Description**: This control checks whether enhanced health reporting is enabled for your AWS Elastic Beanstalk environments.
Elastic Beanstalk enhanced health reporting enables a more rapid response to changes in the health of the underlying infrastructure. These changes could result in a lack of availability of the application.
Elastic Beanstalk enhanced health reporting provides a status descriptor to gauge the severity of the identified issues and identify possible causes to investigate. The Elastic Beanstalk health agent, included in supported Amazon Machine Images (AMIs), evaluates logs and metrics of environment EC2 instances.

**Severity**: Low

### [Elastic Beanstalk managed platform updates should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/820f6c6e-f73f-432c-8c60-cae1794ea150)

**Description**: This control checks whether managed platform updates are enabled for the Elastic Beanstalk environment.
Enabling managed platform updates ensures that the latest available platform fixes, updates, and features for the environment are installed. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: High

### [Elastic Load Balancer shouldn't have ACM certificate expired or expiring in 90 days.](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a5e0d700-3de1-469a-96d2-6536d9a92604)

**Description**: This check identifies Elastic Load Balancers (ELB) which are using ACM certificates expired or expiring in 90 days. AWS Certificate Manager (ACM) is the preferred tool to provision, manage, and deploy your server certificates. With ACM. you can request a certificate or deploy an existing ACM or external certificate to AWS resources. As a best practice, it's recommended to reimport expiring/expired certificates while preserving the ELB associations of the original certificate.

**Severity**: High

### [Elasticsearch domain error logging to CloudWatch Logs should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f48af569-2e67-464b-9a62-b8df0f85bc5e)

**Description**: This control checks whether Elasticsearch domains are configured to send error logs to CloudWatch Logs.
You should enable error logs for Elasticsearch domains and send those logs to CloudWatch Logs for retention and response. Domain error logs can assist with security and access audits, and can help to diagnose availability issues.

**Severity**: Medium

### [Elasticsearch domains should be configured with at least three dedicated master nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b4b9a67c-c315-4f9b-b06b-04867a453aab)

**Description**: This control checks whether Elasticsearch domains are configured with at least three dedicated master nodes. This control fails if the domain doesn't use dedicated master nodes. This control passes if Elasticsearch domains have five dedicated master nodes. However, using more than three master nodes might be unnecessary to mitigate the availability risk, and will result in more cost.
An Elasticsearch domain requires at least three dedicated master nodes for high availability and fault-tolerance. Dedicated master node resources can be strained during data node blue/green deployments because there are more nodes to manage. Deploying an Elasticsearch domain with at least three dedicated master nodes ensures sufficient master node resource capacity and cluster operations if a node fails.

**Severity**: Medium

### [Elasticsearch domains should have at least three data nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/994cbcb3-43d4-419d-b5c4-9adc558f3ca2)

**Description**: This control checks whether Elasticsearch domains are configured with at least three data nodes and zoneAwarenessEnabled is true.
An Elasticsearch domain requires at least three data nodes for high availability and fault-tolerance. Deploying an Elasticsearch domain with at least three data nodes ensures cluster operations if a node fails.

**Severity**: Medium

### [Elasticsearch domains should have audit logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/12ebb4cd-34b6-4c3a-bee9-7e35f4f6caff)

**Description**: This control checks whether Elasticsearch domains have audit logging enabled. This control fails if an Elasticsearch domain doesn't have audit logging enabled.
Audit logs are highly customizable. They allow you to track user activity on your Elasticsearch clusters, including authentication successes and failures, requests to OpenSearch, index changes, and incoming search queries.

**Severity**: Medium

### [Enhanced monitoring should be configured for RDS DB instances and clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/93e5a579-dd2f-4a56-b827-ebbfe7376b16)

**Description**: This control checks whether enhanced monitoring is enabled for your RDS DB instances.
In Amazon RDS, Enhanced Monitoring enables a more rapid response to performance changes in underlying infrastructure. These performance changes could result in a lack of availability of the data. Enhanced Monitoring provides real-time metrics of the operating system that your RDS DB instance runs on. An agent is installed on the instance. The agent can obtain metrics more accurately than is possible from the hypervisor layer.
Enhanced Monitoring metrics are useful when you want to see how different processes or threads on a DB instance use the CPU. For more information, see [Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html) in the *Amazon RDS User Guide*.

**Severity**: Low

### [Ensure rotation for customer created CMKs is enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/66748314-d51c-4d9c-b789-eebef29a7039)

**Description**: AWS Key Management Service (KMS) allows customers to rotate the backing key, which is key material stored within the KMS that is tied to the key ID of the Customer Created customer master key (CMK).
 It's the backing key that is used to perform cryptographic operations such as encryption and decryption.
 Automated key rotation currently retains all prior backing keys so that decryption of encrypted data can take place transparently. It's recommended that CMK key rotation be enabled.
 Rotating encryption keys helps reduce the potential impact of a compromised key as data encrypted with a new key can't be accessed with a previous key that might have been exposed.

**Severity**: Medium

### [Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/759e80dc-92c2-4afd-afa3-c01294999363)

**Description**: S3 Bucket Access Logging generates a log that contains access records Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket for each request made to your S3 bucket.
 An access log record contains details about the request, such as the request type, the resources specified in the request worked, and the time and date the request was processed.
It's recommended that bucket access logging be enabled on the CloudTrail S3 bucket.
By enabling S3 bucket logging on target S3 buckets, it's possible to capture all events, which might affect objects within target buckets. Configuring logs to be placed in a separate bucket allows access to log information, which can be useful in security and incident response workflows.

**Severity**: Low

### [Ensure the S3 bucket used to store CloudTrail logs isn't publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a41f2846-4a59-44e9-89bb-1f62d4b03a85)

**Description**: CloudTrail logs a record of every API call made in your AWS account. These log files are stored in an S3 bucket.
 It's recommended that the bucket policy, or access control list (ACL), applied to the S3 bucket that CloudTrail logs to prevent public access to the CloudTrail logs.
Allowing public access to CloudTrail log content might aid an adversary in identifying weaknesses in the affected account's use or configuration.

**Severity**: High

### [IAM shouldn't have expired SSL/TLS certificates](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/03a8f33c-b01c-4dfc-b627-f98114715ae0)

**Description**: This check identifies expired SSL/TLS certificates. To enable HTTPS connections to your website or application in AWS, you need an SSL/TLS server certificate. You can use ACM or IAM to store and deploy server certificates. Removing expired SSL/TLS certificates eliminates the risk that an invalid certificate will be deployed accidentally to a resource such as AWS Elastic Load Balancer (ELB), which can damage the credibility of the application/website behind the ELB. This check generates alerts if there are any expired SSL/TLS certificates stored in AWS IAM. As a best practice, it's recommended to delete expired certificates.

**Severity**: High

### [Imported ACM certificates should be renewed after a specified time period](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0e68b4d8-1a5e-47fc-a3eb-b3542fea43f1)

**Description**: This control checks whether ACM certificates in your account are marked for expiration within 30 days. It checks both imported certificates and certificates provided by AWS Certificate Manager.
ACM can automatically renew certificates that use DNS validation. For certificates that use email validation, you must respond to a domain validation email.
 ACM also doesn't automatically renew certificates that you import. You must renew imported certificates manually.
For more information about managed renewal for ACM certificates, see [Managed renewal for ACM certificates](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) in the AWS Certificate Manager User Guide.

**Severity**: Medium

### [Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2482620f-f324-4add-af68-2e01e27485e9)

**Description**: Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI) and to safeguard your infrastructure. Reduce the PCI by removing the unused high risk permission assignments. High PCI reflects risk associated with the identities with permissions that exceed their normal or required usage.

**Severity**: Medium

### [RDS automatic minor version upgrades should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d352afac-cebc-4e02-b474-7ef402fb1d65)

**Description**: This control checks whether automatic minor version upgrades are enabled for the RDS database instance.
Enabling automatic minor version upgrades ensures that the latest minor version updates to the relational database management system (RDBMS) are installed. These upgrades might include security patches and bug fixes. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: High

### [RDS cluster snapshots and database snapshots should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4f4fbc5e-0b10-4208-b52f-1f47f1c73b6a)

**Description**: This control checks whether RDS DB snapshots are encrypted.
This control is intended for RDS DB instances. However, it can also generate findings for snapshots of Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
Encrypting data at rest reduces the risk that an unauthenticated user gets access to data that is stored on disk. Data in RDS snapshots should be encrypted at rest for an added layer of security.

**Severity**: Medium

### [RDS clusters should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9e769650-868c-46f5-b8c0-1a8ba12a4c92)

**Description**: This control checks whether RDS clusters have deletion protection enabled.
This control is intended for RDS DB instances. However, it can also generate findings for Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
Enabling cluster deletion protection is another layer of protection against accidental database deletion or deletion by an unauthorized entity.
When deletion protection is enabled, an RDS cluster can't be deleted. Before a deletion request can succeed, deletion protection must be disabled.

**Severity**: Low

### [RDS DB clusters should be configured for multiple Availability Zones](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cdf441dd-0ab7-4ef2-a643-de12725e5d5d)

**Description**: RDS DB clusters should be configured for multiple the data that is stored.
 Deployment to multiple Availability Zones allows for automate Availability Zones to ensure availability of ed failover in the event of an Availability Zone availability issue and during regular RDS maintenance events.

**Severity**: Medium

### [RDS DB clusters should be configured to copy tags to snapshots](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b9ed02d0-afca-4bed-838d-70bf31ecf19a)

**Description**: Identification and inventory of your IT assets is a crucial aspect of governance and security.
 You need to have visibility of all your RDS DB clusters so that you can assess their security posture and act on potential areas of weakness.
 Snapshots should be tagged in the same way as their parent RDS database clusters.
 Enabling this setting ensures that snapshots inherit the tags of their parent database clusters.

**Severity**: Low

### [RDS DB instances should be configured to copy tags to snapshots](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fcd891e5-c6a2-41ce-bca6-f49ec582f3ce)

**Description**: This control checks whether RDS DB instances are configured to copy all tags to snapshots when the snapshots are created.
Identification and inventory of your IT assets is a crucial aspect of governance and security.
 You need to have visibility of all your RDS DB instances so that you can assess their security posture and take action on potential areas of weakness.
 Snapshots should be tagged in the same way as their parent RDS database instances. Enabling this setting ensures that snapshots inherit the tags of their parent database instances.

**Severity**: Low

### [RDS DB instances should be configured with multiple Availability Zones](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/70ebbd01-cd79-4bc8-ae85-49f47ccdd5ad)

**Description**: This control checks whether high availability is enabled for your RDS DB instances.
 RDS DB instances should be configured for multiple Availability Zones (AZs). This ensures the availability of the data stored. Multi-AZ deployments allow for automated failover if there's an issue with Availability Zone availability and during regular RDS maintenance.

**Severity**: Medium

### [RDS DB instances should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8e1f7933-faa9-4379-a9bd-697740dedac8)

**Description**: This control checks whether your RDS DB instances that use one of the listed database engines have deletion protection enabled.
Enabling instance deletion protection is another layer of protection against accidental database deletion or deletion by an unauthorized entity.
While deletion protection is enabled, an RDS DB instance can't be deleted. Before a deletion request can succeed, deletion protection must be disabled.

**Severity**: Low

### [RDS DB instances should have encryption at rest enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bfa7d2aa-f362-11eb-9a03-0242ac130003)

**Description**: This control checks whether storage encryption is enabled for your Amazon RDS DB instances.
This control is intended for RDS DB instances. However, it can also generate findings for Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
 For an added layer of security for your sensitive data in RDS DB instances, you should configure your RDS DB instances to be encrypted at rest. To encrypt your RDS DB instances and snapshots at rest, enable the encryption option for your RDS DB instances. Data that is encrypted at rest includes the underlying storage for DB instances, its automated backups, read replicas, and snapshots.
RDS encrypted DB instances use the open standard AES-256 encryption algorithm to encrypt your data on the server that hosts your RDS DB instances. After your data is encrypted, Amazon RDS handles authentication of access and decryption of your data transparently with a minimal impact on performance. You don't need to modify your database client applications to use encryption.
Amazon RDS encryption is currently available for all database engines and storage types. Amazon RDS encryption is available for most DB instance classes. To learn about DB instance classes that don't support Amazon RDS encryption, see [Encrypting Amazon RDS resources](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html) in the *Amazon RDS User Guide*.

**Severity**: Medium

### [RDS DB Instances should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/72f3b7f1-76b8-4cf5-8da5-4ba5745b512c)

**Description**: We recommend that you also ensure that access to your RDS instance's configuration is limited to authorized users only, by restricting users' IAM permissions to modify RDS instances' settings and resources.

**Severity**: High

### [RDS snapshots should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f64521fc-a9f1-4d43-b667-8d94b4a202af)

**Description**: We recommend only allowing authorized principals to access the snapshot and change Amazon RDS configuration.

**Severity**: High

### [Remove unused Secrets Manager secrets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bfa82db5-c112-44f0-89e6-a9adfb9a4028)

**Description**: This control checks whether your secrets have been accessed within a specified number of days. The default value is 90 days. If a secret wasn't accessed within the defined number of days, this control fails.
Deleting unused secrets is as important as rotating secrets. Unused secrets can be abused by their former users, who no longer need access to these secrets. Also, as more users get access to a secret, someone might have mishandled and leaked it to an unauthorized entity, which increases the risk of abuse. Deleting unused secrets helps revoke secret access from users who no longer need it. It also helps to reduce the cost of using Secrets Manager. Therefore, it's essential to routinely delete unused secrets.

**Severity**: Medium

### [S3 buckets should have cross-region replication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/35713036-bd12-4646-9b92-4c56a761a710)

**Description**: Enabling S3 cross-region replication ensures that multiple versions of the data are available in different distinct Regions.
 This allows you to protect your S3 bucket against DDoS attacks and data corruption events.

**Severity**: Low

### [S3 buckets should have server-side encryption enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3cb793ab-20d3-4677-9723-024c8fed0c23)

**Description**: Enable server-side encryption to protect data in your S3 buckets.
 Encrypting the data can prevent access to sensitive data in the event of a data breach.

**Severity**: Medium

### [Secrets Manager secrets configured with automatic rotation should rotate successfully](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bec42e2d-956b-4940-a37d-7c1b1e8c525f)

**Description**: This control checks whether an AWS Secrets Manager secret rotated successfully based on the rotation schedule. The control fails if **RotationOccurringAsScheduled** is **false**. The control doesn't evaluate secrets that don't have rotation configured.
Secrets Manager helps you improve the security posture of your organization. Secrets include database credentials, passwords, and third-party API keys. You can use Secrets Manager to store secrets centrally, encrypt secrets automatically, control access to secrets, and rotate secrets safely and automatically.
Secrets Manager can rotate secrets. You can use rotation to replace long-term secrets with short-term ones. Rotating your secrets limits how long an unauthorized user can use a compromised secret. For this reason, you should rotate your secrets frequently.
In addition to configuring secrets to rotate automatically, you should ensure that those secrets rotate successfully based on the rotation schedule.
To learn more about rotation, see [Rotating your AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) in the AWS Secrets Manager User Guide.

**Severity**: Medium

### [Secrets Manager secrets should be rotated within a specified number of days](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/323f0eb4-ea19-4b55-83e9-d104009616b4)

**Description**: This control checks whether your secrets have been rotated at least once within 90 days.
Rotating secrets can help you to reduce the risk of an unauthorized use of your secrets in your AWS account. Examples include database credentials, passwords, third-party API keys, and even arbitrary text. If you don't change your secrets for a long period of time, the secrets are more likely to be compromised.
As more users get access to a secret, it can become more likely that someone mishandled and leaked it to an unauthorized entity. Secrets can be leaked through logs and cache data. They can be shared for debugging purposes and not changed or revoked once the debugging completes. For all these reasons, secrets should be rotated frequently.
You can configure your secrets for automatic rotation in AWS Secrets Manager. With automatic rotation, you can replace long-term secrets with short-term ones, significantly reducing the risk of compromise.
Security Hub recommends that you enable rotation for your Secrets Manager secrets. To learn more about rotation, see [Rotating your AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) in the AWS Secrets Manager User Guide.

**Severity**: Medium

### [SNS topics should be encrypted at rest using AWS KMS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/90917e06-2781-4857-9d74-9043c6475d03)

**Description**: This control checks whether an SNS topic is encrypted at rest using AWS KMS.
Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. It also adds another set of access controls to limit the ability of unauthorized users to access the data.
For example, API permissions are required to decrypt the data before it can be read. SNS topics should be [encrypted at-rest](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html) for an added layer of security. For more information, see Encryption at rest in the Amazon Simple Notification Service Developer Guide.

**Severity**: Medium

### [VPC flow logging should be enabled in all VPCs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3428e584-0fa6-48c0-817e-6d689d7bb879)

**Description**: VPC Flow Logs provide visibility into network traffic that passes through the VPC and can be used to detect anomalous traffic or insight during security events.

**Severity**: Medium

## AWS IdentityAndAccess recommendations

### [Amazon Elasticsearch Service domains should be in a VPC](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/df952171-786d-44b5-b309-9c982bddeb7c)

**Description**: VPC can't contain domains with a public endpoint.
Note: this doesn't evaluate the VPC subnet routing configuration to determine public reachability.

**Severity**: High

### [Amazon S3 permissions granted to other AWS accounts in bucket policies should be restricted](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/de8ae504-ec39-4ffb-b3ef-6e36fdcbb455)

**Description**: Implementing least privilege access is fundamental to reducing security risk and the impact of errors or malicious intent. If an S3 bucket policy allows access from external accounts, it could result in data exfiltration by an insider threat or an attacker. The 'blacklistedactionpatterns' parameter allows for successful evaluation of the rule for S3 buckets. The parameter grants access to external accounts for action patterns that aren't included in the 'blacklistedactionpatterns' list.

**Severity**: High

### [Avoid the use of the "root" account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a47a6c3b-0629-406c-ad09-d91f7d9f78a3)

**Description**: The "root" account has unrestricted access to all resources in the AWS account. It's highly recommended that the use of this account be avoided.
The "root" account is the most privileged AWS account. Minimizing the use of this account and adopting the principle of least privilege for access management will reduce the risk of accidental changes and unintended disclosure of highly privileged credentials.

**Severity**: High

### [AWS KMS keys should not be unintentionally deleted](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/10c59743-84c4-4711-adb7-ba895dc57339)

**Description**: This control checks whether KMS keys are scheduled for deletion. The control fails if a KMS key is scheduled for deletion.
KMS keys can't be recovered once deleted. Data encrypted under a KMS key is also permanently unrecoverable if the KMS key is deleted. If meaningful data has been encrypted under a KMS key scheduled for deletion, consider decrypting the data or re-encrypting the data under a new KMS key unless you're intentionally performing a cryptographic erasure.
When a KMS key is scheduled for deletion, a mandatory waiting period is enforced to allow time to reverse the deletion, if it was scheduled in error. The default waiting period is 30 days, but it can be reduced to as short as seven days when the KMS key is scheduled for deletion. During the waiting period, the scheduled deletion can be canceled and the KMS key won't be deleted.
For more information regarding deleting KMS keys, see [Deleting KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) in the AWS Key Management Service Developer Guide.

**Severity**: High

### [AWS WAF Classic global web ACL logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ad593449-a095-47b5-91b8-894396a1aa7f)

**Description**: This control checks whether logging is enabled for an AWS WAF global Web ACL. This control fails if logging isn't enabled for the web ACL.
Logging is an important part of maintaining the reliability, availability, and performance of AWS WAF globally. It's a business and compliance requirement in many organizations, and allows you to troubleshoot application behavior. It also provides detailed information about the traffic that is analyzed by the web ACL that is attached to AWS WAF.

**Severity**: Medium

### [CloudFront distributions should have a default root object configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/186509dc-f326-415f-b085-4d27f1342849)

**Description**: This control checks whether an Amazon CloudFront distribution is configured to return a specific object that is the default root object. The control fails if the CloudFront distribution doesn't have a default root object configured.
A user might sometimes request the distributions root URL instead of an object in the distribution. When this happens, specifying a default root object can help you to avoid exposing the contents of your web distribution.

**Severity**: High

### [CloudFront distributions should have origin access identity enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a0ab1f4e-bafb-4947-a7d1-13a9c35c7d82)

**Description**: This control checks whether an Amazon CloudFront distribution with Amazon S3 Origin type has Origin Access Identity (OAI) configured. The control fails if OAI isn't configured.
CloudFront OAI prevents users from accessing S3 bucket content directly. When users access an S3 bucket directly, they effectively bypass the CloudFront distribution and any permissions that are applied to the underlying S3 bucket content.

**Severity**: Medium

### [CloudTrail log file validation should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/324ec96c-9719-46ce-b6a9-e7f4fed7dd6e)

**Description**: To ensure additional integrity checking of CloudTrail logs, we recommend enabling file validation on all CloudTrails.

**Severity**: Low

### [CloudTrail should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2917bcec-6991-4ea4-9e73-156e6ef831e4)

**Description**: AWS CloudTrail is a web service that records AWS API calls for your account and delivers log files to you. Not all services enable logging by default for all APIs and events.
 You should implement any additional audit trails other than CloudTrail and review the documentation for each service in CloudTrail Supported Services and Integrations.

**Severity**: High

### [CloudTrail trails should be integrated with CloudWatch Logs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/842be2e5-2cd8-420f-969a-6d6b4096c580)

**Description**: In addition to capturing CloudTrail logs within a specified S3 bucket for long term analysis, real-time analysis can be performed by configuring CloudTrail to send logs to CloudWatch Logs.
 For a trail that is enabled in all regions in an account, CloudTrail sends log files from all those regions to a CloudWatch Logs log group. We recommended that CloudTrail logs will be sent to CloudWatch Logs to ensure AWS account activity is being captured, monitored, and appropriately alarmed on.
Sending CloudTrail logs to CloudWatch Logs facilitates real-time and historic activity logging based on user, API, resource, and IP address, and provides opportunity to establish alarms and notifications for anomalous or sensitivity account activity.

**Severity**: Low

### [Database logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/678b2afa-7fc7-45e5-ad4e-2c49efb57ac8)

**Description**: This control checks whether the following logs of Amazon RDS are enabled and sent to CloudWatch Logs:

- Oracle: (Alert, Audit, Trace, Listener)
- PostgreSQL: (Postgresql, Upgrade)
- MySQL: (Audit, Error, General, SlowQuery)
- MariaDB: (Audit, Error, General, SlowQuery)
- SQL Server: (Error, Agent)
- Aurora: (Audit, Error, General, SlowQuery)
- Aurora-MySQL: (Audit, Error, General, SlowQuery)
- Aurora-PostgreSQL: (Postgresql, Upgrade).
RDS databases should have relevant logs enabled. Database logging provides detailed records of requests made to RDS. Database logs can assist with security and access audits and can help to diagnose availability issues.

**Severity**: Medium

### [Disable direct internet access for Amazon SageMaker notebook instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0991c64b-ccf5-4408-aee9-2ef03d460020)

**Description**: Direct internet access should be disabled for an SageMaker notebook instance.
 This checks whether the 'DirectInternetAccess' field is disabled for the notebook instance.
 Your instance should be configured with a VPC and the default setting should be Disable - Access the internet through a VPC.
 In order to enable internet access to train or host models from a notebook, make sure that your VPC has a NAT gateway and your security group allows outbound connections. Ensure access to your SageMaker configuration is limited to only authorized users, and restrict users' IAM permissions to modify SageMaker settings and resources.

**Severity**: High

### [Do not setup access keys during initial user setup for all IAM users that have a console password](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/655f9340-184f-4b6e-8214-b835003ab0b1)

**Description**: AWS console defaults the checkbox for creating access keys to enabled. This results in many access keys being generated unnecessarily.
 In addition to unnecessary credentials, it also generates unnecessary management work in auditing and rotating these keys.
 Requiring that additional steps be taken by the user after their profile has been created will give a stronger indication of intent that access keys are [a] necessary for their work and [b] once the access key is established on an account that the keys might be in use somewhere in the organization.

**Severity**: Medium

### [Ensure a support role has been created to manage incidents with AWS Support](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6614c30d-c9f3-4acd-8371-c8f362148398)

**Description**: AWS provides a support center that can be used for incident notification and response, as well as technical support and customer services.
 Create an IAM Role to allow authorized users to manage incidents with AWS Support.
By implementing least privilege for access control, an IAM Role requires an appropriate IAM Policy to allow Support Center Access in order to manage Incidents with AWS Support.

**Severity**: Low

### [Ensure access keys are rotated every 90 days or less](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d72f547e-c011-4cdb-9dda-8c4d6dc09bf2)

**Description**: Access keys consist of an access key ID and secret access key, which are used to sign programmatic requests that you make to AWS.
 AWS users need their own access keys to make programmatic calls to AWS from the AWS Command Line Interface (AWS CLI), Tools for Windows PowerShell, the AWS SDKs, or direct HTTP calls using the APIs for individual AWS services.
 It's recommended that all access keys be regularly rotated.
 Rotating access keys reduce the window of opportunity for an access key that is associated with a compromised or terminated account to be used.
 Access keys should be rotated to ensure that data can't be accessed with an old key, which might have been lost, cracked, or stolen.

**Severity**: Medium

### [Ensure AWS Config is enabled in all regions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3ff06f36-f8fd-4af5-bd02-5195593423fb)

**Description**: AWS Config is a web service that performs configuration management of supported AWS resources within your account and delivers log files to you.
The recorded information includes the configuration item (AWS resource), relationships between configuration items (AWS resources), any configuration changes between resources.
It's recommended to enable AWS Config be enabled in all regions.

The AWS configuration item history captured by AWS Config enables security analysis, resource change tracking, and compliance auditing.

**Severity**: Medium

### [Ensure CloudTrail is enabled in all regions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b3d8e09b-83a6-417a-ae1e-3f5b54576965)

**Description**: AWS CloudTrail is a web service that records AWS API calls for your account and delivers log files to you.
The recorded information includes the identity of the API caller, the time of the API call, the source IP address of the API caller, the request parameters, and the response elements returned by the AWS service. CloudTrail provides a history of AWS API calls for an account, including API calls made via the Management Console, SDKs, command line tools, and higher-level AWS services (such as CloudFormation).
The AWS API call history produced by CloudTrail enables security analysis, resource change tracking, and compliance auditing. Additionally:

- ensuring that a multi-regions trail exists will ensure that unexpected activity occurring in otherwise unused regions is detected
- ensuring that a multi-regions trail exists will ensure that "Global Service Logging" is enabled for a trail by default to capture recording of events generated on AWS global services
- for a multi-regions trail, ensuring that management events configured for all type of Read/Writes ensures recording of management operations that are performed on all resources in an AWS account

**Severity**: High

### [Ensure credentials unused for 90 days or greater are disabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f13dc885-79aa-456b-ba28-3428147ecf55)

**Description**: AWS IAM users can access AWS resources using different types of credentials, such as passwords or access keys.
 It's recommended that all credentials that have been unused in 90 or greater days be removed or deactivated.
 Disabling or removing unnecessary credentials reduce the window of opportunity for credentials associated with a compromised or abandoned account to be used.

**Severity**: Medium

### [Ensure IAM password policy expires passwords within 90 days or less](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/729c20d1-fe7c-4e1b-8c9c-ab5ad56d7f96)

**Description**: IAM password policies can require passwords to be rotated or expired after a given number of days.
 It's recommended that the password policy expire passwords after 90 days or less.
 Reducing the password lifetime increases account resiliency against brute force login attempts. Additionally, requiring regular password changes help in the following scenarios:

- Passwords can be stolen or compromised sometimes without your knowledge. This can happen via a system compromise, software vulnerability, or internal threat.
- Certain corporate and government web filters or proxy servers have the ability to intercept and record traffic even if it's encrypted.
- Many people use the same password for many systems such as work, email, and personal.
- Compromised end user workstations might have a keystroke logger.

**Severity**: Low

### [Ensure IAM password policy prevents password reuse](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/22e99393-671c-4979-a08a-cd1533da9ece)

**Description**: IAM password policies can prevent the reuse of a given password by the same user.
It's recommended that the password policy prevent the reuse of passwords.
 Preventing password reuse increases account resiliency against brute force login attempts.

**Severity**: Low

### [Ensure IAM password policy requires at least one lowercase letter](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1c420241-9bec-4af8-afb7-038a711b7d22)

**Description**: Password policies are, in part, used to enforce password complexity requirements. IAM password policies can be used to ensure password are composed of different character sets.
 It's recommended that the password policy require at least one lowercase letter.
Setting a password complexity policy increases account resiliency against brute force login attempts.

**Severity**: Medium

### [Ensure IAM password policy requires at least one number](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/84fb0ae8-4785-449c-b9ac-e106a2509540)

**Description**: Password policies are, in part, used to enforce password complexity requirements. IAM password policies can be used to ensure password are composed of different character sets.
 It's recommended that the password policy require at least one number.
 Setting a password complexity policy increases account resiliency against brute force login attempts.

**Severity**: Medium

### [Ensure IAM password policy requires at least one symbol](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1919c309-1c8b-4fab-bd8c-7ff77521db40)

**Description**: Password policies are, in part, used to enforce password complexity requirements.
 IAM password policies can be used to ensure password are composed of different character sets.
 It's recommended that the password policy require at least one symbol.
 Setting a password complexity policy increases account resiliency against brute force login attempts.

**Severity**: Medium

### [Ensure IAM password policy requires at least one uppercase letter](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6e5ebe18-e026-4c26-875c-fcbea8089071)

**Description**: Password policies are, in part, used to enforce password complexity requirements. IAM password policies can be used to ensure password are composed of different character sets.
 It's recommended that the password policy require at least one uppercase letter.
 Setting a password complexity policy increases account resiliency against brute force login attempts.

**Severity**: Medium

### [Ensure IAM password policy requires minimum length of 14 or greater](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e109af9f-128b-4774-a40c-aab8eff3934c)

**Description**: Password policies are, in part, used to enforce password complexity requirements. IAM password policies can be used to ensure password are at least a given length.
It's recommended that the password policy require a minimum password length '14'.
 Setting a password complexity policy increases account resiliency against brute force login attempts.

**Severity**: Medium

### [Ensure multifactor authentication (MFA) is enabled for all IAM users that have a console password](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b73d3c97-01e1-43b4-bf01-a459e5eed3de)

**Description**: Multifactor Authentication (MFA) adds an extra layer of protection on top of a user name and password.
 With MFA enabled, when a user signs in to an AWS website, they'll be prompted for their user name and password as well as for an authentication code from their AWS MFA device.
 It's recommended that MFA be enabled for all accounts that have a console password.
Enabling MFA provides increased security for console access as it requires the authenticating principal to possess a device that emits a time-sensitive key and have knowledge of a credential.

**Severity**: Medium

### [GuardDuty should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4b32e0a4-44a7-4f18-ad92-549f7d219061)

**Description**: To provide additional protection against intrusions, GuardDuty should be enabled on your AWS account and region.
 Note: GuardDuty might not be a complete solution for every environment.

**Severity**: Medium

### [Hardware MFA should be enabled for the "root" account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/eb39e935-38fc-4b0c-8cf2-d6affab0306a)

**Description**: The root account is the most privileged user in an account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled, when a user signs in to an AWS website, they're prompted for their user name and password and for an authentication code from their AWS MFA device.
 For Level 2, it's recommended that you protect the root account with a hardware MFA. A hardware MFA has a smaller attack surface than a virtual MFA. For example, a hardware MFA doesn't suffer the attack surface introduced by the mobile smartphone that a virtual MFA resides on.
 Using hardware MFA for many, many accounts might create a logistical device management issue. If this occurs, consider implementing this Level 2 recommendation selectively to the highest security accounts. You can then apply the Level 1 recommendation to the remaining accounts.

**Severity**: Low

### [IAM authentication should be configured for RDS clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3ac30502-52e5-4fc6-af40-095dddfbc8b9)

**Description**: This control checks whether an RDS DB cluster has IAM database authentication enabled.
IAM database authentication allows for password-free authentication to database instances. The authentication uses an authentication token. Network traffic to and from the database is encrypted using SSL. For more information, see IAM database authentication in the Amazon Aurora User Guide.

**Severity**: Medium

### [IAM authentication should be configured for RDS instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cd307f02-2ca7-44b4-8c1b-b580251d613c)

**Description**: This control checks whether an RDS DB instance has IAM database authentication enabled.
IAM database authentication allows authentication to database instances with an authentication token instead of a password. Network traffic to and from the database is encrypted using SSL. For more information, see IAM database authentication in the Amazon Aurora User Guide.

**Severity**: Medium

### [IAM customer managed policies should not allow decryption actions on all KMS keys](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d088fb9f-11dc-451e-8f79-393916e42bb2)

**Description**: Checks whether the default version of IAM customer managed policies allow principals to use the AWS KMS decryption actions on all resources. This control uses [Zelkova](http://aws.amazon.com/blogs/security/protect-sensitive-data-in-the-cloud-with-automated-reasoning-zelkova), an automated reasoning engine, to validate and warn you about policies that might grant broad access to your secrets across AWS accounts.This control fails if the "kms:Decrypt" or "kms:ReEncryptFrom" actions are allowed on all KMS keys. The control evaluates both attached and unattached customer managed policies. It doesn't check inline policies or AWS managed policies.
With AWS KMS, you control who can use your KMS keys and gain access to your encrypted data. IAM policies define which actions an identity (user, group, or role) can perform on which resources. Following security best practices, AWS recommends that you allow least privilege. In other words, you should grant to identities only the "kms:Decrypt" or "kms:ReEncryptFrom" permissions and only for the keys that are required to perform a task. Otherwise, the user might use keys that aren't appropriate for your data.
Instead of granting permissions for all keys, determine the minimum set of keys that users need to access encrypted data. Then design policies that allow users to use only those keys. For example, don't allow "kms:Decrypt" permission on all KMS keys. Instead, allow "kms:Decrypt" only on keys in a particular Region for your account. By adopting the principle of least privilege, you can reduce the risk of unintended disclosure of your data.

**Severity**: Medium

### [IAM customer managed policies that you create should not allow wildcard actions for services](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5a0476c5-a14b-4195-8c31-633511234b38)

**Description**: This control checks whether the IAM identity-based policies that you create have Allow statements that use the \* wildcard to  grant permissions for all actions on any service. The control fails if any policy statement includes 'Effect': 'Allow' with 'Action': 'Service:*'.
 For example, the following statement in a policy results in a failed finding.

```json
'Statement': [
{
  'Sid': 'EC2-Wildcard',
  'Effect': 'Allow',
  'Action': 'ec2:*',
  'Resource': '*'
}
```

 The control also fails if you use 'Effect': 'Allow' with 'NotAction': 'service:*'. In that case, the NotAction element provides access to all of the actions in an AWS service, except for the actions specified in NotAction.
This control only applies to customer managed IAM policies. It doesn't apply to IAM policies that are managed by AWS.
 When you assign permissions to AWS services, it's important to scope the allowed IAM actions in your IAM policies. You should restrict IAM actions to only those actions that are needed. This helps you to provision least privilege permissions. Overly permissive policies might lead to privilege escalation if the policies are attached to an IAM principal that might not require the permission.
In some cases, you might want to allow IAM actions that have a similar prefix, such as DescribeFlowLogs and DescribeAvailabilityZones. In these authorized cases, you can add a suffixed wildcard to the common prefix. For example, ec2:Describe*.

This control passes if you use a prefixed IAM action with a suffixed wildcard. For example, the following statement in a policy results in a passed finding.

```json
 'Statement': [
{
  'Sid': 'EC2-Wildcard',
  'Effect': 'Allow',
  'Action': 'ec2:Describe*',
  'Resource': '*'
}
```

When you group related IAM actions in this way, you can also avoid exceeding the IAM policy size limits.

**Severity**: Low

### [IAM policies should be attached only to groups or roles](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a773f81a-0b2d-4f8e-826a-77fc432416c3)

**Description**: By default, IAM users, groups, and roles have no access to AWS resources. IAM policies are the means by which privileges are granted to users, groups, or roles.
 It's recommended that IAM policies be applied directly to groups and roles but not users.
Assigning privileges at the group or role level reduces the complexity of access management as the number of users grow.
 Reducing access management complexity might in-turn reduce opportunity for a principal to inadvertently receive or retain excessive privileges.

**Severity**: Low

### [IAM policies that allow full "*:*" administrative privileges should not be created](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1d08b362-7e24-46b0-bed1-4a6c1d1526a5)

**Description**: IAM policies are the means by which privileges are granted to users, groups, or roles.
 It's recommended and considered a standard security advice to grant least privilege-that is, granting only the permissions required to perform a task.
 Determine what users need to do and then craft policies for them that let the users perform only those tasks, instead of allowing full administrative privileges.
 It's more secure to start with a minimum set of permissions and grant additional permissions as necessary, rather than starting with permissions that are too lenient and then trying to tighten them later.
 Providing full administrative privileges instead of restricting to the minimum set of permissions that the user is required to do exposes the resources to potentially unwanted actions.
 IAM policies that have a statement with "Effect": "Allow" with "Action": "*" over "Resource": "*" should be removed.

**Severity**: High

### [IAM principals should not have IAM inline policies that allow decryption actions on all KMS keys](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/18be55d0-b681-4693-af8d-b8815518d758)

**Description**: Checks whether the inline policies that are embedded in your IAM identities (role, user, or group) allow the AWS KMS decryption actions on all KMS keys. This control uses [Zelkova](http://aws.amazon.com/blogs/security/protect-sensitive-data-in-the-cloud-with-automated-reasoning-zelkova), an automated reasoning engine, to validate and warn you about policies that might grant broad access to your secrets across AWS accounts.
This control fails if "kms:Decrypt" or "kms:ReEncryptFrom" actions are allowed on all KMS keys in an inline policy.
With AWS KMS, you control who can use your KMS keys and gain access to your encrypted data. IAM policies define which actions an identity (user, group, or role) can perform on which resources. Following security best practices, AWS recommends that you allow least privilege. In other words, you should grant to identities only the permissions they need and only for keys that are required to perform a task. Otherwise, the user might use keys that aren't appropriate for your data.
Instead of granting permission for all keys, determine the minimum set of keys that users need to access encrypted data. Then design policies that allow the users to use only those keys. For example, don't allow "kms:Decrypt" permission on all KMS keys. Instead, allow them only on keys in a particular Region for your account. By adopting the principle of least privilege, you can reduce the risk of unintended disclosure of your data.

**Severity**: Medium

### [Lambda functions should restrict public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/64b236a0-f9d7-454a-942a-8c2ba3943cf7)

**Description**: Lambda function resource-based policy should restrict public access. This recommendation doesn't check access by internal principals.
 Ensure access to the function is restricted to authorized principals only by using least privilege resource-based policies.

**Severity**: High

### [MFA should be enabled for all IAM users](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9c676d6f-60cb-4c7b-a484-17164c598016)

**Description**: All IAM users should have multifactor authentication (MFA) enabled.

**Severity**: Medium

### [MFA should be enabled for the "root" account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1c9ea4ef-3bb5-4f02-b8b9-55e788e1a21a)

**Description**: The root account is the most privileged user in an account. MFA adds an extra layer of protection on top of a user name and password. With MFA enabled, when a user signs in to an AWS website, they're prompted for their user name and password and for an authentication code from their AWS MFA device.
 When you use virtual MFA for root accounts, it's recommended that the device used isn't a personal device. Instead, use a dedicated mobile device (tablet or phone) that you manage to keep charged and secured independent of any individual personal devices.
 This lessens the risks of losing access to the MFA due to device loss, device trade-in, or if the individual owning the device is no longer employed at the company.

**Severity**: Low

### [Password policies for IAM users should have strong configurations](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fd751d04-8378-4cf8-8f1b-594ee340ae08)

**Description**: Checks whether the account password policy for IAM users uses the following minimum configurations.

- RequireUppercaseCharacters- Require at least one uppercase character in password. (Default = true)
- RequireLowercaseCharacters- Require at least one lowercase character in password. (Default = true)
- RequireNumbers- Require at least one number in password. (Default = true)
- MinimumPasswordLength- Password minimum length. (Default = 7 or longer)
- PasswordReusePrevention- Number of passwords before allowing reuse. (Default = 4)
- MaxPasswordAge- Number of days before password expiration. (Default = 90)

**Severity**: Medium

### [Root account access key shouldn't exist](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/412835f5-0339-4180-9c22-ea8735dc6c24)

**Description**: The root account is the most privileged user in an AWS account. AWS Access Keys provide programmatic access to a given AWS account.
 It's recommended that all access keys associated with the root account be removed.
 Removing access keys associated with the root account limits vectors by which the account can be compromised.
 Additionally, removing the root access keys encourages the creation and use of role based accounts that are least privileged.

**Severity**: High

### [S3 Block Public Access setting should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ac66d910-ae29-4cab-967b-c3f0810b7642)

**Description**: Enabling Block Public Access setting for your S3 bucket can help prevent sensitive data leaks and protect your bucket from malicious actions.

**Severity**: Medium

### [S3 Block Public Access setting should be enabled at the bucket level](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f16376-e2dd-487d-b5ee-ba67fef4c5c0)

**Description**: This control checks whether S3 buckets have bucket-level public access blocks applied. This control fails if any of the following settings are set to false:

- ignorePublicAcls
- blockPublicPolicy
- blockPublicAcls
- restrictPublicBuckets
Block Public Access at the S3 bucket level provides controls to ensure that objects never have public access. Public access is granted to buckets and objects through access control lists (ACLs), bucket policies, or both.
Unless you intend to have your S3 buckets publicly accessible, you should configure the bucket level Amazon S3 Block Public Access feature.

**Severity**: High

### [S3 buckets public read access should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f65de27c-1b77-4a2d-bc89-8631ff9ee786)

**Description**: Removing public read access to your S3 bucket can help protect your data and prevent a data breach.

**Severity**: High

### [S3 buckets public write access should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/994d14f1-b8d7-4cb3-ad4e-a7ccb08065d5)

**Description**: Allowing public write access to your S3 bucket can leave you vulnerable to malicious actions such as storing data at your expense, encrypting your files for ransom, or using your bucket to operate malware.

**Severity**: High

### [Secrets Manager secrets should have automatic rotation enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4aa0f6dc-40be-43b2-92f1-3a52ad9d68d1)

**Description**: This control checks whether a secret stored in AWS Secrets Manager is configured with automatic rotation.
Secrets Manager helps you improve the security posture of your organization. Secrets include database credentials, passwords, and third-party API keys. You can use Secrets Manager to store secrets centrally, encrypt secrets automatically, control access to secrets, and rotate secrets safely and automatically.
Secrets Manager can rotate secrets. You can use rotation to replace long-term secrets with short-term ones. Rotating your secrets limits how long an unauthorized user can use a compromised secret. For this reason, you should rotate your secrets frequently. To learn more about rotation, see [Rotating your AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) in the AWS Secrets Manager User Guide.

**Severity**: Medium

### [Stopped EC2 instances should be removed after a specified time period](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a3340b3-8916-40fe-942d-a937e60f5d4c)

**Description**: This control checks whether any EC2 instances have been stopped for more than the allowed number of days. An EC2 instance fails this check if it's stopped for longer than the maximum allowed time period, which by default is 30 days.
 A failed finding indicates that an EC2 instance has not run for a significant period of time. This creates a security risk because the EC2 instance isn't being actively maintained (analyzed, patched, updated). If it's later launched, the lack of proper maintenance could result in unexpected issues in your AWS environment. To safely maintain an EC2 instance over time in a nonrunning state, start it periodically for maintenance and then stop it after maintenance. Ideally this is an automated process.

**Severity**: Medium

### [AWS overprovisioned identities should have only the necessary permissions (Preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/2499299f-7149-4af6-8405-d5492cabaa65)

**Description**: An over-provisioned active identity is an identity that has access to privileges that they haven't used. Over-provisioned active identities, especially for non-human accounts that have defined actions and responsibilities, can increase the blast radius in the event of a user, key, or resource compromise. Remove unneeded permissions and establish review processes to achieve the least privileged permissions.

**Severity**: Medium

### [Unused identities in your AWS environment should be removed (Preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/71016e8c-d079-479d-942b-9c95b463e4a6)

**Description**: Inactive identities are human and non-human entities that haven't performed any action on any resource in the last 90 days. Inactive IAM identities with high-risk permissions in your AWS account can be prone to attack if left as is and leave organizations open to credential misuse or exploitation. Proactively detecting and responding to unused identities helps you prevent unauthorized entities from gaining access to your AWS resources.

**Severity**: Medium

## AWS Networking recommendations

### [Amazon EC2 should be configured to use VPC endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e700ddd4-bb55-4602-b93a-d75895fbf7c6)

**Description**: This control checks whether a service endpoint for Amazon EC2 is created for each VPC. The control fails if a VPC doesn't have a VPC endpoint created for the Amazon EC2 service.
 To improve the security posture of your VPC, you can configure Amazon EC2 to use an interface VPC endpoint. Interface endpoints are powered by AWS PrivateLink, a technology that enables you to access Amazon EC2 API operations privately. It restricts all network traffic between your VPC and Amazon EC2 to the Amazon network. Because endpoints are supported within the same Region only, you can't create an endpoint between a VPC and a service in a different Region. This prevents unintended Amazon EC2 API calls to other Regions.
To learn more about creating VPC endpoints for Amazon EC2, see [Amazon EC2 and interface VPC endpoints](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/interface-vpc-endpoints.html) in the Amazon EC2 User Guide for Linux Instances.

**Severity**: Medium

### [Amazon ECS services should not have public IP addresses assigned to them automatically](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9bb205cd-a931-4f77-a620-0a263479732b)

**Description**: A public IP address is an IP address that is reachable from the internet.
 If you launch your Amazon ECS instances with a public IP address, then your Amazon ECS instances are reachable from the internet.
 Amazon ECS services shouldn't be publicly accessible, as this might allow unintended access to your container application servers.

**Severity**: High

### [Amazon EMR cluster master nodes should not have public IP addresses](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fe770214-7b47-48f7-a78c-1279c35d8279)

**Description**: This control checks whether master nodes on Amazon EMR clusters have public IP addresses.
The control fails if the master node has public IP addresses that are associated with any of its instances. Public IP addresses are designated in the PublicIp field of the NetworkInterfaces configuration for the instance.
 This control only checks Amazon EMR clusters that are in a RUNNING or WAITING state.

**Severity**: High

### [Amazon Redshift clusters should use enhanced VPC routing](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1ee72ceb-2cb7-4686-84e6-0e1ac1c27241)

**Description**: This control checks whether an Amazon Redshift cluster has EnhancedVpcRouting enabled.
Enhanced VPC routing forces all COPY and UNLOAD traffic between the cluster and data repositories to go through your VPC. You can then use VPC features such as security groups and network access control lists to secure network traffic. You can also use VPC Flow Logs to monitor network traffic.

**Severity**: High

### [Application Load Balancer should be configured to redirect all HTTP requests to HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fce0daac-96e4-47ab-ab35-18ac6b7dcc70)

**Description**: To enforce encryption in transit, you should use redirect actions with Application Load Balancers to redirect client HTTP requests to an HTTPS request on port 443.

**Severity**: Medium

### [Application load balancers should be configured to drop HTTP headers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ca924610-5a8e-4c5e-9f17-8dff1ab1757b)

**Description**: This control evaluates AWS Application Load Balancers (ALB) to ensure they're configured to drop invalid HTTP headers. The control fails if the value of routing.http.drop_invalid_header_fields.enabled is set to false.
By default, ALBs aren't configured to drop invalid HTTP header values. Removing these header values prevents HTTP desync attacks.

**Severity**: Medium

### [Configure Lambda functions to a VPC](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/10445918-c305-4c6a-9851-250e8ec7b872)

**Description**: This control checks whether a Lambda function is in a VPC. It doesn't evaluate the VPC subnet routing configuration to determine public reachability.
 Note that if Lambda@Edge is found in the account, then this control generates failed findings. To prevent these findings, you can disable this control.

**Severity**: Low

### [EC2 instances should not have a public IP address](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/63afb20c-4e8e-42ad-bc6d-dc48d4bebc5f)

**Description**: This control checks whether EC2 instances have a public IP address. The control fails if the "publicIp" field is present in the EC2 instance configuration item. This control applies to IPv4 addresses only.
 A public IPv4 address is an IP address that is reachable from the internet. If you launch your instance with a public IP address, then your EC2 instance is reachable from the internet. A private IPv4 address is an IP address that isn't reachable from the internet. You can use private IPv4 addresses for communication between EC2 instances in the same VPC or in your connected private network.
IPv6 addresses are globally unique, and therefore are reachable from the internet. However, by default all subnets have the IPv6 addressing attribute set to false. For more information about IPv6, see [IP addressing in your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html) in the Amazon VPC User Guide.
If you have a legitimate use case to maintain EC2 instances with public IP addresses, then you can suppress the findings from this control. For more information about front-end architecture options, see the [AWS Architecture Blog](http://aws.amazon.com/blogs/architecture/) or the [This Is My Architecture series](http://aws.amazon.com/blogs/architecture/).

**Severity**: High

### [EC2 instances should not use multiple ENIs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fead4128-7325-4b82-beda-3fd42de36920)

**Description**: This control checks whether an EC2 instance uses multiple Elastic Network Interfaces (ENIs) or Elastic Fabric Adapters (EFAs). This control passes if a single network adapter is used. The control includes an optional parameter list to identify the allowed ENIs.
Multiple ENIs can cause dual-homed instances, meaning instances that have multiple subnets. This can add network security complexity and introduce unintended network paths and access.

**Severity**: Low

### [EC2 instances should use IMDSv2](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5ea3248a-8af5-4df3-8e08-f7d1925ea147)

**Description**: This control checks whether your EC2 instance metadata version is configured with Instance Metadata Service Version 2 (IMDSv2). The control passes if "HttpTokens" is set to "required" for IMDSv2. The control fails if "HttpTokens" is set to "optional".
You use instance metadata to configure or manage the running instance. The IMDS provides access to temporary, frequently rotated credentials. These credentials remove the need to hard code or distribute sensitive credentials to instances manually or programmatically. The IMDS is attached locally to every EC2 instance. It runs on a special 'link local' IP address of 169.254.169.254. This IP address is only accessible by software that runs on the instance.
Version 2 of the IMDS adds new protections for the following types of vulnerabilities. These vulnerabilities could be used to try to access the IMDS.

- Open website application firewalls
- Open reverse proxies
- Server-side request forgery (SSRF) vulnerabilities
- Open Layer 3 firewalls and network address translation (NAT)
Security Hub recommends that you configure your EC2 instances with IMDSv2.

**Severity**: High

### [EC2 subnets should not automatically assign public IP addresses](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ace790eb-39b9-4b4f-b53d-26d0f77d4ab8)

**Description**: This control checks whether the assignment of public IPs in Amazon Virtual Private Cloud (Amazon VPC) subnets have "MapPublicIpOnLaunch" set to "FALSE". The control passes if the flag is set to "FALSE".
 All subnets have an attribute that determines whether a network interface created in the subnet automatically receives a public IPv4 address. Instances that are launched into subnets that have this attribute enabled have a public IP address assigned to their primary network interface.

**Severity**: Medium

### [Ensure a log metric filter and alarm exist for AWS Config configuration changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/965a7c7f-e6da-4062-83f4-9c1800e51e44)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for detecting changes to CloudTrail's configurations.
Monitoring changes to AWS Config configuration helps ensure sustained visibility of configuration items within the AWS account.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for AWS Management Console authentication failures](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0e09bb35-54a3-48a1-855d-9fd3239deaf7)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for failed console authentication attempts.
 Monitoring failed console logins might decrease lead time to detect an attempt to brute force a credential, which might provide an indicator, such as source IP, that can be used in other event correlation.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for changes to Network Access Control Lists (NACL)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ec356185-75b9-4ff2-a284-9f64fc885e72)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms. NACLs are used as a stateless packet filter to control ingress and egress traffic for subnets within a VPC.
 It is recommended that a metric filter and alarm be established for changes made to NACLs.
Monitoring changes to NACLs helps ensure that AWS resources and services aren't unintentionally exposed.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for changes to network gateways](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c7156050-6f51-4d3f-a880-9f2363648cfb)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms. Network gateways are required to send/receive traffic to a destination outside of a VPC.
 It's recommended that a metric filter and alarm be established for changes to network gateways.
Monitoring changes to network gateways helps ensure that all ingress/egress traffic traverses the VPC border via a controlled path.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for CloudTrail configuration changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0dc3b824-092a-4fc6-b8b4-31d5c2403024)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for detecting changes to CloudTrail's configurations.

 Monitoring changes to CloudTrail's configuration helps ensure sustained visibility to activities performed in the AWS account.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for disabling or scheduled deletion of customer created CMKs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d12e97c1-1f3e-4c69-8cc1-6e4cc6a9b167)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for customer created CMKs, which have changed state to disabled or scheduled deletion.
 Data encrypted with disabled or deleted keys will no longer be accessible.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for IAM policy changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8e5ad1a9-3803-4399-baf2-a7eb9483b954)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established changes made to Identity and Access Management (IAM) policies.
 Monitoring changes to IAM policies helps ensure authentication and authorization controls remain intact.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for Management Console sign-in without MFA](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/001ddfe0-1b98-443f-819d-99f060fd67d5)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for console logins that aren't protected by multifactor authentication (MFA).
Monitoring for single-factor console logins increases visibility into accounts that aren't protected by MFA.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for route table changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7e70666f-4bec-4ca0-8b59-c6c8b9b3cc1e)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms. Routing tables are used to route network traffic between subnets and to network gateways.
 It's recommended that a metric filter and alarm be established for changes to route tables.
Monitoring changes to route tables helps ensure that all VPC traffic flows through an expected path.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for S3 bucket policy changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/69ed2dc0-6f39-4a33-a747-20a28f85b33c)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It is recommended that a metric filter and alarm be established for changes to S3 bucket policies.
Monitoring changes to S3 bucket policies might reduce time to detect and correct permissive policies on sensitive S3 buckets.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for security group changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/aedabb63-8bdb-47f9-955c-72b652a75e2a)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms. Security Groups are a stateful packet filter that controls ingress and egress traffic within a VPC.
 It's recommended that a metric filter and alarm be established changes to Security Groups.
Monitoring changes to security group helps ensure that resources and services aren't unintentionally exposed.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for unauthorized API calls](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231951ea-e9db-41cd-a7d0-611105fa4fb9)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for unauthorized API calls.
 Monitoring unauthorized API calls helps reveal application errors and might reduce time to detect malicious activity.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for usage of 'root' account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/59f84fbd-7946-41b3-88b1-d899dcac92bc)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's recommended that a metric filter and alarm be established for root login attempts.

 Monitoring for root account logins provides visibility into the use of a fully privileged account and an opportunity to reduce the use of it.

**Severity**: Low

### [Ensure a log metric filter and alarm exist for VPC changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4b4bfa9b-fd2a-43f1-961f-654b9d5c9a60)

**Description**: Real-time monitoring of API calls can be achieved by directing CloudTrail Logs to CloudWatch Logs and establishing corresponding metric filters and alarms.
 It's possible to have more than one VPC within an account, in addition it's also possible to create a peer connection between 2 VPCs enabling network traffic to route between VPCs. It's recommended that a metric filter and alarm be established for changes made to VPCs.
Monitoring changes to IAM policies helps ensure authentication and authorization controls remain intact.

**Severity**: Low

### [Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/79082bbe-34fc-480a-a7fc-3aad94954609)

**Description**: Security groups provide stateful filtering of ingress/egress network traffic to AWS resources. It's recommended that no security group allows unrestricted ingress access to port 3389.
 Removing unfettered connectivity to remote console services, such as RDP, reduces a server's exposure to risk.

**Severity**: High

### [RDS databases and clusters should not use a database engine default port](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f1736090-65fc-454f-a437-af58fd91ad1e)

**Description**: This control checks whether the RDS cluster or instance uses a port other than the default port of the database engine.
If you use a known port to deploy an RDS cluster or instance, an attacker can guess information about the cluster or instance.
 The attacker can use this information in conjunction with other information to connect to an RDS cluster or instance or gain additional information about your application.
When you change the port, you must also update the existing connection strings that were used to connect to the old port.
 You should also check the security group of the DB instance to ensure that it includes an ingress rule that allows connectivity on the new port.

**Severity**: Low

### [RDS instances should be deployed in a VPC](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9a84b879-8aab-4b82-80f2-22e637a26813)

**Description**: VPCs provide a number of network controls to secure access to RDS resources.
 These controls include VPC Endpoints, network ACLs, and security groups.
 To take advantage of these controls, we recommend that you move EC2-Classic RDS instances to EC2-VPC.

**Severity**: Low

### [S3 buckets should require requests to use Secure Socket Layer](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1fb7ea50-412e-4dd4-ac79-94d54bd8f21e)

**Description**: We recommend requiring requests to use Secure Socket Layer (SSL) on all Amazon S3 bucket.
 S3 buckets should have policies that require all requests ('Action: S3:*') to only accept transmission of data over HTTPS in the S3 resource policy, indicated by the condition key 'aws:SecureTransport'.

**Severity**: Medium

### [Security groups should not allow ingress from 0.0.0.0/0 to port 22](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e1f4bba6-5f43-4dc5-ab15-f2a9f5807fea)

**Description**: To reduce the server's exposure, it's recommended not to allow unrestricted ingress access to port '22'.

**Severity**: High

### [Security groups should not allow unrestricted access to ports with high risk](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/194fd099-90fa-43e1-8d06-6b4f5138e952)

**Description**: This control checks whether unrestricted incoming traffic for the security groups is accessible to the specified ports that have the highest risk. This control passes when none of the rules in a security group allow ingress traffic from 0.0.0.0/0 for those ports.
Unrestricted access (0.0.0.0/0) increases opportunities for malicious activity, such as hacking, denial-of-service attacks, and loss of data.
Security groups provide stateful filtering of ingress and egress network traffic to AWS resources. No security group should allow unrestricted ingress access to the following ports:

- 3389 (RDP)
- 20, 21 (FTP)
- 22 (SSH)
- 23 (Telnet)
- 110 (POP3)
- 143 (IMAP)
- 3306 (MySQL)
- 8080 (proxy)
- 1433, 1434 (MSSQL)
- 9200 or 9300 (Elasticsearch)
- 5601 (Kibana)
- 25 (SMTP)
- 445 (CIFS)
- 135 (RPC)
- 4333 (ahsp)
- 5432 (postgresql)
- 5500 (fcp-addr-srvr1)

**Severity**: Medium

### [Security groups should only allow unrestricted incoming traffic for authorized ports](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8b328664-f3f1-45ab-976d-f6c66647b3b8)

**Description**: This control checks whether the security groups that are in use allow unrestricted incoming traffic. Optionally the rule checks whether the port numbers are listed in the "authorizedTcpPorts" parameter.

- If the security group rule port number allows unrestricted incoming traffic, but the port number is specified in "authorizedTcpPorts", then the control passes. The default value for "authorizedTcpPorts" is **80, 443**.
- If the security group rule port number allows unrestricted incoming traffic, but the port number isn't specified in authorizedTcpPorts input parameter, then the control fails.
- If the parameter isn't used, then the control fails for any security group that has an unrestricted inbound rule.
Security groups provide stateful filtering of ingress and egress network traffic to AWS. Security group rules should follow the principle of least privileged access. Unrestricted access (IP address with a /0 suffix) increases the opportunity for malicious activity such as hacking, denial-of-service attacks, and loss of data.
Unless a port is specifically allowed, the port should deny unrestricted access.

**Severity**: High

### [Unused EC2 EIPs should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/601406b5-110c-41be-ad69-9c5661ba5f7c)

**Description**: Elastic IP addresses that are allocated to a VPC should be attached to Amazon EC2 instances or in-use elastic network interfaces (ENIs).

**Severity**: Low

### [Unused network access control lists should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5f9a7d87-ec2e-409a-991a-48c29484d6b5)

**Description**: This control checks whether there are any unused network access control lists (ACLs).
 The control checks the item configuration of the resource "AWS::EC2::NetworkAcl" and determines the relationships of the network ACL.
 If the only relationship is the VPC of the network ACL, then the control fails.
If other relationships are listed, then the control passes.

**Severity**: Low

### [VPC's default security group should restricts all traffic](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/500c4d2e-9baf-4081-b8a8-936ac85771a5)

**Description**: Security group should restrict all traffic to reduce resource exposure.

**Severity**: Low

## Related content

- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
