@description('Nexus Kubernetes cluster name')
param kubernetesClusterName string

@description('Agent pool name')
param agentPoolName string = 'nodepool-2'

@description('Location of the NAKS cluster')
param location string = resourceGroup().location

@description('SSH public keys to be associated with the "clouduser" user')
param sshPublicKey string = ''

@description('Admin username for the cluster')
param adminUsername string = 'azureuser'

@description('Custom location of the NAKS cluster')
param extendedLocation string

@description('Number of nodes in the agent pool')
param agentPoolNodeCount int = 1

@description('VM size of the agent nodes')
param agentVmSku string = 'NC_M4_v1'

@description('L2 networks to connect to the cluster')
param l2NetsToConnect array = []

@description('L3 networks to connect to the cluster')
param l3NetsToConnect array = []

@description('Trunked networks to connect to the cluster')
param trunkedNetsToConnect array = []

@description('Tags to be associated with the resource')
param tags object = {}

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
    }: null
    attachedNetworkConfiguration: {
      l2Networks: l2NetsToConnect
      l3Networks: l3NetsToConnect
      trunkedNetworks: trunkedNetsToConnect
    }
    count: agentPoolNodeCount
    mode: 'User'
    vmSkuName: agentVmSku
    taints: []
    labels: []
    upgradeSettings: {
      maxSurge: '1'
    }
  }
}


