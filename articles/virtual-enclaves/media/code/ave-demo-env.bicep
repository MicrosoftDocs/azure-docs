<<<<<<< HEAD
@description('Name of the community (e.g. cm-ave-demo-template-test1). Also added to the front of community resource names.')
param communityName string = 'cm-ave-demo'
@description('Prefix for the Enclave names (e.g. enc-ave-demo-template-test1)')
param enclaveNamePrefix string = 'enc-ave-demo'
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
param customCidrRange string = ''

@description('determines what resources to deploy. 6 deploys all resources')
param stage int = 6
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
    'virtualenclaves.ave-demo-env.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
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
resource community 'Microsoft.Mission/communities@2024-01-01-preview' = if (stage >= 1) {
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
resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-01-01-preview' = if (stage >= 2) {
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
resource communityName_ep_external 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
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
resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
  name: 'bing-outlook'
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
resource communityEP_defaultPortal 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
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

// Enclave: Identity
resource enclaveIdentity 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
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
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Collaboration
resource enclaveCollab 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-collab'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Desktop
resource enclaveDesktop 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-desktop'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Platform
resource enclavePlatform 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-platform'
  location: location
  tags: {
    department: 'platforms'
    company: 'PrimeContractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Weapon
resource enclaveWeapon 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-weapon'
  location: location
  tags: {
    department: 'PewPewDept'
    company: 'WeaponContractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: SubKtr
resource enclaveSubKtr 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-subktr'
  location: location
  tags: {
    department: 'SoftwareDevDept'
    company: 'Subcontractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Cyber
resource enclaveCyber 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-cyber'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Offline
resource enclaveOffline 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-offline'
  location: location
  tags: {
    department: 'SensitiveDataDept'
    company: 'R&D_Collaboration'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// -------------------Workloads-------------------
// Workload: Identity enclave
resource wl_enclaveIdentity_adds 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-id-ADDS-${uniqueNumber}'
  parent: enclaveIdentity
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-id-ADDS-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Desktop enclave
resource wl_enclaveDesktop_desktop 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-desktops-${uniqueNumber}'
  parent: enclaveDesktop
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-desktops-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Collab enclave
resource wl_enclaveCollab_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-collab-apps-${uniqueNumber}'
  parent: enclaveCollab
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-collab-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Platform enclave
resource wl_enclavePlatform_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-platform-apps-${uniqueNumber}'
  parent: enclavePlatform
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-platform-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
}

// Workload: Weapon enclave
resource wl_enclaveWeapon_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-weapon-apps-${uniqueNumber}'
  parent: enclaveWeapon
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-weapon-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
}

// Workload: SubKtr enclave
resource wl_enclaveSubKtr_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-subktr-apps-${uniqueNumber}'
  parent: enclaveSubKtr
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-subktr-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
}

// Workload: Cyber enclave
resource wl_enclaveCyber_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-cyber-apps-${uniqueNumber}'
  parent: enclaveCyber
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-cyber-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Offline enclave
resource wl_enclaveOffline_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-offline-apps-${uniqueNumber}'
  parent: enclaveOffline
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-offline-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'senstiveDataDept'
    company: 'R&D_Collaboration'
  }
}

// Enclave Endpoint: Identity enclave ADDS 
resource enclaveIdentity_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
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
          ? cidrSubnet(
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
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
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Platform to Weapon
resource ep_enclavePlatform_from_weapon 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-platform-from-weapon'
  parent: enclavePlatform
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-platform'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Weapon from Platform
resource ep_enclaveWeapon_from_platform 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-from-platform'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-weapon'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Weapon from SubKtr
resource ep_enclaveWeapon_from_subktr 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-from-subktr'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-weapon'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: SubKtr from Weapon
resource ep_enclaveSubKtr_from_weapon 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-subktr-from-weapon'
  parent: enclaveSubKtr
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-subktr'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveIdentity_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-identity-cyber'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveDesktop_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-desktop-cyber'
  parent: enclaveDesktop
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveCollab_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-collab-cyber'
  parent: enclaveCollab
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclavePlatform_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-platform-cyber'
  parent: enclavePlatform
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveWeapon_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-cyber'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveSubKtr_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-subktr-cyber'
  parent: enclaveSubKtr
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Connection: Collaboration enclave to external community endpoint
resource enc_con_collab_to_external 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 6) {
  name: 'enc-con-collab-to-external--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 6)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityName_ep_external.id
  }
}

