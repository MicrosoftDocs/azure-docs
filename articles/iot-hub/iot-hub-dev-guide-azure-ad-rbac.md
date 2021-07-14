---
title: Control access to IoT Hub using Azure Active Directory | Microsoft Docs
description: Developer guide - how to control access to IoT Hub for back-end apps using Azure AD and Azure RBAC.
author: jlian
manager: briz
ms.author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/24/2021
ms.custom: ['Role: Cloud Development']
---

# Control access to IoT Hub using Azure Active Directory

Azure IoT Hub supports using Azure Active Directory (AAD) to authenticate requests to its service APIs like create device identity or invoke direct method. Also, IoT Hub supports authorization of the same service APIs with Azure role-based access control (Azure RBAC). Together, you can grant permissions to access IoT Hub's service APIs to an AAD security principal, which could be a user, group, or application service principal.

Authenticating access with Azure AD and controlling permissions with Azure RBAC provides superior security and ease of use over [security tokens](iot-hub-dev-guide-sas.md). To minimize potential security vulnerabilities inherent in security tokens, Microsoft recommends using Azure AD with your IoT hub whenever possible.

> [!NOTE]
> Authenticating with Azure AD isn't supported for IoT Hub's *device APIs* (like device-to-cloud messages and update reported properties). Use [symmetric keys](iot-hub-dev-guide-sas.md#use-a-symmetric-key-in-the-identity-registry) or [X.509](iot-hub-x509ca-overview.md) to authenticate devices to IoT hub.

## Authentication and authorization

When an Azure AD security principal requests to access an IoT Hub service API, the principal's identity is first *authenticated*. This step require the request to contain an OAuth 2.0 access token at runtime. The resource name for requesting the token is `https://iothubs.azure.net`. If the application runs inside an Azure resource like Azure VM, Azure Function app, or an App Service app, it can be represented as a [managed identity](../active-directory/managed-identities-azure-resources/how-managed-identities-work-vm.md). 

Once Azure AD principal has been authenticated, the second step is *authorization*. In this step, IoT Hub checks with Azure AD's role assignment service to see what permissions the principal has. If the principal's permissions match the requested resource or API, IoT Hub authorizes the request. So, this step requires one or more Azure roles to be assigned to the security principal. IoT Hub provides some built-in roles that have common groups of permissions.

## Manage access to IoT Hub using Azure RBAC role assignment

With Azure AD and RBAC, IoT Hub requires the principal requesting the API to have the appropriate level of permission for authorization. To give the principal the permission, give that principal a role assignment. 

- If the principal is a user, group, or application service principal, follow [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
- If the principal is a managed identity, follow [Assign a managed identity access to a resource by using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

To ensure least privilege, always assign appropriate role at the lowest possible [resource scope](#resource-scope), which is likely the IoT Hub scope.

IoT Hub provides the following Azure built-in roles for authorizing access to IoT Hub service API using Azure AD and RBAC:

| Role | Description | 
| ---- | ----------- | 
| [IoT Hub Data Contributor](../role-based-access-control/built-in-roles.md#iot-hub-data-contributor) | Allows for full access to IoT Hub data plane operations. |
| [IoT Hub Data Reader](../role-based-access-control/built-in-roles.md#iot-hub-data-reader) | Allows for full read access to IoT Hub data plane properties. |
| [IoT Hub Registry Contributor](../role-based-access-control/built-in-roles.md#iot-hub-registry-contributor) | Allows for full access to IoT Hub device registry. |
| [IoT Hub Twin Contributor](../role-based-access-control/built-in-roles.md#iot-hub-twin-contributor) | Allows for read and write access to all IoT Hub device and module twins. |

You can also define custom roles for use with IoT Hub by combining [permissions](#permissions-for-iot-hub-service-apis) that you need. For more information, see [Create custom roles for Azure Role-Based Access Control](../role-based-access-control/custom-roles.md).

### Resource scope

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

The following list describes the levels at which you can scope access to IoT Hub, starting with the narrowest scope:

- **The IoT hub.** At this scope, a role assignment applies to the IoT Hub. There's no scope smaller than an individual IoT hub. Role assignment at smaller scopes such as individual device identity or twin section isn't supported.
- **The resource group.** At this scope, a role assignment applies to all of the IoT hubs in the resource group.
- **The subscription.** At this scope, a role assignment applies to all of the IoT hubs in all of the resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all of the IoT hubs in all of the resource groups in all of the subscriptions in the management group.

## Permissions for IoT hub service APIs

The following tables describe the permissions available for IoT Hub service API operations. To enable a client to call a particular operation, ensure that the client's assigned RBAC role offers sufficient permissions for that operation.

| RBAC action | Description |
|-|-|
| Microsoft.Devices/IotHubs/devices/read | Read any device or module identity |
| Microsoft.Devices/IotHubs/devices/write  | Create or update any device or module identity  |
| Microsoft.Devices/IotHubs/devices/delete | Delete any device or module identity |
| Microsoft.Devices/IotHubs/twins/read | Read any device or module twin |
| Microsoft.Devices/IotHubs/twins/write | Write any device or module twin |
| Microsoft.Devices/IotHubs/jobs/read | Return a list of jobs |
| Microsoft.Devices/IotHubs/jobs/write | Create or update any job |
| Microsoft.Devices/IotHubs/jobs/delete | Delete any job |
| Microsoft.Devices/IotHubs/cloudToDeviceMessages/send/action | Send cloud-to-device message to any device  |
| Microsoft.Devices/IotHubs/cloudToDeviceMessages/feedback/action | Receive, complete, or abandon cloud-to-device message feedback notification |
| Microsoft.Devices/IotHubs/cloudToDeviceMessages/queue/purge/action | Deletes all the pending commands for a device  |
| Microsoft.Devices/IotHubs/directMethods/invoke/action | Invokes a direct method on any device or module |
| Microsoft.Devices/IotHubs/fileUpload/notifications/action  | Receive, complete, or abandon file upload notifications |
| Microsoft.Devices/IotHubs/statistics/read | Read device and service statistics |
| Microsoft.Devices/IotHubs/configurations/read | Read device management configurations |
| Microsoft.Devices/IotHubs/configurations/write | Create or update device management configurations |
| Microsoft.Devices/IotHubs/configurations/delete | Delete any device management configuration |
| Microsoft.Devices/IotHubs/configurations/applyToEdgeDevice/action  | Applies the configuration content to an edge device |
| Microsoft.Devices/IotHubs/configurations/testQueries/action | Validates target condition and custom metric queries for a configuration |

> [!TIP]
> - The [Bulk Registry Update](/rest/api/iothub/service/bulkregistry/updateregistry) operation requires *both* `Microsoft.Devices/IotHubs/devices/write` *and* the `Microsoft.Devices/IotHubs/devices/delete`.
> - The [Twin Query](/rest/api/iothub/service/query/gettwins) operation requires `Microsoft.Devices/IotHubs/twins/read`.
> - [Get Digital Twin](/rest/api/iothub/service/digitaltwin/getdigitaltwin) requires `Microsoft.Devices/IotHubs/twins/read` while [Update Digital Twin](/rest/api/iothub/service/digitaltwin/updatedigitaltwin) requires `Microsoft.Devices/IotHubs/twins/write`
> - Both [Invoke Component Command](/rest/api/iothub/service/digitaltwin/invokecomponentcommand) and [Invoke Root Level Command](/rest/api/iothub/service/digitaltwin/invokerootlevelcommand) require `Microsoft.Devices/IotHubs/directMethods/invoke/action`.

> [!NOTE]
> To get data from IoT Hub using Azure AD, [set up routing to a separate Event Hub](iot-hub-devguide-messages-d2c.md#event-hubs-as-a-routing-endpoint). To access the [the built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md), use the connection string (shared access key) method as before. 

## Azure AD access from Azure portal

When you try to access IoT Hub, the Azure portal first checks whether you've been assigned an Azure role with **Microsoft.Devices/iotHubs/listkeys/action**. If so, then Azure portal uses the keys from shared access policies for accessing IoT Hub. If not, Azure portal tries to access data using your Azure AD account. 

To access IoT Hub from Azure portal using your Azure AD account, you need permissions to access the IoT hub data resources (like devices and twins), and you also need permissions to navigate to the IoT hub resource in the Azure portal. The built-in roles provided by IoT Hub grant access to resources like devices and twin, but they don't grant access to the IoT Hub resource. So, access to the portal also requires assignment of an Azure Resource Manager (ARM) role like [Reader](../role-based-access-control/built-in-roles.md#reader). The Reader role is a good choice because it's the most restricted role that lets you navigate the portal, and it doesn't include the **Microsoft.Devices/iotHubs/listkeys/action** permission (which gives access to all IoT Hub data resources via shared access policies). 

To ensure an account doesn't have access outside of assigned permissions, *don't* include the **Microsoft.Devices/iotHubs/listkeys/action** permission when creating a custom role. For example, to create a custom role that could read device identities, but cannot create or delete devices, create a custom role that:
- Has the **Microsoft.Devices/IotHubs/devices/read** data action
- Doesn't have the **Microsoft.Devices/IotHubs/devices/write** data action
- Doesn't have the **Microsoft.Devices/IotHubs/devices/delete** data action
- Doesn't have the **Microsoft.Devices/iotHubs/listkeys/action** action

Then, make sure the account doesn't have any other roles that have the **Microsoft.Devices/iotHubs/listkeys/action** permission - such as [Owner](../role-based-access-control/built-in-roles.md#owner) or [Contributor](../role-based-access-control/built-in-roles.md#contributor). To let the account have resource access and can navigate the portal, assign [Reader](../role-based-access-control/built-in-roles.md#reader).

## Azure IoT extension for Azure CLI

Most commands against IoT Hub support Azure AD authentication. The type of auth used to execute commands can be controlled with the `--auth-type` parameter which accepts the values key or login. The value of `key` is set by default.

- When `--auth-type` has the value of `key`, like before the CLI automatically discovers a suitable policy when interacting with IoT Hub.

- When `--auth-type` has the value `login`, an access token from the Azure CLI logged in principal is used for the operation.

To learn more, see the [Azure IoT extension for Azure CLI release page](https://github.com/Azure/azure-iot-cli-extension/releases/tag/v0.10.12)

## SDK samples

- [.NET Microsoft.Azure.Devices SDK sample](https://aka.ms/iothubaadcsharpsample)
- [Java SDK sample](https://aka.ms/iothubaadjavasample)

## Next steps

- For more information on the advantages of using Azure AD in your application, see [Integrating with Azure Active Directory](../active-directory/develop/active-directory-how-to-integrate.md).
- For more information on requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md).
