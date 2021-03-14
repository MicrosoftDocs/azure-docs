---
author: paulbouwer

ms.topic: include
ms.date: 10/02/2020
ms.author: pabouwer
---

## Download and install the Istio istioctl client binary

In a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl], use `curl` to download the Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.7.3

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istioctl-$ISTIO_VERSION-linux-amd64.tar.gz" | tar xz
```

The `istioctl` client binary runs on your client machine and allows you to install and manage Istio in your AKS cluster. Use the following commands to install the Istio `istioctl` client binary in a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

```bash
sudo mv ./istioctl /usr/local/bin/istioctl
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
[install-wsl]: /windows/wsl/install-win10
