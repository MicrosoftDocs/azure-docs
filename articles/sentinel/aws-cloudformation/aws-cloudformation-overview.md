---
title: Automate AWS log collection for Microsoft Sentinel with AWS CloudFormation
description: Use AWS CloudFormation templates to deploy the Amazon Web Services S3-based data connector for Microsoft Sentinel and automatically create the required AWS resources.
author: KanenasCS
ms.author: bagol
ms.service: microsoft-sentinel
ms.topic: how-to
ms.collection: microsoft-sentinel
ms.date: 12/01/2025
---

# Automate AWS log collection for Microsoft Sentinel Amazon Web Services S3 connector with AWS CloudFormation

## Overview

This repository contains infrastructure and automation to onboard AWS security logs into **Microsoft Sentinel** using the **AWS S3 data connector**.

Supported log sources (per stack):

- **VPC Flow Logs**
- **CloudTrail** (management and data events)
- **GuardDuty** findings
- **CloudWatch** (via Lambda export to S3)

All stacks follow the same high-level pattern:

1. The AWS service writes logs to an **S3 bucket**.
2. **S3 → SQS notifications** are configured for new log objects.
3. Microsoft Sentinel assumes an **OIDC IAM role** in the AWS account and:
   - Reads messages from **SQS**.
   - Fetches the log files from **S3** and ingests them into the Sentinel workspace.

---

## One-time OIDC prerequisite (applies to all stacks)

> **Important:** All security stacks in this repo rely on a common **OIDC trust** between AWS and Microsoft Entra ID (Azure AD).

- You deploy the **OIDC + Sentinel role** stack **once** per AWS account/region.
- After that, every log-specific stack (VPC Flow Logs, CloudTrail, GuardDuty, CloudWatch) **reuses the same OIDC provider and Sentinel IAM role**.
- When you onboard a new log type later, you do **not** redeploy OIDC – you only deploy the new log-specific stack and reference the existing role.

In short:  
**Deploy OIDC once → reuse it for all AWS security log stacks.**

---

## Repository structure (high level)

