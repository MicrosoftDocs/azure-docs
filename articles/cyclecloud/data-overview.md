---
title: Azure CycleCloud Data Management Overview | Microsoft Docs
description: Azure CycleCloud Data Management using the Cycle telemetry engine
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Data Management

Azure CycleCloud's data manager is based on the Cycle telemetry engine operating on a NoSQL datastore.
It has a pluggable architecture and makes use of components to support various operations.
It provides a rich query interface, along with rich alerts and reporting framework that can be used
to create custom reports or alerts on the datastore information. Information such as user actions,
scheduled data transfers, and collected metadata are available through the alerts and reporting framework.

The data management tool supports data transfer, management, and operations (by operating on requests
created by adding records to the datastore). These records contain both the user information and metadata needed to perform the data transfer. All operations are written to the datastore to provide an audit trail, which is made available via a REST API, command line clients, and Event Viewer Interface.

CycleCloud's data manager also provides CycleServer plugins that allow the management,
archiving, and retrieval of user data in cloud storage, making it easy to manage backups, archives,
and transfer data residing in various storage services and mediums. Archived data is encrypted
with user-provided keys, and a RESTful API is provided to perform various operations on encryption
keys allowing users to store or retrieve encryption keys and perform archival or retrieval of folders
residing on the local file system. A command line client utilizing the REST API is also provided.
