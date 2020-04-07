---
title: Business continuity plan - QnA Maker
description: The primary objective of the business continuity plan is to create a resilient knowledge base endpoint, which would ensure no down time for the Bot or the application consuming it.
ms.topic: conceptual
ms.date: 04/07/2020
---

# Create a business continuity plan for your QnA Maker service

The primary objective of the business continuity plan is to create a resilient knowledge base endpoint, which would ensure no down time for the Bot or the application consuming it.

## Business continuity with traffic manager

![QnA Maker bcp plan](../media/qnamaker-how-to-bcp-plan/qnamaker-bcp-plan.png)

The high-level idea as represented above is as follows:

1. Set up two parallel [QnA Maker services](set-up-qnamaker-service-azure.md) in [Azure paired regions](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

2. [Backup](../../../app-service/manage-backup.md) your primary QnA Maker App service and [restore](../../../app-service/web-sites-restore.md) it in the secondary setup. This will ensure that both setups work with the same hostname and keys.

3. Keep the primary and secondary Azure search indexes in sync. Use the GitHub sample [here](https://github.com/pchoudhari/QnAMakerBackupRestore) to see how to backup-restore Azure indexes.

4. Back up the Application Insights using [continuous export](../../../application-insights/app-insights-export-telemetry.md).

5. Once the primary and secondary stacks have been set up, use [traffic manager](../../../traffic-manager/traffic-manager-overview.md) to configure the two endpoints and set up a routing method.

6. You would need to create a Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), certificate for your traffic manager endpoint. [Bind the TLS/SSL certificate](../../../app-service/configure-ssl-bindings.md) in your App services.

7. Finally, use the traffic manager endpoint in your Bot or App.

## Next steps

> [!div class="nextstepaction"]
> [Choose capacity](./improve-knowledge-base.md)