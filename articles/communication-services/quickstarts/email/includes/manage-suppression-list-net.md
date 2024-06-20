---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 11/21/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](../create-email-communication-resource.md).
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready to send emails.
- We're using a [service principal for authentication](../../../../active-directory/develop/howto-create-service-principal-portal.md). Set the values of the client ID, tenant ID, and client secret of the Azure Active Directory (AD) application as the following environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

## Install the required packages

```console
dotnet add package Azure.ResourceManager.Communication
dotnet add package Azure.Identity
```

## Initialize the management client

Set the environment variable `AZURE_SUBSCRIPTION_ID` with the subscription ID of the subscription your Domain and Email resources are in. Run the code sample to initialize the management client.

```csharp
using Azure;
using Azure.Core;
using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.Communication;

ArmClient client = new ArmClient(new DefaultAzureCredential());
```

## Add a suppression list to a domain resource

To block your email messages from being sent to certain addresses, the first step is setting up a suppression list in your domain resource.

Update the code sample with the resource group name, the email service name, and the domain resource name for which you would like to create the suppression list. Find this information in the portal by navigating to the domain resource you created when setting up the prerequisites. The title of the resource is `<your-email-service-name>/<your-domain-name>`. Find the resource group name and subscription ID in the Essentials sections in the domain resource overview. Choose any name for your suppression list resource and update that field in the sample as well. 

For the list name, make sure it's the same as the sender username of the MailFrom address you would like to suppress emails from. These MailFrom addresses can be found in the "MailFrom addresses" section of your domain resource in the portal. For example, you may have a MailFrom address that looks like "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net". The sender username for this address would be "donotreply" so a list name of "donotreply" should be used.

The code sample will create the suppression list and store it in the `suppressionListResource` variable for future operations.

```csharp
string subscriptionId = "<your-subscription-id>"; // Found in the essentials section of the domain resource portal overview
string resourceGroupName = "<your-resource-group-name>"; // Found in the essentials section of the domain resource portal overview
string emailServiceName = "<your-email-service-name>"; // Found in the first part of the portal domain resource title
string domainResourceName = "<your-domain-name>"; // Found in the second part of the portal domain resource title
string suppressionListResourceName = "<your-suppression-list-resource-name>";

ResourceIdentifier suppressionListResourceId = SuppressionListResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainResourceName, suppressionListResourceName);
SuppressionListResource suppressionListResource = client.GetSuppressionListResource(suppressionListResourceId);

SuppressionListResourceData suppressiontListData = new SuppressionListResourceData()
{
    ListName = "<your-sender-username>", // Should match the sender username of the MailFrom address you would like to suppress emails from
};

suppressionListResource.Update(WaitUntil.Completed, suppressiontListData);
```

If you would like to suppress emails from all the sender usernames in particular domain, you can pass in an empty string for the list name.

```csharp
SuppressionListResourceData suppressiontListData = new SuppressionListResourceData()
{
    ListName = "",
};

suppressionListResource.Update(WaitUntil.Completed, suppressiontListData);
```

## Add an address to a suppression list

After setting up the suppression list, you can now add specific email addresses to which you wish to prevent your email messages from being sent.

Update the code sample with the suppression list address ID. Every suppression list address ID you add needs to be unique. We recommend using a GUID. Update the email address you want to block from receiving your messages as well.

To add multiple addresses to the suppression list, you need to repeat this code sample multiple times.

```csharp
string suppressionListAddressId = "<your-suppression-list-address-id>";

ResourceIdentifier suppresionListAddressResourceId = SuppressionListAddressResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainResourceName, suppressionListResourceName, suppressionListAddressId);
SuppressionListAddressResource suppressionListAddressResource = client.GetSuppressionListAddressResource(suppresionListAddressResourceId);

SuppressionListAddressResourceData suppressionListAddressData = new SuppressionListAddressResourceData()
{
    Email = "<email-address-to-suppress>" // Should match the email address you would like to block from receiving your messages
};

suppressionListAddressResource.Update(WaitUntil.Completed, suppressionListAddressData);
```

You can now try sending an email to the suppressed address from the [`TryEmail` section of your Communication Service resource or by using one of the Email SDKs](../send-email.md). Make sure to send the email using the MailFrom address with the sender username you've chosen to suppress. Your email won't send to the suppressed address.

If you try sending an email from a sender username that is not suppressed the email still successfully sends.

## Remove an address from a suppression list

To remove an address from the suppression list, create the `SuppressionListAddressResource` as shown in the previous code samples and call the `Delete` method.

```csharp
suppressionListAddressResource.Delete(WaitUntil.Completed);
```

You can now try sending an email to the suppressed address from the [`TryEmail` section of your Communication Service resource or by using one of the Email SDKs](../send-email.md). Make sure to send the email using the MailFrom address with the sender username you choose to suppress. Your email will successfully send to the previously suppressed address.

## Remove a suppression list from a domain resource

To remove a suppression list from the domain resource, create the `SuppressionListResource` as shown in the previous code samples and call the `Delete` method.

```csharp
suppressionListResource.Delete(WaitUntil.Completed);
```
