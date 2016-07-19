<properties
   pageTitle="Logic Apps on-premises data gateway connection | Microsoft Azure"
   description="Information on how to create a connection to the on-premises data gateway from a logic app."
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="07/05/2016"
   ms.author="jehollan"/>

# Connect to the on-premises data gateway for Logic Apps

Supported logic apps connectors allow you to configure your connection to access on-premises data via the on-premises data gateway.  The following steps will walk you through how to install and configure the on-premises data gateway to work with a logic app.

## Prerequisites

* Must be using a work or school email address in Azure to associate the on-premises data gateway with your account (Azure Active Directory based account)
    * If you are using a Microsoft Account (e.g. @outlook.com, @live.com) you can use your Azure account to create a work or school email address by [following the steps here](../virtual-machines/virtual-machines-windows-create-aad-work-id.md#locate-your-default-directory-in-the-azure-classic-portal)
* Must have the on-premises data gateway [installed on a local machine](app-service-logic-gateway-install.md).
* Gateway must not have been claimed by another Azure on-premises data gateway ([claim happens with creation of step 2 below](#2-create-an-azure-on-premises-data-gateway-resource)) - an installation can only be associated to one gateway resource.

## Installing and configuring the connection

### 1. Install the on-premises data gateway

Information on installing the on-premises data gateway can be found [in this article](app-service-logic-gateway-install.md).  The gateway must be installed on an on-premises machine before you can continue with the rest of the steps.

### 2. Create an Azure on-premises data gateway resource

Once installed, you must associate your Azure subscription with the on-premises data gateway.

1. Login to Azure using the same work or school email address that was used during installation of the gateway
1. Click **New** resource button
1. Search and select the **On-premises data gateway**
1. Complete the information to associate the gateway with your account - including selecting the appropriate **Installation Name**

    ![On-Premises Data Gateway Connection][1]
1. Click the **Create** button to create the resource

### 3. Create a logic app connection in the designer

Now that your Azure subscription is associated with an instance of the on-premises data gateway, you can create a connection to it from within a logic app.

1. Open a logic app and choose a connector that supports on-premises connectivity (as of this writing, SQL Server)
1. Select the checkbox for **Connect via on-premises data gateway**

    ![Logic App Designer Gateway Creation][2]
1. Select the **Gateway** to connect to and complete any other connection information required
1. Click **Create** to create the connection

The connection should now be successfully configured for use in your logic app.  

## Next Steps
- [Common examples and scenarios for logic apps](app-service-logic-examples-and-scenarios.md)
- [Enterprise integration features](app-service-logic-enterprise-integration-overview.md)

<!-- Image references -->
[1]: ./media/app-service-logic-gateway-connection/createblade.PNG
[2]: ./media/app-service-logic-gateway-connection/blankconnection.PNG
[3]: ./media/app-service-logic-gateway-connection/checkbox.PNG