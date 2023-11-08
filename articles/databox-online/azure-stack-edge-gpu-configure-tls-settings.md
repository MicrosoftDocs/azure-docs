---
title: Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device
description: Describes how to configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 05/24/2023
ms.author: alkohli
---

# Configure TLS 1.2 on Windows clients accessing Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

If you are using a Windows client to access your Azure Stack Edge Pro device, you are required to configure TLS 1.2 on your client. This article provides resources and guidelines to configure TLS 1.2 on your Windows client. 

The guidelines provided here are based on testing performed on a client running Windows Server 2016.

## Configure TLS 1.2 for current PowerShell session

Use the following steps to configure TLS 1.2 on your client.

1. Run PowerShell as administrator.
2. To set TLS 1.2 for the current PowerShell session, type:
  
    ```azurepowershell
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    ```

## Configure TLS 1.2 on client

If you want to set system-wide TLS 1.2 for your environment, follow the guidelines in these documents:

- [General- how to enable TLS 1.2](/windows-server/security/tls/tls-registry-settings#tls-12)
- [How to enable TLS 1.2 on clients](/configmgr/core/plan-design/security/enable-tls-1-2-client)
- [How to enable TLS 1.2 on the site servers and remote site systems](/configmgr/core/plan-design/security/enable-tls-1-2-server)
- [Protocols in TLS/SSL (Schannel SSP)](/windows-server/security/tls/manage-tls#configuring-tls-ecc-curve-order)
- [Cipher Suites](/windows-server/security/tls/tls-registry-settings#tls-12): Specifically [Configuring TLS Cipher Suite Order](/windows-server/security/tls/manage-tls#configuring-tls-cipher-suite-order)
    Make sure that you list your current cipher suites and prepend any missing from the following list:

    - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    - TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
    - TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384

    You can also add these cipher suites by directly editing the registry settings.
    The variable $HklmSoftwarePath should be defined
    $HklmSoftwarePath = 'HKLM:\SOFTWARE'

    ```azurepowershell
    New-ItemProperty -Path "$HklmSoftwarePath\Policies\Microsoft\Cryptography\Configuration\SSL\00010002" -Name "Functions"  -PropertyType String -Value ("TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384")
    ```

- How to set elliptical curves

    Make sure that you list your current elliptical curves and prepend any missing from the following list:

    - P-256 
    - P-384

    You can also add these elliptical curves by directly editing the registry settings.
    
    ```azurepowershell
    New-ItemProperty -Path "$HklmSoftwarePath\Policies\Microsoft\Cryptography\Configuration\SSL\00010002" -Name "EccCurves" -PropertyType MultiString -Value @("NistP256", "NistP384")
    ```
    
    - [Set min RSA key exchange size to 2048](/windows-server/security/tls/tls-registry-settings#keyexchangealgorithm---client-rsa-key-sizes).



## Next steps

[Connect to Azure Resource Manager](./azure-stack-edge-gpu-connect-resource-manager.md)
