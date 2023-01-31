---
title: 'How to monitor P2S connections'
titleSuffix: Azure Virtual WAN
description: Learn how to set up an Azure workbook for P2S monitoring.
services: virtual-wan
author: siddomala
ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/18/2022
ms.author: siddomala
---

# How to monitor point-to-site connections for Virtual WAN

This section documents how to create an Azure Workbook that shows relevant data of User VPN clients connected to Azure Virtual WAN.

## Before you begin

To complete the steps in this article, you need to have a virtual WAN,  a hub, and a User VPN Gateway. To create these resources, follow the steps in this article: [Create virtual WAN, a hub, and a gateway](virtual-wan-point-to-site-portal.md)

## Workbook solution architecture

When you work with Azure Virtual WAN and look at metrics, it’s most often done from within the context of an Azure workbook. In this solution, we'll use what's already available in Azure workbook and enrich it with more details, especially about active connections.

* **AzureDiagnostics:** These logs are received by enabling P2S Debugging through Azure Monitor debug settings and enabling the following logs: GatewayDiagnosticLog, IKEDiagnosticLog, P2SDiagnosticLog, AllMetrics. Some logs are noisy and costly regarding Log Analytics cost, specially IKEDiagnostics.

* **Get-AzP2sVpnGatewayDetailedConnectionHealth:** This is a PowerShell command (running in a function app) to get active sessions details. This command only supports storing data in a storage account based on a SAS Key.

The following figure shows the involved components in the suggested solution:

   :::image type="content" source="./media/monitor-point-to-site-connections/workbook-architecture.png" alt-text="Screenshot shows workbook architecture.":::

The VPN service is running in the Azure vWAN P2S VPN gateway. It has associated metrics and debugs settings that can be read from within an Azure workbook. To get the extra information that the PowerShell command can provide, we choose to execute this command in an Azure function app. From the function app, we store the output in an Azure storage account.

The output stored in the storage account is fetched from within the workbook by using a special function called "externaldata".

## Create Azure storage account

1. In the portal, in the **Search resources** bar, type **Storage accounts**.

1. Select **Storage accounts** from the results. On the Storage accounts page, select **+ Create** to open the **Create a storage account** page.

1. On the **Create WAN** page, on the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/storage-account-basics.png" alt-text="Screenshot shows the basics section of creating a storage account.":::

   * **Subscription**: Select the subscription that you want to use
   * **Resource group**: Create new or use existing
   * **Storage account name**: Type the name you want to call your storage account
   * **Region**: Select a region for your storage account
   * **Performance**: Standard or Premium. **Standard** is adequate for our monitoring purposes
   * **Redundancy**: Choose between Locally redundant storage, Geo-redundant storage, Zone-redundant storage, and Geo-zone-redundant storage

   After you finish filling out the fields, at the bottom of the page, select **Next: Advanced>**.

1. On the **Advanced** page, fill out the following fields.

    :::image type="content" source="./media/monitor-point-to-site-connections/storage-account-advanced.png" alt-text="Screenshot shows advanced section of creating a storage account.":::

    * **Require secure transfer for REST API operations**: Choose **Enabled**.
    * **Enable blob public access**: Choose **Disabled**.
    * **Enable storage account key access**: Choose **Enabled**.
    * **Default to Azure Active Directory authorization in the Azure portal**: Choose **Enabled**.
    * **Minimum TLS version**: Choose **Version 1.2**.

1. Select **Review + create** at the bottom to run validation.

1. Once validation passes, select **Create** to create the storage account.

## Create container

1. Once the deployment is complete, go to the resource.
1. On the left panel, select **Containers** under **Data storage**.

   :::image type="content" source="./media/monitor-point-to-site-connections/container-create.png" alt-text="Screenshot shows the initial container page." lightbox="./media/monitor-point-to-site-connections/container-create.png":::
1. Select **+ Container** to create a new container.
1. Type a **Name** for your container and select **Create**.

## Create and upload blob to container

1. On your computer, open a text editor application such as **Notepad**.

   :::image type="content" source="./media/monitor-point-to-site-connections/notepad.png" alt-text="Screenshot shows how to open notepad.":::
1. Leave the text file empty and select **File -> Save As**.
1. Save the empty text file with a name of your choice followed by the **.json** extension.

    :::image type="content" source="./media/monitor-point-to-site-connections/empty-json.png" alt-text="Screenshot shows how to save json file." lightbox="./media/monitor-point-to-site-connections/empty-json.png" :::
1. Go back to the **Containers** section in portal.

   :::image type="content" source="./media/monitor-point-to-site-connections/container-after.png" alt-text="Screenshot shows the container section after creating new container." lightbox="./media/monitor-point-to-site-connections/container-after.png" :::
1. Select on the second row, which corresponds to the container you created (not $logs).
1. If you see this red warning message saying ""**You do not have permission...**"", then select **Switch to Access key** as your authentication method. This is located right below the red warning box.
1. Select **Upload**.

   :::image type="content" source="./media/monitor-point-to-site-connections/specific-container.png" alt-text="Screenshot shows the specific container that was created by user." lightbox="./media/monitor-point-to-site-connections/specific-container.png" :::
