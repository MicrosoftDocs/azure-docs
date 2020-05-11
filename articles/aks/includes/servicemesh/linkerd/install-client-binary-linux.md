---
author: paulbouwer

ms.topic: include
ms.date: 10/09/2019
ms.author: pabouwer
---

## Download and install the Linkerd linkerd client binary

In a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl], use `curl` to download the Linkerd release as follows:

```bash
# Specify the Linkerd version that will be leveraged throughout these instructions
LINKERD_VERSION=stable-2.6.0

curl -sLO "https://github.com/linkerd/linkerd2/releases/download/$LINKERD_VERSION/linkerd2-cli-$LINKERD_VERSION-linux"
```

The `linkerd` client binary runs on your client machine and allows you to interact with the Linkerd service mesh. Use the following commands to install the Linkerd `linkerd` client binary in a bash-based shell on Linux or [Windows Subsystem for Linux][install-wsl]. These commands copy the `linkerd` client binary to the standard user program location in your `PATH`.

```bash
sudo cp ./linkerd2-cli-$LINKERD_VERSION-linux /usr/local/bin/linkerd
sudo chmod +x /usr/local/bin/linkerd
```

If you'd like command-line completion for the Linkerd `linkerd` client binary, then set it up as follows:

```bash
# Generate the bash completion file and source it in your current shell
mkdir -p ~/completions && linkerd completion bash > ~/completions/linkerd.bash
source ~/completions/linkerd.bash

# Source the bash completion file in your .bashrc so that the command-line completions
# are permanently available in your shell
echo "source ~/completions/linkerd.bash" >> ~/.bashrc
```

<!-- LINKS - external -->
[install-wsl]: https://docs.microsoft.com/windows/wsl/install-win10