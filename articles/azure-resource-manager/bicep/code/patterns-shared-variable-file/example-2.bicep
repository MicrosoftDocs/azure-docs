param location string = resourceGroup().location

var nsgName = 'MyNSG'

var sharedRules = json(loadTextContent('./shared-rules.json')).securityRules
var customRules = [
  {
    name: 'Allow_Internet_HTTPS_Inbound'
    properties: {
      description: 'Allow inbound internet connectivity for HTTPS only.'
      protocol: 'Tcp'
      sourcePortRange: '*'
      destinationPortRange: '443'
      sourceAddressPrefix: 'Internet'
      destinationAddressPrefix: 'VirtualNetwork'
      access: 'Allow'
      priority: 400
      direction: 'Inbound'
    }
  }
]

resource nsg 'Microsoft.Network/networkSecurityGroups@2020-05-01' = {
  name: nsgName
  location: location
  properties: {
    securityRules: concat(sharedRules, customRules)
  }
}
