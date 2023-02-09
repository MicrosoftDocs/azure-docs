---
title: Ingest CloudWatch logs to Microsoft Sentinel - create a Lambda function to send CloudWatch events to S3 bucket
description: In this article, you create a Lambda function to send CloudWatch events to an S3 bucket.
author: limwainstein
ms.author: lwainstein
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 02/09/2023
#Customer intent: As a security operator, I want to create a Lambda function to send CloudWatch events to S3 bucket so I can convert the format to the gzipped CSV without a header.  
---

# Create a Lambda function to send CloudWatch events to an S3 bucket

In this article, you use a [Lambda function](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/CloudWatchLanbdaFunction.py). You use the Lambda function within the Amazon Web Services (AWS) environment to send [CloudWatch events to an S3 bucket](connect-aws.md), and convert the format to the gzipped CSV format without a header.  

## Create the Lambda function 

The Lambda function uses Python 3.9 runtime and x86_64 architecture. 

1. In the AWS Management Console, select the Lambda service.
1. Select **Create function**. 

    TBD - screenshot

1. Type a name for the function and select **Python 3.9** as the runtime and **x86_64** as the architecture. 
1. Select **Create function**. 
1. Under **Layers**, select **Add layer** and select **Add**.
1. Select **Permissions**, and under **Execution role**, select **Role name**.
1. Under **Permissions policies**, select **Add permissions** > **Attach policies**. 

    TBD - screenshot

1. Search for the *AmazonS3FullAccess* and *CloudWatchLogsReadOnlyAccess* policies and attach them.

    TBD - screenshot

1. Copy the code link from the [source file](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/CloudWatchLanbdaFunction.py). 
1. Return to the function, select **Code**, and paste the code link under **Code source**. 
1. Fill the parameters as required. 
1. Select **Deploy**, and then select **Test**.
1. Create an event by filling in the required fields.

    TBD - Screenshot

1. Select **Test** to see how the event appears in the S3 bucket. 


## Next steps

In this document, you learned how to create a Lambda function to send CloudWatch events to an S3 bucket. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.