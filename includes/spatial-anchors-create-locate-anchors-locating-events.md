---
author: pamistel
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 11/20/2020
ms.author: pamistel
---
After your watcher is created, the `AnchorLocated` event will fire for every anchor requested. This event fires when an anchor is located, or if the anchor can't be located. If this situation happens, the reason will be stated in the status. After all anchors for a watcher are processed, found or not found, then the `LocateAnchorsCompleted` event will fire. There is a limit of 35 identifiers per watcher. 
