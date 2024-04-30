---
title: Creating a Client Certificate with Microsoft Azure confidential ledger
description: Creating a Client Certificate with Microsoft Azure confidential ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.custom:
ms.topic: overview
ms.date: 04/11/2023
ms.author: mbaldwin
---
# Creating a Client Certificate

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

The Azure confidential ledger APIs require client certificate-based authentication. Only those certificates added to an allowlist during ledger creation or a ledger update can be used to call the confidential ledger Functional APIs.

You need a certificate in PEM format. You can create more than one certificate and add or delete them using ledger Update API.

## OpenSSL

We recommend using OpenSSL to generate certificates. If you have git installed, you can run OpenSSL in the git shell. Otherwise, you can install OpenSSL for your OS.

- **Windows**: Install [Chocolatey for Windows](https://chocolatey.org/install), open a PowerShell terminal window in admin mode, and run `choco install openssl`. Alternatively, you can install OpenSSL for Windows directly from [here](http://gnuwin32.sourceforge.net/packages/openssl.htm).
- **Linux**:
  - Ubuntu:

  ```bash
  sudo apt-get install openssl
  ```

  - RHEL/CentOS:

  ```bash
  sudo yum install openssl -y
  ```

  - SUSE:

  ```bash
  sudo zypper install openssl
  ```

You can then generate a certificate by running `openssl` in a Bash or PowerShell terminal window:

```bash
openssl ecparam -out "privkey_name.pem" -name "secp384r1" -genkey
openssl req -new -key "privkey_name.pem" -x509 -nodes -days 365 -out "cert.pem" -"sha384" -subj=/CN="ACL Client Cert"
```

## Next steps

- [Overview of Microsoft Azure confidential ledger](overview.md)
