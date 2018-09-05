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

1. Download the VPNClient package from Azure portal.
2. Extract the File.
3. From the **Generic** folder, copy or move the VpnServerRoot.cer to /etc/ipsec.d/cacerts.
4. From the **Generic** folder, copy or move cp client.p12 to /etc/ipsec.d/private/.
5. Open VpnSettings.xml file and copy the <VpnServer> value. You will use this value in the next step.
6. Adjust the values in the example below, then add the example to the /etc/ipsec.conf configuration.
  
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