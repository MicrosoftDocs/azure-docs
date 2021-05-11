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

The Confidential Ledger APIs require client certificate-based authentication. Only those certificates added to an allow list during Ledger Creation or Ledger Update can be used to call the Confidential Ledger Functional APIs.

You will need a certificate in PEM format. You can create more than one certificate and add or delete them using Ledger Update API.

1. Use OpenSSL to generate the certificate. To install OpenSSL on Windows ....  For Linux, use `sudo apt-get install openssl ` to install openssl. Then run this command in PowerShell or Bash:

    ```bash
    openssl req -new -newkey rsa:1024 -days 365 -nodes -x509 -keyout user_privk.pem -out user_cert.pem -subj=/CN="User Client Certificate"
    ```

1. Open the user_cert.pem as text and copy/paste the cert for use in the following workflows.

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)