// -------------------defaultPortal Connections-------------------
// Connection: Collaboration enclave to defaultPortal endpoint
resource enc_con_collab_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Desktop enclave to defaultPortal endpoint
resource enc_con_desktop_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-desktop-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Platform enclave to defaultPortal endpoint
resource enc_con_platform_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Weapon enclave to defaultPortal endpoint
resource enc_con_weapon_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: SubKtr enclave to defaultPortal endpoint
resource enc_con_subktr_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Cyber enclave to defaultPortal endpoint
resource enc_con_cyber_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// -------------------Identity Connections-------------------
// Connection: Collaboration enclave to Identity enclave ADDS endpoint
resource enc_con_collab_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Desktop enclave to Identity enclave ADDS endpoint
resource enc_con_desktop_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-desktop-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Platform enclave to Identity enclave ADDS endpoint
resource enc_con_platform_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Weapon enclave to Identity enclave ADDS endpoint
resource enc_con_weapon_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: SubKtr enclave to Identity enclave ADDS endpoint
resource enc_con_subktr_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Cyber enclave to Identity enclave ADDS endpoint
resource enc_con_cyber_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// -------------------Cyber Enclave Connections-------------------
// Connection: Cyber enclave to identity endpoint
resource enc_con_cyber_to_identity 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-identity--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveIdentity_cyber.id
  }
}

// Connection: Cyber enclave to desktop endpoint
resource enc_con_cyber_to_desktop 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-desktop--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveDesktop_cyber.id
  }
}

// Connection: Cyber enclave to collab endpoint
resource enc_con_cyber_to_collab 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-collab--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveCollab_cyber.id
  }
}

// Connection: Cyber enclave to platform endpoint
resource enc_con_cyber_to_platform 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-platform--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclavePlatform_cyber.id
  }
}

// Connection: Cyber enclave to weapon endpoint
resource enc_con_cyber_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_cyber.id
  }
}

// Connection: Cyber enclave to SubKtr endpoint
resource enc_con_cyber_to_subktr 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-subktr--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveSubKtr_cyber.id
  }
}

// -------------------Bing & Outlook Connections-------------------
// Connection: Desktop enclave to Bing&Outlook community endpoint
resource enc_con_collab_to_cm_ep_bingOutlook 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-cm-ep-bing--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
}

// -------------------Enclave to Enclave Connections-------------------
// Connection: Platform enclave to Weapon enclave
resource enc_con_platform_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_from_platform.id
  }
}

// Connection: Weapon enclave to Platform enclave
resource enc_con_weapon_to_platform 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-platform--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclavePlatform_from_weapon.id
  }
}

// Connection: Weapon enclave to SubKtr enclave
resource enc_con_weapon_to_subktr 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-subktr--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveSubKtr_from_weapon.id
  }
}

// Connection: SubKtr enclave to Weapon enclave
resource enc_con_subktr_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_from_subktr.id
  }
}

// Connection: Platform enclave to SubKtr enclave


// Connection: Weapon enclave to SubKtr enclave

