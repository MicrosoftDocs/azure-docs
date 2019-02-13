---
title: k4a_wired_sync_mode_t enumeration
description: Synchronization mode when connecting 2 or more devices together. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_wired_sync_mode_t enumeration

Synchronization mode when connecting 2 or more devices together. 

## Syntax

```C
typedef enum {
    K4A_WIRED_SYNC_MODE_STANDALONE,
    K4A_WIRED_SYNC_MODE_MASTER,
    K4A_WIRED_SYNC_MODE_SUBORDINATE,
} k4a_wired_sync_mode_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_WIRED_SYNC_MODE_STANDALONE | Neither Sync In or Sync Out connections are used. 
K4A_WIRED_SYNC_MODE_MASTER | The 'Sync Out' jack is enabled and synchronization data it driven out the connected wire. 
K4A_WIRED_SYNC_MODE_SUBORDINATE | The 'Sync In' jack is used for synchronization and 'Sync Out' is driven for the next device in the chain. 

### K4A_WIRED_SYNC_MODE_SUBORDINATE

'Sync Out' is just a mirror of 'Sync In' for this mode. 
