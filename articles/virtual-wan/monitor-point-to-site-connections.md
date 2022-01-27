---
title: 'How to monitor P2S connections'
titleSuffix: Azure Virtual WAN
description: Learn how to set up an Azure workbook for P2S monitoring
services: virtual-wan
author: siddomala
ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/18/2022
ms.author: siddomala
---

# How to monitor point-to-site connections for Virtual WAN

This section documents how to create an Azure Workbook that shows relevant data of VPN clients connecting to Azure Virtual WAN using a User VPN (P2S) configuration.

## Before you begin

To complete the steps in this article, you need to have a virtual WAN,  a hub, and a User VPN Gateway. To create these resources, follow the steps in this article:

* [Create virtual WAN, a hub, and a gateway](virtual-wan-point-to-site-portal.md#P2S)


## Workbook solution architecture

- AzureDiagnostics: Enable P2S Debugging through Azure Monitor debug settings, GatewayDiagnosticLog, IKEDiagnosticLog, P2SDiagnosticLog, AllMetrics. Notice that some logs are very noisy and thereby rather costly in regards to Log Analytics cost, specially IKEDiagnostics
- Azure Metrics : Can be used directly from within the workbook, but the metrics available are limited
- Get-AzP2sVpnGatewayDetailedConnectionHealth which is a separate PowerShell command to get active sessions and this command only supports storing data in a storage account based on a SAS Key.

When you work with Azure Virtual WAN and look at metrics, it is most often done from within the context of an Azure workbook. You could also choose to extract data and use PowerBI which is another great tool to visualize data. In this case we choose to make a solution based on Azure Workbook and use what is already available and enrich it with more details, especially about active connections. 

The figure below shows the involved components in the suggested solution. 

![workbookarchitecture.png](/.attachments/workbookarchitecture.png)

The VPN service is running in the Azure vWAN P2S VPN gateway and has associated metrics and debug settings that we can read and act on directly from within an Azure workbook. To get the extra information that the PowerShell command can provide, we choose to execute this command in an Azure FunctionApp and from there store the output it the required Azure storage account.

The output stored in the storage account is fetched from within the workbook by using a special function called "externaldata".

Below is a description of the various components.

## Create Azure storage account

1. In the portal, in the **Search resources** bar, type **Storage accounts**.

1. Select **Storage accounts** from the results. On the Storage accounts page, select **+ Create** to open the **Create a storage account** page.
The Azure storage account has the following configuration settings

1. On the **Create WAN** page, on the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/storage-account-basics.png" alt-text="Screenshot shows the basics section of creating a storage account.":::

   * **Subscription**: Select the subscription that you want to use.
   * **Resource group**: Create new or use existing.
   * **Storage account name**: Type the name you want to call your storage account.
   * **Region**: Select a region for your storage account
   * **Performance**: Standard or Premium. **Standard** is adequate for our monitoring purposes. 
   * **Redundancy**: Choose between Locally-redundant storage, Geo-redundant storage, Zone-redundant storage, and Geo-zone-redundant storage.

1. After you finish filling out the fields, at the bottom of the page, select **Next: Advanced>**.
    :::image type="content" source="./media/monitor-point-to-site-connections/storage-account-advanced.png" alt-text="Screenshot shows advanced section of creating a storage account.":::

    * **Require secure transfer for REST API operations**: Choose **Enabled**
    * **Enable blob public access**: Choose **Disabled**
    * **Enable storage account key access**: Choose **Enabled**
    * **Default to Azure Active Directory authorization in the Azure portal**: Choose **Enabled**
    * **Minimum TLS version**: Choose **Version 1.2** 

1. Click **Review + create** at the bottom to run validation

1. Once validation passes, click **Create** to create the storage account.

## Create container

1. Once the deployment is complete, go to the resource
1. On the left-hand panel, click **Containers** under **Data storage**
:::image type="content" source="./media/monitor-point-to-site-connections/container-create.png" alt-text="Screenshot shows the initial container page.":::
1. Click **+ Container** to create a new container
1. Type a **Name** for your container and click **Create**

## Create and upload blob to container
1. On your machine, open a text editor application, such as **Notepad**
   :::image type="content" source="./media/monitor-point-to-site-connections/notepad.png" alt-text="Screenshot shows how to open notepad.":::
1. Leave the text file empty and click **File -> Save As**
1. Save the empty text file with a name of your choice followed by the **.json** extension
    :::image type="content" source="./media/monitor-point-to-site-connections/empty-json.png" alt-text="Screenshot shows how to save json file.":::
1. Go back to the **Containers** section in portal
   :::image type="content" source="./media/monitor-point-to-site-connections/container-after.png" alt-text="Screenshot shows the container section after creating new container.":::
1. Click on the second row, which corrersponds to the container you created (not $logs)
1. If you see this red warning message saying ""**You do not have permission...**"", then click **Switch to Access key** as your authentication method. This is located right below the red warning box.
1. Click **Upload**
    :::image type="content" source="./media/monitor-point-to-site-connections/specific-container.png" alt-text="Screenshot shows the specific container that was created by user"::: 
1. Select the file corresponding to your empty JSON file on your machine and click **Upload**
1. After the file gets uploaded, click on the JSON file and navigate to the **Generate SAS** tab
:::image type="content" source="./media/monitor-point-to-site-connections/generate-sas.png" alt-text="Screenshot shows the Generate SAS field for blob"::: 
1. Under **Signing method**, choose **Account key**
1. Under **Permissions**, give the key the following permissions: **Read, Add, Create, and Write**
1. Choose an **Expiry** date and time for the key
1. Click **Generate SAS token and URL**
1. Copy down the **Blob SAS token** and **Blob SAS URL** to a secure location

## Create Azure function app

1. In the portal, in the **Search resources** bar, type **Function App**.

1. Select **Function App** from the results. On the Function App page, select **+ Create** to open the **Create Function App** page.

1. On the **Create WAN** page, on the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/function-app-basics.png" alt-text="Screenshot shows the basics tab of function app.":::

   * **Subscription**: Select the subscription that you want to use.
   * **Resource group**: Create new or use existing.
   * **Function App name**: Choose a name for Function App
   * **Publish**: Select **Code**
   * **Runtime stack**: Select **PowerShell Core**
   * **Version**: Choose 7.0 (or your preferred version)
   * **Region**: Choose your preferred region

1. The remaining tabs are optional to change, so you can click **Review + create** and then click **Create** when validation passes. 
1. Go to the Function App resource
1. Click on **Identity** under **Settings** in the left-hand panel. Toggle the **Status** button to **On** for **System assigned** and click **Save**.
   :::image type="content" source="./media/monitor-point-to-site-connections/function-app-identity.png" alt-text="Screenshot shows the identity tab of function app.":::
1. Click on **Configuration** under **Settings** in the left-hand panel
1. Click on **+ New application setting**. Create the following 7 entries by inputting the **Name** and **Value** and clicking **Ok**:
    - **Name**: "resourcegroup"
        - **Value**: your resource group
    - **Name**: "sasuri"
        - **Value**: @Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/\<version>)-->update accordingly after keyvault is created in next section)
    - **Name**: "storageaccountname"
        - **Value**: your storage account name
    - **Name**: "storagecontainer"
        - **Value**: your storage container name
    - **Name**: "subscription"
        - **Value**: your subscription ID
    - **Name**: "tenantname"
        - **Value**: your tenant ID
    - **Name**: "vpngw"
        - **Value**: This name is something like \<guid>-eastus-ps2-gw . You can get this from the vWAN HUB User VPN settings.
 1. Click **Save**

