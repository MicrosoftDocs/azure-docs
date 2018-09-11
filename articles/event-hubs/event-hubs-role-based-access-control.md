---
title: Azure Event Hubs Role-Based Access Control (RBAC) preview | Microsoft Docs
description: Azure Event Hubs Role-Based Access Control
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 07/05/2018
ms.author: shvija

---

# Active Directory Role-Based Access Control (preview)

Microsoft Azure provides integrated access control management for resources and applications based on Azure Active Directory (Azure AD). With Azure AD, you can either manage user accounts and applications specifically for your Azure-based applications, or you can federate your existing Active Directory infrastructure with Azure AD for company-wide single-sign-on that also spans Azure resources and Azure hosted applications. You can then assign those Azure AD user and application identities to global and service-specific roles in order to grant access to Azure resources.

For Azure Event Hubs, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the *role-based access control* (RBAC) model. RBAC for runtime operations is a feature now in public preview. 

An application that uses Azure AD RBAC does not need to handle SAS rules and keys or any other access tokens specific to Event Hubs. The client app interacts with Azure AD to establish an authentication context, and acquires an access token for Event Hubs. With domain user accounts that require interactive login, the application never handles any credentials directly.

## Event Hubs roles and permissions

For the initial public preview, you can only add Azure AD accounts and service principals to the "Owner" or "Contributor" roles of an Event Hubs namespace. This operation grants the identity full control over all entities in the namespace. Management operations that change the namespace topology are initially only supported though Azure resource management and not through the native Event Hubs REST management interface. This support also means that the .NET Framework client [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) object cannot be used with an Azure AD account.  

## Use Event Hubs with an Azure AD domain user account

The following section describes the steps required to create and run a sample application that prompts for an interactive Azure AD user to sign on, how to grant Event Hubs access to that user account, and how to use that identity to access Event Hubs. 

This introduction describes a simple console application, the [code for which is on Github](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Rbac/EventHubsSenderReceiverRbac/)

### Create an Active Directory user account

This first step is optional. Every Azure subscription is automatically paired with an Azure Active Directory tenant and if you have access to an Azure subscription, your user account is already registered. That means you can just use your account. 

If you still want to create a specific account for this scenario, [follow these steps](../automation/automation-create-aduser-account.md). You must have permission to create accounts in the Azure Active Directory tenant, which may not be the case for larger enterprise scenarios.

### Create an Event Hubs namespace

Next, [create an Event Hubs namespace](event-hubs-create.md) in one of the Azure regions that have Event Hubs preview support for RBAC: **US East**, **US East 2**, or **West Europe**. 

Once the namespace is created, navigate to its **Access Control (IAM)** page on the portal, and then click **Add** to add the Azure AD user account to the Owner role. If you use your own user account and you created the namespace, you are already in the Owner role. To add a different account to the role, search for the name of the web application in the **Add permissions** panel **Select** field, and then click the entry. Then click **Save**.
 
![](./media/event-hubs-role-based-access-control/rbac1.PNG)

The user account now has access to the Event Hubs namespace, and to the event hub you previously created.
 
### Register the application

Before you can run the sample application, register it in Azure AD and approve the consent prompt that permits the application to access Event Hubs on its behalf. 

Because the sample application is a console application, you must register a native application and add API permissions for **Microsoft.EventHub** to the "required permissions" set. Native applications also need a **redirect-URI** in Azure AD that serves as an identifier; the URI does not need to be a network destination. Use `http://eventhubs.microsoft.com` for this example, because the sample code already uses that URI.

The detailed registration steps are explained in [this tutorial](../active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad.md). Follow the steps to register a **Native** app, and then follow the update instructions to add the **Microsoft.EventHub** API to the required permissions. As you follow the steps, make note of the **TenantId** and the **ApplicationId**, as you will need these values to run the application.

### Run the app

Before you can run the sample, edit the App.config file and, depending on your scenario, set the following values:

- `tenantId`: Set to **TenantId** value.
- `clientId`: Set to **ApplicationId** value. 
- `clientSecret`: If you want to sign in using the client secret, create it in Azure AD. Also, use a web app or API instead of a native app. Also, add the app under **Access Control (IAM)** in the namespace you previously created.
- `eventHubNamespaceFQDN`: Set to the fully qualified DNS name of your newly created Event Hubs namespace; for example, `example.servicebus.windows.net`.
- `eventHubName`: Set to the name of the event hub you created.
- The redirect URI you specified in your app in the previous steps.
 
When you run the console application, you are prompted to select a scenario; click **Interactive User Login** by typing its number and pressing ENTER. The application displays a sign-in window, asks for your consent to access Event Hubs, and then uses the service to run through the send/receive scenario using the sign-in identity.

## Next steps

For more information about Event Hubs, visit the following links:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Event Hubs pricing details](https://azure.microsoft.com/pricing/details/event-hubs/)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)