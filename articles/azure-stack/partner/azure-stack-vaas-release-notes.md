---
title: Azure Stack Validation as a Service release notes  | Microsoft Docs
description: Azure Stack Validation as a Service known issues.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Release notes for Validation as a Service

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

This article contains the release notes for Azure Stack Validation as a Service.


# **2018-08-29**
## VaaS pre-requisite and VHD Updates
_Version 4.0.0_

* Updated the required parameters for using Install-VaaSPrerequisites. The documentation for [Azure Stack Validation as a Service (VaaS) On Premise Agent](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-(VaaS)-On-Premise-Agent) has been updated with the following:

`Install-VaaSPrerequisites now requires cloud admin credentials to address an issue during package validation:`
`$ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<aadServiceAdminUser>", (ConvertTo-SecureString "<aadServiceAdminPassword>" -AsPlainText -Force)`
`$CloudAdminCreds = New-Object System.Management.Automation.PSCredential "<cloudAdminDomain\username>", (ConvertTo-SecureString "<cloudAdminPassword>" -AsPlainText -Force)`
`Import-Module .\VaaSPreReqs.psm1 -Force`
`Install-VaaSPrerequisites -AadTenantId $AadTenantId `
                          `-ServiceAdminCreds $ServiceAdminCreds `
                          `-ArmEndpoint https://adminmanagement.$ExternalFqdn `
                          `-Region $Region `
`-CloudAdminCredentials $CloudAdminCreds`

**NOTE:** The $CloudAdinCreds required by the script are for the Azure Stack instance being validated not the Azure Active Directory credentials use by the VaaS tenant. 

# **2018-06-28**
## Interactive Test Category
The interactive test category has been added to identify tests that enable partners to exercise non-automated (a.k.a. interactive) AzureStack scenarios.

# **2018-06-14**
_Version 4.0.0_

## On-Premise Agent Update
The previous version of the on-premise agent is not compatible with the 4.0.0 release of the service. All users must update the version of the agent they are using. Instructions on how to update the agent are available [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-(VaaS)-On-Premise-Agent)

## Automation Update
Changes were made to LaunchVaaSTests PowerShell scripts that require the latest version of the scripting packages. Instructions on installing the latest version of the scripting package are available [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Launching-VaaS-E2E-Script)

## Validation as a Service Portal
### Package Signing Update
When an OEM Customization package is submitted as part of the Package Validation Workflow the package format will be validated to ensure it follows the published specification. If the package does not comply the run will fail, and notification of failure will be sent via e-mail to the e-mail address of the registered Azure Active Directory contact for the tenant.

## Interactive Feature Verification
The ability to provide focused feedback for certain features is now available in the Test Pass Workflow. The currently available test (“OEM Update on Azure Stack 1806 RC Validation 5.1.4.0”) checks to see if specific updates were correctly applied and then collects feedback. The documentation can be found [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-(VaaS)-On-Premise-Agent).

## General Updates
Bug fixes were made that improve stability.

# **2018-04-02**
_Version 3.2.0_

UPDATE: JSON files created using the instructions on the VaaS wiki [[here|Azure-Stack-Validation-as-a-Service-(VaaS)-Test-Parameters]] work correctly. Validation runs with the 1803 build are working correctly. 

## Validation as a Service Portal
### Workflows
The Validation workflow has been broken into two distinct workflows: **Solution Validation** and **Package Validation**. All previously created Validation workflows now appear as Package Validations.

The **Solution Validation** workflow represents the validation type formerly called "New OEM Solution". This workflow is used for validating new Azure Stack solutions. No packages are uploaded in this workflow.  
The **Package Validation** workflow encompasses the validation types formerly called "New OEM Package" and "Update MAS version". This workflow is used for validating new OEM packages as well as validating monthly Azure Stack updates. Package signing requests should be sent by email to vaashelp@microsoft.com with the *Solution* name and *Package Validation* name.
### Common Parameters
In all workflows, the following common test parameters have been added and will be required for scheduling tests (test parameters are also described [[here|Azure-Stack-Validation-as-a-Service-(VaaS)-Test-Parameters]]):
* Cloud Administrator user
* Cloud Administrator password
* Diagnostics connection string

The diagnostics connection string must be an Azure Storage Account SAS URI that meets the criteria detailed on the [[diagnostics collection document|Diagnostics-Collection-as-a-part-of-Test]]. The requirements remain the same, except that the recommended validity period is 3 months (changed from 4 days).
### Known Issues
If tests need to be scheduled on workflows created prior to this update, test parameters need to be reentered. This is possible only for Test Pass workflows. For previously created Validation workflows (now called Package Validations), create a new Package Validation workflow to schedule tests for validating an OEM package.

## General Test Collateral Updates
No new test collateral added. Only bug fixes to common test DLL and updated the SDK tests to use the latest version of common test DLLs.
### VaaS pre-requisite and VHD Updates
* Updated AzureRM version to 1.2.11
* Updated the VHDs used for tests

