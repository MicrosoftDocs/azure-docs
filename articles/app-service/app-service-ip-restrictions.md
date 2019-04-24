---
title: "Restrict client IPs - Azure App Service | Microsoft Docs" 
description: "How to use Access Restrictions with Azure App Service" 
author: ccompy
manager: stefsch
editor: ''
services: app-service\web
documentationcenter: ''

ms.assetid: 3be1f4bd-8a81-4565-8a56-528c037b24bd
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 04/22/2018
ms.author: ccompy
ms.custom: seodec18

---
# Azure App Service Access Restrictions #

Access Restrictions allow you to define a priority ordered allow/deny list that controls network access to your app. The list can include IP addresses or Azure Virtual Network subnets. When there are one or more entries, there is then an implicit "deny all" that exists at the end of the list.

The Access Restrictions capability works with all App Service hosted work loads including; web apps, API apps, Linux apps, Linux container apps, and Functions.

When a request is made to your app, the FROM address is evaluated against the IP address rules in your access restrictions list. If the FROM address is in a subnet that is configured with service endpoints to Microsoft.Web, then the source subnet is compared against the virtual network rules in your access restrictions list. If the address is not allowed access based on the rules in the list, the service replies with an [HTTP 403](https://en.wikipedia.org/wiki/HTTP_403) status code.

The access restrictions capability is implemented in the App Service front-end roles, which are upstream of the worker hosts where your code runs. Therefore, access restrictions are effectively network ACLs.

The ability to restrict access to your web app from an Azure Virtual Network (VNet) is called [service endpoints][serviceendpoints]. Service endpoints enable you to restrict access to a multi-tenant service from selected subnets. It must be enabled on both the networking side as well as the service that it is being enabled with. 

![access restrictions flow](media/app-service-ip-restrictions/ip-restrictions-flow.png)

## Adding and editing Access Restriction rules in the portal ##

To add an access restriction rule to your app, use the menu to open **Network**>**Access Restrictions** and click on **Configure Access Restrictions**

![App Service networking options](media/app-service-ip-restrictions/ip-restrictions.png)  

From the Access Restrictions UI, you can review the list of access restriction rules defined for your app.

![list access restrictions](media/app-service-ip-restrictions/ip-restrictions-browse.png)

The list will show all of the current restrictions that are on your app. If you have a VNet restriction on your app, the table will show if service endpoints are enabled for Microsoft.Web. When there are no defined restrictions on your app, your app will be accessible from anywhere.  

You can click on **[+] Add** to add a new access restriction rule. Once you add a rule, it will become effective immediately. Rules are enforced in priority order starting from the lowest number and going up. There is an implicit deny all that is in effect once you add even a single rule.

![add an access restriction rule](media/app-service-ip-restrictions/ip-restrictions-add.png)

When creating a rule you must select allow/deny and also the type of rule. You are also required to provide the priority value and what you are restricting access to.  You can optionally add a name, and description to the rule.  

To set an IP address based rule, select a type of IPv4 or IPv6. IP Address notation must be specified in CIDR notation for both IPv4 and IPv6 addresses. To specify an exact address, you can use something like 1.2.3.4/32 where the first four octets represent your IP address and /32 is the mask. The IPv4 CIDR notation for all addresses is 0.0.0.0/0. To learn more about CIDR notation, you can read [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). 

To restrict access to selected subnets, select a type of Virtual Network. Below that you will be able to pick the subscription, VNet and subnet you wish to allow or deny access with. If service endpoints is not already enabled with Microsoft.Web for the subnet that you selected, it will automatically be enabled for you unless you check the box asking not to do that. The situation where you would want to enable it on the app but not the subnet is largely related to if you have the permissions to enable service endpoints on the subnet or not. If you need to get somebody else to enable service endpoints on the subnet, you can check the box and have your app configured for service endpoints in anticipation of it being enabled later on the subnet. 

You can click on any row to edit an existing access restriction rule. Edits are effective immediately including changes in priority ordering.

![edit an access restriction rule](media/app-service-ip-restrictions/ip-restrictions-edit.png)

To delete a rule, click the **...** on your rule and then click **remove**.

![delete access restriction rule](media/app-service-ip-restrictions/ip-restrictions-delete.png)

In addition to being able to control access to your app, you can also restrict access to the scm site used by your app. The scm site is the web deploy endpoint and also the Kudu console. You can separately assign access restrictions to the scm site from the app or use the same set for both the app and the scm site.

![list access restrictions](media/app-service-ip-restrictions/ip-restrictions-scm-browse.png)

## Programmatic manipulation of access restriction rules ##

There currently is no CLI or PowerShell for the new Access Restrictions capability but the values can be set manually with a PUT operation on the app configuration in Resource Manager. As an example, you can use resources.azure.com and edit the ipSecurityRestrictions block to add the required JSON.

The location for this information in Resource Manager is:

management.azure.com/subscriptions/**subscription ID**/resourceGroups/**resource groups**/providers/Microsoft.Web/sites/**web app name**/config/web?api-version=2018-02-01

The JSON syntax for the earlier example is:

    "ipSecurityRestrictions": [
      {
        "ipAddress": "131.107.159.0/24",
        "action": "Allow",
        "tag": "Default",
        "priority": 100,
        "name": "allowed access"
      }
    ],

## Function App IP Restrictions

IP restrictions are available for both Function Apps with the same functionality as App Service plans. Note that enabling IP restrictions will disable the portal code editor for any disallowed IPs.

[Learn more here](../azure-functions/functions-networking-options.md#inbound-ip-restrictions)




<!--Links-->
[serviceendpoints]: https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview
