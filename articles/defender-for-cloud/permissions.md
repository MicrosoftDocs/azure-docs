---
title: User roles and permissions
description: Learn how Microsoft Defender for Cloud uses role-based access control to assign permissions to users and identify the permitted actions for each role.
ms.topic: limits-and-quotas
ms.date: 07/10/2024
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
| Defender CSPM | CspmMonitorAws  | To discover AWS resources permissions,read all resources except: "consolidatedbilling:*", "freetier:*", "invoicing:*", "payments:*", "billing:*", "tax:*", "cur:*" |
| Defender CSPM <br><br> Defender for Servers | DefenderForCloud-AgentlessScanner | To create and clean up disk snapshots (scoped by tag) - “CreatedBy”: "Microsoft Defender for Cloud" Permissions: "ec2:DeleteSnapshot" "ec2:ModifySnapshotAttribute", "ec2:DeleteTags", "ec2:CreateTags", "ec2:CreateSnapshots", "ec2:CopySnapshot", "ec2:CreateSnapshot", "ec2:DescribeSnapshots", "ec2:DescribeInstanceStatus", Permission to EncryptionKeyCreation "kms:CreateKey", "kms:ListKeys", Permissions to EncryptionKeyManagement "kms:TagResource", "kms:GetKeyRotationStatus", "kms:PutKeyPolicy", "kms:GetKeyPolicy", "kms:CreateAlias", "kms:TagResource", "kms:ListResourceTags", "kms:GenerateDataKeyWithoutPlaintext", "kms:DescribeKey","kms:RetireGrant", "kms:CreateGrant", "kms:ReEncryptFrom" |
| Defender CSPM <br><br> Defender for Storage | SensitiveDataDiscovery | Permissions to discover S3 buckets in the AWS account, permission for the Defender for Cloud scanner to access data in the S3 buckets. S3 read only; KMS decrypt "kms:Decrypt" |
| CIEM | DefenderForCloud-Ciem <br> DefenderForCloud-OidcCiem | Permissions for Ciem Discovery "sts:AssumeRole", "sts:AssumeRoleWithSAML", "sts:GetAccessKeyInfo", "sts:GetCallerIdentity", "sts:GetFederationToken", "sts:GetServiceBearerToken", "sts:GetSessionToken", "sts:TagSession" |
| Defender for Servers | DefenderForCloud-DefenderForServers | Permissions to configure JIT Network Access: "ec2:RevokeSecurityGroupIngress", "ec2:AuthorizeSecurityGroupIngress","ec2:DescribeInstances", "ec2:DescribeSecurityGroupRules", "ec2:DescribeVpcs", "ec2:CreateSecurityGroup", "ec2:DeleteSecurityGroup","ec2:ModifyNetworkInterfaceAttribute", "ec2:ModifySecurityGroupRules", "ec2:ModifyInstanceAttribute", "ec2:DescribeSubnets", "ec2:DescribeSecurityGroups" |
| Defender for Containers | DefenderForCloud-Containers-K8s | Permissions to List EKS clusters and Collect Data from EKS clusters. "eks:UpdateClusterConfig", "eks:DescribeCluster" |
| Defender for Containers | DefenderForCloud-DataCollection | Permissions to CloudWatch Log Group created by Defender for Cloud “logs:PutSubscriptionFilter", "logs:DescribeSubscriptionFilters", "logs:DescribeLogGroups" autp "logs:PutRetentionPolicy" Permissions to use SQS queue created by Defender for Cloud "sqs:ReceiveMessage",  "sqs:DeleteMessage" |
| Defender for Containers | DefenderForCloud-Containers-K8s-cloudwatch-to-kinesis | Permissions to access Kinesis Data Firehose delivery stream created by Defender for Cloud "firehose:*" |
| Defender for Containers | DefenderForCloud-Containers-K8s-kinesis-to-s3 | Permissions to access S3 bucket created by Defender for Cloud "s3:GetObject", "s3:GetBucketLocation", "s3:AbortMultipartUpload",  "s3:GetBucketLocation", "s3:GetObject", "s3:ListBucket", "s3:ListBucketMultipartUploads", "s3:PutObject" |
| Defender for Containers <br><br> Defender CSPM | MDCContainersAgentlessDiscoveryK8sRole | Permissions to Collecting Data from EKS clusters. Updating EKS clusters to support IP restriction and create iamidentitymapping for EKS clusters “eks:DescribeCluster” “eks:UpdateClusterConfig *” |
| Defender for Containers <br><br> Defender CSPM | MDCContainersImageAssessmentRole | Permissions to Scan images from ECR and ECR Public. AmazonEC2ContainerRegistryReadOnly AmazonElasticContainerRegistryPublicReadOnly AmazonEC2ContainerRegistryPowerUser  AmazonElasticContainerRegistryPublicPowerUser |
| Defender for Servers | DefenderForCloud-ArcAutoProvisioning | Permissions to install Azure Arc on all EC2 instances using SSM "ssm:CancelCommand", "ssm:DescribeInstanceInformation", "ssm:GetCommandInvocation", "ssm:UpdateServiceSetting", "ssm:GetServiceSetting", "ssm:GetAutomationExecution", "ec2:DescribeIamInstanceProfileAssociations", "ec2:DisassociateIamInstanceProfile", "ec2:DescribeInstances", "ssm:StartAutomationExecution","iam:GetInstanceProfile","iam:ListInstanceProfilesForRole", "ssm:GetAutomationExecution", "ec2:DescribeIamInstanceProfileAssociations", "ec2:DisassociateIamInstanceProfile", "ec2:DescribeInstances", "ssm:StartAutomationExecution", "iam:GetInstanceProfile", "iam:ListInstanceProfilesForRole" |
| Defender CSPM | DefenderForCloud-DataSecurityPostureDB | Permission to Discover RDS instances in AWS account, create RDS instance snapshot, <br> - List all RDS DBs/clusters <br> - List all DB/Cluster snapshots <br> - Copy all DB/cluster snapshots <br> - Delete/update DB/cluster snapshot with prefix *defenderfordatabases* <br> - List all KMS keys <br> - Use all KMS keys only for RDS on source account <br> - List KMS keys with tag prefix *DefenderForDatabases* <br> - Create alias for KMS keys <br><br> Permissions required to discover, RDS instances "rds:DescribeDBInstances", "rds:DescribeDBClusters", "rds:DescribeDBClusterSnapshots", "rds:DescribeDBSnapshots", "rds:CopyDBSnapshot", "rds:CopyDBClusterSnapshot", "rds:DeleteDBSnapshot", "rds:DeleteDBClusterSnapshot", "rds:ModifyDBSnapshotAttribute", "rds:ModifyDBClusterSnapshotAttribute" "rds:DescribeDBClusterParameters", "rds:DescribeDBParameters", "rds:DescribeOptionGroups", "kms:CreateGrant", "kms:ListAliases", "kms:CreateKey", "kms:TagResource", "kms:ListGrants", "kms:DescribeKey", "kms:PutKeyPolicy", "kms:Encrypt", "kms:CreateGrant", "kms:EnableKey", "kms:CancelKeyDeletion", "kms:DisableKey", "kms:ScheduleKeyDeletion", "kms:UpdateAlias", "kms:UpdateKeyDescription" |

