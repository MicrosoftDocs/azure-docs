---
title: Troubleshoot getting started feature Azure Virtual Desktop
---

# Troubleshoot the Azure Virtual Desktop getting started feature

The Azure Virtual Desktop getting started feature uses nested templates to deploy Azure resources for validation and automation in Azure Virtual Desktop. The getting started feature creates either two or three resource groups based on whether the subscription it's running on has either non-Azure or Azure Active Directory Domain Services (Azure AD DS) or not. All resource groups start with the same user-defined prefix.

There are currently three resource groups that run nested templates. The following lists show each resource group and the templates they run.

The resource group that ends in "-deployment" runs these templates:

- easy-button-roleassignment-job-linked-template
- easy-button-prerequisitecompletion-job-linked-template
- easy-button-prerequisite-job-linked-template
- easy-button-inputvalidation-job-linked-template
- easy-button-deploymentResources-linked-template
- easy-button-prerequisite-user-setup-linked-template

>[!NOTE]
>The easy-button-prerequisite-user-setup-linked-template is optional and will only appear if you created a validation user.

![Graphical user interface, application Description automatically generated](media/d636a3811239ee03ab90386283ac8677.png)

The resource group that ends in "-wvd" runs these templates:

- NSG-linkedTemplate
- vmCreation-linkedTemplate
- Workspace-linkedTemplate
- wvd-resources-linked-template
- easy-button-wvdsetup-linked-template

![Graphical user interface, application Description automatically generated](media/a5cd081278e4fb4380eccab2c7ca9568.png)

The resource group that ends in "-prerequisite" runs these templates:

- easy-button-prerequisite-resources-linked-template

![Graphical user interface, text, application Description automatically generated](media/a500d711b474c22676d89c5b0cd0114d.png)

>[!NOTE]
>This resource group is optional, and will only appear if your subscription doesn't have Azure AD DS or AD DS.

## No subscriptions

![Text Description automatically generated](media/b2444fa3c59ef9d0ecf7d7408621bba5.png)

In this issue, you see an error message that says "no subscriptions" when opening the getting started tool. This happens when you try to open the tool without an active Azure subscription.

To fix this issue, check to see if your subscription or the affected user has an active Azure subscription. If they don't, assign the user the Owner Role-based Access Control (RBAC) role on their subscription.

## You don’t have permissions

![Graphical user interface, text, application Description automatically generated](media/4426fa8aebf1aa9bcd06e703c75b0c19.png)

This issue happens when you open the getting started tool and get an error message that says, "You don't have permissions." This message appears when the user running the tool doesn't have Owner permissions on their active Azure subscription.

To fix this issue, sign in with an Azure account that has Owner permissions, then assign the Owner RBAC role to the affected account.

## Fields under Virtual Machine tab are grayed out

This issue is when you open the **Virtual machine** tab and see that the fields under "Do you want users to share this machine?" are grayed out. This issue then prevents you from changing the image type, selecting an image to use, or changing the VM size.

![Graphical user interface, text, application Description automatically generated](media/35dc44c3ace5b09a8f6313bbe3e30cd9.png)

This issue happens when you run the tool with a prefix that was already used to start a deployment. When the tool creates a deployment, it creates an object to represent the deployment in Azure. Certain values in the object, like the image, become attached to that object to prevent multiple objects from using the same images.

To fix this issue, you can either delete all resource groups with the existing prefix or use a new prefix.

## Username must not include reserved words

This error occurs while input in being entered.

![Graphical user interface, text, application Description automatically generated](media/ab71a238b3cfd8b9200c4f17ea7792b5.png)

**Cause:** Azure security best practices dictate that certain words are not allow througH public endpoints. Full list is available [here](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/error-reserved-resource-name).

**Resolution:** Add additional prefixes or suffixes to the blocked reserved word (e.g. AVDAdmin, instead of Admin).

## The value must be between 12 and 72 characters long

This error occurs when entering a password that does not meet the length requirements for Azure.

![Graphical user interface, text, application, email Description automatically generated](media/b3b223c5e6993589752b8108ecd796e4.png)

**Cause:** Any Azure field that stores secure text is subject to Azure requirements for complexity. This includes fields that are later used in Windows, which have less complex requirements.

**Resolution:** Use an account with password complexity equivalent or greater than what Azure enforces.

## Failures in easy-button-prerequisite-user-setup-linked-template

![Graphical user interface, text, application Description automatically generated](media/e9c1fc8ebe8f7f411c376095ee194ca9.png)

**Operation details:**

