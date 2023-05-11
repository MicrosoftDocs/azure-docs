---
title: What's new in Azure Spring Apps
description: This page highlights new features and recent improvements for Azure Spring Apps
author: hangwan97
ms.author: hangwan
ms.service: data-factory
ms.subservice: concepts
ms.topic: overview
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
ms.date: 05/07/2023
---

# What's new in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

Azure Spring Apps is improved on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the latest releases.

This page is updated quarterly, so revisit it regularly.  For older updates, refer to the [What's new archive](whats-new-archive.md).

## March 2023

The following updates are now available in both basic/standard and enterprise plan:

- **Source code assessment for migration**: Assess your existing on-premises Spring applications for their readiness to migrate to Azure Spring Apps with Cloud Suitability Analyzer. This tool provides information on what types of changes are for migration, and how much effort is involved. For more information, see [Assess Spring applications with Cloud Suitability Analyzer](https://aka.ms/cloud-suitability-analyzer).

The following updates are now available in the enterprise plan:

- **More Options For build pools and allow queue build jobs**:
Build service now supports a large size build agent pool and allows at most one pool-sized build task to build, and twice the pool-sized build tasks to queue. For more information, see the [Build agent pool](how-to-enterprise-build-service.md#build-agent-pool) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

- **99.95% SLA support**: Higher SLA for mission-critical workloads.

- **High vCPU and Memory app support**: Deployment support for large CPU and memory applications to support CPU intensive or memory intensive workloads. For more information, see [Deploy large CPU and memory applications in Azure Spring Apps in the Enterprise tier](how-to-enterprise-large-cpu-memory-applications.md).

- **SCG APM & certificate verification support**: You can allow configuration of APM and TLS certificate verification between Spring Cloud Gateway and applications. For more information, see the [Configure application performance monitoring](how-to-configure-enterprise-spring-cloud-gateway.md#configure-application-performance-monitoring) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Tanzu Components on demand**: You can allow enabling or disabling of Tanzu components after service provisioning. You can also learn how to do that per Tanzu component doc. For more information, see the [Enable/disable Application Configuration Service after service creation](how-to-enterprise-application-configuration-service.md#enabledisable-application-configuration-service-after-service-creation) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).
