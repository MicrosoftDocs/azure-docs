---
title: Manage assessments and standards
description: Learn how to create custom security assessments and standards for your multicloud environment.
ms.topic: how-to
ms.date: 08/07/2022
---

# Manage assessments and standards

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. Security teams can either use the readily available regulatory standards like GCP CIS 1.1.0, GCP CIS 1.2.0, or AWS CIS 1.2.0, AWS Foundational Security Best Practices, AWS PCI DSS 3.2.1. If you want, you can create your own custom standards, and assessments to meet specific internal requirements.

There are three types of resources that are needed to create and manage custom assessments:

- Assessment:
    - assessment details such as name, description, severity, remediation logic, etc.
    - assessment logic in KQL
    - the standard it belongs to
- Standard: defines a set of assessments
- Standard assignment: defines the scope, which the standard will evaluate. For example, specific AWS account/s.

You can either use the built-in regulatory compliance standard or create your own custom standards and assessments.

## Assign built in and custom compliance standard to your GCP project

### Assign a built-in regulatory compliance standard to your GCP project

**To assign a built-in regulatory compliance standard GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-standard.png" alt-text="Screenshot that shows you where to navigate to, to add a GCP standard.":::

1. Select a built-in standard from the drop-down menu.

     :::image type="content" source="media/how-to-manage-assessments-standards/drop-down-menu.png" alt-text="Screenshot that shows you the standard options you can choose from the drop-down menu.":::

1. Select **Save**.

### Create a new custom standard for your GCP project

**To create a new custom standard for your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Standard**.

1. Select **New standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/new-gcp-standard.png" alt-text="Screenshot that shows you where to select a new GCP standard.":::

1. Enter a name, description and select which assessments you want to add.

1. Select **Save**.

## Assign built in and custom compliance standard to your AWS account

### Assign a built-in regulatory compliance standard to your AWS account

**To assign a built-in regulatory compliance standard to your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Standards** > **Add** > **Standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/aws-standard.png" alt-text="Screenshot that shows you where to navigate to, to add a GCP standard.":::

1. Select a built-in standard from the drop-down menu.

1. Select **Save**.

### Create a new custom standard for your AWS account

**To create a new custom standard for your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Standards** > **Add** > **Standard**.

1. Select **New standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/new-gcp-standard.png" alt-text="Screenshot that shows you where to select a new AWS standard.":::

1. Enter a name, description and select which assessments you want to add.

1. Select **Save**.

## Assign built-in and custom assessments to your GCP project

### Assign a built-in assessment to your GCP project

**To assign a built-in assessment to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Assessment**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-assessment.png" alt-text="Screenshot that shows where to navigate to, to select GCP assessment.":::

1. Select **Existing assessment**.

1. Select all relevant assessments from the drop-down menu.

1. Select the standards from the drop-down menu.

1. Select **Save**.

### Assign a custom assessment to your GCP project

**To assign a custom assessment to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Assessment**.

1. Select **New assessment (preview)**.

    :::image type="content" source="media/how-to-manage-assessments-standards/new-assessment.png" alt-text="Screenshot of the new assessment screen for a GCP project.":::

1. In the general section, enter a name and severity.

