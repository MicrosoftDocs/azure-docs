---
author: cherylmc
ms.author: cherylmc
ms.date: 02/10/2025
ms.service: azure-virtual-wan
ms.topic: include
---

Use the following steps to download and install the latest version of the Azure VPN Client for Linux.

> [!NOTE]
> Add only the repository list of your Ubuntu version 20.04 or 22.04.
> For more information, see the [Linux Software Repository for Microsoft Products](/linux/packages).

```CLI
# install curl utility
sudo apt-get install curl

# Install Microsoft's public key
curl -sSl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc

# Install the production repo list for focal
# For Ubuntu 20.04
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-
ubuntu-focal-prod.list

# Install the production repo list for jammy
# For Ubuntu 22.04
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-
ubuntu-jammy-prod.list

sudo apt-get update
sudo apt-get install microsoft-azurevpnclient
```
