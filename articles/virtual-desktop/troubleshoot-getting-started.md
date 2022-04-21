---
title: Troubleshoot getting started feature Azure Virtual Desktop
description: How to troubleshoot issues with the Azure Virtual Desktop getting started feature.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 08/06/2021
ms.author: helohr
manager: femila
---

# Troubleshoot the Azure Virtual Desktop getting started feature

The Azure Virtual Desktop getting started feature uses nested templates to deploy Azure resources for validation and automation in Azure Virtual Desktop. The getting started feature creates either two or three resource groups based on whether the subscription it's running on has existing Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS) or not. All resource groups start with the same user-defined prefix.

When you run the nested templates, they create three resource groups and a template that provisions Azure Resource Manager resources. The following lists show each resource group and the templates they run.

The resource group that ends in "-deployment" runs these templates:

- easy-button-roleassignment-job-linked-template
- easy-button-prerequisitecompletion-job-linked-template
- easy-button-prerequisite-job-linked-template
- easy-button-inputvalidation-job-linked-template
- easy-button-deploymentResources-linked-template
- easy-button-prerequisite-user-setup-linked-template

>[!NOTE]
>The easy-button-prerequisite-user-setup-linked-template is optional and will only appear if you created a validation user.

The resource group that ends in "-wvd" runs these templates:

- NSG-linkedTemplate
- vmCreation-linkedTemplate
- Workspace-linkedTemplate
- wvd-resources-linked-template
- easy-button-wvdsetup-linked-template

The resource group that ends in "-prerequisite" runs these templates:

- easy-button-prerequisite-resources-linked-template

>[!NOTE]
>This resource group is optional, and will only appear if your subscription doesn't have Azure AD DS or AD DS.

## No subscriptions

In this issue, you see an error message that says "no subscriptions" when opening the getting started feature. This happens when you try to open the feature without an active Azure subscription.

To fix this issue, check to see if your subscription or the affected user has an active Azure subscription. If they don't, assign the user the Owner Role-based Access Control (RBAC) role on their subscription.

## You don’t have permissions

This issue happens when you open the getting started feature and get an error message that says, "You don't have permissions." This message appears when the user running the feature doesn't have Owner permissions on their active Azure subscription.

To fix this issue, sign in with an Azure account that has Owner permissions, then assign the Owner RBAC role to the affected account.

## Fields under Virtual Machine tab are grayed out

This issue happens when you open the **Virtual machine** tab and see that the fields under "Do you want users to share this machine?" are grayed out. This issue then prevents you from changing the image type, selecting an image to use, or changing the VM size.

This issue happens when you run the feature with a prefix that was already used to start a deployment. When the feature creates a deployment, it creates an object to represent the deployment in Azure. Certain values in the object, like the image, become attached to that object to prevent multiple objects from using the same images.

To fix this issue, you can either delete all resource groups with the existing prefix or use a new prefix.

## Username must not include reserved words

This issue happens when the getting started feature won't accept the new username you enter into the field.

This error message appears because Azure doesn't allow certain words in usernames for public endpoints. For a full list of blocked words, see [Resolve reserved resource name errors](../azure-resource-manager/templates/error-reserved-resource-name.md).

To resolve this issue, either try a new word or add letters to the blocked word to make it unique. For example, if the word "admin" is blocked, try using "AVDadmin" instead.

## The value must be between 12 and 72 characters long

This error message appears when entering a password that is either too long or too short to meet the character length requirement. Azure password length and complexity requirements even apply to fields that you later use in Windows, which has less strict requirements.

