---
title: Device Guard Signing Service migration to Trusted Signing
description: Learn how to migrate from Device Guard Signing Service (DGSSv2) to Trusted Signing for code integrity policy 
author: meha 
ms.author: mesharm 
ms.service: trusted-signing
ms.topic: how-to 
ms.date: 08/19/2024
ms.custom: template-how-to-pattern, devx-track-azurepowershell
---


# Device Guard Signing Service (DGSSv2) migration to Trusted Signing for code integrity policy

Device Guard Signing Service is being deprecated at the beginning of December 2024. All existing DGSSv2 customers who plan to continue using the service must transition to Trusted Signing.
The root that issues the code signing and CI policy signing certificates remains the same between DGSSv2 and Trusted Signing. Since Trusted Signing is an Azure service, you now need to have Azure Tenant ID and Subscription ID to access signing, and a new dedicated EKU for signing. Steps you need to take include:

1. Get an Azure account
2. Set up access to signing control (controlled through Azure portal and Azure identities)
3. Choose a pricing tier (Trusted Signing is a paid service – learn more about pricing [here](https://azure.microsoft.com/pricing/details/trusted-signing/))
4. Follow the steps dependent on your migration scenarios

This guide outlines the steps needed to migrate to Trusted Signing. **Read the entirety of this document and note these steps must be followed carefully; missing a step may cause damage to the OS image.**

## Migration scenarios

- Scenario 1: Signed CI Policy Migration & Deployment
    - You have an existing CI policy signed with DGSSv2 and now wish to migrate it to Trusted Signing.
- Scenario 2: Unsigned to Signed CI Policy Migration & Deployment
    - You have an existing unsigned CI policy and now wish to migrate it to Trusted Signing with a signed CI policy. 
- Scenario 3: Unsigned to Unsigned CI Policy Migration & Deployment     
    - You have an existing unsigned CI policy and now wish to migrate it to Trusted Signing, maintaining it as an unsigned CI policy.
- Scenario 4: No Existing CI Policy
    - You currently don't have a CI policy deployed in your environment and want to migrate to Trusted Signing.


## Prerequisites
- We strongly encourage creating a restoration image(s)  before proceeding with the migration steps.
- If you had previously deployed a CI policy in your environment (scenarios #1 and #2 above), you must have access to the existing policy xml file.
- We strongly encourage you to do the steps below on one machine before attempting to deploy to your broader environment.


> [!IMPORTANT] 
> Migration isn't possible without creating a Trusted Signing account, Private Trust identity validation, and Private Trust CI policy signing certificate profile using these steps: [Quickstart: Set up Trusted Signing](/azure/trusted-signing/quickstart?tabs=registerrp-portal%2Caccount-portal%2Ccertificateprofile-portal%2Cdeleteresources-portal).


## Scenario 1: Signed CI Policy Migration and Deployment

The migration of the signed CI policy is applicable only to customers who have already implemented a DGSSv2 signed CI policy in their environment. To ensure a smooth transition and deployment, carefully follow the next two steps:

### Step 1: Remove the deployed signed CI policy from a single machine

> [!Note]
> By following the actions of step 1, your machine isn't protected by CI until you have deployed a new one. The deployment of a new policy is covered by step 2

1. Confirm with your system administrator to verify you have a DGSSv2 signed policy deployed, or use below manual way:
    - Go to `C:\Windows\System32\CodeIntegrity`, if there's a `SiPolicy.p7b` file, which indicates you have a CI policy deployed. 
    - Open the file. If it shows a certificate, it means the CI policy is signed. 
    - If you see the error `“This file is invalid for use as the following: PKCS #7”`, the CI policy is unsigned.
2.	Under the Rules section of the current CI Policy XML file, add the following rule:
   	```
    <Rule>
	<Option>Enabled:Unsigned System Integrity Policy</Option>
    </Rule>
    ```

3.	Convert the policy xml to .bin file using this PowerShell: ConvertFrom-CIPolicy

Sample: 
```
ConvertFrom-CIPolicy -XmlFilePath <xmlCIPolicyFilePath> -BinaryFilePath <binaryCIPolicyFilePath>

```
4.	Sign the generated policy .bin file with Trusted Signing using the following instructions: [Sign a CI policy](/azure/trusted-signing/how-to-sign-ci-policy).
5.	Deploy this signed policy .bin file. For more information, refer to [Deploy Windows Defender Application Control polices](/windows/security/threat-protection/windows-defender-application-control/deploy-windows-defender-application-control-policies-using-group-policy).
6.	Reboot the machine and confirm the Code Integrity event 3099 shows that the policy is activated.
    - Open Event Viewer (Select Start, type Event Viewer) &rarr; Applications and Services Logs &rarr; Microsoft &rarr; Windows &rarr; CodeIntegrity &rarr; Operational
    - Filter by event ID 3099
>[!NOTE]
> If you don't see event 3099, DON'T proceed to step 7. Restart from No.1 and make sure your CI policy file is well formed and successfully signed. 
>  - Well formed: Compare the xml with the [default CI policy xml](/windows/security/application-security/application-control/windows-defender-application-control/design/example-wdac-base-policies) to verify the format.
>  - Successfully signed: To verify, use SignTool; refer to this [link](/windows/win32/seccrypto/using-signtool-to-verify-a-file-signature).
    
7. Run the command to delete this CI policy: `del SiPolicy.p7b` from both folders: C:\Windows\System32\CodeIntegrity and S:\EFI\Microsoft\Boot.  
    1. If there's no S: drive, run the command:   
    `mountvol.exe s: /s`. 
    2. If your machine already has an S: drive, mount the EFI partition to a different letter, such as X.
    3. If there's no EFI partition in the machine, ignore the EFI deletion step (if there's no /s option for the command mountvol.exe). 
8. Reboot the machine once deletion is completed. 
9. Reboot the machine twice more, to ensure the CI policy is properly removed, before moving on or deploying this change to other machines. 

### Step 2: Deploy and test the new CI policy on the same machine 
1. Continue to the steps outlined in Scenario 2. 

## Scenario 2: Unsigned to Signed CI Policy Migration and Deployment 

### Step 1: Determine your new EKUs 

1. Since Trusted Signing is a new service it has different EKUs than DGSSv2. Therefore, you need to get the new EKUs added to your policy. You need to get your EKU from the Trusted Signing account to add to your CI policy’s EKU section. The two ways to do so are: 
    1. Using the steps in [Sign a CI policy](/azure/trusted-signing/how-to-sign-ci-policy) run the command Get-AzCodeSigningCustomerEkuto get the customer EKU. 
    2. Within your Trusted Signing account, select “Certificate Profiles”, then select your Private Trust certificate profile. You'll see information on the profile like the screenshot below. The ‘Enhanced key usage’ listed is your customer EKU.
    
 :::image type="content" source="media/trusted-signing-select-eku.png" alt-text="Screenshot that shows eku." lightbox="media/trusted-signing-select-eku.png":::

2. Now that you have the customer EKU. You'll need to generate a function EKU. To do so pass the customer EKU into the code below. The output is your function EKU. 
```
private string CalculateEkuValue(string CustomerEku) 
{ 
     var ekuOid = CryptoConfig.EncodeOID(CustomerEku); 
     var ekuBit = BitConverter.ToString(ekuOid).Replace("-", ""); 

     var ekuArray = ekuBit.ToCharArray(); 
     ekuArray[1] = '1'; 

     return new string(ekuArray); 
} 
```

### Step 2: Deploy and test the new CI policy

1. Now that you have your two EKUs, it is time to edit your CI policy. If you have an existing CI policy, you can proceed to the next section. To create a new one go to: [Policy creation for common WDAC usage scenarios - Windows Security](/windows/security/application-security/application-control/windows-defender-application-control/design/common-wdac-use-cases).
2. Add the new EKU in the EKU section of your policy, using the two EKU values from Step 1. 
```
<EKU ID="ID_EKU_ACS" FriendlyName="ACS EKU -Customer EKU" Value="function EKU"/> 
```

3. Verify these signers are present/added in the CI policy:  

```
<Signer ID="ID_SIGNER_ACS_CODE" Name="Your Account Name Code Signing Certificate"> 

<CertRoot Value="28D3FAEF436A9D7644F01BEFFBF9E143AE6FB7A00B125F86CC9594A078980904B0597DF0F6BDD15E65E80F4D74E6D606" Type="TBS"/> 

<CertEKU ID="ID_EKU_ACS"/> 

</Signer> 

<Signer ID="ID_SIGNER_ACS_POLICY" Name="Your Account Name CI Policy Signing Certificate"> 

<CertRoot Type="TBS" Value="FC9C3E96720126881A6CEA067B5EA11ED0ABFC77835F720EDCFF4660C9A59669"/> 

<CertEKU ID="ID_EKU_ACS"/> 

</Signer> 
```

**Your Account Name Code Signing Certificate** is your Trusted Signing account name. Note that this field isn't verified in the CI policy, but we recommend you putting your Trusted signing account name in the field. To find your account name on the Azure portal navigate to [Azure portal](https://portal.azure.com/), search “Trusted Signing” in the top search bar and select your account that comes up in the search results. The screenshot below shows the account name outlined in red. 

 :::image type="content" source="media/trusted-signing-account-overview.png" alt-text="Screenshot that shows account overview." lightbox="media/trusted-signing-account-overview.png":::

4. Convert the .xml to .bin policy file using the following command: ConvertFrom-CIPolicy 

Sample: 
```
ConvertFrom-CIPolicy -XmlFilePath <xmlCIPolicyFilePath> -BinaryFilePath <binaryCIPolicyFilePath> 
```

5. If you would like to sign this policy, following these instructions [Sign a CI policy](/azure/trusted-signing/how-to-sign-ci-policy)to sign the policy using Trusted Signing. 

6. Deploy this signed policy .bin file; refer to this [link](/windows/security/threat-protection/windows-defender-application-control/windows-defender-application-control-deployment-guide) for instructions. 

7. Reboot the machine and confirm that Code Integrity event 3099 is showing, which means the new CI policy is activated.
> [!NOTE]
> If you don't see event 3099, DON'T proceed to step 8. Restart from No.1 and make sure your CI policy file is well formed and successfully signed.  
        1. Well formed: Compare the xml with the default CI policy xml to verify the format. 
        2. Successfully signed: To verify, use SignTool; refer to this [link](/windows/win32/seccrypto/using-signtool-to-verify-a-file-signature). 
8. Reboot the machine again to ensure a successful boot. 
9. Reboot the machine twice more, to ensure the CI policy is properly enabled, before moving on or deploying this change to other machines. 


### Step 3: Perform testing to validate that the new policy does not break any expected scenarios

1. Verify that any files signed with Trusted Signing still behave as expected.  
2. Sign a catalog file with Trusted Signing and make sure it can run on your test machine with the Trusted Signing (new) CI policy. 
    1. To sign catalog files with Trusted Signing, refer to the steps in: 
        1. [Quickstart: Set up Trusted Signing](/azure/trusted-signing/quickstart?tabs=registerrp-portal%2Caccount-portal%2Ccertificateprofile-portal%2Cdeleteresources-portal) to set up a Private Trust certificate profile.
        2. [Set up signing integrations to use Trusted Signing](/azure/trusted-signing/how-to-signing-integrations) to sign the files using Private Trust in the Trusted Signing service.
    
    2. To sign MSIX packages with Trusted Signing, refer to instructions on how to sign MSIX packages with [MSIX Packaging Tool](/windows/msix/packaging-tool/tool-overview) or SignTool - directly through Trusted Signing. 
        1. To sign with Trusted Signing in the MSIX Packaging Tool you need to join the MSIX Insiders program. 

3. After confirming the CI policy is activated on this machine and all scenarios work as expected, repeat steps on the rest of the desired machines in your environment.  

 ## Scenario 3: Unsigned to Unsigned CI Policy Migration and Deployment 

You need to add the Trusted Signing EKUs to your existing CI policy by following the steps in Scenario 2 to locate and update the EKUs. 

 ## Scenario 4: No existing CI policy 

If isolation is desired, deploy a new CI policy by following steps outlined in Scenario 2. 


## Related content

- [Understand Windows Defender Application Control (WDAC) policy rules and file rules](/windows/security/threat-protection/windows-defender-application-control/select-types-of-rules-to-create).
- [Deploy catalog files to support Windows Defender Application Control (Windows 10) - Windows security](/windows/security/threat-protection/windows-defender-application-control/deploy-catalog-files-to-support-windows-defender-application-control#:~:text=%20Deploy%20catalog%20files%20to%20support%20Windows%20Defender,signing%20certificate%20to%20a%20Windows%20Defender...%20More%20).
- [Example Windows Defender Application Control (WDAC) base policies (Windows 10) - Windows security | Microsoft Docs](/windows/security/threat-protection/windows-defender-application-control/example-wdac-base-policies)
- [Use multiple Windows Defender Application Control Policies (Windows 10)](/windows/security/threat-protection/windows-defender-application-control/deploy-multiple-windows-defender-application-control-policies#deploying-multiple-policies-locally)
- Need help with the migration: Contact us via:
    - Support + troubleshooting (on Azure portal)
    - [Microsoft Q&A](https://learn.microsoft.com/answers/tags/509/trusted-signing) (use the tag **Azure Trusted Signing**) 
    - [Stack Overflow](https://stackoverflow.com/questions/tagged/trusted-signing) (use the tag **trusted-signing**).