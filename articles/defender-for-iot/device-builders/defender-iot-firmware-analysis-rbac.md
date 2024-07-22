---
title: Azure role-based access control for Defender for IoT Firmware analysis
description: Learn about how to use Azure Role-Based Access Control for Defender for IoT Firmware Analysis.
ms.topic: conceptual
ms.date: 01/10/2024
---

# Overview of Azure Role-Based Access Control for Defender for IoT Firmware Analysis
As a user of Defender for IoT Firmware Analysis, you may want to manage access to your firmware image analysis results. Azure Role-Based Access Control (RBAC) is an authorization system that enables you to control who has access to your analysis results, what permissions they have, and at what level of the resource hierarchy. This article explains how to store firmware analysis results in Azure, manage access permissions, and use RBAC to share these results within your organization and with third parties. To learn more about Azure RBAC, visit [What is Azure role-based access control (Azure RBAC)?](../../../articles/role-based-access-control/overview.md).

## Roles
Roles are a collection of permissions packaged together. There are two types of roles:

* **Job function roles** give users permission to perform specific job functions or tasks, such as **Key Vault Contributor** or **Azure Kubernetes Service Cluster Monitoring User**. 
* **Privileged administrator roles** give elevated access privileges, such as **Owner**, **Contributor**, or **User Access Administrator**. To learn more about roles, visit [Azure built-in roles](../../../articles/role-based-access-control/built-in-roles.md).

In Defender for IoT Firmware Analysis, the most common roles are Owner, Contributor, Security Admin, and Firmware Analysis Admin. Learn more about [which roles you need for different permissions](../../../articles/defender-for-iot/device-builders/defender-iot-firmware-analysis-rbac.md#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities), such as uploading firmware images or sharing firmware analysis results. 

## Understanding the Representation of Firmware Images in the Azure Resource Hierarchy
Azure organizes resources into resource hierarchies, which are in a top-down structure, and you can assign roles at each level of the hierarchy. The level at which you assign a role is the "scope," and lower scopes may inherit roles assigned at higher scopes. Learn more about the [levels of hierarchy and how to organize your resources in the hierarchy](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources).

When you onboard your subscription to Defender for IoT Firmware Analysis and select your resource group, the action automatically creates the **default** resource within your resource group.
 
Navigate to your resource group and select **Show hidden types** to show the **default** resource. The **default** resource has the **Microsoft.IoTFirmwareDefense.workspaces** type.

:::image type="content" source="media/defender-for-iot-firmware-analysis-rbac/default-workspace.png" alt-text="Screenshot of the toggle button 'Show hidden types' that reveals a resource named 'default'." lightbox="media/defender-for-iot-firmware-analysis-rbac/default-workspace.png":::
 
Although the **default** workspace resource isn't something that you'll regularly interact with, each firmware image that you upload will be represented as a resource and stored here.

You can use RBAC at each level of the hierarchy, including at the hidden **default Firmware Analysis Workspace** resource level. 

Here's the resource hierarchy of Defender for IoT Firmware Analysis:

:::image type="content" source="media/defender-for-iot-firmware-analysis-rbac/resource-hierarchy.png" alt-text="Diagram that shows the resource hierarchy of firmware images of Defender for IoT Firmware Analysis." lightbox="media/defender-for-iot-firmware-analysis-rbac/resource-hierarchy.png":::

## Apply Azure RBAC

> [!Note]
> To begin using Defender for IoT Firmware Analysis, the user that onboards the subscription onto Defender for IoT Firmware Analysis ***must be*** an Owner, Contributor, Firmware Analysis Admin, or Security Admin at the subscription level. Follow the tutorial at [Analyze a firmware image with Microsoft Defender for IoT](../../../articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md#onboard-your-subscription-to-use-defender-for-firmware-analysis) to onboard your subscription. Once you've onboarded your subscription, a user only needs to be a Firmware Analysis Admin to use Defender for IoT Firmware Analysis.
> 

As a user of Defender for IoT Firmware Analysis, you may need to perform certain actions for your organization, such as uploading firmware images or sharing analysis results.

Actions like these involve Role Based Access Control (RBAC). To effectively use RBAC for Defender for IoT Firmware Analysis, you must know what your role assignment is, and at what scope. Knowing this information will inform you about what permissions you have, and thus whether you can complete certain actions. To check your role assignment, refer to [Check access for a user to a single Azure resource - Azure RBAC](../../../articles/role-based-access-control/check-access.md). Next, see the following table to check what roles and scopes are necessary for certain actions.

### Common roles in Defender for IoT Firmware Analysis

This table categorizes each role and provides a brief description of their permissions:

**Role** | **Category** | **Description**
---|---|---
**Owner** | Privileged administrator role | Grants full access to manage all resources, including the ability to assign roles in Azure RBAC.
**Contributor** | Privileged administrator role | Grants full access to manage all resources, but doesn't allow you to assign roles in Azure RBAC, manage assignments in Azure Blueprints, or share image galleries.
**Security Admin** | Job function role | Allows the user to upload and analyze firmware images in Defender for IoT, add/assign security initiatives, and edit the security policy. [Learn more](../../../articles/defender-for-cloud/permissions.md).
**Firmware Analysis Admin** | Job function role | Allows the user to upload and analyze firmware images in Defender for IoT. The user has no access beyond firmware analysis (can't access other resources in the subscription, create or delete resources, or invite other users).

## Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities

The following table summarizes what roles you need to perform certain actions. These roles and permissions apply at the Subscription and Resource Group levels, unless otherwise stated.

**Action** | **Role required**
:---|:---
Analyze firmware | Owner, Contributor, Security Admin, or Firmware Analysis Admin
Invite third party users to see firmware analysis results | Owner
Invite users to the Subscription | Owner at the **Subscription** level (Owner at the Resource Group level **cannot** invite users to the Subscription)

## Uploading Firmware images
To upload firmware images:

* Confirm that you have sufficient permission in [Defender for IoT Firmware Analysis Roles, Scopes, and Capabilities](#defender-for-iot-firmware-analysis-roles-scopes-and-capabilities).
* [Upload a firmware image for analysis](../../../articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md#upload-a-firmware-image-for-analysis).

## Invite third parties to interact with your firmware analysis results
You might want to invite someone to interact solely with your firmware analysis results, without allowing access to other parts of your organization (like other resource groups within your subscription). To allow this type of access, invite the user as a Firmware Analysis Admin at the Resource Group level.

To invite a third party, follow the [Assign Azure roles to external guest users using the Azure portal](../../../articles/role-based-access-control/role-assignments-external-users.md#invite-an-external-user-to-your-directory) tutorial.

* In step 3, navigate to your resource group.
* In step 7, select the **Firmware Analysis Admin** role.

> [!Note]
> If you received an email to join an organization, be sure to check your Junk folder for the invitation email if you don't see it in your inbox.
> 