```
"error": {
        "code": "DeploymentFailed",
        "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.",
        "details": [
            {
                "code": "Conflict",
                "message": "{\r\n  \"status\": \"Failed\",\r\n  \"error\": {\r\n    \"code\": \"ResourceDeploymentFailure\",\r\n    \"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\",\r\n    \"details\": [\r\n      {\r\n        \"code\": \"VMExtensionProvisioningError\",\r\n        \"message\": \"VM has reported a failure when processing extension 'Microsoft.Powershell.DSC'. Error message: \\\"DSC Configuration 'AddADDSUser' completed with error(s). Following are the first few: PowerShell DSC resource MSFT_ScriptResource  failed to execute Set-TargetResource functionality with error message: Some error occurred in DSC CreateUser SetScript: \\r\\n\\r\\nException             : Microsoft.ActiveDirectory.Management.ADIdentityNotFoundException: Cannot find an object with \\r\\n                        identity: 'Adam S' under: 'DC=GT090617,DC=onmicrosoft,DC=com'.\\r\\n                           at Microsoft.ActiveDirectory.Management.Commands.ADFactoryUtil.GetObjectFromIdentitySearcher(\\r\\n                        ADObjectSearcher searcher, ADEntity identityObj, String searchRoot, AttributeSetRequest attrs, \\r\\n                        CmdletSessionInfo cmdletSessionInfo, String[]& warningMessages)\\r\\n                           at \\r\\n                        Microsoft.ActiveDirectory.Management.Commands.ADFactory`1.GetDirectoryObjectFromIdentity(T \\r\\n                        identityObj, String searchRoot, Boolean showDeleted)\\r\\n                           at \\r\\n                        Microsoft.ActiveDirectory.Management.Commands.SetADGroupMember`1.ValidateMembersParameter()\\r\\nTargetObject          : Adam S\\r\\nCategoryInfo          : ObjectNotFound: (Adam S:ADPrincipal) [Add-ADGroupMember], ADIdentityNotFoundException\\r\\nFullyQualifiedErrorId : SetADGroupMember.ValidateMembersParameter,Microsoft.ActiveDirectory.Management.Commands.AddADGro\\r\\n                        upMember\\r\\nErrorDetails          : \\r\\nInvocationInfo        : System.Management.Automation.InvocationInfo\\r\\nScriptStackTrace      : at <ScriptBlock>, C:\\\\Packages\\\\Plugins\\\\Microsoft.Powershell.DSC\\\\2.83.1.0\\\\DSCWork\\\\DSCADUserCreatio\\r\\n                        nScripts_2020-04-28.2\\\\Script-CreateADDSUser.ps1: line 98\\r\\n                        at <ScriptBlock>, <No file>: line 8\\r\\n                        at ScriptExecutionHelper, C:\\\\Windows\\\\system32\\\\WindowsPowerShell\\\\v1.0\\\\Modules\\\\PSDesiredStateConfi\\r\\n                        guration\\\\DscResources\\\\MSFT_ScriptResource\\\\MSFT_ScriptResource.psm1: line 270\\r\\n                        at Set-TargetResource, C:\\\\Windows\\\\system32\\\\WindowsPowerShell\\\\v1.0\\\\Modules\\\\PSDesiredStateConfigur\\r\\n                        ation\\\\DscResources\\\\MSFT_ScriptResource\\\\MSFT_ScriptResource.psm1: line 144\\r\\nPipelineIterationInfo : {}\\r\\nPSMessageDetails      : \\r\\n\\r\\n\\r\\n\\r\\n  The SendConfigurationApply function did not succeed.\\\"\\r\\n\\r\\nMore information on troubleshooting is available at https://aka.ms/VMExtensionDSCWindowsTroubleshoot \"\r\n      }\r\n    ]\r\n  }\r\n}"
            }
        ]
    }

```

**Cause**:

This error occurs when the AD DS VM already has an extension of type
Microsoft.Powershell.DSC associated with it.

![Graphical user interface, text, application, email Description automatically generated](media/4f92fea31a48523ebe85cf019f0750ed.png)

**Resolution**:

Uninstall the extension of type Microsoft.Powershell.DSC and run the Getting
started wizard.

![Graphical user interface, text, application Description automatically generated](media/2b0c59ce31f0a05773e9b89fdc38c097.png)

Failure in **easy-button-prerequisite-job-linked-template**
-----------------------------------------------------------

![Table Description automatically generated with medium confidence](media/69bdc5396968ab304c4b8c82805a0070.png)

**Operation details:**

```
{
    "status": "Failed",
    "error": {
        "code": "DeploymentFailed",
        "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage details.",
        "details": [
            {
                "code": "Conflict",
                "message": "{\r\n  \"status\": \"Failed\",\r\n  \"error\": {\r\n    \"code\": \"ResourceDeploymentFailure\",\r\n    \"message\": \"The resource operation completed with terminal provisioning state 'Failed'.\"\r\n  }\r\n}"
            }
        ]
    }
}

```

The resource operation completed with terminal provisioning state 'Failed'

**Troubleshooting steps:**

Click on **easy-button-prerequisite-job-linked-template** and then on the failed step. Confirm the error message.

Navigate to the **\<prefix\>-deployment resource group** and click on the **resourceSetupRunbook**.

![Chart Description automatically generated with low confidence](media/a375462e51ae0fbe08861ccd87b82965.png)

Click on the **Failed.**

![Graphical user interface, text, application, email Description automatically generated](media/bba1f148aa253664e7055b512cb1d6d9.png)

