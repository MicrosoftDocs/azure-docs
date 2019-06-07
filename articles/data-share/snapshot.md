---
title: Concept - Snapshot
description: What is a Snapshot in Azure Data Share
author: joannapea

ms.service: data-share
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: joanpo
---
# Snapshots in Azure Data Share

A snapshot can be created by a data consumer when they accept a data share invitation. When they accept, they can trigger a full or incremental snapshot of the data shared with them. The snapshot is a copy of the data at the point in time that the data consumer generated the snapshot. 

There are two types of snapshots - full and incremental. A full snapshot contains all the data within the data share. An incremental snapshot contains all the data that has been updated/added since the last snapshot was triggered. 
