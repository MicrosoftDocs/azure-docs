<<<<<<< HEAD
param communityName string
param enclaveName string
param endpointName string
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
// param customCidrRange string = ''
param numberOfEnclaves int = 2

@description('determines what stage to deploy')
param stage int = 6
@description('Allowed values: Gateway or ExpressRoute')
param transitOptionType string = 'Gateway'
param scaleUnits int = 2
param transitHubName string = 'transit-hub-1'
param remoteVirtualNetworkId string = ''
param location string = resourceGroup().location
param connectionNameBase string = take('a${uniqueString(resourceGroup().id,deployment().name)}', 10)
@description('Enable/Disable usage telemetry for this template.')
param enableTelemetry bool = true

// var workloadProperties = {
//   managedResourceGroupConfiguration: {
//     name: '${communityName}-wl'
//     location: location
//   }
// }

#disable-next-line no-deployments-resources
resource aveTelemetry 'Microsoft.Resources/deployments@2024-03-01' = if (enableTelemetry) {
  name: take(
    'virtualenclaves.ave-nightly.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
    64
  )
  properties: {
    mode: 'Incremental'
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      resources: []
      outputs: {
        telemetry: {
          type: 'String'
          value: 'For more information, see https://aka.ms/avm/TelemetryInfo'
        }
      }
    }
  }
}

resource community 'Microsoft.Mission/communities@2024-06-01-preview' = if (stage >= 1) {
  name: '${communityName}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    addressSpace: addressSpace
    dnsServers: dnsServers
  }
}

resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-06-01-preview' = if (stage >= 6) {
  parent: community
  name: '${transitHubName}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    transitOption: {
      type: transitOptionType
      params: (((transitOptionType == 'Gateway') || (transitOptionType == 'ExpressRoute'))
        ? json('{ "scaleUnits": ${scaleUnits} }')
        : json('{ "remoteVirtualNetworkId": "${remoteVirtualNetworkId}" }'))
    }
  }
}

resource communityName_example 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 6) {
  parent: community
  name: 'example'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'example-dataplane'
        destinationType: 'PrivateNetwork'
        destination: '172.16.0.0/20'
        protocols: [
          'TCP'
          'UDP'
        ]
        port: '443,80,3389,53'
        transitHubResourceId: communityName_transitHub.id
      }
      {
        name: 'example-vpaw'
        destinationType: 'PrivateNetwork'
        destination: '172.16.40.0/23'
        protocols: [
          'TCP'
          'UDP'
        ]
        port: '443,80,3389'
        transitHubResourceId: communityName_transitHub.id
      }
    ]
  }
  dependsOn: [
    enclaveNames
  ]
}

resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 1) {
  name: 'bing-outlook-${uniqueNumber}'
  parent: community
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'bing'
        destinationType: 'FQDN'
        destination: 'bing.com, *.bing.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'outlook'
        destinationType: 'FQDN'
        destination: 'outlook.com, *.outlook.com, *outlook.live.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
    ]
  }
}

resource enclaveNames 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = [
  for i in range(0, numberOfEnclaves): if (stage >= 2) {
    name: '${enclaveName}-${uniqueNumber}-${(i+1)}'
    location: location
    tags: {
      department: 'MyDepartment'
    company: 'MyCompany'
    }
    properties: {
      communityResourceId: community.id
      enclaveVirtualNetwork: {
        networkSize: networkSize
        subnetConfigurations: [
          {
            name: 'AzureVirtualEnclaveSubnet'
            networkPrefixSize: 23
          }
        ]
        allowSubnetCommunication: true
      }
      enclaveDefaultSettings: {
        diagnosticDestination: 'Both'
      }
    }
  }
]

resource enclaveNames_communityName_wl 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 3) {
  name: '${enclaveName}-${uniqueNumber}-1/wl-${communityName}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  dependsOn: [
    enclaveNames
  ]
}

resource enclaveNames_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-06-01-preview' = if (stage >= 4) {
  name: '${enclaveName}-${uniqueNumber}-1/${endpointName}-1-v2'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'ADDS-TCP'
        destination: ((stage >= 4)
          ? cidrSubnet(
              enclaveNames[0].properties.enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
            // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
            // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
          : null)
        port: '53,88,135,138,139,389,445,464,636,686,3268-3269,5722,9389,49152-65535'
        protocols: [
          'TCP'
        ]
      }
      {
        name: 'ADDS-UDP'
        destination: ((stage >= 4)
          ? cidrSubnet(
            enclaveNames[0].properties.enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
  dependsOn: [
    enclaveNames
  ]
}

resource example_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'example-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: resourceId('Microsoft.Mission/virtualenclaves', '${enclaveName}-${uniqueNumber}-2')
    sourceCidr: ((stage >= 6)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: communityName_example.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource msft_sites_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'msft-sites-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: resourceId('Microsoft.Mission/virtualenclaves', '${enclaveName}-${uniqueNumber}-2')
    sourceCidr: ((stage >= 5)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource int_adds_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'int-adds-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveNames[1].id
    sourceCidr: ((stage >= 5)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: enclaveNames_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource example_in_adds_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'example-in-adds${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: communityName_transitHub.id
    sourceCidr: '172.16.18.0/24'
    destinationEndpointId: enclaveNames_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveNames
  ]
}
=======
param communityName string
param enclaveName string
param endpointName string
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
// param customCidrRange string = ''
param numberOfEnclaves int = 2

@description('determines what stage to deploy')
param stage int = 6
@description('Allowed values: Gateway or ExpressRoute')
param transitOptionType string = 'Gateway'
param scaleUnits int = 2
param transitHubName string = 'transit-hub-1'
param remoteVirtualNetworkId string = ''
param location string = resourceGroup().location
param connectionNameBase string = take('a${uniqueString(resourceGroup().id,deployment().name)}', 10)
@description('Enable/Disable usage telemetry for this template.')
param enableTelemetry bool = true

// var workloadProperties = {
//   managedResourceGroupConfiguration: {
//     name: '${communityName}-wl'
//     location: location
//   }
// }

#disable-next-line no-deployments-resources
resource aveTelemetry 'Microsoft.Resources/deployments@2024-03-01' = if (enableTelemetry) {
  name: take(
    'virtualenclaves.ave-nightly.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
    64
  )
  properties: {
    mode: 'Incremental'
    template: {
      '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#'
      contentVersion: '1.0.0.0'
      resources: []
      outputs: {
        telemetry: {
          type: 'String'
          value: 'For more information, see https://aka.ms/avm/TelemetryInfo'
        }
      }
    }
  }
}

resource community 'Microsoft.Mission/communities@2024-06-01-preview' = if (stage >= 1) {
  name: '${communityName}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    addressSpace: addressSpace
    dnsServers: dnsServers
  }
}

resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-06-01-preview' = if (stage >= 6) {
  parent: community
  name: '${transitHubName}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    transitOption: {
      type: transitOptionType
      params: (((transitOptionType == 'Gateway') || (transitOptionType == 'ExpressRoute'))
        ? json('{ "scaleUnits": ${scaleUnits} }')
        : json('{ "remoteVirtualNetworkId": "${remoteVirtualNetworkId}" }'))
    }
  }
}

