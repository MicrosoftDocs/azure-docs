---
title: 'Lifecycle workflows FAQs - Azure AD (preview)'
description: Frequently asked questions about Lifecycle workflows (preview).
services: active-directory
author: amsliu
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.subservice: compliance
ms.date: 03/24/2022
ms.author: amsliu
ms.reviewer: krbain
ms.custom: template-tutorial
---
# Lifecycle workflows - FAQs (Preview)

## Frequently asked questions

### Can I create custom workflows for guests?

Yes, custom workflows can be configured for members or guests in your tenant. Workflows can run for all types of external guests, external members, internal guests and internal members.

### Do I need to map employeeHireDate in provisioning apps like WorkDay?

Yes, key user properties like employeeHireDate and employeeType are supported for user provisioning from HR apps like WorkDay. To use these properties in Lifecycle workflows, you will need to map them in the provisioning process to ensure the values are set. The following is an example of the mapping:

![Screenshot showing an example of how mapping is done in a Lifecycle Workflow.](./media/workflows-faqs/workflows-mapping.png)

### How do I see more details and parameters of tasks and the attributes that are being updated? 

Some tasks do update existing attributes; however, we don’t currently share those specific details. As these tasks are updating attributes related to other Azure AD features, so you can find that info in those docs. For temporary access password, we’re writing to the appropriate attributes listed [here](workflows-faqs.md). 

### Is it possible for me to create new tasks and how? For example, triggering other graph APIs/web hooks?

We currently support extensibility with Logic Apps based on the concept of Custom Task Extensions, for more details please refer to [Trigger Logic Apps based on custom task extensions](trigger-custom-task.md).

## Next steps

- [What are Lifecycle workflows? (Preview)](what-are-lifecycle-workflows.md)