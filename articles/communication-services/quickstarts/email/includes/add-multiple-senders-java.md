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
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](../create-email-communication-resource.md).
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready to send emails.
- We're using a [service principal for authentication](/entra/identity-platform/howto-create-service-principal-portal). Set the values of the client ID, tenant ID, and client secret of the Microsoft Entra ID application as the following environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

## Install the required packages

Add the following dependency to your `pom.xml`.

```
<dependency>
    <groupId>com.azure.resourcemanager</groupId>
    <artifactId>azure-resourcemanager-communication</artifactId>
    <version>2.0.0</version>
</dependency>
```

## Initialize the management client

Set the environment variable `AZURE_SUBSCRIPTION_ID` with the subscription ID of the subscription your Domain and Email resources are in. Run the code sample to initialize the management client.

```java
AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);
TokenCredential credential = new DefaultAzureCredentialBuilder()
    .authorityHost(profile.getEnvironment().getActiveDirectoryEndpoint())
    .build();
CommunicationManager manager = CommunicationManager
    .authenticate(credential, profile);
```

## Add sender usernames

When an Azure Managed Domain resource is provisioned, the MailFrom address defaults to `donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net`. If you configured a custom domain such as `notification.azurecommtest.net` the MailFrom address defaults to `donotreply@notification.azurecommtest.net`.

The username is the user alias that is used in the MailFrom address. For example, the username in the MailFrom address `contosoNewsAlerts@notification.azurecommtest.net` would be `contosoNewsAlerts`. You can add extra sender usernames, which can also be configured with a more user friendly display name. In our example, the display name is `Contoso News Alerts`.

Update the code sample with the resource group name, the email service name, and the domain name that you would like to add this username to. This information can be found in portal by navigating to the domains resource you created when setting up the prerequisites. The title of the resource is `<your-email-service-name>/<your-domain-name>`. The resource group name can be found in the Essentials sections in the domain resource overview.

To add multiple sender usernames, you need to repeat this code sample multiple times.

```java
String resourceGroupName = "<your-resource-group-name>";
String emailServiceName = "<your-email-service-name>";
String domainName = "<your-domain-name>";

manager
    .senderUsernames()
    .define("contosoNewsAlerts")
    .withExistingDomain(resourceGroupName, emailServiceName, domainName)
    .withUsername("contosoNewsAlerts")
    .withDisplayName("Contoso News Alerts")
    .create();
```

## Remove sender usernames

To delete the sender username, call the `deleteWithResponse` function on the client.

```java
manager
    .senderUsernames()
    .deleteWithResponse(
        resourceGroupName,
        emailServiceName,
        domainName,
        "contosoNewsAlerts",
        com.azure.core.util.Context.NONE);
```

## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../connect-email-communication-resource.md)

## Related articles

- [Email client library](../../../concepts/email/sdk-features.md)
- [Add custom domains](../add-custom-verified-domains.md)
