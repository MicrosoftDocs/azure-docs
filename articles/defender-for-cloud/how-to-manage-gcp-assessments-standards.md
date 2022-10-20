---
title: Manage GCP assessments and standards
titleSuffix: Defender for Cloud
description: Learn how to create custom security assessments and standards for your GCP environment.
ms.topic: how-to
ms.date: 10/18/2022
---

# Manage GCP assessments and standards

Security standards contain comprehensive sets of security recommendations to help secure your cloud environments. Security teams can use the readily available regulatory standards such as GCP CIS 1.1.0, GCP CIS and 1.2.0, or create custom standards and assessments to meet specific internal requirements.

There are three types of resources that are needed to create and manage custom assessments:

- Assessment:
    - assessment details such as name, description, severity, remediation logic, etc.
    - assessment logic in KQL
    - the standard it belongs to
- Standard: defines a set of assessments
- Standard assignment: defines the scope, which the standard will evaluate. For example, specific GCP projects.

You can either use the built-in compliance standards or create your own custom standards and assessments.

## Assign a built-in compliance standard to your GCP project

**To assign a built-in compliance standard to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Standard**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-standard.png" alt-text="Screenshot that shows you where to navigate to, to add a GCP standard." lightbox="media/how-to-manage-assessments-standards/gcp-standard-zoom.png":::

1. Select a built-in standard from the drop-down menu.

    :::image type="content" source="media/how-to-manage-assessments-standards/drop-down-menu.png" alt-text="Screenshot that shows you the standard options you can choose from the drop-down menu." lightbox="media/how-to-manage-assessments-standards/drop-down-menu.png":::

1. Select **Save**.

## Create a new custom standard for your GCP project

**To create a new custom standard for your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Standard**.

1. Select **New standard**.

1. Enter a name, description and select which assessments you want to add.

1. Select **Save**.

## Assign a built-in assessment to your GCP project

**To assign a built-in assessment to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Assessment**.

    :::image type="content" source="media/how-to-manage-assessments-standards/gcp-assessment.png" alt-text="Screenshot that shows where to navigate to, to select GCP assessment." lightbox="media/how-to-manage-assessments-standards/gcp-assessment.png":::

1. Select **Existing assessment**.

1. Select all relevant assessments from the drop-down menu.

1. Select the standards from the drop-down menu.

1. Select **Save**.

## Create a new custom assessment for your GCP project

**To create a new custom assessment to your GCP project**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant GCP project.

1. Select **Standards** > **Add** > **Assessment**.

1. Select **New assessment (preview)**.

    :::image type="content" source="media/how-to-manage-assessments-standards/new-assessment.png" alt-text="Screenshot of the new assessment screen for a GCP project." lightbox="media/how-to-manage-assessments-standards/new-assessment.png":::

1. In the general section, enter a name and severity.

1. In the query section, select an assessment template from the drop-down menu, or use the following query schema: 

    For example:

    **Ensure that Cloud Storage buckets have uniform bucket-level access enabled**

    ```kusto
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

    1. Select **Save**.

## How to build a query

The last row of the query should return all the original columns (don’t use ‘project’, ‘project-away). End the query with an iff statement that defines the healthy or unhealthy conditions: `| extend HealthStatus = iff([boolean-logic-here], 'UNHEALTHY','HEALTHY')`.

### Sample KQL queries

**Ensure that Cloud Storage buckets have uniform bucket-level access enabled**

```kusto
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

```kusto
Compute_Disk 
| extend DiskEncryptionKey = Record.diskEncryptionKey 
| extend IsVmNotEncrypted = isempty(tostring(DiskEncryptionKey.sha256)) 
| extend HealthStatus = iff(IsVmNotEncrypted ,'UNHEALTHY' ,'HEALTHY')"
```

**Ensure Compute instances are launched with Shielded VM enabled**

```kusto
Compute_Instance 
| extend InstanceName = tostring(Record.id)  
| extend ShieldedVmExist = tostring(Record.shieldedInstanceConfig.enableIntegrityMonitoring) =~ 'true' and tostring(Record.shieldedInstanceConfig.enableVtpm) =~ 'true' 
| extend HealthStatus = iff(ShieldedVmExist, 'HEALTHY', 'UNHEALTHY')"
```

You can use the following links to learn more about Kusto queries:
- [KQL quick reference](/azure/data-explorer/kql-quick-reference)
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL](https://azurecloudai.blog/2021/11/17/must-learn-kql-part-1-tools-and-resources/)

## Next steps

In this article, you learned how to manage your assessments and standards in Defender for Cloud.

> [!div class="nextstepaction"]
> [Find recommendations that can improve your security posture](review-security-recommendations.md)