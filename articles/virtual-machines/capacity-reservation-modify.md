---
title: Modifying a Capacity Reservation in Azure (preview)
description: Learn how to modify a Capacity Reservation.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Modifying a Capacity Reservation 

## Update the number of instances reserved 

First you must update the number of instances reserved. 

### [API](#tab/api)

```rest
    PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
    ``` 
    
In the request body, update the `capacity` property to the new count that you want to reserve: 
    
```json
{ 
    "capacity": 5,
} 
```

Please note that `capacity` property is set to 5 now. 

```json
{ 
    "location":"eastus",
    "zones": ["1", "2", "3"] 
} 
```

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

### [Portal](#tab/portal)

<!-- insert portal steps here, no pictures if it's straightforward --> 

1. Open the [portal](https://portal.azure.com).
1. In the search bar, type **<name_of_feature>**.
1. Select **<name_of_feature>**.
1. In the left menu under **Settings**, select **<something>**.
1. In the **<something>** page, select **<something>**.

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


<!-- SEE DOC FOR MORE TEXT HERE -->


## Next steps

> [!div class="nextstepaction"]
> [Learn about adding code to articles](availability.md)