---
title: How to generate and transfer HSM-protected keys for Azure Key Vault - Azure Key Vault
description: Use this article to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. Also known as BYOK or bring your own key.
services: key-vault
author: mbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: keys
ms.topic: tutorial
ms.date: 01/24/2023
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell

---

# Import HSM-protected keys for Key Vault (nCipher)

> [!WARNING]
> The HSM-key import method described in this document is **deprecated** and will not be supported after June 30, 2021. It only works with nCipher nShield family of HSMs with firmware 12.40.2 or newer. Using [new method to import HSM-keys](hsm-protected-keys-byok.md) is strongly recommended.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. Azure Key Vault uses nCipher nShield family of HSMs (FIPS 140-2 Level 2 validated) to protect your keys.

Use this article to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault.

This functionality isn't available for Microsoft Azure operated by 21Vianet. 

> [!NOTE]
> For more information about Azure Key Vault, see [What is Azure Key Vault?](../general/overview.md)
> For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [What is Azure Key Vault?](../general/overview.md).

More information about generating and transferring an HSM-protected key over the Internet:

* You generate the key from an offline workstation, which reduces the attack surface.
* The key is encrypted with a Key Exchange Key (KEK), which stays encrypted until it's transferred to the Azure Key Vault HSMs. Only the encrypted version of your key leaves the original workstation.
* The toolset sets properties on your tenant key that binds your key to the Azure Key Vault security world. So after the Azure Key Vault HSMs receive and decrypt your key, only these HSMs can use it. Your key cannot be exported. This binding is enforced by the nCipher  HSMs.
* The Key Exchange Key (KEK) that is used to encrypt your key is generated inside the Azure Key Vault HSMs and is not exportable. The HSMs enforce that there can be no clear version of the KEK outside the HSMs. In addition, the toolset includes attestation from nCipher that the KEK is not exportable and was generated inside a genuine HSM that was manufactured by nCipher.
* The toolset includes attestation from nCipher that the Azure Key Vault security world was also generated on a genuine HSM manufactured by nCipher. This attestation demonstrates that Microsoft is using genuine hardware.
* Microsoft uses separate KEKs and separate Security Worlds in each geographical region. This separation ensures that your key can be used only in data centers in the region in which you encrypted it. For example, a key from a European customer cannot be used in data centers in North American or Asia.

## More information about nCipher HSMs and Microsoft services

nCipher Security, an Entrust Datacard company, is a leader in the general purpose HSM market, empowering world-leading organizations by delivering trust, integrity and control to their business critical information and applications. nCipher's cryptographic solutions secure emerging technologies – cloud, IoT, blockchain, digital payments – and help meet new compliance mandates, using the same proven technology that global organizations depend on today to protect against threats to their sensitive data, network communications and enterprise infrastructure. nCipher delivers trust for business critical applications, ensuring the integrity of data and putting customers in complete control – today, tomorrow, always.

Microsoft has collaborated with nCipher Security to enhance the state of art for HSMs. These enhancements enable you to get the typical benefits of hosted services without relinquishing control over your keys. Specifically, these enhancements let Microsoft manage the HSMs so that you do not have to. As a cloud service, Azure Key Vault scales up at short notice to meet your organization's usage spikes. At the same time, your key is protected inside Microsoft's HSMs: You retain control over the key lifecycle because you generate the key and transfer it to Microsoft's HSMs.

## Implementing bring your own key (BYOK) for Azure Key Vault

Use the following information and procedures if you will generate your own HSM-protected key and then transfer it to Azure Key Vault. This is known as the Bring Your Own Key (BYOK) scenario.

## Prerequisites for BYOK

See the following table for a list of prerequisites for bring your own key (BYOK) for Azure Key Vault.

