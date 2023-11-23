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
- We are using a [service principal for authentication](../../../../active-directory/develop/howto-create-service-principal-portal.md). Set the values of the client ID, tenant ID and client secret of the AAD application as the following environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

## Install the required packages

```console
dotnet add package Azure.ResourceManager.Communication
dotnet add package Azure.Identity
```

## Initialize the management client

Set the environment variable `AZURE_SUBSCRIPTION_ID` with the subscription id of the subscription your Domain and Email resources are in. Run the code sample to initialize the management client.

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

Update the code sample with the resource group name, the email service name, and the domain resource name for which you would like to create the suppression list. This information can be found in portal by navigating to the domains resource you created when setting up the prerequisites. The title of the resource is `<your-email-service-name>/<your-domain-name>`. The resource group name and subscription ID can be found in the Essentials sections in the domain resource overview. Choose a name for your suppression list and update that field in the sample as well.

The code sample will create the suppression list and store it in the `suppressionListResource` variable for future operations.

```csharp
string subscriptionId = "<your-subscription-id>";
string resourceGroupName = "<your-resource-group-name>";
string emailServiceName = "<your-email-service-name>";
string domainResourceName = "<your-domain-name>";
string suppressionListName = "<your-suppression-list-name>";

ResourceIdentifier suppressionListResourceId = SuppressionListResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainResourceName, suppressionListName);
SuppressionListResource suppressionListResource = client.GetSuppressionListResource(suppressionListResourceId);

SuppressionListResourceData suppressiontListData = new SuppressionListResourceData()
{
    ListName = suppressionListName,
};

suppressionListResource.Update(WaitUntil.Completed, suppressiontListData);
```

## Add an address to a suppression list

After setting up the suppression list, you can now add specific email addresses to which you wish to prevent your email messages from being sent.

Update the code sample with the suppression list address ID and the email address you want to block from recieving your messages.

To add multiple addresses to the suppression list, you need to repeat this code sample multiple times.

```csharp
string suppressionListAddressId = "<your-suppression-list-address-id>"; // What is this value supposed to be?

ResourceIdentifier suppresionListAddressResourceId = SuppressionListAddressResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, emailServiceName, domainResourceName, suppressionListName, suppressionListAddressId);
SuppressionListAddressResource suppressionListAddressResource = client.GetSuppressionListAddressResource(suppresionListAddressResourceId);

SuppressionListAddressResourceData suppressionListAddressData = new SuppressionListAddressResourceData()
{
    Email = "<email-address-to-suppress>"
};

suppressionListAddressResource.Update(WaitUntil.Completed, suppressionListAddressData);
```

You can now try sending an email to the suppressed address from the [`TryEmail` section of your Communication Service resource](./try-send-email.md) or by [using one of the Email SDKs](../send-email.md). Your email will not be sent to the suppressed address.

## Remove an address from a suppression list

To remove an address from the suppression list, create the `SuppressionListAddressResource`` as shown in the previous code samples and call the `Delete` method.

```csharp
suppressionListAddressResource.Delete(WaitUntil.Completed);
```

You can now try sending an email to the suppressed address from the [`TryEmail` section of your Communication Service resource](./try-send-email.md) or by [using one of the Email SDKs](../send-email.md). Your email will be successfully sent to the previously suppressed address.

## Remove a suppression list from a domains resource

To remove a suppression list from the domains resource, create the `SuppressionListResource` as shown in the previous code samples and call the `Delete` method.

```csharp
suppressionListResource.Delete(WaitUntil.Completed);
```