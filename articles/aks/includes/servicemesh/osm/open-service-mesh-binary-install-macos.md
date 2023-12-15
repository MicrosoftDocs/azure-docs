---
author: phillipgibson

ms.topic: include
ms.custom: devx-track-linux
ms.date: 03/15/2021
ms.author: phillipgibson
---

## Download and install the Open Service Mesh (OSM) client binary

In a bash-based shell, use `curl` to download the OSM release and then extract with `tar` as follows:

```bash
# Specify the OSM version that will be leveraged throughout these instructions
OSM_VERSION=v1.2.0

curl -sL "https://github.com/openservicemesh/osm/releases/download/$OSM_VERSION/osm-$OSM_VERSION-darwin-amd64.tar.gz" | tar -vxzf -
```

The `osm` client binary runs on your client machine and allows you to manage OSM in your AKS cluster. Use the following commands to install the OSM `osm` client binary in a bash-based shell. These commands copy the `osm` client binary to the standard user program location in your `PATH`.

```bash
sudo mv ./darwin-amd64/osm /usr/local/bin/osm
sudo chmod +x /usr/local/bin/osm
```

You can verify the `osm` client library has been correctly added to your path and its version number with the following command.

```bash
osm version
```
