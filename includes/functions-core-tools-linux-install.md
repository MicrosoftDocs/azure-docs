---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/20/2021
ms.author: glenga
---

The following steps use [APT](https://wiki.debian.org/Apt) to install Core Tools on your Ubuntu/Debian Linux distribution. For other Linux distributions, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#linux).

1. Install the Microsoft package repository GPG key, to validate package integrity:

    ```bash
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
    sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
    ```

1. Set up the APT source list before doing an APT update.

    ##### Ubuntu

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs)-prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

    ##### Debian

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/$(lsb_release -rs | cut -d'.' -f 1)/prod $(lsb_release -cs) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

1. Check the `/etc/apt/sources.list.d/dotnetdev.list` file for one of the appropriate Linux version strings listed below:

    | Linux distribution         | Version    |
    | -------------------------- | ---------- |
    | Debian 11                  | `bullseye` |
    | Debian 10                  | `buster`   |
    | Debian 9                   | `stretch`  |
    | Ubuntu 20.04               | `focal`    |
    | Ubuntu 19.04               | `disco`    |
    | Ubuntu 18.10               | `cosmic`   |
    | Ubuntu 18.04               | `bionic`   |
    | Ubuntu 17.04               | `zesty`    |
    | Ubuntu 16.04/Linux Mint 18 | `xenial`   |

1. Start the APT source update:

    ```bash
    sudo apt-get update
    ```