Select the **Exception** tab.

The running command stopped because the preference variable "ErrorActionPreference" or common parameter is set to Stop: Error while creating and adding validation user ssb\@Yasminecorp.onmicrosoft.com to group WVDValidationUsers

**Resolution:**

Creation of the validation user failed. This is a known bug 33328817. As a workaround run The Azure Virtual Desktop getting started feature again but this time without creating validation user. Then use the manual process to create users.

Validating if domain administrator \<UPN\> exists already in case of new subscription.

**Troubleshooting steps:**

Click on **easy-button-prerequisite-job-linked-template** and then on the failed step. Confirm the error message.

Navigate to the **\<prefix\>-deployment resource group** and click on the **resourceSetupRunbook**.

![Chart Description automatically generated with low confidence](media/a375462e51ae0fbe08861ccd87b82965.png)

Click on the **Failed.**

![Text Description automatically generated](media/359bb613fa65a2c11c14a2941e2d0f00.png)

Select the **Output** tab.

Validating if domain administrator \<UPN\> exists already in case of new subscription.

**Resolution 1:**

Creation of the domain administrator user failed. This is likely due to the user already existing. As a workaround run the getting started wizard again but this time make sure to enter an username that does not exist in your identity provider.

**Resolution 2:**

Creation of the validation user failed. This is a known bug 33328817. As a workaround run The Azure Virtual Desktop getting started feature again but this time without creating validation user. Then use the manual process to create users.

## Failure in easy-button-inputvalidation-job-linked-template

![Graphical user interface, text, application, chat or text message Description automatically generated](media/120c7a3bbbcd9a79ffe01454f7d3e588.png)

**Operation details:**

```
{
    "status": "Failed",
    "error": {
        "code": "ResourceDeploymentFailure",
        "message": "The resource operation completed with terminal provisioning state 'Failed'."
    }
}
```

**Troubleshooting steps:**

Open the \<prefix\>-deployment resource group and look for **inputValidationRunbook.**

![Graphical user interface, text, application, email Description automatically generated](media/7ce89568bf22be8be3b1c7ed852c0654.png)

Under recent jobs there will be a job with failed status. Click on **Failed**.

![Chart Description automatically generated with low confidence](media/0d0dce68aa8cd67fe2b46a1aa450a2fe.png)

This will open the details of the job. Click on **Exception**.

![Graphical user interface, text, application, email Description automatically generated](media/1bc7d713dbd69f3d086a9707e61f8c27.png)

**Cause**:

The Azure administrator credential (**Azure admin UPN**) are not correct. Either password or username are incorrect and The Azure Virtual Desktop getting started feature block deployment.

The setup process for MSIX app attach file share has only one difference when compared to the FSLogix profiles share. That difference is the type of permissions that must be granted on the files share. MSIX app attach requires read-only permissions on the files share.

Below are the steps for the different storage fabrics. Select article based on what storage is being used in the Azure Virtual Desktop environment.

### Multiple VMExtensions per handler not supported for OS type 'Windows'

![Graphical user interface, text, application Description automatically generated](media/5e86503ad02cdc497214125c55ed7e1b.png)

**Operation details:**

```
{
    "status": "Failed",
    "error": {
        "code": "BadRequest",
        "message": "Multiple VMExtensions per handler not supported for OS type 'Windows'. VMExtension 'Microsoft.Powershell.DSC' with handler 'Microsoft.Powershell.DSC' already added or specified in input."
    }
}
```

**Cause:**

When ran on an Existing setup with AD DS as identity provider Quickstart will use a Microsoft.Powershell.DSC to create validation users and configure FSLogix. However, Windows VMs in Azure cannot have multiple DSC extensions of the same type Microsoft.Powershell.DSC.

**Resolution:**

Prior to running Quickstart remove any Microsoft.Powershell.DSC from the domain controller VM.

## Failure in easy-button-prerequisitecompletion-job-linked-template

![A screenshot of a computer Description automatically generated with medium confidence](media/0e91a75ba9bc09ac26ce49f972c3a32f.png)

**Operation details:**

```
{
    "status": "Failed",
    "error": {
        "code": "ResourceDeploymentFailure",
        "message": "The resource operation completed with terminal prvisioning state ‘Failed’."
    }
}
```

**Troubleshooting steps:**

Open the \<prefix\>-prerequisites resource group and look for **prerequisiteSetupCompletionRunbook.** Review **All Logs.**

![A screenshot of a computer Description automatically generated with medium confidence](media/0b87cc96be6809121669e5d6835ab9ca.png)

![A picture containing text, screenshot, monitor, indoor Description automatically generated](media/61cbe771c2132db2950dee144d5c33c9.png)

**Cause:** The validation users’ group will be created in the USERS container. The Validation group must be synced to Azure AD for the process to be completed
successfully**.**

**Resolution:**

1.  Enable synch for USERS container

2.  Pre-create the AVDValidationUsers group into an organization unit (OU) that is being synced to Azure.
