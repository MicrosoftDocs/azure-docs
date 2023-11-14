---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/02/2023
ms.author: glenga
---

## Install the Azure Functions Core Tools

The recommended way to install Core Tools depends on the operating system of your local development computer.

### [Windows](#tab/windows)

The following steps use a Windows installer (MSI) to install Core Tools v4.x. For more information about other package-based installers, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows).

Download and run the Core Tools installer, based on your version of Windows:

- [v4.x - Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2174087) (Recommended. [Visual Studio Code debugging](../articles/azure-functions/functions-develop-vs-code.md#debugging-functions-locally) requires 64-bit.)
- [v4.x - Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2174159)

If you previously used Windows installer (MSI) to install Core Tools on Windows, you should uninstall the old version from Add Remove Programs before installing the latest version.

### [macOS](#tab/macos)

[!INCLUDE [functions-x86-emulation-on-arm64-note](functions-x86-emulation-on-arm64-note.md)]

The following steps use Homebrew to install the Core Tools on macOS.

1. Install [Homebrew](https://brew.sh/), if it's not already installed.

1. Install the Core Tools package:

    ```bash
    brew tap azure/functions
    brew install azure-functions-core-tools@4
    # if upgrading on a machine that has 2.x or 3.x installed:
    brew link --overwrite azure-functions-core-tools@4
    ```
### [Linux](#tab/linux)

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

1. Check the `/etc/apt/sources.list.d/dotnetdev.list` file for one of the appropriate Linux version strings in the following table:

    | Linux distribution         | Version    |
    | -------------------------- | ---------- |
    | Debian 11                  | `bullseye` |
    | Debian 10                  | `buster`   |
    | Debian 9                   | `stretch`  |
    | Ubuntu 22.04               | `jammy`    |
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

1. Install the Core Tools package:

    ```bash
    sudo apt-get install azure-functions-core-tools-4
    ```

---