---
title: SAP agentless data connector prerequisites checker
ms.date: 03/13/2025
ms.topic: include
---

<!-- docutune:disable -->

**To run the tool**:

1. Open the integration package, navigate to the artifacts tab, and select the **Prerequisite checker** iflow > **Configure**.
1. Set the target RFC destination to the SAP system you want to check.
1. Deploy the iflow as you would otherwise for your SAP systems. For example, use the following sample PowerShell script, modifying the sample placeholder values for your environment:

    ```powershell
    $cpiEndpoint = "https://my-cpi-uri.it-cpi012-rt.cfapps.eu01-010.hana.ondemand.com" # CPI endpoint URL
    $credentialsUrl = "https://my-uaa-uri.authentication.eu01.hana.ondemand.com/oauth/token" # SAP authorization server URL
    $serviceKey = 'sb-12324cd-a1b2-5678-a1b2-1234cd5678ef!g9123|it-rt-my-cpi!h45678' # Process Integration Runtime Service client ID
    $serviceSecret = '< client secret >' # Your Process Integration Runtime service secret (make sure to use single quotes)

    $credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$serviceKey`:$serviceSecret"))
    $headers = @{
        "Authorization" = "Basic $credentials"
        "Content-Type"  = "application/json"
    }
    $authResponse = Invoke-WebRequest -Uri $credentialsUrl"?grant_type=client_credentials" `
        -Method Post `
        -Headers $headers
    $token = ($authResponse.Content | ConvertFrom-Json).access_token
    $path = "/http/checkSAP"
    $param = "?startTimeUTC=$((Get-Date).AddMinutes(-1).ToString("yyyy-MM-ddTHH:mm:ss"))&endTimeUTC=$((Get-Date).ToString("yyyy-MM-ddTHH:mm:ss"))"
    $headers = @{
        "Authorization"      = "Bearer $token"
        "Content-Type"       = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$cpiEndpoint$path$param" -Method Get -Headers $headers
    Write-Host $response.RawContent
    ```

Make sure that the prerequisites checker runs successfully before connecting to Microsoft Sentinel.