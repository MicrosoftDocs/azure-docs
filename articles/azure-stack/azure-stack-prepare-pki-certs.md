---
title: Prepare Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes how to prepare the Azure Stack PKI certificates for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/22/2018
ms.author: mabrigg
ms.reviewer: ppacent
---

# Prepare Azure Stack PKI certificates for deployment
The certificate files [obtained from your CA of choice](azure-stack-get-pki-certs.md) must be imported and exported with properties matching Azure Stack’s certificate requirements.


## Prepare certificates for deployment
Use these steps to prepare and validate the Azure Stack PKI certificates: 

### Import the certificate

1.	Copy the original certificate versions [obtained from your CA of choice](azure-stack-get-pki-certs.md) into a directory on the deployment host. 
  > [!WARNING]
  > Do not copy files that have already been imported, exported, or altered in any way from the files provided directly by the CA.

2.	Right-click on the certificate and select **Install Certificate**.

3. In the **Certificate Import Wizard**, select **Local Machine** as the import location. Select **Next**.

    ![Local machine import location](.\media\prepare-pki-certs\1.png)

4.	Choose **Place all certificate in the following store** and then select **Enterprise Trust** as the location. Click **OK** to close the certificate store selection dialog box and then **Next**.

    ![Configure the certificate store](.\media\prepare-pki-certs\3.png)

5. Click Finish to complete the import.

### Export the certificate

1. Open the Microsoft Management Console, in Windows 10 right click on Start Menu, then click Run. Type **mmc** click ok.

2. Click File, Add/Remove Snap-In then select Certificates click Add.

    ![Add Certificates Snap-in](.\media\prepare-pki-certs\mmc-2.png)
 
3. Select Computer account, click next then select Local computer then finish. Click ok to close the Add/Remove Snap-In page.

    ![Add Certificates Snap-in](.\media\prepare-pki-certs\mmc-3.png)

4. Browse to the Enterprise Trust > Certificate location. Verify that you see your certificate on the right.

5. Right click on your certificate, click All Tasks then Export, click next.

4. On the **Private key protection** page, enter the password for your certificate files and then enable the **Mark this key as exportable. This allows you to back up or transport your keys at a later time** option. Select **Next**.

    ![Mark key as exportable](.\media\prepare-pki-certs\2.png)

  f.	Click **Finish** to complete the Certificate Import Wizard.

  g.	Repeat the process for all certificates you are providing for your deployment.

3. Export the Certificate to PFX file format with Azure Stack’s requirements:

  a.	Open Certificate Manager MMC console and connect to the Local Machine certificate store.

  b.	Go to the **Enterprise Trust** directory.

  c.	Select one of the certificates you imported in step 2 above.

  d.	From the task bar of Certificate Manager console, select **Actions** > **All Tasks** > **Export**.

  e.	Select **Next**.

  f.	Select **Yes, Export the Private Key**, and then click **Next**.

  g.	In the Export File Format section, select **Export all Extended Properties** and then click **Next**.

  h.	Select **Password** and provide a password for the certificates. Remember this password as it is used as a deployment parameter. Select **Next**.

  i.	Choose a file name and location for the pfx file to export. Select **Next**.

  j.	Select **Finish**.

  k.	Repeat this process for all of the certificates you imported for your deployment in step 2 above.

## Next steps
[Validate PKI certificates](azure-stack-validate-pki-certs.md)