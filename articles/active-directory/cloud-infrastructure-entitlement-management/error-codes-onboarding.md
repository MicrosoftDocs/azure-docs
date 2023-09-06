---
title: Error codes in onboarding Permissions Management
description: Understand potential error codes that may appear during onboarding of Microsoft Entra Permissions Management
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/06/2023
ms.author: jfields
---

# Error codes when onboarding Permissions Management

During onboarding in Microsoft Entra Permissions Management, authorization system onboarding may fail. If this happens, error messages are returned that an admin can triage. This article lists potential data collection error messages and their descriptions shown in the Permissions Management UI, along with proposed solutions.


<table>
<thead>
<tr>
<th>Error code</th>
<th>Description</th>
<th>Proposed solution</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>AWS_ACCESSADVISOR_COLLECTION_ERROR</code></td>
<td>This account does not have permissions to view 'Service Last Accessed'.</td>
<td>Verify that you're signed in using Management Account credentials.
    - The AWS account must have a policy that has permissions to generate, get, list ```ServiceLastAccessDetails``` or equivalent permissions.
    - In the AWS Management Console, verify that Service Control Policies (SCPs) are enabled in your organization root.</td>
</tr>
<tr>
<td><code>AWS_CLOUDTRAIL_</code></td>
<td>This AWS environment does not have CloudTrail configured, or you do not have permissions to access CloudTrail.</td>
<td>CloudTrail is automatically created when an AWS account is created. You don't have permission to access Cloudtrail. To access:
- Verify you're signed in using Management Account credentials.
- Enable CloudTrail as a trusted service in your AWS organization.
- The AWS account must have the CloudTrail managed policies ```AWSCloudTrail_FullAccess```, ```AWSCloudTrail_ReadOnlyAccess```, or have been granted equivalent permissions.``` </td>
</tr>
<tr>
<td><code>AWS_CLOUDTRAIL_S3_ACCESS_DENIED</code></td>
<td>This account doesN't have permissions to access SB3 Bucket Cloudtrail logs.</td>
<td>Steps to try:
- Verify you're signed in using Management Account credentials.
- Enable CloudTrail as a trusted service in your AWS organization.
- The AWS account must have the CloudTrail managed policies ```AWSCloudTrail_FullAccess``` or have been granted equivalent permissions.``` 
- For cross-account access, each account must have an IAM role with an access policy that grants access.
- CloudTrail must hve the required permissions to deliver log files to S3 bucket and S3 bucket policies are updated to receive and store log files.</td>
</tr>
<tr>
<td><code>AWS_LDAP_CREDENTIALS_INVALID</code></td>
<td>Invalid LDAP Credentials.</td>
<td>Verify that the hard drive on your domain controller is not full.</td>
</tr>
<tr>
<td><code>AWS_LDAP_UNREACHABLE</code></td>
<td>Connection failure while trying to access LDAP service.</td>
<td>This is a common issue with the AWS Managed Microsoft AD Connector used to enable LDAPS. Verify if the AD connector can communicate via TCP and UDP over the 88 (Kerberos) and 389 (LDAP) ports.</tr>
<tr>
<td><code>AWS_SYSTEM_ROLE_POLICIES_COLLECTION_ERROR</code></td>
<td>Error during the collection of System role policies.</td>
<td>If your system role policies include Service Control Policies (SCPS), verify you're signed in using Management Account credentials. The AWS account must have the required permissions to display the policies’ details and attached entities.</td>
</tr>
<tr>
<td><code>ERROR_GCP_PROJECT_MIN_PERMISSION</code></td>
<td>Insufficient Project permissions.</td>
<td>Verify you have been granted the correct IAM roles or roles with equivalent permissions that grant access to the project.
- Organization Admin, Security Admin, Project IAM Admin.</td>
<tr>
<td><code>ERROR_NO_IDENTIFIER_URIS_IN_APP</code></td>
<td>No Identifier URIs configured for app.</td>
<td>Verify the application configuration for the configured Identifier URI’s in the portal. Please check the Azure AD application’s manifest file. </td>
<tr>
<tr>
<td><code>AWS_CHECK_EC2_ROLE</code></td>
<td>Verify you have been granted the correct IAM roles or roles with equivalent permissions that grant access to the project.
- Organization Admin, Security Admin, Project IAM Admin.</td>
<td></td>
</tr>