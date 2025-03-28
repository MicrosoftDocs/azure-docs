<<<<<<< HEAD
// Secure Azure Computing Architecture (SACA)
@description('Name of the community (e.g. cm-ave-demo-template-test1). Also added to the front of community resource names.')
param communityName string = 'cm-saca-hub'
@description('Prefix for the Enclave names (e.g. enc-ave-demo-template-test1)')
param enclaveNamePrefix string = 'enc-saca'
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
// param customCidrRange string = ''

@description('determines what resources to deploy. 6 deploys all resources')
param stage int = 6
@description('Allowed values: Gateway or ExpressRoute')
param transitOptionType string = 'Gateway'
param transitHubName string = 'transit-hub'
@description('Transit Hub scale units')
param scaleUnits int = 2
param remoteVirtualNetworkId string = ''
param location string = resourceGroup().location
@description('Enable/Disable usage telemetry for this template.')
param enableTelemetry bool = true

var uniqueCommunityName = '${communityName}-${uniqueNumber}'
var uniqueEnclaveNamePrefix = '${enclaveNamePrefix}-${uniqueNumber}'

#disable-next-line no-deployments-resources
resource aveTelemetry 'Microsoft.Resources/deployments@2024-03-01' = if (enableTelemetry) {
  name: take(
    'virtualenclaves.ave-saca.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
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

// Community:
resource community 'Microsoft.Mission/communities@2024-06-01-preview' = if (stage >= 1) {
  name: uniqueCommunityName
  location: location
  tags: {
    department: 'CommunityOversightDept'
    company: 'CommunityOversight'
  }
  properties: {
    addressSpace: addressSpace
    dnsServers: dnsServers
  }
}

// Transit Hub:
resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-06-01-preview' = if (stage >= 2) {
  parent: community
  name: transitHubName
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    transitOption: {
      type: transitOptionType
      params: (((transitOptionType == 'Gateway') || (transitOptionType == 'ExpressRoute'))
        ? json('{ scaleUnits: ${scaleUnits} }')
        : json('{ remoteVirtualNetworkId: ${remoteVirtualNetworkId} }'))
    }
  }
}

// Community Endpoint: External
resource communityName_ep_external 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  parent: community
  name: 'external-community-${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'external-community-dataplane'
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
        name: 'external-community-admin-vm'
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
    enclaveIdentity
  ]
}

// Community Endpoint: Bing and Outlook
resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  name: 'bing-outlook-${uniqueNumber}'
  parent: community
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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

// Community Endpoint: Default Portal
resource communityEP_defaultPortal 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  name: 'defaultPortal'
  parent: community
  location: location
  tags: {
    department: 'CommunityOversightDept'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'defaultPortal1'
        destinationType: 'FQDN'
        destination: '*config.edge.skype.com, *msft.sts.microsoft.com, login.microsoftonline.com, *aadcdn.msftauth.net, *aadcdn.msftauthimages.net, *aadcdn.msauthimages.net, *.logincdn.msftauth.net, login.live.com, *.msauth.net, microsoftonline-p.com, *portal.azure.com, *.hosting.portal.azure.net, *.reactblade.portal.azure.net, management.azure.com, *.ext.azure.com, *.graph.windows.net, *.graph.microsoft.com, *reactblade-rc.portal.azure.net, *reactblade.portal.azure.net, *reactblade-ms.portal.azure.net, afd-v2.hosting-ms.portal.azure.net, *microsoft.com, *azure.com, aka.ms'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal2'
        destinationType: 'FQDN'
        destination: '*.asazure.windows.net, *.azconfig.io, *.aad.azure.com, *.aadconnecthealth.azure.com, ad.azure.com, adf.azure.com, api.aadrm.com, api.loganalytics.io, api.azrbac.mspim.azure.com, *.applicationinsights.azure.com, appservice.azure.com, *.arc.azure.net, asazure.windows.net, bastion.azure.com, batch.azure.com, catalogapi.azure.com, catalogartifact.azureedge.net, changeanalysis.azure.com, cognitiveservices.azure.com, config.office.com, cosmos.azure.com, *.database.windows.net, datalake.azure.net, dev.azure.com, dev.azuresynapse.net'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal3'
        destinationType: 'FQDN'
        destination: 'digitaltwins.azure.net, learn.microsoft.com, elm.iga.azure.com, eventhubs.azure.net, functions.azure.com, gallery.azure.com, go.microsoft.com, help.kusto.windows.net, identitygovernance.azure.com, iga.azure.com, informationprotection.azure.com, kusto.windows.net, logic.azure.com, marketplacedataprovider.azure.com, marketplaceemail.azure.com, media.azure.net, monitor.azure.com, mspim.azure.com, network.azure.com, purview.azure.com, quantum.azure.com, rest.media.azure.net, search.azure.com, servicebus.azure.net, servicebus.windows.net, shell.azure.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal4'
        destinationType: 'FQDN'
        destination: 'sphere.azure.net, azure.status.microsoft, storage.azure.com, storage.azure.net, vault.azure.net, *.microsoftonline-p.com, *.live.com, *.microsoftonline.com, *.microsoftonlinesupport.net, pfd.phonefactor.net, pfd2.phonefactor.net, css.phonefactor.net, rc.portal.azure.com, *core.windows.net, *login.microsoftonline.com, *.wvd.microsoft.com, *servicebus.windows.net, go.microsoft.com, aka.ms, learn.microsoft.com, privacy.microsoft.com, query.prod.cms.rt.microsoft.com, packages.microsoft.com, graph.microsoft.com, *.azurewebsites.net, *.access.mcas.ms'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
    ]
  }
}

