---
title: Ingest CloudWatch logs to Microsoft Sentinel - create a Lambda function to send CloudWatch events to S3 bucket
description: In this article, you create a Lambda function to send CloudWatch events to an S3 bucket.
author: limwainstein
ms.author: lwainstein
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 02/09/2023
#Customer intent: As a security operator, I want to create a Lambda function to send CloudWatch events to S3 bucket so I can convert the format to the format accepted by Microsoft Sentinel.  
---

# Create a Lambda function to send CloudWatch events to an S3 bucket

In some cases, your CloudWatch logs may not match the format accepted by Microsoft Sentinel - .csv file in a GZIP format without a header. In this article, you use a [lambda function](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/CloudWatchLambdaFunction.py) within the Amazon Web Services (AWS) environment to send [CloudWatch events to an S3 bucket](connect-aws.md), and convert the format to the accepted format. 

## Create the lambda function 

The lambda function uses Python 3.9 runtime and x86_64 architecture. 

1. In the AWS Management Console, select the lambda service.
1. Select **Create function**. 

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-basic-information.png" alt-text="Screenshot of the AWS Management Console Basic information screen." lightbox="media/cloudwatch-lambda-function/lambda-basic-information.png":::

1. Type a name for the function and select **Python 3.9** as the runtime and **x86_64** as the architecture. 
1. Select **Create function**. 
1. Under **Choose a layer**, select a layer and select **Add**.

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-add-layer.png" alt-text="Screenshot of the AWS Management Console Add layer screen." lightbox="media/cloudwatch-lambda-function/lambda-add-layer.png":::

1. Select **Permissions**, and under **Execution role**, select **Role name**.
1. Under **Permissions policies**, select **Add permissions** > **Attach policies**. 

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-permissions.png" alt-text="Screenshot of the AWS Management Console Permissions tab." lightbox="media/cloudwatch-lambda-function/lambda-permissions.png":::

1. Search for the *AmazonS3FullAccess* and *CloudWatchLogsReadOnlyAccess* policies and attach them.

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-other-permissions-policies.png" alt-text="Screenshot of the AWS Management Console Add permissions policies screen." lightbox="media/cloudwatch-lambda-function/lambda-other-permissions-policies.png":::

1. Copy the code link from the [source file](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/AWS-S3/CloudWatchLanbdaFunction.py). 
1. Return to the function, select **Code**, and paste the code link under **Code source**.

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-code-source.png" alt-text="Screenshot of the AWS Management Console Code source screen." lightbox="media/cloudwatch-lambda-function/lambda-code-source.png":::
 
1. Fill the parameters as required. 
1. Select **Deploy**, and then select **Test**.
1. Create an event by filling in the required fields.

    :::image type="content" source="media/cloudwatch-lambda-function/lambda-configure-test-event.png" alt-text="Screenshot of the AWS Management Configure test event screen." lightbox="media/cloudwatch-lambda-function/lambda-configure-test-event.png":::

1. Select **Test** to see how the event appears in the S3 bucket. 

## Next steps

In this document, you learned how to create a Lambda function to send CloudWatch events to an S3 bucket. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
