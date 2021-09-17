---
title: Creating a Client Certificate with Microsoft Azure Confidential Ledger
description: Creating a Client Certificate with Microsoft Azure Confidential Ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Creating a Client Certificate

The Confidential Ledger APIs require client certificate-based authentication. Only those certificates added to an allowlist during Ledger Creation or Ledger Update can be used to call the Confidential Ledger Functional APIs.

You will need a certificate in PEM format. You can create more than one certificate and add or delete them using Ledger Update API.

## OpenSSL

We recommending using OpenSSL to generate certificates. If you have git installed, you can run OpenSSL in the git shell. Otherwise, you can install OpenSSL for your OS.

- **Windows**: Install [chocolatey for Windows](https://chocolatey.org/install), open a PowerShell terminal windows in admin mode, and run `choco install openssl`. Alternatively, you can install OpenSSL for Windows directly from [here](http://gnuwin32.sourceforge.net/packages/openssl.htm).
- **Linux**: Run `sudo apt-get install openssl`

You can then generate a certificate by running `openssl` in a Bash or PowerShell terminal window:

```bash
openssl ecparam -out "privkey_name.pem" -name "secp384r1" -genkey
openssl req -new -key "privkey_name.pem" -x509 -nodes -days 365 -out "cert.pem" -"sha384" -subj=/CN="ACL Client Cert"
```

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)