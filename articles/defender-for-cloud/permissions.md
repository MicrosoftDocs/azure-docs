---
title: User roles and permissions
description: Learn how Microsoft Defender for Cloud uses role-based access control to assign permissions to users and identify the permitted actions for each role.
ms.topic: limits-and-quotas
ms.date: 07/11/2024
---

# User roles and permissions

Microsoft Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.yml) to provide [built-in roles](../role-based-access-control/built-in-roles.md). You can assign these roles to users, groups, and services in Azure to give users access to resources according to the access defined in the role.

Defender for Cloud assesses the configuration of your resources to identify security issues and vulnerabilities. In Defender for Cloud, you only see information related to a resource when you're assigned one of these roles for the subscription or for the resource group the resource is in: Owner, Contributor, or Reader.

In addition to the built-in roles, there are two roles specific to Defender for Cloud:

- **Security Reader**: A user that belongs to this role has read-only access to Defender for Cloud. The user can view recommendations, alerts, a security policy, and security states, but can't make changes.
- **Security Admin**: A user that belongs to this role has the same access as the Security Reader and can also update the security policy, and dismiss alerts and recommendations.

We recommend that you assign the least permissive role needed for users to complete their tasks. For example, assign the Reader role to users who only need to view information about the security health of a resource but not take action, such as applying recommendations or editing policies.

## Roles and allowed actions

The following table displays roles and allowed actions in Defender for Cloud.

