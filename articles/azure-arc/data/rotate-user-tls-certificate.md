---
title: Rotate User provided TLS Certificate in indirect connected Arc-enabled SQL Managed instances
description: Rotate User provided TLS Certificate in indirect connected Arc-enabled SQL MI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/10/2021
ms.topic: how-to
---
# Connect to Azure Arc-enabled SQL Managed Instance

This article describes how to rotate user provided Transport Layer Security(TLS) certificate for Arc-enabled SQL managed instances in indirect-connected mode using Azure CLI or kubectl commands.  [OpenSSL](https://www.openssl.org/) is an  open-source command-line toolkit for general-purpose cryptography and secure communication.

## Prerequisite 

* [Install openssl utility ](https://www.openssl.org/source/) 
* An Arc-enabled SQL Managed instance

## Generate certificate request using openssl 

In case you’d use self-signed certificate, please making sure all needed Subject Alternative Names (SANs) are added. The Subject Alternative Name is an extension to X.509 that allows various values to be associated with a security certificate using a subjectAltName field, the Subject Alternative Name field lets you specify additional host names (sites, IP addresses, common names, etc.) to be protected by a single SSL Certificate, such as a Multi-Domain (SAN) or Extend Validation Multi-Domain Certificate.

To generate certificate on your own, you need to create a Certificate Signing Request (CSR). Verify the configuration for the certificate has a common name with required SANs and have CA issuer with the following command :    

```console
               openssl req -newkey rsa:2048 -keyout your-private-key.key -out your-csr.csr
```

Using the following command to check the required SANs :
```console
               openssl req -noout -text -in <cert-name>
```
The output would look like the following : 

```console
X509v3 Subject Alternative Name:
DNS:<SQLMI name>-svc, DNS:<SQLMI name>-svc.<Namespace>.svc.cluster.local, DNS:<SQLMI name>-svc.<Namespace>.svc
```

## Create Kubernetes secret yaml specification for your service certificate

User can encode a file using the following command with base64 in any linux distribution, data are encoded and decoded to make the data transmission and storing process easier. 

```console
base64 /path/to/file > cert.txt 
```

Then youo can add the base64 encoded cert and private key to the yaml specification file to create a Kubernetes secret :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ secretName }}
type: Opaque
data:
  certificate.pem: {{ base64 encoded certificate }}
  privatekey.pem: {{ base64 encoded private key }}
```

## Rotating certificate via Azure CLI

You can use the following commmand by providing Kubernetes secret that you created previously to rotate the certificate : 

```console
az sql mi-arc update -n mi1 -k <arc> --use-k8s --service-cert-secret <your-cert-secret>
```

The following is an example of above command with a service cert secreat named mymi-cert-secret.
```console
az sql mi-arc update -n mi1 -k <arc> --use-k8s --service-cert-secret mymi-cert-secret
```

You can use the following command to rotate the certificate with the PEM formatted certificate public and private keys, a default service certificate name is generate for you : 

```console
az sql mi-arc update -n mymanagedinstance -k arc --use-k8s --cert-public-key-file path-to-my-cert-public-key --cert-private-key-file path-to-my-cert-private-key 
```

The following is an example of above command :
```console
az sql mi-arc update -n mi1 -k arc --use-k8s --cert-public-key-file ./mi1-1-cert --cert-private-key-file ./mi1-1-pvt
```

You can also provide Kubernetes service cert secret name for --service-cert-secret parameter, in this case, it's taken as an updated secret name then check if the secret exists, the command will create a secret name in case it doesn't and then rotate this secret in SQL instance.

```console
az sql mi-arc update -n mymanagedinstance -k arc --use-k8s --cert-public-key-file path-to-my-cert-public-key --cert-private-key-file path-to-my-cert-private-key --service-cert-secret path-to-mymi-cert-secret
```

The following is an example of above command :
```console
az sql mi-arc update -n mi1 -k arc --use-k8s --cert-public-key-file ./mi1-1-cert --cert-private-key-file ./mi1-1-pvt --service-cert-secret mi1-12-1-cert-secret
```

## Rotating certificate via Kubectl

Once you created the Kubernetes secret, you can bind it to the SQL Managed instance yaml definition **security** section where **serviceCertificateSecret** located as the following : 

```yaml
  security:
    adminLoginSecret: <your-admin-login-secret>
    serviceCertificateSecret: <your-cert-secret>
```
The following is an example to rotate the service certificate in SQL instance named mysqlmi, update its spec with a Kubernetes secret named my-service-cert :

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


# Next steps
- [View the SQL managed instance dashboards](azure-data-studio-dashboards.md#view-the-sql-managed-instance-dashboards)
- [View SQL Managed Instance in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)


