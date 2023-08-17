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
ms.date: 08/17/2023
ms.author: jfields
---

# Quickstart guide to Microsoft Entra Permissions Management 

Welcome to the Quickstart Guide for Microsoft Entra Permissions Management. 

Permissions Management is a Cloud Infrastructure Entitlement Management (CIEM) solution that provides comprehensive visibility into permissions assigned to all identities. These identities include over-privileged workload and user identities, actions, and resources across multicloud infrastructures in Microsoft Entra, Amazon Web Services (AWS), and Google Cloud Platform (GCP). Permissions Management helps your organization effectively secure and manage cloud permissions by detecting, automatically right-sizing, and continuously monitoring unused and excessive permissions. 

With this quickstart guide, you’ll set up your multicloud environment(s), configure data collection, and enable permissions access to ensure your cloud identities are managed and secure.  

## Prerequisites 

Before you begin, you need access to these tools for the onboarding process: 

- Access to a local BASH shell with the Entra CLI or Entra Cloud Shell using BASH environment (Entra CLI is included). 
- Access to AWS, Entra, and GCP consoles.
- A user with permissions (Permissions Management Administrator?) to create a new app registration in Entra is required for AWS and GCP onboarding. 


## Step 1: Set-up Permissions Management

To enable Permissions Management, you must have a Microsoft Entra tenant (example, Entra Admin Center).  
- If you have an Entra account, you automatically have an Entra Admin Center tenant. 
- If you don’t already have one, create a free account at [entra.microsoft.com](https://entra.microsoft.com). 

If the above points are met, continue with:

1. [Enable Microsoft Entra Permissions Management in your organization](onboard-enable-tenant.md)

Ensure you are a Global Administrator, Permissions Management Administrator, or have equivalent permissions in your Entra Admin Center tenant. Learn more about [Permissions Management roles and permissions](product-roles-permissions.md). 

 
## Step 2: Onboard your multicloud environment

So far you’ve,  

1. Been assigned the Permissions Management Administrator role in your Entra Admin Center tenant. 
2. Purchased licenses or activated your 45-day free trial for Permissions Management. 
3. Successfully launched Permissions Management.

Now, you're going to learn about the role and settings of the Controller, and Data collection modes in Permissions Management.

### Set the controller 
The controller gives you the choice to determine the level of access you grant to users in Permissions Management.  

- Enabling the controller during onboarding grants Permissions Management admin access, or read and write access, so users can right-size permissions and remediate directly through Permissions Management (instead of going to the AWS, Entra, or GCP consoles).  

- Disabling the controller during onboarding, or never enabling it, grants Permissions Management user read only access to your environment(s).  

> [!NOTE]
> If you do not enable the controller during onboarding, you have the option to enable it after onboarding is complete. To set the controller in Permissions Management after onboarding, see [Enable or disable the controller after onboarding](onboard-enable-controller-after-onboarding.md).
> For AWS environments, once you've enabled the controller, you *cannot* disable it. 

To set the controller settings during onboarding:
1. Select **Enable** to give read and writer access to Permissions Management.
2. Select **Disable** to give read-only access to Permissions Management.

### Configure data collection

There are three mode options to set in order to collect data in Permissions Management. 

- **Automatic (recommended)** 
Permissions Management automatically discovers, onboards, and monitors all current and future subscriptions. 

- **Manual** 
Manually enter individual subscriptions for Permissions Management to discover, onboard, and monitor. You can enter up to 100 subscriptions per data collection.  

- **Select** 
Permissions Management automatically discovers all current subscriptions. Once discovered, you select which subscriptions to onboard and monitor. 

> [!NOTE] 
> To use **Automatic** or **Select** modes, the controller must be enabled while configuring data collection. 

To configure data collection:
1. In Permissions Management, navigate to the data collectors page.
2. Select a cloud environment: AWS, Entra, or GCP.
3. Click **Create configuration**.

### Onboard Amazon Web Services (AWS)
Since Permissions Management is hosted on Microsoft Entra, there are additional steps to take to onboard your AWS environment.  

To connect AWS to Permissions Management, you must create an Entra Admin Center application in the Entra Admin Center tenant where Permissions Management is enabled. This Entra Admin Center application is used to set up an OIDC connection to your AWS environment.   

*OpenID Connect (OIDC) is an interoperable authentication protocol based on the OAuth 2.0 family of specifications.*

### Prerequisites 

A user (Permissions Management Admin?) with the ability to create a new app registration in Entra (needed to facilitate the OIDC connection) is needed for AWS and GCP onboarding. 

Account IDs and roles for: 
- AWS OIDC account: An AWS member account designated by you to create and host the OIDC connection through an OIDC IdP
- AWS Logging account (optional but recommended) 
- AWS Management account (optional but recommended)  
- AWS member accounts to be monitored and managed by Permissions Management (for manual mode) 

To use **Automatic** or **Select** data collection modes, you must connect your AWS Management account.  

During this step, you have the option to enable the controller by entering the name of the S3 bucket with AWS CloudTrail activity logs (found on AWS Trails). 

![Diagram, Entra Permissions Management tenant for OIDC app.](media/permissions-management-quickstart-guide/quickstart-entra-tenant.png)

To onboard your AWS environment and configure data collection, see [Onboard an Amazon Web Services (AWS) account](onboard-aws.md).

### Onboard Microsoft Entra
When you enabled Permissions Management in the Entra tenant, an enterprise application Cloud Infrastructure Entitlement Management (CIEM) was created. To onboard your Entra environment, you grant permissions to this application so Permissions management.

In the Enta tenant where Permissions management is enabled, locate the Cloud Infrastructure Entitlement Management (CIEM) application.  

Assign the *Reader* role to the CIEM application to allow Permissions management to read the Entra subscriptions in your environment. 

### Prerequisites 
A user with Microsoft.Authorization/roleAssignments/write permissions at the subscription or management group scope. 

To use **Automatic** or **Select** data collection modes, you must assign *Reader* role at the Management group scope. 

To enable the controller, you must assign the *User Access Administrator* role to the CIEM application. 

To onboard your Entra environment and configure data collection, see [Onboard a Microsoft Entra subscription](onboard-azure.md).


### Onboard Google Cloud Platform (GCP)
Because Permissions Management is hosted on Microsoft Entra, there are additional steps to take to onboard your GCP environment.

To connect GCP to Permissions Management, you must create an Entra Admin Center application in the Entra tenant where Permissions Management is enabled. This Entra Admin Center application is used to set up an OIDC connection to your GCP environment.   

*OpenID Connect (OIDC) is an interoperable authentication protocol based on the OAuth 2.0 family of specifications.* 

 
### Prerequisites 
A user with the ability to create a new app registration in Entra (needed to facilitate the OIDC connection) is needed for AWS and GCP onboarding. 
 
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

![Diagram, GCP Permissions Management connection for OIDC app.](media/permissions-management-quickstart-guide/quickstart-entra-tenant.png)

To onboard your GCP environment and configure data collection, see [Onboard a GCP project](onboard-gcp.md).

## Summary

Congratulations! You've finished configuring data collection for your environment(s), and the data collection process has begun.  

The status column in your Permissions Management UI shows you which step of data collection you are at.  

 
- **Pending**: Permissions management has not started detecting or onboarded yet. 
- **Discovering**: Permissions management is detecting the authorization systems. 
- **In progress**: Permissions management has finished detecting the authorization systems and has started onboarding. 
- **Onboarded**: data collection has completed, and all detected authorization systems have been successfully onboarded to Permissions Management. 

> [!NOTE] 
> Data collection might take time depending on the amount of authorization systems you've onboarded. While the data collection process continues, you can begin setting up [users and groups in Permissions Management](how-to-add-remove-user-to-group.md). 

## Next steps

- [Enable or disable the controller after onboarding](onboard-enable-controller-after-onboarding.md)
- [Add an account/subscription/project after onboarding is complete](onboard-add-account-after-onboarding.md)

References:
- Permissions Management operational guide tbd.md
- Troubleshooting guide
- Permissions Management best practices guide
- [Permissions Management Glossary](multi-cloud-glossary.md)
- [Permissions Management FAQs](faqs.md)