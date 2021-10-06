---
author: sdgilley
ms.service: machine-learning
ms.topic: include
ms.date: 07/30/2021
ms.author: sgilley
---

After you have selected **Next: Advanced Settings**:

1. Turn on **Enable SSH access**.
1. In the **SSH public key source**, select one of the options from the dropdown:
    * If you **Generate new key pair**:
        1. Enter a name for the key in **Key pair name**.
        1. Select **Create**.
        1. Select **Download private key and create compute**.  The key is usually downloaded into the **Downloads** folder.  
    * If you select **Use existing public key stored in Azure**, search for and select the key in **Stored key**.
    * If you select **Use existing public key**, provide an RSA public key in the single-line format (starting with "ssh-rsa") or the multi-line PEM format. You can generate SSH keys using ssh-keygen on Linux and OS X, or PuTTYGen on Windows.