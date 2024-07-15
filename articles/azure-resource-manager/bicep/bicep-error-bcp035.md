---
title: BCP035
description: Error - The specified <data-type> declaration is missing the following required properties.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 06/28/2024
---

# Bicep warning and error code - BCP035

This warning occurs when your resource definition is missing a required property.

## Warning description

`The specified <date-type> declaration is missing the following required properties: <name-of-the-property.`

## Solution

Add the missing property to the resource definition.

## Examples

The following example raises the warning for **virtualNetworkGateway1** and **virtualNetworkGateway2**:

```bicep
var networkConnectionName = 'testConnection'
var location = 'eastus'
var vnetGwAId = 'gatewayA'
var vnetGwBId = 'gatewayB'

resource networkConnection 'Microsoft.Network/connections@2023-11-01' = {
  name: networkConnectionName
  location: location
  properties: {
    virtualNetworkGateway1: {
      id: vnetGwAId
    }
    virtualNetworkGateway2: {
      id: vnetGwBId
    }

    connectionType: 'Vnet2Vnet' 
  }
}
```

The warning is:

```warning
The specified "object" declaration is missing the following required properties: "properties". If this is an inaccuracy in the documentation, please report it to the Bicep Team.
```

You can verify the missing properties from the [template reference](/azure/templates). If you see the warning from Visual Studio Code, hover the cursor over the resource symbolic name and select **View document** to open the template reference.

You can fix the error by adding the missing properties:

```bicep
var networkConnectionName = 'testConnection'
var location = 'eastus'
var vnetGwAId = 'gatewayA'
var vnetGwBId = 'gatewayB'

resource networkConnection 'Microsoft.Network/connections@2023-11-01' = {
  name: networkConnectionName
  location: location
  properties: {
    virtualNetworkGateway1: {
      id: vnetGwAId
      properties:{}
    }
    virtualNetworkGateway2: {
      id: vnetGwBId
      properties:{}
    }

    connectionType: 'Vnet2Vnet' 
  }
}
```

## Next steps

For more information about Bicep warning and error codes, see [Bicep warnings and errors](./bicep-error-codes.md).