1. Click on **Functions** in the left-hand panel and click **+ Create**. 

1. Fill in the fields. 
   :::image type="content" source="./media/monitor-point-to-site-connections/CreatingFunction.png" alt-text="Screenshot shows the page when creating a function.":::

   * **Development Environment**: Develop in portal
   * **Template**: Timer Trigger
   * **New Function**: Choose a name for the Function 
   * **Schedule**: Enter a cron expression of the format '{second} {minute} {hour} {day} {month} {day of the week}' to specify the schedule. 

 1. Click on **Code + Test** in the left-hand panel, and type the following code in the **run.ps1** file. Click **Save**.
 :::image type="content" source="./media/monitor-point-to-site-connections/function-code.png" alt-text="Screenshot shows the page when typing code for the function.":::

1. Navigate back to the **Function App** page and click on **App Service Editor** in the left-hand panel under **Development Tools**. Then, click **Go -->**. 

1. Go to **requirements.psd1** and uncomment the line beginning with **'Az'...** as shown.
:::image type="content" source="./media/monitor-point-to-site-connections/requirements-file.png" alt-text="Screenshot showing the requirements file for function app.":::

1. For the get-AzP2sVpnGatewayDetailedConnectionHealth command to succeed, you need to have the right permissions to the information. Navigate to your resource group and choose Access Control (IAM) in the left-hand panel. Assign the FunctionApp read access over the resource group. 



