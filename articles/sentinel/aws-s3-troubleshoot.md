---
title: Troubleshoot AWS S3 connector issues - Microsoft Sentinel
description: Troubleshoot AWS S3 connector issues in Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: troubleshooting
ms.date: 09/08/2022
#Customer intent: As a security operator, I want to quickly identify the cause of the problem occurring with the AWS S3 connector so I can find the steps needed to resolve the problem.
---

# Troubleshoot AWS S3 connector issues

The Amazon Web Services (AWS) S3 connector allows you to ingest AWS service logs, collected in AWS S3 buckets, to Microsoft Sentinel. The types of logs we currently support are AWS CloudTrail, VPC Flow Logs, and AWS GuardDuty. 

This article describes how to quickly identify the cause of issues occurring with the AWS S3 connector so you can find the steps needed to resolve the issues.

Learn how to [connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](connect-aws.md?tabs=s3). 

## Microsoft Sentinel doesn’t receive data from the Amazon Web Services S3 connector or one of its data types 

The logs for the AWS S3 connector (or one of its data types) aren’t visible in the Microsoft Sentinel workspace for more than 30 minutes after the connector was connected. 

Before you search for a cause and solution, review these considerations:

- It can take around 20-30 minutes from the moment the connector is connected until data is ingested into the workspace. 
- The connector's connection status indicates that a collection rule exists; it doesn't indicate that data was ingested. If the status of the Amazon Web Services S3 connector is green, there's a collection rule for one of the data types, but still no data. 

### Determine the cause of your problem

In this section, we cover these causes: 

1. The AWS S3 connector permissions policies aren't set properly. 
1. The data isn't ingested to the S3 bucket in AWS. 
1. The Amazon Simple Queue Service (SQS) in the AWS cloud doesn't receive notifications from the S3 bucket. 
1. The data cannot be read from the SQS/S3 in the AWS cloud. With GuardDuty logs, the issue is caused by wrong KMS permissions. 

### Cause 1: The AWS S3 connector permissions policies aren't set properly

This issue is caused by incorrect permissions in the AWS environment. 

### Create permissions policies

You need permissions policies to deploy the AWS S3 data connector. Review the [required permissions](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPolicies.md) and set the relevant permissions.

## Cause 2: The relevant data doesn't exist in the S3 bucket

The relevant logs don't exist in the S3 bucket. 

### Solution: Search for logs and export logs if needed

1. In AWS, open the S3 bucket, search for the relevant folder according to the required logs, and check if there are any log files inside the folder.
1. If the data doesn't exist, there’s an issue with the AWS configuration. In this case, you need to [configure an AWS service to export logs to an S3 bucket](connect-aws.md?tabs=s3#configure-an-aws-service-to-export-logs-to-an-s3-bucket).

### Cause 3: The S3 data didn't arrive at the SQS 

The data wasn't successfully transferred from S3 to the SQS.

### Solution: Verify that the data arrived and configure event notifications

1. In AWS, open the relevant SQS. 
1. In the **Monitoring** tab, you should see traffic in the **Number Of Messages Sent** widget. If there's no traffic in the SQS, there's an AWS configuration problem. 
1. Make sure that the event notifications definition for the SQS includes the correct data filters (prefix and suffix). 
    1. To see the event notifications, in the S3 bucket, select the **Properties** tab, and locate the **Event notifications** section. 
    1. If you can’t see this section, create it. 
    1. Make sure that the SQS has the relevant policies to get the data from the S3 bucket. The SQS must contain this policy in the **Access policy** tab.

### Cause 4: The SQS didn't read the data

The SQS didn't successfully read the S3 data.

### Solution: Verify that the SQS reads the data

1. In AWS, open the relevant SQS. 
1. In the **Monitoring** tab, you should see traffic in the **Number Of Messages Deleted** and **Number Of Messages Received** widgets. 
1. One spike of data isn't enough. Wait until there's enough data (several spikes), and then check for issues.
1. If at least one of the widgets is empty, check the health logs by running this query:

    ```kusto
    SentinelHealth 
    | where TimeGenerated > ago(1d)
    | where SentinelResourceKind in ('AmazonWebServicesCloudTrail', 'AmazonWebServicesS3')
    | where OperationName == 'Data fetch failure summary'
    | mv-expand TypeOfFailureDuringHour = ExtendedProperties["FailureSummary"]
    | extend StatusCode = TypeOfFailureDuringHour["StatusCode"]
    | extend StatusMessage = TypeOfFailureDuringHour["StatusMessage"]
    | project SentinelResourceKind, SentinelResourceName, StatusCode, StatusMessage, SentinelResourceId, TypeOfFailureDuringHour, ExtendedProperties
    ```
1. Make sure that the health feature is enabled:
    ```kusto
    SentinelHealth 
    | take 20
    ```
1. If the health feature isn’t enabled, [enable it](enable-monitoring.md).

## Data from the AWS S3 connector (or one of its data types) is seen in Microsoft Sentinel with a delay of more than 30 minutes  

This issue usually happens when Microsoft can’t read files in the S3 folder. Microsoft can't read the files because they're either encrypted or in the wrong format. In these cases, many retries eventually cause ingestion delay. 

### Determine the cause of your problem

In this section, we cover these causes: 
- Log encryption isn't set up correctly
- Event notifications aren't defined correctly
- Health errors or health disabled

### Cause 1: Log encryption isn't set up correctly

If the logs are fully or partially encrypted by the Key Management Service (KMS), Microsoft Sentinel might not have permission for this KMS to decrypt the files.

### Solution: Check log encryption

Make sure that Microsoft Sentinel has permission for this KMS to decrypt the files. Review the [required KMS permissions](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/AwsRequiredPolicies.md#sqs-policy) for the GuardDuty and CloudTrail logs.

### Cause 2: Event notifications aren't configured correctly

When you configure an Amazon S3 event notification, you must specify which supported event types Amazon S3 should send the notification to. If an event type that you didn't specify exists in your Amazon S3 bucket, Amazon S3 doesn't send the notification. 

### Solution: Verify that event notifications are defined properly

To verify that the event notifications from S3 to the SQS are defined properly, check that:

- The notification is defined from the specific folder that includes the logs, and not from the main folder that contains the bucket.
- The notification is defined with the *.gz* suffix. For example:  

### Cause 3: Health errors or health disabled

There might be errors in the health logs, or the health feature might not be enabled.

### Solution: Verify that there are no errors in the health logs and enable health

1. Verify that there are no errors in the health logs by running this query:

    ```kusto
    SentinelHealth
    | where TimeGenerated between (ago(startTime)..ago(endTime))
    | where SentinelResourceKind  == "AmazonWebServicesS3"
    | where Status != "Success"
    | distinct TimeGenerated, OperationName, SentinelResourceName, Status, Description
    ```
1. Make sure that the health feature is enabled:

    ```kusto
    SentinelHealth 
    | take 20
    ```

1. If the health feature isn’t enabled, [enable it](enable-monitoring.md).

## Next steps

In this article, you learned how to quickly identify causes and resolve common issues with the AWS S3 connector.

We welcome feedback, suggestions, requests for features, bug reports or improvements and additions. Go to the [Microsoft Sentinel  GitHub repository](https://github.com/Azure/Azure-Sentinel) to create an issue or fork and upload a contribution.