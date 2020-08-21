---
title: Change lifecycle settings for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to change requestor information & lifecycle settings for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/18/2020
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package to include requestor infromation to screen requestors and get requestors the resources they need to perform their job.

---
# Change requestor information and lifecycle settings for an access package in Azure AD entitlement management

As an access package manager, you can change the requestor information and lifecycle settings for an access package at any time by editing an existing policy. If you change the expiration date for a policy, the expiration date for requests that are already in a pending approval or approved state will not change.

This article describes how to change the requestor information and lifecycle settings for an existing access package.

## Open requestor information
To ensure users have the right access to an access package, custom questions can be configured to ask users requesting access to certain access packages. Configuration options include: localization, required/optional, and text/multiple choice answer formats. Requestors  will see the questions when they request the package and approvers see the answers to the questions to help them make their decision. Use the following steps to configure questions in an access package:


**Prerequisite role:**

1. Make sure the catalog of the access package you want to add questions too is configured for the apps in it require attributes. For steps to do this, see

1. If creating a new package:
    1. Click "New access package" on the Access packages page
    
    1. Fill out Basics, Resource roles, Requests, Lifecycle tabs based on your needs (more info on aka.ms/elmdocs)
    
    1. Go to the "Requestor information" blade and the "Questions" sub tab 
    
    1. Enter the display string for the question
    
    1. If you would like to add your own localization options, click "add localization"
    
    1. Select the format you would like requestors to answer in

    1. If selecting multiple choice, click on the "view and edit" button to configure the answer options

1.	If using an existing package:
    1. Navigate to the package
    1. Go to the policies tab and create a new policy or edit an existing policy
    1. Go to the "Requestor information" tab 
    1. Follow steps used to configure questions for a new package.

##View 

1. Go to any policy for the package

1. Click on the **Requestor information** page

1. Click on the **Attributes** sub-tab

1. Here you will see all of the attributes required for all applications in this package

    1. If a user does not have one of these attributes when requesting a package, they will be prompted to supply it. 
    1. If they already have this attribute filled out, we will not ask them again.

The approver of a request will see any attributes the requestor supplies when they are reviewing the request in Request details 


## Open lifecycle settings

To change the lifecycle settings for an access package, you need to open the corresponding policy. Follow these steps to open the lifecycle settings for an access package.

**Prerequisite role:** Global administrator, User administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies** and then click the policy that has the lifecycle settings you want to edit.

    The Policy details pane opens at the bottom of the page.

    ![Access package - Policy details pane](./media/entitlement-management-shared/policy-details.png)

1. Click **Edit** to edit the policy.

    ![Access package - Edit policy](./media/entitlement-management-shared/policy-edit.png)

1. Click the **Lifecycle** tab to open the lifecycle settings.

[!INCLUDE [Entitlement management lifecycle policy](../../../includes/active-directory-entitlement-management-lifecycle-policy.md)]

## Next steps

- [Change request and approval settings for an access package](entitlement-management-access-package-request-policy.md)