// -------------------Transit Hub Connections-------------------
// Connection: Transithub to Identity enclave ADDS endpoint
resource enc_con_external_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 6) {
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
@description('Name of the community (e.g. cm-ave-demo-template-test1). Also added to the front of community resource names.')
param communityName string = 'cm-ave-demo'
@description('Prefix for the Enclave names (e.g. enc-ave-demo-template-test1)')
param enclaveNamePrefix string = 'enc-ave-demo'
@description('A integer unique to make the resources unique within the resource group. This enables easier multiple test deployments.')
param uniqueNumber string = '1'
param addressSpace string = '10.0.0.0/16'
param dnsServers array = []
param networkSize string = 'small'
param customCidrRange string = ''

@description('determines what resources to deploy. 6 deploys all resources')
param stage int = 6
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
    'virtualenclaves.ave-demo-env.${replace('-..--..-', '.', '-')}.${substring(uniqueString(deployment().name, location), 0, 4)}',
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
resource community 'Microsoft.Mission/communities@2024-01-01-preview' = if (stage >= 1) {
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
resource communityName_transitHub 'Microsoft.Mission/communities/transitHubs@2024-01-01-preview' = if (stage >= 2) {
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
resource communityName_ep_external 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
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
resource communityName_bing_outlook 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
  name: 'bing-outlook'
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
resource communityEP_defaultPortal 'Microsoft.Mission/communities/communityEndpoints@2024-01-01-preview' = if (stage >= 2) {
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

// Enclave: Identity
resource enclaveIdentity 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
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
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Collaboration
resource enclaveCollab 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-collab'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Desktop
resource enclaveDesktop 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-desktop'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Platform
resource enclavePlatform 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-platform'
  location: location
  tags: {
    department: 'platforms'
    company: 'PrimeContractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Weapon
resource enclaveWeapon 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-weapon'
  location: location
  tags: {
    department: 'PewPewDept'
    company: 'WeaponContractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: SubKtr
resource enclaveSubKtr 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-subktr'
  location: location
  tags: {
    department: 'SoftwareDevDept'
    company: 'Subcontractor'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Cyber
resource enclaveCyber 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-cyber'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// Enclave: Offline
resource enclaveOffline 'Microsoft.Mission/virtualenclaves@2024-01-01-preview' = if (stage >= 3) {
  name: '${uniqueEnclaveNamePrefix}-offline'
  location: location
  tags: {
    department: 'SensitiveDataDept'
    company: 'R&D_Collaboration'
  }
  properties: {
    communityResourceId: community.id
    enclaveVirtualNetwork: {
      networkSize: networkSize
      customCidrRange: customCidrRange
      connectToAzureServices: true
    }
  }
}

// -------------------Workloads-------------------
// Workload: Identity enclave
resource wl_enclaveIdentity_adds 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-id-ADDS-${uniqueNumber}'
  parent: enclaveIdentity
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-id-ADDS-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Desktop enclave
resource wl_enclaveDesktop_desktop 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-desktops-${uniqueNumber}'
  parent: enclaveDesktop
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-desktops-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Collab enclave
resource wl_enclaveCollab_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-collab-apps-${uniqueNumber}'
  parent: enclaveCollab
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-collab-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Platform enclave
resource wl_enclavePlatform_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-platform-apps-${uniqueNumber}'
  parent: enclavePlatform
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-platform-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
}

// Workload: Weapon enclave
resource wl_enclaveWeapon_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-weapon-apps-${uniqueNumber}'
  parent: enclaveWeapon
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-weapon-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
}

// Workload: SubKtr enclave
resource wl_enclaveSubKtr_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-subktr-apps-${uniqueNumber}'
  parent: enclaveSubKtr
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-subktr-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
}

// Workload: Cyber enclave
resource wl_enclaveCyber_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-cyber-apps-${uniqueNumber}'
  parent: enclaveCyber
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-cyber-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
}

// Workload: Offline enclave
resource wl_enclaveOffline_apps 'Microsoft.Mission/virtualEnclaves/workloads@2024-01-01-preview' = if (stage >= 5) {
  name: 'wl-offline-apps-${uniqueNumber}'
  parent: enclaveOffline
  properties: {
    managedResourceGroupConfiguration: {
      name: 'wl-offline-apps-${uniqueNumber}'
      location: location
    }
  }
  location: location
  tags: {
    department: 'senstiveDataDept'
    company: 'R&D_Collaboration'
  }
}

// Enclave Endpoint: Identity enclave ADDS 
resource enclaveIdentity_endpointName_1_v2 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
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
          ? cidrSubnet(
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
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
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '53,389'
        protocols: [
          'UDP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Platform to Weapon
resource ep_enclavePlatform_from_weapon 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-platform-from-weapon'
  parent: enclavePlatform
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-platform'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Weapon from Platform
resource ep_enclaveWeapon_from_platform 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-from-platform'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-weapon'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Weapon from SubKtr
resource ep_enclaveWeapon_from_subktr 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-from-subktr'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-weapon'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: SubKtr from Weapon
resource ep_enclaveSubKtr_from_weapon 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-subktr-from-weapon'
  parent: enclaveSubKtr
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'inbound-to-subktr'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveIdentity_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-identity-cyber'
  parent: enclaveIdentity
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveIdentity.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveDesktop_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-desktop-cyber'
  parent: enclaveDesktop
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveCollab_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-collab-cyber'
  parent: enclaveCollab
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclavePlatform_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-platform-cyber'
  parent: enclavePlatform
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveWeapon_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-weapon-cyber'
  parent: enclaveWeapon
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Enclave Endpoint: Cyber inbound
resource ep_enclaveSubKtr_cyber 'Microsoft.Mission/virtualEnclaves/enclaveEndpoints@2024-01-01-preview' = if (stage >= 4) {
  name: 'ep-subktr-cyber'
  parent: enclaveSubKtr
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    ruleCollection: [
      {
        name: 'cyber-inbound'
        destination: ((stage >= 4)
          ? cidrSubnet(
              reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace,
              29,
              0
            )
          : null)
        port: '443'
        protocols: [
          'TCP'
        ]
      }
    ]
  }
}

// Connection: Collaboration enclave to external community endpoint
resource enc_con_collab_to_external 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 6) {
  name: 'enc-con-collab-to-external--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 6)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityName_ep_external.id
  }
}

// -------------------defaultPortal Connections-------------------
// Connection: Collaboration enclave to defaultPortal endpoint
resource enc_con_collab_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Desktop enclave to defaultPortal endpoint
resource enc_con_desktop_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-desktop-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Platform enclave to defaultPortal endpoint
resource enc_con_platform_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Weapon enclave to defaultPortal endpoint
resource enc_con_weapon_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: SubKtr enclave to defaultPortal endpoint
resource enc_con_subktr_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// Connection: Cyber enclave to defaultPortal endpoint
resource enc_con_cyber_to_defaultPortal_cm_ep 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-defaultPortal--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityEP_defaultPortal.id
  }
}

