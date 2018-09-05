---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/05/2018
 ms.author: cherylmc
 ms.custom: include file
---

1. Download the VPNClient package from Azure Portal.
2. Extract the File.
3. Go to Generic folder.

  Copy/Move :

  * VpnServerRoot.cer to /etc/ipsec.d/cacerts
  * cp client.p12 /etc/ipsec.d/private/
4. Open VpnSettings.xml file and copy <VpnServer> value.
5. Add the following in: /etc/ipsec.conf configuration:
  
  ```
  conn azure
  keyexchange=ikev2
  type=tunnel
  leftfirewall=yes
  left=%any
  leftauth=eap-tls
  leftid=%client # use the DNS alternative name prefixed with the %
  right= Enter the VPN Server value here# Azure VPN gateway address
  rightid=%Enter the VPN Server value here# Azure VPN gateway address, prefixed with %
  rightsubnet=0.0.0.0/0
  leftsourceip=%config
  auto=add
  ```
6. Add the following to */etc/ipsec.secrets*.

  ```
  : P12 client.p12 'password' # key filename inside /etc/ipsec.d/private directory
  ```

7. Run the following commands:

  ```
  # ipsec restart
  # ipsec up azure
  ```