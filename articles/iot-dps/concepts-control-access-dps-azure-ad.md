---
title: Access control and security for DPS with Azure AD
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Control access to Azure IoT Hub Device Provisioning Service (DPS) for back-end apps. Includes information about Azure Active Directory and RBAC.
author: jesusbar
ms.author: jesusbar
ms.service: iot-dps
ms.topic: concept-article
ms.date: 02/07/2022
ms.custom: ['Role: Cloud Development', 'Role: Azure IoT Hub Device Provisioning Service (DPS)', 'Role: Operations', devx-track-csharp, devx-track-azurecli]
---

# Control access to Azure IoT Hub Device Provisioning Service (DPS) by using Azure Active Directory (preview)

You can use Azure Active Directory (Azure AD) to authenticate requests to Azure IoT Hub Device Provisioning Service (DPS) APIs, like create device identity and invoke direct method. You can also use Azure role-based access control (Azure RBAC) to authorize those same service APIs. By using these technologies together, you can grant permissions to access Azure IoT Hub Device Provisioning Service (DPS) APIs to an Azure AD security principal. This security principal could be a user, group, or application service principal.

Authenticating access by using Azure AD and controlling permissions by using Azure RBAC provides improved security and ease of use over [security tokens](how-to-control-access.md). To minimize potential security issues inherent in security tokens, we recommend that you use Azure AD with your Azure IoT Hub Device Provisioning Service (DPS) whenever possible. 

> [!NOTE]
> Authentication with Azure AD isn't supported for the Azure IoT Hub Device Provisioning Service (DPS)  *device APIs* (like register device or device registration status lookup). Use [symmetric keys](concepts-symmetric-key-attestation.md), [X.509](concepts-x509-attestation.md) or [TPM](concepts-tpm-attestation.md) to authenticate devices to Azure IoT Hub Device Provisioning Service (DPS).

## Authentication and authorization

When an Azure AD security principal requests access to an Azure IoT Hub Device Provisioning Service (DPS) API, the principal's identity is first *authenticated*. For authentication, the request needs to contain an OAuth 2.0 access token at runtime. The resource name for requesting the token is `https://azure-devices-provisioning.net`. If the application runs in an Azure resource like an Azure VM, Azure Functions app, or Azure App Service app, it can be represented as a [managed identity](../active-directory/managed-identities-azure-resources/how-managed-identities-work-vm.md). 

After the Azure AD principal is authenticated, the next step is *authorization*. In this step, Azure IoT Hub Device Provisioning Service (DPS) uses the Azure AD role assignment service to determine what permissions the principal has. If the principal's permissions match the requested resource or API, Azure IoT Hub Device Provisioning Service (DPS) authorizes the request. So this step requires one or more Azure roles to be assigned to the security principal. Azure IoT Hub Device Provisioning Service (DPS) provides some built-in roles that have common groups of permissions.

## Manage access to Azure IoT Hub Device Provisioning Service (DPS) by using Azure RBAC role assignment

With Azure AD and RBAC, Azure IoT Hub Device Provisioning Service (DPS) requires the principal requesting the API to have the appropriate level of permission for authorization. To give the principal the permission, give it a role assignment. 

- If the principal is a user, group, or application service principal, follow the guidance in [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.md).
- If the principal is a managed identity, follow the guidance in [Assign a managed identity access to a resource by using the Azure portal](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).

