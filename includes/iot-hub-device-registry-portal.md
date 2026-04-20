---
title: Create an IoT hub with Certificate Management in Azure Device Registry using Azure portal
description: This article explains how to create an IoT hub with Azure Device Registry and certificate management integration using the Azure portal.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: include
ai-usage: ai-assisted
ms.date: 01/26/2026
---

## Additional prerequisites for Azure portal

Before you begin, make sure you have:

- An Azure resource group to organize your IoT hub and related resources. Create the resource group and resources in a [supported region](..\articles\iot-hub\iot-hub-what-is-new.md#supported-regions). For more information, see [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal).
- Assigned the [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) role to the **Azure IoT Hub** service at the resource group level. When you select members during the role assignment, search for and select **Azure IoT Hub** from the list of service principals. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Overview

Use the Azure portal to create an IoT hub with Azure Device Registry and certificate management integration.

The setup process in this article includes the following steps:

1. Set up your ADR namespace with system-assigned managed identity and assign necessary roles.
1. Create a custom credential policy for your namespace.
1. Create an IoT hub linked to your ADR namespace with a user-assigned managed identity.
1. Create a DPS instance and link it to your ADR namespace.
1. Link your IoT hub to the DPS instance.
1. Sync credential policies from your namespace to your IoT hubs.
1. Create an enrollment group and assign a policy to enable device onboarding.

> [!IMPORTANT]
> During the preview period, IoT Hub with ADR integration and certificate management features enabled on top of IoT Hub are available **free of charge**. Device Provisioning Service (DPS) is billed separately and isn't included in the preview offer. For details on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Set up your ADR namespace

In this section, you set up your Azure Device Registry (ADR) namespace, enable managed identities, assign the necessary contributor role, and create a custom credential policy. These steps prepare your environment to securely manage device identities and certificates, and ensure your IoT hub can use ADR for device onboarding and certificate management.

### Create an ADR namespace with system-assigned managed identity

When you create a namespace with a system-assigned managed identity, the process also creates a credential known as root CA and a default policy known as intermediate CA. [Certificate management](../articles/iot-hub/iot-hub-certificate-management-overview.md) uses these credentials and policies to onboard devices to the namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Device Registry**.
1. Select **Namespaces** > **Create**.
1. On the Basics tab, fill in the fields as follows:

    | Property | Value |
    | ----- | ----- |
    | **Subscription** | Select the subscription to use for your ADR namespace. |
    | **Resource group** | Select or create the resource group that you want to use for your IoT hub. |
    |**Name**| Enter a name for your ADR namespace. Your namespace name can only contain lowercase letters and hyphens ('-') in the middle of the name, but not at the beginning or end. For example, the name "msft-namespace" is valid. |
    |**Region**|ADR integration and certificate management functionalities are in **preview** and only available in **certain regions**. See the [supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions). Select the region, closest to you, where you want your hub to be located.|

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-namespace-1.png" alt-text="Screen capture that shows how to fill the basics tab for an ADR namespace in the Azure portal.":::

1. Select **Next**.
1. In the **Identity** tab, enable a system-assigned managed identity and a credential resource for your namespace. For more information about how ADR works with managed identities and credential resources, see [What is certificate management](../articles/iot-hub/iot-hub-certificate-management-overview.md).

    - Managed identities allow your namespace to authenticate to Azure services without storing credentials in your code.
    - Credential resources securely store and manage device authentication credentials, such as API keys or certificates, for devices connecting to your namespace. When you enable this feature, you can set policies to control how certificates are issued and managed for your devices.

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-namespace-2.png" alt-text="Screen capture that shows how to enable a system-assigned managed identity for an ADR namespace in the Azure portal.":::

1. Select **Next**.
1. In the Tags tab, you can optionally **add tags** to organize your ADR namespace. Tags are key-value pairs that help you manage and identify your resources. Use tags to filter and group your resources in the Azure portal.

1. Select **Next**.
1. Review your settings, then select **Create** to create your ADR namespace.

    > [!NOTE]
    > The creation of the namespace with system-assigned managed identity might take up to five minutes.

### Get the principal ID for your namespace

To complete some configuration steps after you create the IoT hub, you need the principal ID for your ADR namespace. This value is used to grant permissions and link resources securely.

1. In the Azure portal, go to the ADR namespace you created.
1. On the **Overview** page, at the top right-hand side, select **JSON view**.
1. Locate the identity section and find the value for `principalId`.
1. Copy the principal ID value to use with role assignments for your IoT hub instance.

### Assign roles to your managed identity

After you create your ADR namespace, grant the required permissions to your user-assigned managed identity. The user-assigned managed identity is used to securely access other Azure resources, such as ADR namespace and DPS. If you don't have a user-assigned managed identity, create one in the Azure portal. For more information, see [Create a user-assigned managed identity in the Azure portal](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal).

First grant your user-managed identity the **Azure Device Registry Onboarding** role:

1. In the same **Access control (IAM)** pane for your ADR namespace, select **+ Add** > **Add role assignment** again.
1. In the **Role** field, search for and select **Azure Device Registry Onboarding**. This role allows your managed identity to onboard devices using ADR credential policies.
1. Select **Next**.
1. In **Assign access to**, choose **Managed identity**.
1. Select **Select members**, then choose **User-assigned managed identity**. Search for your identity and select it.
1. Select **Review + assign** to finish. After the assignment propagates, your managed identity will have the necessary onboarding permissions.

Repeat these steps to assign the **Azure Device Registry Contributor** role:

1. In the [Azure portal](https://portal.azure.com), go to **Home** > **Azure Device Registry** > select your ADR namespace.
1. In the left pane, select **Access control (IAM)**.
1. Select **+ Add** > **Add role assignment**.
1. In the **Role** field, search for and select **Azure Device Registry Contributor**. This role gives your managed identity the permissions ADR needs for setup and operation.
1. Select **Next**.
1. In **Assign access to**, choose **Managed identity**.
1. Select **Select members**, then choose **User-assigned managed identity**. Search for your identity and select it.
1. Select **Review + assign** to finish. After the assignment propagates, you can select the user-assigned managed identity when you create your IoT hub.

### Create a custom policy for your namespace

Create custom policies within your ADR namespace to define how certificates are issued and managed for your devices. Policies allow you to set parameters such as certificate validity periods and subjects. Editing or disabling a policy isn't supported in preview.

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Device Registry**.
1. Go to the **Namespaces** page.
1. Select your ADR namespace.
1. In the namespace page, under **Namespace resources**, select **Credential policies (Preview)**.

    :::image type="content" source="../articles/iot-hub/media/device-registry/custom-policy.png" alt-text="Screenshot of Azure Device Registry custom policy page in the Azure portal." lightbox="../articles/iot-hub/media/device-registry/custom-policy.png":::

1. Select **Enable credential resource**  to turn on credential policies for your namespace, if they aren't already active.
1. In the **Credential policies** page, select **+ Create** to create a new policy.
1. A pane appears where you can configure the policy settings. In the **Basics** tab, complete the fields as follows:
    
    | Property | Value |    
    | -------- | ----- |
    | **Name** | Enter a unique name for your policy. The name must be between 3 and 50 alphanumeric characters and can include hyphens (`'-'`). |
    | **Validity period (days)** | Enter the number of days the issued certificates are valid. |

1. Select **Next** > **Create**.
1. After it's created, select **Go to resource** and select the namespace.
1. To review the policy, select **Credential policies** to see the policy name and validity period.

## Create an IoT hub in Azure portal

In this section, you create a new IoT hub instance with the ADR namespace and your user-assigned managed identity.

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure IoT Hub**.
1. In the **IoT Hub** page, select **+ Create** to create a new IoT hub.
1. On the **Basics** tab, complete the fields as follows:

   [!INCLUDE [iot-hub-pii-note-naming-hub](iot-hub-pii-note-naming-hub.md)]

   | Property | Value |
   | ----- | ----- |
   | **Subscription** | Select the subscription to use for your hub. |
   | **Resource group** | Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name you want to use.|
   | **IoT hub name** | Enter a name for your hub. This name must be globally unique, with a length between 3 and 50 alphanumeric characters. The name can also include the dash (`'-'`) character.|
   | **Region** | ADR integration and certificate management functionalities are in **preview** and only available in **certain regions**. See the [supported regions](../articles/iot-hub/iot-hub-what-is-new.md#supported-regions). Select the region, closest to you, where you want your hub to be located.|
   | **Tier** | Select the **Preview** tier. To compare the features available to each tier, select **Compare tiers**.|
   | **Daily message limit** | Select the maximum daily quota of messages for your hub. The available options depend on the tier you select for your hub. To see the available messaging and pricing options, select **See all options** and select the option that best matches the needs of your hub. For more information, see [IoT Hub quotas and throttling](/azure/iot-hub/iot-hub-devguide-quotas-throttling).|
   | **Device registry namespace** | Select the ADR namespace you created in the previous section.|
   | **User-managed identity** | Select the user-assigned managed identity you associated to the ADR namespace and link it to your IoT hub.  |
 
   :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-gen-2-basics.png" alt-text="Screen capture that shows how to create an IoT hub in the Azure portal.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

### Configure the networking, management, and add-ons settings

After you complete the **Basics** tab, configure your IoT hub by following these steps:

1. Select **Next: Networking** to continue creating your hub.
1. On the **Networking** tab, complete the fields as follows:

   | Property | Value |
   | ----- | ----- |
   | **Connectivity configuration** | Choose the endpoints that devices can use to connect to your IoT hub. Accept the default setting, **Public access**, for this example. You can change this setting after the IoT hub is created. For more information, see [IoT Hub endpoints](/azure/iot-hub/iot-hub-devguide-endpoints). |
   | **Minimum TLS Version** | Select the minimum [TLS version](/azure/iot-hub/iot-hub-tls-support#tls-12-enforcement-available-in-select-regions) supported by your IoT hub. Once the IoT hub is created, you can't change this value. Accept the default setting, **1.2**, for this example. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-network-screen.png" alt-text="Screen capture that shows how to choose the endpoints that can connect to a new IoT hub.":::

1. Select **Next: Management** to continue creating your hub.
1. On the **Management** tab, accept the default settings. If desired, you can modify any of the following fields:

   | Property | Value |
   | ----- | ----- |
   | **Permission model** | Part of role-based access control, this property decides how you *manage access* to your IoT hub. Allow shared access policies or choose only role-based access control. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac). |
   | **Assign me** | You might need access to IoT Hub data APIs to manage elements within an instance. If you have access to role assignments, select **IoT Hub Data Contributor role** to grant yourself full access to the data APIs.<br><br>To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner). |
   | **Device-to-cloud partitions** | This property relates the device-to-cloud messages to the number of simultaneous readers of the messages. Most IoT hubs need only four partitions. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-management.png" alt-text="Screen capture that shows how to set the role-based access control and scale for a new IoT hub.":::

1. Select **Next: Add-ons** to continue to the next screen.
1. On the **Add-ons** tab, accept the default settings. If desired, you can modify any of the following fields:

   | Property | Value |
   | -------- | ----- |
   | **Enable Device Update for IoT Hub** | Turn on Device Update for IoT Hub to enable over-the-air updates for your devices. If you select this option, you're prompted to provide information to provision a Device Update for IoT Hub account and instance. For more information, see [What is Device Update for IoT Hub?](/azure/iot-hub-device-update/understand-device-update) |
   | **Enable Defender for IoT** | Turn Defender for IoT on to add an extra layer of protection to IoT and your devices. This option isn't available for hubs in the free tier. For more information, see [Security recommendations for IoT Hub](/azure/defender-for-iot/device-builders/concept-recommendations) in [Microsoft Defender for IoT](/azure/defender-for-iot/device-builders) documentation. |

   :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-add-ons.png" alt-text="Screen capture that shows how to set the optional add-ons for a new IoT hub.":::

   > [!NOTE]
   > Prices shown are for example purposes only.

1. Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. In this article, you don't add any tags. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources).

    :::image type="content" source="./media/iot-hub-include-create-hub/iot-hub-create-tags.png" alt-text="Screen capture that shows how to assign tags for a new IoT hub.":::

1. Select **Next: Review + create** to review your choices.
1. Select **Create** to start the deployment of your new hub. Your deployment might progress for a few minutes while the hub is being created. Once the deployment is complete, select **Go to resource** to open the new hub.

### Link your user-assigned managed identity to the IoT hub

After you create your IoT hub, you need to associate your user-assigned managed identity with the hub. This step enables the IoT hub to use the managed identity for secure access to other Azure resources, such as the ADR namespace.

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub resource.
1. In the left pane, under **Security settings**, select **Identity**.
1. At the top of the **Identity** pane, select the **User-assigned** tab.
1. Select **Associate**.
1. Choose the user-assigned managed identity you used with your namespace and select **Add**.

### Assign roles to the ADR namespace principal ID on your IoT hub

To enable secure integration between your IoT hub and ADR namespace,  assign roles to the ADR namespace principal ID on your IoT hub instance. This step ensures the ADR namespace can manage device identities and registry operations in your hub.

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub resource.
1. In the left pane, select **Access control (IAM)**.
1. Select **+ Add** > **Add role assignment**.
1. In the **Role** field, select the **Privileged administrator roles** tab.
1. Search for and select **Contributor**.
1. Select **Next**.
1. Select **Select members**, then paste in the ADR namespace principal ID you copied in a previous step. Select the matching identity.
1. Select **Review + assign** to finish.

Repeat these steps to assign the **IoT Hub Registry Contributor** role:

1. Select **+ Add** > **Add role assignment** again.
1. In the **Role** field, search for and select **IoT Hub Registry Contributor**.
1. Select **Next**.
1. In **Assign access to**, choose **Managed identity**.
1. Select **Select members**, then paste in the ADR namespace principal ID you copied in a previous step. Select the matching identity.
1. Select **Review + assign** to finish.

## Create a DPS instance

After you create your IoT hub and your namespace, create a new DPS instance.

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Provisioning Service**.
1. In **Device Provisioning Services**, select **+ Create** to create a new DPS instance.
1. On the **Basics** tab, complete the fields as follows:

    |Property|Value|
    |-----|-----|
    |**Subscription**|Select the subscription to use for your Device Provisioning Service instance.|
    |**Resource group**|Select the same resource group that contains the IoT hub that you created in the previous steps. By putting all related resources in a group together, you can manage them together.|
    |**Name**|Provide a unique name for your new Device Provisioning Service instance. If the name you enter is available, a green check mark appears.|
    |**Region**|Select the same region where you created your IoT hub and ADR namespace in the previous steps.|

    :::image type="content" source="../articles/iot-hub/media/device-registry/iot-hub-link-namespace.png" alt-text="Screenshot of the basics tab for a new Device Provisioning Service instance with the Azure Device Registry namespace selected." lightbox="../articles/iot-hub/media/device-registry/iot-hub-link-namespace.png":::

1. Select **Review + create** to validate your provisioning service.
1. Select **Create** to start the deployment of your Device Provisioning Service instance.
1. After the deployment completes, select **Go to resource** to view your Device Provisioning Service instance.

### Add your namespace to DPS

After you create your DPS instance, link it to your ADR namespace so devices can be provisioned using ADR credential policies.

1. In the  [Azure portal](https://portal.azure.com), go to the DPS instance you just created.
1. On the Overview page, find the **ADR namespace** section.
1. Select the link to add the namespace.

   :::image type="content" source="../articles/iot-hub/media/device-registry/add-namespace-iot-hub.png" alt-text="Screenshot of the IoT hub overview page with the ADR namespace section selected." lightbox="../articles/iot-hub/media/device-registry/add-namespace-iot-hub.png":::

1. Select your ADR namespace and the user-assigned managed identity.
1. Select **Save**.

After the link is established, your DPS instance can use the ADR namespace for device provisioning and certificate management.

## Link the IoT hub and your Device Provisioning Service instance

Add a configuration to the DPS instance that sets the IoT hub to which the instance provisions IoT devices.

1. In the **Settings** menu of your DPS instance, select **Linked IoT hubs**.
1. Select **Add**.
1. On the **Add link to IoT hub** panel, provide the following information: 

    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription containing the IoT hub that you want to link with your new Device Provisioning Service instance. |
    | **IoT hub** | Select the IoT hub to link with your new Device Provisioning System instance. |
    | **Access Policy** | Select **iothubowner (RegistryWrite, ServiceConnect, DeviceConnect)** as the credentials for establishing the link with the IoT hub. |

    :::image type="content" source="../articles/iot-hub/media/device-registry/device-provision-link-iot-hub.png" alt-text="Screenshot showing how to link an IoT hub to the Device Provisioning Service instance in the portal."::: 

1. Select **Save**.
1. Select **Refresh**. You should now see the selected hub under the list of **Linked IoT hubs**.

## Sync policies to IoT hubs

Synchronize a policy you created within your ADR namespace to the IoT hub linked to that namespace. This synchronization enables IoT Hub to trust any devices authenticating with a leaf certificate issued by the policy's issuing CA (ICA).

1. In the [Azure portal](https://portal.azure.com), go to the ADR namespace resource you created earlier.
1. In the left pane, select **Namespace resources** > **Credential policies (Preview)**.
1. In the list, select the credential policy you want to synchronize.
1. At the top, select **Sync all**.
1. Wait for the confirmation message that indicates the synchronization succeeded.

If you select to sync more than one policy, the process syncs policies to their respective IoT hubs. You can't undo a sync operation.

## Create an enrollment group and assign a policy

To provision devices with leaf certificates, you need to create an enrollment group and assign the policy you created within your ADR namespace. The allocation-policy defines the onboarding authentication mechanism DPS uses before issuing a leaf certificate. The default attestation mechanism is a symmetric key.

1. In the [Azure portal](https://portal.azure.com), search for and select **Device Provisioning Services**.
1. Search for and select the DPS instance you created previously.
1. In the **Settings** menu of your DPS instance, select **Manage enrollments**.
1. In the **Manage enrollments** page, select either the **Enrollment groups** or **Individual enrollments** tab based on your provisioning needs.
1. Select **+ Add enrollment group** or **+ Add individual enrollment** to create a new enrollment.
1. In the **Registration + provisioning** page, complete the fields as follows:
    
    | Property | Value |    
    | -------- | ----- |
    | **Attestation mechanism** | Select **X.509 intermediate certificate** as the attestation method. |
    | **X.509 certificate settings** | Upload the intermediate certificate files. Enrollments have one or two certificates, known as primary and secondary certificate files. |
    | **Group name** | Enter a name for your enrollment group. Skip this field if you're creating an individual enrollment. |
    | **Provisioning status** | Select **Enabled** to enable the enrollment from provisioning. |
    | **Reprovision policy** | Specify the reprovisioning policy for the enrollment. This policy determines how the enrollment behaves during device reprovisioning. |

1. Select and complete **IoT hubs** and **Device settings** tabs as appropriate for your environment.
1. Select the **Credential policies (Preview)** tab and the **Policy** you want to assign to the enrollment group or individual enrollment.

    :::image type="content" source="../articles/iot-hub/media/device-registry/add-enrollment-group-policy.png" alt-text="Screenshot of Azure Device Registry assigning a policy to an enrollment group in the Azure portal." lightbox="../articles/iot-hub/media/device-registry/add-enrollment-group-policy.png":::

1. Select **Review + create** and **Create** to finalize the enrollment.

