<properties
	pageTitle="How to generate and transfer HSM-protected keys for Azure Key Vault | Microsoft Azure"
	description="Use this article to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault."
	services="key-vault"
	documentationCenter=""
	authors="cabailey"
	manager="mbaldwin"
	tags="azure-resource-manager"/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/15/2016"
	ms.author="cabailey"/>
#How to generate and transfer HSM-protected keys for Azure Key Vault

##Introduction

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. The HSMs are FIPS 140-2 Level 2 validated. Azure Key Vault uses Thales nShield family of HSMs to protect your keys.

Use the information in this topic to help you plan for, generate and then transfer your own HSM-protected keys to use with Azure Key Vault.

This functionality is not available for Azure China. 

>[AZURE.NOTE] For more information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)  
>
>For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [Get started with Azure Key Vault](key-vault-get-started.md).

More information about generating and transferring an HSM-protected key over the Internet:

- You generate the key from an offline workstation, which reduces the attack surface.

- The key is encrypted with a Key Exchange Key (KEK), which stays encrypted until it is transferred to the Azure Key Vault HSMs. Only the encrypted version of your key leaves the original workstation.

- The toolset sets properties on your tenant key that binds your key to the Azure Key Vault security world. So after the Azure Key Vault HSMs receive and decrypt your key, only these HSMs can use it. Your key cannot be exported. This binding is enforced by the Thales HSMs.

- The Key Exchange Key (KEK) that is used to encrypt your key is generated inside the Azure Key Vault HSMs and is not exportable. The HSMs enforce that there can be no clear version of the KEK outside the HSMs. In addition, the toolset includes attestation from Thales that the KEK is not exportable and was generated inside a genuine HSM that was manufactured by Thales.

- The toolset includes attestation from Thales that the Azure Key Vault security world was also generated on a genuine HSM manufactured by Thales. This proves to you that Microsoft is using genuine hardware.

- Microsoft uses separate KEKs as well as separate Security Worlds in each geographical region, which ensures that your key can be used only in data centers in the region in which you encrypted it. For example, a key from a European customer cannot be used in data centers in North American or Asia.

##More information about Thales HSMs and Microsoft services

Thales e-Security is a leading global provider of data encryption and cyber security solutions to the financial services, high technology, manufacturing, government, and technology sectors. With a 40-year track record of protecting corporate and government information, Thales solutions are used by four of the five largest energy and aerospace companies, 22 NATO countries, and secure more than 80 per cent of worldwide payment transactions.

Microsoft has collaborated with Thales to enhance the state of art for HSMs. These enhancements enable you to get the typical benefits of hosted services without relinquishing control over your keys. Specifically, these enhancements let Microsoft manage the HSMs so that you do not have to. As a cloud service, Azure Key Vault scales up at short notice to meet your organization’s usage spikes. At the same time, your key is protected inside Microsoft’s HSMs: You retain control over the key lifecycle because you generate the key and transfer it to Microsoft’s HSMs.

##Implementing bring your own key (BYOK) for Azure Key Vault

Use the following information and procedures if you will generate your own HSM-protected key and then transfer it to Azure Key Vault—the bring your own key (BYOK) scenario.


##Prerequisites for BYOK

See the following table for a list of prerequisites for bring your own key (BYOK) for Azure Key Vault.

