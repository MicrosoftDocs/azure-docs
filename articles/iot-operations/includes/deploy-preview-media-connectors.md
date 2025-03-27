---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 03/20/2025
ms.author: dobett
---

To update the version of the media and ONVIF connectors in your Azure IoT Operations deployment, run the following PowerShell commands:

```powershell
$clusterName="<YOUR AZURE IOT OPERATIONS CLUSTER NAME>"
$clusterResourceGroup="<YOUR RESOURCE GROUP NAME>"

$extension = az k8s-extension list `
--cluster-name $clusterName `
--cluster-type connectedClusters `
--resource-group $clusterResourceGroup `
--query "[?extensionType == 'microsoft.iotoperations']" `
| ConvertFrom-Json


az k8s-extension update `
--version $extension.version `
--name $extension.name `
--release-train $extension.releaseTrain `
--cluster-name $clusterName `
--resource-group $clusterResourceGroup `
--cluster-type connectedClusters `
--auto-upgrade-minor-version false `
--config connectors.image.registry=mcr.microsoft.com `
--config connectors.image.repository=aio-connectors/helmchart/microsoft-aio-connectors `
--config connectors.image.tag=1.1.0 `
--config connectors.values.enablePreviewFeatures=true `
--yes
```

> [!NOTE]
> This update process is for preview components only. The media and ONVIF connectors are currently preview components.
