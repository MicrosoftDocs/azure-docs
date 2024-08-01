---
title: View multicloud inventory with the multicloud connector enabled by Azure Arc
description: View multicloud inventory with the multicloud connector enabled by Azure Arc
ms.topic: how-to
ms.date: 06/11/2024
---

# View multicloud inventory with the multicloud connector enabled by Azure Arc

The **Inventory** solution of the multicloud connector shows an up-to-date view of your resources from other public clouds in Azure, providing you with a single place to see all your cloud resources. Currently, AWS public cloud environments are supported.

> [!IMPORTANT]
> Multicloud connector enabled by Azure Arc is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

After you enable the **Inventory** solution, metadata from the assets in the source cloud is included with the asset representations in Azure. You can also apply Azure tags or Azure policies to these resources. This solution allows you to query for all your cloud resources through Azure Resource Graph, such as querying to find all Azure and AWS resources with a specific tag.

The **Inventory** solution scans your source cloud regularly to update the view represented in Azure. You can specify the interval to query when you [connect your public cloud](connect-to-aws.md) and configure the **Inventory** solution.

> [!TIP]
> At this time, we recommend that you don't use the multicloud connector **Inventory** solution with EC2 instances that have already been [connected to Azure Arc](../servers/deployment-options.md) and reside in a different subscription than your connector resource. Doing so will create a duplicate record of the EC2 instance in Azure.

## Supported AWS services

