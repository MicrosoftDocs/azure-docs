---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/16/2019
ms.author: alkohli
---

Keep the following best practices in mind:

- The management service cannot retrieve existing passwords: it can only reset them via the Azure portal. We recommend that you store all passwords in a secure place so that you do not have to reset a password if it is forgotten. If you reset a password, be sure to notify all the users before you reset it.
- You can access the Windows PowerShell interface of your device remotely over HTTP. As a security best practice, you should use HTTP only on trusted networks.
- Ensure that device passwords are strong and well-protected. Follow the [Password best practices](https://docs.microsoft.com/azure/security/azure-security-identity-management-best-practices#enable-password-management).