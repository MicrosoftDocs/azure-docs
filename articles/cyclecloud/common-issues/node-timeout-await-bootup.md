---
title: Common Issues - Phase timeout expired while awaiting system boot-up
description: Azure CycleCloud common issue - Node Storage Resolution
author: mvrequa
ms.date: 04/15/2020
ms.author: mirequa
---
# Common Issues: Node Storage Resolution Failure

## Possible Error Messages

- `Phase timeout expired while awaiting system boot-up`

## Resolution

Cyclecloud nodes use [custom script extension](/azure/virtual-machines/extensions/custom-script-linux)
to install jetpack. The jetpack installer is staged into the locker during the initial node phase
and downloaded by the node at start time. Cyclecloud transmits the blob url and the chosen authentication
method to the node via the script extension.

The installer is downloaded to the following location on the node:

_/var/lib/waagent/custom-script/download/0/jetpack-7.9.4-linux.tar.gz_

In some cases the download can fail without raising an error. The indication for such a failure 
is that this is a *zero-byte file*. 

Most commonly the storage account either can't be reached or the name can't be resolved. A
minimal reproduction of this issue can be done with _cURL_ example here with the _7.9.4_ version.

```bash
curl https://<storage-account>.blob.core.windows.net/cyclecloud/cache/jetpack/7.9.4/jetpack-7.9.4-linux.tar.gz
```

A "success" results in a 404 http response. Afflicted nodes will show a _cURL_ error: host not resolvable or host timeout.

To fix this and subsequent nodes, take action to repair the storage account 
resolution either by investigating the node DNS resolution or firewall rules.
