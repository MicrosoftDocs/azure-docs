# AWS S3 – Microsoft Sentinel Security Stacks

## Overview

This repository contains infrastructure and automation to onboard AWS security logs into **Microsoft Sentinel** using the **AWS S3 data connector**.

Supported log sources (per stack):

- **VPC Flow Logs**
- **CloudTrail** (management and data events)
- **GuardDuty** findings
- **CloudWatch / Custom logs** (via Lambda export to S3)

All stacks follow the same pattern:

1. The AWS service writes logs to an **S3 bucket**.
2. **S3 → SQS notifications** are configured for new log objects.
3. Microsoft Sentinel assumes an **IAM role** in the AWS account and:
   - Reads messages from **SQS**.
   - Fetches the log files from **S3**.

---

## One-time OIDC prerequisite (applies to all stacks)

>  **Important:** All security stacks in this repo require an **OIDC trust** between AWS and Microsoft Entra ID (Azure AD).

- You deploy the **OIDC stack once** per AWS account/region.
- After that, **every security stack** (VPC Flow Logs, CloudTrail, GuardDuty, CloudWatch, Custom logs) reuses the same trusted IAM role / OIDC configuration.
- When you add a new log type later, you **do not** redeploy OIDC – you only deploy the new log-specific stack and reference the existing role.

In short:  
**Deploy OIDC once → reuse it for all security stacks.**

---

## Repository structure (high level)

> Adjust this section to match your exact folder names if needed.

Typical layout:

- **PowerShell orchestration / helpers**
  - `ConfigAwsConnector.ps1` – main entry/orchestrator for configuring the connector.
  - `ConfigVpcFlowDataConnector.ps1` – VPC Flow Logs configuration.
  - `ConfigCloudTrailDataConnector.ps1` – CloudTrail configuration.
  - `ConfigGuardDutyDataConnector.ps1` – GuardDuty configuration.
  - `ConfigCloudWatchDataConnector.ps1` – CloudWatch logs configuration.
  - `ConfigCustomLogDataConnector.ps1` – custom log configuration.
  - `CommonAwsPolicies.ps1`, `HelperFunctions.ps1`, etc. – shared functions and policy helpers.

- **CloudFormation templates**
  - One or more templates per log source to create:
    - S3 bucket(s)
    - SQS queue(s)
    - IAM role(s) and policies
    - Optional **KMS keys** and key policies (for encrypted logs such as GuardDuty / CloudTrail).

- **Lambda functions** (for CloudWatch/custom logs)
  - `CloudWatchLambdaFunction.py`
  - `CloudWatchLambdaFunction_V2.py`

- **Policy documentation**
  - `AwsRequiredPolicies.md`
  - `AwsRequiredPoliciesForGov.md`

---

## Prerequisites

### Azure side

- An **Azure subscription** with:
  - A **Log Analytics workspace**.
  - **Microsoft Sentinel** enabled on that workspace.
- Permissions in Azure to:
  - Configure **data connectors**.
  - Create/manage **service principals** or identities used for OIDC / role assumption.

### AWS side

- An **AWS account** where the stacks will be deployed.
- Permissions to:
  - Deploy **CloudFormation** stacks.
  - Create and manage **S3**, **SQS**, **IAM roles/policies**, and **KMS keys** (where applicable).

### Admin workstation

- **PowerShell**
- **AWS CLI**, configured with credentials that can deploy the resources:
  - Run `aws configure` and ensure access to the target account(s).

---

## Security stacks per log type

Each log type has its own CloudFormation-based “security stack”. At a high level, each stack:

1. Creates or uses an **S3 bucket** for that log type.
2. Creates an **SQS queue** for S3 notifications.
3. Configures **S3 → SQS** notifications (filtering by prefix, if required).
4. Grants the **Sentinel IAM role** permissions to:
   - `sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes`
   - `s3:GetObject` (and related actions) on the log bucket.
5. (If encryption is used) Adds **KMS key** policies for:
   - The AWS service principal (e.g., `cloudtrail.amazonaws.com`, `guardduty.amazonaws.com`).
   - The Sentinel I