To resolve this issue, make sure you use an account that follows [Microsoft's password guidelines](https://www.microsoft.com/research/publication/password-guidance) or uses [Azure AD Password Protection](../active-directory/authentication/concept-password-ban-bad.md).

## Error messages for easy-button-prerequisite-user-setup-linked-template

If the AD DS VM you're using already has an extension named Microsoft.Powershell.DSC associated with it, you'll see an error message that looks like this:

```azure
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

To resolve this issue, uninstall the Microsoft.Powershell.DSC extension, then run the getting started feature again.

## Error messages for easy-button-prerequisite-job-linked-template

If you see an error message like this, that means the resource operation for the easy-button-prerequisite-job-linked-template template didn't complete successfully:

```azure
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

To make sure this is the issue you're dealing with:

1. Select **easy-button-prerequisite-job-linked-template**, then select **Ok** on the error message window that pops up.

2. Go to **\<prefix\>-deployment resource group** and select **resourceSetupRunbook**.

3. Select the status, which should say **Failed**.

4. Select the **Exception** tab. You should see an error message that looks like this:
   
   ```azure
   The running command stopped because the preference variable "ErrorActionPreference" or common parameter is set to Stop: Error while creating and adding validation user <your-username-here> to group <your-resource-group-here>
   ```

There currently isn't a way to fix this issue permanently. As a workaround, run The Azure Virtual Desktop getting started feature again, but this time don't create a validation user. After that, create your new users with the manual process only.

### Validate that the domain administrator UPN exists for a new profile

To check if the UPN address is causing the issue with the template:

1. Select **easy-button-prerequisite-job-linked-template** and then on the failed step. Confirm the error message.

2. Navigate to the **\<prefix\>-deployment resource group** and click on the **resourceSetupRunbook**.

3. Select the status, which should say **Failed**.

4. Select the **Output** tab.

If the UPN exists on your new subscription, there are two potential causes for the issue:

- The getting started feature didn't create the domain administrator profile, because the user already exists. To resolve this, run the getting started feature again, but this time enter a username that doesn't already exist in your identity provider.
- The getting started feature didn't create the validation user profile. To resolve this issue, run the getting started feature again, but this time don't create any validation users. After that, create new users with the manual process only.

## Error messages for easy-button-inputvalidation-job-linked-template

If there's an issue with the easy-button-inputvalidation-job-linked-template template, you'll see an error message that looks like this:

```azure
{
    "status": "Failed",
    "error": {
        "code": "ResourceDeploymentFailure",
        "message": "The resource operation completed with terminal provisioning state 'Failed'."
    }
}
```

To make sure this is the issue you've encountered:

1. Open the \<prefix\>-deployment resource group and look for **inputValidationRunbook.**

2. Under recent jobs there will be a job with failed status. Click on **Failed**.

3. In the **job details** window, select **Exception**.

This error happens when the Azure admin UPN you entered isn't correct. To resolve this issue, make sure you're entering the correct username and password, then try again.

## Multiple VMExtensions per handler not supported

When you run the getting started feature on a subscription that has Azure AD DS or AD DS, then the feature will use a Microsoft.Powershell.DSC extension to create validation users and configure FSLogix. However, Windows VMs in Azure can't run more than one of the same type of extension at the same time.

If you try to run multiple versions of Microsoft.Powershell.DSC, you'll get an error message that looks like this:

```azure
{
    "status": "Failed",
    "error": {
        "code": "BadRequest",
        "message": "Multiple VMExtensions per handler not supported for OS type 'Windows'. VMExtension 'Microsoft.Powershell.DSC' with handler 'Microsoft.Powershell.DSC' already added or specified in input."
    }
}
```

To resolve this issue, before you run the getting started feature, make sure to remove any currently running instance of Microsoft.Powershell.DSC from the domain controller VM.

## Failure in easy-button-prerequisitecompletion-job-linked-template

The user group for the validation users is located in the "USERS" container. However, the user group must be synced to Azure AD in order to work properly. If it isn't, you'll get an error message that looks like this:

```azure
{
    "status": "Failed",
    "error": {
        "code": "ResourceDeploymentFailure",
        "message": "The resource operation completed with terminal provisioning state ‘Failed’."
    }
}
```

To make sure the issue is caused by the validation user group not syncing, open the \<prefix\>-prerequisites resource group and look for a file named **prerequisiteSetupCompletionRunbook**. Select the runbook, then select **All Logs**.

To resolve this issue:

1. Enable syncing with Azure AD for the "USERS" container.

2. Create the AVDValidationUsers group in an organization unit that's syncing with Azure.

## Next steps

Learn more about the getting started feature at [Deploy Azure Virtual Desktop with the getting started feature](getting-started-feature.md).
