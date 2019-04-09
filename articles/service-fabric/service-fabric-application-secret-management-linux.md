---
title: Set up an encryption certificate and encrypt secrets on Azure Service Fabric Linux clusters | Microsoft Docs
description: Learn how to set up an encryption certificate and encrypt secrets on Linux clusters.
services: service-fabric
documentationcenter: .net
author: shsha
manager:
editor: ''

ms.assetid: 94a67e45-7094-4fbd-9c88-51f4fc3c523a
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/04/2019
ms.author: shsha

---
# Set up an encryption certificate and encrypt secrets on Linux clusters
This article shows how to set up an encryption certificate and use it to encrypt secrets on Linux clusters. For Windows clusters, see [Set up an encryption certificate and encrypt secrets on Windows clusters][secret-management-windows-specific-link].

## Obtain a data encipherment certificate
A data encipherment certificate is used strictly for encryption and decryption of [parameters][parameters-link] in a service's Settings.xml and [environment variables][environment-variables-link] in a service's ServiceManifest.xml. It is not used for authentication or signing of cipher text. The certificate must meet the following requirements:

* The certificate must contain a private key.
* The certificate key usage must include Data Encipherment (10), and should not include Server Authentication or Client Authentication.

  For example, the following commands can be used to generate the required certificate using OpenSSL:
  
  ```console
  user@linux:~$ openssl req -newkey rsa:2048 -nodes -keyout TestCert.prv -x509 -days 365 -out TestCert.pem
  user@linux:~$ cat TestCert.prv >> TestCert.pem
  ```

## Install the certificate in your cluster
The certificate must be installed on each node in the cluster under `/var/lib/sfcerts`. The user account under which the service is running (sfuser by default) **should have read access** to the installed certificate (that is, `/var/lib/sfcerts/TestCert.pem` for the current example).

## Encrypt secrets
The following snippet can be used to encrypt a secret. This snippet only encrypts the value; it does **not** sign the cipher text. **You must use** the same encipherment certificate that is installed in your cluster to produce ciphertext for secret values.

```console
user@linux:$ echo "Hello World!" > plaintext.txt
user@linux:$ iconv -f ASCII -t UTF-16LE plaintext.txt -o plaintext_UTF-16.txt
user@linux:$ openssl smime -encrypt -in plaintext_UTF-16.txt -binary -outform der TestCert.pem | base64 > encrypted.txt
```
The resulting base-64 encoded string output to encrypted.txt contains both the secret ciphertext as well as information about the certificate that was used to encrypt it. You can verify its validity by decrypting it with OpenSSL.
```console
user@linux:$ cat encrypted.txt | base64 -d | openssl smime -decrypt -inform der -inkey TestCert.prv
```

## Next steps
Learn how to [Specify encrypted secrets in an application.][secret-management-specify-encrypted-secrets-link]

<!-- Links -->
[parameters-link]:service-fabric-how-to-parameterize-configuration-files.md
[environment-variables-link]: service-fabric-how-to-specify-environment-variables.md
[secret-management-windows-specific-link]: service-fabric-application-secret-management-windows.md
[secret-management-specify-encrypted-secrets-link]: service-fabric-application-secret-management.md#specify-encrypted-secrets-in-an-application
