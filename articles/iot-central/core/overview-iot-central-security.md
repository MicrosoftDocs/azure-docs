---
title: Azure IoT Central application security guide
description: This guide describes how to secure your IoT Central application including users, devices, API access, and authentication to other services for data export.
author: dominicbetts 
ms.author: dobett 
ms.date: 11/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc

# This article applies to administrators.
---

# IoT Central security guide

An IoT Central application lets you monitor and manage your devices, letting you quickly evaluate your IoT scenario. This guide is for administrators who manage security in IoT Central applications.

In IoT Central, you can configure and manage security in the following areas:

- User access to your application.
- Device access to your application.
- Programmatic access to your application.
- Authentication to other services from your application.
- Use a secure virtual network.
- Audit logs track activity in the application.

## Manage user access

Every user must have a user account before they can sign in and access an IoT Central application. IoT Central currently supports Microsoft accounts and Azure Active Directory accounts, but not Azure Active Directory groups.

*Roles* enable you to control who within your organization is allowed to do various tasks in IoT Central. Each role has a specific set of permissions that determine what a user in the role can see and do in the application. There are three built-in roles you can assign to users of your application. You can also create custom roles with specific permissions if you require finer-grained control.

*Organizations* let you define a hierarchy that you use to manage which users can see which devices in your IoT Central application. The user's role determines their permissions over the devices they see, and the experiences they can access. Use organizations to implement a multi-tenanted application.

To learn more, see:

- [Manage users and roles in your IoT Central application](howto-manage-users-roles.md)
- [Manage IoT Central organizations](howto-create-organizations.md)
- [How to use the IoT Central REST API to manage users and roles](howto-manage-users-roles-with-rest-api.md)
- [How to use the IoT Central REST API to manage organizations](howto-manage-organizations-with-rest-api.md)

## Manage device access

Devices authenticate with the IoT Central application by using either a *shared access signature (SAS) token* or an *X.509 certificate*. X.509 certificates are recommended in production environments.

In IoT Central, you use *device connection groups* to manage the device authentication options in your IoT Central application.

To learn more, see:

- [Device authentication concepts in IoT Central](concepts-device-authentication.md)
- [How to connect devices with X.509 certificates to an IoT Central application](how-to-connect-devices-x509.md)

### Network controls for device access

By default, devices connect to IoT Central over the public internet. For more security, connect your devices to your IoT Central application by using a *private endpoint* in an Azure Virtual Network.

Private endpoints use private IP addresses from a virtual network address space to connect your devices privately to your IoT Central application. Network traffic between devices on the virtual network and the IoT platform traverses the virtual network and a private link on the Microsoft backbone network, eliminating exposure on the public internet.

To learn more, see [Network security for IoT Central using private endpoints](concepts-private-endpoints.md).

## Manage programmatic access

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. Use the REST API to work with resources in your IoT Central application such as device templates, devices, jobs, users, and roles.

Every IoT Central REST API call requires an authorization header that IoT Central uses to determine the identity of the caller and the permissions that caller is granted within the application.

To access an IoT Central application using the REST API, you can use an:

- *Azure Active Directory bearer token*. A bearer token is associated with either an Azure Active Directory user account or a service principal. The token grants the caller the same permissions the user or service principal has in the IoT Central application.
- IoT Central API token. An API token is associated with a role in your IoT Central application.

To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

## Authenticate to other services

When you configure a continuous data export from your IoT Central application to Azure Blob storage, Azure Service Bus, or Azure Event Hubs, you can use either a connection string or a managed identity to authenticate. When you configure a continuous data export from your IoT Central application to Azure Data Explorer, you can use either a service principal or a managed identity to authenticate.

Managed identities are more secure because:

- You don't store the credentials for your resource in a connection string in your IoT Central application.
- The credentials are automatically tied to the lifetime of your IoT Central application.
- Managed identities automatically rotate their security keys regularly.

To learn more, see:

- [Export IoT data to cloud destinations using blob storage](howto-export-to-blob-storage.md)
- [Configure a managed identity in the Azure portal](howto-manage-iot-central-from-portal.md#configure-a-managed-identity)
- [Configure a managed identity using the Azure CLI](howto-manage-iot-central-from-cli.md#configure-a-managed-identity)

## Connect to a destination on a secure virtual network

Data export in IoT Central lets you continuously stream device data to destinations such as Azure Blob Storage, Azure Event Hubs, Azure Service Bus Messaging. You may choose to lock down these destinations by using an Azure Virtual Network (VNet) and private endpoints. To enable IoT Central to connect to a destination on a secure VNet, configure a firewall exception. To learn more, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

## Audit logs

Audit logs let administrators track activity within your IoT Central application. Administrators can see who made what changes at what times. To learn more, see [Use audit logs to track activity in your IoT Central application](howto-use-audit-logs.md).
## Next steps

Now that you've learned about security in your Azure IoT Central application, the suggested next step is to learn about [Manage users and roles](howto-manage-users-roles.md) in Azure IoT Central.

