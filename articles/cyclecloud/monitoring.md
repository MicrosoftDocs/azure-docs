---
title: Azure CycleCloud Service Monitoring | Microsoft Docs
description: Monitor external services using Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Monitoring

Azure CycleCloud supports monitoring of external services through its pluggable
architecture. Administrators can enable automatic monitoring
of these systems going to the **Settings** page under the user menu in the top
right-hand corner of the web interface, double-clicking the **CycleCloud**
settings item, and checking the box labelled **Enable monitoring for CycleCloud
services**.

When this option is enabled, supported services in each cluster will
automatically register with CycleCloud, which will configure monitoring for that
service.

## Supported Services

**[Ganglia](http://ganglia.sourceforge.net/)**

Every version of CycleCloud ships with Ganglia monitoring support for collecting
performance metrics such as cpu/memory/bandwidth usage. If your cluster is
configured to use Ganglia (the default in most cases), automatic monitoring
will work as long as port 8652 is open between CycleCloud and the cluster's
master node (the one running the gmetad service).

**[Grid Engine](http://gridscheduler.sourceforge.net/)**

If you are running the Grid Scheduling Edition of CycleCloud, Grid Engine
monitoring will automatically be configured when a Grid Engine cluster is
started. The only requirement is that CycleCloud can SSH to the node running the
qmaster service with the keypair configured for the cluster.
