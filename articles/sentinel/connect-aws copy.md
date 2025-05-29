---
title: Set up your Amazon Web Services environment to collect AWS logs to Microsoft Sentinel
description: Set up your Amazon Web Services environment to send AWS logs to Microsoft Sentinel using one of the Microsoft Sentinel AWS connectors.
author: guywi-ms
ms.author: guywild
ms.topic: how-to
ms.date: 05/28/2025


#Customer intent: As an administrator, I want to set up my Amazon Web Services environment to send AWS logs to Microsoft Sentinel using one of the Microsoft Sentinel AWS connectors.

---

# Set up your Amazon Web Services environment to collect AWS logs to Microsoft Sentinel

Use Amazon Web Services (AWS) connectors to pull AWS service logs into Microsoft Sentinel. Setting up the connector establishes a trust relationship between Amazon Web Services and Microsoft Sentinel. 

This article describes the high-level flow of setting up your AWS environment to send log data to Microsoft Sentinel. Each of the AWS connectors provides different tools to set up the environment. 

## AWS environment setup overview

This graphic shows how to set up your AWS environment to send log data to Azure:

:::image type="content" source="media/connect-aws/s3-connector-architecture.png" alt-text="Screenshot of A W S S 3 connector architecture.":::

1. Create an **S3 (Simple Storage Service)** storage bucket and a **Simple Queue Service (SQS) queue** to which the S3 bucket publishes notifications when it receives new logs. 
   
   Microsoft Sentinel connectors:

   - Poll the SQS queue, at frequent intervals, for messages, which contain the paths to new log files.
   - Fetch the files from the S3 bucket based on the path specified in the SQS notifications.

1. Configure AWS services to send logs to the S3 bucket.
   
1. Create an **assumed role** to grant your Microsoft Sentinel connector permissions to access your AWS S3 bucket and SQS resources. 

   Assign the appropriate **IAM permissions policies** to grant the assumed role access to the resources.

1. Create an Open ID Connect (OIDC) **web identity provider** to authenticate Microsoft Sentinel connectors to AWS through OpenID Connect (OIDC).

   Microsoft Sentinel connectors use Microsoft Entra ID to authenticate with AWS through OpenID Connect (OIDC) and assume an AWS IAM role. 

   > [!IMPORTANT]
   > If you've already created an OIDC for Microsoft Defender for Cloud or another Microsoft service, use the same provider for Microsoft Sentinel. Do not create a new OIDC provider for Microsoft Sentinel.

1. Configure the Microsoft Sentinel connectors you need to use the assumed role and SQS queue you created to access the S3 bucket and retrieve logs.

## Find the AWS connector you need

Microsoft Sentinel provides several AWS connectors, each designed to collect logs from different AWS services. The following table lists the available connectors and the AWS services they support:

- [Amazon Web Services Web Application Firewall (WAF) connector](connect-aws-waf.md): Ingests AWS WAF logs, collected in AWS S3 buckets, to Microsoft Sentinel.
- [Amazon Web Services service log connector](connect-aws-service-logs.md): Ingests AWS service logs, collected in AWS S3 buckets, to Microsoft Sentinel.
 
---

## Next steps

In this document, you learned how to connect to AWS resources to ingest their logs into Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