1. In the query section, select an assessment template from the drop-down menu, or use the following query schema: 

    For example:

    **Ensure that Cloud Storage buckets have uniform bucket-level access enabled**

    ```Bash
    let UnhealthyBuckets = Storage_Bucket 
      extend RetentionPolicy = Record.retentionPolicy 
      where isnull(RetentionPolicy) or isnull(RetentionPolicy.isLocked) or tobool(RetentionPolicy.isLocked)==false 
      project BucketName = RecordIdentifierInfo.CloudNativeResourceName; Logging_LogSink 
      extend Destination = split(Record.destination,'/')[0] 
      where Destination == 'storage.googleapis.com' 
      extend LogBucketName = split(Record.destination,'/')[1] 
      extend HealthStatus = iff(LogBucketName in(UnhealthyBuckets), 'UNHEALTHY', 'HEALTHY')"
    ```

    See the [how to build a query](#how-to-build-a-query) section for more examples.

## Assign built-in and custom assessments to your AWS account

### Assign a built-in assessment to your AWS account

**To assign a built-in assessment to your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Standards** > **Add** > **Assessment**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-assessment.png" alt-text="Screenshot that shows where to navigate to, to select an AWS assessment.":::

1. Select **Existing assessment**.

1. Select all relevant assessments from the drop-down menu.

1. Select the standards from the drop-down menu.

1. Select **Save**.

### Assign a custom assessment to your AWS account

**To assign a custom assessment to your AWS account**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant AWS account.

1. Select **Standards** > **Add** > **Assessment**.

1. Select **New assessment (preview)**.

    :::image type="content" source="media/how-to-manage-assessments-standards/new-aws-assessment.png" alt-text="Screenshot of the adding a new assessment screen for your AWS account.":::

1. Enter a name, severity and select an assessment from the drop-down menu.

1. Enter a KQL query will define the assessment logic.

    If you’d like to create a new query, select the ‘[Azure Data Explorer](https://dataexplorer.azure.com/clusters/securitydatastoreus.centralus/databases/DiscoveryMockDataAws)’ link. The explorer will contain mock data on all of the supported native APIs. The data will appear in the same structure as contracted in the API.

    :::image type="content" source="media/how-to-manage-assessments-standards/azure-data-explorer.png" alt-text="Screenshot that shows where to select to select the Azure Data Explorer link.":::

    See the [how to build a query](#how-to-build-a-query) section for more examples.

1. Select the standards to add to this assessment to.

1. Select **Save**.

## How to build a query

The last row of the query should return all the original columns (don’t use ‘project’, ‘project-away). End the query with an if statement that defines the healthy or unhealthy conditions: `| extend HealthStatus = iff([boolean-logic-here], 'UNHEALTHY','HEALTHY')`.

### Sample GCP queries

**Ensure that Cloud Storage buckets have uniform bucket-level access enabled**

```bash
let UnhealthyBuckets = Storage_Bucket 
| extend RetentionPolicy = Record.retentionPolicy 
| where isnull(RetentionPolicy) or isnull(RetentionPolicy.isLocked) or tobool(RetentionPolicy.isLocked)==false 
| project BucketName = RecordIdentifierInfo.CloudNativeResourceName; Logging_LogSink 
| extend Destination = split(Record.destination,'/')[0] 
| where Destination == 'storage.googleapis.com' 
| extend LogBucketName = split(Record.destination,'/')[1] 
| extend HealthStatus = iff(LogBucketName in(UnhealthyBuckets), 'UNHEALTHY', 'HEALTHY')"
```

**Ensure VM disks for critical VMs are encrypted**

```bash
Compute_Disk 
| extend DiskEncryptionKey = Record.diskEncryptionKey 
| extend IsVmNotEncrypted = isempty(tostring(DiskEncryptionKey.sha256)) 
| extend HealthStatus = iff(IsVmNotEncrypted ,'UNHEALTHY' ,'HEALTHY')"
```

**Ensure Compute instances are launched with Shielded VM enabled**

```bash
Compute_Instance 
| extend InstanceName = tostring(Record.id)  
| extend ShieldedVmExist = tostring(Record.shieldedInstanceConfig.enableIntegrityMonitoring) =~ 'true' and tostring(Record.shieldedInstanceConfig.enableVtpm) =~ 'true' 
| extend HealthStatus = iff(ShieldedVmExist, 'HEALTHY', 'UNHEALTHY')"
```

You can use the following links to learn more about Kusto queries:
- [KQL quick reference](/azure/data-explorer/kql-quick-reference)
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL](https://azurecloudai.blog/2021/11/17/must-learn-kql-part-1-tools-and-resources/)

### Sample AWS KQL queries

When building a KQL query, you should use the following table structure:

```bash
- TimeStamp
                 2021-10-07T10:30:21.403732Z
        - SdksInfo
          {
                 "AWSSDK.EC2": "3.7.5.2"
          }

      - RecordProviderInfo
         {
                "CloudName": "AWS",
                 "CspmDiscoveryCloudRoleArn": "arn:aws:iam::123456789123:role/CSPMMonitoring",
                 "Type": "MultiCloudDiscoveryServiceDataCollector",
                 "HierarchyIdentifier": "123456789123",
                 "ConnectorId": "b3113210-63f9-43c5-a6a7-f14a2a5b3cd0"
           }
      - RecordOrganizationInfo
          {
                 "Type": "MyOrganization",
                 "TenantId": "bda8bc53-d9f8-4248-b9a9-3a6c7fe0b92f",
                 "SubscriptionId": "69444886-de6b-40c5-8b43-065f739fffb9",
                 "ResourceGroupName": "MyResourceGroupName"
           }

     - CorrelationId
        4f5e50e1d92c400caf507036a1237c72
    - RecordRegionalInfo
        {
                "Type": "MultiCloudRegion",
                "RegionUniqueName": "eu-west-2",
                "RegionDisplayName": "EU West (London)",
                "IsGlobalForRecord": false
        }

     - RecordIdentifierInfo
        {
               "Type": "MultiCloudDiscoveryServiceDataCollector",
                "RecordNativeCloudUniqueIdentifier": "arn:aws:ec2:eu-west-2:123456789123:elastic-ip/eipalloc-1234abcd5678efef9",
                "RecordAzureUniqueIdentifier": "/subscriptions/69444886-de6b-40c5-8b43-065f739fffb9/resourcegroups/MyResourceGroupName/providers/Microsoft.Security/securityconnectors/b3113210-63f9-43c5-a6a7-f14a2a5b3cd0/securityentitydata/aws-ec2-elastic-ip-eipalloc-1234abcd5678efef9-eu-west-2",
                "RecordIdentifier": "eipalloc-1234abcd5678efef9-eu-west-2",
                "ResourceProvider": "EC2",
                "ResourceType": "elastic-ip"
         }
      - Record
         {
               "AllocationId": "eipalloc-1234abcd5678efef9",
              "AssociationId": "eipassoc-234abcd5678efef90",
              "CarrierIp": null,
              "CustomerOwnedIp": null,
              "CustomerOwnedIpv4Pool": null,
              "Domain": {
                             "Value": "vpc"
               },
               "InstanceId": "i-0a8fcc00493c4625d",
               "NetworkBorderGroup": "eu-west-2",
               "NetworkInterfaceId": "eni-34abcd5678efef901",
               "NetworkInterfaceOwnerId": "123456789123",
               "PrivateIpAddress": "172.31.21.88",
               "PublicIp": "19.218.211.431",
               "PublicIpv4Pool": "amazon",
                "Tags": [
                            {
                                           "Value": "arn:aws:cloudformation:eu-west-2:123456789123:stack/awseb-e-sjuh4tkr7a-stack/4ff15da0-2512-11ec-ab59-023b28e97f64",
                                            "Key": "aws:cloudformation:stack-id"
                            },
                            {
                                           "Value": "e-sjuh4tkr7a",
                                            "Key": "elasticbeanstalk:environment-id"
                            },
                            {
                                           "Value": "AWSEBEIP",
                                           "Key": "aws:cloudformation:logical-id"
                            },
                            {
                                           "Value": "awseb-e-sjuh4tkr7a-stack",
                                            "Key": "aws:cloudformation:stack-name"
                            },
                            {
                                           "Value": "Mebrennetest3-env",
                                            "Key": "elasticbeanstalk:environment-name"
                             },
                             {
                                            "Value": "Mebrennetest3-env",
                                             "Key": "Name"
                             }
                        ]
                 }
```

> [!NOTE
> The `Record` field contains the data structure as it is returned from the AWS API. Use this field to define conditions which will determine if the resource is healthy or unhealthy.
>
> You can access internal properties of `Record` filed using a dot notation. For example: `| extend EncryptionType = Record.Encryption.Type`.

**Stopped EC2 instances should be removed after a specified time period**
         
```bash
EC2_Instance
| extend State = tolower(tostring(Record.State.Name.Value))
| extend StoppedTime = todatetime(tostring(Record.StateTransitionReason))
| extend HealthStatus = iff(not(State == 'stopped' and StoppedTime < ago(30d)), 'HEALTHY', 'UNHEALTHY')
```

**EC2 subnets should not automatically assign public IP addresses**
         

```bash
EC2_Subnet
| extend MapPublicIpOnLaunch = tolower(tostring(Record.MapPublicIpOnLaunch))
| extend HealthStatus = iff(MapPublicIpOnLaunch == 'false' ,'HEALTHY', 'UNHEALTHY')
```

**EC2 instances should not use multiple ENIs**
         
```bash
EC2_Instance
| extend NetworkInterfaces = parse_json(Record)['NetworkInterfaces']
| extend NetworkInterfaceCount = array_length(parse_json(NetworkInterfaces))
| extend HealthStatus = iff(NetworkInterfaceCount == 1 ,'HEALTHY', 'UNHEALTHY')
```

You can use the following links to learn more about Kusto queries:
- [KQL quick reference](/azure/data-explorer/kql-quick-reference)
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL](https://azurecloudai.blog/2021/11/17/must-learn-kql-part-1-tools-and-resources/)

## Next steps

In this article, you learned how to manage your assessments and standards in Defender for Cloud.

> [!div class="nextstepaction"]
> [Find recommendations that can improve your security posture](review-security-recommendations.md)