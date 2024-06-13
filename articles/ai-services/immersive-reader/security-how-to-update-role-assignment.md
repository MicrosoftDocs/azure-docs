---
title: "Update role assignment for Microsoft Entra authentication"
titleSuffix: Azure AI services
description: Learn how to update the role assignment on existing Immersive Reader resources due to a security bug.
#services: cognitive-services
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 02/28/2024
ms.author: sharmas
---

# Security advisory: Update role assignment for Microsoft Entra authentication

A security bug was discovered that affects Microsoft Entra authentication for Immersive Reader. We advise that you change the permissions on your Immersive Reader resources.

## Background

When you initially create your Immersive Reader resources and configure them for Microsoft Entra authentication, it's necessary to grant permissions for the Microsoft Entra application identity to access your Immersive Reader resource. This is known as a *role assignment*. The Azure role that was previously used for permissions was the [Cognitive Services User](../../role-based-access-control/built-in-roles.md#cognitive-services-user) role.

During a security audit, it was discovered that this Cognitive Services User role has permissions to [list keys](/rest/api/cognitiveservices/accountmanagement/accounts/list-keys). This is slightly concerning because Immersive Reader integrations involve the use of this Microsoft Entra access token in client web apps and browsers. If the access token were stolen by a bad actor or attacker, there's a concern that this access token could be used to `list keys` for your Immersive Reader resource. If an attacker could `list keys` for your resource, then they would obtain the `Subscription Key` for your resource. The `Subscription Key` for your resource is used as an authentication mechanism and is considered a secret. If an attacker had the resource's `Subscription Key`, it would allow them to make valid and authenticated API calls to your Immersive Reader resource endpoint, which could lead to Denial of Service due to the increased usage and throttling on your endpoint. It would also allow unauthorized use of your Immersive Reader resource, which would lead to increased charges on your bill.

In practice, however, this attack or exploit isn't likely to occur or might not even be possible. For Immersive Reader scenarios, customers obtain Microsoft Entra access tokens with an audience of `https://cognitiveservices.azure.com`. In order to successfully `list keys` for your resource, the Microsoft Entra access token would need to have an audience of `https://management.azure.com`. Generally speaking, this isn't much of a concern, since the access tokens used for Immersive Reader scenarios wouldn't work to `list keys`, as they don't have the required audience. In order to change the audience on the access token, an attacker would have to hijack the token acquisition code and change the audience before the call is made to Microsoft Entra ID to acquire the token. Again, this isn't likely to be exploited because, as an Immersive Reader authentication best practice, we advise that customers create Microsoft Entra access tokens on the web application backend, not in the client or browser. In those cases, since the token acquisition happens on the backend service, it's not as likely or perhaps even possible that an attacker could compromise that process and change the audience.

The real concern comes when or if any customer were to acquire tokens from Microsoft Entra ID directly in client code. We strongly advise against this, but since customers are free to implement as they see fit, it's possible that some customers are doing this.

To mitigate the concerns about any possibility of using the Microsoft Entra access token to `list keys`, we created a new built-in Azure role called `Cognitive Services Immersive Reader User` that doesn't have the permissions to `list keys`. This new role isn't a shared role for the Azure AI services platform like `Cognitive Services User` role is. This new role is specific to Immersive Reader and only allows calls to Immersive Reader APIs.

We advise ALL customers to use the new `Cognitive Services Immersive Reader User` role instead of the original `Cognitive Services User` role. We have provided a script below that you can run on each of your resources to switch over the role assignment permissions.

This recommendation applies to ALL customers, to ensure that this vulnerability is patched for everyone, no matter what the implementation scenario or likelihood of attack.

If you do NOT do this, nothing will break. The old role will continue to function. The security impact for most customers is minimal. However, we advise that you migrate to the new role to mitigate the security concerns discussed. Applying this update is a security advisory recommendation; it's not a mandate.

Any new Immersive Reader resources you create with our script at [How to: Create an Immersive Reader resource](./how-to-create-immersive-reader.md) automatically use the new role.

## Update role and rotate your subscription keys

If you created and configured an Immersive Reader resource using the instructions at [How to: Create an Immersive Reader resource](./how-to-create-immersive-reader.md) before February 2022, we advise that you perform the following operation to update the role assignment permissions on ALL of your Immersive Reader resources. The operation involves running a script to update the role assignment on a single resource. If you have multiple resources, run this script multiple times, once for each resource.

After you update the role using the following script, we also advise that you rotate the subscription keys on your resource. This is in case your keys were compromised by the exploit, and somebody is actually using your resource with subscription key authentication without your consent. Rotating the keys renders the previous keys invalid and denies any further access. For customers using Microsoft Entra authentication, which should be everyone per current Immersive Reader SDK implementation, rotating the keys has no effect on the Immersive Reader service, since Microsoft Entra access tokens are used for authentication, not the subscription key. Rotating the subscription keys is just another precaution.

You can rotate the subscription keys in the [Azure portal](https://portal.azure.com). Navigate to your resource and then to the `Keys and Endpoint` section. At the top, there are buttons to `Regenerate Key1` and `Regenerate Key2`.

:::image type="content" source="media/resource-keys.png" alt-text="Screenshot of the Azure portal showing an Immersive Reader resource with the Keys and Endpoint section selected, which shows the Regenerate Keys buttons at the top.":::

### Use Azure PowerShell to update your role assignment

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

        # Get the Microsoft Entra application service principal
        $principalId = az ad sp show --id $AADAppIdentifierUri --query "objectId" -o tsv
        if (-not $principalId) {
            throw "Error: Failed to find Microsoft Entra application service principal"
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

1. Run the function `Update-ImmersiveReaderRoleAssignment`, replacing the `<PARAMETER_VALUES>` placeholders with your own values as appropriate.

    ```azurepowershell
    Update-ImmersiveReaderRoleAssignment -SubscriptionName '<SUBSCRIPTION_NAME>' -ResourceGroupName '<RESOURCE_GROUP_NAME>' -ResourceName '<RESOURCE_NAME>' -AADAppIdentifierUri '<MICROSOFT_ENTRA_APP_IDENTIFIER_URI>'
    ```

    The full command looks something like the following. Here we put each parameter on its own line for clarity, so you can see the whole command. Don't copy or use this command as-is. Copy and use the command with your own values. This example has dummy values for the `<PARAMETER_VALUES>`. Yours will be different, as you come up with your own names for these values.

    ```azurepowershell
    Update-ImmersiveReaderRoleAssignment
        -SubscriptionName 'MyOrganizationSubscriptionName'
        -ResourceGroupName 'MyResourceGroupName'
        -ResourceName 'MyOrganizationImmersiveReader'
        -AADAppIdentifierUri 'https://MyOrganizationImmersiveReaderAADApp'
    ```

    | Parameter | Comments |
    | --- | --- |
    | SubscriptionName |The name of your Azure subscription. |
    | ResourceGroupName |The name of the resource group that contains your Immersive Reader resource. |
    | ResourceName |The name of your Immersive Reader resource. |
    | AADAppIdentifierUri |The URI for your Microsoft Entra app. |

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Get started with Immersive Reader](quickstarts/client-libraries.md)
