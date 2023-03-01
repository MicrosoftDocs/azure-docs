# Params for the script:
$subsciptionId = $args[0]
$resourceGroupName = $args[1]
$farmbeatsName = $args[2]
$region = If ($args[3]) {$args[3]} Else {"eastus"}


# Script begin:
Write-Host Getting Token for the currently logged in user
$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
Write-Host Got token


Write-Host Starting Registration
$headers = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

$registrationUri = 'https://management.azure.com/subscriptions/' `
                   + $subsciptionId + '/' `
                   + 'providers/Microsoft.AgFoodPlatform/register?api-version=2019-10-01'

$registrationResponse = Invoke-RestMethod -Uri $registrationUri -Method Post -Headers $headers
Write-Host Registration Response:
Write-Host $registrationResponse

Write-Host Sleeping for 30 seconds
Start-Sleep -s 30
Write-Host Starting Farmbeats resource creation

$body = @{
    location = $region
}
$body = $body | ConvertTo-Json

# Invoke the REST API
$farmbeatsUri = 'https://management.azure.com/subscriptions/' `
                + $subsciptionId + '/' `
                + 'resourceGroups/' `
                + $resourceGroupName + '/' `
                + 'providers/Microsoft.AgFoodPlatform/farmbeats/' `
                + $farmbeatsName `
                + '?api-version=2020-05-12-preview' 
$response = Invoke-RestMethod -Uri $farmbeatsUri -Method Put -Headers $headers -Body $body
Write-Host Farmbeats creation response:
Write-Output $response
