---
title: "Azure App Service IP Restrictions | Microsoft Docs" 
description: "How to use IP restrictions with Azure App Service" 
author: btardif
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
ms.date: 09/12/2017
ms.author: byvinyal

---
# Azure App Service Static IP Restrictions #

IP Restrictions allow you to define a black list of ip addresses that are blocked from accessing your app. The black list can include individual IP Addresses or a range of IP Addresses defined by a Subnet mask.

When a request to the app is generated from a client, the ip address is evaluated against the black list. If there is a match, the app replies with an [HTTP 403](https://en.wikipedia.org/wiki/HTTP_403) status code.

IP Restrictions are evaluated on the same App Service plan instances assigned to your app.

## Adding and IP Restriction using the Azure portal ##

To add an ip restriction rule to your app, use the menu to open **Network**>**IP Restrictions** and click on **Configure IP Restrictions**

![ip restrictions]
(media/app-service-ip-restrictions/ip-restrictions.png)

From here you can review the list IP restrictions rules defined for your app.

![list ip restrictions](media/app-service-ip-restrictions/browse-ip-restrictions.png)

You can click on **[+] Add** to add a new ip restriction rule.

![add ip restrictions](media/app-service-ip-restrictions/add-ip-restrictions.png)
