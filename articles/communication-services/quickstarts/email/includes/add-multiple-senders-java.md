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
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)
- An [Azure Managed Domain](../../quickstarts/email/add-azure-managed-domains.md) or [Custom Domain](../../quickstarts/email/add-custom-verified-domains.md) provisioned and ready.
- We will be using a [service principal for authentication](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal). Set the values of the client ID, tenant ID and client secret of the AAD application as environment variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET`.

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

To initialize your client, intialize the environment variable `AZURE_SUBSCRIPTION_ID` with your subscription id before running the code sample.

```java
AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);
TokenCredential credential = new DefaultAzureCredentialBuilder()
    .authorityHost(profile.getEnvironment().getActiveDirectoryEndpoint())
    .build();
CommunicationManager manager = CommunicationManager
    .authenticate(credential, profile);
```

## Add sender usernames

Update the code sample below with the resource group name, the email service name, and the domain name that you would like to add this username to. To add multiple sender usernames, you will need to repeat this code sample multiple times.

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

To delete the sender username, simply call the deleteWithResponse function on the client.

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

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../add-custom-verified-domains.md)
