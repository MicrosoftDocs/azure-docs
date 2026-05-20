---
title: Create an IoT Hub with Certificate Management in Azure Device Registry by using the Azure Portal
description: This article explains how to create an IoT hub with Azure Device Registry and certificate management integration by using the Azure portal.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: include
ai-usage: ai-assisted
ms.date: 04/10/2026
---

## More prerequisites for Azure portal

Before you begin, make sure that you have:

- An Azure resource group to organize your IoT hub and related resources. Create the resource group and resources in a [supported region](..\articles\iot-hub\iot-hub-what-is-new.md#supported-regions). For more information, see [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal).
- The [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) role assigned to Azure IoT Hub at the resource group level. When you select members during the role assignment, search for and select **Azure IoT Hub** from the list of service principals. For more information, see [Assign Azure roles by using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Overview

Use the Azure portal to create an IoT hub with Device Registry and certificate management integration.

The setup process in this article includes the following steps:

1. Set up your Device Registry namespace with certificate management enabled and assign necessary roles.
1. Create a custom credential policy for your namespace.
1. Create an IoT hub linked to your Device Registry namespace with a user-assigned managed identity.
1. Create a DPS instance and link it to your Device Registry namespace.
1. Link your IoT hub to the DPS instance.
1. Sync credential policies from your namespace to your IoT hubs.
1. Create an enrollment group and assign a policy to enable device onboarding.

> [!IMPORTANT]
> During the preview period, IoT Hub with Device Registry integration and certificate management features enabled on top of IoT Hub are available free of charge. DPS is billed separately and isn't included in the preview offer. For details on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Set up your Device Registry namespace

In this section, you set up your Device Registry namespace, enable certificate management, assign the necessary Contributor role, and create a custom certificate policy. These steps prepare your environment to securely manage device identities and certificates and ensure that your IoT hub can use Device Registry for device onboarding and certificate management.

### Create a Device Registry namespace with certificate management enabled

When you create a namespace with certificate management enabled, the process creates a credential known as root certificate authority (CA) and a default policy known as intermediate CA. [Certificate management](../articles/iot-hub/iot-hub-certificate-management-overview.md) uses these credentials and policies to onboard devices to the namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Device Registry**.
1. Select **Namespaces** > **Create**.
1. On the **Basics** tab, fill in the following fields:

    | Property | Value |
    | ----- | ----- |
    | **Subscription** | Select the subscription to use for your Device Registry namespace. |
    | **Resource group** | Select or create the resource group that you want to use for your IoT hub. |
    |**Name**| Enter a name for your Device Registry namespace. Your namespace name can contain only lowercase letters and hyphens (`-`) in the middle of the name, but not at the beginning or end. For example, the name `msft-namespace` is valid. |
    |**Region**|Device Registry integration and certificate management functionalities are in preview and available only in certain regions. See the [supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions). Select the region closest to you where you want your hub to be located.|

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-namespace-1.png" alt-text="Screenshot that shows how to fill in the Basics tab for a Device Registry namespace in the Azure portal.":::

1. Select **Next**.
1. On the **Certificate management** tab, select **Enabled**.

    Certificate management securely stores and manages device authentication credentials, such as API keys or certificates, for devices connecting to your namespace. When you enable this feature, you can set policies to control how certificates are issued and managed for your devices.

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-namespace-2.png" alt-text="Screenshot that shows how to enable certificate management for a Device Registry namespace in the Azure portal.":::

1. Select **Next**.
1. On the **Tags** tab, you can optionally add tags to organize your Device Registry namespace. Tags are key/value pairs that help you manage and identify your resources. Use tags to filter and group your resources in the Azure portal.

1. Select **Next**.
1. Review your settings, and then select **Create** to create your Device Registry namespace.

   The namespace creation process might take up to five minutes.

### Get the principal ID for your namespace

To complete some configuration steps after you create the IoT hub, you need the principal ID for your Device Registry namespace. This value is used to grant permissions and link resources securely.

1. In the Azure portal, go to the Device Registry namespace that you created.
1. On the **Overview** page, at the upper-right side, select **JSON view**.
1. Locate the identity section and find the value for `principalId`.
1. Copy the principal ID value to use with role assignments for your IoT hub instance.

### Assign roles to your managed identity

After you create your Device Registry namespace, grant the required permissions to your user-assigned managed identity. The user-assigned managed identity is used to securely access other Azure resources, such as a Device Registry namespace and DPS. If you don't have a user-assigned managed identity, create one in the Azure portal. For more information, see [Create a user-assigned managed identity in the Azure portal](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal).

First, grant your user-managed identity the Azure Device Registry Onboarding role:

1. In the Device Registry namespace that you created, select **Access control (IAM)** on the sidebar menu.
1. Select **+ Add** > **Add role assignment**.
1. In the **Role** field, search for and select **Azure Device Registry Onboarding**. This role allows your managed identity to onboard devices by using Device Registry credential policies.
1. Select **Next**.
1. In **Assign access to**, select **Managed identity**.
1. Choose **Select members**, and then select **User-assigned managed identity**. Search for your identity and select it.
1. Select **Review + assign** to finish. After the assignment propagates, your managed identity has the necessary onboarding permissions.

Repeat these steps to assign the Azure Device Registry Contributor role:

1. In the same **Access control (IAM)** pane for your Device Registry namespace, select **+ Add** > **Add role assignment** again.
1. In the **Role** field, search for and select **Azure Device Registry Contributor**. This role gives your managed identity the permissions that Device Registry needs for setup and operation.
1. Select **Next**.
1. In **Assign access to**, select **Managed identity**.
1. Choose **Select members**, and then select **User-assigned managed identity**. Search for your identity and select it.
1. Select **Review + assign** to finish. After the assignment propagates, you can select the user-assigned managed identity when you create your IoT hub.

### Create a custom policy for your namespace

Create custom policies within your Device Registry namespace to define how certificates are issued and managed for your devices. Policies allow you to set parameters such as certificate validity periods and subjects. Editing or disabling a policy isn't supported in preview.

1. In the Device Registry namespace that you created, under **Namespace resources**, select **Credential policies (Preview)**.

    In the **Enable certificate management** dialog, select **Enable**.

    :::image type="content" source="../articles/iot-hub/media/device-registry/custom-policy.png" alt-text="Screenshot that shows the Device Registry custom policy page in the Azure portal." lightbox="../articles/iot-hub/media/device-registry/custom-policy.png":::

1. On the **Credential policies** page, select **+ Create Policy**.
1. A pane appears where you can configure the policy settings. On the **Basics** tab, fill in the following fields:
    
    | Property | Value |
    | -------- | ----- |
    | **Name** | Enter a unique name for your policy. The name must be between 3 and 50 alphanumeric characters and can include hyphens (`-`). |
    | **Validity period (days)** | Enter the number of days that the issued certificates are valid. |
    | **Select a Root CA for certificates in this policy** | Accept the default value, **Use this namespace's Microsoft-issued Root CA (Default)**. |

1. Select **Next**, and then select **Review + create**.
1. To review the policy, select **Credential policies** to see the policy name and validity period.

## Create an IoT hub in the Azure portal

In this section, you create a new IoT hub instance with the Device Registry namespace and your user-assigned managed identity.

1. In the [Azure portal](https://portal.azure.com), search for and select **IoT Hub**.
1. On the **IoT Hub** page, select **+ Create** to create a new IoT hub.
1. On the **Basics** tab, fill in the fields that are listed in the following table.

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   | Property | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription to use for your hub. |
   | **Resource group** | Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name that you want to use.|
   | **IoT hub name** | Enter a name for your hub. This name must be globally unique, with a length between 3 and 50 alphanumeric characters. The name can also include the dash (`-`) character.|
   | **Region** | Device Registry integration and certificate management functionalities are in preview and available only in certain regions. See the [supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions). Select the region closest to you where you want your hub to be located.|
   | **Tier** | Select the **Preview** tier. To compare the features available to each tier, select **Compare tiers**.|
   | **Daily message limit** | Select the maximum daily quota of messages for your hub. The available options depend on the tier that you select for your hub. To see the available messaging and pricing options, select **See all options** and select the option that best matches the needs of your hub. For more information, see [IoT Hub quotas and throttling](/azure/iot-hub/iot-hub-devguide-quotas-throttling).|
   | **Device registry namespace** | Select the Device Registry namespace that you created in the previous section.|
   | **User-managed identity** | Select the user-assigned managed identity that you associated to the Device Registry namespace and link it to your IoT hub. |
 
   :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-gen-2-basics.png" alt-text="Screenshot that shows how to create an IoT hub in the Azure portal.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

### Configure the networking, management, and add-ons settings

After you fill in the **Basics** tab, configure your IoT hub by following these steps:

1. Select **Next: Networking** to continue creating your hub.
1. On the **Networking** tab, fill in the following fields:

   | Property | Value |
   | ----- | ----- |
   | **Connectivity configuration** | Choose the endpoints that devices can use to connect to your IoT hub. Accept the default setting, **Public access**, for this example. You can change this setting after the IoT hub is created. For more information, see [IoT Hub endpoints](/azure/iot-hub/iot-hub-devguide-endpoints). |
   | **Minimum Transport Layer Security version** | Select the minimum [TLS version](/azure/iot-hub/iot-hub-tls-support#tls-12-enforcement-available-in-select-regions) supported by your IoT hub. After the IoT hub is created, you can't change this value. Accept the default setting, **1.2**, for this example. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-network-screen.png" alt-text="Screenshot that shows how to choose the endpoints that can connect to a new IoT hub.":::

1. Select **Next: Management** to continue creating your hub.
1. On the **Management** tab, accept the default settings. If you want, you can modify any of the following fields:

   | Property | Value |
   | ----- | ----- |
   | **Permission model** | This property is part of role-based access control. The property decides how you manage access to your IoT hub. Allow shared access policies or choose only role-based access control. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac). |
   | **Assign me** | This property enables you to access IoT Hub data APIs to manage elements within an instance. If you have access to role assignments, select **IoT Hub Data Contributor role** to grant yourself full access to the data APIs.<br><br>To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner). |
   | **Device-to-cloud partitions** | This property relates the device-to-cloud messages to the number of simultaneous readers of the messages. Most IoT hubs need only four partitions. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-management.png" alt-text="Screenshot that shows how to set the role-based access control and scale for a new IoT hub.":::

1. Select **Next: Add-ons** to continue to the next screen.
1. On the **Add-ons** tab, accept the default settings. If you want, you can modify any of the following fields:

   | Property | Value |
   | -------- | ----- |
   | **Enable Device Update for IoT Hub** | Turn on **Device Update for IoT Hub** to enable over-the-air updates for your devices. If you select this option, you're prompted to provide information to provision a Device Update for IoT Hub account and instance. For more information, see [What is Device Update for IoT Hub?](/azure/iot-hub-device-update/understand-device-update). |
   | **Enable Defender for IoT** | Turn on **Defender for IoT** to add an extra layer of protection to IoT and your devices. This option isn't available for hubs in the free tier. For more information, see [Security recommendations for IoT Hub](/azure/defender-for-iot/device-builders/concept-recommendations) in [Microsoft Defender for IoT](/azure/defender-for-iot/device-builders) documentation. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-add-ons.png" alt-text="Screenshot that shows how to set the optional add-ons for a new IoT hub.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

1. Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this article, you don't add any tags. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources).

    :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-tags.png" alt-text="Screenshot that shows how to assign tags for a new IoT hub.":::

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your new hub. Your deployment might progress for a few minutes while the hub is being created. After the deployment is finished, select **Go to resource** to open the new hub.

### Link your user-assigned managed identity to the IoT hub

After you create your IoT hub, you need to associate your user-assigned managed identity with the hub. This step enables the IoT hub to use the managed identity for secure access to other Azure resources, such as the Device Registry namespace.

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub resource.
1. On the sidebar menu, under **Security settings**, select **Identity**.
1. At the top of the **Identity** pane, select the **User-assigned** tab.
1. Select **Associate**.
1. Select the user-assigned managed identity that you used with your namespace and select **Add**.

### Assign roles to the Device Registry namespace principal ID on your IoT hub

To enable secure integration between your IoT hub and Device Registry namespace, assign roles to the Device Registry namespace principal ID on your IoT hub instance. This step ensures that the Device Registry namespace can manage device identities and registry operations in your hub.

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub resource.
1. On the sidebar menu, select **Access control (IAM)**.
1. Select **+ Add** > **Add role assignment**.
1. In the **Role** field, select the **Privileged administrator roles** tab.
1. Search for and select **Contributor**.
1. Select **Next**.
1. In **Assign access to**, select **User, group, or service principal**.
1. Choose **Select members**, and then paste in the Device Registry namespace principal ID that you copied in a previous step. Select the matching identity.
1. Select **Review + assign** to finish.

Repeat these steps to assign the **IoT Hub Registry Contributor** role:

1. Select **+ Add** > **Add role assignment** again.
1. In the **Role** field, search for and select **IoT Hub Registry Contributor**.
1. Select **Next**.
1. In **Assign access to**, select **User, group, or service principal**.
1. Choose **Select members**, and then paste in the Device Registry namespace principal ID that you copied in a previous step. Select the matching identity.
1. Select **Review + assign** to finish.

## Create a DPS instance

After you create your IoT hub and your namespace, create a new DPS instance.

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Provisioning Service**.
1. In **Device Provisioning Services**, select **+ Create** to create a new DPS instance.
1. On the **Basics** tab, fill in the following fields:

    |Property|Value|
    |-----|-----|
    |**Subscription**|Select the subscription to use for your DPS instance.|
    |**Resource group**|Select the same resource group that contains the IoT hub that you created in the previous steps. By putting all related resources in a group together, you can manage them together.|
    |**Name**|Provide a unique name for your new DPS instance. If the name that you enter is available, a green check mark appears.|
    |**Region**|Select the same region where you created your IoT hub and Device Registry namespace in the previous steps.|

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-link-namespace.png" alt-text="Screenshot that shows the Basics tab for a new DPS instance with the Azure Device Registry namespace selected." lightbox="../articles/iot-hub/media/device-registry/iot-hub-link-namespace.png":::

1. Select **Review + create** to validate your provisioning service.
1. Select **Create** to start the deployment of your DPS instance.
1. After the deployment finishes, select **Go to resource** to view your DPS instance.

### Add your namespace to DPS

After you create your DPS instance, link it to your Device Registry namespace so that devices can be provisioned by using Device Registry credential policies.

1. In the [Azure portal](https://portal.azure.com), go to the DPS instance that you created.
1. On the **Overview** page, find the **ADR namespace** section.
1. Select the link to add the namespace.

   :::image type="content" source="../articles/iot-hub/media/device-registry/add-namespace-iot-hub.png" alt-text="Screenshot that shows the IoT hub Overview page with the ADR namespace section selected." lightbox="../articles/iot-hub/media/device-registry/add-namespace-iot-hub.png":::

1. Select your Device Registry namespace and the user-assigned managed identity.
1. Select **Save**.

After the link is established, your DPS instance can use the Device Registry namespace for device provisioning and certificate management.

## Link the IoT hub and your DPS instance

Add a configuration to the DPS instance that sets the IoT hub to which the instance provisions IoT devices.

1. Under **Settings** on the sidebar menu of your DPS instance, select **Linked IoT hubs**.
1. Select **Add**.
1. On the **Add link to IoT hub** pane, provide the following information:

    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription that contains the IoT hub that you want to link with your new DPS instance. |
    | **IoT hub** | Select the IoT hub to link with your new DPS instance. |
    | **Access Policy** | Select **iothubowner (RegistryWrite, ServiceConnect, DeviceConnect)** as the credentials for establishing the link with the IoT hub. |

    :::image type="content" source="../articles/iot-hub/media/device-registry/device-provision-link-iot-hub.png" alt-text="Screenshot that shows how to link an IoT hub to the DPS instance in the portal.":::

1. Select **Save**.
1. Select **Refresh**. You should now see the selected hub under the list of **Linked IoT hubs**.

## Sync policies to IoT hubs

Synchronize a policy that you created within your Device Registry namespace to the IoT hub linked to that namespace. This synchronization enables IoT Hub to trust any devices authenticating with a leaf certificate issued by the policy's issuing CA.

1. In the [Azure portal](https://portal.azure.com), go to the Device Registry namespace resource that you created earlier.
1. On the sidebar menu, select **Namespace resources** > **Credential policies (Preview)**.
1. In the list, select the credential policy that you want to synchronize.
1. At the top, select **Sync all**.
1. Wait for the confirmation message that indicates the synchronization succeeded.

If you select to sync more than one policy, the process syncs policies to their respective IoT hubs. You can't undo a sync operation.

## Create an enrollment group and assign a policy

To provision devices with leaf certificates, you need to create an enrollment group and assign the policy that you created within your Device Registry namespace. The allocation-policy defines the onboarding authentication mechanism that DPS uses before issuing a leaf certificate. The default attestation mechanism is a symmetric key.

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Provisioning Services**.
1. Search for and select the DPS instance that you created previously.
1. Under **Settings** on the sidebar menu of your DPS instance, select **Manage enrollments**.
1. On the **Manage enrollments** page, select either the **Enrollment groups** or **Individual enrollments** tab based on your provisioning needs.
1. Select **+ Add enrollment group** or **+ Add individual enrollment** to create a new enrollment.
1. On the **Registration + provisioning** page, fill in the following fields:

    | Property | Value |
    | -------- | ----- |
    | **Attestation mechanism** | Select **X.509 intermediate certificate** as the attestation method. |
    | **X.509 certificate settings** | Upload the intermediate certificate files. Enrollments have one or two certificates, which are known as primary and secondary certificate files. |
    | **Group name** | Enter a name for your enrollment group. Skip this field if you're creating an individual enrollment. |
    | **Provisioning status** | Select **Enabled** to enable the enrollment from provisioning. |
    | **Reprovision policy** | Specify the reprovisioning policy for the enrollment. This policy determines how the enrollment behaves during device reprovisioning. |

1. Select and fill in the **IoT hubs** and **Device settings** tabs as appropriate for your environment.
1. Select the **Credential policies (Preview)** tab, and select the policy that you want to assign to the enrollment group or individual enrollment.

    :::image type="content" source="../articles/iot-hub/media/device-registry/add-enrollment-group-policy.png" alt-text="Screenshot that shows Device Registry assigning a policy to an enrollment group in the Azure portal." lightbox="../articles/iot-hub/media/device-registry/add-enrollment-group-policy.png":::

1. Select **Review + create**, and then select **Create** to finalize the enrollment.
