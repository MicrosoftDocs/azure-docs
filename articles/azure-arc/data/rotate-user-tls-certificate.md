---
title: Rotate user-provided TLS certificate in indirectly connected SQL Server Managed Instance enabled by Azure Arc
description: Rotate user-provided TLS certificate in indirectly connected SQL Server Managed Instance enabled by Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
ms.custom: devx-track-azurecli
author: mikhailalmeida
ms.author: mialmei
ms.reviewer: mikeray
ms.date: 12/15/2021
ms.topic: how-to
---
# Rotate certificate SQL Server Managed Instance enabled by Azure Arc (indirectly connected)

This article describes how to rotate user-provided Transport Layer Security(TLS) certificate for SQL Managed Instance enabled by Azure Arc in indirectly connected mode using Azure CLI or `kubectl` commands.  

Examples in this article use OpenSSL. [OpenSSL](https://www.openssl.org/) is an open-source command-line toolkit for general-purpose cryptography and secure communication.

## Prerequisite 

* [Install openssl utility ](https://www.openssl.org/source/) 
* a SQL Managed Instance enabled by Azure Arc in indirectly connected mode

## Generate certificate request using `openssl` 

If the managed instance uses a self-signed certificate, add all needed Subject Alternative Names (SANs). The SAN is an extension to X.509 that allows various values to be associated with a security certificate using a `subjectAltName` field, the SAN field lets you specify additional host names (sites, IP addresses, common names, and etc.) to be protected by a single SSL certificate, such as a multi-domain SAN or extended validation multi-domain SSL certificate.

To generate certificate on your own, you need to create a certificate signing request (CSR). Verify the configuration for the certificate has a common name with required SANs and has a CA issuer. For example:

```console
openssl req -newkey rsa:2048 -keyout your-private-key.key -out your-csr.csr
```

Run the following command to check the required SANs:

```console
openssl x509 -in /<cert path>/<filename>.pem -text
```

The following example demonstrates this command: 

```console
openssl x509 -in ./mssql-certificate.pem -text
```

The command returns the following output: 

```output
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 7686530591430793847 (0x6aac0ad91167da77)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = Cluster Certificate Authority
        Validity
            Not Before: Mmm dd hh:mm:ss yyyy GMT
            Not After: Mmm dd hh:mm:ss yyyy GMT
        Subject: CN = mi4-svc
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:ad:7e:16:3e:7d:b3:1e: ...
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Extended Key Usage: critical
                TLS Web Client Authentication, TLS Web Server Authentication
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Subject Alternative Name:
                DNS:mi4-svc, DNS:mi4-svc.test.svc.cluster.local, DNS:mi4-svc.test.svc
    Signature Algorithm: sha256WithRSAEncryption
         7a:f8:a1:25:5c:1d:e2:b4: ...
-----BEGIN CERTIFICATE-----
MIIDNjCCAh6gAwIB ...==
-----END CERTIFICATE-----
```

Example output:

```output
X509v3 Subject Alternative Name:
DNS:mi1-svc, DNS:mi1-svc.test.svc.cluster.local, DNS:mi1-svc.test.svc
```

## Create Kubernetes secret yaml specification for your service certificate

1. Encode a file using the following command with base64 in any Linux distribution, data are encoded and decoded to make the data transmission and storing process easier. 

   ```console
   base64 /<path>/<file> > cert.txt 
   ```

   For Windows users, use [certutil](/windows-server/administration/windows-commands/certutil) utility to perform Base64 encoding and decoding as the following command: 

   ```console
   $certutil -encode -f input.txt b64-encoded.txt
   ```

   Remove the header in the output file manually, or use the following command:

   ```console
   $findstr /v CERTIFICATE b64-encoded.txt> updated-b64.txt 
   ```

1. Add the base64 encoded cert and private key to the yaml specification file to create a Kubernetes secret:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: <secretName>
   type: Opaque
   data:
     certificate.pem: < base64 encoded certificate >
     privatekey.pem: < base64 encoded private key >
   ```

## Rotating certificate via Azure CLI

Use the following command by providing Kubernetes secret that you created previously to rotate the certificate: 

```azurecli
az sql mi-arc update -n <managed instance name> --k8s-namespace <arc> --use-k8s --service-cert-secret <your-cert-secret>
```

For example:

```azurecli
az sql mi-arc update -n mysqlmi --k8s-namespace <arc> --use-k8s --service-cert-secret mymi-cert-secret
```

Use the following command to rotate the certificate with the PEM formatted certificate public and private keys. The command generates a default service certificate name. 

```azurecli
az sql mi-arc update -n <managed instance name> --k8s-namespace arc --use-k8s --cert-public-key-file <path-to-my-cert-public-key> --cert-private-key-file <path-to-my-cert-private-key> --k8s-namespace <your-k8s-namespace>
```

For example:

```azurecli
az sql mi-arc update -n mysqlmi --k8s-namespace arc --use-k8s --cert-public-key-file ./mi1-1-cert --cert-private-key-file ./mi1-1-pvt
```

You can also provide a Kubernetes service cert secret name for `--service-cert-secret` parameter. In this case, it's taken as an updated secret name. The command checks if the secret exists. If not, the command creates a secret name and then rotates the secret in the managed instance.

```azurecli
az sql mi-arc update -n <managed instance name> --k8s-namespace <arc> --use-k8s --cert-public-key-file <path-to-my-cert-public-key> --cert-private-key-file <path-to-my-cert-private-key> --service-cert-secret <path-to-mymi-cert-secret>
```

For example:

```azurecli
az sql mi-arc update -n mysqlmi --k8s-namespace arc --use-k8s --cert-public-key-file ./mi1-1-cert --cert-private-key-file ./mi1-1-pvt --service-cert-secret mi1-12-1-cert-secret
```

## Rotate the certificate with `kubectl` command

Once you created the Kubernetes secret, you can bind it to the SQL Managed Instance yaml definition `security` section where `serviceCertificateSecret` located as follows: 

```yaml
  security:
    adminLoginSecret: <your-admin-login-secret>
    serviceCertificateSecret: <your-cert-secret>
```

The following `.yaml` file is an example to rotate the service certificate in SQL instance named `mysqlmi`, update the spec with a Kubernetes secret named `my-service-cert`:

```yaml
apiVersion: sql.arcdata.microsoft.com/v1
kind: sqlmanagedinstance
metadata:
  name: mysqlmi
  namespace: my-arc-namespace
spec:
spec:
  dev: false
  licenseType: LicenseIncluded
  replicas: 1
  security:
    adminLoginSecret: mysqlmi-admin-login-secret
    # Update the serviceCertificateSecret with name of the K8s secret
    serviceCertificateSecret: my-service-cert
  services:
    primary:
      type: NodePort
  storage:
    data:
      volumes:
      - size: 5Gi
    logs:
      volumes:
      - size: 5Gi
  tier: GeneralPurpose
```

You can use the following kubectl command to apply this setting: 

```console
   kubectl apply -f <my-sql-mi-yaml-file>
```

## Related content
- [View the SQL managed instance dashboards](azure-data-studio-dashboards.md#view-the-sql-managed-instance-dashboards)
- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
