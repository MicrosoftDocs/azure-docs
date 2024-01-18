---
title: Azure Role-Based Access Control for Defender for IoT Firmware Analysis
description: Learn about how to use Azure Role-Based Access Control for Defender for IoT Firmware Analysis.
ms.topic: conceptual
ms.date: 01/10/2024
---

# Overview of Azure Role-Based Access Control for Defender for IoT Firmware Analysis
As a user of Defender for IoT Firmware Analysis, you may want to manage access to your firmware image analysis results. Azure Role-Based Access Control (RBAC) is an authorization system that enables you to control who has access to your analysis results, what permissions they have, and at what level of the resource hierarchy. This article explains how to store firmware analysis results in Azure, manage access permissions, and use RBAC to share these results within your organization and with third parties. To learn more about Azure RBAC, visit [What is Azure role-based access control (Azure RBAC)?](/articles/role-based-access-control/overview.md).

## Roles
Roles are a collection of permissions packaged together. There are two categories of roles that you'll encounter when assigning roles to users: job function roles and privileged administrator roles. Job function roles are roles that give users permission to perform specific job functions or tasks, such as **Key Vault Contributor** or **Azure Kubernetes Service Cluster Monitoring User**. Privileged administrator roles are roles that give elevated access privileges, such as **Owner**, **Contributor**, or **User Access Administrator**. To learn more about roles, visit [Azure built-in roles](/articles/role-based-access-control/built-in-roles.md).

The most used roles by Defender for IoT Firmware Analysis’s users are Owner, Contributor, Security Admin, and Firmware Analysis Admin. To learn more about which roles you need for permissions such as uploading firmware images or sharing firmware analysis results, visit [Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities](#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities). 

## Understanding the Representation of Firmware Images in the Azure Resource Hierarchy
Azure organizes resources into resource hierarchies, which are in a top-down structure, and you can assign roles at each level of the hierarchy. The level at which you assign a role is the "scope," and lower scopes may inherit roles assigned at higher scopes. To learn more about the levels of hierarchy and how to effectively organize your resources into the hierarchy, visit [Organize your Azure resources effectively](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources).

When you register your subscription to the Defender for IoT Firmware Analysis tool, the action automatically creates the **FirmwareAnalysisRG** Resource Group for you. To locate **FirmwareAnalysisRG**, navigate to your Resource Groups page in the left menu:

:::image type="content" source="media/defender-for-iot-firmware-analysis-rbac/firmware-analysis-rg.png" alt-text="Location of the FirmwareAnalysisRG Resource Group.":::
 
Within **FirmwareAnalysisRG** is the **default** resource, of type **Microsoft.iotfirmwaredefense.workspace**. This resource is hidden by default, so to see it, you must toggle “Show hidden types”:

:::image type="content" source="media/defender-for-iot-firmware-analysis-rbac/default-workspace.png" alt-text="Toggle 'Show hidden types' to reveal a resource named 'default'.":::
 
Although the **default** workspace resource isn't something that you'll regularly interact with, each firmware image that you upload will be represented as a resource and stored here.

You can use RBAC at each level of the hierarchy, including at the hidden **default Firmware Analysis Workspace** resource level. 

Here's the resource hierarchy of Defender for IoT Firmware Analysis:

:::image type="content" source="media/defender-for-iot-firmware-analysis-rbac/resource-hierarchy.png" alt-text="Hidden 'default' resource, of type 'Microsoft.iotfirmwaredefense.workspace'.":::

## Applying Azure RBAC
The following table describes what category each of these roles falls into and a brief description of their permissions:
### Most used roles by Defender for IoT Firmware Analysis’s users

**Role** | **Category** | **Description**
---|---|---
**Owner** | Privileged administrator role | Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.
**Contributor** | Privileged administrator role | Grants full access to manage all resources, but doesn't allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
**Security Admin** | Job function role | Upload and analyze firmware images in Defender for IoT; Add/assign security initiatives; Edit security policy. To learn more about this role, visit [User roles and permissions - Microsoft Defender for Cloud](/articles/defender-for-cloud/permissions.md)
**Firmware Analysis Admin** | Job function role | Upload and analyze firmware images in Defender for IoT. No access beyond firmware analysis (Can't access other resources in the subscription, create or delete resources, or invite other users).
||

As a user of Defender for IoT Firmware Analysis, you may need to perform certain actions for your organization, such as uploading firmware images or sharing analysis results.

> [!Note]
> To begin using Defender for IoT Firmware Analysis, the user that onboards the subscription onto Defender for IoT Firmware Analysis ***must be*** a subscription Owner or Contributor. Follow the tutorial at [Analyze a firmware image with Microsoft Defender for IoT](/articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md) to onboard your subscription. Once you've onboarded your subscription, a user only needs to be a Firmware Analysis Admin to use Defender for IoT Firmware Analysis.
> 

Actions like these involve Role Based Access Control (RBAC). To effectively use RBAC for Defender for IoT Firmware Analysis, you must know what your role assignment is, and at what scope. Knowing this information will inform you about what permissions you have, and thus whether you can complete certain actions. To check your role assignment, refer to [Check access for a user to a single Azure resource - Azure RBAC](/articles/role-based-access-control/check-access.md). Next, see the following table to check what roles and scopes are necessary for certain actions.

## Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities

The following table summarizes what roles you need to perform certain actions. These roles and permissions apply at the Subscription and Resource Group levels, unless otherwise stated.

**Action** | **Role required**
:---|:---
Analyze firmware | Owner, Contributor, Security Admin, or Firmware Analysis Admin
Invite third party users to see firmware analysis results | Owner
Invite users to the Subscription | Owner at the **Subscription** level (Owner at the Resource Group level **cannot** invite users to the Subscription)
||

## Uploading Firmware Images
To upload firmware images, first confirm that you have sufficient permission to do so by referring to [Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities](#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities).

Once you have confirmed that you have an appropriate role to upload firmware images, refer to the following tutorial to upload a firmware image for analysis: [Analyze a firmware image with Microsoft Defender for IoT](/articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md). 

## Inviting third parties to interact with your firmware analysis results
If you'd like to invite someone to interact solely with your firmware analysis results without having access to other parts of your organization, like other resource groups within your subscription, you'll need to invite them as a Firmware Analysis Admin at the FirmwareAnalysisRG Resource Group level. 

Follow the tutorial here to invite a third party: [Assign Azure roles to external guest users using the Azure portal](/articles/role-based-access-control/role-assignments-external-users.md#add-a-guest-user-to-your-directory). Keep in mind that for Step 3, you'll be navigating to the **FirmwareAnalysisRG** Resource Group. And at Step 7, select the **Firmware Analysis Admin** role.

> [!Note]
> If you received an email to join an organization, be sure to check your Junk folder for the invitation email if you don't see it in your inbox.
> 