---
title: Supported resource and service types for multicloud in Foundational CSPM
description: Learn more about the supported resource and service types for multicloud in Microsoft Defender for Cloud's Foundational CSPM.
ms.topic: conceptual
ms.date: 02/29/2024
---

# Supported resource and service types for multicloud in foundational CSPM

 This page lists the resource and service types that are supported for Amazon Web Services (AWS) and Google Cloud Platform (GCP) in Defender for Cloud’s foundational Cloud Security Posture Management (CSPM) tier.

## Resource types supported in AWS

| Provider Namespace | Resource Type Name |
|----|----|
| AccessAnalyzer | AnalyzerSummary |
| ApiGateway | Stage |
| AppSync | GraphqlApi |
| ApplicationAutoScaling | ScalableTarget |
| AutoScaling | AutoScalingGroup |
| AWS | Account |
| AWS | AccountInRegion |
| CertificateManager | CertificateTags |
| CertificateManager | CertificateDetail |
| CertificateManager | CertificateSummary |
| CloudFormation | StackSummary |
| CloudFormation | StackTemplate |
| CloudFormation | StackInstanceSummary |
| CloudFormation | Stack |
| CloudFormation | StackResourceSummary |
| CloudFront | DistributionConfig |
| CloudFront | DistributionSummary |
| CloudFront | DistributionTags |
| CloudTrail | EventSelector |
| CloudTrail | Trail |
| CloudTrail | TrailStatus |
| CloudTrail | TrailTags |
| CloudWatch | MetricAlarm |
| CloudWatch | MetricAlarmTags |
| CloudWatchLogs | LogGroup |
| CloudWatchLogs | MetricFilter |
| CodeBuild | Project |
| CodeBuild | ProjectName |
| CodeBuild | SourceCredentialsInfo |
| ConfigService | ConfigurationRecorder |
| ConfigService | ConfigurationRecorderStatus |
| ConfigService | DeliveryChannel |
| DAX | Cluster |
| DAX | ClusterTags |
| DatabaseMigrationService | ReplicationInstance |
| DynamoDB | ContinuousBackupsDescription |
| DynamoDB | TableDescription |
| DynamoDB | TableTags |
| DynamoDB | TableName |
| EC2 | Snapshot |
| EC2 | Subnet |
| EC2 | Volume |
| EC2 | VPC |
| EC2 | VpcEndpoint |
| EC2 | VpcPeeringConnection |
| EC2 | Instance |
| EC2 | AccountAttribute |
| EC2 | Address |
| EC2 | CreateVolumePermission |
| EC2 | EbsEncryptionByDefault |
| EC2 | FlowLog |
| EC2 | Image |
| EC2 | InstanceStatus |
| EC2 | InstanceTypeInfo |
| EC2 | NetworkAcl |
| EC2 | NetworkInterface |
| EC2 | Region |
| EC2 | Reservation |
| EC2 | RouteTable |
| EC2 | SecurityGroup |
| ECR | Image |
| ECR | Repository |
| ECR | RepositoryPolicy |
| ECS | TaskDefinition |
| ECS | ServiceArn |
| ECS | Service |
| ECS | ClusterArn |
| ECS | TaskDefinitionTags |
| ECS | TaskDefinitionArn |
| EFS | FileSystemDescription |
| EFS | MountTargetDescription |
| EKS | Cluster |
| EKS | Nodegroup |
| EKS | NodegroupName |
| EKS | ClusterName |
| EMR | Cluster |
| ElasticBeanstalk | ConfigurationSettingsDescription |
| ElasticBeanstalk | EnvironmentDescription |
| ElasticLoadBalancing | LoadBalancerTags |
| ElasticLoadBalancing | LoadBalancer |
| ElasticLoadBalancing | LoadBalancerAttributes |
| ElasticLoadBalancing | LoadBalancerPolicy |
| ElasticLoadBalancingV2 | LoadBalancerTags |
| ElasticLoadBalancingV2 | Rule |
| ElasticLoadBalancingV2 | TargetGroup |
| ElasticLoadBalancingV2 | TargetHealthDescription |
| ElasticLoadBalancingV2 | LoadBalancer |
| ElasticLoadBalancingV2 | Listener |
| ElasticLoadBalancingV2 | LoadBalancerAttribute |
| Elasticsearch | DomainInfo |
| Elasticsearch | DomainStatus |
| Elasticsearch | DomainTags |
| GuardDuty | DetectorId |
| Iam | AccountAlias |
| Iam | AttachedPolicyType |
| Iam | CredentialReport |
| Iam | Group |
| Iam | InstanceProfile |
| Iam | MFADevice |
| Iam | PasswordPolicy |
| Iam | ServerCertificateMetadata |
| Iam | SummaryMap |
| Iam | User |
| Iam | UserPolicies |
| Iam | VirtualMFADevice |
| Iam | ManagedPolicy |
| Iam | ManagedPolicy |
| Iam | AccessKeyLastUsed |
| Iam | AccessKeyMetadata |
| Iam | PolicyVersion |
| Iam | PolicyVersion |
| Internal | Iam_EntitiesForPolicy |
| Internal | Iam_EntitiesForPolicy |
| Internal | AwsSecurityConnector |
| KMS | KeyPolicyName |
| KMS | KeyRotationStatus |
| KMS | KeyTags |
| KMS | KeyPolicy |
| KMS | KeyMetadata |
| KMS | KeyListEntry |
| KMS| AliasListEntry |
| Lambda | FunctionCodeLocation |
| Lambda | FunctionConfiguration|
| Lambda | FunctionPolicy |
| Lambda | FunctionTags |
| Macie2 | JobSummary |
| Macie2 | MacieStatus |
| NetworkFirewall | Firewall |
| NetworkFirewall | FirewallMetadata |
| NetworkFirewall | FirewallPolicy |
| NetworkFirewall | FirewallPolicyMetadata |
| NetworkFirewall | RuleGroup |
| NetworkFirewall | RuleGroupMetadata |
| RDS | ExportTask |
| RDS | DBClusterSnapshot |
| RDS | DBSnapshot |
| RDS | DBSnapshotAttributesResult |
| RDS | EventSubscription |
| RDS | DBCluster |
| RDS | DBInstance |
| RDS | DBClusterSnapshotAttributesResult |
| RedShift | LoggingStatus |
| RedShift | Parameter |
| Redshift | Cluster |
| Route53 | HostedZone |
| Route53 | ResourceRecordSet |
| Route53Domains | DomainSummary |
| S3 | S3Region |
| S3 | S3BucketTags |
| S3 | S3Bucket |
| S3 | BucketPolicy |
| S3 | BucketEncryption |
| S3 | BucketPublicAccessBlockConfiguration |
| S3 | BucketVersioning |
| S3 | LifecycleConfiguration |
| S3 | PolicyStatus |
| S3 | ReplicationConfiguration |
| S3 | S3AccessControlList |
| S3 | S3BucketLoggingConfig |
| S3Control | PublicAccessBlockConfiguration |
| SNS | Subscription |
| SNS | Topic |
| SNS | TopicAttributes |
| SNS | TopicTags |
| SQS | Queue |
| SQS | QueueAttributes |
| SQS | QueueTags |
| SageMaker | NotebookInstanceSummary |
| SageMaker | DescribeNotebookInstanceTags |
| SageMaker | DescribeNotebookInstanceResponse |
| SecretsManager | SecretResourcePolicy |
| SecretsManager | SecretListEntry |
| SecretsManager | DescribeSecretResponse |
| SimpleSystemsManagement | ParameterMetadata |
| SimpleSystemsManagement | ParameterTags |
| SimpleSystemsManagement | ResourceComplianceSummary |
| SimpleSystemsManagement | InstanceInformation |
| WAF | LoggingConfiguration |
| WAF | WebACL |
| WAF | WebACLSummary |
| WAFV2 | ApplicationLoadBalancerForWebACL |
| WAFV2 | WebACLSummary |

