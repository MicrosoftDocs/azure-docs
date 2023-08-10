---
title: Enable automatic HTTPS with Caddy as a sidecar container
description: This guide describes how Caddy can be used as a reverse proxy to enhance your application with automatic HTTPS
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
ms.custom: devx-track-azurecli
services: container-instances
ms.topic: how-to
ms.date: 06/12/2023
---

# Enable automatic HTTPS with Caddy in a sidecar container

This article describes how Caddy can be used as a sidecar container in a [container group](container-instances-container-groups.md) acting as a reverse proxy to provide an automatically managed HTTPS endpoint for your application. 

Caddy is a powerful, enterprise-ready, open source web server with automatic HTTPS written in Go and represents an alternative to Nginx. 

The automatization of certificates is possible because Caddy supports the ACMEv2 API ([RFC 8555](https://www.rfc-editor.org/rfc/rfc8555)) that interacts with [Let's Encrypt](https://letsencrypt.org/) to issue certificates. 

In this example, only the Caddy container gets exposed on ports 80/TCP and 443/TCP. The application behind the reverse proxy remains private. The network communication between Caddy and your application happens via localhost. 

> [!NOTE]
> This stands in contrast to the intra container group communication known from docker compose, where containers can be referenced by name. 

The example mounts the [Caddyfile](https://caddyserver.com/docs/caddyfile), which is required to configure the reverse proxy, from a file share hosted on an Azure Storage account. 

> [!NOTE]
> For production deployments, most users will want to bake the Caddyfile into a custom docker image based on [caddy](https://hub.docker.com/_/caddy). This way, there is no need to mount files into the container. 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.55 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Prepare the Caddyfile

Create a file called `Caddyfile` and paste the following configuration. This configuration creates a reverse proxy configuration, pointing to your application container listening on 5000/TCP. 

```console
my-app.westeurope.azurecontainer.io {
    reverse_proxy http://localhost:5000
}
```

It's important to note, that the configuration references a domain name instead of an IP address. Caddy needs to be reachable by this URL to carry out the challenge step required by the ACME protocol and to successfully retrieve a certificate from Let's Encrypt. 

> [!NOTE]
> For production deployment, users might want to use a domain name they control, e.g., `api.company.com` and create a CNAME record pointing to e.g. `my-app.westeurope.azurecontainer.io`. If so, it needs to be ensured, that the custom domain name is also used in the Caddyfile, instead of the one assigned by Azure (e.g., `*.westeurope.azurecontainer.io`). Further, the custom domain name, needs to be referenced in the ACI YAML configuration described later in this example. 

## Prepare storage account

Create a storage account

```azurecli
az storage account create \
  --name <storage-account> \
  --resource-group <resource-group> \
  --location westeurope
```

Store the connection string to an environment variable 

```azurecli
AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string --name <storage-account> --resource-group <resource-group> --output tsv)
```

Create the file shares required to store the container state and caddy configuration.

```azurecli
az storage share create \
  --name proxy-caddyfile \
  --account-name <storage-account>

az storage share create \
  --name proxy-config \
  --account-name <storage-account>
  
  az storage share create \
  --name proxy-data \
  --account-name <storage-account>
```

Retrieve the storage account keys and make a note for later use 

```azurecli
az storage account keys list -g <resource-group> -n <storage-account>
```

## Deploy container group

### Create YAML file

Create a file called `ci-my-app.yaml` and paste the following content. Ensure to replace `<account-key>` with one of the access keys previously received and `<storage-account>` accordingly. 

This YAML file defines two containers `reverse-proxy` and `my-app`. The `reverse-proxy` container mounts the three previously created file shares. The configuration also exposes port 80/TCP and 443/TCP of the `reverse-proxy` container. The communication between both containers happens on localhost only. 

>[!NOTE]
> It's important to note, that the `dnsNameLabel` key, defines the public DNS name, under which the container instance group will be reachable, it needs to match the FQDN defined in the `Caddyfile`

```yml 
name: ci-my-app
apiVersion: "2021-10-01"
location: westeurope
properties:
  containers:
    - name: reverse-proxy
      properties:
        image: caddy:2.6
        ports:
          - protocol: TCP
            port: 80
          - protocol: TCP
            port: 443
        resources:
          requests:
            memoryInGB: 1.0
            cpu: 1.0
          limits:
            memoryInGB: 1.0
            cpu: 1.0
        volumeMounts:
          - name: proxy-caddyfile
            mountPath: /etc/caddy
          - name: proxy-data
            mountPath: /data
          - name: proxy-config
            mountPath: /config
    - name: my-app
      properties:
        image: mcr.microsoft.com/azuredocs/aci-helloworld
        ports:
        - port: 5000
          protocol: TCP
        environmentVariables:
        - name: PORT
          value: 5000
        resources:
          requests:
            memoryInGB: 1.0
            cpu: 1.0
          limits:
            memoryInGB: 1.0
            cpu: 1.0
  ipAddress:
    ports:
      - protocol: TCP
        port: 80
      - protocol: TCP
        port: 443
    type: Public        
    dnsNameLabel: my-app
  osType: Linux
  volumes:
    - name: proxy-caddyfile
      azureFile: 
        shareName: proxy-caddyfile
        storageAccountName: "<storage-account>" 
        storageAccountKey: "<account-key>"
    - name: proxy-data
      azureFile: 
        shareName: proxy-data
        storageAccountName: "<storage-account>"  
        storageAccountKey: "<account-key>"
    - name: proxy-config
      azureFile: 
        shareName: proxy-config
        storageAccountName: "<storage-account>"  
        storageAccountKey: "<account-key>"
```

### Deploy the container group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command:

```azurecli
az group create --name <resource-group> --location westeurope
```

Deploy the container group with the [az container create](/cli/azure/container#az-container-create) command, passing the YAML file as an argument.

```azurecli
az container create --resource-group <resource-group> --file ci-my-app.yaml
```

### View the deployment state 

To view the state of the deployment, use the following [az container show](/cli/azure/container#az-container-show) command:

```azurecli
az container show --resource-group <resource-group> --name ci-my-app --output table
```

### Verify TLS connection 

Before verifying if everything went well, give the container group some time to fully start and for Caddy to request a certificate.

#### OpenSSL

We can use the `s_client` subcommand of OpenSSL for that purpose. 

```bash
echo "Q" | openssl s_client -connect my-app.westeurope.azurecontainer.io:443
```

```console
CONNECTED(00000188)
---
Certificate chain
 0 s:CN = my-app.westeurope.azurecontainer.io
   i:C = US, O = Let's Encrypt, CN = R3
 1 s:C = US, O = Let's Encrypt, CN = R3
   i:C = US, O = Internet Security Research Group, CN = ISRG Root X1
 2 s:C = US, O = Internet Security Research Group, CN = ISRG Root X1
   i:O = Digital Signature Trust Co., CN = DST Root CA X3
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIEgTCCA2mgAwIBAgISAxxidSnpH4vVuCZk9UNG/pd2MA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yMzA0MDYxODAzMzNaFw0yMzA3MDUxODAzMzJaMC4xLDAqBgNVBAMT
I215LWFwcC53ZXN0ZXVyb3BlLmF6dXJlY29udGFpbmVyLmlvMFkwEwYHKoZIzj0C
AQYIKoZIzj0DAQcDQgAEaaN/wGyFcimM+1O4WzbFgO6vIlXxXqp9vgmLZHpFrNwV
aO8JbaB7hE+M5EAg34LDY80RyHgY+Ff4vTh2Z96rVqOCAl4wggJaMA4GA1UdDwEB
/wQEAwIHgDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/
BAIwADAdBgNVHQ4EFgQUoL5DP+4PWiyE79hL5o+v8uymHdAwHwYDVR0jBBgwFoAU
FC6zF7dYVsuuUAlA5h+vnYsUwsYwVQYIKwYBBQUHAQEESTBHMCEGCCsGAQUFBzAB
hhVodHRwOi8vcjMuby5sZW5jci5vcmcwIgYIKwYBBQUHMAKGFmh0dHA6Ly9yMy5p
LmxlbmNyLm9yZy8wLgYDVR0RBCcwJYIjbXktYXBwLndlc3RldXJvcGUuYXp1cmVj
b250YWluZXIuaW8wTAYDVR0gBEUwQzAIBgZngQwBAgEwNwYLKwYBBAGC3xMBAQEw
KDAmBggrBgEFBQcCARYaaHR0cDovL2Nwcy5sZXRzZW5jcnlwdC5vcmcwggEEBgor
BgEEAdZ5AgQCBIH1BIHyAPAAdgC3Pvsk35xNunXyOcW6WPRsXfxCz3qfNcSeHQmB
Je20mQAAAYdX8+CQAAAEAwBHMEUCIQC9Ztqd3DXoJhOIHBW+P7ketGrKlVA6nPZl
9CiOrn6t8gIgXHcrbBqItemndRMv+UJ3DaBfTkYOqECecOJCgLhSYNUAdgDoPtDa
PvUGNTLnVyi8iWvJA9PL0RFr7Otp4Xd9bQa9bgAAAYdX8+CAAAAEAwBHMEUCIBJ1
24z44vKFUOLCi1a7ymVuWErkmLb/GtysvcxILaj0AiEAr49hyKfen4BbSTwC8Fg4
/LgZnn2F3uHI+9p+ZMO9xTAwDQYJKoZIhvcNAQELBQADggEBACqxa21eiW3JrZwk
FHgpd6SxhUeecrYXxFNva1Y6G//q2qCmGeKK3GK+ZGPqDtcoASH5t5ghV4dIT4WU
auVDLFVywXzR8PT6QUu3W8QxU+W7406twBf23qMIgrF8PIWhStI5mn1uCpeqlnf5
HpRaj2f5/5n19pcCZcrRx94G9qhPYdMzuy4mZRhxXRqrpIsabqX3DC2ld8dszCvD
pkV61iuARgm3MIQz1yL/x5Bn4nywjnhYZA4KFktC0Ti55cPRh1mkzGQAsYQDdWrq
dVav+U9dOLQ4Sq4suaDmzDzApr+hpQSJhwgRN16+tLMyZ6INAU2JWKDxiyDTdOuH
jz456og=
-----END CERTIFICATE-----
subject=CN = my-app.westeurope.azurecontainer.io

issuer=C = US, O = Let's Encrypt, CN = R3

---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: ECDSA
Server Temp Key: X25519, 253 bits
---
SSL handshake has read 4208 bytes and written 401 bytes
Verification error: unable to get local issuer certificate
---
New, TLSv1.3, Cipher is TLS_AES_128_GCM_SHA256
Server public key is 256 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 20 (unable to get local issuer certificate)
---
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_128_GCM_SHA256
    Session-ID: 85F1A4290F99A0DD28C8CB21EF4269E7016CC5D23485080999A8548057729B24
    Session-ID-ctx: 
    Resumption PSK: 752D438C19A5DBDBF10781F863D5E5D9A8859230968A9EAFFF7BBA86937D004F
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 604800 (seconds)
    TLS session ticket:
    0000 - 2f 25 98 90 9d 46 9b 01-03 78 db bd 4d 64 b3 a6   /%...F...x..Md..
    0010 - 52 c0 7a 8a b6 3d b8 4b-c0 d7 fc 04 e8 63 d4 bb   R.z..=.K.....c..
    0020 - 15 b3 25 b7 be 64 3d 30-2b d7 dc 7a 1a d1 22 63   ..%..d=0+..z.."c
    0030 - 42 30 90 65 6b b5 e1 83-a3 6c 76 c8 f6 ae e9 31   B0.ek....lv....1
    0040 - 45 91 33 57 8e 9f 4b 6a-2e 2c 9b f9 87 5f 71 1d   E.3W..Kj.,..._q.
    0050 - 5a 84 59 50 17 31 1f 62-2b 0e 1e e5 70 03 d9 e9   Z.YP.1.b+...p...
    0060 - 50 1c 5d 1f a4 3c 8a 0e-f4 c5 7d ce 9e 5c 98 de   P.]..<....}..\..
    0070 - e5                                                .

    Start Time: 1680808973
    Timeout   : 7200 (sec)
    Verify return code: 20 (unable to get local issuer certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
```

#### Chrome browser

Navigate to https://my-app.westeurope.azurecontainer.io and verify the certificate by clicking on the padlock next to the URL. 

:::image type="content" source="media/container-instances-container-group-automatic-ssl/url-padlock.png" alt-text="Screenshot highlighting the padlock next to the URL that verifies the certificate.":::

To see the certificate details, click on "Connection is secure" followed by "certificate is valid".

:::image type="content" source="media/container-instances-container-group-automatic-ssl/lets-encrypt-certificate.png" alt-text="Screenshot of the certificate issued by Let's Encrypt":::

## Next steps
- [Caddy documentation](https://caddyserver.com/docs/)
- [GitHub aci-helloworld](https://github.com/Azure-Samples/aci-helloworld)
- [YAML reference: Azure Container Instances](container-instances-reference-yaml.md)
- [Secure your codeless REST API with automatic HTTPS using Data API builder and Caddy](https://www.azureblue.io/secure-your-codeless-rest-api-with-automatic-https-using-data-api-builder-and-caddy/)
