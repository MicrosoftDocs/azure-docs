---
title: Common Issues - Phase timeout expired while awaiting system boot-up
description: Azure CycleCloud common issue - Node Storage Resolution
author: mvrequa
ms.date: 06/30/2025
ms.author: mirequa
---
# Common issues: Node storage resolution failure

## Possible error messages

- `Phase timeout expired while awaiting system boot-up`

## Resolution

CycleCloud nodes use the [custom script extension](/azure/virtual-machines/extensions/custom-script-linux) to install Jetpack. The Jetpack installer is staged into the locker during the initial node phase and downloaded by the node at start time. CycleCloud sends the blob URL and the authentication method to the node through the script extension.

The installer is downloaded to the following location on the node:

_/var/lib/waagent/custom-script/download/0/jetpack-7.9.4-linux.tar.gz_

In some cases, the download fails without raising an error. The indication for such a failure is that the installer is a *zero-byte file*.

Most commonly, the failure happens because the storage account can't be reached or the name can't be resolved. You can reproduce this issue with a minimal example using _cURL_ for version _7.9.4_.

```bash
curl https://<storage-account>.blob.core.windows.net/cyclecloud/cache/jetpack/7.9.4/jetpack-7.9.4-linux.tar.gz
```

A "success" results in a 404 HTTP response. Afflicted nodes show a _cURL_ error: host not resolvable or host timeout.

To fix this issue and subsequent nodes, take action to repair the storage account resolution by investigating the node DNS resolution or firewall rules.
