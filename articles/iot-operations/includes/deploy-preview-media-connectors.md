---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 03/20/2025
ms.author: dobett
---

To update the version of the media and ONVIF connectors in your Azure IoT Operations deployment, run the following PowerShell commands to enable preview features:

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the media or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

# [PowerShell](#tab/powershell)

```azurepowershell
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

# [Bash](#tab/bash)

```azurecli
CLUSTER_NAME="<YOUR AZURE IOT OPERATIONS CLUSTER NAME>"
RESOURCE_GROUP="<YOUR RESOURCE GROUP NAME>"

# Get the extension info
extension=$(az k8s-extension list \
  --cluster-name "$CLUSTER_NAME" \
  --cluster-type connectedClusters \
  --resource-group "$RESOURCE_GROUP" \
  --query "[?extensionType == 'microsoft.iotoperations']" \
  --output json)

# Extract version, name, and releaseTrain from the JSON
version=$(echo "$extension" | jq -r '.[0].version')
name=$(echo "$extension" | jq -r '.[0].name')
releaseTrain=$(echo "$extension" | jq -r '.[0].releaseTrain')

# Update the extension
az k8s-extension update \
  --version "$version" \
  --name "$name" \
  --release-train "$releaseTrain" \
  --cluster-name "$CLUSTER_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --cluster-type connectedClusters \
  --auto-upgrade-minor-version false \
  --config connectors.image.registry=mcr.microsoft.com \
  --config connectors.image.repository=aio-connectors/helmchart/microsoft-aio-connectors \
  --config connectors.image.tag=1.1.0 \
  --config connectors.values.enablePreviewFeatures=true \
  --yes
```

> [!NOTE]
> This update process is for preview components only. The media and ONVIF connectors are currently preview components.
