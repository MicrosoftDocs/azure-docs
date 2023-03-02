---
title: Download the OSM client Library
description: Download and configure the Open Service Mesh (OSM) client library
ms.topic: article
ms.date: 8/26/2021
ms.author: pgibson
zone_pivot_groups: client-operating-system
---

# Download and configure the Open Service Mesh (OSM) client library

This article will discuss how to download the OSM client library to be used to operate and configure the OSM add-on for AKS, and how to configure the binary for your environment.

> [!IMPORTANT]
> Based on the version of Kubernetes your cluster is running, the OSM add-on installs a different version of OSM:
> - If your cluster is running Kubernetes version 1.24.0 or greater, the OSM add-on installs version *1.2.3* of OSM.
> - If your cluster is running a version of Kubernetes between 1.23.5 and 1.24.0, the OSM add-on installs version *1.1.3* of OSM.
> - If your cluster is running a version of Kubernetes below 1.23.5, the OSM add-on installs version *1.0.0* of OSM.


::: zone pivot="client-operating-system-linux"

[!INCLUDE [Linux - download and install client binary](includes/servicemesh/osm/open-service-mesh-binary-install-linux.md)]

::: zone-end

::: zone pivot="client-operating-system-macos"

[!INCLUDE [macOS - download and install client binary](includes/servicemesh/osm/open-service-mesh-binary-install-macos.md)]

::: zone-end

::: zone pivot="client-operating-system-windows"

[!INCLUDE [Windows - download and install client binary](includes/servicemesh/osm/open-service-mesh-binary-install-windows.md)]

::: zone-end

> [!WARNING]
> Do not attempt to install OSM from the binary using `osm install`. This will result in a installation of OSM that is not integrated as an add-on for AKS.

## Configure OSM CLI variables with an OSM_CONFIG file

Users can override the default OSM CLI configuration to enhance the add-on experience. This can be done by creating a config file, similar to `kubeconfig`. The config file can be either created at `$HOME/.osm/config.yaml`, or at a different path that is exported using the `OSM_CONFIG` environment variable.

The file must contain the following YAML formatted content:

```yaml
install:
  kind: managed
  distribution: AKS
  namespace: kube-system
```

If the file is not created at `$HOME/.osm/config.yaml`, remember to set the `OSM_CONFIG` environment variable to point to the path where the config file is created.

After setting OSM_CONFIG, the output of the `osm env` command should be the following:

```console
$ osm env
---
install:
  kind: managed
  distribution: AKS
  namespace: kube-system
```