Below is the updated list of VHDs :
```
.\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Server2016DatacenterFullBYOL.vhd' /NC:12 /V:azcopylog.log /Y
.\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Server2016DatacenterCoreBYOL.vhd' /NC:12 /V:azcopylog.log /Y
.\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'WindowsServer2012R2DatacenterBYOL.vhd' /NC:12 /V:azcopylog.log /Y
.\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Ubuntu1404LTS.vhd' /NC:12 /V:azcopylog.log /Y
.\azcopy.exe /Source:'https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container' /Dest:'<LocalFileShare>' /Pattern:'Ubuntu1604-20170619.1.vhd' /NC:12 /V:azcopylog.log /Y
```

And their associated hashes:

|File Name |SHA256
|:--------------|:--------------|
|Server2016DatacenterFullBYOL.vhd|6ED58DCA666D530811A1EA563BA509BF9C29182B902D18FCA03C7E0868F733E9
|WindowsServer2012R2DatacenterBYOL.vhd|9792CBF742870B1730B9B16EA814C683A8415EFD7601DDB6D5A76D0964767028
|Server2016DatacenterCoreBYOL.vhd|5E80E1A6721A48A10655E6154C1B90E320DF5558487D6A0D7BFC7DCD32C4D9A5
|Ubuntu1404LTS.vhd |B24CDD12352AAEBC612A4558AB9E80F031A2190E46DCB459AF736072742E20E0
|Ubuntu1604-20170619.1.vhd |C481B88B60A01CBD5119A3F56632A2203EE5795678D3F3B9B764FFCA885E26CB


# **2018-01-30**
_Version 3.1.0_

**Test Collateral Update:**
* An issue with the Compute SDK test that was causing Compute SDK failures on build 1712 have been resolved. Test Pass Workflow runs and Validation Workflow runs previously performed on build 1712 should pass.

# **2017-11-30**
_Version 3.1.0_

