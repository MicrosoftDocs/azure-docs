---
author: paulbouwer

ms.topic: include
ms.date: 11/15/2019
ms.author: pabouwer
---

## Download and install the Istio istioctl client binary

In a bash-based shell on MacOS, use `curl` to download the Istio release and then extract with `tar` as follows:

```bash
# Specify the Istio version that will be leveraged throughout these instructions
ISTIO_VERSION=1.4.0

curl -sL "https://github.com/istio/istio/releases/download/$ISTIO_VERSION/istio-$ISTIO_VERSION-osx.tar.gz" | tar xz
```

The `istioctl` client binary runs on your client machine and allows you to interact with the Istio service mesh. Use the following commands to install the Istio `istioctl` client binary in a bash-based shell on MacOS. These commands copy the `istioctl` client binary to the standard user program location in your `PATH`.

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