To ensure least privilege, always assign the appropriate role at the lowest possible [resource scope](#resource-scope), which is probably the Azure IoT Hub Device Provisioning Service (DPS) scope.

Azure IoT Hub Device Provisioning Service (DPS) provides the following Azure built-in roles for authorizing access to DPS APIs by using Azure AD and RBAC:

| Role | Description |
| ---- | ----------- |
| Device Provisioning Service Data Contributor | Allows for full access to Device Provisioning Service data-plane operations. |
| Device Provisioning Service Data Reader | Allows for full read access to Device Provisioning Service data-plane properties. |

You can also define custom roles to use with Azure IoT Hub Device Provisioning Service (DPS) by combining the [permissions](#permissions-for-azure-iot-hub-device-provisioning-service-dps-apis) that you need. For more information, see [Create custom roles for Azure role-based access control](../role-based-access-control/custom-roles.md).

### Resource scope

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. It's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

This list describes the levels at which you can scope access to IoT Hub, starting with the narrowest scope:

- **The Azure IoT Hub Device Provisioning Service (DPS).** At this scope, a role assignment applies to the Azure IoT Hub Device Provisioning Service (DPS). Role assignment at smaller scopes, like enrollment group or individual enrollment, isn't supported.
- **The resource group.** At this scope, a role assignment applies to all IoT hubs in the resource group.
- **The subscription.** At this scope, a role assignment applies to all IoT hubs in all resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all IoT hubs in all resource groups in all subscriptions in the management group.

## Permissions for Azure IoT Hub Device Provisioning Service (DPS) APIs

The following table describes the permissions available for Azure IoT Hub Device Provisioning Service (DPS) API operations. To enable a client to call a particular operation, ensure that the client's assigned RBAC role offers sufficient permissions for the operation.

| RBAC action | Description |
|-|-|
| `Microsoft.Devices/provisioningServices/attestationmechanism/details/action` | Fetch attestation mechanism details |
| `Microsoft.Devices/provisioningServices/enrollmentGroups/read`  | Read enrollment groups |
| `Microsoft.Devices/provisioningServices/enrollmentGroups/write`  | Write enrollment groups |
| `Microsoft.Devices/provisioningServices/enrollmentGroups/delete`  | Delete enrollment groups |
| `Microsoft.Devices/provisioningServices/enrollments/read`  | Read enrollments |
| `Microsoft.Devices/provisioningServices/enrollments/write`  | Write enrollments |
| `Microsoft.Devices/provisioningServices/enrollments/delete`  | Delete enrollments |
| `Microsoft.Devices/provisioningServices/registrationStates/read`  | Read registration states |
| `Microsoft.Devices/provisioningServices/registrationStates/delete`  | Delete registration states |


## Azure IoT extension for Azure CLI

Most commands against Azure IoT Hub Device Provisioning Service (DPS) support Azure AD authentication. You can control the type of authentication used to run commands by using the `--auth-type` parameter, which accepts `key` or `login` values. The `key` value is the default.

- When `--auth-type` has the `key` value, the CLI automatically discovers a suitable policy when it interacts with Azure IoT Hub Device Provisioning Service (DPS).

- When `--auth-type` has the `login` value, an access token from the Azure CLI logged in the principal is used for the operation.

- The following commands currently support `--auth-type`:
  - `az iot dps enrollment`
  - `az iot dps enrollment-group`
  - `az iot dps registration`

For more information, see the [Azure IoT extension for Azure CLI release page](https://github.com/Azure/azure-iot-cli-extension/releases/tag/v0.13.0).

## SDKs and samples

- [Azure IoT SDKs for Node.js Provisioning Service](https://aka.ms/IoTDPSNodeJSSDKRBAC)
    - [Sample](https://aka.ms/IoTDPSNodeJSSDKRBACSample)
- [Azure IoT SDK for Java Preview Release ](https://aka.ms/IoTDPSJavaSDKRBAC)
    - [Sample](https://github.com/Azure/azure-iot-sdk-java/tree/preview/provisioning/provisioning-service-client-samples)
- [•	Microsoft Azure IoT SDKs for .NET Preview Release](https://aka.ms/IoTDPScsharpSDKRBAC)

## Azure AD access from the Azure portal

>[!NOTE]
>Azure AD access from the Azure portal is currently not available during preview.

## Next steps

- For more information on the advantages of using Azure AD in your application, see [Integrating with Azure Active Directory](../active-directory/develop/how-to-integrate.md).
- For more information on requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md).
