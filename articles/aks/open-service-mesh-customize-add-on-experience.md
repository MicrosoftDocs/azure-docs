---
title: Customize OSM CLI experience
description: Customize OSM CLI experience with an osmconfig file. 
services: container-service
ms.topic: article
ms.date: 9/30/2021
ms.custom: mvc, devx-track-azurecli
ms.author: nshankar
zone_pivot_groups: client-operating-system
---

# Configure OSM CLI variables with an OSM_CONFIG file

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