---
title: Microsoft Entra Permissions Management Quickstart Guide
description: Quickstart guide - How to quickly onboard your Microsoft Entra Permissions Management product
# CustomerIntent: As a security administrator, I want to successfully onboard Permissions Management so that I can enable identity security in my cloud environment as efficiently as possible.'
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: quickstart
ms.date: 09/13/2023
ms.author: jfields
---

# Quickstart guide to Microsoft Entra Permissions Management 

Welcome to the Quickstart Guide for Microsoft Entra Permissions Management. 

Permissions Management is a Cloud Infrastructure Entitlement Management (CIEM) solution that provides comprehensive visibility into permissions assigned to all identities. These identities include over-privileged workload and user identities, actions, and resources across multicloud infrastructures in Microsoft Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP). Permissions Management helps your organization effectively secure and manage cloud permissions by detecting, automatically right-sizing, and continuously monitoring unused and excessive permissions. 

With this quickstart guide, you’ll set up your multicloud environment(s), configure data collection, and enable permissions access to ensure your cloud identities are managed and secure.  

## Prerequisites 

Before you begin, you need access to these tools for the onboarding process: 

- Access to a local BASH shell with the Azure CLI or Azure Cloud Shell using BASH environment (Azure CLI is included). 
- Access to AWS, Azure, and GCP consoles.
- A user must have the *Global Administrator* role assignment to create a new app registration in Microsoft Entra tenant is required for AWS and GCP onboarding. 


## Step 1: Set-up Permissions Management

