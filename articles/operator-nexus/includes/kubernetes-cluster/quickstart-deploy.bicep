@description('Nexus Kubernetes cluster name')
param name string

@description('ARM id of the network to be used as the cni network')
param cniNetworkId string

@description('ARM id of the cloud services network')
param cloudServicesNetworkId string

@description('ARM id of the the attached l3 network')
param l3NetworkId string

@description('HybridAKS Kubernetes Version to use')
param kubernetesVersion string = 'v1.24.9'

@description('Location of the NAKS cluster')
param location string = resourceGroup().location

@description('Nexus Kubernetes POD CIDR of the NAKS cluster')
param podCidrs array = [
  '10.244.0.0/16'
]

@description('Nexus Kubernetes POD CIDR of the NAKS cluster')
param serviceCidrs array = [
  '10.96.0.0/16'
]

@description('DNS service IP of the NAKS cluster')
param dnsServiceIp string = '10.96.0.10'

@description('SSH public keys to be associated with the "clouduser" user')
param sshPublicKey array = []

@description('AAD groups object IDs that will be set as cluster admin on the provisioned cluster.')
param adminGroupObjectIds array = []

@description('Tags to be associated with the resource')
param tags object = {}

@description('Custom location of the NAKS cluster')
param extendedLocation string

@description('Admin username for the cluster')
param adminUsername string = 'azureuser'

@description('Number of control plane nodes')
param controlPlaneCount int = 1

@description('SKU of control plane nodes')
param controlPlaneVmSkuName string = 'NC_G2_v1'

@description('Number of workers in the initial agent pool')
param systemPoolNodeCount int = 1

@description('VM size of the worker nodes')
param workerVmSkuName string = 'NC_M4_v1'

resource kubernetescluster 'Microsoft.NetworkCloud/kubernetesClusters@2023-05-01-preview' = {
  name: name
  location: location
  tags: tags
  extendedLocation: {
    name: extendedLocation
    type: 'CustomLocation'
  }
  properties: {
    kubernetesVersion: kubernetesVersion
    aadConfiguration: {
      adminGroupObjectIds: adminGroupObjectIds
    }
    administratorConfiguration: {
      adminUsername: adminUsername
      sshPublicKeys: [for sshKey in sshPublicKey: {
        keyData: sshKey
      }]
    }
    initialAgentPoolConfigurations: [
      {
        name: '${name}-nodepool-1'
        administratorConfiguration: {
          adminUsername: adminUsername
          sshPublicKeys: [for sshKey in sshPublicKey: {
            keyData: sshKey
          }]
        }
        count: systemPoolNodeCount
        vmSkuName: workerVmSkuName
        mode: 'System'
      }
    ]
    controlPlaneNodeConfiguration: {
      administratorConfiguration: {
        adminUsername: adminUsername
        sshPublicKeys: [for sshKey in sshPublicKey: {
          keyData: sshKey
        }]
      }
      count: controlPlaneCount
      vmSkuName: controlPlaneVmSkuName
    }
    networkConfiguration: {
      attachedNetworkConfiguration: {
        l3Networks: [
          {
            networkId: l3NetworkId
            pluginType: 'SRIOV'
            ipamEnabled: 'False'
          }
        ]
      }
      bgpServiceLoadBalancerConfiguration: {
        bgpAdvertisements: []
        bgpPeers: []
        ipAddressPools: []
        fabricPeeringEnabled: 'True'
      }
      cniNetworkId: cniNetworkId
      cloudServicesNetworkId: cloudServicesNetworkId
      dnsServiceIp: dnsServiceIp
      podCidrs: podCidrs
      serviceCidrs: serviceCidrs
    }
  }
}
