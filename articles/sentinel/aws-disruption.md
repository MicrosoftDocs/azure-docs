---
title: Enable Attack Disruption Actions on AWS with Microsoft Sentinel
description: Enable Attack Disruption Actions on AWS with Microsoft Sentinel
author: mberdugo
ms.author: monaberdugo
ms.reviewer: Christos Ventouris
ms.date: 01/13/2026
ms.topic: how-to
---

# Enable attack disruption actions on AWS with Microsoft Sentinel (preview)

This article describes how to configure your AWS environment so that Microsoft Sentinel can take automated actions on a user that assumes a SAML role, or on an AWS IAM account when an alert is triggered. Attack disruption uses high-confidence signals to contain compromised assets and limit the impact of attacks, including actions on identities in AWS.

## Prerequisites

Before you begin, ensure the following:

- You have an active AWS account with administrative privileges.
- Your Microsoft Sentinel analytic workspace is connected to the unified security operations portal.
- The AWS Connector for Microsoft Sentinel is deployed and enabled
- AWS CloudTrail logs are being ingested into Microsoft Sentinel
  See: [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](./connect-aws.md)
- Appropriate IAM roles and permissions are configured in AWS to allow Microsoft Sentinel to perform actions on IAM accounts.

## Step 1: Prepare AWS for integration

### 1.1 Create a dedicated IAM role for Microsoft Sentinel

1. In the AWS console, go to **IAM \> Roles**.

1. Select **Create role**.

1. Select **AWS service** as the trusted entity and choose **EC2** (you'll update the trust relationship later).

1. Attach the following policy to the role (replace \<YOUR_ACCOUNT_ID\> as needed):

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "iam:UpdateLoginProfile",
            "iam:DeactivateMFADevice",
            "iam:DeleteAccessKey",
            "iam:DeleteLoginProfile",
            "iam:DeleteUser",
            "iam:RemoveUserFromGroup",
            "iam:ResetServiceSpecificCredential",
            "iam:ResyncMFADevice",
            "iam:RevokeSession",
            "iam:DeleteUserPermissionsBoundary",
            "iam:DeleteUserPolicy",
            "iam:DetachUserPolicy"
          ],
          "Resource": "arn:aws:iam::<YOUR_ACCOUNT_ID>:user/*"
        }
      ]
    }
    ```

1. Name the role (for example, SentinelAttackDisruptionRole) and create it.

### 1.2 Configure trust relationship

1. In the IAM role you created, go to the **Trust relationships** tab.

1. Select **Edit trust relationship**.

1. Replace the trust policy with the following, specifying the Microsoft Sentinel integration principal (replace `<YOUR_AZURE_SUBSCRIPTION_ID>` with your actual Azure subscription ID):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com",
        "AWS": "arn:aws:iam::<YOUR_AZURE_SUBSCRIPTION_ID>:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

## Step 2: Enable CloudTrail

1. In the AWS console, go to **CloudTrail**.

1. Ensure that a CloudTrail is enabled and logging is active for all regions.

## Step 3: Deploy and enable the AWS connector in Microsoft Sentinel

1. In the Azure portal, go to **Microsoft Sentinel \> Data connectors**.

1. Select **Amazon Web Services S3** from the data connectors gallery.

1. If you don't see the connector, install the Amazon Web Services solution from the Content Hub in Microsoft Sentinel.

1. Follow the instructions in the [official documentation](./connect-aws.md) to set up your AWS environment and connect it to Microsoft Sentinel.

1. Provide the IAM role ARN and SQS queue URL as required.

## Step 4: Validate integration

1. In Microsoft Sentinel, confirm that the connector status is **Connected**.

1. Verify log ingestion and connector health using SentinelHealth logs and AWS SQS queue status.

1. In AWS, check that CloudTrail and GuardDuty events are being sent to Microsoft Sentinel.

## Step 5: Test the integration

1. Trigger a test alert in AWS (for example, simulated credential compromise).

1. Confirm that Microsoft Sentinel can take the configured actions on the affected IAM account.

1. Review audit logs in AWS and Microsoft Sentinel to verify successful execution.

## Step 6: Monitor and maintain

- Regularly review IAM role permissions and audit logs in AWS.
- Update Microsoft Sentinel analytic rules and automation playbooks as needed to reflect changes in your AWS environment.
- Monitor alerts and response actions in the Microsoft Sentinel portal.

The following scripts can automate the process for building the integration with Microsoft Sentinel and AWS to enable attack disruption:

### [Bash Script](#tab/bash)
Save the following code snippet as a bash file and execute it.

```bash
#!/bin/bash
# AWS Sentinel OIDC Setup Script
# Configures IAM roles and policies for Microsoft Sentinel integration

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

