---
title: Create Application Control Supplemental Policy for MABS
description: Application Control supplemental policy for MABS lets Azure Local run in Enforced mode without blocking backups. Follow these PowerShell steps to build and deploy your XML policy.
#customer intent: As a backup administrator running Azure Local in Application Control Enforced mode, I want to create a supplemental policy for MABS, so that backup services and their DLLs run without being blocked.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 08/19/2026
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.service: azure-backup
---

# Create an Application Control supplemental policy for MABS by using PowerShell

An Application Control supplemental policy for MABS lets Azure Local run in Enforced mode without blocking backups. When an Azure Local deployment runs in Application Control enforced mode, MABS and all the DLLs it uses must be properly signed. 

This article describes how to create an Application Control supplemental policy by using PowerShell to extend the base policy and allow MABS to run.

## Check and switch the Application Control policy mode on Azure Local

Application Control policies can run in one of three modes: Audit, Enforced, or Disabled.  Learn how to [Switch Application Control policy modes](/azure/azure-local/manage/manage-wdac#switch-application-control-policy-modes).

## Create an Application Control supplemental policy for MABS

To create an Application Control supplemental policy for MABS using PowerShell, follow these steps:

1. Generate a WDAC policy file containing the information required to create the DPM policy from MABS server by running the `New-CIPolicy` cmdlet.

     ```powershell-interactive

		New-CIPolicy `
		-ScanPath "C:\Program Files\Microsoft Azure Backup Server V4\DPM\DPM\ProtectionAgents" `
		-Level Publisher `
		-Fallback Hash `
		-UserPEs `
		-FilePath "C:\WDAC\Broadcom-VMware-TBS-fingerprint.xml"
     ```

1. Create a new XML file by using the following example script, and save it to the path on Azure Local virtual machines **`C:\WDAC\Broadcom_Supplemental-VMWareOnly.xml`**:

	 ```xml
	 <?xml version="1.0" encoding="utf-8"?>
	 <SiPolicy xmlns="urn:schemas-microsoft-com:sipolicy" PolicyType="Supplemental Policy">
		 <VersionEx>10.0.0.0</VersionEx>
		 <PlatformID>{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}</PlatformID>
		 <Rules>
			 <Rule>
				 <Option>Enabled:Unsigned System Integrity Policy</Option>
			 </Rule>
			 <Rule>
				 <Option>Enabled:Advanced Boot Options Menu</Option>
			 </Rule>
			 <Rule>
				 <Option>Enabled:UMCI</Option>
			 </Rule>
		 </Rules>
		 <!-- EKUs -->
		 <EKUs />
		 <!-- File Rules -->
		 <FileRules />
		 <!-- Signers -->
		 <Signers>
			 <!-- Broadcom SHA256/SHA384 signer -->
			 <Signer ID="ID_SIGNER_BROADCOM_SHA256"
				 Name="DigiCert Trusted G4 Code Signing RSA4096 SHA384 2021 CA1">
				 <CertRoot Type="TBS"
					 Value="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" />
				 <CertPublisher Value="Broadcom Inc" />
			 </Signer>
			 <!-- VMware SHA256 signer -->
			 <Signer ID="ID_SIGNER_VMWARE_SHA256" Name="Symantec Class 3 SHA256 Code Signing CA">
				 <CertRoot Type="TBS"
					 Value="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" />
				 <CertPublisher Value="VMware, Inc." />
			 </Signer>
			 <!-- VMware SHA384 signer -->
			 <Signer ID="ID_SIGNER_VMWARE_SHA384"
				 Name="DigiCert Trusted G4 Code Signing RSA4096 SHA384 2021 CA1">
				 <CertRoot Type="TBS"
					 Value="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" />
				 <CertPublisher Value="VMware, Inc." />
			 </Signer>
		 </Signers>
		 <!-- Signing Scenarios -->
		 <SigningScenarios>
			 <!-- User-mode executables/DLLs -->
			 <SigningScenario Value="12" ID="ID_SIGNINGSCENARIO_WINDOWS"
				 FriendlyName="Broadcom+VMware+Microsoft Supplemental User-Mode Policy">
				 <ProductSigners>
					 <AllowedSigners>
						 <AllowedSigner SignerId="ID_SIGNER_BROADCOM_SHA256" />
						 <AllowedSigner SignerId="ID_SIGNER_VMWARE_SHA256" />
						 <AllowedSigner SignerId="ID_SIGNER_VMWARE_SHA384" />
					 </AllowedSigners>
				 </ProductSigners>
			 </SigningScenario>
		 </SigningScenarios>
		 <UpdatePolicySigners />
		 <CiSigners>
			 <CiSigner SignerId="ID_SIGNER_BROADCOM_SHA256" />
			 <CiSigner SignerId="ID_SIGNER_VMWARE_SHA256" />
			 <CiSigner SignerId="ID_SIGNER_VMWARE_SHA384" />
		 </CiSigners>
		 <HvciOptions>0</HvciOptions>
		 <Settings />
		 <BasePolicyID>{yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy}</BasePolicyID>
		 <PolicyID>{zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz}</PolicyID>
	 </SiPolicy>
	 ```

   > [!NOTE]
   > Update `PlatformID`, `BasePolicyID`, `PolicyID`, and `Signer’s TBS value` as needed:
   >
   > - **`PlatformID`**: Represents the platform association. Find this detail in the file `C:\WDAC\Broadcom-VMware-TBS-fingerprint.xml`.
   > - **`BasePolicyID`**: Represents the base policy upon which the current policy relies. You can use `Get-ASLocalWDACPolicyInfo` to find your base policy.
   > - **`PolicyID`**: Represents the identifier for the current policy. Find this detail in the file `C:\WDAC\Broadcom-VMware-TBS-fingerprint.xml`.
   >- **`Signer’s TBS values`**: Fetch the signer‘s signing certificate root/chain identifier (the TBS fingerprint) value from the file `C:\WDAC\Broadcom-VMware-TBS-fingerprint.xml`.

1. To modify the metadata of your supplemental policy, run the following cmdlet:

	 ```powershell
	 # Path of newly created XML
	 $policyPath = "c:\wdac\Broadcom_Supplemental-VMWareOnly.xml"

	 # Set Policy Version (VersionEx in the XML file)
	 $policyVersion = "1.0.0.1"
	 Set-CIPolicyVersion -FilePath $policyPath -Version $policyVersion

	 # Set Policy Info (PolicyName, PolicyID in the XML file)
	 Set-CIPolicyIdInfo -FilePath $policyPath -PolicyID "DPM-Policy_$policyVersion" -PolicyName "DPM-Policy"
	 ```

1. To deploy the policy, run the following cmdlet:

	 ```powershell
	 Add-ASWDACSupplementalPolicy -Path c:\wdac\Broadcom_Supplemental-VMWareOnly.xml
	 ```

1. To check the status of the new policy, run the following cmdlet:

	 ```powershell
	 Get-ASLocalWDACPolicyInfo
	 ```

**Example output**

```output
NodeName : Node1
PolicyMode : Enforced
PolicyGuid : {XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX}
PolicyName : DPM-Policy
PolicyVersion : 1.0.0.1
Status : Active
PolicyScope : Kernel & User
MicrosoftProvided : False
IsSigned : False
```

## Next step

[Back up Azure Local virtual machines with Azure Backup Server](back-up-azure-stack-hyperconverged-infrastructure-virtual-machines.md).

