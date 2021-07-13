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
openssl req -new -newkey rsa:1024 -days 365 -nodes -x509 -keyout user_privk.pem -out user_cert.pem -subj=/CN="User Client Certificate"
```

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)