| **Action**   | [Security Reader](../role-based-access-control/built-in-roles.md#security-reader) /<br> [Reader](../role-based-access-control/built-in-roles.md#reader) | [Security Admin](../role-based-access-control/built-in-roles.md#security-admin) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) / [Owner](../role-based-access-control/built-in-roles.md#owner) | [Contributor](../role-based-access-control/built-in-roles.md#contributor) | [Owner](../role-based-access-control/built-in-roles.md#owner) |
|:-|:-:|:-:|:-:|:-:|:-:|
|  |  |  | **(Resource group level)** | **(Subscription level)** | **(Subscription level)** |
| Add/assign initiatives (including regulatory compliance standards) | - | ✔ | - | - | ✔ |
| Edit security policy | - | ✔ | - | - | ✔ |
| Enable / disable Microsoft Defender plans | - | ✔ | - | ✔ | ✔ |
| Dismiss alerts | - | ✔ | - | ✔ | ✔ |
| Apply security recommendations for a resource</br> (and use [Fix](implement-security-recommendations.md)) | - | - | ✔ | ✔ | ✔ |
| View alerts and recommendations | ✔ | ✔ | ✔ | ✔ | ✔ |
| Exempt security recommendations | - |✔|-|-| ✔ |
| Configure email notifications | - | ✔ | ✔| ✔ | ✔ |

> [!NOTE]
> While the three roles mentioned are sufficient for enabling and disabling Defender plans, to enable all capabilities of a plan the Owner role is required.

The specific role required to deploy monitoring components depends on the extension you're deploying. Learn more about [monitoring components](monitoring-components.md).

## Roles used to automatically provision agents and extensions

To allow the Security Admin role to automatically provision agents and extensions used in Defender for Cloud plans, Defender for Cloud uses policy remediation in a similar way to [Azure Policy](../governance/policy/how-to/remediate-resources.md). To use remediation, Defender for Cloud needs to create service principals, also called managed identities that assign roles at the subscription level. For example, the service principals for the Defender for Containers plan are:

| Service Principal | Roles |
|:-|:-|
| Defender for Containers provisioning AKS Security Profile | • Kubernetes Extension Contributor<br>• Contributor<br>• Azure Kubernetes Service Contributor<br>• Log Analytics Contributor |
| Defender for Containers provisioning Arc-enabled Kubernetes | • Azure Kubernetes Service Contributor<br>• Kubernetes Extension Contributor<br>• Contributor<br>• Log Analytics Contributor |
| Defender for Containers provisioning Azure Policy for Kubernetes  | • Kubernetes Extension Contributor<br>• Contributor<br>• Azure Kubernetes Service Contributor |
| Defender for Containers provisioning Policy extension for Arc-enabled Kubernetes | • Azure Kubernetes Service Contributor<br>• Kubernetes Extension Contributor<br>• Contributor |

## Permissions on AWS

When you onboard an Amazon Web Services (AWS) connector, Defender for Cloud will create roles and assign permissions on your AWS account. The following table shows the roles and permission assigned by each plan on your AWS account.

| Defender for Cloud plan | Role created | Permission assigned on AWS account |
|--|--|--|
| Defender CSPM | CspmMonitorAws  | To discover AWS resources permissions,  read all resources except:<br> consolidatedbilling:*<br> freetier:*<br> invoicing:*<br> payments:*<br> billing:*<br> tax:*<br> cur:* |
| Defender CSPM <br><br> Defender for Servers | DefenderForCloud-AgentlessScanner | To create and clean up disk snapshots (scoped by tag) “CreatedBy”: "Microsoft Defender for Cloud" Permissions:<br> ec2:DeleteSnapshot ec2:ModifySnapshotAttribute<br>  ec2:DeleteTags<br>  ec2:CreateTags<br>  ec2:CreateSnapshots<br>  ec2:CopySnapshot<br>  ec2:CreateSnapshot<br>  ec2:DescribeSnapshots<br>  ec2:DescribeInstanceStatus<br>  Permission to EncryptionKeyCreation kms:CreateKey<br>  kms:ListKeys<br>  Permissions to EncryptionKeyManagement kms:TagResource<br>  kms:GetKeyRotationStatus<br>  kms:PutKeyPolicy<br>  kms:GetKeyPolicy<br>  kms:CreateAlias<br>  kms:TagResource<br>  kms:ListResourceTags<br>  kms:GenerateDataKeyWithoutPlaintext<br>  kms:DescribeKey<br> kms:RetireGrant<br>  kms:CreateGrant<br>  kms:ReEncryptFrom |
| Defender CSPM <br><br> Defender for Storage | SensitiveDataDiscovery | Permissions to discover S3 buckets in the AWS account, permission for the Defender for Cloud scanner to access data in the S3 buckets.<br> S3 read only; KMS decrypt kms:Decrypt |
| CIEM | DefenderForCloud-Ciem <br> DefenderForCloud-OidcCiem | Permissions for Ciem Discovery<br> sts:AssumeRole<br>  sts:AssumeRoleWithSAML<br>  sts:GetAccessKeyInfo<br>  sts:GetCallerIdentity<br>  sts:GetFederationToken<br>  sts:GetServiceBearerToken<br>  sts:GetSessionToken<br>  sts:TagSession |
| Defender for Servers | DefenderForCloud-DefenderForServers | Permissions to configure JIT Network Access: <br>ec2:RevokeSecurityGroupIngress<br>  ec2:AuthorizeSecurityGroupIngress<br> ec2:DescribeInstances<br>  ec2:DescribeSecurityGroupRules<br>  ec2:DescribeVpcs<br>  ec2:CreateSecurityGroup<br>  ec2:DeleteSecurityGroup<br> ec2:ModifyNetworkInterfaceAttribute<br>  ec2:ModifySecurityGroupRules<br>  ec2:ModifyInstanceAttribute<br>  ec2:DescribeSubnets<br>  ec2:DescribeSecurityGroups |
| Defender for Containers | DefenderForCloud-Containers-K8s | Permissions to List EKS clusters and Collect Data from EKS clusters. <br>eks:UpdateClusterConfig<br>  eks:DescribeCluster |
| Defender for Containers | DefenderForCloud-DataCollection | Permissions to CloudWatch Log Group created by Defender for Cloud <br>“logs:PutSubscriptionFilter<br>  logs:DescribeSubscriptionFilters<br>  logs:DescribeLogGroups autp logs:PutRetentionPolicy<br><br> Permissions to use SQS queue created by Defender for Cloud <br>sqs:ReceiveMessage<br>   sqs:DeleteMessage |
| Defender for Containers | DefenderForCloud-Containers-K8s-cloudwatch-to-kinesis | Permissions to access Kinesis Data Firehose delivery stream created by Defender for Cloud<br> firehose:* |
| Defender for Containers | DefenderForCloud-Containers-K8s-kinesis-to-s3 | Permissions to access S3 bucket created by Defender for Cloud <br> s3:GetObject<br>  s3:GetBucketLocation<br>  s3:AbortMultipartUpload<br> s3:GetBucketLocation<br>  s3:GetObject<br>  s3:ListBucket<br>  s3:ListBucketMultipartUploads<br>  s3:PutObject |
| Defender for Containers <br><br> Defender CSPM | MDCContainersAgentlessDiscoveryK8sRole | Permissions to Collecting Data from EKS clusters. Updating EKS clusters to support IP restriction and create iamidentitymapping for EKS clusters<br> “eks:DescribeCluster” <br>“eks:UpdateClusterConfig*” |
| Defender for Containers <br><br> Defender CSPM | MDCContainersImageAssessmentRole | Permissions to Scan images from ECR and ECR Public. <br>AmazonEC2ContainerRegistryReadOnly <br>AmazonElasticContainerRegistryPublicReadOnly <br>AmazonEC2ContainerRegistryPowerUser  <br> AmazonElasticContainerRegistryPublicPowerUser |
| Defender for Servers | DefenderForCloud-ArcAutoProvisioning | Permissions to install Azure Arc on all EC2 instances using SSM <br>ssm:CancelCommand<br>  ssm:DescribeInstanceInformation<br>  ssm:GetCommandInvocation<br>  ssm:UpdateServiceSetting<br>  ssm:GetServiceSetting<br>  ssm:GetAutomationExecution<br>  ec2:DescribeIamInstanceProfileAssociations<br>  ec2:DisassociateIamInstanceProfile<br>  ec2:DescribeInstances<br>  ssm:StartAutomationExecution<br> iam:GetInstanceProfile<br> iam:ListInstanceProfilesForRole<br>  ssm:GetAutomationExecution<br>  ec2:DescribeIamInstanceProfileAssociations<br>  ec2:DisassociateIamInstanceProfile<br>  ec2:DescribeInstances<br>  ssm:StartAutomationExecution<br>  iam:GetInstanceProfile<br>  iam:ListInstanceProfilesForRole |
| Defender CSPM | DefenderForCloud-DataSecurityPostureDB | Permission to Discover RDS instances in AWS account, create RDS instance snapshot, <br> - List all RDS DBs/clusters <br> - List all DB/Cluster snapshots <br> - Copy all DB/cluster snapshots <br> - Delete/update DB/cluster snapshot with prefix *defenderfordatabases* <br> - List all KMS keys <br> - Use all KMS keys only for RDS on source account <br> - List KMS keys with tag prefix *DefenderForDatabases* <br> - Create alias for KMS keys <br><br> Permissions required to discover, RDS instances<br> rds:DescribeDBInstances<br> rds:DescribeDBClusters<br> rds:DescribeDBClusterSnapshots<br>  rds:DescribeDBSnapshots<br> rds:CopyDBSnapshot<br> rds:CopyDBClusterSnapshot<br> rds:DeleteDBSnapshot<br>  rds:DeleteDBClusterSnapshot<br> rds:ModifyDBSnapshotAttribute<br> rds:ModifyDBClusterSnapshotAttribute rds:DescribeDBClusterParameters<br> rds:DescribeDBParameters<br>  rds:DescribeOptionGroups<br>  kms:CreateGrant<br> kms:ListAliases<br> kms:CreateKey<br> kms:TagResource<br> kms:ListGrants<br>  kms:DescribeKey<br> kms:PutKeyPolicy<br> kms:Encrypt<br> kms:CreateGrant<br> kms:EnableKey<br>  kms:CancelKeyDeletion<br> kms:DisableKey<br> kms:ScheduleKeyDeletion<br> kms:UpdateAlias<br>  kms:UpdateKeyDescription |

## Permissions on GCP

When you onboard an Google Cloud Projects (GCP) connector, Defender for Cloud will create roles and assign permissions on your GCP project. The following table shows the roles and permission assigned by each plan on your GCP project.

| Defender for Cloud plan | Role created | Permission assigned on AWS account |
|--|--|--|
| Defender CSPM  | MDCCspmCustomRole  | These permissions allow the CSPM role to discover and scan resources within the organization:<br><br>Allows the role to view and organizations, projects and folders:<br> resourcemanager.folders.get<br> resourcemanager.folders.list resourcemanager.folders.getIamPolicy<br> resourcemanager.organizations.get<br> resourcemanager.organizations.getIamPolicy<br> storage.buckets.getIamPolicy<br><br>Allows the auto-provisioning process of new projects and removal of deleted projects:<br> resourcemanager.projects.get<br> resourcemanager.projects.list<br><br>Allows the role to enable Google Cloud services used for the discovery of resources:<br> serviceusage.services.enable<br><br>Used to create and list IAM roles:<br> iam.roles.create<br> iam.roles.list<br><br>Allows the role to act as a service account and gain permission to resources:<br>iam.serviceAccounts.actAs<br><br>Allows the role to view project details and set common instance metadata:<br>compute.projects.get<br> compute.projects.setCommonInstanceMetadata |
| Defender for Servers | microsoft-defender-for-servers <br> azure-arc-for-servers-onboard | Read-only access to get and list Compute Engine <br> resources compute.viewer<br> iam.serviceAccountTokenCreator<br> osconfig.osPolicyAssignmentAdmin<br> osconfig.osPolicyAssignmentReportViewer |
| Defender for Database | defender-for-databases-arc-ap | Permissions to Defender for databases ARC auto provisioning <br> compute.viewer <br> iam.workloadIdentityUser <br> iam.serviceAccountTokenCreator<br> osconfig.osPolicyAssignmentAdmin<br> osconfig.osPolicyAssignmentReportViewer |
| Defender CSPM <br><br> Defender for Storage | data-security-posture-storage | Permission for the Defender for Cloud scanner to discover GCP storage buckets, to access data in the GCP storage buckets <br> storage.objects.list<br> storage.objects.get<br> storage.buckets.get |
| Defender CSPM <br><br> Defender for Storage | data-security-posture-storage | Permission for the Defender for Cloud scanner to discover GCP storage buckets, to access data in the GCP storage buckets<br> storage.objects.list<br> storage.objects.get<br> storage.buckets.get |
| Defender CSPM | microsoft-defender-ciem  | Permissions to get details about the organization resource.<br> resourcemanager.folders.getIamPolicy<br> resourcemanager.folders.list<br> resourcemanager.organizations.get<br> resourcemanager.organizations.getIamPolicy<br> storage.buckets.getIamPolicy |
| Defender CSPM <br><br> Defender for Servers | MDCAgentlessScanningRole | Permissions for agentless disk scanning:<br> compute.disks.createSnapshot<br> compute.instances.get |
| Defender CSPM <br><br> Defender for servers | cloudkms.cryptoKeyEncrypterDecrypter | Permissions to an existing GCP KMS role are granted to support scanning disks that are encrypted with CMEK |
| Defender CSPM <br><br> Defender for Containers | mdc-containers-artifact-assess | Permission to Scan images from GAR and GCR. <br> artifactregistry.reader <br> storage.objectViewer |
| Defender for Containers | mdc-containers-k8s-operator | Permissions to Collect Data from GKE clusters. Update GKE clusters to support IP restriction. <br> container.viewer <br> MDCGkeClusterWriteRole container.clusters.update* |
| Defender for Containers | microsoft-defender-containers  | Permissions to create and manage log sink to route logs to a Cloud Pub/Sub topic. <br> logging.sinks.list<br> logging.sinks.get<br> logging.sinks.create<br> logging.sinks.update<br> logging.sinks.delete<br> resourcemanager.projects.getIamPolicy<br> resourcemanager.organizations.getIamPolicy<br> iam.serviceAccounts.get <br>iam.workloadIdentityPoolProviders.get |
| Defender for Containers | ms-defender-containers-stream | Permissions to allow logging to send logs to pub sub:<br> pubsub.subscriptions.consume <br> pubsub.subscriptions.get |

## Next steps

This article explained how Defender for Cloud uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Defender for Cloud](tutorial-security-policy.md)
- [Manage security recommendations in Defender for Cloud](review-security-recommendations.md)
- [Manage and respond to security alerts in Defender for Cloud](managing-and-responding-alerts.yml)
- [Monitor partner security solutions](./partner-integration.md)
