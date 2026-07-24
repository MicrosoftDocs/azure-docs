---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/25/2026
ms.author: glenga
---

## Install the Azure Functions Core Tools

The recommended installation method for Core Tools depends on the operating system of your local development computer.

### [Windows](#tab/windows)

Two primary ways to install the latest Core Tools version on Windows are:

| Install method | Best for... | Install location/command |
| ---- | ---- | ---- |
| Windows installer (MSI) | Visual Studio or command-line development without Node.js | • [64-bit](https://go.microsoft.com/fwlink/?linkid=2174087)(recommended)<br/>• [32-bit](https://go.microsoft.com/fwlink/?linkid=2174159) |
| `npm` package | Visual Studio Code development (used by the Azure Functions extension for updates) | • **npm**: `npm i -g azure-functions-core-tools@4 --unsafe-perm true`<br/>• **chocolatey**: `choco install azure-functions-core-tools` |

Considerations for installation:

+ Choose the best method based on your local development environment and stick with that method for updates.
+ The Visual Studio Code extension for Azure Functions installs and maintains Core Tools by using `npm`. 
+ If you previously used an MSI to install Core Tools on Windows, uninstall it from Add Remove Programs before installing by using Visual Studio Code for development, which prefers `npm`. Having both installed causes version conflicts because the MSI takes precedence on PATH. To check which you have, run `where func` in a terminal.
+ To install Core Tools on [Windows Subsystem for Linux (WSL)](/windows/wsl/install), follow the instructions on the Linux tab. 

For more information, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows).

### [macOS](#tab/macos)

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

The following steps use [APT](https://wiki.debian.org/Apt) to install Core Tools on your Ubuntu or Debian Linux distribution. For other Linux distributions, see the [Core Tools readme](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#linux).

1. Install the Microsoft package repository GPG key to validate package integrity:

    ```bash
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
    sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
    ```

1. Set up the APT source list before running an APT update.

    ##### Ubuntu

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-$(lsb_release -cs 2>/dev/null)-prod $(lsb_release -cs 2>/dev/null) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

    ##### Debian

    ```bash
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/$(lsb_release -rs 2>/dev/null | cut -d'.' -f 1)/prod $(lsb_release -cs 2>/dev/null) main" > /etc/apt/sources.list.d/dotnetdev.list'
    ```

1. Check the `/etc/apt/sources.list.d/dotnetdev.list` file for one of the appropriate Linux version strings in the following table:

    | Linux distribution         | Version    |
    | -------------------------- | ---------- |
    | Debian 12                  | `bookworm` |
    | Debian 11                  | `bullseye` |
    | Debian 10                  | `buster`   |
    | Debian 9                   | `stretch`  |
    | Ubuntu 24.04               | `noble`    |
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