Today, resources associated with the following AWS services are scanned and represented in Azure. When you [create the **Inventory** solution](connect-to-aws.md#add-your-public-cloud-in-the-azure-portal), all available services are selected by default, but you can optionally include any services.

The following table shows the AWS services that are scanned, the resource types associated with each service, and the Azure namespace that corresponds to each resource type.

| AWS service  | AWS resource type  | Azure namespace |
|--------------|--------------------|--------------------------------------|
| API Gateway   | `apiGatewayRestApis`     | `Microsoft.AwsConnector/apiGatewayRestApis`|
| API Gateway   | `apiGatewayStages`     | `Microsoft.AwsConnector/apiGatewayStages`|
| Cloud Formation   | `cloudFormationStacks`     | `Microsoft.AwsConnector/cloudFormationStacks`|
| Cloud Formation   | `cloudFormationStackSets`     | `Microsoft.AwsConnector/cloudFormationStackSets`|
| Cloud Trail   | `cloudTrailTrails`     | `Microsoft.AwsConnector/cloudTrailTrails`|
| Cloud Watch   | `cloudWatchAlarms`     | `Microsoft.AwsConnector/cloudWatchAlarms`|
| Dynamo DB    | `dynamoDBTables`     | `Microsoft.AwsConnector/dynamoDBTables`|
| EC2    | `ec2Instances`    | `Microsoft.HybridCompute/machines/EC2InstanceId`, `Microsoft.AwsConnector/Ec2Instances`|
| EC2    | `ec2KeyPairs`    | `Microsoft.AwsConnector/ec2KeyPairs`|
| EC2    | `ec2Subnets`    | `Microsoft.AwsConnector/ec2Subnets`|
| EC2    | `ec2Volumes`   | `Microsoft.AwsConnector/ec2Volumes`|
| EC2    | `ec2VPCs`  | `Microsoft.AwsConnector/ec2VPCs`|
| EC2    | `ec2NetworkAcls`  | `Microsoft.AwsConnector/ec2NetworkAcls`|
| EC2    | `ec2NetworkInterfaces`| `Microsoft.AwsConnector/ec2NetworkInterfaces`|
| EC2    | `ec2RouteTables` | `Microsoft.AwsConnector/ec2RouteTables`|
| EC2    | `ec2VPCEndpoints` | `Microsoft.AwsConnector/ec2VPCEndpoints`|
| EC2    | `ec2VPCPeeringConnections` | `Microsoft.AwsConnector/ec2VPCPeeringConnections`|
| EC2    | `ec2InstanceStatuses` | `Microsoft.AwsConnector/ec2InstanceStatuses`|
| EC2    | `ec2SecurityGroups` | `Microsoft.AwsConnector/ec2SecurityGroups`|
| ECR   | `ecrRepositories`     | `Microsoft.AwsConnector/ecrRepositories`|
| ECS   | `ecsClusters`     | `Microsoft.AwsConnector/ecsClusters`|
| ECS   | `ecsServices`     | `Microsoft.AwsConnector/ecsServices`|
| ECS   | `ecsTaskDefinitions`     | `Microsoft.AwsConnector/ecsTaskDefinitions`|
| EFS   | `efsFileSystems`     | `Microsoft.AwsConnector/efsFileSystems`|
| EFS   | `efsMountTargets`     | `Microsoft.AwsConnector/efsMountTargets`|
| Elastic Beanstalk   | `elasticBeanstalkEnvironments`     | `Microsoft.AwsConnector/elasticBeanstalkEnvironments`|
| Elastic Load Balancer V2    | `elasticLoadBalancingV2LoadBalancers`| `Microsoft.AwsConnector/elasticLoadBalancingV2LoadBalancers`|
| Elastic Load Balancer V2    | `elasticLoadBalancingV2Listeners`| `Microsoft.AwsConnector/elasticLoadBalancingV2Listeners`|
| Elastic Load Balancer V2    | `elasticLoadBalancingV2TargetGroups`| `Microsoft.AwsConnector/elasticLoadBalancingV2TargetGroups`|
| Elastic Search   | `elasticsearchDomains` | `Microsoft.AwsConnector/elasticsearchDomains`|
| GuardDuty   | `guardDutyDetectors` | `Microsoft.AwsConnector/guardDutyDetectors`|
| IAM   | `iamGroups` | `Microsoft.AwsConnector/iamGroups`|
| IAM   | `iamManagedPolicies` | `Microsoft.AwsConnector/iamManagedPolicies`|
| IAM   | `iamServerCertificates` | `Microsoft.AwsConnector/iamServerCertificates`|
| IAM   | `iamUserPolicies` | `Microsoft.AwsConnector/iamUserPolicies`|
| IAM   | `iamVirtualMFADevices` | `Microsoft.AwsConnector/iamVirtualMFADevices`|
| KMS   | `kmsKeys` | `Microsoft.AwsConnector/kmsKeys`|
| Lambda   | `lambdaFunctions` | `Microsoft.AwsConnector/lambdaFunctions`|
| Lightsail   | `lightsailInstances` | `Microsoft.AwsConnector/lightsailInstances`|
| Lightsail   | `lightsailBuckets`| `Microsoft.AwsConnector/lightsailBuckets`|
| Logs   | `logsLogGroups` | `Microsoft.AwsConnector/logsLogGroups`|
| Logs   | `logsLogStreams` | `Microsoft.AwsConnector/logsLogStreams`|
| Logs   | `logsMetricFilters` | `Microsoft.AwsConnector/logsMetricFilters`|
| Logs   | `logsSubscriptionFilters` | `Microsoft.AwsConnector/logsSubscriptionFilters`|
| Macie   | `macieAllowLists` | `Microsoft.AwsConnector/macieAllowLists`|
| Network Firewalls   | `networkFirewallFirewalls` | `Microsoft.AwsConnector/networkFirewallFirewalls`|
| Network Firewalls   | `networkFirewallFirewallPolicies` | `Microsoft.AwsConnector/networkFirewallFirewallPolicies`|
| Network Firewalls   | `networkFirewallRuleGroups` | `Microsoft.AwsConnector/networkFirewallRuleGroups`|
| Organization   | `organizationsAccounts` | `Microsoft.AwsConnector/organizationsAccounts`|
| Organization   | `organizationsOrganizations` | `Microsoft.AwsConnector/organizationsOrganizations`|
| RDS   | `rdsDBInstances` | `Microsoft.AwsConnector/rdsDBInstances`|
| RDS   | `rdsDBClusters` | `Microsoft.AwsConnector/rdsDBClusters`|
| RDS   | `rdsEventSubscriptions` | `Microsoft.AwsConnector/rdsEventSubscriptions`|
| Redshift   | `redshiftClusters` | `Microsoft.AwsConnector/redshiftClusters`|
| Redshift   | `redshiftClusterParameterGroups` | `Microsoft.AwsConnector/redshiftClusterParameterGroups`|
| Route 53   | `route53HostedZones` | `Microsoft.AwsConnector/route53HostedZones`|
| SageMaker  | `sageMakerApps` | `Microsoft.AwsConnector/sageMakerApps`|
| SageMaker   | `sageMakerDevices` | `Microsoft.AwsConnector/sageMakerDevices`|
| SageMaker   | `sageMakerImages` | `Microsoft.AwsConnector/sageMakerImages`|
| S3   | `s3Buckets` | `Microsoft.AwsConnector/s3Buckets`|
| S3   | `s3BucketPolicies` | `Microsoft.AwsConnector/s3BucketPolicies`|
| S3   | `s3AccessPoints` | `Microsoft.AwsConnector/s3AccessPoints`|
| SNS   | `snsTopics` | `Microsoft.AwsConnector/snsTopics`|
| SQS   | `sqsQueues` | `Microsoft.AwsConnector/sqsQueues`|

## AWS resource representation in Azure

After you connect your AWS cloud and enable the **Inventory** solution, the multicloud connector creates a new resource group using the naming convention `aws_yourAwsAccountId`. Azure representations of your AWS resources are created in this resource group, using the `AwsConnector` namespace values described in the previous section. You can apply Azure tags and policies to these resources.

Resources that are discovered in AWS and projected in Azure are placed in Azure regions, using a [standard mapping scheme](resource-representation.md#region-mapping).

## Periodic sync options

The periodic sync time that you select when configuring the **Inventory** solution determines how often your AWS account is scanned and synced to Azure. By enabling periodic sync, changes to your AWS resources are reflected in Azure. For instance, if a resource is deleted in AWS, that resource is also deleted in Azure.

If you prefer, you can turn periodic sync off when configuring this solution. If you do so, your Azure representation may become out of sync with your AWS resources, as Azure won't be able to rescan and detect any changes.

## Querying for resources in Azure Resource Graph

[Azure Resource Graph](/azure/governance/resource-graph/overview) is an Azure service designed to extend Azure Resource Management by providing efficient and performant resource exploration. Running queries at scale across a given set of subscriptions helps you effectively govern your environment.

You can run queries using [Resource Graph Explorer](/azure/governance/resource-graph/first-query-portal) in the Azure portal. Some example queries for common scenarios are shown here.

### Query all onboarded multicloud asset inventories

```kusto
resources
| where subscriptionId == "<subscription ID>"
| where id contains "microsoft.awsconnector" 
| union (awsresources | where type == "microsoft.awsconnector/ec2instances" and subscriptionId =="<subscription ID>")
| extend awsTags= properties.awsTags, azureTags = ['tags']
| project subscriptionId, resourceGroup, type, id, awsTags, azureTags, properties 
```

### Query for all resources under a specific connector

```kusto
resources
| extend connectorId = tolower(tostring(properties.publicCloudConnectorsResourceId)), resourcesId=tolower(id)
| join kind=leftouter (
    awsresources
    | extend pccId = tolower(tostring(properties.publicCloudConnectorsResourceId)), awsresourcesId=tolower(id)
    | extend parentId = substring(awsresourcesId, 0, strlen(awsresourcesId) - strlen("/providers/microsoft.awsconnector/ec2instances/default"))
) on $left.resourcesId == $right.parentId
| where connectorId =~ "yourConnectorId" or pccId =~ "yourConnectorId"
| extend resourceType = tostring(split(iif (type =~ "microsoft.hybridcompute/machines", type1, type), "/")[1])
```

### Query for all virtual machines in Azure and AWS, along with their instance size

```kusto
resources 
| where (['type'] == "microsoft.compute/virtualmachines") 
| union (awsresources | where type == "microsoft.awsconnector/ec2instances")
| extend cloud=iff(type contains "ec2", "AWS", "Azure")
| extend awsTags=iff(type contains "microsoft.awsconnector", properties.awsTags, ""), azureTags=tags
| extend size=iff(type contains "microsoft.compute", properties.hardwareProfile.vmSize, properties.awsProperties.instanceType.value)
| project subscriptionId, cloud, resourceGroup, id, size, azureTags, awsTags, properties
```

### Query for all functions across Azure and AWS

```kusto
resources
| where (type == 'microsoft.web/sites' and ['kind'] contains 'functionapp') or type == "microsoft.awsconnector/lambdafunctionconfigurations"
| extend cloud=iff(type contains "awsconnector", "AWS", "Azure")
| extend functionName=iff(cloud=="Azure", properties.name,properties.awsProperties.functionName), state=iff(cloud=="Azure", properties.state, properties.awsProperties.state), lastModifiedTime=iff(cloud=="Azure", properties.lastModifiedTimeUtc,properties.awsProperties.lastModified), location=iff(cloud=="Azure", location,properties.awsRegion),  tags=iff(cloud=="Azure", tags, properties.awsTags)
| project cloud, functionName, lastModifiedTime, location, tags
```

### Query for all resources with a certain tag

```kusto
resources 
| extend awsTags=iff(type contains "microsoft.awsconnector", properties.awsTags, ""), azureTags=tags 
| where awsTags contains "<yourTagValue>" or azureTags contains "<yourTagValue>" 
| project subscriptionId, resourceGroup, name, azureTags, awsTags
```

## Next steps

- Learn about the [multicloud connector **Arc Onboarding** solution](onboard-multicloud-vms-arc.md).
- Learn more about [Azure Resource Graph](/azure/governance/resource-graph/overview).

