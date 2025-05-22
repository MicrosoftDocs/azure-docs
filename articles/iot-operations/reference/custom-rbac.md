---
title: Custom RBAC for your resources
description: Use the Azure portal to secure access to Azure IoT Operations resources such as data flows and assets by using Azure role-based access control.
author: dominicbetts
ms.author: dobett
ms.topic: reference
ms.date: 04/16/2025

#CustomerIntent: As an IT administrator, I want configure Azure RBAC custom roles on resources in my Azure IoT Operations instance to control access to them.
---

# Custom RBAC for your Azure IoT Operations resources

To define custom roles that grant specific permissions to users, you can use Azure RBAC. For example, you can define an **Onboarding** role that grants sufficient permissions to a user to complete the Azure Arc connect process and deploy Azure IoT Operations securely.

This article includes a list of example that you can download and use in your environment. These custom roles are JSON files that list the specific permissions and scope for the role.

To learn more about custom roles in Azure RBAC, see [Azure custom roles](/azure/role-based-access-control/custom-roles).

## Example custom roles

The following sections list the example Azure IoT Operations custom roles you can download and use:

### Onboarding roles

| Custom role | Description |
| ----------- | ----------- |
| [Onboarding](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Onboarding.json) | This is privileged role. The user can complete Azure Arc connect process and deploy Azure IoT Operations securely. |

### Viewer roles

| Custom role | Description |
| ----------- | ----------- |
| [Instance viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Instance%20Viewer.json) | This role allows the user to view the Azure IoT Operations instance. |
| [Asset viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Asset%20Viewer.json) | This role allows the user to view the assets in the Azure IoT Operations instance. |
| [Asset endpoint viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Asset%20Endpoint%20Viewer.json) | This role allows the user to view the asset endpoints in the Azure IoT Operations instance. |
| [Data flow viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Data%20Flow%20Viewer.json) | This role allows the user to view the data flows in the Azure IoT Operations instance. |
| [Data flow destination viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Data%20Flow%20Destination%20Viewer.json) | This role allows the user to view the data flow destinations in the Azure IoT Operations instance. |
| [MQ viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/MQ%20Viewer.json) | This role allows the user to view the MQTT broker in the Azure IoT Operations instance. |
| [Viewer](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Viewer.json) | This role allows the user to view the Azure IoT Operations instance. This role is a combination of the **Instance viewer**, **Asset viewer**, **Asset endpoint viewer**, **Data flow viewer**, **Data flow destination viewer**, and **MQ viewer** roles. |

### Administrator roles

| Custom role | Description |
| ----------- | ----------- |
| [Instance administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Instance%20Administrator.json) | This is privileged role. The user can deploy an instance. The role includes permissions to create and update instances, brokers, authentications, listeners, dataflow profiles, dataflow endpoints, schema registries, and user assigned identities. The role also includes permission to delete instances. |
| [Asset administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Asset%20Administrator.json) | The user can create and manage assets in the Azure IoT Operations instance. |
| [Asset endpoint administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Asset%20Endpoint%20Administrator.json) | The user can create and manage asset endpoints in the Azure IoT Operations instance. |
| [Data flow administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Data%20Flow%20Administrator.json) | The user can create and manage data flows in the Azure IoT Operations instance. |
| [Data flow destination administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Data%20Flow%20Destination%20Administrator.json) | The user can create and manage data flow destinations in the Azure IoT Operations instance. |
| [MQ administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/MQ%20Administrator.json) | The user can create and manage the MQTT broker in the Azure IoT Operations instance. |
| [Administrator](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/custom-rbac/Administrator.json) | This is privileged role. The user can create and manage the Azure IoT Operations instance. This role is a combination of the **Instance administrator**, **Asset administrator**, **Asset endpoint administrator**, **Data flow administrator**, **Data flow destination administrator**, and **MQ administrator** roles. |

> [!NOTE]
> The example _Assets endpoint administrator_ and _Data flow destination administrator_ roles have access to Azure Key Vault and the **Manage secrets** page in the operations experience web UI. However, even if these custom roles are assigned at the subscription level, users can only see the list of key vaults from the specific resource group. Access to schema registries is also restricted to the resource group level.

> [!IMPORTANT]
> Currently, the operations experience web UI displays a misleading error message when a user tries to access a resource they don't have permissions for. Access to the resource is blocked as expected.

## Create a custom role definition

To prepare one of the sample custom roles:

1. Download the JSON file for the custom role you want to create. The JSON file contains the role definition, including the permissions and scope for the role.

1. Edit the JSON file to replace the placeholder value in the `assignableScopes` field with your subscription ID. Save your changes.

To add the custom role to your Azure subscription using the Azure portal:

1. Go to your subscription in the Azure portal.

1. Select **Access control (IAM)**.

1. Select **Add > Add custom role**.

1. Enter a name, such as **Onboarding**, and a description for the role.

1. Select **Start from JSON** and then select the JSON file you downloaded. The custom role name and description are populated from the file.

1. Optionally, review the permissions and assignable scopes.

1. To add the custom role to your subscription, select **Review + create** and then **Create**.

## Configure and use a custom role

After you create the custom roles in your subscription, you can assign them to users, groups, or applications. You can assign roles at the subscription or resource group level. Assigning roles at the level of a resource group enables the most granular control.

To assign the custom role to a user at the resource group level using the Azure portal:

1. Go to your resource group in the Azure portal.

1. Select **Access control (IAM)**.

1. Select **Add > Add role assignment**.

1. Search for and select the custom role you want to assign. Select **Next**.

1. Select the user or users you want to assign the role to. You can search for users by name or email address.

1. Select **Review + assign** to review the role assignment. If everything looks good, select **Assign**.
