---
title: Govern Teams meeting experience with Azure Communication Services
description: Learn how you can design Teams meeting experience for virtual appointments applications.
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 04/03/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop

---

# Govern meeting experience
In this article, you learn how to use existing Microsoft 365 tools to control the experience of your virtual visits with Microsoft Teams. You learn the best practices and considerations for individual approaches. Administrators and meeting organizers can control the experience in Teams meetings by the following tools: tenant configuration, tenant policy, assigned role, meeting options, meeting templates, and sensitivity labels. You can learn more about individual tools in [this article](../guest/teams-administration.md).

## Policies, roles & meeting options
Teams policies, meeting roles, and meeting options are part of standard Microsoft Teams. A meeting organizer and coorganizer can customize the experience via meeting options. Organizations have two options how to prevent hosts of virtual appointments from changing the meeting experience:
1.	Control the experience via policy.
1.	Demote the host to the role presenter.

We recommend using policy to control the experience of the Teams meeting. Here's how to do it:
Teams administrator creates a new meeting policy that defines desired experience in the Teams meeting and assigns the meeting policy to selected Teams users that conduct virtual appointments. When a Teams user creates a Teams meeting, the assigned policy restricts, hides, or disables features in the Teams meeting for all participants. 

|Pros|	Cons|
|--|--|
| Teams user can't modify the experience defined by administrator	| The policy affects all meetings organized by the Teams user
| If an Azure Communication Services user joins the meeting, Azure Monitor Logs get Call Summary and Call Diagnostics for the organizer. 	| Host can't lower the requirements if the meeting doesn't require strict requirements.

Another approach is using a dedicated user account in the tenant to schedule Teams meeting for virtual appointments. This user is an organizer that shapes the experience via assigned meeting policy and then customizes the experience via meeting options. Hosts are invited as presenters and, therefore, can't control meeting options. This approach significantly reduces the flexibility of the experience and therefore isn't recommended.

|Pros|	Cons|
|--|--|
|All Teams users can have assigned relaxed policies, as part of the enforcement is done through meeting options	| There's a risk that customers with the role presenter can demote the host to an attendee. 
|Teams user can't modify the experience defined by administrator	| If the Azure Communication Services user joins the meeting, Azure Monitor Logs won't get Call Summary and Call Diagnostics for the host unless the Azure Communication Services resource is in the same tenant.
||[Teams user can create only 2000 meetings a month](/graph/throttling-limits#cloud-communication-service-limits), which limits scalability of the solution. 
||Impacts analytics and reporting.
||Host can't lower the requirements if the meeting doesn't require strict requirements.

## Meeting templates – Teams premium
Microsoft Premium provides a new way how to design a meeting experience. Meeting templates allow developers to configure experience just for virtual appointments. On top of meeting templates, it provides more features and controls that can control the experience of the meeting. When a Teams user schedules a virtual appointment, some meeting options can have a preselected default value, some values can be locked, and some entirely hidden.

|Pros|	Cons|
|--|--|
|Teams user can't modify the experience defined by administrator | Host can't lower the requirements if the meeting doesn't require strict requirements.
|If an Azure Communication Services user joins the meeting, Azure Monitor Logs get Call Summary and Call Diagnostics for the organizer.| 	
|Provides more meeting options to control the experience.	|

## Sensitivity label – Microsoft Purview
Microsoft Purview allows administrators to protect information with sensitivity labels. Teams meeting can have assigned sensitivity labels via template or on the creation of the meeting. If the meeting template permits it, the meeting organizer can change the experience via a sensitivity label during the meeting and, in case of lowering the requirements, can justify this action. This tool provides more flexibility to the meeting host, which also complies with the organization's requirements.

|Pros|	Cons|
|--|--|
|Teams users can't modify the experience defined by the administrators	
|If an Azure Communication Services user joins the meeting, Azure Monitor Logs get Call Summary and Call Diagnostics for the organizer. 	
|Provides more meeting options to control the experience.	
|Host can lower the requirements if the meeting doesn't require strict requirements.	

## Next steps
- [Overview of virtual appointments](./overview.md)
- [Build your own virtual appointments](../../../tutorials/virtual-visits/sample-builder.md)
- [Learn about Teams controls](../guest/teams-administration.md).
- [Plan user experience in Teams meetings](./plan-user-experience.md)
