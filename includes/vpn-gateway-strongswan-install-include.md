---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/17/2022
 ms.author: cherylmc
---

The following configuration was used for the steps below:

* Computer: Ubuntu Server 18.04
* Dependencies: strongSwan

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

For more information, see [Additional instructions to install the Azure CLI](/cli/azure/install-azure-cli-apt). 