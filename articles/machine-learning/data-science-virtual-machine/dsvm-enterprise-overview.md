---
title:  Team analytics and AI environment
titleSuffix: Azure Data Science Virtual Machine 
description: Patterns for deploying the Data Science VM in an enterprise team environment.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: overview
ms.date: 05/08/2018
---

# Data Science Virtual Machine-based team analytics and AI environment 
The [Data Science Virtual Machine](overview.md) (DSVM) provides a rich environment on the Azure platform, with prebuilt software for artificial intelligence (AI) and data analytics.

Traditionally, the DSVM has been used as an individual analytics desktop. Individual data scientists gain productivity with this shared, prebuilt analytics environment. As large analytics teams plan environments for their data scientists and AI developers, one of the recurring themes is a shared analytics infrastructure for development and experimentation. This infrastructure is managed in line with enterprise IT policies that also facilitate collaboration and consistency across the data science and analytics teams.

A shared infrastructure enables better IT utilization of the analytics environment. Some organizations call the team-based data science/analytics infrastructure an *analytics sandbox*. It enables data scientists to access various data assets to rapidly understand data. This sandbox environment also helps data scientists run experiments, validate hypotheses, and build predictive models without affecting the production environment.

Because the DSVM operates at the Azure infrastructure level, IT administrators can readily configure the DSVM to operate in compliance with the IT policies of the enterprise. The DSVM offers full flexibility in implementing various sharing architectures while also offering access to corporate data assets in a controlled way.

This section discusses some patterns and guidelines that you can use to deploy the DSVM as a team-based data science infrastructure. Because the building blocks for these patterns come from Azure infrastructure as a service (IaaS), they apply to any Azure VMs. This series of articles focuses on applying these standard Azure infrastructure capabilities to the DSVM.

Key building blocks of an enterprise team analytics environment include:

* [An autoscaled pool of DSVMs](dsvm-pools.md)
* [Common identity and access to a workspace from any of the DSVMs in the pool](dsvm-common-identity.md)
* [Secure access to data sources](dsvm-secure-access-keys.md)


This series provides guidance and pointers for each of the preceding topics. It doesn't cover all the considerations and requirements for deploying DSVMs in large enterprise configurations. Here are some other Azure resources that you can use while implementing DSVM instances in your enterprise:

* [Network security](https://docs.microsoft.com/azure/security/fundamentals/network-security)
* [Monitoring](https://docs.microsoft.com/azure/virtual-machines/windows/monitor) and [management](https://docs.microsoft.com/azure/virtual-machines/windows/maintenance-and-updates)
* [Logging and auditing](https://docs.microsoft.com/azure/security/fundamentals/log-audit)
* [Role-based access control](https://docs.microsoft.com/azure/role-based-access-control/overview)
* [Policy setting and enforcement](../../governance/policy/overview.md)
* [Antimalware](https://docs.microsoft.com/azure/security/fundamentals/antimalware)
* [Encryption](https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption-overview)
* [Data discovery and governance](https://docs.microsoft.com/azure/data-catalog/)

Finally, the [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/) provides a detailed end-to-end architecture and models for building and managing your cloud-based analytics infrastructure.