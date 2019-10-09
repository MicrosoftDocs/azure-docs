---
author: paulbouwer
services: container-service
ms.topic: include
ms.date: 10/9/2019
ms.author: pabouwer
---

## Download Istio

First, download and extract the latest Istio release. 

On Linux or [Windows Subsystem for Linux][install-wsl], use `curl` to download the latest Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.1.3

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-linux.tar.gz" | tar xz
```

## Install the Istio istioctl client binary

> [!IMPORTANT]
> Ensure that you run the steps in this section, from the top-level folder of the Istio release that you downloaded and extracted.

The `istioctl` client binary runs on your client machine and allows you to interact with the Istio service mesh. Use the following commands to install the Istio `istioctl` client binary in a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
cd istio-$ISTIO_VERSION
sudo cp ./bin/istioctl /usr/local/bin/istioctl
sudo chmod +x /usr/local/bin/istioctl
```

If you'd like command-line completion for the Istio `istioctl` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
mkdir -p ~/completions && istioctl collateral --bash -o ~/completions
source ~/completions/istioctl.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/istioctl.bash" >> ~/.bashrc
```

<!-- LINKS - external -->
[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10