## Resource types supported in GCP

| Provider Namespace | Resource Type Name |
|----|----|
| ApiKeys | Key |
| ArtifactRegistry | Image |
| ArtifactRegistry | Repository |
| ArtifactRegistry | RepositoryPolicy |
| Bigquery | Dataset |
| Bigquery | DatasetData |
| Bigquery | Table |
| Bigquery | TablePolicy |
| Bigquery | TablesData |
| CloudKMS | CryptoKey |
| CloudKMS | CryptoKeyPolicy |
| CloudKMS | KeyRing |
| CloudKMS | KeyRingPolicy |
| CloudResourceManager | Project |
| CloudResourceManager | Ancestor |
| CloudResourceManager | AncestorPolicy |
| CloudResourceManager | EffectiveOrgPolicy |
| CloudResourceManager | Folder |
| CloudResourceManager | FolderPolicy |
| CloudResourceManager | Organization |
| CloudResourceManager | OrganizationPolicy |
| CloudResourceManager | Policy |
| Compute | Instance |
| Compute | BackendService |
| Compute | BackendService |
| Compute | Disk |
| Compute | EffectiveFirewalls |
| Compute | Firewall |
| Compute | ForwardingRule |
| Compute | GlobalForwardingRule |
| Compute | InstanceGroup |
| Compute | InstanceGroupInstance |
| Compute | InstanceGroupManager |
| Compute | InstanceGroupManager |
| Compute | InstanceTemplate |
| Compute | MachineType |
| Compute | ManagedInstance |
| Compute | ManagedInstance |
| Compute | Network |
| Compute | NetworkEffectiveFirewalls |
| Compute | Project |
| Compute | SslPolicy |
| Compute | Subnetwork |
| Compute | TargetHttpProxy |
| Compute | TargetHttpsProxy |
| Compute | TargetPool |
| Compute | TargetSslProxy |
| Compute | TargetTcpProxy |
| Compute | UrlMap |
| Container | Cluster |
| Dns | ManagedZone |
| Dns | Policy |
| IAM | OrganizationRole |
| IAM | ProjectRole |
| IAM | Role |
| IAM | ServiceAccount |
| IAM | ServiceAccountKey |
| Internal | GcpSecurityConnector |
| Logging | AncestorLogSink |
| Logging | LogEntry |
| Logging | LogMetric |
| Logging | LogSink |
| Monitoring | AlertPolicy |
| OsConfig | OSPolicyAssignment |
| OsConfig | OSPolicyAssignmentReport |
| SQLAdmin | DatabaseInstance |
| SecretManager | Secret |
| SecretManager | SecretPolicy |
| Storage | Bucket |
| Storage | BucketPolicy |

## Learn More

- Review the [features supported in Azure cloud environments](support-matrix-cloud-environment.md) for information on commercial and national cloud coverage.
- Watch [Predict future security incidents! Cloud Security Posture Management with Microsoft Defender](https://www.youtube.com/watch?v=jF3NSR_OepI).
- Learn about [security standards and recommendations](security-policy-concept.md).
- Learn about [secure score](secure-score-security-controls.md).