To enable Permissions Management, you must have a Microsoft Entra tenant (example, Microsoft Entra admin center).  
- If you have an Azure account, you automatically have a Microsoft Entra admin center tenant. 
- If you don’t already have one, create a free account at [entra.microsoft.com.](https://entra.microsoft.com)

If the above points are met, continue with:

[Enable Microsoft Entra Permissions Management in your organization](onboard-enable-tenant.md)

Ensure you're a Global Administrator. Learn more about [Permissions Management roles and permissions](product-roles-permissions.md). 

 
## Step 2: Onboard your multicloud environment

So far you’ve,  

1. Been assigned the *Permissions Management Administrator* role in your Microsoft Entra admin center tenant. 
2. Purchased licenses or activated your 45-day free trial for Permissions Management. 
3. Successfully launched Permissions Management.

Now, you're going to learn about the role and settings of the Controller and Data collection modes in Permissions Management.

### Set the controller 
The controller gives you the choice to determine the level of access you grant to users in Permissions Management.  

- Enabling the controller during onboarding grants Permissions Management admin access, or read and write access, so users can right-size permissions and remediate directly through Permissions Management (instead of going to the AWS, Azure, or GCP consoles).  

- Disabling the controller during onboarding, or never enabling it, grants a Permissions Management user read-only access to your environment(s).  

> [!NOTE]
> If you don't enable the controller during onboarding, you have the option to enable it after onboarding is complete. To set the controller in Permissions Management after onboarding, see [Enable or disable the controller after onboarding](onboard-enable-controller-after-onboarding.md).
> For AWS environments, once you have enabled the controller, you *cannot* disable it. 

To set the controller settings during onboarding:
1. Select **Enable** to give read and write access to Permissions Management.
2. Select **Disable** to give read-only access to Permissions Management.

### Configure data collection

There are three modes to choose from in order to collect data in Permissions Management. 

- **Automatic (recommended)** 
Permissions Management automatically discovers, onboards, and monitors all current and future subscriptions. 

- **Manual** 
Manually enter individual subscriptions for Permissions Management to discover, onboard, and monitor. You can enter up to 100 subscriptions per data collection.  

- **Select** 
Permissions Management automatically discovers all current subscriptions. Once discovered, you select which subscriptions to onboard and monitor. 

> [!NOTE] 
> To use **Automatic** or **Select** modes, the controller must be enabled while configuring data collection. 

To configure data collection:
1. In Permissions Management, go to the **Data Collectors** page.
2. Select a cloud environment: **AWS**, **Azure**, or **GCP**.
3. Click **Create configuration**.

### Onboard Amazon Web Services (AWS)
Since Permissions Management is hosted on Microsoft Entra, there are more steps to take to onboard your AWS environment.  

To connect AWS to Permissions Management, you must create a Microsoft Entra application in the Microsoft Entra admin center tenant where Permissions Management is enabled. This Microsoft Entra application is used to set up an OIDC connection to your AWS environment.   

*OpenID Connect (OIDC) is an interoperable authentication protocol based on the OAuth 2.0 family of specifications.*

### Prerequisites 

A user must have *Global Administrator* or *Permissions Management Administrator* role assignments to create a new app registration in Microsoft Entra ID. 

Account IDs and roles for: 
- AWS OIDC account: An AWS member account designated by you to create and host the OIDC connection through an OIDC IdP
- AWS Logging account (optional but recommended) 
- AWS Management account (optional but recommended)  
- AWS member accounts monitored and managed by Permissions Management (for manual mode) 

To use **Automatic** or **Select** data collection modes, you must connect your AWS Management account.  

During this step, you can enable the controller by entering the name of the S3 bucket with AWS CloudTrail activity logs (found on AWS Trails). 

To onboard your AWS environment and configure data collection, see [Onboard an Amazon Web Services (AWS) account](onboard-aws.md).

### Onboard Microsoft Azure
When you enabled Permissions Management in the Microsoft Entra tenant, an enterprise application for CIEM was created. To onboard your Azure environment, you grant permissions to this application for Permissions management.

1. In the Microsoft Entra tenant where Permissions management is enabled, locate the **Cloud Infrastructure Entitlement Management (CIEM)** enterprise application.  

2. Assign the *Reader* role to the CIEM application to allow Permissions management to read the Microsoft Entra subscriptions in your environment. 

### Prerequisites 
- A user with ```Microsoft.Authorization/roleAssignments/write``` permissions at the subscription or management group scope. 

- To use **Automatic** or **Select** data collection modes, you must assign the *Reader* role at the Management group scope. 

- To enable the controller, you must assign the *User Access Administrator* role to the CIEM application. 

To onboard your Azure environment and configure data collection, see [Onboard a Microsoft Azure subscription](onboard-azure.md).


### Onboard Google Cloud Platform (GCP)
Because Permissions Management is hosted on Microsoft Azure, there are additional steps to take to onboard your GCP environment.

To connect GCP to Permissions Management, you must create a Microsoft Entra admin center application in the Microsoft Entra tenant where Permissions Management is enabled. This Microsoft Entra admin center application is used to set up an OIDC connection to your GCP environment.   

*OpenID Connect (OIDC) is an interoperable authentication protocol based on the OAuth 2.0 family of specifications.* 

 
### Prerequisites 
A user with the ability to create a new app registration in Microsoft Entra (needed to facilitate the OIDC connection) is needed for AWS and GCP onboarding. 
 
ID details for: 
- GCP OIDC project: a GCP project designated by you to create and host the OIDC connection through an OIDC IdP. 
    - Project number and project ID 
- GCP OIDC Workload identity 
    - Pool ID, pool provider ID 
- GCP OIDC service account 
    - G-suite IdP Secret name and G-suite IdP user email (optional) 
    - IDs for the GCP projects you wish to onboard (optional, for manual mode)

Assign the *Viewer* and *Security Reviewer* roles to the GCP service account at the organization, folder, or project levels to grant Permissions management read access to your GCP environment. 

During this step, you have the option to **Enable** controller mode by assigning the *Role Administrator* and *Security Administrator* roles to the GCP service account at the organization, folder, or project levels. 

> [!NOTE]
> The Permissions Management default scope is at the project level. 

To onboard your GCP environment and configure data collection, see [Onboard a GCP project](onboard-gcp.md).

## Summary

Congratulations! You have finished configuring data collection for your environment(s), and the data collection process has begun.  

The status column in your Permissions Management UI shows you which step of data collection you're at.  

 
- **Pending**: Permissions Management has not started detecting or onboarding yet. 
- **Discovering**: Permissions Management is detecting the authorization systems. 
- **In progress**: Permissions Management has finished detecting the authorization systems and is onboarding. 
- **Onboarded**: Data collection is complete, and all detected authorization systems are onboarded to Permissions Management. 

> [!NOTE] 
> Data collection might take time depending on the amount of authorization systems you've onboarded. While the data collection process continues, you can begin setting up [users and groups in Permissions Management](how-to-add-remove-user-to-group.md). 

## Next steps

- [Enable or disable the controller after onboarding](onboard-enable-controller-after-onboarding.md)
- [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md)
- [Create folders to organize your authorization systems](how-to-create-folders.md)

References:
- [Permissions Management Glossary](multi-cloud-glossary.md)
- [Permissions Management FAQs](faqs.md)