// Enclaves
// Enclave: Identity (Tier 0)
resource enclaveIdentity 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-identity'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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

// Enclave: Operations (Tier 1)
resource enclaveOperations 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-operations'
  location: location
  tags: {
    department: 'CommunityOpsDept'
    company: 'CommunityOversight'
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
  }
}

// Enclave: Shared Services (Tier 2)
resource enclaveShared 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-shared'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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
  }
}

// Enclave: Mission Workload (Tier 3)
resource enclaveMission 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-mission'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      subnetConfigurations: [
        {
          name: 'AzureVirtualEnclaveSubnet'
          networkPrefixSize: 26
        }
        {
          name: 'appSubnet'
          networkPrefixSize: 26
        }
      ]
      allowSubnetCommunication: true
    }
  }
}

// -------------------Workloads-------------------
// Workload: Identity enclave (Tier 0)
resource wl_enclaveIdentity_adds 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-id-ADDS-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Operations enclave (Tier 1)
resource wl_enclaveOperations_operations 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-operations-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveOperations
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Shared enclave (Tier 2)
resource wl_enclaveShared_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-shared-apps-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveShared
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Mission enclave (Tier 3)
resource wl_enclaveMission_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-mission-apps-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveMission
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
}

// Enclave Endpoint: Identity enclave ADDS 
resource enclaveIdentity_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-06-01-preview' = if (stage >= 4) {
  name: 'ep-ADDS'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'ADDS-TCP'
        destination: ((stage >= 4)
          ? filter(enclaveIdentity.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          : null)
        port: '53,88,135,138,139,389,445,464,636,686,3268-3269,5722,9389,49152-65535'
        protocols: [
          'TCP'
        ]
      }
      {
        name: 'ADDS-UDP'
        destination: ((stage >= 4)
          ? filter(enclaveIdentity.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
}

// Connection: Collaboration enclave to external community endpoint
resource enc_con_collab_to_external 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'enc-con-collab-to-external--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 6)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityName_ep_external.id
  }
}

// -------------------defaultPortal Connections-------------------
// Connection: Collaboration enclave to defaultPortal endpoint
resource enc_con_shared_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Operations enclave to defaultPortal endpoint
resource enc_con_operations_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-oper-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveOperations.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveOperations.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Mission enclave to defaultPortal endpoint
resource enc_con_mission_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-mission-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveMission.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveMission.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'appSubnet')[0].addressPrefix
 
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// -------------------Identity Connections-------------------
// Connection: Shared enclave to Identity enclave ADDS endpoint
resource enc_con_shared_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Operations enclave to Identity enclave ADDS endpoint
resource enc_con_operations_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-oper-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveOperations.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveOperations.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Mission enclave to Identity enclave ADDS endpoint
resource enc_con_mission_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-mission-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveMission.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveMission.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// -------------------Bing & Outlook Connections-------------------
// Connection: Shared enclave to Bing&Outlook community endpoint
resource enc_con_shared_to_cm_ep_bingOutlook 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-cm-ep-bing--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
}

// -------------------Transit Hub Connections-------------------
// Connection: Transithub to Identity enclave ADDS endpoint
resource enc_con_external_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'enc-con-external-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: communityName_transitHub.id
    sourceCidr: '172.16.18.0/24'
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveIdentity
  ]
}
=======
// Secure Azure Computing Architecture (SACA)
@description('Name of the community (e.g. cm-ave-demo-template-test1). Also added to the front of community resource names.')
param communityName string = 'cm-saca-hub'
@description('Prefix for the Enclave names (e.g. enc-ave-demo-template-test1)')
param enclaveNamePrefix string = 'enc-saca'
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
// param customCidrRange string = ''

