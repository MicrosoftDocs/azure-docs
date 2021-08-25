---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/14/2019
 ms.author: cherylmc
 ms.custom: include file
---

The following configuration was used for the steps below:

- Computer: Ubuntu Server 18.04
- Dependencies: strongSwan


Use the following commands to install the required strongSwan configuration:

```
sudo apt install strongswan
```

```
sudo apt install strongswan-pki
```

```
sudo apt install libstrongswan-extra-plugins
```

Use the following command to install the Azure command-line interface:

```
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

[Additional instructions on how to install the Azure CLI](/cli/azure/install-azure-cli-apt)