resource communityName_example 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 6) {
  parent: community
  name: 'example'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'example-dataplane'
        destinationType: 'PrivateNetwork'
        destination: '172.16.0.0/20'
        protocols: [
          'TCP'
          'UDP'
        ]
        port: '443,80,3389,53'
        transitHubResourceId: communityName_transitHub.id
      }
      {
        name: 'example-vpaw'
        destinationType: 'PrivateNetwork'
        destination: '172.16.40.0/23'
        protocols: [
          'TCP'
          'UDP'
        ]
        port: '443,80,3389'
        transitHubResourceId: communityName_transitHub.id
      }
    ]
  }
  dependsOn: [
    enclaveNames
  ]
}

resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 1) {
  name: 'bing-outlook-${uniqueNumber}'
  parent: community
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'bing'
        destinationType: 'FQDN'
        destination: 'bing.com, *.bing.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'outlook'
        destinationType: 'FQDN'
        destination: 'outlook.com, *.outlook.com, *outlook.live.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
    ]
  }
}

resource enclaveNames 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = [
  for i in range(0, numberOfEnclaves): if (stage >= 2) {
    name: '${enclaveName}-${uniqueNumber}-${(i+1)}'
    location: location
    tags: {
      department: 'MyDepartment'
    company: 'MyCompany'
    }
    properties: {
      communityResourceId: community.id
      enclaveVirtualNetwork: {
        networkSize: networkSize
        subnetConfigurations: [
          {
            name: 'AzureVirtualEnclaveSubnet'
            networkPrefixSize: 23
          }
        ]
        allowSubnetCommunication: true
      }
      enclaveDefaultSettings: {
        diagnosticDestination: 'Both'
      }
    }
  }
]

resource enclaveNames_communityName_wl 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 3) {
  name: '${enclaveName}-${uniqueNumber}-1/wl-${communityName}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  dependsOn: [
    enclaveNames
  ]
}

resource enclaveNames_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-06-01-preview' = if (stage >= 4) {
  name: '${enclaveName}-${uniqueNumber}-1/${endpointName}-1-v2'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    ruleCollection: [
      {
        name: 'ADDS-TCP'
        destination: ((stage >= 4)
          ? cidrSubnet(
              enclaveNames[0].properties.enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
            // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
            // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
          : null)
        port: '53,88,135,138,139,389,445,464,636,686,3268-3269,5722,9389,49152-65535'
        protocols: [
          'TCP'
        ]
      }
      {
        name: 'ADDS-UDP'
        destination: ((stage >= 4)
          ? cidrSubnet(
            enclaveNames[0].properties.enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
  dependsOn: [
    enclaveNames
  ]
}

resource example_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'example-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: resourceId('Microsoft.Mission/virtualenclaves', '${enclaveName}-${uniqueNumber}-2')
    sourceCidr: ((stage >= 6)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: communityName_example.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource msft_sites_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'msft-sites-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: resourceId('Microsoft.Mission/virtualenclaves', '${enclaveName}-${uniqueNumber}-2')
    sourceCidr: ((stage >= 5)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource int_adds_enc_con_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'int-adds-enc-con${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveNames[1].id
    sourceCidr: ((stage >= 5)
      ? enclaveNames[1].properties.enclaveAddressSpaces.enclaveAddressSpace
      // ? filter(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      // ? join(map(enclaveSubKtr.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.addressPrefix), ',')
      : null)
    destinationEndpointId: enclaveNames_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveNames
  ]
}

resource example_in_adds_connectionNameBase 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'example-in-adds${connectionNameBase}-${uniqueNumber}'
  location: location
  tags: {
    department: 'MyDepartment'
    company: 'MyCompany'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: communityName_transitHub.id
    sourceCidr: '172.16.18.0/24'
    destinationEndpointId: enclaveNames_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveNames
  ]
}
>>>>>>> ef719d68becef2a7ef84bda4a3e27ca1ef8df825