// -------------------Identity Connections-------------------
// Connection: Collaboration enclave to Identity enclave ADDS endpoint
resource enc_con_collab_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCollab.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCollab.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Desktop enclave to Identity enclave ADDS endpoint
resource enc_con_desktop_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-desktop-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Platform enclave to Identity enclave ADDS endpoint
resource enc_con_platform_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Weapon enclave to Identity enclave ADDS endpoint
resource enc_con_weapon_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: SubKtr enclave to Identity enclave ADDS endpoint
resource enc_con_subktr_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// Connection: Cyber enclave to Identity enclave ADDS endpoint
resource enc_con_cyber_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-identity-adds--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: enclaveIdentity_endpointName_1_v2.id
  }
}

// -------------------Cyber Enclave Connections-------------------
// Connection: Cyber enclave to identity endpoint
resource enc_con_cyber_to_identity 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-identity--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveIdentity_cyber.id
  }
}

// Connection: Cyber enclave to desktop endpoint
resource enc_con_cyber_to_desktop 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-desktop--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveDesktop_cyber.id
  }
}

// Connection: Cyber enclave to collab endpoint
resource enc_con_cyber_to_collab 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-collab--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveCollab_cyber.id
  }
}

// Connection: Cyber enclave to platform endpoint
resource enc_con_cyber_to_platform 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-platform--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclavePlatform_cyber.id
  }
}

// Connection: Cyber enclave to weapon endpoint
resource enc_con_cyber_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_cyber.id
  }
}

// Connection: Cyber enclave to SubKtr endpoint
resource enc_con_cyber_to_subktr 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-cyber-to-subktr--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveCyber.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveCyber.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveSubKtr_cyber.id
  }
}

// -------------------Bing & Outlook Connections-------------------
// Connection: Desktop enclave to Bing&Outlook community endpoint
resource enc_con_collab_to_cm_ep_bingOutlook 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-collab-to-cm-ep-bing--${uniqueNumber}'
  location: location
  tags: {
    department: 'CommunitySharedServices'
    company: 'CommunityOversight'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveDesktop.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveDesktop.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: communityName_bing_outlook.id
  }
}

// -------------------Enclave to Enclave Connections-------------------
// Connection: Platform enclave to Weapon enclave
resource enc_con_platform_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-platform-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'platforms'
    company: 'primeContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclavePlatform.id
    sourceCidr: ((stage >= 5)
      ? reference(enclavePlatform.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_from_platform.id
  }
}

// Connection: Weapon enclave to Platform enclave
resource enc_con_weapon_to_platform 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-platform--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclavePlatform_from_weapon.id
  }
}

// Connection: Weapon enclave to SubKtr enclave
resource enc_con_weapon_to_subktr 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-weapon-to-subktr--${uniqueNumber}'
  location: location
  tags: {
    department: 'pewPewDept'
    company: 'weaponContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveWeapon.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveWeapon.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveSubKtr_from_weapon.id
  }
}

// Connection: SubKtr enclave to Weapon enclave
resource enc_con_subktr_to_weapon 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 5) {
  name: 'enc-con-subktr-to-weapon--${uniqueNumber}'
  location: location
  tags: {
    department: 'softwareDevDept'
    company: 'subContractor'
  }
  properties: {
    communityResourceId: community.id
    sourceResourceId: enclaveSubKtr.id
    sourceCidr: ((stage >= 5)
      ? reference(enclaveSubKtr.id).enclaveAddressSpaces.enclaveAddressSpace
      : null)
    destinationEndpointId: ep_enclaveWeapon_from_subktr.id
  }
}

// Connection: Platform enclave to SubKtr enclave


// Connection: Weapon enclave to SubKtr enclave

// -------------------Transit Hub Connections-------------------
// Connection: Transithub to Identity enclave ADDS endpoint
resource enc_con_external_to_identity_adds 'microsoft.mission/enclaveconnections@2024-01-01-preview' = if (stage >= 6) {
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
