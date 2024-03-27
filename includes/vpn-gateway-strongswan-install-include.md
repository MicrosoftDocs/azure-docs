---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2024
 ms.author: cherylmc
---

The following configuration was used when specifying commands:

* Computer: Ubuntu Server 18.04
* Dependencies: strongSwan

Use the following commands to install the required strongSwan configuration:

```CLI
sudo apt-get update
```

```CLI
sudo apt-get upgrade
```

```CLI
sudo apt install strongswan
```

```CLI
sudo apt install strongswan-pki
```

```CLI
sudo apt install libstrongswan-extra-plugins
```

```CLI
sudo apt install libtss2-tcti-tabrmd0
```