| Requirement | More information |
| --- | --- |
| A subscription to Azure |To create an Azure Key Vault, you need an Azure subscription: [Sign up for free trial](https://azure.microsoft.com/pricing/free-trial/) |
| The Azure Key Vault Premium service tier to support HSM-protected keys |For more information about the service tiers and capabilities for Azure Key Vault, see the [Azure Key Vault Pricing](https://azure.microsoft.com/pricing/details/key-vault/) website. |
| nCipher nShield HSMs, smartcards, and support software |You must have access to a nCipher Hardware Security Module and basic operational knowledge of nCipher nShield HSMs. See [nCipher nShield Hardware Security Module](https://www.arrow.com/ecs-media/8441/33982ncipher_nshield_family_brochure.pdf) for the list of compatible models, or to purchase an HSM if you do not have one. |
| The following hardware and software:<ol><li>An offline x64 workstation with a minimum Windows operation system of Windows 7 and nCipher nShield software that is at least version 11.50.<br/><br/>If this workstation runs Windows 7, you must [install Microsoft .NET Framework 4.5](https://download.microsoft.com/download/b/a/4/ba4a7e71-2906-4b2d-a0e1-80cf16844f5f/dotnetfx45_full_x86_x64.exe).</li><li>A workstation that is connected to the Internet and has a minimum Windows operating system of Windows 7 and [Azure PowerShell](/powershell/azure/) **minimum version 1.1.0** installed.</li><li>A USB drive or other portable storage device that has at least 16-MB free space.</li></ol> |For security reasons, we recommend that the first workstation is not connected to a network. However, this recommendation is not programmatically enforced.<br/><br/>In the instructions that follow, this workstation is referred to as the disconnected workstation.</p><br/>In addition, if your tenant key is for a production network, we recommend that you use a second, separate workstation to download the toolset, and upload the tenant key. But for testing purposes, you can use the same workstation as the first one.<br/><br/>In the instructions that follow, this second workstation is referred to as the Internet-connected workstation.</p><br/> |

## Generate and transfer your key to Azure Key Vault HSM

You'll use the following five steps to generate and transfer your key to an Azure Key Vault HSM:

* [Step 1: Prepare your Internet-connected workstation](#prepare-your-internet-connected-workstation)
* [Step 2: Prepare your disconnected workstation](#prepare-your-disconnected-workstation)
* [Step 3: Generate your key](#generate-your-key)
* [Step 4: Prepare your key for transfer](#prepare-your-key-for-transfer)
* [Step 5: Transfer your key to Azure Key Vault](#transfer-your-key-to-azure-key-vault)

## Prepare your Internet-connected workstation

For this first step, do the following procedures on your workstation that is connected to the Internet.

### Install Azure PowerShell

From the Internet-connected workstation, download and install the Azure PowerShell module that includes the cmdlets to manage Azure Key Vault. For installation instructions, see [How to install and configure Azure PowerShell](/powershell/azure/).

### Get your Azure subscription ID

Start an Azure PowerShell session and sign in to your Azure account by using the following command:

```powershell
   Connect-AzAccount
```

In the pop-up browser window, enter your Azure account user name and password. Then, use the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription) command:

```powershell
   Get-AzSubscription
```

From the output, locate the ID for the subscription you will use for Azure Key Vault. You'll need this subscription ID later.

Do not close the Azure PowerShell window.

### Download the BYOK toolset for Azure Key Vault

Go to the Microsoft Download Center and download the Azure Key Vault BYOK toolset for your geographic region or instance of Azure. Use the following information to identify the package name to download and its corresponding SHA-256 package hash:

---
**United States:**

KeyVault-BYOK-Tools-UnitedStates.zip

2E8C00320400430106366A4E8C67B79015524E4EC24A2D3A6DC513CA1823B0D4

---
**Europe:**

KeyVault-BYOK-Tools-Europe.zip

9AAA63E2E7F20CF9BB62485868754203721D2F88D300910634A32DFA1FB19E4A

---
**Asia:**

KeyVault-BYOK-Tools-AsiaPacific.zip

4BC14059BF0FEC562CA927AF621DF665328F8A13616F44C977388EC7121EF6B5

---
**Latin America:**

KeyVault-BYOK-Tools-LatinAmerica.zip

E7DFAFF579AFE1B9732C30D6FD80C4D03756642F25A538922DD1B01A4FACB619

---
**Japan:**

KeyVault-BYOK-Tools-Japan.zip

3933C13CC6DC06651295ADC482B027AF923A76F1F6BF98B4D4B8E94632DEC7DF

---
**Korea:**

KeyVault-BYOK-Tools-Korea.zip

71AB6BCFE06950097C8C18D532A9184BEF52A74BB944B8610DDDA05344ED136F

---
**South Africa:**

KeyVault-BYOK-Tools-SouthAfrica.zip

C41060C5C0170AAAAD896DA732E31433D14CB9FC83AC3C67766F46D98620784A

---
**UAE:**

KeyVault-BYOK-Tools-UAE.zip

FADE80210B06962AA0913EA411DAB977929248C65F365FD953BB9F241D5FC0D3

---
**Australia:**

KeyVault-BYOK-Tools-Australia.zip

CD0FB7365053DEF8C35116D7C92D203C64A3D3EE2452A025223EEB166901C40A

---
[**Azure Government:**](https://azure.microsoft.com/features/gov/)

KeyVault-BYOK-Tools-USGovCloud.zip

F8DB2FC914A7360650922391D9AA79FF030FD3048B5795EC83ADC59DB018621A

---
**US Government DOD:**

KeyVault-BYOK-Tools-USGovernmentDoD.zip

A79DD8C6DFFF1B00B91D1812280207A205442B3DDF861B79B8B991BB55C35263

---
**Canada:**

KeyVault-BYOK-Tools-Canada.zip

61BE1A1F80AC79912A42DEBBCC42CF87C88C2CE249E271934630885799717C7B

---
**Germany:**

KeyVault-BYOK-Tools-Germany.zip

5385E615880AAFC02AFD9841F7BADD025D7EE819894AA29ED3C71C3F844C45D6

---
**Germany Public:**

KeyVault-BYOK-Tools-Germany-Public.zip

54534936D0A0C99C8117DB724C34A5E50FD204CFCBD75C78972B785865364A29

---
**India:**

KeyVault-BYOK-Tools-India.zip

49EDCEB3091CF1DF7B156D5B495A4ADE1CFBA77641134F61B0E0940121C436C8

---
**France:**

KeyVault-BYOK-Tools-France.zip

5C9D1F3E4125B0C09E9F60897C9AE3A8B4CB0E7D13A14F3EDBD280128F8FE7DF

---
**United Kingdom:**

KeyVault-BYOK-Tools-UnitedKingdom.zip

432746BD0D3176B708672CCFF19D6144FCAA9E5EB29BB056489D3782B3B80849

---
**Switzerland:**

KeyVault-BYOK-Tools-Switzerland.zip

88CF8D39899E26D456D4E0BC57E5C94913ABF1D73A89013FCE3BBD9599AD2FE9

---

To validate the integrity of your downloaded BYOK toolset, from your Azure PowerShell session, use the [Get-FileHash](/powershell/module/microsoft.powershell.utility/get-filehash) cmdlet.

   ```powershell
   Get-FileHash KeyVault-BYOK-Tools-*.zip
   ```

The toolset includes:

* A Key Exchange Key (KEK) package that has a name beginning with **BYOK-KEK-pkg-.**
* A Security World package that has a name beginning with **BYOK-SecurityWorld-pkg-.**
* A Python script named **verifykeypackage.py.**
* A command-line executable file named **KeyTransferRemote.exe** and associated DLLs.
* A Visual C++ Redistributable Package, named **vcredist_x64.exe.**

Copy the package to a USB drive or other portable storage.

## Prepare your disconnected workstation

For this second step, do the following procedures on the workstation that is not connected to a network (either the Internet or your internal network).

### Prepare the disconnected workstation with nCipher nShield HSM

Install the nCipher support software on a Windows computer, and then attach a nCipher nShield HSM to that computer.

Ensure that the nCipher tools are in your path (**%nfast_home%\bin**). For example, type :

  ```cmd
  set PATH=%PATH%;"%nfast_home%\bin"
  ```

For more information, see the user guide included with the nShield HSM.

### Install the BYOK toolset on the disconnected workstation

Copy the BYOK toolset package from the USB drive or other portable storage, and then:

1. Extract the files from the downloaded package into any folder.
2. From that folder, run vcredist_x64.exe.
3. Follow the instructions to the install the Visual C++ runtime components for Visual Studio 2013.

## Generate your key

For this third step, do the following procedures on the disconnected workstation. To complete this step your HSM must be in initialization mode.

### Change the HSM mode to 'I'

If you are using nCipher nShield Edge, to change the mode: 1. Use the Mode button to highlight the required mode. 2. Within a few seconds, press and hold the Clear button for a couple of seconds. If the mode changes, the new mode's LED stops flashing and remains lit. The Status LED might flash irregularly for a few seconds and then flashes regularly when the device is ready. Otherwise, the device remains in the current mode, with the appropriate mode LED lit.

### Create a security world

Start a command prompt and run the nCipher new-world program.

   ```cmd
    new-world.exe --initialize --cipher-suite=DLf3072s256mRijndael --module=1 --acs-quorum=2/3
   ```

This program creates a **Security World** file at %NFAST_KMDATA%\local\world, which corresponds to the C:\ProgramData\nCipher\Key Management Data\local folder. You can use different values for the quorum but in our example, you're prompted to enter three blank cards and pins for each one. Then, any two cards give full access to the security world. These cards become the **Administrator Card Set** for the new security world.

> [!NOTE]
> If your HSM does not support the newer cypher suite DLf3072s256mRijndael, you can replace `--cipher-suite= DLf3072s256mRijndael` with `--cipher-suite=DLf1024s160mRijndael`.
>
> Security world created with new-world.exe that ships with nCipher software version 12.50 is not compatible with this BYOK procedure. There are two options available:
> 1. Downgrade nCipher software version to 12.40.2 to create a new security world.
> 2. Contact nCipher support and request them to provide a hotfix for 12.50 software version, which allows you to use 12.40.2 version of new-world.exe that is compatible with this BYOK procedure.

Then:

* Back up the world file. Secure and protect the world file, the Administrator Cards, and their pins, and make sure that no single person has access to more than one card.

### Change the HSM mode to 'O'

If you are using nCipher nShield Edge, to change the mode: 1. Use the Mode button to highlight the required mode. 2. Within a few seconds, press and hold the Clear button for a couple of seconds. If the mode changes, the new mode's LED stops flashing and remains lit. The Status LED might flash irregularly for a few seconds and then flashes regularly when the device is ready. Otherwise, the device remains in the current mode, with the appropriate mode LED lit.

### Validate the downloaded package

This step is optional but recommended so that you can validate the following:

* The Key Exchange Key that is included in the toolset has been generated from a genuine nCipher nShield HSM.
* The hash of the Security World that is included in the toolset has been generated in a genuine nCipher nShield HSM.
* The Key Exchange Key is non-exportable.

> [!NOTE]
> To validate the downloaded package, the HSM must be connected, powered on, and must have a security world on it (such as the one you've just created).

To validate the downloaded package:

1. Run the verifykeypackage.py script by typing one of the following, depending on your geographic region or instance of Azure:

   * For North America:

      ```azurepowershell
      "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-NA-1 -w BYOK-SecurityWorld-pkg-NA-1
      ```

   * For Europe:

      ```azurepowershell
      "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-EU-1 -w BYOK-SecurityWorld-pkg-EU-1
      ```

   * For Asia:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-AP-1 -w BYOK-SecurityWorld-pkg-AP-1
        ```

   * For Latin America:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-LATAM-1 -w BYOK-SecurityWorld-pkg-LATAM-1
        ```

   * For Japan:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-JPN-1 -w BYOK-SecurityWorld-pkg-JPN-1
        ```

   * For Korea:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-KOREA-1 -w BYOK-SecurityWorld-pkg-KOREA-1
        ```

   * For South Africa:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-SA-1 -w BYOK-SecurityWorld-pkg-SA-1
        ```

   * For UAE:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-UAE-1 -w BYOK-SecurityWorld-pkg-UAE-1
        ```

   * For Australia:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-AUS-1 -w BYOK-SecurityWorld-pkg-AUS-1
        ```

   * For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-USGOV-1 -w BYOK-SecurityWorld-pkg-USGOV-1
        ```

   * For US Government DOD:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-USDOD-1 -w BYOK-SecurityWorld-pkg-USDOD-1
        ```

   * For Canada:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-CANADA-1 -w BYOK-SecurityWorld-pkg-CANADA-1
        ```

   * For Germany:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-GERMANY-1 -w BYOK-SecurityWorld-pkg-GERMANY-1
        ```

   * For Germany Public:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-GERMANY-1 -w BYOK-SecurityWorld-pkg-GERMANY-1
        ```

   * For India:

      ```azurepowershell
      "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-INDIA-1 -w BYOK-SecurityWorld-pkg-INDIA-1
      ```

   * For France:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-FRANCE-1 -w BYOK-SecurityWorld-pkg-FRANCE-1
        ```

   * For United Kingdom:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-UK-1 -w BYOK-SecurityWorld-pkg-UK-1
        ```

   * For Switzerland:

        ```azurepowershell
        "%nfast_home%\python\bin\python" verifykeypackage.py -k BYOK-KEK-pkg-SUI-1 -w BYOK-SecurityWorld-pkg-SUI-1
        ```

     > [!TIP]
     > The nCipher nShield software includes Python at %NFAST_HOME%\python\bin
     >
     >
2. Confirm that you see the following, which indicates successful validation: **Result: SUCCESS**

This script validates the signer chain up to the nShield root key. The hash of this root key is embedded in the script and its value should be **59178a47 de508c3f 291277ee 184f46c4 f1d9c639**. You can also confirm this value separately by visiting the [nCipher website](https://www.ncipher.com).

You're now ready to create a new key.

### Create a new key

Generate a key by using the nCipher nShield **generatekey** program.

Run the following command to generate the key:

```azurepowershell
generatekey --generate simple type=RSA size=2048 protect=module ident=contosokey plainname=contosokey nvram=no pubexp=
```

When you run this command, use these instructions:

* The parameter *protect* must be set to the value **module**, as shown. This creates a module-protected key. The BYOK toolset does not support OCS-protected keys.
* Replace the value of *contosokey* for the **ident** and **plainname** with any string value. To minimize administrative overheads and reduce the risk of errors, we recommend that you use the same value for both. The **ident** value must contain only numbers, dashes, and lower case letters.
* The pubexp is left blank (default) in this example, but you can specify specific values.

This command creates a Tokenized Key file in your %NFAST_KMDATA%\local folder with a name starting with **key_simple_**, followed by the **ident** that was specified in the command. For example: **key_simple_contosokey**. This file contains an encrypted key.

Back up this Tokenized Key File in a safe location.

> [!IMPORTANT]
> When you later transfer your key to Azure Key Vault, Microsoft cannot export this key back to you so it becomes extremely important that you back up your key and security world safely. Contact [nCipher](https://www.ncipher.com/about-us/contact-us) for guidance and best practices for backing up your key.
>

You are now ready to transfer your key to Azure Key Vault.

## Prepare your key for transfer

For this fourth step, do the following procedures on the disconnected workstation.

### Create a copy of your key with reduced permissions

Open a new command prompt and change the current directory to the location where you unzipped the BYOK zip file. 
To reduce the permissions on your key, from a command prompt, run one of the following, depending on your geographic region or instance of Azure:

* For North America:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-NA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-NA-
   ```

* For Europe:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-EU-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-EU-1
   ```

* For Asia:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AP-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AP-1
   ```

* For Latin America:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-LATAM-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-LATAM-1
   ```

* For Japan:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-JPN-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-JPN-1
   ```

* For Korea:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-KOREA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-KOREA-1
   ```

* For South Africa:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-SA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-SA-1
   ```

* For UAE:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-UAE-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-UAE-1
   ```

* For Australia:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AUS-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AUS-1
   ```

* For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USGOV-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USGOV-1
   ```

* For US Government DOD:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USDOD-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USDOD-1
   ```

* For Canada:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-CANADA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-CANADA-1
   ```

* For Germany:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1
   ```

* For Germany Public:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1
   ```

* For India:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-INDIA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-INDIA-1
   ```

* For France:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-FRANCE-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-FRANCE-1
   ```

* For United Kingdom:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-UK-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-UK-1
   ```

* For Switzerland:

   ```azurepowershell
   KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-SUI-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-SUI-1
   ```

When you run this command, replace *contosokey* with the same value you specified in **Step 3.5: Create a new key** from the [Generate your key](#generate-your-key) step.

You are asked to plug in your security world admin cards.

When the command completes, you see **Result: SUCCESS** and the copy of your key with reduced permissions are in the file named key_xferacId_\<contosokey>.

You may inspects the ACLS using following commands using the nCipher nShield utilities:

* aclprint.py:

   ```cmd
   "%nfast_home%\bin\preload.exe" -m 1 -A xferacld -K contosokey "%nfast_home%\python\bin\python" "%nfast_home%\python\examples\aclprint.py"
   ```

* kmfile-dump.exe:

   ```cmd
   "%nfast_home%\bin\kmfile-dump.exe" "%NFAST_KMDATA%\local\key_xferacld_contosokey"
   ```

  When you run these commands, replace contosokey with the same value you specified in **Step 3.5: Create a new key** from the [Generate your key](#generate-your-key) step.

### Encrypt your key by using Microsoft's Key Exchange Key

Run one of the following commands, depending on your geographic region or instance of Azure:

* For North America:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-NA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-NA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Europe:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-EU-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-EU-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Asia:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AP-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AP-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Latin America:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-LATAM-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-LATAM-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Japan:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-JPN-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-JPN-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Korea:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-KOREA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-KOREA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For South Africa:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-SA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-SA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For UAE:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-UAE-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-UAE-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Australia:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AUS-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AUS-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USGOV-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USGOV-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For US Government DOD:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USDOD-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USDOD-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Canada:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-CANADA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-CANADA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Germany:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Germany Public:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For India:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-INDIA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-INDIA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For France:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-France-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-France-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For United Kingdom:

   ```azurepowershell
   KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-UK-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-UK-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
   ```

* For Switzerland:

  ```azurepowershell
  KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-SUI-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-SUI-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
  ```

When you run this command, use these instructions:

* Replace *contosokey* with the identifier that you used to generate the key in **Step 3.5: Create a new key** from the [Generate your key](#generate-your-key) step.
* Replace *SubscriptionID* with the ID of the Azure subscription that contains your key vault. You retrieved this value previously, in **Step 1.2: Get your Azure subscription ID** from the [Prepare your Internet-connected workstation](#prepare-your-internet-connected-workstation) step.
* Replace *ContosoFirstHSMKey* with a label that is used for your output file name.

When this completes successfully, it displays **Result: SUCCESS** and there is a new file in the current folder that has the following name: KeyTransferPackage-*ContosoFirstHSMkey*.byok

### Copy your key transfer package to the Internet-connected workstation

Use a USB drive or other portable storage to copy the output file from the previous step (KeyTransferPackage-ContosoFirstHSMkey.byok) to your Internet-connected workstation.

## Transfer your key to Azure Key Vault

For this final step, on the Internet-connected workstation, use the [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey) cmdlet to upload the key transfer package that you copied from the disconnected workstation to the Azure Key Vault HSM:

   ```powershell
        Add-AzKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMkey' -KeyFilePath 'c:\KeyTransferPackage-ContosoFirstHSMkey.byok' -Destination 'HSM'
   ```

If the upload is successful, you see displayed the properties of the key that you just added.

## Next steps

You can now use this HSM-protected key in your key vault. For more information, see this price and feature [comparison](https://azure.microsoft.com/pricing/details/key-vault/).
