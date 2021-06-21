---
title: Disaster recovery for Azure API for FHIR
description: In this article, you'll learn how to enable disaster recovery features for Azure API for FHIR.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/21/2021
ms.author: zxue
---

# Disaster recovery for Azure API for FHIR

The Azure API for FHIR® is a fully managed, standards-based, compliant API for clinical health data that enables you to create new systems of engagement for analytics, machine learning, and actionable intelligence with your health data.

To meet business continuity, disaster recovery, and compliance requirements, you can enable the disaster recovery (DR) feature for Azure API for FHIR. The DR feature provides a Recovery Point Objective (RPO) of 15 minutes and a Recovery Time Objective (RTO) of 60 minutes.  
  
To enable the DR feature, create a one-time support ticket and choose an Azure region where the Azure API for FHIR is supported. 

## Extra data protection

The Azure API for FHIR offers data protection through backups, which can take up to four hours. When the disaster recovery feature is enabled, a secondary data replica is automatically created and synchronized in the secondary Azure region that you can choose. This secondary data replica is a replication of the primary data and used directly to recover the service, thus helping to speed up the recovery process.


:::image type="content" source="media/disaster-recovery/azure-traffic-manager.png" alt-text="Azure Traffic Manager.":::


## Failover in disaster recovery

When an unfortunate disaster strikes, the Azure API for FHIR automatically fails over to the secondary region and the service is expected to resume in one hour or less, and with a potential data loss of less than 15 minutes. No changes are required on the customer side unless Private Link, CMK, IoT, and $export are used or involved. For more information about, see [Configuration changes during disaster recovery](#configuration-changes-during-disaster-recovery).


:::image type="content" source="media/disaster-recovery/failover-in-disaster-recovery.png" alt-text="Failover in disaster recovery.":::


## Failback in disaster recovery


Once the previously impacted region recovers, it becomes automatically available as a secondary region. The computing environment is switched back automatically to the impacted region. The database is switched back through a manually triggered scripting process by the Microsoft support team. In either case, no customer actions are required unless Private Link, CMK, IoT, and $export are used or are involved. For more information about, see  [Configuration changes during disaster recovery](#configuration-changes-during-disaster-recovery).


:::image type="content" source="media/disaster-recovery/failback-in-disaster-recovery.png" alt-text="Failback in disaster recovery.":::


In case when the computing environment is switched back before the database, you may experience network latency. The network latency issue should disappear as soon as the database is switched back.


:::image type="content" source="media/disaster-recovery/network-latency.png" alt-text="Network latency.":::


## Configuration changes during disaster recovery

• Private Link 

• CMK

 Your access to your FHIR server will be maintained if the key vault hosting the managed key is accessible. There's a possible temporary downtime as key vault can take up to 20 minutes to re-establish its connection if there is a regional failover. For more information about, see [Azure Key Vault availability and redundancy](https://docs.microsoft.com/azure/key-vault/general/disaster-recovery-guidance).  

• $export

The job that is running the export will be picked up from another region after 10 minutes without an update to the job status. Follow the guidance for Azure storage for recovering your storage account in the event of a regional outage to allow your FHIR server to access your storage again. For more information about, see [Disaster recovery and storage account failover](https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance). 


• IoT

Any existing connection won't function until the failed region is restored. You can create a new connection once the failover has completed and your FHIR server is accessible. This new connection will continue to function when failback occurs.

## How to test DR

To test the DR feature in a non-production (dev or test) environment, refer to the steps below.

• Prepare a test environment with test data. It's recommended that you use a service instance with small amounts of data to reduce the time to replicate the data.
 
• Create a support ticket and provide your Azure subscription and the service name for the Azure API for FHIR for your test environment.

• Come up with a test plan, as you would with any QA test. 
• Wait for notification from the Microsoft support team that the DR environment is ready for test and the failover has taken place.
  
• Conduct your DR test and record testing results, including any network latencies. 

• For failback test, notify the Microsoft support team to complete failback.
 
• (Optional) Share any feedback with the Microsoft support team.


## Cost of disaster recovery

The disaster recovery feature incurs extra costs as a result of creating and maintaining the data replica and computing environment in the secondary region. For more pricing details, refer to the [Azure API for FHIR pricing]( https://azure.microsoft.com/pricing/details/azure-api-for-fhir) web page.

**Note**: The DR offering is subject to the [SLA for Azure API for FHIR](https://azure.microsoft.com/support/legal/sla/azure-api-for-fhir/v1_0/), 1.0.


## Next steps

In this article, you've learned how to enable DR for Azure API for FHIR and how to test the DR feature in a non-production environment. To learn about Azure API for FHIR's other supported features, see:

>[!div class="nextstepaction"]
>[FHIR supported features](fhir-features-supported.md)