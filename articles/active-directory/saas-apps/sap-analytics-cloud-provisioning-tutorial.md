---
title: 'Tutorial: Configure SAP Analytics Cloud for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to SAP Analytics Cloud.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 27d12989-efa8-4254-a4ad-8cb6bf09d839
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure SAP Analytics Cloud for automatic user provisioning

This tutorial describes the steps you need to perform in both SAP Analytics Cloud and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [SAP Analytics Cloud](https://www.sapanalytics.cloud/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 

> [!NOTE]
> We are working with SAP to deploy a new gallery application that provides a single point to configure your SAP Analytics Cloud application.

## Capabilities supported
> [!div class="checklist"]
> * Create users in SAP Analytics Cloud
> * Remove users in SAP Analytics Cloud when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and SAP Analytics Cloud
> * [Single sign-on](sapboc-tutorial.md) to SAP Analytics Cloud (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A SAP Analytics Cloud tenant
* A user account on SAP Identity Provisioning admin console with Admin permissions. Make sure you have access to the proxy systems in the Identity Provisioning admin console. If you don't see the **Proxy Systems** tile, create an incident for component **BC-IAM-IPS** to request access to this tile.
* An OAuth client with authorization grant Client Credentials in SAP Analytics Cloud. To learn how, see: [Managing OAuth Clients and Trusted Identity Providers](https://help.sap.com/viewer/00f68c2e08b941f081002fd3691d86a7/release/en-US/4f43b54398fc4acaa5efa32badfe3df6.html)

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can follow the steps below and configure it in the same way as you do from public cloud.


## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who is in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and SAP Analytics Cloud](../app-provisioning/customize-application-attributes.md). 

## Step 2: Configure SAP Analytics Cloud to support SSO with Microsoft Entra ID

Follow the set of instructions available for our SAP Cloud analytics SSO [tutorial](sapboc-tutorial.md)


<a name='step-3-create-microsoft-entra-id-groups-for-your-sap-business-roles'></a>

## Step 3: Create Microsoft Entra groups for your SAP business roles

Create Microsoft Entra groups for your SAP business roles


## Step 4: Map the created groups to your SAP business roles 

Go to [SAP Help Portal](https://help.sap.com/docs/identity-provisioning/identity-provisioning/microsoft-azure-active-directory) to map the created groups to your business roles. If you get stuck, you can get further guidance from [SAP Blogs](https://blogs.sap.com/2022/02/04/provision-users-from-microsoft-azure-ad-to-sap-cloud-identity-services-identity-authentication/)  


<a name='step-5-assign-users-as-members-of-the-microsoft-entra-id-groups'></a>

## Step 5: Assign Users as members of the Microsoft Entra groups 

Assign users as members of the Microsoft Entra groups and give them app role assignments

* Start small. Test with a small set of users and groups before rolling out to everyone.

Check the users have the right access in SAP downstream targets and when they sign in, they have the right roles.