## Create Azure Key Vault

1. In the portal, in the **Search resources** bar, type **Key vaults**.

1. Select **+ Create** from the results to open the **Create a key vault** page.

1. On the **Basics** tab, fill in the fields. Modify the example values to apply to your environment.

   :::image type="content" source="./media/monitor-point-to-site-connections/key-vault-basics.png" alt-text="Screenshot shows the basics section of creating a key vault.":::

   * **Subscription**: Select the subscription that you want to use.
   * **Resource group**: Create new or use existing.
   * **Storage account name**: Type the name you want to call your key vault.
   * **Region**: Select a region for your storage account
   * **Pricing tier**: Standard or Premium. **Standard** is adequate for our monitoring purposes. 
1. Click **Next: Access policy >**
1. Under **Permission model**, choose **Vault access policy**
1. Leave the options under **Resource access** as disabled
1. Under **Access policies**, click **+ Create**.
   :::image type="content" source="./media/monitor-point-to-site-connections/create-access-policy-screen1.png" alt-text="Screenshot shows first screen in creating access policy.":::
1. Click **Next** to go to the **Principal** tab. Type the name of your function app and select it. 
1. Click **Next** twice to get to the fourth tab: **Review + create** and click **Create** at the bottom.
1. You should now see the newly created access policy under the **Access policies** section. Modifying the default values under the **Networking** tab is optional, so click **Review + create** in the bottom left-hand corner. 
1. Go to **Secrets** under **Objects** under the left-hand panel of the key vault resource. Click **+ Generate/Import** and add secret as follows:

