---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
After you create the availability group listener, it might be necessary to adjust the RegisterAllProvidersIP and HostRecordTTL cluster parameters for the listener resource. These parameters can reduce reconnection time after a failover, which might prevent connection timeouts. For more information about these parameters, as well as sample code, see [Create or configure an availability group listener](https://msdn.microsoft.com/library/hh213080.aspx#MultiSubnetFailover).