## Permissions on GCP

When you onboard an Google Cloud Projects (GCP) connector, Defender for Cloud will create roles and assign permissions on your GCP project. The following table shows the roles and permission assigned by each plan on your GCP project.

| Defender for Cloud plan | Role created | Permission assigned on AWS account |
|--|--|--|
| Defender CSPM  | MDCCspmCustomRole  | To discover GCP resources resourcemanager.folders.getIamPolicy, resourcemanager.folders.list, resourcemanager.organizations.get, resourcemanager.organizations.getIamPolicy, storage.buckets.getIamPolicy resourcemanager.folders.get, resourcemanager.projects.get, resourcemanager.projects.list, serviceusage.services.enable, iam.roles.create, iam.roles.list, iam.serviceAccounts.actAs, compute.projects.get, compute.projects.setCommonInstanceMetadata" |
| Defender for Servers | microsoft-defender-for-servers , azure-arc-for-servers-onboard | Read-only access to get and list Compute Engine resources roles/compute.viewer, roles/iam.serviceAccountTokenCreator, roles/osconfig.osPolicyAssignmentAdmin, roles/osconfig.osPolicyAssignmentReportViewer, |
| Defender for Database | defender-for-databases-arc-ap | Permissions to defender for databases ARC auto provisioning roles/compute.viewer roles/iam.workloadIdentityUser roles/iam.serviceAccountTokenCreator, roles/osconfig.osPolicyAssignmentAdmin, roles/osconfig.osPolicyAssignmentReportViewer, |
| Defender CSPM <br><br> Defender for Storage | data-security-posture-storage | Permission for the Defender for Cloud scanner to discover GCP storage buckets, to access data in the GCP storage buckets storage.objects.list, storage.objects.get, storage.buckets.get |
| Defender CSPM <br><br> Defender for Storage | data-security-posture-storage | Permission for the Defender for Cloud scanner to discover GCP storage buckets, to access data in the GCP storage buckets storage.objects.list, storage.objects.get, storage.buckets.get |
| Defender CSPM | microsoft-defender-ciem  | Permissions to get details about the organization resource. resourcemanager.folders.getIamPolicy, resourcemanager.folders.list, resourcemanager.organizations.get, resourcemanager.organizations.getIamPolicy, storage.buckets.getIamPolicy |
| Defender CSPM <br><br> Defender for Servers | MDCAgentlessScanningRole | Permissions for agentless disk scanning: compute.disks.createSnapshot, compute.instances.get |
| Defender CSPM <br><br> Defender for servers | cloudkms.cryptoKeyEncrypterDecrypter | Permissions to an existing GCP KMS role are granted to support scanning disks that are encrypted with CMEK |
| Defender CSPM <br><br> Defender for Containers | mdc-containers-artifact-assess | Permission to Scan images from GAR and GCR.  Roles/artifactregistry.reader , Roles/storage.objectViewer |
| Defender for Containers | mdc-containers-k8s-operator | Permissions to Collect Data from GKE clusters. Update GKE clusters to support IP restriction. Roles/container.viewer , MDCGkeClusterWriteRole container.clusters.update * |
| Defender for Containers | microsoft-defender-containers  | Permissions to create and manage log sink to route logs to a Cloud Pub/Sub topic. logging.sinks.list, logging.sinks.get, logging.sinks.create, logging.sinks.update, logging.sinks.delete, resourcemanager.projects.getIamPolicy, resourcemanager.organizations.getIamPolicy, iam.serviceAccounts.get,iam.workloadIdentityPoolProviders.get |
| Defender for Containers | ms-defender-containers-stream | Permissions to allow logging to send logs to pub sub: pubsub.subscriptions.consume, pubsub.subscriptions.get |

## Next steps

This article explained how Defender for Cloud uses Azure RBAC to assign permissions to users and identified the allowed actions for each role. Now that you're familiar with the role assignments needed to monitor the security state of your subscription, edit security policies, and apply recommendations, learn how to:

- [Set security policies in Defender for Cloud](tutorial-security-policy.md)
- [Manage security recommendations in Defender for Cloud](review-security-recommendations.md)
- [Manage and respond to security alerts in Defender for Cloud](managing-and-responding-alerts.yml)
- [Monitor partner security solutions](./partner-integration.md)
