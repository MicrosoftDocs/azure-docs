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
ms.date: 01/12/2022
ms.author: v-ydequadros
---

# Install Microsoft CloudKnox Permissions Management Sentry on the Google Cloud Platform (GCP)

<!---![GCP Sentry Installation](sentry-install-GCP.jpg)--->

The Microsoft CloudKnox Permissions Management Sentry is an agent for monitored Google Cloud Platform (GCP) accounts, packaged in a virtual appliance. It gathers information on users, their privileges, their activities, and other resources.

CloudKnox can be deployed in two ways:

- *Read only* (controller disabled), which only collects information about the account.
- *Controller enabled*, which allows the CloudKnox Sentry to collect information and make changes to identity and access management (IAM) roles, policies, and users.

To provide visibility and insights, the CloudKnox Sentry collects information from a many sources. For example, it uses *Read*, *List*, and *Describe* privileges to list resource information and catalog ec2 instances and s3 buckets.

To gain insight into activity within the GCP account, CloudKnox gathers CloudTrail event logs and ties them to individual identities.

## Architecture

The CloudKnox Sentry is a Linux Photon based appliance that: 

- Collects information about the GCP account. 
- Uses an IAM role to read identity entitlements, resource information, and CloudTrail data on an hourly basis.
- Uploads the collected data to CloudKnox's SaaS Application for processing.

Inbound traffic to the Sentry is only received on port 9000, and is used for configuration by the administrator of CloudKnox. We recommend only allowing traffic from observable source IP addresses that your administrator has configured. 

Outbound traffic is only received on port 443, and makes API calls to GCP, CloudKnox, and identity provider (IDP) integration.

<!---![Sentry Architecture GCP](sentry-architecture-GCP.png)--->

## Port requirements

**Required Ports for the CloudKnox Sentry**

| Traffic      | Port | Description                                                                                               |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------- |
| TCP Inbound  | 9000 | Used for configuration. </p>Request this information from the administrators' source IP only when you're configuring your system. |
| TCP Outbound | 443  | Used for API calls to GCP and CloudKnox, and for identity provider (IDP) integration.                            |

## Multi-account collection from one Sentry instance

For GCP organizations with multiple GCP accounts, you can set up one Sentry instance to collect data from multiple GCP accounts. To set up this collection, allow the Sentry's IAM role to assume a cross-account role in the account from which you want to collect data. To allow multi-account data collection, configure a *trust relationship*.

<!---**Explanation and diagram**--->

<!---![Multi-Account Collection Diagram](multi-account-GCP.png)--->

**Example**

If you set up the Sentry in Account B to collect entitlement, resource, and activity data from Account A:

1. Every hour, a job begins a data collection by assuming the role passed to it.
2. The role assumes a cross-account role to Account A.
3. Through the API, the cross-account role collects information about user privileges, groups, resources, configuration, and activity from native GCP services. Then cross-account role returns the data to the CloudKnox Sentry.

<!---## Next steps---> 