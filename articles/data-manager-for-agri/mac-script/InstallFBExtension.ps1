# Params for the script:
$subsciptionId = $args[0]
$resourceGroupName = $args[1]
$farmbeatsName = $args[2]
$extensionName = $args[3]


# Script begin:
Write-Host Getting Token for the currently logged in user
$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
Write-Host Got token


Write-Host Installing Extension
$headers = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

$body = @{}
$body = $body | ConvertTo-Json

# Invoke the REST API
$farmbeatsUri = 'https://management.azure.com/subscriptions/' `
                + $subsciptionId + '/' `
                + 'resourceGroups/' `
                + $resourceGroupName + '/' `
                + 'providers/Microsoft.AgFoodPlatform/farmbeats/' `
                + $farmbeatsName + '/' `
				+ 'extensions/' `
				+ $extensionName + '/' `
                + '?api-version=2020-05-12-preview' 
$response = Invoke-RestMethod -Uri $farmbeatsUri -Method Put -Headers $headers -Body $body
Write-Host Farmbeats extension installation response:
Write-Output $response