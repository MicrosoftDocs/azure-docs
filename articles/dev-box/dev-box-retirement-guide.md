---
title: Microsoft Dev Box retirement guide
description: Learn how to prepare for Microsoft Dev Box retirement, evaluate Windows 365, identify affected resources, and plan your transition.
ms.service: dev-box
ms.topic: concept-article
ms.custom: doc-kit-assisted
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/08/2026

#customer intent: As a platform engineer or business decision maker, I want to plan for Microsoft Dev Box retirement and transition developer workflows.

---

# Microsoft Dev Box retirement guide

Microsoft Dev Box retires at 17:00 UTC on 18 September 2028. Start planning your retirement now to check feature differences, secure licenses and capacity, and move developer workflows to the recommended Microsoft solution.

> [!NOTE]
> Move your Microsoft Dev Box workflows to Windows 365 or another appropriate solution by 18 September 2028. Microsoft Dev Box retires on this date. The service starts its closing-down period at 16:00 UTC on 14 September 2026.

## Call to action

Start creating a retirement plan now to check feature dependencies, confirm licensing and capacity, and validate the developer experience in the target environment.

Keep using existing Microsoft Dev Box deployments as a temporary solution while you create and execute your long-term transition plan. Don't create new long-lived dependencies on the retiring service.

Delete unused resources to reduce costs and formally offboard by reviewing dev centers, projects, pools, definitions, network connections, images, and active dev boxes.

## Transition guidance overview

Review the recommended Microsoft solution and other available options that can support secure, managed cloud development environments. These solutions provide different approaches to provisioning, management, networking, image delivery, developer self-service, and cost.

### Microsoft solutions

There are Microsoft solutions that you might consider as replacements for Microsoft Dev Box. These solutions aren't one-to-one replacements, so evaluate each developer scenario and validate architecture, management, security, performance, and user experience before migrating.

#### Windows 365

[Windows 365](https://www.microsoft.com/windows-365) is the recommended path forward for virtualized developer environments. It provides persistent Cloud PCs that you can manage with Microsoft Intune and integrate with Microsoft Entra ID, conditional access, compliance policies, applications, and organizational security controls. Windows 365 supports the Windows 11 developer configuration image, providing developers with a preconfigured environment. Organizations can also deploy approved applications, scripts, policies, and custom images before developers connect.

A range of configurations—including 16-vCPU, 32-vCPU, and GPU-enabled Cloud PCs—allows organizations to match resources to workload requirements. Persistent environments preserve developers’ work across sessions, while identity, security, management, and policy remain centrally governed. Before migration, select the appropriate Windows 365 offering and licensing model; define identity, device management, networking, image, application, storage, capacity, and performance requirements; and pilot representative developer workflows.

Plan migration waves based on business priority, readiness, geography, and support capacity. Provision and validate target Cloud PCs before moving users, transfer required data and configuration through approved processes, monitor the cutover, and remove Dev Box resources after successful validation.

To learn how Windows 365 supports developer productivity and represents the recommended path forward from Dev Box, see the [Windows 365 for developers blog](https://aka.ms/w365dev).

## Common questions about Microsoft Dev Box retirement

### When will Microsoft Dev Box retire?

Microsoft Dev Box will retire at 17:00 UTC on 18 September 2028. The closing-down period begins at 16:00 UTC on 14 September 2026.

### Can I continue using existing Microsoft Dev Box deployments?

Yes. Existing deployments remain supported during the transition period. Start planning and testing your transition now rather than waiting until the retirement date.

### Can I create new Microsoft Dev Box resources during the transition?

Use the current product and subscription experience to determine whether new resource creation remains available. Avoid expanding long-lived dependencies on a retiring service and prioritize investment in the target environment.

### Is Windows 365 a one-to-one replacement for Microsoft Dev Box?

No. Windows 365 is the recommended path forward, but architecture, licensing, management, networking, image delivery, and developer self-service can differ. Validate each workload and don't assume complete feature parity.

### Is there an automated migration tool?

Windows 365 isn't a one-to-one replacement for Microsoft Dev Box. Plan to provision the target Cloud PCs, recreate required policies and configurations, deploy applications, and transfer user data through approved processes. Consult the latest published [migration guidance](/windows-365/enterprise/migration-to-windows365) and contact your Microsoft account before beginning production transitions.

### What happens to remaining Microsoft Dev Box workloads after retirement?

Microsoft Dev Box won't be available after retirement. Expect deletion of remaining customer workloads. Complete migration and data preservation before the retirement deadline.

### How can I identify resources affected by retirement?

Use the [Azure Advisor Service Retirement workbook](/azure/advisor/advisor-workbook-service-retirement) to review affected subscriptions and resources. Supplement the workbook with an organizational inventory of dev centers, projects, pools, definitions, network connections, images, users, role assignments, and automation.

## Related content

- [Microsoft Dev Box documentation](index.yml)
- [Windows 365](https://www.microsoft.com/windows-365)
- [Windows 365 documentation](/windows-365/)
- [Azure Advisor Service Retirement workbook](/azure/advisor/advisor-workbook-service-retirement)
