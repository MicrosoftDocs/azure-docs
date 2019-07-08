---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 01/16/2019
 ms.author: cherylmc
 ms.custom: include file
---

The following computer configuration was used for the steps below:

  | | |
  |---|---|
  |Computer| Ubuntu Server 16.04<br>ID_LIKE=debian<br>PRETTY_NAME="Ubuntu 16.04.4 LTS"<br>VERSION_ID="16.04" |
  |Dependencies| strongSwan |

#### 1. Install strongSwan

Use the following commands to install the required strongSwan configuration:

```
apt-get install strongswan-ikev2 strongswan-plugin-eap-tls
```

```
apt-get install libstrongswan-standard-plugins
```

```
apt-get install strongswan-pki
```

#### 2. Generate keys and certificate

Generate the CA certificate.

  ```
  ipsec pki --gen --outform pem > caKey.pem
  ipsec pki --self --in caKey.pem --dn "CN=VPN CA" --ca --outform pem > caCert.pem
  ```

Print the CA certificate in base64 format. This is the format that is supported by Azure. You will later upload this to Azure as part of your P2S configuration.

  ```
  openssl x509 -in caCert.pem -outform der | base64 -w0 ; echo
  ```

Generate the user certificate.

  ```
  export PASSWORD="password"
  export USERNAME="client"

  ipsec pki --gen --outform pem > "${USERNAME}Key.pem"
  ipsec pki --pub --in "${USERNAME}Key.pem" | ipsec pki --issue --cacert caCert.pem --cakey caKey.pem --dn "CN=${USERNAME}" --san "${USERNAME}" --flag clientAuth --outform pem > "${USERNAME}Cert.pem"
  ```

Generate a p12 bundle containing the user certificate. This bundle will be used in the next steps when working with the client configuration files.

  ```
  openssl pkcs12 -in "${USERNAME}Cert.pem" -inkey "${USERNAME}Key.pem" -certfile caCert.pem -export -out "${USERNAME}.p12" -password "pass:${PASSWORD}"
  ```