* **Name**: sasuri
* **value**: \<SASURI> 
* **Enabled**: Yes
12. Go back to the **Configuration** tab for the Function App and modify the following entry. The value comes from the **Secret Identifier** field that appears after clicking on the secret: 
* **Name**: "sasuri"
* **Value**:  @Microsoft.KeyVault(SecretUri=https://\<keyvaultname>.vault.azure.net/secrets/sasuri/\<version>)



## Create Azure Workbook

The Azure workbook is now ready to be created with a mix of built-in functionality and the addition that uses the solution above to give insights to active sessions with more details.

Create a workbook from Azure Monitor or from a Log Analytics workspace.
Give it a name: <workbook name>

### P2S VPN Active Sessions Details

![workbook14.png](/.attachments/workbook14.png)

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
------------------------------------------------------------------------
------------------------------------------------------------------------
For the below metrics, you must enable diagnostics logging by adding diagnostic settings in Azure portal.  
:::image type="content" source="./media/monitor-point-to-site-connections/final-monitoring.png" alt-text="Screenshot shows Diagnostic settings page in Azure Monitor.":::

### P2S VPN Gateway Metrics

![workbook1.png](/.attachments/workbook1.png)

### Express Route Circuit Metrics

![workbook2.png](/.attachments/workbook2.png)

### Express Route Gateway Metrics

![workbook3.png](/.attachments/workbook3.png)

### P2S User successful connections with IP

![workbook4.png](/.attachments/workbook4.png)

Log Query:

AzureDiagnostics
| where Category == "P2SDiagnosticLog" and Message has "Connection successful" and Message has "Username={UserName}"
| project splitted=split(Message, "Username=")
| mv-expand col1=splitted[0], col2=splitted[1], col3=splitted[2]
| project user=split(col2, " ")
| mv-expand username=user[0]
| project ['user']

### EAP Authentication succeded

![workbook5.png](/.attachments/workbook5.png)

Log Query:

AzureDiagnostics 
| where Category == "P2SDiagnosticLog" and Message has "EAP authentication succeeded" and Message has "Username={UserName}"
| project Message, MessageFields = split(Message, " "), Userinfo = split(Message, "Username=")
| mv-expand MessageId=MessageFields[2],user=split(Userinfo[1]," ")
| project MessageId, Message, Userinfo[1]


### P2S VPN User Info

![workbook6.png](/.attachments/workbook6.png)

Log Query:

AzureDiagnostics
| where Category == "P2SDiagnosticLog" and Message has "Username={UserName}"
| project Message, MessageFields = split(Message, " "), Userinfo = split(Message, "Username=")
| mv-expand MessageId=MessageFields[2], Username=Userinfo[1]
| project MessageId, Message, Username;

### P2S VPN Successful connections per user

![workbook7.png](/.attachments/workbook7.png)

Log Query:

AzureDiagnostics 
| where Category == "P2SDiagnosticLog" and Message has "Connection successful"
| project splitted=split(Message, "Username=")
| mv-expand col1=splitted[0], col2=splitted[1], col3=splitted[2]
| project user=split(col2, " ")
| mv-expand username=user[0]
| project-away ['user']
| summarize count() by tostring(username)
| sort by count_ desc

### P2S VPN Connections

![workbook8.png](/.attachments/workbook8.png)

Log Query:

AzureDiagnostics | where Category == "P2SDiagnosticLog"
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup
| sort by TimeGenerated asc

### Successful P2S VPN Connections

![workbook9.png](/.attachments/workbook9.png)

Log Query:

AzureDiagnostics
| where Category == "P2SDiagnosticLog" and Message has "Connection successful"
| project TimeGenerated, Resource ,Message


### Failed P2S VPN Connections

![workbook10.png](/.attachments/workbook10.png)

Log Query:

AzureDiagnostics
| where Category == "P2SDiagnosticLog" and Message has "Connection failed"
| project TimeGenerated, Resource ,Message

### VPN Connection count by P2SDiagnosticLog

![workbook11.png](/.attachments/workbook11.png)

Log Query: 

AzureDiagnostics 
| where Category == "P2SDiagnosticLog" and Message has "Connection successful" and Message has "Username={UserName}"| count

### IKE Diagnosticsdetails

![workbook12.png](/.attachments/workbook12.png)

Log Query:

AzureDiagnostics
| where Category == "IKEDiagnosticLog"
| extend Message1=Message
| parse Message with * "Remote " RemoteIP ":" * "500: Local " LocalIP ":" * "500: " Message2
| extend Event = iif(Message has "SESSION_ID",Message2,Message1)
| project TimeGenerated, RemoteIP, LocalIP, Event, Level
| sort by TimeGenerated asc

### IKEDiagnosticLog

![workbook13.png](/.attachments/workbook13.png)

### P2S VPN Statistics

![workbook14.png](/.attachments/workbook14.png)

Log Query:

AzureDiagnostics 
| where Category == "P2SDiagnosticLog" and Message has "Statistics"
| project Message, MessageFields = split(Message, " ")
| mv-expand MessageId=MessageFields[2]
| project MessageId, Message;


