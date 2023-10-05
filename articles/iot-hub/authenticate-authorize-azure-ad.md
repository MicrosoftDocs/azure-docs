---
title: Control access with Azure Active Directory
titleSuffix: Azure IoT Hub
description: Understand how Azure IoT Hub uses Azure Active Directory to authenticate identities and authorize access to IoT hubs and devices. 
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.author: kgremban
ms.topic: conceptual
ms.date: 09/01/2023
ms.custom: ["Role: Cloud Development", "Role: IoT Device", "Role: System Architecture", devx-track-azurecli]
---

# Control access to IoT Hub by using Azure Active Directory

You can use Azure Active Directory (Azure AD) to authenticate requests to Azure IoT Hub service APIs, like **create device identity** and **invoke direct method**. You can also use Azure role-based access control (Azure RBAC) to authorize those same service APIs. By using these technologies together, you can grant permissions to access IoT Hub service APIs to an Azure AD security principal. This security principal could be a user, group, or application service principal.

Authenticating access by using Azure AD and controlling permissions by using Azure RBAC provides improved security and ease of use over security tokens. To minimize potential security issues inherent in security tokens, we recommend that you [enforce Azure AD authentication whenever possible](#enforce-azure-ad-authentication). 

> [!NOTE]
> Authentication with Azure AD isn't supported for the IoT Hub *device APIs* (like device-to-cloud messages and update reported properties). Use [symmetric keys](authenticate-authorize-sas.md) or [X.509](authenticate-authorize-x509.md) to authenticate devices to IoT Hub.

## Authentication and authorization

*Authentication* is the process of proving that you are who you say you are. Authentication verifies the identity of a user or device to IoT Hub. It's sometimes shortened to *AuthN*. *Authorization* is the process of confirming permissions for an authenticated user or device on IoT Hub. It specifies what resources and commands you're allowed to access, and what you can do with those resources and commands. Authorization is sometimes shortened to *AuthZ*.

When an Azure AD security principal requests access to an IoT Hub service API, the principal's identity is first *authenticated*. For authentication, the request needs to contain an OAuth 2.0 access token at runtime. The resource name for requesting the token is `https://iothubs.azure.net`. If the application runs in an Azure resource like an Azure VM, Azure Functions app, or Azure App Service app, it can be represented as a [managed identity](../active-directory/managed-identities-azure-resources/how-managed-identities-work-vm.md). 

After the Azure AD principal is authenticated, the next step is *authorization*. In this step, IoT Hub uses the Azure AD role assignment service to determine what permissions the principal has. If the principal's permissions match the requested resource or API, IoT Hub authorizes the request. So this step requires one or more Azure roles to be assigned to the security principal. IoT Hub provides some built-in roles that have common groups of permissions.

## Manage access to IoT Hub by using Azure RBAC role assignment

With Azure AD and RBAC, IoT Hub requires the principal requesting the API to have the appropriate level of permission for authorization. To give the principal the permission, give it a role assignment. 

- If the principal is a user, group, or application service principal, follow the guidance in [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.md).
- If the principal is a managed identity, follow the guidance in [Assign a managed identity access to a resource by using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

To ensure least privilege, always assign the appropriate role at the lowest possible [resource scope](#resource-scope), which is probably the IoT Hub scope.

IoT Hub provides the following Azure built-in roles for authorizing access to IoT Hub service APIs by using Azure AD and RBAC:

| Role | Description | 
| ---- | ----------- | 
| [IoT Hub Data Contributor](../role-based-access-control/built-in-roles.md#iot-hub-data-contributor) | Allows full access to IoT Hub data plane operations. |
| [IoT Hub Data Reader](../role-based-access-control/built-in-roles.md#iot-hub-data-reader) | Allows full read access to IoT Hub data plane properties. |
| [IoT Hub Registry Contributor](../role-based-access-control/built-in-roles.md#iot-hub-registry-contributor) | Allows full access to the IoT Hub device registry. |
| [IoT Hub Twin Contributor](../role-based-access-control/built-in-roles.md#iot-hub-twin-contributor) | Allows read and write access to all IoT Hub device and module twins. |

You can also define custom roles to use with IoT Hub by combining the [permissions](#permissions-for-iot-hub-service-apis) that you need. For more information, see [Create custom roles for Azure role-based access control](../role-based-access-control/custom-roles.md).

### Resource scope

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. It's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

This list describes the levels at which you can scope access to IoT Hub, starting with the narrowest scope:

- **The IoT hub.** At this scope, a role assignment applies to the IoT hub. There's no scope smaller than an individual IoT hub. Role assignment at smaller scopes, like individual device identity or twin section, isn't supported.
- **The resource group.** At this scope, a role assignment applies to all IoT hubs in the resource group.
- **The subscription.** At this scope, a role assignment applies to all IoT hubs in all resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all IoT hubs in all resource groups in all subscriptions in the management group.

## Permissions for IoT Hub service APIs

The following table describes the permissions available for IoT Hub service API operations. To enable a client to call a particular operation, ensure that the client's assigned RBAC role offers sufficient permissions for the operation.

| RBAC action | Description |
|-|-|
| `Microsoft.Devices/IotHubs/devices/read` | Read any device or module identity. |
| `Microsoft.Devices/IotHubs/devices/write`  | Create or update any device or module identity.  |
| `Microsoft.Devices/IotHubs/devices/delete` | Delete any device or module identity. |
| `Microsoft.Devices/IotHubs/twins/read` | Read any device or module twin. |
| `Microsoft.Devices/IotHubs/twins/write` | Write any device or module twin. |
| `Microsoft.Devices/IotHubs/jobs/read` | Return a list of jobs. |
| `Microsoft.Devices/IotHubs/jobs/write` | Create or update any job. |
| `Microsoft.Devices/IotHubs/jobs/delete` | Delete any job. |
| `Microsoft.Devices/IotHubs/cloudToDeviceMessages/send/action` | Send a cloud-to-device message to any device.  |
| `Microsoft.Devices/IotHubs/cloudToDeviceMessages/feedback/action` | Receive, complete, or abandon a cloud-to-device message feedback notification. |
| `Microsoft.Devices/IotHubs/cloudToDeviceMessages/queue/purge/action` | Delete all the pending commands for a device.  |
| `Microsoft.Devices/IotHubs/directMethods/invoke/action` | Invoke a direct method on any device or module. |
| `Microsoft.Devices/IotHubs/fileUpload/notifications/action`  | Receive, complete, or abandon file upload notifications. |
| `Microsoft.Devices/IotHubs/statistics/read` | Read device and service statistics. |
| `Microsoft.Devices/IotHubs/configurations/read` | Read device management configurations. |
| `Microsoft.Devices/IotHubs/configurations/write` | Create or update device management configurations. |
| `Microsoft.Devices/IotHubs/configurations/delete` | Delete any device management configuration. |
| `Microsoft.Devices/IotHubs/configurations/applyToEdgeDevice/action`  | Apply the configuration content to an edge device. |
| `Microsoft.Devices/IotHubs/configurations/testQueries/action` | Validate the target condition and custom metric queries for a configuration. |

> [!TIP]
> - The [Bulk Registry Update](/rest/api/iothub/service/bulkregistry/updateregistry) operation requires both `Microsoft.Devices/IotHubs/devices/write` and `Microsoft.Devices/IotHubs/devices/delete`.
> - The [Twin Query](/rest/api/iothub/service/query/gettwins) operation requires `Microsoft.Devices/IotHubs/twins/read`.
> - [Get Digital Twin](/rest/api/iothub/service/digitaltwin/getdigitaltwin) requires `Microsoft.Devices/IotHubs/twins/read`. [Update Digital Twin](/rest/api/iothub/service/digitaltwin/updatedigitaltwin) requires `Microsoft.Devices/IotHubs/twins/write`.
> - Both [Invoke Component Command](/rest/api/iothub/service/digitaltwin/invokecomponentcommand) and [Invoke Root Level Command](/rest/api/iothub/service/digitaltwin/invokerootlevelcommand) require `Microsoft.Devices/IotHubs/directMethods/invoke/action`.

> [!NOTE]
> To get data from IoT Hub by using Azure AD, [set up routing to a separate event hub](iot-hub-devguide-messages-d2c.md#event-hubs-as-a-routing-endpoint). To access the [the built-in Event Hubs compatible endpoint](iot-hub-devguide-messages-read-builtin.md), use the connection string (shared access key) method as before. 

## Enforce Azure AD authentication

By default, IoT Hub supports service API access through both Azure AD and [shared access policies and security tokens](authenticate-authorize-sas.md). To minimize potential security vulnerabilities inherent in security tokens, you can disable access with shared access policies. 

   > [!WARNING]
   > By denying connections using shared access policies, all users and services that connect using this method lose access immediately. Notably, since Device Provisioning Service (DPS) only supports linking IoT hubs using shared access policies, all device provisioning flows will fail with "unauthorized" error. Proceed carefully and plan to replace access with Azure AD role based access. **Do not proceed if you use DPS**.

1. Ensure that your service clients and users have [sufficient access](#manage-access-to-iot-hub-by-using-azure-rbac-role-assignment) to your IoT hub. Follow the [principle of least privilege](../security/fundamentals/identity-management-best-practices.md).
1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.
1. On the left pane, select **Shared access policies**.
1. Under **Connect using shared access policies**, select **Deny**, and review the warning.
    :::image type="content" source="media/iot-hub-dev-guide-azure-ad-rbac/disable-local-auth.png" alt-text="Screenshot that shows how to turn off IoT Hub shared access policies." border="true":::

Your IoT Hub service APIs can now be accessed only through Azure AD and RBAC.

## Azure AD access from the Azure portal

You can provide access to IoT Hub from the Azure portal with either shared access policies or Azure AD permissions.

When you try to access IoT Hub from the Azure portal, the Azure portal first checks whether you've been assigned an Azure role with `Microsoft.Devices/iotHubs/listkeys/action`. If you have, the Azure portal uses the keys from shared access policies to access IoT Hub. If not, the Azure portal tries to access data by using your Azure AD account. 

To access IoT Hub from the Azure portal by using your Azure AD account, you need permissions to access IoT Hub data resources (like devices and twins). You also need permissions to go to the IoT Hub resource in the Azure portal. The built-in roles provided by IoT Hub grant access to resources like devices and twin but they don't grant access to the IoT Hub resource. So access to the portal also requires the assignment of an Azure Resource Manager role like [Reader](../role-based-access-control/built-in-roles.md#reader). The reader role is a good choice because it's the most restricted role that lets you navigate the portal. It doesn't include the `Microsoft.Devices/iotHubs/listkeys/action` permission (which provides access to all IoT Hub data resources via shared access policies). 

To ensure an account doesn't have access outside of the assigned permissions, don't include the `Microsoft.Devices/iotHubs/listkeys/action` permission when you create a custom role. For example, to create a custom role that can read device identities but can't create or delete devices, create a custom role that:

- Has the `Microsoft.Devices/IotHubs/devices/read` data action.
- Doesn't have the `Microsoft.Devices/IotHubs/devices/write` data action.
- Doesn't have the `Microsoft.Devices/IotHubs/devices/delete` data action.
- Doesn't have the `Microsoft.Devices/iotHubs/listkeys/action` action.

Then, make sure the account doesn't have any other roles that have the `Microsoft.Devices/iotHubs/listkeys/action` permission, like [Owner](../role-based-access-control/built-in-roles.md#owner) or [Contributor](../role-based-access-control/built-in-roles.md#contributor). To allow the account to have resource access and navigate the portal, assign [Reader](../role-based-access-control/built-in-roles.md#reader).

## Azure AD access from Azure CLI

Most commands against IoT Hub support Azure AD authentication. You can control the type of authentication used to run commands by using the `--auth-type` parameter, which accepts `key` or `login` values. The `key` value is the default.

- When `--auth-type` has the `key` value, as before, the CLI automatically discovers a suitable policy when it interacts with IoT Hub.

- When `--auth-type` has the `login` value, an access token from the Azure CLI logged in the principal is used for the operation.

For more information, see the [Azure IoT extension for Azure CLI release page](https://github.com/Azure/azure-iot-cli-extension/releases/tag/v0.10.12).

## SDK samples

- [.NET SDK sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/service/samples/how%20to%20guides/RoleBasedAuthenticationSample/Program.cs)
- [Java SDK sample](https://github.com/Azure/azure-iot-service-sdk-java/tree/main/service/iot-service-samples/role-based-authorization-sample)

## Next steps

- For more information on the advantages of using Azure AD in your application, see [Integrating with Azure Active Directory](../active-directory/develop/how-to-integrate.md).
- For more information on requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md).

Use the Device Provisioning Service to [Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).
