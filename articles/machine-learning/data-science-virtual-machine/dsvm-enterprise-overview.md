---
title: Introduction to the Data Science Virtual Machine based Team environments - Azure | Microsoft Docs
description: Patterns for deploying Data Science VM as enterprise teams environment.
keywords: deep learning, AI, data science tools, data science virtual machine, geospatial analytics, team data science process
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: 
ms.service: machine-learning
ms.component: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: gokuma
---

# Data Science Virtual Machine based Team Analytics and AI Environment 
The [Data Science Virtual Machine](overview.md) (DSVM) provides a rich environment on the Azure Cloud with pre-built software for AI and data analytics. Traditionally the DSVM has been used as individual analytics desktop and individual data scientists gain productivity with this shared notion of their pre-built analytics environment. As large analytics teams plan their analytics environments for their data scientists and AI developers, one of the recurring themes is for a shared analytics development and experimentation infrastructure that is managed in line with the enterprise IT policies that also facilitates collaboration and consistency across the entire data science / analytics teams. A shared infrastructure also enables IT to better utilize the analytics environment. The team-based data science / analytics infrastructure is also referred by some organizations as an "Analytics Sandbox" that allows the data scientists to rapidly understand data, run experiments, validate hypothesis, build predictive models in a safe manner without impacting the production environment while having access to various data assets. 

Since the DSVM operates at the Azure infrastructure level, the IT administrators can readily configure the DSVM to operate in compliance with the IT  policies of the enterprise and offers full flexibility in implementing various sharing architectures with access to corporate data assets in a controlled manner. 

This section discusses some patterns and guidelines that can be used to deploy the DSVM as a team-based data science infrastructure.  The building blocks for these patterns are directly leveraged from Azure IaaS (infrastructure as a service) and as such applicable to any Azure VMs. The specific focus of this series of articles is on applying these standard Azure infrastructure capabilities to the Data Science VM. 

Some of the key building blocks of an enterprise team analytics environment are:

* [Auto-scaled pool of Data Science Virtual Machines](dsvm-pools.md)
* [Common Identity and access to workspace from any of the DSVMs in the pool](dsvm-common-identity.md)
* [Secure Access to data sources](dsvm-secure-access-keys.md)


In this series of articles, guidance and pointers are provided in each of these above aspects. Obviously, there are several additional considerations and needs when deploying DSVM in large enterprise configurations that is not yet directly covered in this series of articles. Here are some of the other considerations and pointers to general Azure documentation that can be readily used while implementing it on the DSVM instances in your enterprise. 

* [Network Security](https://docs.microsoft.com/azure/security/azure-network-security)
* [Monitoring](https://docs.microsoft.com/azure/virtual-machines/windows/monitor) and [Management](https://docs.microsoft.com/azure/virtual-machines/windows/maintenance-and-updates)
* [Logging and Auditing](https://docs.microsoft.com/azure/security/azure-log-audit)
* [Role based access control](https://docs.microsoft.com/azure/role-based-access-control/overview)
* [Policy setting and enforcement](https://docs.microsoft.com/azure/azure-policy/azure-policy-introduction)
* [Anti-malware](https://docs.microsoft.com/azure/security/azure-security-antimalware)
* [Encryption](https://docs.microsoft.com/azure/virtual-machines/windows/encrypt-disks)
* [Data Discovery and Governance](https://docs.microsoft.com/azure/data-catalog/)

The [Azure architecture center](https://docs.microsoft.com/en-us/azure/architecture/) is also a great resource that provides detailed end-to-end architecture and patterns for building and managing your cloud based analytics infrastructure. 
