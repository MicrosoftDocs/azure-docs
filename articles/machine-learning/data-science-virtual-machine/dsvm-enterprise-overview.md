---
title:  Team analytics and AI environment
titleSuffix: Azure Data Science Virtual Machine 
description: Patterns for deploying the Data Science VM in an enterprise team environment.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
ms.service: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: overview
ms.reviewer: franksolomon
ms.date: 04/10/2024
---

# Data Science Virtual Machine-based team analytics and AI environment 
The [Data Science Virtual Machine](overview.md) (DSVM) provides a rich environment on the Azure platform, with prebuilt software for artificial intelligence (AI) and data analytics.

Traditionally, the DSVM has been used as an individual analytics desktop. This shared, prebuilt analytics environment boosts productivity for scientists. As large analytics teams plan environments for their data scientists and AI developers, one recurring theme is a shared development and experimentation analytics infrastructure. This infrastructure is managed consistent with enterprise IT policies that also facilitate collaboration and consistency across the data science and analytics teams.

A shared infrastructure improves IT utilization of the analytics environment. Some organizations describe the team-based data science/analytics infrastructure as an *analytics sandbox*. It enables data scientists to access various data assets to rapidly understand and handle that data. This sandbox environment also helps data scientists run experiments, validate hypotheses, and build predictive models that don't affect the production environment.

Because the DSVM operates at the Azure infrastructure level, IT administrators can readily configure the DSVM to operate in compliance with enterprise IT policies. The DSVM offers full flexibility to implement various sharing architectures, and it offers access to corporate data assets in a controlled way.

This section discusses patterns and guidelines that you can use to deploy the DSVM as a team-based data science infrastructure. Because the building blocks for these patterns come from Azure infrastructure as a service (IaaS), they apply to any Azure VMs. This series of articles focuses on application of these standard Azure infrastructure capabilities to the DSVM.

Key building blocks of an enterprise team analytics environment include:

* [An autoscaled pool of DSVMs](dsvm-pools.md)
* [Common identity and access to a workspace from any of the DSVMs in the pool](dsvm-common-identity.md)
* [Secure access to data sources](dsvm-secure-access-keys.md)

This series provides guidance and tips for each of the preceding topics. It doesn't cover all the considerations and requirements for deploying DSVMs in large enterprise configurations. Here are some other Azure resources that you can use while implementing DSVM instances in your enterprise:

* [Network security](../../security/fundamentals/network-overview.md)
* [Monitoring](../../azure-monitor/vm/monitor-vm-azure.md) and [management](../../virtual-machines/maintenance-and-updates.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json%252c%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json%253ftoc%253d%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Logging and auditing](../../security/fundamentals/log-audit.md)
* [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)
* [Policy setting and enforcement](../../governance/policy/overview.md)
* [Antimalware](../../security/fundamentals/antimalware.md)
* [Encryption](../../virtual-machines/windows/disk-encryption-overview.md)
* [Data discovery and governance](../../data-catalog/index.yml)

Finally, the [Azure Architecture Center](/azure/architecture/) provides a detailed end-to-end architecture and models for building and managing your cloud-based analytics infrastructure.