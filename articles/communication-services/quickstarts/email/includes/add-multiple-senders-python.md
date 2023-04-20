---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 04/19/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready.
- We will be using a [service principal for authentication](../../../../active-directory/develop/howto-create-service-principal-portal.md). Set the values of the client ID, tenant ID and client secret of the AAD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

## Install the required packages

```console
pip install azure-mgmt-communication
pip install azure-identity
```

## Initialize the management client

To initialize your client, replace the field in the sample code below with your subscription id.

```python
from azure.mgmt.communication import CommunicationServiceManagementClient
from azure.identity import AzureCliCredential

credential = DefaultAzureCredential()
subscription_id = "<your-subscription-id>"

mgmt_client = CommunicationServiceManagementClient(credential, subscription_id)
```

## Add sender usernames

When Email Domain is provisioned to send mail, it has default MailFrom address as donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net or 
if you have configured custom domain such as "notification.azuremails.net" then the default MailFrom address as "donotreply@notification.azurecommtest.net" added. You can configure and add additional MailFrom addresses and FROM display name to more user friendly value.

You can define the username you want to add in a parameters object. The username you are configuring is the user alias that will be used in your MailFrom address. For example, contosoNewsAlerts@notification.azurecommtest.net would be the new MailFrom address.

Update the code sample below with the resource group name, the email service name, and the domain name that you would like to add this username to. This information can be found in portal by navigating to the domains resource you created when setting up the prerequisites. The title of the resource will be `<your-email-service-name>/<your-domain-name>`. The resource group name can be found in the Essentials sections in the domain resource Overview blade.

To add multiple sender usernames, you will need to repeat this code sample multiple times.

```python
resource_group_name = "<your-resource-group-name>"
email_service_name = "<your-email-service-name>"
domain_name = "<your-domain-name>"

parameters = {
    "username": "contosoNewsAlerts",
    "displayName": "Contoso News Alerts",
}

mgmt_client.sender_usernames.create_or_update(
    resource_group_name,
    email_service_name,
    domain_name,
    "contosoNewsAlerts",
    parameters
)
```

## Remove sender usernames

To delete the sender username, simply call the delete function on the client.

```python
mgmt_client.sender_usernames.delete(
    resource_group_name,
    email_service_name,
    domain_name,
    "contosoNewsAlerts"
)
```

## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../add-custom-verified-domains.md)