@description('determines what resources to deploy. 6 deploys all resources')
param stage int = 6
@description('Allowed values: Gateway or ExpressRoute')
param transitOptionType string = 'Gateway'
param transitHubName string = 'transit-hub'
@description('Transit Hub scale units')
param scaleUnits int = 2
param remoteVirtualNetworkId string = ''
param location string = resourceGroup().location
@description('Enable/Disable usage telemetry for this template.')
param enableTelemetry bool = true

var uniqueCommunityName = '${communityName}-${uniqueNumber}'
var uniqueEnclaveNamePrefix = '${enclaveNamePrefix}-${uniqueNumber}'

#disable-next-line no-deployments-resources
resource aveTelemetry 'Microsoft.Resources/deployments@2024-03-01' = if (enableTelemetry) {
  name: take(
    'virtualenclaves.ave-saca.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
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

// Community:
resource community 'Microsoft.Mission/communities@2024-06-01-preview' = if (stage >= 1) {
  name: uniqueCommunityName
  location: location
  tags: {
    department: 'CommunityOversightDept'
    company: 'CommunityOversight'
  }
  properties: {
    addressSpace: addressSpace
    dnsServers: dnsServers
  }
}

// Transit Hub:
resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-06-01-preview' = if (stage >= 2) {
  parent: community
  name: transitHubName
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    transitOption: {
      type: transitOptionType
      params: (((transitOptionType == 'Gateway') || (transitOptionType == 'ExpressRoute'))
        ? json('{ scaleUnits: ${scaleUnits} }')
        : json('{ remoteVirtualNetworkId: ${remoteVirtualNetworkId} }'))
    }
  }
}

// Community Endpoint: External
resource communityName_ep_external 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  parent: community
  name: 'external-community-${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'external-community-dataplane'
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
        name: 'external-community-admin-vm'
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
    enclaveIdentity
  ]
}

// Community Endpoint: Bing and Outlook
resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  name: 'bing-outlook-${uniqueNumber}'
  parent: community
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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

// Community Endpoint: Default Portal
resource communityEP_defaultPortal 'Microsoft.Mission/communities/communityEndpoints@2024-06-01-preview' = if (stage >= 2) {
  name: 'defaultPortal'
  parent: community
  location: location
  tags: {
    department: 'CommunityOversightDept'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'defaultPortal1'
        destinationType: 'FQDN'
        destination: '*config.edge.skype.com, *msft.sts.microsoft.com, login.microsoftonline.com, *aadcdn.msftauth.net, *aadcdn.msftauthimages.net, *aadcdn.msauthimages.net, *.logincdn.msftauth.net, login.live.com, *.msauth.net, microsoftonline-p.com, *portal.azure.com, *.hosting.portal.azure.net, *.reactblade.portal.azure.net, management.azure.com, *.ext.azure.com, *.graph.windows.net, *.graph.microsoft.com, *reactblade-rc.portal.azure.net, *reactblade.portal.azure.net, *reactblade-ms.portal.azure.net, afd-v2.hosting-ms.portal.azure.net, *microsoft.com, *azure.com, aka.ms'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal2'
        destinationType: 'FQDN'
        destination: '*.asazure.windows.net, *.azconfig.io, *.aad.azure.com, *.aadconnecthealth.azure.com, ad.azure.com, adf.azure.com, api.aadrm.com, api.loganalytics.io, api.azrbac.mspim.azure.com, *.applicationinsights.azure.com, appservice.azure.com, *.arc.azure.net, asazure.windows.net, bastion.azure.com, batch.azure.com, catalogapi.azure.com, catalogartifact.azureedge.net, changeanalysis.azure.com, cognitiveservices.azure.com, config.office.com, cosmos.azure.com, *.database.windows.net, datalake.azure.net, dev.azure.com, dev.azuresynapse.net'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal3'
        destinationType: 'FQDN'
        destination: 'digitaltwins.azure.net, learn.microsoft.com, elm.iga.azure.com, eventhubs.azure.net, functions.azure.com, gallery.azure.com, go.microsoft.com, help.kusto.windows.net, identitygovernance.azure.com, iga.azure.com, informationprotection.azure.com, kusto.windows.net, logic.azure.com, marketplacedataprovider.azure.com, marketplaceemail.azure.com, media.azure.net, monitor.azure.com, mspim.azure.com, network.azure.com, purview.azure.com, quantum.azure.com, rest.media.azure.net, search.azure.com, servicebus.azure.net, servicebus.windows.net, shell.azure.com'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
      {
        name: 'defaultPortal4'
        destinationType: 'FQDN'
        destination: 'sphere.azure.net, azure.status.microsoft, storage.azure.com, storage.azure.net, vault.azure.net, *.microsoftonline-p.com, *.live.com, *.microsoftonline.com, *.microsoftonlinesupport.net, pfd.phonefactor.net, pfd2.phonefactor.net, css.phonefactor.net, rc.portal.azure.com, *core.windows.net, *login.microsoftonline.com, *.wvd.microsoft.com, *servicebus.windows.net, go.microsoft.com, aka.ms, learn.microsoft.com, privacy.microsoft.com, query.prod.cms.rt.microsoft.com, packages.microsoft.com, graph.microsoft.com, *.azurewebsites.net, *.access.mcas.ms'
        protocols: [
          'HTTPS'
        ]
        port: '443'
      }
    ]
  }
}

