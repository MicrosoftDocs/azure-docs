---
title: Update from legacy Defender for IoT OT monitoring software versions
description: Learn how to update (upgrade) from legacy Defender for IoT software on OT sensors and on-premises management servers.
ms.date: 02/14/2023
ms.topic: upgrade-and-migration-article
---


# Update legacy OT sensors

This section describes how to handle updates from legacy sensor versions, earlier than [version 22.x](release-notes.md#versions-221x).

If you have earlier sensor versions installed on cloud-connected sensors, you may also have your  cloud connection configured using the legacy IoT Hub method. If so, migrate to a new [cloud-connection method](architecture-connections.md), either [connecting directly](ot-deploy/provision-cloud-management.md) or using a [proxy](connect-sensors.md).

## Update legacy OT sensor software

Updating to version 22.x from an earlier version essentially onboards a new OT sensor, with all of the details from the legacy sensor.

After the update, the newly onboarded, updated sensor requires a new activation file. We also recommend that you remove any resources left from your legacy sensor, such as deleting the sensor from Defender for IoT, and any private IoT Hubs that you'd used.

For more information, see [Versioning and support for on-premises software versions](release-notes.md#versioning-and-support-for-on-premises-software-versions).

**To update a legacy OT sensor version**

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** and then select the legacy OT sensor you want to update.

1. Select the **Prepare to update to 22.X** option from the toolbar or from the options (**...**) from the sensor row.

1. <a name="activation-file"></a>In the **Prepare to update sensor to version 22.X** message, select **Let's go**.

    A new row is added on the **Sites and sensors** page, representing the newly updated OT sensor. In that row, select to download the activation file.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

    The status for the new OT sensor switches to **Pending activation**.

1. Sign into your OT sensor and select **System settings > Sensor management > Subscription & Mode Activation**.

1. In the **Subscription & Mode Activation** pane, select **Select file**, and then browse to and select the activation file you'd downloaded [earlier](#activation-file).

    Monitor the activation status on the **Sites and sensors** page. When the OT sensor is fully activated:

    - The sensor status and health on the **Sites and sensors** page is updated with the new software version.
    - On the OT sensor, the **Overview** page shows an activation status of **Valid**.

1. After you've applied your new activation file, make sure to [delete the legacy sensor](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal). On the **Sites and sensors** page, select your legacy sensor, and then from the options (**...**) menu for that sensor, select **Delete sensor**.

1. (Optional) After updating from a legacy OT sensor version, you may have leftover IoT Hubs that are no longer in use. In such cases:

    1. Review your IoT hubs to ensure that they're not being used by other services.
    1. Verify that your sensors are connected successfully.
    1. Delete any private IoT Hubs that are no longer needed.

    For more information, see the [IoT Hub documentation](../../iot-hub/iot-hub-create-through-portal.md).

## Migrate a cloud connection from the legacy method

If you're an existing customer with a production deployment and sensors connected using the legacy IoT Hub method to connect your OT sensors to Azure, use the following steps to ensure a full and safe migration to the updated connection method.

1. **Review your existing production deployment** and how sensors are currently connected to Azure. Confirm that the sensors in production networks can reach the Azure data center resource ranges.

1. **Determine which connection method is right** for each production site. For more information, see [Choose a sensor connection method](architecture-connections.md#choose-a-sensor-connection-method).

1. **Configure any other resources required**, such as a proxy, VPN, or ExpressRoute. For more information, see [Configure proxy settings on an OT sensor](connect-sensors.md).

    For any connectivity resources outside of Defender for IoT, such as a VPN or proxy, consult with Microsoft solution architects to ensure correct configurations, security, and high availability.

1. **If you have legacy sensor versions installed**, we recommend that you [update your sensors](#update-legacy-ot-sensors) at least to a version 22.1.x or higher. In this case, make sure that you've [updated your firewall rules](ot-deploy/provision-cloud-management.md) and activated your sensor with a new activation file.

    Sign in to each sensor after the update to verify that the activation file was applied successfully. Also check the Defender for IoT **Sites and sensors** page in the Azure portal to make sure that the updated sensors show as **Connected**.

1. **Start migrating with a test lab or reference project** where you can validate your connection and fix any issues found.

1. **Create a plan of action for your migration**, including planning any maintenance windows needed.

1. **After the migration in your production environment**, you can delete any previous IoT Hubs that you had used before the migration. Make sure that any IoT Hubs you delete aren't used by any other services:

    - If you've upgraded your versions, make sure that all updated sensors indicate software version 22.1.x or higher.

    - Check the active resources in your account and make sure there are no other services connected to your IoT Hub.

    - If you're running a hybrid environment with multiple sensor versions, make sure any sensors with software version 22.1.x can connect to Azure.

        Use firewall rules that allow outbound HTTPS traffic on port 443 to each of the required endpoints. For more information, see [Provision OT sensors for cloud management](ot-deploy/provision-cloud-management.md).

While you'll need to migrate your connections before the [legacy version reaches end of support](release-notes.md#versioning-and-support-for-on-premises-software-versions), you can currently deploy a hybrid network of sensors, including legacy software versions with their IoT Hub connections, and sensors with updated connection methods.

## Next steps

For more information, see:

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage individual OT sensors](how-to-manage-individual-sensors.md)
- [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md)
- [Troubleshoot the sensor](how-to-troubleshoot-sensor.md)
- [Troubleshoot the on-premises management console](how-to-troubleshoot-on-premises-management-console.md)
