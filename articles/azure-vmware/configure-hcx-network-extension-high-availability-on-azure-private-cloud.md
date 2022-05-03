---
title: Configure HCX network extension high availability on Azure private cloud
description: Learn how to configure HCX network extension high availability
ms.topic: how-to
ms.date: 05/06/2022
---

# HCX Network extension high availability (HA)

VMware HCX is an application mobility platform that's designed to simplify application migration, workload re-balancing, and business continuity across data centers and clouds. 

The HCX Network Extension service provides layer 2 connectivity between sites. Network Extension HA protects extended networks from a Network Extension appliance failure at either the source or remote site. 

HCX 4.3.0 or newer allows network extension high availability. Network Extension HA operates in Active/Standby mode. In this article, you'll learn how to configure HCX network extension High Availability on Azure private cloud.

## Prerequisites

The Network Extension High Availability (HA) setup requires four Network Extension appliances, with two appliances at the source site and two appliances at the remote site. Together, these two pairs form the HA Group, which is the mechanism for managing Network Extension High Availability. Appliances on the same site require a similar configuration and must have access to the same set of resources.

