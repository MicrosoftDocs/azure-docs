---
ms.service: resource-graph
ms.topic: include
ms.date: 11/15/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### List upcoming contacts

This query helps customers track all the upcoming contacts sorted by reservation start time.

```kusto
OrbitalResources
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now()
| sort by todatetime(properties.reservationStartTime)
| extend Contact_Profile = tostring(split(properties.contactProfile.id, "/")[-1])
| extend Spacecraft = tostring(split(id, "/")[-3])
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Status=properties.status, Provisioning_Status=properties.provisioningState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now() | sort by todatetime(properties.reservationStartTime) | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now() | sort by todatetime(properties.reservationStartTime) | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28%29%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28%29%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28%29%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.cn</a>

---

### List past 'x' days contacts on specified ground station

This query helps customers track all the past `x` days contacts sorted by reservation start time for a specified ground station. The function `now(-1d)` specifies the number of past days.

```kusto
OrbitalResources
| where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now(-1d) and properties.groundStationName == 'Microsoft_Gavle'
| sort by todatetime(properties.reservationStartTime)
| extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1])
| extend Spacecraft = tostring(split(id, '/')[-3])
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now(-1d) and properties.groundStationName == 'Microsoft_Gavle' | sort by todatetime(properties.reservationStartTime) | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' and todatetime(properties.reservationStartTime) >= now(-1d) and properties.groundStationName == 'Microsoft_Gavle' | sort by todatetime(properties.reservationStartTime) | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20properties.groundStationName%20%3D%3D%20%27Microsoft_Gavle%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20properties.groundStationName%20%3D%3D%20%27Microsoft_Gavle%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%20and%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20properties.groundStationName%20%3D%3D%20%27Microsoft_Gavle%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.cn</a>

---

### List past 'x' days contacts on specified contact profile

This query helps customers track all the past `x` days contacts sorted by reservation start time for a specified contact profile. The function `now(-1d)` specifies the number of past days.

```kusto
OrbitalResources
| where type == 'microsoft.orbital/spacecrafts/contacts'
| extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1])
| where todatetime(properties.reservationStartTime) >= now(-1d) and Contact_Profile == 'test-CP'
| sort by todatetime(properties.reservationStartTime)
| extend Spacecraft = tostring(split(id, '/')[-3])
| project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | where todatetime(properties.reservationStartTime) >= now(-1d) and Contact_Profile == 'test-CP' | sort by todatetime(properties.reservationStartTime) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "OrbitalResources | where type == 'microsoft.orbital/spacecrafts/contacts' | extend Contact_Profile = tostring(split(properties.contactProfile.id, '/')[-1]) | where todatetime(properties.reservationStartTime) >= now(-1d) and Contact_Profile == 'test-CP' | sort by todatetime(properties.reservationStartTime) | extend Spacecraft = tostring(split(id, '/')[-3]) | project Contact = tostring(name), Groundstation = tostring(properties.groundStationName), Spacecraft, Contact_Profile, Reservation_Start_Time = todatetime(properties.reservationStartTime), Reservation_End_Time = todatetime(properties.reservationEndTime), Status=properties.status, Provisioning_Status=properties.provisioningState"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20where%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20Contact_Profile%20%3D%3D%20%27test-CP%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20where%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20Contact_Profile%20%3D%3D%20%27test-CP%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/OrbitalResources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.orbital%2Fspacecrafts%2Fcontacts%27%0D%0A%7C%20extend%20Contact_Profile%20%3D%20tostring%28split%28properties.contactProfile.id%2C%20%27%2F%27%29%5B-1%5D%29%0D%0A%7C%20where%20todatetime%28properties.reservationStartTime%29%20%3E%3D%20now%28-1d%29%20and%20Contact_Profile%20%3D%3D%20%27test-CP%27%0D%0A%7C%20sort%20by%20todatetime%28properties.reservationStartTime%29%0D%0A%7C%20extend%20Spacecraft%20%3D%20tostring%28split%28id%2C%20%27%2F%27%29%5B-3%5D%29%0D%0A%7C%20project%20Contact%20%3D%20tostring%28name%29%2C%20Groundstation%20%3D%20tostring%28properties.groundStationName%29%2C%20Spacecraft%2C%20Contact_Profile%2C%20Reservation_Start_Time%20%3D%20todatetime%28properties.reservationStartTime%29%2C%20Reservation_End_Time%20%3D%20todatetime%28properties.reservationEndTime%29%2C%20Status%3Dproperties.status%2C%20Provisioning_Status%3Dproperties.provisioningState" target="_blank">portal.azure.cn</a>

---