1. Select the file corresponding to your empty JSON file on your machine and select **Upload**.
1. After the file gets uploaded, select on the JSON file and navigate to the **Generate SAS** tab.

   :::image type="content" source="./media/monitor-point-to-site-connections/generate-sas.png" alt-text="Screenshot shows the Generate SAS field for blob." lightbox="./media/monitor-point-to-site-connections/generate-sas.png":::
1. Under **Signing method**, choose **Account key**.
1. Under **Permissions**, give the key the following permissions: **Read, Add, Create, and Write**.
1. Choose an **Expiry** date and time for the key.
1. Select **Generate SAS token and URL**.
1. Copy down the **Blob SAS token** and **Blob SAS URL** to a secure location.

## Create Azure function app

1. In the portal, in the **Search resources** bar, type **Function App**.

1. Select **Function App** from the results. On the Function App page, select **+ Create** to open the **Create Function App** page.

1. On the **Create WAN** page, on the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/function-app-basics.png" alt-text="Screenshot shows the basics tab of function app.":::

   * **Subscription**: Select the subscription that you want to use
   * **Resource group**: Create new or use existing
   * **Function App name**: Choose a name for Function App
   * **Publish**: Select **Code**
   * **Runtime stack**: Select **PowerShell Core**
   * **Version**: Choose 7.0 (or your preferred version)
   * **Region**: Choose your preferred region

1. The remaining tabs are optional to change, so you can select **Review + create** and then select **Create** when validation passes.
1. Go to the **Function App** resource.
1. Select on **Identity** under **Settings** in the left panel. Toggle the **Status** button to **On** for **System assigned** and select **Save**.

   :::image type="content" source="./media/monitor-point-to-site-connections/function-app-identity.png" alt-text="Screenshot shows the identity tab of function app.":::
1. Select on **Configuration** under **Settings** in the left panel.
1. Select on **+ New application setting**. 
:::image type="content" source="./media/monitor-point-to-site-connections/add-application-setting.png" alt-text="Screenshot shows the tab of adding an application setting." lightbox="./media/monitor-point-to-site-connections/add-application-setting.png":::
 
1. Create the following 7 entries by inputting the **Name** and **Value**, then select **OK** after each value..

   | Name | Value|
   |---|---|
   |"resourcegroup" | your resource group |
   | "sasuri"| `@Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/\<version>)`<br />--> update accordingly after keyvault is created in next section.|
   |"subscription" |your subscription ID |
   |"tenantname" | your tenant ID |
   | "vpngw"|This name is something like \<guid>-eastus-ps2-gw. You can get this from the vWAN HUB User VPN settings. |

1. Select **Save**.

1. Select on **Functions** in the left panel and select **+ Create**.

1. Fill in the fields.

   :::image type="content" source="./media/monitor-point-to-site-connections/creating-function.png" alt-text="Screenshot shows the page when creating a function." lightbox="./media/monitor-point-to-site-connections/creating-function.png":::

   * **Development Environment**: Develop in portal
   * **Template**: Timer Trigger
   * **New Function**: Choose a name for the Function 
   * **Schedule**: Enter a cron expression of the format '{second} {minute} {hour} {day} {month} {day of the week}' to specify the schedule

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

1. In the portal, in the **Search resources** bar, type **Key vaults**.

1. Select **+ Create** from the results to open the **Create a key vault** page.

1. On the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/key-vault-basics.png" alt-text="Screenshot shows the basics section of creating a key vault.":::

   * **Subscription**: Select the subscription that you want to use.
   * **Resource group**: Create new or use existing.
   * **Storage account name**: Type the name you want to call your key vault.
   * **Region**: Select a region for your storage account.
   * **Pricing tier**: Standard or Premium. **Standard** is adequate for our monitoring purposes.
1. Select **Next: Access policy >**.
1. Under **Permission model**, choose **Vault access policy**.
1. Leave the options under **Resource access** as disabled.
1. Under **Access policies**, select **+ Create**.

   :::image type="content" source="./media/monitor-point-to-site-connections/create-access-policy-screen-1.png" alt-text="Screenshot shows first screen in creating access policy." lightbox="./media/monitor-point-to-site-connections/create-access-policy-screen-1.png" :::
1. Select **Next** to go to the **Principal** tab. Type the name of your function app and select it.
1. Select **Next** twice to get to the fourth tab: **Review + create** and select **Create** at the bottom.
1. You should now see the newly created access policy under the **Access policies** section. Modifying the default values under the **Networking** tab is optional, so select **Review + create** in the bottom left corner.
1. Go to **Secrets** under **Objects** under the left panel of the key vault resource. Select **+ Generate/Import** and add secret as follows:

   * **Name**: sasuri
   * **value**: \<SASURI>
   * **Enabled**: Yes
1. Go back to the **Configuration** tab for the Function App and modify the following entry. The value comes from the **Secret Identifier** field that appears after clicking on the secret:

   * **Name**: "sasuri"
   * **Value**:  `@Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/\<version>)`

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

1. Enable allLogs and allMetrics, and choose to send to "Log Analytics workspace" as the destination. Some logs are noisy and might be costly (specifically IKEDiagnosticLog). As a result, feel free to enable only specific logs you want to view instead of enabling allLogs.

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
