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
- **Source code assessment for migration**: Assess your existing on-premise Spring applications for their readiness to migrate to Azure Spring Apps with Cloud Suitability Analyzer. The tool will provide you information on what types of changes will be needed for migration, and how much effort will be involved. [Learn more.](https://aka.ms/cloud-suitability-analyzer)

The following updates are now available in the enterprise plan:
- **More Options For build pools and allow queue build jobs**:
Build service now supports big size build agent pool and allows at most one pool-sized build task to build and twice the pool-sized build tasks to queue. [Learn more.](how-to-enterprise-build-service#build-agent-pool)

- **99.95% SLA support**: Higher SLA for mission-critical workloads.

- **High vCPU and Memory app support**: Support to deploy large CPU and memory applications to support CPU intensive or memory intensive workloads. [Learn more.](how-to-enterprise-large-cpu-memory-applications)

- **SCG APM & certificate verification support**: Allow to configure APM and TLS certificate verification between Spring Cloud Gateway and applications. [Learn more.](how-to-configure-enterprise-spring-cloud-gateway?tabs=Azure-portal#configure-application-performance-monitoring)

- **Tanzu Components on demand**: allow to enable or disable Tanzu component after service provisioning, you can learn how to do that per Tanzu component doc. [Learn more.](how-to-enterprise-application-configuration-service?tabs=Portal#enabledisable-application-configuration-service-after-service-creation)
