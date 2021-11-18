param location string = resourceGroup().location
param virtualNetworkName string = 'my-vnet'
param virtualNetworkAddressPrefix string = '10.0.0.0/16'
param subnets array = [
  {
    name: 'Web'
    addressPrefix: '10.0.0.0/24'
    allowRdp: false
  }
  {
    name: 'JumpBox'
    addressPrefix: '10.0.1.0/24'
    allowRdp: true
  }
]

var subnetsToCreate = [for item in subnets: {
  name: item.name
  properties: {
    addressPrefix: item.addressPrefix
    networkSecurityGroup: item.allowRdp ? {
       id: nsgAllowRdp.id
    } : null
  }
}]
var nsgAllowRdpName = 'nsg-allow-rdp'

resource nsgAllowRdp 'Microsoft.Network/networkSecurityGroups@2019-11-01' = {
  name: nsgAllowRdpName
  location: location
  properties: {
    securityRules: [
      {
        name: 'allow-rdp'
        properties: {
          description: 'Allow RDP'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '3389'
          sourceAddressPrefix: 'Internet'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: virtualNetworkName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        virtualNetworkAddressPrefix
      ]
    }
    subnets: subnetsToCreate
  }
}
