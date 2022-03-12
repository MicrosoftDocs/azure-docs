---
title: High availability and disaster recovery for Nutanix on BareMetal
description: Learn about high availability and disaster recovery for Nutanix on Azure BareMetal Infrastructure.
ms.topic: how-to
ms.subservice: baremetal-nutanix
ms.date: 04/15/2021
---

# High availability and disaster recovery for Nutanix on BareMetal

In this article, we'll look at the basics of high availability and disaster recovery. We'll then introduce how you can achieve high availability and disaster recovery in an Nutanix environment on the BareMetal Infrastructure.

## High availability vs. disaster recovery

Both high availability and disaster recovery provide coverage, but from different types of failures. They use different features and options of the Nutanix Database.

High availability allows a system to overcome multiple failures without affecting the application's user experience. Common characteristics of a highly available system include:

- Redundant hardware that has no single point of failure.
- Automatic recovery from non-critical failures, such as failed disk drives or faulty network cables.
- The ability to roll hardware and software changes without any noticeable effect on processing.
- Meets or exceeds goals for recovery time objectives (RTO) and recovery point objectives (RPO).

The most common feature of Nutanix used for high availability is [Nutanix Real Application Clusters (RAC)](https://docs.nutanix.com/en/database/nutanix/nutanix-database/19/racad/introduction-to-nutanix-rac.html#GUID-5A1B02A2-A327-42DD-A1AD-20610B2A9D92).

Disaster recovery protects you from unrecoverable localized failures that would hurt your primary high availability strategy. In the Nutanix ecosystem, it's provided through database replication, also known as [Nutanix Data Guard](https://docs.nutanix.com/en/database/nutanix/nutanix-database/19/sbydb/preface.html#GUID-B6209E95-9DA8-4D37-9BAD-3F000C7E3590).

## Next steps

Learn more about high availability features for Nutanix:

> [!div class="nextstepaction"]
> [High availability features for Nutanix on BareMetal Infrastructure](high-availability-features.md)