ms_federated_endpoint="sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d"
actions_audience="api://b7c1e142-0933-4310-ba00-8b28878bfece"
role_name="OIDC_Actions_Sentinel"
policy_name="SentinelActionsPolicy"

# Verify AWS credentials are configured
echo -e "${CYAN}Verifying AWS credentials...${NC}"
if ! account_id=$(aws sts get-caller-identity --query Account --output text 2>&1); then
    echo -e "\n${RED}ERROR: AWS credentials not configured or invalid${NC}"
    echo -e "${RED}Details: $account_id${NC}"
    echo -e "\n${YELLOW}Please authenticate using one of these methods:${NC}"
    echo -e "${YELLOW}  1. Run 'aws configure' to set up credentials${NC}"
    echo -e "${YELLOW}  2. Set AWS environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)${NC}"
    echo -e "${YELLOW}  3. Use 'aws sso login --profile <profile-name>' for SSO${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS authenticated (Account: $account_id)${NC}"
trust_policy_document=$(cat << EOM
{
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::$account_id:oidc-provider/$ms_federated_endpoint/"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "$ms_federated_endpoint/:aud": "$actions_audience",
                    "sts:RoleSessionName": "MicrosoftSentinel_$account_id"
                }
            }
        }
    ]
}
EOM
)
permissions_policy_document=$(cat << EOM
{
  "Statement": [
    {
      "Sid": "SentinelActionsPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:GetUserPolicy",
        "iam:DeleteRolePolicy",
        "iam:PutUserPolicy",
        "iam:AttachUserPolicy",
        "iam:ListUserPolicies",
        "iam:PutRolePolicy",
        "iam:GetUser",
        "iam:DetachUserPolicy",
        "iam:GetRolePolicy",
        "iam:DeleteUserPolicy",
        "s3:PutBucketPublicAccessBlock"
      ],
      "Resource": "*"
    }
  ]
}
EOM
)

aws iam add-client-id-to-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::$account_id:oidc-provider/$ms_federated_endpoint/ --client-id $actions_audience
aws iam create-role --role-name $role_name --assume-role-policy-document "$trust_policy_document" || aws iam update-assume-role-policy --role-name $role_name --policy-document "$trust_policy_document"
aws iam put-role-policy --role-name $role_name --policy-name $policy_name --policy-document "$permissions_policy_document"

```

### [PowerShell Script](#tab/powershell)

For a PowerShell version of the script, use the following code snippet

```powershell
# AWS Sentinel OIDC Setup Script
# Configures IAM roles and policies for Microsoft Sentinel integration

$ErrorActionPreference = 'Stop'

$ms_federated_endpoint = "sts.windows.net/33e01921-4d64-4f8c-a055-5bdaffd5e33d"
$actions_audience = "api://b7c1e142-0933-4310-ba00-8b28878bfece"
$role_name = "OIDC_Actions_Sentinel"
$policy_name = "SentinelActionsPolicy"

