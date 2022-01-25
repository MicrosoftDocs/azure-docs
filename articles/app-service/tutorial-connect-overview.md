---
title: 'Securely connect to Azure resources'
description: Learn how to connect to Azure resources from an app service.

ms.topic: tutorial
ms.date: 01/26/2022
---
# Securely connect to Azure resources

Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.

## Connect with managed identity

Use managed identity to authenticate from one Azure resource to another whenever possible. This level of authentication lets Azure manage the authentication process, after the required setup is complete. Once setup, you won't need to manage the connection. 