// Enclaves
// Enclave: Identity (Tier 0)
resource enclaveIdentity 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-identity'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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

// Enclave: Operations (Tier 1)
resource enclaveOperations 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-operations'
  location: location
  tags: {
    department: 'CommunityOpsDept'
    company: 'CommunityOversight'
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
  }
}

// Enclave: Shared Services (Tier 2)
resource enclaveShared 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-shared'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
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
  }
}

// Enclave: Mission Workload (Tier 3)
resource enclaveMission 'Microsoft.Mission/virtualenclaves@2024-06-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-mission'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      subnetConfigurations: [
        {
          name: 'AzureVirtualEnclaveSubnet'
          networkPrefixSize: 26
        }
        {
          name: 'appSubnet'
          networkPrefixSize: 26
        }
      ]
      allowSubnetCommunication: true
    }
  }
}

// -------------------Workloads-------------------
// Workload: Identity enclave (Tier 0)
resource wl_enclaveIdentity_adds 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-id-ADDS-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Operations enclave (Tier 1)
resource wl_enclaveOperations_operations 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-operations-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveOperations
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Shared enclave (Tier 2)
resource wl_enclaveShared_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-shared-apps-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveShared
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Mission enclave (Tier 3)
resource wl_enclaveMission_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-06-01-preview' = if (stage >= 5) {
  name: 'wl-mission-apps-${uniqueNumber}-${substring(uniqueString(deployment().name, location), 0, 4)}'
  parent: enclaveMission
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
}

// Enclave Endpoint: Identity enclave ADDS 
resource enclaveIdentity_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-06-01-preview' = if (stage >= 4) {
  name: 'ep-ADDS'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'ADDS-TCP'
        destination: ((stage >= 4)
          ? filter(enclaveIdentity.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          : null)
        port: '53,88,135,138,139,389,445,464,636,686,3268-3269,5722,9389,49152-65535'
        protocols: [
          'TCP'
        ]
      }
      {
        name: 'ADDS-UDP'
        destination: ((stage >= 4)
          ? filter(enclaveIdentity.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
}

// Connection: Collaboration enclave to external community endpoint
resource enc_con_collab_to_external 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'enc-con-collab-to-external--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 6)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityName_ep_external.id
  }
}

// -------------------defaultPortal Connections-------------------
// Connection: Collaboration enclave to defaultPortal endpoint
resource enc_con_shared_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Operations enclave to defaultPortal endpoint
resource enc_con_operations_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-oper-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveOperations.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveOperations.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Mission enclave to defaultPortal endpoint
resource enc_con_mission_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-mission-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveMission.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveMission.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'appSubnet')[0].addressPrefix
 
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// -------------------Identity Connections-------------------
// Connection: Shared enclave to Identity enclave ADDS endpoint
resource enc_con_shared_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Operations enclave to Identity enclave ADDS endpoint
resource enc_con_operations_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-oper-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveOperations.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveOperations.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Mission enclave to Identity enclave ADDS endpoint
resource enc_con_mission_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-mission-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'mission'
    company: 'TBD'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveMission.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveMission.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// -------------------Bing & Outlook Connections-------------------
// Connection: Shared enclave to Bing&Outlook community endpoint
resource enc_con_shared_to_cm_ep_bingOutlook 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 5) {
  name: 'enc-con-shared-to-cm-ep-bing--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveShared.id
    sourceCidr: ((stage >= 5)
      ? filter(enclaveShared.properties.enclaveVirtualNetwork.subnetConfigurations, s => s.name == 'AzureVirtualEnclaveSubnet')[0].addressPrefix
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
}

// -------------------Transit Hub Connections-------------------
// Connection: Transithub to Identity enclave ADDS endpoint
resource enc_con_external_to_identity_adds 'microsoft.mission/enclaveconnections@2024-06-01-preview' = if (stage >= 6) {
  name: 'enc-con-external-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: communityName_transitHub.id
    sourceCidr: '172.16.18.0/24'
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
  dependsOn: [
    enclaveIdentity
  ]
}
>>>>>>> ef719d68becef2a7ef84bda4a3e27ca1ef8df825
