---
title: 'How to monitor P2S connections'
titleSuffix: Azure Virtual WAN
description: Learn how to set up an Azure workbook for P2S monitoring.
services: virtual-wan
author: siddomala
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: siddomala
---

# How to monitor point-to-site connections for Virtual WAN

This section documents how to create an Azure Workbook that shows relevant data of User VPN clients connected to Azure Virtual WAN.

## Before you begin

To complete the steps in this article, you need to have a Virtual WAN, a virtual hub, and a User VPN Gateway. To create these resources, follow the steps in this article: [Create Virtual WAN, virtual hub, and a gateway](virtual-wan-point-to-site-portal.md)

## Workbook solution architecture

   :::image type="content" source="./media/monitor-point-to-site-connections/workbook-architecture.png" alt-text="Screenshot shows workbook architecture.":::

To configure the above architecture, we'll use the following P2S VPN logs and PowerShell command. 

* **AzureDiagnostics:** These logs are received by creating a diagnostic setting for the User VPN Gateway and enabling the following logs: GatewayDiagnosticLog, IKEDiagnosticLog, P2SDiagnosticLog, and AllMetrics. 

* **Get-AzP2sVpnGatewayDetailedConnectionHealth:** This is a PowerShell command (running in a function app) to get active sessions details. This command only supports storing data in a storage account based on a SAS Key, and it provides additional details about active P2S VPN connections. 

## Create Azure storage account and upload blob

1. [Create Azure storage account](../storage/common/storage-account-create.md).
1. [Create container and upload a blob to the container](../storage/blobs/storage-quickstart-blobs-portal.md)
    1. Your blob should be an empty text file with .json extension
    1. When uploading the blob, give your **Account Key** the following permissions: **Read, Add, Create, and Write**.
    1. Make sure to copy down the **Blob SAS token** and **Blob SAS URL** to a secure location.

## Create Azure function app

