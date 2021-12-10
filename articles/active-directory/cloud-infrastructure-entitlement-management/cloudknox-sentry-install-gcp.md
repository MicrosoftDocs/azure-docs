---
title: Install Microsoft CloudKnox Permissions Management Sentry on the Google Cloud Platform (GCP)
description: How to install Microsoft CloudKnox Permissions Management Sentry on the Google Cloud Platform (GCP).
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/10/2021
ms.author: v-ydequadros
---

# Install Microsoft CloudKnox Permissions Management Sentry on the Google Cloud Platform (GCP)

<!---![AWS Sentry Installation](sentry-install-AWS.jpg)--->

The Microsoft CloudKnox Permissions Management Sentry is an agent, packaged in a virtual appliance. It gathers information on users, their privileges, their activities, and other resources for monitored Amazon Web Services (AWS) accounts. 

CloudKnox can be deployed in two ways:

- *Read Only* (Controller Disabled), which only collects information about the account.
- *Controller Enabled*, which allows the CloudKnox Sentry to make changes to identity and access management (IAM) roles, policies, and users.

To provide visibility and insights, the CloudKnox Sentry collects information from a many sources. It uses *Read*, *List*, and *Describe* privileges to help enumerate resource information, for example, to catalog ec2 instances and s3 buckets.

To gain insight into activity within the AWS account, CloudKnox gathers CloudTrail event logs and ties them to individual identities.

## Architecture

The CloudKnox Sentry is a Linux Photon based appliance that collects information about the AWS account. It uses an IAM role to read identity entitlements, resource information, and CloudTrail data on an hourly basis. It then uploads that data to CloudKnox's SaaS Application for processing.

Inbound traffic to the Sentry is only received on port 9000, and is used for configuration by the administrator of CloudKnox. We recommend only allowing traffic from any observable source IP addresses your administrator may be configuring. Outbound traffic is 443 to make API calls to AWS, CloudKnox, and identity provider (IDP) integration.

<!---![Sentry Architecture AWS](sentry-architecture-AWS.png)--->

## Port requirements

**Required Ports for the CloudKnox Sentry**

| Traffic      | Port | Description                                                                                               |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------- |
| TCP Inbound  | 9000 | Configuration. </p>Request this information from the administrators source IP only when you're configuring your system. |
| TCP Outbound | 443  | API Calls to AWS, CloudKnox, and identity provider (IDP) integration.                                              |

## Multi-account collection from one Sentry instance

For AWS organizations with multiple AWS accounts, you can set up one Sentry to collect from multiple AWS accounts by allowing the Sentry's IAM role to assume a cross-account role in the account from which you want to collect data. You must configure a *trust relationship* to allow multi-account data collection.

<!---**Explanation and diagram**--->

<!---![Multi-Account Collection Diagram](multi-account-AWS.png)--->

**Example**

If you set up the Sentry in Account B to collect entitlement, resource, and activity data from Account A:

1. Every hour, a job initiates a data collection by assuming the role passed to it.
2. The role assumes a cross-account role to Account A.
3. The cross-account role collects information about user privileges, groups, resources, configuration, and activity from native AWS services via API and returns the data to the CloudKnox Sentry.

<!---## Next steps---> 