# Verify AWS credentials are configured
Write-Host "Verifying AWS credentials..." -ForegroundColor Cyan
try {
    $account_id = aws sts get-caller-identity --query Account --output text 2>&1
    if ($LASTEXITCODE -ne 0) { 
        throw "AWS credentials not configured or invalid. Output: $account_id" 
    }
    Write-Host "✓ AWS authenticated (Account: $account_id)" -ForegroundColor Green
} catch {
    Write-Host "`nERROR: AWS credentials not configured or invalid" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nPlease authenticate using one of these methods:" -ForegroundColor Yellow
    Write-Host "  1. Run 'aws configure' to set up credentials" -ForegroundColor Yellow
    Write-Host "  2. Set AWS environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)" -ForegroundColor Yellow
    Write-Host "  3. Use 'aws sso login --profile <profile-name>' for SSO" -ForegroundColor Yellow
    exit 1
}

# Define trust policy document
$trust_policy_document = @"
{
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::$account_id:oidc-provider/$ms_federated_endpoint/"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "$ms_federated_endpoint/:aud": "$actions_audience",
                    "sts:RoleSessionName": "MicrosoftSentinel_$account_id"
                }
            }
        }
    ]
}
"@

# Define permissions policy document
$permissions_policy_document = @"
{
  "Statement": [
    {
      "Sid": "SentinelActionsPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:GetUserPolicy",
        "iam:DeleteRolePolicy",
        "iam:PutUserPolicy",
        "iam:AttachUserPolicy",
        "iam:ListUserPolicies",
        "iam:PutRolePolicy",
        "iam:GetUser",
        "iam:DetachUserPolicy",
        "iam:GetRolePolicy",
        "iam:DeleteUserPolicy",
        "s3:PutBucketPublicAccessBlock"
      ],
      "Resource": "*"
    }
  ]
}
"@

# Add client ID to OpenID Connect provider
Write-Host "`nAdding client ID to OIDC provider..." -ForegroundColor Cyan
try {
    $output = aws iam add-client-id-to-open-id-connect-provider `
        --open-id-connect-provider-arn "arn:aws:iam::$account_id:oidc-provider/$ms_federated_endpoint/" `
        --client-id $actions_audience 2>&1
    if ($LASTEXITCODE -ne 0) { throw $output }
    Write-Host "✓ Client ID added successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to add client ID to OIDC provider" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create or update IAM role
Write-Host "`nCreating/updating IAM role..." -ForegroundColor Cyan
try {
    $output = aws iam create-role `
        --role-name $role_name `
        --assume-role-policy-document $trust_policy_document 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Role created successfully" -ForegroundColor Green
    } else {
        throw $output
    }
} catch {
    if ($_.Exception.Message -like "*EntityAlreadyExists*") {
        Write-Host "Role already exists, updating assume role policy..." -ForegroundColor Yellow
        try {
            $output = aws iam update-assume-role-policy `
                --role-name $role_name `
                --policy-document $trust_policy_document 2>&1
            if ($LASTEXITCODE -ne 0) { throw $output }
            Write-Host "✓ Assume role policy updated" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: Failed to update assume role policy" -ForegroundColor Red
            Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "ERROR: Failed to create IAM role" -ForegroundColor Red
        Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Attach inline policy to role
Write-Host "`nAttaching policy to role..." -ForegroundColor Cyan
try {
    $output = aws iam put-role-policy `
        --role-name $role_name `
        --policy-name $policy_name `
        --policy-document $permissions_policy_document 2>&1
    if ($LASTEXITCODE -ne 0) { throw $output }
    Write-Host "✓ Policy attached successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to attach policy to role" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Role ARN: arn:aws:iam::$account_id:role/$role_name" -ForegroundColor Cyan
```

---

## Related content

- [Connect Microsoft Sentinel to Amazon Web Services to ingest AWS service log data](./connect-aws.md)
- [Microsoft Sentinel data connectors](./data-connectors-reference.md#sentinel-data-connectors)
