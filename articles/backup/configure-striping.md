---
title: Configure striping for higher backup throughput for SAP ASE databases
description: In this article, you learn how to configure striping for higher backup throughput for SAP ASE databases.
ms.topic: how-to
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Configure striping for higher backup throughput for SAP ASE databases
    
Striping is designed to enhance backup efficiency further by allowing data to be streamed through multiple backup channels simultaneously. This is beneficial for large databases, where the time required to complete a backup can be significant. By distributing the data across multiple stripes, striping significantly reduces backup time, allowing for more efficient use of both storage and network resources. Based on our internal testing we saw 30-40% increase in throughput performance and we highly recommend testing the striping configuration before making changes on production.
  
## How to enable striping
    
During the execution of the preregistration script, you can control the enable-striping parameter by setting it to true or false depending on your need. Additionally, a new configuration parameter, stripesCount, is introduced, which defaults to 4 but can be modified to suit your requirements.
    
## Recommended configuration
    
For databases smaller than 4 TB, we suggest using a stripe count of 4. This configuration provides an optimal balance between performance and resource utilization, ensuring a smooth and efficient backup process.
    
## Changing the stripe count
    
You have two ways to modify the stripe count:
    
- **Pre-registration script**: Run the preregistration script and specify your preferred value using the stripes-count parameter.
    
  >[!Note]
  >This parameter is optional.
    
- **Configuration file**: Manually update the stripesCount value in the configuration file at the following path: */opt/msawb/etc/config/SAPAse/config.json*
    
  For more information, refer to the [official documentation](/azure/sap/workloads/dbms-guide-sapase).
    
  >[!Note]
  >Setting the above ASE parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization, as overutilization can  impact the backup and other ASE operations negatively.
    
## Next steps

