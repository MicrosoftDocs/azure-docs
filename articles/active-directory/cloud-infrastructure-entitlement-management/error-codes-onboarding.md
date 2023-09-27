---
title: Error codes when onboarding Permissions Management
description: Understand potential error codes that may appear during onboarding of Microsoft Entra Permissions Management
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: reference
ms.date: 09/07/2023
ms.author: jfields
---

# Error codes: Microsoft Entra Permissions Management 

During onboarding, Microsoft Entra Permissions Management may return error messages that an admin can triage. This article lists data collection error messages and their descriptions shown in the Permissions Management UI, along with proposed solutions.


## AWS_ACCESSADVISOR_COLLECTION_ERROR 

This account does not have permissions to view ```Service Last Accessed```. 

### Proposed solution

- Verify that you're signed in using Management Account credentials. The AWS account must have a policy that has permissions to generate, get, or list ```ServiceLastAccessDetails``` or equivalent permissions. 
- In the AWS Management Console, verify that Service Control Policies (SCPs) are enabled in your organization root.

## AWS_CLOUDTRAIL_DISABLED

The AWS environment doesn't have CloudTrail configured, or you don't have permissions to access CloudTrail.

### Proposed solution

CloudTrail is automatically created when an AWS account is created. 

To access:
- Verify you're signed in using Management Account credentials.
- Enable CloudTrail as a trusted service in your AWS organization.
- Ensure that the AWS account has the CloudTrail managed policies ```AWSCloudTrail_FullAccess```, ```AWSCloudTrail_ReadOnlyAccess```, or is granted equivalent permissions.

## AWS_CLOUDTRAIL_S3_ACCESS_DENIED 

This account doesn't have permissions to access S3 Bucket CloudTrail logs. 

### Proposed solution

Steps to try:
- Verify you're signed in using Management Account credentials.
- Enable CloudTrail as a trusted service in your AWS organization.
- The AWS account must have the CloudTrail managed policy ```AWSCloudTrail_FullAccess``` or have been granted equivalent permissions.
- For cross-account access, each account must have an IAM role with an access policy that grants access.
- CloudTrail must have the required permissions to deliver log files to the S3 bucket and S3 bucket policies are updated to receive and store log files.

## AWS_LDAP_CREDENTIALS_INVALID 

Invalid LDAP Credentials. 

### Proposed Solution

Verify that the hard drive on your domain controller is not full.


## AWS_LDAP_UNREACHABLE 

Connection failure while trying to access LDAP service. 


### Proposed solution

This issue is common with the AWS Managed Microsoft AD Connector used to enable LDAPS. Verify if the AD connector can communicate via TCP and UDP over the 88 (Kerberos) and 389 (LDAP) ports.

## AWS_SYSTEM_ROLE_POLICIES_COLLECTION_ERROR 

Error during the collection of System role policies.

### Proposed solution

If your system role policies include Service Control Policies (SCPs), verify you're signed in using Management Account credentials. The AWS account must have the required permissions to display the policies’ details and attached entities.


## ERROR_GCP_PROJECT_MIN_PERMISSION

Insufficient Project permissions. 

### Proposed solution

Verify you have been granted the correct IAM roles or roles with equivalent permissions that grant access to the project: *Organization Admin*, *Security Admin*, or *Project IAM Admin*.


## ERROR_NO_IDENTIFIER_URIS_IN_APP

No Identifier URIs configured for app. 

### Proposed solution

- Verify the application configuration for the configured Identifier URI’s in the portal. 
- Check the Microsoft Entra application’s manifest file. 


## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](onboard-aws.md).
- For information on how to onboard an account after initial onboarding, see [Add an account/subscription/project after onboarding](onboard-add-account-after-onboarding.md)