1. [Create an Azure function app](../azure-functions/functions-create-function-app-portal.md#create-a-function-app) and select **PowerShell Core** as your runtime stack
1. [Assign a system assigned managed identity to the function app](../azure-functions/functions-identity-access-azure-sql-with-managed-identity.md#enable-system-assigned-managed-identity-on-azure-function)
1. [Create an application setting](../azure-functions/functions-how-to-use-azure-function-app-settings.md) with the following 7 entries by inputting the **Name** and **Value** and then select **OK** after each value.

   | Name | Value|
   |---|---|
   |"resourcegroup" | your resource group |
   | "sasuri"| `@Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/<version>)`<br />--> update accordingly after keyvault is created in next section.|
   |"subscription" |your subscription ID |
   |"tenantname" | your tenant ID |
   | "vpngw"|This name is something like \<guid>-eastus-ps2-gw. You can get this from the vWAN HUB User VPN settings. |

1. [Create a timer triggered function](../azure-functions/functions-create-scheduled-function.md#create-a-timer-triggered-function)

1. Select **Code + Test** in the left panel, and type the following code in the **run.ps1** file. Select **Save**.

   ```azurepowershell-interactive
   # Input bindings are passed in via param block.
   param($Timer)

   # Get the current universal time in the default string format.
   $currentUTCtime = (Get-Date).ToUniversalTime()

   # The 'IsPastDue' property is "true" when the current function invocation is later than scheduled.
   if($Timer.IsPastDue){
   Write-Host "PowerShell timer is running late!"
   }

   ## Write an information log with current time.
   Write-Host "PowerShell timer trigger function ran! TIME:$currentUTCtime"

   $tenantname = $env:appsetting_tenantname
   $subscription = $env:appsetting_subscription
   $resourceGroup = $env:appsetting_resourcegroup
   $vpngw = $env:appsetting_vpngw
   $sasuri = $env:appsetting_sasuri
   
   Write-Host "Connecting to Managed Identity..."
   connect-azaccount -tenant $tenantname -identity -subscription $subscription
   
   Write-Host "Executing File Update..."
   Get-AzP2sVpnGatewayDetailedConnectionHealth -name $vpngw -ResourceGroupName $resourceGroup -OutputBlobSasUrl $sasuri
   
   Write-Host "Function Execution Completed!"
   ```

1. Navigate back to the **Function App** page and select on **App Service Editor** in the left panel under **Development Tools**. Then, select **Go -->**.

1. Go to **requirements.psd1** and uncomment the line beginning with **'Az'...** as shown.

   :::image type="content" source="./media/monitor-point-to-site-connections/requirements-file.png" alt-text="Screenshot showing the requirements file for function app." lightbox="./media/monitor-point-to-site-connections/requirements-file.png" :::

1. For the **get-AzP2sVpnGatewayDetailedConnectionHealth** command to succeed, you need to have the right permissions to the information. Navigate to your resource group and choose "Access Control (IAM)" in the left panel. This corresponds to identity and access management. Assign the **FunctionApp** read access over the resource group.

## Create Azure Key Vault

1. Create [Azure Key Vault](../azure-functions/functions-identity-based-connections-tutorial.md#create-an-azure-key-vault).
    1. For **Permission model**, select **Vault access policy**.
    2. Leave the options under **Resource access** as disabled.
    3. Under **Access policies**, select **+ Create**.

   :::image type="content" source="./media/monitor-point-to-site-connections/create-access-policy-screen-1.png" alt-text="Screenshot shows first screen in creating access policy." lightbox="./media/monitor-point-to-site-connections/create-access-policy-screen-1.png" :::
   
    4. Select **Next** to go to the **Principal** tab. Type the name of your function app and select it.
    5. Select **Next** twice to get to the fourth tab: **Review + create** and select **Create** at the bottom.
    6. You should now see the newly created access policy under the **Access policies** section. Modifying the default values under the **Networking** tab is optional, so select **Review + create** in the bottom left corner.
1. Go to **Secrets** under **Objects** under the left panel of the key vault resource. Select **+ Generate/Import** and add secret as follows:

   * **Name**: sasuri
   * **value**: \<SASURI>
   * **Enabled**: Yes
1. Go back to the **Configuration** tab for the Function App and modify the following entry. The value comes from the **Secret Identifier** field that appears after clicking on the secret:

   * **Name**: "sasuri"
   * **Value**:  `@Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/<version>)`

## Create Azure Workbook

The Azure workbook is now ready to be created. We'll use a mix of built-in functionality and the added session details from our function app solution.

1. Navigate to your Virtual WAN resource and select on **Insights** under **Monitor** in the left panel. Select on **Workbooks** and then select **+ New**.
:::image type="content" source="./media/monitor-point-to-site-connections/create-workbook.png" alt-text="Screenshot shows first step in creation of Azure Workbook." lightbox="./media/monitor-point-to-site-connections/create-workbook.png":::
1. Add the following query into the workbook. Replace "SASURI" with your sas uri.

   ```
    let P2Svpnconnections = (externaldata (resource:string, UserNameVpnConnectionHealths: dynamic) [
        @"SASURI"
    ] with(format="multijson"));

    P2Svpnconnections
    | mv-expand UserNameVpnConnectionHealths
    | extend Username = parse_json(UserNameVpnConnectionHealths).UserName
    | extend VpnConnectionHealths = parse_json(parse_json(UserNameVpnConnectionHealths).VpnConnectionHealths)
    | mv-expand VpnConnectionHealths
    | extend VpnConnectionId = parse_json(VpnConnectionHealths).VpnConnectionId, VpnConnectionDuration = parse_json(VpnConnectionHealths).VpnConnectionDuration, VpnConnectionTime = parse_json(VpnConnectionHealths).VpnConnectionTime, PublicIpAddress = parse_json(VpnConnectionHealths).PublicIpAddress, PrivateIpAddress = parse_json(VpnConnectionHealths).PrivateIpAddress, MaxBandwidth = parse_json(VpnConnectionHealths).MaxBandwidth, EgressPacketsTransferred = parse_json(VpnConnectionHealths).EgressPacketsTransferred, EgressBytesTransferred = parse_json(VpnConnectionHealths).EgressBytesTransferred, IngressPacketsTransferred = parse_json(VpnConnectionHealths).IngressPacketsTransferred, IngressBytesTransferred = parse_json(VpnConnectionHealths).IngressBytesTransferred, MaxPacketsPerSecond = parse_json(VpnConnectionHealths).MaxPacketsPerSecond
    | extend PubIp = tostring(split(PublicIpAddress, ":").[0])
    | project Username, VpnConnectionId, VpnConnectionDuration, VpnConnectionTime, PubIp, PublicIpAddress, PrivateIpAddress, MaxBandwidth, EgressPacketsTransferred, EgressBytesTransferred, IngressPacketsTransferred, IngressBytesTransferred, MaxPacketsPerSecond;

   ```

1. To see the results, select the blue button **Run Query** to see the results.
1. If you see the following error, then navigate back to the file (vpnstatfile.json) in the storage container's blob, and regenerate the SAS URL. Then paste the updated SAS URL in the query.

   :::image type="content" source="./media/monitor-point-to-site-connections/workbook-error.png" alt-text="Screenshot shows error when running query in workbook.":::
1. Save the workbook to return to it later.
1. For the following metrics, you must enable diagnostics logging by adding diagnostic settings in Azure portal. Fill in the required fields for subscription and resource group. For resource type, type in "microsoft.network/p2svpngateways". Add a diagnostic setting (or edit the current diagnostic setting) for the point-to-site gateway you wish to monitor.

   :::image type="content" source="./media/monitor-point-to-site-connections/final-monitoring.png" alt-text="Screenshot shows first Diagnostic settings page in Azure Monitor." lightbox="./media/monitor-point-to-site-connections/final-monitoring.png" :::

1. Enable allLogs and allMetrics, and choose to send to "Log Analytics workspace" as the destination. 

   :::image type="content" source="./media/monitor-point-to-site-connections/diagnostic-setting.png" alt-text="Screenshot shows second Diagnostic settings page in Azure Monitor." lightbox="./media/monitor-point-to-site-connections/diagnostic-setting.png":::

## Example queries

The following section shows example queries.

### P2S User successful connections with IP

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-successful-connections-ips.png" alt-text="Screenshot shows query for P2S successful connections with IP.":::

### EAP (Extensible Authentication Protocol) authentication succeeded

:::image type="content" source="./media/monitor-point-to-site-connections/eap-authentication.png" alt-text="Screenshot shows query for EAP Authentication metrics." lightbox="./media/monitor-point-to-site-connections/eap-authentication.png":::

### P2S VPN user info

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-vpn-user.png" alt-text="Screenshot shows query for P2S VPN User Info." lightbox="./media/monitor-point-to-site-connections/p2s-vpn-user.png" :::

### P2S VPN successful connections per user

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-connections-per-user.png" alt-text="Screenshot shows query for P2S VPN successful connections." lightbox="./media/monitor-point-to-site-connections/p2s-connections-per-user.png":::

### P2S VPN connections

:::image type="content" source="./media/monitor-point-to-site-connections/all-p2s-connections.png" alt-text="Screenshot shows query for P2S VPN connections." lightbox="./media/monitor-point-to-site-connections/all-p2s-connections.png" :::

### Successful P2S VPN connections

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-successful-connections.png" alt-text="Screenshot shows query for successful P2S VPN connections." lightbox="./media/monitor-point-to-site-connections/p2s-successful-connections.png" :::

### Failed P2S VPN connections

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-failed-connections.png" alt-text="Screenshot shows query for failed P2S VPN connections." lightbox="./media/monitor-point-to-site-connections/p2s-failed-connections.png" :::

### VPN connection count by P2SDiagnosticLog

:::image type="content" source="./media/monitor-point-to-site-connections/vpn-connection-count.png" alt-text="Screenshot shows query for VPN connection count." lightbox="./media/monitor-point-to-site-connections/vpn-connection-count.png":::

### IKEDiagnosticLog

:::image type="content" source="./media/monitor-point-to-site-connections/ike-diagnostics.png" alt-text="Screenshot shows query for IKEDiagnosticLog." lightbox="./media/monitor-point-to-site-connections/ike-diagnostics.png":::

### Additional IKE diagnostics details

:::image type="content" source="./media/monitor-point-to-site-connections/additional-ikes.png" alt-text="Screenshot shows query for IKE Diagnostic details." lightbox="./media/monitor-point-to-site-connections/additional-ikes.png":::

### P2S VPN statistics

:::image type="content" source="./media/monitor-point-to-site-connections/p2s-vpn-stats.png" alt-text="Screenshot shows query for P2S VPN statistics." lightbox="./media/monitor-point-to-site-connections/p2s-vpn-stats.png":::

## Next steps

To learn more about frequently asked questions, see the [Virtual WAN FAQ](virtual-wan-faq.md) page.
