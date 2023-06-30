---
title: Configure Azure service health alerta
description: Explains how to configure Azure service health alerts.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---
# Configure Azure Service Health alerts

You can get automatic notifications when there are planned maintenance events or unplanned
downtime that affects your infrastructure.

Follow these steps to ensure you have Service Health alerts configured:

1. Go to the [Microsoft Azure portal](https://portal.Azure.Com).
2. Search for “service health” in the search bar and select **Service Health** from the results.
3. in the Service Health Dashboard, select **Health Alerts**.
4. Select **Create service health alert**.
5. Deselect **Select all** under **Services**.
6. Select **Azure Large Instances**.
7. Select the regions in which your ALI for Epic instances are deployed.
8. Under **Action Groups**, select **Create New**.
9. Fill in the details and select the type of notification for the Action (Examples: Email, SMS, Voice).
10. Click **OK** to add the Action.
11. Click **OK** to add the Action Group.
12. Verify you see your newly created Action Group.
You will now receive alerts when there are health issues or maintenance actions on your systems.

## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure Large Instances?](../../what-is-azure-large-instances.md)


> [!div class="nextstepaction"]
> [What is Azure Large Instances?](../../what-is-azure-large-instances.md)