**Service Updates:**
* Apdex Score: An Apdex score will display for CloudSimulation runs in the Portal UI when the following conditions have been met:
  1. Fiddler has been installed on the node running the test agent. See the instructions for installing the On-Premise agent [here.](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-(VaaS)-On-Premise-Agent)
  2. The MaxFiddlerCaptureSizeInMB parameter for the CloudSimulation has been set to a value of 10 or greater.

  Additional details about Apdex and its use in CloudSimulation available [here.](https://github.com/Azure/azurestack-solutionvalidation/wiki/Cloud-Simulation-Engine)

* Bug Fixes: Internal optimization and minor updates to the Portal UI.

* Note: This update does not include an update to the VaaS On-Premise-Agent. The agent remains version 3.0.0.

# **2017-09-25**
_Version 3.0.0_

**Service Updates:**
* Diagnostics Collection: Collecting diagnostics logs will only require you to provide the storage connection string and not the container name.
* Bug Fixes: A few bug fixes in Portal UI

**Test Collateral:**
* An alpha versions of new tests for the admin and user portal as well as patch and update are available with this update. These tests are available in the “Test Pass Workflow”. These tests are not required. They are in preview and will change going forward. If these tests are scheduled the results will be displayed on the results page.
* Bug Fixes: Some logging and bugs fixes were made to improve test stability.

**Workflow:** Testpass

|Target Service	|Category	|Test Name	|Test Summary
|:--------------|:--------------|:--------------|:------------|
|Multiple	|Functional	|MasAdmin UI Test Suite	|UI test for admin portal
|Multiple	|Functional	|Katal UI Test Suite	|UI test for tenant portal
|Multiple	|Functional	|Patch and Update Test Suite	|Test to exercise the solution patching mechanism


# **2017-08-11**
_Version 2.2.2_

**Automatic Product Diagnostic logs ingestion to Microsoft diagnostics store**
* Any test launched with [diagnostics connection string parameter](https://github.com/Azure/azurestack-solutionvalidation/wiki/Diagnostics-Collection-as-a-part-of-Test) will automatically get all Azure Stack logs ingested into Microsoft diagnostics store. This enables quick analysis for product failures without having to copy over logs.

**Validation Collateral Update**
* A new test “Storage Data-path Operations” has been added to Test Pass Workflow. This test performs various data operations against Azure Stack Storage Tables, Blobs and Queues. Reliability version of this test will be added in later iteration.
* Few fixes were made in SDK test collateral based on product changes in recent build

**Automation (PowerShell)**
* Launcher [Script](https://github.com/Azure/azurestack-solutionvalidation/wiki/Launching-VaaS-E2E-Script) now supports execution of Reliability or multiple categories. Support for overriding certain parameters when scheduling is also supported. For running multiple categories, pass a comma separated list e.g. -VaaSTestCategory Functional,Integration
* Few bug fixes were made after Azure service fabric SDK updates.
* Pre-requisite [Script (VaaSPreReqs.psm1)](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-%28VaaS%29-On-Premise-Agent) has been updated to support PIR Image uploading from local path. This can help in scenarios where access to OS VHD Azure Blob location is slow which degrades the performance of pre-requisite installation.

# **2017-06-30**
_Version 2.1.1_

**Few bug fixes and improvements**
* Complete Support for `stampinfoproperties.json` on VaaS Portal [Test Parameters](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-%28VaaS%29-Test-Parameters)
* Improvements and fixes in Cloud Simulation Engine Suite
* Linux VHD Upload fix in Canary VaaS

# **2017-06-19**
_Version 2.1.0_

**Few bug fixes and improvements**
* Renaming “Common” agent to “Azure Cloud”
* Enhanced logging in validation suites
* Refining Cloud simulation engine suite list

# **2017-06-09**
_Version 2.0.0_

**Solution Validation & Package Signing Workflow**

This is the workflow you will use to validate your solution or package. You can also use this to get your packages signed. The workflow can only be executed via Portal in this release (i.e. no powerShell support).
Please check with vaashelp for any further questions or demo requests.

**Cloud Simulation Engine**

Validation is done by accelerating several months of live data center operations to a smaller duration. These operations consists of both user workloads & faults
The Cloud Simulation engine validation suite will do exactly this and has now been released in both Test Passes and Validation workflows.

**Validation Suites Streaming Analytics**

Cloud Simulation Engine Suite runs for days. While it is running you can monitor live operation statistics as well as Solution SLA by clicking the context menu (which is what you click to download logs) and selecting “**View Operations**” option.

**Few bug fixes and minor improvements**
* Subscriptions to workflows
* Improvements in scripts and logging
* Detailed error messages

**Important: The Following Steps will need to be performed to re-enable VaaS post-patch for Exiting VaaS Users:**

1.	Delete all the below applications that were provisioned in your Azure AD tenant (optional but recommended to avoid confusion). These applications appear under Publisher is “Azure Stack Validation”
2.	Login in to https://aka.ms/vaas with your VaaS credentials. You will be prompted for consent again.
3.	Once logged in, you may get an error “Unauthorized”. At this point go back to your Azure AD tenant. You will see the following two applications provisioned, this time from Publisher “Microsoft”
* 	      AzureStack Validation Management Api
* 	      AzureStack Validation Portal
4.	Select the “AzureStack Validation Management Api“ application and re-assign the user role (e.g. Owner, Test Contributor etc.) for it just like before.
5.	Log out from the Portal and re-login. This time everything should work and you will be able to access your data.
6.	Re-download packages again and resume.
* 	Agent [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Azure-Stack-Validation-as-a-Service-(VaaS)-On-Premise-Agent)
* 	Report cmdlets [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Generating-test-pass-Report)
* 	Launcher Script [here](https://github.com/Azure/azurestack-solutionvalidation/wiki/Launching-VaaS-E2E-Script)


# **2017-05-02**
_Version 1.3.6_

**Optimizing Pre-requisite Installation**
* Converting script to psm1 module
* Selective installation of components

**Lazy loading test pass details**
* Improving load time for test pass summary page

**Few bug fixes and minor improvements**
* Issues around token expiration and cache
* Making region mandatory parameter


# **2017-04-15**
_Version 1.2.5_

**VaaS Service & Portal**
* Test Execution Duration on Test Summary Page
* Support for Organizational Sign-in on VaaS Portal
     * Your organization must already be on-boarded to Azure AD. A quick way to test this is to see if you can access Azure [portal](https://portal.azure.com/) using your organizational creds.
     * Organizational user must be added into the Azure AD tenant _registered with VaaS_ (i.e. as guest/external user) and assigned the role.

**VaaS On-Premise Agent/Handlers**
* Diagnostic & Health log collection (applies only to tests in reliability category)

**VaaS PowerShell**
* Few bug fixes in Pre-req script
* Linux PIR support in Pre-req script
* Capturing build number in [Report](https://github.com/Azure/azurestack-solutionvalidation/wiki/Generating-test-pass-Report)


# **2017-03-30**
_Version 1.1.4_

**VaaS Service & Portal**
* Few security bug fixes

**VaaS On-Premise Agent**
* Few bugs fixes

**VaaS PowerShell**
* End to End [Launcher Script](https://github.com/Azure/azurestack-solutionvalidation/wiki/Launching-VaaS-E2E-Script) is back.
* Generate [report](https://github.com/Azure/azurestack-solutionvalidation/wiki/Generating-test-pass-Report) cmdlet.


# **2017-03-01**
_Version 1.0.3_

**VaaS Service & Portal**
* Test Pass Workflow to execute Admin & Tenant scenarios for build validation
* Capture build information for tracking
* Detailed test summary for reporting
* Improved test statistics reporting

**VaaS On-Premise Agent**
* Support for executing with out-bound connectivity only
* Resiliency Improvements
* Enhanced Pre-req installation
* Test Parameter validation before kicking off tests

**VaaS PowerShell [Cmdlets](https://www.powershellgallery.com/packages/AzureStackVaaS/)**
* Managing Solution, Test Pass and Tests
* On-Premise Agent operations
* Launcher Script for End to End Functional or Integration Test Launch & Report generation

**Test Content**
* Functional SDK tests to verify consistency
* Integration/Scenario Admin & Tenant operations


## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
