---
title: "Security Advisory: Update Role Assignment for Azure Active Directory authentication permissions"
titleSuffix: Azure AI services
description: This article will show you how to update the role assignment on existing Immersive Reader resources due to a security bug discovered in November 2021
services: cognitive-services
author: rwallerms
manager: nitinme

ms.service: applied-ai-services
ms.subservice: immersive-reader
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 01/06/2022
ms.author: rwaller
---

# Security Advisory: Update Role Assignment for Azure Active Directory authentication permissions

A security bug has been discovered with Immersive Reader Azure Active Directory (Azure AD) authentication configuration. We are advising that you change the permissions on your Immersive Reader resources as described below.

## Background

A security bug was discovered that relates to Azure AD authentication for Immersive Reader. When initially creating your Immersive Reader resources and configuring them for Azure AD authentication, it is necessary to grant permissions for the Azure AD application identity to access your Immersive Reader resource. This is known as a Role Assignment. The Azure role that was previously used for permissions was the [Cognitive Services User](../../role-based-access-control/built-in-roles.md#cognitive-services-user) role.

During a security audit, it was discovered that this Cognitive Services User role has permissions to [List Keys](/rest/api/cognitiveservices/accountmanagement/accounts/list-keys). This is slightly concerning because Immersive Reader integrations involve the use of this Azure AD access token in client web apps and browsers, and if the access token were to be stolen by a bad actor or attacker, there is a concern that this access token could be used to `list keys` of your Immersive Reader resource. If an attacker could `list keys` for your resource, then they would obtain the `Subscription Key` for your resource. The `Subscription Key` for your resource is used as an authentication mechanism and is considered a secret. If an attacker had the resource's `Subscription Key`, it would allow them to make valid and authenticated API calls to your Immersive Reader resource endpoint, which could lead to Denial of Service due to the increased usage and throttling on your endpoint. It would also allow unauthorized use of your Immersive Reader resource, which would lead to increased charges on your bill.

In practice however, this attack or exploit is not likely to occur or may not even be possible. For Immersive Reader scenarios, customers obtain Azure AD access tokens with an audience of `https://cognitiveservices.azure.com`. In order to successfully `list keys` for your resource, the Azure AD access token would need to have an audience of `https://management.azure.com`. Generally speaking, this is not too much of a concern, since the access tokens used for Immersive Reader scenarios would not work to `list keys`, as they do not have the required audience. In order to change the audience on the access token, an attacker would have to hijack the token acquisition code and change the audience before the call is made to Azure AD to acquire the token. Again, this is not likely to be exploited because, as an Immersive Reader authentication best practice, we advise that customers create Azure AD access tokens on the web application backend, not in the client or browser. In those cases, since the token acquisition happens on the backend service, it's not as likely or perhaps even possible that attacker could compromise that process and change the audience.

The real concern comes when or if any customer were to acquire tokens from Azure AD directly in client code. We strongly advise against this, but since customers are free to implement as they see fit, it is possible that some customers are doing this.

To mitigate the concerns about any possibility of using the Azure AD access token to `list keys`, we have created a new built-in Azure role called `Cognitive Services Immersive Reader User` that does not have the permissions to `list keys`. This new role is not a shared role for the Azure AI services platform like `Cognitive Services User` role is. This new role is specific to Immersive Reader and will only allow calls to Immersive Reader APIs.

We are advising that ALL customers migrate to using the new `Cognitive Services Immersive Reader User` role instead of the original `Cognitive Services User` role. We have provided a script below that you can run on each of your resources to switch over the role assignment permissions.

This recommendation applies to ALL customers, to ensure that this vulnerability is patched for everyone, no matter what the implementation scenario or likelihood of attack.

If you do NOT do this, nothing will break. The old role will continue to function. The security impact for most customers is minimal. However, it is advised that you migrate to the new role to mitigate the security concerns discussed above. Applying this update is a security advisory recommendation; it is not a mandate. 

Any new Immersive Reader resources you create with our script at [How to: Create an Immersive Reader resource](./how-to-create-immersive-reader.md) will automatically use the new role.


## Call to action

If you created and configured an Immersive Reader resource using the instructions at [How to: Create an Immersive Reader resource](./how-to-create-immersive-reader.md) prior to February 2022, it is advised that you perform the operation below to update the role assignment permissions on ALL of your Immersive Reader resources. The operation involves running a script to update the role assignment on a single resource. If you have multiple resources, run this script multiple times, once for each resource.

After you have updated the role using the script below, it is also advised that you rotate the subscription keys on your resource. This is in case your keys have been compromised by the exploit above, and somebody is actually using your resource with subscription key authentication without your consent. Rotating the keys will render the previous keys invalid and deny any further access. For customers using Azure AD authentication, which should be everyone per current Immersive Reader SDK implementation, rotating the keys will have no impact on the Immersive Reader service, since Azure AD access tokens are used for authentication, not the subscription key. Rotating the subscription keys is just another precaution.

You can rotate the subscription keys on the [Azure portal](https://portal.azure.com). Navigate to your resource and then to the `Keys and Endpoint` blade. At the top, there are buttons to `Regenerate Key1` and `Regenerate Key2`.

:::image type="content" source="media/resource-keys.png" alt-text="Screenshot of the Azure portal showing an Immersive Reader resource with the Keys and Endpoint blade selected, which shows the Regenerate Keys buttons at the top.":::




### Use Azure PowerShell environment to update your Immersive Reader resource Role assignment

1. Start by opening the [Azure Cloud Shell](../../cloud-shell/overview.md). Ensure that Cloud Shell is set to PowerShell in the upper-left hand dropdown or by typing `pwsh`.

1. Copy and paste the following code snippet into the shell.

    ```azurepowershell-interactive
    function Update-ImmersiveReaderRoleAssignment(
        [Parameter(Mandatory=$true, Position=0)] [String] $SubscriptionName,
        [Parameter(Mandatory=$true)] [String] $ResourceGroupName,
        [Parameter(Mandatory=$true)] [String] $ResourceName,
        [Parameter(Mandatory=$true)] [String] $AADAppIdentifierUri
    )
    {
        $unused = ''
        if (-not [System.Uri]::TryCreate($AADAppIdentifierUri, [System.UriKind]::Absolute, [ref] $unused)) {
            throw "Error: AADAppIdentifierUri must be a valid URI"
        }

        Write-Host "Setting the active subscription to '$SubscriptionName'"
        $subscriptionExists = Get-AzSubscription -SubscriptionName $SubscriptionName
        if (-not $subscriptionExists) {
            throw "Error: Subscription does not exist"
        }
        az account set --subscription $SubscriptionName

        # Get the Immersive Reader resource 
        $resourceId = az cognitiveservices account show --resource-group $ResourceGroupName --name $ResourceName --query "id" -o tsv
        if (-not $resourceId) {
            throw "Error: Failed to find Immersive Reader resource"
        }

        # Get the Azure AD application service principal
        $principalId = az ad sp show --id $AADAppIdentifierUri --query "objectId" -o tsv
        if (-not $principalId) {
            throw "Error: Failed to find Azure AD application service principal"
        }

        $newRoleName = "Cognitive Services Immersive Reader User"
        $newRoleExists = az role assignment list --assignee $principalId --scope $resourceId --role $newRoleName --query "[].id" -o tsv
        if ($newRoleExists) {
            Write-Host "New role assignment for '$newRoleName' role already exists on resource"
        } 
        else {
            Write-Host "Creating new role assignment for '$newRoleName' role"
            $roleCreateResult = az role assignment create --assignee $principalId --scope $resourceId --role $newRoleName
            if (-not $roleCreateResult) {
                throw "Error: Failed to add new role assignment"
            }
            Write-Host "New role assignment created successfully"
        }

        $oldRoleName = "Cognitive Services User"
        $oldRoleExists = az role assignment list --assignee $principalId --scope $resourceId --role $oldRoleName --query "[].id" -o tsv
        if (-not $oldRoleExists) {
            Write-Host "Old role assignment for '$oldRoleName' role does not exist on resource"
        }
        else {
            Write-Host "Deleting old role assignment for '$oldRoleName' role"
            az role assignment delete --assignee $principalId --scope $resourceId --role $oldRoleName
            $oldRoleExists = az role assignment list --assignee $principalId --scope $resourceId --role $oldRoleName --query "[].id" -o tsv
            if ($oldRoleExists) {
                throw "Error: Failed to delete old role assignment"
            }
            Write-Host "Old role assignment deleted successfully"
        }
    }
    ```

1. Run the function `Update-ImmersiveReaderRoleAssignment`, supplying the '<PARAMETER_VALUES>' placeholders below with your own values as appropriate.

    ```azurepowershell-interactive
    Update-ImmersiveReaderRoleAssignment -SubscriptionName '<SUBSCRIPTION_NAME>' -ResourceGroupName '<RESOURCE_GROUP_NAME>' -ResourceName '<RESOURCE_NAME>' -AADAppIdentifierUri '<AAD_APP_IDENTIFIER_URI>'
    ```

    The full command will look something like the following. Here we have put each parameter on its own line for clarity, so you can see the whole command. Do not copy or use this command as-is. Copy and use the command above with your own values. This example has dummy values for the '<PARAMETER_VALUES>' above. Yours will be different, as you will come up with your own names for these values.

    ```Update-ImmersiveReaderRoleAssignment```<br>
    ```    -SubscriptionName 'MyOrganizationSubscriptionName'```<br>
    ```    -ResourceGroupName 'MyResourceGroupName'```<br>
    ```    -ResourceName 'MyOrganizationImmersiveReader'```<br>
    ```    -AADAppIdentifierUri 'https://MyOrganizationImmersiveReaderAADApp'```<br>

    | Parameter | Comments |
    | --- | --- |
    | SubscriptionName |The name of your Azure subscription. |
    | ResourceGroupName |The name of the Resource Group that contains your Immersive Reader resource. |
    | ResourceName |The name of your Immersive Reader resource. |
    | AADAppIdentifierUri |The URI for your Azure AD app. |


## Next steps

* View the [Node.js quickstart](./quickstarts/client-libraries.md?pivots=programming-language-nodejs) to see what else you can do with the Immersive Reader SDK using Node.js
* View the [Android tutorial](./how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Java or Kotlin for Android
* View the [iOS tutorial](./how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Swift for iOS
* View the [Python tutorial](./how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Python
* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)
