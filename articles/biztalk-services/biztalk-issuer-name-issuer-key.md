---
title: Issuer Name and Issuer Key in BizTalk Services | Microsoft Docs
description: Learn how to retrieve Issuer Name and Issuer Key for either Service Bus or Access Control (ACS) in BizTalk Services. MABS, WABS
services: biztalk-services
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''

ms.assetid: 067fe356-d1aa-420f-b2f2-1a418686470a
ms.service: biztalk-services
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/07/2016
ms.author: mandia

---
# BizTalk Services: Issuer Name and Issuer Key

> [!INCLUDE [BizTalk Services is being retired, and replaced with Azure Logic Apps](../../includes/biztalk-services-retirement.md)]

Azure BizTalk Services uses the Service Bus Issuer Name and Issuer Key, and the Access Control Issuer Name and Issuer Key. Specifically:

| Task | Which Issuer Name and Issuer Key |
| --- | --- |
| Deploying your application from Visual Studio |Access Control Issuer Name and Issuer Key |
| Configuring the Azure BizTalk Services Portal |Access Control Issuer Name and Issuer Key |
| Creating LOB Relays with the BizTalk Adapter Services in Visual Studio |Service Bus Issuer Name and Issuer Key |

This topic lists the steps to retrieve the Issuer Name and Issuer Key. 

## Access Control Issuer Name and Issuer Key
The Access Control Issuer Name and Issuer Key are used by the following:

* Your Azure BizTalk Service application created in Visual Studio: To successfully deploy your BizTalk Service application in Visual Studio to Azure, you enter the Access Control Issuer Name and Issuer Key. 
* The Azure BizTalk Services  Portal: When you create a BizTalk Service and open the BizTalk Services Portal, your Access Control Issuer Name and Issuer Key are automatically registered for your deployments with the same Access Control values.

### Get the Access Control Issuer Name and Issuer Key

To use ACS for authentication, and get the Issuer Name and Issuer Key values, the overall steps include:

1. Install the [Azure Powershell cmdlets](https://azure.microsoft.com/documentation/articles/powershell-install-configure/).
2. Add your Azure account: `Add-AzureAccount`
3. Return your subscription name: `get-azuresubscription`
4. Select your subscription: `select-azuresubscription <name of your subscription>` 
5. Create a new namespace: `new-azuresbnamespace <name for the service bus> "Location" -CreateACSNamespace $true -NamespaceType Messaging`

    Example:
      `new-azuresbnamespace biztalksbnamespace "South Central US" -CreateACSNamespace $true -NamespaceType Messaging`
      
5. When the new ACS namespace is created (which can take several minutes), the Issuer Name and Issuer Key values are listed in the connection string: 

    ```
    Name                  : biztalksbnamespace
    Region                : South Central US
    DefaultKey            : abcdefghijklmnopqrstuvwxyz
    Status                : Active
    CreatedAt             : 10/18/2016 9:36:30 PM
    AcsManagementEndpoint : https://biztalksbnamespace-sb.accesscontrol.windows.net/
    ServiceBusEndpoint    : https://biztalksbnamespace.servicebus.windows.net/
    ConnectionString      : Endpoint=sb://biztalksbnamespace.servicebus.windows.net/;SharedSecretIssuer=owner;SharedSecretValue=abcdefghijklmnopqrstuvwxyz
    NamespaceType         : Messaging
    ```

To summarize:  
Issuer Name = SharedSecretIssuer  
Issuer Key = SharedSecretKey

More on the [New-AzureSBNamespace](https://docs.microsoft.com/powershell/module/servicemanagement/azure/new-azuresbnamespace) cmdlet. 

## Service Bus Issuer Name and Issuer Key
Service Bus Issuer Name and Issuer Key are used by BizTalk Adapter Services. In your BizTalk Services project in Visual Studio, you use the BizTalk Adapter Services to connect to an on-premises Line-of-Business (LOB) system. To connect, you create the LOB Relay and enter your LOB system details. When doing this, you also enter the Service Bus Issuer Name and Issuer Key.

### To retrieve the Service Bus Issuer Name and Issuer Key
1. Sign in to the [Azure portal](http://portal.azure.com).
2. Search for **Service Bus**, and select your namespace. 
3. Open the **Shared access policies** properties, select your policy, and view the **Connection String** for the name and key values.  

## Next
Additional Azure BizTalk Services topics:

* [Installing the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=241589)<br/>
* [Tutorials: Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=236944)<br/>
* [How do I Start Using the Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>
* [Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=303664)<br/>

## See Also
* [How to: Use ACS Management Service to Configure Service Identities](http://go.microsoft.com/fwlink/p/?LinkID=303942)<br/>
* [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
* [BizTalk Services: Provisioning](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
* [BizTalk Services: Provisioning Status Chart](http://go.microsoft.com/fwlink/p/?LinkID=329870)<br/>
* [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>
* [BizTalk Services: Backup and Restore](http://go.microsoft.com/fwlink/p/?LinkID=329873)<br/>
* [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>