onAwsPolicies.ps1`, `HelperFunctions.ps1`, `AwsPoliciesUpdate.ps1`, `AwsResourceCreator.ps1`, `AwsSentinelTag.ps1`, `EnviornmentConstants.ps1` – shared helper functions and policy definitions.

- **CloudFormation templates**

  (Example names – align them with your repo):

  - `aws-s3-vpcflowlogs.yaml` – VPC Flow Logs S3 + SQS + resource policies.
  - `aws-s3-cloudtrail.yaml` – CloudTrail S3 + SQS (+ optional KMS) + resource policies.
  - `aws-s3-guardduty.yaml` – GuardDuty S3 + KMS + SQS + resource policies.
  - `aws-s3-cloudwatch-part1.yaml` – **CloudWatch Part 1:** OIDC Sentinel role, CloudWatch S3 bucket, SQS queue, bucket policy, queue policy, and S3 notification.
  - `aws-s3-cloudwatch-part2-lambda.yaml` – **CloudWatch Part 2:** Lambda exporter, IAM role, and EventBridge schedule.

- **Lambda functions** (for CloudWatch)
  - `CloudWatchLambdaFunction.py`, `CloudWatchLambdaFunction_V2.py`, `CloudWatchLambdaFunction_V3.py` etc. – reference implementations for CloudWatch → S3 export.  
    The Part 2 CloudFormation stack embeds the latest, validated version inline.

- **Supporting content**
  - `README.md` (this document).
  - Per-log-type onboarding guides (WAF, CloudTrail, CloudWatch, etc).

---

## Prerequisites

### Azure side

- An **Azure subscription** with:
  - A **Log Analytics workspace**.
  - **Microsoft Sentinel** enabled on that workspace.
- Permissions in Azure to:
  - Configure **data connectors** for the Sentinel workspace.
  - View and copy the **Workspace ID (External ID)** from the AWS S3 connectors.
  - Create and manage identities used for OIDC / role assumption (if required by your governance).
- RBAC: **Microsoft Sentinel Contributor** or equivalent on the workspace is recommended.

### AWS side

- An **AWS account** where the stacks will be deployed.
- IAM permissions (for the deploying identity) to:
  - Deploy and manage **CloudFormation** stacks:
    - `cloudformation:CreateStack`, `UpdateStack`, `DescribeStacks`, `ListStacks`, `DeleteStack`.
  - Create and manage:
    - **IAM roles and policies** (Sentinel OIDC role, Lambda role, EventBridge role).
    - **S3 buckets** and bucket policies.
    - **SQS queues** and queue policies.
    - **KMS keys** and key policies (for encrypted services such as GuardDuty and CloudTrail, where used).
    - **Lambda functions** and **EventBridge** rules (for CloudWatch exporter).

### Admin workstation

- **PowerShell** (latest recommended version).
- **AWS CLI**, configured with credentials that can deploy the resources:
  - Run `aws configure` and ensure access to the target AWS account(s) and Region(s).
- Optionally, **Azure CLI** or the Azure portal to validate connector status and Workspace ID.

---

## Security stacks per log type

Each log type has its own CloudFormation-based “security stack”. At a high level, each stack:

1. Creates or uses an **S3 bucket** for that log type.
2. Creates an **SQS queue** for S3 notifications.
3. Configures **S3 → SQS** notifications (filtering by prefix/suffix, as required).
4. Grants the **Sentinel OIDC IAM role** permissions to:
   - `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:ChangeMessageVisibility`, `sqs:GetQueueAttributes`.
   - `s3:GetObject` and related read actions on the log bucket.
5. If encryption is used, adds **KMS key policies** for:
   - The AWS service principal (for example `cloudtrail.amazonaws.com`, `guardduty.amazonaws.com`).
   - The Sentinel OIDC role so it can decrypt encrypted log files.

Below is a summary for each log type.

### VPC Flow Logs stack

**Template:** `aws-s3-vpcflowlogs.yaml`  

This stack:

- Creates or reuses an **S3 bucket** dedicated to VPC Flow Logs.
- Configures **VPC Flow Logs** to deliver to that bucket using the required IAM delivery role.
- Creates an **SQS queue** for the Sentinel connector (for example, `omicron-sentinel-vpcflowlogs-queue`).
- Configures **S3 event notifications** for the VPC Flow Logs prefix (e.g. `AWSLogs/<account-id>/vpcflowlogs/`).
- Adds:
  - An S3 **bucket policy** allowing the Sentinel OIDC role to list and read log objects.
  - An SQS **queue policy** allowing the bucket to send messages and Sentinel to read from the queue.

### CloudTrail stack

**Template:** `aws-s3-cloudtrail.yaml`  

This stack:

- Creates or uses the **CloudTrail S3 bucket**.
- Optionally creates or updates a **CloudTrail trail** that delivers management and data events to that bucket.
- Creates an **SQS queue** for CloudTrail notifications.
- Configures **S3 → SQS** notifications for the CloudTrail log prefix.
- If CloudTrail uses **SSE-KMS**, the template configures:
  - A **KMS key** (or references an existing one).
  - Key policy entries for `cloudtrail.amazonaws.com` and the Sentinel OIDC role.
- Adds:
  - S3 bucket policy entries for Sentinel read access.
  - SQS queue policy allowing S3 to send and Sentinel to consume messages.

### GuardDuty stack

**Template:** `aws-s3-guardduty.yaml`  

This stack:

- Creates or uses a dedicated **S3 bucket** for GuardDuty findings.
- Creates a **KMS key** for encrypting GuardDuty exports (if not already present).
- Configures **GuardDuty export** to the S3 bucket with KMS encryption.
- Creates an **SQS queue** for GuardDuty connector messages.
- Configures **S3 event notifications** for GuardDuty prefixes.
- Sets:
  - A bucket policy that grants GuardDuty the right to write, and the Sentinel role the right to read.
  - A KMS key policy that allows GuardDuty to encrypt and the Sentinel role to decrypt.
  - An SQS queue policy that allows S3 to send and Sentinel to receive messages.

### CloudWatch (two-part deployment)

CloudWatch logs are handled in **two stacks**:

#### CloudWatch Part 1 – Sentinel role, S3, and SQS

**Template:** `aws-s3-cloudwatch-part1.yaml`  

This stack:

- Creates or reuses the **CloudWatch export S3 bucket**  
  (for example `azure-sentinel-cloudwatch-<env>-<suffix>`).
- Creates the **CloudWatch connector SQS queue**  
  (for example `omicron-sentinel-cloudwatch-queue`).
- Creates the **Sentinel OIDC IAM role** (if not already deployed globally) or can reference an existing one.
- Adds:
  - An S3 **bucket policy** that allows:
    - The Sentinel role to `ListBucket` and `GetObject`.
  - An SQS **queue policy** that allows:
    - The S3 bucket to call `SQS:SendMessage`.
    - The Sentinel role to receive and delete messages.
- Configures an **S3 event notification** on the bucket that sends all new `.gz` objects in the CloudWatch export prefix to the SQS queue.

#### CloudWatch Part 2 – Lambda exporter and schedule

**Template:** `aws-s3-cloudwatch-part2-lambda.yaml`  

This stack:

- Creates an **IAM role for the CloudWatch exporter Lambda** with:
  - `logs:DescribeLogGroups`, `DescribeLogStreams`, `GetLogEvents`, `FilterLogEvents` on CloudWatch Logs.
  - `s3:PutObject` and `s3:AbortMultipartUpload` on the CloudWatch export bucket prefix `AWSLogs/<account-id>/CloudWatch/`.
  - Basic Lambda logging permissions.
- Deploys the **Lambda function** that:
  - Runs every **N minutes** (default 15) using an **EventBridge schedule**.
  - Queries CloudWatch Logs for the last N minutes across all log groups.
  - Writes gzipped NDJSON files to the S3 prefix `AWSLogs/<account-id>/CloudWatch/<log-group>/…`.
- Creates an **EventBridge rule** with a `rate(N minutes)` expression that invokes the Lambda function on the configured schedule.

Sentinel then ingests these CloudWatch logs via the same **S3 → SQS** mechanism as the other stacks.

---

## Next steps

1. Ensure the **OIDC prerequisite stack** is deployed in the target AWS account/region.
2. Choose the log type(s) you want to onboard (VPC Flow Logs, CloudTrail, GuardDuty, CloudWatch).
3. Deploy the corresponding **CloudFormation stack(s)** from this repo.
4. In **Microsoft Sentinel**, open the matching **AWS S3 data connector**:
   - Supply the **role ARN** and **External ID (Workspace ID)** where required.
   - Validate that the connector status becomes **Connected**.
5. Confirm that the expected tables (for example `AWSVPCFlow`, `AWSCloudTrail`, `AWSGuardDuty`, `CloudWatch` ) start populating with events.

This model gives you a repeatable, infrastructure-as-code approach for onboarding multiple AWS log sources into Microsoft Sentinel using a common, secure OIDC foundation.
