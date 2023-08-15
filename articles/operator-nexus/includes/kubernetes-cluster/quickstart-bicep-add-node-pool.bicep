// Azure Parameters
@description('The name of Nexus Kubernetes cluster')
param kubernetesClusterName string

@description('The Azure region where the cluster is to be deployed')
param location string = resourceGroup().location

@description('The custom location of the Nexus instance')
param extendedLocation string

@description('Tags to be associated with the resource')
param tags object = {}

@description('The username for the administrative account on the cluster')
param adminUsername string = 'azureuser'

@description('The SSH public key that will be associated with the "azureuser" user for secure remote login')
param sshPublicKey string = ''

// Cluster Configuration Parameters
@description('Number of nodes in the agent pool')
param agentPoolNodeCount int = 1

@description('Agent pool name')
param agentPoolName string = 'nodepool-2'

@description('VM size of the agent nodes')
param agentVmSku string = 'NC_M4_v1'

@description('The zones/racks used for placement of the agent pool nodes')
param agentPoolZones array = []
// "string" Example: ["1", "2", "3"]

@description('Agent pool mode')
param agentPoolMode string = 'User'

@description('The configurations for the initial agent pool')
param agentOptions object = {}
// {
//   "hugepagesCount": integer,
//   "hugepagesSize": "2M/1G"
// }

@description('The labels to assign to the nodes in the cluster for identification and organization')
param labels array = []
// {
//   key: 'string'
//   value: 'string'
// }
@description('The taints to apply to the nodes in the cluster to restrict which pods can be scheduled on them')
param taints array = []
// {
//   key: 'string'
//   value: 'string:NoSchedule|PreferNoSchedule|NoExecute'
// }

// Networking Parameters
@description('The Layer 2 networks to connect to the agent pool')
param l2Networks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The Layer 3 networks to connect to the agent pool')
param l3Networks array = []
// {
//   ipamEnabled: 'True/False'
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The trunked networks to connect to the agent pool')
param trunkedNetworks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

resource agentPools 'Microsoft.NetworkCloud/kubernetesClusters/agentPools@2023-05-01-preview' = {
  name: '${kubernetesClusterName}/${kubernetesClusterName}-${agentPoolName}'
  location: location
  tags: tags
  extendedLocation: {
    name: extendedLocation
    type: 'CustomLocation'
  }
  properties: {
    administratorConfiguration: sshPublicKey != '' ? {
      adminUsername: adminUsername
      sshPublicKeys: [
        {
          keyData: sshPublicKey
        }
      ]
    }: {}
    attachedNetworkConfiguration: {
      l2Networks: empty(l2Networks) ? null : l2Networks
      l3Networks: empty(l3Networks) ? null : l3Networks
      trunkedNetworks: empty(trunkedNetworks) ? null : trunkedNetworks
    }
    count: agentPoolNodeCount
    mode: agentPoolMode
    vmSkuName: agentVmSku
    labels: empty(labels) ? null : labels
    taints: empty(taints) ? null : taints
    agentOptions: empty(agentOptions) ? null : agentOptions
    availabilityZones: empty(agentPoolZones) ? null : agentPoolZones
    upgradeSettings: {
      maxSurge: '1'
    }
  }
}