|Requirement|More information|
|---|---|
|A subscription to Azure|To create an Azure Key Vault, you need an Azure subscription: [Sign up for free trial](https://azure.microsoft.com/pricing/free-trial/)|
|An Azure Key Vault that supports HSMs|For more information about the service tiers and capabilities for Azure Key Vault, see the [Azure Key Vault Pricing](https://azure.microsoft.com/pricing/details/key-vault/) website.|
|Thales HSM, smartcards, and support software|You must have access to a Thales Hardware Security Module and basic operational knowledge of Thales HSMs. See [Thales Hardware Security Module](https://www.thales-esecurity.com/msrms/buy) for the list of compatible models, or to purchase an HSM if you do not have one.|
|The following hardware and software:<ol><li>An offline x64 workstation with a minimum Windows operation system of Windows 7 and Thales nShield software that is at least version 11.50.<br/><br/>If this workstation runs Windows 7, you must [install Microsoft .NET Framework 4.5](http://download.microsoft.com/download/b/a/4/ba4a7e71-2906-4b2d-a0e1-80cf16844f5f/dotnetfx45_full_x86_x64.exe).</li><li>A workstation that is connected to the Internet and has a minimum Windows operation system of Windows 7.</li><li>A USB drive or other portable storage device that has at least 16 MB free space.</li></ol>|For security reasons, we recommend that the first workstation is not connected to a network. However, this is not programmatically enforced.<br/><br/>Note that in the instructions that follow, this workstation is referred to as the disconnected workstation.</p></blockquote><br/>In addition, if your tenant key is for a production network, we recommend that you use a second, separate workstation to download the toolset and upload the tenant key. But for testing purposes, you can use the same workstation as the first one.<br/><br/>Note that in the instructions that follow, this second workstation is referred to as the Internet-connected workstation.</p></blockquote><br/>|

##Generate and transfer your key to Azure Key Vault HSM

You will use the following 5 steps to generate and transfer your key to an Azure Key Vault HSM:

- [Step 1: Prepare your Internet-connected workstation](#step-1-prepare-your-internet-connected-workstation)
- [Step 2: Prepare your disconnected workstation](#step-2-prepare-your-disconnected-workstation)
- [Step 3: Generate your key](#step-3-generate-your-key)
- [Step 4: Prepare your key for transfer](#step-4-prepare-your-key-for-transfer)
- [Step 5: Transfer your key to Azure Key Vault](#step-5-transfer-your-key-to-azure-key-vault)

## Step 1: Prepare your Internet-connected workstation
For this first step, do the following procedures on your workstation that is connected to the Internet.


###Step 1.1: Install Azure PowerShell

From the Internet-connected workstation, download and install the Azure PowerShell module that includes the cmdlets to manage Azure Key Vault. This requires a minimum version of  0.8.13.

For installation instructions, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

###Step 1.2: Get your Azure subscription ID

Start an Azure PowerShell session and sign in to your Azure account by using the following command:

		Add-AzureAccount
In the pop-up browser window, enter your Azure account user name and password. Then, use the [Get-AzureSubscription](https://msdn.microsoft.com/library/azure/dn790366.aspx) command:

		Get-AzureSubscription
From the output, locate the ID for the subscription you will use for Azure Key Vault. You will need this subscription ID later.

Do not close the Azure PowerShell window.

###Step 1.3: Download the BYOK toolset for Azure Key Vault

Go to the Microsoft Download Center and [download the Azure Key Vault BYOK toolset](http://www.microsoft.com/download/details.aspx?id=45345) for your geographic region or instance of Azure. Use the following information to identify the package name to download and its corresponding SHA-256 package hash:

---

**North America:**

KeyVault-BYOK-Tools-UnitedStates.zip

305F44A78FEB750D1D478F6A0C345B097CD5551003302FA465C73D9497AB4A03

---

**Europe:**

KeyVault-BYOK-Tools-Europe.zip

C73BB0628B91471CA7F9ADFCE247561C6016A5103EF1A315D49C3EA23AFC0B9C

---

**Asia:**

KeyVault-BYOK-Tools-AsiaPacific.zip

BE9A84B6C76661929F9FDAD627005D892B3B8F9F19F351220BB4F9C356694192

---

**Latin America:**

KeyVault-BYOK-Tools-LatinAmerica.zip
	
9E8EE11972DECE8F05CD898AF64C070C375B387CED716FDCB788544AE27D3D23

---

**Japan:**

KeyVault-BYOK-Tools-Japan.zip

E6B88C111D972A02ABA3325F8969C4E36FD7565C467E9D7107635E3DDA11A8B2

---

**Australia:**

KeyVault-BYOK-Tools-Australia.zip

7660D7A675506737857B14F527232BE51DC269746590A4E5AB7D50EDD220675D

---

[**Azure Government:**](https://azure.microsoft.com/features/gov/)

KeyVault-BYOK-Tools-USGovCloud.zip

53801A3043B0F8B4A50E8DC01A935C2BFE61F94EE027445B65C52C1ACC2B5E80

---

**Canada:**

KeyVault-BYOK-Tools-Canada.zip

A42D9407B490E97693F8A5FA6B60DC1B06B1D1516EDAE7C9A71AA13E12CF1345

---

**Germany:**

KeyVault-BYOK-Tools-Germany.zip

4795DA855E027B2CA8A2FF1E7AE6F03F772836C7255AFC68E576410BDD28B48E

---
**India:**

KeyVault-BYOK-Tools-India.zip

26853511EB767A33CF6CD880E78588E9BBE04E619B17FBC77A6B00A5111E800C

---

To validate the integrity of your downloaded BYOK toolset, from your Azure PowerShell session, use the [Get-FileHash](https://technet.microsoft.com/library/dn520872.aspx) cmdlet.

	Get-FileHash KeyVault-BYOK-Tools-*.zip

The toolset includes the following:

- A Key Exchange Key (KEK) package that has a name beginning with **BYOK-KEK-pkg-.**
- A Security World package that has a name beginning with **BYOK-SecurityWorld-pkg-.**
- A python script named v**erifykeypackage.py.**
- A command-line executable file named **KeyTransferRemote.exe** and associated DLLs.
- A Visual C++ Redistributable Package, named **vcredist_x64.exe.**

Copy the package to a USB drive or other portable storage.

##Step 2: Prepare your disconnected workstation

For this second step, do the following procedures on the workstation that is not connected to a network (either the Internet or your internal network).


###Step 2.1: Prepare the disconnected workstation with Thales HSM

Install the nCipher (Thales) support software on a Windows computer, and then attach a Thales HSM to that computer.

Ensure that the Thales tools are in your path (**%nfast_home%\bin** and **%nfast_home%\python\bin**). For example, type the following:

		set PATH=%PATH%;”%nfast_home%\bin”;”%nfast_home%\python\bin”

For more information, see the user guide included with the Thales HSM.

###Step 2.2: Install the BYOK toolset on the disconnected workstation

Copy the BYOK toolset package from the USB drive or other portable storage, and then do the following:

1. Extract the files from the downloaded package into any folder.
2. From that folder, run vcredist_x64.exe.
3. Follow the instructions to the install the Visual C++ runtime components for Visual Studio 2013.

##Step 3: Generate your key

For this third step, do the following procedures on the disconnected workstation.

###Step 3.1: Create a security world

Start a command prompt and run the Thales new-world program.

	new-world.exe --initialize --cipher-suite=DLf1024s160mRijndael --module=1 --acs-quorum=2/3

This program creates a **Security World** file at %NFAST_KMDATA%\local\world, which corresponds to the C:\ProgramData\nCipher\Key Management Data\local folder. You can use different values for the quorum but in our example, you’re prompted to enter three blank cards and pins for each one. Then, any two cards will give full access to the security world. These cards become the **Administrator Card Set** for the new security world.

Then do the following:

- Back up the world file. Secure and protect the world file, the Administrator Cards, and their pins, and make sure that no single person has access to more than one card.

###Step 3.2: Validate the downloaded package

This step is optional but recommended so that you can validate the following:

- The Key Exchange Key that is included in the toolset has been generated from a genuine Thales HSM.
- The hash of the Security World that is included in the toolset has been generated in a genuine Thales HSM.
- The Key Exchange Key is non-exportable.

>[AZURE.NOTE]To validate the downloaded package, the HSM must be connected, powered on, and must have a security world on it (such as the one you’ve just created).

To validate the downloaded package:

1.	Run the verifykeypackage.py script by tying one of the following, depending on your geographic region or instance of Azure:
	- For North America:

			python verifykeypackage.py -k BYOK-KEK-pkg-NA-1 -w BYOK-SecurityWorld-pkg-NA-1
	- For Europe:

			python verifykeypackage.py -k BYOK-KEK-pkg-EU-1 -w BYOK-SecurityWorld-pkg-EU-1
	- For Asia:

			python verifykeypackage.py -k BYOK-KEK-pkg-AP-1 -w BYOK-SecurityWorld-pkg-AP-1
	- For Latin America:

			python verifykeypackage.py -k BYOK-KEK-pkg-LATAM-1 -w BYOK-SecurityWorld-pkg-LATAM-1
	- For Japan:

			python verifykeypackage.py -k BYOK-KEK-pkg-JPN-1 -w BYOK-SecurityWorld-pkg-JPN-1
	- For Australia:

			python verifykeypackage.py -k BYOK-KEK-pkg-AUS-1 -w BYOK-SecurityWorld-pkg-AUS-1
	- For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

			python verifykeypackage.py -k BYOK-KEK-pkg-USGOV-1 -w BYOK-SecurityWorld-pkg-USGOV-1
	- For Canada:

			python verifykeypackage.py -k BYOK-KEK-pkg-CANADA-1 -w BYOK-SecurityWorld-pkg-CANADA-1
	- For Germany:

			python verifykeypackage.py -k BYOK-KEK-pkg-GERMANY-1 -w BYOK-SecurityWorld-pkg-GERMANY-1
	- For India:

			python verifykeypackage.py -k BYOK-KEK-pkg-INDIA-1 -w BYOK-SecurityWorld-pkg-INDIA-1
	>[AZURE.TIP]The Thales software includes python at %NFAST_HOME%\python\bin

2.	Confirm that you see the following, which indicates successful validation: **Result: SUCCESS**

This script validates the signer chain up to the Thales root key. The hash of this root key is embedded in the script and its value should be **59178a47 de508c3f 291277ee 184f46c4 f1d9c639**. You can also confirm this value separately by visiting the [Thales website](http://www.thalesesec.com/).

You’re now ready to create a new key.

###Step 3.3: Create a new key

Generate a key by using the Thales **generatekey** program.

Run the following command to generate the key:

	generatekey --generate simple type=RSA size=2048 protect=module ident=contosokey plainname=contosokey nvram=no pubexp=

When you run this command, use these instructions:

- The parameter *protect* must be set to the value **module**, as shown. This creates a module-protected key. The BYOK toolset does not support OCS-protected keys.

- Replace the value of *contosokey* for the **ident** and **plainname** with any string value. To minimize administrative overheads and reduce the risk of errors, we recommend that you use the same value for both. The **ident** value must contain only numbers, dashes, and lower case letters.

- The pubexp is left blank (default) in this example, but you can specify specific values. For more information, see the Thales documentation.

This command creates a Tokenized Key file in your %NFAST_KMDATA%\local folder with a name starting with **key_simple_** followed by the ident that was specified in the command. For example: **key_simple_contosokey**. This file contains an encrypted key.

Back up this Tokenized Key File in a safe location.

>[AZURE.IMPORTANT] When you later transfer your key to Azure Key Vault, Microsoft cannot export this key back to you so it becomes extremely important that you back up your key and security world safely. Contact Thales for guidance and best practices for backing up your key.

You are now ready to transfer your key to Azure Key Vault.

##Step 4: Prepare your key for transfer

For this fourth step, do the following procedures on the disconnected workstation.

###Step 4.1: Create a copy of your key with reduced permissions

To reduce the permissions on your key, from a command prompt, run one of the following, depending on your geographic region or instance of Azure:

- For North America:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-NA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-NA-1
- For Europe:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-EU-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-EU-1
- For Asia:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AP-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AP-1
- For Latin America:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-LATAM-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-LATAM-1
- For Japan:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-JPN-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-JPN-1
- For Australia:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AUS-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AUS-1
- For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USGOV-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USGOV-1
- For Canada:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-CANADA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-CANADA-1
- For Germany:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1
- For India:

		KeyTransferRemote.exe -ModifyAcls -KeyAppName simple -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-INDIA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-INDIA-1


When you run this command, replace *contosokey* with the same value you specified in **Step 3.3: Create a new key** from the [Generate your key](#step-3-generate-your-key) step.

You will be asked to plug in your security world admin cards.

When the command completes, you will see **Result: SUCCESS** and the copy of your key with reduced permissions will be in the file named key_xferacId_<contosokey>.

###Step 4.2: Inspect the new copy of the key

Optionally, run the Thales utilities to confirm the minimal permissions on the new key:

- aclprint.py:

		"%nfast_home%\bin\preload.exe" -m 1 -A xferacld -K contosokey "%nfast_home%\python\bin\python" "%nfast_home%\python\examples\aclprint.py"
- kmfile-dump.exe:

		"%nfast_home%\bin\kmfile-dump.exe" "%NFAST_KMDATA%\local\key_xferacld_contosokey"
When you run these command, replace contosokey with the same value you specified in **Step 3.3: Create a new key** from the [Generate your key](#step-3-generate-your-key) step.

###Step 4.3: Encrypt your key by using Microsoft’s Key Exchange Key

Run one of the following commands, depending on your geographic region or instance of Azure:

- For North America:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-NA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-NA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Europe:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-EU-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-EU-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Asia:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AP-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AP-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Latin America:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-LATAM-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-LATAM-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Japan:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-JPN-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-JPN-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Australia:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-AUS-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-AUS-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For [Azure Government](https://azure.microsoft.com/features/gov/), which uses the US government instance of Azure:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-USGOV-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-USGOV-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Canada:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-CANADA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-CANADA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For Germany:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-GERMANY-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-GERMANY-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey
- For India:

		KeyTransferRemote.exe -Package -KeyIdentifier contosokey -ExchangeKeyPackage BYOK-KEK-pkg-INDIA-1 -NewSecurityWorldPackage BYOK-SecurityWorld-pkg-INDIA-1 -SubscriptionId SubscriptionID -KeyFriendlyName ContosoFirstHSMkey


When you run this command, use these instructions:

- Replace *contosokey* with the identifier that you used to generate the key in **Step 3.3: Create a new key** from the [Generate your key](#step-3-generate-your-key) step.

- Replace *SubscriptionID* with the ID of the Azure subscription that contains your key vault. You retrieved this value previously, in **Step 1.2: Get your Azure subscription ID** from the [Prepare your Internet-connected workstation](#step-1-prepare-your-internet-connected-workstation) step.

- Replace *ContosoFirstHSMKey* with a label that will be used for your output file name.

When this completes successfully it displays **Result: SUCCESS** and there will be a new file in the current folder that has the following name: TransferPackage-*ContosoFirstHSMkey*.byok

###Step 4.4: Copy your key transfer package to the Internet-connected workstation

Use a USB drive or other portable storage to copy the output file from the previous step (KeyTransferPackage-ContosoFirstHSMkey.byok) to your Internet-connected workstation.

##Step 5: Transfer your key to Azure Key Vault

For this final step, on the Internet-connected workstation, use the [Add-AzureKeyVaultKey](https://msdn.microsoft.com/library/azure/dn868048.aspx) cmdlet to upload the key transfer package that you copied from the disconnected workstation to the Azure Key Vault HSM:

	Add-AzureKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'ContosoFirstHSMkey' -KeyFilePath 'c:\TransferPackage-ContosoFirstHSMkey.byok' -Destination 'HSM'

If the upload is successful, you see displayed the properties of the key that you just added.


##Next steps

You can now use this HSM-protected key in your key vault. For more information, see the **If you want to use a hardware security module (HSM)** section in the [Getting started with Azure Key Vault](key-vault-get-started.md) tutorial.
